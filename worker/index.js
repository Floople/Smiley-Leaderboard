import { WorkerEntrypoint } from "cloudflare:workers";

async function checkIfRequestIsAuthenticated(request, env) {
  const apiKey = request.headers.get("SMILEY_LEADERBOARD_AUTHENTICATOR");
  if (apiKey && apiKey === env.SMILEY_LEADERBOARD_AUTHENTICATOR) {
    return { name: "authorized-user" };
  }
  return null;
}

export default class extends WorkerEntrypoint {
  async fetch(request) {
    const url = new URL(request.url);
    // Only require authentication for /api/* routes
    if (url.pathname.startsWith("/api/")) {
      const user = await checkIfRequestIsAuthenticated(request, this.env);
      if (!user) {
        return new Response("Unauthorized", { status: 401 });
      }
    }
    return await this.env.ASSETS.fetch(request);
  }
}