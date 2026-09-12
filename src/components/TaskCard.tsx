"use client";

import { motion } from "framer-motion";

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description?: string | null;
    attribute: string;
    difficulty: string;
    xpReward: number;
    goldReward: number;
    completed: boolean;
  };
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

const ATTR_ICONS: Record<string, string> = {
  INTELLECT: "🧠",
  STRENGTH: "💪",
  VITALITY: "❤️",
  CREATIVITY: "🎨",
};

const ATTR_COLORS: Record<string, string> = {
  INTELLECT: "from-blue-400 to-indigo-500",
  STRENGTH: "from-red-400 to-rose-500",
  VITALITY: "from-pink-400 to-red-500",
  CREATIVITY: "from-purple-400 to-fuchsia-500",
};

const DIFF_COLORS: Record<string, string> = {
  EASY: "bg-green-100 text-green-800 border-green-300",
  MEDIUM: "bg-yellow-100 text-yellow-800 border-yellow-300",
  HARD: "bg-red-100 text-red-800 border-red-300",
};

export default function TaskCard({
  task,
  onComplete,
  onDelete,
}: TaskCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`relative overflow-hidden rounded-2xl border-2 border-amber-200 bg-white/90 backdrop-blur p-4 shadow-lg transition ${
        task.completed ? "opacity-60" : ""
      }`}
    >
      <div
        className={`absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b ${
          ATTR_COLORS[task.attribute] || "from-amber-400 to-orange-500"
        }`}
      />

      <div className="pl-2 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          <div
            className={`w-11 h-11 rounded-xl bg-gradient-to-br ${
              ATTR_COLORS[task.attribute] || "from-amber-400 to-orange-500"
            } flex items-center justify-center text-xl shadow-md shrink-0`}
          >
            {ATTR_ICONS[task.attribute] || "⚔️"}
          </div>
          <div className="flex-1 min-w-0">
            <h3
              className={`font-bold text-amber-900 truncate ${
                task.completed ? "line-through" : ""
              }`}
            >
              {task.title}
            </h3>
            {task.description && (
              <p className="text-sm text-amber-700 mt-0.5 line-clamp-2">
                {task.description}
              </p>
            )}
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span
                className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                  DIFF_COLORS[task.difficulty]
                } uppercase tracking-wider`}
              >
                {task.difficulty}
              </span>
              <span className="text-xs font-bold text-amber-800">
                ✨ {task.xpReward} XP
              </span>
              <span className="text-xs font-bold text-amber-800">
                🪙 {task.goldReward}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 shrink-0">
          {!task.completed && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onComplete(task.id)}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-xs font-black shadow-md"
            >
              ✓ Complete
            </motion.button>
          )}
          <button
            onClick={() => onDelete(task.id)}
            className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold border border-red-200"
          >
            Delete
          </button>
        </div>
      </div>
    </motion.div>
  );
}
