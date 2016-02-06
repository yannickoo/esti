import { combineReducers } from 'redux'
import user from './user'
import pm from './pm'
import round from './round'
import room from './room'

const rootReducer = combineReducers({ user, pm, round, room })

export default rootReducer
