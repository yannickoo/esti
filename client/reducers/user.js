import { handleActions, combineActions } from 'redux-actions'

import { authenticated, setName, joined } from '../../actions/user'

export default handleActions({
  [authenticated]: (state, { payload: pm }) => ({ ...state, pm }),

  [combineActions(joined, setName)]: (state, action) => {
    const { name } = action.payload

    return { ...state, name }
  }
}, { name: '', pm: false })
