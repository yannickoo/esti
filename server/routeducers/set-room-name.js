import { roomRenamed } from '../../actions/room'

export default function setRoomName ({ io, socket, action, rooms, db }) {
  const { name, slug: slugged } = action.payload
  const room = rooms[slugged]
  const user = room.findUser({ socket: socket.id })

  if (user.pm && room) {
    room.name = name

    db('rooms')
      .chain()
      .find({ slug: slugged })
      .assign({ name: name })
      .value()

    io.to(slugged).emit('action', roomRenamed(name))
  }
}
