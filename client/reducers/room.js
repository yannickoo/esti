import {
  USER_CONNECTED,
  USER_DISCONNECTED,
  USER_NAMECHANGE,
  USER_KICK,
  UNLOCKED,
  SET_ROOM
} from '../../actions/room'

import { JOINED, AUTHENTICATED, KICKED } from '../../actions/user'

const defaultState = { name: '', slug: '', users: [], unlocked: false }

export default function room (state = defaultState, action) {
  if (action.type === USER_CONNECTED) {
    const { user } = action
    const users = [...state.users, user]

    return { ...state, users }
  }

  if (action.type === USER_DISCONNECTED) {
    const { user } = action
    const users = state.users.filter((u) => u.socket !== user.socket)
    const unlocked = user.pm ? users.some((u) => u.pm) : state.unlocked

    return { ...state, users, unlocked }
  }

  if (action.type === USER_NAMECHANGE) {
    const { user } = action
    const without = state.users.filter((u) => u.socket !== user.socket)
    const users = [...without, user]

    return { ...state, users }
  }

  if (action.type === USER_KICK) {
    const { user } = action
    const users = state.users.filter((u) => u.socket !== user.socket)

    return { ...state, users }
  }

  if (action.type === SET_ROOM) {
    const { room } = action

    return { ...state, name: room.name, slug: room.slug }
  }

  if (action.type === JOINED) {
    const { users } = action
    const unlocked = users.some((u) => u.pm)
    return { ...state, users, unlocked }
  }

  if (action.type === UNLOCKED) {
    const { user } = action
    const without = state.users.filter((u) => u.socket !== user.socket)
    const users = [...without, user]
    return { ...state, users, unlocked: true }
  }

  if (action.type === AUTHENTICATED) {
    const { authenticated: unlocked } = action
    return { ...state, unlocked }
  }

  if (action.type === KICKED) {
    return defaultState
  }

  return state
}
