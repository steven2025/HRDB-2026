/* =========================================================
   企业侧：岗位新建 / 预览 / 发布 / AI 诊断（P2 第一版）
   ========================================================= */
(function () {
  'use strict';

  var KEY = 'hp-company-jobs-v1';
  var SEED = [
    {
      id: 'cj-1', project: '阿尔及利亚玻璃制品工厂', title: '玻璃压机操作工', country: '阿尔及利亚',
      headcount: 6, salary: '20,000 - 25,000 元/月', contract: '24 个月', status: 'draft',
      duties: ['负责双头压机看机、换模与工艺参数调整，日均产量 1,800 件。', '执行设备日常点检与首件确认，异常及时上报。', '按 5S 与安全规范维护工位，带教新员工。'],
      hard: ['3 年以上玻璃压机操作经验', '持有效护照，健康证可办理', '能接受两班倒与长期驻外'],
      pref: ['有海外驻厂经历', '会基础英语或法语'],
      life: ['园区宿舍，班车接送', '每年 2 次探亲假，往返机票报销'],
      benefits: ['13 薪', '海外补贴 3,000 元/月', '商业保险']
    },
    {
      id: 'cj-2', project: '东南亚电子装配线（示例）', title: '产线班组长', country: '越南',
      headcount: 2, salary: '15,000 - 18,000 元/月', contract: '24 个月', status: 'published',
      duties: ['负责班组排产、人员调度与现场纪律。', '跟踪良率与工时，处理产线异常。', '配合中方主管完成新员工培训。'],
      hard: ['2 年以上电子厂带班经验', '能接受倒班', '持有效护照'],
      pref: ['会越南语', '有海外经验'],
      life: ['提供宿舍与工作餐', '每年 1 次探亲假'],
      benefits: ['全勤奖', '夜班补贴', '商业保险']
    }
  ];

  function toast(title, msg) {
    if (window.HP && HP.toast) HP.toast(title, msg);
    else console.log(title, msg);
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function lines(s) {
    return String(s || '').split(/\n+/).map(function (x) { return x.trim(); }).filter(Boolean);
  }
  function load() {
    try {
      var v = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (Array.isArray(v) && v.length) return v;
    } catch (e) {}
    return SEED.slice();
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(jobs)); } catch (e) {}
  }

  function apiJob(method, path, body) {
    return fetch(path, {
      method: method,
      credentials: 'same-origin',
      headers: Object.assign({ 'x-hp-request': '1' }, body ? { 'content-type': 'application/json' } : {}),
      body: body ? JSON.stringify(body) : undefined
    }).then(function (r) {
      return r.json().then(function (j) {
        if (!r.ok) throw new Error((j && (j.message || j.error)) || ('HTTP ' + r.status));
        return j;
      });
    });
  }

  function toApi(job) {
    return {
      title: job.title || '',
      country: job.country || '',
      employer: job.project || '',
      salary: job.salary || '',
      headcount: Number(job.headcount || 1),
      duties: job.duties || [],
      requirementsHard: job.hard || [],
      requirementsPreferred: job.pref || [],
      payStructure: job.salary || '',
      workLife: (job.life || []).join('；'),
      contractTerms: job.contract || '',
      projectBrief: job.project || '',
      status: job.status === 'published' ? '招聘中' : '草稿'
    };
  }

  function syncSave(job) {
    var payload = toApi(job);
    var req = job.serverId
      ? apiJob('POST', '/api/company/jobs/' + encodeURIComponent(job.serverId) + '/update', payload)
      : apiJob('POST', '/api/company/jobs', payload);
    return req.then(function (res) {
      if (res && res.job && res.job.id) job.serverId = res.job.id;
      save();
      return res;
    });
  }

  function syncStatus(job, status) {
    if (!job.serverId) return Promise.resolve(null);
    var path = '/api/company/jobs/' + encodeURIComponent(job.serverId) + (status === 'published' ? '/publish' : '/unpublish');
    return apiJob('POST', path, {});
  }

  var jobs = load();
  var filter = 'all';

  function ensureUI() {
    var list = document.getElementById('jobManageList');
    if (!list) return;
    var card = list.closest('.card');
    var title = card && card.querySelector('.card-title');
    if (title && !document.getElementById('btnNewJob')) {
      title.style.display = 'flex';
      title.style.alignItems = 'center';
      title.style.gap = '8px';
      var b = document.createElement('button');
      b.className = 'btn btn-p btn-sm';
      b.id = 'btnNewJob';
      b.textContent = '新建岗位';
      b.style.marginLeft = 'auto';
      b.onclick = function () { openForm(null); };
      title.appendChild(b);
    }
    var tabs = document.getElementById('jobStatusTabs');
    if (tabs && tabs.dataset.bound !== '1') {
      tabs.dataset.bound = '1';
      tabs.addEventListener('click', function (e) {
        var b = e.target.closest('[data-st]');
        if (!b) return;
        filter = b.dataset.st;
        Array.prototype.forEach.call(tabs.querySelectorAll('[data-st]'), function (x) {
          x.className = 'btn ' + (x.dataset.st === filter ? 'btn-p' : 'btn-o') + ' btn-sm';
        });
        renderList();
      });
    }
    renderList();
  }

  function statusChip(st) {
    return st === 'published' ? '<span class="chip chip-s">已发布</span>' : '<span class="chip chip-w">草稿</span>';
  }

  function renderList() {
    var list = document.getElementById('jobManageList');
    if (!list) return;
    var arr = jobs.filter(function (j) { return filter === 'all' || j.status === filter; });
    if (!arr.length) {
      list.innerHTML = '<div class="t-muted" style="padding:18px 2px;font-size:12px">暂无' + (filter === 'draft' ? '草稿' : filter === 'published' ? '已发布' : '') + '岗位，点右上角「新建岗位」。</div>';
      return;
    }
    list.innerHTML = arr.map(function (j) {
      return '<div class="cj-row" data-id="' + esc(j.id) + '">' +
        '<div class="cj-main"><div class="cj-title">' + esc(j.title || '未命名岗位') + ' ' + statusChip(j.status) + '</div>' +
        '<div class="cj-sub">' + esc(j.country || '') + ' · ' + esc(j.salary || '薪资待定') + ' · 招 ' + (j.headcount || 1) + ' 人 · ' + esc(j.project || '') + '</div></div>' +
        '<div class="cj-ops"><button class="btn btn-o btn-sm" data-act="preview">预览</button>' +
        '<button class="btn btn-o btn-sm" data-act="edit">编辑</button>' +
        (j.status === 'published' ? '<button class="btn btn-o btn-sm" data-act="unpublish">取消发布</button>' : '<button class="btn btn-p btn-sm" data-act="publish">发布</button>') +
        '<button class="btn btn-o btn-sm" data-act="delete" style="color:var(--danger)">删除</button></div></div>';
    }).join('');
    list.querySelectorAll('.cj-row').forEach(function (row) {
      var job = jobs.filter(function (x) { return x.id === row.dataset.id; })[0];
      if (!job) return;
      row.addEventListener('click', function (e) {
        var b = e.target.closest('[data-act]');
        if (b) {
          e.stopPropagation();
          if (b.dataset.act === 'preview') preview(job);
          else if (b.dataset.act === 'edit') openForm(job);
          else if (b.dataset.act === 'publish') publish(job, false);
          else if (b.dataset.act === 'unpublish') publish(job, true);
          else if (b.dataset.act === 'delete') remove(job);
          return;
        }
        preview(job);
      });
    });
  }

  function pasteJD() {
    if (!window.HP || !HP.modal) return;
    HP.modal({
      title: '粘贴 JD 自动填',
      body: '<div style="font-size:12px"><div class="t-muted" style="line-height:1.7;margin-bottom:8px">把招聘网站 / 客户发来的岗位 JD 整段粘贴进来，系统会抽取岗位名称、国家、薪资、职责、硬性要求等；抽取后请核对。</div><textarea id="jdExtractText" rows="9" style="width:100%;padding:10px 12px;border:1px solid var(--border);border-radius:10px;background:var(--surface-2);color:var(--text);font:inherit;font-size:12.5px;line-height:1.7;resize:vertical" placeholder="例：\n岗位名称：玻璃压机操作工\n国家：阿尔及利亚\n薪资：20000-25000 元/月\n岗位职责：..."></textarea></div>',
      actions: [
        { text: '取消' },
        { text: '解析并回填', primary: true, onClick: function (close) {
          var text = (document.getElementById('jdExtractText') || {}).value || '';
          if (text.trim().length < 30) { toast('内容过短', '至少粘贴 30 个字'); return; }
          var btn = document.querySelector('.modal .btn-p, .hp-modal .btn-p');
          if (btn) { btn.disabled = true; btn.textContent = '解析中…'; }
          apiJob('POST', '/api/company/jobs/extract', { text: text }).then(function (res) {
            var j = res.job || res;
            if (!j || !j.title) throw new Error('没有识别到岗位名称');
            function set(id, v) { var el = document.getElementById(id); if (el && v) el.value = v; }
            set('cjTitle', j.title); set('cjCountry', j.country); set('cjSalary', j.salary);
            set('cjHead', j.headcount || 1);
            if (j.projectBrief) set('cjProject', j.projectBrief);
            if (j.contractTerms) set('cjContract', j.contractTerms);
            if (Array.isArray(j.duties)) set('cjDuties', j.duties.join('\n'));
            if (Array.isArray(j.requirementsHard)) set('cjHard', j.requirementsHard.join('\n'));
            if (Array.isArray(j.requirementsPreferred)) set('cjPref', j.requirementsPreferred.join('\n'));
            if (j.workLife) set('cjLife', j.workLife);
            close();
            toast('已解析', '请核对岗位信息后保存');
          }).catch(function (e) {
            if (btn) { btn.disabled = false; btn.textContent = '解析并回填'; }
            toast('解析失败', e.message || '请稍后重试');
          });
        }}
      ]
    });
  }

  function openForm(job) {
    job = job || {};
    var host = document.getElementById('jobPreviewHost');
    var listCard = document.getElementById('jobManageList') && document.getElementById('jobManageList').closest('.card');
    if (!host) return;
    var body = '<div style="display:grid;gap:10px;font-size:12px">' +
      '<div><label class="t-muted">岗位名称</label><input id="cjTitle" value="' + esc(job.title || '') + '" placeholder="如：玻璃压机操作工" style="width:100%;padding:8px 10px;border:1px solid var(--border);border-radius:8px;background:var(--surface);margin-top:4px"></div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px"><div><label class="t-muted">项目</label><input id="cjProject" value="' + esc(job.project || '') + '" placeholder="如：阿尔及利亚玻璃制品工厂" style="width:100%;padding:8px 10px;border:1px solid var(--border);border-radius:8px;background:var(--surface);margin-top:4px"></div><div><label class="t-muted">国家</label><input id="cjCountry" value="' + esc(job.country || '') + '" placeholder="如：阿尔及利亚" style="width:100%;padding:8px 10px;border:1px solid var(--border);border-radius:8px;background:var(--surface);margin-top:4px"></div></div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px"><div><label class="t-muted">招聘人数</label><input id="cjHead" type="number" value="' + (job.headcount || 1) + '" style="width:100%;padding:8px 10px;border:1px solid var(--border);border-radius:8px;background:var(--surface);margin-top:4px"></div><div><label class="t-muted">合同周期</label><input id="cjContract" value="' + esc(job.contract || '') + '" placeholder="如：24 个月" style="width:100%;padding:8px 10px;border:1px solid var(--border);border-radius:8px;background:var(--surface);margin-top:4px"></div></div>' +
      '<div><label class="t-muted">薪资</label><input id="cjSalary" value="' + esc(job.salary || '') + '" placeholder="如：20,000 - 25,000 元/月" style="width:100%;padding:8px 10px;border:1px solid var(--border);border-radius:8px;background:var(--surface);margin-top:4px"></div>' +
      '<div><label class="t-muted">岗位职责（每行一条）</label><textarea id="cjDuties" rows="3" style="width:100%;padding:8px 10px;border:1px solid var(--border);border-radius:8px;background:var(--surface);margin-top:4px;font:inherit">' + esc((job.duties || []).join('\n')) + '</textarea></div>' +
      '<div><label class="t-muted">硬性要求（每行一条）</label><textarea id="cjHard" rows="2" style="width:100%;padding:8px 10px;border:1px solid var(--border);border-radius:8px;background:var(--surface);margin-top:4px;font:inherit">' + esc((job.hard || []).join('\n')) + '</textarea></div>' +
      '<div><label class="t-muted">优先条件（每行一条）</label><textarea id="cjPref" rows="2" style="width:100%;padding:8px 10px;border:1px solid var(--border);border-radius:8px;background:var(--surface);margin-top:4px;font:inherit">' + esc((job.pref || []).join('\n')) + '</textarea></div>' +
      '<div><label class="t-muted">工作与生活 / 福利（每行一条）</label><textarea id="cjLife" rows="2" style="width:100%;padding:8px 10px;border:1px solid var(--border);border-radius:8px;background:var(--surface);margin-top:4px;font:inherit">' + esc((job.life || []).join('\n')) + '</textarea></div>' +
      '</div>';
    host.innerHTML = '<div class="pf-preview"><div class="pf-preview-bar"><div><div class="eyebrow">JOB EDITOR</div><h2>' + (job.id ? '编辑岗位' : '新建岗位') + ' <span>保存后进入纸张预览</span></h2></div>' +
      '<div class="pf-preview-acts"><button class="btn btn-o btn-sm" id="cjPaste" type="button">粘贴 JD 自动填</button><button class="btn btn-o btn-sm" id="cjCancel" type="button">取消</button><button class="btn btn-p btn-sm" id="cjSave" type="button">保存草稿</button></div></div>' +
      '<div class="card card-pad" style="margin-top:12px">' + body + '</div></div>';
    host.style.display = 'block';
    if (listCard) listCard.style.display = 'none';
    host.querySelector('#cjPaste').onclick = pasteJD;
    host.querySelector('#cjCancel').onclick = function () {
      if (job.id) { preview(job); return; }
      host.style.display = 'none'; host.innerHTML = '';
      if (listCard) listCard.style.display = '';
      renderList();
    };
    host.querySelector('#cjSave').onclick = function () {
      var title = (document.getElementById('cjTitle') || {}).value || '';
      var country = (document.getElementById('cjCountry') || {}).value || '';
      var salary = (document.getElementById('cjSalary') || {}).value || '';
      if (!title.trim()) { toast('请填写', '岗位名称不能为空'); return; }
      if (!country.trim()) { toast('请填写', '国家不能为空'); return; }
      if (!salary.trim()) { toast('请填写', '薪资不能为空'); return; }
      var next = {
        id: job.id || ('cj-' + Date.now()),
        project: (document.getElementById('cjProject') || {}).value || '',
        title: title.trim(), country: country.trim(), salary: salary.trim(),
        headcount: Number((document.getElementById('cjHead') || {}).value || 1),
        contract: (document.getElementById('cjContract') || {}).value || '',
        duties: lines((document.getElementById('cjDuties') || {}).value),
        hard: lines((document.getElementById('cjHard') || {}).value),
        pref: lines((document.getElementById('cjPref') || {}).value),
        life: lines((document.getElementById('cjLife') || {}).value),
        benefits: job.benefits || [],
        status: job.status || 'draft',
        updatedAt: new Date().toISOString()
      };
      var idx = jobs.findIndex(function (x) { return x.id === next.id; });
      if (idx >= 0) jobs[idx] = next; else jobs.unshift(next);
      save(); renderList(); preview(next);
      toast('已保存', '岗位已保存为' + (next.status === 'published' ? '已发布' : '草稿'));
      syncSave(next).catch(function () { toast('仅本地', '后端暂时不可用，岗位已保存在浏览器'); });
    };
    try { host.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e) {}
  }
  function paper(job, annotate) {
    var a = annotate ? diagnoseJob(job) : null;
    var duties = (job.duties || []).map(function (x, i) {
      return '<li>' + (annotate && i === 0 ? '<span class="hja-hl pending">' + esc(x) + '</span>' : esc(x)) + '</li>';
    }).join('');
    if (annotate && !(job.duties || []).length) duties = '<li><span class="hja-hl gap">职责不足，候选人无法判断实际工作内容</span></li>';
    var hard = (job.hard || []).map(function (x, i) {
      return '<li>' + (annotate && i === 0 ? '<span class="hja-hl pending">' + esc(x) + '</span>' : esc(x)) + '</li>';
    }).join('');
    var pref = (job.pref || []).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('');
    var life = (job.life || []).map(function (x, i) {
      return '<li>' + (annotate && i === 0 ? '<span class="hja-hl pending">' + esc(x) + '</span>' : esc(x)) + '</li>';
    }).join('');
    var benefits = (job.benefits || []).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('');
    function note(kind, title, text) {
      if (!annotate) return '';
      return '<div class="hja-note ' + kind + ' pending"><b>' + title + '</b><span>' + text + '</span></div>';
    }
    var dutyIssue = a && (a.issues || []).filter(function (x) { return /职责/.test(x.title); })[0];
    var hardIssue = a && (a.issues || []).filter(function (x) { return /硬性/.test(x.title); })[0];
    var lifeIssue = a && (a.issues || []).filter(function (x) { return /工作与生活|福利/.test(x.title); })[0];
    var contractIssue = a && (a.issues || []).filter(function (x) { return /合同/.test(x.title); })[0];
    return '<article class="paperdoc">' +
      '<div class="pd-job-head"><div class="pd-job-logo">' + esc((job.project || '岗').slice(0, 1)) + '</div>' +
        '<div class="pd-job-id"><div class="pd-job-company">' + esc(job.project || '未填写项目') + '</div>' +
          '<h1 class="pd-job-title">' + esc(job.title || '未命名岗位') + '<span>驻' + esc(job.country || '') + '</span></h1>' +
          '<div class="pd-job-meta">' + esc(job.country || '') + ' · 招聘 ' + (job.headcount || 1) + ' 人 · 合同 ' + esc(job.contract || '—') + '</div>' +
          '<div class="pd-chips" style="margin-top:6px"><span class="good">' + (job.status === 'published' ? '已发布' : '草稿') + '</span><span>企业岗位</span></div></div>' +
        '<div class="pd-job-pay"><b>' + esc(job.salary || '面议') + '</b><span>' + (job.status === 'published' ? '招聘中' : '待发布') + '</span></div></div>' +
      '<div class="pd-body"><div class="pd-main">' +
        '<section class="pd-sec" data-hja-step="2"><h3>岗位职责</h3><ol class="pd-duty">' + (duties || '<li>待补充</li>') + '</ol>' + note(dutyIssue ? 'gap' : 'hit', dutyIssue ? '职责缺口' : '职责清晰', dutyIssue ? dutyIssue.fix : '岗位职责已覆盖主要工作内容。') + '</section>' +
        '<section class="pd-sec" data-hja-step="3"><h3>任职要求</h3><div class="pd-req-t">硬性条件</div><ul class="pd-req-hard">' + (hard || '<li>待补充</li>') + '</ul>' +
          (pref ? '<div class="pd-req-t">优先条件</div><ul class="pd-req-hard">' + pref + '</ul>' : '') + note(hardIssue ? 'gap' : 'hit', hardIssue ? '硬性要求不足' : '硬性要求明确', hardIssue ? hardIssue.fix : '硬性条件清晰，可用于初筛。') + '</section>' +
        '<section class="pd-sec" data-hja-step="5"><h3>工作与生活</h3><ul class="pd-ul">' + (life || '<li>待补充</li>') + '</ul>' +
          (benefits ? '<div class="pd-req-t">福利</div><ul class="pd-ul">' + benefits + '</ul>' : '') + note(lifeIssue ? 'gap' : 'hit', lifeIssue ? '生活信息不足' : '生活信息完整', lifeIssue ? lifeIssue.fix : '住宿、班车与福利信息可降低流失。') + '</section>' +
        '<section class="pd-sec" data-hja-step="4"><h3>合同与手续</h3><div class="pd-kv wide"><span>合同周期</span><b>' + esc(job.contract || '—') + '</b></div><div class="pd-kv"><span>工作地点</span><b>' + esc(job.country || '—') + '</b></div>' + note(contractIssue ? 'gap' : 'hit', contractIssue ? '合同信息待补' : '合同信息完整', contractIssue ? contractIssue.fix : '合同周期与工作地点已明确。') + '</section>' +
      '</div><aside class="pd-side">' +
        '<section class="pd-sec"><h3>招聘信息</h3><div class="pd-kv"><span>招聘人数</span><b>' + (job.headcount || 1) + ' 人</b></div><div class="pd-kv"><span>状态</span><b>' + (job.status === 'published' ? '已发布' : '草稿') + '</b></div><div class="pd-kv"><span>项目</span><b>' + esc(job.project || '—') + '</b></div></section>' +
        '<section class="pd-sec"><h3>岗位标签</h3><div class="pd-tags"><span class="strong">' + esc(job.title || '') + '</span><span>' + esc(job.country || '') + '</span><span>' + esc(job.contract || '') + '</span></div></section>' +
        '<section class="pd-sec"><h3>下一步</h3><p class="pd-muted">先做 AI 诊断，确认职责/硬性要求/合规信息完整，再发布岗位。</p></section>' +
      '</aside></div>' +
      '<div class="pd-foot"><span>岗位编号 ' + esc(job.id || '—') + '</span><span>企业填写 · 平台结构化展示</span></div></article>';
  }

  function preview(job) {
    var host = document.getElementById('jobPreviewHost');
    var listCard = document.getElementById('jobManageList') && document.getElementById('jobManageList').closest('.card');
    if (!host) return;
    host.innerHTML = '<div class="pf-preview">' +
      '<div class="pf-preview-bar"><div><div class="eyebrow">JOB DESCRIPTION</div><h2>岗位预览 <span>' + (job.status === 'published' ? '已发布' : '草稿') + ' · ' + esc(job.country || '') + '</span></h2>' +
        '<div class="pf-preview-meta"><span class="pf-pill ' + (job.status === 'published' ? 'good' : '') + '">' + (job.status === 'published' ? '已发布' : '草稿') + '</span><span class="pf-pill">招 ' + (job.headcount || 1) + ' 人</span><span class="pf-pill">' + esc(job.salary || '薪资待定') + '</span></div></div>' +
        '<div class="pf-preview-acts"><button class="btn btn-o btn-sm" id="jpBack" type="button">返回列表</button><button class="btn btn-o btn-sm" id="jpEdit" type="button">编辑</button><button class="btn btn-o btn-sm" id="jpAI" type="button">AI 诊断</button><button class="btn ' + (job.status === 'published' ? 'btn-o' : 'btn-p') + ' btn-sm" id="jpPublish" type="button">' + (job.status === 'published' ? '取消发布' : '发布岗位') + '</button></div></div>' +
      '<div class="pf-preview-note">AI 诊断基于当前保存版本；修改岗位后需要重新诊断。</div>' +
      '<div class="docwrap">' + paper(job) + '</div></div>';
    host.style.display = 'block';
    if (listCard) listCard.style.display = 'none';
    host.querySelector('#jpBack').onclick = function () { host.style.display = 'none'; if (listCard) listCard.style.display = ''; renderList(); };
    host.querySelector('#jpEdit').onclick = function () { openForm(job); };
    host.querySelector('#jpAI').onclick = function () { diagnose(job); };
    host.querySelector('#jpPublish').onclick = function () { publish(job, job.status === 'published'); };
    try { host.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e) {}
  }

  function publish(job, unpublish) {
    var next = !unpublish;
    var msg = next ? '发布后，应聘者可在岗位发现中看到这个岗位。确认发布吗？' : '取消发布后，岗位将从应聘者端下架。确认取消吗？';
    HP.modal({
      title: next ? '发布岗位' : '取消发布',
      body: '<div style="font-size:13px;line-height:1.8;color:var(--text-2)">' + msg + '</div>',
      actions: [{ text: '再想想' }, { text: next ? '确认发布' : '确认取消', primary: true, onClick: function (close) {
        close();
        job.status = next ? 'published' : 'draft';
        job.updatedAt = new Date().toISOString();
        save(); renderList(); preview(job);
        toast(next ? '已发布' : '已取消发布', next ? '应聘者现在可以看到这个岗位' : '岗位已从应聘者端下架');
        syncStatus(job, job.status).catch(function () { toast('仅本地', '后端同步失败，岗位状态已在本页生效'); });
      }}]
    });
  }

  function remove(job) {
    HP.modal({
      title: '删除岗位',
      body: '<div style="font-size:13px;line-height:1.8">确定删除「' + esc(job.title) + '」吗？删除后不可恢复。</div>',
      actions: [{ text: '取消' }, { text: '删除', primary: true, onClick: function (close) {
        close();
        jobs = jobs.filter(function (x) { return x.id !== job.id; });
        save(); renderList();
        if (job.serverId) apiJob('DELETE', '/api/company/jobs/' + encodeURIComponent(job.serverId)).catch(function () {});
        var host = document.getElementById('jobPreviewHost');
        if (host) { host.style.display = 'none'; host.innerHTML = ''; }
        var card = document.getElementById('jobManageList') && document.getElementById('jobManageList').closest('.card');
        if (card) card.style.display = '';
        toast('已删除', '岗位已移除');
      }}]
    });
  }

  /* ---------------- AI 诊断 ---------------- */
  function diagnoseJob(job) {
    var issues = [], strengths = [];
    if ((job.duties || []).length >= 4) strengths.push('岗位职责 ' + job.duties.length + ' 条，描述清晰');
    else issues.push({ level: 'high', title: '岗位职责不足', detail: '职责少于 4 条，候选人无法判断实际工作内容', fix: '补充日常操作、异常处理、协作与安全职责' });
    if ((job.hard || []).length >= 3) strengths.push('硬性要求 ' + job.hard.length + ' 条，筛选口径明确');
    else issues.push({ level: 'high', title: '硬性要求不足', detail: '硬性条件少于 3 条，容易收到不匹配简历', fix: '补充经验年限、证书、语言、驻外意愿等硬门槛' });
    if (!job.salary || /面议/.test(job.salary)) issues.push({ level: 'medium', title: '薪资未明确', detail: '薪资面议会降低投递率', fix: '给出薪资区间或构成' });
    if (!job.contract) issues.push({ level: 'medium', title: '合同周期未写明', detail: '合同周期是候选人最关心的条件之一', fix: '补充首签周期与试用期' });
    if (!(job.life || []).length) issues.push({ level: 'low', title: '工作与生活信息不足', detail: '住宿、班车、探亲假等信息会影响转化', fix: '补充住宿、餐饮、班车、探亲假' });
    if (!(job.pref || []).length) issues.push({ level: 'low', title: '缺少优先条件', detail: '没有区分“硬性”和“加分项”', fix: '补充语言、海外经历等优先条件' });
    if (/越南|阿尔及利亚|沙特|哈萨克/.test(job.country || '')) strengths.push('已填写属地：' + job.country);
    if ((job.life || []).length && (job.benefits || []).length) strengths.push('生活与福利信息较完整');
    var high = issues.filter(function (x) { return x.level === 'high'; }).length;
    var mid = issues.filter(function (x) { return x.level === 'medium'; }).length;
    var low = issues.filter(function (x) { return x.level === 'low'; }).length;
    var score = Math.max(55, Math.min(95, 92 - high * 12 - mid * 6 - low * 3));
    return { score: score, issues: issues, strengths: strengths, level: issues.length ? 'medium' : 'good' };
  }

  function generateJobDraft(job) {
    var title = String(job.title || '岗位');
    var country = String(job.country || '');
    var duties, hard, pref, life;
    if (/玻璃|压机|注塑|工艺|设备|操作/.test(title)) {
      duties = ['负责双头压机看机、换模与工艺参数调整，日均产量 1,800 件。', '执行设备日常点检与首件确认，异常及时上报。', '按 5S 与安全规范维护工位，带教新员工。', '配合班组长完成交接班、日报与临时任务。'];
      hard = ['3 年以上相关设备操作经验', '持有效护照，健康证可办理', '能接受两班倒与长期驻外'];
      pref = ['有海外驻厂经历', '会基础英语或当地语言'];
      life = ['园区宿舍，班车接送', '每年 2 次探亲假，往返机票报销'];
    } else if (/矿|采|地质|工程|技术服务/.test(title)) {
      duties = ['负责矿区 / 作业区现场巡检与设备运行记录。', '配合工程师完成采样、测量与异常上报。', '执行安全规程、交接班与 5S 管理。', '协助处理现场突发问题并形成日报。'];
      hard = ['3 年以上矿业 / 工程现场经验', '持有效护照，可办理健康证', '能适应偏远项目与长期驻外'];
      pref = ['有海外项目经验', '基础英语或当地语言'];
      life = ['提供项目住宿与工作餐', '每年 1 次探亲假，往返机票按制度报销'];
    } else if (/电子|装配|产线|班组长/.test(title)) {
      duties = ['负责产线排产、人员调度与现场纪律。', '跟踪良率与工时，处理产线异常。', '配合主管完成新员工培训与交接班。', '执行 5S 与安全生产要求。'];
      hard = ['2 年以上电子厂带班经验', '能接受倒班', '持有效护照'];
      pref = ['会越南语 / 当地语言', '有海外经验'];
      life = ['提供宿舍与工作餐', '每年 1 次探亲假'];
    } else {
      duties = ['负责' + title + '的日常执行与现场协调。', '执行设备 / 现场点检，异常及时上报并记录。', '按安全规范与 5S 要求维护工作区域。', '配合班组长完成交接班、日报与临时任务。'];
      hard = ['2 年以上相关岗位经验', '持有效护照，可办理健康证', '能接受长期驻外与倒班'];
      pref = ['有海外项目经历', '基础英语或当地语言'];
      life = ['提供住宿与工作餐', '每年 1 次探亲假，往返机票按制度报销'];
    }
    if (country) hard.push('能接受长期驻' + country + '工作');
    return { duties: duties, hard: hard, pref: pref, life: life };
  }

  function jobSheet(job, annotate) {
    var a = annotate ? diagnoseJob(job) : null;
    var issues = a ? (a.issues || []) : [];
    var duties = job.duties || [], hard = job.hard || [], pref = job.pref || [], life = job.life || [];
    function noteHTML(kind, title, text) {
      if (!annotate) return '';
      return '<div class="hja-note ' + kind + ' pending"><b>' + esc(title) + '</b><span>' + esc(text) + '</span></div>';
    }
    function issueFor(re) { return issues.filter(function (x) { return re.test(x.title); })[0]; }
    var dutyIssue = issueFor(/职责/), hardIssue = issueFor(/硬性/), lifeIssue = issueFor(/生活|福利/), contractIssue = issueFor(/合同/), prefIssue = issueFor(/优先/);
    var dutyItems = duties.length ? duties.map(function (x, i) {
      return '<li>' + (annotate && i === 0 ? '<span class="hja-hl pending">' + esc(x) + '</span>' : esc(x)) + '</li>';
    }).join('') : '<li class="hja-muted">待补充岗位职责</li>';
    var hardItems = hard.length ? hard.map(function (x, i) {
      return '<li>' + (annotate && i === 0 ? '<span class="hja-hl pending">' + esc(x) + '</span>' : esc(x)) + '</li>';
    }).join('') : '<li class="hja-muted">待补充硬性要求</li>';
    var prefItems = pref.length ? pref.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') : '<li class="hja-muted">待补充优先条件</li>';
    var lifeItems = life.length ? life.map(function (x, i) {
      return '<li>' + (annotate && i === 0 ? '<span class="hja-hl pending">' + esc(x) + '</span>' : esc(x)) + '</li>';
    }).join('') : '<li class="hja-muted">待补充工作与生活信息</li>';
    function sec(no, title, en, step, body) {
      return '<section class="hja-sheet-sec" data-hja-step="' + step + '"><div class="hja-sheet-sec-h"><i>' + no + '</i><b>' + title + '</b><span>' + en + '</span></div>' + body + '</section>';
    }
    return '<div class="hja-sheet">' +
      '<div class="hja-sheet-head" data-hja-step="1"><div class="hja-sheet-logo">' + esc((job.project || '岗').slice(0, 1)) + '</div>' +
        '<div class="hja-sheet-id"><div class="hja-sheet-co">' + esc(job.project || '未填写项目') + '</div>' +
          '<h1 class="hja-sheet-title">' + esc(job.title || '未命名岗位') + '<span>驻' + esc(job.country || '—') + '</span></h1>' +
          '<div class="hja-sheet-meta">' + esc(job.country || '—') + ' · 招 ' + (job.headcount || 1) + ' 人 · 合同 ' + esc(job.contract || '—') + '</div>' +
          '<div class="hja-sheet-chips"><span class="good">' + (job.status === 'published' ? '已发布' : '草稿') + '</span><span>企业岗位</span><span>' + esc(job.salary || '面议') + '</span></div></div>' +
        '<div class="hja-sheet-pay"><b>' + esc(job.salary || '面议') + '</b><span>' + (job.status === 'published' ? '招聘中' : '待发布') + '</span></div></div>' +
      '<div class="hja-sheet-body"><div class="hja-sheet-col">' +
        sec('01', '岗位职责', 'DUTIES', 2, '<ul class="hja-sheet-list">' + dutyItems + '</ul>' + noteHTML(dutyIssue ? 'gap' : 'hit', dutyIssue ? '职责缺口' : '职责清晰', dutyIssue ? dutyIssue.fix : '岗位职责已覆盖主要工作内容。')) +
        sec('02', '任职要求', 'REQUIREMENTS', 3, '<div class="hja-sheet-sub">硬性条件</div><ul class="hja-sheet-list">' + hardItems + '</ul><div class="hja-sheet-sub">优先条件</div><ul class="hja-sheet-list">' + prefItems + '</ul>' + noteHTML(hardIssue ? 'gap' : 'hit', hardIssue ? '硬性要求不足' : '硬性要求明确', hardIssue ? hardIssue.fix : '硬性条件清晰，可用于初筛。')) +
        sec('03', '工作与生活', 'LIFE', 5, '<ul class="hja-sheet-list">' + lifeItems + '</ul>' + noteHTML(lifeIssue ? 'gap' : 'hit', lifeIssue ? '生活信息不足' : '生活信息完整', lifeIssue ? lifeIssue.fix : '住宿、班车与福利信息可降低流失。')) +
      '</div><div class="hja-sheet-col">' +
        sec('04', '招聘信息', 'HIRING', 1, '<div class="hja-sheet-kv"><span>招聘人数</span><b>' + (job.headcount || 1) + ' 人</b></div><div class="hja-sheet-kv"><span>状态</span><b>' + (job.status === 'published' ? '已发布' : '草稿') + '</b></div><div class="hja-sheet-kv"><span>项目</span><b>' + esc(job.project || '—') + '</b></div><div class="hja-sheet-kv"><span>岗位标签</span><b>' + esc(job.title || '—') + '</b></div>') +
        sec('05', '合同与手续', 'CONTRACT', 4, '<div class="hja-sheet-kv"><span>合同周期</span><b>' + esc(job.contract || '—') + '</b></div><div class="hja-sheet-kv"><span>工作地点</span><b>' + esc(job.country || '—') + '</b></div>' + noteHTML(contractIssue ? 'gap' : 'hit', contractIssue ? '合同信息待补' : '合同信息完整', contractIssue ? contractIssue.fix : '合同周期与工作地点已明确。')) +
        sec('06', '诊断下一步', 'NEXT', 6, '<div class="hja-sheet-next">先补齐职责、硬性要求与生活信息，再发布岗位；信息越完整，候选人匹配越准确。</div>' + (annotate && issues.length ? '<div class="hja-sheet-next" style="color:#f0c27b">当前 ' + issues.length + ' 项待补充，可在「编辑岗位」中一键生成。</div>' : '')) +
      '</div></div></div>';
  }

  function jobAnalysisHTML(job) {
    var a = diagnoseJob(job);
    var issues = a.issues || [];
    var steps = [
      ['解析岗位', '识别岗位名称、国家与招聘人数'],
      ['提取职责', '抽取岗位职责与工作内容'],
      ['核验硬性', '检查经验、证书与语言门槛'],
      ['比对合规', '核对合同、工时与保险信息'],
      ['评估吸引力', '评估薪资、生活与福利'],
      ['生成建议', '输出完整度与补充建议']
    ];
    var stepHTML = steps.map(function (x, i) {
      return '<div class="hja-step" data-step="' + (i + 1) + '"><i>' + String(i + 1).padStart(2, '0') + '</i><div><b>' + x[0] + '</b><span>' + x[1] + '</span></div></div>';
    }).join('');
    var missing = [];
    if (!(job.duties || []).length) missing.push('职责');
    if (!(job.hard || []).length) missing.push('硬性要求');
    if (!(job.life || []).length) missing.push('工作与生活');
    var warnHTML = missing.length ? '<div class="hja-warn">当前岗位信息不完整（' + missing.join(' / ') + '），建议先编辑或 AI 重新生成。<button id="hjaEditWarn" type="button">去编辑</button></div>' : '';
    return '<div class="hja-head"><div><div class="hja-eyebrow">JOB INTELLIGENCE</div><h2>岗位 AI 诊断 <span>基于当前保存版本 · ' + esc(job.country || '') + '</span></h2></div><span class="hja-mode">规则引擎 · 当前版本</span></div>' +
      '<div class="hja-shell"><aside class="hja-rail"><div class="hja-rail-h">诊断路径 <span>06 STEPS</span></div><div class="hja-rail-line"></div>' + stepHTML + '</aside>' +
      '<div class="hja-stage">' + warnHTML + jobSheet(job, true) + '</div></div>' +
      '<div class="hja-console"><div class="hja-sum"><span class="hja-ok">✓</span><span id="hjaSum">正在生成诊断…</span><b id="hjaScore">' + a.score + '</b><span class="hja-score-label">完整度</span></div>' +
      '<div class="hja-acts"><button class="btn btn-o btn-sm" id="hjaReport" type="button">查看报告</button><button class="btn btn-o btn-sm" id="hjaEdit" type="button">编辑岗位</button><button class="btn ' + (job.status === 'published' ? 'btn-o' : 'btn-p') + ' btn-sm" id="hjaPublish" type="button">' + (job.status === 'published' ? '取消发布' : '发布岗位') + '</button></div></div>';
  }

  function showJobReport(job, a) {
    var issues = a.issues || [], strengths = a.strengths || [];
    var body = '<div class="hja-report"><div class="hja-report-score"><div class="hja-ring" style="--p:' + a.score + '%"><b>' + a.score + '</b><span>完整度</span></div><div><div class="hja-verdict">' + (a.score >= 85 ? '可以发布' : a.score >= 70 ? '建议补齐后发布' : '先补齐关键信息') + '</div><p>岗位职责、硬性要求、薪资合同与生活信息越完整，候选人匹配越准确。</p></div></div>' +
      '<div class="hja-report-cols"><div class="hja-report-block"><h4>优势 <span>' + strengths.length + '</span></h4><ul>' + (strengths.length ? strengths.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') : '<li>暂未识别到明显优势。</li>') + '</ul></div>' +
      '<div class="hja-report-block"><h4>需要补充 <span>' + issues.length + '</span></h4>' + (issues.length ? issues.map(function (x) {
        var lv = x.level === 'high' ? 'high' : x.level === 'medium' ? 'mid' : 'low';
        return '<div class="hja-report-issue"><div><span class="lv ' + lv + '">' + (lv === 'high' ? '高优先级' : lv === 'mid' ? '建议优化' : '可补充') + '</span><b>' + esc(x.title) + '</b></div><p>' + esc(x.detail) + '</p><div class="hja-fix">→ ' + esc(x.fix) + '</div></div>';
      }).join('') : '<div class="hja-ok-box">岗位信息比较完整，可以发布。</div>') + '</div></div></div>';
    var close = HP.modal({ title: '岗位诊断报告', wide: true, body: body, actions: [{ text: '关闭', primary: true }] });
    setTimeout(function () {
      var masks = document.querySelectorAll('.hp-modal-mask');
      var last = masks[masks.length - 1];
      if (last) last.style.zIndex = '10050';
    }, 0);
  }

  function diagnose(job) {
    if (document.getElementById('hpJobAI')) return;
    var wrap = document.createElement('div');
    wrap.id = 'hpJobAI';
    wrap.innerHTML = '<div class="hp-aiflow-bar"><i class="dot"></i><b id="hjaTitle">岗位 AI 诊断 · 开机动画</b><span>基于当前保存版本</span><div class="acts"><button id="hjaVoice" type="button">语音 ON</button><button id="hjaSkip" type="button">跳过开机 →</button><button id="hjaClose" type="button">关闭 ×</button></div></div>' +
      '<div class="hp-aiflow-loading" id="hjaLoading">正在启动诊断引擎…</div>' +
      '<iframe class="hp-aiflow-frame" id="hjaFrame" allow="autoplay; fullscreen" src="demo/boot-embed.html?auto&mode=job&doc=' + encodeURIComponent(String((job && job.id) || 'JOB-2026-0011')) + '"></iframe>' +
      '<div class="hp-ai-data" id="hjaData" hidden></div>';
    document.body.appendChild(wrap);
    document.documentElement.style.overflow = 'hidden';
    var frame = wrap.querySelector('#hjaFrame');
    var data = wrap.querySelector('#hjaData');
    var loading = wrap.querySelector('#hjaLoading');
    var title = wrap.querySelector('#hjaTitle');
    var skip = wrap.querySelector('#hjaSkip');
    var timer;
    var voiceOn = true;
    var voiceCache = {};
    function utter(text) {
      try {
        var u = new SpeechSynthesisUtterance(text);
        var L = (window.HPI18N && HPI18N.lang()) || 'zh';
        u.lang = { zh: 'zh-CN', en: 'en-US', ja: 'ja-JP', th: 'th-TH', ar: 'ar-SA', fr: 'fr-FR' }[L] || 'zh-CN';
        u.rate = 1.12; u.pitch = 1; u.volume = 1;
        speechSynthesis.speak(u);
      } catch (e) {}
    }
    function speak(text) {
      if (!voiceOn || !window.speechSynthesis) return;
      var L = (window.HPI18N && HPI18N.lang()) || 'zh';
      if (L === 'zh' || !/[\u4e00-\u9fa5]/.test(String(text))) { utter(text); return; }
      if (voiceCache[L + '|' + text]) { utter(voiceCache[L + '|' + text]); return; }
      fetch('/api/translate', {
        method: 'POST', credentials: 'same-origin',
        headers: { 'content-type': 'application/json', 'x-hp-request': '1' },
        body: JSON.stringify({ texts: [text], target: L })
      }).then(function (r) { return r.json(); }).then(function (j) {
        var t = j && j.texts && j.texts[0];
        if (t) voiceCache[L + '|' + text] = t;
        utter(t || text);
      }).catch(function () { utter(text); });
    }
    function localize(root) {
      if (!root || !window.HPI18N || HPI18N.lang() === 'zh') return;
      try { HPI18N.apply(root); } catch (e) {}
      try { HPI18N.translateLive(root); } catch (e) {}
    }
    var screen = null;
    function openScreen(html) {
      closeScreen();
      screen = document.createElement('div');
      screen.className = 'hja-screen';
      screen.id = 'hjaScreen';
      screen.innerHTML = html;
      wrap.appendChild(screen);
      setTimeout(function () { localize(screen); }, 30);
      setTimeout(function () { localize(screen); }, 700);
      try { if (window.speechSynthesis) speechSynthesis.cancel(); } catch (e) {}
      return screen;
    }
    function closeScreen() {
      if (screen) { screen.remove(); screen = null; }
    }
    function reportHTML(job, a) {
      var issues = a.issues || [], strengths = a.strengths || [];
      var duties = (job.duties || []), hard = (job.hard || []), pref = (job.pref || []), life = (job.life || []);
      var dims = [
        { k: '职责完整度', v: duties.length >= 4 ? 100 : duties.length ? 62 : 18, t: duties.length + ' 条' },
        { k: '硬性要求', v: hard.length >= 3 ? 100 : hard.length ? 58 : 16, t: hard.length + ' 条' },
        { k: '合规信息', v: job.contract ? 100 : 32, t: job.contract ? '已填写' : '未填写' },
        { k: '生活信息', v: life.length >= 2 ? 100 : life.length ? 56 : 20, t: life.length + ' 条' },
        { k: '薪资竞争力', v: job.salary ? 100 : 30, t: job.salary || '面议' },
        { k: '发布准备度', v: a.score, t: a.score + ' 分' }
      ];
      var bars = dims.map(function (d) {
        return '<div class="hjb-bar"><span class="k">' + d.k + '</span><span class="track"><i style="width:' + d.v + '%"></i></span><span class="v">' + d.v + '</span></div>';
      }).join('');
      var map = [
        { k: '岗位职责', v: duties.length ? duties.length + ' 条' : '未填写', ok: duties.length >= 4, tip: duties.length >= 4 ? '已覆盖' : '不足 4 条' },
        { k: '硬性要求', v: hard.length ? hard.length + ' 条' : '未填写', ok: hard.length >= 3, tip: hard.length >= 3 ? '已覆盖' : '不足 3 条' },
        { k: '优先条件', v: pref.length ? pref.length + ' 条' : '未填写', ok: pref.length > 0, tip: pref.length ? '已区分' : '待补充' },
        { k: '合同周期', v: job.contract || '未填写', ok: !!job.contract, tip: job.contract ? '已明确' : '待补充' },
        { k: '工作与生活', v: life.length ? life.length + ' 条' : '未填写', ok: life.length >= 2, tip: life.length >= 2 ? '已覆盖' : '待补充' },
        { k: '薪资', v: job.salary || '面议', ok: !!job.salary, tip: job.salary ? '已明确' : '待补充' },
        { k: '项目归属', v: job.project || '未填写', ok: !!job.project, tip: job.project ? '已关联' : '待补充' }
      ];
      var mapHTML = map.map(function (x) {
        return '<div class="hjb-map-row"><span class="l">' + esc(x.k) + '</span><span class="v">' + esc(x.v) + '</span><span class="line ' + (x.ok ? 'ok' : 'gap') + '"><i></i></span><span class="st ' + (x.ok ? 'ok' : 'gap') + '">' + x.tip + '</span></div>';
      }).join('');
      var breakdown = [
        ['职责完整度', 25, duties.length >= 4 ? 25 : duties.length ? 15 : 4],
        ['硬性要求', 25, hard.length >= 3 ? 25 : hard.length ? 14 : 4],
        ['合规信息', 20, job.contract ? 20 : 6],
        ['生活信息', 15, life.length >= 2 ? 15 : life.length ? 8 : 3],
        ['薪资竞争力', 10, job.salary ? 10 : 3],
        ['项目归属', 5, job.project ? 5 : 1]
      ];
      var breakdownHTML = breakdown.map(function (x) {
        var pct = x[1] ? Math.round(x[2] / x[1] * 100) : 0;
        return '<div class="hjb-break"><span class="k">' + x[0] + '</span><span class="track"><i style="width:' + pct + '%"></i></span><span class="v">' + x[2] + ' / ' + x[1] + '</span></div>';
      }).join('');
      return '<div class="hjb-hero"><div class="hjb-score" style="--p:' + a.score + '"><b>' + a.score + '</b><span>完整度</span></div>' +
        '<div class="hjb-hero-main"><div class="hjb-badge">' + (a.score >= 85 ? '可以发布' : a.score >= 70 ? '建议补齐后发布' : '先补齐关键信息') + '</div>' +
        '<h3>' + (a.score >= 85 ? '岗位信息比较完整' : '需要补齐关键信息') + '</h3>' +
        '<p>岗位职责、硬性要求、薪资合同与生活信息越完整，候选人匹配越准确。</p><div class="hjb-bars">' + bars + '</div></div></div>' +
        '<section class="hjb-sec"><div class="hjb-sec-h"><span>01</span><b>岗位要素对照</b><em>JOB POST ELEMENTS</em></div><div class="hjb-map">' + mapHTML + '</div></section>' +
        '<section class="hjb-sec"><div class="hjb-sec-h"><span>02</span><b>分数构成</b><em>BREAKDOWN</em></div><div class="hjb-breaks">' + breakdownHTML + '</div></section>' +
        '<div class="hjb-two"><section class="hjb-sec"><div class="hjb-sec-h"><span>03</span><b>优势</b><em>STRENGTHS</em></div><ul class="hjb-list">' + (strengths.length ? strengths.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') : '<li>暂未识别到明显优势。</li>') + '</ul></section>' +
        '<section class="hjb-sec"><div class="hjb-sec-h"><span>04</span><b>需要补充</b><em>TO IMPROVE</em></div>' + (issues.length ? issues.map(function (x) {
          var lv = x.level === 'high' ? 'high' : x.level === 'medium' ? 'mid' : 'low';
          return '<div class="hjb-issue"><div><span class="lv ' + lv + '">' + (lv === 'high' ? '高优先级' : lv === 'mid' ? '建议优化' : '可补充') + '</span><b>' + esc(x.title) + '</b></div><p>' + esc(x.detail) + '</p><div class="fix">→ ' + esc(x.fix) + '</div></div>';
        }).join('') : '<div class="hjb-ok">岗位信息比较完整，可以发布。</div>') + '</section></div>';
    }
    function openReport() {
      var a = diagnoseJob(job);
      var s = openScreen('<div class="hjb-report"><div class="hjb-top"><button class="hjb-back" id="hsBack" type="button">← 返回</button><h2>岗位诊断报告</h2><span class="hjb-sub">' + esc(job.title || '未命名岗位') + ' · ' + esc(job.project || '未填写项目') + '（' + esc(job.country || '—') + '）</span><span class="hjb-engine">规则引擎 · 当前版本</span><div class="hjb-top-acts"><button class="btn btn-o btn-sm" id="hsEdit" type="button">编辑岗位</button><button class="btn ' + (job.status === 'published' ? 'btn-o' : 'btn-p') + ' btn-sm" id="hsPublish" type="button">' + (job.status === 'published' ? '取消发布' : '发布岗位') + '</button></div></div>' +
        reportHTML(job, a) + '</div>');
      s.querySelector('#hsBack').onclick = closeScreen;
      s.querySelector('#hsEdit').onclick = function () { closeScreen(); openEdit(); };
      s.querySelector('#hsPublish').onclick = function () { closeScreen(); close(); publish(job, job.status === 'published'); };
    }
    function openEdit() {
      var initial = diagnoseJob(job);
      var issues = initial.issues || [];
      function targetFor(title) {
        if (/职责/.test(title)) return 'heDuties';
        if (/硬性/.test(title)) return 'heHard';
        if (/优先/.test(title)) return 'hePref';
        if (/生活|福利/.test(title)) return 'heLife';
        if (/合同/.test(title)) return 'heContract';
        if (/薪资/.test(title)) return 'heSalary';
        return 'heDuties';
      }
      var sugHTML = issues.length ? issues.map(function (x) {
        var target = targetFor(x.title);
        return '<div class="hja-sug-item"><b>' + esc(x.title) + '</b><p>' + esc(x.fix) + '</p><button type="button" data-target="' + target + '" data-fix="' + esc(x.fix) + '">采用建议</button></div>';
      }).join('') : '<div class="hja-sug-item"><b>当前没有明显缺口</b><p>可以微调表达后重新生成。</p></div>';
      var s = openScreen('<div class="hje">' +
        '<div class="hje-top"><button class="hje-back" id="heBack" type="button">← 返回</button><h2>编辑岗位</h2><span>保存后可重新分析，查看分数变化</span><div class="hje-top-acts"><button class="btn btn-o btn-sm" id="heGen" type="button">AI 重新生成</button></div></div>' +
        '<div class="hje-tip">岗位中<b>所有信息均可修改</b>。AI 只在你已有内容的基础上帮你表达得更清楚，不会替你编造职责或要求。</div>' +
        '<section class="hje-sec"><div class="hje-sec-h"><span>01</span><b>基本信息</b><em>点击任意字段即可修改</em></div><div class="hje-grid2">' +
          '<div class="hje-frow"><span>岗位名称</span><input id="heTitle" value="' + esc(job.title || '') + '"></div>' +
          '<div class="hje-frow"><span>国家</span><input id="heCountry" value="' + esc(job.country || '') + '"></div>' +
          '<div class="hje-frow"><span>项目</span><input id="heProject" value="' + esc(job.project || '') + '"></div>' +
          '<div class="hje-frow"><span>合同周期</span><input id="heContract" value="' + esc(job.contract || '') + '"></div>' +
          '<div class="hje-frow"><span>招聘人数</span><input id="heHead" type="number" value="' + (job.headcount || 1) + '"></div>' +
          '<div class="hje-frow"><span>薪资</span><input id="heSalary" value="' + esc(job.salary || '') + '"></div>' +
        '</div></section>' +
        '<section class="hje-sec"><div class="hje-sec-h"><span>02</span><b>岗位职责</b><em>每行一条 · 影响候选人判断</em></div>' +
          '<textarea class="hje-ta" id="heDuties" rows="5">' + esc((job.duties || []).join('\n')) + '</textarea>' +
          '<div class="hje-tools"><button class="fbtn" type="button" data-polish="heDuties">AI 润色这段</button><span class="hje-cnt"></span></div></section>' +
        '<section class="hje-sec"><div class="hje-sec-h"><span>03</span><b>任职要求</b><em>硬性 / 优先分开写</em></div>' +
          '<div class="hje-sub">硬性条件</div><textarea class="hje-ta" id="heHard" rows="3">' + esc((job.hard || []).join('\n')) + '</textarea>' +
          '<div class="hje-tools"><button class="fbtn" type="button" data-polish="heHard">AI 润色这段</button><span class="hje-cnt"></span></div>' +
          '<div class="hje-sub">优先条件</div><textarea class="hje-ta" id="hePref" rows="2">' + esc((job.pref || []).join('\n')) + '</textarea>' +
          '<div class="hje-tools"><button class="fbtn" type="button" data-polish="hePref">AI 润色这段</button><span class="hje-cnt"></span></div></section>' +
        '<section class="hje-sec"><div class="hje-sec-h"><span>04</span><b>工作与生活</b><em>住宿、班车、探亲假</em></div>' +
          '<textarea class="hje-ta" id="heLife" rows="3">' + esc((job.life || []).join('\n')) + '</textarea>' +
          '<div class="hje-tools"><button class="fbtn" type="button" data-polish="heLife">AI 润色这段</button><span class="hje-cnt"></span></div></section>' +
        '<section class="hje-sec"><div class="hje-sec-h"><span>05</span><b>诊断建议</b><em>点「采用建议」写进对应字段</em></div>' +
          '<div class="hje-sug-list">' + sugHTML + '</div>' +
          '<button class="hje-gen" id="heGenerate" type="button">AI 重新生成岗位内容</button></section>' +
        '<div class="hje-foot"><button class="btn btn-p" id="heRegen" type="button">保存并重新分析</button><button class="btn btn-o" id="heSave" type="button">保存草稿</button><button class="btn btn-o" id="heCancel" type="button">取消</button></div>' +
      '</div>');
      function generateIntoForm() {
        var title = (document.getElementById('heTitle') || {}).value || job.title || '';
        var country = (document.getElementById('heCountry') || {}).value || job.country || '';
        var g = generateJobDraft({ title: title, country: country });
        var filled = (document.getElementById('heDuties') || {}).value || '';
        if (filled.trim() && !window.confirm('会覆盖当前职责、硬性要求、优先条件和生活信息，继续吗？')) return;
        var set = function (id, arr) { var el = document.getElementById(id); if (el) el.value = arr.join('\n'); };
        set('heDuties', g.duties); set('heHard', g.hard); set('hePref', g.pref); set('heLife', g.life);
        toast('已重新生成', '请核对岗位内容后保存并重新生成分析');
      }
      s.querySelector('#heBack').onclick = closeScreen;
      s.querySelector('#heGen').onclick = generateIntoForm;
      s.querySelector('#heGenerate').onclick = generateIntoForm;
      s.querySelectorAll('[data-fix]').forEach(function (b) {
        b.onclick = function () {
          var el = document.getElementById(b.dataset.target);
          if (!el) return;
          var fix = b.dataset.fix || '';
          if (b.dataset.target === 'heContract' || b.dataset.target === 'heSalary') el.value = fix;
          else if (el.value.indexOf(fix) < 0) el.value = el.value.trim() ? el.value.trim() + '\n' + fix : fix;
          b.disabled = true; b.textContent = '已采用';
          toast('已写入', '已补到对应字段，可继续修改');
        };
      });
      s.querySelector('#heCancel').onclick = closeScreen;
      s.querySelectorAll('[data-polish]').forEach(function (b) {
        b.onclick = function () {
          var el = document.getElementById(b.dataset.polish);
          if (!el || !el.value.trim()) return;
          b.disabled = true; b.textContent = '润色中…';
          apiJob('POST', '/api/persona/resume/polish', { text: el.value, title: (document.getElementById('heTitle') || {}).value || job.title, country: (document.getElementById('heCountry') || {}).value || job.country }).then(function (res) {
            var out = res.polish || {};
            if (out.after) el.value = out.after;
            b.disabled = false; b.textContent = 'AI 润色';
            toast('已润色', '请核对后保存');
          }).catch(function (e) {
            b.disabled = false; b.textContent = 'AI 润色';
            toast('润色失败', e.message || '请稍后重试');
          });
        };
      });
      function collect() {
        return {
          id: job.id, serverId: job.serverId,
          project: (document.getElementById('heProject') || {}).value || '',
          title: (document.getElementById('heTitle') || {}).value || '',
          country: (document.getElementById('heCountry') || {}).value || '',
          headcount: Number((document.getElementById('heHead') || {}).value || 1),
          contract: (document.getElementById('heContract') || {}).value || '',
          salary: (document.getElementById('heSalary') || {}).value || '',
          duties: lines((document.getElementById('heDuties') || {}).value),
          hard: lines((document.getElementById('heHard') || {}).value),
          pref: lines((document.getElementById('hePref') || {}).value),
          life: lines((document.getElementById('heLife') || {}).value),
          benefits: job.benefits || [],
          status: job.status || 'draft',
          updatedAt: new Date().toISOString()
        };
      }
      function saveEdit(reanalyze) {
        var next = collect();
        if (!String(next.title).trim()) { toast('请填写', '岗位名称不能为空'); return; }
        var idx = jobs.findIndex(function (x) { return x.id === next.id; });
        if (idx >= 0) jobs[idx] = next; else jobs.unshift(next);
        save();
        closeScreen(); close();
        if (reanalyze) setTimeout(function () { diagnose(next); }, 80);
        else preview(next);
        syncSave(next).catch(function () { toast('仅本地', '后端同步失败，岗位已保存在浏览器'); });
      }
      s.querySelector('#heSave').onclick = function () { saveEdit(false); };
      s.querySelector('#heRegen').onclick = function () { saveEdit(true); };
    }
    function close() {
      if (timer) clearTimeout(timer);
      try { if (frame.contentWindow && frame.contentWindow.speechSynthesis) frame.contentWindow.speechSynthesis.cancel(); } catch (e) {}
      try { if (window.speechSynthesis) speechSynthesis.cancel(); } catch (e) {}
      wrap.remove(); document.documentElement.style.overflow = '';
      window.removeEventListener('message', onDone);
      document.removeEventListener('keydown', onKey);
    }
    function show() {
      if (data && !data.hidden) return;
      if (timer) clearTimeout(timer);
      try { if (frame.contentWindow && frame.contentWindow.speechSynthesis) frame.contentWindow.speechSynthesis.cancel(); } catch (e) {}
      title.textContent = '岗位 AI 诊断';
      skip.style.display = '';
      skip.textContent = '重新分析';
      skip.onclick = function () { close(); diagnose(job); };
      try { if (frame.contentWindow && frame.contentWindow.speechSynthesis) frame.contentWindow.speechSynthesis.cancel(); } catch (e) {}
      frame.style.display = 'none';
      if (data) {
        data.hidden = false;
        data.innerHTML = jobAnalysisHTML(job);
        localize(data);
        var a = diagnoseJob(job);
        var steps = data.querySelectorAll('.hja-step');
        var sum = data.querySelector('#hjaSum');
        var voiceLines = ['解析岗位结构。', '提取岗位职责。', '核验硬性要求。', '比对合同与合规信息。', '评估薪资与生活条件。', '生成诊断建议。'];
        try { if (window.speechSynthesis) speechSynthesis.cancel(); } catch (e) {}
        setTimeout(function () { speak('岗位诊断已启动。'); }, 260);
        steps.forEach(function (el, i) {
          setTimeout(function () {
            if (!document.body.contains(el)) return;
            steps.forEach(function (x) { x.classList.remove('on'); });
            el.classList.add('on', 'done');
            if (sum) { sum.textContent = voiceLines[i].replace(/。$/, '…'); localize(sum); }
            var target = data.querySelector('[data-hja-step="' + (i + 1) + '"]');
            if (target) {
              target.classList.add('lit');
              target.querySelectorAll('.pending').forEach(function (x) { x.classList.remove('pending'); });
            }
            speak(voiceLines[i]);
            if (i === steps.length - 1 && sum) {
              sum.textContent = '分析完成 · ' + (a.issues || []).length + ' 项待补充';
              localize(sum);
              speak('岗位诊断完成，建议已生成。');
            }
          }, 420 + i * 620);
        });
        data.querySelector('#hjaReport').onclick = openReport;
        data.querySelector('#hjaEdit').onclick = openEdit;
        var warnEdit = data.querySelector('#hjaEditWarn');
        if (warnEdit) warnEdit.onclick = openEdit;
        data.querySelector('#hjaPublish').onclick = function () { close(); publish(job, job.status === 'published'); };
      }
      loading.classList.add('off');
    }
    function onDone(e) { if (e && e.data && e.data.type === 'hp:boot-done') show(); }
    function onKey(e) { if (e.key === 'Escape') close(); }
    window.addEventListener('message', onDone);
    frame.addEventListener('load', function () { setTimeout(function () { loading.classList.add('off'); }, 300); });
    skip.onclick = show;
    var voiceBtn = wrap.querySelector('#hjaVoice');
    if (voiceBtn) voiceBtn.onclick = function () {
      voiceOn = !voiceOn;
      voiceBtn.textContent = '语音 ' + (voiceOn ? 'ON' : 'OFF');
      if (!voiceOn) { try { speechSynthesis.cancel(); } catch (e) {} }
      else speak('语音已开启。');
    };
    wrap.querySelector('#hjaClose').onclick = close;
    document.addEventListener('keydown', onKey);
    timer = setTimeout(show, 9000);
  }

  document.addEventListener('click', function (e) {
    if (e.target.closest('#btnNewJobTop')) { e.preventDefault(); openForm(null); }
  });
  document.addEventListener('DOMContentLoaded', function () { setTimeout(ensureUI, 300); });
  if (document.readyState !== 'loading') setTimeout(ensureUI, 300);
  window.HPCompanyJob = { openNew: function () { openForm(null); }, preview: preview, jobs: function () { return jobs; } };
})();
