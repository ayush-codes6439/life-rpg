import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const items = await prisma.shopItem.findMany();
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as any).id;

  const { itemId } = await req.json();
  const item = await prisma.shopItem.findUnique({ where: { id: itemId } });
  if (!item) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  const char = await prisma.character.findUnique({ where: { userId } });
  if (!char) {
    return NextResponse.json({ error: "No character" }, { status: 404 });
  }
  if (char.gold < item.price) {
    return NextResponse.json({ error: "Not enough gold" }, { status: 400 });
  }

  const owned = await prisma.inventoryItem.findFirst({
    where: { userId, itemId },
  });
  if (owned) {
    return NextResponse.json({ error: "Already owned" }, { status: 400 });
  }

  const [updatedChar] = await prisma.$transaction([
    prisma.character.update({
      where: { userId },
      data: {
        gold: { decrement: item.price },
        ...(item.category === "THEME" ? { theme: item.id } : {}),
      },
    }),
    prisma.inventoryItem.create({ data: { userId, itemId } }),
    prisma.activityLog.create({
      data: {
        userId,
        type: "PURCHASE",
        message: `Purchased ${item.name}`,
      },
    }),
  ]);

  return NextResponse.json({ character: updatedChar, item });
}
