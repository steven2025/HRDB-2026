/* 把当前保存的简历数据注入原始分析演示；保留原布局、动画、语音 */
(function () {
  'use strict';

  function esc(x) {
    try { return escBasic(String(x == null ? '' : x)); }
    catch (e) { return String(x == null ? '' : x); }
  }
  function list(x) { return Array.isArray(x) ? x.filter(Boolean) : []; }

  window.__hpApply = function (payload, auto) {
    if (!payload) return;
    var p = payload.profile || {}, r = payload.resume || {}, a = payload.analysis || {};
    var skills = list(r.skills);
    if (!skills.length && p.skill) skills = String(p.skill).split(/[、,，/]/).map(function (x) { return x.trim(); }).filter(Boolean);
    var works = list(r.workHistory);
    if (!works.length) works = [{ company: p.project || '', title: p.role || '', period: '', desc: p.workText || '' }];
    var ach = list(r.achievements);
    if (!ach.length && p.achText) ach = String(p.achText).split(/\n+/).map(function (x) { return x.trim(); }).filter(Boolean);
    var gap = (a.issues || [])[0] || null;
    var gapName = gap ? String(gap.title || '关键项').replace(/^(未填写|未说明|缺少|无)/, '').replace(/能力$/, '').slice(0, 10) : '';
    var score = Number(payload.score || 76);
    var passport = (r.passport && r.passport.valid) ? ('有效至 ' + (r.passport.expiry || '—')) : '待办理';
    var langText = p.languagesText || '';
    var family = p.familySupport || '—';
    var overseas = r.overseasExp ? '有' : '无';
    var strength = (a.strengths || [])[0] || '具备岗位所需经验与技能。';
    var issueDetail = gap ? String(gap.detail || '') : '关键要求已覆盖。';
    var issueFix = gap ? String(gap.fix || '') : '保持材料更新。';
    var flags = '<span class="flag">期望 <b>' + esc(p.salary || '面议') + '</b></span>' +
      '<span class="flag"><b>20</b> 天内到岗</span><span class="flag">意向 <b>' + esc(p.country || '—') + '</b></span>' +
      '<span class="flag">护照 <b>' + esc((r.passport && r.passport.expiry) || '—') + '</b></span>';
    var chips = skills.map(function (x) { return '<span class="chip" data-skill="' + esc(x) + '">' + esc(x) + '</span>'; }).join('');
    if (gap && skills.indexOf(gapName) < 0) chips += '<span class="chip gap" data-skill="' + esc(gapName) + '">' + esc(gapName) + '</span>';
    var achHTML = ach.length ? ach.map(function (x) { return esc(x); }).join('<br>') : '暂无量化业绩，建议补充产量、良率、带教或节省成本。';
    var w0 = works[0] || {}, w1 = works[1] || {};
    var desc0 = w0.desc || '按工艺卡完成设备操作、换模与参数调整，参与设备日常点检与异常处理。';
    var a0 = ach[0] || '', a1 = ach[1] || '';
    var job0 = '<div class="job"><div class="job-h"><b>' + esc(w0.title || p.role || '工作经历') + '</b><span class="dl"></span><span class="pd">' + esc(w0.period || '—') + '</span></div><div class="co">' + esc(w0.company || p.project || '') + '</div><div class="desc"><span class="hl hl-hit" id="m1">' + esc(desc0) + '</span>' + (a0 ? ' <span class="hl hl-hit" id="m2">' + esc(a0) + '</span>' : '') + (a1 ? ' <span class="hl hl-hit" id="m3">' + esc(a1) + '</span>' : '') + (gap ? '<span class="hl hl-gap" id="m5">（此处缺少：' + esc(gapName) + '）</span>' : '') + '</div><div class="note hit" id="note1"><span class="mk">PRAISE / 01</span><div class="bd"><div class="tt">真实优势</div><div class="dd">' + esc(strength) + '</div></div></div></div>';
    var job1 = '<div class="job"><div class="job-h"><b>' + esc(w1.title || '过往岗位') + '</b><span class="dl"></span><span class="pd">' + esc(w1.period || '') + '</span></div><div class="co">' + esc(w1.company || '') + '</div><div class="desc"><span class="hl hl-hit" id="m4">' + esc(w1.desc || '相关岗位经历。') + '</span></div><div class="note ' + (gap ? 'gap' : 'hit') + '" id="note2"><span class="mk">' + (gap ? 'GAP / 01' : 'FIXED / 01') + '</span><div class="bd"><div class="tt">' + (gap ? '缺少「' + esc(gapName) + '」' : '关键要求已覆盖') + '</div><div class="dd">' + esc(issueDetail) + '</div><span class="fix">' + esc(issueFix) + '</span></div></div></div>';
    var paper = '<div class="scan" id="scanline"></div><div class="head"><div class="av">' + esc((p.name || '?').slice(0, 1)) + '</div><div class="who"><h1>' + esc(p.name || '—') + '</h1><div class="sub">男<i></i>34 岁<i></i>' + esc(p.education || '') + '<i></i>河南洛阳<i></i>' + esc(p.role || '') + '<i></i>' + esc((p.years || r.years || 8)) + ' 年经验</div><div class="flags">' + flags + '</div></div></div><div class="cols"><div class="col-main"><section class="blk" id="sec-intent"><div class="blk-h"><span class="no">01</span><span class="nm">求职意向</span><span class="en">INTENT</span></div><div class="kv"><span class="k">目标岗位</span><span class="v">' + esc(p.role || '—') + '</span></div><div class="kv"><span class="k">意向国家</span><span class="v">' + esc(p.country || '不限') + '</span></div><div class="kv"><span class="k">期望薪资</span><span class="v">' + esc(p.salary || '面议') + '</span></div><div class="kv"><span class="k">班次</span><span class="v" style="color:var(--t2)">两班倒 / 三班倒均可</span></div></section><section class="blk" id="sec-work"><div class="blk-h"><span class="no">02</span><span class="nm">工作经历</span><span class="en">EXPERIENCE</span><span class="meta">' + works.length + ' 段</span></div>' + job0 + job1 + '</section><section class="blk" id="sec-ach"><div class="blk-h"><span class="no">03</span><span class="nm">业绩亮点</span><span class="en">RESULTS</span><span class="meta">' + ach.length + ' 条</span></div><div class="desc" style="font-size:12px;line-height:2.1">' + achHTML + '</div></section></div><div class="col-side"><section class="blk" id="sec-skill"><div class="blk-h"><span class="no">04</span><span class="nm">技能特长</span><span class="en">SKILLS</span><span class="meta" id="skillCnt">' + skills.length + '</span></div><div class="chips" id="chips">' + chips + '</div></section><section class="blk" id="sec-doc"><div class="blk-h"><span class="no">05</span><span class="nm">证件与健康</span><span class="en">DOCS</span></div><div class="doc"><span class="k">护照</span><span class="v hl hl-hit" id="m6">' + esc(passport) + '</span></div><div class="doc"><span class="k">健康证</span><span class="v">' + (r.healthCert ? '已备' : '待补') + '</span></div><div class="doc"><span class="k">无犯罪记录</span><span class="v">' + (r.noCriminalRecord ? (r.noCriminalRecord.notarized ? '已公证' : '未公证') : '未提供') + '</span></div><div class="note hit" id="note3"><span class="mk">PRAISE / 02</span><div class="bd"><div class="tt">出境材料</div><div class="dd">' + esc(passport) + '</div></div></div></section><section class="blk" id="sec-ovs"><div class="blk-h"><span class="no">06</span><span class="nm">外派适配</span><span class="en">ADAPT</span></div><div class="kv"><span class="k">海外经历</span><span class="v" style="flex:initial">' + esc(overseas) + '（<span class="hl-line" id="m7">' + (r.overseasExp ? '有驻外经历' : '首次外派') + '</span>）</span></div><div class="kv"><span class="k">家庭支持</span><span class="v">' + esc(family) + '</span></div><div class="kv"><span class="k">当地适应</span><span class="v" style="flex:initial"><span class="hl-line" id="m8">' + esc(langText || '未说明当地适应') + '</span></span></div><div class="note warn" id="note4"><span class="mk">NOTICE / 01</span><div class="bd"><div class="tt">外派适配</div><div class="dd">' + esc(issueDetail) + '</div><span class="fix">' + esc(issueFix) + '</span></div></div></section></div></div>';
    document.getElementById('paper').innerHTML = paper;
    RESUME.name = p.name || '候选人';
    RESUME.years = Number(p.years || r.years || 0);
    RESUME.job = p.role || '';
    RESUME.country = p.country || '';
    RESUME.fields = Math.max(8, skills.length + works.length + ach.length + 4);
    RESUME.skills = skills.length;
    RESUME.jobs = works.length;
    RESUME.achievements = ach.length;
    RESUME.hit = Math.max(0, skills.length - (gap ? 1 : 0));
    RESUME.gapName = gapName;
    RESUME.gapCount = gap ? 1 : 0;
    RESUME.gapDetail = gap ? String(gap.detail || '') : '';
    RESUME.gapFix = gap ? String(gap.fix || '') : '';
    RESUME.hasOverseas = !!r.overseasExp;
    RESUME.docReady = !!(r.passport && r.passport.valid) && !!r.healthCert;
    RESUME.suggestions = (a.issues || []).length;
    RESUME.scoreFrom = score;
    RESUME.scoreTo = Math.min(94, score + 5);
    try {
      if (typeof REPORT !== 'undefined') {
        REPORT.score = score;
        if ((a.strengths || []).length) REPORT.strengths = a.strengths.slice(0, 4).map(function (x) { return { t: x, d: '' }; });
        if ((a.issues || []).length) REPORT.issues = a.issues.slice(0, 6).map(function (x, i) {
          var lv = x.level === 'high' ? 'hi' : (x.level === 'medium' ? 'gp' : 'ok');
          return { id: 'ai' + i, t: x.title || '待优化', lv: lv, badge: x.level === 'high' ? '高优先级' : (x.level === 'medium' ? '建议优化' : '可补充'), d: x.detail || '', fix: x.fix || '', auto: false };
        });
      }
    } catch (e) {}
    try {
      var setv = function (id, v) { var el = document.getElementById(id); if (el && v != null) el.value = v; };
      setv('edName', p.name); setv('edPhone', p.phone); setv('edEducation', p.education);
      setv('edCity', p.city || '河南洛阳'); setv('edTitle', p.role); setv('edCountries', p.country);
      setv('edSalary', Number(String(p.salary || '').replace(/[^0-9]/g, '')) || '');
      setv('edAvail', p.availabilityDays || 20);
      var w0 = works[0] || {}, w1 = works[1] || {};
      setv('edCo1', w0.company); setv('edJt1', w0.title); setv('edPd1', w0.period); setv('edDesc1', (w0.desc || '') + ((ach || []).length ? '\n' + ach.join('\n') : ''));
      setv('edCo2', w1.company); setv('edJt2', w1.title); setv('edPd2', w1.period); setv('edDesc2', w1.desc || '');
    } catch (e) {}
    try { reset(true); } catch (e) {}
    if (auto) setTimeout(start, 80);
  };
})();
