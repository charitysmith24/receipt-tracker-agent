import { SchematicClient } from "@schematichq/schematic-typescript-node";

// Lazy initialization to avoid build-time errors when env vars aren't set
let schematicClient: SchematicClient | null = null;

export function getSchematicClient(): SchematicClient {
  if (!schematicClient) {
    if (!process.env.SCHEMATIC_API_KEY) {
      throw new Error("SCHEMATIC_API_KEY is not set");
    }
    schematicClient = new SchematicClient({
      apiKey: process.env.SCHEMATIC_API_KEY,
      cacheProviders: {
        flagChecks: [],
      },
    });
  }
  return schematicClient;
}

// Proxy for backward compatibility
export const client = new Proxy({} as SchematicClient, {
  get(_, prop: keyof SchematicClient) {
    const instance = getSchematicClient();
    const value = instance[prop];
    if (typeof value === "function") {
      return value.bind(instance);
    }
    return value;
  },
});
