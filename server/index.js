'use strict'

const http = require('http')
const server = http.createServer()
const Socket = require('socket.io')
const io = Socket()

const low = require('lowdb')
const storage = require('lowdb/file-async')

import { userConnected, userDisconnected, pmConnected, pmUnavailable } from '../actions/room'
import { joined, authenticated, kicked, setName } from '../actions/user'
import { ticketInfo } from '../actions/pm'
import { start, end, userVote } from '../actions/round'

import * as round from '../actions/round'
import * as actions from '../actions/server'

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

function addUser (roomName, user) {
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
    if (action.type === actions.JOIN) {
      const { name, room } = action
      const user = { name, socket: socket.id }
      const { users, managers } = rooms.get(room)

      console.log(name, `(${socket.id})`, 'joins room:', room)

      socket.username = name
      socket.room = room
      socket.join(room)
      socket.emit(joined({ name, users, managers }))

      addUser(room, user)

      console.log('Sending userConnected to', room)
      socket.broadcast.to(room).emit('action', userConnected(user))
    }

    if (action.type === actions.CLAIM) {
      const { room, token } = action

      socket.join(room)

      claimRoom(room, token)
        .then((claimed) => {
          if (claimed) {
            addPM(room, socket.id)
            socket.userRooms = socket.userRooms || []
            socket.userRooms.push(room)
            io.in(room).emit('action', pmConnected())
          }

          socket.emit('action', authenticated(claimed))
        })
        .catch(console.error)
    }

    if (action.type === actions.USER_KICK) {
      const roomName = action.room
      const room = rooms.get(roomName)
      const id = action.id
      const users = Array.from(room.users.values())

      const userIndex = users.findIndex((u) => u.socket === id)
      const user = users.find((u) => u.socket === id)

      if (userIndex !== -1) {
        room.users.delete(userIndex)

        if (io.sockets.sockets[id]) {
          io.sockets.sockets[id].emit('action', kicked())
        }

        socket.broadcast.to(roomName).emit('action', userDisconnected(user.name))

        rooms.set(roomName, room)
      }
    }

    if (action.type === actions.TICKET) {
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

    if (action.type === actions.START) {
      const room = action.room
      const data = action.data

      socket.broadcast.to(room).emit('action', start(data))
    }

    if (action.type === actions.VOTE) {
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
    const username = socket.username

    userRooms.forEach((room) => {
      const mapRoom = rooms.get(room)

      console.log('Diconnect', username, 'from', room)

      if (!mapRoom) {
        return
      }

      const managerIndex = Array.from(mapRoom.managers.values()).findIndex((s) => s === socket.id)
      const userIndex = Array.from(mapRoom.users.values()).findIndex((u) => u.socket === socket.id)

      if (managerIndex !== -1) {
        console.log('Delete', username, 'from', room, 'manager list')
        mapRoom.managers.delete(managerIndex)

        // It seems like size property was not updated after deleting manager.
        if (!mapRoom.managers.size - 1) {
          console.log('There is no PM in', room)
          socket.broadcast.to(room).emit('action', pmUnavailable())
        }
      }

      if (userIndex !== -1) {
        console.log('Delete', username, 'from', room, 'user list')
        mapRoom.users.delete(userIndex)
      }

      socket.broadcast.to(room).emit('action', userDisconnected(username))

      rooms.set(room, mapRoom)
    })
  })
})
