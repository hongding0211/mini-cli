function validateClis(clis) {
  return clis.filter((cli, idx) => {
    // Name must be specified
    if (!cli.name) {
      log('error', 'Name must be specified for CLI.')
      return false
    }
    // Name or alias must be unique
    for (let i = 0; i < clis.length; i++) {
      if (i !== idx && clis[i].name === cli.name) {
        log('error', `CLI name "${cli.name}" is duplicated.`)
        exit(1)
      }
      if (
        i !== idx &&
        cli?.alias &&
        clis[i]?.alias &&
        clis[i].alias === cli.alias
      ) {
        log('error', `CLI alias "${cli.alias}" is duplicated.`)
        exit(1)
      }
    }
    return true
  })
}

module.exports = {
  validateClis,
}
