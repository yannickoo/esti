import { joined } from '../../actions/user'
import { userConnected } from '../../actions/room'
import Room from '../room'
import { slug } from '../utils'

export default function joinedAction ({ socket, action, rooms }) {
  const { name, room: roomName } = action
  const user = { name, socket: socket.id }
  const slugged = slug(roomName)
  const room = rooms[slugged] || new Room(roomName)

  console.log(name, `(${socket.id})`, 'joins room:', roomName)

  socket.username = name
  socket.room = slugged
  socket.join(slugged)

  socket.emit('action', joined({
    name,
    users: room.users
  }))

  room.addUser(user)

  console.log('Sending userConnected to', slugged)
  socket.broadcast.to(slugged).emit('action', userConnected(user))

  rooms[slugged] = room
}
