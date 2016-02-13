import {
  USER_CONNECTED,
  USER_DISCONNECTED,
  USER_NAMECHANGE,
  USER_KICK,
  SET_ROOM,
  UNLOCKED
} from '../../actions/room'

import { JOINED, AUTHENTICATED } from '../../actions/user'

export default function room (state = { name: '', users: [], unlocked: false }, action) {
  console.log(action.type, action)
  if (action.type === USER_CONNECTED) {
    const { user } = action
    const users = [...state.users, user]

    return { ...state, users }
  }

  if (action.type === USER_DISCONNECTED) {
    const { user } = action
    const users = state.users.filter((u) => u.socket !== user.socket)
    const unlocked = users.some((u) => u.pm)

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

    return { ...state, name: room }
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

  return state
}
