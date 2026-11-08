/* ==================================================================
   数据驾驶舱 —— 真实数据版
   数据：GET /api/console（store 岗位/人才/保障 + 匹配引擎）
   ================================================================== */
(function () {
  'use strict';

  var CSS = [
    '.hp-kpis{display:grid;grid-template-columns:repeat(6,1fr);gap:10px;margin-bottom:12px}',
    '.hp-kpi{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:11px 14px;position:relative;overflow:hidden}',
    '.hp-kpi::after{content:"";position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--primary);opacity:.55}',
    '.hp-kpi .k{font-size:12.5px;color:var(--text-2)}',
    '.hp-kpi .v{margin-top:6px;font-size:25px;font-weight:600;line-height:1;letter-spacing:0;font-variant-numeric:tabular-nums}',
    '.hp-kpi .v small{font-size:13px;color:var(--text-3);margin-left:3px}',
    '.hp-kpi .d{margin-top:6px;font-size:11.5px;color:var(--text-3)}',
    '.hp-alert{display:flex;gap:18px;align-items:center;padding:11px 16px;border:1px solid rgba(56,189,248,.35);background:rgba(56,189,248,.08);border-radius:14px;font-size:13px;margin-bottom:14px;flex-wrap:wrap}',
    '.hp-alert .t{font-size:11px;letter-spacing:.16em;color:var(--primary)}',
    '.hp-alert b{color:var(--primary);font-weight:600}',
    '.hp-alert .i{cursor:pointer}.hp-alert .i:hover b{text-decoration:underline}',
    '.hp-grid{display:grid;gap:11px;margin-bottom:11px}',
    '.hp-g2{grid-template-columns:1fr 1fr}',
    '.hp-card{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:12px 14px;overflow:hidden;display:flex;flex-direction:column}',
    '.hp-card h3{font-size:14px;font-weight:600;display:flex;align-items:center;gap:9px;margin-bottom:8px}',
    '.hp-card h3 i{width:3px;height:13px;background:var(--primary);display:block}',
    '.hp-card h3 span{margin-left:auto;font-size:11.5px;color:var(--text-3);font-weight:400}',
    '.hp-chart{position:relative;height:250px;margin-top:4px}',
    '.hp-chart canvas{position:absolute;inset:0;width:100%;height:100%}',
    '.hp-hrow{display:grid;grid-template-columns:1.2fr 1fr .9fr .6fr;gap:10px;align-items:center;padding:8px 4px;border-top:1px solid var(--border);cursor:pointer;font-size:12.5px}',
    '.hp-hrow:hover{background:rgba(56,189,248,.06)}',
    '.hp-hrow .nm{display:flex;align-items:center;gap:8px}',
    '.hp-hrow .nm i{width:7px;height:7px;border-radius:50%;flex:0 0 7px}',
    '.hp-hrow .bar{height:4px;background:rgba(56,189,248,.14);margin-top:5px}',
    '.hp-hrow .bar i{display:block;height:100%}',
    '.hp-todo{display:flex;align-items:center;gap:10px;padding:10px 4px;border-top:1px solid var(--border);font-size:13px;cursor:pointer}',
    '.hp-todo:hover{background:rgba(56,189,248,.06)}',
    '.hp-todo .s{margin-left:auto;color:var(--text-2);font-size:12.5px}',
    '.hp-todo .b{padding:2px 8px;font-size:11px;border:1px solid var(--border);color:var(--text-3);border-radius:6px}',
    '.hp-note{font-size:12px;color:var(--text-3);line-height:1.9;margin-top:8px}',
    '.hp-alert-fold{margin-left:auto;border:0;background:none;color:var(--text-3);font-size:11.5px;cursor:pointer}',
    '.hp-alert.min .i{display:none}',
    '.hp-alert.min .sum{display:inline}',
    '.hp-alert .sum{display:none}',
    '.hp-more{display:inline-block;margin-top:8px;font-size:12px;color:var(--primary);cursor:pointer}'
  ].join('');

  function injectCSS() {
    if (document.getElementById('hpConsoleCSS')) return;
    var st = document.createElement('style');
    st.id = 'hpConsoleCSS'; st.textContent = CSS;
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

  var PAL = ['#f0b429', '#38bdf8', '#2dd4bf', '#a78bfa', '#f87171', '#60a5fa'];

  function drawBars(cv, d) {
    canvas(cv, function (ctx, W, H) {
      var max = Math.max.apply(null, d.values) || 1, n = d.values.length, rowH = (H - 8) / n;
      d.values.forEach(function (v, i) {
        var y = 6 + i * rowH, w = Math.max(4, (W - 150) * v / max), h = rowH - 12;
        txt(ctx, d.labels[i], 4, y + h / 2, cssvar('--text-2', '#9db2cb'), 12);
        ctx.fillStyle = PAL[i % PAL.length]; ctx.globalAlpha = i === 0 ? 1 : .78;
        ctx.fillRect(112, y, w, h); ctx.globalAlpha = 1;
        txt(ctx, String(v), 118 + w, y + h / 2, cssvar('--text', '#eaf7ff'), 12);
      });
    });
  }

  function drawHist(cv, d) {
    canvas(cv, function (ctx, W, H) {
      var pad = { l: 34, r: 10, t: 24, b: 26 }, max = Math.max.apply(null, d.values) || 1;
      var n = d.values.length, bw = (W - pad.l - pad.r) / n;
      var peak = d.values.indexOf(Math.max.apply(null, d.values));
      d.values.forEach(function (v, i) {
        var h = (H - pad.t - pad.b) * v / max, x = pad.l + i * bw + 3;
        var col = i >= 8 ? '#f0b429' : i >= 6 ? '#2dd4bf' : 'rgba(96,165,250,.45)';
        ctx.fillStyle = col; ctx.fillRect(x, H - pad.b - h, bw - 6, h);
        if (i === peak && v) txt(ctx, String(v), x + (bw - 6) / 2, H - pad.b - h - 13, '#fff', 12, 'center');
        txt(ctx, String(d.labels[i]), x + (bw - 6) / 2, H - pad.b + 14, cssvar('--text-3', '#7a8da6'), 10.5, 'center');
      });
      ctx.strokeStyle = cssvar('--border', 'rgba(56,189,248,.22)');
      ctx.beginPath(); ctx.moveTo(pad.l, H - pad.b); ctx.lineTo(W - pad.r, H - pad.b); ctx.stroke();
    });
  }

  function drawRev(cv, f) {
    canvas(cv, function (ctx, W, H) {
      var pad = { l: 34, r: 12, t: 16, b: 22 }, max = Math.max.apply(null, f.revenue) * 1.2 || 1;
      var n = f.revenue.length, iw = (W - pad.l - pad.r) / n, bw = iw * 0.45;
      f.revenue.forEach(function (v, i) {
        var h = (H - pad.t - pad.b) * v / max, x = pad.l + iw * i + iw / 2 - bw / 2;
        ctx.fillStyle = cssvar('--primary', '#38bdf8'); ctx.globalAlpha = .8;
        ctx.fillRect(x, H - pad.b - h, bw, h); ctx.globalAlpha = 1;
        txt(ctx, f.months[i].slice(5), x + bw / 2, H - pad.b + 11, cssvar('--text-3', '#7a8da6'), 10, 'center');
      });
      ctx.beginPath();
      f.margin.forEach(function (v, i) {
        var x = pad.l + iw * i + iw / 2;
        var y = pad.t + (H - pad.t - pad.b) * (1 - (v - 20) / 15);
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      });
      ctx.strokeStyle = '#f0b429'; ctx.lineWidth = 2; ctx.stroke();
    });
  }

  function drawAging(cv, d) {
    canvas(cv, function (ctx, W, H) {
      var max = Math.max.apply(null, d.map(function (x) { return x[1]; })) || 1;
      var top = 10, rowH = (H - top) / d.length;
      d.forEach(function (row, i) {
        var y = top + i * rowH, w = Math.max(2, (W - 128) * row[1] / max);
        txt(ctx, row[0], 4, y + rowH / 2, cssvar('--text-2', '#9db2cb'), 12);
        var c = row[2] === 'good' ? '#4ade80' : row[2] === 'warn' ? '#f0b429' : row[2] === 'bad' ? '#f87171' : '#38bdf8';
        ctx.fillStyle = c; ctx.globalAlpha = .85; ctx.fillRect(104, y + 4, w, rowH - 10); ctx.globalAlpha = 1;
        txt(ctx, row[1] + L(' 万', ' ×10k'), 110 + w, y + rowH / 2, cssvar('--text', '#eaf7ff'), 12);
      });
    });
  }

  function build(d) {
    var html = '<div class="hp-kpis">' + d.kpi.map(function (k) {
      return '<div class="hp-kpi" data-go="' + esc(k.go || 'projects') + '"><div class="k">' + esc(k.k) + '</div>' +
        '<div class="v">' + esc(k.v) + '<small>' + esc(k.u) + '</small></div>' +
        '<div class="d ' + (k.c || '') + '">' + esc(k.d) + '</div></div>';
    }).join('') + '</div>';

    html += '<div class="hp-alert" id="hpAlert"><span class="t">' + L('实时', 'Live') + '</span>' +
      '<span class="sum">' + d.alerts.length + L(' 条提醒', ' alerts') + '</span>' +
      d.alerts.map(function (a) {
        return '<span class="i" data-go="' + a.go + '">' + esc(a.t) + ' <b>' + esc(a.v) + '</b> ' + esc(a.u) + '</span>';
      }).join('') +
      '<button class="hp-alert-fold" id="hpAlertFold">' + L('收起', 'Collapse') + '</button></div>';

    html += '<div class="hp-grid hp-g2">' +
      '<div class="hp-card"><h3><i></i>' + esc(d.gaps.title) + '<span>' + L('人', 'people') + '</span></h3><div class="hp-chart"><canvas class="hp-cv-gaps"></canvas></div></div>' +
      '<div class="hp-card"><h3><i></i>' + esc(d.hist.title) + '<span>' + L('分档 · 人', 'bucket · people') + '</span></h3><div class="hp-chart"><canvas class="hp-cv-hist"></canvas></div></div></div>';

    if (d.finance && d.fin) {
      html += '<div class="hp-grid hp-g2">' +
        '<div class="hp-card"><h3><i></i>' + L('营收与毛利率', 'Revenue & margin') + '<span>' + L('结算单口径 · 万元', 'settlement basis · CNY 10k') + '</span></h3><div class="hp-chart"><canvas class="hp-cv-rev"></canvas></div></div>' +
        '<div class="hp-card"><h3><i></i>' + L('应收账龄', 'Receivables aging') + '<span>' + L('按应收到期日', 'by due date') + '</span></h3><div class="hp-chart"><canvas class="hp-cv-age"></canvas></div></div></div>';
    }

    html += '<div class="hp-grid hp-g2">' +
      '<div class="hp-card"><h3><i></i>' + L('岗位健康度', 'Role health') + '<span>' + L('点击查看岗位', 'click to view role') + '</span></h3><div class="hp-jobs"></div></div>' +
      '<div class="hp-card"><h3><i></i>' + L('待办', 'To-do') + '<span>' + L('实时', 'Live') + '</span></h3><div class="hp-todos"></div>' +
      '<div class="hp-note">' + esc(d.financeNote || '') + '</div></div></div>';
    return html;
  }

  function paint(host, d) {
    host.innerHTML = build(d);

    host.querySelector('.hp-jobs').innerHTML = d.jobs.map(function (j) {
      var c = j[4] === 'ok' ? '#4ade80' : j[4] === 'warn' ? '#f0b429' : j[4] === 'bad' ? '#f87171' : '#7a8da6';
      return '<div class="hp-hrow" data-go="projects" data-job="' + esc(j[0]) + '">' +
        '<div class="nm"><i style="background:' + c + '"></i>' + esc(j[0]) + '</div>' +
        '<div><b style="font-weight:400">' + j[1] + L(' 天', ' days') + '</b><div class="bar"><i style="width:' + Math.min(100, j[1] / 60 * 100) + '%;background:' + c + '"></i></div></div>' +
        '<div><b style="font-weight:400">' + j[2] + '%</b><div class="bar"><i style="width:' + Math.min(100, j[2]) + '%;background:' + c + '"></i></div></div>' +
        '<div style="text-align:right">' + j[3] + L(' 人', '') + '</div></div>';
    }).join('') || '<div class="hp-note">' + L('暂无岗位数据', 'No job data') + '</div>';

    var todos = d.todos || [];
    var showAll = false;
    function paintTodos() {
      var list = showAll ? todos : todos.slice(0, 5);
      var h = list.map(function (t) {
        return '<div class="hp-todo" data-go="' + t[3] + '"><span>' + esc(t[0]) + '</span>' +
          '<span class="s">' + esc(t[1]) + '</span><span class="b">' + esc(t[2]) + '</span></div>';
      }).join('');
      if (todos.length > 5) {
        h += '<span class="hp-more" id="hpTodoMore">' + (showAll ? L('收起', 'Collapse') : L('展开全部 ', 'Show all ') + todos.length + L(' 条', '')) + '</span>';
      }
      host.querySelector('.hp-todos').innerHTML = h;
      var more = document.getElementById('hpTodoMore');
      if (more) more.onclick = function () { showAll = !showAll; paintTodos(); };
    }
    paintTodos();

    var fold = document.getElementById('hpAlertFold');
    if (fold) fold.onclick = function () {
      var bar = document.getElementById('hpAlert');
      var min = bar.classList.toggle('min');
      fold.textContent = min ? L('展开', 'Expand') : L('收起', 'Collapse');
    };

    drawBars(host.querySelector('.hp-cv-gaps'), d.gaps);
    drawHist(host.querySelector('.hp-cv-hist'), d.hist);
    if (d.finance && d.fin) {
      drawRev(host.querySelector('.hp-cv-rev'), d.fin);
      drawAging(host.querySelector('.hp-cv-age'), d.fin.aging);
    }

    host.querySelectorAll('[data-go]').forEach(function (el) {
      el.addEventListener('click', function () {
        var v = el.getAttribute('data-go');
        location.hash = '#/company/' + v;
        if (window.demoToast) demoToast(L('已跳转：', 'Jumped to: ') + (el.getAttribute('data-job') || v));
      });
    });
  }

  /* 中英双语：非中文界面取英文（其余语言也回退英文） */
  function isEN() { return !!(window.HPI18N && window.HPI18N.lang && window.HPI18N.lang() !== 'zh'); }
  function L(zh, en) { return isEN() ? en : zh; }

  var cache = null;
  function mount(host) {
    if (!host) return;
    injectCSS();
    if (host.children.length && cache) { paint(host, cache); return; }
    host.innerHTML = '<div style="color:var(--text-3);font-size:13px;padding:10px 0">' + L('加载中…', 'Loading…') + '</div>';
    fetch('/api/console', { credentials: 'same-origin' })
      .then(function (r) { if (!r.ok) throw new Error('http ' + r.status); return r.json(); })
      .then(function (d) { cache = d; paint(host, d); })
      .catch(function () {
        host.innerHTML = '<div style="color:var(--text-3);font-size:13px;padding:14px 0">' + L('接口未就绪，请重启后端后重试', 'API not ready, restart backend and retry') + '</div>';
      });
  }

  window.addEventListener('resize', function () {
    var h = document.getElementById('hpConsole');
    if (!h || !cache) return;
    drawBars(h.querySelector('.hp-cv-gaps'), cache.gaps);
    if (cache.finance && cache.fin && h.querySelector('.hp-cv-rev')) {
      drawRev(h.querySelector('.hp-cv-rev'), cache.fin);
      drawAging(h.querySelector('.hp-cv-age'), cache.fin.aging);
    }
    drawHist(h.querySelector('.hp-cv-hist'), cache.hist);
  });

  /* 切语言时清缓存，让 showView 重新按新语言拉数据 */
  function invalidate() { cache = null; }

  window.HPCONSOLE = { mount: mount, invalidate: invalidate };
})();
