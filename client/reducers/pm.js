import { USER_VOTE, TICKET_INFO, TICKET_LIST } from '../../actions/pm'
import { START, VOTE_SELECTED } from '../../actions/round'

export default function pm (state = { votes: [], ticket: {}, tickets: [], estimations: [] }, action) {
  if (action.type === START) {
    return { ...state, votes: [] }
  }

  if (action.type === USER_VOTE) {
    const { user, estimation } = action
    const vote = { ...user, estimation }
    const without = state.votes.filter((vote) => vote.socket !== user.socket)
    const votes = [...without, vote]

    return { ...state, votes }
  }

  if (action.type === TICKET_INFO) {
    const { id, title, description } = action
    const ticket = { id, title, description }

    return { ...state, ticket, tickets: [] }
  }

  if (action.type === TICKET_LIST) {
    const { tickets } = action

    return { ...state, tickets }
  }

  if (action.type === VOTE_SELECTED) {
    const { chosen } = action
    const estimations = [...state.estimations, chosen]
    let tickets = state.tickets

    if (chosen.ticket) {
      tickets = tickets.filter((ticket) => ticket.id !== chosen.ticket.id)
    }

    return { ...state, estimations, tickets }
  }

  return state
}
