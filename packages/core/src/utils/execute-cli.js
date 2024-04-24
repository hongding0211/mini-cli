const { inquirer } = require('./inquirer.js')

async function executeCli(cli) {
  if (typeof cli?.beforeRun === 'function') {
    await cli.beforeRun.call(this)
  }
  if (cli?.questions?.length > 0) {
    await inquirer(cli.questions, this)
  }
  if (typeof cli?.run === 'function') {
    await cli.run.call(this)
  }
}

module.exports = {
  executeCli,
}
