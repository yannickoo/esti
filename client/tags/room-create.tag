room-create
  h1 Create new room

  form(onsubmit='{ createRoom }')
    input(type='text' name='username' placeholder='Your name' required='required' autofocus='autofocus' if='{ !user.name }')

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

    this.on('updated', () => {
      const focusInput = !this.user.name ? this.username : this['room-name']
      focusInput.focus()
    })

    this.createRoom = (e) => {
      e.preventDefault()

      const username = this.user.name || this.username.value

      this.claim(username, this['room-name'].value, this['room-token'].value)

      riot.route(this['room-name'].value)
    }
