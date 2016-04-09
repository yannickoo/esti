import test from 'tape'
import deepFreeze from 'deep-freeze'

import userReducer from '../../client/reducers/user'
import * as actions from '../../actions/user'

test('User reducer "pm" property', (t) => {
  const stateBefore = { pm: false }
  const stateAfter = { pm: true }

  deepFreeze(stateBefore)
  deepFreeze(stateAfter)

  t.deepEqual(
      userReducer(stateBefore, actions.authenticated(true)),
      stateAfter,
      'should be pm after successful authentication'
  )

  t.end()
})
