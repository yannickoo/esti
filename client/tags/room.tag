room
  h1 {room.name } #[span(if='{ user.pm }' class='pencil' onclick='{ editRoomName }')] #[span(if='{ !room.unlocked }' class='padlock' onclick='{ unlock }')]

  form(if='{ !room.unlocked && enterToken }' onsubmit='{ unlockRoom }' class='box box--small')
    div
      input(type='password' name='token' placeholder='Password' required='required' class='{ error: wrongToken }')

     div.actions
      button(type='submit') Unlock room

  form(if='{ changeRoomName }' onsubmit='{ updateRoomName }' class='box box--small')
    div
      input(type='textfield' name='room-name', placeholder='New room name' required)

    div.actions
      button(type='submit') Update name

  vote(if='{ !enterToken && !changeRoomName }')

  div.online-users
    h2(if='{ room.users.length }') Online users
    h2(if='{ !room.users.length }') No online users
    ul
      li(each='{ u in room.users }')
        span(class='{ pm: u.pm, voted: hasVoted(u) }' title='{ "This is your project manager": u.pm }') { u.name } #[span(if='{ user.pm }' class='remove' title='Kick user' onclick='{ removeUser }') ×]

  style(scoped).
    :scope {
      display: block;
    }

    .online-users {
      margin-top: 50px;
      text-align: center;
    }

    @media screen and (min-width: 600px) {
      .online-users {
        position: absolute;
        bottom: 20px;
        right: 20px;
        margin-top: 0;
        text-align: right;
      }
    }

    .online-users h2 {
      font-size: 16px;
      text-transform: uppercase;
    }

    .online-users li {
      line-height: 1.4em;
    }

    .online-users li > span {
      padding-right: 10px;
    }

    .online-users .pm {
      color: gray;
    }

    .online-users .voted {
      position: relative;
    }

    .online-users .voted:after {
      display: inline-block;
      position: absolute;
      top: 5px;
      right: -5px;
      width: 10px;
      height: 10px;
      content: '';
      background: url(../assets/images/icons/check.svg) no-repeat;
      background-size: 10px;
    }

  script(type='babel').
    this.mixin('redux')

    import { slug } from '../../server/utils'
    import { claim, userKick, setRoomName } from '../../actions/server'
    this.dispatchify({ claim, userKick, setRoomName })

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

    this.on('update', () => {
      if (this.user.pm) {
        this.enterToken = false
      }
    })

    this.on('updated', () => {
      if (this.enterToken) {
        this.token.focus()
      }

      this.wrongToken = this.enterToken && !this.user.pm

      if (this.wrongToken) {
        this.token.value = ''
      }
    })

    this.unlockRoom = (e) => {
      this.wrongToken = false
      this.claim({
        username: this.user.name,
        room: this.room.name,
        slug: this.room.slug,
        token: this.token.value
      })
    }

    this.removeUser = (e) => {
      this.userKick(this.room.slug, e.item.u.socket)
    }

    this.unlock = (e) => {
      this.enterToken = !this.enterToken
    }

    this.hasVoted = (user) => {
      return !!this.round.userVotes.find((vote) => vote.socket === user.socket)
    }

    this.editRoomName = (e) => {
      this.changeRoomName = !this.changeRoomName
    }

    this.updateRoomName = (e) => {
      this.setRoomName(this.room.slug, this['room-name'].value)
      this.changeRoomName = null
    }
