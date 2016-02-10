esti
  header
    a(href='index.html' class='name') Esti

  .create-room(if='{ !room.name }')
    h1 Create new room
    form(onsubmit='{ createRoom }')
      div
        label(for='username') Your name
        input(type='text' id='username' name='username' required='required')

      div
        label(for='room-name') Room name
        input(type='text' id='room-name' name='room-name' required='required')

      div
        label(for='room-token') Token
        input(type='text' id='room-token' name='room-token' required='required')

      div
        button(type='submit') Create room

  .room-enter(if='{ !user.name && room.name }')
    form(onsubmit='{ joinRoom }')
      div
        label(for='room-username') Your name
        input(type='text' id='room-username' name='room-username' required='required')

      div
        button(type='submit') Join room

  room(if='{ user.name && room.name }')

  script(type='babel').
    this.mixin('redux')

    import { join, setName, changeName } from '../../actions/user'
    import { setRoom, claim } from '../../actions/room'

    this.dispatchify({ join, setRoom, setName, changeName, claim })

    const subRoute = riot.route.create()

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

      this.setName(this.username.value)
      this.claim(this['room-name'].value, this['room-token'].value)

      riot.route(this['room-name'].value)
    }

    this.joinRoom = (e) => {
      e.preventDefault()
      this.setName(this['room-username'].value)
      this.join(this.room.name, this['room-username'].value)
    }
