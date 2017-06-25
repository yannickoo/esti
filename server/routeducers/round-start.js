import { start } from '../../actions/round'

export default function roundStart ({ socket, action, rooms, io }) {
  const { payload: ticket } = action

  const room = rooms[socket.room]
  room.startVoteRound()

  io.to(socket.room).emit('action', start(ticket))
}
