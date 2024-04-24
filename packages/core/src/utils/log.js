const chalk = require('chalk')

/**
 *
 * @param {'error' | 'warn' | 'success' | 'info' | 'plain'} type
 * @param {string} message
 */
function log(type, message) {
  switch (type) {
    case 'error':
      console.log(`${chalk.bgRed.bold(' ERR ')}`, chalk.red(message))
      break
    case 'warn':
      console.log(
        `${chalk.bgYellow.black.bold(' WARN ')}`,
        chalk.yellow(message),
      )
      break
    case 'success':
      console.log(`${chalk.bgGreen.bold(' DONE ')}`, chalk.green(message))
      break
    case 'info':
      console.log(`${chalk.bgBlue.bold(' INFO ')}`, chalk.blue(message))
      break
    case 'plain':
      console.log(message)
      break
    default:
      console.log(message)
  }
}

module.exports = {
  log,
}
