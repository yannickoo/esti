import low from 'lowdb'
import storage from 'lowdb/file-async'
import { slug } from '../utils'

import join from './join'

import { unlocked } from '../../actions/room'
import { authenticated } from '../../actions/user'

const db = low('db.json', { storage })

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

export default function claim ({ socket, action, rooms }) {
  const { username, room: roomName, token } = action

  const slugged = slug(roomName)

  claimRoom(slugged, token)
    .then((claimed) => {
      console.log('Claimed', claimed)
      let room = rooms[slugged]

      if (claimed) {
        if (!room) {
          join({
            socket,
            rooms,
            action: {
              name: username,
              room: roomName
            }
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
    .catch((e) => console.error(e.stack))
}

