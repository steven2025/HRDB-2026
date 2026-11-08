/* ==================================================================
   顶栏设置：字号 / 跳过开机 / 跳过推理
   对外：无（自动挂到 .topbar）
   其他模块读：window.HP_SETTINGS
   ================================================================== */
(function () {
  'use strict';

  var KEY = 'hp.ui.v1';
  var DEF = { zoom: 1, skipBoot: false, skipReason: false, hardBlock: false };
  /* 字号档位：0.9 / 1 / 1.15 / 1.3 / 1.5（原来只到 1.15，用户反馈不够大） */
  var ZOOMS = [['0.9', '小'], ['1', '标准'], ['1.15', '大'], ['1.3', '特大'], ['1.5', '超大']];
  var ZMAX = 1.5;
  var S = Object.assign({}, DEF);
  try { S = Object.assign(S, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) {}

  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
  function apply() {
    var z = parseFloat(S.zoom) || 1;
    if (z > ZMAX) z = ZMAX;
    if (z < 0.8) z = 0.8;
    S.zoom = z;
    document.documentElement.style.zoom = z;
    /* 关键：.app 用的是 height:100vh，zoom 会把它放大成 1.5 屏高，
       导致页面整体可滚动、最后一行被顶出可视区。用变量把高度换算回来。 */
    document.documentElement.style.setProperty('--hp-zoom', z);
    /* 字号档位标记：超大字号时顶栏隐藏次要信息，避免挤压 */
    document.documentElement.dataset.fs = z >= 1.5 ? 'xxl' : z >= 1.3 ? 'xl' : z >= 1.15 ? 'lg' : z < 1 ? 'sm' : 'md';
    /* 缩放后画布尺寸会变，通知图表和自适应组件重算 */
    setTimeout(function () { try { window.dispatchEvent(new Event('resize')); } catch (e) {} }, 60);
    window.HP_SETTINGS = S;
    window.__hpSkipReason = !!S.skipReason;
    if (S.skipBoot) {
      // 开机动画支持 ESC / 点击跳过：等它出现后再触发
      var tries = 0;
      var t = setInterval(function () {
        tries++;
        var el = document.querySelector('[data-boot], #bootSplash, .hpb-wrap');
        if (el) {
          clearInterval(t);
          document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        }
        if (tries > 40) clearInterval(t);
      }, 50);
    }
  }

  var CSS = [
    '.hps-wrap{position:relative;display:inline-flex}',
    '.hps-btn{width:34px;height:34px;border-radius:10px;border:1px solid var(--border);background:var(--surface);color:var(--text-2);display:grid;place-items:center;cursor:pointer}',
    '.hps-btn:hover{color:var(--primary);border-color:var(--primary)}',
    /* 面板需要不透明：深色主题的 --surface 是 rgba，会透出下面的内容 */
    '.hps-panel{position:absolute;right:0;top:42px;width:270px;background:#0d1a2b;border:1px solid var(--border);border-radius:14px;padding:14px;z-index:200;box-shadow:0 20px 50px rgba(0,0,0,.45);display:none}',
    'html[data-theme="light"] .hps-panel,html[data-theme="mono"] .hps-panel{background:#FFFFFF;box-shadow:0 18px 44px rgba(16,24,40,.16)}',
    '.hps-cur{margin-left:6px;color:var(--text-3);font-size:11px}',
    '.hps-panel.on{display:block}',
    '.hps-t{font-size:11.5px;letter-spacing:.14em;color:var(--text-3);margin-bottom:10px}',
    '.hps-l{font-size:12.5px;color:var(--text-2);margin:4px 0 6px}',
    '.hps-seg{display:flex;border:1px solid var(--border);border-radius:9px;overflow:hidden;margin-bottom:14px}',
    '.hps-seg button{flex:1;min-width:0;height:30px;padding:0 2px;border:0;background:transparent;color:var(--text-2);font-size:11.5px;cursor:pointer;white-space:nowrap}',
    '.hps-seg button+button{border-left:1px solid var(--border)}',
    '.hps-seg button.on{background:var(--primary);color:#02131f;font-weight:600}',
    '.hps-row{display:flex;align-items:center;gap:8px;font-size:12.5px;color:var(--text-2);margin-bottom:10px;cursor:pointer}',
    '.hps-row input{accent-color:var(--primary);width:15px;height:15px}',
    '.hps-reset{width:100%;height:30px;border:1px solid var(--border);border-radius:9px;background:none;color:var(--text-3);font-size:12px;cursor:pointer}',
    '.hps-reset:hover{color:var(--text)}'
  ].join('');

  function injectCSS() {
    if (document.getElementById('hpSettingsCSS')) return;
    var st = document.createElement('style');
    st.id = 'hpSettingsCSS'; st.textContent = CSS;
    document.head.appendChild(st);
  }

  var panelHTML =
    '<div class="hps-t">显示设置</div>' +
    '<div class="hps-l">字号 <span class="hps-cur"></span></div>' +
    '<div class="hps-seg">' + ZOOMS.map(function (z) {
      return '<button data-z="' + z[0] + '">' + z[1] + '</button>';
    }).join('') + '</div>' +
    '<label class="hps-row"><input type="checkbox" class="hps-boot">跳过开机动画</label>' +
    '<label class="hps-row"><input type="checkbox" class="hps-reason">跳过推理分析过程</label>' +
    '<label class="hps-row"><input type="checkbox" class="hps-block">缺必填时禁止投递</label>' +
    '<button class="hps-reset">恢复默认</button>';

  function sync(panel) {
    panel.querySelectorAll('.hps-seg button').forEach(function (b) {
      b.classList.toggle('on', Math.abs(parseFloat(b.dataset.z) - S.zoom) < 0.001);
    });
    var cur = panel.querySelector('.hps-cur');
    if (cur) {
      var hit = ZOOMS.filter(function (z) { return Math.abs(parseFloat(z[0]) - S.zoom) < 0.001; })[0];
      cur.textContent = hit ? (hit[1] + ' · ' + Math.round(S.zoom * 100) + '%') : (Math.round(S.zoom * 100) + '%');
    }
    panel.querySelector('.hps-boot').checked = !!S.skipBoot;
    panel.querySelector('.hps-block').checked = !!S.hardBlock;
    panel.querySelector('.hps-reason').checked = !!S.skipReason;
  }

  function mount() {
    var bar = document.querySelector('.topbar');
    if (!bar || document.getElementById('hpSetWrap')) return;
    injectCSS();

    var wrap = document.createElement('div');
    wrap.className = 'hps-wrap';
    wrap.id = 'hpSetWrap';
    wrap.innerHTML = '<button class="hps-btn" title="显示设置（字号 / 跳过开机 / 跳过推理）">' +
      '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">' +
      '<circle cx="12" cy="12" r="3.2"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1.1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.6V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.6 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg></button>' +
      '<div class="hps-panel">' + panelHTML + '</div>';

    // 插在主题按钮前
    var themeBtn = bar.querySelector('#themeBtn') || bar.querySelector('.icon-btn');
    if (themeBtn && themeBtn.parentNode === bar) bar.insertBefore(wrap, themeBtn);
    else bar.appendChild(wrap);

    var panel = wrap.querySelector('.hps-panel');
    var btn = wrap.querySelector('.hps-btn');
    btn.onclick = function (e) {
      e.stopPropagation();
      panel.classList.toggle('on');
      if (panel.classList.contains('on')) sync(panel);
    };
    document.addEventListener('click', function (e) {
      if (!wrap.contains(e.target)) panel.classList.remove('on');
    });

    panel.querySelectorAll('.hps-seg button').forEach(function (b) {
      b.onclick = function () {
        S.zoom = parseFloat(b.dataset.z); save(); apply(); sync(panel);
      };
    });
    panel.querySelector('.hps-boot').onchange = function (e) { S.skipBoot = e.target.checked; save(); apply(); };
    panel.querySelector('.hps-reason').onchange = function (e) {
      S.skipReason = e.target.checked; save(); apply();
      if (e.target.checked && window.demoToast) demoToast('已开启：分析时跳过推理过程');
    };
    panel.querySelector('.hps-block').onchange = function (e) {
      S.hardBlock = e.target.checked; save(); apply();
      if (window.demoToast) demoToast(e.target.checked ? '已开启：缺必填禁止投递' : '已关闭：缺项可投递');
    };
    panel.querySelector('.hps-reset').onclick = function () {
      S = Object.assign({}, DEF); save(); apply(); sync(panel);
    };

    sync(panel);
  }

  apply();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
  setInterval(function () { if (!document.getElementById('hpSetWrap')) mount(); }, 1200);

  window.HPSETTINGS = { get: function () { return S; } };
})();
