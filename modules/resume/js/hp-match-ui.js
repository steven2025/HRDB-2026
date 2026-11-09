/* =====================================================================
 * hp-match-ui.js —— AI 双向匹配原生面板（科技感版）
 * 走主程序桥接（HPBridge.api）→ 自动指向本地或云端函数
 * ===================================================================== */
(function () {
  'use strict';

  /* ---------- i18n 便捷封装 ---------- */
  var I18 = {
    t: function (k) { return (window.HPI18N && window.HPI18N.t) ? window.HPI18N.t(k) : k; },
    td: function (v) { return (window.HPI18N && window.HPI18N.td) ? window.HPI18N.td(v) : v; },
    te: function (ns, c) { return (window.HPI18N && window.HPI18N.te) ? window.HPI18N.te(ns, c) : c; },
    isEn: function () { return window.HPI18N && window.HPI18N.lang() !== 'zh'; }
  };
  function T(k) { return I18.t(k); }

  /* 中英双语文案：非中文界面统一取英文（企业端匹配页只做中英，其余语言回退英文） */
  function L(zh, en) { return I18.isEn() ? en : zh; }

  var API = (window.HP_API_BASE || '').replace(/\/+$/, '');
  var C = 2 * Math.PI * 62;
  var CM = 2 * Math.PI * 15;
  var PARTS_LABEL = { skill: '技能', cert: '证书', salary: '薪资', location: '地点', exp: '经验', availability: '可用性' };
  var PARTS_MAX = { skill: 40, cert: 20, salary: 15, location: 10, exp: 10, availability: 5 };

  function token() {
    try { return sessionStorage.getItem('hp-token') || localStorage.getItem('hp-token') || null; } catch (e) { return null; }
  }

  function call(path, a, b) {
    var B = window.HPBridge;
    if (B && B.isOnline && B.isOnline() && B.api) {
      var fn = path.split('.').reduce(function (o, k) { return o && o[k]; }, B.api);
      if (typeof fn === 'function') {
        return Promise.resolve(fn(a, b)).then(function (res) {
          if (res && res.offline) throw new Error('后端未连接');
          return res;
        });
      }
    }
    return null;
  }

  function api(path, options) {
    var opt = options || {};
    var headers = { 'content-type': 'application/json', 'x-hp-request': '1' };
    var t = token();
    if (t) headers.authorization = 'Bearer ' + t;
    var init = { method: opt.method || 'GET', credentials: 'include', headers: headers };
    if (opt.body) init.body = JSON.stringify(opt.body);
    /* 后端按 lang 返回数据文本（岗位名/国家名/学历等），界面文案另有 i18n */
    var lang = (window.HPI18N && window.HPI18N.lang && window.HPI18N.lang()) || 'zh';
    if (lang !== 'zh' && !/[?&]lang=/.test(path)) {
      path = path + (path.indexOf('?') >= 0 ? '&' : '?') + 'lang=' + encodeURIComponent(lang);
    }
    return fetch((API || '') + path, init).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (j) {
        if (!r.ok) {
          /* 后端同时返回 error(code) 与 message(中文)，优先用 code 查词典，
             这样无需改动后端即可多语言；字典未收录时回退中文 message */
          var code = j.error || '';
          var zh = j.message || code || ('HTTP ' + r.status);
          var translated = code && window.HPI18N && window.HPI18N.t ? window.HPI18N.t('err.' + code) : zh;
          if (!translated || translated === 'err.' + code) translated = zh;
          var err = new Error(translated);
          err.code = code;
          err.zhMessage = zh;
          throw err;
        }
        return j;
      });
    });
  }

  function sleep(ms) {
    var skip = !!(window.HP_SETTINGS && window.HP_SETTINGS.skipReason) || !!window.__hpSkipReason;
    return new Promise(function (r) { setTimeout(r, skip && ms <= 1500 ? 0 : ms); });
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function clean(t) { return String(t == null ? '' : t).replace(/^(技能|证书|语言|地点)[:：]\s*/, ''); }
  function chips(list, cls) {
    return (list || []).map(function (t) {
      return '<span class="chip ' + (cls || 'chip-g') + '">' + esc(clean(t)) + '</span>';
    }).join('');
  }
  function scoreCls(n) { return n >= 80 ? 'hi' : (n >= 60 ? 'mid' : 'low'); }

  function gradDefs() {
    if (document.getElementById('mtRingGrad')) return '';
    // 挂到 body 上，避免视图重绘把渐变定义一起清掉（否则环不显示）
    var holder = document.createElement('div');
    holder.innerHTML = '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>' +
      '<linearGradient id="mtRingGrad" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0%" stop-color="#38e1ff"/><stop offset="100%" stop-color="#8b5cf6"/></linearGradient></defs></svg>';
    document.body.appendChild(holder.firstChild);
    return '';
  }

  function bigRing(score) {
    return '<div class="mt-ring">' +
      '<svg width="150" height="150" viewBox="0 0 150 150">' +
      '<circle class="track" cx="75" cy="75" r="62" fill="none" stroke-width="10"/>' +
      '<circle class="bar" cx="75" cy="75" r="62" fill="none" stroke-width="10" ' +
      'stroke-dasharray="' + C + '" stroke-dashoffset="' + C + '" data-score="' + score + '"/>' +
      '</svg><div class="mt-ring-num">' + score + '<i>分</i></div></div>';
  }
  function miniRing(score) {
    return '<div class="mt-mini"><svg width="38" height="38" viewBox="0 0 38 38">' +
      '<circle class="t" cx="19" cy="19" r="15" fill="none" stroke-width="3"/>' +
      '<circle class="b" cx="19" cy="19" r="15" fill="none" stroke-width="3" ' +
      'stroke-dasharray="' + CM + '" stroke-dashoffset="' + (CM * (1 - score / 100)) + '"/></svg></div>';
  }
  function partsRow(parts) {
    return '<div class="mt-parts">' + Object.keys(PARTS_MAX).map(function (k) {
      var v = (parts || {})[k] || 0;
      var pct = Math.round(v / PARTS_MAX[k] * 100);
      return '<div class="mt-part"><div class="k">' + PARTS_LABEL[k] + '</div>' +
        '<div class="v">' + v + '</div><div class="bar"><i style="width:' + pct + '%"></i></div></div>';
    }).join('') + '</div>';
  }
  function animateRing(root, score) {
    var bar = root.querySelector('.mt-ring .bar');
    if (!bar) return;
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { bar.style.strokeDashoffset = String(C * (1 - score / 100)); });
    });
  }
  function backendChip(target) {
    if (!target) return;
    var chip = document.createElement('span');
    chip.className = 'chip chip-g';
    chip.textContent = L('连接后端…', 'Connecting…');
    target.appendChild(chip);
    var base = (window.HPBridge && window.HPBridge.API_BASE) || window.HP_API_BASE || '';
    fetch((base || '') + '/api/health', { credentials: 'include', headers: { 'x-hp-request': '1' } })
      .then(function (r) { return r.json(); })
      .then(function (h) {
        var where = base ? L('云端函数', 'Cloud function') : L('本地服务', 'Local service');
        var model = h.provider && h.provider.mode === 'llm' ? (h.provider.model || 'deepseek') : L('规则引擎', 'Rules engine');
        chip.textContent = where + ' · ' + model;
        chip.className = 'chip ' + (h.provider && h.provider.mode === 'llm' ? 'chip-g' : 'chip-i');
      })
      .catch(function () { chip.textContent = L('后端未连接', 'Backend offline'); chip.className = 'chip chip-i'; });
  }

  /* 应聘者端：把「建议面试问题 / 推理过程」换成本人可执行的清单 */
  function personaBlocks(trace) {
    var R = trace.reasons || {};
    var riskTxt = (R.risks || []).join(' ');
    var gaps = [];
    (trace.steps || []).forEach(function (s) {
      var m = /缺口[：:]([^。；;]+)/.exec(s.detail || '');
      if (m) m[1].split(/[、,，]/).forEach(function (x) { var v = String(x).trim(); if (v) gaps.push(v); });
    });
    var prep = [];
    if (/技能|实操|操作/.test(riskTxt) || gaps.length) {
      prep.push(L('准备 2 个能证明动手能力的案例：什么设备、怎么调参数、产量/合格率变化',
                 'Prepare 2 hands-on cases: which machine, how you tuned it, output/quality results'));
    }
    if (/海外|跨文化|外派|驻外/.test(riskTxt)) {
      prep.push(L('准备一段能说明你适应长期外派的经历（出差、驻场、异地工作都算）',
                 'Prepare one story showing you adapt to long assignments (travel, site work, relocation)'));
    }
    if (/证件|护照|健康证|无犯罪/.test(riskTxt)) {
      prep.push(L('核对护照有效期、健康证、无犯罪公证，扫描件提前备好',
                 'Check passport validity, health certificate and police clearance; keep scans ready'));
    }
    if (/语言|英文|外语/.test(riskTxt)) {
      prep.push(L('准备一段英文自我介绍，熟悉设备手册里的常用词',
                 'Prepare a short English self-intro and learn common manual terms'));
    }
    prep.push(L('把简历里与岗位最相关的 2 段经历按「背景-做法-结果」讲清楚',
               'Be ready to tell your 2 most relevant experiences as situation-action-result'));
    prep.push(L('准备 3 个问 HR 的问题：班次、住宿、签证进度、合同期',
               'Prepare 3 questions for HR: shifts, housing, visa progress, contract term'));

    var boost = [];
    gaps.slice(0, 2).forEach(function (g) {
      boost.push(L('补「' + g + '」：报短期实操培训，或在简历里补充相近设备的操作经历',
                   'Close "' + g + '": take a short hands-on course or add similar-machine experience'));
    });
    if (/证书/.test(riskTxt)) {
      boost.push(L('补齐岗位要求的证书，先把已持有的证书扫描件放进档案',
                   'Complete the required certificates and upload scans of the ones you hold'));
    }
    if (/薪资/.test(riskTxt)) {
      boost.push(L('把期望薪资调到岗位区间内，或注明可接受的范围',
                   'Align your expected salary with the job range, or state an acceptable range'));
    }
    if (/到岗|可用/.test(riskTxt)) {
      boost.push(L('提前准备离职与出境材料，把到岗时间往前挪',
                   'Prepare resignation and travel documents earlier to shorten your availability'));
    }
    if (!boost.length) {
      boost.push(L('保持证件有效期，简历里的项目成果尽量写数字（产量、合格率、带教人数）',
                   'Keep documents valid; quantify results in your resume'));
    }

    var ul = function (arr) { return '<ul>' + arr.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>'; };
    return '<div class="mt-block"><div class="mt-block-t">' + L('面试准备清单', 'Interview checklist') + '</div>' + ul(prep) + '</div>' +
      '<div class="mt-block"><div class="mt-block-t">' + L('怎么提高匹配度', 'How to improve your match') + '</div>' + ul(boost.slice(0, 4)) + '</div>';
  }

  function modalTrace(trace, title) {
    var isPersona = !!(window.HPBridge && window.HPBridge.getRole && window.HPBridge.getRole() === 'persona');
    var R = trace.reasons || {};
    var steps = (trace.steps || []).map(function (st) {
      var cs = (st.chips || []).map(function (c) {
        return '<span class="chip ' + (c.ok ? 'chip-g' : 'chip-i') + '">' + esc(c.text) + '</span>';
      }).join('');
      return '<div class="mt-step"><div class="mt-step-h">' + esc(st.title) + '<span>' + st.ms + 's</span></div>' +
        '<div class="mt-step-b">' + esc(st.detail) + '</div>' +
        (cs ? '<div class="mt-step-chips">' + cs + '</div>' : '') + '</div>';
    }).join('');

    var parts = Object.keys(PARTS_MAX).map(function (k) {
      return '<div class="mt-tp">' + PARTS_LABEL[k] + '<b>' + ((trace.parts || {})[k] || 0) + '</b></div>';
    }).join('');

    var body = '<div class="mt-trace-head">' +
        '<div class="mt-trace-score">' + trace.score + '<i>分</i></div>' +
        '<div style="flex:1;min-width:160px">' +
          '<div style="font-weight:700">' + esc(title) + '</div>' +
          '<div class="t-muted" style="font-size:12px;margin-top:3px">' +
            (trace.aiMode === 'llm' ? 'AI 语义复核 · ' + esc(trace.aiModel || 'deepseek') : '规则引擎') +
            (typeof trace.aiConfidence === 'number' ? ' · 置信度 ' + trace.aiConfidence.toFixed(2) : '') +
          '</div></div>' +
        '<div class="mt-trace-parts">' + parts + '</div></div>' +
      (R.highlights && R.highlights.length ? '<div class="mt-block"><div class="mt-block-t">亮点</div><ul>' + R.highlights.map(function (h) { return '<li>' + esc(h) + '</li>'; }).join('') + '</ul></div>' : '') +
      (R.risks && R.risks.length ? '<div class="mt-block"><div class="mt-block-t warn">风险</div><ul>' + R.risks.map(function (h) { return '<li>' + esc(h) + '</li>'; }).join('') + '</ul></div>' : '') +
      (isPersona ? personaBlocks(trace) : (
        (R.questions && R.questions.length ? '<div class="mt-block"><div class="mt-block-t">建议面试问题</div><ul>' + R.questions.map(function (h) { return '<li>' + esc(h) + '</li>'; }).join('') + '</ul></div>' : '') +
        ((trace.aiEvidence && trace.aiEvidence.length) ? '<div class="mt-block"><div class="mt-block-t">AI 证据</div><div class="mt-chips">' + chips(trace.aiEvidence.slice(0, 6)) + '</div></div>' : '') +
        '<div class="mt-block"><div class="mt-block-t">推理过程（' + (trace.steps || []).length + ' 步）</div><div class="mt-timeline">' + steps + '</div></div>'
      ));

    window.HP.modal({ title: 'AI 匹配解释', body: body, actions: [{ text: '关闭', primary: true }] });
  }

  /* ==================== 企业端 ==================== */
  /* ---------- 筛选折叠（源码按钮 [data-hpf]，三个匹配页共用） ----------
     容器默认 .hp-collapsed：只露搜索行；点「筛选 ▾」切 .hp-open 展开其余条件。
     以前靠 hp-mt-ui.js 的自动增强，那条链路已经停用，这里改成源码里的委托事件。 */
  function mtFilterLabel(open) {
    if (I18.isEn()) return open ? 'Filters ▴' : 'Filters ▾';
    return open ? '筛选 ▴' : '筛选 ▾';
  }
  document.addEventListener('click', function (e) {
    var btn = (e.target && e.target.closest) ? e.target.closest('[data-hpf]') : null;
    if (!btn) return;
    var box = btn.closest('.mt-filters');
    if (!box) return;
    e.preventDefault();
    e.stopPropagation();
    var open = box.classList.toggle('hp-open');
    box.classList.toggle('hp-collapsed', !open);
    btn.textContent = mtFilterLabel(open);
  });

  /* ---------- 视图切换（源码按钮，共用一套） ----------
     大图标 / 中图标 / 小图标 / 列表。渲染时各页面已按 localStorage 的
     hp.mt.view 设置 grid 类名，这里只负责「写值 + 立刻改当前容器」，
     不重建列表，所以切换不会闪、不会丢勾选。 */
  var MT_VIEWS = [
    { k: 'l', zh: '大图标', en: 'Large', ic: '▣' },
    { k: 'm', zh: '中图标', en: 'Medium', ic: '▤' },
    { k: 's', zh: '小图标', en: 'Small', ic: '▦' },
    { k: 'list', zh: '列表', en: 'List', ic: '☰' }
  ];
  function mtViewGet() {
    var v = 'm';
    try { v = localStorage.getItem('hp.mt.view') || 'm'; } catch (e) {}
    if (v === 'detail' || v === 'content') v = 'list';
    if (v === 'xl' || v === 'tiles') v = 'l';
    return v;
  }
  function mtViewLabel(k) {
    var x = MT_VIEWS.filter(function (v) { return v.k === k; })[0] || MT_VIEWS[1];
    return x.ic + ' ' + (I18.isEn() ? x.en : x.zh) + ' ▾';
  }
  function mtViewSet(grid, k) {
    try { localStorage.setItem('hp.mt.view', k); } catch (e) {}
    if (!grid) return;
    ['hp-v-l', 'hp-v-m', 'hp-v-s', 'hp-list'].forEach(function (c) { grid.classList.remove(c); });
    grid.classList.add(k === 'list' ? 'hp-list' : 'hp-v-' + k);
  }
  function mtViewMenu(grid) {
    var cur = mtViewGet();
    var wrap = document.createElement('span');
    wrap.className = 'hp-vwrap mt-vmount';
    wrap.innerHTML =
      '<button type="button" class="btn btn-o btn-sm hp-vbtn2" data-hpv>' + mtViewLabel(cur) + '</button>' +
      '<div class="hp-vmenu">' +
        MT_VIEWS.map(function (v) {
          return '<button type="button" data-k="' + v.k + '" class="' + (v.k === cur ? 'on' : '') + '">' +
            '<span style="width:18px">' + v.ic + '</span><span>' + (I18.isEn() ? v.en : v.zh) + '</span>' +
            '<span class="tick">' + (v.k === cur ? '●' : '') + '</span></button>';
        }).join('') +
      '</div>';
    var btn = wrap.querySelector('[data-hpv]');
    var menu = wrap.querySelector('.hp-vmenu');
    btn.onclick = function (e) { e.stopPropagation(); menu.classList.toggle('on'); };
    Array.prototype.forEach.call(menu.querySelectorAll('[data-k]'), function (b) {
      b.onclick = function (e) {
        e.stopPropagation();
        var k = b.getAttribute('data-k');
        mtViewSet(grid, k);
        btn.innerHTML = mtViewLabel(k);
        Array.prototype.forEach.call(menu.querySelectorAll('[data-k]'), function (x) {
          var on = x === b;
          x.classList.toggle('on', on);
          x.querySelector('.tick').textContent = on ? '●' : '';
        });
        menu.classList.remove('on');
      };
    });
    return wrap;
  }
  /* 点空白处关掉任何打开中的视图菜单（只挂一次） */
  document.addEventListener('click', function (e) {
    Array.prototype.forEach.call(document.querySelectorAll('.hp-vmenu.on'), function (m) {
      if (!m.parentNode || !m.parentNode.contains(e.target)) m.classList.remove('on');
    });
  });

  /* scope:
     'applied' → 投递管理：只看主动投递过简历的候选人
     'talent'  → 候选人发现：看人才库中未投递的候选人（主动挖掘）
     省略      → 全部（兼容旧调用） */
  function company(root, opts) {
    if (!root) return;
    var scope = (opts && opts.scope) || 'all';
    root.innerHTML = '<div class="mt-stage"><div class="mt-stage-in"><div class="mt-hero"><div class="t-muted">' + L('正在加载候选人…', 'Loading candidates…') + '</div></div></div></div>';

    (call('company.jobs') || api('/api/company/jobs')).then(function (res) {
      var jobs = res.jobs || [];
      if (!jobs.length) { root.innerHTML = '<div class="mt-stage"><div class="mt-stage-in"><div class="mt-hero">' + L('暂无岗位', 'No jobs yet') + '</div></div></div>'; return; }

      root.innerHTML = gradDefs() +
        '<div class="mt-stage"><div class="mt-stage-in">' +
          '<div class="mt-hero" id="mtHero"></div>' +
          '<div class="mt-toolbar">' +
            '<div class="mt-field"><label>' + L('选择岗位', 'Select job') + '</label><select id="mtJob">' +
              jobs.map(function (j) { return '<option value="' + esc(j.id) + '">' + esc(j.title) + ' · ' + esc(j.country) + '</option>'; }).join('') +
            '</select></div>' +
            '<button class="btn btn-o btn-sm" id="mtRefresh">' + L('刷新', 'Refresh') + '</button>' +
            '<button class="btn btn-p btn-sm" id="mtAnalyze">' + L('匹配分析', 'Match analysis') + '</button>' +
            '<button class="btn btn-o btn-sm" id="mtAnalyzeAll">' + L('全部分析', 'Analyze all') + '</button>' +
            '<button class="btn btn-o btn-sm" id="mtDemo" title="' + L('看 AI 分析演示', 'Watch AI analysis demo') + '">▶ ' + L('看 AI 演示', 'Watch AI demo') + '</button>' +
            '<button class="btn btn-o btn-sm" id="mtFav">' + L('收藏夹', 'Saved') + '</button>' +
            '<button class="btn btn-o btn-sm" id="mtWeights">' + L('评分规则', 'Scoring rules') + '</button>' +
            '<div id="mtFunnel" class="mt-chips" style="margin:0 0 0 6px"></div>' +
            '<div style="flex:1"></div><div id="mtChip"></div>' +
          '</div>' +
          '<div class="mt-selbar" id="mtSelBar"></div>' +
          '<div class="mt-filters hp-collapsed" id="mtCoFilters">' +
            '<div class="mt-frow mt-fsearch"><input class="mt-search" id="mtCoSearch" placeholder="' + L('搜索姓名 / 工种 / 技能，如：张伟、注塑、质检', 'Search name / trade / skills') + '">' +
              '<button class="btn btn-o btn-sm" id="mtCoClear">' + L('清空筛选', 'Clear filters') + '</button>' +
              '<button class="btn btn-o btn-sm hp-fbtn2" data-hpf>' + mtFilterLabel(false) + '</button></div>' +
            '<div class="mt-frow"><span class="mt-flab">' + L('经验', 'Experience') + '</span><div class="mt-fchips" id="mtCoYears">' +
              [['0',L('全部','All')],['3',L('3 年以上','3+ yrs')],['5',L('5 年以上','5+ yrs')],['8',L('8 年以上','8+ yrs')],['10',L('10 年以上','10+ yrs')]].map(function (x, i) {
                return '<span class="chip chip-g' + (i === 0 ? ' on' : '') + '" data-y="' + x[0] + '">' + x[1] + '</span>';
              }).join('') +
            '</div></div>' +
            '<div class="mt-frow"><span class="mt-flab">' + L('条件', 'Conditions') + '</span><div class="mt-fchips" id="mtCoFlags">' +
              '<span class="chip chip-g" data-f="cert">' + L('持证', 'Certified') + '</span>' +
              '<span class="chip chip-g" data-f="pass">' + L('仅门槛通过', 'Passed threshold') + '</span>' +
              '<span class="chip chip-g" data-f="health">' + L('有健康证', 'Health cert') + '</span>' +
              '<span class="chip chip-g" data-f="overseas">' + L('有驻外经历', 'Overseas exp') + '</span>' +
              '<span class="chip chip-g" data-f="applied">' + L('仅已投递', 'Applied only') + '</span>' +
            '</div></div>' +
            '<div class="mt-frow"><span class="mt-flab">' + L('到岗', 'Start') + '</span><div class="mt-fchips" id="mtCoAvail">' +
              [['0',L('全部','All')],['15',L('15 天内','Within 15 days')],['30',L('30 天内','Within 30 days')],['60',L('60 天内','Within 60 days')]].map(function (x, i) {
                return '<span class="chip chip-g' + (i === 0 ? ' on' : '') + '" data-a="' + x[0] + '">' + x[1] + '</span>';
              }).join('') +
            '</div></div>' +
            '<div class="mt-frow"><span class="mt-flab">' + L('期望薪资', 'Expected salary') + '</span><div class="mt-fchips" id="mtCoPay">' +
              [['',L('全部','All')],['15',L('15K 以下','Under 15K')],['20','15-20K'],['25','20-25K'],['99',L('25K 以上','Above 25K')]].map(function (x, i) {
                return '<span class="chip chip-g' + (i === 0 ? ' on' : '') + '" data-p="' + x[0] + '">' + x[1] + '</span>';
              }).join('') +
            '</div></div>' +
            '<div class="mt-frow"><span class="mt-flab">' + L('学历', 'Education') + '</span><div class="mt-fchips" id="mtCoEdu">' +
              [['',L('全部','All')],['中专',L('中专及以上','Secondary+')],['大专',L('大专及以上','College+')],['本科',L('本科及以上','Bachelor+')]].map(function (x, i) {
                return '<span class="chip chip-g' + (i === 0 ? ' on' : '') + '" data-e="' + x[0] + '">' + x[1] + '</span>';
              }).join('') +
            '</div></div>' +
            '<div class="mt-frow"><span class="mt-flab">' + L('排序', 'Sort') + '</span><div class="mt-fchips" id="mtCoSort">' +
              [['composite',L('综合排序','Composite')],['years',L('经验优先','Experience first')],['avail',L('到岗优先','Availability first')],['name',L('按姓名','By name')]].map(function (x, i) {
                return '<span class="chip chip-g' + (i === 0 ? ' on' : '') + '" data-s="' + x[0] + '">' + x[1] + '</span>';
              }).join('') +
            '</div></div>' +
          '</div>' +
          '<div class="mt-cards" id="mtList"></div>' +
          '<div class="mt-pager" id="mtPager"></div>' +
        '</div></div>';

      var jobSel = root.querySelector('#mtJob');
      var listEl = root.querySelector('#mtList');
      var heroEl = root.querySelector('#mtHero');
      var lastList = [];
      var photoMap = {};
      var coFilter = { q: '', minYears: 0, cert: false, pass: false, health: false,
                       overseas: false, applied: false, avail: 0, pay: '', edu: '', sort: 'composite' };
      /* 勾选状态：candidateId -> true（跨筛选/翻页保留） */
      var picked = {};
      /* 分页 + 排名变化动效 状态 */
      var PER_PAGE = 12;
      var curPage = 1;
      var lastRankMap = {};   // candidateId -> 上一次的 rank
      var lastRenderRows = [];
      (call('company.resumes') || api('/api/company/resumes')).then(function (r) {
        ((r && r.resumes) || []).forEach(function (x) { if (x.photo) photoMap[x.id] = x.photo; });
        if (lastList.length) render({ list: lastList, job: lastJob });
      }).catch(function () {});
      backendChip(root.querySelector('#mtChip'));

      /* 视图切换：投递管理 / 候选人发现共用本渲染器，挂一次两页都有 */
      var __mtToolbar = root.querySelector('.mt-toolbar');
      if (__mtToolbar && !__mtToolbar.querySelector('[data-hpv]')) {
        __mtToolbar.appendChild(mtViewMenu(listEl));
      }

      function applyCoFilter(list) {
        var q = coFilter.q.toLowerCase();
        var rows = list.filter(function (c) {
          /* 来源区分：投递管理只看已投递，候选人发现只看未投递 */
          if (scope === 'applied' && !c.applied) return false;
          if (scope === 'talent' && c.applied) return false;
          if (coFilter.minYears && Number(c.years || 0) < coFilter.minYears) return false;
          if (coFilter.cert && !(c.hits || []).some(function (h) { return /证书/.test(h); })) return false;
          if (coFilter.pass && c.blocked) return false;
          if (coFilter.health && !c.healthCert) return false;
          if (coFilter.overseas && !c.overseasExp) return false;
          if (coFilter.applied && !c.applied) return false;
          if (coFilter.avail && Number(c.availabilityDays || 999) > coFilter.avail) return false;
          if (coFilter.pay) {
            var p = Number(c.salaryExpect || 0);
            if (coFilter.pay === '15' && p > 15) return false;
            if (coFilter.pay === '20' && (p < 15 || p > 20)) return false;
            if (coFilter.pay === '25' && (p < 20 || p > 25)) return false;
            if (coFilter.pay === '99' && p < 25) return false;
          }
          if (coFilter.edu) {
            var order = { '中专': 1, '高中': 1, '大专': 2, '本科': 3, '硕士': 4 };
            var need = order[coFilter.edu] || 0;
            if ((order[c.education] || 0) < need) return false;
          }
          if (q) {
            var hay = (c.name + ' ' + (c.title || '') + ' ' + (c.hits || []).join(' ') + ' ' + (c.gaps || []).join(' ')).toLowerCase();
            if (hay.indexOf(q) < 0) return false;
          }
          return true;
        });
        /* 综合排序：证件齐全度 40% + 相关年限 30% + 到岗及时性 20% + 资料完整度 10%
           （仅用于排序，不显示在卡片上；真正的匹配分需点「匹配分析」才出现） */
        function composite(c) {
          var cert = (c.blocked ? 0 : 60) + (c.healthCert ? 40 : 0);
          var yrs = Math.min(100, Number(c.years || 0) * 9);
          var av = Math.max(0, 100 - Number(c.availabilityDays || 90));
          var prof = ((c.hits || []).length * 12) + ((c.photo ? 1 : 0) * 20) + (c.salaryExpect ? 24 : 0);
          return cert * 0.4 + yrs * 0.3 + av * 0.2 + Math.min(100, prof) * 0.1;
        }
        if (coFilter.sort === 'years') rows.sort(function (a, b) { return (b.years || 0) - (a.years || 0); });
        else if (coFilter.sort === 'avail') rows.sort(function (a, b) { return (a.availabilityDays || 999) - (b.availabilityDays || 999); });
        else if (coFilter.sort === 'name') rows.sort(function (a, b) { return String(a.name || '').localeCompare(String(b.name || ''), 'zh'); });
        else rows.sort(function (a, b) { return composite(b) - composite(a); });
        return rows;
      }

      function render(data) {
        lastList = data.list || [];
        lastJob = data.job || lastJob;
        var rows = applyCoFilter(lastList);
        /* 顶部概览：不再展示"第一名分数环"（分数须经匹配分析后才可见）。
           改为展示投递概况，供用户决定对谁做分析。 */
        var appliedCount = lastList.filter(function (c) { return c.applied; }).length;
        var certOk = lastList.filter(function (c) { return !c.blocked; }).length;
        var scopeTip = scope === 'applied'
          ? L('仅显示已投递简历的候选人','Only candidates who applied')
          : (scope === 'talent' ? L('仅显示人才库中未投递的候选人（可主动邀约）', 'Talent-pool candidates who have not applied (proactive invite)') : '');
        heroEl.innerHTML =
          '<div class="mt-sum-ico">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" style="width:26px;height:26px">' +
            '<path d="M9 12h6M9 16h6M9 8h6M5 4h14v16H5z"/></svg>' +
          '</div>' +
          '<div class="mt-hero-main">' +
            '<div class="mt-hero-title">' + esc(data.job ? data.job.title : L('候选人','Candidates')) +
              ' <span style="font-weight:400;font-size:12.5px;color:var(--text-2)">' + L('共 ', 'Total ') + lastList.length + L(' 位候选人', ' candidates') + '</span></div>' +
            '<div class="mt-hero-sub">' + L('已投递 ', 'Applied ') + appliedCount + L(' 位 · 证件通过 ', ' · Docs passed ') + certOk + L(' 位 · 当前显示 ', ' · Showing ') + rows.length + L(' 位', '') + '</div>' +
            '<div class="mt-hero-sub" style="margin-top:4px;color:var(--text-2)">' + (scopeTip ? scopeTip + ' · ' : '') + L('勾选候选人后点「匹配分析」即可获得匹配分与排名', 'Select candidates and click Match analysis to get scores and ranking') + '</div>' +
          '</div>';

        var __v = 'm';
      try { __v = localStorage.getItem('hp.mt.view') || 'm'; } catch (e) {}
      if (__v === 'detail' || __v === 'content') __v = 'list';
      if (__v === 'xl') __v = 'l';
      if (__v === 'tiles') __v = 'm';
      listEl.className = 'mt-grid ' + (__v === 'list' ? 'hp-list' : 'hp-v-' + __v);
        /* 分页：只渲染当前页 */
        var pages = Math.max(1, Math.ceil(rows.length / PER_PAGE));
        if (curPage > pages) curPage = pages;
        if (curPage < 1) curPage = 1;
        var start = (curPage - 1) * PER_PAGE;
        var pageRows = rows.slice(start, start + PER_PAGE);
        lastRenderRows = rows;
        var thisRankMap = {};

        listEl.innerHTML = pageRows.map(function (c, i) {
          var photo = c.photo || photoMap[c.candidateId] || '';
          var gaps = (c.gaps || []).slice(0, 3);
          var hits = (c.hits || []).slice(0, 3);
          var sc = scoreCls(c.score);
          var absRank = start + i + 1;              // 跨页连续编号
          thisRankMap[c.candidateId] = absRank;
          /* 排名变化：正 = 名次上升 */
          var oldRank = lastRankMap[c.candidateId];
          var delta = oldRank ? (oldRank - absRank) : 0;
          var dCls = delta > 0 ? ' up' : (delta < 0 ? ' down' : '');
          var dBadge = delta ? '<span class="mt-delta ' + (delta > 0 ? 'up' : 'down') + '">' +
                              (delta > 0 ? '\u25B2' : '\u25BC') + Math.abs(delta) + '</span>' : '';
          /* 入场延迟：仅首屏生效，避免翻页后仍在等动画 */
          var delay = curPage === 1 ? Math.min(i * 28, 520) : 0;
          return '<div class="mt-flip mt-click' + (absRank === 1 ? ' top' : '') + dCls +
                 '" data-resume="' + esc(c.candidateId) + '" style="animation-delay:' + delay + 'ms">' +
            dBadge +
            '<div class="mt-flip-in">' +
              /* 正面 */
              '<div class="mt-face front">' +
                (c.applied ? '' : '') +
                '<div class="mt-f-top">' +
                  (photo ? '<img class="mt-f-photo" src="' + esc(photo) + '" alt="">'
                         : '<div class="mt-f-photo ph">' + esc((c.name || '?').slice(0, 1)) + '</div>') +
                  '<div class="mt-f-id">' +
                    '<div class="mt-f-name" style="padding-right:48px">' + esc(c.name) + '</div>' +
                    '<div class="mt-f-role">' + esc(c.title || '') + '</div>' +
                    '<div class="mt-f-role">' + (c.years || 0) + L(' 年 · ', ' yrs · ') + esc(c.education || c.city || '') + '</div>' +
                  '</div>' +
                '</div>' +
                '<div class="mt-f-info">' +
                  '<span class="mt-f-kv"><i>' + L('到岗', 'Start') + '</i><b>' + (c.availabilityDays ? c.availabilityDays + L(' 天', ' days') : L('待确认','TBC')) + '</b></span>' +
                  '<span class="mt-f-kv"><i>' + L('期望', 'Expected') + '</i><b>' + (c.salaryExpect ? (Math.round(Number(c.salaryExpect) / 100) / 10) + 'K' : L('面议','Negotiable')) + '</b></span>' +
                  '<span class="mt-f-kv"><i>' + L('证件', 'Docs') + '</i><b>' + (c.blocked ? L('待补','Pending') : (c.healthCert ? L('齐全','Complete') : L('部分','Partial'))) + '</b></span>' +
                  '</div>' +
                '<div class="mt-f-chips">' + chips(hits) + '</div>' +
                '<div class="mt-f-foot-pad"></div>' +
              '</div>' +
              /* 背面 */
              '<div class="mt-face back">' +
                '<div class="mt-b-head">' + esc(c.name) + L(' · 关键条件', ' · Key details') + '</div>' +
                '<div class="mt-b-rows">' +
                  '<div class="mt-b-row"><span>' + L('期望薪资', 'Expected salary') + '</span><b>' + (c.salaryExpect || L('面议','Negotiable')) + (c.salaryExpect ? L(' 元/月', ' CNY/mo') : '') + '</b></div>' +
                  '<div class="mt-b-row"><span>' + L('到岗时间', 'Start date') + '</span><b>' + (c.availabilityDays ? c.availabilityDays + L(' 天', ' days') : L('待确认','TBC')) + '</b></div>' +
                  '<div class="mt-b-row"><span>' + L('工作年限', 'Experience') + '</span><b>' + (c.years || 0) + L(' 年', ' yrs') + '</b></div>' +
                  '<div class="mt-b-row"><span>' + L('护照', 'Passport') + '</span><b>' + (c.blocked ? L('待确认','TBC') : L('有效','Valid')) + '</b></div>' +
                  '<div class="mt-b-row"><span>' + L('健康证', 'Health cert') + '</span><b>' + (c.healthCert ? L('已备','Ready') : L('缺失','Missing')) + '</b></div>' +
                  '<div class="mt-b-row"><span>' + L('驻外经历', 'Overseas exp') + '</span><b>' + (c.overseasExp ? L('有','Yes') : L('无','No')) + '</b></div>' +
                '</div>' +
                '<div class="mt-b-gaps">' + (gaps.length ? chips(gaps, 'chip-i') : '<span class="chip chip-g">' + L('无技能缺口', 'No skill gaps') + '</span>') + '</div>' +
                '<div class="mt-b-note">' + esc((c.reasons && c.reasons.risks && c.reasons.risks[0]) || L('暂无风险提示','No risk notes')) + '</div>' +
                '<div class="mt-b-hint">' + L('点击查看完整简历', 'Open full resume') + ' →</div>' +
              '</div>' +
              /* 操作层：永远可点，不受翻转影响 */
              '<div class="mt-ops">' +
                '<span class="mt-f-rank">' + (c.applied ? L('已投递','Applied') : L('人才库','Talent pool')) + '</span>' +
                '<label class="mt-pick" title="' + L('勾选后可批量匹配分析', 'Select for batch match analysis') + '">' +
                  '<input type="checkbox" data-pick="' + esc(c.candidateId) + '"' + (picked[c.candidateId] ? ' checked' : '') + '>' +
                  '<span></span></label>' +
                '<div class="mt-ops-btn">' +
                  '<button class="btn btn-o btn-sm" data-explain="' + esc(c.candidateId) + '" data-name="' + esc(c.name) + '">' + L('查看详情', 'Details') + '</button>' +
                  '<button class="btn btn-o btn-sm" data-interview="' + esc(c.candidateId) + '" data-name="' + esc(c.name) + '">' + L('邀面试', 'Invite') + '</button>' +
                '</div>' +
              '</div>' +
            '</div></div>';
        }).join('');

        /* 分页条 + 排名快照更新 */
        renderPager(rows.length, pages);
        lastRankMap = thisRankMap;
        /* 排名角标 3 秒后淡出，不残留 */
        var deltas = listEl.querySelectorAll('.mt-delta');
        if (deltas.length) {
          setTimeout(function () {
            Array.prototype.forEach.call(listEl.querySelectorAll('.mt-delta'), function (b) { b.classList.add('fade'); });
          }, 3000);
        }
        bindListEvents();
        bindOfferButtons();
        syncSelBar();
      }

      /* 事件委托：只绑一次，翻页后依然有效 */
      function bindListEvents() {
        if (listEl.dataset.bound) return;
        listEl.dataset.bound = '1';

        listEl.addEventListener('click', function (e) {
          var iv = e.target.closest('[data-interview]');
          if (iv) {
            e.stopPropagation();
            iv.disabled = true; iv.textContent = L('发送中', 'Sending');
            (call('company.invite', iv.dataset.interview, { jobId: jobSel.value }) ||
              api('/api/company/candidates/' + encodeURIComponent(iv.dataset.interview) + '/interview', { method: 'POST', body: { jobId: jobSel.value, at: '待确认', mode: '视频面试' } }))
              .then(function () {
                iv.textContent = L('已邀约', 'Invited'); iv.classList.add('btn-p');
                if (window.HPSound) window.HPSound.sfx('success');
              })
              .catch(function (err) { iv.textContent = L('失败', 'Failed'); iv.disabled = false; window.HP.toast(L('邀约失败', 'Invite failed'), err.message); });
            return;
          }
          var ex = e.target.closest('[data-explain]');
          if (ex) {
            ex.disabled = true; ex.textContent = L('分析中…', 'Analyzing…');
            (call('company.matchTrace', jobSel.value, ex.dataset.explain) || api('/api/match/trace?jobId=' + encodeURIComponent(jobSel.value) + '&candidateId=' + encodeURIComponent(ex.dataset.explain) + '&lang=' + ((window.HPI18N && window.HPI18N.lang()) || 'zh')))
              .then(function (trace) { modalTrace(trace, ex.dataset.name + ' × ' + (lastJob ? lastJob.title : '')); })
              .catch(function (err) { window.HP.toast(L('解释失败', 'Explain failed'), err.message); })
              .then(function () { ex.disabled = false; ex.textContent = L('AI 解释', 'AI explain'); });
            return;
          }
          // 卡片本体：点在按钮/输入上不打开简历
          var card = e.target.closest('[data-resume]');
          if (card && !e.target.closest('button, input, label')) {
            openResume(root, card.dataset.resume, jobSel.value);
          }
        });

        listEl.addEventListener('keydown', function (e) {
          var card = e.target.closest('[data-resume]');
          if (card && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            openResume(root, card.dataset.resume, jobSel.value);
          }
        });
      }

      /* offer 绑定：随每次渲染重建（offer 通过 prompt 交互，不依赖委托） */
      function bindOfferButtons() {
        Array.prototype.forEach.call(listEl.querySelectorAll('[data-offer]'), function (btn) {
          btn.addEventListener('click', function () {
            var salary = prompt(L('offer 薪资（元/月）', 'Offer salary (CNY/month)'), '23500');
            if (salary === null) return;
            var startDate = prompt(L('预计到岗日期（YYYY-MM-DD）', 'Expected start date (YYYY-MM-DD)'), '2026-12-10') || null;
            (call('company.createOffer', jobSel.value, { candidateId: btn.dataset.offer, salary: salary, startDate: startDate, note: '由 AI 匹配面板发起' }) ||
              api('/api/company/jobs/' + encodeURIComponent(jobSel.value) + '/offers', { method: 'POST', body: { candidateId: btn.dataset.offer, salary: salary, startDate: startDate } }))
              .then(function (res) {
                window.HP.toast(L('offer 已发出', 'Offer sent'), (res.offer ? res.offer.candidateName : btn.dataset.name) + ' · ' + salary + ' 元/月');
                if (window.HPSound) window.HPSound.sfx('success');
                loadFunnel();
              })
              .catch(function (e) { window.HP.toast(L('发送失败', 'Send failed'), e.message); });
          });
        });
      }

      /* 分页条：仅在有内容时显示翻页按钮 */
      function renderPager(total, pages) {
        var box = root.querySelector('#mtPager');
        if (!box) return;
        if (total <= PER_PAGE) { box.innerHTML = ''; return; }
        box.innerHTML =
          '<button class="btn btn-o btn-sm" data-pg="prev"' + (curPage <= 1 ? ' disabled' : '') + '>\u2190 ' + L('上一页', 'Prev') + '</button>' +
          '<span class="t-muted" style="margin:0 10px">' + L('第 ', 'Page ') + curPage + ' / ' + pages + L(' 页 · 共 ', ' / ') + total + L(' 人', '') + '</span>' +
          '<button class="btn btn-o btn-sm" data-pg="next"' + (curPage >= pages ? ' disabled' : '') + '>' + L('下一页', 'Next') + ' \u2192</button>';
      }

      /* 分页点击（委托，绑定一次） */
      (function bindPager() {
        var box = root.querySelector('#mtPager');
        if (!box || box.dataset.bound) return;
        box.dataset.bound = '1';
        box.addEventListener('click', function (e) {
          var b = e.target.closest('[data-pg]');
          if (!b || b.disabled) return;
          var pages = Math.max(1, Math.ceil(lastRenderRows.length / PER_PAGE));
          if (b.dataset.pg === 'prev') curPage = Math.max(1, curPage - 1);
          else curPage = Math.min(pages, curPage + 1);
          render({ list: lastList, job: lastJob });
          // 翻页后回到列表顶部
          if (listEl.scrollIntoView) listEl.scrollIntoView({ block: 'start', behavior: 'smooth' });
        });
      })();

      function loadFunnel() {
        var box = root.querySelector('#mtFunnel');
        if (!box) return;
        (call('company.funnel', jobSel.value) || api('/api/company/jobs/' + encodeURIComponent(jobSel.value) + '/funnel'))
          .then(function (f) {
            box.innerHTML = '<span class="chip chip-g">' + L('投递', 'Applied') + ' ' + f.applied + '</span>' +
              '<span class="chip chip-i">' + L('面试', 'Interview') + ' ' + f.interview + '</span>' +
              '<span class="chip chip-i">offer ' + f.offer + '</span>' +
              '<span class="chip chip-g">' + L('已录用', 'Hired') + ' ' + f.hired + ' / ' + L('需求', 'Need') + ' ' + f.headcount + '</span>';
          }).catch(function () {});
      }

      function load() {
        listEl.innerHTML = '<div class="t-muted" style="padding:8px 0">' + L('计算中…', 'Calculating…') + '</div>';
        loadFunnel();
        (call('company.jobCandidates', jobSel.value) || api('/api/company/jobs/' + encodeURIComponent(jobSel.value) + '/candidates'))
          .then(render)
          .catch(function (e) { listEl.innerHTML = '<div class="t-muted">' + L('加载失败：', 'Load failed: ') + esc(e.message) + '</div>'; });
      }

      root.querySelector('#mtWeights').addEventListener('click', function () {
        openWeights('company', function () {
            load();
            // 重算回来后统计排名变动，给出明确反馈
            setTimeout(function () {
              var ups = root.querySelectorAll('.mt-delta.up').length;
              var downs = root.querySelectorAll('.mt-delta.down').length;
              if (ups || downs) {
                window.HP.toast(L('排名已重算', 'Ranking updated'), (ups ? ups + L(' 位上升', ' up') : '') + (ups && downs ? ' · ' : '') + (downs ? downs + L(' 位下降', ' down') : ''));
                if (window.HPSound) window.HPSound.sfx('step');
              } else {
                window.HP.toast(L('排名已重算', 'Ranking updated'), L('本次无排名变化', 'No rank changes'));
              }
            }, 600);
          });
      });
      /* ---- 勾选与批量分析 ---- */
      function pickedIds() { return Object.keys(picked).filter(function (k) { return picked[k]; }); }
      function syncSelBar() {
        var bar = root.querySelector('#mtSelBar');
        if (!bar) return;
        var ids = pickedIds();
        bar.innerHTML = ids.length
          ? '<span class="mt-sel-count">' + L('已选 ', 'Selected ') + '<b>' + ids.length + '</b>' + L(' 位候选人', ' candidates') + '</span>' +
            '<button class="btn btn-p btn-sm" id="mtSelGo">' + L('匹配分析这 ', 'Analyze these ') + ids.length + L(' 位', '') + '</button>' +
            '<button class="btn btn-o btn-sm" id="mtSelClear">' + L('取消选择', 'Clear selection') + '</button>' +
            '<span class="t-muted" style="font-size:11.5px">' + L('分析将逐个播放推理过程', 'Analysis runs one by one') + '</span>'
          : '';
        var go = bar.querySelector('#mtSelGo');
        if (go) go.addEventListener('click', function () { goAnalyze(pickedIds()); });
        var cl = bar.querySelector('#mtSelClear');
        if (cl) cl.addEventListener('click', function () { picked = {}; rerenderCo(); });
      }
      /* 进入分析页：传递选中名单。未选则传当前筛选结果的全部 */
      function goAnalyze(ids) {
        var list = ids && ids.length ? ids : lastRenderRows.map(function (c) { return c.candidateId; });
        if (!list.length) { window.HP.toast(L('无法分析', 'Cannot analyze'), L('当前没有可分析的候选人', 'No candidates to analyze')); return; }
        window.HPS_CFG = {
          query: 'autorun=1&job=' + encodeURIComponent(jobSel.value) +
                 '&cands=' + encodeURIComponent(list.join(','))
        };
        location.hash = '#/company/stage';
      }
      root.querySelector('#mtAnalyze').addEventListener('click', function () { goAnalyze(pickedIds()); });
      var mtDemoBtn = root.querySelector('#mtDemo');
      if (mtDemoBtn) mtDemoBtn.addEventListener('click', function () {
        if (window.HPOpenDemo) window.HPOpenDemo();
        else if (window.HP && window.HP.toast) window.HP.toast(L('演示未加载', 'Demo not loaded'), L('请刷新页面后重试', 'Refresh and try again'));
      });

      root.querySelector('#mtAnalyzeAll').addEventListener('click', function () {
        var all = lastRenderRows.map(function (c) { return c.candidateId; });
        if (!all.length) { window.HP.toast(L('无法分析', 'Cannot analyze'), L('当前筛选结果为空', 'No rows in current filter')); return; }
        window.HP.toast(L('全部分析', 'Analyze all'), L('将对当前筛选出的 ', 'Will analyze ') + all.length + L(' 位候选人逐个分析', ' filtered candidates one by one'));
        goAnalyze(all);
      });
      /* 收藏夹：列出已收藏的候选人 */
      root.querySelector('#mtFav').addEventListener('click', function () {
        var favs = (lastList || []).filter(function (c) { return c.favorite; });
        var body = favs.length
          ? '<div class="mt-fav-list">' + favs.map(function (c) {
              return '<div class="mt-fav-row"><b>' + esc(c.name) + '</b><span class="t-muted">' + esc(c.title || '') +
                ' · ' + (c.years || 0) + L(' 年', ' yrs') + '</span>' +
                '<button class="btn btn-o btn-sm" data-unfav="' + esc(c.candidateId) + '">' + L('取消收藏', 'Unsave') + '</button></div>';
            }).join('') + '</div>'
          : '<div class="t-muted" style="padding:18px 0;text-align:center">' + L('收藏夹是空的。在候选人卡片上点「收藏」后会出现在这里。', 'Saved list is empty. Star a candidate card to see it here.') + '</div>';
        window.HP.modal({ title: L('候选人收藏夹', 'Saved candidates'), body: body, actions: [{ text: L('关闭', 'Close') }] });
      });

      function rerenderCo() {
        curPage = 1;   // 筛选变化 → 回到第 1 页，避免停在空页
        if (lastList.length) render({ list: lastList, job: lastJob, cached: true, engine: 'rules-v1' });
        syncSelBar();
      }
      /* 勾选框：用事件委托，避免翻页/筛选后失效 */
      root.addEventListener('change', function (e) {
        var cb = e.target;
        if (!cb || !cb.dataset || !cb.dataset.pick) return;
        picked[cb.dataset.pick] = cb.checked;
        syncSelBar();
      });
      var lastJob = null;

      root.querySelector('#mtCoSearch').addEventListener('input', function (e) { coFilter.q = e.target.value.trim(); rerenderCo(); });
      root.querySelector('#mtCoClear').addEventListener('click', function () {
        coFilter = { q: '', minYears: 0, cert: false, pass: false, health: false,
                    overseas: false, applied: false, avail: 0, pay: '', edu: '', sort: 'composite' };
        root.querySelector('#mtCoSearch').value = '';
        root.querySelectorAll('#mtCoFilters .chip').forEach(function (c) { c.classList.remove('on'); });
        root.querySelector('#mtCoYears [data-y="0"]').classList.add('on');
        root.querySelector('#mtCoAvail [data-a="0"]').classList.add('on');
        root.querySelector('#mtCoPay [data-p=""]').classList.add('on');
        root.querySelector('#mtCoEdu [data-e=""]').classList.add('on');
        root.querySelector('#mtCoSort [data-s="composite"]').classList.add('on');
        rerenderCo();
      });
      /* 单选组通用绑定 */
      function bindRadio(sel, attr, apply) {
        Array.prototype.forEach.call(root.querySelectorAll(sel + ' [' + attr + ']'), function (c) {
          c.addEventListener('click', function () {
            root.querySelectorAll(sel + ' .chip').forEach(function (x) { x.classList.remove('on'); });
            c.classList.add('on');
            apply(c.getAttribute(attr));
            rerenderCo();
          });
        });
      }
      bindRadio('#mtCoAvail', 'data-a', function (v) { coFilter.avail = Number(v) || 0; });
      Array.prototype.forEach.call(root.querySelectorAll('#mtCoYears [data-y]'), function (c) {
        c.addEventListener('click', function () {
          root.querySelectorAll('#mtCoYears .chip').forEach(function (x) { x.classList.remove('on'); });
          c.classList.add('on');
          coFilter.minYears = Number(c.dataset.y);
          rerenderCo();
        });
      });
      Array.prototype.forEach.call(root.querySelectorAll('#mtCoFlags [data-f]'), function (c) {
        c.addEventListener('click', function () {
          var f = c.dataset.f;
          coFilter[f] = !coFilter[f];
          c.classList.toggle('on', coFilter[f]);
          rerenderCo();
        });
      });
      bindRadio('#mtCoPay', 'data-p', function (v) { coFilter.pay = v; });
      bindRadio('#mtCoEdu', 'data-e', function (v) { coFilter.edu = v; });
      bindRadio('#mtCoSort', 'data-s', function (v) { coFilter.sort = v || 'composite'; });

      jobSel.addEventListener('change', load);
      root.querySelector('#mtRefresh').addEventListener('click', function () {
        listEl.innerHTML = '<div class="t-muted" style="padding:8px 0">' + L('重新计算中…', 'Recalculating…') + '</div>';
        (call('company.jobMatch', jobSel.value) || api('/api/company/jobs/' + encodeURIComponent(jobSel.value) + '/match', { method: 'POST' }))
          .then(render)
          .catch(function (e) { listEl.innerHTML = '<div class="t-muted">' + L('失败：', 'Failed: ') + esc(e.message) + '</div>'; });
      });
      load();
    }).catch(function (e) {
      root.innerHTML = '<div class="mt-stage"><div class="mt-stage-in"><div class="mt-hero">' + L('加载失败：', 'Load failed: ') + esc(e.message) + '</div></div></div>';
    });
  }

  /* ==================== 应聘者端 ==================== */
  /* 应聘者侧岗位推荐：卡片精简（无分数）+ 综合排序 + 筛选 + 多选 + 收藏
     scope: 'all' 全部 | 'favorite' 仅收藏 | 'applied' 仅已投递 */
  function persona(root, opts) {
    if (!root) return;
    var scope = (opts && opts.scope) || 'all';
    root.innerHTML = '<div class="mt-stage"><div class="mt-stage-in"><div class="mt-hero"><div class="t-muted">正在加载岗位…</div></div></div></div>';

    (call('persona.recommendations') || api('/api/persona/recommendations')).then(function (rec) {
      var cand = rec.candidate || {};
      var allList = rec.list || [];
      var list = scope === 'favorite'
        ? allList.filter(function (x) { return x.favorite; })
        : (scope === 'applied' ? allList.filter(function (x) { return x.applied; }) : allList);

      root.innerHTML = gradDefs() +
        '<div class="mt-stage"><div class="mt-stage-in">' +
          '<div class="mt-hero" id="mtPHero"></div>' +
          '<div class="mt-tuner">' +
            '<div class="mt-field"><label>薪资期望 <b id="mtvSalary">' + (cand.salaryExpect || 0) + '</b> 元/月</label>' +
              '<input type="range" id="mtSalary" min="12000" max="32000" step="500" value="' + (cand.salaryExpect || 22000) + '"></div>' +
            '<div class="mt-field"><label>到岗时间 <b id="mtvAvail">' + (cand.availabilityDays || 0) + '</b> 天</label>' +
              '<input type="range" id="mtAvail" min="5" max="90" step="1" value="' + (cand.availabilityDays || 20) + '"></div>' +
            '<div class="mt-field"><label>从业年限 <b id="mtvYears">' + (cand.years || 0) + '</b> 年</label>' +
              '<input type="range" id="mtYears" min="1" max="20" step="1" value="' + (cand.years || 8) + '"></div>' +
          '</div>' +
          '<div class="mt-chips" id="mtSkills" style="padding:14px 24px 0"></div>' +
          '<div class="mt-hint" id="mtPHint">已加载 · 拖动滑块或点技能可实时重算</div>' +
          '<div class="mt-toolbar">' +
            '<button class="btn btn-p btn-sm" id="mtPAnalyze">匹配分析</button>' +
            '<button class="btn btn-o btn-sm" id="mtPAnalyzeAll">全部分析</button>' +
            '<button class="btn btn-o btn-sm" id="mtPFav">收藏夹</button>' +
            '<button class="btn btn-o btn-sm" id="mtPWeights">偏好权重</button>' +
            '<div style="flex:1"></div><div id="mtPChip"></div>' +
          '</div>' +
          '<div class="mt-selbar" id="mtPSelBar"></div>' +
          '<div class="mt-filters hp-collapsed" id="mtPFilters">' +
            '<div class="mt-frow mt-fsearch"><input class="mt-search" id="mtPSearch" placeholder="搜索岗位 / 国家 / 技能，如：玻璃压机、阿尔及利亚">' +
              '<button class="btn btn-o btn-sm" id="mtPClear">清空筛选</button>' +
              '<button class="btn btn-o btn-sm hp-fbtn2" data-hpf>筛选 ▾</button></div>' +
            '<div class="mt-frow"><span class="mt-flab">薪资</span><div class="mt-fchips" id="mtPPay">' +
              [['','全部'],['15','15K 以下'],['20','15-20K'],['25','20-25K'],['99','25K 以上']].map(function (x, i) {
                return '<span class="chip chip-g' + (i === 0 ? ' on' : '') + '" data-p="' + x[0] + '">' + x[1] + '</span>';
              }).join('') +
            '</div></div>' +
            '<div class="mt-frow"><span class="mt-flab">国家</span><div class="mt-fchips" id="mtPCountry"></div></div>' +
            '<div class="mt-frow"><span class="mt-flab">条件</span><div class="mt-fchips" id="mtPFlags">' +
              '<span class="chip chip-g" data-f="favorite">已收藏</span>' +
              '<span class="chip chip-g" data-f="applied">已投递</span>' +
              '<span class="chip chip-g" data-f="notApplied">未投递</span>' +
            '</div></div>' +
            '<div class="mt-frow"><span class="mt-flab">排序</span><div class="mt-fchips" id="mtPSort">' +
              [['composite','综合排序'],['salary','薪资优先'],['name','按岗位名']].map(function (x, i) {
                return '<span class="chip chip-g' + (i === 0 ? ' on' : '') + '" data-s="' + x[0] + '">' + x[1] + '</span>';
              }).join('') +
            '</div></div>' +
          '</div>' +
          '<div class="mt-cards" id="mtPList"></div>' +
        '</div></div>';

      var skillBox = root.querySelector('#mtSkills');
      var listEl = root.querySelector('#mtPList');
      var heroEl = root.querySelector('#mtPHero');
      var hintEl = root.querySelector('#mtPHint');
      var salary = root.querySelector('#mtSalary');
      var avail = root.querySelector('#mtAvail');
      var years = root.querySelector('#mtYears');
      var timer = null;

      /* 筛选状态 */
      var pFilter = { q: '', pay: '', country: '', favorite: false, applied: false, notApplied: false, sort: 'composite' };
      var picked = {};
      function pickedIds() { return Object.keys(picked).filter(function (k) { return picked[k]; }); }

      /* 国家选项（从数据里取） */
      (function initCountries() {
        var box = root.querySelector('#mtPCountry');
        if (!box) return;
        var set = {};
        allList.forEach(function (x) { if (x.country) set[x.country] = 1; });
        var names = Object.keys(set).slice(0, 8);
        box.innerHTML = '<span class="chip chip-g on" data-c="">全部</span>' + names.map(function (n) {
          return '<span class="chip chip-g" data-c="' + esc(n) + '">' + esc(n) + '</span>';
        }).join('');
      })();

      function applyPFilter(src) {
        var q = pFilter.q.toLowerCase();
        var rows = src.filter(function (x) {
          if (pFilter.pay) {
            var p = Number(String(x.salary || '').replace(/[^\d]/g, '')) || 0;
            var k = p > 1000 ? p / 1000 : p;
            if (pFilter.pay === '15' && k > 15) return false;
            if (pFilter.pay === '20' && (k < 15 || k > 20)) return false;
            if (pFilter.pay === '25' && (k < 20 || k > 25)) return false;
            if (pFilter.pay === '99' && k < 25) return false;
          }
          if (pFilter.country && x.country !== pFilter.country) return false;
          if (pFilter.favorite && !x.favorite) return false;
          if (pFilter.applied && !x.applied) return false;
          if (pFilter.notApplied && x.applied) return false;
          if (q) {
            var hay = (x.jobTitle + ' ' + (x.country || '') + ' ' + (x.city || '') + ' ' + (x.hits || []).join(' ')).toLowerCase();
            if (hay.indexOf(q) < 0) return false;
          }
          return true;
        });
        function composite(x) {
          var sal = Number(String(x.salary || '').replace(/[^\d]/g, '')) || 0;
          var hits = (x.hits || []).length;
          var gaps = (x.gaps || []).length;
          return hits * 14 - gaps * 6 + Math.min(240, sal / 120) + (x.favorite ? 8 : 0);
        }
        if (pFilter.sort === 'salary') {
          rows.sort(function (a, b) {
            return (Number(String(b.salary || '').replace(/[^\d]/g, '')) || 0) - (Number(String(a.salary || '').replace(/[^\d]/g, '')) || 0);
          });
        } else if (pFilter.sort === 'name') {
          rows.sort(function (a, b) { return String(a.jobTitle || '').localeCompare(String(b.jobTitle || ''), 'zh'); });
        } else {
          rows.sort(function (a, b) { return composite(b) - composite(a); });
        }
        return rows;
      }

      function renderHero() {
        /* 顶部概览：不展示"第一名分数环"（分数须经匹配分析后才可见） */
        var appliedCount = list.filter(function (x) { return x.applied; }).length;
        var favCount = list.filter(function (x) { return x.favorite; }).length;
        heroEl.innerHTML =
          '<div class="mt-sum-ico">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" style="width:26px;height:26px">' +
            '<path d="M4 7h16M4 12h16M4 17h10"/></svg>' +
          '</div>' +
          '<div class="mt-hero-main">' +
            '<div class="mt-hero-title">为你推荐的岗位' +
              ' <span style="font-weight:400;font-size:12.5px;color:var(--text-2)">共 ' + list.length + ' 个</span></div>' +
            '<div class="mt-hero-sub">已收藏 ' + favCount + ' 个 · 已投递 ' + appliedCount + ' 个</div>' +
            '<div class="mt-hero-sub" style="margin-top:4px;color:var(--text-2)">勾选岗位后点「匹配分析」即可获得匹配分与排名</div>' +
          '</div>' +
          '<div style="flex:none;text-align:right"><div id="mtChip"></div></div>';
        backendChip(heroEl.querySelector('#mtChip'));
      }

      function renderSkills() {
        var mine = (cand.skills || []).slice();
        var needed = [];
        list.forEach(function (x) {
          (x.gaps || []).forEach(function (g) {
            if (g.indexOf('技能：') === 0) {
              var n = g.replace('技能：', '').trim();
              if (n && mine.indexOf(n) < 0 && needed.indexOf(n) < 0) needed.push(n);
            }
          });
        });
        var all = mine.concat(needed).slice(0, 12);
        skillBox.innerHTML = all.map(function (s) {
          return '<span class="chip ' + (mine.indexOf(s) >= 0 ? 'chip-g' : 'chip-i') + '" data-skill="' + esc(s) + '">' + esc(s) + '</span>';
        }).join('') + '<span class="chip chip-g" data-skill="__add" style="opacity:.7">+ 添加技能</span>';
        Array.prototype.forEach.call(skillBox.querySelectorAll('[data-skill]'), function (c) {
          c.addEventListener('click', function () {
            var name = c.dataset.skill;
            if (name === '__add') {
              var v = prompt('输入一项技能（如：越南语基础）');
              if (!v) return;
              name = v.trim();
            }
            var i = cand.skills.indexOf(name);
            if (i >= 0) cand.skills.splice(i, 1); else cand.skills.push(name);
            renderSkills();
            schedule();
          });
        });
      }

      function syncPSelBar() {
        var bar = root.querySelector('#mtPSelBar');
        if (!bar) return;
        var ids = pickedIds();
        bar.innerHTML = ids.length
          ? '<span class="mt-sel-count">已选 <b>' + ids.length + '</b> 个岗位</span>' +
            '<button class="btn btn-p btn-sm" id="mtPSelGo">匹配分析这 ' + ids.length + ' 个</button>' +
            '<button class="btn btn-o btn-sm" id="mtPSelClear">取消选择</button>'
          : '';
        var go = bar.querySelector('#mtPSelGo');
        if (go) go.addEventListener('click', function () { goPAnalyze(pickedIds()); });
        var cl = bar.querySelector('#mtPSelClear');
        if (cl) cl.addEventListener('click', function () { picked = {}; renderList(); });
      }

      /* 进入分析页：传递选中岗位 */
      function goPAnalyze(ids) {
        var rows = applyPFilter(list);
        var use = ids && ids.length ? ids : rows.map(function (x) { return x.jobId; });
        if (!use.length) { window.HP.toast('无法分析', '当前没有可分析的岗位'); return; }
        window.HPS_CFG = { query: 'autorun=1&jobs=' + encodeURIComponent(use.join(',')) + '&job=' + encodeURIComponent(use[0]) };
        location.hash = '#/persona/stage';
      }

      function renderList() {
        var rows = applyPFilter(list);
        if (!rows.length) {
          listEl.innerHTML = '<div class="t-muted" style="padding:24px 0;text-align:center">没有符合条件的岗位，试试放宽筛选。</div>';
          syncPSelBar();
          return;
        }
        listEl.innerHTML = rows.map(function (x, i) {
          var tags = (x.hits || []).slice(0, 3);
          var gaps = (x.gaps || []).slice(0, 2);
          return '<div class="mt-flip mt-click" data-job="' + esc(x.jobId) + '" style="animation-delay:' + Math.min(i * 28, 520) + 'ms">' +
            '<div class="mt-flip-in">' +
              '<div class="mt-face front">' +
                '<div class="mt-f-top" style="padding-top:15px">' +
                  '<div class="mt-f-id">' +
                    '<div class="mt-f-name" style="padding-right:48px">' + esc(x.jobTitle) + '</div>' +
                    '<div class="mt-f-role">' + esc(x.employer || '') + '</div>' +
                    '<div class="mt-f-role">' + esc(x.country || '') + (x.city ? ' · ' + esc(x.city) : '') + '</div>' +
                  '</div>' +
                '</div>' +
                '<div class="mt-f-info">' +
                  '<span class="mt-f-kv"><i>薪资</i><b>' + esc(x.salary || '面议') + '</b></span>' +
                  '<span class="mt-f-kv"><i>招聘</i><b>' + (x.headcount || 0) + ' 人</b></span>' +
                  '<span class="mt-f-kv"><i>状态</i><b>' + (x.applied ? '已投递' : (x.favorite ? '已收藏' : '未投递')) + '</b></span>' +
                '</div>' +
                '<div class="mt-f-chips">' + chips(tags) + (gaps.length ? chips(gaps, 'chip-i') : '') + '</div>' +
                '<div class="mt-f-foot-pad"></div>' +
              '</div>' +
              '<div class="mt-ops">' +
                '<span class="mt-f-rank">' + (x.applied ? '已投递' : (x.favorite ? '已收藏' : '可选')) + '</span>' +
                '<label class="mt-pick" title="勾选后可批量匹配分析">' +
                  '<input type="checkbox" data-ppick="' + esc(x.jobId) + '"' + (picked[x.jobId] ? ' checked' : '') + '>' +
                  '<span></span></label>' +
                '<div class="mt-ops-btn">' +
                  '<button class="btn btn-o btn-sm" data-explain="' + esc(x.jobId) + '" data-title="' + esc(x.jobTitle) + '">查看详情</button>' +
                  '<button class="btn btn-o btn-sm" data-favjob="' + esc(x.jobId) + '">' + (x.favorite ? '取消收藏' : '收藏') + '</button>' +
                '</div>' +
              '</div>' +
            '</div></div>';
        }).join('');

        /* 详情 */
        Array.prototype.forEach.call(listEl.querySelectorAll('[data-explain]'), function (btn) {
          btn.addEventListener('click', function (ev) {
            ev.stopPropagation();
            btn.disabled = true; btn.textContent = '分析中…';
            (call('persona.matchTrace', btn.dataset.explain, cand.id) || api('/api/match/trace?jobId=' + encodeURIComponent(btn.dataset.explain) + '&candidateId=' + encodeURIComponent(cand.id) + '&lang=' + ((window.HPI18N && window.HPI18N.lang()) || 'zh')))
              .then(function (trace) { modalTrace(trace, '我 × ' + btn.dataset.title); })
              .catch(function (e) { window.HP.toast('解释失败', e.message); })
              .then(function () { btn.disabled = false; btn.textContent = '查看详情'; });
          });
        });
        /* 收藏 */
        Array.prototype.forEach.call(listEl.querySelectorAll('[data-favjob]'), function (btn) {
          btn.addEventListener('click', function (ev) {
            ev.stopPropagation();
            var id = btn.dataset.favjob;
            var job = list.filter(function (y) { return y.jobId === id; })[0];
            if (!job) return;
            var on = !job.favorite;
            (call(on ? 'persona.addFavorite' : 'persona.removeFavorite', id) || api('/api/persona/favorites/' + encodeURIComponent(id), { method: on ? 'POST' : 'DELETE' }))
              .then(function () { job.favorite = on; renderList(); window.HP.toast(on ? '已收藏' : '已取消收藏', job.jobTitle); })
              .catch(function (e) { window.HP.toast('操作失败', e.message); });
          });
        });
        /* 勾选 */
        Array.prototype.forEach.call(listEl.querySelectorAll('[data-ppick]'), function (cb) {
          cb.addEventListener('change', function () {
            picked[cb.dataset.ppick] = cb.checked;
            syncPSelBar();
          });
        });
        syncPSelBar();
      }

      function schedule() {
        hintEl.innerHTML = '重算中…';
        clearTimeout(timer);
        timer = setTimeout(function () {
          var patch = {
            skills: cand.skills,
            salaryExpect: Number(salary.value),
            availabilityDays: Number(avail.value),
            years: Number(years.value)
          };
          (call('persona.saveProfile', patch) || api('/api/persona/profile', { method: 'PATCH', body: patch })).then(function (res) {
            var d = res.delta;
            hintEl.innerHTML = (typeof d === 'number' && d !== 0)
              ? ('已更新 · 分数 <b style="color:' + (d > 0 ? '#34d399' : '#fb7185') + '">' + (d > 0 ? '+' : '') + d + '</b>')
              : '已更新';
            return (call('persona.recommendations') || api('/api/persona/recommendations'));
          }).then(function (next) {
            list = next.list || list;
            cand = next.candidate || cand;
            renderHero();
            renderList();
            renderSkills();
          }).catch(function (e) { hintEl.textContent = '重算失败：' + e.message; });
        }, 360);
      }

      [salary, avail, years].forEach(function (input) {
        input.addEventListener('input', function () {
          root.querySelector('#mtvSalary').textContent = salary.value;
          root.querySelector('#mtvAvail').textContent = avail.value;
          root.querySelector('#mtvYears').textContent = years.value;
          schedule();
        });
      });

      /* ---- 工具栏与筛选绑定 ---- */
      root.querySelector('#mtPAnalyze').addEventListener('click', function () { goPAnalyze(pickedIds()); });
      /* 偏好权重：与「岗位发现」页同一个弹窗 */
      root.querySelector('#mtPWeights').addEventListener('click', function () {
        openWeights('persona', function () {
          window.HP.toast('已保存', '排名已按新权重重算');
          persona(root, opts);
        });
      });
      root.querySelector('#mtPAnalyzeAll').addEventListener('click', function () {
        var rows = applyPFilter(list);
        if (!rows.length) { window.HP.toast('无法分析', '当前筛选结果为空'); return; }
        goPAnalyze(rows.map(function (x) { return x.jobId; }));
      });
      root.querySelector('#mtPFav').addEventListener('click', function () {
        var favs = (list || []).filter(function (x) { return x.favorite; });
        window.HP.modal({
          title: '岗位收藏夹',
          body: favs.length
            ? '<div class="mt-fav-list">' + favs.map(function (x) {
                return '<div class="mt-fav-row"><b>' + esc(x.jobTitle) + '</b><span class="t-muted">' +
                  esc(x.country || '') + (x.city ? ' · ' + esc(x.city) : '') + ' · ' + esc(x.salary || '') + '</span>' +
                  '<button class="btn btn-o btn-sm" data-unfavp="' + esc(x.jobId) + '">取消收藏</button></div>';
              }).join('') + '</div>'
            : '<div class="t-muted" style="padding:18px 0;text-align:center">收藏夹是空的。在岗位卡片上点「收藏」后会出现在这里。</div>',
          actions: [{ text: '关闭' }]
        });
      });
      root.querySelector('#mtPSearch').addEventListener('input', function (e) { pFilter.q = e.target.value.trim(); renderList(); });
      root.querySelector('#mtPClear').addEventListener('click', function () {
        pFilter = { q: '', pay: '', country: '', favorite: false, applied: false, notApplied: false, sort: 'composite' };
        root.querySelector('#mtPSearch').value = '';
        root.querySelectorAll('#mtPFilters .chip').forEach(function (c) { c.classList.remove('on'); });
        root.querySelector('#mtPPay [data-p=""]').classList.add('on');
        root.querySelector('#mtPCountry [data-c=""]').classList.add('on');
        root.querySelector('#mtPSort [data-s="composite"]').classList.add('on');
        renderList();
      });
      function bindPRadio(sel, attr, apply) {
        Array.prototype.forEach.call(root.querySelectorAll(sel + ' [' + attr + ']'), function (c) {
          c.addEventListener('click', function () {
            root.querySelectorAll(sel + ' .chip').forEach(function (x) { x.classList.remove('on'); });
            c.classList.add('on');
            apply(c.getAttribute(attr));
            renderList();
          });
        });
      }
      bindPRadio('#mtPPay', 'data-p', function (v) { pFilter.pay = v; });
      bindPRadio('#mtPCountry', 'data-c', function (v) { pFilter.country = v; });
      bindPRadio('#mtPSort', 'data-s', function (v) { pFilter.sort = v || 'composite'; });
      Array.prototype.forEach.call(root.querySelectorAll('#mtPFlags [data-f]'), function (c) {
        c.addEventListener('click', function () {
          var f = c.dataset.f;
          pFilter[f] = !pFilter[f];
          c.classList.toggle('on', pFilter[f]);
          renderList();
        });
      });

      renderHero();
      renderSkills();
      renderList();
    }).catch(function (e) {
      root.innerHTML = '<div class="mt-stage"><div class="mt-stage-in"><div class="mt-hero">' + L('加载失败：', 'Load failed: ') + esc(e.message) + '</div></div></div>';
    });
  }

  /* ==================== 岗位发现 ==================== */
  /* ==================== 内联分析舞台（与页面同宽，不弹窗） ==================== */
  var STEPS_DEF = [
    { t: '解析岗位要求', d: function (it) { return '技能 ' + (it.skills || []).length + ' 项 · 证书 ' + (it.certs || []).length + ' 项 · 薪资 ' + (it.salary || '—'); } },
    { t: '读取候选人画像', d: function (it) { return (it.candidateName || '候选人') + ' · ' + (it.years || 0) + ' 年经验 · ' + (it.mine || 0) + ' 项技能'; } },
    { t: '硬性门槛校验', d: function (it) { return it.blocked ? '存在门槛问题，分数将封顶' : '护照 / 健康证 / 年龄 全部通过'; } },
    { t: '技能对齐', d: function (it) { return '命中 ' + (it.hitCount || 0) + ' / ' + ((it.skills || []).length || 1) + (it.gaps && it.gaps.length ? '；缺口：' + it.gaps.slice(0, 2).map(clean).join('、') : '；无缺口'); } },
    { t: '语义复核（AI）', d: function () { return '模型复核简历与 JD 描述，生成证据与差距'; } },
    { t: '加权计算', d: function (it) { return '技能 ' + (it.parts.skill || 0) + ' · 证书 ' + (it.parts.cert || 0) + ' · 薪资 ' + (it.parts.salary || 0) + ' · 地点 ' + (it.parts.location || 0) + ' · 经验 ' + (it.parts.exp || 0) + ' · 可用性 ' + (it.parts.availability || 0); } }
  ];

  function renderInlineStage(root, items, opts) {
    opts = opts || {};
    var ids = (opts.ids && opts.ids.length ? opts.ids : items.map(function (x) { return x.id; })).filter(Boolean);
    var focus = opts.jobId || ids[0] || '';
    var __theme = (document.documentElement.dataset.theme || 'dark');
    var src = 'match.html?autorun=1&follow=1&theme=' + encodeURIComponent(__theme) +
      (ids.length ? '&jobs=' + encodeURIComponent(ids.join(',')) : '') +
      (focus ? '&job=' + encodeURIComponent(focus) : '');

    root.innerHTML =
      '<div class="card mt-embed-card">' +
        '<div class="mt-embed-head">' +
          '<div class="mt-embed-title">AI 匹配分析<span class="t-muted"> · 已选 ' + ids.length + ' 个 · 实时数据</span></div>' +
          '<div style="flex:1"></div>' +
          '<a class="btn btn-o btn-sm" href="' + src + '" target="_blank" rel="noopener">新窗口</a>' +
          '<button class="btn btn-o btn-sm" id="mtEmbedBack">← 返回列表</button>' +
        '</div>' +
        '<iframe class="mt-embed" src="' + src + '" title="AI 匹配分析"></iframe>' +
      '</div>';

    root.querySelector('#mtEmbedBack').addEventListener('click', function () {
      if (opts.onBack) opts.onBack();
    });
  }

  function discover(root) {
    if (!root) return;
    root.innerHTML = '<div class="mt-stage"><div class="mt-stage-in"><div class="mt-hero"><div class="t-muted">正在加载岗位…</div></div></div></div>';

    Promise.all([
      /* 岗位列表必须带 lang 参数，走 HTTP 接口（HPBridge 不支持语言参数） */
      (api('/api/persona/discover?lang=' + ((window.HPI18N && window.HPI18N.lang()) || 'zh'))),
      (call('persona.offers') || api('/api/persona/offers')).catch(function () { return { offers: [] }; })
    ]).then(function (res) {
      var data = res[0] || {};
      var offers = (res[1] && res[1].offers) || [];
      var jobs = data.jobs || [];
      var countries = data.countries || [];
      var scores = {};          // 只有分析后才有分数
      var analyzed = false;
      if (window.__hpAnalyzed && window.__hpAnalyzed.scores) {
        analyzed = true;
        scores = window.__hpAnalyzed.scores;
      }

      var allTags = [];
      jobs.forEach(function (j) { (j.tags || []).forEach(function (t) { if (allTags.indexOf(t) < 0) allTags.push(t); }); });

      var filter = { q: '', countries: [], salary: '', tags: [], onlyOpen: true, onlyFav: false, onlyUndelivered: false, sort: 'score' };
      var selected = {};
      /* 岗位卡片分页状态 */
      var PER_PAGE_D = 12;
      var curPageD = 1;

      root.innerHTML = gradDefs() +
        '<div class="mt-stage"><div class="mt-stage-in">' +
          '<div class="mt-hero" id="mtDHero"></div>' +
          '<div class="mt-filters hp-collapsed" id="mtFilters"></div>' +
          '<div class="mt-toolbar2" id="mtToolbar2"></div>' +
          '<div class="mt-cards" id="mtDList"></div>' +
          '<div class="mt-pager" id="mtDPager"></div>' +
          '<div class="mt-batchbar" id="mtBatch"></div>' +
        '</div></div>';

      // mtMyWeights 事件委托：按钮随 hero 重建，用委托保证始终有效
      if (!root.dataset.weightsBound) {
        root.dataset.weightsBound = '1';
        root.addEventListener('click', function (e) {
          if (e.target && e.target.closest && e.target.closest('#mtMyWeights')) {
            openWeights('persona', function () { discover(root); });
          }
        });
      }

      var heroEl = root.querySelector('#mtDHero');
      var filtersEl = root.querySelector('#mtFilters');
      var toolbarEl = root.querySelector('#mtToolbar2');
      var listEl = root.querySelector('#mtDList');
      var batchEl = root.querySelector('#mtBatch');

      /* ---------- 顶部统计 + 录用通知 ---------- */
      var pending = offers.filter(function (o) { return o.status === '待接受'; });
      var favN = jobs.filter(function (j) { return j.favorite; }).length;
      var appN = jobs.filter(function (j) { return j.applied; }).length;
      heroEl.innerHTML =
        '<div class="mt-hero-main">' +
          '<div class="mt-hero-title">' +
            (I18.isEn() ? 'Find your next job' : '找到适合你的岗位') +
          '</div>' +
          '<div class="mt-hero-sub">' +
            (I18.isEn()
              ? jobs.length + ' open jobs · ' + favN + ' saved · ' + appN + ' applied'
              : '共 ' + jobs.length + ' 个在招岗位 · 收藏 ' + favN + ' 个 · 已投递 ' + appN + ' 个') +
          '</div>' +
          '<div class="mt-guide" id="mtGuide">' +
            (I18.isEn()
              ? 'Filter jobs, select some and click "Match analysis", or analyze all jobs to see the full matching process'
              : '') +
          '</div>' +
          '<div style="margin-top:10px"><button class="btn btn-o btn-sm" id="mtMyWeights">' + T('toolbar.weights') + '</button></div>' +
        '</div>' +
        (pending.length
          ? '<div class="mt-offer"><div><b>' +
            (I18.isEn() ? 'You have ' + pending.length + ' offer(s)' : '你有 ' + pending.length + ' 条录用通知') +
            '</b>' +
            '<div class="t-muted" style="font-size:12px;margin-top:3px">' + esc(pending[0].jobTitle) + ' · ' + esc(pending[0].salary) + '</div></div>' +
            '<div style="display:flex;gap:8px"><button class="btn btn-p btn-sm" id="mtAcceptOffer">' +
            (I18.isEn() ? 'Accept' : '接受') + '</button>' +
            '<button class="btn btn-o btn-sm" id="mtDeclineOffer">' +
            (I18.isEn() ? 'Later' : '再看看') + '</button></div></div>'
          : '');

      if (pending.length) {
        root.querySelector('#mtAcceptOffer').addEventListener('click', function () {
          (call('persona.acceptOffer', pending[0].id) || api('/api/persona/offers/' + encodeURIComponent(pending[0].id) + '/accept', { method: 'POST' }))
            .then(function () { window.HP.toast('已接受', '录用通知已确认，可以去签合同了'); discover(root); })
            .catch(function (e) { window.HP.toast('操作失败', e.message); });
        });
        root.querySelector('#mtDeclineOffer').addEventListener('click', function () {
          (call('persona.declineOffer', pending[0].id) || api('/api/persona/offers/' + encodeURIComponent(pending[0].id) + '/decline', { method: 'POST' }))
            .then(function () { window.HP.toast('已婉拒', '可以继续看看其他岗位'); discover(root); })
            .catch(function (e) { window.HP.toast('操作失败', e.message); });
        });
      }

      /* ---------- 筛选器（更丰富） ---------- */
      filtersEl.innerHTML =
        '<div class="mt-frow mt-fsearch"><input class="mt-search" id="mtSearch" placeholder="' +
          (I18.isEn() ? 'Search jobs / country / city / skills' : '搜索岗位 / 国家 / 城市 / 技能，如：注塑、越南、质检') + '">' +
          '<button class="btn btn-o btn-sm" id="mtClearFilter">' + T('filter.clear') + '</button>' +
          '<button class="btn btn-o btn-sm hp-fbtn2" data-hpf>' + mtFilterLabel(false) + '</button></div>' +
        '<div class="mt-frow"><span class="mt-flab">' + T('filter.country') + '</span><div class="mt-fchips" id="mtFCountry">' +
          '<span class="chip chip-g on" data-c="__all">' + T('filter.salaryAll') + '</span>' +
          countries.map(function (c) { return '<span class="chip chip-g" data-c="' + esc(c) + '">' + esc(c) + '</span>'; }).join('') +
        '</div></div>' +
        '<div class="mt-frow"><span class="mt-flab">' + T('filter.salary') + '</span><div class="mt-fchips" id="mtFSalary">' +
          [['', T('filter.salaryAll')],
           ['1', I18.isEn() ? 'Under 12K' : '12K 以下'],
           ['2', I18.isEn() ? '12–18K' : '12–18K'],
           ['3', I18.isEn() ? '18–25K' : '18–25K'],
           ['4', I18.isEn() ? 'Above 25K' : '25K 以上']].map(function (x, i) {
            return '<span class="chip chip-g' + (i === 0 ? ' on' : '') + '" data-s="' + x[0] + '">' + x[1] + '</span>';
          }).join('') +
        '</div></div>' +
        '<div class="mt-frow"><span class="mt-flab">' + (I18.isEn() ? 'Skills' : '技能') + '</span><div class="mt-fchips" id="mtFTag">' +
          allTags.slice(0, 16).map(function (t) { return '<span class="chip chip-g" data-k="' + esc(t) + '">' + esc(t) + '</span>'; }).join('') +
        '</div></div>' +
        '<div class="mt-frow"><span class="mt-flab">' + T('filter.state') + '</span><div class="mt-fchips" id="mtFState">' +
          '<span class="chip chip-g on" data-f="open">' + (I18.isEn() ? 'Open' : '在招') + '</span>' +
          '<span class="chip chip-g" data-f="undelivered">' + (I18.isEn() ? 'Not applied' : '未投递') + '</span>' +
          '<span class="chip chip-g" data-f="fav">' + (I18.isEn() ? 'Saved' : '已收藏') + '</span>' +
        '</div></div>' +
        '<div class="mt-frow"><span class="mt-flab">' + T('filter.sort') + '</span><div class="mt-fchips" id="mtFSort">' +
          '<span class="chip chip-g on" data-o="score">' + (I18.isEn() ? 'Match score' : '匹配度') + '</span>' +
          '<span class="chip chip-g" data-o="salary">' + (I18.isEn() ? 'Salary high→low' : '薪资高→低') + '</span>' +
          '<span class="chip chip-g" data-o="fresh">' + (I18.isEn() ? 'Newest' : '最新') + '</span>' +
        '</div></div>';

      /* ---------- 工具条：全选 + 分析入口（常驻） ---------- */
      function renderToolbar() {
        var list = applyFilters();
        var n = list.filter(function (j) { return selected[j.id]; }).length;
        var allOn = list.length > 0 && list.every(function (j) { return selected[j.id]; });
        toolbarEl.innerHTML =
          '<label class="mt-all"><input type="checkbox" id="mtAll"' + (allOn ? ' checked' : '') + '> ' +
          (I18.isEn() ? 'Select all' : '全选') + '</label>' +
          '<span class="mt-count">' +
          (I18.isEn()
            ? 'Results <b>' + list.length + '</b> · Selected <b>' + n + '</b>'
            : '筛选结果 <b>' + list.length + '</b> 个 · 已选 <b>' + n + '</b> 个') +
          '</span>' +
          '<div style="flex:1"></div>' +
          '<button class="btn btn-o btn-sm" id="mtAnalyzeSel"' + (n ? '' : ' disabled') + '>' +
          (I18.isEn() ? 'Analyze selected' + (n ? ' (' + n + ')' : '') : '分析已选' + (n ? '（' + n + '）' : '')) + '</button>' +
          '<button class="btn btn-p btn-sm" id="mtAnalyzeAll">' + (I18.isEn() ? 'Analyze all jobs' : '全部岗位分析') + '</button>';

        /* 视图切换：同一套源码按钮（按钮随工具条重建，状态存在 hp.mt.view） */
        toolbarEl.appendChild(mtViewMenu(listEl));

        root.querySelector('#mtAll').addEventListener('change', function (e) {
          var on = e.target.checked;
          list.forEach(function (j) { selected[j.id] = on; });
          render();
        });
        root.querySelector('#mtAnalyzeSel').addEventListener('click', function () {
          var ids = list.filter(function (j) { return selected[j.id]; }).map(function (j) { return j.id; });
          if (!ids.length) { window.HP.toast('还没有勾选', '先勾选岗位，或点「全部岗位分析」'); return; }
          runAnalysis(ids);
        });
        root.querySelector('#mtAnalyzeAll').addEventListener('click', function () {
          runAnalysis(list.map(function (j) { return j.id; }));
        });
      }

      function syncSelectionUI() {
        var list = applyFilters();
        var n = list.filter(function (j) { return selected[j.id]; }).length;
        var allOn = list.length > 0 && list.every(function (j) { return selected[j.id]; });
        var allBox = root.querySelector('#mtAll');
        if (allBox) allBox.checked = allOn;
        var cnt = root.querySelector('.mt-count');
        if (cnt) cnt.innerHTML = '筛选结果 <b>' + list.length + '</b> 个 · 已选 <b>' + n + '</b> 个';
        var selBtn = root.querySelector('#mtAnalyzeSel');
        if (selBtn) {
          selBtn.disabled = n === 0;
          selBtn.textContent = n ? '分析已选（' + n + '）' : '分析已选';
        }
        renderBatch();
      }

      function applyFilters() {
        var q = filter.q.toLowerCase();
        var out = jobs.filter(function (j) {
          var OPEN_STATES = ['招聘中', 'Recruiting', 'New', '新岗位'];
          if (filter.onlyOpen && j.status && OPEN_STATES.indexOf(j.status) < 0) return false;
          if (filter.onlyFav && !j.favorite) return false;
          if (filter.onlyUndelivered && j.applied) return false;
          if (filter.countries.length && filter.countries.indexOf(j.country) < 0) return false;
          if (filter.tags.length) {
            var hit = filter.tags.some(function (t) { return (j.tags || []).indexOf(t) >= 0 || (j.title || '').indexOf(t) >= 0; });
            if (!hit) return false;
          }
          if (filter.salary) {
            var nums = money(j.salary).map(Number);
            var mid = nums.length ? (nums[0] + (nums[nums.length - 1] || nums[0])) / 2 : 0;
            if (filter.salary === '1' && !(mid < 12000)) return false;
            if (filter.salary === '2' && !(mid >= 12000 && mid < 18000)) return false;
            if (filter.salary === '3' && !(mid >= 18000 && mid < 25000)) return false;
            if (filter.salary === '4' && !(mid >= 25000)) return false;
          }
          if (q && (j.title + j.country + (j.city || '') + (j.tags || []).join('')).toLowerCase().indexOf(q) < 0) return false;
          return true;
        });

        if (filter.sort === 'salary') {
          out.sort(function (a, b) {
            var na = money(a.salary).map(Number); var nb = money(b.salary).map(Number);
            return ((nb[nb.length - 1] || 0)) - ((na[na.length - 1] || 0));
          });
        } else if (filter.sort === 'fresh') {
          out.sort(function (a, b) { return String(b.updatedAt || '').localeCompare(String(a.updatedAt || '')); });
        } else if (analyzed) {
          out.sort(function (a, b) { return (scores[b.id] || 0) - (scores[a.id] || 0); });
        }
        return out;
      }

      function render() {
        var all = applyFilters();
        /* 分页：每页 PER_PAGE_D 个，避免一次渲染全部卡片 */
        var pages = Math.max(1, Math.ceil(all.length / PER_PAGE_D));
        if (curPageD > pages) curPageD = pages;
        if (curPageD < 1) curPageD = 1;
        var startD = (curPageD - 1) * PER_PAGE_D;
        var list = all.slice(startD, startD + PER_PAGE_D);
        var __v = 'm';
      try { __v = localStorage.getItem('hp.mt.view') || 'm'; } catch (e) {}
      if (__v === 'detail' || __v === 'content') __v = 'list';
      if (__v === 'xl') __v = 'l';
      if (__v === 'tiles') __v = 'm';
      listEl.className = 'mt-grid ' + (__v === 'list' ? 'hp-list' : 'hp-v-' + __v);
        listEl.innerHTML = list.map(function (j, i) {
          var sc2 = scores[j.id];
          var done = analyzed && typeof sc2 === 'number';
          var sc = done ? scoreCls(sc2) : 'low';
          /* 正面标签：优先用 tags，没有就用 requirements 前 3 条 */
          var tags = (j.tags || []).slice(0, 3);
          var reqs = (j.requirements || []).slice(0, 3);
          var delay = Math.min(i * 28, 520);
          /* 岗位首字母头像 */
          var initial = (j.title || j.name || '?').slice(0, 1);
          /* 状态文案 */
          var statusTxt = j.applied
            ? (I18.isEn() ? 'Applied' : '已投递')
            : (j.favorite ? (I18.isEn() ? 'Saved' : '已收藏') : (I18.isEn() ? 'Open' : '在招'));
          /* 招聘进度 */
          var hired = j.hired || 0;
          var hc = j.headcount || 0;
          var hireTxt = hc ? (hired + ' / ' + hc + (I18.isEn() ? '' : ' 人')) : (I18.isEn() ? 'Open' : '在招');
          return '<div class="mt-flip' + (i === 0 && done ? ' top' : '') + '" data-job="' + esc(j.id) + '" style="animation-delay:' + delay + 'ms">' +
            '<div class="mt-flip-in">' +
              /* ===== 正面 ===== */
              '<div class="mt-face front">' +
                '<div class="mt-f-top">' +
                  '<div class="mt-f-photo ph">' + esc(initial) + '</div>' +
                  '<div class="mt-f-id">' +
                    '<div class="mt-f-name" style="padding-right:48px">' + esc(j.title || j.name || '') + '</div>' +
                    '<div class="mt-f-role">' + esc(j.employer || '') + '</div>' +
                    '<div class="mt-f-role">' + esc(j.country || '') + (j.city ? ' · ' + esc(j.city) : '') + '</div>' +
                  '</div>' +
                '</div>' +
                '<div class="mt-f-info">' +
                  '<span class="mt-f-kv"><i>' + T('card.salary') + '</i><b>' + esc(j.salary || T('card.negotiable')) + '</b></span>' +
                  '<span class="mt-f-kv"><i>' + (I18.isEn() ? 'Hiring' : '招聘进度') + '</i><b>' + hireTxt + '</b></span>' +
                  '<span class="mt-f-kv"><i>' + (I18.isEn() ? 'Match' : '匹配') + '</i><b>' + (done ? Math.round(sc2) + '%' : '—') + '</b></span>' +
                '</div>' +
                '<div class="mt-f-chips">' + chips(tags) + '</div>' +
                '<div class="mt-f-foot-pad"></div>' +
              '</div>' +
              /* ===== 背面：详细条件 ===== */
              '<div class="mt-face back">' +
                '<div class="mt-b-head">' + esc(j.title || '') + ' · ' + (I18.isEn() ? 'Key requirements' : '关键条件') + '</div>' +
                '<div class="mt-b-rows">' +
                  '<div class="mt-b-row"><span>' + T('card.salary') + '</span><b>' + esc(j.salary || T('card.negotiable')) + '</b></div>' +
                  '<div class="mt-b-row"><span>' + (I18.isEn() ? 'Openings' : '招聘人数') + '</span><b>' + (j.headcount || 0) + (I18.isEn() ? '' : ' 人') + '</b></div>' +
                  '<div class="mt-b-row"><span>' + (I18.isEn() ? 'Hired' : '已录用') + '</span><b>' + (j.hired || 0) + (I18.isEn() ? '' : ' 人') + '</b></div>' +
                  '<div class="mt-b-row"><span>' + (I18.isEn() ? 'Status' : '岗位状态') + '</span><b>' + esc(j.status || '招聘中') + '</b></div>' +
                  '<div class="mt-b-row"><span>' + (I18.isEn() ? 'Applied' : '投递状态') + '</span><b>' + (j.applied ? (I18.isEn() ? 'Applied' : '你已投递') : T('card.notApplied')) + '</b></div>' +
                  '<div class="mt-b-row"><span>' + (I18.isEn() ? 'Updated' : '更新时间') + '</span><b>' + esc(j.updatedAt || '—') + '</b></div>' +
                '</div>' +
                '<div class="mt-b-gaps">' + (reqs.length ? chips(reqs, 'chip-i') : '<span class="chip chip-g">' + (I18.isEn() ? 'Loose requirements' : '条件宽松') + '</span>') + '</div>' +
                '<div class="mt-b-note">' + esc(j.employer || '') + ' · ' + esc(j.country || '') + (j.city ? ' ' + esc(j.city) : '') + '</div>' +
                '<div class="mt-b-hint">' + (I18.isEn() ? 'Click to view full job →' : '点击查看完整岗位 →') + '</div>' +
              '</div>' +
              /* ===== 操作层 ===== */
              '<div class="mt-ops">' +
                '<span class="mt-f-rank">' + statusTxt + '</span>' +
                '<label class="mt-f-check" title="' + (I18.isEn() ? 'Select for AI analysis' : '勾选后可「一键 AI 分析」') + '">' +
                  '<input type="checkbox" data-sel="' + esc(j.id) + '"' + (selected[j.id] ? ' checked' : '') + '>' +
                '</label>' +
                '<div class="mt-ops-btn">' +
                  '<button class="btn btn-o btn-sm" data-act="fav" data-job="' + esc(j.id) + '">' + (j.favorite ? (I18.isEn() ? 'Unsave' : '取消收藏') : (I18.isEn() ? 'Save' : '收藏')) + '</button>' +
                  '<button class="btn btn-p btn-sm" data-act="apply" data-job="' + esc(j.id) + '">' + (j.applied ? T('card.applied') : (I18.isEn() ? 'Apply' : '投递')) + '</button>' +
                '</div>' +
              '</div>' +
            '</div></div>';
        }).join('') || '<div class="t-muted" style="padding:16px">' + T('empty.noJob') + '</div>';

        // 点卡片任意位置（按钮/勾选框除外）→ 打开完整岗位信息
        Array.prototype.forEach.call(listEl.querySelectorAll('[data-job]'), function (card) {
          if (!card.classList.contains('mt-flip') && !card.classList.contains('jd-card')) return;
          card.addEventListener('click', function (e) {
            if (e.target.closest('button, input, label')) return;
            openJob(root, card.dataset.job, function () { discover(root); });
          });
          card.tabIndex = 0;
          card.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openJob(root, card.dataset.job, function () { discover(root); }); }
          });
        });

        Array.prototype.forEach.call(listEl.querySelectorAll('[data-sel]'), function (cb) {
          cb.addEventListener('change', function () {
            selected[cb.dataset.sel] = cb.checked;
            syncSelectionUI();   // 只更新计数/批量条，不重建列表，避免勾一个丢一个
          });
        });
        Array.prototype.forEach.call(listEl.querySelectorAll('[data-act]'), function (b) {
          b.addEventListener('click', function (e) {
            e.stopPropagation();
            var id = b.dataset.job;
            if (b.dataset.act === 'detail') {
              /* 查看详情：打开完整岗位信息 */
              openJob(root, id, function () { discover(root); });
            } else if (b.dataset.act === 'fav') {
              var job = jobs.filter(function (x) { return x.id === id; })[0];
              var on = !job.favorite;
              (call(on ? 'persona.addFavorite' : 'persona.removeFavorite', id) || api('/api/persona/favorites/' + encodeURIComponent(id), { method: on ? 'POST' : 'DELETE' }))
                .then(function () { job.favorite = on; render(); })
                .catch(function (err) { window.HP.toast('收藏失败', err.message); });
            } else {
              precheckAndApply(id);
            }
          });
        });

        renderToolbar();
        renderBatch();
        renderPagerD(all.length, pages);
      }

      /* 岗位卡片分页条：页码 + 上一页/下一页 + 跳转 */
      function renderPagerD(total, pages) {
        var box = document.getElementById('mtDPager');
        if (!box) return;
        var en = I18.isEn();
        if (pages <= 1) {
          box.innerHTML = '<span class="t-muted">' + (en ? total + ' jobs' : '共 ' + total + ' 个岗位') + '</span>';
          return;
        }
        var nums = [];
        for (var i = 1; i <= pages; i++) {
          if (pages > 9 && i > 2 && i < pages - 1 && Math.abs(i - curPageD) > 1) {
            if (nums[nums.length - 1] !== '...') nums.push('...');
            continue;
          }
          nums.push(i);
        }
        box.innerHTML =
          '<span class="t-muted">' +
            (en ? total + ' jobs · Page ' + curPageD + '/' + pages : '共 ' + total + ' 个 · 第 ' + curPageD + '/' + pages + ' 页') +
          '</span>' +
          '<button class="btn btn-o btn-sm" data-pg="prev"' + (curPageD <= 1 ? ' disabled' : '') + '>' + (en ? 'Prev' : '上一页') + '</button>' +
          nums.map(function (n) {
            if (n === '...') return '<span class="t-muted" style="padding:0 4px">…</span>';
            return '<button class="btn ' + (n === curPageD ? 'btn-p' : 'btn-o') + ' btn-sm" data-pg="' + n + '">' + n + '</button>';
          }).join('') +
          '<button class="btn btn-o btn-sm" data-pg="next"' + (curPageD >= pages ? ' disabled' : '') + '>' + (en ? 'Next' : '下一页') + '</button>' +
          (en ? '' :
            '<span class="t-muted" style="margin-left:6px">跳至</span>' +
            '<input id="mtDJump" type="number" min="1" max="' + pages + '" value="' + curPageD + '" class="mt-jump">' +
            '<span class="t-muted">页</span>' +
            '<button class="btn btn-o btn-sm" data-pg="jump">跳转</button>');
        Array.prototype.forEach.call(box.querySelectorAll('[data-pg]'), function (b) {
          b.addEventListener('click', function () {
            var v = b.dataset.pg;
            if (v === 'prev') curPageD = Math.max(1, curPageD - 1);
            else if (v === 'next') curPageD = Math.min(pages, curPageD + 1);
            else if (v === 'jump') {
              var j = Number((document.getElementById('mtDJump') || {}).value) || 1;
              curPageD = Math.max(1, Math.min(pages, j));
            } else curPageD = Number(v) || 1;
            render();
            try { listEl.scrollIntoView({ block: 'start', behavior: 'smooth' }); } catch (e) {}
          });
        });
      }

      function renderBatch() {
        var ids = jobs.filter(function (j) { return selected[j.id]; }).map(function (j) { return j.id; });
        if (!ids.length) { batchEl.classList.remove('show'); batchEl.innerHTML = ''; return; }
        batchEl.classList.add('show');
        batchEl.innerHTML = '<div class="mt-batch-in"><span>已选 <b>' + ids.length + '</b> 个岗位</span>' +
          '<button class="btn btn-o btn-sm" data-b="fav">收藏</button>' +
          '<button class="btn btn-o btn-sm" data-b="compare">对比</button>' +
          '<button class="btn btn-o btn-sm" data-b="apply">投递</button>' +
          '<button class="btn btn-p btn-sm" data-b="run">分析已选</button>' +
          '<button class="btn btn-o btn-sm" data-b="clear">清空</button></div>';
        Array.prototype.forEach.call(batchEl.querySelectorAll('[data-b]'), function (b) {
          b.addEventListener('click', function () { onBatch(b.dataset.b, ids); });
        });
      }

      /* =====================================================================
     投递弹窗：让用户选择「用已保存的简历」还是「重新上传简历」
     ---------------------------------------------------------------------
     所有「投递 / 投递简历」按钮统一走这里，保证体验一致。
     onDone(choice)  choice = 'saved' | 'upload'
     ===================================================================== */
  function precheckAndApply(jobId) {
        (call('persona.precheck', jobId) || api('/api/persona/jobs/' + encodeURIComponent(jobId) + '/precheck')).then(function (pre) {
          if (!pre.canApply) {
            window.HP.toast(I18.isEn() ? 'Already applied' : '已投递过',
              I18.isEn() ? 'You have already applied to this job' : '这个岗位你已经投过了');
            return;
          }
          var warn = (pre.warnings || []).map(function (w) { return '<li>' + esc(w) + '</li>'; }).join('');
          window.HP.modal({
            title: (I18.isEn() ? 'Pre-check · ' : '投递前体检 · ') + pre.job.title,
            body: '<div style="font-size:13px;line-height:1.8">' +
              '<div>' + (I18.isEn() ? 'Resume completeness: ' : '简历完整度：') + '<b>' + pre.resumeCompleteness + '%</b>' +
                (pre.score != null ? (I18.isEn() ? ' · Match score <b>' : ' · 匹配分 <b>') + pre.score + '</b>' : '') + '</div>' +
              (warn
                ? '<div style="margin-top:8px;color:var(--warning)"><ul style="margin:4px 0 0 18px">' + warn + '</ul></div>'
                : '<div style="margin-top:8px;color:var(--success)">' + (I18.isEn() ? 'All good, you can apply now' : '条件齐全，可以直接投递') + '</div>') +
              '<div style="margin-top:10px;font-size:12px;color:var(--text-2)">' +
                (I18.isEn() ? 'You can still apply with incomplete materials; an advisor will help fill the gaps.' : '材料不齐也可以投递，后续由顾问协助补齐。') + '</div></div>',
            actions: [
              { text: I18.isEn() ? 'Cancel' : '取消' },
              { text: I18.isEn() ? 'Next: choose resume' : '下一步：选择简历', primary: true, onClick: function (close) {
                close();
                applyWithResumeChoice(jobId, pre.job.title, function (choice) {
                  if (choice === 'upload') {
                    window.HP.toast(I18.isEn() ? 'Resume submitted' : '简历已提交',
                      I18.isEn() ? 'An advisor will review it within 1 business day' : '顾问会在 1 个工作日内复核，复核通过后自动投递');
                  }
                  doApply([jobId]);
                });
              } }
            ]
          });
        }).catch(function (e) { window.HP.toast(I18.isEn() ? 'Pre-check failed' : '体检失败', e.message); });
      }

      function doApply(ids) {
        (call('persona.batchApply', { jobIds: ids }) || api('/api/persona/jobs/batch-apply', { method: 'POST', body: { jobIds: ids } }))
          .then(function (res) {
            window.HP.toast(I18.isEn() ? 'Application sent' : '投递完成',
              I18.isEn()
                ? 'Success: ' + (res.ok || 0) + (res.failed ? ' · skipped: ' + res.failed : '')
                : '成功 ' + (res.ok || 0) + ' 个' + (res.failed ? ' · 跳过 ' + res.failed + ' 个' : ''));
            jobs.forEach(function (j) {
              if (ids.indexOf(j.id) >= 0 && (res.results || []).some(function (r) { return r.jobId === j.id && r.ok; })) j.applied = true;
            });
            Object.keys(selected).forEach(function (k) { delete selected[k]; });
            render();
          }).catch(function (e) { window.HP.toast('投递失败', e.message); });
      }

      function runAnalysis(ids) {
        if (!ids || !ids.length) { window.HP.toast('没有可分析的岗位', '先勾选岗位或调整筛选'); return; }
        (call('persona.recommendations') || api('/api/persona/recommendations')).then(function (rec) {
          var byId = {};
          (rec.list || []).forEach(function (x) { byId[x.jobId] = x; });
          var items = ids.map(function (id) {
            var x = byId[id];
            var j = jobs.filter(function (y) { return y.id === id; })[0] || {};
            return {
              id: id, title: x ? x.jobTitle : j.title,
              subtitle: (x ? x.country : j.country) + ' · ' + (x ? x.salary : j.salary),
              score: x ? x.score : 0, parts: (x && x.parts) || {}, salary: x ? x.salary : (j.salary || ''),
              gaps: (x && x.gaps) || [], hitCount: ((x && x.hits) || []).length,
              skills: ((x && x.spec && x.spec.skills) || []), certs: ((x && x.spec && x.spec.certs) || []),
              blocked: x ? x.blocked : false,
              candidateName: rec.candidate && rec.candidate.name, years: rec.candidate && rec.candidate.years,
              mine: (rec.candidate && rec.candidate.skills || []).length
            };
          }).filter(function (x) { return x.score; });
          if (!items.length) { window.HP.toast('没有可分析的岗位', '请先选择岗位'); return; }
          var map = {};
          items.forEach(function (x) { map[x.id] = x.score; });
          window.__hpAnalyzed = { scores: map, at: Date.now() };
          window.HPS_CFG = { query: 'autorun=1&jobs=' + encodeURIComponent(ids.join(',')) + '&job=' + encodeURIComponent(ids[0]) };
          location.hash = '#/persona/stage';
        }).catch(function (e) { window.HP.toast('分析失败', e.message); });
      }

      function showResult(items) {
        items.sort(function (a, b) { return b.score - a.score; });
        var top = items[0];
        root.innerHTML = gradDefs() +
          '<div class="mt-stage"><div class="mt-stage-in">' +
            '<div class="mt-hero">' + bigRing(top.score) +
              '<div class="mt-hero-main"><div class="mt-hero-title">' + esc(top.title) + '</div>' +
              '<div class="mt-hero-sub">' + esc(top.subtitle) + ' · 本轮分析 ' + items.length + ' 个岗位</div>' + partsRow(top.parts) + '</div></div>' +
            '<div class="mt-toolbar"><button class="btn btn-o btn-sm" id="mtBack">← 返回岗位列表</button>' +
              '<button class="btn btn-o btn-sm" id="mtReplay">重播分析</button>' +
              '<button class="btn btn-p btn-sm" id="mtApplyBest">投递最高分岗位</button></div>' +
            '<div class="mt-cards">' + items.map(function (x, i) {
              return '<div class="mt-card' + (i === 0 ? ' top' : '') + '" style="animation-delay:' + (i * 50) + 'ms">' +
                '<div class="mt-rank">' + (i + 1) + '</div>' +
                '<div class="mt-main"><div class="mt-name">' + esc(x.title) + '<span class="t-muted">' + esc(x.subtitle) + '</span></div>' +
                '<div class="mt-chips">' + chips((x.gaps || []).slice(0, 3), 'chip-i') + '</div></div>' +
                '<div class="mt-right">' + miniRing(x.score) + '<div class="mt-score ' + scoreCls(x.score) + '">' + x.score + '<i>分</i></div>' +
                '<button class="btn btn-o btn-sm" data-explain="' + esc(x.id) + '">AI 解释</button></div></div>';
            }).join('') + '</div>' +
          '</div></div>';

        animateRing(root, top.score);
        root.querySelector('#mtBack').addEventListener('click', function () { discover(root); });
        root.querySelector('#mtReplay').addEventListener('click', function () {
          renderInlineStage(root, items, {
            onDone: function (sorted) { showResult(sorted); },
            onBack: function () { discover(root); }
          });
        });
        root.querySelector('#mtApplyBest').addEventListener('click', function () { precheckAndApply(top.id); });
        Array.prototype.forEach.call(root.querySelectorAll('[data-explain]'), function (b) {
          b.addEventListener('click', function () {
            b.disabled = true; b.textContent = '分析中…';
            var candId = (window.__hpCandidateId || 't-001');
            (call('persona.matchTrace', b.dataset.explain, candId) || api('/api/match/trace?jobId=' + encodeURIComponent(b.dataset.explain) + '&candidateId=' + encodeURIComponent(candId) + '&lang=' + ((window.HPI18N && window.HPI18N.lang()) || 'zh')))
              .then(function (trace) { modalTrace(trace, items.filter(function (x) { return x.id === b.dataset.explain; })[0].title); })
              .catch(function (e) { window.HP.toast('解释失败', e.message); })
              .then(function () { b.disabled = false; b.textContent = 'AI 解释'; });
          });
        });
      }

      function onBatch(kind, ids) {
        if (!ids.length) return;
        if (kind === 'clear') { Object.keys(selected).forEach(function (k) { delete selected[k]; }); render(); return; }
        if (kind === 'fav') {
          Promise.all(ids.map(function (id) {
            return (call('persona.addFavorite', id) || api('/api/persona/favorites/' + encodeURIComponent(id), { method: 'POST' })).catch(function () { return null; });
          })).then(function () { jobs.forEach(function (j) { if (ids.indexOf(j.id) >= 0) j.favorite = true; }); render(); window.HP.toast('已收藏', ids.length + ' 个岗位'); });
          return;
        }
        if (kind === 'apply') { doApply(ids); return; }
        if (kind === 'run') { runAnalysis(ids); return; }
        if (kind === 'compare') {
          (call('persona.compare', { jobIds: ids }) || api('/api/persona/jobs/compare', { method: 'POST', body: { jobIds: ids } })).then(function (cmp) {
            var rows = ['分数', '国家', '薪资', '技能命中', '缺口'].map(function (label, i) {
              return '<tr><th style="text-align:left;color:var(--text-2);font-weight:500">' + label + '</th>' + cmp.jobs.map(function (j) {
                var v = i === 0 ? '<b>' + j.score + '</b>' : i === 1 ? esc(j.country) : i === 2 ? esc(j.salary)
                  : i === 3 ? esc((j.hits || []).map(clean).join('、')) : esc((j.gaps || []).map(clean).join('、'));
                return '<td>' + v + '</td>';
              }).join('') + '</tr>';
            }).join('');
            window.HP.modal({
              title: '岗位对比',
              body: '<table class="mt-cmp"><thead><tr><th></th>' + cmp.jobs.map(function (j) { return '<th>' + esc(j.title) + '</th>'; }).join('') + '</tr></thead><tbody>' + rows + '</tbody></table>',
              actions: [{ text: '关闭', primary: true }]
            });
          });
        }
      }

      /* ---------- 绑定筛选 ---------- */
      root.querySelector('#mtSearch').addEventListener('input', function (e) { filter.q = e.target.value.trim(); render(); });
      root.querySelector('#mtClearFilter').addEventListener('click', function () {
        filter = { q: '', countries: [], salary: '', tags: [], onlyOpen: true, onlyFav: false, onlyUndelivered: false, sort: 'score' };
        root.querySelector('#mtSearch').value = '';
        filtersEl.querySelectorAll('.chip').forEach(function (c) { c.classList.remove('on'); });
        filtersEl.querySelector('#mtFCountry [data-c="__all"]').classList.add('on');
        filtersEl.querySelector('#mtFSalary [data-s=""]').classList.add('on');
        filtersEl.querySelector('#mtFState [data-f="open"]').classList.add('on');
        filtersEl.querySelector('#mtFSort [data-o="score"]').classList.add('on');
        render();
      });

      Array.prototype.forEach.call(filtersEl.querySelectorAll('#mtFCountry [data-c]'), function (c) {
        c.addEventListener('click', function () {
          var v = c.dataset.c;
          if (v === '__all') {
            filter.countries = [];
            filtersEl.querySelectorAll('#mtFCountry .chip').forEach(function (x) { x.classList.remove('on'); });
            c.classList.add('on');
          } else {
            filtersEl.querySelector('#mtFCountry [data-c="__all"]').classList.remove('on');
            var i = filter.countries.indexOf(v);
            if (i >= 0) filter.countries.splice(i, 1); else filter.countries.push(v);
            c.classList.toggle('on', filter.countries.indexOf(v) >= 0);
            if (!filter.countries.length) filtersEl.querySelector('#mtFCountry [data-c="__all"]').classList.add('on');
          }
          render();
        });
      });

      Array.prototype.forEach.call(filtersEl.querySelectorAll('#mtFSalary [data-s]'), function (c) {
        c.addEventListener('click', function () {
          filtersEl.querySelectorAll('#mtFSalary .chip').forEach(function (x) { x.classList.remove('on'); });
          c.classList.add('on');
          filter.salary = c.dataset.s;
          render();
        });
      });

      Array.prototype.forEach.call(filtersEl.querySelectorAll('#mtFTag [data-k]'), function (c) {
        c.addEventListener('click', function () {
          var v = c.dataset.k;
          var i = filter.tags.indexOf(v);
          if (i >= 0) filter.tags.splice(i, 1); else filter.tags.push(v);
          c.classList.toggle('on', filter.tags.indexOf(v) >= 0);
          render();
        });
      });

      Array.prototype.forEach.call(filtersEl.querySelectorAll('#mtFState [data-f]'), function (c) {
        c.addEventListener('click', function () {
          var f = c.dataset.f;
          if (f === 'open') { filter.onlyOpen = !filter.onlyOpen; c.classList.toggle('on', filter.onlyOpen); }
          if (f === 'undelivered') { filter.onlyUndelivered = !filter.onlyUndelivered; c.classList.toggle('on', filter.onlyUndelivered); }
          if (f === 'fav') { filter.onlyFav = !filter.onlyFav; c.classList.toggle('on', filter.onlyFav); }
          render();
        });
      });

      Array.prototype.forEach.call(filtersEl.querySelectorAll('#mtFSort [data-o]'), function (c) {
        c.addEventListener('click', function () {
          filtersEl.querySelectorAll('#mtFSort .chip').forEach(function (x) { x.classList.remove('on'); });
          c.classList.add('on');
          filter.sort = c.dataset.o;
          render();
        });
      });

      // 记住候选人 id 供 AI 解释使用
      (call('persona.recommendations') || api('/api/persona/recommendations')).then(function (rec) {
        if (rec && rec.candidate) window.__hpCandidateId = rec.candidate.id;
      }).catch(function () {});

      render();
    }).catch(function (e) {
      root.innerHTML = '<div class="mt-stage"><div class="mt-stage-in"><div class="mt-hero">' + L('加载失败：', 'Load failed: ') + esc(e.message) + '</div></div></div>';
    });
  }

function applyWithResumeChoice(jobId, jobTitle, onChosen) {
  var chosen = null;
  var box = window.HP.modal({
    title: '投递简历 · ' + (jobTitle || ''),
    body:
      '<div style="font-size:13px;line-height:1.7">请选择本次投递使用的简历：</div>' +
      '<div class="mt-resume-choice" style="display:grid;gap:10px;margin-top:12px">' +
        '<label class="mt-rc-item" data-rc="saved">' +
          '<input type="radio" name="mtRC" value="saved" checked>' +
          '<div><b>使用已保存的简历</b>' +
          '<div class="t-muted" style="font-size:12px;margin-top:2px">上次保存的档案（含技能、证书、工作经历）</div></div>' +
        '</label>' +
        '<label class="mt-rc-item" data-rc="upload">' +
          '<input type="radio" name="mtRC" value="upload">' +
          '<div><b>重新上传简历</b>' +
          '<div class="t-muted" style="font-size:12px;margin-top:2px">支持 PDF / Word / 图片，上传后由顾问复核</div></div>' +
        '</label>' +
        '<div id="mtUploadZone" style="display:none;margin-top:4px">' +
          '<input type="file" id="mtResumeFile" accept=".pdf,.doc,.docx,.jpg,.png" ' +
            'style="width:100%;padding:9px 12px;border:1px dashed var(--border-strong);border-radius:10px;background:var(--surface-2);color:#cfe7ff;font-size:12.5px">' +
          '<div class="t-muted" style="font-size:11.5px;margin-top:6px">最大 10 MB · 上传后顾问会在 1 个工作日内复核</div>' +
        '</div>' +
      '</div>',
    actions: [
      { text: '取消' },
      { text: '确认投递', primary: true, onClick: function (close) {
        var sel = document.querySelector('.mt-resume-choice input[name="mtRC"]:checked');
        var choice = sel ? sel.value : 'saved';
        if (choice === 'upload') {
          var f = document.getElementById('mtResumeFile');
          if (!f || !f.files || !f.files.length) {
            window.HP.toast('请先选择文件', '点击虚线框选择你的简历文件');
            return;   /* 不关弹窗，让用户继续选文件 */
          }
        }
        close();
        if (onChosen) onChosen(choice);
      } }
    ]
  });
  /* 选「重新上传」时展开文件选择区 */
  setTimeout(function () {
    document.querySelectorAll('.mt-resume-choice input[name="mtRC"]').forEach(function (r) {
      r.addEventListener('change', function () {
        var zone = document.getElementById('mtUploadZone');
        if (zone) zone.style.display = (r.value === 'upload' && r.checked) ? 'block' : 'none';
        document.querySelectorAll('.mt-rc-item').forEach(function (it) {
          it.classList.toggle('on', it.dataset.rc === r.value);
        });
      });
    });
    document.querySelector('.mt-rc-item[data-rc="saved"]').classList.add('on');
  }, 0);
  return box;
}

  /* ==================== 简历详情 / 评分规则 ==================== */

  var W_LABEL = { skill: '技能', cert: '证书', salary: '薪资', location: '地点', exp: '经验', availability: '可用性' };
  var W_DEFAULT = { skill: 40, cert: 20, salary: 15, location: 10, exp: 10, availability: 5 };

  function openWeights(role, onSaved) {
    var url = role === 'company' ? '/api/company/weights' : '/api/persona/weights';
    Promise.resolve(call(role === 'company' ? 'company.weights' : 'persona.weights') || api(url))
      .catch(function () { return api(url); })
      .then(function (res) {
      res = res || {};
      var cur = Object.assign({}, W_DEFAULT, res.weights || {});
      /* 每个指标：滑块 + 可直接输入的数字框（两者双向联动） */
      var rows = Object.keys(W_DEFAULT).map(function (k) {
        return '<div class="mt-wrow"><span>' + W_LABEL[k] + '</span>' +
          '<input type="range" min="0" max="60" step="1" value="' + cur[k] + '" data-w="' + k + '">' +
          '<input type="number" min="0" max="60" step="1" value="' + cur[k] + '" data-wn="' + k + '" class="mt-wnum">' +
          '</div>';
      }).join('');
      window.HP.modal({
        /* 标题不再带括号说明（按需求去掉） */
        title: role === 'company' ? '评分规则' : '我的偏好权重',
        body: '<div class="mt-wbox">' + rows +
          '<div class="t-muted" style="font-size:12px;margin-top:8px">权重会归一化到 100，默认值即原始评分（技能 40 / 证书 20 / 薪资 15 / 地点 10 / 经验 10 / 可用性 5）。</div></div>',
        actions: [
          { text: '取消' },
          { text: '恢复默认', onClick: function (close) {
            /* 恢复默认：只重置数值，不关闭弹窗 */
            var box = {}; Object.keys(W_DEFAULT).forEach(function (k) { box[k] = W_DEFAULT[k]; });
            document.querySelectorAll('.mt-wbox [data-w]').forEach(function (inp) {
              inp.value = W_DEFAULT[inp.dataset.w];
            });
            document.querySelectorAll('.mt-wbox [data-wn]').forEach(function (num) {
              num.value = W_DEFAULT[num.dataset.wn];
            });
            saveWeights(role, box, url, null, onSaved);
          } },
          { text: '保存', primary: true, onClick: function (close) {
            /* 保存：写入后保持弹窗打开，由用户自己关闭（按需求） */
            var box = {};
            document.querySelectorAll('.mt-wbox [data-w]').forEach(function (inp) { box[inp.dataset.w] = Number(inp.value); });
            saveWeights(role, box, url, null, onSaved);
          } }
        ]
      });
      /* 滑块 → 数字框 */
      document.querySelectorAll('.mt-wbox [data-w]').forEach(function (inp) {
        inp.addEventListener('input', function () {
          var n = document.querySelector('.mt-wbox [data-wn="' + inp.dataset.w + '"]');
          if (n) n.value = inp.value;
        });
      });
      /* 数字框 → 滑块（支持直接填数值） */
      document.querySelectorAll('.mt-wbox [data-wn]').forEach(function (num) {
        num.addEventListener('input', function () {
          var v = Math.max(0, Math.min(60, Number(num.value) || 0));
          var s = document.querySelector('.mt-wbox [data-w="' + num.dataset.wn + '"]');
          if (s) s.value = v;
        });
        num.addEventListener('blur', function () {
          var v = Math.max(0, Math.min(60, Number(num.value) || 0));
          num.value = v;
          var s = document.querySelector('.mt-wbox [data-w="' + num.dataset.wn + '"]');
          if (s) s.value = v;
        });
      });
    }).catch(function (e) {
      console.error('openWeights', e);
      window.HP.toast('读取规则失败', (e && e.message) || '未知错误');
    });
  }

  /* 防重复提交：请求进行中时忽略后续点击 */
  var weightsBusy = false;
  function saveWeights(role, box, url, close, onSaved) {
    if (weightsBusy) return;
    weightsBusy = true;
    (call(role === 'company' ? 'company.saveWeights' : 'persona.saveWeights', { weights: box }) ||
      api(url, { method: 'PUT', body: { weights: box } }))
      .then(function (r) {
        /* close 可能为 null（按需求：保存后不自动关弹窗，由用户自己关） */
        if (typeof close === 'function') close();
        window.HP.toast('已保存', '权重已更新，排名已按新权重重算');
        if (onSaved) onSaved(r.weights);
      })
      .catch(function (e) { window.HP.toast('保存失败', e.message); })
      .then(function () { weightsBusy = false; });
  }

  /** 岗位详情页（应聘者点卡片进入） */
  function openJob(root, jobId, backFn) {
    root.innerHTML = '<div class="mt-stage"><div class="mt-stage-in"><div class="mt-hero"><div class="t-muted">正在加载岗位…</div></div></div></div>';
    Promise.all([
      (call('persona.recommendations') || api('/api/persona/recommendations')).catch(function () { return { list: [] }; }),
      (call('persona.discover') || api('/api/persona/discover')).catch(function () { return { jobs: [] }; })
    ]).then(function (res) {
      var rec = res[0] || {};
      var disc = res[1] || {};
      var j = (disc.jobs || []).filter(function (x) { return x.id === jobId; })[0];
      if (!j) throw new Error('该岗位不存在或已下架');
      var hit = ((rec.list || []).filter(function (x) { return x.jobId === jobId; })[0]) || null;
      var spec = (hit && hit.spec) || {};
      var duties = (j.duties && j.duties.length) ? j.duties : [
        '按工艺要求完成产线日常操作、首件确认与过程自检，保证节拍与质量达标。',
        '执行设备点检、保养与交接班记录，发现异常及时处理或上报。',
        '配合工艺工程师完成试模、换模与良率改善。',
        '带教当地员工，输出标准化作业卡。'
      ];
      var hard = (j.requirementsHard && j.requirementsHard.length) ? j.requirementsHard : (j.requirements || []);
      var pref = j.requirementsPreferred || [];
      var projectBrief = j.projectBrief || '';
      var pay = j.payStructure || '面议，按合同执行';
      var life = j.workLife || '包食宿、往返机票、商业保险，具体以合同为准。';
      var contract = j.contractTerms || ('首签 ' + (j.duration || '24 个月') + '，工作签证由雇主办理。');
      var tags = j.tags || [];
      var sc = hit ? hit.score : null;

      var dutiesHTML = duties.map(function (d) { return '<li>' + esc(d) + '</li>'; }).join('');
      var hardHTML = hard.length ? hard.map(function (h) { return '<li>' + esc(h) + '</li>'; }).join('') : '<li>以岗位沟通为准</li>';
      var prefHTML = pref.length ? '<div class="pd-req-t pref">优先条件</div><ul class="pd-req-pref">' +
        pref.map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('') + '</ul>' : '';

      var parts = (hit && hit.parts) ? hit.parts : null;
      var partName = { skill: '技能', cert: '证书', salary: '薪资', location: '地点', exp: '经验', availability: '可用性' };
      var partHTML = '';
      if (parts) {
        partHTML = Object.keys(parts).map(function (k) {
          var max = { skill: 40, cert: 20, salary: 15, location: 10, exp: 10, availability: 5 }[k] || 100;
          var pct = Math.max(0, Math.min(100, Math.round(parts[k] / max * 100)));
          var pv = Number(parts[k]) || 0;
          var ptx = Math.abs(pv - Math.round(pv)) < 0.01 ? String(Math.round(pv)) : pv.toFixed(1);
          return '<div class="pd-match-row"><span>' + (partName[k] || k) + '</span><div class="bar"><i style="width:' + pct + '%"></i></div><b>' + ptx + '</b></div>';
        }).join('');
      }
      var matchHTML = sc !== null
        ? '<div class="pd-match">' +
            '<div class="pd-match-score"><b>' + sc + '</b><span>匹配分</span><em>' + (sc >= 80 ? '建议投递' : sc >= 65 ? '可尝试' : '差距较大') + '</em></div>' +
            partHTML +
            (hit && hit.gaps && hit.gaps.length
              ? '<div class="pd-match-gap">缺口：' + esc(hit.gaps.slice(0, 4).map(function (x) { return String(x).replace('技能：', '').replace('证书：', ''); }).join('、')) + '</div>'
              : '<div class="pd-match-gap" style="color:#0f766e">技能全部命中</div>') +
          '</div>'
        : '<p class="pd-muted">尚未分析。点右上角「匹配分析」查看分项与缺口。</p>';

      var topButtons =
        '<button class="btn btn-p btn-sm" id="mtJobApply">' + (j.applied ? '已投递' : '投递简历') + '</button>' +
        '<button class="btn btn-o btn-sm" id="mtJobFav">' + (j.favorite ? '取消收藏' : '收藏') + '</button>' +
        '<button class="btn btn-o btn-sm" id="mtJobAnalyze">匹配分析</button>' +
        '<button class="btn btn-o btn-sm" id="mtJobBack">← 返回列表</button>';

      var paper =
        '<article class="paperdoc">' +
          '<div class="pd-job-head">' +
            '<div class="pd-job-logo">' + esc((j.employer || '岗').slice(0, 1)) + '</div>' +
            '<div class="pd-job-id">' +
              '<div class="pd-job-company">' + esc(j.employer || '') + '</div>' +
              '<h1 class="pd-job-title">' + esc(j.title || '—') + '<span>驻' + esc(j.country || '') + '</span></h1>' +
              '<div class="pd-job-meta">' + esc(j.country || '') + (j.city ? ' · ' + esc(j.city) : '') + ' · 招聘 ' + (j.headcount || 0) + ' 人 · 更新 ' + esc(j.updatedAt || '—') + '</div>' +
              '<div class="pd-chips" style="margin-top:6px">' + tags.map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('') + '</div>' +
            '</div>' +
            '<div class="pd-job-pay"><b>' + esc(j.salary || '面议') + '</b><span>' + esc(j.status || '招聘中') + '</span></div>' +
          '</div>' +

          '<div class="pd-body">' +
            '<div class="pd-main">' +
              (projectBrief ? '<section class="pd-sec"><h3>项目背景</h3><p class="pd-p">' + esc(projectBrief) + '</p></section>' : '') +
              '<section class="pd-sec"><h3>岗位职责</h3><ol class="pd-duty">' + dutiesHTML + '</ol></section>' +
              '<section class="pd-sec"><h3>任职要求</h3>' +
                '<div class="pd-req-t">硬性条件</div><ul class="pd-req-hard">' + hardHTML + '</ul>' +
                prefHTML +
              '</section>' +
              '<section class="pd-sec"><h3>薪资与福利</h3>' +
                '<div class="pd-kv wide"><span>薪资构成</span><b>' + esc(pay) + '</b></div>' +
                '<div class="pd-kv wide"><span>工作与生活</span><b>' + esc(life) + '</b></div>' +
              '</section>' +
              '<section class="pd-sec"><h3>合同与手续</h3>' +
                '<div class="pd-kv wide"><span>合同</span><b>' + esc(contract) + '</b></div>' +
                '<div class="pd-kv"><span>首签周期</span><b>' + esc(j.duration || '24 个月') + '</b></div>' +
              '</section>' +
            '</div>' +
            '<aside class="pd-side">' +
              '<section class="pd-sec"><h3>招聘信息</h3>' +
                '<div class="pd-kv"><span>招聘人数</span><b>' + (j.headcount || 0) + ' 人</b></div>' +
                '<div class="pd-kv"><span>岗位状态</span><b>' + esc(j.status || '招聘中') + '</b></div>' +
                '<div class="pd-kv"><span>更新时间</span><b>' + esc(j.updatedAt || '—') + '</b></div>' +
              '</section>' +
              '<section class="pd-sec"><h3>技能标签</h3><div class="pd-tags">' +
                tags.map(function (t) { return '<span class="strong">' + esc(t) + '</span>'; }).join('') +
              '</div></section>' +
              '<section class="pd-sec"><h3>我的匹配</h3>' + matchHTML + '</section>' +
            '</aside>' +
          '</div>' +
          '<div class="pd-foot"><span>岗位编号 ' + esc(j.id || '—') + '</span><span>企业发布 · 平台结构化展示</span></div>' +
        '</article>';

      root.innerHTML =
        '<div class="mt-stage"><div class="mt-stage-in">' +
          '<div class="mt-doc-top"><div><div class="mt-doc-eyebrow">JOB DESCRIPTION</div>' +
            '<div class="mt-doc-title">岗位详情<span>' + esc(j.title || '') + ' · ' + esc(j.employer || '') + '</span></div></div>' +
            '<div class="mt-res-act">' + topButtons + '</div></div>' +
          '<div class="docwrap">' + paper + '</div>' +
        '</div></div>';

      function customSkills(list) { return (list && list.length) ? list : null; }

      root.querySelector('#mtJobBack').addEventListener('click', function () { (backFn || function () { discover(root); })(); });

      root.querySelector('#mtJobApply').addEventListener('click', function () {
        var b = root.querySelector('#mtJobApply');
        if (j.applied) { window.HP.toast('已投递过', '这个岗位你已经投过了'); return; }
        b.disabled = true; b.textContent = '投递中…';
        (call('persona.precheck', jobId) || api('/api/persona/jobs/' + encodeURIComponent(jobId) + '/precheck')).then(function (pre) {
          var warn = (pre.warnings || []).map(function (w) { return '<li>' + esc(w) + '</li>'; }).join('');
          window.HP.modal({
            title: '投递前体检 · ' + pre.job.title,
            body: '<div style="font-size:13px;line-height:1.8"><div>简历完整度：<b>' + pre.resumeCompleteness + '%</b>' +
              (pre.score != null ? ' · 匹配分 <b>' + pre.score + '</b>' : '') + '</div>' +
              (warn ? '<div style="margin-top:8px;color:var(--warning)"><ul style="margin:4px 0 0 18px">' + warn + '</ul></div>'
                    : '<div style="margin-top:8px;color:var(--success)">条件齐全，可以直接投递</div>') +
              '<div style="margin-top:10px;font-size:12px;color:var(--text-2)">材料不齐也可以投递，后续由顾问协助补齐。</div></div>',
            actions: [
              { text: '取消', onClick: function (close) { close(); b.disabled = false; b.textContent = '投递简历'; } },
              { text: '仍然投递', primary: true, onClick: function (close) {
                close();
                (call('persona.batchApply', { jobIds: [jobId] }) || api('/api/persona/jobs/batch-apply', { method: 'POST', body: { jobIds: [jobId] } }))
                  .then(function (r2) {
                    var ok = (r2.results || []).some(function (x) { return x.ok; });
                    b.textContent = ok ? '已投递' : '已投过';
                    j.applied = ok;
                    window.HP.toast(ok ? '投递成功' : '已投递过', ok ? '企业会尽快查看你的简历' : '这个岗位你已经投过了');
                  })
                  .catch(function (e) { b.disabled = false; b.textContent = '投递简历'; window.HP.toast('投递失败', e.message); });
              } }
            ]
          });
        }).catch(function (e) { b.disabled = false; b.textContent = '投递简历'; window.HP.toast('体检失败', e.message); });
      });

      root.querySelector('#mtJobFav').addEventListener('click', function () {
        var b = root.querySelector('#mtJobFav');
        var on = !j.favorite;
        (call(on ? 'persona.addFavorite' : 'persona.removeFavorite', jobId) || api('/api/persona/favorites/' + encodeURIComponent(jobId), { method: on ? 'POST' : 'DELETE' }))
          .then(function () { j.favorite = on; b.textContent = on ? '取消收藏' : '收藏'; window.HP.toast(on ? '已收藏' : '已取消收藏'); })
          .catch(function (e) { window.HP.toast('操作失败', e.message); });
      });

      root.querySelector('#mtJobAnalyze').addEventListener('click', function () {
        window.HPS_CFG = { query: 'autorun=1&jobs=' + encodeURIComponent(jobId) + '&job=' + encodeURIComponent(jobId) };
        location.hash = '#/persona/stage';
      });
    }).catch(function (e) {
      root.innerHTML = '<div class="mt-stage"><div class="mt-stage-in"><div class="mt-hero">加载岗位失败：' + esc(e.message) +
        ' <button class="btn btn-o btn-sm" id="mtJobBackErr" style="margin-left:10px">← 返回列表</button></div></div></div>';
      var eb = root.querySelector('#mtJobBackErr');
      if (eb) eb.addEventListener('click', function () { (backFn || function () { discover(root); })(); });
    });
  }

  /** 简历详情页（企业点卡片进入）—— 完整简历文档 */
  /* opts.onBack: 自定义返回行为（例如从分析页跳来，返回时应回到分析页） */
  function openResume(root, candidateId, jobId, opts) {
    var onBack = (opts && opts.onBack) || null;
    root.innerHTML = '<div class="mt-stage"><div class="mt-stage-in"><div class="mt-hero"><div class="t-muted">正在加载简历…</div></div></div></div>';
    (call('company.resume', candidateId) || api('/api/company/resumes/' + encodeURIComponent(candidateId))).then(function (res) {
      var r = res.resume || {};
      var intent = r.intent || {};
      var health = r.health || {};
      var emg = r.emergency || {};
      var pp = r.passport || {};
      var works = r.workHistory || [];
      var edus = r.educationHistory || [];
      var langs = Object.keys(r.languages || {});
      var langName = { en: '英语', vi: '越南语', fr: '法语', ar: '阿拉伯语', zh: '中文' };
      var certs = (r.certDetails && r.certDetails.length) ? r.certDetails : (r.certs || []).map(function (c) { return { name: c }; });
      var ach = (r.achievements || []).filter(Boolean);
      var oh = r.overseasHistory || [];

      var workHTML = works.map(function (h) {
        var ha = Array.isArray(h.achievements) ? h.achievements.filter(Boolean) : [];
        return '<div class="pd-exp">' +
          '<div class="pd-exp-h"><b>' + esc(h.company || '—') + '</b><span>' + esc(h.period || '') + '</span></div>' +
          '<div class="pd-exp-role">' + esc(h.title || '') + '</div>' +
          (h.desc ? '<p class="pd-p">' + esc(h.desc) + '</p>' : '') +
          (ha.length ? '<ul class="pd-ul">' + ha.map(function (a) { return '<li>' + esc(a) + '</li>'; }).join('') + '</ul>' : '') +
        '</div>';
      }).join('') || '<p class="pd-muted">暂无工作经历</p>';

      var achHTML = ach.length
        ? '<div class="pd-ach">' + ach.map(function (a) { return '<div>' + esc(a) + '</div>'; }).join('') + '</div>'
        : '<p class="pd-muted">暂无</p>';

      var eduHTML = edus.map(function (e) {
        return '<div class="pd-exp"><div class="pd-exp-h"><b>' + esc(e.school || '—') + '</b><span>' + esc(e.period || '') + '</span></div>' +
          '<div class="pd-exp-role">' + esc([e.major, e.degree].filter(Boolean).join(' · ')) + '</div></div>';
      }).join('') || '<p class="pd-muted">暂无教育经历</p>';

      var certHTML = certs.length ? certs.map(function (c) {
        var meta = [c.level, c.validUntil ? '有效至 ' + c.validUntil : ''].filter(Boolean).join(' · ');
        return '<div class="pd-cert"><span>' + esc(c.name || '—') + '</span><b>' + esc(meta || '已持证') + '</b></div>';
      }).join('') : '<p class="pd-muted">暂未填写证书；如岗位要求证书，建议补充。</p>';

      var langHTML = langs.length ? langs.map(function (k) {
        return '<div class="pd-lang"><span>' + esc(langName[k] || k) + '</span><b>' + esc(r.languages[k]) + '</b></div>';
      }).join('') : '<p class="pd-muted">暂未填写语言；海外岗位建议补充英语 / 当地语言水平。</p>';

      var healthText = r.healthCert
        ? '健康证在有效期'
        : (r.healthExam ? '体检合格，健康证待办' : (health.status || '待体检'));

      var photo = r.photo
        ? '<img class="pd-photo" src="' + esc(r.photo) + '" alt="">'
        : '<div class="pd-photo ph">' + esc((r.name || '?').slice(0, 1)) + '</div>';

      var topButtons =
        '<button class="btn btn-p btn-sm" id="mtResMatch">匹配分析</button>' +
        '<button class="btn btn-o btn-sm" id="mtResInterview">邀面试</button>' +
        '<button class="btn btn-o btn-sm" id="mtResOffer">发 offer</button>' +
        '<button class="btn btn-o btn-sm" id="mtResPrint">打印</button>' +
        '<button class="btn btn-o btn-sm" id="mtResBack">← 返回列表</button>';

      var paper =
        '<article class="paperdoc">' +
          '<div class="pd-head">' + photo +
            '<div class="pd-id">' +
              '<h1 class="pd-name">' + esc(r.name || '—') + '<span>' + esc([r.gender, r.age ? r.age + ' 岁' : '', r.education].filter(Boolean).join(' · ')) + '</span></h1>' +
              '<div class="pd-role">' + esc(r.title || '') + ' · ' + (r.years || 0) + ' 年经验 · ' + esc(r.city || '') + '</div>' +
              '<div class="pd-contact">电话 <b>' + esc(r.phone || '—') + '</b> · 期望 <b>' + (r.salaryExpect || '面议') + ' 元/月</b> · ' + (r.availabilityDays || '—') + ' 天内到岗</div>' +
              '<div class="pd-chips">' +
                (pp.valid ? '<span class="good">护照有效至 ' + esc(pp.expiry || '—') + '</span>' : '<span class="warn">护照待办</span>') +
                (r.healthCert ? '<span class="good">健康证已备</span>' : '<span class="warn">健康证缺失</span>') +
                (r.overseasExp ? '<span class="good">有驻外经历</span>' : '<span>无驻外经历</span>') +
                (oh.length ? '<span class="good">' + oh.length + ' 段海外经历</span>' : '') +
              '</div>' +
            '</div>' +
            '<div class="pd-stamp">RESUME<b>NO. ' + esc(String(r.id || '').toUpperCase()) + '</b></div>' +
          '</div>' +

          '<div class="pd-body">' +
            '<div class="pd-main">' +
              '<section class="pd-sec"><h3>工作经历</h3>' + workHTML + '</section>' +
              '<section class="pd-sec"><h3>核心业绩</h3>' + achHTML + '</section>' +
              '<section class="pd-sec"><h3>教育经历</h3>' + eduHTML + '</section>' +
              '<section class="pd-sec"><h3>自我评价</h3><p class="pd-p">' + esc(r.selfIntro || '—') + '</p>' +
                '<div class="pd-kv wide"><span>离职原因</span><b>' + esc(r.leaveReason || '—') + '</b></div></section>' +
            '</div>' +
            '<aside class="pd-side">' +
              '<section class="pd-sec"><h3>求职意向</h3>' +
                '<div class="pd-kv"><span>目标岗位</span><b>' + esc(intent.targetRole || r.expectedRole || '—') + '</b></div>' +
                '<div class="pd-kv"><span>意向国家</span><b>' + esc(intent.targetCountry || (r.preferredCountries || []).join('、') || '不限') + '</b></div>' +
                '<div class="pd-kv"><span>期望薪资</span><b>' + esc(intent.expectedSalary || r.salaryExpect || '面议') + ' 元/月</b></div>' +
                '<div class="pd-kv"><span>到岗时间</span><b>' + esc(intent.earliestStart || ((r.availabilityDays || '—') + ' 天内')) + '</b></div>' +
                '<div class="pd-kv"><span>班次接受</span><b>' + esc(intent.acceptShift || r.shift || '面议') + '</b></div>' +
              '</section>' +
              '<section class="pd-sec"><h3>核心技能</h3><div class="pd-tags">' +
                (r.skills || []).map(function (x) { return '<span class="strong">' + esc(x) + '</span>'; }).join('') +
              '</div>' +
              ((r.strengths || []).length ? '<ul class="pd-ul" style="margin-top:6px">' + r.strengths.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' : '') +
              '</section>' +
              '<section class="pd-sec"><h3>证书</h3>' + certHTML + '</section>' +
              '<section class="pd-sec"><h3>语言</h3>' + langHTML + '</section>' +
            '</aside>' +
          '</div>' +
          '<div class="pd-bottom">' +
              '<section class="pd-sec"><h3>证件与健康</h3>' +
                '<div class="pd-kv"><span>护照</span><b>' + (pp.valid ? '有效至 ' + esc(pp.expiry || '—') : '待办理') + '</b></div>' +
                '<div class="pd-kv"><span>健康证</span><b>' + (r.healthCert ? '已备' : '缺失') + '</b></div>' +
                '<div class="pd-kv"><span>体检</span><b>' + esc(r.healthExam ? ((r.healthExam.date || '') + ' · ' + (r.healthExam.hospital || '')) : '—') + '</b></div>' +
                '<div class="pd-kv"><span>无犯罪记录</span><b>' + esc(r.noCriminalRecord ? ((r.noCriminalRecord.date || '') + (r.noCriminalRecord.notarized ? '（已公证）' : '（未公证）')) : '未提供') + '</b></div>' +
                '<div class="pd-kv"><span>健康状况</span><b>' + esc(healthText) + '</b></div>' +
              '</section>' +
              '<section class="pd-sec"><h3>海外与稳定性</h3>' +
                '<div class="pd-kv"><span>海外经历</span><b>' + esc(oh.length ? oh.map(function (x) { return (x.country || '') + ' ' + (x.period || ''); }).join('；') : '无') + '</b></div>' +
                '<div class="pd-kv"><span>家庭支持</span><b>' + esc(r.familySupport || '—') + '</b></div>' +
                '<div class="pd-kv"><span>合同偏好</span><b>' + esc(r.contractPrefer || '面议') + '</b></div>' +
                '<div class="pd-kv"><span>最低接受</span><b>' + esc(r.salaryMinAccept ? r.salaryMinAccept + ' 元/月' : '—') + '</b></div>' +
              '</section>' +
              '<section class="pd-sec"><h3>紧急联系人</h3>' +
                '<div class="pd-kv"><span>姓名</span><b>' + esc(emg.name || '—') + '</b></div>' +
                '<div class="pd-kv"><span>关系</span><b>' + esc(emg.relation || '—') + '</b></div>' +
                '<div class="pd-kv"><span>电话</span><b>' + esc(emg.phone || '—') + '</b></div>' +
              '</section>' +
          '</div>' +
          '<div class="pd-foot"><span>简历编号 ' + esc(r.id || '—') + '</span><span>候选人填写 · 平台结构化展示</span></div>' +
        '</article>';

      root.innerHTML =
        '<div class="mt-stage"><div class="mt-stage-in">' +
          '<div class="mt-doc-top"><div><div class="mt-doc-eyebrow">CANDIDATE RESUME</div>' +
            '<div class="mt-doc-title">简历详情<span>' + esc(r.name || '') + ' · ' + esc(r.title || '') + '</span></div></div>' +
            '<div class="mt-res-act">' + topButtons + '</div></div>' +
          '<div class="docwrap">' + paper + '</div>' +
        '</div></div>';

      var backBtn = root.querySelector('#mtResBack');
      if (backBtn && onBack) backBtn.textContent = '← ' + L('返回分析结果', 'Back to analysis');
      if (backBtn) backBtn.addEventListener('click', function () {
        if (onBack) { onBack(); return; }
        company(root);
      });
      var pb = root.querySelector('#mtResPrint');
      if (pb) pb.addEventListener('click', function () {
        // 只打印简历区：给 body 加标记，@media print 据此隐藏外壳（见 app.html）
        document.body.classList.add('printing-resume');
        var done = function () {
          document.body.classList.remove('printing-resume');
          window.removeEventListener('afterprint', done);
        };
        window.addEventListener('afterprint', done);
        // 兜底：某些浏览器不触发 afterprint
        setTimeout(done, 30000);
        window.print();
      });
      root.querySelector('#mtResMatch').addEventListener('click', function () {
        window.HPS_CFG = { query: 'autorun=1&job=' + encodeURIComponent(jobId) + '&cand=' + encodeURIComponent(candidateId) };
        location.hash = '#/company/stage';
      });
      root.querySelector('#mtResInterview').addEventListener('click', function () {
        (call('company.invite', candidateId, { jobId: jobId }) || api('/api/company/candidates/' + encodeURIComponent(candidateId) + '/interview', { method: 'POST', body: { jobId: jobId, at: '待确认', mode: '视频面试' } }))
          .then(function () { window.HP.toast('已发出面试邀约', r.name + ' 会收到通知'); })
          .catch(function (e) { window.HP.toast('邀约失败', e.message); });
      });
      root.querySelector('#mtResOffer').addEventListener('click', function () {
        var salary = prompt('offer 薪资（元/月）', String(r.salaryExpect || 23000));
        if (salary === null) return;
        (call('company.createOffer', jobId, { candidateId: candidateId, salary: salary + ' 元/月', note: '简历详情页发起' }) ||
          api('/api/company/jobs/' + encodeURIComponent(jobId) + '/offers', { method: 'POST', body: { candidateId: candidateId, salary: salary + ' 元/月' } }))
          .then(function () { window.HP.toast('offer 已发出', r.name + ' · ' + salary + ' 元/月'); })
          .catch(function (e) { window.HP.toast('发送失败', e.message); });
      });
    }).catch(function (e) {
      root.innerHTML = '<div class="mt-stage"><div class="mt-stage-in"><div class="mt-hero">加载简历失败：' + esc(e.message) +
        ' <button class="btn btn-o btn-sm" onclick="location.reload()" style="margin-left:10px">重新加载</button></div></div></div>';
    });
  }

  /* =====================================================================
     独立结果页：完整排名 + 分数 + 行内操作
     ---------------------------------------------------------------------
     用途：分析完成后进入这里查看最终排名（分数只有分析后才展示）。
     数据源：/api/company/jobs/:id/candidates（后端已算好并带分数）
     ===================================================================== */
  function rank(root, opts) {
    if (!root) return;
    var jobId = (opts && opts.jobId) || window.HPS_CFG_JOB || '';
    root.innerHTML = '<div class="mt-stage"><div class="mt-stage-in"><div class="mt-hero"><div class="t-muted">正在读取分析结果…</div></div></div></div>';

    var jobsP = (call('company.jobs') || api('/api/company/jobs'));
    jobsP.then(function (jr) {
      var jobs = (jr && jr.jobs) || [];
      if (!jobs.length) { root.innerHTML = '<div class="mt-stage"><div class="mt-stage-in"><div class="mt-hero">暂无岗位</div></div></div>'; return; }
      var jid = jobId && jobs.some(function (j) { return j.id === jobId; }) ? jobId : jobs[0].id;

      return (call('company.jobCandidates', jid) || api('/api/company/jobs/' + encodeURIComponent(jid) + '/candidates'))
        .then(function (res) {
          var list = ((res && res.list) || []).slice().sort(function (a, b) { return (b.score || 0) - (a.score || 0); });
          var job = res.job || jobs.filter(function (j) { return j.id === jid; })[0] || {};

          root.innerHTML = gradDefs() +
            '<div class="mt-stage"><div class="mt-stage-in">' +
              '<div class="mt-hero">' +
                '<div class="mt-sum-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" style="width:26px;height:26px"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg></div>' +
                '<div class="mt-hero-main">' +
                  '<div class="mt-hero-title">匹配分析结果 <span style="font-weight:400;font-size:12.5px;color:var(--text-2)">' + esc(job.title || '') + ' · ' + esc(job.country || '') + '</span></div>' +
                  '<div class="mt-hero-sub">共 ' + list.length + ' 位候选人 · 按匹配分排名 · 引擎 ' + esc(res.engine || 'rules-v1') + '</div>' +
                '</div>' +
              '</div>' +
              '<div class="mt-toolbar">' +
                '<div class="mt-field"><label>切换岗位</label><select id="mtRankJob">' +
                  jobs.map(function (j) { return '<option value="' + esc(j.id) + '"' + (j.id === jid ? ' selected' : '') + '>' + esc(j.title) + ' · ' + esc(j.country) + '</option>'; }).join('') +
                '</select></div>' +
                '<button class="btn btn-o btn-sm" id="mtRankBack">← 返回候选人列表</button>' +
                '<div style="flex:1"></div><div id="mtRankChip"></div>' +
              '</div>' +
              '<div class="mt-rank-list" id="mtRankList"></div>' +
            '</div></div>';
          backendChip(root.querySelector('#mtRankChip'));

          var box = root.querySelector('#mtRankList');
          if (!list.length) { box.innerHTML = '<div class="t-muted" style="padding:24px 0">该岗位暂无候选人</div>'; return; }

          box.innerHTML = list.map(function (c, i) {
            var sc = c.score || 0;
            var cls = sc >= 80 ? 'hi' : (sc >= 60 ? 'mid' : 'low');
            return '<div class="mt-rank-row" data-cand="' + esc(c.candidateId) + '">' +
              '<div class="mt-rr-no">' + (i + 1) + '</div>' +
              (c.photo ? '<img class="mt-rr-photo" src="' + esc(c.photo) + '" alt="">'
                       : '<div class="mt-rr-photo ph">' + esc((c.name || '?').slice(0, 1)) + '</div>') +
              '<div class="mt-rr-main">' +
                '<div class="mt-rr-name">' + esc(c.name) +
                  (c.blocked ? '<span class="chip chip-i" style="margin-left:8px">门槛未过</span>' : '') + '</div>' +
                '<div class="mt-rr-sub">' + esc(c.title || '') + ' · ' + (c.years || 0) + ' 年 · ' +
                  (c.education || '') + (c.city ? ' · ' + esc(c.city) : '') + '</div>' +
                '<div class="mt-f-info" style="padding-left:0;margin-top:6px">' +
                  '<span class="mt-f-kv"><i>到岗</i><b>' + (c.availabilityDays ? c.availabilityDays + ' 天' : '待确认') + '</b></span>' +
                  '<span class="mt-f-kv"><i>期望</i><b>' + (c.salaryExpect ? (Math.round(Number(c.salaryExpect) / 100) / 10) + 'K' : '面议') + '</b></span>' +
                  '<span class="mt-f-kv"><i>证件</i><b>' + (c.blocked ? '待补' : (c.healthCert ? '齐全' : '部分')) + '</b></span>' +
                '</div>' +
              '</div>' +
              '<div class="mt-rr-score ' + cls + '"><b>' + sc + '</b><small>匹配分</small></div>' +
              '<div class="mt-rr-act">' +
                '<button class="btn btn-o btn-sm" data-act="detail">查看详情</button>' +
                '<button class="btn btn-o btn-sm" data-act="interview">邀面试</button>' +
                '<button class="btn btn-p btn-sm" data-act="offer">发 offer</button>' +
              '</div>' +
            '</div>';
          }).join('');

          /* 行内操作 */
          Array.prototype.forEach.call(box.querySelectorAll('.mt-rank-row'), function (rowEl) {
            var cid = rowEl.dataset.cand;
            var c = list.filter(function (x) { return x.candidateId === cid; })[0] || {};
            Array.prototype.forEach.call(rowEl.querySelectorAll('[data-act]'), function (btn) {
              btn.addEventListener('click', function (ev) {
                ev.stopPropagation();
                var act = btn.dataset.act;
                if (act === 'detail') { showDetail(root, cid, jid, c); return; }
                if (act === 'interview') {
                  (call('company.invite', cid, { jobId: jid }) || api('/api/company/candidates/' + encodeURIComponent(cid) + '/interview', { method: 'POST', body: { jobId: jid } }))
                    .then(function () { window.HP.toast('已发出面试邀约', c.name || cid); })
                    .catch(function (e) { window.HP.toast('邀约失败', e.message); });
                  return;
                }
                if (act === 'offer') {
                  var salary = prompt('offer 薪资（元/月）', String(c.salaryExpect || 23000));
                  if (salary === null) return;
                  (call('company.createOffer', jid, { candidateId: cid, salary: salary + ' 元/月' }) ||
                    api('/api/company/jobs/' + encodeURIComponent(jid) + '/offers', { method: 'POST', body: { candidateId: cid, salary: salary + ' 元/月' } }))
                    .then(function () { window.HP.toast('offer 已发出', (c.name || cid) + ' · ' + salary + ' 元/月'); })
                    .catch(function (e) { window.HP.toast('发送失败', e.message); });
                }
              });
            });
            /* 整行点击 = 看详情（直接出结果，不播虚拟分析过程） */
            rowEl.addEventListener('click', function () { showDetail(root, cid, jid, c); });
          });

          root.querySelector('#mtRankJob').addEventListener('change', function (e) {
            window.HPS_CFG_JOB = e.target.value;
            rank(root, { jobId: e.target.value });
          });
          var backRankBtn = root.querySelector('#mtRankBack');
          /* 返回顺序：结果页 → 分析页 → 候选人列表（与分析页的快照还原配合） */
          var rankFromStage = !!window.__hpFromStage;
          backRankBtn.textContent = rankFromStage ? '← 返回分析界面' : '← 返回候选人列表';
          backRankBtn.addEventListener('click', function () {
            if (rankFromStage) {
              window.__hpFromStage = false;
              location.hash = '#/company/stage';   // mount 会读取快照还原
            } else {
              location.hash = '#/company/match';
            }
          });
        });
    }).catch(function (e) {
      root.innerHTML = '<div class="mt-stage"><div class="mt-stage-in"><div class="mt-hero">' + L('加载失败：', 'Load failed: ') + esc(e.message) + '</div></div></div>';
    });
  }

  /* =====================================================================
     详情面板：从排名点进去看某人的 图片 + 匹配评分 + 推理过程
     ---------------------------------------------------------------------
     与"分析页"的区别（按需求设计）：
       · 不重播虚拟分析动画，直接呈现结果
       · 展示：头像照片、匹配总分与分项、9 步推理要点、亮点/风险、
               以及后续操作（邀面试 / 发 offer / 查看完整简历）
     ===================================================================== */
  /* 面试考察雷达：6 个分项按满分归一化后画多边形 */
  var IQ_CSS = '' +
    '.mt-iq{display:flex;gap:10px;align-items:flex-start;padding:11px 0;border-bottom:1px dashed var(--border)}' +
    '.mt-iq:last-child{border-bottom:0}' +
    '.mt-iq .chip{flex:0 0 auto;margin-top:2px}' +
    '.mt-iq-q{font-size:13px;line-height:1.65;color:var(--text)}' +
    '.mt-iq-w{font-size:11.5px;color:var(--text-3);margin-top:4px}' +
    '.mt-d-ct-sub{margin-left:8px;font-size:11px;font-weight:400;color:var(--text-3)}' +
    '.mt-iq-legend{font-size:11px;color:var(--text-3);text-align:center;margin-top:4px}';
  function injectIqCss() {
    if (document.getElementById('mtIqCss')) return;
    var st = document.createElement('style'); st.id = 'mtIqCss'; st.textContent = IQ_CSS;
    document.head.appendChild(st);
  }
  function drawIqRadar(panel, parts) {
    var cv = panel.querySelector('#mtIqRadar');
    if (!cv) return;
    var dpr = window.devicePixelRatio || 1;
    var w = cv.clientWidth || 320, h = cv.clientHeight || 230;
    cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
    var ctx = cv.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var KEYS = ['skill', 'cert', 'salary', 'location', 'exp', 'availability'];
    var MAX = { skill: 40, cert: 20, salary: 15, location: 10, exp: 10, availability: 5 };
    var LABEL = I18.isEn()
      ? { skill: 'Skill', cert: 'Cert', salary: 'Pay', location: 'Location', exp: 'Exp', availability: 'Availability' }
      : { skill: '技能', cert: '证书', salary: '薪资', location: '地点', exp: '经验', availability: '可用性' };
    var n = KEYS.length;
    var cx = w / 2, cy = h / 2 + 2, R = Math.min(w, h) / 2 - 34;
    var css = getComputedStyle(document.documentElement);
    var cBorder = css.getPropertyValue('--border').trim() || '#25324a';
    var cText2 = css.getPropertyValue('--text-2').trim() || '#9db2cb';
    var cPrim = css.getPropertyValue('--primary').trim() || '#38bdf8';
    function pt(i, ratio) {
      var a = -Math.PI / 2 + i * 2 * Math.PI / n;
      return [cx + Math.cos(a) * R * ratio, cy + Math.sin(a) * R * ratio];
    }
    /* 网格：4 圈 */
    for (var r = 1; r <= 4; r++) {
      ctx.beginPath();
      for (var i = 0; i < n; i++) { var p = pt(i, r / 4); i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); }
      ctx.closePath();
      ctx.strokeStyle = cBorder; ctx.globalAlpha = .55; ctx.stroke(); ctx.globalAlpha = 1;
    }
    /* 轴 */
    for (var i2 = 0; i2 < n; i2++) {
      var p2 = pt(i2, 1);
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(p2[0], p2[1]);
      ctx.strokeStyle = cBorder; ctx.globalAlpha = .5; ctx.stroke(); ctx.globalAlpha = 1;
    }
    /* 得分多边形 */
    ctx.beginPath();
    KEYS.forEach(function (k, i3) {
      var v = Math.max(0, Math.min(1, Number(parts[k] || 0) / (MAX[k] || 1)));
      var p3 = pt(i3, v);
      i3 ? ctx.lineTo(p3[0], p3[1]) : ctx.moveTo(p3[0], p3[1]);
    });
    ctx.closePath();
    ctx.fillStyle = 'rgba(56,189,248,.18)'; ctx.fill();
    ctx.strokeStyle = cPrim; ctx.lineWidth = 2; ctx.stroke();
    /* 顶点 */
    KEYS.forEach(function (k, i4) {
      var v = Math.max(0, Math.min(1, Number(parts[k] || 0) / (MAX[k] || 1)));
      var p4 = pt(i4, v);
      ctx.beginPath(); ctx.arc(p4[0], p4[1], 3, 0, Math.PI * 2);
      ctx.fillStyle = cPrim; ctx.fill();
      var lp = pt(i4, 1.2);
      ctx.fillStyle = cText2; ctx.font = '11.5px "Microsoft YaHei",system-ui,sans-serif';
      ctx.textAlign = lp[0] > cx + 4 ? 'left' : (lp[0] < cx - 4 ? 'right' : 'center');
      ctx.textBaseline = 'middle';
      ctx.fillText(LABEL[k] + ' ' + Math.round(Number(parts[k] || 0)) + '/' + MAX[k], lp[0], lp[1]);
    });
  }

  function showDetail(root, candidateId, jobId, summary) {
    injectIqCss();
    var wrap = root.querySelector('.mt-stage-in') || root;
    var back = wrap.querySelector('#mtRankList');
    if (back) back.style.display = 'none';
    var old = wrap.querySelector('#mtDetail');
    if (old) old.remove();

    var panel = document.createElement('div');
    panel.id = 'mtDetail';
    panel.className = 'mt-detail';
    panel.innerHTML = '<div class="t-muted" style="padding:24px 0">正在生成结果…</div>';
    wrap.appendChild(panel);

    Promise.all([
      api('/api/match/trace?jobId=' + encodeURIComponent(jobId) + '&candidateId=' + encodeURIComponent(candidateId) +
          '&lang=' + ((window.HPI18N && window.HPI18N.lang()) || 'zh')).catch(function () { return null; }),
      (call('company.resume', candidateId) || api('/api/company/resumes/' + encodeURIComponent(candidateId))).catch(function () { return {}; })
    ]).then(function (res) {
      var trace = res[0] || {};
      var r = (res[1] && res[1].resume) || {};
      var c = summary || {};
      var score = trace.score != null ? trace.score : (c.score || 0);
      var parts = trace.parts || c.parts || {};
      var cls = score >= 80 ? 'hi' : (score >= 60 ? 'mid' : 'low');
      var photo = r.photo || c.photo || '';

      /* 分项条 */
      var PART_LABEL = { skill: '技能', cert: '证书', salary: '薪资', location: '地点', exp: '经验', availability: '可用性' };
      var bars = Object.keys(PART_LABEL).map(function (k) {
        var v = Number(parts[k] || 0);
        return '<div class="mt-d-bar"><span>' + PART_LABEL[k] + '</span>' +
          '<i class="mt-d-track"><b style="width:' + Math.min(100, v) + '%"></b></i>' +
          '<em>' + v + '</em></div>';
      }).join('');

      /* ===== 面试提问建议：从技能缺口 / 薪资 / 稳定性 / 证件 / 语言风险生成 ===== */
      var gaps = [];
      (trace.steps || []).forEach(function (s) {
        var m = /缺口[：:]([^。；;]+)/.exec(s.detail || '');
        if (m) m[1].split(/[、,，]/).forEach(function (x) { var v = String(x).trim(); if (v) gaps.push(v); });
      });
      var riskText = ((trace.reasons || {}).risks || []).join(' ');
      var qs = [];
      var Q = function (tag, text, why) { if (qs.length < 8) qs.push({ tag: tag, text: text, why: why }); };

      gaps.slice(0, 3).forEach(function (g) {
        Q(L('技能验证', 'Skill check'),
          L('上一份工作里，你具体怎么用「' + g + '」？请讲一个最近的例子。',
            'In your last job, how exactly did you use "' + g + '"? A recent example.'),
          L('确认是否真的具备 ' + g, 'Verify ' + g));
      });
      if (/薪资|期望/.test(riskText) || Number(parts.salary || 0) < 10) {
        var expK = Math.round(Number(r.salaryExpect || c.salaryExpect || 0) / 100) / 10;
        Q(L('薪资/动机', 'Pay & motive'),
          L('岗位预算 20–25K，你期望 ' + (expK || '—') + 'K，这个差距你怎么考虑？',
            'The budget is 20–25K vs your expectation ' + (expK || '—') + 'K — how do you see the gap?'),
          L('判断薪资能否谈拢、动机是否真实', 'Check salary fit and real motivation'));
      }
      if (/海外|跨文化|驻外|外派/.test(riskText) || !(r.overseasExp || c.overseasExp)) {
        Q(L('稳定性', 'Stability'),
          L('为什么想去海外？家人支持长期外派吗？', 'Why overseas? Does your family support a long assignment?'),
          L('外派动机与家庭支持', 'Motivation and family support'));
      }
      if (/证件|护照|健康证|无犯罪/.test(riskText)) {
        Q(L('合规', 'Compliance'),
          L('护照、健康证、无犯罪公证什么时候能备齐？', 'When can passport, health certificate and police clearance be ready?'),
          L('确认出境材料时间是否赶得上', 'Check document timeline'));
      }
      if (/语言|英文|外语/.test(riskText)) {
        Q(L('语言', 'Language'),
          L('现场需要看懂英文设备手册，你实际用过吗？', 'The site requires English manuals — have you used them?'),
          L('语言能否支撑上岗', 'Check language readiness'));
      }
      if (/工艺|适应|差异|经验/.test(riskText)) {
        Q(L('经验核实', 'Experience'),
          L('你之前做的是注塑，这次是玻璃压机，工艺差别你怎么补？', 'You did injection molding; this is a glass press — how will you close the process gap?'),
          L('看学习与迁移能力', 'Check learning and transferability'));
      }
      var availDays = Number(r.availabilityDays || c.availabilityDays || 0);
      if (availDays > 30) {
        Q(L('到岗时间', 'Availability'),
          L('岗位希望尽快到岗，你这边 ' + availDays + ' 天，能提前吗？', 'The role needs someone soon; you need ' + availDays + ' days — can it be earlier?'),
          L('确认到岗节奏', 'Confirm start timeline'));
      }
      Q(L('动因', 'Motivation'), L('为什么选这个国家、这个岗位？', 'Why this country and this role?'),
        L('判断选择是否想清楚', 'Check whether the choice is thought through'));
      Q(L('落地', 'Plan'), L('入职前三个月，你希望达成什么？', 'What do you want to achieve in the first three months?'),
        L('看目标感与计划性', 'Check goals and planning'));

      var iqHtml = qs.map(function (q) {
        return '<div class="mt-iq"><span class="chip chip-i">' + esc(q.tag) + '</span>' +
          '<div><div class="mt-iq-q">' + esc(q.text) + '</div>' +
          '<div class="mt-iq-w">' + L('考察点：', 'Look for: ') + esc(q.why) + '</div></div></div>';
      }).join('');

      var reasons = trace.reasons || {};
      var li = function (arr, cls2) {
        return (arr || []).map(function (x) { return '<li class="' + cls2 + '">' + esc(x) + '</li>'; }).join('');
      };

      panel.innerHTML =
        '<div class="mt-d-head">' +
          (photo ? '<img class="mt-d-photo" src="' + esc(photo) + '" alt="">'
                 : '<div class="mt-d-photo ph">' + esc((r.name || c.name || '?').slice(0, 1)) + '</div>') +
          '<div class="mt-d-id">' +
            '<div class="mt-d-name">' + esc(r.name || c.name || '') +
              (c.blocked ? '<span class="chip chip-i" style="margin-left:8px">门槛未过</span>' : '') + '</div>' +
            '<div class="mt-d-sub">' + esc(r.title || c.title || '') + ' · ' + (r.years || c.years || 0) + ' 年 · ' +
              esc(r.education || c.education || '') + (r.city || c.city ? ' · ' + esc(r.city || c.city) : '') + '</div>' +
            '<div class="mt-f-info" style="padding-left:0;margin-top:8px">' +
              '<span class="mt-f-kv"><i>到岗</i><b>' + (r.availabilityDays || c.availabilityDays ? (r.availabilityDays || c.availabilityDays) + ' 天' : '待确认') + '</b></span>' +
              '<span class="mt-f-kv"><i>期望</i><b>' + ((r.salaryExpect || c.salaryExpect) ? (Math.round(Number(r.salaryExpect || c.salaryExpect) / 100) / 10) + 'K' : '面议') + '</b></span>' +
              '<span class="mt-f-kv"><i>证件</i><b>' + (c.blocked ? '待补' : ((r.healthCert || c.healthCert) ? '齐全' : '部分')) + '</b></span>' +
            '</div>' +
          '</div>' +
          '<div class="mt-d-score ' + cls + '"><b>' + score + '</b><small>匹配度</small></div>' +
          '<div class="mt-d-act">' +
            '<button class="btn btn-o btn-sm" id="mtDResume">完整简历</button>' +
            '<button class="btn btn-o btn-sm" id="mtDInterview">邀面试</button>' +
            '<button class="btn btn-p btn-sm" id="mtDOffer">发 offer</button>' +
            '<button class="btn btn-o btn-sm" id="mtDBack">← 返回排名</button>' +
          '</div>' +
        '</div>' +
        '<div class="mt-d-grid">' +
          '<div class="mt-d-card"><div class="mt-d-ct">分项得分</div>' + bars + '</div>' +
          '<div class="mt-d-card"><div class="mt-d-ct">推荐理由</div>' +
            '<ul class="mt-d-list">' + li(reasons.highlights, 'ok') + '</ul>' +
            '<div class="mt-d-ct" style="margin-top:12px">风险提示</div>' +
            '<ul class="mt-d-list">' + li(reasons.risks, 'warn') + '</ul>' +
          '</div>' +
        '</div>' +
        '<div class="mt-d-grid" style="margin-top:14px">' +
          '<div class="mt-d-card"><div class="mt-d-ct">' + L('面试提问建议', 'Interview questions') +
            '<span class="mt-d-ct-sub">' + qs.length + L(' 条 · 按缺口与风险生成', ' from gaps & risks') + '</span></div>' +
            iqHtml + '</div>' +
          '<div class="mt-d-card"><div class="mt-d-ct">' + L('考察重点分布', 'Focus radar') + '</div>' +
            '<canvas id="mtIqRadar" style="width:100%;height:230px;display:block"></canvas>' +
            '<div class="mt-iq-legend">' + L('分数按各分项满分归一化', 'Normalized to each part maximum') + '</div></div>' +
        '</div>';

      drawIqRadar(panel, parts);

      /* 操作绑定 */
      panel.querySelector('#mtDBack').addEventListener('click', function () {
        panel.remove();
        if (back) back.style.display = '';
      });
      panel.querySelector('#mtDResume').addEventListener('click', function () {
        /* 从分析结果页进入：返回时重绘分析结果页并恢复这个人的详情面板。
           注意：简历页会整体替换 root，直接调用 showDetail 会把面板插到简历页里，
           看起来像“返回没反应”，所以先重绘榜单、等它渲染完再打开详情。 */
        openResume(root, candidateId, jobId, {
          onBack: function () {
            try { rank(root, { jobId: jobId }); } catch (e) { company(root); return; }
            var tries = 0;
            var timer = setInterval(function () {
              tries++;
              if (root.querySelector('#mtRankList')) {
                clearInterval(timer);
                showDetail(root, candidateId, jobId, summary);
              } else if (tries > 40) {
                clearInterval(timer);
              }
            }, 150);
          }
        });
      });
      panel.querySelector('#mtDInterview').addEventListener('click', function () {
        (call('company.invite', candidateId, { jobId: jobId }) ||
          api('/api/company/candidates/' + encodeURIComponent(candidateId) + '/interview', { method: 'POST', body: { jobId: jobId } }))
          .then(function () { window.HP.toast('已发出面试邀约', r.name || c.name || candidateId); })
          .catch(function (e) { window.HP.toast('邀约失败', e.message); });
      });
      panel.querySelector('#mtDOffer').addEventListener('click', function () {
        var salary = prompt('offer 薪资（元/月）', String(r.salaryExpect || c.salaryExpect || 23000));
        if (salary === null) return;
        (call('company.createOffer', jobId, { candidateId: candidateId, salary: salary + ' 元/月' }) ||
          api('/api/company/jobs/' + encodeURIComponent(jobId) + '/offers', { method: 'POST', body: { candidateId: candidateId, salary: salary + ' 元/月' } }))
          .then(function () { window.HP.toast('offer 已发出', (r.name || c.name || candidateId) + ' · ' + salary + ' 元/月'); })
          .catch(function (e) { window.HP.toast('发送失败', e.message); });
      });
    }).catch(function (e) {
      panel.innerHTML = '<div class="t-muted" style="padding:20px 0">加载详情失败：' + esc(e.message) + '</div>';
    });
  }

  /* =====================================================================
     应聘者侧独立结果页：岗位排名 + 匹配分 + 行内操作（投递/收藏/详情）
     与「AI 匹配推荐」的区别：这里直接呈现分数与排名（已分析完）
     ===================================================================== */
  function personaRank(root, opts) {
    if (!root) return;
    root.innerHTML = '<div class="mt-stage"><div class="mt-stage-in"><div class="mt-hero"><div class="t-muted">正在读取分析结果…</div></div></div></div>';

    (call('persona.recommendations') || api('/api/persona/recommendations')).then(function (rec) {
      var cand = rec.candidate || {};
      var full = (rec.list || []).slice().sort(function (a, b) { return (b.score || 0) - (a.score || 0); });

      /* 只展示「本次分析选中的岗位」。
         优先用 window.__hpPickedJobs（用户实际勾选的），
         其次退回配置里的 jobs 参数；都没有才显示全部。 */
      var picked = null;
      if (window.__hpPickedJobs && window.__hpPickedJobs.length) picked = window.__hpPickedJobs;
      if (!picked) {
        var qs = String((window.HPS_CFG && window.HPS_CFG.query) || '').match(/(?:^|&)jobs=([^&]*)/);
        if (qs) picked = decodeURIComponent(qs[1]).split(',').map(function (x) { return x.trim(); }).filter(Boolean);
      }
      var list = picked && picked.length
        ? full.filter(function (x) { return picked.indexOf(x.jobId) >= 0; })
        : full;
      if (picked && picked.length && list.length) {
        var ordered = picked.map(function (id) {
          return list.filter(function (x) { return x.jobId === id; })[0];
        }).filter(Boolean);
        if (ordered.length) list = ordered;
      }

      root.innerHTML = gradDefs() +
        '<div class="mt-stage"><div class="mt-stage-in">' +
          '<div class="mt-hero">' +
            '<div class="mt-sum-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" style="width:26px;height:26px"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg></div>' +
            '<div class="mt-hero-main">' +
              '<div class="mt-hero-title">岗位匹配结果 <span style="font-weight:400;font-size:12.5px;color:var(--text-2)">' + esc(cand.name || '我') + '</span></div>' +
              '<div class="mt-hero-sub">共 ' + list.length + ' 个岗位 · 按匹配分排名</div>' +
            '</div>' +
            '<div style="flex:none;text-align:right"><div id="mtPRankChip"></div></div>' +
          '</div>' +
          '<div class="mt-toolbar">' +
            '<button class="btn btn-o btn-sm" id="mtPRankBack">← 返回推荐列表</button>' +
            '<div style="flex:1"></div>' +
          '</div>' +
          '<div class="mt-rank-list" id="mtPRankList"></div>' +
          '<div class="mt-pager" id="mtPRankPager"></div>' +
        '</div></div>';
      backendChip(root.querySelector('#mtPRankChip'));

      var box = root.querySelector('#mtPRankList');
      if (!list.length) { box.innerHTML = '<div class="t-muted" style="padding:24px 0">暂无推荐岗位</div>'; return; }

      /* 分页：推荐岗位过多时分页展示 */
      var PER_P = 10;
      var pgBox = root.querySelector('#mtPRankPager');
      var page = (window.__prankPage || 1);
      var pages = Math.max(1, Math.ceil(list.length / PER_P));
      if (page > pages) page = pages;
      if (page < 1) page = 1;
      window.__prankPage = page;
      var startP = (page - 1) * PER_P;
      var pageList = list.slice(startP, startP + PER_P);

      box.innerHTML = pageList.map(function (x, i) {
        var abs = startP + i;
        var sc = x.score || 0;
        var cls = sc >= 80 ? 'hi' : (sc >= 60 ? 'mid' : 'low');
        return '<div class="mt-rank-row" data-job="' + esc(x.jobId) + '">' +
          '<div class="mt-rr-no">' + (abs + 1) + '</div>' +
          '<div class="mt-rr-main">' +
            '<div class="mt-rr-name">' + esc(x.jobTitle) +
              (x.favorite ? '<span class="chip chip-g" style="margin-left:8px">已收藏</span>' : '') +
              (x.applied ? '<span class="chip chip-i" style="margin-left:6px">已投递</span>' : '') + '</div>' +
            '<div class="mt-rr-sub">' + esc(x.employer || '') + ' · ' + esc(x.country || '') +
              (x.city ? ' · ' + esc(x.city) : '') + ' · ' + esc(x.salary || '面议') +
              ' · 招聘 ' + (x.headcount || 0) + ' 人</div>' +
            '<div class="mt-f-info" style="padding-left:0;margin-top:6px">' +
              '<span class="mt-f-kv"><i>命中</i><b>' + ((x.hits || []).length) + ' 项</b></span>' +
              '<span class="mt-f-kv"><i>缺口</i><b>' + ((x.gaps || []).length) + ' 项</b></span>' +
              '<span class="mt-f-kv"><i>状态</i><b>' + (x.applied ? '已投递' : '可投递') + '</b></span>' +
            '</div>' +
          '</div>' +
          '<div class="mt-rr-score ' + cls + '"><b>' + sc + '</b><small>匹配分</small></div>' +
          '<div class="mt-rr-act">' +
            '<button class="btn btn-o btn-sm" data-act="detail">查看详情</button>' +
            '<button class="btn btn-o btn-sm" data-act="fav">' + (x.favorite ? '取消收藏' : '收藏') + '</button>' +
            '<button class="btn btn-p btn-sm" data-act="apply">' + (x.applied ? '已投递' : '投递简历') + '</button>' +
          '</div>' +
        '</div>';
      }).join('');

      Array.prototype.forEach.call(box.querySelectorAll('.mt-rank-row'), function (rowEl) {
        var jid = rowEl.dataset.job;
        var x = list.filter(function (y) { return y.jobId === jid; })[0] || {};
        Array.prototype.forEach.call(rowEl.querySelectorAll('[data-act]'), function (btn) {
          btn.addEventListener('click', function (ev) {
            ev.stopPropagation();
            var act = btn.dataset.act;
            if (act === 'detail') { modalTraceFromApi(jid, cand.id, x.jobTitle); return; }
            if (act === 'fav') {
              var on = !x.favorite;
              (call(on ? 'persona.addFavorite' : 'persona.removeFavorite', jid) || api('/api/persona/favorites/' + encodeURIComponent(jid), { method: on ? 'POST' : 'DELETE' }))
                .then(function () { x.favorite = on; personaRank(root, opts); window.HP.toast(on ? '已收藏' : '已取消收藏', x.jobTitle); })
                .catch(function (e) { window.HP.toast('操作失败', e.message); });
              return;
            }
            if (act === 'apply') {
              if (x.applied) { window.HP.toast('已投递', '你已投递过该岗位'); return; }
              /* 投递前让用户选择用哪份简历 */
              applyWithResumeChoice(jid, x.jobTitle, function () {
                (call('persona.apply', jid) || api('/api/persona/jobs/' + encodeURIComponent(jid) + '/apply', { method: 'POST' }))
                  .then(function () { x.applied = true; personaRank(root, opts); window.HP.toast('投递成功', x.jobTitle); })
                  .catch(function (e) { window.HP.toast('投递失败', e.message); });
              });
            }
          });
        });
        /* 点整行（按钮除外）→ 打开岗位详情的独立界面 */
        rowEl.addEventListener('click', function (ev) {
          if (ev.target.closest('button')) return;
          openJob(root, jid, function () { personaRank(root, opts); });
        });
      });

      /* 返回顺序：结果页 → 分析页 → 推荐列表
         如果这次是从分析页点「查看结果」过来的，先回分析页；
         否则直接回推荐列表。 */
      var backBtn = root.querySelector('#mtPRankBack');
      var fromStage = !!window.__hpFromStage;
      backBtn.textContent = fromStage ? '← 返回分析界面' : '← 返回推荐列表';
      backBtn.addEventListener('click', function () {
        if (fromStage) {
          window.__hpFromStage = false;
          location.hash = '#/persona/stage';
        } else {
          location.hash = '#/persona/match';
        }
      });

      /* 分页条 */
      (function renderPRankPager() {
        if (!pgBox) return;
        if (pages <= 1) { pgBox.innerHTML = '<span class="t-muted">共 ' + list.length + ' 个岗位</span>'; return; }
        var nums = '';
        for (var i = 1; i <= pages; i++) {
          if (pages > 9 && i > 2 && i < pages - 1 && Math.abs(i - page) > 1) {
            if (!nums.endsWith('…')) nums += '<span class="t-muted" style="padding:0 4px">…</span>';
            continue;
          }
          nums += '<button class="btn ' + (i === page ? 'btn-p' : 'btn-o') + ' btn-sm" data-pp="' + i + '">' + i + '</button>';
        }
        pgBox.innerHTML =
          '<span class="t-muted">共 ' + list.length + ' 个 · 第 ' + page + '/' + pages + ' 页</span>' +
          '<button class="btn btn-o btn-sm" data-pp="prev"' + (page <= 1 ? ' disabled' : '') + '>上一页</button>' +
          nums +
          '<button class="btn btn-o btn-sm" data-pp="next"' + (page >= pages ? ' disabled' : '') + '>下一页</button>';
        Array.prototype.forEach.call(pgBox.querySelectorAll('[data-pp]'), function (b) {
          b.addEventListener('click', function () {
            var v = b.dataset.pp;
            if (v === 'prev') window.__prankPage = Math.max(1, page - 1);
            else if (v === 'next') window.__prankPage = Math.min(pages, page + 1);
            else window.__prankPage = Number(v) || 1;
            personaRank(root, opts);
          });
        });
      })();
    }).catch(function (e) {
      root.innerHTML = '<div class="mt-stage"><div class="mt-stage-in"><div class="mt-hero">' + L('加载失败：', 'Load failed: ') + esc(e.message) + '</div></div></div>';
    });
  }

  /* 取某岗位的推理结果并弹窗展示（不播动画，直接出结果） */
  function modalTraceFromApi(jobId, candidateId, title) {
    window.HP.toast('加载中', '正在生成匹配详情…');
    (call('persona.matchTrace', jobId, candidateId) ||
      api('/api/match/trace?jobId=' + encodeURIComponent(jobId) + '&candidateId=' + encodeURIComponent(candidateId) +
          '&lang=' + ((window.HPI18N && window.HPI18N.lang()) || 'zh')))
      .then(function (trace) { modalTrace(trace, '我 × ' + (title || '')); })
      .catch(function (e) { window.HP.toast('加载失败', e.message); });
  }

  /* =====================================================================
     应聘者侧「岗位详情」独立页面（#/persona/job）
     ---------------------------------------------------------------------
     从分析页点榜单行进入：真正的路由跳转，URL 会变。
     返回按钮回到分析界面，并靠分析页的快照还原，不重播动画。
     ===================================================================== */
  function personaJob(root, jobId, onBack) {
    if (!root) return;
    root.innerHTML = '<div class="mt-stage"><div class="mt-stage-in"><div class="mt-hero"><div class="t-muted">正在加载岗位详情…</div></div></div></div>';

    Promise.all([
      (call('persona.job', jobId) || api('/api/persona/jobs/' + encodeURIComponent(jobId))).catch(function () { return null; }),
      (call('persona.recommendations') || api('/api/persona/recommendations')).catch(function () { return null; })
    ]).then(function (arr) {
      var jobRes = arr[0], recRes = arr[1];
      var j = (jobRes && (jobRes.job || jobRes)) || {};
      var hit = ((recRes && recRes.list) || []).filter(function (x) { return x.jobId === jobId; })[0] || {};
      var spec = hit.spec || j.spec || {};
      var row = function (k, v) {
        return '<div class="rz-row"><span>' + esc(k) + '</span><b>' +
          ((v === undefined || v === null || v === '') ? '—' : esc(String(v))) + '</b></div>';
      };
      var reqs = (j.requirements || []).map(function (r, i) {
        return '<div class="rz-hist"><div class="rz-hist-h"><b>要求 ' + (i + 1) + '</b></div>' +
          '<div class="rz-hist-d">' + esc(r) + '</div></div>';
      }).join('') || '<div class="t-muted">暂无明确要求</div>';
      var skills = (spec.skills || j.skills || []).map(function (s) {
        return '<span class="chip chip-i">' + esc(s) + '</span>';
      }).join('') || '<span class="t-muted">—</span>';
      var P = hit.parts || {};
      var maxp = { skill: 40, cert: 20, salary: 15, location: 10, exp: 10, availability: 5 };
      var labels = { skill: '技能', cert: '证书', salary: '薪资', location: '地点', exp: '经验', availability: '可用性' };
      var bars = Object.keys(maxp).map(function (k) {
        var v = Number(P[k] || 0);
        var pct = Math.max(0, Math.min(100, Math.round(v / maxp[k] * 100)));
        return '<div class="hps-jo-bar"><span>' + labels[k] + '</span>' +
          '<i><b style="width:' + pct + '%"></b></i><em>' + v + '</em></div>';
      }).join('');
      var score = (hit.score != null) ? hit.score : null;

      root.innerHTML = gradDefs() +
        '<div class="mt-stage"><div class="mt-stage-in">' +
          '<div class="mt-res-head">' +
            '<div class="mt-res-photo ph" style="width:96px;height:120px;font-size:30px">岗</div>' +
            '<div class="mt-res-main">' +
              '<div class="mt-res-name">' + esc(j.title || hit.jobTitle || '岗位') +
                '<span>' + esc(j.employer || hit.employer || '') + '</span></div>' +
              '<div class="mt-res-sub">' + esc(j.country || hit.country || '') +
                (j.city ? ' · ' + esc(j.city) : '') + ' · 招聘 ' + (j.headcount || 0) +
                ' 人 · 更新 ' + esc(j.updatedAt || '—') + '</div>' +
              '<div class="mt-chips" style="margin-top:8px">' +
                '<span class="chip chip-i">' + esc(j.salary || hit.salary || '面议') + '</span>' +
                '<span class="chip chip-g">' + esc(j.status || '招聘中') + '</span>' +
                (hit.applied ? '<span class="chip chip-i">已投递</span>' : '') +
                (hit.favorite ? '<span class="chip chip-g">已收藏</span>' : '') +
                (score !== null ? '<span class="chip ' + (score >= 80 ? 'chip-g' : 'chip-i') + '">匹配分 ' + score + '</span>' : '') +
              '</div>' +
            '</div>' +
            '<div class="mt-res-act">' +
              '<button class="btn btn-p btn-sm" id="mtJobApply">' + (hit.applied ? '已投递' : '投递简历') + '</button>' +
              '<button class="btn btn-o btn-sm" id="mtJobFav">' + (hit.favorite ? '取消收藏' : '收藏') + '</button>' +
              '<button class="btn btn-o btn-sm" id="mtJobBack">← 返回分析界面</button>' +
            '</div>' +
          '</div>' +
          '<div class="rz-wrap">' +
            '<div class="rz-col">' +
              '<div class="rz-card"><div class="rz-title">岗位信息</div>' +
                row('岗位名称', j.title) + row('用工企业', j.employer) +
                row('工作地点', String(j.country || '') + (j.city ? ' ' + j.city : '')) +
                row('薪资待遇', j.salary) + row('招聘人数', (j.headcount || 0) + ' 人') +
                row('岗位状态', j.status) + row('更新时间', j.updatedAt) +
              '</div>' +
              '<div class="rz-card"><div class="rz-title">福利待遇</div>' +
                row('食宿', '企业提供') + row('机票', '往返报销') +
                row('保险', '商业保险 100 万') + row('签证', '企业办理') +
                row('休假', '半年一休 / 15 天带薪') + row('通讯', '提供本地 SIM 卡') +
              '</div>' +
            '</div>' +
            '<div class="rz-col">' +
              '<div class="rz-card"><div class="rz-title">岗位职责</div>' +
                '<div style="font-size:13px;line-height:1.85;color:var(--text)">' +
                esc(j.description || ((j.title || '该岗位') + '（' + (j.employer || '') + '）需要你负责产线日常运行：按工艺要求完成生产任务、做好首件确认与过程自检、发现异常及时处理或上报，并与当地员工协作完成交接班。')) +
                '</div></div>' +
              '<div class="rz-card"><div class="rz-title">任职要求</div>' + reqs + '</div>' +
              '<div class="rz-card"><div class="rz-title">技能要求</div>' +
                '<div class="mt-chips" style="margin-top:8px">' + skills + '</div></div>' +
            '</div>' +
            '<div class="rz-col">' +
              '<div class="rz-card"><div class="rz-title">证书与语言</div>' +
                row('证书', ((spec.certs || []).join(' / ') || '无硬性证书要求')) +
                row('语言', ((spec.languages || []).map(function (l) { return l.code || l; }).join(' / ') || '无语言要求')) +
              '</div>' +
              '<div class="rz-card"><div class="rz-title">班次与用工</div>' +
                row('班次', spec.shift || '两班倒') + row('每班时长', '12 小时') +
                row('用工性质', '长期驻外') + row('合同周期', '2 年（可续）') +
              '</div>' +
              '<div class="rz-card"><div class="rz-title">我的匹配分项' +
                (score !== null ? ' <span class="hps-jo-score">' + score + ' 分</span>' : '') + '</div>' +
                bars +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div></div>';

      /* 返回分析界面（靠快照还原，不重播动画） */
      root.querySelector('#mtJobBack').addEventListener('click', function () {
        if (typeof onBack === 'function') { onBack(); return; }
        location.hash = '#/persona/stage';
      });
      /* 投递 */
      root.querySelector('#mtJobApply').addEventListener('click', function (ev) {
        var b = ev.currentTarget;
        if (hit.applied) { window.HP.toast('已投递', '你已投递过该岗位'); return; }
        applyWithResumeChoice(jobId, j.title, function () {
          b.disabled = true; b.textContent = '投递中';
          (call('persona.apply', jobId) || api('/api/persona/jobs/' + encodeURIComponent(jobId) + '/apply', { method: 'POST' }))
            .then(function () { b.textContent = '已投递'; window.HP.toast('投递成功', j.title); })
            .catch(function (e) { b.disabled = false; b.textContent = '投递简历'; window.HP.toast('投递失败', e.message); });
        });
      });
      /* 收藏 / 取消收藏 */
      root.querySelector('#mtJobFav').addEventListener('click', function (ev) {
        var b = ev.currentTarget;
        var on = b.textContent.indexOf('取消') >= 0;
        (call(on ? 'persona.removeFavorite' : 'persona.addFavorite', jobId) ||
          api('/api/persona/favorites/' + encodeURIComponent(jobId), { method: on ? 'DELETE' : 'POST', body: on ? undefined : '{}' }))
          .then(function () {
            b.textContent = on ? '收藏' : '取消收藏';
            window.HP.toast(on ? '已取消收藏' : '已收藏', j.title);
          })
          .catch(function (e) { window.HP.toast('操作失败', e.message); });
      });
    }).catch(function (e) {
      root.innerHTML = '<div class="mt-stage"><div class="mt-stage-in"><div class="mt-hero">' + L('加载失败：', 'Load failed: ') + esc(e.message) + '</div></div></div>';
    });
  }

  window.HPMatch = window.HPMatch || {};
  window.HPMatch.openResume = openResume;
  window.HPMatch.openWeights = openWeights;

  window.HPMatch = { company: company, persona: persona, discover: discover, rank: rank, personaRank: personaRank, personaJob: personaJob, openResume: openResume, openWeights: openWeights, openJob: openJob, applyWithResumeChoice: applyWithResumeChoice };

  /* 语言切换后重新渲染当前页面（各模块自行监听 hp:lang） */
  document.addEventListener('hp:lang', function () {
    try {
      var hash = (location.hash || '').split('/');
      var who = hash[1] || 'persona';
      var view = hash[2] || '';
      var root = null;
      var fn = null;
      if (who === 'persona') {
        if (view === 'discover') { root = document.getElementById('personaDiscoverRoot'); fn = discover; }
        else if (view === 'match') { root = document.getElementById('personaMatchRoot'); fn = function (r) { persona(r, { scope: 'all' }); }; }
        else if (view === 'rank') { root = document.getElementById('personaRankRoot'); fn = function (r) { personaRank(r, {}); }; }
        else if (view === 'job') { root = document.getElementById('personaJobRoot'); fn = function (r) { personaJob(r, window.__hpJobId, window.__hpJobBack); }; }
      } else if (who === 'company') {
        if (view === 'match') { root = document.getElementById('companyMatchRoot'); fn = function (r) { company(r, { scope: 'applied' }); }; }
        else if (view === 'discover') { root = document.getElementById('companyDiscoverRoot'); fn = function (r) { company(r, { scope: 'talent' }); }; }
        else if (view === 'rank') { root = document.getElementById('companyRankRoot'); fn = rank; }
      }
      if (root && fn) fn(root);
    } catch (e) { console.warn('i18n re-render failed', e); }
  });
})();
