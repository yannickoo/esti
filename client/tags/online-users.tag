online-users
  h2(if='{ room.users.length }') Online users
  h2(if='{ !room.users.length }') No online users
  ul
    li(each='{ u in room.users }')
      span(class='{ pm: u.pm, voted: hasVoted(u) }' title='{ "This is your project manager": u.pm }')
        | #[span.name { u.name }]
        | #[span(if='{ user.pm }' class='remove' title='Kick user' onclick='{ removeUser }') ×]

  style(scoped).
    :scope {
      margin-top: 50px;
      text-align: center;
    }

    @media screen and (min-width: 600px) {
      :scope {
        position: absolute;
        bottom: 20px;
        right: 20px;
        margin-top: 0;
        text-align: right;
      }
    }

    h2 {
      font-size: 16px;
      text-transform: uppercase;
    }

    li {
      line-height: 1.4em;
    }

    li > span {
      padding-right: 10px;
    }

    li > span .enable {
      visibility: hidden;
    }

    li > span:hover .enable {
      visibility: visible;
    }

    .pm {
      color: gray;
    }

    .voted {
      position: relative;
    }

    .voted:after {
      display: inline-block;
      position: absolute;
      top: 7px;
      right: -5px;
      width: 10px;
      height: 10px;
      content: '';
      background: url(../assets/images/icons/check.svg) no-repeat;
      background-size: 10px;
    }

    span span {
      vertical-align: middle;
    }

    span + span {
      padding-left: 5px;
    }

    .eye {
      width: 15px;
      height: 15px;
    }

  script(type='babel').
    this.mixin('redux')

    import { userKick } from '../../actions/server'
    this.dispatchify({ userKick })

    this.subscribe((state) => {
      return {
        user: state.user,
        pm: state.pm,
        room: state.room,
        round: state.round
      }
    })

    this.removeUser = (e) => {
      this.userKick(this.room.slug, e.item.u.socket)
    }

    this.addViewerRole = (e) => {
      console.log(e.item)
    }

    this.removeViewerRole = (e) => {

    }

    this.hasVoted = (user) => {
      return !!this.round.userVotes.find((voter) => voter.user.socket === user.socket)
    }
