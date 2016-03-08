export const VOTE = 'server/vote'
export const CLAIM = 'server/claim'
export const USER_KICK = 'server/userKick'
export const JOIN = 'server/join'
export const SET_ROOM = 'server/setRoom'
export const SET_ROOM_NAME = 'server/setRoomName'
export const SET_NAME = 'server/setName'
export const ROUND_START = 'server/startRound'
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

export function claim ({ username, room, slug, token }) {
  return {
    type: CLAIM,
    username,
    room,
    slug,
    token
  }
}

export function join (slug, name) {
  return {
    type: JOIN,
    slug,
    name
  }
}

export function setRoom (room) {
  return {
    type: SET_ROOM,
    room
  }
}

export function setRoomName (slug, name) {
  return {
    type: SET_ROOM_NAME,
    slug,
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

export function setPoints (points) {
  return {
    type: SET_POINTS,
    points
  }
}
