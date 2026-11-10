/* =====================================================================
 * hp-config.js —— 部署配置（改完刷新页面生效）
 * ---------------------------------------------------------------------
 * 默认空字符串 = 同源后端（本地 8787，或页面与接口同域的部署）。
 *
 * 想在本地页面直接连【腾讯云函数】：
 *   app.html?api=cloud     ← 走云端（此选择会记住，跳转页面也不丢）
 *   app.html?api=local     ← 强制回到同源
 * 也可以用控制台：localStorage.setItem('hp-api-base', 'https://...')
 *
 * 说明：页面是 http、云函数是 https 时浏览器不会带云端跨站 Cookie，
 *       桥接会自动切换 Bearer 令牌模式（服务端已支持无状态签名令牌）。
 * ===================================================================== */
window.HP_CLOUD_BASE = 'https://1506063666-34lsbn3uv2.ap-chengdu.tencentscf.com';

/* 接入副本使用现有腾讯云函数。 */
window.HP_API_BASE = window.HP_CLOUD_BASE;


/* 静态托管（GitHub Pages / file://）没有同源 /api：
   把所有相对 /api 请求统一转到云函数，并带上 Bearer 令牌。 */
(function () {
  if (window.__hpCloudFetchWrapped) return;
  window.__hpCloudFetchWrapped = true;
  var base = window.HP_API_BASE || '';
  if (!base) return;
  var orig = window.fetch;
  window.fetch = function (input, init) {
    var url = (typeof input === 'string') ? input : (input && input.url) || '';
    var path = '';
    if (url.indexOf('/api/') === 0) path = url;
    else if (url.indexOf(location.origin + '/api/') === 0) path = url.slice(location.origin.length);
    if (!path) return orig.apply(this, arguments);
    var opts = Object.assign({}, init || {});
    var headers = new Headers(opts.headers || {});
    try {
      var token = sessionStorage.getItem('hp-token') || localStorage.getItem('hp-token');
      if (token) headers.set('Authorization', 'Bearer ' + token);
    } catch (e) {}
    headers.set('x-hp-client', 'file');
    opts.headers = headers;
    return orig.call(this, base + path, opts).then(function (res) {
      if (res.status === 401 && !/login\.html/.test(location.pathname)) {
        try { sessionStorage.removeItem('hp-token'); localStorage.removeItem('hp-token'); } catch (e) {}
        location.replace('login.html');
      }
      return res;
    });
  };
})();
