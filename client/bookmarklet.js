(function ($) {
  var stories = []

  $('#ghx-backlog .ghx-backlog-group .js-issue-list .js-issue').each(function () {
    var $issue = $(this)

    if ($issue.find('.ghx-statistic-badge').text().trim()) {
      return
    }

    var id = $issue.data('issue-key')
    var title = $issue.find('.ghx-summary').text()
    var link = $issue.find('.ghx-key a')
    var url = link[0].href

    stories.push({
      id: id,
      title: title,
      url: url
    })
  })

  window.prompt('Please copy the exported code so we can import it in Esti.', JSON.stringify(stories))
})(jQuery)
