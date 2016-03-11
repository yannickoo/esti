import { slug } from '../utils'

import join from './join'

import { unlocked } from '../../actions/room'
import { authenticated } from '../../actions/user'

function claimRoom (name, slugged, token, db) {
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
  const { username, room: roomName, slug: slugged, token } = action
  const roomSlug = slugged || slug(roomName)

  // @TODO: remove db parameter.
  claimRoom(roomName, roomSlug, token, db)
    .then((claimed) => {
      let room = rooms[roomSlug]

      if (claimed) {
        if (!room) {
          join({
            socket,
            rooms,
            action: {
              name: username,
              slug: roomSlug
            }
          })

          room = rooms[roomSlug]
        }

        const user = room
          .updateUser({ socket: socket.id, pm: true })

        socket.to(roomSlug).emit('action', unlocked(user))
      }

      socket.emit('action', authenticated(claimed))
    })
    .catch((e) => console.error(e.stack))
}
