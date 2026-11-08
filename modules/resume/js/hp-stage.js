/* 自动生成：match.html 的舞台逻辑，嵌入主程序使用 */
window.HPStage = (function () {
  /** 当前语言参数，拼到接口 URL 后 */
  function hpLangParam() {
    var L = 'zh';
    try {
      if (window.HPI18N && window.HPI18N.lang) L = window.HPI18N.lang() || 'zh';
      else L = localStorage.getItem('hp-lang') || 'zh';
    } catch (e) {}
    return '&lang=' + encodeURIComponent(L);
  }

  /** 二选一文案：zhText / enText，按当前语言返回 */
  function EN_NAME(zhName) {
    var M = { '张伟': 'Zhang Wei', '李顾问': 'Advisor Li', '王经理': 'Manager Wang' };
    return M[zhName] || zhName;
  }

  function L10(zhText, enText) {
    var L = 'zh';
    try {
      if (window.HPI18N && window.HPI18N.lang) L = window.HPI18N.lang() || 'zh';
      else L = localStorage.getItem('hp-lang') || 'zh';
    } catch (e) {}
    return L === 'zh' ? zhText : (enText || zhText);
  }
  var mounted = false;
  var currentRoot = null;

  /* 结果锁定标志：点「查看详情」后置位，锁定期间禁止 runDemo/reset 改写分数。
     必须声明在最前面 —— showTracePanel 会提前使用它，晚声明会触发 TDZ 报错。 */
  let RESULT_LOCKED = false;


/* =========================================================
   演示数据（真实接入时替换为接口返回）
   ========================================================= */

/* 英文版分析步骤（语言切换时由 STEPS_ZH / STEPS_EN 切换） */
const STEPS_EN = [
  { t:'Parsing job requirements', ms:0.3,
    b:'Extracted 7 conditions from the JD: 4 skills, 2 certificates, 1 language; detected country=Vietnam, salary range 18–25K.',
    chips:[['4 skills','ok'],['2 certs','ok'],['1 language','ok']] },
  { t:'Reading candidate profile', ms:0.4,
    b:'Parsed 12 features from profile and resume: 8 years of injection molding setup, mold maintenance, passport valid to 2029, no Vietnamese on record.',
    chips:[['12 features','ok'],['Source: profile+resume','ok']] },
  { t:'Hard requirement gate', ms:0.5,
    b:'Passport ✓ Health cert ✓ Age ✓ Language ✗ — language is a "preferred" rather than hard requirement, continuing to scoring.',
    chips:[['Passport OK','ok'],['Health cert OK','ok'],['Vietnamese missing','no']] },
  { t:'Skill alignment', ms:0.8,
    b:'Matched 5/7: injection machine setup, mold upkeep, process parameters, yield improvement, team coaching; gaps: Vietnamese communication, overseas plant experience.',
    chips:[['Matched 5','ok'],['Gaps 2','no']] },
  { t:'Salary range comparison', ms:0.3,
    b:'Candidate expects 22K, job range is 18–25K — in the upper-middle band, leaving room to negotiate.',
    chips:[['Within range','ok'],['Near upper bound','no']] },
  { t:'Semantic review (LLM)', ms:1.6,
    b:'DeepSeek cross-checked 9 resume and JD passages, producing 8 evidence points, 2 gaps, confidence 0.86.',
    chips:[['8 evidence','ok'],['2 gaps','no'],['Confidence .86','ok']] },
  { t:'Weighted scoring', ms:0.2,
    b:'Skills 40 · Certificates 20 · Salary 15 · Location 10 · Experience 10 · Availability 5, semantic adjustment +2, total 86.',
    chips:[['Rule score 84','ok'],['Semantic +2','ok']] },
  { t:'Generating recommendation', ms:1.2,
    b:'Output 3 highlights, 2 risk warnings, 3 suggested interview questions; plus a growth path estimating 91 after closing the Vietnamese gap.',
    chips:[['3 highlights','ok'],['2 risks','no'],['3 questions','ok']] }
];

const STEPS_ZH = [
  { t:'解析岗位要求', ms:0.3,
    b:'从 JD 中抽取 7 项条件：技能 4 项、证书 2 项、语言 1 项；识别用工国=越南、薪资区间 18–25K。',
    chips:[['技能 4 项','ok'],['证书 2 项','ok'],['语言 1 项','ok']] },
  { t:'读取候选人画像', ms:0.4,
    b:'从档案与简历解析出 12 个特征：注塑调机 8 年、模具维护、护照有效期至 2029、越南语无记录。',
    chips:[['特征 12 个','ok'],['来源：档案+简历','ok']] },
  { t:'硬性门槛校验', ms:0.5,
    b:'护照 ✓ 健康证 ✓ 年龄 ✓ 语言 ✗ —— 语言为“优先项”而非硬性项，继续进入打分。',
    chips:[['护照 通过','ok'],['健康证 通过','ok'],['越南语 缺失','no']] },
  { t:'技能对齐', ms:0.8,
    b:'命中 5/7：注塑机调试、模具保养、工艺参数、良率改善、班组带教；缺口：越南语沟通、海外驻厂经历。',
    chips:[['命中 5','ok'],['缺口 2','no']] },
  { t:'薪资区间比对', ms:0.3,
    b:'候选人期望 22K，岗位区间 18–25K，位于区间中上部，具备议价空间。',
    chips:[['区间内','ok'],['接近上沿','no']] },
  { t:'语义复核（大模型）', ms:1.6,
    b:'DeepSeek 逐条核对 9 段简历与 JD 描述，输出 8 条证据、2 条差距，置信度 0.86。',
    chips:[['证据 8','ok'],['差距 2','no'],['置信度 .86','ok']] },
  { t:'加权计算', ms:0.2,
    b:'技能 40 · 证书 20 · 薪资 15 · 地点 10 · 经验 10 · 可用性 5，模型语义微调 +2，综合 86 分。',
    chips:[['规则分 84','ok'],['语义 +2','ok']] },
  { t:'生成推荐理由', ms:1.2,
    b:'输出 3 条亮点、2 条风险提示、3 个建议面试问题；并给出“补齐越南语后预计 91 分”的成长路径。',
    chips:[['亮点 3','ok'],['风险 2','no'],['面试题 3','ok']] }
];

/** 当前语言下的步骤文案（切换语言时重新绑定） */
function stepsFor(lang) {
  return (lang && lang !== 'zh') ? STEPS_EN : STEPS_ZH;
}
let STEPS = stepsFor((window.HPI18N && window.HPI18N.lang && window.HPI18N.lang()) || 'zh');

let BAR_DATA_ZH = [
  ['技能', 92], ['证书', 88], ['薪资', 90], ['地点', 95], ['经验', 85], ['可用性', 78]
];
let BAR_DATA_EN = [
  ['Skills', 92], ['Certs', 88], ['Salary', 90], ['Location', 95], ['Exp', 85], ['Availability', 78]
];
function barsFor(lang) {
  return (lang && lang !== 'zh') ? BAR_DATA_EN : BAR_DATA_ZH;
}
let BAR_DATA = barsFor((window.HPI18N && window.HPI18N.lang && window.HPI18N.lang()) || 'zh');

let SKILLS = [
  ['注塑机调试',1],['模具保养',1],['工艺参数',1],['良率改善',1],
  ['班组带教',1],['越南语',0],['海外驻厂',0]
];

let RANKING = [
  { n:'张伟', r:'注塑技师 · 8 年', s:86 },
  { n:'李国强', r:'注塑领班 · 11 年', s:81 },
  { n:'王芳', r:'品质工程师 · 6 年', s:74 },
  { n:'陈志远', r:'模具师傅 · 9 年', s:68 },
  { n:'刘敏', r:'注塑操作 · 3 年', s:52 }
];

/* =========================================================
   基础工具
   ========================================================= */
const $ = (s) => document.querySelector(s);
/* 分析页自己的 HUD：必须限定在 currentRoot 内查找，
   否则 #hudTime 会命中顶栏时钟（同一个 id），两处互相覆盖导致顶栏闪跳。 */
function hudEl(id) {
  var scope = currentRoot || document;
  var el = scope.querySelector('#' + id);
  return el || document.getElementById(id);
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
let timers = [];
const later = (fn, ms) => { const id = setTimeout(fn, ms); timers.push(id); return id; };
const clearTimers = () => { timers.forEach(clearTimeout); timers = []; };

/* 打字机 */
function typeText(el, text, speed = 16) {
  return new Promise((resolve) => {
    el.textContent = '';
    const cur = document.createElement('span');
    cur.className = 'cursor';
    el.appendChild(cur);
    let i = 0;
    const tick = () => {
      if (i >= text.length) { cur.remove(); resolve(); return; }
      cur.insertAdjacentText('beforebegin', text[i++]);
      later(tick, speed);
    };
    tick();
  });
}

/* 数字滚动 */
function countTo(el, target, dur = 1400) {
  const start = performance.now();
  const step = (now) => {
    const p = Math.min(1, (now - start) / dur);
    el.textContent = Math.round(target * easeOut(p));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* =========================================================
   构建 DOM
   ========================================================= */
function buildSteps() {
  const ol = $('#steps');
  ol.innerHTML = '';
  STEPS.forEach((s, i) => {
    const li = document.createElement('li');
    li.className = 'step';
    li.innerHTML = `
      <div class="dot">${i + 1}</div>
      <div class="step-h"><span class="step-t">${s.t}</span><span class="step-ms">${s.ms.toFixed(1)}s</span></div>
      <div class="step-b"></div>
      <div class="chips"></div>`;
    ol.appendChild(li);
  });
}

function buildBars() {
  const box = $('#bars');
  box.innerHTML = '';
  BAR_DATA.forEach(([lb, raw]) => {
    /* 统一钳制到 0~100 的整数百分比，杜绝负数/超范围 */
    const v = Math.max(0, Math.min(100, Math.round(Number(raw) || 0)));
    const row = document.createElement('div');
    row.className = 'bar-row';
    row.innerHTML = `<span class="lb">${lb}</span><div class="track"><div class="fill" data-v="${v}" style="width:${v}%"></div></div><span class="vl">${v}</span>`;
    box.appendChild(row);
  });
  box.classList.add('hidden');
}

function buildSkills() {
  const box = $('#skills');
  box.innerHTML = '';
  SKILLS.forEach(([name, ok]) => {
    const el = document.createElement('div');
    el.className = 'skill' + (ok ? ' ok' : ' no');
    el.innerHTML = `
      <svg class="ic" viewBox="0 0 16 16" fill="none">
        ${ok
          ? '<path d="M3 8.5l3.2 3.2L13 5" stroke="#34d399" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
          : '<path d="M4 8h8" stroke="#f5b94a" stroke-width="2" stroke-linecap="round"/>'}
      </svg><span>${name}</span>`;
    box.appendChild(el);
  });
}

/* 榜单分页：推荐岗位过多时分页显示 */
let RANK_PAGE = 1;
const RANK_PER_PAGE = 10;

function buildRank() {
  const box = $('#rank');
  box.innerHTML = '';   // 去重：每轮渲染前清空，避免历史行累积
  const skel0 = document.getElementById('rankSkel');
  if (skel0) skel0.classList.add('hide');

  const total = RANKING.length;
  const pages = Math.max(1, Math.ceil(total / RANK_PER_PAGE));
  if (RANK_PAGE > pages) RANK_PAGE = pages;
  if (RANK_PAGE < 1) RANK_PAGE = 1;
  const start = (RANK_PAGE - 1) * RANK_PER_PAGE;
  const slice = RANKING.slice(start, start + RANK_PER_PAGE);

  slice.forEach((p, i) => {
    const abs = start + i;          // 跨页连续序号
    const row = document.createElement('div');
    row.className = 'rk' + (abs === 0 ? ' top' : '');
    row.dataset.id = p.n;
    row.dataset.abs = String(abs);
    row.innerHTML = `
      <div class="medal">${abs + 1}</div>
      <div class="rk-name">${p.n}<span>${p.r}</span></div>
      <div class="mini"><i data-w="${p.s}"></i></div>
      <div class="rk-score">0</div>
      <div class="rk-act"></div>`;
    box.appendChild(row);
  });
  attachRankActions();
  renderRankPager();
}

/* 榜单底部分页条 */
function renderRankPager() {
  let bar = document.getElementById('rankPager');
  const panel = document.querySelector('.rank-panel') || document.getElementById('rank');
  if (!panel || !panel.parentNode) return;
  if (!bar) {
    bar = document.createElement('div');
    bar.id = 'rankPager';
    bar.className = 'hps-rank-pager';
    panel.parentNode.insertBefore(bar, panel.nextSibling);
  }
  const total = RANKING.length;
  const pages = Math.max(1, Math.ceil(total / RANK_PER_PAGE));
  if (pages <= 1) { bar.innerHTML = '<span class="t-muted">共 ' + total + ' 个</span>'; return; }
  let nums = '';
  for (let i = 1; i <= pages; i++) {
    if (pages > 9 && i > 2 && i < pages - 1 && Math.abs(i - RANK_PAGE) > 1) {
      if (!nums.endsWith('…')) nums += '<span class="t-muted" style="padding:0 4px">…</span>';
      continue;
    }
    nums += '<button class="btn ' + (i === RANK_PAGE ? 'btn-p' : 'btn-o') + ' btn-sm" data-rp="' + i + '">' + i + '</button>';
  }
  bar.innerHTML =
    '<span class="t-muted">' + (L10('共 ','') + total + L10(' 个 · 第 ',' · Page ') + RANK_PAGE + '/' + pages + L10(' 页','')) + '</span>' +
    '<button class="btn btn-o btn-sm" data-rp="prev"' + (RANK_PAGE <= 1 ? ' disabled' : '') + '>' + L10('上一页','Prev') + '</button>' +
    nums +
    '<button class="btn btn-o btn-sm" data-rp="next"' + (RANK_PAGE >= pages ? ' disabled' : '') + '>' + L10('下一页','Next') + '</button>';
  Array.prototype.forEach.call(bar.querySelectorAll('[data-rp]'), (b) => {
    b.addEventListener('click', () => {
      const v = b.dataset.rp;
      if (v === 'prev') RANK_PAGE = Math.max(1, RANK_PAGE - 1);
      else if (v === 'next') RANK_PAGE = Math.min(pages, RANK_PAGE + 1);
      else RANK_PAGE = Number(v) || 1;
      buildRank();
      /* 分页后把分数立刻填上（不重播动画） */
      document.querySelectorAll('#rank .rk').forEach((row) => {
        row.classList.add('show');
        const mi = row.querySelector('.mini i');
        if (mi) mi.style.width = mi.dataset.w + '%';
        const sc = row.querySelector('.rk-score');
        if (sc && mi) sc.textContent = mi.dataset.w;
      });
      markSelectedRow();
      try { panel.scrollIntoView({ block: 'start', behavior: 'smooth' }); } catch (e) {}
    });
  });
}

/** 榜单每行的后续动作：投递 / 收藏 / 发 offer / 看详情 */
function attachRankActions() {
  const isComp = (CURRENT && CURRENT.mode) === 'company';
  document.querySelectorAll('#rank .rk').forEach((row) => {
    /* 用 row.dataset.abs（跨页绝对序号）取数据，不能再用 DOM 索引
       —— 分页后 DOM 只有本页 10 行，索引与 RANKING 不再对应。 */
    const abs = Number(row.dataset.abs);
    const id = (RANKING[Number.isFinite(abs) ? abs : 0] || {}).id;
    const act = row.querySelector('.rk-act');
    if (!act || !id) return;
    if (act.dataset.done === '1') return;   // 已经挂过按钮，跳过
    act.dataset.done = '1';
    act.innerHTML = '';
    const mk = (text, cls, fn) => {
      const b = document.createElement('button');
      b.className = 'rk-btn ' + (cls || '');
      b.textContent = text;
      b.addEventListener('click', (e) => { e.stopPropagation(); fn(b); });
      act.appendChild(b);
    };
    if (!isComp) {
      mk('投递', 'p', async (b) => {
        /* 投递前先让用户选择用哪份简历（已保存 / 重新上传） */
        const title = (RANKING.find((x) => x.id === id) || {}).n || '';
        if (window.HPMatch && window.HPMatch.applyWithResumeChoice) {
          window.HPMatch.applyWithResumeChoice(id, title, async (choice) => {
            b.disabled = true; b.textContent = '投递中';
            try {
              const r = await api('/api/persona/jobs/batch-apply', { method: 'POST', body: JSON.stringify({ jobIds: [id] }) });
              const ok = (r.results || []).some((x) => x.ok);
              b.textContent = ok ? '已投递' : '已投过';
              b.classList.add(ok ? 'ok' : 'ghost');
              if (choice === 'upload') setTip('简历已上传 · 顾问复核后自动投递');
            } catch (err) { b.textContent = '失败'; b.disabled = false; }
          });
        } else {
          b.disabled = true; b.textContent = '投递中';
          try {
            const r = await api('/api/persona/jobs/batch-apply', { method: 'POST', body: JSON.stringify({ jobIds: [id] }) });
            const ok = (r.results || []).some((x) => x.ok);
            b.textContent = ok ? '已投递' : '已投过';
          } catch (err) { b.textContent = '失败'; b.disabled = false; }
        }
      });
      /* 收藏/取消收藏：切换 */
      mk('收藏', '', async (b) => {
        try {
          const isFav = b.textContent === '已收藏';
          const r = isFav
            ? await api('/api/persona/favorites/' + encodeURIComponent(id), { method: 'DELETE' })
            : await api('/api/persona/favorites/' + encodeURIComponent(id), { method: 'POST', body: '{}' });
          b.textContent = (!isFav) ? '已收藏' : '收藏';
          b.classList.toggle('ok', !isFav);
          setTip(!isFav ? '已加入收藏' : '已取消收藏');
        } catch (e) { b.textContent = '失败'; }
      });
    } else {
      mk('邀面试', '', async (b) => {
        b.disabled = true; b.textContent = '发送中';
        try {
          await api('/api/company/candidates/' + encodeURIComponent(id) + '/interview', {
            method: 'POST',
            body: JSON.stringify({ jobId: CURRENT.job.id, at: '待确认', mode: '视频面试', note: '由匹配分析面板发起' })
          });
          b.textContent = '已邀约'; b.classList.add('ok');
        } catch (e) { b.textContent = '失败'; b.disabled = false; }
      });
      mk('发 offer', 'p', async (b) => {
        b.disabled = true; b.textContent = '发送中';
        try {
          await api('/api/company/jobs/' + encodeURIComponent(CURRENT.job.id) + '/offers', {
            method: 'POST',
            body: JSON.stringify({ candidateId: id, salary: CURRENT.job.salary, note: '由匹配分析面板发起' })
          });
          b.textContent = '已发出'; b.classList.add('ok');
        } catch (e) { b.textContent = '失败'; b.disabled = false; }
      });
    }
    /* 查看详情：直接展示该候选人的评分与推理结果（不重播动画）。
       注意：id 是候选人 id（企业侧）或岗位 id（应聘者侧），
       不能拿去匹配 #jobSel 的 option（那是岗位 id），旧实现因此点了没反应。 */
    mk('查看详情', 'ghost', async (b) => {
      b.disabled = true; b.textContent = '加载中';
      try {
        /* 应聘者侧：候选人 id 不在 CURRENT.top 上（那是岗位对象），
           依次尝试 __hpCandidateId / trace / 兜底 t-001。 */
        const jobId = isComp ? (CURRENT.job && CURRENT.job.id) : id;
        const candId = isComp
          ? id
          : (window.__hpCandidateId ||
             (CURRENT.trace && CURRENT.trace.candidate && CURRENT.trace.candidate.id) ||
             (CURRENT.top && (CURRENT.top.candidateId || CURRENT.top.candId)) ||
             't-001');
        if (!candId) throw new Error('缺少候选人');
        const trace = await api('/api/match/trace?jobId=' + encodeURIComponent(jobId) +
          '&candidateId=' + encodeURIComponent(candId) +
          '&lang=' + ((window.HPI18N && window.HPI18N.lang()) || 'zh'));
        showTracePanel(trace, isComp ? id : jobId, jobId);
      } catch (e) {
        setTip('详情加载失败：' + e.message);
        window.HP && window.HP.toast && window.HP.toast('加载失败', e.message);
      } finally {
        b.disabled = false; b.textContent = '查看详情';
      }
    });
  });

  /* 整行点击统一走事件委托（只绑一次，行重建后依然有效） */
  bindRankDelegation();
}

/* 整行点击：改为【事件委托】绑在 #rank 容器上。
     为什么不用逐行 addEventListener：
       · 榜单会因分页、重建、快照还原被反复替换，逐行绑定容易漏
       · 委托只绑一次，之后无论行怎么重建都能响应
     企业侧 → 查看该候选人的分析结果（原地换）
     应聘者侧 → 打开该岗位的发布详情覆盖层 */
function bindRankDelegation() {
  const box = document.getElementById('rank');
  if (!box || box.dataset.delegated === '1') return;
  box.dataset.delegated = '1';
  box.addEventListener('click', (ev) => {
    /* 点在按钮上 → 交给按钮自己的逻辑 */
    if (ev.target.closest('button')) return;
    const row = ev.target.closest('.rk');
    if (!row) return;
    const abs = Number(row.dataset.abs);
    const item = RANKING[Number.isFinite(abs) ? abs : 0] || {};
    const isComp = (CURRENT && CURRENT.mode) === 'company';
    /* 调试钩子：?debugclick=1 时在页面提示点击信息 */
    if (window.QP && QP.get('debugclick') === '1') {
      setTip('点击 abs=' + abs + ' mode=' + CURRENT.mode + ' id=' + (item.id || '空') +
        ' 榜单=' + RANKING.length + ' 委托=' + box.dataset.delegated);
    }
    if (isComp) {
      const b = row.querySelector('.rk-btn.ghost');
      if (b) b.click();
      return;
    }
    if (!item.id) {
      setTip('该行没有岗位 id（榜单数据为空）');
      return;
    }
    /* 应聘者：真正的路由跳转到独立页面 #/persona/job
       跳转前保存现场快照，返回时原样还原（不重播动画）。 */
    saveStageSnapshot();
    window.__hpJobId = item.id;
    window.__hpJobBack = function () { location.hash = '#/persona/stage'; };
    location.hash = '#/persona/job';
  }, true);   /* ← 捕获阶段：即使内部元素 stopPropagation 也能触发 */
  /* 鼠标变手型 */
  box.addEventListener('mouseover', (ev) => {
    const row = ev.target.closest('.rk');
    if (row) row.style.cursor = 'pointer';
  });
}

/* 查看详情：切换分析对象并直接显示结果
   =====================================================================
   按需求设计（对照参考截图）：
     · 保留分析页全部原有板块：双卡 / 推理过程 / 匹配评分 / 候选人排名
     · 只把这些板块的「内容」换成被点击的那位候选人（或岗位）
     · 切换时用一道蓝光横扫，扫到哪里哪里的内容就更新
     · 跳过所有虚拟分析动画，直接呈现最终结果
   ===================================================================== */
/* 当前在榜单中被选中的对象 id（重建榜单后据此恢复高亮） */
let HPS_SELECTED = '';

/** 在分析页内打开「岗位发布详情」覆盖层。
 *  内容 = 企业发布该岗位时填写的信息（岗位信息 / 职责 / 要求 / 班次 / 福利 / 证书语言 / 我的匹配分项）。
 *  返回只关闭覆盖层，分析页保持原样，交互完全可用。 */
async function openJobOverlay(jobId) {
  const host = document.body;   // 挂到 body，fixed 全屏，不参与分析页布局
  if (!host) return;

  /* 打开期间锁定结果 + 中断演示，避免后台动画把分数清掉 */
  const wasLocked = RESULT_LOCKED;
  RESULT_LOCKED = true;

  let ov = document.getElementById('hpsJobOverlay');
  if (!ov) {
    ov = document.createElement('div');
    ov.id = 'hpsJobOverlay';
    ov.className = 'hps-job-overlay';
    host.appendChild(ov);
  }
  ov.innerHTML = '<div class="hps-jo-box"><div class="hps-jo-load">正在加载岗位详情…</div></div>';
  ov.classList.add('on');

  /* 返回：只关闭覆盖层，分析页保持原状 */
  const close = () => {
    ov.classList.remove('on');
    ov.innerHTML = '';
    /* 恢复原来的锁定状态，让分数与离开前一致 */
    RESULT_LOCKED = wasLocked || false;
    if (ov._esc) { document.removeEventListener('keydown', ov._esc); ov._esc = null; }
    if (ov._prevOverflow !== undefined) {
      document.body.style.overflow = ov._prevOverflow;
      ov._prevOverflow = undefined;
    }
  };
  ov._prevOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';

  try {
    /* 岗位发布详情 + 我的匹配分项（分数与榜单保持一致） */
    const [jobRes, recRes] = await Promise.all([
      api('/api/persona/jobs/' + encodeURIComponent(jobId)).catch(() => null),
      api('/api/persona/recommendations').catch(() => null)
    ]);
    const j = (jobRes && (jobRes.job || jobRes)) || {};
    const hit = ((recRes && recRes.list) || []).find((x) => x.jobId === jobId) || {};
    const spec = (hit.spec || j.spec || {});
    const jobRow = (k, v) => '<div class="hps-jo-row"><span>' + k + '</span><b>' +
      ((v === undefined || v === null || v === '') ? '—' : v) + '</b></div>';
    const reqs = (j.requirements || []).map((r, i) =>
      '<div class="hps-jo-req"><b>要求 ' + (i + 1) + '</b><span>' + r + '</span></div>').join('')
      || '<div class="t-muted">暂无明确要求</div>';
    const skills = (spec.skills || j.skills || []).map((s) =>
      '<span class="chip chip-i">' + s + '</span>').join('') || '<span class="t-muted">—</span>';
    const P = hit.parts || {};
    const score = hit.score != null ? hit.score : null;
    const bars = [
      ['技能', P.skill, 40], ['证书', P.cert, 20], ['薪资', P.salary, 15],
      ['地点', P.location, 10], ['经验', P.exp, 10], ['可用性', P.availability, 5]
    ].map(([lb, v, mx]) => {
      const pct = Math.round((Number(v || 0) / mx) * 100);
      return '<div class="hps-jo-bar"><span>' + lb + '</span><i><b style="width:' + pct + '%"></b></i><em>' + (v || 0) + '</em></div>';
    }).join('');

    ov.innerHTML =
      '<div class="hps-jo-box">' +
        '<div class="hps-jo-head">' +
          '<div class="hps-jo-ico">岗</div>' +
          '<div class="hps-jo-main">' +
            '<div class="hps-jo-title">' + (j.title || hit.jobTitle || '岗位') +
              '<span>' + (j.employer || '') + '</span></div>' +
            '<div class="hps-jo-sub">' + (j.country || '') + (j.city ? ' · ' + j.city : '') +
              ' · 招聘 ' + (j.headcount || 0) + ' 人 · 更新 ' + (j.updatedAt || '—') + '</div>' +
            '<div class="hps-jo-tags">' +
              '<span class="chip chip-i">' + (j.salary || hit.salary || '面议') + '</span>' +
              '<span class="chip chip-g">' + (j.status || '招聘中') + '</span>' +
              (hit.applied ? '<span class="chip chip-i">已投递</span>' : '') +
              (score != null ? '<span class="chip ' + (score >= 80 ? 'chip-g' : 'chip-i') + '">匹配分 ' + score + '</span>' : '') +
            '</div>' +
          '</div>' +
          '<button class="btn btn-o btn-sm" id="hpsJoBack">← 返回分析</button>' +
        '</div>' +
        '<div class="hps-jo-grid">' +
          '<div class="hps-jo-col">' +
            '<div class="hps-jo-card"><div class="hps-jo-ct">岗位信息</div>' +
              jobRow('岗位名称', j.title) + jobRow('用工企业', j.employer) +
              jobRow('工作地点', String(j.country || '') + (j.city ? ' ' + j.city : '')) +
              jobRow('薪资待遇', j.salary) + jobRow('招聘人数', (j.headcount || 0) + ' 人') +
              jobRow('岗位状态', j.status) + jobRow('更新时间', j.updatedAt) +
            '</div>' +
            '<div class="hps-jo-card"><div class="hps-jo-ct">福利待遇</div>' +
              jobRow('食宿', '企业提供') + jobRow('机票', '往返报销') +
              jobRow('保险', '商业保险 100 万') + jobRow('签证', '企业办理') +
              jobRow('休假', '半年一休 / 15 天带薪') + jobRow('通讯', '提供本地 SIM 卡') +
            '</div>' +
          '</div>' +
          '<div class="hps-jo-col">' +
            '<div class="hps-jo-card"><div class="hps-jo-ct">岗位职责</div>' +
              '<div class="hps-jo-desc">' + (j.description || (j.title + '（' + (j.employer || '') + '）需要你负责产线日常运行：按工艺要求完成生产任务、做好首件确认与过程自检、发现异常及时处理或上报，并与当地员工协作完成交接班。')) + '</div>' +
            '</div>' +
            '<div class="hps-jo-card"><div class="hps-jo-ct">任职要求</div>' + reqs + '</div>' +
            '<div class="hps-jo-card"><div class="hps-jo-ct">技能要求</div>' +
              '<div class="hps-jo-chips">' + skills + '</div></div>' +
          '</div>' +
          '<div class="hps-jo-col">' +
            '<div class="hps-jo-card"><div class="hps-jo-ct">证书与语言</div>' +
              jobRow('证书', ((spec.certs || []).join(' / ') || '无硬性证书要求')) +
              jobRow('语言', ((spec.languages || []).map((l) => l.code || l).join(' / ') || '无语言要求')) +
            '</div>' +
            '<div class="hps-jo-card"><div class="hps-jo-ct">班次与用工</div>' +
              jobRow('班次', spec.shift || '两班倒') + jobRow('每班时长', '12 小时') +
              jobRow('用工性质', '长期驻外') + jobRow('合同周期', '2 年（可续）') +
            '</div>' +
            '<div class="hps-jo-card"><div class="hps-jo-ct">我的匹配分项' +
              (score != null ? ' <span class="hps-jo-score">' + score + ' 分</span>' : '') + '</div>' +
              bars +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';

    document.getElementById('hpsJoBack').addEventListener('click', close);
    /* ESC 也能返回 */
    ov._esc = (e) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', ov._esc, { once: true });
  } catch (e) {
    ov.querySelector('.hps-jo-box').innerHTML =
      '<div class="hps-jo-load">岗位详情加载失败：' + e.message +
      '<button class="btn btn-o btn-sm" id="hpsJoBack2" style="margin-left:12px">返回分析</button></div>';
    const b = document.getElementById('hpsJoBack2');
    if (b) b.addEventListener('click', close);
  }
}

/** 保存分析页现场快照（从「查看结果」跳走前调用）。
 *  返回时用它原样还原 —— 不重播开机动画、不重放推理过程。 */
function saveStageSnapshot() {
  const host = document.querySelector('.hps-host');
  if (!host) return;
  const cfg = window.__HPS_CFG || null;
  const picked = window.__hpPickedJobs || null;
  window.__hpsRestore = {
    html: host.innerHTML,
    cfg,
    picked,
    selected: HPS_SELECTED || '',   // 记住当时高亮的行，还原后恢复
    /* 还原后重新挂上关键交互。
       快照是 innerHTML 字符串，所有事件监听都会丢失；
       而且整行点击有 data-rowClick='1' 防重复标记，不先清掉就不会重新绑定。 */
    bind: function () {
      try {
        /* 1) 清掉防重复标记，让按钮重建；
           整行点击是委托绑定，#rank 容器本身也可能被快照替换过，
           所以要把 delegated 标记一并清掉。 */
        document.querySelectorAll('#rank .rk').forEach((r) => {
          delete r.dataset.rowClick;
          const act = r.querySelector('.rk-act');
          if (act) { delete act.dataset.done; act.innerHTML = ''; }
        });
        const rankBox = document.getElementById('rank');
        if (rankBox) delete rankBox.dataset.delegated;
        /* 2) 重建按钮 + 整行点击 */
        attachRankActions();
        /* 3) 恢复选中高亮 */
        if (HPS_SELECTED) markSelectedRow();
        /* 4) 顶部「查看结果」按钮也要重挂（快照里同样丢了监听） */
        const acts = document.querySelector('.wrap header .actions');
        const oldBtn = acts && acts.querySelector('#toRank');
        if (acts && oldBtn) {
          oldBtn.replaceWith(oldBtn.cloneNode(true));   // 去掉旧监听
          const b = acts.querySelector('#toRank');
          b.addEventListener('click', function () {
            abortDemo();
            const activeId = (document.querySelector('.subapp.active') || {}).id || '';
            const isPersona = activeId.indexOf('persona') >= 0 || CURRENT.mode === 'persona';
            saveStageSnapshot();
            window.__hpFromStage = true;
            location.hash = isPersona ? '#/persona/rank' : '#/company/rank';
          });
        }
      } catch (e) { console.warn('restore bind failed', e); }
    }
  };
}

/** 在榜单里高亮当前选中的那一行（必要时自动切到对应页） */
function markSelectedRow() {
  if (!HPS_SELECTED) {
    document.querySelectorAll('#rank .rk').forEach((r) => r.classList.remove('sel'));
    return;
  }
  const abs = RANKING.findIndex((x) => x.id === HPS_SELECTED);
  if (abs < 0) return;
  /* 选中项不在当前页 → 先切到那一页 */
  const page = Math.floor(abs / RANK_PER_PAGE) + 1;
  if (page !== RANK_PAGE) {
    RANK_PAGE = page;
    buildRank();
    document.querySelectorAll('#rank .rk').forEach((row) => {
      row.classList.add('show');
      const mi = row.querySelector('.mini i');
      if (mi) mi.style.width = mi.dataset.w + '%';
      const sc = row.querySelector('.rk-score');
      if (sc && mi) sc.textContent = mi.dataset.w;
    });
  }
  document.querySelectorAll('#rank .rk').forEach((r) => r.classList.remove('sel'));
  const row = document.querySelector('#rank .rk[data-abs="' + abs + '"]');
  if (row) {
    row.classList.add('sel');
    try { row.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } catch (e) {}
  }
}

async function showTracePanel(trace, targetId, jobId) {
  if (!trace || !CURRENT) return;
  const isComp = (CURRENT && CURRENT.mode) === 'company';

  /* 0) 先中断正在跑的演示。
        否则 runDemo 的 reset() 会在扫描动画期间把刚写入的分数清零，
        表现为「点查看详情后分数变 0、分项变 0」。 */
  abortDemo();
  DEMO_ABORT = false;   // 复位，让后面的操作正常执行
  RESULT_LOCKED = true; // 锁定结果，后续任何 runDemo/reset 都不得改写分数

  /* 1) 记录选中目标并高亮（rebuildAll 会重建榜单，故选中态要在其后重新打） */
  HPS_SELECTED = targetId;
  markSelectedRow();

  /* 2) 蓝光扫描：扫过一遍后内容已更新（视觉上像"重新识别"） */
  await runScanSweep();

  /* 3) 用新数据同步全部板块
     注意：这里必须用 trace 里的完整数据重建 top，
     不能 Object.assign 旧 top —— 旧字段会和新 trace 混在一起，
     造成「匹配评分与排名不一致」（分数是新的、分项/技能是旧的）。 */
  const newJob = isComp ? CURRENT.job : (trace.job || CURRENT.job);
  const tCand = trace.candidate || {};
  applyData({
    mode: CURRENT.mode,
    job: newJob,
    list: CURRENT.list,
    trace,
    top: {
      /* 通用 */
      id: targetId,
      score: trace.score,
      parts: trace.parts || {},
      blocked: trace.blocked,
      /* 结论（亮点/风险/面试建议/成长路径）—— 缺了会导致渲染异常 */
      reasons: trace.reasons || {},
      /* 候选人相关（企业侧） */
      candidateId: isComp ? targetId : tCand.id,
      name: tCand.name || '',
      title: tCand.title || '',
      years: tCand.years || 0,
      skills: tCand.skills || [],
      certs: tCand.certs || [],
      /* 岗位相关（应聘者侧） */
      jobId: newJob.id,
      jobTitle: (trace.job && trace.job.title) || newJob.title || '',
      country: (trace.job && trace.job.country) || newJob.country || '',
      salary: (trace.job && trace.job.salary) || newJob.salary || ''
    }
  });
  rebuildAll();
  markSelectedRow();          // 榜单已重建，重新打上选中态

  /* 4) 直接给出最终分数（必须在 rebuildAll 之后，
        否则 buildBars 重建的 DOM 会把刚写入的数值覆盖回 0） */
  await jumpToResultInstant();

  /* 5) 同步「当前分」与状态条 */
  hudScore(trace.score);
  hudPhase('已完成', false);
  hudStep(STEPS.length, STEPS.length);
  hudTimerStop();
}

/** 蓝光横扫：一条竖直光带从左到右扫过分析区（约 0.7s） */
function runScanSweep() {
  return new Promise((resolve) => {
    const host = document.querySelector('.hps') || document.body;
    let line = document.getElementById('hpsSweep');
    if (!line) {
      line = document.createElement('div');
      line.id = 'hpsSweep';
      line.className = 'hps-sweep';
      host.appendChild(line);
    }
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      host.classList.remove('hps-sweeping');
      line.classList.remove('go');
      resolve();
    };
    host.classList.add('hps-sweeping');
    line.classList.remove('go');
    // eslint-disable-next-line no-unused-expressions
    void line.offsetWidth;             // 强制重排以重启动画
    line.classList.add('go');
    // 主定时器 + 兜底定时器：即使动画回调丢了也一定 resolve，避免卡死
    setTimeout(finish, 720);
    setTimeout(finish, 1400);
  });
}

/** 直接把所有内容置为"已完成"终态，不播任何推进动画 */
async function jumpToResultInstant() {
  /* 推理时间线：全部展开、标记完成 */
  const ol = $('#steps');
  if (ol) {
    ol.classList.add('on');
    [...ol.children].forEach((li, i) => {
      li.classList.add('show', 'done');
      li.classList.remove('active');
      const body = li.querySelector('.step-b');
      if (body && STEPS[i]) body.textContent = STEPS[i].b;
      const chips = li.querySelector('.chips');
      if (chips && STEPS[i]) {
        chips.innerHTML = '';
        STEPS[i].chips.forEach(([t, k]) => {
          const c = document.createElement('span');
          c.className = 'chip ' + k + ' show';
          c.textContent = t;
          chips.appendChild(c);
        });
      }
    });
  }
  /* 终端：补上全部行 */
  const term = $('#term');
  if (term) {
    term.innerHTML = '';
    (TERM_LINES || []).forEach((l) => termLine(l));
  }
  /* 分数环：直接到位 */
  const ring = $('#ringBar');
  if (ring) {
    const C = 2 * Math.PI * 62;
    const sc = scoreNow();
    ring.style.strokeDasharray = C;
    ring.style.strokeDashoffset = C * (1 - sc / 100);
  }
  const sn = $('#scoreNum');
  if (sn) sn.textContent = scoreNow();
  const bs = $('#beamScore');
  if (bs) { bs.textContent = '匹配度 ' + scoreNow() + '%'; bs.classList.add('hot'); }
  /* 分项条 + 技能：直接到位 */
  document.querySelectorAll('.bar-row').forEach((row) => {
    const fill = row.querySelector('.fill');
    const vl = row.querySelector('.vl');
    if (fill) fill.style.width = fill.dataset.v + '%';
    if (vl) vl.textContent = fill ? fill.dataset.v : '';
  });
  document.querySelectorAll('.skill').forEach((el) => el.classList.add('show'));
  /* 双卡直接显示 */
  const cand = $('#candCard'), job = $('#jobCard');
  if (cand) cand.style.cssText = 'opacity:1;transform:none;transition:none';
  if (job) job.style.cssText = 'opacity:1;transform:none;transition:none';
  const beam = $('#beam');
  if (beam) beam.classList.add('on');
  /* 榜单：全部展开、分数到位 */
  $('#rank') && $('#rank').classList.remove('hidden');
  $('#rankSkel') && $('#rankSkel').classList.add('hide');
  document.querySelectorAll('.rk').forEach((row) => {
    row.classList.add('show');
    const mini = row.querySelector('.mini i');
    const sc = row.querySelector('.rk-score');
    if (mini) mini.style.width = mini.dataset.w + '%';
    if (sc && mini) sc.textContent = mini.dataset.w;
  });
  await sleep(60);
}

/* 退出：取消选中态（板块内容保持当前候选人） */
function exitResultMode() {
  document.querySelectorAll('#rank .rk').forEach((r) => r.classList.remove('sel'));
}


/* =========================================================
   动画片段
   ========================================================= */
function ringAnimate(score) {
  const C = 2 * Math.PI * 62;
  const bar = $('#ringBar');
  bar.style.strokeDasharray = C;
  bar.style.strokeDashoffset = C;
  const t0 = performance.now();
  const dur = 1300;
  const tick = (now) => {
    const p = Math.min(1, (now - t0) / dur);
    bar.style.strokeDashoffset = C * (1 - easeOut(p) * (score / 100));
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  countTo($('#scoreNum'), score, sp(1300));
}

let DEMO_SPEED = 1;
const sp = (ms) => Math.max(1, Math.round(ms * DEMO_SPEED));

/* ---------------- 演示中断机制 ----------------
   用户离开分析页（点返回/切菜单）时必须立刻停掉：
   · 动画计时器（later/timers）
   · 语音播报（speechSynthesis）
   · 音效
   否则会出现"人都走了还在响"的问题。
   DEMO_ABORT 为 true 时，所有等待点都会提前退出。 */
let DEMO_ABORT = false;

/** 可被中断的等待：返回 true 表示已被中断，调用方应立刻 return */
async function spSleep(ms) {
  const step = 60;
  let left = Math.max(1, ms);
  while (left > 0) {
    if (DEMO_ABORT) return true;
    await new Promise((r) => setTimeout(r, Math.min(step, left)));
    left -= step;
  }
  return DEMO_ABORT;
}

/** 立刻中断当前演示：停计时器、停语音、停音效、复位状态 */
function abortDemo() {
  DEMO_ABORT = true;
  running = false;
  DEMO_SPEED = 1;
  clearTimers();
  try { if (window.HPSound) { if (window.HPSound.cancelVoice) window.HPSound.cancelVoice(); } } catch (e) {}
  try { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); } catch (e) {}
}
/* 批量分析中：由 mount 在开机动画后接管播放 */
let HPS_BATCH_ACTIVE = false;
let HPS_BATCH_MODE = 'company';   // company=候选人队列；persona=岗位队列

async function barsAnimate() {
  const rows = [...document.querySelectorAll('.bar-row')];
  const stepMs = sp(90);
  rows.forEach((row, i) => {
    const fill = row.querySelector('.fill');
    const vl = row.querySelector('.vl');
    later(() => {
      fill.style.width = fill.dataset.v + '%';
      countTo(vl, Number(fill.dataset.v), sp(800));
    }, i * stepMs);
  });
  await sleep(rows.length * stepMs + sp(850));
}

async function skillsAnimate() {
  const els = [...document.querySelectorAll('.skill')];
  const stepMs = sp(55);
  els.forEach((el, i) => later(() => el.classList.add('show'), i * stepMs));
  await sleep(els.length * stepMs + sp(420));
}

function caption(text, hold = 2200) {
  const c = $('#caption');
  c.innerHTML = text;
  c.classList.add('on');
  later(() => c.classList.remove('on'), hold);
}

/* =========================================================
   主流程
   ========================================================= */
let running = false;

/* ---------------- 跟随滚动 ---------------- */
const QP = new URLSearchParams(location.search);
const EMBEDDED = (function(){ try { return window.self !== window.top; } catch (e) { return true; } })();
let autoFollow = !EMBEDDED || QP.get('follow') === '1';
const followBtn = () => document.getElementById('follow');

function syncFollowBtn() {
  const b = followBtn();
  if (!b) return;
  b.classList.toggle('toggled', autoFollow);
  b.textContent = autoFollow ? '⌖ ' + L10('跟随中', 'Following') : '⌖ ' + L10('已暂停', 'Paused');
  b.setAttribute('aria-pressed', String(autoFollow));
}

/** 保证元素在舒适视野内（不在才滚，避免无意义抖动） */
function followEl(el, pad = 110) {
  if (!autoFollow || !el) return;
  const r = el.getBoundingClientRect();
  const vh = window.innerHeight || 800;
  if (r.top >= vh * 0.12 && r.bottom <= vh * 0.88) return;   // 已在舒适区，不动
  try { el.scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch (e) {}
}

/** 直接把某块滚到顶部下方 */
function followTop(el, offset = 88) {
  if (!autoFollow || !el) return;
  try { el.scrollIntoView({ block: 'start', behavior: 'smooth' }); } catch (e) {}
}

/** 用户手动滚动时让位 */
function bindManualScroll() {
  const pause = () => { if (autoFollow) { autoFollow = false; syncFollowBtn(); } };
  window.addEventListener('wheel', pause, { passive: true });
  window.addEventListener('touchmove', pause, { passive: true });
}

/* 演示节奏：opts.stepMs 为"全文逐字打字"的基准倍率（1 = 原速）。 */
/** 结果锁定：点「查看详情」后置位。
 *  锁定期间禁止 runDemo / reset 改写分数，
 *  否则演示的 reset() 会把刚写入的结果清成 0（分数与排名不一致的根因）。
 *  注意：声明必须在文件顶层最前面（showTracePanel 在 431 行就用到它），
 *  否则会因 TDZ 抛错导致 applyData 根本没执行。 */

async function runDemo(opts) {
  const pace = opts || null;
  DEMO_SPEED = pace && pace.stepMs ? pace.stepMs : 1;
  /* 已锁定结果：不再重播演示，避免覆盖当前结果 */
  if (RESULT_LOCKED) { DEMO_SPEED = 1; return; }
  if (running) { DEMO_SPEED = 1; return; }
  running = true;
  DEMO_ABORT = false;          // 新一轮开始，清掉上次的中断标记
  autoFollow = true;
  syncFollowBtn();
  reset(false);
  try { (currentRoot || document.body).scrollIntoView({ block: 'start', behavior: 'smooth' }); } catch (e) {}
  runConstruction();
  hudPhase('推理中', true);
  hudTimerStart();
  hudStep(0, STEPS.length);
  hudScore('--');
  if (await spSleep(120)) return;

  /* 1. 双卡入位 + 光束 */
  const cand = $('#candCard'), job = $('#jobCard');
  cand.style.transform = 'translateX(-34px)';
  job.style.transform = 'translateX(34px)';
  cand.style.opacity = job.style.opacity = '0';
  if (await spSleep(sp(40))) return;
  cand.style.transition = job.style.transition = 'all .7s cubic-bezier(.16,1,.3,1)';
  cand.style.transform = job.style.transform = 'none';
  cand.style.opacity = job.style.opacity = '1';
  if (await spSleep(sp(520))) return;
  $('#beam').classList.add('on');
  cand.classList.add('lit');
  job.classList.add('lit');
  caption(L10('双向匹配开始：左侧候选人画像 · 右侧岗位要求','Bidirectional matching started: candidate profile on the left · job requirements on the right'), 2400);
  if (await spSleep(sp(900))) return;

  /* 2. 时间线逐条推进 */
  const ol = $('#steps');
  ol.classList.add('on');
  const lis = [...ol.children];

  for (let i = 0; i < STEPS.length; i++) {
    if (DEMO_ABORT) return;
    const li = lis[i];
    li.classList.add('show', 'active');
    li.querySelector('.chips').innerHTML = '';
    railUpdate(i);
    hudStep(i + 1, STEPS.length);
    termLine(TERM_LINES[i] || 'step ' + (i + 1));
    followEl(li, 120);
    if (i > 0) lis[i - 1].classList.remove('active');
    if (i > 0) lis[i - 1].classList.add('done');

    const body = li.querySelector('.step-b');
    /* 打字速度随节奏缩放：stepMs=1 → 15ms/字（原速）；0.4 → 6ms/字；0.16 → 2ms/字。
       下限 2ms 保证依然能看到"逐字浮现"的效果，不会整段瞬间出现。 */
    await typeText(body, STEPS[i].b, Math.max(2, Math.round(15 * DEMO_SPEED)));
    if (DEMO_ABORT) return;

    const chips = li.querySelector('.chips');
    for (const [txt, kind] of STEPS[i].chips) {
      const c = document.createElement('span');
      c.className = 'chip ' + kind;
      c.textContent = txt;
      chips.appendChild(c);
      if (await spSleep(sp(45))) return;
      c.classList.add('show');
    }

    if (STEPS[i].key === 'gate') {
      const g = (CURRENT.trace && CURRENT.trace.gates) || [];
      caption(g.length ? '门槛提示：<b>' + g.join('；') + '</b>' : '硬性门槛全部通过：护照、健康证、年龄均满足', 2800);
    }
    if (STEPS[i].key === 'weight') {
      const P = (CURRENT.trace && CURRENT.trace.parts) || {};
      caption('加权计算：技能 ' + (P.skill || 0) + ' · 证书 ' + (P.cert || 0) + ' · 薪资 ' + (P.salary || 0) + ' · 地点 ' + (P.location || 0) + ' · 经验 ' + (P.exp || 0) + ' · 可用性 ' + (P.availability || 0) + ' → <b>' + scoreNow() + ' 分</b>', 2800);
    }
    if (await spSleep(sp(340))) return;
  }
  lis[lis.length - 1].classList.remove('active');
  lis[lis.length - 1].classList.add('done');

  /* 3. 分数与分项 */
  hudPhase('打分中', true);
  followTop(document.querySelector('.score-wrap'), 96);
  caption('综合评分生成中…', 1600);
  const ringEl = document.querySelector('.ring');
  if (ringEl) { ringEl.classList.remove('scanning'); void ringEl.offsetWidth; ringEl.classList.add('scanning'); }
  ringAnimate(scoreNow());
  hudScore(scoreNow());
  $('#beamScore').textContent = '匹配度 ' + scoreNow() + '%';
  $('#beamScore').classList.add('hot');
  if (window.HPSound && window.HPSound.on()) {
    window.HPSound.cue('done', '匹配分析完成，综合匹配度 ' + scoreNow() + ' 分');
  }
  if (await spSleep(sp(420))) return;
  await barsAnimate();
  await skillsAnimate();

  /* 4. 排名 */
  $('#rank').classList.remove('hidden');
  $('#rankSkel').classList.add('hide');
  followTop(document.querySelector('.rank-panel'), 96);
  const rows = [...document.querySelectorAll('.rk')];
  for (const [i, row] of rows.entries()) {
    row.classList.add('show');
    later(() => {
      row.querySelector('.mini i').style.width = row.querySelector('.mini i').dataset.w + '%';
      countTo(row.querySelector('.rk-score'), Number(row.querySelector('.mini i').dataset.w), sp(700));
    }, 120);
    if (await spSleep(sp(110))) return;
  }

  hudPhase('完成', false);
  hudTimerStop();
  hudStep(STEPS.length, STEPS.length);
  const concl = document.querySelector('.concl-grid');
  if (concl) { const card = concl.closest('.panel'); card.classList.remove('concl-pop'); void card.offsetWidth; card.classList.add('concl-pop'); }
  followTop(document.querySelector('.rank-panel'), 96);
  caption('排序完成：<b>' + nameNow() + ' ' + scoreNow() + ' 分</b> 排名第一' + (growthNow() ? '，' + growthNow() : ''), 4200);
  running = false;
  DEMO_SPEED = 1;   // 复位，避免影响后续手动播放
}

function jumpToEnd() {
  clearTimers();
  running = false;
  $('#beam').classList.add('on');
  $('#candCard').classList.add('lit');
  $('#jobCard').classList.add('lit');
  $('#candCard').style.cssText = 'opacity:1;transform:none;transition:none';
  $('#jobCard').style.cssText = 'opacity:1;transform:none;transition:none';

  const ol = $('#steps');
  ol.classList.add('on');
  [...ol.children].forEach((li, i) => {
    li.classList.add('show', 'done');
    li.querySelector('.step-b').textContent = STEPS[i].b;
    const chips = li.querySelector('.chips');
    chips.innerHTML = '';
    if (true) {
      STEPS[i].chips.forEach(([t, k]) => {
        const c = document.createElement('span');
        c.className = 'chip ' + k + ' show';
        c.textContent = t;
        chips.appendChild(c);
      });
    } else {
      [...chips.children].forEach((c) => c.classList.add('show'));
    }
  });

  railUpdate(STEPS.length - 1);
  hudTimerStop();
  hudPhase('完成', false);
  hudStep(STEPS.length, STEPS.length);
  hudScore(scoreNow());
  const hudT = hudEl('hudTime');
  if (hudT) hudT.textContent = '—';
  termReset();
  TERM_LINES.forEach((l) => termLine(l));
  // 分数：直接给终值
  const C = 2 * Math.PI * 62;
  const bar = $('#ringBar');
  bar.style.strokeDasharray = C;
  bar.style.strokeDashoffset = C * (1 - scoreNow() / 100);
  $('#scoreNum').textContent = String(scoreNow());
  $('#beamScore').textContent = '匹配度 ' + scoreNow() + '%';
  $('#beamScore').classList.add('hot');

  document.querySelectorAll('.bar-row').forEach((row) => {
    const fill = row.querySelector('.fill');
    fill.style.width = fill.dataset.v + '%';
    row.querySelector('.vl').textContent = fill.dataset.v;
  });
  document.querySelectorAll('.skill').forEach((el) => el.classList.add('show'));
  $('#rank').classList.remove('hidden');
  $('#rankSkel').classList.add('hide');

  document.querySelectorAll('.rk').forEach((row) => {
    row.classList.add('show');
    const i = row.querySelector('.mini i');
    i.style.width = i.dataset.w + '%';
    row.querySelector('.rk-score').textContent = i.dataset.w;
  });

  caption(L10('已跳到结果态：可停留讲解排名与分项得分','Jumped to results: you can stay to review ranking and sub-scores'), 3000);
}

function reset(showCaption = true) {
  clearTimers();
  running = false;
  /* 结果锁定期间：只清动画状态，不动分数/分项（否则会把结果清零） */
  const keepScore = RESULT_LOCKED;
  const ol = $('#steps');
  ol.classList.remove('on');
  if (keepScore) return;   // 锁定后直接返回，保留已呈现的结果
  [...ol.children].forEach((li) => {
    li.classList.remove('show', 'active', 'done');
    li.querySelector('.step-b').textContent = '';
    li.querySelector('.chips').innerHTML = '';
  });

  $('#ringBar').style.strokeDasharray = 2 * Math.PI * 62;
  $('#ringBar').style.strokeDashoffset = 2 * Math.PI * 62;
  $('#scoreNum').textContent = '0';
  $('#beamScore').textContent = '匹配度 --';
  $('#beamScore').classList.remove('hot');
  $('#beam').classList.remove('on');
  $('#candCard').classList.remove('lit');
  $('#jobCard').classList.remove('lit');
  $('#candCard').style.cssText = '';
  $('#jobCard').style.cssText = '';
  $('#caption').classList.remove('on');

  document.querySelectorAll('.bar-row').forEach((row) => {
    row.querySelector('.fill').style.width = '0%';
    row.querySelector('.vl').textContent = '0';
  });
  document.querySelectorAll('.skill').forEach((el) => el.classList.remove('show'));
  railReset();
  hudTimerStop();
  hudPhase('待机', false);
  hudStep(0, STEPS.length);
  hudScore('--');
  termReset();
  const tEl = hudEl('hudTime');
  if (tEl) tEl.textContent = '0.0s';
  $('#rankSkel').classList.remove('hide');
  $('#rank').classList.add('hidden');
  document.querySelectorAll('.rk').forEach((row) => {
    row.classList.remove('show');
    row.querySelector('.mini i').style.width = '0%';
    row.querySelector('.rk-score').textContent = '0';
  });

  if (showCaption) { runConstruction(); caption('已重置，点击「自动演示」开始', 1800); }
}

/* =========================================================
   HUD 状态条 / 终端日志 / 计时器
   ========================================================= */
let phaseTimer = null;
let phaseStart = 0;

function hudPhase(text, running = true) {
  const bar = hudEl('hudbar');
  const el = hudEl('hudPhase');
  if (!bar || !el) return;
  /* 按当前语言翻译（'完成' 与 '已完成' 都视为完成态） */
  el.textContent = (window.HPI18N && window.HPI18N.t) ? window.HPI18N.t(text) : text;
  el.classList.toggle('done', text === '完成' || text === '已完成');
  bar.classList.toggle('running', running);
}
function hudStep(i, total) {
  const el = hudEl('hudStep');
  if (el) el.textContent = i + ' / ' + total;
  const pr = hudEl('hudProg');
  if (pr) pr.style.width = Math.round((i / total) * 100) + '%';
}
function hudScore(v) {
  const el = hudEl('hudScore');
  if (el) el.textContent = v + L10(' 分', ' pts');
}
function hudTimerStart() {
  phaseStart = performance.now();
  if (phaseTimer) clearInterval(phaseTimer);
  phaseTimer = setInterval(() => {
    const el = hudEl('hudTime');
    if (el) el.textContent = ((performance.now() - phaseStart) / 1000).toFixed(1) + 's';
  }, 100);
}
function hudTimerStop() {
  if (phaseTimer) { clearInterval(phaseTimer); phaseTimer = null; }
}

/** 终端日志：一行一行往下刷 */
let TERM_LINES = [
  'load  profile#zhangwei  →  12 features',
  'parse jd#job-2048      →  7 constraints',
  'gate  passport ✓ health ✓ language ✗',
  'align skills           →  hit 5 / miss 2',
  'compare salary         →  22k ∈ [18k,25k]',
  'llm   deepseek-chat    →  8 evidence, 2 gaps',
  'score weights          →  84 + 2 = 86',
  'emit  reasons x3 · risks x2 · questions x3'
];
let termIndex = 0;

function termLine(text) {
  const box = $('#term');
  if (!box) return;
  const div = document.createElement('div');
  div.className = 'ln';
  const t = new Date();
  const ts = String(t.getHours()).padStart(2, '0') + ':' + String(t.getMinutes()).padStart(2, '0') + ':' + String(t.getSeconds()).padStart(2, '0');
  div.innerHTML = '<em>' + ts + '</em>  ' + text;
  box.appendChild(div);
  while (box.childElementCount > 5) box.removeChild(box.firstChild);
}
function termReset() {
  const box = $('#term');
  if (box) box.innerHTML = '';
  termIndex = 0;
}

/* =========================================================
   蓝图构建动画（蓝线绘制）
   ========================================================= */
const NS = 'http://www.w3.org/2000/svg';

/** 背景网格：横竖线逐条“画”出来，营造蓝图构建感 */
function buildBlueprint() {
  const svg = $('#blueprint');
  svg.innerHTML = '';
  const w = Math.max(window.innerWidth, 800);
  const h = Math.max(window.innerHeight, 600);
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
  const step = 54;
  let idx = 0;
  // 竖线从中间往两边展开
  for (let x = step; x < w; x += step) {
    const l = document.createElementNS(NS, 'line');
    l.setAttribute('x1', x); l.setAttribute('y1', 0);
    l.setAttribute('x2', x); l.setAttribute('y2', h);
    l.setAttribute('pathLength', '1');
    // 每隔几根加一条流动光带
    const isTrace = (idx % 9 === 0);
    l.setAttribute('class', 'bp-line' + (isTrace ? ' trace' : ''));
    if (isTrace) l.removeAttribute('pathLength');
    const d = Math.abs(x - w / 2) / w;
    l.style.animationDelay = Math.round(d * 320) + 'ms';
    svg.appendChild(l);
    idx++;
  }
  // 横线自上而下
  for (let y = step; y < h; y += step) {
    const l = document.createElementNS(NS, 'line');
    l.setAttribute('x1', 0); l.setAttribute('y1', y);
    l.setAttribute('x2', w); l.setAttribute('y2', y);
    l.setAttribute('pathLength', '1');
    l.setAttribute('class', 'bp-line h');
    l.style.animationDelay = Math.round((y / h) * 420) + 'ms';
    svg.appendChild(l);
    idx++;
  }
  return idx;
}

/** 卡片四角 HUD 括号 */
function addBrackets() {
  document.querySelectorAll('.card').forEach((card) => {
    if (card.querySelector('.bracket')) return;
    ['tl', 'tr', 'bl', 'br'].forEach((k) => {
      const b = document.createElement('span');
      b.className = 'bracket ' + k;
      card.appendChild(b);
    });
  });
}

/** 分数环外圈刻度 */
function hudTicks() {
  const g = hudEl('hudTicks');
  if (!g || g.childElementCount) return;
  for (let i = 0; i < 36; i++) {
    const a = (i / 36) * Math.PI * 2;
    const r1 = 66, r2 = i % 3 === 0 ? 70 : 68.5;
    const l = document.createElementNS(NS, 'line');
    l.setAttribute('x1', 75 + Math.cos(a) * r1);
    l.setAttribute('y1', 75 + Math.sin(a) * r1);
    l.setAttribute('x2', 75 + Math.cos(a) * r2);
    l.setAttribute('y2', 75 + Math.sin(a) * r2);
    l.setAttribute('class', 'hud-tick');
    g.appendChild(l);
  }
}

/** 播放一次“构建”过程 */
function runConstruction() {
  buildBlueprint();
  addBrackets();
  hudTicks();

  // 扫描线
  const scan = $('#scan');
  scan.classList.remove('run');
  void scan.offsetWidth;
  scan.classList.add('run');

  // 标题下的构建线
  const bl = $('#buildLine');
  bl.classList.remove('run');
  void bl.offsetWidth;
  setTimeout(() => bl.classList.add('run'), 180);

  // 卡片：先扫描，再亮角标
  document.querySelectorAll('.card').forEach((card, i) => {
    card.classList.remove('framed', 'scanning');
    setTimeout(() => {
      card.classList.add('scanning');
      setTimeout(() => card.classList.add('framed'), 420);
    }, 520 + i * 160);
  });
}

/* =========================================================
   启动
   ========================================================= */
/* ---------- 真实数据加载（企业 / 应聘者 双视角） ---------- */
const API = (window.HP_API_BASE || location.origin).replace(/\/+$/, '');
let CURRENT = { mode: 'company', jobId: null, list: [], trace: null, parts: null, top: null, job: null };
const scoreNow = () => (CURRENT.top && CURRENT.top.score) || 0;
const nameNow = () => (CURRENT.top && CURRENT.top.name) || '候选人';
const growthNow = () => (CURRENT.top && CURRENT.top.reasons && CURRENT.top.reasons.growth) || '';

/** 统一请求头：本地走 Cookie，云端（跨站）自动带签名令牌 */
function authHeaders(extra) {
  const h = Object.assign({ 'x-hp-request': '1' }, extra || {});
  try {
    const t = sessionStorage.getItem('hp-token') || localStorage.getItem('hp-token');
    if (t) h.authorization = 'Bearer ' + t;
  } catch (e) {}
  return h;
}

async function api(path, options = {}) {
  const res = await fetch(API + path, {
    credentials: 'include',
    headers: authHeaders({ 'content-type': 'application/json' }),
    ...options
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || ('HTTP ' + res.status));
  return body;
}

async function whoAmI() {
  const r = await fetch(API + '/api/me', {
    credentials: 'include',
    headers: authHeaders()
  });
  if (!r.ok) return null;
  const body = await r.json().catch(() => null);
  if (!body) return null;
  // /api/me 返回 { user: {...} }，兼容直接返回用户对象的情况
  const user = body.user || body;
  return user && user.role ? user : null;
}

async function demoLogin(role) {
  const r = await fetch(API + '/api/auth/demo', {
    method: 'POST', credentials: 'include',
    headers: authHeaders({ 'content-type': 'application/json' }),
    body: JSON.stringify({ role })
  });
  if (!r.ok) throw new Error('演示登录失败');
  return r.json();
}

/** 企业视角：某岗位的候选人排名 + 第一名轨迹 */
async function loadCompany(jobId) {
  const rank = await api('/api/company/jobs/' + jobId + '/candidates');
  const top = rank.list && rank.list[0];
  const trace = top ? await api('/api/match/trace?jobId=' + encodeURIComponent(jobId) + '&candidateId=' + encodeURIComponent(top.candidateId) + hpLangParam() + '&lang=' + ((window.HPI18N && window.HPI18N.lang()) || 'zh')) : null;
  return { rank, top, trace };
}

/** 应聘者视角：给我的推荐岗位 + 当前岗位的轨迹 */
async function loadPersona(candidateId, jobId) {
  const rec = await api('/api/persona/recommendations');
  const hit = (rec.list || []).find((x) => x.jobId === jobId) || (rec.list || [])[0];
  const trace = await api('/api/match/trace?jobId=' + encodeURIComponent(hit.jobId) + '&candidateId=' + encodeURIComponent(candidateId) + hpLangParam() + '&lang=' + ((window.HPI18N && window.HPI18N.lang()) || 'zh'));
  return { rec, hit, trace };
}

/** 把接口数据灌进页面 */
function applyData({ mode, job, list, trace, top }) {
  CURRENT.mode = mode;
  CURRENT.job = job;
  CURRENT.jobId = job.id;
  CURRENT.list = list || [];
  CURRENT.top = top || CURRENT.list[0] || null;
  CURRENT.trace = trace;

  STEPS = (trace.steps || []).map((st) => ({
    key: st.key, t: st.title, ms: st.ms, b: st.detail,
    chips: (st.chips || []).map((c) => [c.text, c.ok ? 'ok' : 'no'])
  }));
  /* AI 证据作为额外 chip 挂在语义复核那一步 */
  const semStep = STEPS.find((x) => x.key === 'semantic');
  if (semStep && Array.isArray(trace.aiEvidence)) {
    const evPrefix = ((window.HPI18N && window.HPI18N.lang && window.HPI18N.lang()) || 'zh') === 'zh' ? '证据：' : 'Evidence: ';
    trace.aiEvidence.slice(0, 2).forEach((ev) => semStep.chips.push([evPrefix + ev.slice(0, 14), 'ok']));
  }
  TERM_LINES = STEPS.map((x, i) => 'step ' + (i + 1) + '  ' + x.t.toLowerCase().replace(/\s+/g, '_'));

  const P = trace.parts || {};
  const MAXP = { skill: 40, cert: 20, salary: 15, location: 10, exp: 10, availability: 5 };
  BAR_DATA = [
    [L10('技能', 'Skills'), Math.round((P.skill || 0) / MAXP.skill * 100)],
    [L10('证书', 'Certs'), Math.round((P.cert || 0) / MAXP.cert * 100)],
    [L10('薪资', 'Salary'), Math.round((P.salary || 0) / MAXP.salary * 100)],
    [L10('地点', 'Location'), Math.round((P.location || 0) / MAXP.location * 100)],
    ['经验', Math.round((P.exp || 0) / MAXP.exp * 100)],
    ['可用性', Math.round((P.availability || 0) / MAXP.availability * 100)]
  ];

  const specs = (trace.spec && trace.spec.skills) || [];
  const hitsArr = Array.isArray(trace.hits) ? trace.hits : [];
  SKILLS = specs.map((n) => [n, hitsArr.includes('技能：' + n) ? 1 : 0]);

  // 右侧榜单：企业=候选人；应聘者=岗位
  RANKING = CURRENT.list.map((x) => mode === 'company'
    ? { id: x.candidateId || x.id, n: x.name, r: (x.title || '') + ' · ' + x.years + ' 年', s: x.score }
    : { id: x.jobId, n: x.jobTitle, r: x.country + ' · ' + (x.salary || ''), s: x.score });

  // 结论卡
  const grid = document.querySelector('.concl-grid');
  if (grid) {
    const R = trace.reasons || {};
    var SEP = L10('；', '; ');
    grid.innerHTML = '';
    [[L10('亮点', 'Highlights'), (R.highlights || []).join(SEP) || '—', ''],
     [L10('风险', 'Risks'), (R.risks || []).join(SEP) || L10('暂无', 'None'), 'no'],
     [L10('面试建议', 'Interview questions'), (R.questions || []).join(SEP) || '—', 'vio'],
     [L10('成长路径', 'Growth path'), R.growth || '—', '']].forEach(([label, text, cls]) => {
      const row = document.createElement('div');
      row.className = 'concl-row';
      row.innerHTML = '<span class="cl ' + cls + '">' + label + '</span><span>' + text + '</span>';
      grid.appendChild(row);
    });
  }

  // 左侧卡片
  const cand = trace.candidate || {};
  document.querySelector('#candCard .name').textContent = (L10(cand.name || '—', EN_NAME(cand.name)) ) + (mode === 'persona' ? L10('（我）', ' (me)') : '');
  document.querySelector('#candCard .role').textContent = (cand.title || '') + ' · ' + (cand.years || 0) + L10(' 年经验',' yrs experience');
  document.querySelector('#candCard .avatar').textContent = (cand.name || '?').slice(0, 1);

  const cTags = document.querySelector('#candCard .tags');
  cTags.innerHTML = '';
  if (mode === 'company') {
    (trace.hits || []).slice(0, 3).forEach((h) => {
      const el = document.createElement('span'); el.className = 'tag';
      el.textContent = h.replace('技能：', '').replace('证书：', ''); cTags.appendChild(el);
    });
    (trace.gaps || []).slice(0, 1).forEach((g) => {
      const el = document.createElement('span'); el.className = 'tag ghost';
      el.textContent = '待补充：' + g.replace('技能：', '').replace('证书：', ''); cTags.appendChild(el);
    });
  } else {
    ((trace.spec && trace.spec.skills) || []).slice(0, 4).forEach((sk) => {
      const el = document.createElement('span'); el.className = 'tag'; el.textContent = sk; cTags.appendChild(el);
    });
    ((CURRENT.top && CURRENT.top.reasons && CURRENT.top.reasons.highlights) || []).slice(0, 1).forEach((h) => {
      const el = document.createElement('span'); el.className = 'tag ghost'; el.textContent = h; cTags.appendChild(el);
    });
  }

  // 右侧卡片
  const jb = trace.job || job;
  document.querySelector('#jobCard .name').textContent = jb.title;
  document.querySelector('#jobCard .role').textContent = (jb.employer || '') + ' · ' + (jb.salary || '');
  document.querySelector('#jobCard .avatar').textContent = '岗';

  const jTags = document.querySelector('#jobCard .tags');
  jTags.innerHTML = '';
  ((trace.spec && trace.spec.skills) || []).slice(0, 2).forEach((sk) => {
    const el = document.createElement('span'); el.className = 'tag'; el.textContent = sk; jTags.appendChild(el);
  });
  ((trace.spec && trace.spec.languages) || []).forEach((l) => {
    const el = document.createElement('span'); el.className = 'tag warn'; el.textContent = l.code + ' 优先'; jTags.appendChild(el);
  });
  ((trace.spec && trace.spec.certs) || []).slice(0, 1).forEach((c) => {
    const el = document.createElement('span'); el.className = 'tag ghost'; el.textContent = '需 ' + c; jTags.appendChild(el);
  });

  // HUD 的「模型」格子显示真实模型
  const modelCell = document.querySelectorAll('#hudbar .v');
  if (modelCell && modelCell.length >= 4) {
    modelCell[3].textContent = trace.aiMode === 'llm' ? (trace.aiModel || 'deepseek-chat') : '规则引擎';
  }

  const rankTitle = document.querySelector('.rank-panel h2');
  if (rankTitle) rankTitle.childNodes[0].nodeValue = mode === 'company' ? '候选人排名 ' : '推荐岗位 ';

  // 视角徽标
  const tip = document.getElementById('pickerTip');
  if (tip) tip.dataset.mode = mode;
}

/* =========================================================
   启动：拉真实数据 → 渲染 → 自动演示
   ========================================================= */
function buildRail() {
  const ul = document.getElementById('railDots');
  if (!ul) return;
  ul.innerHTML = '';
  STEPS.forEach((st, i) => {
    const li = document.createElement('li');
    li.innerHTML = '<b>' + (i + 1) + '</b><span>' + st.t + '</span>';
    ul.appendChild(li);
  });
}

function railUpdate(index) {
  const dots = document.querySelectorAll('#railDots li');
  const fill = document.getElementById('railFill');
  dots.forEach((li, i) => {
    li.classList.toggle('on', i === index);
    li.classList.toggle('done', i < index);
  });
  if (fill) fill.style.height = ((index + 1) / Math.max(1, STEPS.length) * 100).toFixed(1) + '%';
}
function railReset() {
  document.querySelectorAll('#railDots li').forEach((li) => li.classList.remove('on', 'done'));
  const fill = document.getElementById('railFill');
  if (fill) fill.style.height = '0%';
}

function rebuildAll() {
  buildSteps();
  buildRail();
  buildBars();
  buildSkills();
  buildRank();
  $('#ringBar').style.strokeDasharray = 2 * Math.PI * 62;
  $('#ringBar').style.strokeDashoffset = 2 * Math.PI * 62;
}

/* ---------------- 语言切换：换文案后重建动画 ---------------- */
document.addEventListener('hp:lang', function (e) {
  var lang = (e && e.detail && e.detail.lang) || 'zh';
  try {
    /* 重新绑定当前语言的步骤与柱状数据 */
    STEPS = stepsFor(lang);
    BAR_DATA = barsFor(lang);

    /* 步骤列表：标题 + 正文 + 标签 */
    STEPS.forEach(function (s, i) {
      var box = document.querySelector('#steps .step[data-i="' + i + '"]');
      if (!box) {
        var nodes = document.querySelectorAll('#steps .step');
        box = nodes[i];
      }
      if (!box) return;
      var tEl = box.querySelector('.st-t, .st-title, b');
      if (tEl) tEl.textContent = s.t;
      var bEl = box.querySelector('.st-b, p');
      if (bEl) bEl.textContent = s.b;
      var chipBox = box.querySelector('.st-chips');
      if (chipBox) {
        chipBox.innerHTML = s.chips.map(function (c) {
          return '<span class="chip ' + (c[1] === 'ok' ? 'chip-s' : 'chip-d') + '">' + c[0] + '</span>';
        }).join('');
      }
    });

    /* 重建依赖语言的图形 */
    buildSteps();
    buildBars();
    buildSkills();
    buildRank();

    /* 静态骨架文案（分析页由 hp-stage-markup.js 生成，用词典按原文替换） */
    if (window.HPI18N && window.HPI18N.apply) window.HPI18N.apply(document);
  } catch (err) {
    console.warn('stage i18n rebuild failed', err);
  }
});

function setTip(text) {
  const el = document.getElementById('pickerTip');
  if (el) el.innerHTML = text;
}

/* ---------------- 档案调节台：拖动即重算 ---------------- */
const DEFAULT_PROFILE = {
  skills: ['玻璃压机操作', '设备点检', '工艺参数调整', '三班倒作业', '模具维护'],
  certs: ['中级职业资格证', '健康证'],
  languages: {},
  salaryExpect: 22000,
  availabilityDays: 20,
  years: 8
};
let tunerTimer = null;
let tunerBusy = false;

function tunerEls() {
  return {
    box: document.getElementById('tuner'),
    salary: document.getElementById('fSalary'),
    avail: document.getElementById('fAvail'),
    years: document.getElementById('fYears'),
    vSalary: document.getElementById('vSalary'),
    vAvail: document.getElementById('vAvail'),
    vYears: document.getElementById('vYears'),
    skills: document.getElementById('tunerSkills'),
    tip: document.getElementById('tunerTip'),
    reset: document.getElementById('tunerReset'),
    delta: document.getElementById('deltaPop')
  };
}

/** 用当前档案初始化调节台 */
function initTuner(cand, spec) {
  const e = tunerEls();
  if (!e.box || !cand) return;
  e.box.classList.add('on');

  e.salary.value = cand.salaryExpect || 22000;
  e.avail.value = cand.availabilityDays || 20;
  e.years.value = cand.years || 8;
  e.vSalary.textContent = e.salary.value;
  e.vAvail.textContent = e.avail.value;
  e.vYears.textContent = e.years.value;

  const needed = (spec && spec.skills) || [];
  const mine = cand.skills || [];
  const all = [...new Set([...needed, ...mine])];
  e.skills.innerHTML = '';
  all.forEach((skill) => {
    const chip = document.createElement('span');
    chip.className = 'tsk' + (mine.includes(skill) ? ' on' : '');
    chip.dataset.skill = skill;
    chip.textContent = skill;
    chip.addEventListener('click', () => { chip.classList.toggle('on'); scheduleTuner(); });
    e.skills.appendChild(chip);
  });

  [e.salary, e.avail, e.years].forEach((input) => {
    input.oninput = () => {
      e.vSalary.textContent = e.salary.value;
      e.vAvail.textContent = e.avail.value;
      e.vYears.textContent = e.years.value;
      scheduleTuner();
    };
  });
  e.reset.onclick = () => resetTuner();
}

function scheduleTuner() {
  const e = tunerEls();
  if (e.tip) e.tip.innerHTML = '正在重算…';
  clearTimeout(tunerTimer);
  tunerTimer = setTimeout(applyTuner, 320);
}

function tunerPatch() {
  const e = tunerEls();
  const skills = [...e.skills.querySelectorAll('.tsk.on')].map((c) => c.dataset.skill);
  return {
    skills,
    salaryExpect: Number(e.salary.value),
    availabilityDays: Number(e.avail.value),
    years: Number(e.years.value)
  };
}

async function applyTuner() {
  if (tunerBusy) { scheduleTuner(); return; }
  tunerBusy = true;
  const e = tunerEls();
  try {
    const res = await fetch(API + '/api/persona/profile', {
      method: 'PATCH',
      credentials: 'include',
      headers: authHeaders({ 'content-type': 'application/json' }),
      body: JSON.stringify(tunerPatch())
    });
    const j = await res.json();
    if (!res.ok) throw new Error(j.error || ('HTTP ' + res.status));

    // 分数动画
    const target = j.after && j.after.score;
    if (typeof target === 'number') {
      ringAnimate(target);
      const b = document.getElementById('beamScore');
      if (b) { b.textContent = '匹配度 ' + target + '%'; b.classList.add('hot'); }
      hudScore(target);
      showDelta(j.delta);
      setTimeout(() => {
        const el = document.getElementById('scoreNum');
        if (el) el.textContent = String(target);
      }, 1400);
    }
    if (e.tip) {
      e.tip.innerHTML = j.delta === null || j.delta === undefined
        ? '已更新'
        : (j.delta >= 0 ? '分数 <b>+' + j.delta + '</b>' : '分数 <b>' + j.delta + '</b>') + ' · 已写入人才库';
    }

    // 就地刷新：推荐列表（只保留选中岗位）、分项条、技能矩阵——不重挂载，避免闪一下
    const rec = await api('/api/persona/recommendations');
    if (rec && rec.list) {
      let list = rec.list;
      if (HPS.jobs.length) {
        const picked = list.filter((x) => HPS.jobs.includes(x.jobId));
        if (picked.length) list = picked;
      }
      CURRENT.list = list;
      CURRENT.top = list[0] || CURRENT.top;

      /* 应聘者侧：只把「本次选中的岗位」放进排名榜单。
         修复历史问题：之前直接用推荐列表全量（list），
         导致只分析 1 个岗位却显示多个。 */
      const pickedIds = (HPS.jobs && HPS.jobs.length) ? HPS.jobs : null;
      const rankSrc = pickedIds
        ? list.filter((x) => pickedIds.indexOf(x.jobId) >= 0)
        : list;
      RANKING = (rankSrc.length ? rankSrc : list).map((x) => ({
        id: x.jobId, n: x.jobTitle, r: x.country + ' · ' + (x.salary || ''), s: x.score
      }));
      RANK_PAGE = 1;
      buildRank();
      renderRankPager();

      // 分项条按新的 parts 重绘
      const P = (CURRENT.top && CURRENT.top.parts) || {};
      const MAXP = { skill: 40, cert: 20, salary: 15, location: 10, exp: 10, availability: 5 };
      BAR_DATA = [
        ['技能', Math.round((P.skill || 0) / MAXP.skill * 100)],
        ['证书', Math.round((P.cert || 0) / MAXP.cert * 100)],
        ['薪资', Math.round((P.salary || 0) / MAXP.salary * 100)],
        ['地点', Math.round((P.location || 0) / MAXP.location * 100)],
        ['经验', Math.round((P.exp || 0) / MAXP.exp * 100)],
        ['可用性', Math.round((P.availability || 0) / MAXP.availability * 100)]
      ];
      buildBars();
      const barsBox = document.getElementById('bars');
      if (barsBox) {
        barsBox.classList.remove('hidden');
        [...barsBox.querySelectorAll('.bar-row')].forEach((row, i) => {
          const fill = row.querySelector('.fill');
          const vl = row.querySelector('.vl');
          const v = BAR_DATA[i] ? BAR_DATA[i][1] : 0;
          if (fill) { fill.style.width = v + '%'; fill.dataset.v = v; }
          if (vl) vl.textContent = v;
        });
      }
    }
  } catch (err) {
    if (e.tip) e.tip.textContent = '重算失败：' + err.message;
  } finally {
    tunerBusy = false;
  }
}

function showDelta(delta) {
  const el = document.getElementById('deltaPop');
  if (!el || typeof delta !== 'number' || delta === 0) return;
  el.textContent = (delta > 0 ? '+' : '') + delta + L10(' 分',' pts');
  el.style.color = delta > 0 ? '#9ff6d4' : '#ffc2cc';
  el.classList.remove('show');
  void el.offsetWidth;
  el.classList.add('show');
}

async function resetTuner() {
  clearTimeout(tunerTimer);
  tunerBusy = true;
  setTip('正在恢复初始档案…');
  try {
    await fetch(API + '/api/persona/profile', {
      method: 'PATCH',
      credentials: 'include',
      headers: authHeaders({ 'content-type': 'application/json' }),
      body: JSON.stringify(DEFAULT_PROFILE)
    });
  } catch (err) {
    setTip('恢复失败：' + err.message);
    tunerBusy = false;
    return;
  }
  // 重挂载：保持视图内，不刷新整页
  if (currentRoot) { try { await mount(currentRoot, window.__HPS_CFG); } catch (e) {} }
}

const HPS = { jobs: [], job: '', autorun: true };
function hpsParse(query) {
  const q = new URLSearchParams(query || '');
  HPS.job = q.get('job') || '';
  HPS.jobs = (q.get('jobs') || '').split(',').map((x) => x.trim()).filter(Boolean);
  /* 记录「本次选中的岗位」，供「查看结果」页只展示这些岗位 */
  if (HPS.jobs.length) window.__hpPickedJobs = HPS.jobs.slice();
  else if (HPS.job) window.__hpPickedJobs = [HPS.job];
  else window.__hpPickedJobs = null;
  HPS.autorun = q.get('autorun') !== '0';
  HPS.cand = q.get('cand') || '';
  /* 企业侧多候选人批量分析（来自「投递管理 / 候选人发现」的勾选） */
  HPS.cands = (q.get('cands') || '').split(',').map((x) => x.trim()).filter(Boolean);
  /* 待分析队列：单个候选人优先，其次批量名单 */
  HPS.queue = HPS.cands.length ? HPS.cands.slice() : (HPS.cand ? [HPS.cand] : []);
  HPS.qIndex = 0;
}

/* 多目标分析：不自动跳转（按需求改为用户点按钮进入结果页）。
     只播一遍完整推理作代表，其余目标在结果页里直接呈现分数与排名。
     用户可通过顶部「查看结果 →」按钮进入，也可继续留在本页看推理过程。 */
async function hpsRunBatch(queue, mode) {
  if (!queue || !queue.length) return;
  const role = mode === 'persona' ? 'persona' : 'company';
  const total = queue.length;
  setTip('正在分析 <b>' + total + '</b> 个对象…');
  await runDemo(null);
  if (DEMO_ABORT) return;
  /* 分析结束：强制把分数/分项/榜单同步到「完成态」，
     避免出现「榜单有分、分数环却是 0」的不一致。 */
  await jumpToResultInstant();
  hudScore(CURRENT.top && CURRENT.top.score);
  hudPhase('已完成', false);
  hudStep(STEPS.length, STEPS.length);
  hudTimerStop();
setTip(L10('分析完成 · 共 <b>' + total + '</b> 个 · 点右上角「查看结果」查看分数与排名', 'Analysis complete · <b>' + total + '</b> jobs · click "View result" at top right for scores and ranking'));
  /* 不自动跳转：交给用户决定何时进结果页 */
}

async function initPage() {
  HPS_BATCH_ACTIVE = false;   // 每次挂载重置，避免上一轮状态残留
  for (let i = 0; i < 5; i++) $('#rankSkel').appendChild(document.createElement('i'));
  syncFollowBtn();
  bindManualScroll();

  const sel = document.getElementById('jobSel');

  const toJob = (hit) => ({
    id: hit.jobId, title: hit.jobTitle, country: hit.country, city: hit.city,
    salary: hit.salary, employer: hit.employer
  });

  try {
    let me = await whoAmI();
    let mode = me && me.role === 'persona' ? 'persona' : 'company';
    if (!me) { await demoLogin('company'); mode = 'company'; }

    if (mode === 'company') {
      const jobs = (await api('/api/company/jobs')).jobs || [];
      if (!jobs.length) throw new Error('没有可用岗位');
      sel.innerHTML = jobs.map((j) => '<option value="' + j.id + '">' + j.title + ' · ' + j.country + '</option>').join('');

      const load = async (jobId, candId) => {
        setTip('正在计算候选人排名…');
        let { rank, top, trace } = await loadCompany(jobId);
        const job = jobs.find((j) => j.id === jobId) || jobs[0];
        const wantCand = candId || HPS.cand || (HPS.queue.length ? HPS.queue[HPS.qIndex] : '');
        if (wantCand) {
          const picked = (rank.list || []).find((x) => x.candidateId === wantCand);
          if (picked) {
            trace = await api('/api/match/trace?jobId=' + encodeURIComponent(jobId) + '&candidateId=' + encodeURIComponent(wantCand) + hpLangParam() + '&lang=' + ((window.HPI18N && window.HPI18N.lang()) || 'zh'));
            top = picked;
          }
        }
        if (!trace) throw new Error('没有候选人数据');
        applyData({ mode: 'company', job, list: rank.list, trace, top });
        rebuildAll();
        setTip('企业视角 · 候选 <b>' + rank.list.length + '</b> 人 · 最高 <b>' + (top ? top.score : '—') + '</b> 分 · 引擎 ' + (rank.engine || 'rules-v1'));
      };

      const firstJob = HPS.job && jobs.some((j) => j.id === HPS.job) ? HPS.job : jobs[0].id;
      if (HPS.job) sel.value = firstJob;
      await load(firstJob);

      /* 多候选人批量分析：不在此处播放。
         原因：initPage 被 mount await，若在这里跑完队列，
         开机动画会等到分析结束后才播（顺序反了）。
         正确顺序：initPage 只准备数据 → mount 播开机动画 → 再用 hpsRunBatch 连播。 */
      if (HPS.queue.length > 1) { HPS_BATCH_ACTIVE = true; HPS_BATCH_MODE = 'company'; }
      sel.addEventListener('change', async () => {
        try { await load(sel.value); reset(true); runConstruction(); runDemo(); }
        catch (err) { setTip('加载失败：' + err.message); }
      });
    } else {
      const rec = await api('/api/persona/recommendations');
      const cand = rec.candidate;
      let list = rec.list || [];
      if (HPS.jobs.length) {
        const picked = list.filter((x) => HPS.jobs.includes(x.jobId));
        if (picked.length) list = picked;
      }
      if (!list.length) throw new Error('没有推荐岗位');
      sel.innerHTML = list.map((x) => '<option value="' + x.jobId + '">' + x.jobTitle + ' · ' + x.country + ' · ' + x.score + L10(' 分', ' pts') + '</option>').join('');

      const load = async (jobId) => {
        setTip('正在计算岗位匹配度…');
        const { hit, trace } = await loadPersona(cand.id, jobId);
        applyData({ mode: 'persona', job: toJob(hit), list, trace, top: { ...hit, name: cand.name } });
        rebuildAll();
        setTip(L10('应聘者视角 · 推荐 <b>' + list.length + '</b> 个岗位 · 最高 <b>' + (list[0].score) + '</b> 分 · 引擎 rules-v1',
      'Candidate view · <b>' + list.length + '</b> jobs recommended · top score <b>' + (list[0].score) + '</b> · engine rules-v1'));
      };

      const firstRec = HPS.job && list.some((x) => x.jobId === HPS.job) ? HPS.job : list[0].jobId;
      if (HPS.job) sel.value = firstRec;
      await load(firstRec);

      /* 多岗位批量分析：逐个切换并播放（节奏按数量自适应） */
      if (HPS.jobs.length > 1) { HPS_BATCH_ACTIVE = true; HPS_BATCH_MODE = 'persona'; }
      initTuner(rec.candidate, CURRENT.trace && CURRENT.trace.spec);
      sel.addEventListener('change', async () => {
        try {
          await load(sel.value);
          initTuner(rec.candidate, CURRENT.trace && CURRENT.trace.spec);
          reset(true);
          runConstruction();
          runDemo();
        } catch (err) { setTip('加载失败：' + err.message); }
      });
    }

    $('#play').addEventListener('click', runDemo);
    $('#skip').addEventListener('click', jumpToEnd);
    $('#reset').addEventListener('click', () => reset(true));
    followBtn().addEventListener('click', () => { autoFollow = !autoFollow; syncFollowBtn(); });

    /* 新增按钮：进入独立排名结果页（查看分数、详情、投递/邀面试/offer） */
    (function addRankButton() {
      const acts = document.querySelector('.wrap header .actions');
      if (!acts || acts.querySelector('#toRank')) return;
      const b = document.createElement('button');
      b.className = 'btn';
      b.id = 'toRank';
      b.textContent = L10('查看结果 →','View result →');
      b.addEventListener('click', function () {
        abortDemo();
        /* 判断角色：优先看当前子应用容器，其次看 CURRENT.mode。
           注意：结果页路由是 /rank（不是 /match）。 */
        const activeId = (document.querySelector('.subapp.active') || {}).id || '';
        const isPersona = activeId.indexOf('persona') >= 0 || CURRENT.mode === 'persona';
        /* 保存现场：从结果页返回时原样还原，不重播动画 */
        saveStageSnapshot();
        /* 标记来源：结果页的返回按钮据此回到分析页 */
        window.__hpFromStage = true;
        location.hash = isPersona ? '#/persona/rank' : '#/company/rank';
      });
      acts.appendChild(b);
    })();

    runConstruction();
    /* 排版调整：把「匹配结论」从右栏移到左栏推理过程下方。
       左栏（推理 9 步）内容远多于右栏，结论移过去可平衡两侧高度。
       结构：.grid2 > .panel(推理过程) + .col(评分/排名/结论)
       （markup 是生成文件，不改源文件，这里运行时移动 DOM） */
    (function moveConcl() {
      const grid = document.querySelector('.hps .grid2');
      if (!grid || grid.dataset.conclMoved === '1') return;
      /* 左栏 = 含「推理过程」那个 .panel */
      const leftCol = [...grid.children].find((el) => {
        const h = el.querySelector('h2');
        return h && h.textContent.indexOf('推理过程') >= 0;
      });
      const concl = [...grid.querySelectorAll('.panel')].find((p) => {
        const h = p.querySelector('h2');
        return h && h.textContent.indexOf('匹配结论') >= 0;
      });
      if (!leftCol || !concl || leftCol.contains(concl)) return;
      leftCol.appendChild(concl);   // 移入左栏底部
      grid.dataset.conclMoved = '1';
    })();

    /* 开机动画由 hp-boot.js 在 mount() 中统一播放（见文件末尾），
       此处不再保留旧的 engineBoot 遮罩，避免两套动画叠加。 */
    const startWithBoot = async () => {
      if (window.HPSound) window.HPSound.cue('boot', 'DeepSeek 为您进行匹配分析中');
      await runDemo();
    };
    // 动画结束后的自动演示排程已移至 mount()，此处不再重复触发
  } catch (err) {
    setTip('初始化失败：' + err.message);
    console.error(err);
    rebuildAll();
  }
}



  async function mount(root, cfg) {
    cfg = cfg || {};
    window.__HPS_CFG = { query: cfg.query || '' };
    hpsParse(cfg.query || '');
    if (!root) return;
    document.querySelectorAll('.hps-host').forEach(function (el) {
      if (el !== root) el.innerHTML = '';
    });
    root.innerHTML = window.__HPS_MARKUP;

    // 顶部返回条（嵌在主程序里需要能回列表）
    const bar = document.createElement('div');
    bar.className = 'hps-backbar';
    bar.innerHTML = '<button class="hps-back">← 返回列表</button>' +
      '<span class="hps-backtip">分析对象：' + ((cfg.query || '').indexOf('jobs=') >= 0 ? '已选岗位' : '当前岗位/候选人') + '</span>';
    root.insertBefore(bar, root.firstChild);
    bar.querySelector('.hps-back').addEventListener('click', function () {
      abortDemo();                       // 离开页面立刻中断演示与播报（"还在响"的修复）
      if (cfg.onBack) { cfg.onBack(); return; }
      const role = (document.querySelector('.subapp.active') || {}).id || '';
      const hash = (location.hash || '').split('/');
      const who = hash[1] || 'persona';
      location.hash = '#/' + who + '/' + (who === 'persona' ? 'discover' : 'match');
    });
    currentRoot = root;

    /* 兜底：任何路由跳离分析页都要中断。
       hashchange 覆盖"点左侧菜单切走"这类不经过返回按钮的路径。 */
    var onHashAbort = function () {
      var h = location.hash || '';
      if (h.indexOf('/stage') < 0) abortDemo();
    };
    window.removeEventListener('hashchange', window.__hpsHashAbort || function () {});
    window.__hpsHashAbort = onHashAbort;
    window.addEventListener('hashchange', onHashAbort);
    /* 页面卸载（关标签/刷新）也要停语音 */
    window.removeEventListener('beforeunload', window.__hpsUnload || function () {});
    window.__hpsUnload = function () { abortDemo(); };
    window.addEventListener('beforeunload', window.__hpsUnload);

    /* ---- 开机动画 ----
       时机：initPage() 之后再播（界面与 46 个控件已就绪）。
       画面：hp-boot.js 自己挂到 document.body 并用 fixed 全屏覆盖，
             不放进舞台容器（容器 visibility 会传染导致动画隐形），
             也不修改 __HPS_MARKUP（功能键零损失）。
       开关：?skipboot=1 跳过；?fastboot=1 用精简版（约 1.3s）。 */
    var bootEnabled = window.HPBoot && QP.get('skipboot') !== '1';

    /* 从岗位详情返回：直接还原离开前的样子，不重播开机动画与推理 */
    var restore = window.__hpsRestore;
    window.__hpsRestore = null;
    if (restore && restore.html) {
      try {
        /* 先铺好基础骨架并绑定交互，再用快照覆盖内容区，
           这样既保留事件绑定，又是离开前那一刻的样子。 */
        root.innerHTML = window.__HPS_MARKUP;
        await initPage();
        mounted = true;
        const keepBar = root.querySelector('.hps-backbar');
        /* 只替换舞台主体，保留返回条 */
        root.innerHTML = restore.html;
        if (keepBar) {
          const freshBar = root.querySelector('.hps-backbar');
          if (!freshBar) root.insertBefore(keepBar, root.firstChild);
        }
        restore.bind();
        /* 恢复查询参数，保证后续操作仍用同一批岗位 */
        window.__HPS_CFG = restore.cfg || window.__HPS_CFG;
        window.__hpPickedJobs = restore.picked || null;
        RESULT_LOCKED = true;          // 还原后同样锁定，防止被动画改写
        if (restore.selected) {
          HPS_SELECTED = restore.selected;
          markSelectedRow();
        }
        runConstruction();
        jumpToResultInstant();
        return;
      } catch (e) {
        console.warn('restore failed, fallback to fresh mount', e);
      }
    }

    try {
      await initPage();
      mounted = true;
      /* 骨架已就位：按当前语言翻译静态文案 */
      if (window.HPI18N && window.HPI18N.apply) window.HPI18N.apply(root);
      TERM_LINES = STEPS.map((x, i) => 'step ' + (i + 1) + '  ' + x.t.toLowerCase().replace(/\s+/g, '_'));

      if (bootEnabled) {
        try {
          await window.HPBoot.play({
            compact: QP.get('fastboot') === '1',
            host: root          // 对准分析区：只盖住它，菜单/顶栏仍可见
          });
        } catch (e) { console.warn('boot animation skipped', e); }
      }

      // 动画结束后：蓝图构建 + 自动演示
      runConstruction();
      if (window.HPSound) window.HPSound.cue('boot', 'DeepSeek 为您进行匹配分析中');
      /* 若为批量分析（多目标队列），播放由 hpsRunBatch 接管，
         且必须在开机动画之后启动，顺序才是「动画 → 逐个推理 → 结果」。 */
      if (HPS_BATCH_ACTIVE) {
        const role = HPS_BATCH_MODE;
        const q = role === 'persona' ? HPS.jobs : HPS.queue;
        setTimeout(function () { hpsRunBatch(q, role); }, 500);
      } else {
        if (HPS.autorun) setTimeout(function () { runDemo(); }, 400);
        else if (!EMBEDDED) setTimeout(function () { runDemo(); }, 900);
        else setTimeout(function () { jumpToEnd(); }, 1200);
      }
    } catch (e) {
      console.error('stage mount', e);
      root.innerHTML = '<div style="padding:24px;color:#ffb4c0">分析页初始化失败：' + e.message + '</div>';
    }
  }

  return { mount: mount };
})();
