'use strict'

const http = require('http')
const server = http.createServer()
const Socket = require('socket.io')
const io = Socket()

import { userDisconnected } from '../actions/room'
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
    const roomName = socket.room
    const room = rooms[roomName]

    if (!room) {
      return
    }

    const user = room.users.find((u) => u.socket === socket.id)

    if (!user) {
      return
    }

    room.removeUser(user)

    io.to(roomName).emit('action', userDisconnected(user))
  })
})
