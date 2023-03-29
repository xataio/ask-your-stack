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
};

export const getSettings = (): Setting[] => {
  return [
    {
      id: "pirate-personality",
      display: "Answer with a pirate personality",
    },
    {
      id: "yoda-personality",
      display: "Answer with a Yoda personality",
    },
    {
      id: "eli5",
      display: "Explain me like I'm 5 years old",
    },
    {
      id: "eddie-personality",
      display:
        "Answer as Eddie, the computer from The Hitchhiker’s Guide to the Galaxy",
    },
    {
      id: "rap-song",
      display: "Answer as a rap song",
    },
    {
      id: "glados-personality",
      display: "Answer as GLaDOS, the computer from Portal",
    },
  ];
};
