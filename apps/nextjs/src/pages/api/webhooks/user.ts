import { IncomingHttpHeaders } from "http";
import type { NextApiRequest, NextApiResponse } from "next";
import { Webhook, WebhookRequiredHeaders } from "svix";
import { buffer } from "micro";
import { prisma } from "@acme/db";

// Disable the bodyParser so we can access the raw
// request body for verification.
export const config = {
  api: {
    bodyParser: false,
  },
};

const webhookSecret: string = process.env.WEBHOOK_SECRET || "";

export default async function handler(
  req: NextApiRequestWithSvixRequiredHeaders,
  res: NextApiResponse,
) {
  const payload = (await buffer(req)).toString();
  const headers = req.headers;
  const wh = new Webhook(webhookSecret);
  let evt: Event | null = null;
  try {
    evt = wh.verify(payload, headers) as Event;
  } catch (_) {
    return res.status(400).json({});
  }

  // Handle the webhook
  const eventType: EventType = evt.type;
  if (eventType === "user.created" || eventType === "user.updated") {
    const { id, ...attributes } = evt.data;

    const uniqueUsername =
      attributes.username || new Date().getTime().toString().substring(0, 10);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const email = (attributes.email_addresses as any)?.[0]
      ?.email_address as string;

    const dateOfBirth = attributes.birthday
      ? new Date(attributes.birthday)
      : null;

    await prisma.user
      .upsert({
        where: { id: id as string },
        create: {
          id: id as string,
          email,
          name: ((attributes.first_name as string) +
            " " +
            attributes.last_name) as string,
          username: uniqueUsername as string,
          profilePicture: attributes.image_url as string,
          dateOfBirth,
        },
        update: {
          email,
          name: ((attributes.first_name as string) +
            " " +
            attributes.last_name) as string,
          username: uniqueUsername as string,
          profilePicture: attributes.image_url as string,
          dateOfBirth,
        },
      })
      .catch((err) => {
        console.log({ err: err.message });
      });
  }

  res.json({});
}

type NextApiRequestWithSvixRequiredHeaders = NextApiRequest & {
  headers: IncomingHttpHeaders & WebhookRequiredHeaders;
};

// Generic (and naive) way for the Clerk event
// payload type.
type Event = {
  data: Record<string, string | number>;
  object: "event";
  type: EventType;
};

type EventType = "user.created" | "user.updated" | "*";
