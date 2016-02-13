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
        div(class='{ point.chosen }')
          button(disabled='{ user.pm && !point.userVotes.length }' onclick='{ voteSelect }') { point.value }

        ul(if='{ user.pm && point.userVotes.length }')
          li(each='{ user in point.userVotes }') { user.name }

  .vote-inactive(if='{ !round.active }')
    h2 Round inactive

  script(type='babel').
    this.mixin('redux')

    import { start, restart, end, voteSelected } from '../../actions/round'
    import { startRound, vote } from '../../actions/server'
    this.dispatchify({ start, restart, end, startRound, voteSelected, vote })

    this.subscribe((state) => {
      return {
        user: state.user,
        round: state.round
      }
    })

    this.on('update', () => {
      this.votesByPoints = this.round.points.map((value) => ({
        userVotes: this.round.userVotes.filter((vote) => vote.value === value),
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
      this.voteSelected(e.item.point.value)
      this.vote(e.item.point.value)
    }
