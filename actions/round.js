export const START = 'round/start'
export const VOTE = 'round/vote'
export const END = 'round/end'
export const RESTART = 'round/restart'

export function start (ticket) {
  return { type: START, ...ticket }
}

export function vote (user, estimation) {
  return { type: START, user, estimation }
}

export function end () {
  return { type: START }
}

export function restart () {
  return { type: RESTART }
}
