'use strict'

const http = require('http')
const server = http.createServer()
const Socket = require('socket.io')
const io = Socket()

const low = require('lowdb')
const storage = require('lowdb/file-async')

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

function claimRoom (name, token) {
  let room = db('rooms').find({ name })

  if (!room) {
    console.log('claimed room:', room, 'with token:', token)
    room = { name, token }
  }

  if (room.token !== token) {
    return Promise.resolve(false)
  }

  return db('rooms')
    .push(room)
    .then(() => true)
    .catch(console.error)
}

server.listen(3000)
io.attach(server)

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id)

  socket.on('action', (action) => {
    if (action.type === 'server/room') {
      const room = action.room
      console.log(socket.id, 'joins room:', room)
      socket.join(room)

      if (rooms.has(room)) {
        socket.broadcast.to(room).emit('action', { type: 'client/connect' })
      }
    }

    if (action.type === 'server/claim') {
      const room = action.room
      const token = action.token

      claimRoom(room, token)
        .then((claimed) => {
          if (claimed) {
            addPM(room, socket.id)
            socket.broadcast.to(room).emit('action', { type: 'room/pm' })
          }

          socket.emit('pm', { error: !claimed })
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

      socket.emit('action', {
        type: 'ticket/information',
        data: {
          id: 'HWZ-42',
          title: 'Foo',
          description: 'Some text about this ticket'
        }
      })
    }

    if (action.type === 'server/round') {
      const room = action.room
      const data = action.data

      socket.broadcast.to(room).emit('action', { type: 'vote/start', data })
    }

    if (action.type === 'server/vote') {
      const room = rooms.get(action.room)
      const value = action.value

      if (!room) {
        socket.emit('action', { type: 'vote/error', error: true, message: 'No such room' })
        return
      }

      // .. do stuff
    }
  })
})
