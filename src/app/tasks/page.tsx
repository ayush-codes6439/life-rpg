"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import TaskCard from "@/components/TaskCard";

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

export default function TasksPage() {
  const { status } = useSession();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    attribute: "INTELLECT",
    difficulty: "EASY",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/tasks")
      .then((r) => r.json())
      .then((t) => {
        setTasks(t);
        setLoading(false);
      });
  }, [status]);

  async function addTask(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.title.trim()) return setError("Quest title is required");

    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) return setError("Failed to create quest");
    const task = await res.json();
    setTasks((prev) => [task, ...prev]);
    setForm({
      title: "",
      description: "",
      attribute: "INTELLECT",
      difficulty: "EASY",
    });
    setShowForm(false);
  }

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
    }
  }

  async function deleteTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
  }

  const activeTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between flex-wrap gap-3"
        >
          <div>
            <h1 className="font-serif font-black text-4xl text-amber-900">
              📜 Quest Board
            </h1>
            <p className="text-amber-700 text-sm mt-1">
              Complete quests to earn XP, gold, and level up.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm((v) => !v)}
            className="px-5 py-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-black shadow-lg"
          >
            {showForm ? "✕ Cancel" : "+ New Quest"}
          </motion.button>
        </motion.div>

        <AnimatePresence>
          {showForm && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              onSubmit={addTask}
              className="overflow-hidden"
            >
              <div className="rounded-2xl border-2 border-amber-300 bg-white/90 backdrop-blur p-5 shadow-xl space-y-3">
                {error && (
                  <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm font-semibold">
                    {error}
                  </div>
                )}

                <div>
                  <label className="text-xs uppercase tracking-wider font-bold text-amber-700">
                    Quest Title
                  </label>
                  <input
                    placeholder="e.g. Read 20 pages"
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    className="mt-1 w-full px-3 py-2 rounded-lg border-2 border-amber-200 focus:border-amber-500 outline-none bg-white font-semibold"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider font-bold text-amber-700">
                    Description (optional)
                  </label>
                  <textarea
                    placeholder="Add details..."
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    className="mt-1 w-full px-3 py-2 rounded-lg border-2 border-amber-200 focus:border-amber-500 outline-none bg-white"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs uppercase tracking-wider font-bold text-amber-700">
                      Attribute
                    </label>
                    <select
                      value={form.attribute}
                      onChange={(e) =>
                        setForm({ ...form, attribute: e.target.value })
                      }
                      className="mt-1 w-full px-3 py-2 rounded-lg border-2 border-amber-200 focus:border-amber-500 outline-none bg-white font-semibold"
                    >
                      <option value="INTELLECT">🧠 Intellect</option>
                      <option value="STRENGTH">💪 Strength</option>
                      <option value="VITALITY">❤️ Vitality</option>
                      <option value="CREATIVITY">🎨 Creativity</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-wider font-bold text-amber-700">
                      Difficulty
                    </label>
                    <select
                      value={form.difficulty}
                      onChange={(e) =>
                        setForm({ ...form, difficulty: e.target.value })
                      }
                      className="mt-1 w-full px-3 py-2 rounded-lg border-2 border-amber-200 focus:border-amber-500 outline-none bg-white font-semibold"
                    >
                      <option value="EASY">Easy (+20 XP, +5 gold)</option>
                      <option value="MEDIUM">Medium (+50 XP, +15 gold)</option>
                      <option value="HARD">Hard (+100 XP, +40 gold)</option>
                    </select>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white font-black shadow-lg"
                >
                  ⚔️ Create Quest
                </motion.button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        <section>
          <h2 className="font-serif font-black text-2xl text-amber-900 mb-3">
            🔥 Active ({activeTasks.length})
          </h2>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-24 bg-amber-100 rounded-2xl animate-pulse"
                />
              ))}
            </div>
          ) : activeTasks.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/60 p-8 text-center">
              <div className="text-5xl mb-2">🗺️</div>
              <p className="text-amber-800 font-semibold">
                No active quests. Create your first!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {activeTasks.map((t) => (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    layout
                  >
                    <TaskCard
                      task={t}
                      onComplete={completeTask}
                      onDelete={deleteTask}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>

        {completedTasks.length > 0 && (
          <section>
            <h2 className="font-serif font-black text-2xl text-amber-900 mb-3">
              ✅ Completed ({completedTasks.length})
            </h2>
            <div className="space-y-3">
              {completedTasks.map((t) => (
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
    </>
  );
}
