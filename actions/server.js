export const VOTE = 'server/vote'
export const CLAIM = 'server/claim'
export const USER_KICK = 'server/userKick'
export const JOIN = 'server/join'
export const SET_NAME = 'server/setName'
export const ROUND_START = 'server/startRound'
export const ROUND_END = 'server/endRound'
export const SET_POINTS = 'server/setPoints'

export function vote (estimation) {
  return {
    type: VOTE,
    estimation
  }
}

export function userKick (room, id) {
  return {
    type: USER_KICK,
    room,
    id
  }
}

export function claim (username, room, token) {
  return {
    type: CLAIM,
    username,
    room,
    token
  }
}

export function join (room, name) {
  return {
    type: JOIN,
    room,
    name
  }
}

export function setName (name) {
  return {
    type: SET_NAME,
    name
  }
}

export function startRound (ticket) {
  return {
    type: ROUND_START,
    ticket
  }
}

export function endRound () {
  return {
    type: ROUND_END
  }
}

export function setPoints (points) {
  return {
    type: SET_POINTS,
    points
  }
}
