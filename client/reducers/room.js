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

const byName = (a, b) => a.name.localeCompare(b.name)
const sort = (userList) => {
  const pms = userList.filter((u) => u.pm)
  const users = userList.filter((u) => !u.pm)

  return [...pms.sort(byName), ...users.sort(byName)]
}

export default function room (state = defaultState, action) {
  if (action.type === USER_CONNECTED) {
    const { user } = action
    const userList = [...state.users, user]
    const users = sort(userList)

    return { ...state, users }
  }

  if (action.type === USER_DISCONNECTED) {
    const { user } = action
    const userList = state.users.filter((u) => u.socket !== user.socket)
    const users = sort(userList)
    const unlocked = user.pm ? users.some((u) => u.pm) : state.unlocked

    return { ...state, users, unlocked }
  }

  if (action.type === USER_NAMECHANGE) {
    const { user } = action
    const without = state.users.filter((u) => u.socket !== user.socket)
    const userList = [...without, user]
    const users = sort(userList)

    return { ...state, users }
  }

  if (action.type === USER_KICK) {
    const { user } = action
    const userList = state.users.filter((u) => u.socket !== user.socket)
    const users = sort(userList)

    return { ...state, users }
  }

  if (action.type === SET_ROOM) {
    const { room } = action

    return { ...state, name: room.name, slug: room.slug }
  }

  if (action.type === JOINED) {
    const { users: userList } = action
    const users = sort(userList)
    const unlocked = userList.some((u) => u.pm)

    return { ...state, users, unlocked }
  }

  if (action.type === UNLOCKED) {
    const { user } = action
    const without = state.users.filter((u) => u.socket !== user.socket)
    const userList = [...without, user]
    const users = sort(userList)

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
