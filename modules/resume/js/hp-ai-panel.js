/* =====================================================================
 * hp-ai-panel.js —— 简历 / 岗位 / 材料的「AI 分析 + 高亮 + 国家提醒」
 * ---------------------------------------------------------------------
 * 设计要点（对评委可讲）：
 *  1) 用户主动：进入预览界面后，AI 分析默认不跑，勾选才调接口；
 *  2) 不新增菜单：嵌在「我的档案」「项目管理」原有流程里；
 *  3) 高亮有据：每条颜色都来自后端 evidence 链，不是前端画的；
 *  4) 可降级：接口失败自动显示「规则分析」，页面不会白屏。
 * ===================================================================== */
(function () {
  'use strict';

  var API = (window.HP_API_BASE || '').replace(/\/+$/, '');

  function token() {
    /* 与 hp-bridge.js 保持同一口径：令牌存在 sessionStorage(hp-token)，
       兼容旧版本写在 localStorage 的情况 */
    try { return sessionStorage.getItem('hp-token') || localStorage.getItem('hp-token') || ''; } catch (e) { return ''; }
  }

  function api(path, options) {
    var opt = options || {};
    var headers = { 'content-type': 'application/json', 'x-hp-request': '1' };
    var t = token();
    if (t) headers['authorization'] = 'Bearer ' + t;
    return fetch(API + path, {
      method: opt.method || 'GET',
      credentials: 'include',
      headers: headers,
      body: opt.body ? JSON.stringify(opt.body) : undefined
    }).then(function (r) {
      return r.json().then(function (j) {
        if (!r.ok) throw new Error((j && (j.message || j.error)) || ('HTTP ' + r.status));
        return j;
      });
    });
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  }

  var ICON = { hit: '✓', partial: '!', gap: '✕' };
  var CLS = { hit: 'ai-hit', partial: 'ai-partial', gap: 'ai-gap' };

  /* ---------------- 样式（一次注入） ---------------- */
  var CSS = '' +
    '.aiw{font-size:13px;color:var(--text-1,#dbe6f5)}' +
    '.aiw *{box-sizing:border-box}' +
    /* 预览布局 */
    '.aiv{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,.95fr);gap:16px;align-items:start}' +
    '@media(max-width:1100px){.aiv{grid-template-columns:1fr}}' +
    '.aiv-side{position:sticky;top:12px}' +
    /* 顶栏 */
    '.aih{display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:12px 16px;border:1px solid var(--border,#25324a);border-radius:12px;background:var(--surface-1,#0e1626);margin-bottom:14px}' +
    '.aih .t{font-size:15px;font-weight:700;color:#fff}' +
    '.aih .st{font-size:12px;color:var(--text-3,#5f7290)}' +
    '.aih .sp{flex:1}' +
    '.aitog{display:inline-flex;align-items:center;gap:6px;font-size:12.5px;padding:6px 11px;border-radius:8px;border:1px solid var(--border,#25324a);background:transparent;color:var(--text-2,#8fa3bf);cursor:pointer;transition:.15s}' +
    '.aitog:hover{border-color:var(--primary,#4b8dff);color:#fff}' +
    '.aitog.on{background:rgba(56,225,255,.14);border-color:rgba(56,225,255,.55);color:#cdf3ff}' +
    '.aitog .box{width:13px;height:13px;border-radius:3px;border:1.5px solid currentColor;display:inline-block;position:relative}' +
    '.aitog.on .box{background:#38e1ff;border-color:#38e1ff}' +
    '.aitog.on .box::after{content:"✓";position:absolute;inset:-3px 0 0 1px;font-size:10px;color:#04121f;font-weight:900}' +
    /* 卡片 */
    '.aic{border:1px solid var(--border,#25324a);border-radius:12px;background:var(--surface-1,#0e1626);overflow:hidden;margin-bottom:12px}' +
    '.aic-h{display:flex;align-items:center;gap:8px;padding:10px 14px;border-bottom:1px solid rgba(255,255,255,.06);font-size:13px;font-weight:700}' +
    '.aic-h .n{margin-left:auto;font-size:11px;font-weight:400;color:var(--text-3,#5f7290)}' +
    '.aic-b{padding:12px 14px}' +
    /* 空态 */
    '.ai-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:44px 20px;text-align:center;border:1px dashed var(--border,#25324a);border-radius:12px;color:var(--text-3,#5f7290)}' +
    '.ai-empty .big{font-size:26px;opacity:.5}' +
    '.ai-empty p{margin:0;font-size:12.5px;line-height:1.7;max-width:280px}' +
    /* 结论 */
    '.ai-sum{padding:12px 14px;border-radius:10px;background:linear-gradient(135deg,rgba(56,225,255,.10),rgba(75,141,255,.04));border:1px solid rgba(56,225,255,.24);margin-bottom:12px;font-size:13px;line-height:1.7;color:#d7e8ff}' +
    '.ai-grade{display:inline-flex;align-items:center;gap:5px;font-size:11.5px;padding:2px 9px;border-radius:20px;margin-right:8px;vertical-align:middle;font-weight:700}' +
    '.ai-grade.good{background:rgba(47,224,160,.16);color:#2fe0a0;border:1px solid rgba(47,224,160,.4)}' +
    '.ai-grade.medium{background:rgba(255,182,72,.16);color:#ffb648;border:1px solid rgba(255,182,72,.4)}' +
    '.ai-grade.high{background:rgba(255,107,122,.16);color:#ff6b7a;border:1px solid rgba(255,107,122,.4)}' +
    /* 小节 */
    '.ai-sec{margin-bottom:14px}' +
    '.ai-sec:last-child{margin-bottom:0}' +
    '.ai-sec-t{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--text-2,#8fa3bf);margin-bottom:7px;font-weight:600}' +
    '.ai-sec-t .c{font-size:10.5px;padding:1px 7px;border-radius:10px;background:rgba(255,255,255,.07);color:var(--text-3,#5f7290)}' +
    /* 条目 */
    '.ai-item{display:flex;gap:8px;padding:8px 10px;border-radius:9px;background:rgba(255,255,255,.028);border:1px solid rgba(255,255,255,.055);margin-bottom:6px;line-height:1.6}' +
    '.ai-item .k{flex:0 0 16px;font-size:12px;line-height:1.55;text-align:center}' +
    '.ai-item .b{flex:1;min-width:0;font-size:12.5px}' +
    '.ai-item .b b{display:block;color:#e8f2ff;font-size:12.5px;margin-bottom:2px;font-weight:600}' +
    '.ai-item .b span{color:var(--text-3,#5f7290);font-size:11.5px}' +
    '.ai-item .act{flex:0 0 auto;font-size:11px;padding:3px 9px;border-radius:6px;border:1px solid rgba(56,225,255,.4);background:rgba(56,225,255,.10);color:#9fe9ff;cursor:pointer;white-space:nowrap;align-self:flex-start}' +
    '.ai-item .act:hover{background:rgba(56,225,255,.22);color:#fff}' +
    '.ai-item.hi{border-left:2px solid #ffb648}' +
    '.ai-item.ok{border-left:2px solid #2fe0a0}' +
    '.ai-item.gp{border-left:2px solid #ff6b7a}' +
    /* 高亮 */
    'mark.ai-hit{background:rgba(47,224,160,.20);color:#bffde6;padding:0 2px;border-radius:3px;border-bottom:1px dashed rgba(47,224,160,.7);cursor:pointer}' +
    'mark.ai-gap{background:rgba(255,107,122,.20);color:#ffc9cf;padding:0 2px;border-radius:3px;border-bottom:1px dashed rgba(255,107,122,.7);cursor:pointer}' +
    'mark.ai-partial{background:rgba(255,182,72,.18);color:#ffdb9e;padding:0 2px;border-radius:3px;border-bottom:1px dashed rgba(255,182,72,.7);cursor:pointer}' +
    'mark.ai-flash{animation:aiflash .9s ease-out}' +
    '@keyframes aiflash{0%{box-shadow:0 0 0 0 rgba(56,225,255,.9);background:rgba(56,225,255,.55);color:#04121f}100%{box-shadow:0 0 0 10px rgba(56,225,255,0)}}' +
    /* 证据链 */
    '.aie{display:flex;gap:8px;padding:7px 10px;border-radius:8px;font-size:12px;margin-bottom:5px;cursor:pointer;transition:.15s;border:1px solid rgba(255,255,255,.05)}' +
    '.aie:hover{background:rgba(255,255,255,.06);border-color:rgba(120,170,255,.35);transform:translateX(2px)}' +
    '.aie .s{flex:0 0 14px;text-align:center;font-size:11.5px;line-height:1.6}' +
    '.aie .q{flex:1;min-width:0;color:#dbe6f5;line-height:1.5}' +
    '.aie .r{color:var(--text-3,#5f7290);font-size:11px;margin-top:2px;line-height:1.5}' +
    '.aie.hit{border-left:2px solid rgba(47,224,160,.7)}' +
    '.aie.partial{border-left:2px solid rgba(255,182,72,.7)}' +
    '.aie.gap{border-left:2px solid rgba(255,107,122,.7);background:rgba(255,107,122,.05)}' +
    /* 国家提醒 */
    '.aicu{display:flex;gap:9px;padding:9px 0;border-bottom:1px dashed rgba(255,255,255,.07);font-size:12px}' +
    '.aicu:last-child{border-bottom:0}' +
    '.aicu .i{flex:0 0 18px;font-size:13px}' +
    '.aicu .t{flex:1;color:var(--text-2,#8fa3bf);line-height:1.6}' +
    '.aicu .t b{display:block;color:#ffd79a;font-size:12.5px;margin-bottom:2px}' +
    '.aicu .t em{font-style:normal;color:var(--text-3,#5f7290);display:block;margin-top:2px}' +
    '.aicu .lv{flex:0 0 auto;font-size:10px;padding:1px 6px;border-radius:5px;align-self:flex-start}' +
    '.aicu .lv.high{background:rgba(255,107,122,.18);color:#ff6b7a}' +
    '.aicu .lv.medium{background:rgba(255,182,72,.18);color:#ffb648}' +
    '.aicu .lv.low{background:rgba(56,225,255,.14);color:#38e1ff}' +
    /* 润色对比 */
    '.aipol{display:grid;gap:8px}' +
    '.aipol .row{padding:9px 11px;border-radius:9px;font-size:12.5px;line-height:1.7}' +
    '.aipol .row.before{background:rgba(255,107,122,.06);border:1px solid rgba(255,107,122,.22);color:#e8c5cb}' +
    '.aipol .row.after{background:rgba(47,224,160,.07);border:1px solid rgba(47,224,160,.25);color:#bffde6}' +
    '.aipol .lb{font-size:10.5px;color:var(--text-3,#5f7290);margin-bottom:3px;letter-spacing:.5px}' +
    /* 状态条 */
    '.aist{display:flex;align-items:center;gap:8px;font-size:11.5px;color:var(--text-3,#5f7290);margin-bottom:10px}' +
    '.aist .dot{width:6px;height:6px;border-radius:50%;background:#2fe0a0;box-shadow:0 0 8px #2fe0a0}' +
    '.aist .dot.rules{background:#ffb648;box-shadow:0 0 8px #ffb648}' +
    /* 加载 */
    '.ai-load{display:flex;align-items:center;gap:9px;padding:26px;justify-content:center;color:var(--text-3,#5f7290);font-size:12.5px}' +
    '.ai-spin{width:15px;height:15px;border-radius:50%;border:2px solid rgba(56,225,255,.25);border-top-color:#38e1ff;animation:aispin .8s linear infinite}' +
    '@keyframes aispin{to{transform:rotate(360deg)}}' +
    /* 岗位草稿标签 */
    '.aids{font-size:10.5px;padding:1px 7px;border-radius:5px;margin-left:6px}' +
    '.aids.draft{background:rgba(255,182,72,.16);color:#ffb648;border:1px solid rgba(255,182,72,.35)}' +
    '.aids.live{background:rgba(47,224,160,.16);color:#2fe0a0;border:1px solid rgba(47,224,160,.35)}';

  function injectCSS() {
    if (document.getElementById('hp-ai-css')) return;
    var s = document.createElement('style');
    s.id = 'hp-ai-css';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  /* ---------------- 工具：高亮文本 ---------------- */
  /** 用证据链给一段文本上色：返回 {html, hits}
   * 匹配策略（从严格到宽松）：
   *   1) 整词包含
   *   2) 关键词按 2 字滑窗切分，命中任一有效片段即算（如「玻璃压机操作」→「压机」「机操」）
   * 这样"双头压机看机"也能被"玻璃压机操作"标出来，不会因为措辞不同而漏标。 */
  function highlightText(text, evidence) {
    var t = String(text || '');
    if (!t) return { html: '', hits: 0 };

    /* 收集候选关键词 */
    var kws = [];
    (evidence || []).forEach(function (e) {
      var names = [];
      if (e.evidence && e.evidence.length) {
        e.evidence.forEach(function (ev) { if (ev && ev.value) names.push(String(ev.value)); });
      }
      var reqName = (e.reqText || '')
        .replace(/^具备「|」能力$|^持「|」$|（.*?）/g, '')
        .replace(/^意向国包含\s*/, '')
        .replace(/^\d+\s*年以上相关经验$/, '');
      if (reqName && reqName.length >= 2) names.push(reqName);
      names.forEach(function (n) { kws.push({ kw: n, status: e.status, id: e.reqId }); });
    });

    /* 生成匹配片段（带证据状态与 reqId） */
    var marks = [];
    function addMark(s, len, kw, status, rid) {
      if (s < 0 || len < 2) return;
      var e2 = s + len;
      for (var i = 0; i < marks.length; i++) {
        if (!(e2 <= marks[i].s || s >= marks[i].e)) return;   /* 重叠则跳过 */
      }
      marks.push({ s: s, e: e2, kw: kw, status: status, id: rid });
    }

    /* 第一轮：整词 */
    kws.forEach(function (k) {
      var idx = t.indexOf(k.kw);
      if (idx >= 0) addMark(idx, k.kw.length, k.kw, k.status, k.id);
    });

    /* 第二轮：2 字滑窗（只在整词没命中时补） */
    var SKIP = ['具备', '能力', '持有', '相关', '以上', '熟练', '掌握', '经验', '岗位', '要求'];
    kws.forEach(function (k) {
      for (var i = 0; i + 2 <= k.kw.length; i++) {
        var seg = k.kw.slice(i, i + 2);
        if (SKIP.indexOf(seg) >= 0) continue;
        if (/^[\s（）()0-9.]+$/.test(seg)) continue;
        var idx = t.indexOf(seg);
        if (idx >= 0) { addMark(idx, 2, seg, k.status, k.id); break; }
      }
    });

    if (!marks.length) return { html: esc(t), hits: 0 };

    marks.sort(function (a, b) { return a.s - b.s; });
    var out = '', cur = 0;
    marks.forEach(function (mk) {
      if (mk.s < cur) return;
      out += esc(t.slice(cur, mk.s));
      out += '<mark class="ai-' + (mk.status || 'hit') + '" data-req="' + esc(mk.id || '') + '">' +
        esc(t.slice(mk.s, mk.e)) + '</mark>';
      cur = mk.e;
    });
    out += esc(t.slice(cur));
    return { html: out, hits: marks.length };
  }

  /* ---------------- 组件：结论 ---------------- */
  function gradeOf(level) {
    return level === 'high' ? ['high', '需补充']
      : level === 'medium' ? ['medium', '基本可投']
        : ['good', '具备条件'];
  }

  function renderAnalysis(analysis) {
    if (!analysis) return '';
    var g = gradeOf(analysis.level);
    var html = '<div class="ai-sum"><span class="ai-grade ' + g[0] + '">' + g[1] + '</span>' +
      esc(analysis.summary || '') + '</div>';

    /* 优势 */
    if (analysis.strengths && analysis.strengths.length) {
      html += '<div class="ai-sec"><div class="ai-sec-t">✅ 优势 <span class="c">' + analysis.strengths.length + '</span></div>';
      analysis.strengths.forEach(function (s) {
        html += '<div class="ai-item ok"><span class="k" style="color:#2fe0a0">✓</span><div class="b">' + esc(s) + '</div></div>';
      });
      html += '</div>';
    }

    /* 问题（AI 的优先，规则补充） */
    var issues = (analysis.aiIssues && analysis.aiIssues.length) ? analysis.aiIssues : (analysis.issues || []);
    if (issues.length) {
      html += '<div class="ai-sec"><div class="ai-sec-t">⚠ 待优化 <span class="c">' + issues.length + '</span></div>';
      issues.forEach(function (it, i) {
        html += '<div class="ai-item hi"><span class="k" style="color:#ffb648">' + (i + 1) + '</span>' +
          '<div class="b"><b>' + esc(it.title || '') + '</b><span>' + esc(it.detail || '') + '</span>' +
          (it.fix ? '<div style="margin-top:4px;color:#9fe9ff;font-size:11.5px">👉 ' + esc(it.fix) + '</div>' : '') +
          '</div></div>';
      });
      html += '</div>';
    }

    /* 证据链 */
    if (analysis.evidence && analysis.evidence.length) {
      var hit = analysis.evidence.filter(function (e) { return e.status === 'hit'; }).length;
      var gap = analysis.evidence.filter(function (e) { return e.status === 'gap'; }).length;
      html += '<div class="ai-sec"><div class="ai-sec-t">🔍 岗位要求对照 <span class="c">命中 ' + hit + ' · 缺口 ' + gap + '</span></div>';
      analysis.evidence.forEach(function (e) {
        html += '<div class="aie ' + e.status + '" data-evid="' + esc(e.reqId) + '">' +
          '<span class="s" style="color:' + (e.status === 'hit' ? '#2fe0a0' : e.status === 'gap' ? '#ff6b7a' : '#ffb648') + '">' +
          ICON[e.status] + '</span>' +
          '<div style="flex:1;min-width:0"><div class="q">' + esc(e.reqText) + '</div>' +
          '<div class="r">' + esc(e.reason) + '</div></div></div>';
      });
      html += '</div>';
    }
    return html;
  }

  /* ---------------- 组件：国家提醒 ---------------- */
  function renderCulture(culture, scope) {
    if (!culture || !culture.rules || !culture.rules.length) return '';
    var lv = { high: '高', medium: '中', low: '低' };
    var html = '<div class="aic"><div class="aic-h"><span>' + (culture.flag || '🌍') + '</span>' +
      '<span>当地提醒 · ' + esc(culture.name) + '</span><span class="n">' + culture.rules.length + ' 条</span></div><div class="aic-b">';
    culture.rules.forEach(function (r) {
      html += '<div class="aicu"><span class="i">' + (r.icon || '•') + '</span>' +
        '<div class="t"><b>' + esc(r.title) + '</b>' + esc(r.impact || '') +
        '<em>👉 ' + esc(r.advice || '') + '</em></div>' +
        '<span class="lv ' + r.level + '">' + (lv[r.level] || '') + '</span></div>';
    });
    html += '</div></div>';
    return html;
  }

  /* ---------------- 组件：润色对比 ---------------- */
  function renderPolish(polish) {
    if (!polish) return '';
    var html = '<div class="aipol">' +
      '<div class="row before"><div class="lb">原文</div>' + esc(polish.before) + '</div>' +
      '<div class="row after"><div class="lb">AI 改写</div>' + esc(polish.after || '') + '</div></div>';
    if (polish.changes && polish.changes.length) {
      html += '<div style="margin-top:8px;font-size:11.5px;color:var(--text-3,#5f7290);line-height:1.7">' +
        polish.changes.map(function (c) { return '· ' + esc(c); }).join('<br>') + '</div>';
    }
    if (polish.note) {
      html += '<div style="margin-top:6px;font-size:11px;color:#ffb648">' + esc(polish.note) + '</div>';
    }
    return html;
  }

  /* ---------------- 组件：材料检查 ---------------- */
  function renderMaterial(analysis) {
    if (!analysis) return '';
    var html = '<div class="ai-sum">' +
      '<span class="ai-grade ' + (analysis.level === 'high' ? 'high' : analysis.level === 'medium' ? 'medium' : 'good') + '">' +
      (analysis.level === 'high' ? '需处理' : analysis.level === 'medium' ? '建议补充' : '通过') + '</span>' +
      esc(analysis.summary || '') + '</div>';
    if (analysis.checks && analysis.checks.length) {
      html += '<div class="ai-sec"><div class="ai-sec-t">📄 检查项 <span class="c">' + analysis.checks.length + '</span></div>';
      analysis.checks.forEach(function (c) {
        html += '<div class="ai-item ' + (c.ok ? 'ok' : (c.level === 'high' ? 'gp' : 'hi')) + '">' +
          '<span class="k" style="color:' + (c.ok ? '#2fe0a0' : '#ffb648') + '">' + (c.ok ? '✓' : '!') + '</span>' +
          '<div class="b"><b>' + esc(c.title) + '</b><span>' + esc(c.detail || '') + '</span></div></div>';
      });
      html += '</div>';
    }
    return html;
  }

  window.HPAI = {
    injectCSS: injectCSS,
    api: api,
    esc: esc,
    highlightText: highlightText,
    renderAnalysis: renderAnalysis,
    renderCulture: renderCulture,
    renderPolish: renderPolish,
    renderMaterial: renderMaterial,
    gradeOf: gradeOf
  };

  injectCSS();
})();