/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.toml`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
	async fetch(request, env, ctx): Promise<Response> {
		try {
			const url = new URL(request.url);

			console.log(url);

			const keys = (await env.kv_tutorial.list()).keys.map((k) => k.name);

			const values = await Promise.all(keys.map((key) => env.kv_tutorial.get(key)));

			const responseObject = keys.reduce((obj, key, index) => {
				obj[key] = values[index];
				return obj;
			}, {} as Record<string, string | null>);

			return new Response(JSON.stringify(responseObject), {
				headers: { 'Content-Type': 'application/json' },
			});
		} catch (err) {
			// In a production application, you could instead choose to retry your KV
			// read or fall back to a default code path.
			console.error(`KV returned error: ${err}`);
			return new Response(`KV returned error: ${err}`, { status: 500 });
		}
	},
} satisfies ExportedHandler<Env>;
