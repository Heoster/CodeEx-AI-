# SOHAM Agent Production Setup (Vercel + Netlify)

This project now supports a production-oriented SOHAM message pipeline with:

- Multi-provider AI fallback: Groq -> Cerebras -> Google -> OpenRouter -> Hugging Face
- Tool routing:
  - `news_search` -> GNews API (query sanitization)
  - `weather_search` -> Open-Meteo weather/geocoding
  - `sports_search` -> CricAPI (or web fallback)
  - `finance_search` -> CoinGecko (crypto) / Alpha Vantage (stocks)
  - `web_search` -> DuckDuckGo
- RAG memory:
  - Upstash Vector (REST API)
  - Supabase chat history for cross-device continuity

## Required Environment Variables

Add these in Vercel/Netlify environment settings:

```env
# AI Providers (free-tier capable)
GROQ_API_KEY=
GOOGLE_API_KEY=
CEREBRAS_API_KEY=
HUGGINGFACE_API_KEY=
OPENROUTER_API_KEY=

# Tool Integrations
GNEWS_API_KEY=
CRICAPI_KEY=
ALPHA_VANTAGE_API_KEY=

# RAG + Long-term memory
UPSTASH_VECTOR_REST_URL=
UPSTASH_VECTOR_REST_TOKEN=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

## Supabase Table (cross-device chat history)

Create table:

```sql
create table if not exists public.chat_history (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists chat_history_user_created_idx
  on public.chat_history(user_id, created_at desc);
```

## Free-Tier Notes

- Open-Meteo + CoinGecko are free public APIs.
- GNews, Alpha Vantage, CricAPI, Upstash, Supabase each provide free tiers.
- Keep request budgets safe by:
  - using tool calls only when intent is detected,
  - limiting fetch timeouts and result counts,
  - enabling provider fallback chain.

## Validation

- `/api/health` now reports:
  - AI provider config + key-shape checks
  - tool integration config
  - Upstash/Supabase connection configuration presence
