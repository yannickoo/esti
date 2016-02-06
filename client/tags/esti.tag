esti
  header
    a(href='index.html' class='name') Esti

  .create-room(if='{ !room }')
    h1 Create new room
    form(onsubmit='{ createRoom }')
      div
        label(for='username') Your name
        input(type='text' id='username' name='username' value='{ name }' required='required')

      div
        label(for='room-name') Room name
        input(type='text' id='room-name' name='room-name' required='required')

      div
        button(type='submit') Create room

  room(if='{ room }')

  script(type='babel').
    this.mixin('redux')

    import { join, setName, changeName } from '../../actions/user'
    import { setRoom, claim } from '../../actions/room'

    this.dispatchify({ join, setRoom, setName, changeName, claim })

    const subRoute = riot.route.create()

    subRoute('/*-*', (room, name) => {
      this.setRoom(room)
      this.setName(name)
      this.join(room, name)
    })

    subRoute('/*', (room) => {
      this.setRoom(room)

      this.name && this.join(room, this.name)
    })

    this.subscribe((state) => {
      return {
        name: state.user.name,
        room: state.room.name
      }
    })

    this.createRoom = (e) => {
      this.setName(this.username.value)

      e.preventDefault()

      riot.route(this['room-name'].value)
    }
