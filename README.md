# dummy-worker

A do-nothing Cloudflare Worker used to verify that the **Deploy with Cloudflare** button auto-provisions the resources declared in `wrangler.toml`.

The Worker itself returns `"dummy-worker: ok"` and does nothing else. It exists purely so the deploy button has something to deploy while provisioning:

- **D1** database (`dummy-db`) — `database_id` omitted so Cloudflare creates a new one
- **Vectorize** index (`dummy-index`)
- **Queues** producer + consumer (`dummy-queue`)
- **Durable Object** `ChatSessionStore` (sqlite-backed, via `[[migrations]]`)
- **Workers AI**, **Browser**, **[assets]** bindings
- `JWT_SECRET` var (set it in the deploy UI)

## Deploy with Cloudflare

> Replace `<your-username>` with your GitHub username / org and repo name in the URL below before sharing the button.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/nerdzero01/does-this-work.git)

Click the button and Cloudflare will provision D1, Vectorize, the Queue, and the Durable Object class, then deploy this dummy Worker on top of them.

## Notes

- The deploy button reads `wrangler.toml` from the **root of the linked repository**. So this folder's contents must be pushed to its own public GitHub repo (not nested inside another repo).
- Resources get `dummy-` prefixed names so they don't clash with any existing ones in your account.
- After deploy, `GET /__refs` returns the bound types (handy for sanity-checking that every binding is wired up).
