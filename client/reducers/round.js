import { handleActions } from 'redux-actions'

import { start, vote, restart, voteSelected, recommended, setPoints, revealVotes } from '../../actions/round'
import { voted } from '../../actions/user'
const points = [1, 2, 3, 5, 8, 13, 20, 40, 100]
const defaultState = {
  ticket: {},
  users: [],
  userVotes: [],
  points: points,
  recommended: [],
  active: false,
  pending: false,
  estimation: 0
}

export default handleActions({
  [start]: (state, action) => {
    const { id, title, url } = action.payload
    const ticket = { id, title, url }

    return { ...state, ticket, users: [], userVotes: [], active: true, recommended: [], estimation: 0 }
  },

  // PM has chosen an estimation
  [voteSelected]: () => defaultState,

  [vote]: (state, action) => {
    const { payload: user } = action
    const userVotes = [...state.userVotes, user]

    return { ...state, userVotes }
  },

  [restart]: (state) => ({ ...state, userVotes: [], active: true }),

  [recommended]: (state, { payload: recommended }) => ({ ...state, recommended }),

  [setPoints]: (state, { payload: points }) => ({ ...state, points }),

  [revealVotes]: (state, { payload: userVotes }) => ({ ...state, userVotes }),

  // This client has voted for an estimation
  [voted]: (state, { payload: estimation }) => ({ ...state, estimation })
}, defaultState)
