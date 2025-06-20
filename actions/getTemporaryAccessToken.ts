"use server";

import { currentUser } from "@clerk/nextjs/server";
import { SchematicClient } from "@schematichq/schematic-typescript-node";

const apiKey = process.env.SCHEMATIC_API_KEY;
const client = new SchematicClient({ apiKey });

export async function getTemporaryAccessToken() {
  const user = await currentUser();
  if (!user) {
    throw new Error("User not found");
  }

  console.log(`Issuing temporary access token for user ${user.id}`);

  const response = await client.accesstokens.issueTemporaryAccessToken({
    resourceType: "company",
    lookup: {
      id: user.id,
    },
  });

  console.log(
    "Temporary access token issued",
    response.data ? "Token received" : "No token in response",
  );

  return response.data?.token;
}
