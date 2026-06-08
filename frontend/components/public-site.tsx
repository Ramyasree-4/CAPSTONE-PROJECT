import Link from "next/link";

const features = [
  { title: "Document intelligence", text: "Upload, tag, search, version, and cite enterprise knowledge.", mark: "01" },
  { title: "Mistral-first RAG", text: "Use Mistral by default with OpenAI, Groq, and Claude fallbacks.", mark: "02" },
  { title: "Admin control", text: "Manage users, roles, analytics, feedback, audit logs, and security events.", mark: "03" },
  { title: "Quality metrics", text: "Track faithfulness, precision, recall, hallucination risk, latency, and cost.", mark: "04" }
];

export function LandingPage() {
  return (
    <main className="bg-mist text-ink">
      <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/95 px-5 py-4 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded bg-pine text-white">R</span>
            <span className="font-semibold">Enterprise RAG</span>
          </Link>
          <div className="hidden items-center gap-6 text-sm md:flex">
            <a href="#features">Features</a>
            <a href="#how">How it works</a>
            <a href="#pricing">Pricing</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="flex items-center gap-2">
            <Link className="rounded border border-zinc-200 px-3 py-2 text-sm" href="/login">Login</Link>
            <Link className="rounded bg-pine px-3 py-2 text-sm text-white" href="/register">Sign up</Link>
          </div>
        </nav>
      </header>

      <section className="mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl items-center gap-10 px-5 py-14 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="mb-4 inline-flex rounded bg-white px-3 py-1 text-sm text-pine">Enterprise-grade RAG platform</p>
          <h1 className="max-w-4xl text-5xl font-semibold leading-tight md:text-7xl">Chat with company knowledge, securely and with citations.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600">
            A polished SaaS workspace for document upload, semantic search, admin controls, RAG evaluation, feedback, analytics, and security monitoring.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="inline-flex items-center gap-2 rounded bg-pine px-5 py-3 text-sm font-semibold text-white" href="/register">
              Start free
              <span aria-hidden="true">→</span>
            </Link>
            <Link className="rounded border border-zinc-300 bg-white px-5 py-3 text-sm font-semibold" href="/login">Login demo</Link>
          </div>
        </div>

        <div className="rounded border border-zinc-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3">
            <div className="rounded bg-ink p-5 text-white">
              <div className="mb-10 flex items-center justify-between">
                <span className="text-sm text-zinc-300">RAG Quality</span>
                <span className="rounded bg-pine px-2 py-1 text-xs">Healthy</span>
              </div>
              <p className="text-4xl font-semibold">0%</p>
              <p className="mt-2 text-sm text-zinc-300">Faithfulness appears after evaluations run</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {["0 documents", "0 queries", "$0 cost", "0s latency"].map((item) => (
                <div className="rounded border border-zinc-200 bg-zinc-50 p-4 text-sm" key={item}>{item}</div>
              ))}
            </div>
            <div className="rounded border border-zinc-200 p-4">
              <div className="mb-3 text-sm font-semibold">Ask internal documents</div>
              <p className="text-sm leading-6 text-zinc-600">Which controls protect customer data during retrieval?</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="rounded bg-zinc-100 px-2 py-1">Security Handbook.pdf</span>
                <span className="rounded bg-zinc-100 px-2 py-1">Support Playbook.docx</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="border-y border-zinc-200 bg-white px-5 py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-semibold">Features</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {features.map(({ title, text, mark }) => (
              <div className="rounded border border-zinc-200 p-5" key={title}>
                <span className="mb-5 inline-grid h-9 w-9 place-items-center rounded bg-pine text-sm text-white">{mark}</span>
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="mx-auto max-w-7xl px-5 py-16">
        <h2 className="text-3xl font-semibold">How It Works</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {["Upload documents", "Parse and chunk", "Retrieve context", "Generate cited answers"].map((step, index) => (
            <div className="rounded border border-zinc-200 bg-white p-5" key={step}>
              <span className="text-sm text-pine">Step {index + 1}</span>
              <p className="mt-3 font-semibold">{step}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="border-y border-zinc-200 bg-white px-5 py-16">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
          {["Starter", "Business", "Enterprise"].map((plan, index) => (
            <div className="rounded border border-zinc-200 p-5" key={plan}>
              <h3 className="text-xl font-semibold">{plan}</h3>
              <p className="mt-3 text-3xl font-semibold">{index === 2 ? "Custom" : `$${49 + index * 150}`}</p>
              <p className="mt-3 text-sm text-zinc-600">Role controls, document workflows, analytics, and evaluation dashboards.</p>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="mx-auto grid max-w-7xl gap-6 px-5 py-16 md:grid-cols-[1fr_0.8fr]">
        <div>
          <h2 className="text-3xl font-semibold">Contact</h2>
          <p className="mt-3 max-w-xl text-zinc-600">Bring secure RAG workflows to your organization with admin controls from day one.</p>
        </div>
        <div className="rounded border border-zinc-200 bg-white p-5">
          <div className="mb-3 font-semibold">Ready for secure pilots</div>
          <Link className="inline-flex items-center gap-2 rounded bg-ink px-4 py-3 text-sm text-white" href="/register">
            Create your workspace
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
