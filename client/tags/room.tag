room
  h1 { room.name }

  ul
    li(each='{ user in room.users }')
      span { user }

  .token(if='{ !user.pm }')
    input(type='text' name='token' placeholder='Enter your token')
    button(type='submit' onclick='{ claimRoom }') Claim

  .username(if='{ !user.name }')
    input(type='text' name='username' placeholder='Enter your username')
    button(type='submit' onclick='{ setUsername }') Claim

  script(type='babel').
    this.mixin('redux')

    import { claim } from '../../actions/room'
    import { join, setName } from '../../actions/user'
    this.dispatchify({ claim, join, setName })

    this.subscribe((state) => {
      return {
        user: state.user,
        room: state.room
      }
    })

    this.claimRoom = () => {
      if (this.room.name && this.token.value) {
        this.claim(this.room.name, this.token.value)
      }
    }

    this.setUsername = () => {
      const name = this.username.value
      this.setName(name)
      this.join(this.room.name, name)
    }
