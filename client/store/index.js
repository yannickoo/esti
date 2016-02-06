import { createStore, applyMiddleware } from 'redux'
import rootReducer from '../reducers'
import createSocketIoMiddleware from 'redux-socket.io'
import io from 'socket.io-client'

const socket = io('http://localhost:3000')
const socketIoMiddleware = createSocketIoMiddleware(socket, 'server/')
const createStoreWithMiddleware = applyMiddleware(socketIoMiddleware)(createStore)

export default function configureStore (initialState) {
  return createStoreWithMiddleware(rootReducer, initialState)
}
