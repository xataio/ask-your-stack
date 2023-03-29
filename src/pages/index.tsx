import { fetchEventSource } from "@microsoft/fetch-event-source";
import { InferGetStaticPropsType } from "next";
import Head from "next/head";
import { useCallback, useState, useEffect } from "react";
import styles from "~/styles/Home.module.css";
import { getDatabases, getDocs, getPersonalities } from "~/xata";
import { z } from "zod";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";

export async function getStaticProps() {
  const dbs = [];

  for (const database of getDatabases()) {
    const { id, name, client: xata, lookupTable } = database;
    const { aggs } = await xata.db[lookupTable]?.aggregate({
      total: { count: "*" },
    });

    dbs.push({ id, name, recordCount: aggs.total });
  }

  const docSections = getDocs();
  const personalities = getPersonalities();

  return { props: { dbs, docSections, personalities } };
}

function prettyFormatNumber(num: number) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const useAskXataDocs = () => {
  const [answer, setAnswer] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [records, setRecords] = useState<string[]>([]);

  const askQuestion = useCallback(
    (
      database: string,
      question: string,
      checked: string[],
      personality: string
    ) => {
      if (!question) return;

      setAnswer(undefined);
      setIsLoading(true);

      void fetchEventSource(`/api/ask`, {
        method: "POST",
        body: JSON.stringify({
          question,
          database,
          checkedDocs: checked,
          personality,
        }),
        headers: { "Content-Type": "application/json" },
        openWhenHidden: true,
        onmessage(ev) {
          try {
            const { answer = "", records, done } = JSON.parse(ev.data);
            if (records) {
              setRecords(records);
              console.log("stop");
              throw new Error("stop");
            }
            setAnswer((prev = "") => `${prev}${answer}`);
            setIsLoading(!done);
          } catch (e) {}
        },
        onclose() {
          console.log("onclose");
          // do nothing to stop the operation
        },
        onerror(err) {
          console.log("onerror", err);
          throw err; // rethrow to stop the operation
        },
      });
    },
    []
  );

  // Clear answer function
  const clearAnswer = useCallback(() => {
    setAnswer(undefined);
    setIsLoading(false);
    setRecords([]);
  }, []);

  return { isLoading, answer, records, askQuestion, clearAnswer };
};

const xataDocsResponse = z.array(
  z.object({
    id: z.string(),
    title: z.string(),
    url: z.string(),
    website: z.string(),
  })
);

export type XataDocsResponse = z.infer<typeof xataDocsResponse>;

export const useGetXataDocs = (database: string, ids: string[] = []) => {
  const [relatedDocs, setRelatedDocs] = useState<XataDocsResponse>([]);

  useEffect(() => {
    if (ids?.length === 0) {
      setRelatedDocs([]);
      return;
    }

    const fetchData = async () => {
      const response = await fetch(`/api/docs-get`, {
        method: "POST",
        body: JSON.stringify({ database, ids }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      setRelatedDocs(xataDocsResponse.parse(data));
    };
    fetchData();
  }, [database, ids]);

  const clearRelated = useCallback(() => {
    setRelatedDocs([]);
  }, []);

  return { relatedDocs, clearRelated };
};

export default function Home({
  dbs,
  docSections,
  personalities,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [question, setQuestion] = useState<string>("");
  const [selected, setSelected] = useState<string>(dbs[0].id);
  const [checked, setChecked] = useState<string[]>([]);
  const [personality, setPersonality] = useState<string>(personalities[0].id);

  const { answer, isLoading, records, askQuestion } = useAskXataDocs();
  const { relatedDocs, clearRelated } = useGetXataDocs(selected, records);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearRelated();
    askQuestion(selected, question, checked, personality);
  };

  // Add/Remove checked item from list
  const handleCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    var updatedList = [...checked];
    if (event.target.checked) {
      updatedList = [...checked, event.target.value];
    } else {
      updatedList.splice(checked.indexOf(event.target.value), 1);
    }
    setChecked(updatedList);
  };

  const handlePersonalityChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPersonality(event.target.value);
  };

  return (
    <>
      <Head>
        <title>Ask your Stack</title>
        <meta name="description" content="Xata Chat Demo" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>Ask Your Stack</h1>

          <div className={styles.grid}>
            {docSections.map(({ id, name, docs }) => (
              <div key={`section-${id}`}>
                <h3>{name}</h3>
                <div className={styles.grid}>
                  {docs.map(({ id, name }) => (
                    <div key={`website-${id}`}>
                      <input
                        type="checkbox"
                        value={id}
                        onChange={handleCheck}
                        checked={checked.includes(id)}
                      ></input>{" "}
                      <label htmlFor={id}>{name}</label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <h3>Select personality</h3>
          <div className={styles.grid}>
            {personalities.map(({ id, display }) => (
              <div key={`personality-${id}`}>
                <input
                  type="radio"
                  value={id}
                  onChange={handlePersonalityChange}
                  checked={personality === id}
                ></input>{" "}
                <label htmlFor="eli5">{display}</label>
              </div>
            ))}
          </div>
          <form className={styles.inputGroup} onSubmit={handleFormSubmit}>
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className={styles.input}
              placeholder={"Write a question to ask the chatbot"}
            />
            <div className={styles.inputRightElement}>
              <button className={styles.button} type="submit">
                Ask
              </button>
            </div>
          </form>
          {answer ? (
            <ReactMarkdown>{answer}</ReactMarkdown>
          ) : isLoading ? (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <span className={styles.loader} />
            </div>
          ) : null}
          {relatedDocs.length > 0 && (
            <div className={styles.relatedDocs}>
              <p>I have used the following doc pages as context:</p>
              {relatedDocs.map(({ id, title, url }) => (
                <li key={id}>
                  <a href={url} target="_blank">
                    {title}
                  </a>
                </li>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
