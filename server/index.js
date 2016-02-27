'use strict'

const http = require('http')
const server = http.createServer()
const Socket = require('socket.io')
const io = Socket()

const low = require('lowdb')
const storage = require('lowdb/file-async')

import Room, { slug } from './room'

import { userConnected, userNamechange, userDisconnected, unlocked } from '../actions/room'
import { joined, authenticated, setName, kicked } from '../actions/user'
import { ticketInfo, userVote } from '../actions/pm'
import { start, end, vote, voteSelected, recommended, setPoints } from '../actions/round'

import * as actions from '../actions/server'

const db = low('db.json', { storage })

const rooms = {}

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

function joinedAction (socket, action) {
  const { name, room: roomName } = action
  const user = { name, socket: socket.id }
  const slugged = slug(roomName)
  const room = rooms[slugged] || new Room(roomName)

  console.log(name, `(${socket.id})`, 'joins room:', roomName)

  socket.username = name
  socket.room = slugged
  socket.join(slugged)

  socket.emit('action', joined({
    name,
    users: room.users
  }))

  room.addUser(user)

  console.log('Sending userConnected to', slugged)
  socket.broadcast.to(slugged).emit('action', userConnected(user))

  rooms[slugged] = room
}

server.listen(3000, () => console.log('Listening...'))
io.attach(server)

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id)

  socket.on('action', (action) => {
    if (action.type === actions.JOIN) {
      joinedAction(socket, action)
    }

    if (action.type === actions.CLAIM) {
      const { username, room: roomName, token } = action

      const slugged = slug(roomName)

      claimRoom(slugged, token)
        .then((claimed) => {
          let room = rooms[slugged]

          if (claimed) {
            if (!room) {
              joinedAction(socket, {
                name: username,
                room: roomName
              })

              room = rooms[slugged]
            }

            const user = room.users.find((u) => u.socket === socket.id)
            const roomUser = room
              .findUser(user)

            roomUser.pm = true

            socket.to(slugged).emit('action', unlocked(roomUser))
          }

          socket.emit('action', authenticated(claimed))
        })
        .catch(console.error)
    }

    if (action.type === actions.USER_KICK) {
      const roomName = action.room
      const room = rooms[roomName]
      const user = room.findUser({ socket: action.id })

      if (user) {
        console.log(`Kicking user: ${user.name} (${user.socket})`)
        room.removeUser(user)

        io.to(user.socket).emit('action', kicked())
        io.to(roomName).emit('action', userDisconnected(user))
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

    if (action.type === actions.ROUND_START) {
      const { ticket } = action

      const room = rooms[socket.room]
      room.startVoteRound()

      io.to(socket.room).emit('action', start(ticket))
    }

    if (action.type === actions.ROUND_END) {
      io.to(socket.room).emit('action', end())
    }

    if (action.type === actions.VOTE) {
      const room = rooms[socket.room]
      const { estimation } = action
      const user = room.findUser({ socket: socket.id })

      room.setRoundVote(socket.id, estimation)

      console.log(socket.username, `(PM: ${user.pm})`, 'voted', estimation)

      if (user.pm) {
        return io.to(socket.room).emit('action', voteSelected(estimation))
      }

      room.users
        .filter((u) => u.pm)
        .forEach((pm) => {
          socket.to(pm.socket).emit('action', userVote(user, estimation))
          socket.to(pm.socket).emit('action', recommended(room.getRecommendedPoints()))
        })

      room.users
        .filter((u) => !u.pm)
        .forEach((u) => {
          socket.to(u.socket).emit('action', vote(user))
        })

      if (room.roundFinished()) {
        io.to(socket.room).emit('action', recommended(room.getRecommendedPoints()))
      }
    }

    if (action.type === actions.SET_POINTS) {
      const { points } = action

      console.log('New available points', points.join(','))

      io.to(socket.room).emit('action', setPoints(points))
    }

    if (action.type === actions.SET_NAME) {
      const { name } = action
      const room = rooms[socket.room]
      const user = room.updateUser({ name, socket: socket.id })

      console.log(`${socket.username} ➝  ${name}`)

      socket.broadcast.to(socket.room).emit('action', userNamechange(user))
      socket.emit('action', setName(user.name))
    }
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
