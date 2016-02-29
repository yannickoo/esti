(function ($) {
  var titleMax = 100
  var issues = []

  if ($('.esti-ticket-export').length) {
    return;
  }

  $('#ghx-backlog .ghx-backlog-group .js-issue-list .js-issue').each(function () {
    var $issue = $(this)

    if ($issue.find('.ghx-statistic-badge').text().trim()) {
      return
    }

    var id = $issue.data('issue-key')
    var title = $issue.find('.ghx-summary').text()
    var link = $issue.find('.ghx-key a')
    var url = link[0].href

    if (title.length > titleMax) {
      title = title.substr(0, titleMax) + '…'
    }

    issues.push({
      id: id,
      title: title,
      url: url
    })
  })

  var $tickets = $('<input />', {
    value: JSON.stringify(issues),
    readonly: 'readonly'
  })
    .css({
      display: 'block',
      marginTop: '10px',
      width: '260px',
      padding: '5px',
    })
    .hide()
    .on('focus', function () {
      this.select()
    })
    .appendTo('#ghx-modes-tools')

  $('<button />', {
    class: 'esti-ticket-export aui-button'
  })
    .text('👲 Export tickets')
    .prependTo('#ghx-modes-tools')
    .on('click', function () {
      $tickets.show()
      $tickets[0].select()

      try {
        document.execCommand('copy')
        $tickets.hide()
        window.alert('The unestimated tickets have been stored in your clipboard :)')
      } catch (err) {
        $tickets.show()
        window.alert('Sorry, I could\'nt copy the tickets for you so you should do this manually :(')
      }
    })
})(jQuery)
