esti
  header
    a(href='/' class='name') 👲 Esti
    .menu(if='{ user.name }')
      a.trigger(href='#')
      form(onsubmit='{ updateSettings }')
        div
          label(for='menu-username') Your name
          input(type='text' name='menu-username' id='menu-username' value='{ user.name }' required)

        div(if='{ user.pm }')
          label(for='menu-points') Available points
          input(
            type='textfield'
            name='menu-points'
            id='menu-points'
            title='Please enter comma-separated values'
            pattern='^([\\d\\w]+(, ?[\\d\\w]+)*)?$'
            value='{ availablePoints }',
            disabled='{ round.active }'
            required
          )

        div.actions
          button(type='submit') Save

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
    import { join, setName, claim, setPoints } from '../../actions/server'
    this.dispatchify({ join, setRoom, setName, claim, setPoints })

    const subRoute = riot.route.create()

    subRoute('/', () => {
      this.setRoom('')
    })

    subRoute('/*', (room) => {
      this.setRoom(room)

      const name = this.user.name
      if (name) {
        this.join(room, name)
      }
    })

    this.subscribe((state) => {
      return {
        user: state.user,
        room: state.room,
        round: state.round
      }
    })

    this.on('update', () => {
      this.availablePoints = this.round.points.join(',')
    })

    this.createRoom = (e) => {
      e.preventDefault()

      this.claim(this.username.value, this['room-name'].value, this['room-token'].value)

      riot.route(this['room-name'].value)
    }

    this.joinRoom = (e) => {
      e.preventDefault()
      this.join(this.room.name, this['room-username'].value)
    }

    this.updateSettings = (e) => {
      e.preventDefault()

      const nextName = this['menu-username'].value
      const nextPoints = this['menu-points'].value

      if (nextName !== this.user.name) {
        this.setName(nextName)
      }

      if (nextPoints !== this.availablePoints) {
        this.setPoints(nextPoints.split(/, ?/))
      }
    }
