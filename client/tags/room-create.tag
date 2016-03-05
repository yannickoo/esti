room-create
  h1 Create new room

  form(onsubmit='{ createRoom }')
    input(type='text' name='username' placeholder='Your name' required='required' autofocus='autofocus' if='{ !user.name }')

    input(type='text' name='room-name' placeholder='Room name' required='required')

    input(type='password' name='room-token' placeholder='Password' required='required' title='Enter a password for the room so you can unlock it later on.')

    div.actions
      button(type='submit') Create room

  script(type='babel').
    this.mixin('redux')

    import { slug } from '../../server/utils'
    import { claim } from '../../actions/server'
    this.dispatchify({ claim })

    this.subscribe((state) => {
      return {
        user: state.user,
        room: state.room,
        round: state.round
      }
    })

    const updated = () => {
      const focusInput = !this.user.name ? this.username : this['room-name']
      focusInput.focus()

      if (this.user.pm) {
        riot.route(slug(this['room-name'].value))
      }
    }

    this.on('mount', () => {
      this.on('updated', updated)
    })

    this.on('unmount', () => {
      this.off('updated', updated)
    })

    this.createRoom = (e) => {
      const username = this.user.name || this.username.value

      this.claim(username, this['room-name'].value, this['room-token'].value)
    }
