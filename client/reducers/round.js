import { START, VOTE, END, RESTART } from '../../actions/round'

export default function round (state = { ticket: {}, userVotes: [], active: false }, action) {
  if (action.type === START) {
    const { id, title, description } = action
    const ticket = { id, title, description }

    return { ...state, ticket, userVotes: [], active: true }
  }

  if (action.type === VOTE) {
    const { user } = action
    const userVotes = [...state.userVotes, user]

    return { ...state, userVotes }
  }

  if (action.type === END) {
    return { ...state, active: false }
  }

  if (action.type === RESTART) {
    return { ...state, userVotes: [], active: true }
  }

  return state
}
