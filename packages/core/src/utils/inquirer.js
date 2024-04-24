async function inquirer(questions, ctx) {
  const results = []

  for (const q of questions) {
    const { fn, options: _options, handler } = q
    if (typeof q.skip === 'function' && q.skip.call(ctx)) {
      results.push(null)
      continue
    }
    const options =
      typeof _options === 'function' ? _options.call(ctx) : _options
    const answer = fn(options)
    let result
    if (!options.timeout) {
      result = await answer
    } else {
      result = await Promise.race([
        answer,
        new Promise(resolve => {
          setTimeout(() => {
            answer.cancel()
            resolve(options.default)
          }, options.timeout)
        }),
      ])
    }
    results.push(result)
    handler.call(ctx, result)
  }

  return results
}

module.exports = {
  inquirer,
}
