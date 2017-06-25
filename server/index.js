'use strict'

import low from 'lowdb'
import storage from 'lowdb/file-async'

const production = process.env.NODE_ENV === 'production'
const http = production ? require('https') : require('http')
let options = null

// When using HTTPS we need to provide key and cert file.
if (production) {
  const fs = require('fs')

  options = {
    key: fs.readFileSync(process.env.ESTI_KEY_FILE),
    cert: fs.readFileSync(process.env.ESTI_CERT_FILE),
    ca: fs.readFileSync(process.env.ESTI_CA_FILE)
  }
}

const server = http.createServer(options)
const Socket = require('socket.io')
const io = Socket()

import { buildRoutes } from './utils'

import * as actions from '../actions/server'
import routeducers from './routeducers'

const routes = buildRoutes(actions, routeducers)

const db = low('db.json', { storage })
const rooms = {}

server.listen(process.env.ESTI_BACKEND_PORT || 3000, () => console.log('Listening...'))
io.attach(server)

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id)

  socket.on('action', (action) => {
    const route = routes[action.type]

    console.log('handling', action.type)

    if (!route) {
      console.warn(`No route found for: ${action.type}`)
      return
    }

    return route({ socket, action, rooms, io, db })
  })

  socket.on('disconnect', () => {
    routeducers.disconnect({ socket, rooms, io })
  })

  socket.on('error', (e) => console.error(e.stack))
})
