import { createAction } from 'redux-actions'

export const start = createAction('START')
export const voteSelected = createAction('VOTE_SELECTED')
export const vote = createAction('VOTE')
export const restart = createAction('RESTART')
export const recommended = createAction('RECOMMENDED')
export const setPoints = createAction('SET_POINTS')
export const revealVotes = createAction('REVEAL_VOTES')

export const START = start.toString()
export const VOTE = vote.toString()
export const VOTE_SELECTED = voteSelected.toString()
