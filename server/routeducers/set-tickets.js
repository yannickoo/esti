import { ticketList } from '../../actions/pm'

export default function setTickets ({ socket, action, rooms }) {
  const { tickets } = action

  console.log(tickets.length, 'tickets have been set.')

  socket.emit('action', ticketList(tickets))
}
