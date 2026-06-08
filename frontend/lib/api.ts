export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";

export type MetricOverview = {
  system_metrics: Record<string, number>;
  rag_metrics: Record<string, number[]>;
  llm_metrics: Record<string, number | Record<string, number>>;
};

export async function fetchOverview(token?: string): Promise<MetricOverview> {
  const response = await fetch(`${API_BASE_URL}/analytics/overview`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    cache: "no-store"
  });
  if (!response.ok) {
    return demoOverview;
  }
  return response.json();
}

export const demoOverview: MetricOverview = {
  system_metrics: {
    total_users: 128,
    active_users: 84,
    total_documents: 3420,
    total_queries: 18940,
    total_conversations: 4912,
    average_response_time: 1240
  },
  rag_metrics: {
    faithfulness_trend: [0.76, 0.8, 0.84, 0.88],
    recall_trend: [0.7, 0.73, 0.77, 0.8],
    precision_trend: [0.72, 0.76, 0.81, 0.84],
    hallucination_trend: [0.28, 0.23, 0.18, 0.12]
  },
  llm_metrics: {
    model_usage: { "GPT-4o": 64, Gemini: 21, "Groq Llama": 15 },
    cost_analysis: 428.18,
    latency_analysis: 1240,
    success_rate: 0.98
  }
};

