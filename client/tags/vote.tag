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

            button(type='submit') Start round

  .vote-results(if='{ round.active }')
    div(if='{ user.pm }')
      button(type='submit') End round

    div(if='{ !user.pm }')
      h2 #[a(href='{ round.ticket.url }' target='_blank') { round.ticket.id }] - { round.ticket.title }

    .points
      div(each='{ point in votesByPoints }')
        div(class='{ chosen: point.chosen, current: round.estimation === point.value }')
          button(disabled='{ user.pm && !point.userVotes.length }' onclick='{ voteSelect }') { point.value }

        ul(if='{ user.pm && point.userVotes.length }')
          li(each='{ user in point.userVotes }') { user.name }

  .vote-inactive(if='{ !round.active }')
    h2 Round inactive

  script(type='babel').
    this.mixin('redux')

    import { start, restart, end } from '../../actions/round'
    import { startRound, vote } from '../../actions/server'
    import { voted } from '../../actions/user'
    this.dispatchify({ start, restart, end, startRound, vote, voted })

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
