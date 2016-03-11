export const USER_VOTE = 'pm/userVote'
export const TICKET_LIST = 'pm/ticketList'

export function userVote (user, estimation) {
  return {
    type: USER_VOTE,
    user,
    estimation
  }
}

export function ticketList (tickets) {
  return { type: TICKET_LIST, tickets }
}
