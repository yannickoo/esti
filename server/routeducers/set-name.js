import { userNamechange } from '../../actions/room'
import { setName as changeName } from '../../actions/user'

export default function setName ({ socket, action, rooms }) {
  const { name } = action
  const room = rooms[socket.room]
  const user = room.updateUser({ name, socket: socket.id })

  console.log(`${socket.username} ➝  ${name}`)

  socket.broadcast.to(socket.room).emit('action', userNamechange(user))
  socket.emit('action', changeName(user.name))
}
