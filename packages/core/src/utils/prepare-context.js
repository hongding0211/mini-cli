const fs = require('fs')
const { execSync } = require('child_process')

const { log } = require('./log.js')

const ctx = {
  git: {},
}

function prepareContext() {
  try {
    Object.defineProperty(ctx.git, 'branch', {
      value: fs
        .readFileSync('.git/HEAD')
        .toString()
        .trim()
        .split('/')
        .splice(2)
        .join('/'),
      writable: false,
      configurable: false,
      enumerable: true,
    })
    Object.defineProperty(ctx.git, 'email', {
      value: execSync('git config user.email').toString().trim(),
      writable: false,
      configurable: false,
      enumerable: true,
    })
    Object.defineProperty(ctx, 'git', {
      writable: false,
      configurable: false,
      enumerable: true,
    })
  } catch (e) {
    log('error', 'Error occurred when collecting git info.')
    log('plain', e)
  }
}

module.exports = {
  ctx,
  prepareContext,
}
