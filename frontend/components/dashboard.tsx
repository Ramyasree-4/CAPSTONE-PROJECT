"use client";

import type { ReactNode } from "react";
import {
  Activity,
  BarChart3,
  CheckCircle2,
  Database,
  FileText,
  Gauge,
  Lock,
  MessageSquare,
  Search,
  Settings,
  Shield,
  Upload,
  Users
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { demoOverview } from "@/lib/api";

const trendData = demoOverview.rag_metrics.faithfulness_trend.map((faithfulness, index) => ({
  name: `W${index + 1}`,
  faithfulness,
  recall: demoOverview.rag_metrics.recall_trend[index],
  hallucination: demoOverview.rag_metrics.hallucination_trend[index]
}));

const usageData = [
  { name: "Mistral", value: 58, color: "#1f5b4f" },
  { name: "GPT-4o", value: 24, color: "#c85c4a" },
  { name: "Groq", value: 12, color: "#6554c0" },
  { name: "Claude", value: 6, color: "#d39b38" }
];

const documents = [
  { name: "Security Handbook.pdf", owner: "Asha Rao", status: "Ready", tags: "security, hr" },
  { name: "Q2 Revenue.csv", owner: "Mika Chen", status: "Indexing", tags: "finance" },
  { name: "Support Playbook.docx", owner: "Noah Kim", status: "Ready", tags: "support" }
];

const users = [
  { name: "Priya Shah", role: "Admin", department: "Operations" },
  { name: "Elena Morris", role: "User", department: "Legal" },
  { name: "Jon Bell", role: "Viewer", department: "Finance" }
];

const navItems = [
  { icon: BarChart3, label: "Analytics" },
  { icon: FileText, label: "Documents" },
  { icon: MessageSquare, label: "Chat" },
  { icon: Users, label: "Users" },
  { icon: Shield, label: "Audit" },
  { icon: Settings, label: "Settings" }
];

export function Dashboard() {
  return (
    <main className="min-h-screen bg-mist text-ink">
      <aside className="fixed left-0 top-0 hidden h-full w-64 border-r border-zinc-200 bg-white px-4 py-5 lg:block">
        <div className="mb-8 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded bg-pine text-white">
            <Database size={20} />
          </div>
          <div>
            <p className="text-sm font-semibold">Enterprise RAG</p>
            <p className="text-xs text-zinc-500">Admin Control Plane</p>
          </div>
        </div>
        <nav className="space-y-1">
          {navItems.map(({ icon: Icon, label }) => (
            <button
              className="flex w-full items-center gap-3 rounded px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-100"
              key={label}
              title={label}
            >
              <Icon size={17} />
              {label}
            </button>
          ))}
        </nav>
      </aside>

      <section className="lg:pl-64">
        <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/95 px-5 py-4 backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold">Enterprise RAG Platform</h1>
              <p className="text-sm text-zinc-500">Documents, retrieval quality, security, and model operations</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="grid h-10 w-10 place-items-center rounded border border-zinc-200 bg-white" title="Search">
                <Search size={18} />
              </button>
              <button className="grid h-10 w-10 place-items-center rounded bg-pine text-white" title="Upload document">
                <Upload size={18} />
              </button>
            </div>
          </div>
        </header>

        <div className="grid gap-5 px-5 py-5">
          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Metric icon={<Users size={18} />} label="Active Users" value="84" accent="bg-pine" />
            <Metric icon={<FileText size={18} />} label="Documents" value="3,420" accent="bg-coral" />
            <Metric icon={<MessageSquare size={18} />} label="Queries" value="18,940" accent="bg-violet" />
            <Metric icon={<Gauge size={18} />} label="Avg Latency" value="1.24s" accent="bg-amber" />
          </section>

          <section className="grid gap-5 xl:grid-cols-[1.4fr_0.8fr]">
            <div className="rounded border border-zinc-200 bg-white p-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-semibold">RAG Quality Trends</h2>
                <CheckCircle2 className="text-pine" size={18} />
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 1]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="faithfulness" stroke="#1f5b4f" strokeWidth={2} />
                    <Line type="monotone" dataKey="recall" stroke="#6554c0" strokeWidth={2} />
                    <Line type="monotone" dataKey="hallucination" stroke="#c85c4a" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded border border-zinc-200 bg-white p-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-semibold">Model Usage</h2>
                <Activity className="text-coral" size={18} />
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={usageData} dataKey="value" nameKey="name" innerRadius={58} outerRadius={92}>
                      {usageData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          <section className="grid gap-5 xl:grid-cols-[1fr_1fr]">
            <Panel title="Document Management" icon={<FileText size={18} />}>
              <div className="mb-3 grid gap-2 md:grid-cols-[1fr_150px_110px]">
                <input className="rounded border border-zinc-200 px-3 py-2 text-sm" placeholder="Search documents" />
                <select className="rounded border border-zinc-200 px-3 py-2 text-sm" defaultValue="recursive">
                  <option value="recursive">Recursive</option>
                  <option value="fixed">Fixed size</option>
                  <option value="semantic">Semantic</option>
                  <option value="sliding_window">Sliding window</option>
                </select>
                <button className="inline-flex items-center justify-center gap-2 rounded bg-pine px-3 py-2 text-sm text-white">
                  <Upload size={16} />
                  Upload
                </button>
              </div>
              <Table rows={documents} columns={["name", "owner", "status", "tags"]} />
            </Panel>

            <Panel title="Ask Internal Documents" icon={<MessageSquare size={18} />}>
              <div className="grid gap-3">
                <textarea
                  className="min-h-24 resize-none rounded border border-zinc-200 px-3 py-2 text-sm"
                  defaultValue="Which controls protect customer data during document retrieval?"
                />
                <div className="flex flex-wrap items-center gap-2">
                  <select className="rounded border border-zinc-200 px-3 py-2 text-sm" defaultValue="mistral:mistral-large-latest">
                    <option value="mistral:mistral-large-latest">Mistral Large</option>
                    <option value="openai:gpt-4o">GPT-4o</option>
                    <option value="gemini:pro">Gemini</option>
                    <option value="groq:llama">Groq Llama</option>
                    <option value="anthropic:claude-3-5-sonnet-latest">Claude Sonnet</option>
                  </select>
                  <button className="inline-flex items-center gap-2 rounded bg-coral px-3 py-2 text-sm text-white">
                    <MessageSquare size={16} />
                    Run Query
                  </button>
                </div>
                <div className="rounded border border-zinc-200 bg-zinc-50 p-3 text-sm leading-6">
                  Customer data is protected through RBAC, encrypted storage, audit logging, sensitive data masking,
                  and prompt-injection screening.
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <span className="rounded bg-white px-2 py-1 text-pine">Security Handbook.pdf · 0.91</span>
                    <span className="rounded bg-white px-2 py-1 text-violet">Support Playbook.docx · 0.84</span>
                  </div>
                </div>
              </div>
            </Panel>
          </section>

          <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
            <Panel title="Users & Roles" icon={<Users size={18} />}>
              <Table rows={users} columns={["name", "role", "department"]} />
            </Panel>
            <Panel title="Evaluation Snapshot" icon={<Shield size={18} />}>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: "Faithful", value: 88 },
                    { name: "Precision", value: 84 },
                    { name: "Recall", value: 80 },
                    { name: "Low Risk", value: 88 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#1f5b4f" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Panel>
          </section>

          <section className="rounded border border-zinc-200 bg-white p-4">
            <div className="mb-3 flex items-center gap-2">
              <Lock size={18} className="text-pine" />
              <h2 className="text-base font-semibold">Security & Audit Stream</h2>
            </div>
            <div className="grid gap-2 text-sm md:grid-cols-3">
              {["User login recorded", "Document upload indexed", "Prompt injection scan passed"].map((item) => (
                <div className="rounded border border-zinc-200 bg-zinc-50 px-3 py-2" key={item}>
                  {item}
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

function Metric({ icon, label, value, accent }: { icon: ReactNode; label: string; value: string; accent: string }) {
  return (
    <div className="rounded border border-zinc-200 bg-white p-4">
      <div className={`mb-4 grid h-9 w-9 place-items-center rounded text-white ${accent}`}>{icon}</div>
      <p className="text-sm text-zinc-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function Panel({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded border border-zinc-200 bg-white p-4">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-pine">{icon}</span>
        <h2 className="text-base font-semibold">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Table({ rows, columns }: { rows: Record<string, string>[]; columns: string[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[520px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-zinc-200 text-left text-xs uppercase text-zinc-500">
            {columns.map((column) => (
              <th className="px-2 py-2 font-medium" key={column}>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr className="border-b border-zinc-100" key={`${row.name}-${index}`}>
              {columns.map((column) => (
                <td className="px-2 py-3" key={column}>
                  {row[column]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
