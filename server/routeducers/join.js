import { joined } from '../../actions/user'
import { userConnected } from '../../actions/room'
import Room from '../room'

export default function joinedAction ({ socket, action, rooms }) {
  const { name, slug: slugged } = action
  const user = { name, socket: socket.id }
  const room = rooms[slugged] || new Room(slugged)

  if (room.findUser(user)) {
    return
  }

  console.log(name, `(${socket.id})`, 'joins room:', slugged)

  socket.username = name
  socket.room = slugged
  socket.join(slugged)

  socket.emit('action', joined({
    name,
    users: room.users
  }))

  room.addUser(user)
  rooms[slugged] = room

  socket.broadcast.to(slugged).emit('action', userConnected(user))
}
