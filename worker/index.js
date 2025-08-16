import { WorkerEntrypoint } from "cloudflare:workers";

export default class extends WorkerEntrypoint {
  async fetch(request) {
    // You can perform checks before fetching assets
    const user = await checkIfRequestIsAuthenticated(request);

    // You can then just fetch the assets as normal, or you could pass in a custom Request object here if you wanted to fetch some other specific asset
    const assetResponse = await this.env.ASSETS.fetch(request);

    // You can return static asset response as-is, or you can transform them with something like HTMLRewriter
    return new HTMLRewriter()
      .on("#user", {
        element(element) {
          element.setInnerContent(JSON.stringify({ name: user.name }));
        },
      })
      .transform(assetResponse);
  }
}