var Express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
var bearerToken = require('express-bearer-token')
var cookieParser = require('cookie-parser')

const { parseError } = require('./utils')

var assert = require('assert')

module.exports = async (config, actions) => {
  assert(actions, 'actions required.')

  assert(config.port, 'requires express port')

  var app = Express()

  app.use(cors())
  app.use(bodyParser.json({ limit: '50mb' }))
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(cookieParser(config.secret))
  app.use(bearerToken())

  app.options('*', cors())

  app.get('/favicon.ico', (req, res) => res.status(204))

  app.get('/', (req, res, next) => {
    const ip =
      req.headers['x-forwarded-for'] ||
      req.headers['x-real-ip'] ||
      req.connection.remoteAddress
    console.log(ip, 'requesting', '/')

    return res.json(Object.keys(actions))
  })

  app.get('/:action', (req, res, next) => {
    const ip =
      req.headers['x-forwarded-for'] ||
      req.headers['x-real-ip'] ||
      req.connection.remoteAddress
    console.log(ip, 'requesting', req.params.action, req.query)

    const action = req.params.action
    if (!actions[action]) return next('Action does not exist.')
    return actions[action](req.query)
      .then(res.json.bind(res))
      .catch(next)
  })

  app.post('/:action', (req, res, next) => {
    const ip =
      req.headers['x-forwarded-for'] ||
      req.headers['x-real-ip'] ||
      req.connection.remoteAddress
    console.log(ip, 'requesting', req.params.action, req.body)

    const action = req.params.action
    if (!actions[action]) return next('Action does not exist.')
    return actions[action](req.body)
      .then(res.json.bind(res))
      .catch(next)
  })

  app.use(function(req, res, next) {
    const ip =
      req.headers['x-forwarded-for'] ||
      req.headers['x-real-ip'] ||
      req.connection.remoteAddress
    console.log(ip, 'requesting', config.service, req.params.action)
    next(new Error('Invalid Request'))
  })

  app.use(function(err, req, res, next) {
    // console.log(err)
    console.log('Error', err.message, parseError(err).stack)
    res.status(500).send(err.message || err)
  })

  return new Promise(res => {
    app.listen(config.port, function() {
      console.log('listening on port', config.port)
      res(app)
    })
  })
}

// const uWS = require('uWebSockets.js')
// const assert = require('assert')
// const { readJson } = require('./utils')

// module.exports = ({ port = 9001 }, actions) => {
//   assert(actions, 'actions required.')

//   const app = uWS.App()

//   app.get('/:action', async (res, req) => {
//     res.writeHeader('Access-Control-Allow-Origin', '*')

//     res.onAborted(() => {
//       console.log("aborted.", action, params)
//       res.aborted = true
//       // res.close()
//     })

//     const action = req.getParameter(0)
//     if (!actions[action]) return res.end(`Invalid Action: ${action}`)

//     try {
//       console.log('GET', 'calling action', action)
//       const result = await actions[action]({}).then(JSON.stringify)
//       if (!res.aborted) {
//         res.end(result)
//       }
//     } catch (e) {
//       console.log('GET', e)
//       res.writeStatus('500')
//       res.end(e.message)
//     }
//   })

//   app.post('/:action', async (res, req) => {

//     res.onAborted(() => {
//       console.log("aborted.", action, params)
//       res.aborted = true
//       // res.close()
//     })

//     const action = req.getParameter(0)
//     if (!actions[action]) return res.end(`Invalid Action: ${action}`)

//     try {
//       let params = await readJson(res)
//       console.log('POST', 'calling action', action, params)
//       const result = await actions[action](params = {}).then(JSON.stringify)
//       if (!res.aborted) {
//         res.writeHeader('Access-Control-Allow-Origin', '*')
//         res.end(result)
//       }
//     } catch (e) {
//       console.log('POST', e)
//       res.writeStatus('500')
//       res.end(e.message)
//     }
//   })

//   app.get('/*', (res, req) => {
//     res.writeHeader('Access-Control-Allow-Origin', '*')
//     res.writeHeader('Content-Type', 'application/json')
//     res.end(JSON.stringify(Object.keys(actions)))
//   })

//   app.listen(port, token => {
//     if (token) {
//       console.log('Listening to port ' + port)
//     } else {
//       console.log('Failed to listen to port ' + port)
//     }
//   })
// }
