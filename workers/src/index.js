

import { router } from './requests/workers.routes.js';

export default {
  async fetch(request, env) {
    try {
      // Use the router for all API and static asset requests
      const response = await router.handle(request, env);
      if (response) {
        return response;
      }
      // Fallback: serve static assets (React client)
      return await env.ASSETS.fetch(request);
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
  }
}