vote
  .vote-control(if='{ user.pm }')
    .round-create(if='{ !round.pending && !round.active }')
      details(open='{ detailsOpen }')
        summary(onclick='{ summaryClick }') Create new round
        div
          p.import
            a(href='#' onclick='{ importTicketTrigger }' if='{ !showTicketImport && !ticketImportError && !pm.tickets.length }') Import JIRA tickets
            span(if='{ ticketImportError }') Your exported code seems to be malformed 😬

          p.bookmarklet(if='{ showTicketImport && !ticketImportError }')
            span Use our bookmarklet to import tickets from&nbsp;
            a(href='{ bookmarkletCode }' title='Drag this link into your bookmarks bar' class='bookmarklet-link' onclick='{ bookmarkletClick }') JIRA to Esti

          input(type='file' name='tickets' required if='{ showTicketImport || ticketImportError }' accept='.csv' onchange='{ ticketsUpload }')

          p
            a(href='#' onclick='{ cancelTicketImport }' if='{ showTicketImport || ticketImportError }') Cancel

          form(onsubmit='{ createRound }' if='{ !showTicketImport && !ticketImportError }' name='ticket-create')
            input(if='{ pm.tickets.length }' type='text' name='ticket-id' placeholder='Ticket ID', pattern='[a-zA-Z0-9]+\-[0-9]+' required list='{ "ticket-list": pm.tickets.length }' autocomplete='off')
            input(type='text' name='ticket-title' placeholder='Title' required if='{ !ticketImportError && !pm.tickets.length }' autocomplete='off')
            input(type='url' name='ticket-url' placeholder='URL' if='{ !ticketImportError && !pm.tickets.length }' autocomplete='off')

            datalist#ticket-list
              option(each='{ pm.tickets }' value='{ id }') { formatTicketTitle(title) }

            div.actions
              button(type='submit' title='{ "Let me wait for other users": !room.users.length }' disabled='{ disabled: !room.users.length }') Start round

  div(if='{ round.active }')
    h2(if='{ round.ticket.id }') #[a(href='{ round.ticket.url }' target='_blank') { round.ticket.id }] - { round.ticket.title }
    h2(if='{ !round.ticket.id && round.ticket.url }') #[a(href='{ round.ticket.url }' target='_blank') { round.ticket.title }]
    h2(if='{ !round.ticket.id && !round.ticket.url }') { round.ticket.title }

  div(if='{ round.active }')
    div(if='{ user.pm }')
      button(onclick='{ stopRound }') End round

  .points(if='{ round.active }')
    div(each='{ point in votesByPoints }')
      div(class='{ "has-votes": point.userVotes.length, current: round.estimation === point.value, recommended: point.recommended }')
        button(disabled='{ user.pm && !point.userVotes.length }' onclick='{ voteSelect }') { point.value }

      ul(if='{ user.pm && point.userVotes.length }')
        li(each='{ user in point.userVotes }') { user.name }

  .vote-inactive(if='{ !round.active && !user.pm }')
    h2 No active voting

  style(scoped).
    :scope {
      display: block;
      margin-top: 30px;
    }

    .vote-inactive {
      margin-top: 80px;
      color: #e0e0e0;
    }

    .points {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      margin-top: 60px;
    }

    @media screen and (min-width: 600px) {
      .points {
        justify-content: center;
      }
    }

    .points > div {
      margin-right: 15px;
      margin-bottom: 15px;
      width: 28%;
    }

    @media screen and (min-width: 600px) {
      .points > div {
        width: auto;
      }
    }

    .points button {
      display: block;
      width: 100%;
      padding: 20px 15px;
      background: #f7f7f7;
      color: #ddd;
      font-size: 2.5em;
      line-height: 1em;
      text-shadow: none;
      border: 0;
    }

    @media screen and (min-width: 600px) {
     .points button {
        width: auto;
        min-width: 80px;
      }
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

    .points ul {
      text-align: left;
      margin-top: 10px;
      line-height: 1.4em;
    }

    .round-create details[open] summary {
      display: none;
    }

    .bookmarklet-link {
      cursor: -webkit-grab;
      cursor: -moz-grab;
    }

    .bookmarklet-link:active {
      cursor: -webkit-grabbing;
      cursor: -moz-grabbing;
    }

    .bookmarklet,
    .import {
      margin-bottom: 30px;
    }

  script(type='babel').
    this.mixin('redux')

    this.bookmarkletCode = "javascript:(function(){bookmarklet=document.createElement('script');bookmarklet.type='text/javascript';bookmarklet.src='https://esti.io/bookmarklet.js?x='+(Math.random());document.getElementsByTagName('head')[0].appendChild(bookmarklet);})();"

    import parse from 'csv-parse/lib/sync'
    import { start, restart } from '../../actions/round'
    import { startRound, vote } from '../../actions/server'
    import { voted } from '../../actions/user'
    import { ticketList } from '../../actions/pm'
    this.dispatchify({ start, restart, startRound, vote, voted, ticketList })

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

    this.stopRound = (e) => {
      this['ticket-create'].reset()
      this.vote()
    }

    this.voteSelect = (e) => {
      let estimation = e.item.point.value

      this.voted(estimation)

      if (this.user.pm) {
        this['ticket-create'].reset()

        estimation = {
          ticket: this.round.ticket,
          estimation: estimation
        }
      }

      this.vote(estimation)
    }

    this.formatTicketTitle = (title) => {
      const max = 140

      if (title.length < max) {
        return title
      }

      return `${title.substr(0, max)}…`
    }

    this.summaryClick = (e) => {
      this.detailsOpen = !this.detailsOpen
    }

    this.bookmarkletClick = (e) => {
      window.alert(e.target.title)
    }

    this.importTicketTrigger = (e) => {
      this.showTicketImport = true
    }

    this.cancelTicketImport = (e) => {
      this.showTicketImport = null
      this.ticketImportError = null
    }

    this.ticketsUpload = (e) => {
      const tickets = []

      if (!window.File && window.FileReader && window.FileList && window.Blob) {
        return alert('Not supported :(')
      }

      const file = e.target.files[0]
      const reader = new FileReader()

      reader.readAsText(file, 'UTF-8')
      reader.onload = (event) => {
        tickets = parse(event.target.result, { columns: true })

        this.ticketImportError = !tickets.length

        if (tickets.length) {
          this.showTicketImport = false
          this.ticketList(tickets)
        }
      }

      reader.onerror = () => {
        this.ticketImportError = true
      }
    }
