room-join
  h1 { room.name }

  form(onsubmit='{ joinRoom }')
    input(type='text' name='username' placeholder='Your name' required='required' autofocus='autofocus')

    div.actions
      button(type='submit') Join room


  script(type='babel').
    this.mixin('redux')

    import { join, setRoom } from '../../actions/server'
    this.dispatchify({ join, setRoom })

    const subRoute = riot.route.create()

    subRoute('/*', (room) => {
      const name = this.user.name
      if (name) {
        this.join(room, name)
      }
    })

    this.subscribe((state) => {
      return {
        user: state.user,
        room: state.room
      }
    })

    this.joinRoom = (e) => {
      this.join(this.room.slug, this.username.value)
    }
