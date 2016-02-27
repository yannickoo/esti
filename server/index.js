'use strict'

const http = require('http')
const server = http.createServer()
const Socket = require('socket.io')
const io = Socket()

import { buildRoutes } from './utils'

import * as actions from '../actions/server'
import routeducers from './routeducers'

const routes = buildRoutes(actions, routeducers)

const rooms = {}

server.listen(3000, () => console.log('Listening...'))
io.attach(server)

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id)

  socket.on('action', (action) => {
    const route = routes[action.type]

    if (!route) {
      console.warn(`No route found for: ${action.type}`)
      return
    }

    return route({ socket, action, rooms, io })
  })

  socket.on('disconnect', () => {
    routeducers.disconnect({ socket, rooms, io })
  })
})
