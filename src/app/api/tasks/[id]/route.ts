import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getLevelFromTotalXP } from "@/lib/xp";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as any).id;

  const body = await req.json();

  if (body.action === "complete") {
    const task = await prisma.task.findFirst({
      where: { id, userId },
    });
    if (!task) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    if (task.completed) {
      return NextResponse.json({ error: "Already done" }, { status: 400 });
    }

    const char = await prisma.character.findFirst({ where: { userId } });
    if (!char) {
      return NextResponse.json({ error: "No character" }, { status: 404 });
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const last = char.lastActive ? new Date(char.lastActive) : null;
    const lastDay = last
      ? new Date(last.getFullYear(), last.getMonth(), last.getDate())
      : null;

    let newStreak = char.streak;
    if (!lastDay) {
      newStreak = 1;
    } else {
      const diffDays = Math.floor(
        (today.getTime() - lastDay.getTime()) / 86400000
      );
      if (diffDays === 0) {
        // same day
      } else if (diffDays === 1) {
        newStreak = char.streak + 1;
      } else {
        newStreak = 1;
      }
    }

    const newTotalXP = char.totalXP + task.xpReward;
    const { level: newLevel } = getLevelFromTotalXP(newTotalXP);

    const attrKey = task.attribute.toLowerCase() as
      | "intellect"
      | "strength"
      | "vitality"
      | "creativity";

    await prisma.task.update({
      where: { id },
      data: { completed: true, completedAt: now },
    });

    const updateData: any = {
      totalXP: newTotalXP,
      level: newLevel,
      gold: char.gold + task.goldReward,
      streak: newStreak,
      lastActive: now,
    };
    updateData[attrKey] = { increment: 1 };

    const updatedChar = await prisma.character.update({
      where: { userId },
      data: updateData,
    });

    await prisma.activityLog.create({
      data: {
        userId,
        type: "TASK_COMPLETE",
        message: `Completed "${task.title}" (+${task.xpReward} XP)`,
      },
    });

    return NextResponse.json({
      task: { ...task, completed: true },
      character: updatedChar,
      leveledUp: newLevel > char.level,
    });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as any).id;
  await prisma.task.deleteMany({ where: { id, userId } });
  return NextResponse.json({ ok: true });
}
