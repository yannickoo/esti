room
  h1 {room.name } #[span(if='{ user.pm }' class='pencil' onclick='{ editRoomName }')] #[span(if='{ !room.unlocked }' class='padlock' onclick='{ unlock }')]

  form(if='{ !room.unlocked && enterToken }' onsubmit='{ unlockRoom }' class='box box--small')
    div
      input(type='password' name='token' placeholder='Password' required='required' class='{ error: wrongToken }')

     div.actions
      button(type='submit') Unlock room

  form(if='{ changeRoomName }' onsubmit='{ updateRoomName }' class='box box--small')
    div
      input(type='textfield' name='room-name', value='{ room.name }' placeholder='New room name' required)

    div.actions
      button(type='submit') Update name

  vote(if='{ !enterToken && !changeRoomName }')
  estimations(if='{ pm.estimations.length }')
  online-users

  style(scoped).
    :scope {
      display: block;
    }

  script(type='babel').
    this.mixin('redux')

    import { slug } from '../../server/utils'
    import { claim, setRoomName } from '../../actions/server'
    this.dispatchify({ claim, setRoomName })

    this.subscribe((state) => {
      return {
        user: state.user,
        pm: state.pm,
        room: state.room
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

    this.unlock = (e) => {
      this.enterToken = !this.enterToken
    }

    this.editRoomName = (e) => {
      this.changeRoomName = !this.changeRoomName
    }

    this.updateRoomName = (e) => {
      this.setRoomName(this.room.slug, this['room-name'].value)
      this.changeRoomName = null
    }
