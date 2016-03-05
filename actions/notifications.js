export const NOTIFICATION_CREATE = 'notification/create'
export const NOTIFICATION_REMOVE = 'notification/remove'

export function notify (caller) {
  return {
    type: NOTIFICATION_CREATE,
    caller
  }
}

export function removeNotification (id) {
  return {
    type: NOTIFICATION_REMOVE,
    id
  }
}
