# actions-http

Abstraction of the uWebSockets lib, provides a simple http interface with json parsing.

> Offical Client: https://github.com/uNetworking/uWebSockets.js/blob/master/README.md

# Interface

```
yarn add actions-http
```

## Setup
> Below is a simple use case of the client.

```js
// your desired application interface.
const actions = {
  async ping(params) {
    return 'pong'
  },
  async echo(params) {
    return params
  }
}

const config {
  port: 9001
}

// start the server
const web = require('uWebSockets-web')(config, actions)
```

## Call

```js
const request = require('request')

request.post('http://localhost:9001/echo', {
  // some json body
  test: true
})

request.get('http://localhost:9001/ping')
```