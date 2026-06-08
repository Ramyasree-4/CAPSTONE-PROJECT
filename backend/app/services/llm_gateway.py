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
        if requested_model and ":" in requested_model:
            requested_provider = requested_model.split(":", 1)[0].lower()
            ordered = [requested_provider, *settings.LLM_FALLBACK_ORDER]
        else:
            ordered = settings.LLM_FALLBACK_ORDER

        seen: set[str] = set()
        result: list[str] = []
        for provider in ordered:
            normalized = "anthropic" if provider == "claude" else provider
            if normalized not in seen and self._has_key(normalized):
                seen.add(normalized)
                result.append(normalized)
        return result

    def _has_key(self, provider: str) -> bool:
        return {
            "mistral": bool(settings.MISTRAL_API_KEY),
            "openai": bool(settings.OPENAI_API_KEY),
            "groq": bool(settings.GROQ_API_KEY),
            "anthropic": bool(settings.ANTHROPIC_API_KEY),
        }.get(provider, False)

    async def _call_provider(self, provider: str, prompt: str) -> LLMResult:
        if provider == "mistral":
            return await self._call_mistral(prompt)
        if provider == "openai":
            return await self._call_openai(prompt)
        if provider == "groq":
            return await self._call_groq(prompt)
        if provider == "anthropic":
            return await self._call_anthropic(prompt)
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

    async def _call_openai(self, prompt: str) -> LLMResult:
        payload = {
            "model": settings.OPENAI_MODEL,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.2,
        }
        data = await self._post(
            "https://api.openai.com/v1/chat/completions",
            settings.OPENAI_API_KEY,
            payload,
        )
        return self._chat_result(data, "openai", settings.OPENAI_MODEL)

    async def _call_groq(self, prompt: str) -> LLMResult:
        payload = {
            "model": settings.GROQ_MODEL,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.2,
        }
        data = await self._post(
            "https://api.groq.com/openai/v1/chat/completions",
            settings.GROQ_API_KEY,
            payload,
        )
        return self._chat_result(data, "groq", settings.GROQ_MODEL)

    async def _call_anthropic(self, prompt: str) -> LLMResult:
        headers = {
            "x-api-key": settings.ANTHROPIC_API_KEY or "",
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        }
        payload = {
            "model": settings.ANTHROPIC_MODEL,
            "max_tokens": 1200,
            "temperature": 0.2,
            "messages": [{"role": "user", "content": prompt}],
        }
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.post("https://api.anthropic.com/v1/messages", headers=headers, json=payload)
            response.raise_for_status()
            data = response.json()
        answer = "".join(part.get("text", "") for part in data.get("content", []) if part.get("type") == "text")
        usage = data.get("usage", {})
        return LLMResult(
            answer=answer.strip(),
            provider="anthropic",
            model=settings.ANTHROPIC_MODEL,
            token_usage={
                "prompt_tokens": usage.get("input_tokens", 0),
                "completion_tokens": usage.get("output_tokens", 0),
            },
            fallback_used=False,
        )

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

