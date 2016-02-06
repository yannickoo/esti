room
  h1 { name }

  ul
    li(each='{ user in users }')
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
        name: state.room.name,
        users: state.room.users
      }
    })

    this.claimRoom = () => {
      if (this.room && this.token.value) {
        this.claim(this.room, this.token.value)
      }
    }
