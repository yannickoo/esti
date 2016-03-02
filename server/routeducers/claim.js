import { slug } from '../utils'

import join from './join'

import { unlocked } from '../../actions/room'
import { authenticated } from '../../actions/user'

function claimRoom (name, token, db) {
  const slugged = slug(name)
  let room = db('rooms').find({ slug: slugged })
  const roomExists = !!room

  if (!room) {
    console.log('claimed room:', name, 'with token:', token)
    room = { name, slug: slugged, token }
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

export default function claim ({ socket, action, rooms, db }) {
  const { username, room: roomName, token } = action

  const slugged = slug(roomName)

  // @TODO: remove db parameter.
  claimRoom(roomName, token, db)
    .then((claimed) => {
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

