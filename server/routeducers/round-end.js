import { end } from '../../actions/round'

export default function roundEnd ({ socket, io }) {
  io.to(socket.room).emit('action', end())
}
