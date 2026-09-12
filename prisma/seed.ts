import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const items = [
    { id: "theme_cyberpunk", name: "Cyberpunk Theme", description: "Neon-soaked UI skin", price: 500, category: "THEME", icon: "🌆" },
    { id: "theme_retro", name: "Retro 16-bit Theme", description: "Pixel art vibes", price: 400, category: "THEME", icon: "🕹️" },
    { id: "badge_scholar", name: "Scholar Badge", description: "Shown on profile", price: 200, category: "BADGE", icon: "📚" },
    { id: "badge_warrior", name: "Warrior Badge", description: "For the strong", price: 200, category: "BADGE", icon: "⚔️" },
    { id: "boost_xp", name: "XP Elixir", description: "+50% XP for 1 day", price: 300, category: "BOOST", icon: "🧪" },
  ];
  for (const item of items) {
    await prisma.shopItem.upsert({ where: { id: item.id }, update: item, create: item });
  }
  console.log("✅ Seeded", items.length, "items");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
