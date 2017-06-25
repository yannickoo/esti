import { createStore, applyMiddleware, compose } from 'redux'
import rootReducer from '../reducers'
import createSocketIoMiddleware from 'redux-socket.io'
import io from 'socket.io-client'
import notify from 'redux-notify'
import notifyEvents from '../events/notifyEvents'

function persistState ({ getState }) {
  return (next) => (action) => {
    const currentState = getState()
    const returnValue = next(action)
    const nextState = getState()

    if (nextState.user.name !== currentState.user.name) {
      window.localStorage.setItem('username', nextState.user.name)
    }

    return returnValue
  }
}

const socket = io(process.env.ESTI_BACKEND_URL || 'http://localhost:3000')
const socketIoMiddleware = createSocketIoMiddleware(socket, 'SERVER/')
const middewareEnhancer = applyMiddleware(
  socketIoMiddleware,
  persistState,
  notify(notifyEvents)
)

export default function configureStore (initialState) {
  const dev = process.env.NODE_ENV === 'development'
  const composeEnhancers = (dev && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose
  return createStore(rootReducer, initialState, composeEnhancers(middewareEnhancer))
}
