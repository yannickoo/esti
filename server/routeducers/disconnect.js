import { userDisconnected } from '../../actions/room'

export default function disconnect ({ socket, rooms, io }) {
  const roomName = socket.room
  const room = rooms[roomName]

  if (!room) {
    return
  }

  const user = room.users.find((u) => u.socket === socket.id)

  if (!user) {
    console.warn(`Unknown user disconnect from ${room.name}`)
    return
  }

  room.removeUser(user)

  console.log(`${user.name} (${socket.id}) leaves room: ${room.name}`)

  io.to(roomName).emit('action', userDisconnected(user))
}
