"use client";

import Link from "next/link";
import {
  AlertTriangle,
  BarChart3,
  Bot,
  CheckCircle2,
  Clock,
  Database,
  FileText,
  Filter,
  GitBranch,
  HardDrive,
  LineChart,
  MessageSquare,
  PieChart,
  Search,
  Shield,
  SlidersHorizontal,
  Upload,
  Users
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart as RLineChart,
  Pie,
  PieChart as RPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { AppShell } from "@/components/app-shell";
import { quickStats } from "@/lib/navigation";

const trendData = [
  { name: "Mon", queries: 0, latency: 0, cost: 0 },
  { name: "Tue", queries: 0, latency: 0, cost: 0 },
  { name: "Wed", queries: 0, latency: 0, cost: 0 },
  { name: "Thu", queries: 0, latency: 0, cost: 0 },
  { name: "Fri", queries: 0, latency: 0, cost: 0 }
];

const qualityData = [
  { name: "Faithfulness", value: 0, color: "#1f5b4f" },
  { name: "Precision", value: 0, color: "#6554c0" },
  { name: "Recall", value: 0, color: "#c85c4a" },
  { name: "Relevancy", value: 0, color: "#d39b38" }
];

const documents: Record<string, string>[] = [];

const activities: string[] = [];

export function DashboardHome() {
  return (
    <AppShell>
      <PageFrame title="Dashboard" subtitle="Overview statistics, recent activity, and storage usage.">
        <QuickActions />
        <StatsGrid />
        <div className="grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
          <ChartPanel title="Query Volume">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="queries" fill="#1f5b4f" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartPanel>
          <Panel title="Recent Activity">
            <ActivityList items={activities} empty="No recent activity yet. Upload a document or ask a question to start." />
          </Panel>
        </div>
      </PageFrame>
    </AppShell>
  );
}

function QuickActions() {
  const actions = [
    { href: "/documents", label: "My Documents", text: "Search and manage files" },
    { href: "/documents/upload", label: "Upload Document", text: "Add new knowledge" },
    { href: "/chat", label: "AI Chat", text: "Ask document questions" },
    { href: "/queries", label: "Queries", text: "View query analytics" },
    { href: "/search", label: "Search Center", text: "Semantic and hybrid search" },
    { href: "/analytics", label: "Analytics", text: "Usage, cost, and quality" }
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {actions.map((action) => (
        <Link className="rounded border border-zinc-200 bg-white p-4 hover:border-pine hover:shadow-sm" href={action.href} key={action.href}>
          <p className="font-semibold">{action.label}</p>
          <p className="mt-1 text-sm text-zinc-500">{action.text}</p>
        </Link>
      ))}
    </section>
  );
}

export function DocumentsPage() {
  return (
    <AppShell>
      <PageFrame title="My Documents" subtitle="Upload, search, delete, and inspect document details.">
        <Toolbar primary="Upload document" />
        <DataTable rows={documents} columns={["name", "status", "owner", "updated", "size"]} />
      </PageFrame>
    </AppShell>
  );
}

export function UploadDocumentPage() {
  return (
    <AppShell>
      <PageFrame title="Upload Document" subtitle="Add PDF, DOCX, TXT, CSV, or PPTX files to the ingestion pipeline.">
        <div className="grid gap-5 xl:grid-cols-[1fr_0.8fr]">
          <Panel title="Upload">
            <div className="grid min-h-56 place-items-center rounded border border-dashed border-zinc-300 bg-white p-8 text-center">
              <div>
                <Upload className="mx-auto mb-4 text-pine" size={34} />
                <p className="font-semibold">Drop files here or choose from your computer</p>
                <p className="mt-2 text-sm text-zinc-500">Metadata, chunking strategy, and tags can be set before indexing.</p>
                <button className="mt-5 rounded bg-pine px-4 py-2 text-sm text-white">Choose files</button>
              </div>
            </div>
          </Panel>
          <Panel title="Processing Options">
            <FormGrid fields={["Department", "Category", "Tags", "Chunking Strategy"]} />
          </Panel>
        </div>
      </PageFrame>
    </AppShell>
  );
}

export function DocumentDetailPage({ id }: { id: string }) {
  return (
    <AppShell>
      <PageFrame title="Document Details" subtitle={`Metadata, chunks, embeddings status, and citations for ${id}.`}>
        <StatsGrid compact />
        <div className="grid gap-5 xl:grid-cols-2">
          <Panel title="Metadata">
            <KeyValues data={{ Filename: "Security Handbook.pdf", Owner: "Priya Shah", Department: "Security", Status: "Ready", Version: "1" }} />
          </Panel>
          <Panel title="Chunks & Embeddings">
            <ActivityList items={[]} empty="No chunks or embeddings yet. Upload and process this document first." />
          </Panel>
        </div>
      </PageFrame>
    </AppShell>
  );
}

export function ChatPage() {
  return (
    <AppShell>
      <PageFrame title="AI Chat Assistant" subtitle="Ask questions, inspect citations, review context, and choose models.">
        <div className="grid gap-5 xl:grid-cols-[1fr_0.7fr]">
          <Panel title="Ask Questions">
            <textarea className="min-h-32 w-full resize-none rounded border border-zinc-200 px-3 py-2 text-sm" defaultValue="Which controls protect customer data during document retrieval?" />
            <div className="mt-3 flex flex-wrap gap-2">
              <select className="rounded border border-zinc-200 px-3 py-2 text-sm" defaultValue="mistral:mistral-large-latest">
                <option>Mistral Large</option>
                <option>GPT-4o</option>
                <option>Groq Llama</option>
                <option>Claude Sonnet</option>
              </select>
              <button className="rounded bg-pine px-4 py-2 text-sm text-white">Ask</button>
            </div>
            <div className="mt-4 rounded border border-zinc-200 bg-zinc-50 p-4 text-sm leading-6">
              Customer data is protected through RBAC, audit logging, secure uploads, sensitive data masking, and prompt-injection detection.
            </div>
          </Panel>
          <Panel title="Citation Sources">
            <ActivityList items={[]} empty="No citation sources yet. Ask a question after uploading documents." />
          </Panel>
        </div>
      </PageFrame>
    </AppShell>
  );
}

export function GenericPage({
  title,
  subtitle,
  variant = "table"
}: {
  title: string;
  subtitle: string;
  variant?: "table" | "charts" | "quality" | "settings" | "search" | "admin" | "graph";
}) {
  return (
    <AppShell>
      <PageFrame title={title} subtitle={subtitle}>
        {variant === "table" && (
          <>
            <Toolbar primary="Create" />
            <DataTable rows={documents} columns={["name", "status", "owner", "updated", "size"]} />
          </>
        )}
        {variant === "charts" && (
          <div className="grid gap-5 xl:grid-cols-2">
            <ChartPanel title="Usage Trend">
              <ResponsiveContainer width="100%" height="100%">
                <RLineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="queries" stroke="#1f5b4f" strokeWidth={2} />
                  <Line type="monotone" dataKey="cost" stroke="#c85c4a" strokeWidth={2} />
                </RLineChart>
              </ResponsiveContainer>
            </ChartPanel>
            <QualityPie />
          </div>
        )}
        {variant === "quality" && (
          <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
            <QualityPie />
            <DataTable rows={qualityData.map((item) => ({ metric: item.name, score: `${item.value}%`, status: "Healthy" }))} columns={["metric", "score", "status"]} />
          </div>
        )}
        {variant === "settings" && (
          <div className="grid gap-5 xl:grid-cols-2">
            <Panel title="Preferences">
              <FormGrid fields={["Theme", "Default Model", "Language", "Notifications"]} />
            </Panel>
            <Panel title="API Keys">
              <FormGrid fields={["Mistral", "OpenAI", "Groq", "Claude"]} />
            </Panel>
          </div>
        )}
        {variant === "search" && (
          <Panel title="Search Center">
            <div className="grid gap-3 md:grid-cols-[1fr_150px_120px]">
              <input className="rounded border border-zinc-200 px-3 py-2 text-sm" placeholder="Search across documents and chunks" />
              <select className="rounded border border-zinc-200 px-3 py-2 text-sm">
                <option>Semantic</option>
                <option>Hybrid</option>
              </select>
              <button className="inline-flex items-center justify-center gap-2 rounded bg-pine px-3 py-2 text-sm text-white">
                <Search size={16} />
                Search
              </button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-sm">
              {["Department", "Category", "Tags", "Owner", "Date"].map((filter) => (
                <span className="inline-flex items-center gap-2 rounded border border-zinc-200 px-3 py-2" key={filter}>
                  <Filter size={14} />
                  {filter}
                </span>
              ))}
            </div>
          </Panel>
        )}
        {variant === "admin" && (
          <>
            <StatsGrid />
            <DataTable rows={[]} columns={["area", "count", "status"]} />
          </>
        )}
        {variant === "graph" && (
          <Panel title="Knowledge Graph Viewer">
            <div className="grid min-h-96 place-items-center rounded bg-ink text-white">
              <div className="text-center">
                <GitBranch className="mx-auto mb-4 text-amber" size={42} />
                <p className="text-xl font-semibold">Policies, people, systems, and citations mapped together</p>
              </div>
            </div>
          </Panel>
        )}
      </PageFrame>
    </AppShell>
  );
}

function PageFrame({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-5 px-5 py-5">
      <div>
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

function StatsGrid({ compact = false }: { compact?: boolean }) {
  const stats = compact ? quickStats.slice(0, 4) : quickStats;
  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {stats.map(({ label, value, icon: Icon, tone }) => (
        <div className="rounded border border-zinc-200 bg-white p-4" key={label}>
          <div className={`mb-4 grid h-9 w-9 place-items-center rounded text-white ${tone}`}>
            <Icon size={18} />
          </div>
          <p className="text-sm text-zinc-500">{label}</p>
          <p className="mt-1 text-2xl font-semibold">{value}</p>
        </div>
      ))}
    </section>
  );
}

function Toolbar({ primary }: { primary: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded border border-zinc-200 bg-white p-3">
      <div className="flex flex-1 items-center gap-2 rounded border border-zinc-200 bg-zinc-50 px-3 py-2">
        <Search size={16} className="text-zinc-500" />
        <input className="w-full bg-transparent text-sm outline-none" placeholder="Search" />
      </div>
      <button className="inline-flex items-center gap-2 rounded border border-zinc-200 px-3 py-2 text-sm">
        <SlidersHorizontal size={16} />
        Filters
      </button>
      <button className="rounded bg-pine px-4 py-2 text-sm text-white">{primary}</button>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded border border-zinc-200 bg-white p-4">
      <h2 className="mb-4 text-base font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function ChartPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Panel title={title}>
      <div className="h-72">{children}</div>
    </Panel>
  );
}

function QualityPie() {
  return (
    <ChartPanel title="Quality Metrics">
      <ResponsiveContainer width="100%" height="100%">
        <RPieChart>
          <Pie data={qualityData} dataKey="value" nameKey="name" innerRadius={58} outerRadius={92}>
            {qualityData.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </RPieChart>
      </ResponsiveContainer>
    </ChartPanel>
  );
}

function DataTable({ rows, columns }: { rows: Record<string, string>[]; columns: string[] }) {
  return (
    <div className="overflow-x-auto rounded border border-zinc-200 bg-white">
      <table className="w-full min-w-[680px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-zinc-200 bg-zinc-50 text-left text-xs uppercase text-zinc-500">
            {columns.map((column) => (
              <th className="px-4 py-3 font-medium" key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td className="px-4 py-8 text-center text-zinc-500" colSpan={columns.length}>
                No data yet. Add your own documents, queries, or users to populate this page.
              </td>
            </tr>
          )}
          {rows.map((row, index) => (
            <tr className="border-b border-zinc-100" key={index}>
              {columns.map((column) => (
                <td className="px-4 py-3" key={column}>{row[column]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ActivityList({ items, empty = "No data yet." }: { items: string[]; empty?: string }) {
  if (items.length === 0) {
    return <div className="rounded border border-zinc-200 bg-zinc-50 px-3 py-6 text-center text-sm text-zinc-500">{empty}</div>;
  }

  return (
    <div className="grid gap-2">
      {items.map((item, index) => (
        <div className="flex items-center gap-3 rounded border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm" key={item}>
          {index === 2 ? <AlertTriangle size={16} className="text-coral" /> : <CheckCircle2 size={16} className="text-pine" />}
          {item}
        </div>
      ))}
    </div>
  );
}

function FormGrid({ fields }: { fields: string[] }) {
  return (
    <div className="grid gap-3">
      {fields.map((field) => (
        <label className="grid gap-1 text-sm" key={field}>
          {field}
          <input className="rounded border border-zinc-200 px-3 py-2" placeholder={field} />
        </label>
      ))}
    </div>
  );
}

function KeyValues({ data }: { data: Record<string, string> }) {
  return (
    <div className="grid gap-2">
      {Object.entries(data).map(([key, value]) => (
        <div className="flex items-center justify-between rounded border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm" key={key}>
          <span className="text-zinc-500">{key}</span>
          <span className="font-medium">{value}</span>
        </div>
      ))}
    </div>
  );
}
