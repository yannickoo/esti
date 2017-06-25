import { createAction } from 'redux-actions'

export const vote = createAction('SERVER/VOTE')
export const claim = createAction('SERVER/CLAIM')
export const setRoom = createAction('SERVER/SET_ROOM')
export const setName = createAction('SERVER/SET_NAME')
export const startRound = createAction('SERVER/START_ROUND')
export const setPoints = createAction('SERVER/SET_POINTS')
export const userKick = createAction('SERVER/USER_KICK', (room, id) => ({ room, id }))
export const join = createAction('SERVER/JOIN', (slug, name) => ({ slug, name }))
export const setRoomName = createAction('SERVER/SET_ROOM_NAME', (slug, name) => ({ slug, name }))
