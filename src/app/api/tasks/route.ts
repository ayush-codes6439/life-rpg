import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { calcRewards } from "@/lib/xp";

const createSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  attribute: z.enum(["INTELLECT", "STRENGTH", "VITALITY", "CREATIVITY"]),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;
  const tasks = await prisma.task.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(tasks);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const { xp, gold } = calcRewards(parsed.data.difficulty);
  const task = await prisma.task.create({
    data: { ...parsed.data, userId, xpReward: xp, goldReward: gold },
  });
  return NextResponse.json(task, { status: 201 });
}
