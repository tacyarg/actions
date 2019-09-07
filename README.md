# uWebSockets-web

Abstraction of the uWebSockets lib, provides a simple http interface with json parsing.

> Offical Client: https://github.com/uNetworking/uWebSockets.js/blob/master/README.md

# Interface
> Below is a simple use case of the client.

```js

// your desired application interface.
const actions = {
  async ping() {
    return 'pong'
  }
}

const config {
  port: 9001
}

// start the server
const web = require('uWebSockets-web')(config, actions)
```