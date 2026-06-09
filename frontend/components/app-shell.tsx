"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Database, LogOut, Menu, Search, X } from "lucide-react";
import { advancedNav, adminNav, appNav } from "@/lib/navigation";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [displayName, setDisplayName] = useState("User");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const rawSession = localStorage.getItem("rag_session");
    if (!rawSession) return;
    try {
      const session = JSON.parse(rawSession);
      setDisplayName(session.fullName || session.email || "User");
    } catch {
      setDisplayName("User");
    }
  }, []);

  function logout() {
    localStorage.removeItem("rag_session");
    router.push("/login");
  }

  return (
    <main className="min-h-screen bg-mist text-ink">
      <aside className="fixed left-0 top-0 z-30 hidden h-full w-72 overflow-y-auto border-r border-zinc-200 bg-white px-4 py-5 lg:block">
        <Sidebar pathname={pathname} />
      </aside>
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={() => setMenuOpen(false)}>
          <aside className="h-full w-80 max-w-[86vw] overflow-y-auto bg-white px-4 py-5 shadow-xl" onClick={(event) => event.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-semibold">Navigation</span>
              <button className="grid h-9 w-9 place-items-center rounded border border-zinc-200" onClick={() => setMenuOpen(false)} title="Close menu">
                <X size={17} />
              </button>
            </div>
            <Sidebar pathname={pathname} />
          </aside>
        </div>
      )}

      <section className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/95 px-4 py-3 backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button className="grid h-10 w-10 place-items-center rounded border border-zinc-200 lg:hidden" onClick={() => setMenuOpen(true)} title="Menu">
                <Menu size={18} />
              </button>
              <div className="hidden items-center gap-2 rounded border border-zinc-200 bg-zinc-50 px-3 py-2 md:flex">
                <Search size={16} className="text-zinc-500" />
                <span className="text-sm text-zinc-500">Search documents, queries, users</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link className="rounded border border-zinc-200 px-3 py-2 text-sm" href="/profile">
                {displayName}
              </Link>
              <button className="grid h-10 w-10 place-items-center rounded bg-ink text-white" onClick={logout} title="Log out">
                <LogOut size={17} />
              </button>
            </div>
          </div>
        </header>
        {children}
      </section>
    </main>
  );
}

function Sidebar({ pathname }: { pathname: string }) {
  return (
    <>
      <Link href="/dashboard" className="mb-7 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded bg-pine text-white">
          <Database size={20} />
        </div>
        <div>
          <p className="text-sm font-semibold">Enterprise RAG</p>
          <p className="text-xs text-zinc-500">Workspace</p>
        </div>
      </Link>

      <NavGroup title="User" items={appNav} pathname={pathname} />
      <NavGroup title="Admin" items={adminNav} pathname={pathname} />
      <NavGroup title="Advanced" items={advancedNav} pathname={pathname} />
    </>
  );
}

function NavGroup({
  title,
  items,
  pathname
}: {
  title: string;
  items: { href: string; label: string; icon: React.ElementType }[];
  pathname: string;
}) {
  return (
    <div className="mb-5">
      <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-zinc-400">{title}</p>
      <nav className="space-y-1">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              className={`flex items-center gap-3 rounded px-3 py-2 text-sm ${
                active ? "bg-pine text-white" : "text-zinc-700 hover:bg-zinc-100"
              }`}
              href={href}
              key={href}
            >
              <Icon size={17} />
              {label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
