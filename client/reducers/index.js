import { combineReducers } from 'redux'

import user from './user'
import pm from './pm'
import room from './room'
import round from './round'
import notifications from './notifications'

const rootReducer = combineReducers({ user, pm, room, round, notifications })

export default rootReducer
