room(class='{ active: room.active }')
  h1 { room.name }

  ul
    li(each='{ user in room.users }')
      span { user.name }

  form(if='{ !room.active && !user.pm }' onsubmit='{ unlockRoom }')
    div
     label(for='token') Token
      input(type='text' id='token' name='token' required='required')

     div
      button(type='submit') Unlock room

  script(type='babel').
    this.mixin('redux')

    import { claim, pmConnected, pmUnavailable, userDisconnected } from '../../actions/room'
    this.dispatchify({ claim, pmConnected, pmUnavailable, userDisconnected })

    this.subscribe((state) => {
      console.log('ROOM', state.room)
      return {
        user: state.user,
        room: state.room
      }
    })

    this.unlockRoom = (e) => {
      e.preventDefault()
      this.claim(this.room.name, this.token.value)
    }
