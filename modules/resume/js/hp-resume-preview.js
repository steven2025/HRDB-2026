/* =====================================================================
 * hp-resume-preview.js —— 简历预览 + AI 分析（应聘者侧）
 * ---------------------------------------------------------------------
 * 入口：「我的档案」→ 查看已保存简历
 * 布局：左=简历原文（可高亮）  右=AI 分析（可选） 底=重新保存 / 返回
 * ===================================================================== */
(function () {
  'use strict';

  var AI = window.HPAI;
  function esc(s) { return AI ? AI.esc(s) : String(s == null ? '' : s); }
  function api(p, o) { return AI ? AI.api(p, o) : Promise.reject(new Error('AI 模块未加载')); }

  var S = { resume: null, job: null, analysis: null, culture: null, busy: false, onAnalyze: false, onPolish: false };

  function row(k, v) {
    return '<div class="kv"><span class="k">' + esc(k) + '</span><span class="v">' +
      (v === undefined || v === null || v === '' ? '—' : esc(String(v))) + '</span></div>';
  }

  /* ---------- 左侧：简历原文 ---------- */
  function renderResume(r, evidence) {
    var L = [];
    var hl = function (text, fallback) {
      if (!text) return esc(fallback || '—');
      var res = AI.highlightText(String(text), evidence);
      return res.html || esc(text);
    };

    /* 头部 */
    L.push('<div class="aic"><div class="aic-h"><span>👤</span><span>' + esc(r.name) + ' · 简历预览</span>' +
      '<span class="n">' + esc(r.title) + ' · ' + (r.years || 0) + ' 年</span></div>' +
      '<div class="aic-b"><div class="kv"><span class="k">基本信息</span><span class="v">' +
      esc((r.gender || '') + ' · ' + (r.age || '') + ' 岁 · ' + (r.education || '') + ' · ' + (r.city || '')) +
      '</span></div>' + row('电话', r.phone) + row('期望薪资', r.salaryExpect ? r.salaryExpect + ' 元/月' : '') +
      row('可接受最低', r.salaryMinAccept ? r.salaryMinAccept + ' 元/月' : '') +
      row('到岗时间', r.availabilityDays ? r.availabilityDays + ' 天内' : '') +
      row('班次接受', r.shift) + row('合同偏好', r.contractPrefer) + '</div></div>');

    /* 求职意向 */
    var it = r.intent || {};
    L.push('<div class="aic"><div class="aic-h"><span>🎯</span><span>求职意向</span></div><div class="aic-b">' +
      row('目标岗位', it.targetRole || r.expectedRole) +
      row('意向国家', (r.preferredCountries || []).join('、')) +
      row('期望薪资', it.expectedSalary ? it.expectedSalary + ' 元/月' : '') +
      row('到岗时间', it.earliestStart) + row('班次', it.acceptShift) + '</div></div>');

    /* 技能（高亮：命中标绿，缺口标红） */
    if ((r.skills || []).length) {
      /* 建立"技能名 → 证据状态"映射，让技能标签本身也带颜色 */
      var stMap = {};
      (evidence || []).forEach(function (e) {
        var nm = (e.reqText || '').replace(/^具备「|」能力$/g, '');
        if (nm) stMap[nm] = { status: e.status, id: e.reqId };
      });
      L.push('<div class="aic"><div class="aic-h"><span>🛠</span><span>技能特长</span>' +
        '<span class="n">' + r.skills.length + ' 项</span></div><div class="aic-b"><div style="display:flex;flex-wrap:wrap;gap:6px">' +
        r.skills.map(function (s) {
          var st = stMap[s];
          var cls = st ? (st.status === 'hit' ? 'ai-hit' : st.status === 'gap' ? 'ai-gap' : 'ai-partial') : '';
          var attr = st ? ' data-req="' + esc(st.id) + '"' : '';
          return '<span class="' + cls + '"' + attr + ' style="font-size:12px;padding:3px 10px;border-radius:20px;background:rgba(255,255,255,.055);border:1px solid rgba(255,255,255,.08)">' + esc(s) + '</span>';
        }).join('') +
        '</div></div></div>');
    }

    /* 工作经历（高亮） */
    if ((r.workHistory || []).length) {
      L.push('<div class="aic"><div class="aic-h"><span>💼</span><span>工作经历</span>' +
        '<span class="n">' + r.workHistory.length + ' 段</span></div><div class="aic-b">' +
        r.workHistory.map(function (w) {
          return '<div style="padding:10px 0;border-bottom:1px dashed rgba(255,255,255,.07)">' +
            '<div style="display:flex;justify-content:space-between;gap:8px"><b style="font-size:13px">' + esc(w.title) + '</b>' +
            '<span style="font-size:11.5px;color:var(--text-3,#5f7290)">' + esc(w.period) + '</span></div>' +
            '<div style="font-size:12px;color:var(--text-2,#8fa3bf);margin:3px 0 6px">' + esc(w.company) + '</div>' +
            '<div style="font-size:12.5px;line-height:1.75;color:#cfdcef">' + hl(w.desc) + '</div></div>';
        }).join('') + '</div></div>');
    }

    /* 业绩 */
    if ((r.achievements || []).length) {
      L.push('<div class="aic"><div class="aic-h"><span>📈</span><span>业绩亮点</span>' +
        '<span class="n">' + r.achievements.length + ' 条</span></div><div class="aic-b">' +
        r.achievements.map(function (a) {
          return '<div style="font-size:12.5px;line-height:1.8;color:#bffde6">✓ ' + esc(a) + '</div>';
        }).join('') + '</div></div>');
    }

    /* 证书与语言 */
    L.push('<div class="aic"><div class="aic-h"><span>📜</span><span>证书与语言</span></div><div class="aic-b">' +
      (r.certDetails && r.certDetails.length
        ? r.certDetails.map(function (c) { return row(c.name, (c.level || '') + ' · 有效至 ' + (c.validUntil || '—')); }).join('')
        : (r.certs || []).map(function (c) { return row(c, '已持证'); }).join('') || row('证书', '未填写')) +
      row('语言', Object.keys(r.languages || {}).map(function (k) { return k + '：' + r.languages[k]; }).join('；')) +
      '</div></div>');

    /* 证件与健康 */
    var pp = r.passport || {};
    L.push('<div class="aic"><div class="aic-h"><span>🛂</span><span>证件与健康</span></div><div class="aic-b">' +
      row('护照', pp.valid ? '有效 · ' + (pp.expiry || '') + (pp.no ? '（' + pp.no + '）' : '') : '待办/无效') +
      row('健康证', r.healthCert ? '已备' : '缺失') +
      row('体检', r.healthExam ? (r.healthExam.date || '') + ' · ' + (r.healthExam.hospital || '') : '') +
      row('无犯罪记录', r.noCriminalRecord ? r.noCriminalRecord.date + (r.noCriminalRecord.notarized ? '（已公证）' : '（未公证）') : '未提供') +
      '</div></div>');

    /* 海外与家庭 */
    var oh = r.overseasHistory || [];
    L.push('<div class="aic"><div class="aic-h"><span>✈️</span><span>外派适配</span></div><div class="aic-b">' +
      row('海外经历', oh.length ? oh.map(function (x) { return x.country + ' ' + x.period; }).join('；') : '无') +
      row('家庭支持', r.familySupport) + row('自我介绍', '') +
      '<div style="font-size:12.5px;line-height:1.75;color:#cfdcef;margin-top:4px">' + hl(r.selfIntro) + '</div>' +
      '</div></div>');

    return L.join('');
  }

  /* ---------- 右侧：AI 分析 ---------- */
  function renderSide() {
    if (!S.onAnalyze && !S.onPolish) {
      return '<div class="ai-empty"><div class="big">✨</div>' +
        '<p>勾选上方的「AI 分析」或「AI 润色」，这里会出现针对这份简历的诊断、建议与当地提醒。</p>' +
        '<p style="font-size:11.5px;color:var(--text-3,#5f7290)">不勾选也可以直接查看或保存，不会产生任何分析费用。</p></div>';
    }
    if (S.busy) {
      return '<div class="aic"><div class="ai-load"><span class="ai-spin"></span>AI 正在分析简历…</div></div>';
    }
    var html = '';
    if (S.analysis) {
      var a = S.analysis;
      html += '<div class="aist"><span class="dot ' + (a.mode === 'llm' ? '' : 'rules') + '"></span>' +
        (a.mode === 'llm' ? '大模型分析（' + esc(a.model || 'deepseek') + '）· ' + (a.latencyMs || 0) + 'ms' : '规则分析（大模型不可用时兜底）') +
        '</div>';
      html += '<div class="aic"><div class="aic-h"><span>🤖</span><span>简历分析</span></div><div class="aic-b">' +
        AI.renderAnalysis(a) + '</div></div>';
    }
    if (S.culture) html += AI.renderCulture(S.culture);
    if (S.polish) {
      html += '<div class="aic"><div class="aic-h"><span>✍️</span><span>AI 润色</span></div><div class="aic-b">' +
        AI.renderPolish(S.polish) + '</div></div>';
    }
    return html || '<div class="aic"><div class="aic-b" style="color:var(--text-3,#5f7290);font-size:12.5px">暂无结果</div></div>';
  }

  /* ---------- 渲染整个界面 ---------- */
  function paint(root) {
    var r = S.resume || {};
    var evidence = (S.analysis && S.analysis.evidence) ? S.analysis.evidence : [];
    root.innerHTML =
      '<div class="aiw">' +
      '<div class="aih">' +
      '<span class="t">简历预览</span>' +
      '<span class="st">' + esc(r.name || '') + ' · ' + esc(r.title || '') + '</span>' +
      '<span class="sp"></span>' +
      '<button class="aitog ' + (S.onAnalyze ? 'on' : '') + '" data-tog="analyze"><span class="box"></span>AI 分析</button>' +
      '<button class="aitog ' + (S.onPolish ? 'on' : '') + '" data-tog="polish"><span class="box"></span>AI 润色</button>' +
      '<button class="btn btn-o btn-sm" data-act="save">重新保存</button>' +
      '<button class="btn btn-o btn-sm" data-act="back">返回</button>' +
      '</div>' +
      '<div class="aiv">' +
      '<div>' + renderResume(r, evidence) + '</div>' +
      '<div class="aiv-side"><div id="aiSide">' + renderSide() + '</div></div>' +
      '</div></div>';

    bind(root);
  }

  function bind(root) {
    root.querySelectorAll('[data-tog]').forEach(function (b) {
      b.onclick = function () {
        var k = b.dataset.tog;
        if (k === 'analyze') { S.onAnalyze = !S.onAnalyze; if (S.onAnalyze) runAnalyze(root); }
        if (k === 'polish') {
          S.onPolish = !S.onPolish;
          if (S.onPolish) runPolish(root);
        }
        paint(root);
      };
    });
    var saveBtn = root.querySelector('[data-act=save]');
    if (saveBtn) saveBtn.onclick = function () { save(root); };
    var backBtn = root.querySelector('[data-act=back]');
    if (backBtn) backBtn.onclick = function () { if (S.onBack) S.onBack(); };

    /* 证据项点击 → 左侧对应高亮闪烁 */
    root.querySelectorAll('.aie').forEach(function (el) {
      el.onclick = function () {
        var id = el.dataset.evid;
        var mk = root.querySelector('mark[data-req="' + id + '"]');
        if (mk) {
          mk.classList.remove('ai-flash'); void mk.offsetWidth; mk.classList.add('ai-flash');
          mk.scrollIntoView({ block: 'center', behavior: 'smooth' });
        } else {
          var box = root.querySelector('#aiSide');
          if (box && window.HP && window.HP.toast) window.HP.toast('定位', '简历中没有对应原文，说明这是一处缺口');
        }
      };
    });
    /* 高亮点击 → 右侧对应证据 */
    root.querySelectorAll('mark[data-req]').forEach(function (mk) {
      mk.onclick = function () {
        var e = root.querySelector('.aie[data-evid="' + mk.dataset.req + '"]');
        if (e) { e.scrollIntoView({ block: 'center', behavior: 'smooth' }); e.style.background = 'rgba(56,225,255,.12)'; setTimeout(function () { e.style.background = ''; }, 1200); }
      };
    });
  }

  /* ---------- 动作 ---------- */
  function runAnalyze(root) {
    if (!S.resume) return;
    S.busy = true;
    var side = root.querySelector('#aiSide');
    if (side) side.innerHTML = '<div class="aic"><div class="ai-load"><span class="ai-spin"></span>AI 正在分析简历…</div></div>';
    var payload = { candidateId: S.resume.id };
    if (S.job && S.job.id) payload.jobId = S.job.id;
    api('/api/persona/resume/analyze', { method: 'POST', body: payload })
      .then(function (res) {
        S.analysis = res.analysis;
        S.culture = res.analysis.culture || null;
        S.busy = false;
        paint(root);
      })
      .catch(function (err) {
        S.busy = false;
        S.analysis = { mode: 'rules', level: 'medium', summary: '分析失败：' + err.message + '（请检查后端服务）', strengths: [], issues: [], evidence: [] };
        paint(root);
      });
  }

  function runPolish(root) {
    if (!S.resume) return;
    var w = (S.resume.workHistory || [])[0];
    if (!w || !w.desc) {
      S.polish = { before: '（没有可润色的工作经历）', after: '', note: '请先填写工作经历描述' };
      paint(root);
      return;
    }
    S.busy = true;
    paint(root);
    api('/api/persona/resume/polish', {
      method: 'POST',
      body: { text: w.desc, title: S.resume.title, country: (S.resume.preferredCountries || [])[0] || '' }
    }).then(function (res) {
      S.polish = res.polish;
      S.busy = false;
      paint(root);
    }).catch(function (err) {
      S.busy = false;
      S.polish = { before: w.desc, after: '', note: '润色失败：' + err.message };
      paint(root);
    });
  }

  function save(root) {
    var r = S.resume || {};
    api('/api/persona/profile', {
      method: 'PATCH',
      body: {
        skills: (r.skills || []).join('、'),
        certs: (r.certs || []).join('、'),
        languages: Object.keys(r.languages || {}).map(function (k) { return k + ':' + r.languages[k]; }).join('、'),
        salaryExpect: r.salaryExpect,
        availabilityDays: r.availabilityDays,
        years: r.years
      }
    }).then(function (res) {
      var d = res.delta;
      if (window.HP && window.HP.toast) {
        window.HP.toast('已保存', d != null ? ('匹配分 ' + res.before.score + ' → ' + res.after.score + (d >= 0 ? '（+' + d + '）' : '（' + d + '）')) : '简历已更新');
      }
      if (window.HP && window.HP.toast && S.onSaved) S.onSaved();
    }).catch(function (err) {
      if (window.HP && window.HP.toast) window.HP.toast('保存失败', err.message);
    });
  }

  /* ---------- 对外入口 ---------- */
  window.HPResumePreview = {
    /** 打开预览
     * @param host 容器元素
     * @param opts { resume, job, onBack, onSaved }
     */
    open: function (host, opts) {
      var o = opts || {};
      S.resume = o.resume || null;
      S.job = o.job || null;
      S.analysis = null; S.culture = null; S.polish = null;
      S.onAnalyze = false; S.onPolish = false; S.busy = false;
      S.onBack = o.onBack || null;
      S.onSaved = o.onSaved || null;
      if (!S.resume) {
        host.innerHTML = '<div class="aiw"><div class="ai-empty"><div class="big">📄</div><p>还没有保存过简历，请先在「我的档案」填写并保存。</p></div></div>';
        return;
      }
      paint(host);
    },
    get state() { return S; }
  };
})();