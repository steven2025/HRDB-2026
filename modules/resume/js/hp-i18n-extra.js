/* ==================================================================
   新增界面的多语言补充层
   - 不改各模块渲染代码，渲染后按文本节点替换
   - 语言切换时还原中文再重新翻译
   ================================================================== */
(function () {
  'use strict';

  var EN = {
    /* 通用 */
    '加载中…': 'Loading…', '刷新': 'Refresh', '删除': 'Delete', '恢复': 'Restore',
    '处理': 'Fix', '取消': 'Cancel', '关闭': 'Close', '确定': 'OK',
    '姓名': 'Name', '岗位': 'Role', '国家': 'Country', '匹配度': 'Match',
    '风险': 'Risk', '来源': 'Source', '入库': 'Added', '状态': 'Status',
    '优势': 'Strengths', '不足': 'Gaps', '五维得分': 'Five dimensions',
    '技能': 'Skills', '证书': 'Certs', '经验': 'Experience', '语言': 'Language', '合规': 'Compliance',
    '推荐面试': 'Recommend', '不推荐': 'Reject', '推荐': 'Recommended', '待定': 'Pending',
    '自动': 'Auto', '手动': 'Manual', '低': 'Low', '中': 'Medium', '高': 'High',
    '在招': 'Open', '预警': 'Alert', '低毛利': 'Low margin', '已处理': 'Done',
    '必填': 'Required', '禁填': 'Do not collect', '建议隐藏': 'Hide advised', '格式要求': 'Format',
    '注意事项': 'Note', '字段': 'Field', '规则': 'Rule', '原因': 'Reason', '操作': 'Actions',
    '依据来源': 'Source', '更新': 'Updated',

    /* 简历库 */
    '主库': 'Main', '待清理': 'To clean', '回收站': 'Trash', '搜姓名 / 岗位 / 国家': 'Search name / role / country',
    '全部匹配度': 'Any match', '候选人': 'Candidate', '入库时间': 'Added at',
    '入库规则：分析完成后自动入库，低于门槛进「待清理」；删除先进回收站，保留 30 天。已推荐 / 面试中 / 已录用 不能直接删除。':
      'Auto-added after analysis; below threshold goes to “To clean”. Deleted items stay in Trash for 30 days. Candidates already recommended / interviewing / hired cannot be deleted.',
    '回收站是空的': 'Trash is empty', '没有符合条件的候选人': 'No candidates match',

    /* 驾驶舱 */
    '在招岗位': 'Open roles', '缺口合计': 'Total openings', '人才库': 'Talent pool',
    '匹配达标': 'Qualified', '高匹配（≥80）': 'High match (≥80)', '外派在册': 'On site',
    '岗位缺口（按国家）': 'Openings by country', '人才匹配分布': 'Match distribution',
    '岗位健康度': 'Role health', '待办': 'To-do', '点击查看岗位': 'Click to view role',
    '实时': 'Live', '数据来自岗位库 / 人才档案 / 保障台账': 'From roles / talent / assurance data',
    '暂无岗位数据': 'No role data',
    '营收 / 毛利 / 回款 / 账龄需要结算与发票数据，当前 store 未包含，接上后自动显示。':
      'Revenue / margin / collection / aging need settlement & invoice data, not in store yet.',

    /* 报告 */
    '候选池总量': 'Pool size', '平均招聘周期': 'Avg. time to fill', '面试转化率': 'Interview conversion',
    '合规风险': 'Compliance risk', '单人成本': 'Cost per hire',
    '招聘漏斗': 'Hiring funnel', '人在哪一步流失': 'Where people drop off',
    '匹配度分布': 'Match distribution', '10 分一档': '10-point bins',
    '国家意向': 'Target countries', '人数': 'People',
    '合规风险热力': 'Compliance heatmap', '国家 × 风险类型': 'Country × risk type',
    '颜色越深，问题越多': 'Darker = more issues',
    '投递': 'Applied', '初筛': 'Screened', '面试': 'Interview', '录用': 'Offered', '到岗': 'Onboarded',
    '琥珀＝达标关口': 'Amber = qualified gate', '青 60–79 · 琥珀 80+': 'Teal 60–79 · Amber 80+',
    '琥珀＝最大来源国': 'Amber = top source country',

    /* 知识库 */
    '文书模板': 'Templates', '国别规则': 'Country rules',
    '规则用于简历上传前体检：必填项缺失会拦截投递，禁填项自动隐藏，建议隐藏项提示 HR 手动处理。':
      'Rules drive the pre-upload check: missing required items block applying; banned items are hidden; advised-hidden items are flagged to HR.',
    '如与当地法律冲突，以法律为准；规则库由保障部维护，修改后即时生效。':
      'Local law prevails. Rules are maintained by Assurance and take effect immediately.',

    /* 岗位账 */
    '项目列表': 'Projects', '岗位生意账': 'Role P&L', '缺口': 'Openings', '已推荐': 'Referred',
    '填补天数': 'Days to fill', '毛利率': 'Gross margin',
    '供给漏斗': 'Supply funnel', '阶段耗时': 'Stage duration', '成本与收益': 'Cost & return',
    '渠道费用': 'Channel cost', '单人成本': 'Cost per hire', '客户报价': 'Client price', '单毛利': 'Gross profit',
    '风险与失败原因': 'Risks', '关闭岗位': 'Close role', '加急推荐': 'Urgent refer',
    '发布→首批推荐': 'Post → first batch', '首批→面试': 'First batch → interview',
    '面试→录用': 'Interview → offer', '录用→到岗': 'Offer → onboard',
    '匹配': 'Matched',

    /* 我的档案 / 简历 */
    '档案信息': 'Profile', '简历体检': 'Resume check', '我的简历': 'My resume',
    '白纸预览 · 缺项高亮 · 演示数据': 'Preview · missing items highlighted · demo',
    '目标国家': 'Target country', '规则随国家变化': 'Rules follow country',
    '简历完成度': 'Resume completeness', '上传前建议 100%': 'Reach 100% before upload',
    '上传前体检': 'Pre-upload check', '已处理': 'Done', '编辑档案': 'Edit profile',
    '上传 / 替换简历': 'Upload / replace', '开始体检': 'Run check',
    '编辑与上传沿用「档案信息」里原有的流程；体检只检查上传前该隐藏、该补齐的项。':
      'Editing and uploading use the existing Profile flow; this check only flags what to hide or complete.',
    '健康证未上传': 'Health certificate missing', '护照有效期未填': 'Passport expiry missing',
    '婚姻状况': 'Marital status', '照片': 'Photo', '日期格式': 'Date format',
    '去上传': 'Upload', '去补': 'Complete', '一键隐藏': 'Hide', '自动修正': 'Auto-fix',
    '还差：健康证、护照有效期、语言水平': 'Missing: health cert, passport expiry, language',
    '上传后才能通过体检': 'Required before passing the check',
    '需 ≥18 个月': 'Must be ≥18 months',
    '建议隐藏，与岗位无关': 'Hide advised, not job-related',
    '已按该国规则隐藏': 'Hidden per country rules',
    '2021.03 与 2021-03 统一为 2021-03': 'Normalize 2021.03 to 2021-03',

    /* 闸门 */
    '投递前体检': 'Pre-apply check', '继续上传': 'Continue upload',
    '缺项不影响上传，但投递前必须补齐；敏感项建议上传前隐藏。':
      'Missing items do not block upload, but must be completed before applying; sensitive items should be hidden first.',
    '目标国要求必填，缺失可能被退回': 'Required by target country; may be rejected',
    '去补资料': 'Complete now', '仍然投递': 'Apply anyway',
    '档案已保存 · 可直接投递': 'Profile saved · ready to apply',
    '档案已保存 · 投递前还需补 ': 'Profile saved · still need ',
    ' 项': ' item(s)',

    /* 设置 */
    '显示设置': 'Display', '字号': 'Font size', '小': 'S', '标准': 'M', '大': 'L',
    '跳过开机动画': 'Skip intro', '跳过推理分析过程': 'Skip reasoning', '恢复默认': 'Reset'
  };

  function lang() {
    try {
      if (window.HPI18N && window.HPI18N.lang) return window.HPI18N.lang();
      return localStorage.getItem('hp-lang') || 'zh';
    } catch (e) { return 'zh'; }
  }

  function translateNode(node) {
    var raw = node.__zh != null ? node.__zh : node.nodeValue;
    if (raw == null) return;
    var m = raw.match(/^(\s*)([\s\S]*?)(\s*)$/);
    if (!m) return;
    var key = m[2];
    if (!key) return;
    if (node.__zh == null) node.__zh = raw;

    function set(v) { if (node.nodeValue !== v) node.nodeValue = v; }
    if (lang() === 'zh') { set(node.__zh); return; }

    var hit = EN[key];
    if (hit) { set(m[1] + hit + m[3]); return; }

    // 带数字的模式
    var pats = [
      [/^主库 (\d+)$/, 'Main $1'],
      [/^待清理 (\d+)$/, 'To clean $1'],
      [/^回收站 (\d+)$/, 'Trash $1'],
      [/^(\d+) 分$/, '$1 pts'],
      [/^(\d+) 天前$/, '$1 days ago'],
      [/^已处理 (\d+)\/(\d+)$/, '$1/$2 done'],
      [/^共 (\d+) 条 · 必填 (\d+) · 禁填 (\d+)$/, '$1 rules · $2 required · $3 banned'],
      [/^已处理 (\d+)$/, '$1 done'],
      [/^档案已保存 · 投递前还需补 (\d+) 项$/, 'Profile saved · still need $1 item(s)']
    ];
    for (var i = 0; i < pats.length; i++) {
      var mm = key.match(pats[i][0]);
      if (mm) { set(m[1] + pats[i][1].replace(/\$(\d)/g, function (_, k) { return mm[+k]; }) + m[3]); return; }
    }

    set(node.__zh);
  }

  function attrTranslate(el) {
    ['placeholder', 'title'].forEach(function (attr) {
      var v = el.getAttribute && el.getAttribute(attr);
      if (!v) return;
      if (!el.__zhAttr) el.__zhAttr = {};
      if (el.__zhAttr[attr] == null) el.__zhAttr[attr] = v;
      var key = el.__zhAttr[attr];
      var out = lang() === 'zh' ? key : (EN[key] || key);
      if (el.getAttribute(attr) !== out) el.setAttribute(attr, out);
    });
  }

  function walk(root) {
    if (!root) return;
    if (root.nodeType === 3) { translateNode(root); return; }
    if (root.nodeType !== 1) return;
    var tag = root.tagName;
    if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'CANVAS') return;

    attrTranslate(root);
    var all = root.querySelectorAll('*');
    for (var i = 0; i < all.length; i++) {
      var el = all[i];
      var t = el.tagName;
      if (t === 'SCRIPT' || t === 'STYLE' || t === 'CANVAS') continue;
      attrTranslate(el);
    }

    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    var n;
    while ((n = walker.nextNode())) translateNode(n);
  }

  function retranslateAll() { walk(document.body); }

  var obs = new MutationObserver(function (list) {
    if (lang() === 'zh') return;
    list.forEach(function (m) {
      m.addedNodes.forEach(function (n) {
        if (n.nodeType === 1 || n.nodeType === 3) walk(n);
      });
      if (m.type === 'characterData') translateNode(m.target);
    });
  });

  function start() {
    walk(document.body);
    obs.observe(document.body, { childList: true, subtree: true, characterData: true });
    document.addEventListener('hp:lang', function () { setTimeout(retranslateAll, 60); });
  }

  window.hpT = function (zh) { return lang() === 'zh' ? zh : (EN[zh] || zh); };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
