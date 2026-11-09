/* 正式版里的「AI 分析演示」入口：全屏 iframe，关闭后回到原页面 */
(function () {
  'use strict';

  function close() {
    var el = document.getElementById('hpDemoModal');
    if (!el) return;
    el.remove();
    document.documentElement.style.overflow = '';
  }

  function open() {
    if (document.getElementById('hpDemoModal')) return;
    var wrap = document.createElement('div');
    wrap.id = 'hpDemoModal';
    wrap.innerHTML =
      '<div class="hp-demo-bar">' +
        '<i class="dot"></i>' +
        '<b>AI 匹配分析 · 演示模式</b>' +
        '<span>点「开始 AI 双向分析」播放，约 60 秒 · 讲解用，不影响正式数据</span>' +
        '<em>DEMO</em>' +
        '<button class="hp-demo-close" type="button">关闭演示 ×</button>' +
      '</div>' +
      '<iframe class="hp-demo-frame" src="demo/match-v2-embed.html?embed=1" title="AI 匹配分析演示" allow="autoplay; fullscreen"></iframe>';
    document.body.appendChild(wrap);
    document.documentElement.style.overflow = 'hidden';
    wrap.querySelector('.hp-demo-close').addEventListener('click', close);
    document.addEventListener('keydown', function esc(e) {
      if (e.key === 'Escape') {
        document.removeEventListener('keydown', esc);
        close();
      }
    });
  }

  window.HPOpenDemo = open;
})();
