room-create
  h1 Create new room

  form(onsubmit='{ createRoom }')
    input(type='text' name='username' placeholder='Your name' required='required' autofocus='autofocus' if='{ !user.name }')

    input(type='text' name='room-name' placeholder='Room name' required='required')

    input(type='text' name='room-token' placeholder='Token' required='required')

    div.actions
      button(type='submit') Create room

  script(type='babel').
    this.mixin('redux')

    import slug from 'slug'
    import { claim } from '../../actions/server'
    this.dispatchify({ claim })

    slug.defaults.mode = 'rfc3986'

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

      riot.route(slug(this['room-name'].value))
    }
