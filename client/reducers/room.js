import { handleActions } from 'redux-actions'

import {
  userConnected,
  userDisconnected,
  userNamechange,
  unlocked,
  setRoom,
  roomRenamed
} from '../../actions/room'

import { joined, authenticated, kicked } from '../../actions/user'

const defaultState = { name: '', slug: '', users: [], unlocked: false }

function byName (a, b) {
  return a.name.localeCompare(b.name)
}

function sort (userList) {
  const pms = userList.filter((u) => u.pm)
  const users = userList.filter((u) => !u.pm)

  return [...pms.sort(byName), ...users.sort(byName)]
}

export default handleActions({
  [userConnected]: (state, { payload: user }) => {
    const userList = [...state.users, user]
    const users = sort(userList)

    return { ...state, users }
  },

  [userDisconnected]: (state, { payload: user }) => {
    const userList = state.users.filter((u) => u.socket !== user.socket)
    const users = sort(userList)
    const unlocked = user.pm ? users.some((u) => u.pm) : state.unlocked

    return { ...state, users, unlocked }
  },

  [userNamechange]: (state, { payload: user }) => {
    const without = state.users.filter((u) => u.socket !== user.socket)
    const userList = [...without, user]
    const users = sort(userList)

    return { ...state, users }
  },

  // [USER_KICK]: (state, { payload: user }) => {
  //   const userList = state.users.filter((u) => u.socket !== user.socket)
  //   const users = sort(userList)
  //
  //   return { ...state, users }
  // },

  [setRoom]: (state, { payload: room }) => ({ ...state, name: room.name, slug: room.slug }),

  [joined]: (state, action) => {
    const { users: userList } = action.payload
    const users = sort(userList)
    const unlocked = userList.some((u) => u.pm)

    return { ...state, users, unlocked }
  },

  [unlocked]: (state, { payload: user }) => {
    const without = state.users.filter((u) => u.socket !== user.socket)
    const userList = [...without, user]
    const users = sort(userList)

    return { ...state, users, unlocked: true }
  },

  [authenticated]: (state, { payload: unlocked }) => ({ ...state, unlocked }),

  [kicked]: () => defaultState,

  [roomRenamed]: (state, { payload: name }) => ({ ...state, name })
}, defaultState)
