"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

export default function Confetti({ trigger }: { trigger: number }) {
  useEffect(() => {
    if (trigger === 0) return;
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.7 },
      colors: ["#f59e0b", "#d97706", "#fbbf24", "#fef3c7", "#fb923c"],
    });
  }, [trigger]);

  return null;
}
