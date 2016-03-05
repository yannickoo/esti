import { USER_CONNECTED, USER_DISCONNECTED, USER_NAMECHANGE, UNLOCKED } from '../../actions/room'
import { START, VOTE, VOTE_SELECTED } from '../../actions/round'
import { TICKET_LIST } from '../../actions/pm'

import { notify } from '../../actions/notifications'

const events = [
  {
    catch: [
      USER_CONNECTED, USER_DISCONNECTED, USER_NAMECHANGE, UNLOCKED,
      START, VOTE, VOTE_SELECTED,
      TICKET_LIST
    ],
    dispatch: [notify]
  }
]

export default events
