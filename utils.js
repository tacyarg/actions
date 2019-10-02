exports.CleanStack = (ignore = []) => (stack, start = 0, end) => {
  return stack
    .split('\n')
    .slice(start, end)
    .filter(line => {
      return ignore.reduce((result, regex) => {
        return result && !regex.test(line)
      }, true)
    })
    .join('\n')
}

const cleanStack = exports.CleanStack([
  /node_modules/,
  /streamify/,
  /calls\.js/,
  /client\.js/,
  /mock\.js/,
  /\<anonymous\>/,
  /\internal\/process/,
])

exports.cleanStack = cleanStack

exports.parseError = ({ message = '', stack = '', code = '' } = {}) => {
  // assert(err.message, 'requires error message')
  return {
    message: message,
    code: code || null,
    stack: cleanStack(stack || ''),
  }
}

exports.readJson = res =>
  new Promise((resolve, reject) => {
    let buffer

    /* Register data cb */
    res.onData((ab, isLast) => {
      let chunk = Buffer.from(ab)
      if (isLast) {
        let json
        if (buffer) {
          try {
            json = JSON.parse(Buffer.concat([buffer, chunk]))
          } catch (e) {
            /* res.close calls onAborted */
            // res.close()
            // return 
            return reject(e)
          }
          resolve(json)
        } else {
          try {
            json = JSON.parse(chunk)
          } catch (e) {
            /* res.close calls onAborted */
            // res.close()
            // return
            return reject(e)
            // return resolve({})
          }
          resolve(json)
        }
      } else {
        if (buffer) {
          buffer = Buffer.concat([buffer, chunk])
        } else {
          buffer = Buffer.concat([chunk])
        }
      }
    })
  })
