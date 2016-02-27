esti
  header
    a(href='/' class='name') 👲 Esti
    gear(if='{ user.name }')

  main
    room-create(if='{ !room.name }')
    room-join(if='{ !user.name && room.name }')
    room(if='{ user.name && room.name }')

  script(type='babel').
    this.mixin('redux')

    this.subscribe((state) => {
      return {
        user: state.user,
        room: state.room
      }
    })
