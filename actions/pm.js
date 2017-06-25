import { createAction } from 'redux-actions'

export const userVote = createAction('USER_VOTE', (user, estimation) => ({ user, estimation }))
export const ticketList = createAction('TICKET_LIST')

export const TICKET_LIST = ticketList.toString()
