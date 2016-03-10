import { vote as voted, voteSelected, recommended } from '../../actions/round'
import { userVote } from '../../actions/pm'

export default function vote ({ socket, action, rooms, io }) {
  const room = rooms[socket.room]
  const { estimation } = action
  const user = room.findUser({ socket: socket.id })

  if (user.pm) {
    return io.to(socket.room).emit('action', voteSelected(estimation))
  }

  room.setRoundVote(socket.id, estimation)

  console.log(socket.username, 'voted', estimation)

  room.users
    .filter((u) => u.pm)
    .forEach((pm) => {
      socket.to(pm.socket).emit('action', userVote(user, estimation))
      socket.to(pm.socket).emit('action', recommended(room.getRecommendedPoints()))
    })

  room.users
    .filter((u) => !u.pm)
    .forEach((u) => {
      socket.to(u.socket).emit('action', voted(user))
    })

  if (room.roundFinished()) {
    io.to(socket.room).emit('action', recommended(room.getRecommendedPoints()))
  }
}
