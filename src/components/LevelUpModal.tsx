"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

export default function LevelUpModal({
  level,
  onClose,
}: {
  level: number;
  onClose: () => void;
}) {
  useEffect(() => {
    const duration = 2000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 8,
        angle: 60,
        spread: 70,
        origin: { x: 0 },
        colors: ["#f59e0b", "#d97706", "#fbbf24"],
      });
      confetti({
        particleCount: 8,
        angle: 120,
        spread: 70,
        origin: { x: 1 },
        colors: ["#f59e0b", "#d97706", "#fbbf24"],
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, []);

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative max-w-md w-full rounded-3xl border-4 border-amber-400 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 p-10 text-center shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-amber-300/40 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-orange-300/40 blur-3xl" />

        <div className="relative">
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
            className="text-8xl mb-4"
          >
            🎉
          </motion.div>
          <h2 className="font-serif font-black text-5xl text-amber-900 mb-2">
            LEVEL UP!
          </h2>
          <p className="text-amber-800 text-lg mb-6">
            You reached{" "}
            <span className="font-black text-2xl">Level {level}</span>
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="px-8 py-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-black shadow-lg"
          >
            ⚔️ Continue Quest
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
