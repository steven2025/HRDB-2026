/* 演示 iframe 多语言：直接调用同源 /api/translate，对 iframe 里的中文文本做批量翻译。
   支持语言切换、动态分析内容、报告页与开机动画。 */
(function () {
  'use strict';
  var lang = 'zh';
  var timer = 0;
  var running = false;

  function currentLang() {
    try {
      if (window.parent && window.parent.HPI18N) return window.parent.HPI18N.lang() || 'zh';
    } catch (e) {}
    return lang;
  }

  function collect() {
    var out = [];
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    var n;
    while ((n = walker.nextNode())) {
      var p = n.parentNode;
      if (!p) continue;
      var tag = (p.tagName || '').toLowerCase();
      if (tag === 'script' || tag === 'style' || tag === 'textarea' || tag === 'input') continue;
      var raw = n.__hpOrig != null ? n.__hpOrig : n.nodeValue;
      if (!raw || raw.trim().length < 2 || raw.trim().length > 400) continue;
      if (!/[\u4e00-\u9fa5]/.test(raw)) continue;
      if (n.__hpOrig == null) n.__hpOrig = raw;
      out.push(n);
    }
    return out;
  }

  function run() {
    var L = currentLang();
    lang = L;
    if (L === 'zh') {
      try {
        var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
        var n;
        while ((n = walker.nextNode())) {
          if (n.__hpOrig != null && n.nodeValue !== n.__hpOrig) n.nodeValue = n.__hpOrig;
          n.__hpTranslated = false;
        }
      } catch (e) {}
      return;
    }
    if (running) return;
    var nodes = collect().filter(function (n) { return n.__hpTranslated !== L; }).slice(0, 36);
    if (!nodes.length) return;
    running = true;
    var texts = nodes.map(function (n) { return (n.__hpOrig != null ? n.__hpOrig : n.nodeValue).trim(); });
    fetch('/api/translate', {
      method: 'POST', credentials: 'same-origin',
      headers: { 'content-type': 'application/json', 'x-hp-request': '1' },
      body: JSON.stringify({ texts: texts, target: L })
    }).then(function (r) { return r.json(); }).then(function (j) {
      if (!j || !j.texts) return;
      nodes.forEach(function (n, i) {
        var v = j.texts[i];
        if (v && v !== texts[i]) {
          var raw = n.__hpOrig != null ? n.__hpOrig : n.nodeValue;
          var lead = /^\s*/.exec(raw)[0] || '';
          var tail = /\s*$/.exec(raw)[0] || '';
          n.nodeValue = lead + v + tail;
          n.__hpTranslated = L;
        }
      });
    }).catch(function () {}).then(function () {
      running = false;
      if (currentLang() === L && collect().some(function (n) { return n.__hpTranslated !== L; })) {
        clearTimeout(timer);
        timer = setTimeout(run, 120);
      }
    });
  }

  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(run, 150);
  }

  window.addEventListener('message', function (e) {
    var m = e && e.data;
    if (!m || m.type !== 'hp:lang') return;
    lang = m.lang || 'zh';
    schedule();
  });

  try { window.parent.postMessage({ type: 'hp:iframe-ready' }, '*'); } catch (e) {}

  if (window.MutationObserver) {
    var mo = new MutationObserver(function () {
      if (lang !== 'zh') schedule();
    });
    mo.observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', schedule);
  else schedule();
})();
