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
        div(class='{ chosen: point.chosen, current: round.estimation === point.value }')
          button(disabled='{ user.pm && !point.userVotes.length }' onclick='{ voteSelect }') { point.value }

        ul(if='{ user.pm && point.userVotes.length }')
          li(each='{ user in point.userVotes }') { user.name }

  .vote-inactive(if='{ !round.active && !user.pm }')
    h2 No active voting

  style(scoped).
    .points {
      display: flex;
      justify-content: space-between;
      margin-top: 60px;
    }

    .points > div {
      display: inline-block;
      vertical-align: top;
    }

    .points .current button,
    .points button:not([disabled]):hover,
    .points button:not([disabled]):focus,
    .points > .winner button {
      background: #ccc;
      color: #000;
    }

    .points button {
      background: #ddd;
      color: #bbb;
    }

    .points button {
      display: block;
      width: 80px;
      padding: 20px 15px;
      background: #F7F7F7;
      color: #ddd;
      font-size: 2.5em;
      line-height: 1em;
      text-shadow: none;
      border: 0;
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
