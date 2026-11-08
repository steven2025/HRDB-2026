/* ==================================================================
   项目管理 —— 「岗位生意账」页签
   对外：window.HPJOBS.init(projectsView)
   数据：GET /api/jobs/ledger（失败用演示数据）
   ================================================================== */
(function () {
  'use strict';

  var JOBS = [
    { n: '压机操作', c: '阿尔及利亚', need: 46, rec: 82, days: 28, gm: 26, st: '在招',
      funnel: [214, 126, 82, 41, 29], stage: [6, 9, 7, 6], ch: 18400, per: 634, price: '6,800', gp: '1,768', risk: ['语言不达标 9 人', '护照过期 3 人'] },
    { n: '装配技术员', c: '越南', need: 38, rec: 64, days: 35, gm: 22, st: '在招',
      funnel: [168, 98, 64, 33, 21], stage: [8, 11, 9, 7], ch: 15600, per: 743, price: '5,200', gp: '1,144', risk: ['无证书 12 人'] },
    { n: '仓储物流', c: '沙特', need: 52, rec: 41, days: 42, gm: 18, st: '预警',
      funnel: [132, 74, 41, 19, 11], stage: [11, 13, 10, 8], ch: 22800, per: 2073, price: '4,600', gp: '828', risk: ['薪资无竞争力', '加班条款不清'] },
    { n: '质检员', c: '马来西亚', need: 21, rec: 33, days: 22, gm: 31, st: '在招',
      funnel: [96, 58, 33, 21, 16], stage: [4, 7, 5, 6], ch: 8900, per: 556, price: '7,200', gp: '2,232', risk: [] },
    { n: '焊工', c: '沙特', need: 34, rec: 12, days: 55, gm: 15, st: '预警',
      funnel: [58, 26, 12, 5, 3], stage: [18, 16, 12, 9], ch: 19400, per: 6467, price: '5,800', gp: '870', risk: ['要求过高', '无本地证书'] },
    { n: '包装工', c: '阿尔及利亚', need: 12, rec: 28, days: 18, gm: 14, st: '低毛利',
      funnel: [84, 46, 28, 18, 14], stage: [3, 5, 4, 6], ch: 7600, per: 543, price: '3,900', gp: '546', risk: ['毛利低于 15%'] },
    { n: '设备维修', c: '哈萨克斯坦', need: 9, rec: 11, days: 47, gm: 29, st: '在招',
      funnel: [42, 20, 11, 6, 4], stage: [14, 13, 11, 9], ch: 11200, per: 2800, price: '8,600', gp: '2,494', risk: ['语言要求高'] },
    { n: '翻译', c: '阿联酋', need: 4, rec: 6, days: 61, gm: 12, st: '预警',
      funnel: [26, 12, 6, 2, 1], stage: [21, 18, 12, 10], ch: 9800, per: 9800, price: '9,200', gp: '1,104', risk: ['要求过高', '无合适人选'] }
  ];

  var CSS = [
    '.hpj-tabs{display:flex;gap:2px;border-bottom:1px solid var(--border);margin:6px 0 16px}',
    '.hpj-tabs button{height:38px;padding:0 18px;border:0;background:none;color:var(--text-2);font-size:14px;cursor:pointer;border-bottom:2px solid transparent}',
    '.hpj-tabs button.on{color:var(--primary);border-bottom-color:var(--primary);font-weight:600}',
    '.hpj-wrap{display:grid;grid-template-columns:1fr 460px;gap:14px;align-items:start}',
    '.hpj-tablecard{background:var(--surface);border:1px solid var(--border);border-radius:16px;overflow:hidden}',
    '.hpj-table{width:100%;border-collapse:collapse;font-size:13px}',
    '.hpj-table th{text-align:left;padding:12px;font-size:11.5px;color:var(--text-3);font-weight:400;border-bottom:1px solid var(--border)}',
    '.hpj-table td{padding:12px;border-bottom:1px solid var(--border);white-space:nowrap}',
    '.hpj-table tbody tr{cursor:pointer}',
    '.hpj-table tbody tr:hover{background:rgba(56,189,248,.06)}',
    '.hpj-table tbody tr.on{background:rgba(56,189,248,.10);box-shadow:inset 2px 0 0 var(--primary)}',
    '.hpj-dot{display:inline-block;width:7px;height:7px;border-radius:50%;margin-right:8px}',
    '.hpj-bar{height:4px;background:rgba(56,189,248,.14);margin-top:5px;width:78px}',
    '.hpj-bar i{display:block;height:100%}',
    '.hpj-tag{font-size:11px;padding:2px 8px;border:1px solid var(--border);border-radius:7px}',
    '.hpj-tag.ok{color:#4ade80;border-color:rgba(74,222,128,.4)}',
    '.hpj-tag.warn{color:#f0b429;border-color:rgba(240,180,41,.4)}',
    '.hpj-tag.bad{color:#f87171;border-color:rgba(248,113,113,.4)}',
    '.hpj-wrap.full{grid-template-columns:1fr}',
    '.hpj-detail.hide{display:none}',
    '.hpj-x{margin-left:auto;width:30px;height:30px;border:1px solid var(--border);border-radius:8px;background:none;color:var(--text-3);font-size:13px;cursor:pointer;flex:0 0 30px}',
    '.hpj-x:hover{color:var(--primary);border-color:var(--primary)}',
    '.hpj-detail{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:16px 18px}',
    '.hpj-dh{display:flex;align-items:flex-start;gap:10px;border-bottom:1px solid var(--border);padding-bottom:12px}',
    '.hpj-dh .n{font-size:18px;font-weight:600}',
    '.hpj-dh .s{margin-top:4px;font-size:12.5px;color:var(--text-3)}',
    '.hpj-nums{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:14px 0}',
    '.hpj-nums div{border:1px solid var(--border);border-radius:12px;padding:10px 12px}',
    '.hpj-nums b{display:block;font-size:20px;font-weight:300}',
    '.hpj-nums span{font-size:11px;color:var(--text-3)}',
    '.hpj-h5{font-size:11.5px;letter-spacing:.16em;color:var(--text-3);margin:16px 0 8px}',
    '.hpj-step{display:flex;align-items:center;gap:9px;margin:8px 0;font-size:12.5px}',
    '.hpj-step .l{flex:0 0 74px;color:var(--text-3)}',
    '.hpj-step .t{flex:1;height:18px;background:rgba(56,189,248,.08);border-radius:3px;overflow:hidden}',
    '.hpj-step .t i{display:block;height:100%;background:linear-gradient(90deg,var(--primary),rgba(56,189,248,.35))}',
    '.hpj-step .v{flex:0 0 72px;text-align:right;font-variant-numeric:tabular-nums}',
    '.hpj-money{display:grid;grid-template-columns:1fr 1fr;gap:10px}',
    '.hpj-money div{border:1px solid var(--border);border-radius:12px;padding:10px 12px}',
    '.hpj-money b{display:block;font-size:16px;font-weight:400;margin-top:4px}',
    '.hpj-money span{font-size:11px;color:var(--text-3)}',
    '.hpj-risk{display:flex;gap:8px;flex-wrap:wrap;margin-top:6px}',
    '.hpj-act{display:flex;gap:8px;margin-top:18px}',
    '.hpj-act button{flex:1;height:34px;border:1px solid var(--border);border-radius:10px;background:none;color:var(--text-2);font-size:12.5px;cursor:pointer}',
    '.hpj-act button.p{border-color:var(--primary);color:var(--primary)}',
    '.hpj-tool{display:flex;gap:8px;margin-bottom:10px;align-items:center}',
    '.hpj-tool .sp{flex:1}',
    '.hpj-vbtn{height:30px;padding:0 12px;border:1px solid var(--border);border-radius:9px;background:none;color:var(--text-2);font-size:12px;cursor:pointer}',
    '.hpj-vbtn.on{border-color:var(--primary);color:var(--primary)}',
    '.hpj-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px}',
    '.hpj-card{border:1px solid var(--border);border-radius:14px;padding:12px 14px;background:var(--surface-2);cursor:pointer}',
    '.hpj-card:hover,.hpj-card.on{border-color:var(--primary)}',
    '.hpj-card .n{font-size:14px;font-weight:600}',
    '.hpj-card .m{margin-top:4px;font-size:11.5px;color:var(--text-3)}',
    '.hpj-card .r{display:flex;gap:10px;margin-top:8px;font-size:12px}',
    '.hpj-card .r b{font-weight:400;color:var(--primary)}'
  ].join('');

  var state = { cur: 0, closed: false, list: JOBS, view: 'table' };

  function injectCSS() {
    if (document.getElementById('hpJobsCSS')) return;
    var st = document.createElement('style');
    st.id = 'hpJobsCSS'; st.textContent = CSS;
    document.head.appendChild(st);
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); }
  function dot(j) { return j.gm < 15 ? '#f87171' : j.days > 45 ? '#f0b429' : '#4ade80'; }
  function tagCls(s) { return s === '在招' ? 'ok' : s === '预警' ? 'bad' : 'warn'; }

  /* 中英双语：非中文界面取英文（其余语言也回退英文） */
  function isEN() { return !!(window.HPI18N && window.HPI18N.lang && window.HPI18N.lang() !== 'zh'); }
  function L(zh, en) { return isEN() ? en : zh; }
  var EN = isEN();

  /* 状态值是后端业务码（在招/预警/低毛利），只换显示文案 */
  function stLabel(s) {
    if (!isEN()) return s;
    if (s === '在招') return 'Open';
    if (s === '预警') return 'Alert';
    if (s === '低毛利') return 'Low margin';
    return s;
  }

  function render(box) {
    var jobs = state.list;
    var html = '<div class="hpj-tool"><span style="font-size:12px;color:var(--text-3)">' + L('共 ', 'Total ') + jobs.length + L(' 个岗位', ' jobs') + '</span><span class="sp"></span>' +
      '<button class="hpj-vbtn ' + (state.view === 'table' ? 'on' : '') + '" data-v="table">' + L('列表', 'List') + '</button>' +
      '<button class="hpj-vbtn ' + (state.view === 'cards' ? 'on' : '') + '" data-v="cards">' + L('卡片', 'Cards') + '</button></div>';

    html += '<div class="hpj-wrap' + (state.closed ? ' full' : '') + '"><div class="hpj-tablecard">';

    if (state.view === 'cards') {
      html += '<div class="hpj-cards">' + jobs.map(function (j, i) {
        return '<div class="hpj-card ' + (i === state.cur ? 'on' : '') + '" data-i="' + i + '">' +
          '<div class="n">' + esc(j.n) + '</div>' +
          '<div class="m">' + esc(j.c) + ' · ' + esc(stLabel(j.st)) + '</div>' +
          '<div class="r"><span>' + L('缺口', 'Openings') + ' <b>' + j.need + '</b></span><span>' + L('推荐', 'Referred') + ' <b>' + j.rec + '</b></span><span>' + L('毛利', 'Margin') + ' <b>' + j.gm + '%</b></span></div></div>';
      }).join('') + '</div>';
    } else {
      html += '<table class="hpj-table"><thead><tr>' +
      '<th>' + L('岗位', 'Role') + '</th><th>' + L('国家', 'Country') + '</th><th>' + L('缺口', 'Openings') + '</th><th>' + L('已推荐', 'Referred') + '</th><th>' + L('填补天数', 'Days to fill') + '</th><th>' + L('毛利率', 'Margin') + '</th><th>' + L('状态', 'Status') + '</th></tr></thead><tbody>';

    html += jobs.map(function (j, i) {
      return '<tr data-i="' + i + '" class="' + (i === state.cur ? 'on' : '') + '">' +
        '<td><i class="hpj-dot" style="background:' + dot(j) + '"></i>' + esc(j.n) + '</td>' +
        '<td>' + esc(j.c) + '</td><td>' + j.need + L(' 人', '') + '</td><td>' + j.rec + L(' 人', '') + '</td>' +
        '<td>' + j.days + L(' 天', ' days') + '<div class="hpj-bar"><i style="width:' + Math.min(100, j.days / 60 * 100) + '%;background:' + dot(j) + '"></i></div></td>' +
        '<td>' + j.gm + '%<div class="hpj-bar"><i style="width:' + Math.min(100, j.gm / 35 * 100) + '%;background:' + (j.gm < 18 ? '#f87171' : '#38bdf8') + '"></i></div></td>' +
        '<td><span class="hpj-tag ' + tagCls(j.st) + '">' + esc(stLabel(j.st)) + '</span></td></tr>';
    }).join('');

    html += '</tbody></table>';
    }

    html += '</div><div class="hpj-detail" id="hpjDetail"></div></div>';
    box.innerHTML = html;

    box.querySelectorAll('[data-v]').forEach(function (b) {
      b.onclick = function () { state.view = b.dataset.v; render(box); };
    });
    box.querySelectorAll('[data-i]').forEach(function (tr) {
      tr.onclick = function () { state.cur = +tr.dataset.i; state.closed = false; render(box); };
    });
    detail(box);
  }

  function detail(box) {
    var d = box.querySelector('#hpjDetail');
    var j = state.list[state.cur];
    if (!j || !d) return;
    d.classList.toggle('hide', state.closed);
    if (state.closed) { d.innerHTML = ''; return; }
    var total = j.funnel[0];
    var names = EN ? ['Applied', 'Matched', 'Interview', 'Offer', 'On site'] : ['投递', '匹配', '面试', '录用', '到岗'];
    var stages = EN ? ['Posting → first batch', 'First batch → interview', 'Interview → offer', 'Offer → on site']
      : ['发布→首批推荐', '首批→面试', '面试→录用', '录用→到岗'];

    var html = '<div class="hpj-dh"><div><div class="n">' + esc(j.n) + '</div>' +
      '<div class="s">' + esc(j.c) + ' · ' + esc(stLabel(j.st)) + L(' · 毛利率 ', ' · Margin ') + j.gm + '%</div></div>' +
      '<button class="hpj-x" data-close title="' + L('关闭（列表铺满）', 'Close (full list)') + '">✕</button></div>';

    html += '<div class="hpj-nums">' +
      '<div><b>' + j.need + '</b><span>' + L('缺口', 'Openings') + '</span></div>' +
      '<div><b>' + j.rec + '</b><span>' + L('已推荐', 'Referred') + '</span></div>' +
      '<div><b>' + j.days + '</b><span>' + L('填补天数', 'Days to fill') + '</span></div>' +
      '<div><b>' + j.gm + '%</b><span>' + L('毛利率', 'Margin') + '</span></div></div>';

    html += '<div class="hpj-h5">' + L('供给漏斗', 'Supply funnel') + '</div>';
    j.funnel.forEach(function (v, k) {
      var w = v / total * 100;
      var rate = k ? Math.round(v / j.funnel[k - 1] * 100) + '%' : '';
      html += '<div class="hpj-step"><span class="l">' + names[k] + '</span>' +
        '<div class="t"><i style="width:' + w + '%"></i></div>' +
        '<span class="v">' + v + L(' 人 ', ' ') + rate + '</span></div>';
    });

    html += '<div class="hpj-h5">' + L('阶段耗时', 'Stage duration') + '</div>';
    j.stage.forEach(function (v, k) {
      html += '<div class="hpj-step"><span class="l">' + stages[k] + '</span>' +
        '<div class="t"><i style="width:' + Math.min(100, v / 22 * 100) + '%"></i></div>' +
        '<span class="v">' + v + L(' 天', ' days') + '</span></div>';
    });

    html += '<div class="hpj-h5">' + L('成本与收益', 'Cost & revenue') + '</div><div class="hpj-money">' +
      '<div><span>' + L('渠道费用', 'Channel cost') + '</span><b>' + j.ch.toLocaleString() + L(' 元', ' CNY') + '</b></div>' +
      '<div><span>' + L('单人成本', 'Cost per hire') + '</span><b>' + j.per.toLocaleString() + L(' 元', ' CNY') + '</b></div>' +
      '<div><span>' + L('客户报价', 'Client price') + '</span><b>' + j.price + L(' 元/月', ' CNY/mo') + '</b></div>' +
      '<div><span>' + L('单毛利', 'Gross profit') + '</span><b>' + j.gp + L(' 元/月', ' CNY/mo') + '</b></div></div>';

    if (j.risk && j.risk.length) {
      html += '<div class="hpj-h5">' + L('风险与失败原因', 'Risks & failure reasons') + '</div><div class="hpj-risk">' +
        j.risk.map(function (r) { return '<span class="hpj-tag bad">' + esc(r) + '</span>'; }).join('') + '</div>';
    }

    html += '<div class="hpj-act"><button data-act="close">' + L('关闭岗位', 'Close role') + '</button><button class="p" data-act="push">' + L('加急推荐', 'Urgent refer') + '</button></div>';
    d.innerHTML = html;

    var x = d.querySelector('[data-close]');
    if (x) x.onclick = function () { state.closed = true; render(box); };
    d.querySelectorAll('[data-act]').forEach(function (b) {
      b.onclick = function () {
        var t = b.dataset.act === 'close'
          ? L('已提交关闭申请：', 'Close request submitted: ') + j.n
          : L('已加急：', 'Marked urgent: ') + j.n + L('（优先推送 3 天）', ' (pushed 3 days first)');
        if (window.demoToast) demoToast(t);
      };
    });
  }

  function init(viewEl) {
    if (!viewEl || viewEl.dataset.hpjDone === '1') return;
    viewEl.dataset.hpjDone = '1';
    injectCSS();

    var head = viewEl.querySelector('.page-head');
    var tabs = document.createElement('div');
    tabs.className = 'hpj-tabs';
    tabs.innerHTML = '<button class="on" data-tab="base">' + L('项目列表', 'Projects') + '</button><button data-tab="ledger">' + L('岗位生意账', 'Role P&L') + '</button>';
    if (head && head.nextSibling) viewEl.insertBefore(tabs, head.nextSibling);
    else viewEl.insertBefore(tabs, viewEl.firstChild);

    var box = document.createElement('div');
    box.id = 'hpJobsBox';
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
        box.style.display = t === 'ledger' ? '' : 'none';
        if (t === 'ledger' && !box.dataset.done) { box.dataset.done = '1'; load(box); }
      };
    });
  }

  function load(box) {
    box.innerHTML = '<div style="color:var(--text-3);font-size:13px;padding:10px 0">' + L('加载中…', 'Loading…') + '</div>';
    fetch('/api/jobs/ledger', { credentials: 'same-origin' })
      .then(function (r) { if (!r.ok) throw new Error('http'); return r.json(); })
      .then(function (d) {
        if (d && d.jobs && d.jobs.length) state.list = d.jobs;
        render(box);
      })
      .catch(function () { render(box); });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape' || state.closed) return;
    var b = document.getElementById('hpJobsBox');
    if (b && b.dataset.done === '1') { state.closed = true; render(b); }
  });

  /* 切语言：生意账已加载的话按新语言重拉（项目列表是静态源码，不动） */
  function invalidate() {
    var b = document.getElementById('hpJobsBox');
    if (b && b.dataset.done === '1') load(b);
  }

  window.HPJOBS = { init: init, invalidate: invalidate, JOBS: JOBS };
})();
