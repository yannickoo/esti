export const START = 'round/start'
export const VOTE = 'round/vote'
export const END = 'round/end'
export const RESTART = 'round/restart'
export const VOTE_SELECTED = 'round/voteSelected'

export function start (ticket) {
  return { type: START, ...ticket }
}

export function vote (user) {
  return { type: VOTE, user }
}

export function end () {
  return { type: START }
}

export function restart () {
  return { type: RESTART }
}

export function voteSelected () {
  return { type: VOTE_SELECTED }
}
