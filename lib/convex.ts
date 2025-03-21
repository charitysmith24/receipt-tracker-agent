import { ConvexHttpClient } from "convex/browser";

// Create a convex client for server-side HTTP requests
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default convex;
