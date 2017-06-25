import { v4 as uuid } from 'uuid'
import { handleActions } from 'redux-actions'

import { notify, removeNotification } from '../../actions/notifications'
import { userConnected, userDisconnected, unlocked } from '../../actions/room'
import { start, voteSelected } from '../../actions/round'
import { ticketList } from '../../actions/pm'

const messageMap = {
  [userConnected]: (user) => `${user.name} has joined the room`,
  [userDisconnected]: (user) => `${user.name} has left the room`,
  [unlocked]: (user) => `${user.name} has unlocked the room`,
  [start]: () => 'New estimation round started',
  [voteSelected]: (chosen) => {
    if (chosen) {
      return `The final estimation is ${chosen.estimation}`
    } else {
      return 'The round has been ended'
    }
  },
  [ticketList]: (tickets) => `${tickets.length} tickets have been imported`
}

function getMessage ({ type, payload }) {
  const messageCreator = messageMap[type]

  if (typeof messageCreator !== 'function') {
    return {}
  }

  const message = messageCreator(payload)
  const id = uuid()

  return { message, id }
}

export default handleActions({
  [notify]: (state, action) => {
    const { payload: caller } = action
    const message = getMessage(caller)

    if (!message.id) {
      return state
    }

    const messages = [...state.messages, message]

    return { ...state, messages }
  },

  [removeNotification]: (state, action) => {
    const { payload: id } = action
    const messages = state.messages.filter((msg) => msg.id !== id)

    return { ...state, messages }
  }
}, { messages: [] })
