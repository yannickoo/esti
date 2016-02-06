import { USER_CONNECTED, USER_DISCONNECTED, USER_NAMECHANGE, SET_ROOM } from '../../actions/room'

export default function room (state = { users: [], name: '' }, action) {
  if (action.type === USER_CONNECTED) {
    const { user } = action
    const users = [...state.users, user]

    return { ...state, users }
  }

  if (action.type === USER_DISCONNECTED) {
    const { user } = action
    const users = state.users.filter((u) => u.name !== user.name)

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

  return state
}
