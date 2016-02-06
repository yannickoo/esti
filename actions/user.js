export const AUTHENTICATED = 'user/authenticated'
export const JOIN = 'server/join'
export const CHANGE_NAME = 'server/changeName'
export const SET_NAME = 'user/setName'

export function authenticated (auth) {
  return {
    type: AUTHENTICATED,
    authenticated: auth
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
