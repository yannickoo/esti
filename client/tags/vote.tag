vote
  .vote-control(if='{ user.pm }')
    .round-create(if='{ !round.pending && !round.active }')
      details
        summary Create new round
        div
          p
            a(href='#' onclick='{ importTicketTrigger }' if='{ !showTicketImport && !ticketImportError && !pm.tickets.length }') Import tickets
            span(if='{ pm.tickets.length }') { pm.tickets.length } tickets have been imported ✅
            span(if='{ ticketImportError }') Your exported code seems to be malformed 😬
            a(href='{ bookmarkletCode }' title='Drag this into your bookmarks bar' class='bookmarklet' if='{ showTicketImport && !ticketImportError }') 👲 JIRA Esti

          input(type='text' name='tickets' placeholder='Paste code' required if='{ showTicketImport || ticketImportError }' onpaste='{ ticketsPasted }')

          p
            a(href='#' onclick='{ cancelTicketImport }' if='{ showTicketImport || ticketImportError }') Cancel

          form(onsubmit='{ createRound }' if='{ !showTicketImport && !ticketImportError }')
            input(type='text' name='ticket-id' placeholder='Ticket ID', pattern='[a-zA-Z0-9]+\-[0-9]+' required list='{ "ticket-list": pm.tickets.length }' autocomplete='{ off: pm.tickets.length }')
            input(type='text' name='ticket-title' placeholder='Ticket title' required if='{ !ticketImportError && !pm.tickets.length }')
            input(type='url' name='ticket-url' placeholder='Ticket URL' required if='{ !ticketImportError && !pm.tickets.length }')

            datalist#ticket-list
              option(each='{ pm.tickets }' value='{ id }') { formatTicketTitle(title) }

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
      flex-wrap: wrap;
      margin-top: 60px;
    }

    .points > div {
      margin-right: 15px;
      margin-bottom: 15px;
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

    .bookmarklet {
      cursor: -webkit-grab;
      cursor: -moz-grab;
    }

  script(type='babel').
    this.mixin('redux')

    this.bookmarkletCode = "javascript:(function(){if(window.location.hostname==='esti.io'){return window.alert('Drag this into your bookmarks bar and click it on the backlog page in JIRA.')}bookmarklet=document.createElement('script');bookmarklet.type='text/javascript';bookmarklet.src='https://esti.io/bookmarklet.js?x='+(Math.random());document.getElementsByTagName('head')[0].appendChild(bookmarklet);})();"

    import { start, restart, end } from '../../actions/round'
    import { startRound, vote, endRound } from '../../actions/server'
    import { voted } from '../../actions/user'
    import { ticketList } from '../../actions/pm'
    this.dispatchify({ start, restart, end, startRound, vote, endRound, voted, ticketList })

    this.subscribe((state) => {
      return {
        user: state.user,
        pm: state.pm,
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

    this.on('updated', () => {
      if (this.showTicketImport) {
        this.tickets.focus()
      }
    })

    this.createRound = (e) => {
      e.preventDefault()

      const ticketId = this['ticket-id'].value
      let ticket = this.pm.tickets.find((t) => {
        return t.id === ticketId
      })

      if (!ticket) {
        ticket = {
          id: ticketId,
          title: this['ticket-title'].value,
          url: this['ticket-url'].value
        }
      }

      this.startRound(ticket)
    }

    this.voteSelect = (e) => {
      const estimation = e.item.point.value

      this.vote(estimation)
      this.voted(estimation)
    }

    this.formatTicketTitle = (title) => {
      const max = 100

      if (title.length < max) {
        return title
      }

      return `${title.substr(0, max)}…`
    }

    this.importTicketTrigger = (e) => {
      this.showTicketImport = true
    }

    this.cancelTicketImport = (e) => {
      this.showTicketImport = null
      this.ticketImportError = null
    }

    this.ticketsPasted = (e) => {
      let tickets = []
      const data = e.clipboardData.getData('text/plain')

      try {
        tickets = JSON.parse(data)

        if (typeof tickets !== 'object') {
          throw 'Pasted tickets are in the wrong format'
        }

        this.ticketImportError = false
        this.showTicketImport = false
        this.ticketList(tickets)
      }
      catch (e) {
        this.ticketImportError = true
      }
    }
