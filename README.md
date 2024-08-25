# Mini Command Line Tool

Provides a CLI framework with general capabilities.

## Installation

```bash
npm i -D @hong97/mini-cli
```

## Running

Add to the `script` in `package.json`:

```json
{
  "scripts": {
    "cli": "mini-cli",
  }
}

```

Then run:

```bash
npm run cli
```

You can run the CLI directly with its name:

```bash
npm run cli -- <name>
```

## Configuration

After installation, create a `.mini-cli` folder in your project directory:

```
|---
  |-- .mini-cli
  |-- ...
```

Then create a js file in the folder to create a CLI

For example, create a `build.js` file:

```
|---
  |-- .mini-cli
    |-- build.js
```

Create your CLI logic here:

```js
// .mini-cli/build.js

module.exports = {

  // The name of the CLI, required, can be triggered directly with mini-cli <name>
  name: 'build',

  // alias, optional, supports triggering with mini-cli <alias>
  alias: 'bd',

  async beforeRun() {

  },
  questions: [

  ],
  async run() {

  }
}
```

After successfully creating and configuring, execute npm run cli to see it, and you can choose to execute

You can also run a specific CLI directly with `npm run cli -- <name>` or `npm run cli -- <alias>`

---

I abstracted the execution of the CLI into 3 steps: `beforeRun()`, `questions`, and `run()`.

CLI often includes Q&A style interaction logic, which can be configured in `questions`:

> These 3 steps are not necessary for every step, you can omit them if not needed

### async beforeRun()

`beforeRun()` is executed before `questions`, where you can set some context for later use.

### questions

Template configuration questions, for example, the `questions` can be configured like this:

```js
const { prompts } = require('@hong97/mini-cli')

module.exports = {
  async beforeRun() {
    this.packages = fs.readdirSync('./packages').map(e => {
      return {
        name: e,
        disabled: !e.startsWith('lancer'),
      }
    })
  },
  questions: [
    {
      fn: prompts.confirm,
      options: {
        message: '🔨 Build after push?',
        default: false,
        timeout: 3000,
      },
      async handler(result) {
        this.build = !!result
      },
    },
    {
      fn: prompts.checkbox,
      skip() {
        return this.build
      },
      options() {
        return {
          message: '📦 Build package(s):\r\n',
          choices: this.packages.map(p => ({
            name: p.name,
            value: p.name,
            disabled: p.disabled,
            checked: p.name === this.currentPackage,
          })),
          required: true,
        }
      },
      async handler(result) {
        // ..
      }
    }
  ]
}
```

The `prompts` types and `options` settings refer to [inquirer](https://www.npmjs.com/package/inquirer)

In `options`, you can configure whether to skip a question with the `skip()` field, if it returns `true`, the question is skipped, otherwise not

Additionally, you can set a default value for a question and automatically continue after a timeout with the `default` and `timeout` fields

Each `question` has a `handler()` function, which receives the result of the question for you to handle

The `handler()` of each question is **executed immediately after the result is given**, not after all questions are collected.

### async run()

`run()` is executed after the questions are collected (if any), where you can consume your question results and execute the corresponding logic.

## this Context

In the CLI run, all contexts are stored in `this`. As seen above, during the `questions` stage, we store the results in `this` in the `handler()` callback of the question, which can be consumed in the `handler()` of later questions.

The same `this` context is shared across `beforeRun()`, `questions`, and `run()` stages, meaning you can pass information between different stages.

Additionally, this carries some read-only information by default, including:

- git
  - branch: branch name
  - email: git email

## Utility functions

`mini-cli` also provides some general utility functions:

```js
const { log, exit } = require('@hong97/mini-cli')
```