export const USER_VOTE = 'pm/userVote'
export const TICKET_INFO = 'pm/ticketInfo'
export const TICKET_LIST = 'pm/ticketList'

export function userVote (user, estimation) {
  return {
    type: USER_VOTE,
    user,
    estimation
  }
}

export function ticketInfo (ticket) {
  return { type: TICKET_INFO, ...ticket }
}

export function ticketList (tickets) {
  return { type: TICKET_LIST, tickets }
}
