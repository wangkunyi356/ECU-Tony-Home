/* AI日报: fetch data/daily-ai.json and render into #ai article. */
(function () {
  var meta = document.getElementById('ai-meta');
  var take = document.getElementById('ai-takeaways');
  var list = document.getElementById('ai-list');
  if (!meta || !take || !list) return;

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  fetch('data/daily-ai.json')
    .then(function (r) { if (!r.ok) throw new Error('http ' + r.status); return r.json(); })
    .then(function (d) {
      var items = d.items || [];
      meta.textContent = (d.date || '') + ' · 共' + (d.count || items.length) + '条' +
        (d.updated_at ? ' · 更新于' + d.updated_at : '');
      take.innerHTML = (d.takeaways || []).map(function (x) {
        return '<li>' + esc(x) + '</li>';
      }).join('');
      list.innerHTML = items.map(function (it) {
        var h = '<div class="ai-item">';
        h += '<a class="ai-title" href="' + esc(it.url) + '" target="_blank" rel="noopener">' +
          esc(it.title) + '</a>';
        h += '<div class="ai-meta">' + esc(it.source) + ' | ' + esc(it.time) +
          (it.heat ? ' | ' + esc(it.heat) : '') + '</div>';
        if (it.summary) h += '<p>' + esc(it.summary) + '</p>';
        if (it.insight) h += '<p>💡 ' + esc(it.insight) + '</p>';
        return h + '</div>';
      }).join('');
    })
    .catch(function () { meta.textContent = '日报加载失败，请稍后再试。'; });
})();
