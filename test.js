// your desired application interface.
const actions = {
  async ping(params) {
    return 'pong'
  },
  async echo(params) {
    return params
  },
  async getStats(params) {
    return {
      balance: 1337
    }
  }
}

const config = {
  port: 9001
}

// start the server
const web = require('.')(config, actions)

