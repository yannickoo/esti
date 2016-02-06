import { USER_VOTE, TICKET_INFO, TICKET_LIST } from '../../actions/pm'

export default function pm (state = { votes: {}, ticket: {}, tickets: [] }, action) {
  if (action.type === USER_VOTE) {
    const { user, estimation } = action
    const votes = { ...state.votes, [user]: estimation }

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

  return state
}
