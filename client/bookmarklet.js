(function ($) {
  var titleMax = 250
  var issues = []

  if ($('.esti-ticket-export').length) {
    return
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

  $('<button />', {
    class: 'esti-ticket-export aui-button'
  })
    .text('👲 Export tickets')
    .prependTo('#ghx-modes-tools')
    .on('click', function () {
      var fields = Object.keys(issues[0])
      var csv = issues.map(function (row) {
        return fields.map(function (fieldName) {
          return '"' + (row[fieldName].replace(/"/g, '""') || '') + '"'
        })
      })
      csv.unshift(fields)

      window.open('data:text/csv;charset=utf-8,' + escape(csv.join('\r\n')))
    })
})(jQuery)
