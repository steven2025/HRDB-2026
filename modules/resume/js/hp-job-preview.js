/* =====================================================================
 * hp-job-preview.js —— 岗位预览 + JD AI 分析（企业侧）
 * ---------------------------------------------------------------------
 * 入口：「项目管理」→ 新建/查看岗位 → 保存后进入预览
 * 布局：左=岗位原文（可高亮）  右=AI 分析（可选） 底=保存草稿 / 发布 / 返回
 * ===================================================================== */
(function () {
  'use strict';

  var AI = window.HPAI;
  function esc(s) { return AI ? AI.esc(s) : String(s == null ? '' : s); }
  function api(p, o) { return AI ? AI.api(p, o) : Promise.reject(new Error('AI 模块未加载')); }
  function toast(t, m) { if (window.HP && window.HP.toast) window.HP.toast(t, m); }

  var S = { job: null, analysis: null, culture: null, busy: false, onAnalyze: false, isNew: false };

  function row(k, v) {
    return '<div class="kv"><span class="k">' + esc(k) + '</span><span class="v">' +
      (v === undefined || v === null || v === '' ? '—' : esc(String(v))) + '</span></div>';
  }

  function statusBadge(job) {
    var st = job.status || '草稿';
    var isLive = /招聘中|新岗位|Recruiting/.test(st);
    return '<span class="aids ' + (isLive ? 'live' : 'draft') + '">' + (isLive ? '已发布' : '草稿·未发布') + '</span>';
  }

  /* ---------- 左侧：岗位原文 ---------- */
  function renderJob(j) {
    var L = [];
    var hl = function (text) {
      if (!text) return '';
      var res = AI.highlightText(String(text), []);
      return res.html || esc(text);
    };

    L.push('<div class="aic"><div class="aic-h"><span>📋</span><span>' + esc(j.title || '未命名岗位') + '</span>' +
      statusBadge(j) + '<span class="n">' + esc(j.employer || '') + '</span></div><div class="aic-b">' +
      '<div class="kv"><span class="k">工作地点</span><span class="v">' + esc((j.country || '') + ' ' + (j.city || '')) + '</span></div>' +
      row('薪资', j.salary) + row('招聘人数', j.headcount ? j.headcount + ' 人' + (j.hired ? '（已招 ' + j.hired + '）' : '') : '') +
      row('项目背景', j.projectBrief) + '</div></div>');

    if ((j.duties || []).length) {
      L.push('<div class="aic"><div class="aic-h"><span>🧩</span><span>岗位职责</span>' +
        '<span class="n">' + j.duties.length + ' 条</span></div><div class="aic-b">' +
        j.duties.map(function (d, i) {
          return '<div style="font-size:12.5px;line-height:1.8;color:#cfdcef;padding:3px 0">' +
            '<span style="color:var(--primary,#4b8dff);font-weight:700">' + (i + 1) + '.</span> ' + hl(d) + '</div>';
        }).join('') + '</div></div>');
    }

    var hard = j.requirementsHard || [];
    var pref = j.requirementsPreferred || [];
    if (hard.length || pref.length) {
      L.push('<div class="aic"><div class="aic-h"><span>🎯</span><span>任职要求</span>' +
        '<span class="n">硬性 ' + hard.length + ' · 优先 ' + pref.length + '</span></div><div class="aic-b">' +
        (hard.length ? '<div style="font-size:11.5px;color:#2fe0a0;margin:2px 0 5px;font-weight:600">硬性条件</div>' +
          hard.map(function (h) { return '<div style="font-size:12.5px;line-height:1.8;color:#cfdcef">✓ ' + hl(h) + '</div>'; }).join('') : '') +
        (pref.length ? '<div style="font-size:11.5px;color:#ffb648;margin:10px 0 5px;font-weight:600">优先条件</div>' +
          pref.map(function (p) { return '<div style="font-size:12.5px;line-height:1.8;color:#a9b8cf">· ' + hl(p) + '</div>'; }).join('') : '') +
        '</div></div>');
    }

    if (j.payStructure || j.workLife || j.contractTerms) {
      L.push('<div class="aic"><div class="aic-h"><span>💰</span><span>薪资 · 生活 · 合同</span></div><div class="aic-b">' +
        row('薪资构成', j.payStructure) + row('工作与生活', j.workLife) + row('合同与手续', j.contractTerms) +
        '</div></div>');
    }
    return L.join('');
  }

  /* ---------- 右侧：AI 分析 ---------- */
  function renderSide() {
    if (!S.onAnalyze) {
      return '<div class="ai-empty"><div class="big">✨</div>' +
        '<p>勾选上方的「AI 分析」，这里会出现这份 JD 的诊断、可完善项与当地用工提醒。</p>' +
        '<p style="font-size:11.5px;color:var(--text-3,#5f7290)">AI 只给建议，不会自动改动你填写的内容。</p></div>';
    }
    if (S.busy) return '<div class="aic"><div class="ai-load"><span class="ai-spin"></span>AI 正在分析岗位 JD…</div></div>';
    var html = '';
    if (S.analysis) {
      var a = S.analysis;
      html += '<div class="aist"><span class="dot ' + (a.mode === 'llm' ? '' : 'rules') + '"></span>' +
        (a.mode === 'llm' ? '大模型分析（' + esc(a.model || 'deepseek') + '）· ' + (a.latencyMs || 0) + 'ms' : '规则分析（兜底）') + '</div>';
      html += '<div class="aic"><div class="aic-h"><span>🤖</span><span>JD 分析</span>' +
        (a.canPublish === false ? '<span class="n" style="color:#ffb648">有必填项待完善</span>' : '<span class="n" style="color:#2fe0a0">可发布</span>') +
        '</div><div class="aic-b">' + AI.renderAnalysis(a) + '</div></div>';
      if (a.attractiveness) {
        html += '<div class="ai-sum" style="margin-top:10px">💡 ' + esc(a.attractiveness) + '</div>';
      }
    }
    if (S.culture) html += AI.renderCulture(S.culture);
    return html;
  }

  function paint(root) {
    var j = S.job || {};
    root.innerHTML =
      '<div class="aiw">' +
      '<div class="aih">' +
      '<span class="t">岗位预览</span><span class="st">' + esc(j.title || '') + '</span>' +
      statusBadge(j) +
      '<span class="sp"></span>' +
      '<button class="aitog ' + (S.onAnalyze ? 'on' : '') + '" data-tog="analyze"><span class="box"></span>AI 分析</button>' +
      '<button class="btn btn-o btn-sm" data-act="draft">保存草稿</button>' +
      '<button class="btn btn-p btn-sm" data-act="publish">发布</button>' +
      '<button class="btn btn-o btn-sm" data-act="back">返回</button>' +
      '</div>' +
      '<div class="aiv"><div>' + renderJob(j) + '</div>' +
      '<div class="aiv-side"><div id="aiSide">' + renderSide() + '</div></div></div></div>';
    bind(root);
  }

  function bind(root) {
    root.querySelectorAll('[data-tog]').forEach(function (b) {
      b.onclick = function () {
        S.onAnalyze = !S.onAnalyze;
        if (S.onAnalyze) runAnalyze(root); else paint(root);
      };
    });
    var d = root.querySelector('[data-act=draft]'); if (d) d.onclick = function () { save(root, 'draft'); };
    var p = root.querySelector('[data-act=publish]'); if (p) p.onclick = function () { save(root, 'publish'); };
    var b = root.querySelector('[data-act=back]'); if (b) b.onclick = function () { if (S.onBack) S.onBack(); };
  }

  function runAnalyze(root) {
    var j = S.job || {};
    S.busy = true;
    paint(root);
    var isSaved = j.id && !S.isNew;
    var p = isSaved
      ? api('/api/company/jobs/' + encodeURIComponent(j.id) + '/analyze', { method: 'POST', body: {} })
      : api('/api/company/jobs/_new/analyze', { method: 'POST', body: { job: j } });
    p.then(function (res) {
      S.analysis = res.analysis;
      S.culture = res.analysis.culture || null;
      S.busy = false;
      paint(root);
    }).catch(function (err) {
      S.busy = false;
      S.analysis = { mode: 'rules', level: 'medium', summary: '分析失败：' + err.message, strengths: [], issues: [] };
      paint(root);
    });
  }

  function save(root, mode) {
    var j = S.job || {};
    var body = {
      title: j.title, country: j.country, city: j.city, employer: j.employer,
      salary: j.salary, headcount: j.headcount, status: mode === 'publish' ? '招聘中' : '草稿',
      duties: j.duties, requirementsHard: j.requirementsHard, requirementsPreferred: j.requirementsPreferred,
      projectBrief: j.projectBrief, payStructure: j.payStructure, workLife: j.workLife,
      contractTerms: j.contractTerms, cultureNote: j.cultureNote
    };
    var isSaved = j.id && !S.isNew;
    var p = isSaved
      ? api('/api/company/jobs/' + encodeURIComponent(j.id) + '/update', { method: 'POST', body: body })
      : api('/api/company/jobs', { method: 'POST', body: body });
    p.then(function (res) {
      S.isNew = false;
      if (res.job) S.job = Object.assign({}, S.job, res.job);
      S.job.status = mode === 'publish' ? '招聘中' : '草稿';
      paint(root);
      toast(mode === 'publish' ? '已发布' : '已保存草稿', mode === 'publish' ? '岗位将出现在应聘者的岗位发现中' : '可在项目管理中编辑、删除或发布');
      if (S.onSaved) S.onSaved(mode);
    }).catch(function (err) { toast('保存失败', err.message); });
  }

  window.HPJobPreview = {
    open: function (host, opts) {
      var o = opts || {};
      S.job = o.job || {};
      S.isNew = !!o.isNew;
      S.analysis = null; S.culture = null; S.busy = false; S.onAnalyze = false;
      S.onBack = o.onBack || null;
      S.onSaved = o.onSaved || null;
      paint(host);
    },
    get state() { return S; }
  };
})();