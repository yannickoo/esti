export const USER_CONNECTED = 'room/userConnected'
export const USER_DISCONNECTED = 'room/userDisconnected'
export const USER_NAMECHANGE = 'room/userNamechange'
export const SET_ROOM = 'room/set'
export const RENAMED = 'room/renamed'
export const UNLOCKED = 'room/unlocked'

export function userConnected (user) {
  return {
    type: USER_CONNECTED,
    user
  }
}

export function userDisconnected (user) {
  return {
    type: USER_DISCONNECTED,
    user
  }
}

export function userNamechange (user) {
  return {
    type: USER_NAMECHANGE,
    user
  }
}

export function setRoom (room) {
  return {
    type: SET_ROOM,
    room
  }
}

export function roomRenamed (name) {
  return {
    type: RENAMED,
    name
  }
}

export function unlocked (user) {
  return {
    type: UNLOCKED,
    user
  }
}
