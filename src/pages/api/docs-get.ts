import { NextRequest } from "next/server";
import { z } from "zod";
import { getDatabases } from "~/xata";

export const config = {
  runtime: "edge",
};

const bodySchema = z.object({
  ids: z.string().array(),
  database: z.string(),
});

const handler = async (req: NextRequest): Promise<Response> => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ message: "Method not allowed" }), {
      status: 405,
    });
  }

  const raw = await req.json();
  const body = bodySchema.safeParse(raw);
  if (!body.success) {
    return new Response(JSON.stringify({ message: "Invalid body" }), {
      status: 400,
    });
  }

  const { ids } = body.data;
  if (ids.length === 0) {
    return new Response(JSON.stringify([]), { status: 200 });
  }

  const params = {
    filter: { $any: ids.map((id) => ({ id })) },
    columns: ["id", "title", "url", "website"],
  };

  const variant = getDatabases().find((db) => db.id === body.data.database);
  if (!variant) {
    return new Response(JSON.stringify({ message: "Invalid database" }), {
      status: 400,
    });
  }
  const { client: xata, lookupTable, options } = variant;

  const result = await xata.db[lookupTable]
    .filter({
      $any: ids.map((id) => ({ id })),
    })
    .getMany(params);

  return new Response(JSON.stringify(result), { status: 200 });
};

export default handler;
