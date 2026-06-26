// Dummy Cloudflare Worker. Does nothing meaningful.
// Exists only to test that the "Deploy with Cloudflare" button
// auto-provisions the resources declared in wrangler.toml.

export class ChatSessionStore implements DurableObject {
  constructor(state: DurableObjectState, _env: Env) {}

  async fetch(_request: Request): Promise<Response> {
    return new Response("ok", { status: 200 });
  }

  async alarm(): Promise<void> {}
}

export default {
  async fetch(
    request: Request,
    env: Env,
    _ctx: ExecutionContext,
  ): Promise<Response> {
    // Touch every binding so they're referenced (and thus actually wired up).
    const refs = {
      browser: typeof env.BROWSER,
      assets: typeof env.ASSETS,
      ai: typeof env.AI,
      db: typeof env.DB,
      vector: typeof env.VECTOR_INDEX,
      queue: typeof env.DOCUMENT_QUEUE,
      chat: typeof env.CHAT_SESSIONS,
      jwtSet: Boolean(env.JWT_SECRET),
    };

    if (
      request.method === "GET" &&
      new URL(request.url).pathname === "/__refs"
    ) {
      return Response.json(refs);
    }

    if (
      request.method === "GET" &&
      new URL(request.url).pathname === "/__browser-test"
    ) {
      try {
        const response = await env.BROWSER.quickAction("content", {
          url: "https://example.com",
        });
        if (!response.ok) {
          const text = await response.text();
          return Response.json(
            { success: false, status: response.status, error: text },
            { status: 502 },
          );
        }
        const html = await response.text();
        return Response.json({
          success: true,
          url: "https://example.com",
          contentLength: html.length,
          preview: html.slice(0, 1000),
        });
      } catch (err) {
        return Response.json(
          {
            success: false,
            error: err instanceof Error ? err.message : String(err),
          },
          { status: 500 },
        );
      }
    }

    return new Response("dummy-worker: ok", {
      headers: { "content-type": "text/plain" },
    });
  },

  async queue(_batch: MessageBatch<unknown>, _env: Env): Promise<void> {
    // no-op consumer; messages are discarded.
  },

  async scheduled(
    _event: ScheduledEvent,
    _env: Env,
    _ctx: ExecutionContext,
  ): Promise<void> {
    // no-op cron handler.
  },
};
