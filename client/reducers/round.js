import { START, VOTE, END, RESTART, VOTE_SELECTED } from '../../actions/round'
const points = [1, 2, 3, 5, 8, 13, 20, 40, 100]

export default function round (state = { ticket: {}, userVotes: [], points: points, active: false, pending: false }, action) {
  if (action.type === START) {
    const { id, title, url } = action
    const ticket = { id, title, url }

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

  if (action.type === VOTE_SELECTED) {
    const { value } = action
    return { ...state, userVote: value }
  }

  return state
}
