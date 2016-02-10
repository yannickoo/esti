'use strict'

const http = require('http')
const server = http.createServer()
const Socket = require('socket.io')
const io = Socket()

const low = require('lowdb')
const storage = require('lowdb/file-async')

import { userConnected, userDisconnected, pmConnected, pmUnavailable } from '../actions/room'
import { authenticated, setName } from '../actions/user'
import { ticketInfo } from '../actions/pm'
import { start, end, userVote } from '../actions/round'

const db = low('db.json', { storage })

const rooms = new Map()

function Room () {
  return {
    managers: new Set([]),
    users: new Set([]),
    round: null
  }
}

function addPM (roomName, socket) {
  let room = rooms.get(roomName)

  if (!room) {
    room = Room()
  }

  if (!room.managers.has(socket)) {
    room.managers.add(socket)
  }

  rooms.set(roomName, room)
}

function addUser(roomName, user) {
  let room = rooms.get(roomName)

  if (!room) {
    room = Room()
  }

  if (!room.users.has(user)) {
    room.users.add(user)
  }

  rooms.set(roomName, room)
}

function claimRoom (name, token) {
  let room = db('rooms').find({ name })
  const roomExists = !!room

  if (!room) {
    console.log('claimed room:', name, 'with token:', token)
    room = { name, token }
  }

  if (room.token !== token) {
    return Promise.resolve(false)
  }

  if (!roomExists) {
    return db('rooms')
      .push(room)
      .then(() => true)
      .catch(console.error)
  }

  return Promise.resolve(true)
}

server.listen(3000, () => console.log('Listening...'))
io.attach(server)

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id)

  socket.on('action', (action) => {
    if (action.type === 'server/join') {
      const { name, room } = action
      const user = { name, socket: socket.id }
      console.log(name, `(${socket.id})`, 'joins room:', room)
      console.log('DEBUG', rooms.has(room), rooms.get(room))
      const hasPm = rooms.has(room) && rooms.get(room).managers.length
      const pmAction = hasPm ? pmConnected() : pmUnavailable()

      socket.username = name
      socket.userRooms = socket.userRooms || [];
      socket.userRooms.push(room)
      socket.join(room)

      addUser(room, user)

      console.log('Sending userConnected to', room)
      io.in(room).emit('action', userConnected(user))
      io.in(room).emit('action', pmAction)
    }

    if (action.type === 'server/claim') {
      const { room, token } = action

      socket.join(room)

      claimRoom(room, token)
        .then((claimed) => {
          if (claimed) {
            addPM(room, socket.id)
            io.in(room).emit('action', pmConnected())
          }

          socket.emit('action', authenticated(claimed))
        })
        .catch(console.error)
    }

    if (action.type === 'server/ticket') {
      const room = rooms.get(action.room)
      const ticket = action.ticket

      if (!room || !room.managers.has(socket)) {
        socket.emit('action', { type: 'ticket', error: true })
        return
      }

      console.log('Fetching information for JIRA ticket:', ticket)
      // jira
      //   .find(ticket)
      //   .then((information) => send)
      //   .catch(console.error)

      socket.emit('action', ticketInfo({
        id: 'HWZ-42',
        title: 'Foo',
        description: 'Some text about this ticket'
      }))
    }

    if (action.type === 'server/round') {
      const room = action.room
      const data = action.data

      socket.broadcast.to(room).emit('action', start(data))
    }

    if (action.type === 'server/vote') {
      const room = rooms.get(action.room)
      const { user, estimation } = action

      if (!room) {
        socket.emit('action', { type: 'vote/error', error: true, message: 'No such room' })
        return
      }

      room.managers.forEach((manager) => manager.emit('action', userVote(user, estimation)))
    }
  })

  socket.on('disconnect', () => {
    const userRooms = socket.userRooms || []
    userRooms.forEach((room) => {
      socket.broadcast.to(room).emit('action', userDisconnected(socket.username))
      console.log(socket.username, 'has been disconnected from', room)
    })
  })
})
