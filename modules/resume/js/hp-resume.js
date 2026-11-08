/* ==================================================================
   我的档案 —— 「简历体检」页签（应聘者端）
   对外：window.HPRESUME.mount(profileView)
   数据：GET /api/profile/resume（失败用演示数据）
   ================================================================== */
(function () {
  'use strict';

  var COUNTRIES = [
    { k: 'DZ', n: '阿尔及利亚' }, { k: 'VN', n: '越南' }, { k: 'SA', n: '沙特' }, { k: 'MY', n: '马来西亚' }
  ];

  var RULES = {
    DZ: { must: ['护照有效期（≥18 个月）', '健康证', '无犯罪记录'], ban: ['照片', '宗教'], hide: ['婚育状况'] },
    VN: { must: ['身份证号', '照片', '健康证'], ban: [], hide: ['婚育状况'] },
    SA: { must: ['性别', '护照有效期', '合同期限'], ban: ['宗教'], hide: ['照片'] },
    MY: { must: ['学历', '健康证'], ban: ['种族', '宗教'], hide: ['照片'] }
  };

  var CHECKS = [
    { lv: 'b', t: '健康证未上传', d: '上传后才能通过体检' },
    { lv: 'b', t: '护照有效期未填', d: '需 ≥18 个月' },
    { lv: 'w', t: '婚姻状况', d: '建议隐藏，与岗位无关' },
    { lv: 'w', t: '照片', d: '已按该国规则隐藏' },
    { lv: 'g', t: '日期格式', d: '2021.03 与 2021-03 统一为 2021-03' }
  ];

  var CSS = [
    '.hprs-tabs{display:flex;gap:2px;border-bottom:1px solid var(--border);margin:6px 0 16px}',
    '.hprs-tabs button{height:38px;padding:0 18px;border:0;background:none;color:var(--text-2);font-size:14px;cursor:pointer;border-bottom:2px solid transparent}',
    '.hprs-tabs button.on{color:var(--primary);border-bottom-color:var(--primary);font-weight:600}',
    '.hprs-grid{display:grid;grid-template-columns:1fr 380px;gap:14px;align-items:start}',
    '.hprs-card{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:14px 16px}',
    '.hprs-card h3{font-size:14px;font-weight:600;display:flex;align-items:center;gap:9px;margin-bottom:10px}',
    '.hprs-card h3 i{width:3px;height:13px;background:var(--primary);display:block}',
    '.hprs-card h3 span{margin-left:auto;font-size:11.5px;color:var(--text-3);font-weight:400}',
    '.hprs-paper{background:#FBF9F3;color:#1a1712;border-radius:12px;padding:26px 28px;min-height:520px;font-family:"SimSun","Microsoft YaHei",serif}',
    '.hprs-paper h2{font-size:22px;letter-spacing:3px}',
    '.hprs-paper .m{font-size:12px;color:#6B6458;margin-top:6px;line-height:1.9}',
    '.hprs-paper .sec{margin-top:16px}',
    '.hprs-paper .sec h4{font-size:13px;letter-spacing:2px;border-bottom:1px solid #1a1712;padding-bottom:4px;margin-bottom:7px}',
    '.hprs-paper p,.hprs-paper li{font-size:12.5px;line-height:1.95}',
    '.hprs-paper ul{padding-left:16px}',
    '.hprs-miss{background:linear-gradient(180deg,transparent 60%,rgba(240,180,41,.35) 60%)}',
    '.hprs-hide{display:none}',
    '.hprs-big{font-size:38px;font-weight:300;color:var(--primary);line-height:1}',
    '.hprs-big small{font-size:12px;color:var(--text-3);margin-left:3px}',
    '.hprs-bar{height:5px;background:rgba(56,189,248,.14);border-radius:3px;margin-top:10px}',
    '.hprs-bar i{display:block;height:100%;background:var(--primary);border-radius:3px}',
    '.hprs-chips{display:flex;gap:6px;flex-wrap:wrap;margin:10px 0 14px}',
    '.hprs-chip{height:30px;padding:0 12px;border:1px solid var(--border);border-radius:8px;background:none;color:var(--text-2);font-size:12.5px;cursor:pointer}',
    '.hprs-chip.on{background:var(--primary);color:#02131f;border-color:var(--primary);font-weight:600}',
    '.hprs-item{display:flex;gap:9px;padding:9px 0;border-top:1px solid var(--border);font-size:12.5px}',
    '.hprs-item:first-of-type{border-top:0}',
    '.hprs-item i{width:6px;height:6px;border-radius:50%;margin-top:6px;flex:0 0 6px}',
    '.hprs-item .c{flex:1}',
    '.hprs-item .c p{font-size:11.5px;color:var(--text-3);margin-top:2px}',
    '.hprs-item button{height:26px;padding:0 9px;border:1px solid var(--border);border-radius:7px;background:none;color:var(--text-2);font-size:11.5px;cursor:pointer}',
    '.hprs-item.done{opacity:.45}',
    '.hprs-item.done button{pointer-events:none}',
    '.hprs-acts{display:flex;gap:8px;margin-top:14px}',
    '.hprs-acts button{flex:1;height:34px;border:1px solid var(--border);border-radius:10px;background:none;color:var(--text-2);font-size:12.5px;cursor:pointer}',
    '.hprs-acts button.p{border-color:var(--primary);color:var(--primary)}'
  ].join('');

  var state = { tab: 'base', cur: 'DZ', real: null, checks: CHECKS.map(function (c) { return Object.assign({ done: false }, c); }) };

  function injectCSS() {
    if (document.getElementById('hpResumeCSS')) return;
    var st = document.createElement('style');
    st.id = 'hpResumeCSS'; st.textContent = CSS;
    document.head.appendChild(st);
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); }

  function rulesHTML() {
    var r = RULES[state.cur];
    function row(c, t) {
      return '<div class="hprs-item"><i style="background:' + c + '"></i><div class="c"><b style="font-weight:400">' + esc(t) + '</b></div></div>';
    }
    var h = '';
    if (r.must.length) h += '<div style="font-size:11.5px;color:var(--text-3);margin:2px 0 4px">必填</div>' + r.must.map(function (t) { return row('#f0b429', t); }).join('');
    if (r.ban.length) h += '<div style="font-size:11.5px;color:var(--text-3);margin:10px 0 4px">禁填（已自动隐藏）</div>' + r.ban.map(function (t) { return row('#f87171', t); }).join('');
    if (r.hide.length) h += '<div style="font-size:11.5px;color:var(--text-3);margin:10px 0 4px">建议隐藏</div>' + r.hide.map(function (t) { return row('#38bdf8', t); }).join('');
    return h;
  }

  function render(box) {
    var r = RULES[state.cur];
    var done = checks().filter(function (c) { return c.done; }).length;
    var real = state.real || {};
    var pct = typeof real.completeness === 'number' ? real.completeness : 78;
    var who = real.name || '张伟';
    var missText = checks().filter(function (c) { return c.lv === 'b' && !c.done; })
      .map(function (c) { return c.t; }).join('、') || '无';

    var html = '<div class="hprs-grid">' +
      '<div class="hprs-card">' +
        '<h3><i></i>我的简历<span>白纸预览 · 缺项高亮 · 演示数据</span></h3>' +
        '<div class="hprs-paper">' +
          '<h2>' + esc(who) + '</h2>' +
          '<div class="m">男 · 34 岁 · 河南洛阳 · 8 年压机一线<br>求职意向：海外玻璃厂 · 压机操作 / 调机</div>' +
          '<div class="sec"><h4>工作经历</h4>' +
            '<p><b>鲁南玻璃制品有限公司</b>　压机操作工 / 调机　2021.03–2024.12</p>' +
            '<ul><li>主导 5 台压机换模标准化，单次换模 38 → 25 分钟（-34%）</li>' +
            '<li>负责班组 12 人排班与新人带教</li></ul></div>' +
          '<div class="sec"><h4>技能与证书</h4>' +
            '<p>玻璃压机操作 · 换模调机 · 工艺参数 · 设备点检<br>中级职业资格证（玻璃成型工）· <span class="hprs-miss">健康证（未上传）</span></p></div>' +
          '<div class="sec"><h4>证件与到岗</h4>' +
            '<p><span class="hprs-miss">护照有效期（未填写）</span> · 无犯罪记录已公证<br>' +
            (r.hide.indexOf('婚育状况') >= 0 || r.ban.indexOf('婚育状况') >= 0 ? '' : '婚姻状况：已婚 · ') +
            (r.hide.indexOf('照片') >= 0 || r.ban.indexOf('照片') >= 0 ? '' : '照片：已附') + '</p></div>' +
          '<div class="sec"><h4>语言</h4><p><span class="hprs-miss">语言水平（未填写）</span></p></div>' +
        '</div>' +
      '</div>' +

      '<div>' +
        '<div class="hprs-card" style="margin-bottom:14px">' +
          '<h3><i></i>目标国家<span>规则随国家变化</span></h3>' +
          '<div class="hprs-chips">' + COUNTRIES.map(function (c) {
            return '<button class="hprs-chip ' + (c.k === state.cur ? 'on' : '') + '" data-c="' + c.k + '">' + c.n + '</button>';
          }).join('') + '</div>' +
          rulesHTML() +
        '</div>' +

        '<div class="hprs-card" style="margin-bottom:14px">' +
          '<h3><i></i>简历完成度<span>上传前建议 100%</span></h3>' +
          '<div class="hprs-big">' + pct + '<small>%</small></div>' +
          '<div class="hprs-bar"><i style="width:' + pct + '%"></i></div>' +
          '<div style="margin-top:10px;font-size:12px;color:var(--text-3);line-height:1.9">还差：' + esc(missText) + '</div>' +
        '</div>' +

        '<div class="hprs-card">' +
          '<h3><i></i>上传前体检<span>已处理 ' + done + '/' + checks().length + '</span></h3>' +
          checks().map(function (c, i) {
            var col = c.lv === 'b' ? '#f87171' : c.lv === 'w' ? '#f0b429' : '#7a8da6';
            return '<div class="hprs-item ' + (c.done ? 'done' : '') + '"><i style="background:' + col + '"></i>' +
              '<div class="c"><b style="font-weight:400">' + esc(c.t) + '</b><p>' + esc(c.d) + '</p></div>' +
              '<button data-fix="' + i + '">处理</button></div>';
          }).join('') +
          '<div class="hprs-acts"><button data-edit>编辑档案</button><button data-upload>上传 / 替换简历</button><button class="p" data-check>开始体检</button></div>' +
          '<div style="margin-top:10px;font-size:11.5px;color:var(--text-3);line-height:1.9">编辑与上传沿用「档案信息」里原有的流程；体检只检查上传前该隐藏、该补齐的项。</div>' +
        '</div>' +
      '</div></div>';

    box.innerHTML = html;

    box.querySelectorAll('[data-c]').forEach(function (b) {
      b.onclick = function () { state.cur = b.dataset.c; render(box); if (window.demoToast) demoToast('已切换：' + b.textContent); };
    });
    box.querySelectorAll('[data-fix]').forEach(function (b) {
      b.onclick = function () {
        checks()[+b.dataset.fix].done = true; render(box);
        if (window.demoToast) demoToast('已处理');
      };
    });
    var editBtn = box.querySelector('[data-edit]');
    if (editBtn) editBtn.onclick = function () {
      state.tab = 'base';
      var t = box.parentNode.querySelector('.hprs-tabs button[data-tab="base"]');
      if (t) t.click();
    };
    var upBtn = box.querySelector('[data-upload]');
    if (upBtn) upBtn.onclick = function () {
      var b = document.getElementById('btnResumeUpload');
      if (b) { b.click(); return; }
      if (window.HPProfileFlow && window.HPProfileFlow.analyze) { window.HPProfileFlow.analyze(); return; }
      if (window.demoToast) demoToast('请到「档案信息」里上传简历');
    };
    box.querySelector('[data-check]').onclick = function () {
      state.checks.forEach(function (c) { c.done = false; });
      render(box);
      var left = state.checks.filter(function (c) { return c.lv === 'b'; }).length;
      if (window.demoToast) demoToast('体检完成：' + left + ' 项必须处理');
    };
    box.querySelector('[data-submit]').onclick = function () {
      var left = state.checks.filter(function (c) { return c.lv === 'b' && !c.done; }).length;
      if (window.demoToast) demoToast(left ? '还有 ' + left + ' 项必须处理' : '已保存并投递（演示）');
    };
  }

  function checks() {
    if (state.real && state.real.checks && state.real.checks.length) {
      return state.real.checks.map(function (c) { return { lv: c.lv, t: c.t, d: c.d || '', done: !!c.done }; });
    }
    return state.checks;
  }
  function loadReal() {
    fetch('/api/persona/resume', { credentials: 'same-origin' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) { if (d && d.checks) { state.real = d; } })
      .catch(function () {})
      .then(function () {
        var box = document.getElementById('hpResumeBox');
        if (box && box.dataset.done === '1') render(box);
      });
  }

  function mount(viewEl) {
    if (!viewEl) return;
    injectCSS();
    if (viewEl.querySelector('#hpResumeBox')) return;   // 已注入


    var head = viewEl.querySelector('.page-head');
    var tabs = document.createElement('div');
    tabs.className = 'hprs-tabs';
    tabs.innerHTML = '<button class="on" data-tab="base">档案信息</button><button data-tab="resume">简历体检</button>';
    if (head && head.nextSibling) viewEl.insertBefore(tabs, head.nextSibling);
    else viewEl.insertBefore(tabs, viewEl.firstChild);

    var box = document.createElement('div');
    box.id = 'hpResumeBox';
    box.style.display = 'none';
    viewEl.appendChild(box);

    var baseNodes = Array.prototype.filter.call(viewEl.children, function (el) {
      return el !== tabs && el !== box && el.tagName !== 'H1';
    });

    tabs.querySelectorAll('button').forEach(function (b) {
      b.onclick = function () {
        var t = b.getAttribute('data-tab');
        state.tab = t;
        tabs.querySelectorAll('button').forEach(function (x) { x.classList.toggle('on', x === b); });
        baseNodes.forEach(function (el) { el.style.display = t === 'base' ? '' : 'none'; });
        box.style.display = t === 'resume' ? '' : 'none';
        if (t === 'resume') render(box);
      };
    });

    if (!state.real) loadReal();

    // 恢复上次页签（档案页重绘后仍停在体检）
    if (state.tab === 'resume') {
      var rb = tabs.querySelector('button[data-tab="resume"]');
      if (rb) rb.click();
    }
  }


  /* ================= 上传前体检（B 方案） ================= */
  var PC_CSS = [
    '.hprs-mask{position:fixed;inset:0;background:rgba(2,8,16,.72);backdrop-filter:blur(3px);z-index:400;display:grid;place-items:center}',
    '.hprs-dlg{width:560px;max-width:92vw;background:var(--surface);border:1px solid var(--border);border-radius:18px;padding:20px 22px;box-shadow:0 30px 80px rgba(0,0,0,.6)}',
    '.hprs-dlg h3{font-size:17px;font-weight:600;display:flex;align-items:center;gap:9px}',
    '.hprs-dlg h3 i{width:3px;height:14px;background:var(--primary);display:block}',
    '.hprs-dlg .sub{margin-top:6px;font-size:12.5px;color:var(--text-3);line-height:1.8}',
    '.hprs-dlg .row{display:flex;align-items:flex-start;gap:9px;padding:9px 0;border-top:1px solid var(--border);font-size:12.5px}',
    '.hprs-dlg .row:first-of-type{border-top:0}',
    '.hprs-dlg .row i{width:6px;height:6px;border-radius:50%;margin-top:6px;flex:0 0 6px}',
    '.hprs-dlg .row .c{flex:1}',
    '.hprs-dlg .row .c p{font-size:11.5px;color:var(--text-3);margin-top:2px}',
    '.hprs-dlg .row.ok{opacity:.5}',
    '.hprs-dlg .acts{display:flex;gap:10px;margin-top:18px}',
    '.hprs-dlg .acts button{flex:1;height:38px;border:1px solid var(--border);border-radius:10px;background:none;color:var(--text-2);font-size:13px;cursor:pointer}',
    '.hprs-dlg .acts button.p{border-color:var(--primary);color:#02131f;background:var(--primary);font-weight:600}'
  ].join('');

  function pcInject() {
    if (document.getElementById('hpPrecheckCSS')) return;
    var st = document.createElement('style');
    st.id = 'hpPrecheckCSS'; st.textContent = PC_CSS;
    document.head.appendChild(st);
  }

  /* 体检项：优先用 /api/persona/resume 的真实缺项 */
  function pcItems() {
    var list = checks().slice(0, 6).map(function (c) {
      return {
        lv: c.lv,
        t: c.t,
        d: c.d || (c.lv === 'b' ? '目标国要求必填，缺失会被拦截' : '建议处理后再上传'),
        fix: c.lv === 'b' ? (c.t.indexOf('护照') >= 0 ? '去补' : '去上传') : '一键处理'
      };
    });
    if (!list.length) list = [{ lv: 'g', t: '资料齐全', d: '未发现必填缺项', fix: '继续' }];
    return list;
  }

  function preUpload() {
    pcInject();
    if (document.getElementById('hpPreMask')) return;
    var done = {};
    var mask = document.createElement('div');
    mask.className = 'hprs-mask'; mask.id = 'hpPreMask';

    function paint() {
      var left = pcItems().filter(function (x, i) { return x.lv === 'b' && !done[i]; }).length;
      mask.innerHTML = '<div class="hprs-dlg">' +
        '<h3><i></i>上传前体检</h3>' +
        '<div class="sub">目标国家：' + COUNTRIES.filter(function (c) { return c.k === state.cur; })[0].n +
        '。缺项不影响上传，但投递前必须补齐；敏感项建议上传前隐藏。</div>' +
        '<div style="margin-top:12px">' + pcItems().map(function (x, i) {
          var col = x.lv === 'b' ? '#f87171' : x.lv === 'w' ? '#f0b429' : '#7a8da6';
          return '<div class="row ' + (done[i] ? 'ok' : '') + '"><i style="background:' + col + '"></i>' +
            '<div class="c"><b style="font-weight:400">' + esc(x.t) + '</b><p>' + esc(x.d) + '</p></div>' +
            '<button class="btn btn-o btn-sm" data-fix="' + i + '" ' + (done[i] ? 'disabled' : '') + '>' + (done[i] ? '已处理' : x.fix) + '</button></div>';
        }).join('') + '</div>' +
        '<div class="acts"><button data-cancel>取消</button>' +
        '<button class="p" data-go>' + (left ? '继续上传（' + left + ' 项待补）' : '继续上传') + '</button></div></div>';

      mask.querySelectorAll('[data-fix]').forEach(function (b) {
        b.onclick = function () { done[+b.dataset.fix] = true; paint(); };
      });
      mask.querySelector('[data-cancel]').onclick = function () { mask.remove(); };
      var go = mask.querySelector('[data-go]');
      if (go) go.onclick = function () {
        mask.remove();
        var btn = document.getElementById('btnResumeUpload');
        if (btn) { window.__hpSkipPre = true; btn.click(); setTimeout(function () { window.__hpSkipPre = false; }, 50); }
        else if (window.HPProfileFlow && window.HPProfileFlow.analyze) { window.HPProfileFlow.analyze(); }
      };
    }
    paint();
    document.body.appendChild(mask);
    mask.addEventListener('click', function (e) { if (e.target === mask) mask.remove(); });
  }

  /* 拦截原「上传简历」按钮：先体检，再走原流程 */
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('#btnResumeUpload');
    if (!b || window.__hpSkipPre) return;
    e.preventDefault();
    e.stopPropagation();
    preUpload();
  }, true);


  /* 保存档案：不动原逻辑，保存后提示投递前还差什么 */
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-demo="保存档案"]');
    if (!b) return;
    setTimeout(function () {
      var left = state.checks.filter(function (c) { return c.lv === 'b' && !c.done; }).length;
      if (window.demoToast) {
        demoToast(left ? '档案已保存 · 投递前还需补 ' + left + ' 项' : '档案已保存 · 可直接投递');
      }
    }, 500);
  });


  /* ================= 投递前闸门（选项 1） ================= */
  var APPLY_SEL = '[data-act="apply"], #mtJobApply, [data-b="apply"]';

  function applyGate(after) {
    pcInject();
    if (document.getElementById('hpApplyMask')) return;
    var missing = checks().filter(function (c) { return c.lv === 'b' && !c.done; }).map(function (c) { return c.t; });
    if (!missing.length) { after(); return; }

    var mask = document.createElement('div');
    mask.className = 'hprs-mask'; mask.id = 'hpApplyMask';
    mask.innerHTML = '<div class="hprs-dlg">' +
      '<h3><i></i>投递前体检</h3>' +
      '<div class="sub">目标国家：' + COUNTRIES.filter(function (c) { return c.k === state.cur; })[0].n +
      '。还差 ' + missing.length + ' 项必填材料，' +
      (window.HP_SETTINGS && window.HP_SETTINGS.hardBlock ? '补齐后才能投递。' : '补齐后再投更稳。') + '</div>' +
      '<div style="margin-top:12px">' + missing.map(function (t) {
        return '<div class="row"><i style="background:#f87171"></i><div class="c"><b style="font-weight:400">' + esc(t) + '</b>' +
          '<p>目标国要求必填，缺失可能被退回</p></div></div>';
      }).join('') + '</div>' +
      '<div class="acts"><button data-cancel>取消</button><button data-fix>去补资料</button>' +
      (window.HP_SETTINGS && window.HP_SETTINGS.hardBlock
        ? '<button class="p" disabled style="opacity:.45;cursor:not-allowed">补齐后才能投递</button>'
        : '<button class="p" data-go>仍然投递</button>') + '</div></div>';

    mask.querySelector('[data-cancel]').onclick = function () { mask.remove(); };
    mask.querySelector('[data-fix]').onclick = function () {
      mask.remove();
      location.hash = '#/persona/profile';
      setTimeout(function () {
        var t = document.querySelector('.hprs-tabs button[data-tab="resume"]');
        if (t) t.click();
      }, 400);
    };
    var goBtn = mask.querySelector('[data-go]');
    if (goBtn) goBtn.onclick = function () { mask.remove(); after(); };

    document.body.appendChild(mask);
    mask.addEventListener('click', function (e) { if (e.target === mask) mask.remove(); });
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest(APPLY_SEL);
    if (!b || window.__hpSkipApply) return;
    if (b.disabled || b.textContent.indexOf('已投递') >= 0) return;
    e.preventDefault(); e.stopPropagation();
    applyGate(function () {
      window.__hpSkipApply = true;
      b.click();
      setTimeout(function () { window.__hpSkipApply = false; }, 50);
    });
  }, true);

  window.HPRESUME = { mount: mount, preUpload: preUpload, refresh: loadReal };
})();
