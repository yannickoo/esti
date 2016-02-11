import { USER_CONNECTED, USER_DISCONNECTED, USER_NAMECHANGE, SET_ROOM, PM_UNAVAILABLE, PM_CONNECTED } from '../../actions/room'

export default function room (state = { users: [], name: '', active: false }, action) {
  if (action.type === USER_CONNECTED) {
    const { user } = action
    const users = [...state.users, user]

    return { ...state, users }
  }

  if (action.type === USER_DISCONNECTED) {
    const { name } = action
    const users = state.users.filter((u) => u.name !== name)

    return { ...state, users }
  }

  if (action.type === USER_NAMECHANGE) {
    const { before, after } = action
    const without = state.users.filter((u) => u.name !== before)
    const users = [...without, after]

    return { ...state, users }
  }

  if (action.type === SET_ROOM) {
    const { room } = action

    return { ...state, name: room }
  }

  if (action.type === PM_UNAVAILABLE) {
    return { ...state, active: false }
  }

  if (action.type === PM_CONNECTED) {
    return { ...state, active: true }
  }

  return state
}
