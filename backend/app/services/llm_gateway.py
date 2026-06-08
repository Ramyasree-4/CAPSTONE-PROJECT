from dataclasses import dataclass
import httpx

from app.core.config import settings


@dataclass
class LLMResult:
    answer: str
    provider: str
    model: str
    token_usage: dict
    fallback_used: bool


class LLMGateway:
    def __init__(self) -> None:
        self.timeout = httpx.Timeout(45.0)

    async def generate(self, question: str, context: str, requested_model: str | None = None) -> LLMResult:
        if not context:
            return LLMResult(
                answer="I could not find relevant internal context for that question.",
                provider="local",
                model="no-context",
                token_usage={"prompt_tokens": 0, "completion_tokens": 10},
                fallback_used=False,
            )

        prompt = self._build_prompt(question, context)
        providers = self._provider_order(requested_model)
        errors: list[str] = []

        for index, provider in enumerate(providers):
            try:
                result = await self._call_provider(provider, prompt)
                result.fallback_used = index > 0
                return result
            except Exception as exc:
                errors.append(f"{provider}: {exc}")

        preview = context[:700].strip()
        return LLMResult(
            answer=f"Based on the retrieved internal documents, {preview} Answered locally because no configured LLM provider succeeded.",
            provider="local",
            model="fallback",
            token_usage={"prompt_tokens": len(prompt.split()), "completion_tokens": len(preview.split())},
            fallback_used=True,
        )

    def _provider_order(self, requested_model: str | None) -> list[str]:
        return ["mistral"]

    async def _call_provider(self, provider: str, prompt: str) -> LLMResult:
        if provider == "mistral":
            return await self._call_mistral(prompt)
        raise ValueError(f"Unsupported provider {provider}")

    async def _call_mistral(self, prompt: str) -> LLMResult:
        payload = {
            "model": settings.MISTRAL_MODEL,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.2,
        }
        data = await self._post(
            "https://api.mistral.ai/v1/chat/completions",
            settings.MISTRAL_API_KEY,
            payload,
        )
        return self._chat_result(data, "mistral", settings.MISTRAL_MODEL)

    async def _post(self, url: str, api_key: str | None, payload: dict) -> dict:
        headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.post(url, headers=headers, json=payload)
            response.raise_for_status()
            return response.json()

    def _chat_result(self, data: dict, provider: str, model: str) -> LLMResult:
        answer = data["choices"][0]["message"]["content"]
        usage = data.get("usage", {})
        return LLMResult(
            answer=answer.strip(),
            provider=provider,
            model=model,
            token_usage={
                "prompt_tokens": usage.get("prompt_tokens", 0),
                "completion_tokens": usage.get("completion_tokens", 0),
            },
            fallback_used=False,
        )

    def _build_prompt(self, question: str, context: str) -> str:
        return (
            "You are an enterprise RAG assistant. Answer only from the provided internal context. "
            "If the context is insufficient, say what is missing. Include concise source-aware reasoning.\n\n"
            f"Context:\n{context}\n\nQuestion:\n{question}"
        )


llm_gateway = LLMGateway()

