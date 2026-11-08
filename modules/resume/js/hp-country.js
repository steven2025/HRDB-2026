/* ==================================================================
   知识库 —— 「国别规则」页签
   对外：window.HPCOUNTRY.init(viewEl)
   数据：GET /api/country/rules（失败用演示数据）
   ================================================================== */
(function () {
  'use strict';

  var COUNTRIES = [
    { k: 'DZ', n: '阿尔及利亚' }, { k: 'VN', n: '越南' }, { k: 'SA', n: '沙特' },
    { k: 'MY', n: '马来西亚' }, { k: 'KZ', n: '哈萨克斯坦' }, { k: 'AE', n: '阿联酋' }
  ];

  var RULES = {
    DZ: [
      ['护照有效期', '必填', '需 ≥18 个月，不足会被拒签', '领事签证要求', '2026-09'],
      ['健康证', '必填', '入境体检与用工备案必需', '当地劳动部门', '2026-08'],
      ['无犯罪记录', '必填', '需公证并双认证', '签证材料清单', '2026-08'],
      ['照片', '禁填', '当地不得以相貌筛选，附照片反而增加歧视风险', '招聘公平惯例', '2026-07'],
      ['宗教', '禁填', '不得采集宗教信仰信息', '个人信息保护惯例', '2026-07'],
      ['婚育状况', '建议隐藏', '与岗位无关，且易引发争议', '顾问建议', '2026-09'],
      ['年龄', '格式要求', '写出生日期，不写年龄', '当地简历惯例', '2026-06']
    ],
    VN: [
      ['照片', '必填', '当地简历普遍附证件照', '招聘惯例', '2026-05'],
      ['身份证号', '必填', '用工备案需要', '劳动登记要求', '2026-06'],
      ['婚育状况', '建议隐藏', '与岗位无关', '顾问建议', '2026-08'],
      ['健康证', '必填', '食品与制造岗位必需', '卫生部门', '2026-07'],
      ['语言', '必填', '需注明越语或中文水平', '岗位要求', '2026-06']
    ],
    SA: [
      ['性别', '必填', '部分岗位有法定性别限制', '劳动法', '2026-04'],
      ['宗教', '禁填', '不得采集', '个人信息保护', '2026-04'],
      ['照片', '建议隐藏', '除特定岗位外不建议附照片', '招聘惯例', '2026-05'],
      ['护照有效期', '必填', '需 ≥6 个月', '签证要求', '2026-06'],
      ['合同期限', '必填', '需写明起止日期', '劳动合同规定', '2026-07']
    ],
    MY: [
      ['照片', '建议隐藏', '非必需，避免筛选争议', '招聘惯例', '2026-05'],
      ['种族', '禁填', '不得采集', '反歧视规定', '2026-05'],
      ['宗教', '禁填', '不得采集', '个人信息保护', '2026-05'],
      ['健康证', '必填', '制造业岗位必需', '卫生部门', '2026-06'],
      ['学历', '必填', '需注明学历层次', '岗位要求', '2026-06']
    ],
    KZ: [
      ['护照有效期', '必填', '需 ≥12 个月', '签证要求', '2026-03'],
      ['学历', '必填', '需公证', '劳务许可', '2026-03'],
      ['语言', '必填', '需注明俄语或哈语水平', '岗位要求', '2026-04'],
      ['照片', '建议隐藏', '非必需', '招聘惯例', '2026-04']
    ],
    AE: [
      ['照片', '必填', '当地简历惯例', '招聘惯例', '2026-02'],
      ['宗教', '禁填', '不得采集', '个人信息保护', '2026-02'],
      ['婚育状况', '建议隐藏', '与岗位无关', '顾问建议', '2026-03'],
      ['护照有效期', '必填', '需 ≥6 个月', '签证要求', '2026-03']
    ]
  };

  var CSS = [
    '.hpc-tabs{display:flex;gap:2px;border-bottom:1px solid var(--border);margin:6px 0 16px}',
    '.hpc-tabs button{height:38px;padding:0 18px;border:0;background:none;color:var(--text-2);font-size:14px;cursor:pointer;border-bottom:2px solid transparent}',
    '.hpc-tabs button.on{color:var(--primary);border-bottom-color:var(--primary);font-weight:600}',
    '.hpc-bar{display:flex;align-items:center;gap:8px;margin-bottom:12px;flex-wrap:wrap}',
    '.hpc-chip{height:32px;padding:0 14px;border:1px solid var(--border);border-radius:9px;background:transparent;color:var(--text-2);font-size:13px;cursor:pointer}',
    '.hpc-chip.on{background:var(--primary);color:#02131f;border-color:var(--primary);font-weight:600}',
    '.hpc-bar .sp{flex:1}',
    '.hpc-sum{font-size:12.5px;color:var(--text-3)}',
    '.hpc-table{width:100%;border-collapse:collapse;font-size:13px}',
    '.hpc-table th{text-align:left;padding:11px 12px;font-size:11.5px;color:var(--text-3);font-weight:400;border-bottom:1px solid var(--border)}',
    '.hpc-table td{padding:12px;border-bottom:1px solid var(--border);vertical-align:top}',
    '.hpc-table tr:hover{background:rgba(56,189,248,.05)}',
    '.hpc-tag{font-size:11px;padding:2px 9px;border:1px solid var(--border);border-radius:7px;white-space:nowrap}',
    '.hpc-tag.must{color:#f0b429;border-color:rgba(240,180,41,.45)}',
    '.hpc-tag.ban{color:#f87171;border-color:rgba(248,113,113,.45)}',
    '.hpc-tag.hide{color:#38bdf8;border-color:rgba(56,189,248,.45)}',
    '.hpc-tag.fmt{color:var(--text-3)}',
    '.hpc-tag.note{color:#a78bfa;border-color:rgba(167,139,250,.45)}',
    '.hpc-reason{color:var(--text-2);font-size:12.5px;line-height:1.8}',
    '.hpc-src{color:var(--text-3);font-size:11.5px}',
    '.hpc-note{margin-top:12px;padding:12px 14px;border:1px solid var(--border);border-radius:12px;background:var(--surface-2);font-size:12px;line-height:1.9;color:var(--text-3)}',
    '.hpc-detail td{background:rgba(56,189,248,.04);color:var(--text-2);font-size:12.5px;line-height:1.9;padding:10px 12px}',
    '.hpc-detail{display:none}',
    '.hpc-table tr.open + tr.hpc-detail{display:table-row}',
    '.hpc-caret{display:inline-block;width:14px;color:var(--text-3);font-size:10px;margin-right:4px}',
    '.hpc-table tbody tr[data-row]{cursor:pointer}'
  ].join('');

  var state = { cur: 'DZ', loaded: {} };

  function injectCSS() {
    if (document.getElementById('hpCountryCSS')) return;
    var st = document.createElement('style');
    st.id = 'hpCountryCSS'; st.textContent = CSS;
    document.head.appendChild(st);
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); }
  function clsOf(t) { return t === '必填' ? 'must' : t === '禁填' ? 'ban' : t === '建议隐藏' ? 'hide' : t === '注意事项' ? 'note' : 'fmt'; }

  /* 后端 /api/country/rules 返回对象（field/type/reason/source/tags），
     表格按「字段/规则/说明/来源/更新」五列元组渲染，这里统一转换 */
  function rowsOf(list) {
    return (list || []).map(function (r) {
      if (Array.isArray(r)) return r;
      return [
        r.field || r.f || '—',
        r.type || r.tag || '—',
        r.reason || r.desc || '',
        r.source || '—',
        r.updated || r.updatedAt || '—'
      ];
    });
  }

  function render(box) {
    var list = rowsOf(state.loaded[state.cur] || RULES[state.cur] || []);
    var must = list.filter(function (r) { return r[1] === '必填'; }).length;
    var ban = list.filter(function (r) { return r[1] === '禁填'; }).length;
    var name = COUNTRIES.filter(function (c) { return c.k === state.cur; })[0].n;

    var html = '<div class="hpc-bar">' +
      COUNTRIES.map(function (c) {
        return '<button class="hpc-chip ' + (c.k === state.cur ? 'on' : '') + '" data-c="' + c.k + '">' + c.n + '</button>';
      }).join('') +
      '<span class="sp"></span>' +
      '<span class="hpc-sum">' + name + '：共 ' + list.length + ' 条 · 必填 ' + must + ' · 禁填 ' + ban + '</span>' +
    '</div>';

    html += '<table class="hpc-table"><thead><tr><th style="width:170px">字段</th><th style="width:130px">规则</th><th>依据来源</th><th style="width:100px">更新</th></tr></thead><tbody>';
    html += list.map(function (r, i) {
      return '<tr data-row="' + i + '"><td><span class="hpc-caret">▸</span>' + esc(r[0]) + '</td>' +
        '<td><span class="hpc-tag ' + clsOf(r[1]) + '">' + esc(r[1]) + '</span></td>' +
        '<td class="hpc-src">' + esc(r[3]) + '</td>' +
        '<td class="hpc-src">' + esc(r[4]) + '</td></tr>' +
        '<tr class="hpc-detail"><td colspan="4">' + esc(r[2]) + '</td></tr>';
    }).join('');
    html += '</tbody></table>';

    html += '<div class="hpc-note">规则用于简历上传前体检：必填项缺失会拦截投递，禁填项自动隐藏，建议隐藏项提示 HR 手动处理。<br>' +
      '如与当地法律冲突，以法律为准；规则库由保障部维护，修改后即时生效。</div>';

    box.innerHTML = html;
    box.querySelectorAll('tr[data-row]').forEach(function (tr) {
      tr.onclick = function () {
        var open = tr.classList.toggle('open');
        var caret = tr.querySelector('.hpc-caret');
        if (caret) caret.textContent = open ? '▾' : '▸';
      };
    });
    box.querySelectorAll('[data-c]').forEach(function (b) {
      b.onclick = function () { state.cur = b.getAttribute('data-c'); render(box); };
    });
  }

  function init(viewEl) {
    if (!viewEl || viewEl.dataset.hpcDone === '1') return;
    viewEl.dataset.hpcDone = '1';
    injectCSS();

    var head = viewEl.querySelector('.page-head');
    var tabs = document.createElement('div');
    tabs.className = 'hpc-tabs';
    tabs.innerHTML = '<button class="on" data-tab="base">文书模板</button><button data-tab="country">国别规则</button>';
    if (head && head.nextSibling) viewEl.insertBefore(tabs, head.nextSibling);
    else viewEl.insertBefore(tabs, viewEl.firstChild);

    var box = document.createElement('div');
    box.id = 'hpCountryBox';
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
        box.style.display = t === 'country' ? '' : 'none';
        if (t === 'country' && !box.dataset.done) { box.dataset.done = '1'; load(box); }
      };
    });
  }

  function load(box) {
    box.innerHTML = '<div style="color:var(--text-3);font-size:13px;padding:10px 0">加载中…</div>';
    fetch('/api/country/rules', { credentials: 'same-origin' })
      .then(function (r) { if (!r.ok) throw new Error('http'); return r.json(); })
      .then(function (d) {
        if (d && d.countries) { state.loaded = d.countries; }
        render(box);
      })
      .catch(function () { render(box); });
  }

  window.HPCOUNTRY = { init: init, RULES: RULES };
})();
