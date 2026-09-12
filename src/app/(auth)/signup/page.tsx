"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setError(data.error || "Failed");
    router.push("/login");
  }
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100 p-4">
      <form onSubmit={submit} className="w-full max-w-md bg-white/80 backdrop-blur rounded-2xl shadow-xl p-8 border-2 border-amber-200">
        <h1 className="text-3xl font-bold text-amber-900 mb-2">⚔️ Begin Your Quest</h1>
        <p className="text-amber-700 mb-6 text-sm">Create your hero and start leveling up in real life.</p>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</div>}
        <label className="block mb-3">
          <span className="text-sm font-medium text-amber-900">Email</span>
          <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1 w-full px-3 py-2 rounded-lg border-2 border-amber-200 focus:border-amber-500 outline-none" />
        </label>
        <label className="block mb-3">
          <span className="text-sm font-medium text-amber-900">Hero Name</span>
          <input required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className="mt-1 w-full px-3 py-2 rounded-lg border-2 border-amber-200 focus:border-amber-500 outline-none" />
        </label>
        <label className="block mb-6">
          <span className="text-sm font-medium text-amber-900">Password</span>
          <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="mt-1 w-full px-3 py-2 rounded-lg border-2 border-amber-200 focus:border-amber-500 outline-none" />
        </label>
        <button disabled={loading} className="w-full py-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold transition disabled:opacity-50">
          {loading ? "Forging..." : "Create Hero"}
        </button>
        <p className="text-center text-sm text-amber-700 mt-4">
          Already a hero? <Link href="/login" className="underline font-semibold">Login</Link>
        </p>
      </form>
    </main>
  );
}
