esti
  header
    a(href='/' class='name') 👲 Esti

  main
    .create-room(if='{ !room.name }')
      h1 Create new room

      form(onsubmit='{ createRoom }')
        input(type='text' name='username' placeholder='Your name' required='required' autofocus='autofocus')

        input(type='text' name='room-name' placeholder='Room name' pattern='[a-z0-9\s]+' required='required')

        input(type='text' name='room-token' placeholder='Token' required='required')

        div.actions
          button(type='submit') Create room

    .room-enter(if='{ !user.name && room.name }')
      h1 { room.name }

      form(onsubmit='{ joinRoom }')
        input(type='text' name='room-username' placeholder='Your name' required='required' autofocus='autofocus')

        div.actions
          button(type='submit') Join room

    room(if='{ user.name && room.name }')

  script(type='babel').
    this.mixin('redux')

    import { setRoom } from '../../actions/room'
    import { join, changeName, claim } from '../../actions/server'
    this.dispatchify({ join, setRoom, changeName, claim })

    const subRoute = riot.route.create()

    subRoute('/', () => {
      this.setRoom('')
    })

    subRoute('/*', (room) => {
      this.setRoom(room)
    })

    this.subscribe((state) => {
      return {
        user: state.user,
        room: state.room
      }
    })

    this.createRoom = (e) => {
      e.preventDefault()

      this.join(this.room.name, this['room-username'].value)
      this.claim(this['room-name'].value, this['room-token'].value)

      riot.route(this['room-name'].value)
    }

    this.joinRoom = (e) => {
      e.preventDefault()
      this.join(this.room.name, this['room-username'].value)
    }
