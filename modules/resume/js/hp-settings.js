/* ==================================================================
   全局设置：字号 / 跳过开机动画 / 跳过推理过程
   用法：在任意页面 </body> 前引入 <script src="js/hp-settings.js"></script>
   ================================================================== */
(function () {
  var KEY = 'hp.settings.v1';
  var DEF = { zoom: 1, skipBoot: false, skipReason: false };
  var S = Object.assign({}, DEF);
  try { S = Object.assign(S, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) {}

  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
  function apply() {
    document.documentElement.style.zoom = S.zoom;
    window.HP_SETTINGS = S;            // 其他页面可直接读：HP_SETTINGS.skipBoot
    if (window.parent && window.parent !== window) {
      try { window.parent.postMessage({ type: 'hp:settings', settings: S }, '*'); } catch (e) {}
    }
  }

  function el(tag, cls, html) {
    var d = document.createElement(tag);
    if (cls) d.className = cls;
    if (html != null) d.innerHTML = html;
    return d;
  }

  var gear = el('button', 'hp-gear', '⚙');
  gear.title = '设置';
  gear.style.cssText = 'width:28px;height:28px;border:1px solid var(--line,#2a3b52);background:transparent;' +
    'color:var(--dim,#7e96ae);font-size:13px;cursor:pointer;border-radius:4px;line-height:1';

  var panel = el('div', 'hp-panel');
  panel.style.cssText = 'position:absolute;right:0;top:34px;width:250px;background:var(--panel,#0F1D2F);' +
    'border:1px solid var(--line,#2a3b52);padding:14px;display:none;z-index:999;box-shadow:0 20px 50px rgba(0,0,0,.45);' +
    'font-family:inherit;color:var(--fg,#E8F2FF)';

  panel.innerHTML =
    '<div style="font-size:11px;letter-spacing:.14em;color:var(--dim,#7e96ae);margin-bottom:10px">显示设置</div>' +
    '<div style="font-size:11.5px;margin-bottom:6px">字号</div>' +
    '<div class="hp-zoom" style="display:flex;border:1px solid var(--line,#2a3b52);margin-bottom:14px">' +
      '<button data-z="0.9" style="flex:1;height:28px;border:0;background:transparent;color:var(--dim,#7e96ae);cursor:pointer;font-size:11px">小</button>' +
      '<button data-z="1" style="flex:1;height:28px;border:0;border-left:1px solid var(--line,#2a3b52);background:transparent;color:var(--dim,#7e96ae);cursor:pointer;font-size:11px">标准</button>' +
      '<button data-z="1.15" style="flex:1;height:28px;border:0;border-left:1px solid var(--line,#2a3b52);background:transparent;color:var(--dim,#7e96ae);cursor:pointer;font-size:11px">大</button>' +
    '</div>' +
    '<label style="display:flex;align-items:center;gap:8px;font-size:11.5px;margin-bottom:10px;cursor:pointer">' +
      '<input type="checkbox" class="hp-skipboot" style="accent-color:#4DA3FF"> 跳过开机动画</label>' +
    '<label style="display:flex;align-items:center;gap:8px;font-size:11.5px;margin-bottom:14px;cursor:pointer">' +
      '<input type="checkbox" class="hp-skipreason" style="accent-color:#4DA3FF"> 跳过推理分析过程</label>' +
    '<button class="hp-reset" style="width:100%;height:28px;border:1px solid var(--line,#2a3b52);background:transparent;' +
      'color:var(--dim,#7e96ae);font-size:11px;cursor:pointer">恢复默认</button>';

  var host = document.querySelector('.themes') || document.querySelector('.right') || document.body;
  var wrap = el('div', 'hp-setwrap');
  wrap.style.cssText = 'position:relative;display:inline-flex;align-items:center;margin-left:8px';
  wrap.appendChild(gear); wrap.appendChild(panel);
  var fixedHost = host.classList && host.classList.contains('themes') && getComputedStyle(host).position === 'fixed';
  if (fixedHost) {
    wrap.style.cssText = 'position:fixed;right:22px;top:58px;z-index:60';
    document.body.appendChild(wrap);
  } else if (host.classList && host.classList.contains('themes')) {
    host.parentNode.insertBefore(wrap, host.nextSibling);
  } else {
    host.appendChild(wrap);
  }

  function sync() {
    panel.querySelectorAll('.hp-zoom button').forEach(function (b) {
      var on = Math.abs(parseFloat(b.dataset.z) - S.zoom) < 0.001;
      b.style.background = on ? 'var(--acc,#4DA3FF)' : 'transparent';
      b.style.color = on ? '#fff' : 'var(--dim,#7e96ae)';
    });
    panel.querySelector('.hp-skipboot').checked = !!S.skipBoot;
    panel.querySelector('.hp-skipreason').checked = !!S.skipReason;
  }

  gear.onclick = function (e) {
    e.stopPropagation();
    var open = panel.style.display === 'block';
    panel.style.display = open ? 'none' : 'block';
    if (!open) sync();
  };
  document.addEventListener('click', function (e) {
    if (!wrap.contains(e.target)) panel.style.display = 'none';
  });
  panel.querySelectorAll('.hp-zoom button').forEach(function (b) {
    b.onclick = function () { S.zoom = parseFloat(b.dataset.z); save(); apply(); sync(); };
  });
  panel.querySelector('.hp-skipboot').onchange = function (e) { S.skipBoot = e.target.checked; save(); apply(); };
  panel.querySelector('.hp-skipreason').onchange = function (e) { S.skipReason = e.target.checked; save(); apply(); };
  panel.querySelector('.hp-reset').onclick = function () {
    S = Object.assign({}, DEF); save(); apply(); sync();
  };

  apply();
})();
