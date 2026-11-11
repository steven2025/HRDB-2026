/* API 兜底翻译：对可见的中文文本节点批量调用 /api/translate。
   只改文本节点，不改输入值、姓名、品牌和源数据。 */
(function () {
  'use strict';
  var busy = false, timer = 0, curLang = '';

  function lang() {
    try { return (window.HPI18N && HPI18N.lang()) || localStorage.getItem('hp-lang') || 'zh'; }
    catch (e) { return 'zh'; }
  }
  function targetLike(s, L) {
    if (L === 'th') return /[\u0E00-\u0E7F]/.test(s) && !/[\u4e00-\u9fa5]/.test(s);
    if (L === 'ja') return /[\u3040-\u30FF]/.test(s) && !/[\u4e00-\u9fa5]/.test(s);
    if (L === 'ar') return /[\u0600-\u06FF]/.test(s) && !/[\u4e00-\u9fa5]/.test(s);
    if (L === 'en') return /[A-Za-z]{3,}/.test(s) && !/[\u4e00-\u9fa5]/.test(s);
    if (L === 'fr') return /[A-Za-zÀ-ÿ]{3,}/.test(s) && !/[\u4e00-\u9fa5]/.test(s);
    return false;
  }
  function skip(p) {
    if (!p || !p.closest) return true;
    return !!p.closest('[data-i18n-skip],.brand-name,.mt-f-name,.mt-d-name,.u-name,.hpp-name,.hpr-name,script,style,textarea,input,select,option');
  }
  function visible(p) {
    try {
      var r = p.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    } catch (e) { return false; }
  }
  function collect(L) {
    var arr = [], seen = {};
    var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null), n;
    while ((n = w.nextNode())) {
      var p = n.parentNode;
      if (!p || skip(p)) continue;
      var raw = n.nodeValue || '', s = raw.trim();
      if (s.length < 2 || s.length > 160) continue;
      if (!/[\u4e00-\u9fa5]/.test(s) || targetLike(s, L)) continue;
      if (n.__hpApiLang === L && n.__hpApiText === s) continue;
      if (seen[s]) continue;
      seen[s] = 1; arr.push(n);
      if (arr.length >= 80) break;
    }
    return arr;
  }
  function run() {
    var L = lang();
    if (L === 'zh' || busy) return;
    if (curLang !== L) { curLang = L; busy = false; }
    var nodes = collect(L);
    if (!nodes.length) return;
    busy = true;
    var texts = nodes.map(function (n) { return String(n.nodeValue || '').trim(); });
    fetch('/api/translate', {
      method: 'POST', credentials: 'same-origin',
      headers: { 'content-type': 'application/json', 'x-hp-request': '1' },
      body: JSON.stringify({ texts: texts, target: L })
    }).then(function (r) { return r.json(); }).then(function (j) {
      if (!j || !j.texts) return;
      nodes.forEach(function (n, i) {
        var v = j.texts[i];
        if (!v || v === texts[i]) return;
        if (n.__hpApiOrig == null) n.__hpApiOrig = n.nodeValue;
        var raw = n.__hpApiOrig;
        var lead = /^\s*/.exec(raw)[0] || '', tail = /\s*$/.exec(raw)[0] || '';
        n.nodeValue = lead + v + tail;
        n.__hpApiLang = L;
        n.__hpApiText = n.nodeValue.trim();
      });
    }).catch(function () {}).then(function () {
      busy = false;
      clearTimeout(timer);
      timer = setTimeout(run, 900);
    });
  }
  function schedule() { clearTimeout(timer); timer = setTimeout(run, 250); }

  window.__hpApiTranslate = run;
  window.__hpApiReset = function(){ busy = false; clearTimeout(timer); run(); };
  document.addEventListener('DOMContentLoaded', function () { schedule(); setInterval(run, 1700); });
  document.addEventListener('hp:lang', function () { curLang = ''; schedule(); setTimeout(run, 600); });
})();
