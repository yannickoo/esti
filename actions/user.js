export const AUTHENTICATED = 'user/authenticated'
export const KICKED = 'user/kicked'
export const JOINED = 'user/joined'

export function authenticated (auth) {
  return {
    type: AUTHENTICATED,
    authenticated: auth
  }
}

export function kicked () {
  return {
    type: KICKED,
    active: false
  }
}

export function joined ({ users, managers, name }) {
  return {
    managers,
    joined,
    name
  }
}
