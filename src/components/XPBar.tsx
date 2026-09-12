"use client";

import { motion } from "framer-motion";
import { getLevelFromTotalXP } from "@/lib/xp";

export default function XPBar({ totalXP }: { totalXP: number }) {
  const { level, currentXP, xpNeeded } = getLevelFromTotalXP(totalXP);
  const pct = Math.min(100, (currentXP / xpNeeded) * 100);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-black text-amber-900 uppercase tracking-wider">
          ⭐ Level {level}
        </span>
        <span className="text-sm font-bold text-amber-700">
          {currentXP} / {xpNeeded} XP
        </span>
      </div>
      <div className="relative h-6 rounded-full bg-amber-100 border-2 border-amber-300 overflow-hidden shadow-inner">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 shadow-lg"
        >
          <motion.div
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-y-0 w-16 bg-gradient-to-r from-transparent via-white/60 to-transparent"
          />
        </motion.div>
        <div className="absolute inset-0 flex items-center justify-center text-xs font-black text-amber-900">
          {Math.round(pct)}%
        </div>
      </div>
    </div>
  );
}
