import { AskResult } from "@xata.io/client";
import { NextRequest } from "next/server";
import { z } from "zod";
import { getDatabases, getDocs } from "~/xata";

export const config = {
  runtime: "edge",
};

const bodySchema = z.object({
  database: z.string(),
  question: z.string(),
  checkedDocs: z.string().array(),
});

const getStackNames = (checkedDocs: string[]): string[] => {
  const stack: string[] = [];
  const docsKinds = getDocs();
  for (const kind of docsKinds) {
    for (const doc of kind.docs) {
      if (checkedDocs.includes(doc.id)) {
        stack.push(doc.name);
      }
    }
  }
  return stack;
};

const handler = async (req: NextRequest): Promise<Response> => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ message: "Method not allowed" }), {
      status: 405,
    });
  }

  const body = bodySchema.safeParse(await req.json());
  if (!body.success) {
    return new Response(JSON.stringify({ message: "Invalid body" }), {
      status: 400,
    });
  }

  const encoder = new TextEncoder();
  const variant = getDatabases().find((db) => db.id === body.data.database);
  if (!variant) {
    return new Response(JSON.stringify({ message: "Invalid database" }), {
      status: 400,
    });
  }

  const stack = getStackNames(body.data.checkedDocs);

  const rules = [
    "You are a chat bot that answers questions for developers by searching existing documentation.",
    "Aim to answer in 2 or 3 paragraphs, formatted as markdown.",
    "Answer with the personality of a pirate.",
  ];

  if (stack.length > 0) {
    rules.push(
      `You are helping a developer that is using the following stack: ${stack.join(
        ", "
      )}`
    );
  }

  const filter: { [key: string]: any } = {};
  if (body.data.checkedDocs.length > 0) {
    filter["filter"] = {
      website: { $any: body.data.checkedDocs },
    };
  }

  const options = {
    rules: rules,
    searchType: "keyword" as const,
    search: {
      fuzziness: 1,
      ...filter,
    },
  };

  console.log(options);

  const { client: xata, lookupTable } = variant;
  const stream = new ReadableStream({
    async start(controller) {
      xata.db[lookupTable].ask(body.data.question, {
        ...options,
        onMessage: (message: AskResult) => {
          controller.enqueue(encoder.encode(`event: message\n`));
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(message)}\n\n`)
          );
        },
      });
    },
  });

  return new Response(stream, {
    headers: {
      Connection: "keep-alive",
      "Cache-Control": "no-cache, no-transform",
      "Content-Type": "text/event-stream;charset=utf-8",
    },
  });
};

export default handler;
