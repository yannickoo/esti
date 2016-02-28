import { createStore, applyMiddleware } from 'redux'
import rootReducer from '../reducers'
import createSocketIoMiddleware from 'redux-socket.io'
import io from 'socket.io-client'

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
const socketIoMiddleware = createSocketIoMiddleware(socket, 'server/')
const createStoreWithMiddleware = applyMiddleware(
  socketIoMiddleware,
  persistState
)(createStore)

export default function configureStore (initialState) {
  return createStoreWithMiddleware(rootReducer, initialState,
    window.devToolsExtension ? window.devToolsExtension() : undefined
  )
}
