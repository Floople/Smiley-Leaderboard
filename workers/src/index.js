// Authentication helper
/*
async function checkIfRequestIsAuthenticated(request, env) {
  const apiKey = request.headers.get("SMILEY_LEADERBOARD_AUTHENTICATOR");
  if (apiKey && apiKey === env.SMILEY_LEADERBOARD_AUTHENTICATOR) {
	return { name: "authorized-user" };
  }
  return null;
}
*/
import {dbGetAll} from './db/index.js';
// Cloudflare Worker Entrypoint
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Log every incoming request
    console.log(`[${new Date().toISOString()}] ${request.method} ${url.pathname}`);

    // API endpoint (protected)
    if (url.pathname.startsWith("/api")) {
      try {
        const leaderboard = await dbGetAll();
        return new Response(JSON.stringify({ leaderboard }), {
          headers: { "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*" }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*" }
        });
      }
    }

    // For all other routes, serve static assets (React client)
    return await env.ASSETS.fetch(request);
  }
};