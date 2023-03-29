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
        {
          id: "vuejs-guide",
          name: "Vue.js",
        },
      ],
    },
    {
      id: "platforms",
      name: "Platforms",
      docs: [
        {
          id: "vercel-docs",
          name: "Vercel",
        },
        {
          id: "netlify-docs",
          name: "Netlify",
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
        {
          id: "postgres-docs",
          name: "PostgreSQL",
        },
        {
          id: "prisma-docs",
          name: "Prisma",
        },
      ],
    },
  ];
};

type Setting = {
  id: string;
  display: string;
  rule: string;
};

export const getPersonalities = (): Setting[] => {
  return [
    {
      id: "pirate",
      display: "Pirate",
      rule: "Answer in the voice of a pirate.",
    },
    {
      id: "yoda",
      display: "Yoda",
      rule: "Answer with the style of Yoda. Start with 'Do or do not, there is no try.' or with 'When 900 years old, you reach, look as good, you will not.'",
    },
    {
      id: "snoop-dogg",
      display: "Snoop Dogg",
      rule: "Answer in the voice of Snoop Dogg.",
    },
    {
      id: "glados",
      display: "GLaDOS",
      rule: "Answer with a GLaDOS personality. GLaDOS is the shipboard computer in Portal. Use a specific intro phrase.",
    },
  ];
};
