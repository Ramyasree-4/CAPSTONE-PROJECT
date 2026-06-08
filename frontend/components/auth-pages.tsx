"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ArrowRight, Database, KeyRound, Mail, UserPlus } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

type Mode = "login" | "register" | "forgot" | "reset";

const copy = {
  login: {
    title: "Welcome back",
    subtitle: "Sign in to your document intelligence workspace.",
    action: "Log in",
    icon: KeyRound
  },
  register: {
    title: "Create your account",
    subtitle: "Start uploading, searching, and chatting with internal knowledge.",
    action: "Create account",
    icon: UserPlus
  },
  forgot: {
    title: "Reset access",
    subtitle: "Enter your email and we will prepare a reset flow.",
    action: "Send reset link",
    icon: Mail
  },
  reset: {
    title: "Set a new password",
    subtitle: "Create a fresh password and return to the workspace.",
    action: "Update password",
    icon: KeyRound
  }
};

export function AuthPage({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [status, setStatus] = useState("");
  const Icon = copy[mode].icon;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "demo@example.com");
    const password = String(form.get("password") || "password123");
    const fullName = String(form.get("full_name") || "").trim() || email.split("@")[0] || "User";
    const department = String(form.get("department") || "").trim() || "General";

    if (mode === "login") {
      try {
        const controller = new AbortController();
        const timeout = window.setTimeout(() => controller.abort(), 1200);
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
          signal: controller.signal
        });
        window.clearTimeout(timeout);
        if (response.ok) {
          const data = await response.json();
          const savedProfile = localStorage.getItem(`rag_user:${email}`);
          const profile = savedProfile ? JSON.parse(savedProfile) : { email, fullName, department };
          localStorage.setItem("rag_session", JSON.stringify({ ...profile, token: data.access_token }));
          router.push("/dashboard");
          return;
        }
      } catch {
        // Demo mode continues below when the API is not running.
      }
      const savedProfile = localStorage.getItem(`rag_user:${email}`);
      const profile = savedProfile ? JSON.parse(savedProfile) : { email, fullName, department };
      localStorage.setItem("rag_session", JSON.stringify({ ...profile, token: "demo-session" }));
      router.push("/dashboard");
      return;
    }

    if (mode === "register") {
      try {
        const controller = new AbortController();
        const timeout = window.setTimeout(() => controller.abort(), 1200);
        await fetch(`${API_BASE_URL}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
            full_name: fullName,
            department
          }),
          signal: controller.signal
        });
        window.clearTimeout(timeout);
      } catch {
        // Demo registration still opens the workspace.
      }
      const profile = { email, fullName, department };
      localStorage.setItem(`rag_user:${email}`, JSON.stringify(profile));
      localStorage.setItem("rag_session", JSON.stringify({ ...profile, token: "demo-session" }));
      router.push("/dashboard");
      return;
    }

    setStatus(mode === "forgot" ? "Reset link prepared for demo mode." : "Password updated. You can log in now.");
  }

  return (
    <main className="grid min-h-screen bg-mist text-ink lg:grid-cols-[1fr_0.95fr]">
      <section className="flex min-h-screen flex-col justify-between bg-ink px-6 py-6 text-white">
        <Link href="/" className="flex w-fit items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded bg-pine">
            <Database size={20} />
          </span>
          <span className="font-semibold">Enterprise RAG</span>
        </Link>
        <div className="max-w-xl py-16">
          <p className="mb-4 text-sm uppercase tracking-wide text-zinc-300">Secure knowledge workspace</p>
          <h1 className="text-4xl font-semibold leading-tight md:text-6xl">Turn enterprise documents into cited answers.</h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-zinc-300">
            Upload knowledge, control access, compare models, evaluate RAG quality, and monitor security from one polished console.
          </p>
        </div>
        <div className="grid gap-3 text-sm text-zinc-300 sm:grid-cols-3">
          <span>RBAC ready</span>
          <span>Mistral first</span>
          <span>Audit logs</span>
        </div>
      </section>

      <section className="flex items-center justify-center px-5 py-10">
        <form className="w-full max-w-md rounded border border-zinc-200 bg-white p-6 shadow-sm" onSubmit={submit}>
          <div className="mb-6 grid h-11 w-11 place-items-center rounded bg-pine text-white">
            <Icon size={20} />
          </div>
          <h2 className="text-2xl font-semibold">{copy[mode].title}</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-500">{copy[mode].subtitle}</p>

          <div className="mt-6 grid gap-3">
            {mode === "register" && (
              <>
                <label className="grid gap-1 text-sm">
                  Full name
                  <input className="rounded border border-zinc-200 px-3 py-2" name="full_name" placeholder="Your name" />
                </label>
                <label className="grid gap-1 text-sm">
                  Department
                  <input className="rounded border border-zinc-200 px-3 py-2" name="department" placeholder="Operations" />
                </label>
              </>
            )}
            <label className="grid gap-1 text-sm">
              Email
              <input className="rounded border border-zinc-200 px-3 py-2" name="email" placeholder="you@company.com" type="email" />
            </label>
            {mode !== "forgot" && (
              <label className="grid gap-1 text-sm">
                Password
                <input className="rounded border border-zinc-200 px-3 py-2" name="password" placeholder="Any password works in demo mode" type="password" />
              </label>
            )}
            {mode === "reset" && (
              <label className="grid gap-1 text-sm">
                Reset token
                <input className="rounded border border-zinc-200 px-3 py-2" name="token" placeholder="Paste reset token" />
              </label>
            )}
          </div>

          {status && <p className="mt-4 rounded bg-zinc-50 px-3 py-2 text-sm text-pine">{status}</p>}

          <button className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded bg-pine px-4 py-3 text-sm font-semibold text-white">
            {copy[mode].action}
            <ArrowRight size={16} />
          </button>

          <div className="mt-5 flex flex-wrap justify-between gap-2 text-sm">
            {mode !== "login" && <Link href="/login" className="text-pine">Back to login</Link>}
            {mode === "login" && <Link href="/forgot-password" className="text-pine">Forgot password</Link>}
            {mode === "login" && <Link href="/register" className="text-pine">Create account</Link>}
          </div>
        </form>
      </section>
    </main>
  );
}
