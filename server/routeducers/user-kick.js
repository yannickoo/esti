import { userDisconnected } from '../../actions/room'
import { kicked } from '../../actions/user'

export default function userKick ({ action, rooms, io }) {
  const { id: socket, room: roomName } = action.payload
  const room = rooms[roomName]
  const user = room.findUser({ socket })

  if (user) {
    console.log(`Kicking user: ${user.name} (${user.socket})`)
    room.removeUser(user)

    io.to(user.socket).emit('action', kicked())
    io.to(roomName).emit('action', userDisconnected(user))
  }
}
