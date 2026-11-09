/* =========================================================
   保存后：简历预览 → 编辑 / AI 分析（P0）
   ========================================================= */
(function () {
  'use strict';

  var DEFAULTS = {
    name: '张伟',
    phone: '138****0000',
    education: '中专/技校',
    skill: '玻璃压机操作证（中级）',
    role: '玻璃压机操作工',
    country: '阿尔及利亚',
    project: '阿尔及利亚玻璃制品工厂',
    years: 8,
    salary: '22,000 元/月',
    passport: '有效至 2031-05-20',
    health: '已备 2027-08-15',
    noCrime: '已公证（2026-08-09）'
  };

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function nowText() {
    var d = new Date();
    return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2);
  }

  function skillsOf(skill) {
    var list = String(skill || '').split(/[、,，/]/).map(function (s) { return s.trim(); }).filter(Boolean);
    if (!list.length) list = ['玻璃压机操作', '设备点检', '工艺参数调整'];
    return list;
  }

  function paperHTML(p) {
    var sks = skillsOf(p.skill);
    var skillHTML = sks.map(function (s) { return '<span class="strong">' + esc(s) + '</span>'; }).join('');
    var workLines = String(p.workText || '').split(/\n+/).map(function (x) { return x.trim(); }).filter(Boolean);
    if (!workLines.length) workLines = [
      '按工艺卡完成' + p.role + '操作、换模与参数调整，日均产量稳定。',
      '参与设备日常点检与异常处理，减少非计划停机。',
      '带教新员工，执行 5S 与安全规范。'
    ];
    var achLines = String(p.achText || '').split(/\n+/).map(function (x) { return x.trim(); }).filter(Boolean);
    if (!achLines.length) achLines = [
      '主导换模标准化，换模时间 38 → 25 分钟，年减少停机损失约 12 万元。',
      '外观不良率由 4.2% 降至 2.6%，年减少返工约 840 件。',
      '年度设备点检发现问题 27 起，故障停机时间下降 20%。'
    ];
    var workHTML = workLines.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('');
    var achHTML = achLines.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('');
    return '' +
      '<article class="paperdoc">' +
        '<div class="pd-head">' +
          '<div class="pd-photo ph">' + esc((p.name || '?').slice(0, 1)) + '</div>' +
          '<div class="pd-id">' +
            '<h1 class="pd-name">' + esc(p.name) + '<span>男 · 34 岁 · ' + esc(p.education) + '</span></h1>' +
            '<div class="pd-role">' + esc(p.role) + ' · ' + (p.years || 8) + ' 年经验 · ' + esc(p.country) + '</div>' +
            '<div class="pd-contact">电话 <b>' + esc(p.phone) + '</b> · 期望 <b>' + esc(p.salary) + '</b> · 20 天内到岗</div>' +
            '<div class="pd-chips">' +
              '<span class="good">护照 ' + esc(p.passport) + '</span>' +
              '<span class="good">健康证已备</span>' +
              '<span>无驻外经历</span>' +
            '</div>' +
          '</div>' +
          '<div class="pd-stamp">RESUME<b>NO. P-2026-1104</b></div>' +
        '</div>' +
        '<div class="pd-body">' +
          '<div class="pd-main">' +
            '<section class="pd-sec"><h3>工作经历</h3>' +
              '<div class="pd-exp">' +
                '<div class="pd-exp-h"><b>' + esc(p.project) + '</b><span>2023 - 2026</span></div>' +
                '<div class="pd-exp-role">' + esc(p.role) + '</div>' +
                '<ul class="pd-ul">' + workHTML + '</ul>' +
              '</div>' +
            '</section>' +
            '<section class="pd-sec"><h3>核心业绩</h3>' +
              '<ul class="pd-ul">' + achHTML + '</ul>' +
            '</section>' +
            '<section class="pd-sec"><h3>教育经历</h3>' +
              '<div class="pd-exp"><div class="pd-exp-h"><b>鞍山技师学院</b><span>2004 - 2007</span></div>' +
              '<div class="pd-exp-role">数控技术 · ' + esc(p.education) + '</div></div>' +
            '</section>' +
            '<section class="pd-sec"><h3>自我评价</h3>' +
              '<p class="pd-p">' + (p.years || 8) + ' 年一线操作经验，熟悉设备点检、换模与工艺参数调整；能吃苦，可长期驻外。</p>' +
            '</section>' +
          '</div>' +
          '<aside class="pd-side">' +
            '<section class="pd-sec"><h3>求职意向</h3>' +
              '<div class="pd-kv"><span>目标岗位</span><b>' + esc(p.role) + '</b></div>' +
              '<div class="pd-kv"><span>意向国家</span><b>' + esc(p.country) + '</b></div>' +
              '<div class="pd-kv"><span>期望薪资</span><b>' + esc(p.salary) + '</b></div>' +
              '<div class="pd-kv"><span>到岗时间</span><b>20 天内</b></div>' +
              '<div class="pd-kv"><span>班次接受</span><b>两班倒 / 三班倒</b></div>' +
            '</section>' +
            '<section class="pd-sec"><h3>核心技能</h3><div class="pd-tags">' + skillHTML + '</div>' +
              '<ul class="pd-ul" style="margin-top:6px"><li>熟悉压机操作与换模</li><li>能吃苦，可长期驻外</li><li>服从管理，团队协作</li></ul>' +
            '</section>' +
            '<section class="pd-sec"><h3>证书</h3>' +
              '<div class="pd-kv"><span>技能证书</span><b>' + esc(p.skill) + '</b></div>' +
              '<div class="pd-kv"><span>健康证</span><b>已备</b></div>' +
            '</section>' +
            '<section class="pd-sec"><h3>语言</h3>' +
              '<div class="pd-kv"><span>中文</span><b>母语</b></div>' +
              '<div class="pd-kv"><span>语言</span><b>' + esc(p.languagesText || '英语 基础（可读设备手册）') + '</b></div>' +
            '</section>' +
          '</aside>' +
        '</div>' +
        '<div class="pd-bottom">' +
          '<section class="pd-sec"><h3>证件与健康</h3>' +
            '<div class="pd-kv"><span>护照</span><b>' + esc(p.passport) + '</b></div>' +
            '<div class="pd-kv"><span>健康证</span><b>' + esc(p.health) + '</b></div>' +
            '<div class="pd-kv"><span>无犯罪记录</span><b>' + esc(p.noCrime) + '</b></div>' +
            '<div class="pd-kv"><span>健康状况</span><b>体检合格，健康证待办</b></div>' +
          '</section>' +
          '<section class="pd-sec"><h3>海外与稳定性</h3>' +
            '<div class="pd-kv"><span>海外经历</span><b>无（首次外派）</b></div>' +
            '<div class="pd-kv"><span>家庭支持</span><b>' + esc(p.familySupport || '已婚 · 配偶支持') + '</b></div>' +
            '<div class="pd-kv"><span>合同偏好</span><b>可接受 2 年首签</b></div>' +
            '<div class="pd-kv"><span>最低接受</span><b>20,500 元/月</b></div>' +
          '</section>' +
          '<section class="pd-sec"><h3>紧急联系人</h3>' +
            '<div class="pd-kv"><span>姓名</span><b>张先生</b></div>' +
            '<div class="pd-kv"><span>关系</span><b>配偶 / 父母</b></div>' +
            '<div class="pd-kv"><span>电话</span><b>131****5926</b></div>' +
          '</section>' +
        '</div>' +
        '<div class="pd-foot"><span>简历编号 P-2026-1104</span><span>候选人填写 · 平台结构化展示</span></div>' +
      '</article>';
  }

  function bindPreview() {
    var host = document.getElementById('resumePreviewHost');
    if (!host) return;
    var edit = host.querySelector('#pfEdit');
    var back = host.querySelector('#pfBack');
    var ai = host.querySelector('#pfAI');
    var pub = host.querySelector('#pfPublish');
    if (edit) edit.addEventListener('click', function () { window.HPProfileFlow.edit(); });
    if (back) back.addEventListener('click', function () { window.HPProfileFlow.edit(); });
    if (ai) ai.addEventListener('click', function () { window.HPProfileFlow.analyze(); });
    if (pub) pub.addEventListener('click', function () { window.HPProfileFlow.togglePublish(); });
  }

  function showPreview(data) {
    var host = document.getElementById('resumePreviewHost');
    var grid = document.getElementById('profileGrid');
    var head = document.querySelector('.view-profile .page-head');
    if (!host || !grid) return;
    var p = Object.assign({}, DEFAULTS, data || {});
    ['name','phone','education','skill','role','country','project'].forEach(function(k){ if(!p[k]) p[k] = DEFAULTS[k]; });
    if(p.published === undefined && window.__hpResumePreview && window.__hpResumePreview.published !== undefined) p.published = window.__hpResumePreview.published;
    if(p.published === undefined){
      try { var pubState = JSON.parse(localStorage.getItem('hp-persona-published') || 'null'); if(pubState) p.published = !!pubState.published; } catch(e) {}
    }
    host.innerHTML = '' +
      '<div class="pf-preview">' +
        '<div class="pf-preview-bar">' +
          '<div>' +
            '<div class="eyebrow">CANDIDATE RESUME</div>' +
            '<h2>简历预览 <span>已保存 ' + nowText() + ' · 版本 v1</span></h2>' +
            '<div class="pf-preview-meta">' +
              '<span class="pf-pill good">完整度 78%</span>' +
              '<span class="pf-pill">工作经历 1 段</span>' +
              '<span class="pf-pill">证件 2 / 3</span>' +
              '<span class="pf-pill">可 AI 分析</span>' +
            '</div>' +
          '</div>' +
          '<div class="pf-preview-acts">' +
            '<button class="btn btn-o btn-sm" id="pfBack" type="button">返回档案</button>' +
            '<button class="btn btn-o btn-sm' + (p.published ? ' published' : '') + '" id="pfPublish" type="button">' + (p.published ? '已发布' : '发布简历') + '</button>' +
            '<button class="btn btn-o btn-sm" id="pfEdit" type="button">编辑</button>' +
            '<button class="btn btn-p btn-sm" id="pfAI" type="button">AI 分析</button>' +
          '</div>' +
        '</div>' +
        '<div class="pf-preview-note">AI 分析基于当前保存版本；编辑后需要重新分析。<b>预览版</b>：工作经历与业绩暂用演示占位，后续接入完整档案。</div>' +
        '<div class="docwrap">' + paperHTML(p) + '</div>' +
      '</div>';
    host.style.display = 'block';
    grid.style.display = 'none';
    if (head) head.style.display = 'none';
    bindPreview();
    try { (document.querySelector('.workspace') || window).scrollTo(0, 0); } catch (e) {}
    window.__hpResumePreview = p;
  }

  function edit() {
    var host = document.getElementById('resumePreviewHost');
    var grid = document.getElementById('profileGrid');
    var head = document.querySelector('.view-profile .page-head');
    if (host) host.style.display = 'none';
    if (grid) grid.style.display = '';
    if (head) head.style.display = '';
    var inp = document.querySelector('.view[data-view="profile"] input.fld');
    if (inp) { try { inp.focus(); } catch (e) {} }
  }

  function openAIFlow() {
    if (document.getElementById('hpAIFlow')) return;
    var wrap = document.createElement('div');
    wrap.id = 'hpAIFlow';
    wrap.innerHTML =
      '<div class="hp-aiflow-bar">' +
        '<i class="dot"></i>' +
        '<b id="hpAIFlowTitle">AI 分析 · 开机动画</b>' +
        '<span id="hpAIFlowSub">视觉演示 · 当前简历数据后续接入</span>' +
        '<div class="acts">' +
          '<button id="hpAIFlowSkip" type="button">跳过开机 →</button>' +
          '<button id="hpAIFlowClose" type="button">关闭 ×</button>' +
        '</div>' +
      '</div>' +
      '<div class="hp-aiflow-loading" id="hpAIFlowLoading">正在启动分析引擎…</div>' +
      '<iframe class="hp-aiflow-frame" id="hpAIFlowFrame" title="AI 分析演示" allow="autoplay; fullscreen"></iframe>' +
      '<div class="hp-ai-data" id="hpAIFlowData" hidden></div>';
    document.body.appendChild(wrap);
    document.documentElement.style.overflow = 'hidden';

    var frame = wrap.querySelector('#hpAIFlowFrame');
    var title = wrap.querySelector('#hpAIFlowTitle');
    var sub = wrap.querySelector('#hpAIFlowSub');
    var skip = wrap.querySelector('#hpAIFlowSkip');
    var close = wrap.querySelector('#hpAIFlowClose');
    var loading = wrap.querySelector('#hpAIFlowLoading');
    var stage = 0;
    var timer = null;
    var payloadPromise = (window.HPResumeAnalysis && window.HPResumeAnalysis.prepare)
      ? window.HPResumeAnalysis.prepare(window.__hpResumePreview || {})
      : Promise.resolve(null);

    frame.addEventListener('load', function () {
      setTimeout(function () { loading.classList.add('off'); }, 350);
      if (frame.dataset.mode === 'analysis') {
        payloadPromise.then(function (payload) {
          try {
            if (payload && frame.contentWindow && frame.contentWindow.__hpApply) {
              frame.contentWindow.__hpApply(payload, true);
            }
          } catch (e) {}
        });
      }
    });

    function showAnalysis() {
      if (stage === 1) return;
      stage = 1;
      if (timer) clearTimeout(timer);
      try { if (frame.contentWindow && frame.contentWindow.speechSynthesis) frame.contentWindow.speechSynthesis.cancel(); } catch (e) {}
      title.textContent = '简历 AI 分析';
      sub.textContent = '基于当前保存版本';
      skip.textContent = '重播开机';
      skip.onclick = function () {
        stage = 0;
        try { if (frame.contentWindow && frame.contentWindow.speechSynthesis) frame.contentWindow.speechSynthesis.cancel(); } catch (e) {}
        title.textContent = 'AI 分析 · 开机动画';
        sub.textContent = '视觉演示 · 当前简历数据后续接入';
        skip.textContent = '跳过开机 →';
        skip.onclick = showAnalysis;
        loading.classList.remove('off');
        var dataBox = wrap.querySelector('#hpAIFlowData');
        if (dataBox) { dataBox.hidden = true; dataBox.innerHTML = ''; }
        frame.style.display = '';
        frame.dataset.mode = 'boot';
        frame.src = 'demo/boot-embed.html?auto';
        timer = setTimeout(showAnalysis, 9000);
      };
      loading.classList.remove('off');
      frame.style.display = '';
      frame.dataset.mode = 'analysis';
      var dataBox = wrap.querySelector('#hpAIFlowData');
      if (dataBox) { dataBox.hidden = true; dataBox.innerHTML = ''; }
      frame.src = 'demo/resume-analysis-embed.html';
    }

    skip.onclick = showAnalysis;
    close.onclick = closeFlow;
    frame.dataset.mode = 'boot';
    frame.src = 'demo/boot-embed.html?auto';
    timer = setTimeout(showAnalysis, 9000);

    function onBootDone(e) {
      if (e && e.data && e.data.type === 'hp:boot-done') showAnalysis();
      if (e && e.data && e.data.type === 'hp:resume-publish') {
        closeFlow();
        setTimeout(function () { if (window.HPProfileFlow && window.HPProfileFlow.togglePublish) window.HPProfileFlow.togglePublish(); }, 60);
      }
    }
    window.addEventListener('message', onBootDone);

    function closeFlow() {
      if (timer) clearTimeout(timer);
      try { if (frame.contentWindow && frame.contentWindow.speechSynthesis) frame.contentWindow.speechSynthesis.cancel(); } catch (e) {}
      wrap.remove();
      document.documentElement.style.overflow = '';
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('message', onBootDone);
    }
    function onKey(e) { if (e.key === 'Escape') closeFlow(); }
    document.addEventListener('keydown', onKey);
    window.__hpCloseAIFlow = closeFlow;
  }


  /* =========================================================
     上传简历：粘贴文字 / 上传文件 → 解析后回填表单
     ========================================================= */
  function fillProfileForm(r) {
    window.__hpResumeParsed = r || null;
    var view = document.querySelector('.view[data-view="profile"]');
    if (!view || !r) return;
    var inputs = view.querySelectorAll('input.fld, select.fld');
    if (inputs[0] && r.name) inputs[0].value = r.name;
    if (inputs[1] && r.phone) inputs[1].value = r.phone;
    if (inputs[2] && r.education) {
      Array.prototype.forEach.call(inputs[2].options, function (o) {
        if (o.textContent.indexOf(r.education) >= 0) inputs[2].value = o.value;
      });
    }
    if (inputs[3] && (r.skills || []).length) inputs[3].value = r.skills.slice(0, 4).join('、');
  }

  function openUpload() {
    if (document.getElementById('hpResumeUpload')) return;
    var wrap = document.createElement('div');
    wrap.id = 'hpResumeUpload';
    wrap.innerHTML =
      '<div class="hp-ru-card">' +
        '<h3>上传简历</h3>' +
        '<p>把简历文字粘贴进来，或选择 PDF / 图片；系统识别后回填姓名、电话、学历、技能，核对后点「保存档案」。</p>' +
        '<textarea id="hpRuText" placeholder="例：姓名：张伟\n电话：13800000000\n学历：中专\n技能：玻璃压机操作、设备点检……"></textarea>' +
        '<div class="hp-ru-row">' +
          '<input id="hpRuFile" type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" style="display:none">' +
          '<button class="btn btn-o btn-sm" id="hpRuPick" type="button">选择文件</button>' +
          '<span class="name" id="hpRuName">未选择文件</span>' +
        '</div>' +
        '<div class="hp-ru-tip">文件里的文字读不出来时（扫描件/图片），请把文字粘贴到上面；当前先支持基础解析，完整版后续接入。</div>' +
        '<div class="hp-ru-acts">' +
          '<button class="btn btn-o btn-sm" id="hpRuCancel" type="button">取消</button>' +
          '<button class="btn btn-p btn-sm" id="hpRuGo" type="button">识别并回填</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(wrap);
    var text = wrap.querySelector('#hpRuText');
    var file = wrap.querySelector('#hpRuFile');
    var name = wrap.querySelector('#hpRuName');
    var go = wrap.querySelector('#hpRuGo');
    function close() { wrap.remove(); }
    wrap.querySelector('#hpRuCancel').onclick = close;
    wrap.querySelector('#hpRuPick').onclick = function () { file.click(); };
    file.onchange = function () { name.textContent = file.files[0] ? file.files[0].name : '未选择文件'; };
    wrap.addEventListener('click', function (e) { if (e.target === wrap) close(); });
    go.onclick = function () {
      var val = text.value.trim();
      go.disabled = true; go.textContent = '识别中…';
      var req;
      if (file.files[0]) {
        var f = file.files[0];
        req = fetch('/api/persona/resume/upload', {
          method: 'POST', credentials: 'same-origin',
          headers: { 'content-type': f.type || 'application/octet-stream', 'x-file-name': encodeURIComponent(f.name), 'x-hp-request': '1' },
          body: f
        });
      } else {
        if (val.length < 30) { go.disabled = false; go.textContent = '识别并回填'; alert('请至少粘贴 30 个字，或选择一个文件'); return; }
        req = fetch('/api/persona/resume/parse', {
          method: 'POST', credentials: 'same-origin',
          headers: { 'content-type': 'application/json', 'x-hp-request': '1' },
          body: JSON.stringify({ text: val, useAI: false })
        });
      }
      req.then(function (res) { return res.json(); }).then(function (out) {
        if (!out || !out.resume) throw new Error((out && out.message) || '没有识别到内容');
        fillProfileForm(out.resume);
        close();
        if (window.HP && HP.toast) HP.toast('已识别', '请核对字段后点「保存档案」');
      }).catch(function (e) {
        go.disabled = false; go.textContent = '识别并回填';
        alert('识别失败：' + (e.message || '请重试'));
      });
    };
  }

  document.addEventListener('click', function (e) {
    if (e.target.closest('#btnResumeUpload')) { e.preventDefault(); openUpload(); }
  });

  function togglePublish() {
    var p = window.__hpResumePreview || {};
    var next = !p.published;
    var msg = next
      ? '发布后，企业 HR 和平台顾问可以在候选人库里看到这份简历。确认发布吗？'
      : '取消发布后，企业 HR 将看不到这份简历。确认取消吗？';
    function apply() {
      p.published = next;
      p.publishedAt = next ? new Date().toISOString() : null;
      window.__hpResumePreview = p;
      var btn = document.getElementById('pfPublish');
      if (btn) {
        btn.textContent = next ? '已发布' : '发布简历';
        btn.classList.toggle('published', next);
      }
      var patch = { published: next, publishedAt: p.publishedAt, name: p.name, phone: p.phone, education: p.education, skill: p.skill };
      if (window.HPBridge && window.HPBridge.isOnline()) {
        window.HPBridge.api.persona.saveProfile(patch).catch(function () {});
      }
      try { localStorage.setItem('hp-persona-published', JSON.stringify({ published: next, at: p.publishedAt })); } catch (e) {}
      if (window.HP && HP.toast) HP.toast(next ? '已发布' : '已取消发布', next ? '企业 HR 和顾问现在可以查看这份简历' : '企业 HR 将看不到这份简历');
    }
    if (window.HP && HP.modal) {
      HP.modal({
        title: next ? '发布简历' : '取消发布',
        body: '<div style="font-size:13px;line-height:1.8;color:var(--text-2)">' + msg + '<div style="margin-top:8px;font-size:11.5px;color:var(--text-3)">发布只影响企业侧可见性，不会修改简历内容。</div></div>',
        actions: [
          { text: '再想想' },
          { text: next ? '确认发布' : '确认取消', primary: true, onClick: function (close) { close(); apply(); } }
        ]
      });
      return;
    }
    if (window.confirm(msg)) apply();
  }
  window.HPProfileFlow = {
    showPreview: showPreview,
    edit: edit,
    analyze: openAIFlow,
    paperHTML: paperHTML,
    togglePublish: togglePublish,
    closeAI: function () { if (window.__hpCloseAIFlow) window.__hpCloseAIFlow(); }
  };
})();
