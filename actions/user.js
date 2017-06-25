import { createAction } from 'redux-actions'

export const authenticated = createAction('AUTHENTICATED')
export const joined = createAction('JOINED')
export const kicked = createAction('KICKED')
export const voted = createAction('VOTED')
export const setName = createAction('SET_NAME', (name) => ({ name }))
