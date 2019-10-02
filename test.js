// your desired application interface.
const actions = {
  async ping(params) {
    return 'pong'
  },
  async echo(params) {
    return params
  },
  async getMyStats({token}) {
    console.log(token)
    return {
      balance: 1337
    }
  },
  async listUsers() {
    return [
      {username: 'tacyarg'}
    ]
  }
}

const config = {
  port: 9001
}

// start the server
const web = require('.')(config, actions)

