export const AUTHENTICATED = 'user/authenticated'
export const KICKED = 'user/kicked'
export const JOINED = 'user/joined'
export const VOTED = 'user/voted'
export const SET_NAME = 'user/setName'

export function authenticated (auth) {
  return {
    type: AUTHENTICATED,
    authenticated: auth
  }
}

export function kicked () {
  return {
    type: KICKED
  }
}

export function joined ({ name, users, managers }) {
  return {
    type: JOINED,
    name,
    users,
    managers
  }
}

export function voted (estimation) {
  return {
    type: VOTED,
    estimation
  }
}

export function setName (name) {
  return {
    type: SET_NAME,
    name
  }
}
