/* 静态界面补齐翻译：在词典和接口翻译之外，翻译可见的中英文残留文案。
   只处理可见文本，跳过姓名/品牌/输入框/代码。 */
(function () {
  'use strict';
  var running = false, timer = 0, lang = 'zh';

  function getLang() {
    try { return (window.HPI18N && HPI18N.lang()) || 'zh'; } catch (e) { return 'zh'; }
  }
  function isTarget(s, L) {
    if (L === 'th') return /[\u0E00-\u0E7F]/.test(s) && !/[\u4e00-\u9fa5]/.test(s) && !/[A-Za-z]{3,}/.test(s);
    if (L === 'ja') return /[\u3040-\u30FF]/.test(s) && !/[\u4e00-\u9fa5]/.test(s) && !/[A-Za-z]{3,}/.test(s);
    if (L === 'ar') return /[\u0600-\u06FF]/.test(s) && !/[\u4e00-\u9fa5]/.test(s) && !/[A-Za-z]{3,}/.test(s);
    if (L === 'zh') return /[\u4e00-\u9fa5]/.test(s) && !/[A-Za-z]{3,}/.test(s) && !/[\u0E00-\u0E7F]/.test(s) && !/[\u0600-\u06FF]/.test(s);
    if (L === 'en') return /[A-Za-z]{3,}/.test(s) && !/[\u4e00-\u9fa5\u0E00-\u0E7F\u0600-\u06FF]/.test(s);
    return false;
  }
  function skip(p) {
    if (!p || !p.closest) return true;
    return !!p.closest('[data-i18n-skip],.hp-no-translate,.mt-f-name,.mt-d-name,.u-name,.brand-name,.hpp-name,.hpr-name,.hp-lang,script,style,textarea,input,select,option');
  }
  function visible(p) {
    try { var r = p.getBoundingClientRect(); return r.width > 0 && r.height > 0; } catch (e) { return false; }
  }
  function collect(L) {
    var out = [];
    var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    var n;
    while ((n = w.nextNode())) {
      var p = n.parentNode;
      if (!p || skip(p) || !visible(p)) continue;
      var s = String(n.nodeValue || '').trim();
      if (!s || s.length < 2 || s.length > 120) continue;
      if (/^https?:\/\//i.test(s) || /^[\d\s.,:\/+\-()%]+$/.test(s)) continue;
      if (isTarget(s, L)) continue;
      if (n.__fillLang === L && n.__fillText === s) continue;
      out.push(n);
      if (out.length >= 50) break;
    }
    return out;
  }
  function restore(L) {
    var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    var n;
    while ((n = w.nextNode())) {
      if (n.__fillOrig != null && n.__fillLang && n.__fillLang !== L) {
        n.nodeValue = n.__fillOrig;
        n.__fillLang = '';
        n.__fillText = '';
      }
    }
  }
  function run() {
    var L = getLang();
    if (L === 'zh' || running) return;
    if (lang !== L) { lang = L; restore(L); }
    var nodes = collect(L);
    if (!nodes.length) return;
    running = true;
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
        if (n.__fillOrig == null) n.__fillOrig = n.nodeValue;
        var raw = n.__fillOrig, lead = /^\s*/.exec(raw)[0] || '', tail = /\s*$/.exec(raw)[0] || '';
        n.nodeValue = lead + v + tail;
        n.__fillLang = L;
        n.__fillText = n.nodeValue.trim();
      });
    }).catch(function () {}).then(function () {
      running = false;
      clearTimeout(timer);
      timer = setTimeout(run, 700);
    });
  }
  function schedule() { clearTimeout(timer); timer = setTimeout(run, 500); }
  window.__hpFillRun = run;
  window.__hpFillCollect = collect;
  document.addEventListener('DOMContentLoaded', schedule);
  document.addEventListener('hp:lang', function () { lang = getLang(); schedule(); setTimeout(run, 1200); });
  setInterval(function () { if (getLang() !== 'zh' && !running) run(); }, 1800);
})();
