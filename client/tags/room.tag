room(class='{ active: room.active }')
  h1 {room.name } #[span(class='{ hidden: room.active }' class='padlock' onclick='{ unlock }')]

  div.online-users
    h2(if='{ room.users.length }') Online users
    h2(if='{ !room.users.length }') No online users
    ul
      li(each='{ u in room.users }')
        span { u.name } #[span(if='{ user.pm }' class='remove' title='Kick user' onclick='{ removeUser }') ×]

  form(if='{ enterToken }' onsubmit='{ unlockRoom }' class='box box--small')
    div
      input(type='text' name='token' placeholder='Token' required='required')

     div.actions
      button(type='submit') Unlock room

  script(type='babel').
    this.mixin('redux')

    import { claim, pmConnected, pmUnavailable, userDisconnected, userKick } from '../../actions/room'
    this.dispatchify({ claim, pmConnected, pmUnavailable, userDisconnected, userKick })

    this.subscribe((state) => {
      return {
        user: state.user,
        room: state.room
      }
    })

    this.on('update', function () {
      if (!this.user.active) {
        console.warn('You got kicked!')
        riot.route('/')
      }
    })

    this.unlockRoom = (e) => {
      e.preventDefault()
      this.enterToken = false
      this.claim(this.room.name, this.token.value)
    }

    this.removeUser = (e) => {
      e.preventDefault()
      this.userKick(this.room.name, e.item.u.socket)
    }

    this.unlock = (e) => {
      this.enterToken = true
    }
