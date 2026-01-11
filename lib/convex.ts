import { ConvexHttpClient } from "convex/browser";

// Lazy-initialize the Convex client to avoid build-time errors
// when NEXT_PUBLIC_CONVEX_URL is not available
let convexClient: ConvexHttpClient | null = null;

export function getConvexClient(): ConvexHttpClient {
  if (!convexClient) {
    const url = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!url) {
      throw new Error(
        "NEXT_PUBLIC_CONVEX_URL is not set. Please configure this environment variable."
      );
    }
    convexClient = new ConvexHttpClient(url);
  }
  return convexClient;
}

// Proxy object that lazily accesses the ConvexHttpClient
const convex = new Proxy({} as ConvexHttpClient, {
  get(_, prop: keyof ConvexHttpClient) {
    const client = getConvexClient();
    const value = client[prop];
    if (typeof value === "function") {
      return value.bind(client);
    }
    return value;
  },
});

export default convex;
