export const USER_CONNECTED = 'room/userConnected'
export const USER_DISCONNECTED = 'room/userDisconnected'
export const USER_NAMECHANGE = 'room/userNamechange'
export const PM_CONNECTED = 'room/pmConnected'
export const PM_UNAVAILABLE = 'room/pmUnavailable'
export const SET_ROOM = 'room/set'

export function userConnected (user) {
  return {
    type: USER_CONNECTED,
    user
  }
}

export function userDisconnected (name) {
  return {
    type: USER_DISCONNECTED,
    name
  }
}

export function userNamechange (before, after) {
  return {
    type: USER_NAMECHANGE,
    before,
    after
  }
}

export function pmConnected () {
  return {
    type: PM_CONNECTED
  }
}

export function pmUnavailable () {
  return {
    type: PM_UNAVAILABLE
  }
}

export function setRoom (room) {
  return {
    type: SET_ROOM,
    room
  }
}
