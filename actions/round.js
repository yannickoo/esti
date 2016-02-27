export const START = 'round/start'
export const VOTE = 'round/vote'
export const END = 'round/end'
export const RESTART = 'round/restart'
export const VOTE_SELECTED = 'round/voteSelected'
export const RECOMMENDED = 'round/recommended'
export const SET_POINTS = 'round/setPoints'

export function start (ticket) {
  return { type: START, ...ticket }
}

export function vote (user) {
  return { type: VOTE, user }
}

export function end () {
  return { type: END }
}

export function restart () {
  return { type: RESTART }
}

export function voteSelected (chosen) {
  return { type: VOTE_SELECTED, chosen }
}

export function recommended (recommended) {
  return { type: RECOMMENDED, recommended }
}

export function setPoints (points) {
  return { type: SET_POINTS, points }
}
