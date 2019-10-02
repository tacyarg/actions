const uWS = require('uWebSockets.js')
const assert = require('assert')
const { readJson } = require('./utils')

module.exports = ({ port = 9001 }, actions) => {
  assert(actions, 'actions required.')

  const app = uWS.App()

  app.get('/:action', async (res, req) => {
    res.writeHeader('Access-Control-Allow-Origin', '*')

    res.onAborted(() => {
      console.log("aborted.")
      res.aborted = true
      // res.close()
    })

    const action = req.getParameter(0)
    if (!actions[action]) return res.end(`Invalid Action: ${action}`)

    const query = req.getQuery().replace(/^.*\?/, '')
    const params = qs.parse(query)
    console.log(params)

    try {
      console.log('GET', 'calling action', action)
      const result = await actions[action]().then(JSON.stringify)
      if (!res.aborted) {
        res.end(result)
      }
    } catch (e) {
      console.error(e)
      res.writeStatus('500')
      res.end(e.message)
    }
  })

  app.post('/:action', async (res, req) => {
    res.writeHeader('Access-Control-Allow-Origin', '*')

    res.onAborted(() => {
      console.log("aborted.")
      res.aborted = true
      // res.close()
    })

    const action = req.getParameter(0)
    if (!actions[action]) return res.end(`Invalid Action: ${action}`)

    try {
      let params = await readJson(res)
      params ? params : {}
      console.log('POST', 'calling action', action, params)
      const result = await actions[action](params).then(JSON.stringify)
      if (!res.aborted) {
        res.end(result)
      }
    } catch (e) {
      console.error(e)
      res.writeStatus('500')
      res.end(e.message)
    }
  })

  app.get('/*', (res, req) => {
    res.writeHeader('Access-Control-Allow-Origin', '*')
    res.writeHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(Object.keys(actions)))
  })

  app.listen(port, token => {
    if (token) {
      console.log('Listening to port ' + port)
    } else {
      console.log('Failed to listen to port ' + port)
    }
  })
}
