import { v4 as uuid } from 'uuid'

import { NOTIFICATION_CREATE, NOTIFICATION_REMOVE } from '../../actions/notifications'
import { USER_CONNECTED, USER_DISCONNECTED, UNLOCKED } from '../../actions/room'
import { START, VOTE_SELECTED } from '../../actions/round'
import { TICKET_LIST } from '../../actions/pm'

function getMessage (action) {
  const message = {}

  if (action.type === USER_CONNECTED) {
    message.text = `${action.user.name} has joined the room`
  }

  if (action.type === USER_DISCONNECTED) {
    message.text = `${action.user.name} has left the room`
  }

  if (action.type === UNLOCKED) {
    message.text = `${action.user.name} has unlocked the room`
  }

  if (action.type === START) {
    message.text = 'New estimation round started'
  }

  if (action.type === VOTE_SELECTED) {
    if (action.chosen) {
      message.text = `The final estimation is ${action.chosen.estimation}`
    } else {
      message.text = 'The round has been ended'
    }
  }

  if (action.type === TICKET_LIST) {
    message.text = `${action.tickets.length} tickets have been imported`
  }

  if (message.text) {
    message.id = uuid()
  }

  return message
}

export default function notifications (state = { messages: [] }, action) {
  if (action.type === NOTIFICATION_CREATE) {
    const { caller } = action
    const message = getMessage(caller)

    if (!message.id) {
      return state
    }

    const messages = [...state.messages, message]

    return { ...state, messages }
  }

  if (action.type === NOTIFICATION_REMOVE) {
    const { id } = action
    const messages = state.messages.filter((msg) => msg.id !== id)

    return { ...state, messages }
  }

  return state
}
