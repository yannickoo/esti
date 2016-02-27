import { AUTHENTICATED, SET_NAME, JOINED } from '../../actions/user'

export default function user (state = { name: '', pm: false }, action) {
  if (action.type === AUTHENTICATED) {
    const { authenticated: pm } = action

    return { ...state, pm }
  }

  if (action.type === JOINED) {
    const { name } = action

    return { ...state, name }
  }

  if (action.type === SET_NAME) {
    const { name } = action
    return { ...state, name }
  }

  return state
}
