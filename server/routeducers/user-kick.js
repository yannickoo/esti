import { userDisconnected } from '../../actions/room'
import { kicked } from '../../actions/user'

export default function userKick ({ action, rooms, io }) {
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
