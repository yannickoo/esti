import { START, VOTE, END, RESTART, VOTE_SELECTED, RECOMMENDED, SET_POINTS } from '../../actions/round'
import { VOTED } from '../../actions/user'
const points = [1, 2, 3, 5, 8, 13, 20, 40, 100]
const defaultState = {
  ticket: {},
  userVotes: [],
  points: points,
  recommended: [],
  active: false,
  pending: false,
  estimation: 0,
  chosen: 0
}

export default function round (state = defaultState, action) {
  if (action.type === START) {
    const { id, title, url } = action
    const ticket = { id, title, url }

    return { ...state, ticket, userVotes: [], active: true, recommended: [], chosen: 0, estimation: 0 }
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

  // This client has voted for an estimation
  if (action.type === VOTED) {
    const { estimation } = action
    return { ...state, estimation }
  }

  // PM has chosen an estimation
  if (action.type === VOTE_SELECTED) {
    const { chosen } = action
    return { ...state, chosen }
  }

  if (action.type === RECOMMENDED) {
    const { recommended } = action
    return { ...state, recommended }
  }

  if (action.type === SET_POINTS) {
    const { points } = action
    return { ...state, points }
  }

  return state
}
