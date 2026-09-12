import Link from "next/link";
export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-6xl md:text-7xl font-serif font-black text-amber-900 mb-4">⚔️ Life RPG</h1>
      <p className="text-xl text-amber-800 mb-2 max-w-2xl">Turn your real-world tasks into an epic quest.</p>
      <p className="text-amber-700 mb-10 max-w-xl">Earn XP, level up, build streaks, and unlock rewards — one task at a time.</p>
      <div className="flex gap-4 flex-wrap justify-center">
        <Link href="/signup" className="btn-rpg px-8 py-4 rounded-xl text-white font-bold text-lg">Begin Your Quest</Link>
        <Link href="/login" className="px-8 py-4 rounded-xl bg-white border-2 border-amber-600 text-amber-800 font-bold text-lg hover:bg-amber-50">Enter Realm</Link>
      </div>
    </main>
  );
}
