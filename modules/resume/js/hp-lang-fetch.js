/* ==================================================================
   hp-lang-fetch.js —— 给 /api/ 的 GET 请求自动带上 lang
   后端按 lang 返回对应语言的数据文本（岗位名 / 国家 / 学历 / 技能），
   界面文案仍由 hp-i18n.js 负责，两者分工不重叠。
   ================================================================== */
(function () {
  'use strict';
  if (window.__hpLangFetch) return;
  window.__hpLangFetch = 1;

  var orig = window.fetch;
  if (typeof orig !== 'function') return;

  window.fetch = function (input, init) {
    try {
      if (typeof input === 'string') {
        var method = ((init && init.method) || 'GET').toUpperCase();
        var lang = (window.HPI18N && window.HPI18N.lang && window.HPI18N.lang()) || 'zh';
        var isApi = /(^|\/)api\//.test(input);
        if (isApi && method === 'GET' && lang !== 'zh' && !/[?&]lang=/.test(input)) {
          input += (input.indexOf('?') >= 0 ? '&' : '?') + 'lang=' + encodeURIComponent(lang);
        }
      }
    } catch (e) { /* 出错就用原 URL，不影响请求 */ }
    return orig.call(this, input, init);
  };
})();
