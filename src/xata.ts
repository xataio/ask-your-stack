import { AskOptions, BaseClient } from "@xata.io/client";

type Database = {
  id: string;
  name: string;
  client: BaseClient;
  lookupTable: string;
};

export const getDatabases = (): Database[] => {
  const askyourstack = new BaseClient({
    databaseURL: "https://demo-uni3q8.us-east-1.xata.sh/db/askyourstack",
  });

  return [
    {
      id: "askyourstack",
      client: askyourstack,
      name: "Ask your stack",
      lookupTable: "content",
    },
  ];
};

type Docs = {
  id: string;
  name: string;
};

type DocsKinds = {
  id: string;
  name: string;
  docs: Docs[];
};
export const getDocs = (): DocsKinds[] => {
  return [
    {
      id: "frameworks",
      name: "Frameworks",
      docs: [
        {
          id: "nextjs-docs",
          name: "Next.js",
        },
        {
          id: "nuxt2-docs",
          name: "Nuxt",
        },
        {
          id: "reactjs-docs",
          name: "React",
        },
      ],
    },
    {
      id: "style",
      name: "Style",
      docs: [
        {
          id: "tailwind-docs",
          name: "Tailwind CSS",
        },

        {
          id: "chackra-ui-docs",
          name: "Chakra UI",
        },
      ],
    },
    {
      id: "databases",
      name: "Databases",
      docs: [
        {
          id: "xata-guide",
          name: "Xata",
        },
      ],
    },
  ];
};
