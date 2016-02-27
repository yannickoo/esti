import { userNamechange } from '../actions/room'

export default function setName ({ socket, action, rooms }) {
  const { name } = action
  const room = rooms[socket.room]
  const user = room.updateUser({ name, socket: socket.id })

  console.log(`${socket.username} ➝  ${name}`)

  socket.broadcast.to(socket.room).emit('action', userNamechange(user))
  socket.emit('action', setName(user.name))
}
