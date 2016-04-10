estimations
  table.estimations(class='{ show: showEstimations }')
    thead
      tr
        th Ticket
        th Estimation
    tbody
      tr(each='{ round in pm.estimations }')
        td.ticket
          span(if='{ round.ticket.id }') #[a(href='{ round.ticket.url }' target='_blank') { round.ticket.id }]
          span(if='{ round.ticket.id && !round.ticket.url }') { round.ticket.id }
          span(if='{ !round.ticket.id && round.ticket.url }') #[a(href='{ round.ticket.url }' target='_blank') { round.ticket.title }]
          span(if='{ !round.ticket.id && !round.ticket.url }') { round.ticket.title }
        td { round.estimation }

  span.trophy(title='Display estimation results' onclick='{ toggleEstimations }')

  style(scoped).
    :scope {
      display: block;
      position: fixed;
      bottom: 20px;
      left: 20px;
      text-align: left;
      transition: bottom .3s ease-in;
    }

    main.notifications :scope {
      bottom: 55px;
    }

    @media screen and (min-width: 600px) {
      main.notifications :scope {
        bottom: 20px;
      }
    }

    table {
      margin-bottom: 20px;
      margin-left: 2px;
      padding: 8px;
      z-index: 1;
      background: #fff;
      border-bottom-left-radius: 0;
      border-top-right-radius: 4px;
    }

    table:before {
      top: auto;
      bottom: -11px;
      right: auto;
      left: -1px;
      border-width: 10px 10px 0 10px;
      border-color: #ddd transparent transparent transparent;
    }

    thead {
      font-size: 12px;
      text-transform: uppercase;
    }

    th,
    td {
      padding: 5px;
    }

    .ticket {
      display: block;
      max-width: 320px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .trophy {
      opacity: 0.3;
    }

    table.show + .trophy {
      opacity: 1;
    }

  script(type='babel').
    this.mixin('redux')

    this.subscribe((state) => {
      return {
        pm: state.pm
      }
    })

    this.toggleEstimations = (e) => {
      this.showEstimations = !this.showEstimations
    }
