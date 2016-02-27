room-create
  h1 Create new room

  form(onsubmit='{ createRoom }')
    input(type='text' name='username' placeholder='Your name' required='required' autofocus='autofocus')

    input(type='text' name='room-name' placeholder='Room name' pattern='[a-z0-9\s]+' required='required')

    input(type='text' name='room-token' placeholder='Token' required='required')

    div.actions
      button(type='submit') Create room

  script(type='babel').
    this.mixin('redux')

    import { claim } from '../../actions/server'
    this.dispatchify({ claim })

    this.subscribe((state) => {
      return {
        user: state.user,
        room: state.room,
        round: state.round
      }
    })

    this.createRoom = (e) => {
      e.preventDefault()

      this.claim(this.username.value, this['room-name'].value, this['room-token'].value)

      riot.route(this['room-name'].value)
    }
