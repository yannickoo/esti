esti
  header
    a(href='/' class='name') 👲 Esti
    gear(if='{ user.name }')

  main(class='{ notifications: notifications.length }')
    span.spinning(if='{ !route }') Loading...
    room-create(if='{ route === "create" }')
    room-join(if='{ route === "join" && !user.name && room.name }')
    room(if='{ route === "join" && user.name && room.name }')

    notifications

  footer
    ul
      li
        a(href='{ links.github }' target='_blank') Github

  style(scoped).
    :scope {
      display: block;
    }

    main {
      min-height: 80vh;
    }

    main.notifications {
      padding-bottom: 42px;
    }

    @media screen and (min-width: 600px) {
      main.notifications {
        padding-bottom: 0;
      }
    }

    footer {
      text-align: center;
    }

    footer li {
      display: inline-block;
      padding: 6px;
      text-transform: uppercase;
      font-weight: bold;
    }

  script(type='babel').
    this.mixin('redux')

    this.userInactive = false
    this.links = {
      github: 'https://github.com/yannickoo/esti'
    }

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
        room: state.room,
        notifications: state.notifications.messages
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
