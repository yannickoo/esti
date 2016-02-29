import { setRoom as changeRoom } from '../../actions/room'
import Room from '../room'
import slug from 'slug'

slug.defaults.mode = 'rfc3986'

export default function setRoom ({ socket, action, rooms, db }) {
  const { room: roomName } = action
  const slugged = slug(roomName)
  const room = db('rooms').find({ slug: slugged }) || new Room(roomName)

  socket.emit('action', changeRoom({ name: room.name, slug: room.slug }))
}
