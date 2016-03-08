esti
  header
    a(href='/' class='name') 👲 Esti
    gear(if='{ user.name }')

  main
    span.spinning(if='{ !route }') Loading...
    room-create(if='{ route === "create" }')
    room-join(if='{ route === "join" && !user.name && room.name }')
    room(if='{ route === "join" && user.name && room.name }')

    notifications

  script(type='babel').
    this.mixin('redux')

    this.userInactive = false

    import away from 'away'
    import { setRoom } from '../../actions/server'
    this.dispatchify({ setRoom })

    const subRoute = riot.route.create()

    subRoute('/', () => {
      this.route = 'create'
      this.setRoom('')
    })

    subRoute('/*', (room) => {
      this.route = 'join'
      this.setRoom(room)
    })

    this.subscribe((state) => {
      return {
        user: state.user,
        room: state.room
      }
    })

    this.on('mount', () => {
      const timer = away(20 * 1000);

      timer.on('idle', () => {
        this.userInactive = true
      })

      timer.on('active', () => {
        this.userInactive = false
      })
    })
