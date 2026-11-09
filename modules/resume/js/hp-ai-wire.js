/* =====================================================================
 * hp-ai-wire.js —— 把 AI 分析接入现有页面（我的档案 / 项目管理）
 * ---------------------------------------------------------------------
 * 职责：
 *  - 我的档案：查看简历预览、材料上传与 AI 检查
 *  - 项目管理：岗位管理列表（草稿/已发布）、新建岗位、粘贴智能填入
 * 所有入口都嵌在原有页面里，不新增菜单。
 * ===================================================================== */
(function () {
  'use strict';

  var AI = window.HPAI;
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return AI ? AI.esc(s) : String(s == null ? '' : s); }
  function api(p, o) { return AI ? AI.api(p, o) : Promise.reject(new Error('AI 模块未加载')); }
  function toast(t, m) { if (window.HP && window.HP.toast) window.HP.toast(t, m); }

  /* ==================================================================
     一、我的档案：简历预览 + 材料
     ================================================================== */
  var MAT = { busy: false, result: null, file: null, text: '' };
  var lastResume = null;

  function loadMyResume() {
    var uid = (window.HPBridge && window.HPBridge.getUser && window.HPBridge.getUser() || {}).id || '';
    return api('/api/persona/resume/analyze', { method: 'POST', body: {} })
      .then(function (res) { return res; })
      .catch(function () { return null; });
  }

  /* 找一个合适的目标岗位作为证据链基准：优先同国家的、其次任意招聘中岗位 */
  function findTargetJob(resume) {
    return api('/api/company/jobs?status=all').then(function (res) {
      var jobs = (res && res.jobs) || [];
      var live = jobs.filter(function (j) { return /招聘中|新岗位/.test(j.status || ''); });
      var pool = live.length ? live : jobs;
      var prefs = (resume && resume.preferredCountries) || [];
      var same = pool.find(function (j) { return prefs.indexOf(j.country) >= 0; });
      return same || pool[0] || null;
    }).catch(function () { return null; });
  }

  /* 取当前用户的完整简历（优先 /api/company/resumes/me，后端已允许应聘者读自己那份） */
  function fetchMyResume() {
    return api('/api/company/resumes/me')
      .then(function (res) { return res && res.resume ? res.resume : null; })
      .catch(function () {
        /* 兜底：用推荐接口里的精简候选人信息 */
        return api('/api/persona/recommendations').then(function (r) {
          var c = (r && r.candidate) || null;
          if (!c) return null;
          return Object.assign({ id: c.id }, c, { name: c.name || '我' });
        }).catch(function () { return null; });
      });
  }

  /* 用人才档案 + 推荐列表补全成"简历形态" */
  function toResumeShape(cand) {
    if (!cand) return null;
    var c = Object.assign({}, cand);
    c.id = cand.id || cand.candidateId;
    c.name = cand.name || '我';
    return c;
  }

  function mountResumeUI() {
    var btn = $('#btnResumePreview');
    if (!btn || btn.dataset.bound === '1') return;
    btn.dataset.bound = '1';
    btn.addEventListener('click', function () {
      var host = $('#resumePreviewHost');
      if (!host) return;
      btn.disabled = true;
      btn.textContent = '加载中…';
      fetchMyResume().then(function (resume) {
        btn.disabled = false;
        btn.textContent = '查看简历 · AI 分析';
        if (!resume) { toast('无法加载简历', '请确认已登录应聘者账号'); return; }
        var wrap = document.querySelector('.view[data-view="profile"] .grid');
        if (wrap) wrap.style.display = 'none';
        host.style.display = 'block';
        /* 找一个与意向国一致的目标岗位，作为"证据链"的对照基准 */
        findTargetJob(resume).then(function (job) {
          window.HPResumePreview.open(host, {
            resume: resume,
            job: job,
            onBack: function () {
              host.style.display = 'none';
              host.innerHTML = '';
              if (wrap) wrap.style.display = '';
            }
          });
          host.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      }).catch(function (err) {
        btn.disabled = false;
        btn.textContent = '查看简历 · AI 分析';
        toast('加载失败', err.message);
      });
    });
  }

  function mountMaterialUI() {
    var up = $('#btnMatUpload');
    var file = $('#matFile');
    var an = $('#btnMatAnalyze');
    var type = $('#matType');
    if (!up || up.dataset.bound === '1') return;
    up.dataset.bound = '1';

    /* 上传：读文本 → 存本地变量（演示环境不破坏后端存储） */
    up.addEventListener('click', function () { if (file) file.click(); });
    if (file) {
      file.addEventListener('change', function () {
        var f = file.files && file.files[0];
        if (!f) return;
        MAT.file = f.name;
        var reader = new FileReader();
        reader.onload = function () {
          MAT.text = String(reader.result || '').slice(0, 8000);
          toast('材料已就绪', f.name + ' · 可点「AI 检查这份材料」');
        };
        reader.onerror = function () { MAT.text = '[无法读取文件内容]'; toast('读取失败', '请尝试 PDF/JPG/PNG 或 TXT'); };
        try { reader.readAsText(f); } catch (e) { MAT.text = ''; toast('提示', '该格式无法直接读取文字，将按类型做基础检查'); }
      });
    }

    if (an) {
      an.addEventListener('click', function () {
        if (!MAT.file) { toast('请先上传材料', '点击「上传材料」选择文件'); return; }
        var host = $('#resumePreviewHost');
        if (!host) return;
        var wrap = document.querySelector('.view[data-view="profile"] .grid');
        if (wrap) wrap.style.display = 'none';
        host.style.display = 'block';
        host.innerHTML = '<div class="aiw"><div class="aic"><div class="ai-load"><span class="ai-spin"></span>AI 正在检查材料…</div></div></div>';
        api('/api/persona/materials/analyze', {
          method: 'POST',
          body: { type: type ? type.value : 'other', text: MAT.text || MAT.file, name: MAT.file }
        }).then(function (res) {
          var a = res.analysis;
          host.innerHTML = '<div class="aiw">' +
            '<div class="aih"><span class="t">材料 AI 检查</span><span class="st">' + esc(MAT.file) + '</span>' +
            '<span class="sp"></span><button class="btn btn-o btn-sm" id="matBack">返回</button></div>' +
            '<div class="aiv"><div><div class="aic"><div class="aic-h"><span>📄</span><span>' + esc(a.typeName) + '</span></div>' +
            '<div class="aic-b">' + AI.renderMaterial(a) + '</div></div></div>' +
            '<div class="aiv-side">' + (a.culture ? AI.renderCulture(a.culture) : '') + '</div></div></div>';
          $('#matBack').onclick = function () {
            host.style.display = 'none'; host.innerHTML = '';
            if (wrap) wrap.style.display = '';
          };
        }).catch(function (err) {
          host.innerHTML = '<div class="aiw"><div class="ai-empty"><div class="big">⚠️</div><p>检查失败：' + esc(err.message) + '</p></div></div>';
        });
      });
    }
  }

  /* ==========================================================
     二、项目管理：项目 → 岗位（两级）
        第一步：新建项目（国家 / 项目名 / 规模）
        第二步：在项目卡片上「添加岗位」→ 填写或粘贴 → 预览 → 保存/发布
     ========================================================== */

  /* 新建项目弹窗 */
  function openNewProjectDialog() {
    var host = $('#jobPreviewHost') || createHost();
    host.style.display = 'block';
    host.innerHTML =
      '<div class="aiw"><div class="aih"><span class="t">新建项目</span>' +
      '<span class="st">项目 = 一个工地 / 一条产线；一个项目下可以添加多个岗位</span><span class="sp"></span>' +
      '<button class="btn btn-o btn-sm" id="npClose">取消</button></div>' +
      '<div class="card card-pad"><div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">' +
      field('npName', '项目名称 *', '如：阿尔及利亚玻璃制品工厂') +
      field('npCountry', '用工国家 *', '如：阿尔及利亚') +
      field('npCity', '城市', '如：阿尔及尔') +
      field('npEmployer', '用工企业/客户', '') +
      field('npLines', '规模', '如：6 条产线') +
      field('npNote', '备注', '如：2026-12 投产，中方派驻 12 人') +
      '</div><div style="margin-top:14px"><button class="btn btn-p" id="npSave">创建项目</button></div></div></div>';

    $('#npClose').onclick = function () { closeHost(); };
    $('#npSave').onclick = function () {
      var v = function (id) { var el = $('#' + id); return el ? el.value.trim() : ''; };
      if (!v('npName')) { toast('请填写项目名称', ''); return; }
      if (!v('npCountry')) { toast('请填写用工国家', ''); return; }
      api('/api/company/projects', {
        method: 'POST',
        body: { name: v('npName'), country: v('npCountry'), city: v('npCity'), employer: v('npEmployer'), lines: v('npLines'), note: v('npNote') }
      }).then(function (res) {
        toast('项目已创建', '现在可以在项目卡片上「添加岗位」');
        closeHost();
        refreshProjects().then(function () { renderProjectCards(); });
        if (window.HPBridge && window.HPBridge.boot) window.HPBridge.boot().catch(function () {});
      }).catch(function (e) { toast('创建失败', e.message); });
    };
  }

  function field(id, label, ph) {
    return '<div><label style="font-size:11.5px;color:var(--text-3,#5f7290);display:block;margin-bottom:3px">' + label + '</label>' +
      '<input id="' + id + '" placeholder="' + esc(ph) + '" style="width:100%;padding:8px 11px;border-radius:8px;border:1px solid var(--border);background:var(--surface);color:var(--text-1);font-size:12.5px"></div>';
  }

  /* 在项目卡片区追加"添加岗位"按钮（不破坏原有卡片渲染） */
  function renderProjectCards() {
    var box = $('#projectCards');
    if (!box) return;
    /* 原有卡片由 app.html 渲染；我们只在每张卡片上补一个按钮 */
    var cards = box.children;
    var list = JOB.projects || [];
    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      if (card.dataset.jobBtn === '1') continue;
      var titleEl = card.querySelector('b, .card-title, h3, .proj-name');
      var nm = titleEl ? titleEl.textContent.trim() : '';
      var proj = list.find(function (p) { return p.name === nm; }) || list[i] || null;
      card.dataset.jobBtn = '1';
      var bar = document.createElement('div');
      bar.style.cssText = 'display:flex;gap:6px;margin-top:10px;flex-wrap:wrap;align-items:center';
      bar.innerHTML = '<span style="font-size:11.5px;color:var(--text-3,#5f7290)">' +
        (proj ? ('岗位 ' + (proj.jobCount || 0) + ' 个 · 在招 ' + (proj.liveCount || 0) + ' 个') : '') + '</span>' +
        '<span style="flex:1"></span>' +
        '<button class="btn btn-p btn-sm" data-addjob="' + (proj ? esc(proj.id) : '') + '">+ 添加岗位</button>';
      card.appendChild(bar);
      var btn = bar.querySelector('[data-addjob]');
      btn.onclick = function (e) {
        e.stopPropagation();
        var pid = this.dataset.addjob;
        var p = list.filter(function (x) { return x.id === pid; })[0] || null;
        openNewJobDialog(p);
      };
    }
  }

  function createHost() {
    var h = document.createElement('div');
    h.id = 'jobPreviewHost';
    h.style.display = 'none';
    h.style.marginTop = '16px';
    var v = document.querySelector('.view[data-view="projects"]');
    if (v) v.appendChild(h);
    return h;
  }

  function closeHost() {
    var host = $('#jobPreviewHost');
    if (host) { host.style.display = 'none'; host.innerHTML = ''; }
  }

  /* 新建岗位（可带项目上下文） */
  function openNewJobDialog(project) {
    var host = $('#jobPreviewHost') || createHost();
    if (!host) { toast('无法打开', '页面容器缺失，请刷新'); return; }
    host.style.display = 'block';
    var pname = project ? project.name : '';
    var pcountry = project ? project.country : '';
    host.innerHTML =
      '<div class="aiw"><div class="aih"><span class="t">添加岗位</span>' +
      '<span class="st">' + (pname ? ('所属项目：' + esc(pname)) : '未关联项目') + ' · 可直接填写，也可粘贴 JD 让 AI 自动填入</span>' +
      '<span class="sp"></span><button class="btn btn-o btn-sm" id="njClose">取消</button></div>' +
      '<div class="aiv">' +
      '<div><div class="aic"><div class="aic-h"><span>📋</span><span>粘贴岗位原文（可选）</span></div><div class="aic-b">' +
      '<textarea id="njText" placeholder="把招聘网站上的岗位 JD 复制粘贴到这里" ' +
      'style="width:100%;min-height:190px;padding:11px 12px;border-radius:9px;border:1px solid var(--border);background:var(--surface);color:var(--text-1);font-size:12.5px;line-height:1.7;resize:vertical"></textarea>' +
      '<div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap"><button class="btn btn-p btn-sm" id="njExtract">✨ AI 智能填入</button>' +
      '<button class="btn btn-o btn-sm" id="njClear">清空</button>' +
      '<span id="njStatus" style="font-size:11.5px;color:var(--text-3,#5f7290);align-self:center"></span></div>' +
      '<div style="font-size:11.5px;color:var(--text-3,#5f7290);margin-top:8px;line-height:1.7">AI 只抽取原文中出现的信息，不会编造。抽取后请核对再保存。</div>' +
      '</div></div></div>' +
      '<div><div class="aic"><div class="aic-h"><span>✍️</span><span>岗位信息</span></div><div class="aic-b" id="njForm">' +
      newJobForm({ country: pcountry }) + '</div></div>' +
      '<button class="btn btn-p" id="njSave" style="width:100%;justify-content:center">保存并预览</button></div>' +
      '</div></div>';

    $('#njClose').onclick = closeHost;
    $('#njClear').onclick = function () { $('#njText').value = ''; };
    $('#njExtract').onclick = function () {
      var text = $('#njText').value.trim();
      if (!text) { toast('请先粘贴内容', ''); return; }
      var st = $('#njStatus');
      st.innerHTML = '<span class="ai-spin" style="display:inline-block;vertical-align:-2px"></span> AI 解析中…';
      api('/api/company/jobs/extract', { method: 'POST', body: { text: text } })
        .then(function (res) {
          st.textContent = res.mode === 'llm' ? 'AI 已填入，请核对' : '规则已填入，请核对';
          fillNewJobForm(res.job || {});
          toast('已填入', '请检查各项内容是否正确');
        })
        .catch(function (e) { st.textContent = ''; toast('解析失败', e.message); });
    };
    $('#njSave').onclick = function () {
      var job = readNewJobForm();
      if (!job.title) { toast('请填写岗位名称', ''); return; }
      job.projectId = project ? project.id : null;
      if (!job.country && project && project.country) job.country = project.country;
      openJobPreview(job, true);
    };
    host.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /* 编辑已有岗位：复用同一个对话框，预填内容 */
  function openJobEditor(job) {
    var host = $('#jobPreviewHost') || createHost();
    host.style.display = 'block';
    host.innerHTML =
      '<div class="aiw"><div class="aih"><span class="t">编辑岗位</span>' +
      '<span class="st">' + esc(job.title || '') + '</span><span class="sp"></span>' +
      '<button class="btn btn-o btn-sm" id="njClose">取消</button></div>' +
      '<div class="aiv"><div><div class="aic"><div class="aic-h"><span>✍️</span><span>岗位信息</span></div>' +
      '<div class="aic-b" id="njForm">' + newJobForm(job) + '</div></div></div>' +
      '<div><div class="ai-empty"><div class="big">✏️</div><p>修改后点「保存并预览」，可在预览界面再做 AI 分析并选择保存草稿或发布。</p></div></div></div>' +
      '<div style="margin-top:12px"><button class="btn btn-p" id="njSave" style="width:100%;justify-content:center">保存并预览</button></div></div>';
    $('#njClose').onclick = closeHost;
    $('#njSave').onclick = function () {
      var updated = readNewJobForm();
      updated.id = job.id;
      updated.projectId = job.projectId || null;
      openJobPreview(updated, false);
    };
    host.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /* ---------- 项目卡片（含"添加岗位"入口） ---------- */
  function paintProjects() {
    var box = $('#projectCards');
    if (!box) return;
    if (!JOB.projects.length) return;   /* 原有渲染逻辑仍在跑时别覆盖 */
  }

  function refreshProjects() {
    return api('/api/company/projects').then(function (res) {
      JOB.projects = (res.projects || []);
      return JOB.projects;
    }).catch(function () { return []; });
  }

  function paintJobList() {
    var box = $('#jobManageList');
    if (!box) return;
    var list = JOB.list.filter(function (j) {
      if (JOB.status === 'all') return true;
      var live = /招聘中|新岗位/.test(j.status || '');
      return JOB.status === 'published' ? live : !live;
    });
    var seeded = list.filter(function (j) { return /^job-(00\d|1\d\d|12\d)$/.test(j.id); });
    var mine = list.filter(function (j) { return !/^job-(00\d|1\d\d|12\d)$/.test(j.id); });
    var show = mine.concat(seeded.slice(0, 5));

    if (!show.length) {
      box.innerHTML = '<div class="t-muted" style="padding:14px;font-size:12.5px">还没有岗位。请先点击右上角「新建项目」，再在项目卡片上「添加岗位」。</div>';
      return;
    }
    box.innerHTML = show.map(function (j) {
      var live = /招聘中|新岗位/.test(j.status || '');
      var actions = live
        ? '<button class="btn btn-o btn-sm" data-jv="' + esc(j.id) + '">查看</button><button class="btn btn-o btn-sm" data-je="' + esc(j.id) + '">编辑</button><button class="btn btn-o btn-sm" data-ju="' + esc(j.id) + '">下线</button>'
        : '<button class="btn btn-o btn-sm" data-jv="' + esc(j.id) + '">查看</button><button class="btn btn-o btn-sm" data-je="' + esc(j.id) + '">编辑</button><button class="btn btn-p btn-sm" data-jp="' + esc(j.id) + '">发布</button><button class="btn btn-o btn-sm" data-jd="' + esc(j.id) + '" style="color:var(--danger)">删除</button>';
      var proj = JOB.projects.filter(function (p) { return p.id === j.projectId; })[0];
      return '<div style="display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:9px;background:rgba(255,255,255,.028);border:1px solid rgba(255,255,255,.06);margin-bottom:6px;flex-wrap:wrap">' +
        '<span class="aids ' + (live ? 'live' : 'draft') + '">' + (live ? '已发布' : '草稿') + '</span>' +
        '<b style="font-size:13px">' + esc(j.title || '未命名') + '</b>' +
        (proj ? '<span style="font-size:11px;color:var(--text-3,#5f7290)">' + esc(proj.name) + '</span>' : '') +
        '<span style="font-size:11.5px;color:var(--text-3,#5f7290)">' + esc((j.country || '') + ' ' + (j.city || '')) + ' · ' + esc(j.salary || '') + '</span>' +
        '<span style="flex:1"></span><span style="display:flex;gap:6px;flex-wrap:wrap">' + actions + '</span></div>';
    }).join('');

    $$('#jobManageList [data-jv]').forEach(function (b) {
      b.onclick = function () { openJobPreview(JOB.list.find(function (x) { return x.id === b.dataset.jv; }), false); };
    });
    $$('#jobManageList [data-je]').forEach(function (b) {
      b.onclick = function () {
        var job = JOB.list.find(function (x) { return x.id === b.dataset.je; });
        openJobEditor(job);
      };
    });
    $$('#jobManageList [data-jp]').forEach(function (b) {
      b.onclick = function () {
        api('/api/company/jobs/' + encodeURIComponent(b.dataset.jp) + '/publish', { method: 'POST', body: {} })
          .then(function () { toast('已发布', '岗位已进入应聘者的岗位发现'); refreshJobList(); })
          .catch(function (e) { toast('发布失败', e.message); });
      };
    });
    $$('#jobManageList [data-ju]').forEach(function (b) {
      b.onclick = function () {
        api('/api/company/jobs/' + encodeURIComponent(b.dataset.ju) + '/unpublish', { method: 'POST', body: {} })
          .then(function () { toast('已下线', '应聘者将不再看到该岗位'); refreshJobList(); })
          .catch(function (e) { toast('下线失败', e.message); });
      };
    });
    $$('#jobManageList [data-jd]').forEach(function (b) {
      b.onclick = function () {
        if (!window.confirm('确定删除这个岗位？删除后不可恢复。')) return;
        api('/api/company/jobs/' + encodeURIComponent(b.dataset.jd), { method: 'DELETE' })
          .then(function () { toast('已删除'); refreshJobList(); })
          .catch(function (e) { toast('删除失败', e.message); });
      };
    });
  }

  function refreshJobList() {
    return api('/api/company/jobs?status=all').then(function (res) {
      JOB.list = (res.jobs || []).slice().sort(function (a, b) {
        return String(b.updatedAt || '').localeCompare(String(a.updatedAt || ''));
      });
      paintJobList();
    }).catch(function (e) {
      var box = $('#jobManageList');
      if (box) box.innerHTML = '<div class="t-muted" style="padding:14px;font-size:12.5px">岗位列表加载失败：' + esc(e.message) + '</div>';
    });
  }

  function openJobPreview(job, isNew) {
    var host = $('#jobPreviewHost');
    if (!host) return;
    host.style.display = 'block';
    host.innerHTML = '';
    window.HPJobPreview.open(host, {
      job: job,
      isNew: !!isNew,
      onBack: function () { host.style.display = 'none'; host.innerHTML = ''; },
      onSaved: function () { refreshJobList(); }
    });
    host.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* 新建岗位：直接填写 或 粘贴 AI 智能填入 */
  function openNewJobDialog() {
    var host = $('#jobPreviewHost');
    if (!host) return;
    host.style.display = 'block';
    host.innerHTML =
      '<div class="aiw"><div class="aih"><span class="t">新建岗位</span>' +
      '<span class="st">可以直接填写，也可以粘贴岗位原文让 AI 自动填入</span><span class="sp"></span>' +
      '<button class="btn btn-o btn-sm" id="njClose">取消</button></div>' +
      '<div class="aiv">' +
      /* 左：粘贴区 */
      '<div><div class="aic"><div class="aic-h"><span>📋</span><span>粘贴岗位原文（可选）</span></div><div class="aic-b">' +
      '<textarea id="njText" placeholder="把招聘网站上的岗位 JD 复制粘贴到这里，例如：&#10;招聘岗位：注塑调机技师&#10;工作地点：越南 海防&#10;薪资：18000-24000 元/月&#10;岗位职责：……" ' +
      'style="width:100%;min-height:190px;padding:11px 12px;border-radius:9px;border:1px solid var(--border);background:var(--surface);color:var(--text-1);font-size:12.5px;line-height:1.7;resize:vertical"></textarea>' +
      '<div style="display:flex;gap:8px;margin-top:10px"><button class="btn btn-p btn-sm" id="njExtract">✨ AI 智能填入</button>' +
      '<button class="btn btn-o btn-sm" id="njClear">清空</button>' +
      '<span id="njStatus" style="font-size:11.5px;color:var(--text-3,#5f7290);align-self:center"></span></div>' +
      '<div style="font-size:11.5px;color:var(--text-3,#5f7290);margin-top:8px;line-height:1.7">' +
      '支持粘贴纯文本；AI 只抽取原文中出现的信息，不会编造。抽取后请核对再保存。</div>' +
      '</div></div></div>' +
      /* 右：表单 */
      '<div><div class="aic"><div class="aic-h"><span>✍️</span><span>岗位信息</span></div><div class="aic-b" id="njForm">' + newJobForm() + '</div></div>' +
      '<button class="btn btn-p" id="njSave" style="width:100%;justify-content:center">保存并预览</button></div>' +
      '</div></div>';

    $('#njClose').onclick = closeNewJob;
    $('#njClear').onclick = function () { $('#njText').value = ''; };
    $('#njExtract').onclick = function () {
      var text = $('#njText').value.trim();
      if (!text) { toast('请先粘贴内容', ''); return; }
      var st = $('#njStatus');
      st.innerHTML = '<span class="ai-spin" style="display:inline-block;vertical-align:-2px"></span> AI 解析中…';
      api('/api/company/jobs/extract', { method: 'POST', body: { text: text } })
        .then(function (res) {
          st.textContent = res.mode === 'llm' ? 'AI 已填入，请核对' : '规则已填入（AI 不可用），请核对';
          fillNewJobForm(res.job || {});
          toast('已填入', '请检查各项内容是否正确');
        })
        .catch(function (e) { st.textContent = ''; toast('解析失败', e.message); });
    };
    $('#njSave').onclick = function () {
      var job = readNewJobForm();
      if (!job.title) { toast('请填写岗位名称', ''); return; }
      openJobPreview(job, true);
    };
  }

  function newJobForm(data) {
    var d = data || {};
    var f = function (id, label, val, ph, type) {
      return '<div style="margin-bottom:9px"><label style="font-size:11.5px;color:var(--text-3,#5f7290);display:block;margin-bottom:3px">' + label + '</label>' +
        '<input id="' + id + '" type="' + (type || 'text') + '" value="' + esc(val || '') + '" placeholder="' + esc(ph || '') + '" ' +
        'style="width:100%;padding:7px 10px;border-radius:8px;border:1px solid var(--border);background:var(--surface);color:var(--text-1);font-size:12.5px"></div>';
    };
    var ta = function (id, label, val, ph, rows) {
      return '<div style="margin-bottom:9px"><label style="font-size:11.5px;color:var(--text-3,#5f7290);display:block;margin-bottom:3px">' + label + '</label>' +
        '<textarea id="' + id + '" rows="' + (rows || 3) + '" placeholder="' + esc(ph || '') + '" ' +
        'style="width:100%;padding:7px 10px;border-radius:8px;border:1px solid var(--border);background:var(--surface);color:var(--text-1);font-size:12.5px;line-height:1.6;resize:vertical">' + esc(val || '') + '</textarea></div>';
    };
    return f('njTitle', '岗位名称 *', d.title, '如：玻璃压机操作工') +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">' +
      f('njCountry', '国家', d.country, '如：阿尔及利亚') + f('njCity', '城市', d.city, '如：阿尔及尔') + '</div>' +
      f('njEmployer', '用工企业', d.employer, '') +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">' +
      f('njSalary', '薪资区间', d.salary, '如：20000 - 25000 元/月') + f('njHeadcount', '招聘人数', d.headcount, '如：12', 'number') + '</div>' +
      ta('njDuties', '岗位职责（每行一条）', (d.duties || []).join('\n'), '负责…', 4) +
      ta('njHard', '硬性条件（每行一条）', (d.requirementsHard || []).join('\n'), '2 年以上经验…', 3) +
      ta('njPref', '优先条件（每行一条）', (d.requirementsPreferred || []).join('\n'), '有海外经历…', 2) +
      ta('njPay', '薪资构成', d.payStructure, '基本 + 津贴 + 绩效') +
      ta('njLife', '工作与生活', d.workLife, '包食宿、往返机票…') +
      ta('njContract', '合同与手续', d.contractTerms, '首签 24 个月…');
  }

  function fillNewJobForm(d) {
    var set = function (id, v) { var el = $('#' + id); if (el && v != null && v !== '') el.value = v; };
    set('njTitle', d.title); set('njCountry', d.country); set('njCity', d.city);
    set('njEmployer', d.employer); set('njSalary', d.salary); set('njHeadcount', d.headcount);
    set('njDuties', (d.duties || []).join('\n'));
    set('njHard', (d.requirementsHard || []).join('\n'));
    set('njPref', (d.requirementsPreferred || []).join('\n'));
    set('njPay', d.payStructure); set('njLife', d.workLife); set('njContract', d.contractTerms);
  }

  function readNewJobForm() {
    var v = function (id) { var el = $('#' + id); return el ? el.value.trim() : ''; };
    var lines = function (id) {
      return v(id).split(/\r?\n/).map(function (x) { return x.replace(/^\s*[\d.、)）]\s*/, '').trim(); }).filter(Boolean);
    };
    return {
      title: v('njTitle'), country: v('njCountry'), city: v('njCity'), employer: v('njEmployer'),
      salary: v('njSalary'), headcount: Number(v('njHeadcount')) || 0,
      duties: lines('njDuties'), requirementsHard: lines('njHard'), requirementsPreferred: lines('njPref'),
      payStructure: v('njPay'), workLife: v('njLife'), contractTerms: v('njContract'),
      cultureNote: v('njCountry'), status: '草稿'
    };
  }

  function closeNewJob() {
    var host = $('#jobPreviewHost');
    if (host) { host.style.display = 'none'; host.innerHTML = ''; }
  }

  /* ==================================================================
     三、挂载（页面切换时调用）
     ================================================================== */
  /* 判断当前真正显示的视图：优先读 .view.active，其次读 hash。
     原因：地址可能只到 #/company（没有第二段），此时 h[1] 为空，
     但页面其实已经渲染了某个视图（如 projects / profile）。 */
  function currentView() {
    var v = document.querySelector('.view.active');
    if (v && v.dataset && v.dataset.view) return v.dataset.view;
    var h = (location.hash || '').replace('#/', '').split('/');
    return h[1] || '';
  }

  function mountFor(view) {
    /* view 为空时，自动判断当前视图 */
    var v = view || currentView();
    if (v === 'profile') {
      mountResumeUI();
      mountMaterialUI();
    }
    if (v === 'projects') {
      var tabs = $('#jobStatusTabs');
      if (tabs && tabs.dataset.bound !== '1') {
        tabs.dataset.bound = '1';
        $$('#jobStatusTabs button').forEach(function (b) {
          b.addEventListener('click', function () {
            JOB.status = b.dataset.st;
            $$('#jobStatusTabs button').forEach(function (x) { x.className = 'btn btn-o btn-sm'; });
            b.className = 'btn btn-p btn-sm';
            paintJobList();
          });
        });
      }
      /* 主入口只有「新建项目」 */
      var np = $('#btnNewProject');
      if (np && np.dataset.aiBound !== '1') {
        np.dataset.aiBound = '1';
        np.addEventListener('click', function (e) {
          e.stopImmediatePropagation();
          e.preventDefault();
          openNewProjectDialog();
        }, true);
      }
      /* 首次进入：拉项目列表 + 岗位列表 */
      var box = $('#jobManageList');
      if (box && (!box.children.length || box.dataset.stale === '1')) {
        box.dataset.stale = '0';
        refreshProjects().then(function () { refreshJobList(); setTimeout(renderProjectCards, 600); });
      } else if (!JOB.projects.length) {
        refreshProjects().then(function () { setTimeout(renderProjectCards, 600); });
      } else {
        setTimeout(renderProjectCards, 300);
      }
    }
  }

  /* 监听视图切换：以页面真实显示的视图为准（不依赖 hash 第二段）。
     注意：不能只在"视图变化时"挂载 —— 用户可能直接打开 #/company（落在 overview），
     之后再点「项目管理」，此时 active 会变成 projects，必须能捕获到。
     所以这里每轮都调用 mountFor（内部用 dataset.bound 保证幂等，不会重复绑定）。 */
  function watchView() {
    var last = '';
    setInterval(function () {
      try {
        var v = currentView();
        if (!v) return;
        if (v !== last) last = v;
        mountFor(v);
      } catch (e) { console.warn('[ai-wire]', e); }
    }, 400);
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (AI) AI.injectCSS();
    watchView();
    setTimeout(function () { try { mountFor(''); } catch (e) {} }, 900);
    setTimeout(function () { try { mountFor(''); } catch (e) {} }, 2200);
  });

  window.HPAIWire = { mountFor: mountFor, refreshJobList: refreshJobList };
})();