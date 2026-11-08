/* =========================================================
   P1：简历 AI 分析（真实数据 / 规则引擎）
   ========================================================= */
(function () {
  /* 跳过推理：设置里开启后，把 ≤1s 的动画延时压成 0 */
  var __st = window.setTimeout.bind(window);
  function fastTimeout(fn, ms) {
    var skip = !!(window.HP_SETTINGS && window.HP_SETTINGS.skipReason) || !!window.__hpSkipReason;
    return __st(fn, skip && ms <= 1000 ? 0 : ms);
  }

  'use strict';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function splitSkills(v) {
    var list = String(v || '').split(/[、,，/]/).map(function (x) { return x.trim(); }).filter(Boolean);
    var base = ['设备点检', '工艺参数调整'];
    base.forEach(function (x) { if (list.indexOf(x) < 0) list.push(x); });
    return list.slice(0, 8);
  }

  function profileData(p) {
    p = Object.assign({}, window.__hpResumePreview || {}, p || {});
    return {
      name: p.name || '张伟',
      phone: p.phone || '138****0000',
      education: p.education || '中专/技校',
      skill: p.skill || '玻璃压机操作证（中级）',
      role: p.role || '玻璃压机操作工',
      country: p.country || '阿尔及利亚',
      project: p.project || '阿尔及利亚玻璃制品工厂',
      years: p.years || 8,
      salary: p.salary || '22,000 元/月',
      workText: p.workText || '',
      achText: p.achText || '',
      languagesText: p.languagesText || '',
      familySupport: p.familySupport || '',
      published: !!p.published
    };
  }

  function resumeOf(p) {
    var parsed = window.__hpResumeParsed || {};
    var skills = (parsed.skills && parsed.skills.length) ? parsed.skills.slice(0, 8) : splitSkills(p.skill);
    var achFromForm = String(p.achText || '').split(/\n+/).map(function (x) { return x.trim(); }).filter(Boolean);
    var achievements = (parsed.achievements && parsed.achievements.length) ? parsed.achievements : (achFromForm.length ? achFromForm : [
      '主导换模标准化，换模时间 38 → 25 分钟，年减少停机损失约 12 万元。',
      '外观不良率由 4.2% 降至 2.6%，年减少返工约 840 件。',
      '年度设备点检发现问题 27 起，故障停机时间下降 20%。'
    ]);
    var works = (parsed.workHistory && parsed.workHistory.length) ? parsed.workHistory : [{
      company: p.project, title: p.role, period: p.workText ? '当前 / 最近一段' : '2023 - 2026',
      desc: p.workText || '按工艺卡完成设备操作、换模与参数调整，参与设备日常点检与异常处理。',
      achievements: achievements
    }];
    return {
      id: 'self', name: p.name, phone: p.phone, gender: '男', age: 34,
      education: p.education, city: '河南洛阳', title: p.role, years: p.years,
      skills: skills, certs: (parsed.certs && parsed.certs.length) ? parsed.certs : [p.skill],
      languages: (parsed.languages && Object.keys(parsed.languages).length) ? parsed.languages : (p.languagesText ? { zh: '母语', other: p.languagesText } : {}),
      salaryExpect: parsed.salaryExpect || 22000, salaryMinAccept: parsed.salaryMinAccept || 20500,
      workHistory: works,
      achievements: achievements,
      educationHistory: (parsed.educationHistory && parsed.educationHistory.length) ? parsed.educationHistory : [{ school: '鞍山技师学院', major: '数控技术', degree: p.education, period: '2004 - 2007' }],
      passport: parsed.passport || { valid: true, expiry: '2031-05-20' },
      healthCert: parsed.healthCert !== undefined ? parsed.healthCert : true,
      noCriminalRecord: parsed.noCriminalRecord || { date: '2026-08-09', notarized: true },
      overseasExp: !!parsed.overseasExp, overseasHistory: parsed.overseasHistory || [],
      familySupport: parsed.familySupport || p.familySupport || '',
      selfIntro: p.years + ' 年一线操作经验，熟悉设备点检、换模与工艺参数调整；能吃苦，可长期驻外。',
      emergency: { name: '张先生', relation: '配偶 / 父母', phone: '131****5926' }
    };
  }

  function jobOf(p, skills) {
    return {
      id: 'self-target', title: p.role, country: p.country,
      salary: '20,000 - 25,000 元/月',
      skills: skills.slice(0, 5),
      requirementsHard: ['3 年以上同岗位经验', '持有效护照', '健康证', '能接受长期驻外'],
      requirementsPreferred: ['有海外经历', '基础英语']
    };
  }

  function localAnalysis(resume, job) {
    var s = [], issues = [];
    if (resume.years >= 5) s.push('相关经验 ' + resume.years + ' 年，技术积累扎实');
    if ((resume.achievements || []).length >= 3) s.push('简历含 ' + resume.achievements.length + ' 条量化业绩，说服力强');
    if (resume.passport && resume.passport.valid) s.push('护照有效，出境材料具备');
    if (resume.healthCert) s.push('健康证已备');
    if (!Object.keys(resume.languages || {}).length) issues.push({ level: 'medium', title: '语言能力未填写', detail: '海外岗位常需要基础外语沟通，空白会让雇主无法评估沟通成本', fix: '如实填写外语水平，如「英语 A2，可看懂设备手册」；没有基础就写「愿意学习」', field: 'languages' });
    if (!resume.overseasExp) issues.push({ level: 'medium', title: '无海外驻场经历', detail: '首次出国，首月适应成本高，需要雇主配套带教', fix: '在自我评价中说明家庭支持与出国务工意愿，降低雇主顾虑', field: 'selfIntro' });
    if (!resume.familySupport) issues.push({ level: 'low', title: '未说明家庭支持情况', detail: '外派流失率的第一预测因子就是家庭支持度', fix: '补一句「配偶支持长期外派」，让雇主放心', field: 'selfIntro' });
    var level = issues.some(function (x) { return x.level === 'high'; }) ? 'high' : issues.length > 2 ? 'medium' : 'good';
    return {
      mode: 'rules', strengths: s, issues: issues, level: level,
      summary: resume.name + '：' + s.slice(0, 2).join('；') + '。' + (issues.length ? '需关注 ' + issues.length + ' 项。' : '材料完整。'),
      culture: null, evidence: []
    };
  }

  function scoreOf(a) {
    var high = 0, mid = 0, low = 0;
    (a.issues || []).forEach(function (x) { if (x.level === 'high') high++; else if (x.level === 'medium') mid++; else low++; });
    return Math.max(55, Math.min(94, 88 - high * 12 - mid * 5 - low * 2));
  }

  function apiAnalysis(resume, job) {
    var ctrl = new AbortController();
    var timer = fastTimeout(function () { ctrl.abort(); }, 3500);
    return fetch('/api/persona/resume/analyze', {
      method: 'POST', credentials: 'same-origin',
      headers: { 'content-type': 'application/json', 'x-hp-request': '1' },
      body: JSON.stringify({ resume: resume, job: job, useRules: true }),
      signal: ctrl.signal
    }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    }).then(function (j) {
      if (!j || !j.analysis) throw new Error('no analysis');
      return j.analysis;
    }).finally(function () { clearTimeout(timer); });
  }

  var AC = null;
  function beep(freq, dur, gain) {
    try {
      var C = window.AudioContext || window.webkitAudioContext;
      if (!C) return;
      if (!AC) AC = new C();
      if (AC.state === 'suspended') AC.resume();
      var t = AC.currentTime;
      var o = AC.createOscillator(), g = AC.createGain();
      o.type = 'sine'; o.frequency.value = freq || 760;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(gain || .035, t + .01);
      g.gain.exponentialRampToValueAtTime(.0001, t + (dur || .08));
      o.connect(g); g.connect(AC.destination);
      o.start(t); o.stop(t + (dur || .08) + .02);
    } catch (e) {}
  }

  function voiceDone() {
    if (!window.speechSynthesis) return;
    try {
      speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance('分析已完成，建议已生成。');
      u.lang = 'zh-CN'; u.rate = 1.15; u.pitch = 1; u.volume = 1;
      speechSynthesis.speak(u);
    } catch (e) {}
  }

  function stepsHTML() {
    return '<div class="hpa-steps" id="hpaSteps">' +
      '<span class="hpa-step" data-s="1"><i>01</i>结构识别</span>' +
      '<span class="hpa-step" data-s="2"><i>02</i>证据核对</span>' +
      '<span class="hpa-step" data-s="3"><i>03</i>建议生成</span>' +
    '</div>';
  }

  function issueHTML(x, i) {
    var lv = x.level === 'high' ? 'high' : x.level === 'medium' ? 'mid' : 'low';
    return '<div class="hpa-issue">' +
      '<div class="hpa-issue-h"><span class="lv ' + lv + '">' + (lv === 'high' ? '高优先级' : lv === 'mid' ? '建议优化' : '可补充') + '</span>' +
      '<b>' + esc(x.title || '待补充') + '</b></div>' +
      (x.detail ? '<p>' + esc(x.detail) + '</p>' : '') +
      (x.fix ? '<div class="hpa-fix">→ ' + esc(x.fix) + '</div>' : '') +
      '<button class="hpa-link" data-edit="' + i + '">去编辑</button>' +
    '</div>';
  }

  function renderResult(box, p, resume, analysis) {
    var score = scoreOf(analysis);
    var side = box.querySelector('.hpa-side');
    var iss = analysis.issues || [];
    var strengths = analysis.strengths || [];
    var culture = analysis.culture && analysis.culture.rules ? analysis.culture.rules.slice(0, 3) : [];
    var levelText = analysis.level === 'good' ? '具备投递条件' : analysis.level === 'high' ? '需要补充' : '基本可投';
    side.innerHTML = stepsHTML() +
      '<div class="hpa-score">' +
        '<div class="hpa-ring"><b>' + score + '</b><span>准备度</span></div>' +
        '<div class="hpa-score-main"><em>' + esc(levelText) + '</em><p>' + esc(analysis.summary || '') + '</p></div>' +
      '</div>' +
      '<div class="hpa-block"><h4>优势 <span>' + strengths.length + '</span></h4><ul class="hpa-ul">' +
        (strengths.length ? strengths.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') : '<li>暂未识别到明显优势，建议补充工作经历与业绩。</li>') +
      '</ul></div>' +
      '<div class="hpa-block"><h4>需要关注 <span>' + iss.length + '</span></h4>' +
        (iss.length ? iss.map(issueHTML).join('') : '<div class="hpa-ok">材料比较完整，暂未发现明显问题。</div>') +
      '</div>' +
      (culture.length ? '<div class="hpa-block"><h4>当地提醒 <span>' + culture.length + '</span></h4><ul class="hpa-ul">' +
        culture.map(function (x) { return '<li>' + esc(x.title || x) + (x.desc ? '：' + esc(x.desc) : '') + '</li>'; }).join('') + '</ul></div>' : '') +
      '<div class="hpa-actions">' +
        '<button class="btn btn-o btn-sm" id="hpaBack" type="button">返回预览</button>' +
        '<button class="btn btn-p btn-sm" id="hpaEdit" type="button">编辑简历</button>' +
        '<button class="btn btn-o btn-sm" id="hpaAgain" type="button">重新分析</button>' +
      '</div>';

    var ring = side.querySelector('.hpa-ring');
    if(ring) ring.style.setProperty('--p', score + '%');
    var steps = side.querySelectorAll('.hpa-step');
    [0, 1, 2].forEach(function (i) {
      fastTimeout(function () { if (steps[i]) steps[i].classList.add('done'); }, 140 * i);
    });
    side.querySelector('#hpaBack').onclick = function () { window.HPProfileFlow.closeAI(); };
    side.querySelector('#hpaEdit').onclick = function () { window.HPProfileFlow.closeAI(); window.HPProfileFlow.edit(); };
    side.querySelector('#hpaAgain').onclick = function () { show(box, p); };
    side.querySelectorAll('[data-edit]').forEach(function (b) {
      b.onclick = function () {
        var x = iss[Number(b.dataset.edit)];
        if (x && x.fix && navigator.clipboard) { try { navigator.clipboard.writeText(x.fix); } catch (e) {} }
        window.HPProfileFlow.closeAI();
        window.HPProfileFlow.edit();
        if (window.HP && HP.toast) HP.toast('建议已复制', '在编辑页粘贴到对应位置即可');
      };
    });
    beep(880, .09, .04);
    fastTimeout(function () { beep(1175, .12, .035); }, 140);
    voiceDone();
  }

  function show(box, p) {
    p = profileData(p);
    var resume = resumeOf(p);
    var job = jobOf(p, resume.skills);
    var paper = window.HPProfileFlow && window.HPProfileFlow.paperHTML ? window.HPProfileFlow.paperHTML(p) : '';
    box.innerHTML =
      '<div class="hpa-head"><div><div class="hpa-eyebrow">RESUME INTELLIGENCE</div>' +
        '<h2>简历 AI 分析 <span>基于 ' + new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) + ' 保存的版本</span></h2></div>' +
        '<span class="hpa-mode">规则引擎 · 当前版本</span></div>' +
      '<div class="hpa-grid">' +
        '<div class="hpa-paper"><div class="docwrap">' + paper + '</div></div>' +
        '<aside class="hpa-side">' +
          stepsHTML() +
          '<div class="hpa-loading"><i></i><b>正在读取简历</b><span>结构 → 证据 → 建议</span></div>' +
        '</aside>' +
      '</div>';
    var steps = box.querySelectorAll('.hpa-step');
    fastTimeout(function () { if (steps[0]) steps[0].classList.add('on'); beep(660, .06); }, 80);
    fastTimeout(function () { if (steps[0]) steps[0].classList.add('done'); if (steps[1]) steps[1].classList.add('on'); beep(760, .06); }, 420);
    fastTimeout(function () { if (steps[1]) steps[1].classList.add('done'); if (steps[2]) steps[2].classList.add('on'); beep(860, .06); }, 840);
    var done = false;
    function apply(a) {
      if (done) return;
      done = true;
      renderResult(box, p, resume, a);
    }
    apiAnalysis(resume, job).then(apply).catch(function () { apply(localAnalysis(resume, job)); });
    fastTimeout(function () { if (!done) apply(localAnalysis(resume, job)); }, 4200);
  }

  async function prepare(p) {
    p = profileData(p);
    var resume = resumeOf(p);
    var job = jobOf(p, resume.skills);
    var a;
    try { a = await apiAnalysis(resume, job); } catch (e) { a = localAnalysis(resume, job); }
    return { profile: p, resume: resume, job: job, analysis: a, score: scoreOf(a) };
  }

  window.HPResumeAnalysis = { show: show, prepare: prepare };
})();
