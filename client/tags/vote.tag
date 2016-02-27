vote
  .vote-control(if='{ user.pm }')
    .round-create(if='{ !round.pending && !round.active }')
      details
        summary Create new round
        div
          form(onsubmit='{ createRound }')
            input(type='text' name='ticket-id' placeholder='Ticket ID', pattern='[a-zA-Z0-9]+\-[0-9]+' required)
            input(type='text' name='ticket-title' placeholder='Ticket title' required)
            input(type='url' name='ticket-url' placeholder='Ticket URL' required)

            div.actions
              button(type='submit') Start round

  div(if='{ round.active }')
    h2 #[a(href='{ round.ticket.url }' target='_blank') { round.ticket.id }] - { round.ticket.title }

  div(if='{ round.active }')
    div(if='{ user.pm }')
      button(onclick='{ endRound }') End round

  .points(if='{ round.active }')
    div(each='{ point in votesByPoints }')
      div(class='{ "has-votes": point.userVotes.length, chosen: point.chosen, current: round.estimation === point.value, recommended: point.recommended }')
        button(disabled='{ user.pm && !point.userVotes.length }' onclick='{ voteSelect }') { point.value }

      ul(if='{ user.pm && point.userVotes.length }')
        li(each='{ user in point.userVotes }') { user.name }

  .vote-inactive(if='{ !round.active && !user.pm }')
    h2 No active voting

  style(scoped).
    :scope {
      display: block;
    }

    .points {
      display: flex;
      justify-content: center;
      margin-top: 60px;
    }

    .points > div {
      display: inline-block;
      vertical-align: top;
    }

    .points > div + div {
      margin-left: 15px;
    }

    .points button {
      display: block;
      min-width: 80px;
      padding: 20px 15px;
      background: #F7F7F7;
      color: #ddd;
      font-size: 2.5em;
      line-height: 1em;
      text-shadow: none;
      border: 0;
    }

    .points .current button,
    .points button:not([disabled]):hover,
    .points button:not([disabled]):focus {
      background: #ccc;
      color: #000;
    }

    .points .has-votes button,
    .points .has-votes button:hover,
    .points .has-votes button:focus {
      color: #fff;
      background: #d2d2d2;
    }

    .points .recommended button,
    .points .recommended button:hover,
    .points .recommended button:focus {
      color: #fff;
      background: #15a515;
    }

    .points .chosen button:hover,
    .points .chosen button:focus,
    .points .chosen button {
      background: #808080;
    }

    .points ul {
      text-align: left;
      margin-top: 10px;
      line-height: 1.4em;
    }

    .round-create details[open] summary {
      display: none;
    }

  script(type='babel').
    this.mixin('redux')

    import { start, restart, end } from '../../actions/round'
    import { startRound, vote, endRound } from '../../actions/server'
    import { voted } from '../../actions/user'
    this.dispatchify({ start, restart, end, startRound, vote, endRound, voted })

    this.subscribe((state) => {
      return {
        user: state.user,
        round: state.round,
        estimations: state.pm.votes
      }
    })

    this.on('update', () => {
      this.votesByPoints = this.round.points.map((value) => ({
        userVotes: this.estimations.filter((vote) => vote.estimation === value),
        chosen: this.round.chosen === value,
        recommended: this.round.recommended.indexOf('' + value) !== -1,
        value
      }))
    })

    this.createRound = (e) => {
      e.preventDefault()
      const ticket = {
        id: this['ticket-id'].value,
        title: this['ticket-title'].value,
        url: this['ticket-url'].value
      }

      this.startRound(ticket)
    }

    this.voteSelect = (e) => {
      const estimation = e.item.point.value

      this.vote(estimation)
      this.voted(estimation)
    }
