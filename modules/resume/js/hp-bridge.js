/* =====================================================================
 * hp-bridge.js —— 前端数据桥接层
 * 职责：
 *   1) 检测后端是否在线（同源 /api/health；file:// 打开时指向本机服务）
 *   2) 登录态（HttpOnly Cookie，file:// 场景用 Bearer）与角色引导数据注入
 *   3) 写操作：补材料（真实文件上传）、账单确认/异议、成员、工单、派单、已读
 *   4) 把 AI 面板从“关键词匹配”升级为“智能体运行时”
 * 后端不在线时全部自动降级为原来的前端演示数据，页面永远不会白屏。
 * ===================================================================== */
(function () {
  'use strict';

  var API_BASE = (function () {
    // 1) 部署配置（js/hp-config.js 或页面里直接赋值）
    if (typeof window.HP_API_BASE === 'string' && window.HP_API_BASE.trim()) {
      return window.HP_API_BASE.trim().replace(/\/+$/, '');
    }
    // 2) <meta name="hp-api-base" content="https://...">
    try {
      var meta = document.querySelector('meta[name="hp-api-base"]');
      if (meta && meta.content && meta.content.trim()) return meta.content.trim().replace(/\/+$/, '');
    } catch (e) { /* 忽略 */ }
    // 3) 本地缓存的调试地址
    try {
      var saved = localStorage.getItem('hp-api-base');
      if (saved) return saved.replace(/\/+$/, '');
    } catch (e) { /* 忽略隐私模式 */ }
    if (location.protocol === 'file:') return 'http://127.0.0.1:8787';
    return '';
  })();

  var FILE_MODE = location.protocol === 'file:';
  // 页面与 API 不同源（例如本地页面 + 云端函数）时，跨站 Cookie 会被浏览器拦截，
  // 因此改用 Bearer 令牌：登录时带 x-hp-client: file 让服务端下发 token。
  var TOKEN_MODE = (function () {
    try {
      if (!API_BASE) return false;
      var a = document.createElement('a');
      a.href = API_BASE;
      return a.host !== location.host || a.protocol !== location.protocol;
    } catch (e) { return false; }
  })();

  var state = {
    online: false,
    user: null,
    role: null,
    data: null,
    agents: [],
    provider: null,
    dataLoaded: false,
    sessionExpiresAt: null,
    permissions: [],
    notifications: [],
    unread: 0
  };

  /** file:// 下浏览器不会带上跨站 Cookie，因此用会话令牌兜底（仅内存/会话级） */
  function tokenGet() {
    if (!(FILE_MODE || TOKEN_MODE)) return null;
    try { return sessionStorage.getItem('hp-token') || localStorage.getItem('hp-token'); } catch (e) { return null; }
  }
  function tokenSet(t) {
    if (!(FILE_MODE || TOKEN_MODE)) return;
    try {
      if (t) { sessionStorage.setItem('hp-token', t); try { localStorage.setItem('hp-token', t); } catch (e) {} }
      else { sessionStorage.removeItem('hp-token'); try { localStorage.removeItem('hp-token'); } catch (e) {} }
    } catch (e) { /* ignore */ }
  }
  function roleGet() {
    try { return localStorage.getItem('hp-role') || 'persona'; } catch (e) { return 'persona'; }
  }

  function buildHeaders(extra) {
    var headers = { 'x-hp-request': '1' };
    if (FILE_MODE) headers['x-hp-client'] = 'file';
    var t = tokenGet();
    if (t) headers.authorization = 'Bearer ' + t;
    Object.keys(extra || {}).forEach(function (k) { headers[k] = extra[k]; });
    return headers;
  }

  /* 语言参数：让后端按当前语言返回数据文本（岗位名/国家名等），界面文案仍走 i18n */
  function withLang(path) {
    try {
      var L = (window.HPI18N && window.HPI18N.lang && window.HPI18N.lang()) || 'zh';
      if (!L || L === 'zh') return path;
      if (/[?&]lang=/.test(path)) return path;
      return path + (path.indexOf('?') >= 0 ? '&' : '?') + 'lang=' + encodeURIComponent(L);
    } catch (e) { return path; }
  }

  function fetchJson(path, opts) {
    opts = opts || {};
    var url = API_BASE + withLang(path);
    var base = opts.json === false ? {} : { 'content-type': 'application/json' };
    var headers = buildHeaders(Object.assign(base, opts.headers || {}));
    var ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, opts.timeout || 15000);
    return fetch(url, {
      method: opts.method || 'GET',
      headers: headers,
      credentials: 'include',
      body: opts.body ? JSON.stringify(opts.body) : undefined,
      signal: ctrl ? ctrl.signal : undefined
    }).then(function (res) {
      return res.text().then(function (text) {
        var json = null;
        try { json = text ? JSON.parse(text) : null; } catch (e) { json = null; }
        if (!res.ok) {
          var err = new Error((json && (json.message || json.error)) || ('HTTP ' + res.status));
          err.status = res.status;
          err.body = json;
          throw err;
        }
        return json;
      });
    }).finally(function () { clearTimeout(timer); });
  }

  // ---------------------------------------------------------------- 注入样式
  function injectStyle() {
    if (document.getElementById('hp-bridge-style')) return;
    var css = '' +
      '.ai-steps{margin-top:8px;font-size:11.5px;color:var(--text-3);border-top:1px dashed var(--border);padding-top:6px}' +
      '.ai-steps summary{cursor:pointer;font-weight:600;color:var(--text-2)}' +
      '.ai-steps .step{margin-top:3px;line-height:1.5}' +
      '.ai-mode{font-size:10.5px;color:var(--text-3);background:var(--surface-2);border:1px solid var(--border);padding:2px 8px;border-radius:99px;white-space:nowrap;flex:0 0 auto}' +
      '.ai-agent-select{font-size:11.5px;border:1px solid var(--border);background:var(--surface);color:var(--text-2);border-radius:8px;padding:3px 6px;max-width:96px;flex:0 0 auto}' +
      '.hp-offline-tag{font-size:11px;color:var(--text-3);background:var(--surface-2);border:1px dashed var(--border-strong);border-radius:99px;padding:3px 10px;white-space:nowrap}' +
      '.hp-online-tag{font-size:11px;color:var(--success);background:var(--success-weak);border:1px solid color-mix(in srgb, var(--success) 30%, transparent);border-radius:99px;padding:3px 10px;white-space:nowrap}' +
      '.chart-empty{display:flex;align-items:center;justify-content:center;height:100%;color:var(--text-3);font-size:12.5px;text-align:center;padding:12px}' +
      '.hp-source{display:block;margin-top:6px;font-size:11px;color:var(--text-3)}';
    var el = document.createElement('style');
    el.id = 'hp-bridge-style';
    el.textContent = css;
    document.head.appendChild(el);
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function toast(title, msg) {
    if (window.HP && window.HP.toast) window.HP.toast(title, msg);
    else console.log('[toast]', title, msg);
  }

  // ---------------------------------------------------------------- 登录
  function afterLogin(r) {
    if (r && r.token) tokenSet(r.token);
    state.user = r && r.user;
    state.role = r && r.user && r.user.role;
    state.canSwitchRoles = !!(r && r.user && r.user.canSwitchRoles);
    state.sessionExpiresAt = r && r.expiresAt;
    try {
      if (state.role) localStorage.setItem('hp-role', state.role);
      sessionStorage.setItem('hp-logged', '1');
    } catch (e) { /* ignore */ }
    return boot().then(function () { return r; });
  }

  /** 演示快捷登录（服务端 HP_ALLOW_DEMO_LOGIN=0 时会被拒绝） */
  /** 远程模式登录时，提示服务端下发 Bearer 令牌 */
  function authTokenHint() {
    return TOKEN_MODE ? { 'x-hp-client': 'file' } : null;
  }

  /**
   * 演示登录
   * @param {string} role     角色（persona / company / assurance）
   * @param {object} [opts]   { accountId } 指定演示账号，不传则按角色取默认账号
   */
  function login(role, opts) {
    if (!state.online) return Promise.resolve({ offline: true });
    var body = { role: role };
    if (opts && opts.accountId) body.accountId = opts.accountId;
    return fetchJson('/api/auth/demo', { method: 'POST', body: body, headers: authTokenHint() }).then(afterLogin);
  }

  /** 演示账号列表（带实时概况），登录页用 */
  function demoAccounts() {
    return fetchJson('/api/auth/demo-accounts', { method: 'GET' }).catch(function () { return { accounts: [] }; });
  }

  /** 手机号 + 密码登录 */
  function loginPassword(phone, password) {
    if (!state.online) return Promise.reject(new Error('后端未连接'));
    return fetchJson('/api/auth/login', { method: 'POST', body: { phone: phone, password: password }, headers: authTokenHint() }).then(afterLogin);
  }

  /** 发送短信验证码（开发环境直接返回验证码） */
  function requestCode(phone) {
    if (!state.online) return Promise.reject(new Error('后端未连接'));
    return fetchJson('/api/auth/code', { method: 'POST', body: { phone: phone } });
  }

  /** 验证码登录 */
  function loginCode(phone, code) {
    if (!state.online) return Promise.reject(new Error('后端未连接'));
    return fetchJson('/api/auth/login-code', { method: 'POST', body: { phone: phone, code: code }, headers: authTokenHint() }).then(afterLogin);
  }

  function session() {
    if (!state.online) return Promise.resolve(null);
    return fetchJson('/api/auth/session').catch(function () { return null; });
  }

  function logout() {
    var done = function () {
      tokenSet(null);
      state.data = null;
      state.dataLoaded = false;
      state.user = null;
      try { sessionStorage.removeItem('hp-logged'); } catch (e) { /* ignore */ }
      location.href = 'login.html';
    };
    if (!state.online) return done();
    return fetchJson('/api/auth/logout', { method: 'POST', body: {} }).then(done, done);
  }

  // ---------------------------------------------------------------- 引导数据
  function mappedContract(c) {
    var cl = c.clauses || {};
    var parts = [];
    if (cl.payMin) parts.push('薪资 ' + cl.payMin.toLocaleString() + '-' + cl.payMax.toLocaleString() + ' ' + cl.currency + '/月');
    if (cl.weeklyHours) parts.push('工时 ' + cl.weeklyHours + 'h/周');
    if (cl.insurance) parts.push(cl.insurance);
    if (cl.noticeDays) parts.push('解约提前 ' + cl.noticeDays + ' 天');
    return {
      id: c.id,
      name: c.name,
      party: c.party,
      status: c.status === 'signed' ? '已签署' : (c.status || '待签署'),
      cls: c.status === 'signed' ? 'chip-s' : 'chip-w',
      summary: parts.join(' · '),
      clauses: cl
    };
  }

  function hydratePersona(demo, p) {
    if (!demo || !p) return;
    demo.me = p.me || demo.me;
    demo.application = p.application || demo.application;
    demo.history = p.history || demo.history;
    demo.contracts = (p.contracts || []).map(mappedContract);
    demo.licenses = p.licenses || demo.licenses;
    demo.risks = p.risks || demo.risks;
    demo.emergency = p.emergency || demo.emergency;
    demo.training = p.training || demo.training;
    demo.salaryDetail = p.salaryDetail || demo.salaryDetail;
    demo.salaryHistory = p.salaryHistory || demo.salaryHistory;
    demo.kb = p.kb || demo.kb;
    demo.msgs = p.msgs || demo.msgs;
    demo.profileDocs = p.profileDocs || demo.profileDocs;
    demo.todos = p.todos || demo.todos;
    demo.profile = p.profile || demo.profile;
    demo.audit = p.audit || null;
    demo.fundRequests = p.fundRequests || [];
    demo.applications = p.applications || [];
    demo.jobs = p.jobs || [];
    // 已读状态回灌到前端原有的 localStorage 口径
    try {
      var read = {};
      (p.msgs || []).forEach(function (m) { if (m.read) read[m.t] = 1; });
      localStorage.setItem('hp-persona-read', JSON.stringify(read));
    } catch (e) { /* ignore */ }
    // 待办勾选状态同步（前端用标题数组记录已完成）
    try {
      var done = (p.todos || []).filter(function (t) { return t.done; }).map(function (t) { return t.title; });
      localStorage.setItem('hp-persona-todos', JSON.stringify(done));
    } catch (e) { /* ignore */ }
  }

  function hydrateCompany(demo, c) {
    if (!demo || !c) return;
    if (c.me) demo.me = c.me;
    demo.projects = c.projects || demo.projects;
    demo.bills = c.bills || demo.bills;
    demo.services = c.services || demo.services;
    demo.kb = c.kb || demo.kb;
    demo.msgs = c.msgs || demo.msgs;
    demo.members = c.members || demo.members;
    demo.settle = c.settle || demo.settle;
    demo.jobRequests = c.jobRequests || [];
    try {
      var read = {};
      (c.msgs || []).forEach(function (m) { if (m.read) read[m.t] = 1; });
      localStorage.setItem('hp-company-read', JSON.stringify(read));
    } catch (e) { /* ignore */ }
  }

  function applyHydration() {
    var d = state.data;
    if (!d) return;
    var S = window.SubApps || {};
    if (d.persona && S.persona) hydratePersona(S.persona.DEMO, d.persona);
    if (d.company && S.company) hydrateCompany(S.company.DEMO, d.company);
    state.agents = d.agents || [];
    state.provider = d.provider || null;
    state.role = d.role || state.role;
    state.permissions = Array.isArray(d.permissions) ? d.permissions : [];
    state.notifications = Array.isArray(d.notifications) ? d.notifications : [];
    state.unread = Number(d.unread || 0);
    if (d.user) state.user = d.user;
    state.dataLoaded = true;
    window.HP_DATA = d;
    fillAgentSelect();
    markModeTag();
    updateBell();
  }

  function boot() {
    if (!state.online) return Promise.resolve(null);
    var L = 'zh';
    try {
      L = (window.HPI18N && window.HPI18N.lang && window.HPI18N.lang()) ||
          localStorage.getItem('hp-lang') || 'zh';
    } catch (e) {}
    return fetchJson('/api/bootstrap?lang=' + encodeURIComponent(L)).then(function (data) {
      state.data = data;
      if (data && data.user) state.user = data.user;
      state.canSwitchRoles = !!(data && data.canSwitchRoles);
      applyHydration();
      try { document.dispatchEvent(new CustomEvent('hp:boot')); } catch (e) { /* 老浏览器忽略 */ }
      return data;
    }).catch(function (err) {
      if (err.status === 401) {
        tokenSet(null);
        state.data = null;
        state.dataLoaded = false;
        try { sessionStorage.removeItem('hp-logged'); } catch (e) { /* ignore */ }
        var mask = document.getElementById('loginMask');
        if (mask) mask.classList.remove('hide');
      }
      return null;
    });
  }

  // ---------------------------------------------------------------- AI 面板
  function fillAgentSelect() {
    var sel = document.getElementById('aiAgent');
    if (!sel) return;
    var list = state.agents.length ? state.agents : [{ id: 'advisor', name: '出海顾问' }];
    var prev = sel.value;
    sel.innerHTML = list.map(function (a) {
      return '<option value="' + esc(a.id) + '">' + esc(a.name) + '</option>';
    }).join('');
    if (prev && list.some(function (a) { return a.id === prev; })) sel.value = prev;
    else sel.value = list[0].id;
    sel.title = list.map(function (a) { return a.name + '：' + a.desc; }).join('\n\n');
  }

  function markModeTag() {
    var tag = document.getElementById('aiMode');
    if (!tag) return;
    if (!state.online) {
      tag.textContent = '离线演示 · 内置问答';
      tag.title = '未检测到后端服务，AI 面板使用内置知识库';
      return;
    }
    var p = state.provider;
    tag.textContent = p && p.mode === 'llm' ? ('大模型 · ' + (p.model || '在线')) : '智能体 · 规则引擎';
    tag.title = p ? (p.label || '') + (p.endpoint ? ('\n' + p.endpoint) : '') : '';
  }

  function currentAgent() {
    var sel = document.getElementById('aiAgent');
    return (sel && sel.value) || 'advisor';
  }

  function buildAnswerHtml(r) {
    var html = esc(r.answer).replace(/\n/g, '<br>');
    if (r.needsReview) {
      var labels = (r.riskTriggers || []).map(function (t) { return t.label; }).join('、');
      html += '<div class="ai-steps" style="border:1px solid color-mix(in srgb, var(--warning) 40%, transparent);background:var(--warning-weak);color:var(--warning);padding:8px 10px;border-radius:8px;margin-top:8px">' +
        '⚠ 本回答已进入人工复核队列（' + (labels || (r.riskLevel === 'high' ? '高风险内容' : '随机抽检')) +
        '）。签证/税务/法律类结论请以顾问书面确认为准。</div>';
    }
    if (r.degradedReason) {
      html += '<div class="ai-steps">' + esc(r.degradedReason) + '</div>';
    }
    if (r.steps && r.steps.length) {
      html += '<details class="ai-steps"><summary>执行过程 · ' + r.steps.length + ' 步</summary>' +
        r.steps.map(function (s) {
          return '<div class="step">· ' + esc(s.tool || s.type) + '：' + esc(s.summary || '') + '</div>';
        }).join('') + '</details>';
    }
    if (r.tookMs) {
      html += '<div class="ai-steps" style="border:none;padding-top:2px">耗时 ' + r.tookMs + 'ms · ' +
        (r.mode === 'llm' ? '大模型' : r.mode === 'rules-fallback' ? '规则引擎（大模型回退）' : '规则引擎') +
        (r.agent && r.agent.version ? ' · v' + r.agent.version : '') +
        (r.quota ? ' · 今日 ' + r.quota.used + '/' + r.quota.limit : '') + '</div>';
    }
    return html;
  }

  function sourceLabel(r) {
    if (r.citations && r.citations.length) {
      return r.citations.map(function (c) { return c.id + '《' + c.title + '》'; }).join('、');
    }
    return r.agent ? ('智能体：' + r.agent.name) : '平台业务数据';
  }

  function ask(question, agentId) {
    if (!state.online) return Promise.reject(new Error('offline'));
    return fetchJson('/api/agents/' + encodeURIComponent(agentId || currentAgent()) + '/run', {
      method: 'POST',
      body: { input: question }
    }).then(function (r) {
      return {
        answer: r.answer,
        html: buildAnswerHtml(r),
        source: sourceLabel(r),
        citations: r.citations || [],
        steps: r.steps || [],
        mode: r.mode,
        needsReview: !!r.needsReview,
        riskLevel: r.riskLevel || 'normal',
        riskTriggers: r.riskTriggers || [],
        reviewId: r.reviewId || null,
        quota: r.quota || null,
        raw: r
      };
    });
  }

  // ---------------------------------------------------------------- 通知中心
  function updateBell() {
    var btn = document.getElementById('bellBtn');
    if (!btn) return;
    var dot = btn.querySelector('.dot');
    if (dot) dot.style.display = state.unread > 0 ? 'block' : 'none';
    btn.title = state.unread > 0 ? ('通知（' + state.unread + ' 条未读）') : '通知';
  }

  function refreshNotifications() {
    if (!state.online) return Promise.resolve(null);
    return fetchJson('/api/notifications').then(function (d) {
      state.notifications = (d && d.items) || [];
      state.unread = Number((d && d.unread) || 0);
      updateBell();
      return d;
    }).catch(function () { return null; });
  }

  function noticeTime(iso) {
    if (!iso) return '';
    var d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-').slice(5);
  }

  function notificationRow(n) {
    var color = n.level === 'danger' ? 'var(--danger)'
      : n.level === 'warning' ? 'var(--warning)'
        : n.level === 'success' ? 'var(--success)' : 'var(--text-2)';
    return '<div class="row" style="cursor:pointer;align-items:flex-start" data-nt="' + esc(n.id) + '" data-link="' + esc(n.link || '') + '">' +
      '<div class="r-main"><div class="r-title" style="color:' + color + '">' + esc(n.title) +
      (n.read ? '' : ' <span class="chip chip-d" style="margin-left:4px">未读</span>') + '</div>' +
      '<div class="r-sub">' + esc(n.body) + '</div></div>' +
      '<div class="t-muted" style="font-size:11px;flex:0 0 auto">' + esc(noticeTime(n.at)) + '</div></div>';
  }

  function openNotifications() {
    if (!state.online) { toast('未连接后端', '离线模式没有站内通知'); return; }
    refreshNotifications().then(function () {
      var items = state.notifications || [];
      var body = items.length
        ? items.map(notificationRow).join('')
        : '<div class="t-muted" style="padding:18px;text-align:center">暂无通知 —— 材料齐套、账单异议、复核结果会推到这里</div>';
      var close = window.HP.modal({
        title: '通知' + (state.unread ? '（' + state.unread + ' 条未读）' : ''),
        body: '<div style="max-height:420px;overflow:auto">' + body + '</div>',
        actions: [
          {
            text: '全部已读',
            onClick: function () {
              call('/api/notifications/read-all', 'POST', {}).then(function () {
                close();
                refreshNotifications().then(function () { toast('已全部标记已读', ''); });
              });
            }
          },
          { text: '关闭', primary: true }
        ]
      });
      var wrap = document.querySelector('.hp-modal-body');
      if (wrap) {
        Array.prototype.forEach.call(wrap.querySelectorAll('[data-nt]'), function (row) {
          row.addEventListener('click', function () {
            call('/api/notifications/' + encodeURIComponent(row.dataset.nt) + '/read', 'POST', {}).then(function () {
              row.style.opacity = '.6';
              var link = row.dataset.link;
              refreshNotifications();
              if (link) {
                close();
                location.hash = link.replace(/^#/, '');
              }
            });
          });
        });
      }
    });
  }

  // ---------------------------------------------------------------- 写操作
  function call(path, method, body) {
    if (!state.online) return Promise.resolve({ offline: true });
    return fetchJson(path, { method: method || 'POST', body: body });
  }

  var api = {
    agentsRuns: function () { return call('/api/agents/runs', 'GET'); },
    probe: function () { return call('/api/agents/probe', 'POST', {}); },
    session: session,
    me: function () { return call('/api/me', 'GET'); },
    permissions: function () { return call('/api/me/permissions', 'GET'); },
    notifications: {
      list: function () { return call('/api/notifications', 'GET'); },
      read: function (id) { return call('/api/notifications/' + encodeURIComponent(id) + '/read', 'POST', {}); },
      readAll: function () { return call('/api/notifications/read-all', 'POST', {}); }
    },
    persona: {
      todoComplete: function (id, payload) { return call('/api/persona/todos/' + encodeURIComponent(id) + '/complete', 'POST', payload || {}); },
      /** 真实文件上传：原始二进制 + 进度回调 */
      uploadDocument: function (docId, file, onProgress) { return uploadFile(docId, file, onProgress); },
      deleteDocument: function (docId) { return call('/api/persona/documents/' + encodeURIComponent(docId) + '/file', 'DELETE'); },
      documentUrl: function (docId, download) {
        return API_BASE + '/api/persona/documents/' + encodeURIComponent(docId) + '/file' + (download ? '?download=1' : '');
      },
      withdraw: function () { return call('/api/persona/application/withdraw', 'POST', {}); },
      saveProfile: function (patch) { return call('/api/persona/profile', 'PATCH', patch || {}); },
      messageRead: function (id) { return call('/api/persona/messages/' + encodeURIComponent(id) + '/read', 'POST', {}); },
      fundApply: function (payload) { return call('/api/persona/fund-requests', 'POST', payload || {}); },
      fundRequests: function () { return call('/api/persona/fund-requests', 'GET'); },
      jobs: function (q, country) {
        var qs = [];
        if (q) qs.push('q=' + encodeURIComponent(q));
        if (country) qs.push('country=' + encodeURIComponent(country));
        return call('/api/jobs' + (qs.length ? ('?' + qs.join('&')) : ''), 'GET');
      },
      applyJob: function (jobId) { return call('/api/persona/jobs/' + encodeURIComponent(jobId) + '/apply', 'POST', {}); },
      withdrawJob: function () { return call('/api/persona/application/withdraw', 'POST', {}); },
      recommendations: function () { return call('/api/persona/recommendations', 'GET'); },
      weights: function () { return call('/api/persona/weights', 'GET'); },
      saveWeights: function (payload) { return call('/api/persona/weights', 'PUT', payload || {}); },
      discover: function () { return call('/api/persona/discover', 'GET'); },
      favorites: function () { return call('/api/persona/favorites', 'GET'); },
      addFavorite: function (id) { return call('/api/persona/favorites/' + encodeURIComponent(id), 'POST', {}); },
      removeFavorite: function (id) { return call('/api/persona/favorites/' + encodeURIComponent(id), 'DELETE'); },
      precheck: function (id) { return call('/api/persona/jobs/' + encodeURIComponent(id) + '/precheck', 'GET'); },
      batchApply: function (payload) { return call('/api/persona/jobs/batch-apply', 'POST', payload || {}); },
      compare: function (payload) { return call('/api/persona/jobs/compare', 'POST', payload || {}); },
      offers: function () { return call('/api/persona/offers', 'GET'); },
      acceptOffer: function (id) { return call('/api/persona/offers/' + encodeURIComponent(id) + '/accept', 'POST', {}); },
      declineOffer: function (id) { return call('/api/persona/offers/' + encodeURIComponent(id) + '/decline', 'POST', {}); },
      matchTrace: function (jobId, candidateId) {
        return call('/api/match/trace?jobId=' + encodeURIComponent(jobId) + '&candidateId=' + encodeURIComponent(candidateId), 'GET');
      }
    },
    company: {
      billAction: function (id, action, note) { return call('/api/company/bills/' + encodeURIComponent(id) + '/' + (action === 'dispute' ? 'dispute' : 'confirm'), 'POST', { note: note || '' }); },
      createProject: function (payload) { return call('/api/company/projects', 'POST', payload || {}); },
      memberAdd: function (payload) { return call('/api/company/members', 'POST', payload || {}); },
      memberUpdate: function (id, patch) { return call('/api/company/members/' + encodeURIComponent(id), 'PATCH', patch || {}); },
      jobRequest: function (payload) { return call('/api/company/job-requests', 'POST', payload || {}); },
      serviceOrder: function (id) { return call('/api/company/services/' + encodeURIComponent(id) + '/order', 'POST', {}); },
      messageRead: function (id) { return call('/api/company/messages/' + encodeURIComponent(id) + '/read', 'POST', {}); },
      approvals: function (status) {
        return call('/api/company/approvals' + (status ? ('?status=' + encodeURIComponent(status)) : ''), 'GET');
      },
      requestApproval: function (payload) { return call('/api/company/approvals', 'POST', payload || {}); },
      decideApproval: function (id, action, note) {
        return call('/api/company/approvals/' + encodeURIComponent(id) + '/decide', 'POST', { action: action, note: note || '' });
      },
      bills: function () { return call('/api/company/bills', 'GET'); },
      report: function () { return call('/api/reports/monthly', 'GET'); },
      jobs: function () { return call('/api/company/jobs', 'GET'); },
      jobCandidates: function (jobId) { return call('/api/company/jobs/' + encodeURIComponent(jobId) + '/candidates', 'GET'); },
      jobMatch: function (jobId) { return call('/api/company/jobs/' + encodeURIComponent(jobId) + '/match', 'POST', {}); },
      matchTrace: function (jobId, candidateId) {
        return call('/api/match/trace?jobId=' + encodeURIComponent(jobId) + '&candidateId=' + encodeURIComponent(candidateId), 'GET');
      },
      resumes: function (q) { return call('/api/company/resumes' + (q ? '?q=' + encodeURIComponent(q) : ''), 'GET'); },
      resume: function (id) { return call('/api/company/resumes/' + encodeURIComponent(id), 'GET'); },
      weights: function () { return call('/api/company/weights', 'GET'); },
      saveWeights: function (payload) { return call('/api/company/weights', 'PUT', payload || {}); },
      invite: function (id, payload) { return call('/api/company/candidates/' + encodeURIComponent(id) + '/interview', 'POST', payload || {}); },
      createOffer: function (jobId, payload) { return call('/api/company/jobs/' + encodeURIComponent(jobId) + '/offers', 'POST', payload || {}); },
      offers: function () { return call('/api/company/offers', 'GET'); },
      funnel: function (jobId) { return call('/api/company/jobs/' + encodeURIComponent(jobId) + '/funnel', 'GET'); }
    },
    assurance: {
      dispatchRisk: function (id, payload) { return call('/api/assurance/risks/' + encodeURIComponent(id) + '/dispatch', 'POST', payload || {}); },
      createTicket: function (payload) { return call('/api/assurance/tickets', 'POST', payload || {}); },
      assignTicket: function (id, assignee) { return call('/api/assurance/tickets/' + encodeURIComponent(id) + '/assign', 'POST', { assignee: assignee }); },
      closeTicket: function (id, resolution) { return call('/api/assurance/tickets/' + encodeURIComponent(id) + '/close', 'POST', { resolution: resolution }); },
      riskScan: function () { return call('/api/assurance/risk-scan', 'GET'); },
      audit: function (projectId) { return call('/api/assurance/audit' + (projectId ? ('?projectId=' + encodeURIComponent(projectId)) : ''), 'GET'); },
      personaDocuments: function (personaId) { return call('/api/assurance/personas/' + encodeURIComponent(personaId) + '/documents', 'GET'); },
      auditLog: function (limit, q) {
        var qs = '?limit=' + (limit || 200) + (q ? ('&q=' + encodeURIComponent(q)) : '');
        return call('/api/audit-log' + qs, 'GET');
      },
      governance: function () { return call('/api/assurance/governance', 'GET'); },
      fundRequests: function (status) {
        return call('/api/assurance/fund-requests' + (status ? ('?status=' + encodeURIComponent(status)) : ''), 'GET');
      },
      decideFund: function (id, action, note) {
        return call('/api/assurance/fund-requests/' + encodeURIComponent(id) + '/decide', 'POST', { action: action, note: note || '' });
      },
      reviewAction: function (id, action, note) {
        return call('/api/assurance/governance/reviews/' + encodeURIComponent(id), 'POST', { action: action, note: note || '' });
      },
      setAgentEnabled: function (id, enabled) {
        return call('/api/assurance/governance/agents/' + encodeURIComponent(id), 'POST', { enabled: !!enabled });
      },
      updatePolicy: function (patch) { return call('/api/assurance/governance/policy', 'PATCH', patch || {}); },
      documentUrl: function (personaId, docId) {
        return API_BASE + '/api/assurance/documents/file?personaId=' + encodeURIComponent(personaId) + '&docId=' + encodeURIComponent(docId);
      }
    }
  };

  /** 用 XHR 上传原始文件（fetch 拿不到上传进度） */
  function uploadFile(docId, file, onProgress) {
    if (!state.online) return Promise.reject(new Error('后端未连接'));
    if (!file) return Promise.reject(new Error('未选择文件'));
    if (file.size > 10 * 1024 * 1024) return Promise.reject(new Error('文件需 ≤ 10MB'));
    return new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open('POST', API_BASE + '/api/persona/documents/' + encodeURIComponent(docId) + '/upload');
      xhr.withCredentials = true;
      xhr.setRequestHeader('x-hp-request', '1');
      xhr.setRequestHeader('content-type', file.type || 'application/octet-stream');
      xhr.setRequestHeader('x-file-name', encodeURIComponent(file.name || 'document'));
      if (FILE_MODE) {
        xhr.setRequestHeader('x-hp-client', 'file');
        var t = tokenGet();
        if (t) xhr.setRequestHeader('authorization', 'Bearer ' + t);
      }
      if (xhr.upload && onProgress) {
        xhr.upload.onprogress = function (e) {
          if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
        };
      }
      xhr.onload = function () {
        var body = null;
        try { body = JSON.parse(xhr.responseText || 'null'); } catch (e) { body = null; }
        if (xhr.status >= 200 && xhr.status < 300) return resolve(body);
        var err = new Error((body && (body.message || body.error)) || ('上传失败 HTTP ' + xhr.status));
        err.status = xhr.status;
        err.body = body;
        reject(err);
      };
      xhr.onerror = function () { reject(new Error('网络错误，上传失败')); };
      xhr.send(file);
    });
  }

  // ---------------------------------------------------------------- 概览数字刷新
  function num(n, unit) {
    return n + ' <small>' + unit + '</small>';
  }

  function refreshKpis() {
    var d = state.data;
    if (!d) return;
    var host = document.getElementById('app-' + (d.role || ''));
    if (!host) return;
    // 在线时把“演示数据”角标换成实时数据标识
    if (state.online) {
      var tags = document.querySelectorAll('.demo-tag');
      Array.prototype.forEach.call(tags, function (t) {
        if (t.textContent.indexOf('实时') < 0) {
          t.textContent = '实时数据 · 已接入后端';
          t.style.color = 'var(--success)';
          t.style.background = 'var(--success-weak)';
        }
      });
    }
    var views = host.querySelectorAll('.view');
    var kpiOf = function (viewName) {
      var view = host.querySelector('.view[data-view="' + viewName + '"]');
      return view ? view.querySelectorAll('.kpi') : null;
    };
    var setNum = function (kpi, html) {
      if (!kpi) return;
      var el = kpi.querySelector('.k-num');
      if (el) el.innerHTML = html;
    };
    var setFoot = function (kpi, text) {
      if (!kpi) return;
      var el = kpi.querySelector('.k-foot');
      if (el && text) el.textContent = text;
    };

    if (d.role === 'persona' && d.persona) {
      var p = d.persona;
      var k = kpiOf('overview');
      var a = p.application || {};
      var openTodos = (p.todos || []).filter(function (t) { return !t.done; });
      var days = null;
      if (a.departTarget) {
        var t = new Date(a.departTarget + 'T00:00:00');
        if (!isNaN(t.getTime())) days = Math.ceil((t - new Date()) / 86400000);
      }
      if (k) {
        setNum(k[0], num(a.withdrawn ? 0 : 1, '个'));
        setNum(k[1], num(a.progress || 0, '%'));
        setNum(k[2], num(openTodos.length, '项'));
        setNum(k[3], days === null ? '—' : (days > 0 ? days + ' <small>天</small>' : '—'));
        setFoot(k[0], (a.country || '') + ' · ' + (a.role || ''));
        setFoot(k[1], '当前环节：' + (a.stage || '—'));
        setFoot(k[2], openTodos.length ? openTodos.map(function (t) { return t.title.replace('补交', ''); }).join('、') : '材料已齐套');
        setFoot(k[3], '目标 ' + (a.departTarget || '—') + ' · 以签证为准');
      }
      var greet = host.querySelector('#greetLine') || document.getElementById('greetLine');
      if (greet) {
        var h = new Date().getHours();
        var g = h < 6 ? '凌晨好' : h < 12 ? '上午好' : h < 14 ? '中午好' : h < 18 ? '下午好' : '晚上好';
        greet.textContent = g + '，' + (p.me && p.me.name ? p.me.name : '你') + '。' +
          (a.withdrawn ? '当前申请已撤回，可重新投递。' : '你的「' + a.project + '」已进入【' + a.stage + '】环节，' +
            (openTodos.length ? '还有 ' + openTodos.length + ' 项待办。' : '当前待办已全部完成。'));
      }
    }

    if (d.role === 'company' && d.company) {
      var c = d.company;
      var kc = kpiOf('overview');
      var pending = (c.bills || []).filter(function (b) { return b.status === '待确认'; });
      var amount = pending.reduce(function (s, b) { return s + (b.declaredAmount || 0); }, 0);
      if (kc) {
        setNum(kc[0], num((c.projects || []).length, '个'));
        var cn = 0, local = 0;
        (c.projects || []).forEach(function (proj) {
          cn += (proj.headcount && proj.headcount.cn) || 0;
          local += (proj.headcount && proj.headcount.local) || 0;
        });
        setNum(kc[1], num(cn, '人'));
        setNum(kc[2], num(local, '人'));
        if (state.permissions.indexOf('bill.view') >= 0) {
          setNum(kc[3], '¥' + (amount / 10000).toFixed(1) + ' <small>万</small>');
          setFoot(kc[3], pending.length + ' 笔账单待确认');
        } else {
          setNum(kc[3], '—');
          setFoot(kc[3], '当前账号无账单查看权限');
        }
        setFoot(kc[1], (c.projects || []).length + ' 个项目在册');
      }
      var greetC = host.querySelector('#greetLine') || document.getElementById('greetLine');
      if (greetC) {
        var h2 = new Date().getHours();
        var g2 = h2 < 6 ? '凌晨好' : h2 < 12 ? '上午好' : h2 < 14 ? '中午好' : h2 < 18 ? '下午好' : '晚上好';
        var meName = (c.me && c.me.name) || '企业成员';
        var meRole = (c.me && c.me.memberRole) ? '（' + c.me.memberRole + '）' : '';
        var billLine = state.permissions.indexOf('bill.view') >= 0
          ? ('今日有 ' + pending.length + ' 笔账单待确认，')
          : '当前账号仅可查看项目与需求，';
        greetC.textContent = g2 + '，' + meName + meRole + '。' + billLine + ((c.projects || []).length) + ' 个项目在办。';
      }
    }

    if (d.role === 'assurance' && d.assurance) {
      // 保障部的列表来自后端渲染，挂载完成后重绘一次以套用实时数据
      var S = window.SubApps || {};
      if (S.assurance && S.assurance.rerender) {
        try { S.assurance.rerender(); } catch (e) { /* ignore */ }
      }
      var ka = kpiOf('board');
      var a2 = d.assurance;
      if (ka) {
        var openTickets = (a2.tickets || []).filter(function (t) { return t.status !== '已闭环'; }).length;
        var pendingRisk = (a2.risks || []).filter(function (r) { return r.status === '待处理'; }).length;
        setNum(ka[2], num((a2.stats && a2.stats.passRate) === 100 ? 0 : 1, '份'));
        setNum(ka[3], num(openTickets, '起'));
        var foot = ka[3] && ka[3].querySelector('.k-foot');
        if (foot) foot.textContent = pendingRisk + ' 条风险待处置';
      }
    }
  }

  /** 图表库缺失时的兜底提示（离线环境 CDN 可能不可达） */
  function patchCharts() {
    if (typeof window.echarts !== 'undefined') return;
    if (window.HPCharts) return; // 已启用本地 SVG 兜底
    var ids = ['chartHealth', 'chartPeople', 'chartBill', 'chartTrend'];
    setTimeout(function () {
      ids.forEach(function (id) {
        var el = document.getElementById(id);
        if (el && !el.dataset.hpFilled && !el.querySelector('svg')) {
          el.dataset.hpFilled = '1';
          el.innerHTML = '<div class="chart-empty">图表库未加载。业务数据不受影响。</div>';
        }
      });
    }, 2500);
  }

  // ---------------------------------------------------------------- 启动
  function health() {
    return fetchJson('/api/health', { auth: false, timeout: 15000 })
      .then(function (r) { return !!(r && r.ok); })
      .catch(function () { return false; });
  }

  var ready = health().then(function (online) {
    state.online = online;
    injectStyle();
    if (!online) {
      markModeTag();
      fillAgentSelect();
      showBadge('offline');
      return null;
    }
    showBadge('online');
    // 有 Cookie（或 file:// 下的令牌）就直接尝试拉工作区；401 会自动回到登录遮罩
    return boot();
  });

  function showBadge(kind) {
    var old = document.getElementById('hp-conn-badge');
    if (old) old.remove();
    var el = document.createElement('div');
    el.id = 'hp-conn-badge';
    el.className = kind === 'online' ? 'hp-online-tag' : 'hp-offline-tag';
    el.textContent = kind === 'online' ? '● 已连接后端 · 实时数据' : '○ 离线演示模式 · 数据仅存本地';
    el.title = kind === 'online'
      ? '当前页面数据来自 ' + (API_BASE || location.origin) + ' 的后端接口'
      : '未检测到后端（' + (API_BASE || location.origin) + '）。启动方式：node server/index.mjs';
    var topbar = document.querySelector('.topbar');
    if (topbar) {
      var spacer = topbar.querySelector('.spacer');
      if (spacer) topbar.insertBefore(el, spacer.nextSibling);
      else topbar.appendChild(el);
      el.style.marginRight = '4px';
    } else {
      // 登录页 / 运行台没有 topbar，避免和底部信息重叠，直接不显示（页面本身已有状态提示）
      return;
    }
  }

  // 页面挂载完成后刷新概览数字
  document.addEventListener('DOMContentLoaded', function () {
    setTimeout(refreshKpis, 260);
    setTimeout(patchCharts, 400);
  });
  window.addEventListener('hashchange', function () { setTimeout(refreshKpis, 300); });

  window.HP_READY = ready;
  window.HPBridge = {
    API_BASE: API_BASE,
    fileMode: FILE_MODE,
    state: state,
    isOnline: function () { return state.online; },
    reconnect: function () {
      return health().then(function (online) {
        state.online = online;
        if (!online) throw new Error('云服务暂时未连接，请稍后重试');
        return true;
      });
    },
    isAuthed: function () { return !!state.data; },
    getUser: function () { return state.user; },
    /** 三端分离：只有演示账号能在三端之间切换
     *  注意：不能把「后端还没探测完」当成离线放行，否则页面首帧会闪出切换条 */
    canSwitchRoles: function () {
      if (FILE_MODE) return true;          // file:// 纯前端演示，没有后端可拦
      if (!state.online) return false;     // 在线模式尚未 boot 完成 → 先不给切
      if (state.canSwitchRoles) return true;
      return !!(state.user && state.user.canSwitchRoles);
    },
    /** 权限门禁：后端会再次校验，这里只负责把没权限的按钮提前藏掉 */
    can: function (perm) {
      if (!state.online) return true; // 离线演示不做门禁
      return state.permissions.indexOf(perm) >= 0;
    },
    permissions: function () { return state.permissions.slice(); },
    session: session,
    login: login,
    demoAccounts: demoAccounts,
    loginPassword: loginPassword,
    loginCode: loginCode,
    requestCode: requestCode,
    logout: logout,
    boot: boot,
    api: api,
    refreshKpis: refreshKpis,
    refreshNotifications: refreshNotifications,
    openNotifications: openNotifications,
    getNotifications: function () { return state.notifications.slice(); },
    getUnread: function () { return state.unread; },
    getData: function () { return state.data; },
    getRole: roleGet,
    agents: function () { return state.agents; },
    /** 让企业服务台等入口直接唤起某个智能体 */
    openAgent: function (agentId, seedQuestion) {
      var panel = document.getElementById('aiPanel');
      var sel = document.getElementById('aiAgent');
      if (panel) panel.classList.add('open');
      if (sel && agentId) {
        var has = Array.prototype.some.call(sel.options, function (o) { return o.value === agentId; });
        if (has) sel.value = agentId;
      }
      if (seedQuestion && window.HPAgent) {
        var input = document.getElementById('aiInput');
        if (input) { input.value = seedQuestion; input.focus(); }
      }
    }
  };

  window.HPAgent = {
    ask: ask,
    run: ask,
    list: function () { return state.agents; },
    mode: function () { return state.provider ? state.provider.mode : 'offline'; }
  };
})();
