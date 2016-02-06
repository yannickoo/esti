room
  h1 { room.name }

  ul
    li(each='{ user in room.users }')
      span { user }

  .token(if='{ !pm }')
    input(type='text' name='token' placeholder='Enter your token')
    button(type='submit' onclick='{ claimRoom }') Claim

  script(type='babel').
    this.mixin('redux')

    import { claim } from '../../actions/room'
    this.dispatchify({ claim })

    this.subscribe((state) => {
      return {
        pm: state.user.pm,
        room: state.room
      }
    })

    this.claimRoom = () => {
      if (this.room.name && this.token.value) {
        this.claim(this.room.name, this.token.value)
      }
    }
