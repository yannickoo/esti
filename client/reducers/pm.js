import { handleActions } from 'redux-actions'

import { userVote, ticketList } from '../../actions/pm'
import { start, voteSelected } from '../../actions/round'

const defaultState = { votes: [], ticket: {}, tickets: [], estimations: [] }

export default handleActions({
  [userVote]: (state, action) => {
    const { payload: vote } = action
    const without = state.votes.filter(({ user }) => vote.user.socket !== user.socket)
    const votes = [...without, vote]

    return { ...state, votes }
  },

  [ticketList]: (state, { payload: tickets }) => ({ ...state, tickets }),

  [voteSelected]: (state, action) => {
    const { payload: chosen } = action

    // chosen is not set if "End round" was clicked.
    if (!chosen) {
      return { ...state }
    }

    const without = state.estimations.filter((e) => !e.ticket.id || e.ticket.id !== chosen.ticket.id)
    const estimations = [...without, chosen]
    let tickets = state.tickets.filter((ticket) => ticket.id !== chosen.ticket.id)

    return { ...state, estimations, tickets }
  },

  [start]: (state) => ({ ...state, votes: [] })
}, defaultState)
