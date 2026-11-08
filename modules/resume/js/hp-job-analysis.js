/* ==================================================================
   hp-job-analysis.js —— 经营看板 ·「单岗位分析」页签
   数据：GET /api/jobs/analysis?jobId=&days=（真实 applications / interviews / offers）
        GET /api/jobs/analysis/list?days=（多岗位横向对比）
   回写：POST /api/company/interviews/:id/result {result: 通过|未通过|待定}
   ================================================================== */
(function () {
  'use strict';

  function isEN() { return !!(window.HPI18N && window.HPI18N.lang && window.HPI18N.lang() !== 'zh'); }
  function L(zh, en) { return isEN() ? en : zh; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); }
  function cssvar(n, d) { try { return getComputedStyle(document.documentElement).getPropertyValue(n).trim() || d; } catch (e) { return d; } }

  var CSS = [
    '.hja-tool{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:0 0 14px}',
    '.hja-tool select{height:34px;min-width:270px;padding:0 10px;border:1px solid var(--border);border-radius:9px;background:var(--surface-2);color:var(--text);font-size:13px}',
    '.hja-tool .sp{flex:1}',
    '.hja-hint{font-size:11.5px;color:var(--text-3)}',
    '.hja-seg{display:inline-flex;border:1px solid var(--border);border-radius:9px;overflow:hidden}',
    '.hja-seg button{height:32px;padding:0 12px;border:0;background:transparent;color:var(--text-2);font-size:12.5px;cursor:pointer}',
    '.hja-seg button.on{background:var(--primary);color:#02131f;font-weight:600}',
    '.hja-kpis{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:9px;margin-bottom:11px}',
    '.hja-kpi{padding:11px 14px;border:1px solid var(--border);border-radius:11px;background:var(--surface)}',
    '.hja-kpi .k{font-size:11.5px;color:var(--text-3);margin-bottom:6px}',
    '.hja-kpi .v{font-size:22px;font-weight:600;line-height:1.1;font-variant-numeric:tabular-nums}',
    '.hja-kpi .d{font-size:11.5px;color:var(--text-2);margin-top:6px}',
    '.hja-grid{display:grid;grid-template-columns:1fr 1fr;gap:11px;margin-bottom:11px}',
    '.hja-card{padding:12px 14px 8px;border:1px solid var(--border);border-radius:11px;background:var(--surface);margin-bottom:11px}',
    '.hja-card h3{display:flex;align-items:center;gap:8px;font-size:13.5px;font-weight:600;margin:0 0 8px}',
    '.hja-card h3 i{width:3px;height:13px;border-radius:2px;background:var(--primary);display:inline-block}',
    '.hja-card h3 span{margin-left:auto;font-size:11px;color:var(--text-3);font-weight:400}',
    '.hja-chart{height:190px;position:relative}',
    '.hja-chart canvas{width:100%;height:100%;display:block}',
    '.hja-chart.tall{height:260px}',
    '.hja-conv{display:flex;flex-direction:column;gap:9px;padding:2px 0 6px}',
    '.hja-conv .row{display:grid;grid-template-columns:150px 1fr 52px;align-items:center;gap:8px;font-size:12px;color:var(--text-2)}',
    '.hja-conv .bar{height:8px;border-radius:4px;background:var(--surface-3);overflow:hidden}',
    '.hja-conv .bar i{display:block;height:100%;background:linear-gradient(90deg,#38bdf8,#22d3ee)}',
    '.hja-conv .pt{text-align:right;font-variant-numeric:tabular-nums;color:var(--text)}',
    '.hja-table{width:100%;border-collapse:collapse;font-size:12.5px}',
    '.hja-table th{text-align:left;padding:8px 10px;font-size:11.5px;color:var(--text-3);font-weight:400;border-bottom:1px solid var(--border)}',
    '.hja-table td{padding:8px 10px;border-bottom:1px solid var(--border);color:var(--text-2)}',
    '.hja-tag{display:inline-block;font-size:11px;padding:2px 8px;border-radius:7px;border:1px solid var(--border)}',
    '.hja-tag.pass{color:#4ade80;border-color:rgba(74,222,128,.45)}',
    '.hja-tag.fail{color:#f87171;border-color:rgba(248,113,113,.45)}',
    '.hja-tag.pend{color:var(--text-3)}',
    '.hja-btn{height:24px;padding:0 9px;border-radius:7px;border:1px solid var(--border);background:var(--surface-2);color:var(--text-2);font-size:11.5px;cursor:pointer}',
    '.hja-btn:hover{border-color:var(--primary);color:var(--primary)}',
    '.hja-empty{padding:22px 0;text-align:center;color:var(--text-3);font-size:13px}',
    '.hja-note{margin-top:8px;font-size:11.5px;color:var(--text-3);line-height:1.8}',
    '.hja-legend{display:flex;gap:14px;font-size:11.5px;color:var(--text-3);margin-top:6px}',
    '.hja-why{font-size:10.5px;color:#f87171;border:1px solid rgba(248,113,113,.35);border-radius:6px;padding:1px 6px;margin-left:4px}',
    '.hja-reason{height:24px;border-radius:7px;border:1px solid var(--border);background:var(--surface-2);color:var(--text);font-size:11.5px;padding:0 6px;margin-right:4px}',
    '.hja-legend i{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:5px}',
    '@media (max-width:1100px){.hja-kpis{grid-template-columns:repeat(2,minmax(0,1fr))}.hja-grid{grid-template-columns:1fr}}'
  ].join('');

  function injectCSS() {
    if (document.getElementById('hpJobAnalysisCSS')) return;
    var st = document.createElement('style');
    st.id = 'hpJobAnalysisCSS';
    st.textContent = CSS;
    document.head.appendChild(st);
  }

  /* ---------- canvas 小工具 ---------- */
  function prep(cv) {
    if (!cv) return null;
    var dpr = window.devicePixelRatio || 1;
    var w = cv.clientWidth || 400, h = cv.clientHeight || 200;
    cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
    var ctx = cv.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx: ctx, W: w, H: h };
  }
  function text(ctx, s, x, y, color, size, align) {
    ctx.fillStyle = color;
    ctx.font = (size || 12) + 'px "Microsoft YaHei",system-ui,sans-serif';
    ctx.textAlign = align || 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(s, x, y);
  }
  function roundRect(ctx, x, y, w, h, r) {
    r = Math.min(r, h / 2, w / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  /* 横向漏斗：条形 + 数量 + 相对上一步留存；每段可点开明细 */
  function drawFunnel(cv, funnel, curStage) {
    var p = prep(cv); if (!p) return;
    var ctx = p.ctx, W = p.W, H = p.H;
    var max = Math.max.apply(null, funnel.map(function (f) { return f.v; }).concat([1]));
    var top = 10, rowH = (H - top * 2) / funnel.length;
    var labelW = Math.min(110, W * 0.3);
    cv.__rows = [];
    funnel.forEach(function (f, i) {
      var y = top + i * rowH + rowH / 2;
      cv.__rows.push({ y0: top + i * rowH, y1: top + (i + 1) * rowH, key: f.key });
      var on = curStage === f.key;
      if (on) {
        ctx.fillStyle = 'rgba(56,189,248,.08)';
        roundRect(ctx, 0, top + i * rowH + 2, W, rowH - 4, 8); ctx.fill();
      }
      var bw = Math.max(2, (W - labelW - 96) * f.v / max);
      var ratio = i === 0 ? null : (funnel[i - 1].v ? Math.round(f.v / funnel[i - 1].v * 1000) / 10 : null);
      text(ctx, f.k, 6, y, cssvar('--text-2', '#9db2cb'), 12);
      if (f.v > 0) {
        var g = ctx.createLinearGradient(labelW, 0, labelW + bw, 0);
        g.addColorStop(0, on ? '#22d3ee' : '#38bdf8');
        g.addColorStop(1, on ? '#a5f3fc' : '#22d3ee');
        ctx.fillStyle = g;
        roundRect(ctx, labelW, y - 8, bw, 16, 6); ctx.fill();
      } else {
        /* 0 值不画长条，避免看起来像有数据 */
        ctx.fillStyle = 'rgba(120,160,200,.18)';
        roundRect(ctx, labelW, y - 2, 4, 4, 2); ctx.fill();
      }
      text(ctx, f.v + (ratio != null ? '  (' + ratio + '%)' : ''), labelW + (f.v > 0 ? bw : 6) + 8, y, cssvar('--text', '#eaf7ff'), 12);
    });
    cv.style.cursor = 'pointer';
  }

  function drawTrend(cv, trend) {
    var p = prep(cv); if (!p) return;
    var ctx = p.ctx, W = p.W, H = p.H;
    var vals = trend.values || [], labels = trend.labels || [];
    var max = Math.max.apply(null, vals.concat([1]));
    var left = 28, bottom = 24, top = 10;
    var chartW = W - left - 8, chartH = H - bottom - top;
    ctx.strokeStyle = cssvar('--border', '#22344f');
    ctx.beginPath(); ctx.moveTo(left, top); ctx.lineTo(left, top + chartH); ctx.lineTo(W - 8, top + chartH); ctx.stroke();
    var bw = chartW / Math.max(1, vals.length) * 0.55;
    vals.forEach(function (v, i) {
      var cx = left + (i + 0.5) * (chartW / Math.max(1, vals.length));
      var h = Math.max(2, chartH * v / max);
      var g = ctx.createLinearGradient(0, top + chartH - h, 0, top + chartH);
      g.addColorStop(0, '#38bdf8'); g.addColorStop(1, 'rgba(34,211,238,.35)');
      ctx.fillStyle = g;
      roundRect(ctx, cx - bw / 2, top + chartH - h, bw, h, 4); ctx.fill();
      text(ctx, String(v), cx, top + chartH - h - 9, cssvar('--text-2', '#9db2cb'), 11, 'center');
      var mm = Number(String(labels[i] || '').slice(5)) || 0;
      text(ctx, isEN() ? ('M' + mm) : (mm + '月'), cx, H - 10, cssvar('--text-3', '#7a8da6'), 10, 'center');
    });
  }

  function drawDurations(cv, durations) {
    var p = prep(cv); if (!p) return;
    var ctx = p.ctx, W = p.W, H = p.H;
    var max = Math.max.apply(null, durations.map(function (d) { return d.v || 0; }).concat([1]));
    var top = 12, rowH = (H - top * 2) / durations.length;
    var labelW = Math.min(120, W * 0.34);
    durations.forEach(function (d, i) {
      var y = top + i * rowH + rowH / 2;
      text(ctx, d.k, 6, y, cssvar('--text-2', '#9db2cb'), 12);
      if (d.v == null) {
        text(ctx, L('暂无时间戳', 'no timestamps'), labelW + 4, y, cssvar('--text-3', '#7a8da6'), 11);
        return;
      }
      var bw = Math.max(2, (W - labelW - 96) * d.v / max);
      ctx.fillStyle = 'rgba(56,189,248,.55)';
      roundRect(ctx, labelW, y - 7, bw, 14, 5); ctx.fill();
      text(ctx, d.v + L(' 天', ' d') + (d.n ? '  (n=' + d.n + ')' : ''), labelW + bw + 8, y, cssvar('--text', '#eaf7ff'), 12);
    });
  }

  /* 简单横向条形：来源分布 / 未通过原因 */
  function drawBars(cv, rows, color) {
    var p = prep(cv); if (!p) return;
    var ctx = p.ctx, W = p.W, H = p.H;
    if (!rows || !rows.length) {
      text(ctx, L('暂无数据', 'no data'), W / 2, H / 2, cssvar('--text-3', '#7a8da6'), 12, 'center');
      return;
    }
    var max = Math.max.apply(null, rows.map(function (r) { return r.v; }).concat([1]));
    var top = 10, rowH = (H - top * 2) / rows.length;
    var labelW = Math.min(110, W * 0.3);
    rows.forEach(function (r, i) {
      var y = top + i * rowH + rowH / 2;
      text(ctx, r.k, 4, y, cssvar('--text-2', '#9db2cb'), 12);
      var bw = Math.max(2, (W - labelW - 60) * r.v / max);
      ctx.fillStyle = color || 'rgba(56,189,248,.65)';
      roundRect(ctx, labelW, y - 7, bw, 14, 5); ctx.fill();
      text(ctx, String(r.v), labelW + bw + 8, y, cssvar('--text', '#eaf7ff'), 12);
    });
  }

  /* 散点：X=到岗转化率，Y=面试通过率，气泡=投递量；当前岗位高亮 */
  function drawScatter(cv, rows, curId) {
    var p = prep(cv); if (!p) return;
    var ctx = p.ctx, W = p.W, H = p.H;
    var padL = 40, padB = 30, padT = 14, padR = 14;
    var cw = W - padL - padR, ch = H - padT - padB;
    ctx.strokeStyle = cssvar('--border', '#22344f');
    ctx.beginPath(); ctx.moveTo(padL, padT); ctx.lineTo(padL, padT + ch); ctx.lineTo(W - padR, padT + ch); ctx.stroke();
    /* 网格 */
    [0, 25, 50, 75, 100].forEach(function (v) {
      var x = padL + cw * v / 100;
      ctx.strokeStyle = 'rgba(120,160,200,.12)';
      ctx.beginPath(); ctx.moveTo(x, padT); ctx.lineTo(x, padT + ch); ctx.stroke();
      text(ctx, v + '%', x, H - 12, cssvar('--text-3', '#7a8da6'), 10, 'center');
      var y = padT + ch - ch * v / 100;
      ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(W - padR, y); ctx.stroke();
      text(ctx, v + '%', padL - 6, y, cssvar('--text-3', '#7a8da6'), 10, 'right');
    });
    var maxA = Math.max.apply(null, rows.map(function (r) { return r.applied || 0; }).concat([1]));
    rows.forEach(function (r) {
      if (r.convAppliedToHired == null || r.convInterviewPass == null) return;
      var x = padL + cw * Math.min(100, r.convAppliedToHired) / 100;
      var y = padT + ch - ch * Math.min(100, r.convInterviewPass) / 100;
      var rad = 4 + 9 * Math.sqrt((r.applied || 0) / maxA);
      var cur = r.id === curId;
      ctx.beginPath(); ctx.arc(x, y, rad, 0, Math.PI * 2);
      ctx.fillStyle = cur ? 'rgba(250,204,21,.85)' : 'rgba(56,189,248,.35)';
      ctx.fill();
      ctx.strokeStyle = cur ? '#facc15' : 'rgba(56,189,248,.75)';
      ctx.lineWidth = cur ? 2 : 1;
      ctx.stroke();
      if (cur) text(ctx, r.title, x + rad + 4, y - rad, '#facc15', 11);
    });
    text(ctx, isEN() ? 'Applied → onboarded' : '投递 → 到岗', padL + cw / 2, H - 1, cssvar('--text-3', '#7a8da6'), 10, 'center');
  }

  /* ---------- 页面 ---------- */
  var state = { jobs: null, jobId: null, data: null, list: null, stage: 'invited', days: 0, busy: false };
  var REASONS = ['经验不足', '技能不匹配', '薪资不符', '语言不过关', '证件不全', '到岗时间不符'];

  function jobOptions() {
    return (state.jobs || []).map(function (j) {
      return '<option value="' + esc(j.id) + '"' + (j.id === state.jobId ? ' selected' : '') + '>' +
        esc(j.title || j.name || j.id) + ' · ' + esc(j.country || '') + (j.headcount ? ('（' + j.headcount + ' 人）') : '') + '</option>';
    }).join('');
  }

  function skeleton(box) {
    var seg = [[0, L('全部', 'All')], [90, L('近 90 天', '90d')], [30, L('近 30 天', '30d')]];
    box.innerHTML =
      '<div class="hja-tool">' +
        '<select id="hjaJob">' + (state.jobs ? jobOptions() : '<option>' + L('加载岗位…', 'Loading jobs…') + '</option>') + '</select>' +
        '<span class="hja-seg" id="hjaDays">' + seg.map(function (s) {
          return '<button data-d="' + s[0] + '" class="' + (state.days === s[0] ? 'on' : '') + '">' + s[1] + '</button>';
        }).join('') + '</span>' +
        '<button class="hja-btn" id="hjaRefresh" style="height:32px">' + L('刷新', 'Refresh') + '</button>' +
        '<span class="sp"></span>' +
        '<span class="hja-hint">' + L('数据来源：投递 / 面试邀约 / 录用通知（实时）', 'Source: applications / interviews / offers (live)') + '</span>' +
      '</div>' +
      '<div id="hjaBody"><div class="hja-empty">' + L('加载中…', 'Loading…') + '</div></div>';

    var sel = box.querySelector('#hjaJob');
    if (sel) sel.onchange = function () { state.jobId = sel.value; state.data = null; loadData(box); };
    var rf = box.querySelector('#hjaRefresh');
    if (rf) rf.onclick = function () { loadData(box, true); };
    box.querySelectorAll('#hjaDays button').forEach(function (b) {
      b.onclick = function () {
        state.days = Number(b.getAttribute('data-d')) || 0;
        box.querySelectorAll('#hjaDays button').forEach(function (x) { x.classList.toggle('on', x === b); });
        state.data = null; state.list = null;
        loadData(box, true);
      };
    });
  }

  function kpiHtml(d) {
    var cards = [
      { k: L('投递', 'Applied'), v: d.applied, d: L('岗位收到的简历', 'applications received') },
      { k: L('面试邀约', 'Invited'), v: d.invited, d: L('已安排面试', 'interviews scheduled') },
      { k: L('面试通过', 'Passed'), v: d.passed, d: L('待定 ', 'pending ') + d.pending + L(' 条', '') },
      { k: L('Offer', 'Offer'), v: d.offered, d: L('待接受 ', 'pending ') + d.offerPending + L(' 条', '') },
      { k: L('到岗', 'Onboarded'), v: d.hired, d: L('接受 offer', 'accepted offers') }
    ];
    return '<div class="hja-kpis">' + cards.map(function (c) {
      return '<div class="hja-kpi"><div class="k">' + c.k + '</div><div class="v">' + c.v + '</div><div class="d">' + c.d + '</div></div>';
    }).join('') + '</div>';
  }

  function convHtml(conv) {
    return '<div class="hja-conv">' + conv.map(function (c) {
      var v = c.v == null ? null : c.v;
      var w = v == null ? 0 : Math.max(0, Math.min(100, v));
      return '<div class="row"><span>' + c.k + '</span><span class="bar"><i style="width:' + w + '%"></i></span>' +
        '<span class="pt">' + (v == null ? '—' : v + '%') + '</span></div>';
    }).join('') + '</div>';
  }

  function tagOf(result) {
    if (result === '通过') return '<span class="hja-tag pass">' + L('通过', 'Passed') + '</span>';
    if (result === '未通过') return '<span class="hja-tag fail">' + L('未通过', 'Failed') + '</span>';
    if (result === '已接受') return '<span class="hja-tag pass">' + L('已接受', 'Accepted') + '</span>';
    if (result === '已拒绝') return '<span class="hja-tag fail">' + L('已拒绝', 'Declined') + '</span>';
    if (result === '待接受') return '<span class="hja-tag pend">' + L('待接受', 'Pending') + '</span>';
    return '<span class="hja-tag pend">' + esc(result || '—') + '</span>';
  }

  /* 下方「阶段明细」：随漏斗选中段切换 */
  function stageCard(box, d) {
    var stage = state.stage || 'invited';
    var title = {
      applied: L('投递明细', 'Applications'), invited: L('面试记录 · 可回写结果', 'Interviews · write back'),
      passed: L('面试通过名单', 'Passed candidates'), offered: L('Offer 明细', 'Offers'), hired: L('已到岗名单', 'Onboarded')
    }[stage] || L('阶段明细', 'Stage detail');

    var body = '';
    if (stage === 'applied') {
      var rows = (d.detail && d.detail.applied) || [];
      body = rows.length ? '<table class="hja-table"><thead><tr><th>' + L('候选人', 'Candidate') + '</th><th>' + L('投递时间', 'Applied at') + '</th><th>' + L('来源', 'Source') + '</th><th>' + L('状态', 'Status') + '</th></tr></thead><tbody>' +
        rows.map(function (r) { return '<tr><td>' + esc(r.name) + '</td><td>' + esc(String(r.at).slice(0, 10) || '—') + '</td><td>' + esc(r.source || '未标注') + '</td><td>' + esc(r.status || '—') + '</td></tr>'; }).join('') +
        '</tbody></table>' : '<div class="hja-empty">' + L('该时间段没有投递', 'No applications in this range') + '</div>';
    } else if (stage === 'offered' || stage === 'hired') {
      var ofs = ((d.detail && d.detail.offers) || []).filter(function (o) { return stage === 'offered' ? true : o.status === '已接受'; });
      body = ofs.length ? '<table class="hja-table"><thead><tr><th>' + L('候选人', 'Candidate') + '</th><th>' + L('发出时间', 'Sent at') + '</th><th>' + L('薪资', 'Salary') + '</th><th>' + L('状态', 'Status') + '</th></tr></thead><tbody>' +
        ofs.map(function (r) { return '<tr><td>' + esc(r.name) + '</td><td>' + esc(String(r.at).slice(0, 10) || '—') + '</td><td>' + esc(r.salary || '—') + '</td><td>' + tagOf(r.status) + '</td></tr>'; }).join('') +
        '</tbody></table>' : '<div class="hja-empty">' + L('该时间段没有 Offer', 'No offers in this range') + '</div>';
    } else {
      var ivs = (d.interviews || []).filter(function (iv) { return stage === 'passed' ? iv.result === '通过' : true; });
      body = ivs.length ? '<table class="hja-table"><thead><tr><th>' + L('候选人', 'Candidate') + '</th><th>' + L('面试时间', 'Interview') + '</th><th>' + L('结果', 'Result') + '</th><th style="text-align:right">' + L('回写结果', 'Set result') + '</th></tr></thead><tbody>' +
        ivs.map(function (iv) {
          return '<tr><td>' + esc(iv.name) + '</td><td>' + esc(iv.at || '—') + '</td><td>' + tagOf(iv.result) +
            (iv.reason ? ' <span class="hja-why">' + esc(iv.reason) + '</span>' : '') + '</td>' +
            '<td style="text-align:right"><button class="hja-btn" data-iv="' + esc(iv.id) + '" data-r="通过">' + L('通过', 'Pass') + '</button> ' +
            '<button class="hja-btn" data-iv="' + esc(iv.id) + '" data-r="未通过">' + L('未通过', 'Fail') + '</button></td></tr>';
        }).join('') + '</tbody></table>' : '<div class="hja-empty">' + L('还没有面试记录，去「投递管理」邀面试', 'No interviews yet') + '</div>';
    }

    return '<div class="hja-card"><h3><i></i>' + title +
      '<span>' + L('点上面的漏斗可以切换阶段', 'click a funnel step to switch') + '</span></h3>' + body + '</div>';
  }

  function paint(box, d) {
    var body = box.querySelector('#hjaBody');
    if (!body) return;
    if (!d || !d.ok) {
      body.innerHTML = '<div class="hja-empty">' + L('这个岗位还没有招聘数据', 'No recruiting data for this job yet') + '</div>';
      return;
    }
    var rows = (state.list && state.list.jobs) || [];
    body.innerHTML =
      kpiHtml(d) +
      '<div class="hja-grid">' +
        '<div class="hja-card"><h3><i></i>' + L('招聘漏斗', 'Recruiting funnel') + '<span>' + L('点某一段看名单', 'click a step') + '</span></h3>' +
          '<div class="hja-chart"><canvas id="hjaFunnel"></canvas></div></div>' +
        '<div class="hja-card"><h3><i></i>' + L('环节转化率', 'Conversion') + '<span>' + L('越靠后越要盯', 'watch the tail') + '</span></h3>' + convHtml(d.conv) + '</div>' +
      '</div>' +
      '<div class="hja-grid">' +
        '<div class="hja-card"><h3><i></i>' + (d.trend && d.trend.title || L('投递趋势', 'Applications')) + '<span>' + L('近 6 个月', 'last 6 months') + '</span></h3>' +
          '<div class="hja-chart"><canvas id="hjaTrend"></canvas></div></div>' +
        '<div class="hja-card"><h3><i></i>' + L('阶段平均耗时', 'Average stage duration') + '<span>' + L('有真实时间戳才计算', 'needs real timestamps') + '</span></h3>' +
          '<div class="hja-chart"><canvas id="hjaDur"></canvas></div></div>' +
      '</div>' +
      (rows.length ? '<div class="hja-card"><h3><i></i>' + L('岗位横向对比', 'Job comparison') +
        '<span>' + L('X=到岗转化 · Y=面试通过率 · 气泡=投递量 · 黄点=当前岗位', 'X = applied→onboarded · Y = interview pass · bubble = applications') + '</span></h3>' +
        '<div class="hja-chart tall"><canvas id="hjaScatter"></canvas></div>' +
        '<div class="hja-legend"><span><i style="background:rgba(56,189,248,.6)"></i>' + L('其他岗位', 'Other jobs') + '</span>' +
        '<span><i style="background:#facc15"></i>' + L('当前岗位', 'Current job') + '</span></div></div>' : '') +
      '<div class="hja-grid">' +
        '<div class="hja-card"><h3><i></i>' + L('投递来源', 'Application sources') + '<span>' + L('按投递渠道', 'by channel') + '</span></h3>' +
          '<div class="hja-chart"><canvas id="hjaSrc"></canvas></div></div>' +
        '<div class="hja-card"><h3><i></i>' + L('面试未通过原因 Top5', 'Rejection reasons') + '<span>' + L('点击“未通过”时可填写', 'set when marking fail') + '</span></h3>' +
          '<div class="hja-chart"><canvas id="hjaWhy"></canvas></div></div>' +
      '</div>' +
      stageCard(box, d) +
      '<div class="hja-note">' + L(
        '口径：投递＝人才库/应聘者档案里的投递记录；面试＝邀约记录；通过/未通过＝回写结果；Offer/到岗＝录用通知状态。时间范围按对应记录的创建时间筛选。',
        'Definitions: applied = application records; invited = interview invitations; passed/failed = written-back results; offer/onboarded = offer statuses. Time range filters by each record\'s created time.') + '</div>';

    drawFunnel(body.querySelector('#hjaFunnel'), d.funnel, state.stage);
    drawTrend(body.querySelector('#hjaTrend'), d.trend);
    drawDurations(body.querySelector('#hjaDur'), d.durations);
    drawBars(body.querySelector('#hjaSrc'), d.sources || [], 'rgba(56,189,248,.65)');
    drawBars(body.querySelector('#hjaWhy'), d.rejectReasons || [], 'rgba(248,113,113,.6)');
    if (rows.length) drawScatter(body.querySelector('#hjaScatter'), rows, d.job.id);

    var cv = body.querySelector('#hjaFunnel');
    if (cv) {
      cv.onclick = function (e) {
        var rect = cv.getBoundingClientRect();
        var y = (e.clientY - rect.top) * (cv.clientHeight / rect.height);
        var hit = (cv.__rows || []).find(function (r) { return y >= r.y0 && y < r.y1; });
        if (!hit) return;
        state.stage = hit.key;
        paint(box, d);
      };
    }
    body.querySelectorAll('[data-iv]').forEach(function (b) {
      b.onclick = function () {
        var r = b.getAttribute('data-r');
        if (r !== '未通过') { writeResult(box, b.getAttribute('data-iv'), r, ''); return; }
        askReason(box, b.getAttribute('data-iv'), b.parentNode);
      };
    });
  }

  function askReason(box, ivId, cell) {
    cell.innerHTML = '<select class="hja-reason">' +
      '<option value="">原因（可不填）</option>' +
      REASONS.map(function (r) { return '<option value="' + r + '">' + r + '</option>'; }).join('') +
      '</select> <button class="hja-btn" data-ok>确定</button> <button class="hja-btn" data-cancel>取消</button>';
    cell.querySelector('[data-ok]').onclick = function () {
      writeResult(box, ivId, '未通过', cell.querySelector('select').value);
    };
    cell.querySelector('[data-cancel]').onclick = function () { loadData(box, true); };
    cell.querySelector('select').focus();
  }

  function writeResult(box, ivId, result, reason) {
    if (state.busy) return;
    state.busy = true;
    fetch('/api/company/interviews/' + encodeURIComponent(ivId) + '/result', {
      method: 'POST', credentials: 'same-origin',
      headers: { 'content-type': 'application/json', 'x-hp-request': '1' },
      body: JSON.stringify({ result: result, reason: reason || '' })
    }).then(function (r) { if (!r.ok) throw new Error('http ' + r.status); return r.json(); })
      .then(function () {
        state.busy = false;
        if (window.HP && window.HP.toast) window.HP.toast(L('已回写', 'Saved'), L('面试结果：', 'Result: ') + result);
        loadData(box, true);
      })
      .catch(function (e) {
        state.busy = false;
        if (window.HP && window.HP.toast) window.HP.toast(L('回写失败', 'Save failed'), e.message);
      });
  }

  function loadData(box, force) {
    var body = box.querySelector('#hjaBody');
    if (!state.jobId) {
      if (body) body.innerHTML = '<div class="hja-empty">' + L('请选择岗位', 'Pick a job') + '</div>';
      return;
    }
    if (body && (force || !state.data)) body.innerHTML = '<div class="hja-empty">' + L('加载中…', 'Loading…') + '</div>';
    var q = 'jobId=' + encodeURIComponent(state.jobId) + (state.days ? ('&days=' + state.days) : '');
    var p1 = fetch('/api/jobs/analysis?' + q, { credentials: 'same-origin' })
      .then(function (r) { if (!r.ok) throw new Error('http ' + r.status); return r.json(); });
    var p2 = fetch('/api/jobs/analysis/list' + (state.days ? ('?days=' + state.days) : ''), { credentials: 'same-origin' })
      .then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; });
    Promise.all([p1, p2]).then(function (arr) {
      state.data = arr[0]; state.list = arr[1];
      paint(box, state.data);
    }).catch(function () {
      if (body) body.innerHTML = '<div class="hja-empty">' + L('加载失败，请刷新重试', 'Load failed, please refresh') + '</div>';
    });
  }

  function loadJobs(box) {
    return fetch('/api/company/jobs', { credentials: 'same-origin' })
      .then(function (r) { if (!r.ok) throw new Error('http'); return r.json(); })
      .then(function (d) {
        var list = ((d && d.jobs) || []).slice();
        list.sort(function (a, b) { return (b.headcount || 0) - (a.headcount || 0); });
        state.jobs = list;
        if (!state.jobId && list.length) state.jobId = list[0].id;
        return list;
      })
      .catch(function () { state.jobs = state.jobs || []; return state.jobs; });
  }

  function mount(box) {
    if (!box) return;
    injectCSS();
    if (box.dataset.hjaMounted === '1' && state.jobs) {
      skeleton(box);
      if (state.data) paint(box, state.data); else loadData(box);
      return;
    }
    box.dataset.hjaMounted = '1';
    skeleton(box);
    loadJobs(box).then(function () {
      skeleton(box);
      loadData(box, true);
    });
  }

  window.HPJOBANALYSIS = { mount: mount, invalidate: function () { state.data = null; state.list = null; } };
})();
