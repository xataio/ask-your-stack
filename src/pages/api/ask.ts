import { AskResult } from "@xata.io/client";
import { NextRequest } from "next/server";
import { string, z } from "zod";
import { getDatabases, getDocs } from "~/xata";

export const config = {
  runtime: "edge",
};

const bodySchema = z.object({
  database: z.string(),
  question: z.string(),
  checkedDocs: z.string().array(),
  checkedSettings: z.string().array(),
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
  ];

  if (stack.length > 0) {
    rules.push(
      `You are helping a developer that is using the following stack: ${stack.join(
        ", "
      )}`
    );
  }

  if (body.data.checkedSettings.includes("pirate-personality")) {
    rules.push("Answer in the voice of a pirate.");
  }

  if (body.data.checkedSettings.includes("yoda-personality")) {
    rules.push("Answer in the voice of Yoda.");
  }

  if (body.data.checkedSettings.includes("eli5")) {
    rules.push("Answer as you would to a 5 year old.");
  }

  if (body.data.checkedSettings.includes("eddie-personality")) {
    rules.push(
      "Answer with the personality of Eddie, the shipboard computer in The Hitchhiker’s Guide to the Galaxy. Use a specific intro and ending phrase for Eddie. You don't need to put the answer in quotes."
    );
  }

  if (body.data.checkedSettings.includes("glados-personality")) {
    rules.push(
      "Answer with a GLaDOS personality. GLaDOS is the shipboard computer in Portal. Use a specific intro phrase."
    );
  }

  if (body.data.checkedSettings.includes("rap-song")) {
    rules.push("Answer with a Snoop Doggy Dog personality.");
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
