"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Confetti from "@/components/Confetti";

interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  icon: string;
}

export default function ShopPage() {
  const { status } = useSession();
  const router = useRouter();
  const [items, setItems] = useState<ShopItem[]>([]);
  const [gold, setGold] = useState(0);
  const [owned, setOwned] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [confettiTrigger, setConfettiTrigger] = useState(0);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    Promise.all([
      fetch("/api/shop").then((r) => r.json()),
      fetch("/api/character").then((r) => r.json()),
    ]).then(([i, c]) => {
      setItems(i);
      setGold(c.gold);
      setLoading(false);
    });
  }, [status]);

  async function buy(itemId: string) {
    setMessage("");
    const res = await fetch("/api/shop", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(`❌ ${data.error}`);
      return;
    }
    setGold(data.character.gold);
    setOwned((prev) => [...prev, itemId]);
    setConfettiTrigger((c) => c + 1);
    setMessage(`✅ Purchased ${data.item.name}!`);
  }

  return (
    <>
      <Confetti trigger={confettiTrigger} />
      <Navbar />
      <main className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between flex-wrap gap-3"
        >
          <div>
            <h1 className="font-serif font-black text-4xl text-amber-900">
              🛒 Merchant's Shop
            </h1>
            <p className="text-amber-700 text-sm mt-1">
              Spend your hard-earned gold on themes and badges.
            </p>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="px-6 py-3 rounded-2xl bg-gradient-to-br from-yellow-300 to-amber-500 shadow-lg border-2 border-amber-600"
          >
            <div className="text-xs uppercase tracking-widest text-amber-900 font-bold text-center">
              Gold
            </div>
            <div className="text-2xl font-black text-amber-900 text-center">
              🪙 {gold}
            </div>
          </motion.div>
        </motion.div>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-3 rounded-xl font-semibold text-sm ${
              message.startsWith("✅")
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {message}
          </motion.div>
        )}

        {loading ? (
          <div className="grid md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-40 bg-amber-100 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {items.map((item, i) => {
              const isOwned = owned.includes(item.id);
              const canAfford = gold >= item.price;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -4 }}
                  className="relative overflow-hidden rounded-2xl border-2 border-amber-300 bg-white/90 backdrop-blur p-5 shadow-lg"
                >
                  <div className="text-5xl mb-2">{item.icon}</div>
                  <h3 className="font-black text-lg text-amber-900">
                    {item.name}
                  </h3>
                  <p className="text-sm text-amber-700 mb-3">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-black text-amber-800 text-lg">
                      🪙 {item.price}
                    </span>
                    <span className="text-[10px] px-2 py-1 rounded-full bg-amber-100 text-amber-800 font-black uppercase tracking-wider">
                      {item.category}
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: isOwned ? 1 : 1.03 }}
                    whileTap={{ scale: isOwned ? 1 : 0.97 }}
                    disabled={isOwned || !canAfford}
                    onClick={() => buy(item.id)}
                    className={`mt-4 w-full py-3 rounded-xl font-black shadow-md transition ${
                      isOwned
                        ? "bg-green-100 text-green-800 cursor-default"
                        : canAfford
                        ? "bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {isOwned
                      ? "✓ Owned"
                      : canAfford
                      ? "Buy Now"
                      : "Not enough gold"}
                  </motion.button>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
