vote
  .vote-control(if='{ user.pm }')
    .round-create(if='{ !round.pending }')
      details
        summary Create new round
        div
          form(onsubmit='{ createRound }')
            input(type='text' name='ticket-id' placeholder='Ticket ID', pattern='[a-zA-Z0-9]+\-[0-9]+' required)
            input(type='text' name='ticket-title' placeholder='Ticket title' required)
            input(type='url' name='ticket-url' placeholder='Ticket URL' required)

            button(type='submit') Start round

  .vote-results(if='{ round.active }')
    div(each='{ point in points }')
      div(class='{ chosen }')
        button(disabled='{ !users.length }') { value }

        ul(if='{ users.length }')
          li(each='{ user in users }') { user.name }

  script(type='babel').
    this.mixin('redux')

    import { start, restart, end, vote } from '../../actions/round'
    this.dispatchify({ start, restart, end, vote })

    this.subscribe((state) => {
      return {
        user: state.user,
        round: state.round
      }
    })

    this.createRound = (e) => {
      e.preventDefault()
      const ticket = {
        id: this['ticket-id'].value,
        title: this['ticket-title'].value,
        url: this['ticket-url'].value
      }

      this.start(ticket)
    }
