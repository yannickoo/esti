import { createAction } from 'redux-actions'

export const userConnected = createAction('USER_CONNECTED')
export const userDisconnected = createAction('USER_DISCONNECTED')
export const userNamechange = createAction('USER_NAMECHANGE')
export const setRoom = createAction('SET_ROOM')
export const roomRenamed = createAction('ROOM_RENAMED')
export const unlocked = createAction('UNLOCKED')

export const USER_CONNECTED = userConnected.toString()
export const USER_DISCONNECTED = userDisconnected.toString()
export const USER_NAMECHANGE = userNamechange.toString()
export const UNLOCKED = unlocked.toString()
