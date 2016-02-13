export const VOTE = 'server/vote'
export const CLAIM = 'server/claim'
export const USER_KICK = 'server/userKick'
export const JOIN = 'server/join'
export const CHANGE_NAME = 'server/changeName'
export const SET_NAME = 'server/setName'
export const ROUND_START = 'server/startRound'

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

export function claim (room, token) {
  return {
    type: CLAIM,
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

export function changeName (before, after) {
  return {
    type: CHANGE_NAME,
    before,
    after
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
