/* ==================================================================
   报告与对账 —— 「候选池分析」页签
   对外：window.HPREPORT.init(viewEl)
   数据：GET /api/report/pool（失败用演示数据）
   ================================================================== */
(function () {
  'use strict';

  var DEMO = {
    kpi: [
      { k: '候选池总量', v: '1,284', u: '人', d: '近 6 个月' },
      { k: '匹配达标', v: '236', u: '人', d: '18.4% 达标率', hot: true },
      { k: '平均招聘周期', v: '32', u: '天', d: '-3 天 环比' },
      { k: '面试转化率', v: '41', u: '%', d: '+2.4pt 环比' },
      { k: '合规风险', v: '96', u: '人', d: '7.5% 占比', bad: true },
      { k: '单人成本', v: '420', u: '元', d: '-18 元 环比' }
    ],
    funnel: [['投递', 1284], ['初筛', 812], ['匹配达标', 236], ['面试', 187], ['录用', 124], ['到岗', 108]],
    hist: [18, 42, 68, 104, 156, 214, 268, 236, 128, 50],
    countries: [['阿尔及利亚', 486], ['越南', 312], ['沙特', 208], ['马来西亚', 156], ['哈萨克斯坦', 122]],
    risks: ['隐私项', '证件缺失', '合同条款', '风俗禁忌'],
    heat: [[62, 48, 31, 22], [41, 36, 18, 15], [33, 52, 26, 31], [24, 18, 12, 9], [19, 22, 10, 14]]
  };

  /* 调色板：靠色相拉开层次 */
  var PAL = ['#38bdf8', '#2dd4bf', '#f0b429', '#a78bfa', '#f87171', '#60a5fa'];

  var CSS = [
    '.hpr-tabs{display:flex;gap:2px;border-bottom:1px solid var(--border);margin:6px 0 16px}',
    '.hpr-tabs button{height:38px;padding:0 18px;border:0;background:none;color:var(--text-2);font-size:14px;cursor:pointer;border-bottom:2px solid transparent}',
    '.hpr-tabs button.on{color:var(--primary);border-bottom-color:var(--primary);font-weight:600}',
    '.hpr-kpis{display:grid;grid-template-columns:repeat(6,1fr);gap:12px;margin-bottom:14px}',
    '.hpr-kpi{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:14px 16px;position:relative;overflow:hidden}',
    '.hpr-kpi::after{content:"";position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--primary);opacity:.55}',
    '.hpr-kpi.hot::after{background:#f0b429;opacity:1}',
    '.hpr-kpi.bad::after{background:#f87171;opacity:1}',
    '.hpr-kpi .k{font-size:12.5px;color:var(--text-2)}',
    '.hpr-kpi .v{margin-top:8px;font-size:32px;font-weight:300;line-height:1;letter-spacing:-.5px}',
    '.hpr-kpi .v small{font-size:13px;color:var(--text-3);margin-left:3px}',
    '.hpr-kpi .d{margin-top:8px;font-size:11.5px;color:var(--text-3)}',
    '.hpr-grid{display:grid;gap:14px;margin-bottom:14px}',
    '.hpr-g3{grid-template-columns:repeat(3,1fr)}',
    '.hpr-card{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:14px 16px;overflow:hidden;display:flex;flex-direction:column}',
    '.hpr-card h3{font-size:14px;font-weight:600;display:flex;align-items:center;gap:9px;margin-bottom:6px}',
    '.hpr-card h3 i{width:3px;height:13px;background:var(--primary);display:block}',
    '.hpr-card h3 span{margin-left:auto;font-size:11.5px;color:var(--text-3);font-weight:400}',
    '.hpr-chart{position:relative;height:250px;margin-top:4px}',
    '.hpr-chart canvas{position:absolute;inset:0;width:100%;height:100%}',
    '.hpr-fold{margin-left:8px;width:22px;height:22px;border:1px solid var(--border);border-radius:6px;background:none;color:var(--text-3);font-size:12px;cursor:pointer;line-height:1}',
    '.hpr-card.folded .hpr-chart{display:none}'
  ].join('');

  function injectCSS() {
    if (document.getElementById('hpReportCSS')) return;
    var st = document.createElement('style');
    st.id = 'hpReportCSS'; st.textContent = CSS;
    document.head.appendChild(st);
  }
  function cssvar(n, f) {
    var v = getComputedStyle(document.documentElement).getPropertyValue(n).trim();
    return v || f;
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); }

  function canvas(cv, draw) {
    if (!cv) return;
    var r = cv.getBoundingClientRect();
    if (!r.width || !r.height) return;
    var dpr = Math.min(devicePixelRatio || 1, 2);
    cv.width = Math.round(r.width * dpr); cv.height = Math.round(r.height * dpr);
    var ctx = cv.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw(ctx, r.width, r.height);
  }
  function txt(ctx, s, x, y, c, size, align) {
    ctx.fillStyle = c; ctx.font = (size || 11) + 'px "Microsoft YaHei",sans-serif';
    ctx.textAlign = align || 'left'; ctx.textBaseline = 'middle'; ctx.fillText(s, x, y);
  }

  /* 漏斗：每层换色，达标层高亮 */
  function drawFunnel(cv, d) {
    canvas(cv, function (ctx, W, H) {
      var max = d[0][1], top = 6, n = d.length, rowH = (H - top) / n, lw = 74, vw = 92;
      d.forEach(function (row, i) {
        var y = top + i * rowH, w = Math.max(6, (W - lw - vw) * row[1] / max), h = rowH - 8;
        var hot = row[0] === '匹配达标';
        var col = hot ? '#f0b429' : PAL[i % PAL.length];
        txt(ctx, row[0], 4, y + h / 2, hot ? '#f0b429' : cssvar('--text-2', '#9db2cb'), 12);
        var g = ctx.createLinearGradient(lw, 0, lw + w, 0);
        g.addColorStop(0, col); g.addColorStop(1, col + '55');
        ctx.fillStyle = g; ctx.fillRect(lw, y, w, h);
        txt(ctx, row[1] + ' 人', lw + w + 8, y + h / 2, cssvar('--text', '#eaf7ff'), 12.5);
        if (i > 0) {
          var rate = Math.round(row[1] / d[i - 1][1] * 100) + '%';
          txt(ctx, rate, W - 6, y + h / 2, cssvar('--text-3', '#7a8da6'), 11.5, 'right');
        }
      });
    });
  }

  /* 匹配度分布：60 以下淡蓝、60–79 青、80+ 琥珀，峰值描边 */
  function drawHist(cv, d) {
    canvas(cv, function (ctx, W, H) {
      var pad = { l: 34, r: 8, t: 22, b: 26 }, max = 300, n = d.length, bw = (W - pad.l - pad.r) / n;
      var peak = d.indexOf(Math.max.apply(null, d));
      d.forEach(function (v, i) {
        var h = (H - pad.t - pad.b) * v / max, x = pad.l + i * bw + 3;
        var col = i >= 8 ? '#f0b429' : i >= 6 ? '#2dd4bf' : 'rgba(96,165,250,.45)';
        ctx.fillStyle = col;
        ctx.fillRect(x, H - pad.b - h, bw - 6, h);
        if (i === peak) {
          ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5;
          ctx.strokeRect(x - .5, H - pad.b - h - .5, bw - 5, h + 1);
          txt(ctx, v, x + (bw - 6) / 2, H - pad.b - h - 13, '#fff', 11.5, 'center');
        }
        txt(ctx, (i * 10) + '', x + (bw - 6) / 2, H - pad.b + 14, cssvar('--text-3', '#7a8da6'), 10.5, 'center');
      });
      ctx.strokeStyle = cssvar('--border', 'rgba(56,189,248,.22)');
      ctx.beginPath(); ctx.moveTo(pad.l, H - pad.b); ctx.lineTo(W - pad.r, H - pad.b); ctx.stroke();
    });
  }

  /* 国家：第一名琥珀，其余青/青绿 */
  function drawCountry(cv, d) {
    canvas(cv, function (ctx, W, H) {
      var max = d[0][1], n = d.length, rowH = (H - 8) / n;
      d.forEach(function (row, i) {
        var y = 6 + i * rowH, w = Math.max(4, (W - 130) * row[1] / max), h = rowH - 12;
        txt(ctx, row[0], 4, y + h / 2, cssvar('--text-2', '#9db2cb'), 12);
        ctx.fillStyle = i === 0 ? '#f0b429' : PAL[i % 3];
        ctx.globalAlpha = i === 0 ? 1 : .75;
        ctx.fillRect(104, y, w, h); ctx.globalAlpha = 1;
        txt(ctx, row[1], 110 + w, y + h / 2, cssvar('--text', '#eaf7ff'), 12);
      });
    });
  }

  /* 热力：单色系拉开明度 */
  function drawHeat(cv, d) {
    canvas(cv, function (ctx, W, H) {
      var pad = { l: 86, r: 8, t: 26, b: 10 };
      var cw = (W - pad.l - pad.r) / d.risks.length, rh = (H - pad.t - pad.b) / d.heat.length;
      d.risks.forEach(function (r, j) {
        txt(ctx, r, pad.l + cw * j + cw / 2, 13, cssvar('--text-3', '#7a8da6'), 11, 'center');
      });
      d.countries.forEach(function (row, i) {
        txt(ctx, row[0], pad.l - 8, pad.t + rh * i + rh / 2, cssvar('--text-2', '#9db2cb'), 11, 'right');
        d.heat[i].forEach(function (v, j) {
          var a = 0.12 + Math.min(.8, v / 70 * .8);
          ctx.fillStyle = 'rgba(248,113,113,' + a + ')';
          ctx.fillRect(pad.l + cw * j + 2, pad.t + rh * i + 2, cw - 4, rh - 4);
          /* 深色主题用白字；浅色 / 单色主题用深字，否则白字压浅红看不见 */
          var dark = (document.documentElement.dataset.theme || 'dark') === 'dark';
          var c = dark ? (v > 45 ? '#fff' : 'rgba(255,255,255,.78)') : (v > 45 ? '#3b0d0d' : 'rgba(59,13,13,.72)');
          txt(ctx, v, pad.l + cw * j + cw / 2, pad.t + rh * i + rh / 2, c, 12, 'center');
        });
      });
    });
  }

  function build(d) {
    var html = '<div class="hpr-kpis">' + d.kpi.map(function (k) {
      return '<div class="hpr-kpi ' + (k.hot ? 'hot ' : '') + (k.bad ? 'bad' : '') + '">' +
        '<div class="k">' + esc(k.k) + '</div>' +
        '<div class="v">' + esc(k.v) + '<small>' + esc(k.u) + '</small></div>' +
        '<div class="d">' + esc(k.d) + '</div></div>';
    }).join('') + '</div>';

    html += '<div class="hpr-grid hpr-g3">' +
      '<div class="hpr-card"><h3><i></i>招聘漏斗<span>琥珀＝达标关口</span></h3>' +
        '<div class="hpr-chart"><canvas class="hpr-cv-f"></canvas></div></div>' +
      '<div class="hpr-card"><h3><i></i>匹配度分布<span>青 60–79 · 琥珀 80+</span></h3>' +
        '<div class="hpr-chart"><canvas class="hpr-cv-h"></canvas></div></div>' +
      '<div class="hpr-card"><h3><i></i>国家意向<span>琥珀＝最大来源国</span></h3>' +
        '<div class="hpr-chart"><canvas class="hpr-cv-c"></canvas></div></div></div>';

    html += '<div class="hpr-card"><h3><i></i>合规风险热力<span>颜色越深，问题越多</span></h3>' +
      '<div class="hpr-chart" style="height:230px"><canvas class="hpr-cv-t"></canvas></div></div>';
    return html;
  }

  function init(viewEl) {
    if (!viewEl || viewEl.dataset.hprDone === '1') return;
    viewEl.dataset.hprDone = '1';
    injectCSS();

    var head = viewEl.querySelector('.page-head');
    var tabs = document.createElement('div');
    tabs.className = 'hpr-tabs';
    tabs.innerHTML = '<button class="on" data-tab="base">月度报告</button><button data-tab="pool">候选池分析</button>';
    if (head && head.nextSibling) viewEl.insertBefore(tabs, head.nextSibling);
    else viewEl.insertBefore(tabs, viewEl.firstChild);

    var box = document.createElement('div');
    box.id = 'hpReportPool';
    box.style.display = 'none';
    viewEl.appendChild(box);

    var baseNodes = Array.prototype.filter.call(viewEl.children, function (el) {
      return el !== tabs && el !== box && el.tagName !== 'H1';
    });

    tabs.querySelectorAll('button').forEach(function (b) {
      b.onclick = function () {
        var t = b.getAttribute('data-tab');
        tabs.querySelectorAll('button').forEach(function (x) { x.classList.toggle('on', x === b); });
        baseNodes.forEach(function (el) { el.style.display = t === 'base' ? '' : 'none'; });
        box.style.display = t === 'pool' ? '' : 'none';
        if (t === 'pool' && !box.dataset.done) { box.dataset.done = '1'; load(box); }
      };
    });
  }

  function load(box) {
    box.innerHTML = '<div style="color:var(--text-3);font-size:13px;padding:10px 0">加载中…</div>';
    fetch('/api/report/pool', { credentials: 'same-origin' })
      .then(function (r) { if (!r.ok) throw new Error('http'); return r.json(); })
      .then(function (d) { paint(box, d && d.kpi ? d : DEMO); })
      .catch(function () { paint(box, DEMO); });
  }

  function paint(box, d) {
    box.innerHTML = build(d);
    drawFunnel(box.querySelector('.hpr-cv-f'), d.funnel);
    drawHist(box.querySelector('.hpr-cv-h'), d.hist);
    drawCountry(box.querySelector('.hpr-cv-c'), d.countries);
    drawHeat(box.querySelector('.hpr-cv-t'), d);

    box.querySelectorAll('[data-fold]').forEach(function (b) {
      b.onclick = function (e) {
        e.stopPropagation();
        var card = b.closest('.hpr-card');
        var folded = card.classList.toggle('folded');
        b.textContent = folded ? '+' : '−';
      };
    });
  }

  /* 在「经营看板」里挂两个页签：经营概览 / 候选池分析 */
  function initConsole(viewEl) {
    if (!viewEl || viewEl.dataset.hprcDone === '1') return;
    viewEl.dataset.hprcDone = '1';
    injectCSS();

    var consoleEl = viewEl.querySelector('#hpConsole');
    if (!consoleEl) return;

    var head = viewEl.querySelector('.page-head');
    var tabs = document.createElement('div');
    tabs.className = 'hpr-tabs';
    tabs.innerHTML = '<button class="on" data-tab="base">'+(window.HPI18N?HPI18N.t('经营概览'):'经营概览')+'</button><button data-tab="pool">'+(window.HPI18N?HPI18N.t('候选池分析'):'候选池分析')+'</button><button data-tab="job">'+(window.HPI18N?HPI18N.t('单岗位分析'):'单岗位分析')+'</button>';
    if (head && head.nextSibling) viewEl.insertBefore(tabs, head.nextSibling);
    else viewEl.insertBefore(tabs, consoleEl);

    var box = document.createElement('div');
    box.id = 'hpReportPool';
    box.style.display = 'none';
    viewEl.appendChild(box);

    var jobBox = document.createElement('div');
    jobBox.id = 'hpJobAnalysis';
    jobBox.style.display = 'none';
    viewEl.appendChild(jobBox);

    tabs.querySelectorAll('button').forEach(function (b) {
      b.onclick = function () {
        var t = b.getAttribute('data-tab');
        tabs.querySelectorAll('button').forEach(function (x) { x.classList.toggle('on', x === b); });
        consoleEl.style.display = t === 'base' ? '' : 'none';
        box.style.display = t === 'pool' ? '' : 'none';
        jobBox.style.display = t === 'job' ? '' : 'none';
        if (t === 'pool' && !box.dataset.done) { box.dataset.done = '1'; load(box); }
        if (t === 'job' && window.HPJOBANALYSIS) window.HPJOBANALYSIS.mount(jobBox);
      };
    });
  }

  window.HPREPORT = { init: init, initConsole: initConsole, DEMO: DEMO };
})();
