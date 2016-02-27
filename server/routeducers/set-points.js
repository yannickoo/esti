export default function setPoints ({ socket, action, io }) {
  const { points } = action

  console.log('New available points', points.join(','))

  io.to(socket.room).emit('action', setPoints(points))
}
