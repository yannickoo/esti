room
  h1 {room.name } #[span(if='{ !room.unlocked }' class='padlock' onclick='{ unlock }')]

  vote

  div.online-users
    h2(if='{ room.users.length }') Online users
    h2(if='{ !room.users.length }') No online users
    ul
      li(each='{ u in room.users }')
        span(class='{ pm: u.pm, voted: hasVoted(u) }') { u.name } #[span(if='{ user.pm }' class='remove' title='Kick user' onclick='{ removeUser }') ×]

  form(if='{ enterToken }' onsubmit='{ unlockRoom }' class='box box--small')
    div
      input(type='text' name='token' placeholder='Token' required='required')

     div.actions
      button(type='submit') Unlock room

  style(scoped).
    .online-users {
      position: absolute;
      bottom: 20px;
      right: 20px;
      text-align: right;
    }

    .online-users h2 {
      font-size: 16px;
      text-transform: uppercase;
    }

    .online-users .pm {
      color: gray;
    }

  script(type='babel').
    this.mixin('redux')

    import { claim, userKick } from '../../actions/server'
    this.dispatchify({ claim, userKick })

    this.subscribe((state) => {
      return {
        user: state.user,
        room: state.room,
        round: state.round
      }
    })

    this.on('update', function () {
      if (!this.user.active) {
        console.warn('You got kicked!')
        riot.route('/')
      }
    })

    this.unlockRoom = (e) => {
      e.preventDefault()
      this.enterToken = false
      this.claim(this.room.name, this.token.value)
    }

    this.removeUser = (e) => {
      e.preventDefault()
      this.userKick(this.room.name, e.item.u.socket)
    }

    this.unlock = (e) => {
      this.enterToken = true
    }

    this.hasVoted = (user) => {
      return !!this.round.userVotes.find((vote) => vote.socket === user.socket)
    }
