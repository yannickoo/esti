import { userNamechange } from '../../actions/room'
import { setName as changeName } from '../../actions/user'

export default function setName ({ socket, action, rooms }) {
  const { name } = action
  const room = rooms[socket.room]

  if (room) {
    const user = room.updateUser({ name, socket: socket.id })
    socket.broadcast.to(socket.room).emit('action', userNamechange(user))
  }

  console.log(`${socket.username} ➝  ${name}`)

  socket.emit('action', changeName(name))
}
