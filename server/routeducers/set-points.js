import { setPoints as changePoints } from '../../actions/round'

export default function setPoints ({ socket, action, io }) {
  const { points } = action

  io.to(socket.room).emit('action', changePoints(points))
}
