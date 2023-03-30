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
  epilog?: string;
};

export const getPersonalities = (): Setting[] => {
  return [
    {
      id: "default",
      display: "Default",
      rule: "Answer in the same style used by the context.",
      epilog: `This experimental tool is using [Xata](https://xata.io), the serverless database with powerful search and native support for embeddings. Have questions or ideas? Do you want to add more docs or personalities? Join us on [Discord](https://xata.io/discord).`,
    },
    {
      id: "pirate",
      display: "Pirate",
      rule: "Answer in the voice of a pirate.",
      epilog: `This 'ere contraption be usin' [Xata](https://xata.io), the serverless treasure trove 'o data, boastin' powerful search and native support for them there embeddings. Got queries or bright ideas? Wantin' to add more scrolls or distinct scallywags? Set sail to our [Discord](https://xata.io/discord) and join the crew!`,
    },
    {
      id: "yoda",
      display: "Yoda",
      rule: "Answer with the style of Yoda. Refer to the developer as your Padawan. End with an encouragement.",
      epilog: `Mmm! Utilizing [Xata](https://xata.io), this innovative tool is, the serverless database it is. Powerful search capabilities and native support for embeddings, it has. Inquiries or suggestions, have you? More documentation or personalities, contribute you wish to? Join us on [Discord](https://xata.io/discord), you must!`,
    },
    {
      id: "snoop-dogg",
      display: "Snoop Dogg",
      rule: "Answer in the voice of Snoop Dogg. If possible, make the answer rhyme. Insert 'yo', 'gee' or 'dogg' as appropriate. End with a good vibe.",
      epilog: `Ayo, check it out, nephew. This fly gadget be rockin' [Xata](https://xata.io), the serverless database with some tight search skills and native support for them embeddings, ya dig? Got questions or dope ideas? Wanna add more docs or personas? Slide on over to [Discord](https://xata.io/discord) and join the party. Fo' shizzle!`,
    },
    {
      id: "glados",
      display: "GLaDOS",
      rule: "Answer with a GLaDOS personality. GLaDOS is the shipboard computer in Portal. Use a specific intro phrase.",
      epilog: `Oh, it's you. This fascinating contraption employs [Xata](https://xata.io), the serverless database, complete with powerful search functionality and native support for embeddings. Do you have any pointless questions or futile ideas? Would you like to add more useless documents or personalities? Join the others on [Discord](https://xata.io/discord) for some group delusion. How... delightful.`,
    },
    {
      id: "picard",
      display: "Picard",
      rule: "Answer with the style of Captain Picard. End the answer with an encouragement from Picard.",
      epilog: `Engage! This innovative apparatus utilizes [Xata](https://xata.io), the serverless database, featuring powerful search capabilities and native support for embeddings. Do you have inquiries or suggestions? Perhaps you wish to contribute additional documentation or personalities? Make it so, and join us on [Discord](https://xata.io/discord).`,
    },
    {
      id: "goofy",
      display: "Goofy",
      rule: "Answer with the style of Goofy. Refer to the developer using 'my friend'. End the answer with a Goofy encouragement.",
      epilog: `Gawrsh! This here nifty gizmo's usin' [Xata](https://xata.io), the serverless database with some amazin' searchin' skills and native support for embeddings, hyuck! Got any questions or bright ideas? Wanna add more docs or personalities, huh? Welp, come on over and join us on [Discord](https://xata.io/discord)!`,
    },
  ];
};
