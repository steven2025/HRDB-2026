/* 词典兜底扫描：把静态中文节点按当前语言词典替换。
   解决仪表盘、岗位管理等“已渲染但 apply 没覆盖”的静态文案。 */
(function () {
  'use strict';
  if (!window.HPI18N) return;
  function skip(p) {
    if (!p || !p.closest) return true;
    return !!p.closest('[data-i18n-skip],.brand-name,.mt-f-name,.mt-d-name,.u-name,.hpp-name,.hpr-name,script,style,textarea,input,select,option');
  }
  function fixTargets() {
    try {
      if (HPI18N.lang() === 'zh') return;
      var sels = '.k-label,.k-foot,.kpi .k-label,.card-title,.page-head h1,.page-head .desc,.mt-hero-title,.mt-hero-sub,.mt-d-name,.mt-d-sub,.cj-title,.cj-sub,.chip,.demo-tag,.page-title,.stat-label,.stat-foot,.hpp-title,.hpr-title';
      var els = document.querySelectorAll(sels);
      for (var i = 0; i < els.length; i++) {
        var el = els[i];
        if (el.closest && el.closest('[data-i18n-skip],.brand-name,.mt-f-name,.u-name')) continue;
        for (var k = 0; k < el.childNodes.length; k++) {
          var n = el.childNodes[k];
          if (!n || n.nodeType !== 3) continue;
          var raw = n.nodeValue || '', key = raw.trim();
          if (!key || key.length > 120 || !/[\u4e00-\u9fa5]/.test(key)) continue;
          var v = HPI18N.t(key);
          if (v && v !== key) n.nodeValue = raw.replace(key, v);
        }
      }
    } catch (e) {}
  }

  function run() {
    try {
      if (HPI18N.lang() === 'zh') return;
      var els = document.querySelectorAll('div,span,h1,h2,h3,p,button,label,td,th,strong,b,small,em,i,a');
      for (var i = 0; i < els.length; i++) {
        var el = els[i];
        if (skip(el)) continue;
        for (var k = 0; k < el.childNodes.length; k++) {
          try {
            var n = el.childNodes[k];
            if (!n || n.nodeType !== 3) continue;
            var raw = n.nodeValue || '';
            var key = raw.trim();
            if (key.length < 2 || key.length > 120) continue;
            if (!/[\u4e00-\u9fa5]/.test(key)) continue;
            var v = HPI18N.t(key);
            if (!v || v === key) continue;
            var m = raw.match(/^(\s*)([\s\S]*?)(\s*)$/);
            n.nodeValue = (m ? m[1] : '') + v + (m ? m[3] : '');
          } catch (e) {}
        }
      }
    } catch (e) {}
  }

  window.__hpSweep = run;
  document.addEventListener('DOMContentLoaded', function () { setTimeout(run, 600); setInterval(run, 900); setInterval(fixTargets, 700); });
  document.addEventListener('hp:lang', function () { setTimeout(run, 300); });
  setTimeout(run, 1500);
})();
