export const AUTHENTICATED = 'user/authenticated'
export const KICKED = 'user/kicked'
export const JOINED = 'user/joined'
export const VOTED = 'user/voted'

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
