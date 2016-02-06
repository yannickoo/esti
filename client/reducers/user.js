import { AUTHENTICATED, SET_NAME } from '../../actions/user'

export default function user (state = { pm: false, name: '' }, action) {
  if (action.type === AUTHENTICATED) {
    const { authenticated: pm } = action

    return { ...state, pm }
  }

  if (action.type === SET_NAME) {
    const { name } = action
    return { ...state, name }
  }

  return state
}
