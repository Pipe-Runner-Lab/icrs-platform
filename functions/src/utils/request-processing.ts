import { verifyKey } from "discord-interactions";
import type { Request } from "firebase-functions/v2/https";
import type { Response } from "firebase-functions/lib/v1/cloud-functions";

/**
 * Verify the request signature
 * @param {Request} request The request object
 * @param {Response} response The response object
 * @return {Promise<boolean>} True if the request is valid, false otherwise
 */
export async function verifyRequest(
  request: Request,
  response: Response
): Promise<boolean> {
  const signature = request.headers["x-signature-ed25519"] as
    | string
    | undefined;
  const timestamp = request.headers["x-signature-timestamp"] as
    | string
    | undefined;
  const publicKey = process.env.DISCORD_PUBLIC_KEY;
  const isValidRequest =
    signature &&
    timestamp &&
    publicKey &&
    (await verifyKey(request.rawBody, signature, timestamp, publicKey));
  if (!isValidRequest) {
    response.status(401).send("Invalid request signature");
    return false;
  }
  return true;
}

export const doesGuildMatch = (guildId: string): boolean =>
  guildId === process.env.ICRS_GUILD_ID;
