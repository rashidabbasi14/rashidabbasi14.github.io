import { Webhook } from "svix";
import { headers } from "next/headers";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  // Get the Svix webhook secret from env
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("CLERK_WEBHOOK_SECRET is not set");
    return new Response("Webhook secret not configured", { status: 500 });
  }

  // Get the headers
  const headersList = await headers();
  const svixId = headersList.get("svix-id");
  const svixTimestamp = headersList.get("svix-timestamp");
  const svixSignature = headersList.get("svix-signature");

  // If there are no Svix headers, the request is not from Clerk
  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Missing Svix headers", { status: 400 });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with the secret
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: { type: string; data: Record<string, unknown> };

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as { type: string; data: Record<string, unknown> };
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  const eventType = evt.type;

  if (eventType === "user.created") {
    const { id, email_addresses, username } = evt.data;

    const clerkUserId = id as string;
    const primaryEmail =
      (email_addresses as Array<{ email_address: string }>)?.[0]
        ?.email_address || "";
    const clerkUsername = (username as string) || "";

    // Generate a username if Clerk didn't provide one
    // We'll use the email local part as a fallback
    let finalUsername = clerkUsername;
    if (!finalUsername) {
      finalUsername = primaryEmail.split("@")[0]?.replace(/[^a-zA-Z0-9_-]/g, "") || `user_${Date.now()}`;
    }

    // Ensure username is unique by appending a suffix if needed
    let uniqueUsername = finalUsername;
    let suffix = 1;
    while (true) {
      const existing = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.username, uniqueUsername))
        .limit(1);

      if (existing.length === 0) break;
      uniqueUsername = `${finalUsername}${suffix}`;
      suffix++;
    }

    // Insert the new user
    try {
      await db.insert(users).values({
        id: clerkUserId,
        username: uniqueUsername,
        email: primaryEmail,
      });

      console.log(
        `[Webhook] User created: ${clerkUserId} (${uniqueUsername}, ${primaryEmail})`
      );
    } catch (err) {
      console.error("[Webhook] Failed to insert user:", err);
      return new Response("Failed to create user", { status: 500 });
    }
  }

  if (eventType === "user.updated") {
    const { id, email_addresses, username } = evt.data;

    const clerkUserId = id as string;
    const primaryEmail =
      (email_addresses as Array<{ email_address: string }>)?.[0]
        ?.email_address || "";
    const clerkUsername = (username as string) || "";

    try {
      await db
        .update(users)
        .set({
          email: primaryEmail,
          ...(clerkUsername ? { username: clerkUsername } : {}),
        })
        .where(eq(users.id, clerkUserId));

      console.log(`[Webhook] User updated: ${clerkUserId}`);
    } catch (err) {
      console.error("[Webhook] Failed to update user:", err);
      return new Response("Failed to update user", { status: 500 });
    }
  }

  if (eventType === "user.deleted") {
    const { id } = evt.data;
    const clerkUserId = id as string;

    try {
      await db.delete(users).where(eq(users.id, clerkUserId));
      console.log(`[Webhook] User deleted: ${clerkUserId}`);
    } catch (err) {
      console.error("[Webhook] Failed to delete user:", err);
      return new Response("Failed to delete user", { status: 500 });
    }
  }

  return new Response("OK", { status: 200 });
}
