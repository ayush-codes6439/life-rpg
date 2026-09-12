"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "🏰 Dashboard" },
    { href: "/tasks", label: "📜 Quests" },
    { href: "/shop", label: "🛒 Shop" },
  ];

  return (
    <nav className="sticky top-0 z-40 border-b-2 border-amber-300 bg-white/70 backdrop-blur-xl shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-3">
        <Link
          href="/dashboard"
          className="font-serif font-black text-2xl text-amber-900 hover:text-amber-700 transition"
        >
          ⚔️ Life RPG
        </Link>

        <div className="flex items-center gap-1 flex-wrap">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link key={l.href} href={l.href} className="relative">
                {active && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 shadow-md"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span
                  className={`relative px-3 py-2 rounded-lg font-bold text-sm transition ${
                    active ? "text-white" : "text-amber-800 hover:bg-amber-100"
                  }`}
                >
                  {l.label}
                </span>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-amber-800 hidden sm:inline">
            {session?.user?.name}
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => signOut({ callbackUrl: "/" })}
            className="px-3 py-2 rounded-lg bg-gradient-to-br from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white text-sm font-bold shadow-md"
          >
            Logout
          </motion.button>
        </div>
      </div>
    </nav>
  );
}
