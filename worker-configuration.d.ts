// Minimal types for dummy-worker. Mirrors the bindings in wrangler.toml.
// Replace with `wrangler types` output if you want full fidelity.

interface Env {
  // [browser]
  BROWSER: BrowserRun;
  // [assets]
  ASSETS: Fetcher;
  // [ai]
  AI: Ai;
  // [vars]
  JWT_SECRET: string;
  // [[d1_databases]]
  DB: D1Database;
  // [[vectorize]]
  VECTOR_INDEX: VectorizeIndex;
  // [[queues.producers]]
  DOCUMENT_QUEUE: Queue;
  // [durable_objects]
  CHAT_SESSIONS: DurableObjectNamespace<ChatSessionStore>;
}
