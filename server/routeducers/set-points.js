import { setPoints as changePoints } from '../../actions/round'

export default function setPoints ({ socket, action, io }) {
  const { payload: points } = action

  io.to(socket.room).emit('action', changePoints(points))
}
