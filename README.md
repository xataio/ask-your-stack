# Ask Your Stack - have ChatGPT query the docs of your stack

We have crawled and loaded in Xata the docs from several projects. Select your stack, ask a question and ChatGPT will query the docs of your stack and return the best answer.

Deployed at: [https://ask-your-stack.vercel.app/](https://ask-your-stack.vercel.app/)

## How it works

The app uses [Xata AI](https://xata.io/chatgpt) to query ChatGPT with context from the up-to-date docs. This provides more recent information and reduces hallucinations. It uses this high-level algorithm:

* Pass the question to ChatGPT and ask it to provide keywords
* Use the Xata search functionality to retrieve the most relevant docs
* Form a prompt using this context and the question and pass it to ChatGPT

This [blog post](https://xata.io/blog/keyword-vs-semantic-search-chatgpt) provides more details on the general approach.

## Development

If you want to deploy this application, start by creating a Xata database and crawling the data by running the instructions from [xata-crawler](https://github.com/tsg/xata-crawler).

### Install Project Dependencies

```bash
npm install
```

### Setup environment variables

Connect to your Xata database by running:

```
xata init
```

and selecting the database that you have created.

### Start the app

```bash
npm run dev
```
By default the app runs on [localhost:3000](http://localhost:3000)

# Questions?

IF you have any questions, or you'd like to request more documentations, please head over to our [Discord](https://xata.io/discord)