# Mini Command Line Tool

提供一个通用能力的 CLI 框架

## 安装

```bash
npm i -D @hong97/mini-cli
```

## 运行

在 `package.json` 的 `script` 中添加：

```json
{
  "scripts": {
    "cli": "mini-cli",
  }
}

```

然后运行：

```bash
npm run cli
```

你可以携带 CLI 的名字直接运行:

```bash
npm run cli -- <name>
```

## 配置

安装完成后，在你的项目目录内新建一个 `.mini-cli` 文件夹

```
|---
  |-- .mini-cli
  |-- ...
```

然后在在文件夹中新建一个 `js` 文件即可创建一个 CLI

例如，创建一个 `build.js` 文件：

```
|---
  |-- .mini-cli
    |-- build.js
```

在这里创建你的 CLI 运行逻辑：

```js
// .mini-cli/build.js

module.exports = {

  // CLI 的名字，必填，可以直接使用 mini-cli <name> 触发
  name: 'build',

  // alias, 可选，支持 mini-cli <alias> 触发
  alias: 'bd',

  async beforeRun() {

  },
  questions: [

  ],
  async run() {

  }
}
```

当你成功创建并配置后，执行 `npm run cli` 就可以看到它了，并可以选择执行

![2](./images/2.png)

你也可以使用 `npm run cli -- <name>` 或 `npm run cli -- <alias>` 来直接运行某一 CLI

---

我将 CLI 的执行抽象成了 3 个步骤，分别是：`beforeRun()`, `questions` 以及 `run()`

CLI 通常会包含 Q&A 式的交互逻辑，例如下图，这些内容可以在 `questions` 中配置

![1](./images/1.png)

> 这 3 个步骤并不是每一步都需要，如果没有必要，可以不设置

### async beforeRun()

`beforeRun()` 在 `questions` 之前执行，你可以在这里设置一些 context 供后面消费

### questions

模板化的配置 `questions`，例如上面图片的问题可以这样配置:

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

这里的 `prompts` 类型以及 `options` 设置参考 [inquirer](https://www.npmjs.com/package/inquirer)

在 `options` 中，我们可以配置是否跳过某一问题，使用 `skip()` 字段，若返回 `true` 则跳过该问题，反之不跳过

此外，还可以通过 `default` 配合 `timeout` 字段设置某一问题是否有默认值，以及超时自动继续

每一个 `question` 都有一个 `handler()` 函数，它接受问题的结果，并留给你处理

每个问题的 `handler()` **是在问题结果给到后立刻执行的**，而不是在所有问题收集完成后执行。

### async run()

`run()` 在问题收集完成后（若果有）执行，在这里你可以消费你的问题结果并执行相应的逻辑

## this 上下文

在 CLI 运行中，所有上下文都储存在 `this` 中。从上面可以看到，在 `questions` 阶段，我们在问题的 `handler()` 回调中将结果存储在了 `this` 中，它可以在后面的问题 `handler()` 中消费。

在 `beforeRun()`, `questions` 以及 `run()` 阶段共享的是一个 `this` 上下文，这意味着你可以在不同阶段传递信息。

此外，`this` 中默认携带了些只读信息，它们包括：

- git
  - branch: 分支名
  - email: git 邮箱

## 工具函数

miniCLI 还提供了一些通用的工具函数，你可以直接引用

```js
const { log, exit, triggerPipeline } = require('@hong97/mini-cli')
```