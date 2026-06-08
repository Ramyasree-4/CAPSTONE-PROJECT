# Prompt Engineering Document

## Overview

This application uses a single LLM provider, Mistral, to answer user queries from retrieved document context. Prompt design focuses on:

- grounding answers in retrieved citations
- limiting hallucinations by exposing only relevant context
- rejecting malicious prompt injection attempts
- preserving a clean question/answer loop for analytics

## Final Prompt Template

The production prompt is constructed in `backend/app/services/llm_gateway.py`.

### Template

```
You are a knowledgeable assistant. Use the following context to answer the user question. Provide clear, concise, and accurate responses.

Context:
{context}

Question:
{question}
```

## Prompt Engineering Strategy

- `context`: retrieved document chunks from prior semantic search.
- `question`: the end user query.
- No additional system or developer instructions are injected beyond the user-oriented prompt content.
- The model is explicitly asked to answer using only the provided context.

## Safety and Injection Protection

The backend detects prompt injection in every incoming question before retrieval or LLM invocation.

### Injection patterns

- `ignore previous`
- `system prompt`
- `developer message`
- `reveal secrets`

If a query matches any pattern, the request is rejected with a 400 error and a security log entry is created.

## Notes on Prompt Variants

- Only one prompt variant is used in the current codebase.
- The prompt is intentionally simple to maximize transparency and reduce unexpected model behavior.
- Token usage is tracked for both prompt and completion tokens to estimate cost.

## Prompt Evaluation

- The prompt is designed for a retrieval-augmented scenario, with the model conditioned on only the relevant chunks.
- The generated answer is returned with citation metadata from the retrieved chunks.

## Future Prompt Enhancements

- Add an explicit instruction to cite source filename and chunk index in the response.
- Use a schema-based output format to make downstream UI parsing easier.
- Add query rewriting and context truncation when documents grow larger.
