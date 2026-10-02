/* World + Economy feeds: fetch data/*.json and render. Reuses .ai-item styles. */
(function () {
  var FEEDS = [
    { json: 'data/global-politics.json', meta: 'world-meta', list: 'world-list', empty: '暂无时政新闻。' },
    { json: 'data/economy.json', meta: 'economy-meta', list: 'economy-list', empty: '暂无经济新闻。' },
    { json: 'data/sports.json', meta: 'sports-meta', list: 'sports-list', empty: '暂无体育新闻。' }
  ];

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function render(feed) {
    var meta = document.getElementById(feed.meta);
    var list = document.getElementById(feed.list);
    if (!meta || !list) return;
    fetch(feed.json)
      .then(function (r) { if (!r.ok) throw new Error('http ' + r.status); return r.json(); })
      .then(function (d) {
        var items = d.items || [];
        meta.textContent = (d.date || '') + ' · 共' + (d.count || items.length) + '条' +
          (d.updated_at ? ' · 更新于' + d.updated_at : '');
        if (!items.length) { list.innerHTML = '<p>' + feed.empty + '</p>'; return; }
        list.innerHTML = items.map(function (it) {
          var h = '<div class="ai-item">';
          h += '<a class="ai-title" href="' + esc(it.url) + '" target="_blank" rel="noopener">' +
            esc(it.title) + '</a>';
          h += '<div class="ai-meta">' + esc(it.source) + ' | ' + esc(it.time) +
            (it.heat ? ' | ' + esc(it.heat) : '') + '</div>';
          if (it.summary) h += '<p>' + esc(it.summary) + '</p>';
          return h + '</div>';
        }).join('');
      })
      .catch(function () { meta.textContent = '加载失败，请稍后再试。'; });
  }

  FEEDS.forEach(render);
})();
