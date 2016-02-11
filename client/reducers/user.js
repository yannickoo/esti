import { AUTHENTICATED, SET_NAME, KICKED } from '../../actions/user'

export default function user (state = { active: true, name: '', pm: false }, action) {
  if (action.type === AUTHENTICATED) {
    const { authenticated: pm } = action

    return { ...state, pm }
  }

  if (action.type === SET_NAME) {
    const { name } = action
    return { ...state, name }
  }

  if (action.type === KICKED) {
    return { ...state, active: false}
  }

  return state
}
