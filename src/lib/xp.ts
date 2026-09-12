export function xpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}
export function getLevelFromTotalXP(totalXP: number) {
  let level = 1;
  let remaining = totalXP;
  while (remaining >= xpForLevel(level)) {
    remaining -= xpForLevel(level);
    level++;
  }
  return { level, currentXP: remaining, xpNeeded: xpForLevel(level) };
}
export const DIFFICULTY = {
  EASY: { xp: 20, gold: 5 },
  MEDIUM: { xp: 50, gold: 15 },
  HARD: { xp: 100, gold: 40 },
} as const;
export function calcRewards(difficulty: keyof typeof DIFFICULTY) {
  return DIFFICULTY[difficulty];
}
