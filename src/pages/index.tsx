import { fetchEventSource } from "@microsoft/fetch-event-source";
import { InferGetStaticPropsType } from "next";
import Head from "next/head";
import { useCallback, useState, useEffect } from "react";
import styles from "~/styles/Home.module.css";
import { getDocs, getPersonalities } from "~/options";
import { z } from "zod";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";

export async function getStaticProps() {
  const docSections = getDocs();
  const personalities = getPersonalities();

  return { props: { docSections, personalities } };
}

const useAskXataDocs = () => {
  const [answer, setAnswer] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [records, setRecords] = useState<string[]>([]);

  const askQuestion = useCallback(
    (question: string, checked: string[], personality: string) => {
      if (!question) return;

      setAnswer(undefined);
      setIsLoading(true);

      void fetchEventSource(`/api/ask`, {
        method: "POST",
        body: JSON.stringify({
          question,
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

export const useGetXataDocs = (ids: string[] = []) => {
  const [relatedDocs, setRelatedDocs] = useState<XataDocsResponse>([]);

  useEffect(() => {
    if (ids?.length === 0) {
      setRelatedDocs([]);
      return;
    }

    const fetchData = async () => {
      const response = await fetch(`/api/docs-get`, {
        method: "POST",
        body: JSON.stringify({ ids }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      setRelatedDocs(xataDocsResponse.parse(data));
    };
    fetchData();
  }, [ids]);

  const clearRelated = useCallback(() => {
    setRelatedDocs([]);
  }, []);

  return { relatedDocs, clearRelated };
};

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    // Check if running on the client-side
    if (typeof window !== "undefined") {
      try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : initialValue;
      } catch (error) {
        console.error(error);
        return initialValue;
      }
    }
    return initialValue;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      } catch (error) {
        console.error(error);
      }
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

export default function Home({
  docSections,
  personalities,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [question, setQuestion] = useState<string>("");
  const [checked, setChecked] = useLocalStorage<string[]>("docsChecked", []);
  const [personality, setPersonality] = useLocalStorage<string>(
    "personality",
    personalities[0].id
  );
  const [sampleQuestions, setSampleQuestions] = useState<string[]>([]);

  const { answer, isLoading, records, askQuestion } = useAskXataDocs();
  const { relatedDocs, clearRelated } = useGetXataDocs(records);

  useEffect(() => {
    const sampleQuestions: string[] = [];
    for (const question of docSections) {
      for (const doc of question.docs) {
        if (doc.sampleQuestion && checked.includes(doc.id)) {
          if (!sampleQuestions.includes(doc.sampleQuestion)) {
            sampleQuestions.push(doc.sampleQuestion);
          }
        }
      }
    }
    setSampleQuestions(sampleQuestions);
  }, [checked, docSections]);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearRelated();
    askQuestion(question, checked, personality);
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

  const handleSampleClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    event.preventDefault(); // Prevent the default navigation behavior
    setQuestion(event.currentTarget.innerText);
    clearRelated();
    askQuestion(event.currentTarget.innerText, checked, personality);
  };

  let epilog = personalities[0].epilog!;
  for (const p of personalities) {
    if (p.id === personality && p.epilog) {
      epilog = p.epilog;
    }
  }

  return (
    <>
      <Head>
        <title>Ask your Stack by Xata</title>
        <meta
          name="description"
          content="Ask ChatGPT questions from the docs of your tech stack"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>Ask Your Stack</h1>
          <h3>Select the docs</h3>
          <div className={styles.grid}>
            {docSections.map(({ id, name, docs }) => (
              <div key={`section-${id}`}>
                <h5>{name}</h5>
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
              placeholder={"Write a question here..."}
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
          ) : sampleQuestions.length > 0 ? (
            <div>
              <p>No inspiration? Try one of these:</p>
              {sampleQuestions.map((q) => (
                <li key={q}>
                  <a href="#" onClick={handleSampleClick}>
                    {q}
                  </a>
                </li>
              ))}
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
              <p>
                Disclaimer: the above answer is generated via the ChatGPT API.
                Even when provided with the right context, it might hallucinate
                and invent its own functions and parameters. You might want to
                check the answers by visiting the above links.
              </p>
              <ReactMarkdown>{epilog}</ReactMarkdown>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
