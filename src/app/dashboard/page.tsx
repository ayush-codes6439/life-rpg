"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import XPBar from "@/components/XPBar";
import TaskCard from "@/components/TaskCard";
import LevelUpModal from "@/components/LevelUpModal";
import Confetti from "@/components/Confetti";
import { getLevelFromTotalXP } from "@/lib/xp";

interface Character {
  level: number;
  totalXP: number;
  gold: number;
  intellect: number;
  strength: number;
  vitality: number;
  creativity: number;
  streak: number;
}

interface Task {
  id: string;
  title: string;
  description?: string | null;
  attribute: string;
  difficulty: string;
  xpReward: number;
  goldReward: number;
  completed: boolean;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [character, setCharacter] = useState<Character | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [leveledUp, setLeveledUp] = useState<number | null>(null);
  const [confettiTrigger, setConfettiTrigger] = useState(0);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    Promise.all([
      fetch("/api/character").then((r) => r.json()),
      fetch("/api/tasks").then((r) => r.json()),
    ])
      .then(([c, t]) => {
        setCharacter(c);
        setTasks(t);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [status]);

  async function completeTask(id: string) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: true } : t))
    );
    const res = await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "complete" }),
    });
    if (!res.ok) {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: false } : t))
      );
      return;
    }
    const data = await res.json();
    setCharacter(data.character);
    setConfettiTrigger((c) => c + 1);
    if (data.leveledUp) setLeveledUp(data.character.level);
  }

  async function deleteTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
  }

  if (loading || !character) {
    return (
      <>
        <Navbar />
        <main className="max-w-5xl mx-auto p-6 space-y-6">
          <div className="animate-pulse space-y-4">
            <div className="h-40 bg-amber-100 rounded-3xl" />
            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-28 bg-amber-100 rounded-2xl" />
              ))}
            </div>
          </div>
        </main>
      </>
    );
  }

  const { level } = getLevelFromTotalXP(character.totalXP);
  const activeTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  const stats = [
    {
      label: "Intellect",
      value: character.intellect,
      icon: "🧠",
      color: "from-blue-400 to-indigo-500",
    },
    {
      label: "Strength",
      value: character.strength,
      icon: "💪",
      color: "from-red-400 to-rose-500",
    },
    {
      label: "Vitality",
      value: character.vitality,
      icon: "❤️",
      color: "from-pink-400 to-red-500",
    },
    {
      label: "Creativity",
      value: character.creativity,
      icon: "🎨",
      color: "from-purple-400 to-fuchsia-500",
    },
  ];

  return (
    <>
      <Confetti trigger={confettiTrigger} />
      <Navbar />
      <main className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl border-2 border-amber-300 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 shadow-2xl"
        >
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-amber-300/40 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-orange-300/30 blur-3xl" />

          <div className="relative p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="relative w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 p-1 shadow-xl"
                >
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-4xl">
                    ⚔️
                  </div>
                </motion.div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-amber-600 font-bold">
                    Hero
                  </div>
                  <h1 className="font-serif font-black text-3xl sm:text-4xl text-amber-900">
                    {session?.user?.name}
                  </h1>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-xs font-bold">
                      ⭐ Level {level}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-200 text-orange-900 text-xs font-bold">
                      🔥 {character.streak} day streak
                    </span>
                  </div>
                </div>
              </div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="px-6 py-3 rounded-2xl bg-gradient-to-br from-yellow-300 to-amber-500 shadow-lg border-2 border-amber-600"
              >
                <div className="text-xs uppercase tracking-widest text-amber-900 font-bold text-center">
                  Gold
                </div>
                <div className="text-3xl font-black text-amber-900 text-center flex items-center gap-2">
                  🪙 {character.gold}
                </div>
              </motion.div>
            </div>

            <div className="mt-6">
              <XPBar totalXP={character.totalXP} />
            </div>
          </div>
        </motion.section>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              whileHover={{ y: -4, scale: 1.03 }}
              className="relative overflow-hidden rounded-2xl border-2 border-amber-200 bg-white/80 backdrop-blur p-4 shadow-lg"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${s.color} opacity-10`}
              />
              <div className="relative text-center">
                <div className="text-4xl mb-1">{s.icon}</div>
                <div className="text-3xl font-black text-amber-900">
                  {s.value}
                </div>
                <div className="text-xs uppercase tracking-wider text-amber-700 font-bold">
                  {s.label}
                </div>
              </div>
            </motion.div>
          ))}
        </section>

        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-serif font-black text-2xl text-amber-900">
              📜 Active Quests
            </h2>
            <a
              href="/tasks"
              className="text-sm font-bold text-amber-700 hover:text-amber-900 underline"
            >
              View all →
            </a>
          </div>
          {activeTasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/60 p-8 text-center"
            >
              <div className="text-5xl mb-2">🗺️</div>
              <p className="text-amber-800 font-semibold">No active quests</p>
              <a
                href="/tasks"
                className="inline-block mt-3 px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm"
              >
                + Add your first quest
              </a>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {activeTasks.slice(0, 5).map((t, i) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <TaskCard
                    task={t}
                    onComplete={completeTask}
                    onDelete={deleteTask}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {completedTasks.length > 0 && (
          <section>
            <h2 className="font-serif font-black text-2xl text-amber-900 mb-3">
              ✅ Completed ({completedTasks.length})
            </h2>
            <div className="space-y-3">
              {completedTasks.slice(0, 3).map((t) => (
                <TaskCard
                  key={t.id}
                  task={t}
                  onComplete={completeTask}
                  onDelete={deleteTask}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      {leveledUp !== null && (
        <LevelUpModal level={leveledUp} onClose={() => setLeveledUp(null)} />
      )}
    </>
  );
}
