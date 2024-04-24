#!/usr/bin/env node
const {
  ctx,
  executeCli,
  exit,
  inquirer,
  log,
  prepareContext,
  validateClis,
} = require('./utils/index.js')
const { select } = require('@inquirer/prompts')
const fs = require('fs')

const args = process.argv.slice(2)
const command = args[0]

// Check if .mini-cli directory exists
if (!fs.existsSync('./.mini-cli')) {
  log('info', 'No .mini-cli directory found.')
  exit(0)
}

// Read all js files in .mini-cli directory
const files = fs
  .readdirSync('./.mini-cli')
  .filter(file => file.endsWith('.js'))
if (files.length === 0) {
  log('info', 'No CLI(s) found.')
  exit(0)
}

let clis = []
for (const file of files) {
  clis.push(require(process.cwd() + `/.mini-cli/${file}`))
}
clis = validateClis(clis)
if (!clis.length) {
  log('error', 'No valid CLI(s) found.')
  exit(1)
}

prepareContext()

if (command) {
  // User specified a command, execute it with name or it's alias
  for (let i = 0; i < clis.length; i++) {
    if (command === clis[i].name || command === clis[i].alias) {
      executeCli.call(ctx, clis[i])
      return
    }
  }
  log('warn', `No CLI found with name or alias "${command}".`)
} else {
  // User didn't specify a command, prompt them to select one
  inquirer([
    {
      fn: select,
      options: {
        message: 'Select a command:\r\n',
        choices: clis.map(c => ({
          name: c.name,
          value: c.name,
        })),
      },
      async handler(result) {
        const cli = clis.find(c => c.name === result)
        if (!cli) {
          log('error', 'No CLI found.')
          exit(0)
        }
        await executeCli.call(ctx, cli)
      },
    },
  ])
}
