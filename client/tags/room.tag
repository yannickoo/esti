room
  h1 {room.name } #[span(if='{ !room.unlocked }' class='padlock' onclick='{ unlock }')]

  form(if='{ !room.unlocked && enterToken }' onsubmit='{ unlockRoom }' class='box box--small')
    div
      input(type='password' name='token' placeholder='Token' required='required' class='{ error: wrongToken }')

     div.actions
      button(type='submit') Unlock room

  vote(if='{ !enterToken }')

  div.online-users
    h2(if='{ room.users.length }') Online users
    h2(if='{ !room.users.length }') No online users
    ul
      li(each='{ u in room.users }')
        span(class='{ pm: u.pm, voted: hasVoted(u) }') { u.name } #[span(if='{ user.pm }' class='remove' title='Kick user' onclick='{ removeUser }') ×]

  style(scoped).
    :scope {
      display: block;
    }

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

    const kickHandler = () => {
      if (this.room.name) {
        return
      }

      console.warn('You got kicked!')
      this.off('update', kickHandler)
      riot.route('/')
    }

    this.on('mount', () => {
      this.on('update', kickHandler)
    })

    this.on('updated', () => {
      if (this.enterToken) {
        this.token.focus()
      }

      this.wrongToken = this.enterToken && !this.user.pm

      if (this.wrongToken) {
        this.token.value = ''
      }

      if (this.user.pm) {
        this.enterToken = false
      }
    })

    this.unlockRoom = (e) => {
      this.claim(this.user.name, this.room.name, this.token.value)
    }

    this.removeUser = (e) => {
      this.userKick(this.room.name, e.item.u.socket)
    }

    this.unlock = (e) => {
      this.enterToken = !this.enterToken
    }

    this.hasVoted = (user) => {
      return !!this.round.userVotes.find((vote) => vote.socket === user.socket)
    }
