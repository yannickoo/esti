import { ticketInfo } from '../../actions/pm'

// TODO: Legacy, will this be used with our integration?
export default function ticket ({ socket, action, rooms }) {
  const { room: roomName, ticket } = action.payload
  const room = rooms.get(roomName)

  if (!room || !room.managers.has(socket)) {
    socket.emit('action', { type: 'ticket', error: true })
    return
  }

  console.log('Fetching information for JIRA ticket:', ticket)
  // jira
  //   .find(ticket)
  //   .then((information) => send)
  //   .catch(console.error)

  socket.emit('action', ticketInfo({
    id: 'HWZ-42',
    title: 'Foo',
    description: 'Some text about this ticket'
  }))
}
