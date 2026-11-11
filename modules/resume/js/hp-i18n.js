/* =====================================================================
 * hp-i18n.js v2 —— 界面语言 + 业务数据多语言
 * ---------------------------------------------------------------------
 * 两套机制并存，平滑迁移：
 *
 *  ① 旧机制（保留兼容）：按「中文原文」查词典
 *     t('投递成功')  →  'Applied'
 *     用于尚未 key 化的零散文案
 *
 *  ② 新机制（推荐）：按「key」查词典
 *     t('btn.apply')            →  'Apply'
 *     td(job.title)             →  按当前语言取业务数据
 *     data-i18n="btn.apply"     →  自动填充元素文本
 *
 * 语言切换不再刷新页面：切换后立刻重扫 data-i18n 并广播 hp:lang 事件，
 * 各模块监听该事件重新渲染动态内容。
 * ===================================================================== */
(function () {
  'use strict';

  /* ---------- 词典：按「中文原文」索引（旧机制） ---------- */
  var DICT = {
    en: {
      // 导航
      '岗位发现': 'Job Discovery',
      '我的求职': 'My Applications',
      '我的主页': 'Home',
      '合同与证照': 'Contracts & Docs',
      '海外保障中心': 'Overseas Support',
      '薪酬与结算': 'Payroll',
      '出海知识库': 'Knowledge Base',
      '我的档案': 'My Profile',
      '消息与顾问': 'Messages',
      '概览台': 'Overview',
      '项目管理': 'Projects',
      'AI 候选人匹配': 'AI Candidate Match',
      '服务台': 'Service Desk',
      '知识库': 'Knowledge',
      '报表': 'Reports',
      '消息与成员': 'Team & Messages',
      '全球态势': 'Global View',
      '全球用工态势': 'Global Workforce',
      '风险与合规': 'Risk & Compliance',
      '审计': 'Audit',
      '治理': 'Governance',
      '工单': 'Tickets',
      '审批': 'Approvals',
      '操作日志': 'Audit Log',
      '报告与对账': 'Reports',
      '投递管理': 'Applications',
      '候选人发现': 'Talent Discovery',
      '匹配分析结果': 'Match Results',
      '岗位详情': 'Job Details',
      '海外保障中心': 'Overseas Support',
      '薪酬与结算': 'Payroll & Settlement',
      '出海知识库': 'Knowledge Base',
      '我的档案': 'My Profile',
      '消息中心': 'Message Center',
      '项目管理': 'Projects',
      '服务台': 'Service Desk',
      '报告与对账': 'Reports & Reconciliation',
      '消息与成员': 'Messages & Members',
      '全球能力矩阵': 'Global Capability Matrix',
      '全生命周期看板': 'Lifecycle Board',
      '风险预警中心': 'Risk Alert Center',
      '合同一致性审计': 'Contract Consistency Audit',
      '智能体治理': 'Agent Governance',
      '应急事件工单': 'Incident Tickets',
      '审批中心': 'Approval Center',
      '审计日志': 'Audit Log',
      '合规报表': 'Compliance Reports',
      // 页面标题/副标题
      'AI 匹配推荐': 'AI Matching',
      '筛出合适岗位，收藏 / 投递 / 一键 AI 分析': 'Filter jobs, save, apply, or run AI analysis',
      '按岗位要求给候选人打分排名，点「AI 解释」看证据、差距与面试建议': 'Rank candidates by job requirements; open AI explain for evidence and gaps',
      // 常用按钮
      '清空筛选': 'Clear filters',
      '分析已选': 'Analyze selected',
      '全部岗位分析': 'Analyze all jobs',
      '重新计算': 'Recalculate',
      '进入分析': 'Open analysis',
      '收藏': 'Save',
      '取消收藏': 'Unsave',
      '投递': 'Apply',
      '投递简历': 'Apply',
      '查看岗位': 'View job',
      '查看详情': 'Details',
      '关闭': 'Close',
      '取消': 'Cancel',
      '保存': 'Save',
      '返回': 'Back',
      '搜索': 'Search',
      '刷新': 'Refresh',
      /* === 页面标题与描述（自动生成） === */
      '海外用工派遣平台': 'Global Labor Dispatch Platform',
      '我的主页': 'Home',
      '我的求职': 'My Applications',
      '主申请 + 历史机会 · 全链路进度透明': 'Main application + past opportunities · Full pipeline transparency',
      '岗位发现': 'Job Discovery',
      '筛出合适岗位，收藏 / 投递 / 一键 AI 分析': 'Filter jobs, save, apply, or run AI analysis',
      'AI 匹配推荐': 'AI Matching',
      '按你的技能、证书、薪资与到岗时间，实时计算每个岗位的匹配度与差距': 'Real-time match score and gaps for each job based on your skills, certificates, salary and availability',
      '匹配分析结果': 'Match Results',
      '完整岗位排名与匹配分，可查看详情、投递简历、收藏岗位': 'Full job ranking with match scores; view details, apply, or save jobs',
      '岗位详情': 'Job Details',
      '企业发布的岗位信息 · 可返回分析界面': 'Job posted by the employer · return to analysis anytime',
      '合同与证照': 'Contracts & Docs',
      '三份合同一致性校验 · 证照有效期与续签提醒': 'Three-way contract consistency check · document validity and renewal reminders',
      '海外保障中心': 'Overseas Support',
      '遇到问题别慌：欠薪、伤病、证件丢失、纠纷，一步步带你处理': 'Do not panic: unpaid wages, injury, lost documents, disputes — step-by-step guidance',
      '薪酬与结算': 'Payroll & Settlement',
      '我该拿多少、拿到没 · 跨境到账状态': 'How much you should earn, whether it arrived · cross-border status',
      '出海知识库': 'Knowledge Base',
      '我能做什么 · 出海前必读 · 遇到问题怎么办': 'What I can do · Pre-departure essentials · What to do when problems arise',
      '我的档案': 'My Profile',
      '一次上传，多处复用 · 投递新岗位自动带出': 'Upload once, reuse everywhere · auto-filled when applying',
      '消息中心': 'Message Center',
      '三方在线沟通 · 顾问 / 企业 / 保障部 · 节点通知': 'Three-party chat · Advisor / Employer / Support · Milestone notices',
      '月度用工与结算报告': 'Monthly Workforce & Settlement Report',
      '概览台': 'Overview',
      '项目管理': 'Projects',
      '双轨用工（中方派遣 + 当地用工）统一视图': 'Unified view of dual-track staffing (Chinese dispatch + local hires)',
      '投递管理': 'Applications',
      '查看主动投递简历的候选人，勾选后可匹配分析、邀面试、发 offer': 'Candidates who applied directly; select to run match analysis, invite to interview, or send offers',
      '候选人发现': 'Talent Discovery',
      '主动挖掘未投递简历的候选人，按条件筛选后可直接邀约': 'Discover candidates who have not applied; filter and invite directly',
      '完整排名与匹配分，可查看详情、邀面试、发 offer': 'Full ranking with match scores; view details, invite to interview, or send offers',
      '服务台': 'Service Desk',
      '岗位需求、服务进度、电子签署与结算对账': 'Job requisitions, service progress, e-signing and settlement reconciliation',
      '知识库': 'Knowledge Base',
      '目的国政策、招聘渠道与文书模板': 'Destination-country policies, recruitment channels and document templates',
      '报告与对账': 'Reports & Reconciliation',
      '月度用工报告、合规健康度、结算明细与发票': 'Monthly workforce reports, compliance health, settlement details and invoices',
      '消息与成员': 'Messages & Members',
      '业务节点消息推送与企业成员权限管理': 'Business milestone notifications and member permission management',
      '全球能力矩阵': 'Global Capability Matrix',
      '目的国签证 / 许可口径 · 平均周期 · 合规要点 · 在办项目': 'Visa/permit rules by country · average lead time · compliance points · active projects',
      '全生命周期看板': 'Lifecycle Board',
      '人员 / 项目从投递到回流的关键卡点': 'Key checkpoints from application to repatriation for people and projects',
      '风险预警中心': 'Risk Alert Center',
      '聚合欠薪、证照过期、签证补件、保险到期、合同不一致': 'Aggregates unpaid wages, expired documents, visa supplements, insurance expiry and contract mismatches',
      '合同一致性审计': 'Contract Consistency Audit',
      '按项目 / 按人批量审计三份合同关键条款': 'Batch-audit key clauses of three contracts by project or by person',
      '智能体治理': 'Agent Governance',
      '抽检复核 · 高风险拦截 · 配额与停用，把「模型说了算」变成可管可查': 'Sampling review · high-risk blocking · quotas and suspension — making AI decisions manageable and auditable',
      '应急事件工单': 'Incident Tickets',
      '报案 → 分派 → 处置 → 闭环': 'Report → Dispatch → Resolve → Close',
      '审批中心': 'Approval Center',
      '风险处置备用金申请 · 通过/驳回并回写通知': 'Risk contingency fund requests · approve/reject with notification write-back',
      '审计日志': 'Audit Log',
      '登录、写操作、材料查看、审批与治理动作全量留痕': 'Full trail of logins, writes, document views, approvals and governance actions',
      '合规报表': 'Compliance Reports',
      '监管报送口径 · 证照齐全率 · 签证通过率': 'Regulatory reporting basis · document completeness rate · visa approval rate',
      '应聘者': 'Candidate',
      '企业': 'Employer',
      '保障部': 'Support',
      '个人应聘者主页': 'Candidate Home',
      '客户公司主页': 'Client Company Home',
      '平台运营 · 全球风控 · 合规审计': 'Operations · Global Risk · Compliance',
      '概览': 'Overview',
      '全球态势': 'Global View',
      '风险预警': 'Risk Alerts',
      '治理': 'Governance',
      '工单': 'Tickets',
      '审批': 'Approvals',
      '返回': 'Back',
      '关闭': 'Close',
      '取消': 'Cancel',
      '保存': 'Save',
      '提交': 'Submit',
      '搜索': 'Search',
      '刷新': 'Refresh',
      '全部': 'All',
      '发送': 'Send',
      '删除': 'Delete',
      '编辑': 'Edit',
      '上传': 'Upload',
      '下载': 'Download',
      '预览': 'Preview',
      '查看': 'View',
      '详情': 'Details',
      '状态': 'Status',
      '类型': 'Type',
      '时间': 'Time',
      '操作': 'Actions',
      '加载中…': 'Loading…',
      '暂无数据': 'No data',
      '正在加载…': 'Loading…',
      '确定': 'OK',
      '确认': 'Confirm',
      '是': 'Yes',
      '否': 'No',
      /* === 分析动画 HUD 与阶段 === */
      '推理中': 'Reasoning',
      '打分中': 'Scoring',
      '已完成': 'Completed',
      '完成': 'Done',
      '待机': 'Standby',
      '解析岗位要求': 'Parsing job requirements',
      '读取候选人画像': 'Reading candidate profile',
      '硬性门槛校验': 'Hard requirement gate',
      '技能对齐': 'Skill alignment',
      '薪资区间比对': 'Salary range comparison',
      '地点与语言': 'Location & language',
      '语义复核（大模型）': 'Semantic review (LLM)',
      '加权计算': 'Weighted scoring',
      '生成推荐理由': 'Generating recommendation',
      '证书': 'Certificates',
      '技能': 'Skills',
      '薪资': 'Salary',
      '地点': 'Location',
      '经验': 'Experience',
      '可用性': 'Availability',
      /* === 分析页零散词 === */
      '查看结果': 'View result',
      '应聘者视角': 'Candidate view',
      '推荐': 'Recommended',
      '个岗位': 'jobs',
      '最高': 'Top',
      '引擎': 'Engine',
      '玻璃压机操作': 'Glass press operation',
      '张伟': 'Zhang Wei',
      '我': '(me)',
      '年经验': 'yrs experience',
      '具备': 'Has',
      '压机操作': 'Press operation',
      '三班倒作业': '3-shift work',
      '设备点检': 'Equipment inspection',
      '等': 'and',
      '项岗位所需技能': 'job-required skills',
      '元/月': ' CNY/mo',
      '招聘': 'Openings',
      '更新': 'Updated',
      '条件宽松': 'Loose requirements',
      '勾选后可': 'Select and run',
      '一键 AI 分析': 'AI analysis',
      'Loading': 'Loading',
      '正在加载': 'Loading',
      '暂无': 'N/A',
      '已投递': 'Applied',
      '未投递': 'Not applied',
      '收藏': 'Save',
      '取消收藏': 'Unsave',
      '投递': 'Apply',
      '匹配分': 'Match score',
      '综合评分': 'Overall score',
      '证据': 'Evidence',
      '差距': 'Gaps',
      '命中': 'Matched',
      '缺口': 'Gaps',
      '门槛': 'Gate',
      '通过': 'Passed',
      '不通过': 'Failed',
      '缺失': 'Missing',
      '有效': 'Valid',
      '无效': 'Invalid',
      '已备': 'Ready',
      '护照': 'Passport',
      '健康证': 'Health cert',
      '年龄': 'Age',
      '岁': 'yrs',
      '证据：': 'Evidence: ',
      '步骤': 'Step',
      '推理': 'Reasoning',
      '分析中': 'Analyzing',
      '就绪': 'Ready',
      '开始': 'Start',
      '结果': 'Result',
      '排名': 'Ranking',
      '评分': 'Score',
      '结论': 'Conclusion',
      '亮点': 'Highlights',
      '风险提示': 'Risk notes',
      '面试题': 'Interview Qs',
/* === 岗位/国家/城市/企业/标签（自动导出） === */
      '玻璃压机操作工': 'Glass Press Operator',
      '阿尔及利亚': 'Algeria',
      '阿尔及尔': 'Algiers',
      '示例制造（阿尔及利亚）': 'Demo Manufacturing (Algeria)',
      '技能岗': 'Skilled',
      '包食宿': 'Meals & housing',
      '往返机票': 'Round-trip flights',
      '产线班组长': 'Production Line Leader',
      '越南': 'Vietnam',
      '北宁': 'Bac Ninh',
      '示例电子（越南）': 'Demo Electronics (Vietnam)',
      '管理岗': 'Management',
      '双休': 'Weekends off',
      '驻外补贴': 'Overseas allowance',
      '设备维护工程师': 'Equipment Maintenance Engineer',
      '哈萨克斯坦': 'Kazakhstan',
      '阿拉木图': 'Almaty',
      '示例矿业服务': 'Demo Mining Services',
      '技术岗': 'Technical',
      '五险一金': 'Social insurance',
      '带薪年假': 'Paid annual leave',
      '光伏组件质检员': 'QC Inspector',
      '沙特阿拉伯': 'Saudi Arabia',
      '利雅得': 'Riyadh',
      '示例能源（沙特）': 'Demo Energy (Saudi Arabia)',
      '质检岗': 'QC',
      '新项目': 'New project',
      '住房补贴': 'Housing allowance',
      '中式厨师（员工食堂）': 'Chef (Staff Canteen)',
      '奥兰': 'Oran',
      '后勤岗': 'Logistics',
      '合同可续': 'Renewable contract',
      '驻外会计（中文）': 'Accountant (Chinese)',
      '胡志明市': 'Ho Chi Minh City',
      '职能岗': 'Functional',
      '年终奖': 'Year-end bonus',
      '压机操作工（双头压机线）': 'Press Machine Operator (Twin-head Press Line)',
      '地中玻璃制造': 'Mediterranean Glass Manufacturing',
      '压机操作': 'Press operation',
      '换模调机': 'Mold change & setup',
      '三班倒作业': '3-shift work',
      '离心机操作工（24 工位）': 'Centrifuge Operator (24-Station)',
      '离心机操作': 'Centrifuge operation',
      '玻璃成型': 'Glass forming',
      '设备点检': 'Equipment inspection',
      '扎壶机操作工': 'Pitcher Machine Operator',
      '扎壶机操作': 'Pitcher machine operation',
      '模具预热': 'Mold preheating',
      '异常处置': 'Fault handling',
      '模具维修工': 'Mold Technician',
      '模具维修': 'Mold repair',
      '模具抛光': 'Mold polishing',
      '焊补修复': 'Weld repair',
      '电气工程师': 'Electrical Engineer',
      'PLC 编程': 'PLC programming',
      '变频器调试': 'VFD commissioning',
      '电气图纸': 'Electrical drawings',
      '生产主管（中方负责人）': 'Production Supervisor (Chinese Lead)',
      '生产排程': 'Production scheduling',
      '班组管理': 'Team management',
      '跨文化沟通': 'Cross-cultural communication',
      '质检员': 'QC Inspector',
      '外观检验': 'Visual inspection',
      '尺寸测量': 'Dimension measurement',
      '抽样标准': 'Sampling standards',
      '窑炉工': 'Kiln Operator',
      '窑炉操作': 'Kiln operation',
      '温度控制': 'Temperature control',
      '燃气安全': 'Gas safety',
      '玻璃压机操作工（夜班）': 'Glass Press Operator (Night Shift)',
      '玻璃窑炉司炉工': 'Glass Kiln Fireman',
      '成品包装班长': 'Packaging Team Leader',
      '包装管理': 'Packaging management',
      '仓储管理': 'Warehouse management',
      '班组带教': 'Team coaching',
      'SMT 贴片操作员': 'SMT Operator',
      '北辰电子（虚拟）': 'Beichen Electronics (Demo)',
      'SMT 操作': 'SMT operation',
      '两班倒作业': '2-shift work',
      '产线班组长（家电）': 'Production Line Leader (Home Appliance)',
      '胡志明': 'Ho Chi Minh City',
      '南方家电（虚拟）': 'Nanfang Home Appliance (Demo)',
      '产线管理': 'Line management',
      '排班调度': 'Shift scheduling',
      '品质异常处理': 'Quality issue handling',
      '注塑调机技师': 'Injection Molding Technician',
      '海防': 'Hai Phong',
      '东海精密（虚拟）': 'Donghai Precision (Demo)',
      '注塑调机': 'Injection setup',
      '模具维护': 'Mold maintenance',
      '工艺参数调整': 'Process parameter tuning',
      '品质工程师（QE）': 'Quality Engineer (QE)',
      '品质分析': 'Quality analysis',
      '8D 报告': '8D reports',
      '光伏组件安装工': 'PV Module Installer',
      '沙新能源工程（虚拟）': 'Shaxin New Energy Engineering (Demo)',
      '光伏安装': 'PV installation',
      '高空作业': 'Work at height',
      '组件质检': 'Module QC',
      '电气调试工程师': 'Electrical Commissioning Engineer',
      '达曼': 'Dammam',
      '土建施工主管': 'Civil Construction Supervisor',
      '绿洲建设（虚拟）': 'Oasis Construction (Demo)',
      '施工管理': 'Construction management',
      '进度控制': 'Schedule control',
      '安全管理': 'Safety management',
      '矿山设备维修工': 'Mining Equipment Technician',
      '卡拉干达': 'Karaganda',
      '草原矿业（虚拟）': 'Steppe Mining (Demo)',
      '设备维护': 'Equipment maintenance',
      '液压系统': 'Hydraulic systems',
      '故障诊断': 'Fault diagnosis',
      '焊接技工（管道）': 'Welding Technician (Pipeline)',
      '阿克托别': 'Aktobe',
      '氩弧焊': 'TIG welding',
      '管道安装': 'Pipe installation',
      '图纸识读': 'Drawing reading',
      '食品加工线操作工': 'Food Processing Line Operator',
      '印度尼西亚': 'Indonesia',
      '泗水': 'Surabaya',
      '南洋食品（虚拟）': 'Nanyang Foods (Demo)',
      '食品加工': 'Food processing',
      '卫生规范': 'Hygiene standards',
      '冷库设备维护工': 'Cold Storage Equipment Technician',
      '雅加达': 'Jakarta',
      '制冷设备': 'Refrigeration equipment',
      '电气维修': 'Electrical repair',
      '故障排查': 'Troubleshooting',
      '纺织机修工': 'Textile Machine Technician',
      '坦桑尼亚': 'Tanzania',
      '达累斯萨拉姆': 'Dar es Salaam',
      '东非纺织（虚拟）': 'East Africa Textile (Demo)',
      '纺织设备维修': 'Textile equipment repair',
      '机械调试': 'Mechanical commissioning',
      '备件管理': 'Spare parts management',
      '缝制车间组长': 'Sewing Workshop Leader',
      '车间管理': 'Workshop management',
      '产量管理': 'Output management',
      '员工带教': 'Staff coaching',
      '汽车零部件质检员': 'QC Inspector',
      '墨西哥': 'Mexico',
      '蒙特雷': 'Monterrey',
      '北方汽配（虚拟）': 'North Auto Parts (Demo)',
      '检验记录': 'Inspection records',
      '冲压设备操作工': 'Stamping Machine Operator',
      '冲压操作': 'Stamping operation',
      /* === 分析页补充 === */
      '返回列表': 'Back to list',
      '分析对象': 'Target',
      /* === 后端错误码 === */
      'err.already_applied': 'You have already applied to this job',
      'err.job_full': 'This job is already filled',
      'err.job_not_found': 'Job not found or delisted',
      'err.candidate_not_found': 'Candidate not found',
      'err.persona_not_found': 'Candidate profile not found',
      'err.offer_settled': 'This offer has already been handled',
      'err.approval_pending': 'This bill is already under approval',
      'err.invalid_permission': 'Please select at least one permission',
      'err.no_change': 'No change from current permissions',
      'err.already_decided': 'This approval has already been handled',
      'err.note_required': 'A reason is required when rejecting',
      'err.bill_in_approval': 'This bill is under approval; please wait for the result',
      'err.name_required': 'Project name is required',
      'err.invalid_amount': 'Amount must be greater than 0',
      'err.amount_too_large': 'A single request cannot exceed CNY 200,000',
      'err.reason_required': 'Please provide a reason',
      'err.too_many_pending': 'You already have 2 pending requests; please wait',
      'err.invalid_credentials': 'Incorrect phone number or password',
      'err.weak_password': 'New password must be at least 8 characters',
      'err.phone_password_required': 'Please enter phone number and password',
      'err.invalid_role': 'Invalid role parameter',
      'err.invalid_code': 'Verification code is incorrect or expired',
      'err.forbidden': 'You do not have permission to access this endpoint',
      'err.permission_denied': 'Your account lacks this permission; contact your administrator',
      'err.route_not_found': 'Endpoint not found',
      'err.agent_not_found': 'Unknown agent',
      'err.input_required': 'Missing required parameters',
      'err.invalid_action': 'Invalid action',
      'err.file_too_large': 'File exceeds the 10MB limit',
      'err.unsupported_type': 'Only PDF / JPG / PNG / WebP are supported',
      'err.content_mismatch': 'File content does not match its type (possibly renamed)',
      'err.upload_failed': 'Upload failed',
      'err.self_permission_change_forbidden': 'You cannot change your own permissions',
      'err.invalid_kind': 'Unsupported approval type',
      'err.offer_not_found': 'Offer not found',
      'err.withdraw_failed': 'Withdrawal failed',
      'err.unauthorized': 'Session expired; please sign in again',
      'err.offline': 'Backend not connected',
      'err.missing_params': 'Missing required parameters',
      /* === 技能与页面零散词 === */
      '当前岗位': 'Current job',
      '压机操作': 'press operation',
      '三班倒作业': '3-shift work',
      '设备点检': 'equipment inspection',
      '工艺参数调整': 'process parameter tuning',
      '模具维护': 'mold maintenance',
      '安全规程': 'safety procedures',
      '玻璃成型': 'glass forming',
      '温度控制': 'temperature control',
      '模具预热': 'mold preheating',
      '异常处置': 'fault handling',
      '换模调机': 'mold change & setup',
      '离心机操作': 'centrifuge operation',
      '冲压操作': 'stamping operation',
      '注塑调机': 'injection setup',
      '焊接技工': 'welding technician',
      '管道安装': 'pipe installation',
      '氩弧焊': 'TIG welding',
      '当前岗位': 'Current job',
      '候选人': 'Candidate',
      '自动演示': 'Auto demo',
      '跟随中': 'Following',
      '跟随滚动': 'Follow scroll',
      '查看结果': 'View result',
      '已暂停': 'Paused',
      '暂停': 'Pause',
      '夜班': 'Night shift',
      '白班': 'Day shift',
      '工位': '-station',
      '推理中': 'Reasoning',
      '打分中': 'Scoring',
      '已完成': 'Completed',
      '完成': 'Done',
      '待机': 'Standby',
      '已选岗位': 'selected jobs',
      '个对象': 'objects',
      '正在分析': 'Analyzing',
      '匹配度': 'Match',
      '需中级职业资格证': 'Intermediate vocational cert required',
      '具备': 'Has',
      '项岗位所需技能': 'required skills',
      '推理过程': 'Reasoning process',
      '匹配评分': 'Match score',
      '候选人排名': 'Candidate ranking',
      '匹配结论': 'Match conclusion',
      '亮点': 'Highlights',
      '风险': 'Risks',
      '面试建议': 'Interview questions',
      '成长路径': 'Growth path',
      '档案调节台': 'Profile tuner',
      '薪资期望': 'Expected salary',
      '到岗时间': 'Availability',
      '从业年限': 'Years of experience',
      '恢复初始档案': 'Reset profile',
      '元/月': ' CNY/mo',
      '注塑工艺技师': 'Injection Process Technician',
      '注塑工艺技师（越南厂）': 'Injection Process Technician (Vietnam plant)',
      '玻璃压机操作工': 'Glass Press Operator',
      '压机操作工': 'Press Machine Operator',
      '注塑调机技师': 'Injection Molding Technician',
      '离心机操作工': 'Centrifuge Operator',
      '冲压设备操作工': 'Stamping Machine Operator',
      '双头压机线': 'Twin-head press line',
      '设备维护工程师': 'Equipment Maintenance Engineer',
      '质检员': 'QC Inspector',
      '焊工': 'Welder',
      '电工': 'Electrician',
      '厨师': 'Chef',
      '会计': 'Accountant',
      '阿尔及利亚': 'Algeria',
      '越南': 'Vietnam',
      '哈萨克斯坦': 'Kazakhstan',
      '沙特阿拉伯': 'Saudi Arabia',
      '阿尔及尔': 'Algiers',
      '北宁': 'Bac Ninh',
      '阿拉木图': 'Almaty',
      '利雅得': 'Riyadh',
      '张伟': 'Zhang Wei',
      '注塑调机': 'Injection setup',
      '模具维护': 'Mold maintenance',
      '设备点检': 'Equipment inspection',
      '工艺参数调整': 'Process tuning',
      '三班倒作业': '3-shift work',
      '护照有效': 'Passport valid',
      '待补充：越南语': 'To add: Vietnamese',
      '注塑机调试': 'Injection machine setup',
      '模具保养': 'Mold upkeep',
      '越南语优先': 'Vietnamese preferred',
      '需体检报告': 'Medical report required',
      /* === 分析页骨架文案 === */
      '双向智能匹配': 'Bidirectional AI Matching',
      '岗位 × 候选人 · 可解释评分 · 推理过程回放': 'Job × Candidate · Explainable scoring · Reasoning replay',
      '跳到结果': 'Jump to result',
      '重播': 'Replay',
      '当前岗位': 'Current job',
      '读取中…': 'Loading…',
      '档案调节台': 'Profile tuner',
      '拖动即时重算 · 企业侧排名同步刷新': 'Drag to recalculate instantly · Employer ranking refreshes too',
      '薪资期望': 'Expected salary',
      '到岗时间': 'Availability',
      '从业年限': 'Years of experience',
      '改动会写入人才库并重算分数': 'Changes are saved to the talent pool and scores recalculated',
      '恢复初始档案': 'Restore initial profile',
      '状态': 'Status',
      '待机': 'Standby',
      '推理步': 'Reasoning steps',
      '用时': 'Elapsed',
      '模型': 'Model',
      '综合': 'Overall',
      '张': 'Z',
      '张伟': 'Zhang Wei',
      '注塑工艺技师 · 8 年经验 · 目标：越南': 'Injection Process Technician · 8 yrs · Target: Vietnam',
      '注塑调机': 'Injection setup',
      '模具维护': 'Mold maintenance',
      '护照有效': 'Passport valid',
      '待补充：越南语': 'To add: Vietnamese',
      '匹配度 --': 'Match --',
      '岗': 'J',
      '注塑工艺技师（越南厂）': 'Injection Process Technician (Vietnam plant)',
      '立讯精密 · 招聘 3 人 · 18–25K': 'Luxshare Precision · 3 openings · 18–25K',
      '注塑机调试': 'Injection machine setup',
      '模具保养': 'Mold upkeep',
      '越南语优先': 'Vietnamese preferred',
      '需体检报告': 'Medical report required',
      '推理过程': 'Reasoning process',
      '匹配评分': 'Match score',
      '候选人排名': 'Candidate ranking',
      '匹配结论': 'Match conclusion',
      '亮点': 'Highlights',
      '风险': 'Risks',
      '越南语零基础；无海外驻厂记录，首月需要带教与生活配套支持': 'No Vietnamese; no overseas plant record — needs coaching and living support in the first month',
      '面试建议': 'Interview questions',
      '问设备型号与吨位、换模标准工时、不良率异常的处置流程': 'Ask about machine model and tonnage, standard mold-change time, and handling of defect-rate anomalies',
      '成长路径': 'Growth path',
      '补齐越南语（A2）后预计 91 分，可进入“海外班组长”人才池': 'Estimated 91 after reaching Vietnamese A2, qualifying for the "Overseas Line Leader" talent pool',
      '自动演示': 'Auto demo',
      '查看结果': 'View result',
      '返回列表': 'Back to list',
      '分析对象：已选岗位': 'Target: selected jobs',
      '正在分析': 'Analyzing',
      '个对象...': 'objects...',
      '全部': 'All',
      '发送': 'Send',
      '展开': 'Expand',
      '收起': 'Collapse'
,
      '实时数据': 'Live data',      '已接入后端': 'Backend connected',      '导出明细': 'Export details',      '下载全部': 'Download all',      '浏览更多岗位': 'Browse more jobs',      '上传材料': 'Upload documents',      '保存档案': 'Save profile',      '进行中': 'In progress',      '待处理': 'Pending',      '待确认': 'To confirm',      '待顾问确认': 'Awaiting advisor',      '投递于': 'Applied on',      '面试中': 'Interviewing',      '我的投递': 'My applications',      '历史与储备机会': 'Past & reserve opportunities',      '当前环节': 'Current stage',      '材料待补': 'Documents pending',      '体检报告': 'Medical report',      '预计出境': 'Expected departure',      '以签证为准': 'Subject to visa',      '我的全周期链路': 'My full lifecycle',      '进行中申请': 'Active application',      '我的链路进度': 'My pipeline progress',      '投递': 'Applied',      '资质': 'Credentials',      '面试': 'Interview',      '签约': 'Contract',      '签证': 'Visa',      '项待办': 'tasks',      '还有': 'Remaining',      '已进入': 'Entered',      '环节': 'stage',      '合同矩阵': 'Contract matrix',      '阴阳合同': 'Contract mismatch',      '三份合同关键条款对比': 'Key clauses across three contracts',      '薪资下限': 'Salary floor',      '薪资上限': 'Salary ceiling',      '币种': 'Currency',      '每周工时': 'Weekly hours',      '小时': 'hours',      '意外险保额': 'Accident cover',      '解约通知期': 'Notice period',      '试用期': 'Probation',      '未发现': 'None found',      '风险': 'Risks',      '合同': 'Contract',      '签约方': 'Parties',      '关键条款摘要': 'Key clause summary',      '应发': 'Gross',      '已发': 'Paid',      '基本': 'Base',      '加班': 'Overtime',      '津贴': 'Allowance',      '已结汇到账': 'Settled & received',      '到账状态': 'Settlement status',      '已结汇': 'Settled',      '汇率': 'FX rate',      '收入趋势': 'Income trend',      '双显': 'Both',      '折线图': 'Line',      '柱状图': 'Bar',      '基本工资': 'Base salary',      '总收入趋势': 'Total income trend',      '合计': 'Total',      '薪酬明细': 'Payroll details',      '加班费': 'Overtime pay',      '基本信息': 'Basic info',      '投递时自动填充': 'Auto-filled when applying',      '姓名': 'Name',      '手机号': 'Phone',      '最高学历': 'Education',      '初中': 'Junior high',      '高中': 'High school',      '中专/技校': 'Vocational',      '大专': 'Associate',      '本科': 'Bachelor',      '硕士（研究生）': 'Master',      '博士': 'PhD',      '技能证书': 'Skill certificates',      '材料清单': 'Document checklist',      '已上传': 'Uploaded',      '身份证正反面': 'ID card (both sides)',      '替换': 'Replace',      '学历证明': 'Education proof',      '无犯罪记录证明': 'Criminal record check',      '会话': 'Conversations',      '个会话': 'conversations',      '条未读': 'unread',      '企业招聘对接': 'Employer recruiting',      '选择左侧会话开始沟通': 'Select a conversation on the left',      '从左侧选择一个会话': 'Pick a conversation from the left',      '通知': 'Notices',      '实时': 'Live',      '风险处置引导': 'Risk handling guide',      '点开看': 'Tap to view',      '我该做什么': 'what to do',      '申请风险处置备用金': 'Request contingency fund',      '附材料清单': 'with document checklist',      '一键生成申诉书': 'Auto-generate appeal letter',      '开始引导': 'Start guide',      '紧急': 'Urgent',      '应急': 'Emergency',      '助手': 'Assistant',      '参考': 'Reference',      '更新': 'Updated',      '重点': 'Key',      '必读': 'Must read',      '问答参考': 'Q&A reference',      '非法律意见': 'Not legal advice',      '重大事项请转顾问或专业复核': 'Consult an advisor for important matters',      '公司欠薪 / 跑路怎么办？': 'Unpaid wages / employer vanished',      '引导申请风险处置备用金，附材料清单 + 一键生成申诉书': 'Guides you to the contingency fund with a document checklist and auto appeal letter',      '在海外受伤 / 生病？': 'Injured / ill overseas?',      '24h 救援热线 + 保险报案 + 医疗转运说明': '24h rescue hotline + insurance claim + medical transfer',      '护照丢了 / 被扣了？': 'Passport lost / withheld?',      '领事保护指引 + 当地使领馆联系方式 + 补办流程': 'Consular guidance + embassy contacts + replacement',      '遇到劳务纠纷？': 'Labour dispute?',      '证据链整理助手（合同/考勤/工资流水）+ 律师推荐': 'Evidence assistant (contract/attendance/payroll) + lawyer referral',      '高频': 'Frequent',      '维权': 'Rights',      '平台 24h 应急热线': 'Platform 24h emergency hotline',      '全年无休 · 中文服务': '24/7 · Chinese service',      '中国驻阿尔及利亚使馆领事保护': 'Chinese Embassy in Algeria – consular protection',      '领事保护与协助（演示号码）': 'Consular protection and assistance (sample)',      '阿尔及利亚工作签证要什么材料': 'What documents for an Algeria work visa?',      '在海外遇到欠薪怎么维权': 'How to claim unpaid wages overseas',      '出海劳务合同怎么看': 'How to read an overseas labour contract',      '个税与结汇：钱怎么合法地回国': 'Tax and FX: moving money home legally',      '海外安全防范与应急手册': 'Overseas safety and emergency handbook',      '出海前必做的 10 件事': '10 things to do before going abroad',      '风险处置备用金申请条件': 'Contingency fund eligibility',      '三份合同关键条款一致性校验通过': 'Three-contract consistency check passed',      '已签署': 'Signed',      '境外人身意外险': 'Overseas accident insurance',      '解约提前': 'Notice before termination',      '我与派遣公司《服务合同》': 'Service Contract with the agency',      '派遣公司与国外雇主《劳务合作合同》': 'Labour Cooperation Contract',      '我与国外雇主《雇佣合同》': 'Employment Contract',      '海外津贴': 'Overseas allowance',      '个税代扣': 'Income tax withheld',      '社保个人部分': 'Social insurance (employee)',      '实发': 'Net pay',      '历史发放记录': 'Payment history',      '含基本工资与加班/补贴': 'Includes base salary, overtime and allowances',      '查看投递详情': 'View application',      '投递报名': 'Application',      '简历提交 · 岗位意向确认': 'Resume submitted · Preference confirmed',      '资质核验': 'Credential check',      '出境': 'Departure',      '在岗': 'On post',      '回流': 'Return',      '我的证照': 'My documents',      '有效期与续签提醒': 'Validity and renewal reminders',      '证照': 'Document',      '编号': 'Number',      '有效期至': 'Valid until',      '示例对外劳务合作公司': 'Demo Labour Cooperation Co.',      '阿尔及利亚某玻璃厂': 'A glass factory in Algeria',      '演示': 'demo',      '工时': 'Hours',      '证据收集': 'Evidence collection',      '联系顾问': 'Contact advisor',      '领事协助': 'Consular assistance',      '仲裁': 'Arbitration',      '诉讼路径': 'Litigation route',      '三份合同是什么': 'What are the three contracts?',      '重点看哪几条': 'Which clauses matter most',      '如何识别阴阳合同': 'How to spot contract mismatches',      '个税与结汇': 'Tax and FX settlement',      '钱怎么合法带回国': 'How to bring money home legally',      '个税申报': 'Tax filing',      '税收协定': 'Tax treaties',      '结汇合规要点': 'FX compliance essentials',      '手册': 'Handbook',      '治安风险': 'Security risks',      '自然灾害': 'Natural disasters',      '政局动荡时的自救与求助流程': 'Self-help and assistance during unrest',      '清单': 'Checklist',      '我的保单': 'My insurance policies',      '境外人身意外': 'Overseas personal accident',      '雇主责任': 'Employer liability',      '境外人身意外伤害保险': 'Overseas Personal Accident Insurance',      '保额': 'Coverage',      '生效中': 'Active',      '查看理赔入口': 'Open claim guide',      '紧急联系与领事保护': 'Emergency contacts & consular protection',      '一键触达': 'One tap away',      '呼叫': 'Call',      '专属顾问': 'Dedicated advisor',      '李顾问': 'Advisor Li',      '工作日': 'Weekdays',      '国内紧急联系人': 'Domestic emergency contact',      '家属一键通知': 'One-tap family alert',      '行前培训': 'Pre-departure training',      '完成培训才能出境': 'Training required before departure',      '安全防范与应急演练': 'Safety and emergency drills',      '目的国法律与风俗': 'Destination laws and customs',      '合同与维权须知': 'Contract and rights essentials',      '待完成': 'Pending',      '健康与心理适应': 'Health and psychological adjustment'
    ,
      '风险保障速览': 'Risk & support overview',      '出海安心四件套': 'Four essentials for peace of mind',      '意外险': 'Accident cover',      '已投保': 'Insured',      '已生效': 'Active',      '条待确认': 'awaiting confirmation',      '投递于': 'Applied on',      '工作签证': 'Work visa',      '待办理': 'To be processed',      '办理中': 'Processing',      '跟进中': 'Following up',      '工作许可': 'Work permit',      '我的备用金申请': 'My contingency requests',      '笔待审批': 'pending approval',      '待审批': 'Pending approval',      '欠薪垫付': 'Unpaid wages advance',      '已通过': 'Approved',      '已驳回': 'Rejected',      '处理': 'Processed',      '审批意见': 'Approval note',      '材料齐备': 'Documents complete',      '同意垫付': 'Advance approved',      '提交': 'Submit',      '雇主拖欠': 'Employer owes',      '工资': 'Salary',      '已催告两次未果': 'Two reminders sent, no response',      '我的': 'My',      '含基本工资与加班/补贴': 'Includes base salary, overtime and allowances',      '补贴': 'Allowance',      '高中以上学历': 'High school or above',      '毕业证': 'Diploma',      '无犯罪记录': 'No criminal record',      '办理周期约': 'Processing time approx.',      '已上传': 'Uploaded',      '待补交': 'To submit',      '证件照': 'ID photo',      '支持与顾问': 'Support & advisors',      '企业': 'Employer',      '保障部坐席在线对话': 'Chat with a live support agent',      '系统与节点提醒': 'System and milestone notices',      '全部已读': 'Mark all read',      '海外派遣服务': 'Overseas dispatch service',      '在线': 'Online',      '发消息': 'Send message',      '拨打': 'Call',      '应急': 'Emergency',      '查询': 'Query',      '查看岗位': 'View job',      '撤销申请': 'Withdraw application',      '重新投递': 'Apply again',      '状态': 'Status',      '关闭': 'Close',      '取消': 'Cancel',      '确认': 'Confirm',      '查看详情': 'Details',      '标记已读': 'Mark read',      '已读': 'Read',      '紧急': 'Urgent',      '待办': 'To do'
    ,
      'AI 参考': 'AI reference',      'AI 问答参考，非法律意见；重大事项请转顾问或专业复核': 'AI Q&A reference, not legal advice; consult an advisor for important matters',      '高中以上学历 + 毕业证/技能证书、无犯罪记录、体检报告；办理周期约 4–6 周。': 'High school or above + diploma/skill certificate, criminal record check, medical report; about 4–6 weeks.',      '证据收集 → 联系顾问 → 申请风险处置备用金 → 领事协助 → 仲裁/诉讼路径。': 'Evidence collection → Contact advisor → Request contingency fund → Consular assistance → Arbitration/litigation.',      '三份合同是什么、重点看哪几条、如何识别阴阳合同。': 'What the three contracts are, which clauses matter, and how to spot mismatches.',      '个税申报、税收协定、结汇合规要点。': 'Tax filing, tax treaties, FX compliance essentials.',      '治安风险、自然灾害、政局动荡时的自救与求助流程。': 'Security risks, natural disasters, and self-help during political unrest.',      '证件备份、保险确认、合同留存、紧急联系人设置、行前培训等。': 'Document backups, insurance confirmation, contract retention, emergency contacts, pre-departure training.',      '欠薪、跑路等情形下的垫付条件与材料。': 'Advance conditions and documents for unpaid wages or employer flight.',      '出海知识助手': 'Overseas Knowledge Assistant',      '签证材料': 'Visa documents',      '安全注意': 'Safety tips',      '欠薪维权': 'Unpaid wages',      '合同要点': 'Contract basics',      '更新': 'Updated',      '政策': 'Policy',      '必备': 'Essential',      '重点': 'Key',      '必读': 'Must read',      '清单': 'Checklist',      '手册': 'Handbook',      'AI 助手': 'AI Assistant'
    ,
      '点开看': 'Tap to view',      '我该做什么': 'what to do',      '境外人身意外': 'Overseas personal accident',      '雇主责任': 'Employer liability',      '专属顾问': 'Dedicated advisor',      '李顾问': 'Advisor Li',      '工作日': 'Weekdays',      '欠薪垫付': 'Unpaid wages advance',      '提交': 'Submitted',      '雇主拖欠': 'Employer owes',      '工资': 'Salary',      '已催告两次未果': 'Two reminders sent, no response',      '保障部坐席': 'Support desk',      '材料齐备': 'Documents complete',      '同意垫付': 'Advance approved',      '应发': 'Gross',      '已发': 'Paid',      '我的': 'My',      '收入趋势': 'Income trend',      '含基本工资与加班': 'Includes base salary and overtime',      '合计': 'Total',      '薪酬明细': 'Payroll details',      '应急': 'Emergency',      '投递于': 'Applied on',      '虚拟': 'Demo',      '阴阳合同': 'Contract mismatch',      '未发现': 'None found',      '风险': 'Risks',      '外派培训合格证': 'Pre-departure training certificate',      '长期': 'Long-term',      '境外保险单': 'Overseas insurance policy',      '凌晨好': 'Good early morning',      '张伟': 'Zhang Wei',      '你的': 'Your',      '已进入': 'Entered',      '签证材料补交': 'Visa documents pending',      '环节': 'stage',      '还有': 'Remaining',      '项待办': 'tasks',      '目标': 'Target',      '投递': 'Applied',      '资质': 'Credentials',      '面试': 'Interview',      '签约': 'Contract',      '签证': 'Visa',      '出境': 'Departure',      '在岗': 'On post',      '回流': 'Return',      '查看投递详情': 'View application',      '雇主资质': 'Employer credentials',      '对外劳务合作资质已核验': 'Labour cooperation licence verified',      '已核验': 'Verified'
    ,
      '本月应发': 'Gross this month',      '本月已发': 'Paid this month',      '基本工资': 'Base salary',      '总收入': 'Total income',      '应发': 'Gross',      '已发': 'Paid',      '海外津贴': 'Overseas allowance',      '个税代扣': 'Income tax withheld',      '社保个人部分': 'Social insurance (employee)',      '实发': 'Net pay',      '历史发放记录': 'Payment history',      '薪酬明细': 'Payroll details',      '收入趋势': 'Income trend',      '我的': 'My',      '合计': 'Total',      '应急': 'Emergency',      '专属顾问': 'Dedicated advisor',      '李顾问': 'Advisor Li',      '境外人身意外': 'Overseas personal accident',      '雇主责任': 'Employer liability',      '工作日': 'Weekdays',      '未发现': 'None found',      '风险': 'Risks',      '阴阳合同': 'Contract mismatch',      '三份合同关键条款一致性校验通过': 'Three-contract consistency check passed',      '投递于': 'Applied on',      '应急热线': 'Emergency hotline',      '一键呼叫': 'One-tap call',      '我的待办': 'My to-dos',      '点击了解': 'Learn more',      '已纳入': 'Included',      '风险备用金': 'Risk contingency fund',      '已纳入保障通道': 'Enrolled in the support channel'
    ,
      '我的月收入趋势': 'My monthly income trend',      '本月薪酬明细': 'Payroll details this month',      '月份': 'Month',      '合计': 'Total',      '加班/补贴': 'Overtime / allowances',      '万元': '10,000 CNY',      '应急热线': 'Emergency hotline',      '影响签证预审': 'Affects visa pre-check',      '补交体检报告': 'Submit medical report',      '指定医院体检': 'Medical exam at designated hospital',      '截止': 'Due',      '去处理': 'Handle now',      '投递于': 'Applied on',      '未发现': 'None found',      '风险': 'Risks',      '阴阳合同': 'Contract mismatch',      '三份合同关键条款一致性校验通过': 'Three-contract consistency check passed',      '境外人身意外': 'Overseas personal accident',      '雇主责任': 'Employer liability',      '专属顾问': 'Dedicated advisor',      '李顾问': 'Advisor Li',      '工作日': 'Weekdays',      '欠薪垫付': 'Unpaid wages advance',      '提交': 'Submitted',      '雇主拖欠': 'Employer owes',      '月工资': 'monthly salary',      '已催告两次未果': 'Two reminders sent, no response',      '材料齐备': 'Documents complete',      '同意垫付': 'Advance approved',      '应急': 'Emergency'
    ,
      '在办项目': 'Active projects',      '本月账单': 'Bills this month',      '项目健康度': 'Project health',      '各环节合规与进度综合评估': 'Compliance and progress across stages',      '人员结构': 'Workforce structure',      '当前在册': 'Currently on register',      '招募匹配': 'Recruitment match',      '签约合规': 'Contract compliance',      '证照手续': 'Documents & permits',      '在岗履约': 'On-post performance',      '结算对账': 'Settlement',      '派遣中人员': 'Dispatched staff',      '当地雇员': 'Local employees',      '本月应结算': 'Due for settlement',      '项目人力资源负责人': 'Project HR lead',      '今日有': 'Today',      '个新项目待立项': 'new projects pending',      '个项目在册': 'projects on register',      '个项目岗位': 'project positions',      '笔账单待确认': 'bills awaiting confirmation',      '人在册': 'on register'
    ,
      '结算趋势': 'Settlement trend',      '派遣薪酬': 'Dispatch payroll',      '当地薪酬': 'Local payroll',      '待办事项': 'To-dos',      '结算账单确认': 'Confirm settlement bill',      '阿尔及利亚项目 9 月账单 · 截止明日': 'Algeria project September bill · due tomorrow',      '5 名派遣人员签证材料补交': '5 dispatched staff need visa documents',      '学历证明扫描件 · 影响签证预审': 'Education certificate scans · affects visa pre-check',      '当地雇员保险续保确认': 'Confirm local employee insurance renewal',      '中方派遣': 'Chinese dispatch',      '储备候选人': 'Reserve candidates',      '海外项目 HR': 'Overseas Project HR',      '近': 'Last',      '周末': 'weekend',      '储蓄': 'Savings',      '招聘渠道': 'Recruitment channels',      '岗位简报': 'Job brief',      '人才库': 'Talent pool',      '合规': 'Compliance',      '报表': 'Reports'
    ,
      '海外用工派遣平台': 'Overseas Staffing Platform',      '全球海外派遣 · 全周期数字化平台': 'Global overseas dispatch · Full-lifecycle digital platform',      '我是应聘者': 'I am a candidate',      '找海外工作，全程看得见进度、合同和保障。': 'Find overseas jobs with visible progress, contracts and protection.',      '我是企业': 'I am an employer',      '发布岗位、管理人员、合规结算，一站式调度。': 'Post jobs, manage people, settle compliantly — all in one place.',      '演示账号一键进入': 'Enter with demo account',      '保障部入口 →': 'Support portal →',      '保障部入口': 'Support portal'
    ,
      '智能体治理': 'Agent governance',      '抽检复核 · 高风险拦截 · 配额与停用，把「模型说了算」变成可管可查': 'Sampling review · high-risk interception · quotas and suspension — making "the model decides" auditable',      '演示数据': 'Demo data',      '刷新': 'Refresh',      '已部署智能体': 'Deployed agents',      '版本 / 状态 / 今日调用': 'Version / status / calls today',      '智能体': 'Agent',      '版本': 'Version',      '今日': 'Today',      '待复核': 'To review',      '状态': 'Status',      '运行策略': 'Runtime policy',      '保存后立即生效': 'Applies immediately after saving',      '抽检比例': 'Sampling rate',      '按比例随机把回答送入复核队列，用于持续评估质量': 'Randomly routes answers to the review queue to keep evaluating quality',      '每日调用上限': 'Daily call limit',      '应聘者 / 企业 / 保障部': 'Candidate / Employer / Support',      '发送前对手机号 / 身份证 / 护照做脱敏': 'Redact phone / ID / passport before sending',      '保存策略': 'Save policy',      '复核队列': 'Review queue',      '条待处理': 'pending',      '成本与用量': 'Cost and usage',      '按 token 估算 · 单价可在 server/.env 调整': 'Estimated by token · unit price configurable in server/.env',      '系统状态': 'System status',      '数据库引擎与数据规模': 'Database engine and data size',      '读取中…': 'Loading…',      '待审批': 'Pending approval',      '已通过': 'Approved',      '已驳回': 'Rejected',      '审批意见': 'Review note',      '通过': 'Approve',      '驳回': 'Reject',      '智能体版本': 'Agent version',      '今日调用': 'Calls today',      '抽检': 'Sampling',      '停用': 'Disabled',      '启用': 'Enabled',      '候选人发现': 'Talent discovery',      '投递管理': 'Applications',      '项目管理': 'Project management',      '概览台': 'Overview',      '服务台': 'Service desk',      '报告与对账': 'Reports & settlement',      '成员与权限': 'Members & permissions',      '全球态势': 'Global view',      '全球能力矩阵': 'Global capability',      '全周期看板': 'Lifecycle board',      '风险预警': 'Risk alerts',      '合同审计': 'Contract audit',      '工单': 'Tickets',      '审计日志': 'Audit log',      '报表': 'Reports'
    ,
      '三个身份合计': 'All three roles combined',      '其中高风险': 'of which high-risk',      '复核通过率': 'Review pass rate',      '已复核': 'Reviewed',      '策略页可调': 'Adjustable on policy page',      '保存即生效': 'Takes effect on save',      '出海顾问': 'Overseas Advisor',      '启用中': 'Enabled',      '合同一致性审计员': 'Contract consistency auditor',      '签证材料预审员': 'Visa pre-check officer',      '风险分诊员': 'Risk triage agent',      '结算核对员': 'Settlement checker',      '文书翻译与润色': 'Document translation & polish',      '今日用量': 'Usage today',      '条记录': 'records',      '高风险': 'High risk',      '风险命中': 'Risk hits',      '含证件或手机号': 'Contains ID or phone',      '结论': 'Conclusion',      '预审': 'Pre-check',      '项材料': 'documents',      '其中': 'of which',      '缺什么': 'What is missing',      '指定医院体检报告': 'Medical report from designated hospital',      '个月内': 'months',      '这是阻断项': 'This is a blocker',      '截止': 'Due',      '还有': 'Remaining',      '护照': 'Passport',      '有效期': 'Valid until',      '个月': 'months',      '系统显示': 'System shows',      '未上传': 'Not uploaded',      '到期': 'expires',      '满足': 'meets requirements',      '打回': 'Returned',      '天内到期': 'days before expiry',      '待办截止': 'Task due',      '只剩': 'only',      '必须去阿方认可的指定医院做': 'Must be done at an Algerian-approved designated hospital',      '普通医院的体检单不认': 'Ordinary hospital reports are not accepted',      '本身完全够用': 'is fully sufficient',      '扫描件没传': 'the scan was not uploaded',      '不是要换护照': 'no need to renew the passport',      '先确认是': 'First confirm whether',      '你名下护照': 'Your passport',      '有效期到': 'valid until',      '这是当前唯一卡住流程的材料': 'This is the only document blocking the process',      '你护照本身是有效的': 'Your passport itself is valid',      '护照页未上传': 'Passport page not uploaded',      '帮我预审签证材料': 'Pre-check my visa documents',      '还不能送签': 'cannot be submitted yet',      '也是你当前唯一的待办': 'and it is your only pending task',      '所以大概率只是': 'so most likely it is just',      '需要一起处理': 'needs to be handled together',      '而且你手上还有一项证照快到期': 'and one of your documents is about to expire',      '个月内有效': 'valid within months',      '项是硬性阻断项': 'are hard blockers'
    ,
      '证件通过': 'Documents cleared',      '当前显示': 'Showing',      '中式厨师': 'Chinese cuisine chef',      '员工食堂': 'Staff canteen',      '驻外会计': 'Overseas accountant',      '中文': 'Chinese',      '生产主管': 'Production supervisor',      '中方负责人': 'Chinese-side lead',      '关键条件': 'Key requirements',      '期望薪资': 'Expected salary',      '工作年限': 'Years of experience',      '驻外经历': 'Overseas experience',      '点击查看完整简历': 'View full resume',      '邀面试': 'Invite to interview',      '到岗': 'Available',      '期望': 'Expected',      '证件': 'Documents',      '齐全': 'Complete',      '上一页': 'Previous',      '下一页': 'Next',      '厨师长': 'Head chef',      '中级职业资格证': 'Intermediate vocational certificate',      '技校': 'Vocational school',      '大专': 'Associate degree',      '本科': 'Bachelor',      '初中': 'Junior high',      '高中': 'High school',      '硕士': 'Master',      '博士': 'PhD'
    ,
      '小时': 'hours',      '分钟': 'minutes',      '万元': '10,000 CNY',      '待处理': 'pending',      '条记录': 'records',      '全部': 'All',      '全部已读': 'Mark all read',      '已全部读取': 'All loaded',      '暂无数据': 'No data',      '加载中': 'Loading'
    ,
      '随机抽检': 'Random sampling',      '业务对象': 'business objects',      '运行记录': 'run records',      '复核记录': 'review records',      '签证结果承诺': 'visa outcome promise',      '法律定性表述': 'legal characterization',      '知识库条目': 'knowledge base entry',      '共': 'total',      '待复核': 'to review',      '已复核': 'reviewed',      '抽检': 'sampling',      '治理': 'governance',      '策略': 'policy',      '配额': 'quota',      '拦截': 'interception',      '脱敏': 'redaction',      '模型': 'model',      '费用': 'cost',      '用量': 'usage',      '调用': 'calls'
    ,
      '中方派遣': 'Chinese dispatch',      '当地用工': 'Local employment',      '本月用工报告': 'Monthly workforce report',      '派遣': 'Dispatch',      '当地': 'Local',      '出勤率': 'Attendance rate',      '无合规预警项': 'No compliance alerts',      '本月派遣薪酬结算': 'Dispatch payroll settlement',      '当地雇员薪酬结算': 'Local payroll settlement',      '示例数据': 'Sample data',      '结算明细': 'Settlement details',      '口径': 'Basis',      '结算单': 'Settlement note',      '结算单号': 'Settlement no.',      '项目': 'Project',      '类别': 'Category',      '金额': 'Amount',      '发票': 'Invoice',      '中方派遣薪酬': 'Chinese dispatch payroll',      '当地雇员薪酬': 'Local employee payroll',      '未开票': 'Not invoiced',      '已确认': 'Confirmed',      '已开票': 'Invoiced',      '沙特': 'Saudi Arabia',      '沙特阿拉伯': 'Saudi Arabia',      '中国': 'China',      '双轨用工': 'Dual-track staffing',      '许可': 'Permit',      '学历与无犯罪记录公证': 'Notarized education and criminal record',      '双认证': 'Dual authentication',      '指定医院体检': 'Medical exam at designated hospital',      '有效': 'Valid',      '配额制': 'Quota-based',      '学历': 'Education',      '无犯罪': 'No criminal record',      '齐套率': 'Completeness rate',      '补件': 'Supplementary docs',      '保险': 'Insurance',      '离职': 'Separation',      '回国': 'Return home',      '每段有交付物与': 'Each stage has deliverables and',      '工作许可': 'Work permit',      '暂住卡': 'Residence card',      '工作签证': 'Work visa',      '运行中': 'Running',      '筹备': 'Preparing',      '可开通': 'Available',      '平均周期': 'Avg. duration',      '关键合规要点': 'Key compliance points',      '在办': 'Active',      '国家': 'Country',      '目的地口径': 'Destination requirements',      '全周期 8 阶段': '8 lifecycle stages',      '交付物与 SLA': 'Deliverables and SLA'
    ,
      '分项得分': 'Score breakdown',      '推荐理由': 'Why recommended',      '风险提示': 'Risk notes',      '推理过程': 'Reasoning process',      '候选人期望': 'Candidate expects',      '岗位区间': 'Job range',      '具备议价空间': 'room to negotiate',      '地点匹配': 'Location match',      '无语言要求': 'No language requirement',      '区间内': 'Within range',      '岗位匹配结果': 'Match results',      '分项': 'Breakdown',      '得分': 'Score',      '匹配度': 'Match score',      '推荐': 'Recommended',      '完整简历': 'Full resume',      '返回排名': 'Back to ranking',      '返回分析界面': 'Back to analysis',      '切换岗位': 'Switch position',      '本地服务': 'Local service',      '解析岗位要求': 'Parsing job requirements',      '读取候选人档案': 'Reading candidate profile',      '硬性条件闸门': 'Hard requirement gate',      '技能匹配': 'Skill alignment',      '薪资区间比对': 'Salary range comparison',      '地点与语言': 'Location and language',      '语义复核（大模型）': 'Semantic review (LLM)',      '加权计算': 'Weighted scoring',      '生成推荐': 'Generating recommendation',      '已完成': 'Completed',      '进行中': 'In progress',      '条证据': 'evidence points',      '条差距': 'gaps',      '置信度': 'Confidence',      '耗时': 'elapsed',      '规则分': 'Rule score',      '自定义权重': 'Custom weights',      '门槛通过': 'Threshold passed',      '证据': 'Evidence',      '差距': 'Gaps',      '技能': 'Skills',      '证书': 'Certs',      '薪资': 'Salary',      '地点': 'Location',      '经验': 'Exp',      '可用性': 'Availability',      '合格': 'Qualified',      '待定': 'TBD',      '同传面试': 'Interpreted interview',      '雇主确认录用': 'Employer confirmed hire'
    ,
      '停止': 'Stop',      '下一步': 'Next',      '面试匹配': 'Interview matching',      '合同签署': 'Contract signing',      '出境办理': 'Departure Processing',      '期满回流': 'Expiry Return',      '我的专属顾问': 'My Dedicated Consultant',      '电话': 'Phone',      '我的收藏': 'My Favorites',      '阿尔及利亚玻璃制品工厂': 'Algeria Glass Products Factory',      '企业已核验': 'Enterprise Verified',      '补充材料': 'Supplementary Materials',      '查看合同': 'View Contract',      '撤回申请': 'Withdraw Application',      '顾问确认': 'Consultant Confirmed',      '企业查看': 'Viewed by Employer',      '邀约面试': 'Interview Invited',      '已录取': 'Hired',      '查看岗位详情': 'View Job Details',      '撤回投递': 'Withdraw Application',      '东南亚电子装配线（示例）': 'Southeast Asia Electronics Assembly Line (Sample)',      '已放弃': 'Withdrawn',      '中亚矿业技术服务（示例）': 'Central Asia Mining Technical Services (Sample)',      '储备中': 'In talent pool',      '示例对外劳务合作公司（演示）': 'Sample Foreign Labor Cooperation Company (Demo)',      '阿尔及利亚某玻璃厂（演示）': 'A glass factory in Algeria (Demo)',      '遇到劳务纠纷': 'Encountering labor disputes',      '家属一键通知（演示）': 'One-tap family notification (demo)',      '已结汇到账（演示）': 'Settled to Account (Demo)',      '三份合同是什么、重点看哪几条、如何识别阴阳合同': 'What the three contracts are, which clauses to focus on, and how to identify dual contracts',      '个税申报、税收协定、结汇合规要点': 'Key points on individual income tax filing, tax treaties, and foreign exchange settlement compliance',      '治安风险、自然灾害、政局动荡时的自救与求助流程': 'Self-rescue and help-seeking procedures during public security risks, natural disasters, and political unrest',      '欠薪、跑路等情形下的垫付条件与材料': 'Advance payment conditions and required materials in cases of unpaid wages, absconding, etc.',      '签证节点': 'Visa Milestone',      '保险生效': 'Insurance Effective',      '政策更新': 'Policy Update',      '阿尔及利亚工作许可材料要求已更新至知识库': 'Algeria work permit material requirements have been updated in the knowledge base',      '顾问消息': 'Consultant Message',      '可以问我签证材料、合同须知、维权流程等问题': 'You can ask me about visa materials, contract notices, rights protection procedures, and other questions',      '阿尔及利亚签证要什么材料': 'What materials are needed for an Algeria visa?',      '欠薪怎么维权': 'How to protect rights in case of unpaid wages',      '合同怎么看': 'How to read a contract',      '体检报告去哪做': 'Where to get a medical examination report',      '提醒': 'Reminder',      '重点项目进度': 'Key Project Progress',      '项目建档': 'Project Filing',      '岗位需求结构化': 'Structured Position Requirements',      '人才招募与推荐': 'Talent Recruitment and Referral',      '合同签约与备案': 'Contract Signing and Filing',      '预计批量签约': 'Batch signing expected',      '出境合规办理': 'Overseas Compliance Processing',      '新建项目': 'New Project',      '链路进度': 'Chain Progress',      '双轨用工配置': 'Dual-track Staffing Configuration',      '中方派遣人员': 'China-side Dispatched Personnel',      '派遣链': 'Dispatch Chain',      '当地用工人员': 'Local Employed Personnel',      '当地链': 'Local Chain',      '合规状态': 'Compliance Status',      '良好': 'Good',      '发起岗位需求': 'Initiate job requisition',      '岗位名称与人数': 'Job title and headcount',      '匹配评分规则': 'Matching scoring rules',      '恢复默认': 'Restore defaults',      '提交岗位需求': 'Submit job requisition',      '增值服务': 'Value-added services',      '签证可行性预审': 'Visa feasibility pre-screening',      '简历翻译润色': 'Resume translation and polishing',      '目的国政策问答': 'Destination country policy Q&A',      '多语言实时同传在线面试': 'Multilingual real-time interpretation online interview',      '含加急、续签': 'Including expedited processing and renewal',      '合作服务商': 'Partner service provider',      '百万级保额': 'Million-level coverage',      '工资代发与国际结汇': 'Payroll disbursement and international settlement',      '多币种跨境支付': 'Multi-currency cross-border payment',      '当地备案代办': 'Local filing agency',      '工作许可、居留许可': 'Work permit, residence permit',      '账单编号': 'Bill number',      '周期': 'Period',      '核对': 'Verify',      '异议': 'Objection',      '案例实证': 'Case Evidence',      '阿尔及利亚外国员工工作许可': 'Work Permit for Foreign Employees in Algeria',      '办理周期与材料清单': 'Processing Timeline and Document Checklist',      '渠道库': 'Channel Library',      '目的国当地招聘渠道': 'Local Recruitment Channels in Destination Country',      '本地招聘平台、职业介绍所、社区渠道清单及使用建议': 'List of Local Recruitment Platforms, Employment Agencies, and Community Channels with Usage Recommendations',      '模板': 'Templates',      '外派人员劳动合同（中阿双语）': 'Labor Contract for Expatriate Personnel (Chinese-Arabic Bilingual)',      '流程': 'Process',      '结算对账与发票流程': 'Settlement Reconciliation and Invoicing Process',      '导出报告': 'Export Report',      '在岗人员趋势': 'Trend of On-duty Personnel',      '添加成员': 'Add member',      '节点自动推送': 'Automatic node push',      '保险续保': 'Insurance renewal',      '资讯': 'Information',      '面试安排': 'Interview arrangement',      '申请调整成员权限': 'Apply to adjust member permissions',      '暂无待审批事项': 'No pending approvals',      '企业成员': 'Enterprise members',      '查看项目': 'View project',      '维护项目': 'Maintain Project',      '查看账单': 'View Bill',      '确认账单/异议': 'Confirm Bill/Dispute',      '服务下单': 'Service Order',      '查看员工材料': 'View Employee Materials',      '查看消息': 'View Messages',      '成员': 'Members',      '当前账号': 'Current Account',      '编辑权限': 'Edit Permissions',      '财务专员': 'Finance Specialist',      '项目经理': 'Project Manager',      '离线': 'Offline',      '选择岗位': 'Select Position',      '匹配分析': 'Match Analysis',      '全部分析': 'Analyze All',      '收藏夹': 'Favorites',      '评分规则': 'Scoring Rules',      '条件': 'Conditions',      '持证': 'Certified',      '仅门槛通过': 'Threshold Passed Only',      '有健康证': 'Has Health Certificate',      '有驻外经历': 'Has Overseas Experience',      '仅已投递': 'Applied Only',      '中专及以上': 'Secondary vocational school and above',      '大专及以上': 'College diploma or above',      '本科及以上': 'Bachelor\'s degree or above',      '排序': 'Sort',      '综合排序': 'Comprehensive sort',      '经验优先': 'Experience preferred',      '到岗优先': 'Availability preferred',      '按姓名': 'By name',      '李国强': 'Li Guoqiang',      '注塑领班': 'Injection Molding Foreman',      '赵海涛': 'Zhao Haitao',      '部分': 'Partial',      '吴天成': 'Wu Tiancheng',      '吴卫东': 'Wu Weidong',      '张春生': 'Zhang Chunsheng',      '高俊杰': 'Gao Junjie',      '黄立新': 'Huang Lixin',      '李跃进': 'Li Yuejin',      '马立新': 'Ma Lixin',      '何长顺': 'He Changshun',      '赵国强': 'Zhao Guoqiang',      '徐瑞祥': 'Xu Ruixiang',      '罗国庆': 'Luo Guoqing',      '徐天成': 'Xu Tiancheng',      '郭少华': 'Guo Shaohua',      '全周期阶段': 'Full-cycle Stages',      '在途人员': 'Personnel in Transit',      '全球派遣网络': 'Global Dispatch Network',      '目的国口径': 'Destination Country Details',      '雇主须先取得使用外籍劳工批复': 'The employer must first obtain approval to employ foreign workers',      '劳动合同与社保登记同步': 'Labor contract and social insurance registration are processed simultaneously',      '工作许可（配额制）': 'Work permit (quota system)',      '年度配额、传染病筛查、部分岗位需职业资质': 'Annual quota, infectious disease screening, occupational qualifications required for some positions',      '持续': 'Ongoing',      '签证办理中': 'Visa processing in progress',      '合同待签': 'Contract pending signing',      '合同一致性待复核': 'Contract consistency pending review',      '本期应急事件': 'Emergency incidents this period',      '主链路泳道': 'Main process swimlane',      '签证办理': 'Visa processing',      '待处理风险': 'Pending Risks',      '欠薪风险': 'Wage Arrears Risk',      '处置': 'Handle',      '证照过期': 'Expired Licenses',      '签证补件': 'Visa Supplementary Documents',      '合同不一致': 'Contract Inconsistency',      '审计结果': 'Audit Results',      '人员': 'Personnel',      '薪资一致': 'Salary Consistent',      '工时一致': 'Working Hours Consistent',      '保险一致': 'Insurance Consistent',      '解约一致': 'Contract Termination Consistent',      '一致': 'Consistent',      '李强': 'Li Qiang',      '王芳': 'Wang Fang',      '赵磊': 'Zhao Lei',      '不一致': 'Inconsistent',      '需复核': 'Needs review',      '陈静': 'Chen Jing',      '具体税务处理建议咨询专业税务师': 'For specific tax treatment, it is recommended to consult a professional tax advisor',      '新建工单': 'New Ticket',      '工单列表': 'Ticket List',      '处理中': 'In Progress',      '闭环': 'Closed',      '已闭环': 'Closed',      '待分派': 'Pending Assignment',      '已处理': 'Processed',      '最近记录': 'Recent Records',      '动作': 'Action',      '操作人': 'Operator',      '导出报表': 'Export Report',      '证照齐全率': 'License Completeness Rate',      '签证预审通过率': 'Visa Pre-screening Pass Rate',      '合同一致性通过率': 'Contract Consistency Pass Rate',      '数据库': 'Database'
    ,
      '已连接后端': 'Backend connected',      '实时数据': 'Real-time data',      '一键呼叫': 'One-Tap Call',      '我的待办': 'My To-Dos',      '影响签证预审': 'Affects visa pre-review',      '已签署': 'Signed',      '紧急': 'Emergency',      '开始引导': 'Start Guidance',      '审批意见': 'Approval opinion',      '材料齐备': 'Materials complete',      '同意垫付': 'Agree to advance payment',      '已通过': 'Approved',      '合计': 'Total',      '学历证明': 'Education Certificate',      '已上传': 'Uploaded',      '查看详情': 'View details',      '虚拟': 'Virtual',      '已纳入': 'Included',      '已核验': 'Verified',      '已生效': 'Effective',      '已投保': 'Insured',      '一键触达': 'One-tap access',      '功能介绍': 'Feature introduction',      '待顾问确认': 'Pending Consultant Confirmation',      '面试中': 'Interview in progress',      '已投递': 'Applied',      '已录取': 'Hired',      '储备中': 'In talent pool',      '已放弃': 'Withdrawn',      '个税申报、税收协定、结汇合规要点': 'Key points on individual income tax filing, tax treaties, and foreign exchange settlement compliance',      'AI 问答参考，非法律意见': 'AI Q&A reference, not legal advice',      '重大事项请转顾问或专业复核': 'For important matters, please refer to a consultant or professional review',      '投递于': 'Submitted at',      '待办': 'To-do',      '进行中': 'In progress',      '已完成': 'Completed',      '待开始': 'Not started',      '4月': 'April',      '5月': 'May',      '6月': 'June',      '7月': 'July',      '8月': 'August',      '9月': 'September'
    ,
      '已进入工作台': 'Workspace opened',      '当前身份：{role} · 已连接后端': 'Role: {role} · Backend connected',      '当前身份：{role}（演示）': 'Role: {role} (demo)',      '演示模式': 'Demo mode',      '「{a}」为前端原型交互，暂未接入后端': '"{a}" is a front-end prototype interaction, not yet connected to the backend',      '{n} 项 · 影响签证预审': '{n} item(s) · affects visa pre-check',      '来源：{s} · 仅供参考': 'Source: {s} · for reference only',      '还有 {n} 项待办': '{n} tasks remaining',      '共 {n} 个岗位': '{n} jobs total',      '共 {a} 位候选人': '{a} candidates total',      '共 {n} 条': '{n} records',      '第 {a}/{b} 页': 'Page {a} of {b}',      '已选 {n} 个': '{n} selected',      '{n} 天后到期': 'Expires in {n} days',      '还有 {n} 位未读': '{n} unread',      '已完成 {a}/{b}': 'Completed {a}/{b}',      '共 {n} 条记录': '{n} records total'
    ,
      '策略页可调，保存即生效': 'Adjustable on the policy page, effective on save',      '策略页可调': 'Adjustable on policy page',      '保存即生效': 'Effective on save',      '其中高风险 {n} 条': '{n} high-risk',      '已复核 {n} 条': '{n} reviewed',      '出海顾问': 'Overseas Advisor',      '合同一致性审计员': 'Contract Consistency Auditor',      '签证材料预审员': 'Visa Document Pre-checker',      '风险分诊员': 'Risk Triage Agent',      '结算核对员': 'Settlement Checker',      '文书翻译与润色': 'Document Translation & Editing',      '其中高风险': 'high-risk items',      '已复核': 'Reviewed',      '结论': 'Conclusion',      '预审': 'Pre-check',      '还不能送签': 'cannot be submitted yet',      '缺 {n} 项材料': '{n} documents missing',      '缺': 'Missing',      '项材料': 'documents',      '硬性阻断项': 'hard blocker',      '天内到期': 'days to expiry',      '得先处理': 'must handle first',      '齐套率': 'Completeness',      '补齐后可使馆受理': 'once complete the embassy will accept it',      '作为参考': 'for reference',      '知识库条目': 'knowledge base entry',      '审计结果': 'Audit result',      '有没有不一致的地方': 'any inconsistencies',      '签证进度': 'visa progress',      '到哪一步了': 'what stage it is at',      '需要什么材料': 'what documents are needed'
    ,
      '机械操作工': 'Machine operator',      '酒店服务员': 'Hotel attendant',      '电子厂普工': 'Electronics factory worker',      '装配技术员': 'Assembly technician',      '食品包装工': 'Food packing worker',      '高薪': 'High pay',      '急招': 'Urgent hire',      '推荐': 'Recommended',      '地点': 'Location',      '所在地': 'Location',      '薪资': 'Salary',      '工期': 'Duration',      '技能': 'Skills',      '经验': 'Experience',      '中国·上海': 'China · Shanghai',      '日本·东京': 'Japan · Tokyo',      '德国·柏林': 'Germany · Berlin',      '阿联酋·迪拜': 'UAE · Dubai',      '新加坡': 'Singapore',      '2年': '2 years',      '3年': '3 years',      '1年': '1 year',      '全球态势': 'Global situation',      '拖动旋转 · 滚轮缩放 · 点击卡片下钻': 'Drag to rotate · Scroll to zoom · Click a card to drill down',      '匹配度': 'Match score',      '待补充': 'To add',      '需 中级职业资格证': 'Requires intermediate vocational certificate',      '在分析中': 'Analysing',      '分析中': 'Analysing',      '个对象': 'objects',      '状态': 'Status',      '推理阶段': 'Reasoning stage',      '耗时': 'Duration',      '模型': 'Model',      '全局': 'Global',      '自动演示': 'Auto demo',      '跳到结果': 'Jump to result',      '已暂停': 'Paused',      '重放': 'Replay',      '查看结果': 'View result',      '当前岗位': 'Current position',      '推理过程': 'Reasoning process',      '分项得分': 'Score breakdown'
    ,
      '我的偏好权重': 'My preference weights',      '权重会归一化到': 'Weights are normalised to',      '默认值即原始评分': 'Defaults are the original scoring',      '还缺': 'Still missing',      '份材料': 'documents',      '技能缺口': 'Skill gaps',      '调试': 'Debugging',      '检测': 'Inspection',      '中式烹饪': 'Chinese cooking',      '食堂管理': 'Canteen management',      '总账核算': 'General ledger',      '税务申报': 'Tax filing',      '编程': 'Programming',      '确认撤回申请？': 'Withdraw this application?',      '撤回后本次申请将终止': 'The application will end after withdrawal',      '如需重新申请需重新走流程': 'You must go through the process again to reapply',      '确认撤回': 'Confirm withdrawal',      '确定撤回对': 'Withdraw the application for',      '的投递吗': '?',      '撤回后可重新投递': 'You can apply again after withdrawing',      '但已进行的面试安排会取消': 'but scheduled interviews will be cancelled',      '确定撤回': 'Confirm withdrawal',      '在线对话': 'Online chat',      '签证现在办到哪一步了': 'What stage is my visa at?',      '出发前需要准备哪些材料': 'What documents do I need before departure?',      '准备材料': 'Prepare documents',      '工资什么时候发放': 'When are wages paid?',      '怎么发': 'How is it paid?',      '工资发放': 'Wage payment',      '境外遇到问题怎么联系你': 'How do I reach you overseas?',      '我与派遣公司': 'Me and the dispatch agency',      '服务合同': 'Service contract',      '签署状态': 'Signature status',      '签署日期': 'Signed on',      '本页为系统生成的合同副本': 'This page is a system-generated copy of the contract',      '甲方': 'Party A',      '乙方': 'Party B',      '派遣方': 'Dispatcher',      '环球派遣': 'Global Dispatch',      '国外雇主': 'Overseas employer',      '劳务合作合同': 'Labour cooperation contract',      '派遣公司与国外雇主': 'Dispatch agency and overseas employer'
    ,
      'AI 助手': 'AI Assistant',      '你好，我是海外派遣 AI 助手。可以问我签证材料、合同须知、维权流程等问题。': 'Hello, I am the overseas dispatch AI assistant. Ask me about visa documents, contract basics or rights protection.',      '仅供参考 · 非法律意见': 'For reference only · not legal advice',      '输入问题…': 'Ask a question…',      '输入问题...': 'Ask a question…',      '选择智能体': 'Choose agent',      '当前有多少待处理风险': 'How many risks are pending?',      '合同不一致的项目': 'Projects with contract mismatches',      '今日应急事件': 'Today\'s emergencies',      '发送': 'Send',      '发送中': 'Sending',      '助手正在思考…': 'Assistant is thinking…',      '智能体正在查询业务数据…': 'The agent is querying business data…',      '服务说明': 'Service description',      '处置': 'Handle',      '确认': 'Confirm',      '确认退出': 'Confirm logout',      '退出登录': 'Sign out',      '退出后需要重新选择身份进入。': 'You will need to pick a role to sign in again.',      '岗位市场': 'Job market',      '离线模式：岗位库由后端提供，请先启动服务。': 'Offline mode: the job library is served by the backend. Start the service first.',      '未连接后端，无法派单。': 'Not connected to the backend, cannot dispatch.',      '将按风险等级生成应急工单并分派给保障部坐席。': 'An emergency ticket will be created by risk level and assigned to a support agent.',      '该培训已完成，可查看结业证明。': 'This training is complete; you can view the certificate.',      '该培训尚未完成，完成后才能出境。': 'This training is not complete; it is required before departure.',      '办理进度': 'Processing status',      '当前状态：办理中': 'Status: processing',      '材料已提交': 'Documents submitted',      '合规检查清单': 'Compliance checklist',      '雇主资质：已核验': 'Employer credentials: verified',      '添加成员': 'Add member',      '账单核对': 'Bill reconciliation',      '提交异议': 'Raise a dispute',      '结算明细': 'Settlement details',      '离线模式：无法读取后端明细。': 'Offline mode: backend details unavailable.',      '知道了': 'Got it',      '查看详情': 'Details',      '关闭': 'Close',      '取消': 'Cancel',      '保存': 'Save',      '删除': 'Delete',      '替换': 'Replace',      '上传': 'Upload',      '下载': 'Download',      '预览': 'Preview'
        }
  };

  /* ---------- 法语词典 ---------- */
  DICT.fr = {
    '岗位发现': 'Offres d\'emploi',
    '我的求职': 'Mes candidatures',
    '我的主页': 'Accueil',
    '合同与证照': 'Contrats et documents',
    '海外保障中心': 'Assistance à l\'étranger',
    '出海知识库': 'Base de connaissances',
    '我的档案': 'Mon profil',
    '消息与顾问': 'Messages',
    '概览台': 'Vue d\'ensemble',
    '项目管理': 'Projets',
    '服务台': 'Support',
    '知识库': 'Base de connaissances',
    '报表': 'Rapports',
    '全球态势': 'Vue globale',
    '审批': 'Approbations',
    '操作日志': 'Journal d\'audit',
    '投递管理': 'Candidatures',
    '候选人发现': 'Recherche de talents',
    '全生命周期看板': 'Tableau de cycle de vie',
    '智能体治理': 'Gouvernance des agents',
    '应急事件工单': 'Tickets d\'incident',
    '审计日志': 'Journal d\'audit',
    '合规报表': 'Rapports de conformité',
    '筛出合适岗位，收藏 / 投递 / 一键 AI 分析': 'Filtrez les offres, sauvegardez, postulez ou lancez l\'analyse IA',
    '清空筛选': 'Effacer les filtres',
    '分析已选': 'Analyser la sélection',
    '全部岗位分析': 'Analyser toutes les offres',
    '收藏': 'Sauvegarder',
    '取消收藏': 'Retirer',
    '投递': 'Postuler',
    '投递简历': 'Postuler',
    '查看详情': 'Détails',
    '关闭': 'Fermer',
    '取消': 'Annuler',
    '保存': 'Sauvegarder',
    '返回': 'Retour',
    '搜索': 'Rechercher',
    '刷新': 'Actualiser',
    '应聘者': 'Candidat',
    '企业': 'Employeur',
    '保障部': 'Assistance',
    '概览': 'Vue d\'ensemble',
    '风险预警': 'Alertes de risque',
    '全部': 'Tous',
    '发送': 'Envoyer',
    '删除': 'Supprimer',
    '编辑': 'Modifier',
    '上传': 'Téléverser',
    '下载': 'Télécharger',
    '预览': 'Aperçu',
    '查看': 'Voir',
    '详情': 'Détails',
    '状态': 'Statut',
    '类型': 'Type',
    '时间': 'Heure',
    '操作': 'Actions',
    '加载中…': 'Chargement…',
    '暂无数据': 'Aucune donnée',
    '正在加载…': 'Chargement…',
    '确定': 'OK',
    '确认': 'Confirmer',
    '是': 'Oui',
    '否': 'Non',
    '推理中': 'Raisonnement',
    '打分中': 'Notation',
    '已完成': 'Terminé',
    '完成': 'Fait',
    '待机': 'En attente',
    '技能': 'Compétences',
    '薪资': 'Salaire',
    '可用性': 'Disponibilité',
    '查看结果': 'Voir le résultat',
    '招聘': 'Postes',
    '已投递': 'Postulé',
    '未投递': 'Non postulé',
    '匹配分': 'Score de correspondance',
    '推理': 'Raisonnement',
    '亮点': 'Points forts',
    '阿尔及利亚': 'Algérie',
    '阿尔及尔': 'Alger',
    '技能岗': 'Qualifié',
    '包食宿': 'Repas et logement',
    '往返机票': 'Billets aller-retour',
    '越南': 'Viêt Nam',
    '管理岗': 'Encadrement',
    '双休': 'Week-ends libres',
    '驻外补贴': 'Prime d\'expatriation',
    '哈萨克斯坦': 'Kazakhstan',
    '阿拉木图': 'Almaty',
    '技术岗': 'Technique',
    '五险一金': 'Assurance sociale',
    '带薪年假': 'Congés payés',
    '沙特阿拉伯': 'Arabie saoudite',
    '利雅得': 'Riyad',
    '新项目': 'Nouveau projet',
    '住房补贴': 'Indemnité logement',
    '奥兰': 'Oran',
    '合同可续': 'Contrat renouvelable',
    '胡志明市': 'Hô Chi Minh-Ville',
    '年终奖': 'Prime annuelle',
    '胡志明': 'Hô Chi Minh-Ville',
    '印度尼西亚': 'Indonésie',
    '雅加达': 'Jakarta',
    '坦桑尼亚': 'Tanzanie',
    '墨西哥': 'Mexique',
    '当前岗位': 'Offre actuelle',
    '候选人': 'Candidat',
    '自动演示': 'Démo auto',
    '已暂停': 'En pause',
    '推理过程': 'Processus de raisonnement',
    '匹配评分': 'Score de correspondance',
    '候选人排名': 'Classement des candidats',
    '匹配结论': 'Conclusion',
    '风险': 'Risques',
    '面试建议': 'Questions d\'entretien',
    '成长路径': 'Parcours de progression',
    '档案调节台': 'Réglage du profil',
    '薪资期望': 'Salaire attendu',
    '到岗时间': 'Disponibilité',
    '从业年限': 'Années d\'expérience',
    '双向智能匹配': 'Correspondance IA bidirectionnelle',
    '跳到结果': 'Aller au résultat',
    '重播': 'Rejouer',
    '读取中…': 'Chargement…',
    '薪酬与结算': 'Paie et règlements',
    'AI 候选人匹配': 'Correspondance IA des candidats',
    '消息与成员': 'Messages et membres',
    '全球用工态势': 'Main-d\'œuvre mondiale',
    '风险与合规': 'Risques et conformité',
    '审计': 'Audit',
    '治理': 'Gouvernance',
    '工单': 'Tickets',
    '报告与对账': 'Rapports et rapprochement',
    '匹配分析结果': 'Résultats de correspondance',
    '岗位详情': 'Détails de l\'offre',
    '消息中心': 'Centre de messages',
    '全球能力矩阵': 'Matrice des capacités mondiales',
    '风险预警中心': 'Centre d\'alertes de risque',
    '合同一致性审计': 'Audit de cohérence des contrats',
    '审批中心': 'Centre d\'approbation',
    'AI 匹配推荐': 'Correspondance IA',
    '按岗位要求给候选人打分排名，点「AI 解释」看证据、差距与面试建议': 'Classez les candidats selon les exigences ; ouvrez l\'explication IA pour les preuves et les écarts',
    '重新计算': 'Recalculer',
    '进入分析': 'Ouvrir l\'analyse',
    '查看岗位': 'Voir l\'offre',
    '海外用工派遣平台': 'Plateforme mondiale de détachement de main-d\'œuvre',
    '主申请 + 历史机会 · 全链路进度透明': 'Candidature principale + opportunités passées · Transparence complète du parcours',
    '按你的技能、证书、薪资与到岗时间，实时计算每个岗位的匹配度与差距': 'Score de correspondance en temps réel pour chaque offre selon vos compétences, certificats, salaire et disponibilité',
    '完整岗位排名与匹配分，可查看详情、投递简历、收藏岗位': 'Classement complet avec scores ; voir les détails, postuler ou sauvegarder',
    '企业发布的岗位信息 · 可返回分析界面': 'Offre publiée par l\'employeur · retour à l\'analyse à tout moment',
    '三份合同一致性校验 · 证照有效期与续签提醒': 'Vérification de cohérence des trois contrats · validité des documents et rappels de renouvellement',
    '遇到问题别慌：欠薪、伤病、证件丢失、纠纷，一步步带你处理': 'Pas de panique : salaires impayés, blessure, documents perdus, litiges — accompagnement étape par étape',
    '我该拿多少、拿到没 · 跨境到账状态': 'Combien vous devriez gagner, si c\'est arrivé · statut transfrontalier',
    '我能做什么 · 出海前必读 · 遇到问题怎么办': 'Ce que je peux faire · Essentiels avant le départ · Que faire en cas de problème',
    '一次上传，多处复用 · 投递新岗位自动带出': 'Téléversez une fois, réutilisez partout · rempli automatiquement lors de la candidature',
    '三方在线沟通 · 顾问 / 企业 / 保障部 · 节点通知': 'Discussion à trois · Conseiller / Employeur / Assistance · Notifications d\'étapes',
    '月度用工与结算报告': 'Rapport mensuel de main-d\'œuvre et de règlement',
    '双轨用工（中方派遣 + 当地用工）统一视图': 'Vue unifiée du double dispositif (détachement chinois + recrutement local)',
    '查看主动投递简历的候选人，勾选后可匹配分析、邀面试、发 offer': 'Candidats ayant postulé directement ; sélectionnez pour analyser, inviter à un entretien ou envoyer une offre',
    '主动挖掘未投递简历的候选人，按条件筛选后可直接邀约': 'Découvrez les candidats n\'ayant pas postulé ; filtrez et invitez directement',
    '完整排名与匹配分，可查看详情、邀面试、发 offer': 'Classement complet avec scores ; voir les détails, inviter à un entretien ou envoyer une offre',
    '岗位需求、服务进度、电子签署与结算对账': 'Demandes de poste, avancement du service, signature électronique et rapprochement',
    '目的国政策、招聘渠道与文书模板': 'Politiques du pays de destination, canaux de recrutement et modèles de documents',
    '月度用工报告、合规健康度、结算明细与发票': 'Rapports mensuels, santé de la conformité, détails de règlement et factures',
    '业务节点消息推送与企业成员权限管理': 'Notifications d\'étapes et gestion des permissions des membres',
    '目的国签证 / 许可口径 · 平均周期 · 合规要点 · 在办项目': 'Règles de visa/permis par pays · délai moyen · points de conformité · projets actifs',
    '人员 / 项目从投递到回流的关键卡点': 'Points clés de la candidature au retour pour les personnes et les projets',
    '聚合欠薪、证照过期、签证补件、保险到期、合同不一致': 'Regroupe salaires impayés, documents expirés, compléments de visa, expiration d\'assurance et incohérences de contrat',
    '按项目 / 按人批量审计三份合同关键条款': 'Audit par lot des clauses clés des trois contrats par projet ou par personne',
    '抽检复核 · 高风险拦截 · 配额与停用，把「模型说了算」变成可管可查': 'Contrôle par échantillonnage · blocage à haut risque · quotas et suspension — des décisions IA gérables et auditables',
    '报案 → 分派 → 处置 → 闭环': 'Signaler → Répartir → Résoudre → Clôturer',
    '风险处置备用金申请 · 通过/驳回并回写通知': 'Demandes de fonds de prévoyance · approuver/rejeter avec notification',
    '登录、写操作、材料查看、审批与治理动作全量留痕': 'Traçabilité complète des connexions, écritures, consultations, approbations et actions de gouvernance',
    '监管报送口径 · 证照齐全率 · 签证通过率': 'Base de reporting réglementaire · taux de complétude des documents · taux d\'approbation des visas',
    '个人应聘者主页': 'Accueil candidat',
    '客户公司主页': 'Accueil entreprise cliente',
    '平台运营 · 全球风控 · 合规审计': 'Opérations · Risque mondial · Conformité',
    '提交': 'Soumettre',
    '解析岗位要求': 'Analyse des exigences du poste',
    '读取候选人画像': 'Lecture du profil du candidat',
    '硬性门槛校验': 'Vérification des exigences obligatoires',
    '技能对齐': 'Alignement des compétences',
    '薪资区间比对': 'Comparaison de fourchette salariale',
    '地点与语言': 'Lieu et langue',
    '语义复核（大模型）': 'Révision sémantique (LLM)',
    '加权计算': 'Notation pondérée',
    '生成推荐理由': 'Génération de la recommandation',
    '推荐': 'Recommandé',
    '正在分析': 'Analyse en cours',
    '证据': 'Preuve',
    '缺口': 'Écarts',
    '命中': 'Correspondance',
    '护照': 'Passeport',
    '健康证': 'Certificat médical',
    '年龄': 'Âge',
    '有效': 'Valide',
    '无效': 'Invalide',
    '缺失': 'Manquant',
    '就绪': 'Prêt',
    '通过': 'Réussi',
    '不通过': 'Échoué',
    /* 错误码 */
    'err.already_applied': 'Vous avez déjà postulé à cette offre',
    'err.job_full': 'Cette offre est déjà pourvue',
    'err.job_not_found': 'Offre introuvable ou retirée',
    'err.invalid_amount': 'Le montant doit être supérieur à 0',
    'err.amount_too_large': 'Une demande ne peut dépasser 200 000 CNY',
    'err.reason_required': 'Veuillez indiquer un motif',
    'err.too_many_pending': 'Vous avez déjà 2 demandes en attente',
    'err.note_required': 'Un motif est requis pour rejeter',
    'err.invalid_credentials': 'Numéro de téléphone ou mot de passe incorrect',
    'err.permission_denied': 'Votre compte n\'a pas cette permission',
    'err.unauthorized': 'Session expirée, veuillez vous reconnecter',
    'err.forbidden': 'Accès non autorisé à cette interface',
    'err.offline': 'Backend non connecté'
  ,
    '实时数据': 'Données en direct',    '已接入后端': 'Backend connecté',    '导出明细': 'Exporter les détails',    '下载全部': 'Tout télécharger',    '浏览更多岗位': 'Parcourir plus d\'offres',    '上传材料': 'Téléverser des documents',    '保存档案': 'Enregistrer le profil',    '进行中': 'En cours',    '待处理': 'En attente',    '待确认': 'À confirmer',    '待顾问确认': 'En attente du conseiller',    '投递于': 'Postulé le',    '面试中': 'En entretien',    '我的投递': 'Mes candidatures',    '历史与储备机会': 'Opportunités passées et en réserve',    '当前环节': 'Étape actuelle',    '材料待补': 'Documents en attente',    '体检报告': 'Rapport médical',    '预计出境': 'Départ prévu',    '以签证为准': 'Sous réserve du visa',    '我的全周期链路': 'Mon cycle complet',    '进行中申请': 'Candidature en cours',    '我的链路进度': 'Avancement de mon parcours',    '投递': 'Postulé',    '资质': 'Qualifications',    '面试': 'Entretien',    '签约': 'Contrat',    '签证': 'Visa',    '项待办': 'tâches',    '还有': 'Restantes',    '已进入': 'Entré dans',    '环节': 'étape',    '合同矩阵': 'Matrice des contrats',    '阴阳合同': 'Incohérence contractuelle',    '三份合同关键条款对比': 'Comparaison des clauses clés',    '薪资下限': 'Salaire minimum',    '薪资上限': 'Salaire maximum',    '币种': 'Devise',    '每周工时': 'Heures hebdomadaires',    '小时': 'heures',    '意外险保额': 'Couverture accident',    '解约通知期': 'Préavis',    '试用期': 'Période d\'essai',    '未发现': 'Aucun trouvé',    '风险': 'Risques',    '合同': 'Contrat',    '签约方': 'Parties',    '关键条款摘要': 'Résumé des clauses clés',    '应发': 'Brut',    '已发': 'Payé',    '基本': 'Base',    '加班': 'Heures sup.',    '津贴': 'Indemnité',    '已结汇到账': 'Réglé et reçu',    '到账状态': 'Statut du règlement',    '已结汇': 'Réglé',    '汇率': 'Taux de change',    '收入趋势': 'Tendance des revenus',    '双显': 'Les deux',    '折线图': 'Courbe',    '柱状图': 'Barres',    '基本工资': 'Salaire de base',    '总收入趋势': 'Tendance du revenu total',    '合计': 'Total',    '薪酬明细': 'Détails de paie',    '加班费': 'Heures supplémentaires',    '基本信息': 'Informations de base',    '投递时自动填充': 'Rempli automatiquement',    '姓名': 'Nom',    '手机号': 'Téléphone',    '最高学历': 'Niveau d\'études',    '初中': 'Collège',    '高中': 'Lycée',    '中专/技校': 'Professionnel',    '大专': 'Bac+2',    '本科': 'Licence',    '硕士（研究生）': 'Master',    '博士': 'Doctorat',    '技能证书': 'Certificats',    '材料清单': 'Liste des documents',    '已上传': 'Téléversé',    '身份证正反面': 'Carte d\'identité (2 faces)',    '替换': 'Remplacer',    '学历证明': 'Justificatif d\'études',    '无犯罪记录证明': 'Casier judiciaire',    '会话': 'Conversations',    '个会话': 'conversations',    '条未读': 'non lus',    '企业招聘对接': 'Recrutement employeur',    '选择左侧会话开始沟通': 'Sélectionnez une conversation',    '从左侧选择一个会话': 'Choisissez une conversation à gauche',    '通知': 'Notifications',    '实时': 'En direct',    '风险处置引导': 'Guide de gestion des risques',    '点开看': 'Appuyez pour voir',    '我该做什么': 'que faire',    '申请风险处置备用金': 'Demander le fonds de prévoyance',    '附材料清单': 'avec liste des documents',    '一键生成申诉书': 'Générer la lettre d\'appel',    '开始引导': 'Commencer',    '紧急': 'Urgent',    '应急': 'Urgence',    '助手': 'Assistant',    '参考': 'Référence',    '更新': 'Mis à jour',    '重点': 'Important',    '必读': 'À lire',    '问答参考': 'Référence Q&R',    '非法律意见': 'Pas un avis juridique',    '重大事项请转顾问或专业复核': 'Consultez un conseiller pour les cas importants',    '公司欠薪 / 跑路怎么办？': 'Impayés / employeur en fuite ?',    '引导申请风险处置备用金，附材料清单 + 一键生成申诉书': 'Guide vers le fonds de prévoyance avec liste de documents',    '在海外受伤 / 生病？': 'Blessé / malade à l\'étranger ?',    '24h 救援热线 + 保险报案 + 医疗转运说明': 'Hotline 24h + assurance + transfert médical',    '护照丢了 / 被扣了？': 'Passeport perdu / retenu ?',    '领事保护指引 + 当地使领馆联系方式 + 补办流程': 'Protection consulaire + contacts + remplacement',    '遇到劳务纠纷？': 'Litige du travail ?',    '证据链整理助手（合同/考勤/工资流水）+ 律师推荐': 'Assistant de preuves + avocat',    '高频': 'Fréquent',    '维权': 'Droits',    '平台 24h 应急热线': 'Hotline d\'urgence 24h',    '全年无休 · 中文服务': '24h/24 · Service en chinois',    '中国驻阿尔及利亚使馆领事保护': 'Ambassade de Chine – protection consulaire',    '领事保护与协助（演示号码）': 'Protection consulaire (démo)',    '阿尔及利亚工作签证要什么材料': 'Documents pour un visa de travail en Algérie ?',    '在海外遇到欠薪怎么维权': 'Réclamer des impayés à l\'étranger',    '出海劳务合同怎么看': 'Lire un contrat de travail à l\'étranger',    '个税与结汇：钱怎么合法地回国': 'Impôts et change : rapatrier légalement',    '海外安全防范与应急手册': 'Manuel de sécurité à l\'étranger',    '出海前必做的 10 件事': '10 choses avant le départ',    '风险处置备用金申请条件': 'Conditions du fonds de prévoyance',    '三份合同关键条款一致性校验通过': 'Vérification de cohérence réussie',    '已签署': 'Signé',    '境外人身意外险': 'Assurance accident à l\'étranger',    '解约提前': 'Préavis avant rupture',    '我与派遣公司《服务合同》': 'Contrat de service avec l\'agence',    '派遣公司与国外雇主《劳务合作合同》': 'Contrat de coopération',    '我与国外雇主《雇佣合同》': 'Contrat de travail',    '海外津贴': 'Indemnité d\'expatriation',    '个税代扣': 'Impôt retenu',    '社保个人部分': 'Part salariale',    '实发': 'Net à payer',    '历史发放记录': 'Historique des paiements',    '含基本工资与加班/补贴': 'Inclut salaire de base et primes',    '查看投递详情': 'Voir la candidature',    '投递报名': 'Candidature',    '简历提交 · 岗位意向确认': 'CV envoyé · Préférence confirmée',    '资质核验': 'Vérification des diplômes',    '出境': 'Départ',    '在岗': 'En poste',    '回流': 'Retour',    '我的证照': 'Mes documents',    '有效期与续签提醒': 'Validité et rappels',    '证照': 'Document',    '编号': 'Numéro',    '有效期至': 'Valable jusqu\'au',    '示例对外劳务合作公司': 'Société démo de coopération',    '阿尔及利亚某玻璃厂': 'Une verrerie en Algérie',    '演示': 'démo',    '工时': 'Heures',    '证据收集': 'Collecte de preuves',    '联系顾问': 'Contacter le conseiller',    '领事协助': 'Assistance consulaire',    '仲裁': 'Arbitrage',    '诉讼路径': 'Voie judiciaire',    '三份合同是什么': 'Que sont les trois contrats ?',    '重点看哪几条': 'Quelles clauses prioritaires',    '如何识别阴阳合同': 'Détecter les incohérences',    '个税与结汇': 'Impôts et change',    '钱怎么合法带回国': 'Rapatrier l\'argent légalement',    '个税申报': 'Déclaration fiscale',    '税收协定': 'Conventions fiscales',    '结汇合规要点': 'Points clés du change',    '手册': 'Manuel',    '治安风险': 'Risques sécuritaires',    '自然灾害': 'Catastrophes naturelles',    '政局动荡时的自救与求助流程': 'Auto-assistance en cas de troubles',    '清单': 'Liste',    '我的保单': 'Mes assurances',    '境外人身意外': 'Accident à l\'étranger',    '雇主责任': 'Responsabilité employeur',    '境外人身意外伤害保险': 'Assurance accident personnel',    '保额': 'Couverture',    '生效中': 'Actif',    '查看理赔入口': 'Guide de réclamation',    '紧急联系与领事保护': 'Contacts d\'urgence et consulat',    '一键触达': 'À portée de clic',    '呼叫': 'Appeler',    '专属顾问': 'Conseiller dédié',    '李顾问': 'Conseiller Li',    '工作日': 'Jours ouvrés',    '国内紧急联系人': 'Contact d\'urgence national',    '家属一键通知': 'Alerte famille en un clic',    '行前培训': 'Formation avant départ',    '完成培训才能出境': 'Formation obligatoire',    '安全防范与应急演练': 'Sécurité et exercices',    '目的国法律与风俗': 'Lois et coutumes',    '合同与维权须知': 'Contrat et droits',    '待完成': 'En attente',    '健康与心理适应': 'Santé et adaptation'
  ,
    '风险保障速览': 'Aperçu risques et assistance',    '出海安心四件套': 'Quatre essentiels pour partir serein',    '意外险': 'Assurance accident',    '已投保': 'Assuré',    '已生效': 'Actif',    '条待确认': 'en attente de confirmation',    '投递于': 'Postulé le',    '工作签证': 'Visa de travail',    '待办理': 'À traiter',    '办理中': 'En cours',    '跟进中': 'Suivi en cours',    '工作许可': 'Permis de travail',    '我的备用金申请': 'Mes demandes de fonds',    '笔待审批': 'en attente d\'approbation',    '待审批': 'En attente',    '欠薪垫付': 'Avance sur impayés',    '已通过': 'Approuvé',    '已驳回': 'Rejeté',    '处理': 'Traité',    '审批意见': 'Avis d\'approbation',    '材料齐备': 'Documents complets',    '同意垫付': 'Avance approuvée',    '提交': 'Soumettre',    '雇主拖欠': 'Employeur doit',    '工资': 'Salaire',    '已催告两次未果': 'Deux relances sans réponse',    '我的': 'Mon',    '含基本工资与加班/补贴': 'Inclut salaire de base et primes',    '补贴': 'Indemnité',    '高中以上学历': 'Lycée ou plus',    '毕业证': 'Diplôme',    '无犯罪记录': 'Pas de casier judiciaire',    '办理周期约': 'Délai environ',    '已上传': 'Téléversé',    '待补交': 'À fournir',    '证件照': 'Photo d\'identité',    '支持与顾问': 'Assistance et conseillers',    '企业': 'Entreprise',    '保障部坐席在线对话': 'Discuter avec un agent',    '系统与节点提醒': 'Système et étapes',    '全部已读': 'Tout marquer comme lu',    '海外派遣服务': 'Service de détachement',    '在线': 'En ligne',    '发消息': 'Envoyer un message',    '拨打': 'Appeler',    '应急': 'Urgence',    '查询': 'Rechercher',    '查看岗位': 'Voir l\'offre',    '撤销申请': 'Retirer la candidature',    '重新投递': 'Repostuler',    '状态': 'Statut',    '关闭': 'Fermer',    '取消': 'Annuler',    '确认': 'Confirmer',    '查看详情': 'Détails',    '标记已读': 'Marquer lu',    '已读': 'Lu',    '紧急': 'Urgent',    '待办': 'À faire'
  ,
    'AI 参考': 'Référence IA',    'AI 问答参考，非法律意见；重大事项请转顾问或专业复核': 'Référence Q&R IA, pas un avis juridique ; consultez un conseiller pour les cas importants',    '高中以上学历 + 毕业证/技能证书、无犯罪记录、体检报告；办理周期约 4–6 周。': 'Lycée ou plus + diplôme/certificat, casier judiciaire, rapport médical ; environ 4–6 semaines.',    '证据收集 → 联系顾问 → 申请风险处置备用金 → 领事协助 → 仲裁/诉讼路径。': 'Collecte de preuves → Conseiller → Fonds de prévoyance → Assistance consulaire → Arbitrage/litige.',    '三份合同是什么、重点看哪几条、如何识别阴阳合同。': 'Les trois contrats, les clauses clés et la détection des incohérences.',    '个税申报、税收协定、结汇合规要点。': 'Déclaration fiscale, conventions fiscales, conformité des changes.',    '治安风险、自然灾害、政局动荡时的自救与求助流程。': 'Risques sécuritaires, catastrophes naturelles et auto-assistance en cas de troubles.',    '证件备份、保险确认、合同留存、紧急联系人设置、行前培训等。': 'Sauvegardes, assurance, conservation du contrat, contacts d\'urgence, formation.',    '欠薪、跑路等情形下的垫付条件与材料。': 'Conditions et documents d\'avance en cas d\'impayés ou de fuite.',    '出海知识助手': 'Assistant connaissances',    '签证材料': 'Documents de visa',    '安全注意': 'Sécurité',    '欠薪维权': 'Impayés',    '合同要点': 'Contrat',    '更新': 'Mis à jour',    '政策': 'Politique',    '必备': 'Essentiel',    '重点': 'Important',    '必读': 'À lire',    '清单': 'Liste',    '手册': 'Manuel',    'AI 助手': 'Assistant IA'
  ,
    '点开看': 'Appuyez pour voir',    '我该做什么': 'que faire',    '境外人身意外': 'Accident personnel à l\'étranger',    '雇主责任': 'Responsabilité employeur',    '专属顾问': 'Conseiller dédié',    '李顾问': 'Conseiller Li',    '工作日': 'Jours ouvrés',    '欠薪垫付': 'Avance sur impayés',    '提交': 'Soumis',    '雇主拖欠': 'Employeur doit',    '工资': 'Salaire',    '已催告两次未果': 'Deux relances sans réponse',    '保障部坐席': 'Service d\'assistance',    '材料齐备': 'Documents complets',    '同意垫付': 'Avance approuvée',    '应发': 'Brut',    '已发': 'Payé',    '我的': 'Mon',    '收入趋势': 'Tendance des revenus',    '含基本工资与加班': 'Inclut salaire de base et heures sup.',    '合计': 'Total',    '薪酬明细': 'Détails de paie',    '应急': 'Urgence',    '投递于': 'Postulé le',    '虚拟': 'Démo',    '阴阳合同': 'Incohérence contractuelle',    '未发现': 'Aucun trouvé',    '风险': 'Risques',    '外派培训合格证': 'Certificat de formation',    '长期': 'Long terme',    '境外保险单': 'Police d\'assurance',    '凌晨好': 'Bonne nuit',    '张伟': 'Zhang Wei',    '你的': 'Votre',    '已进入': 'Entré dans',    '签证材料补交': 'Documents de visa en attente',    '环节': 'étape',    '还有': 'Restantes',    '项待办': 'tâches',    '目标': 'Objectif',    '投递': 'Postulé',    '资质': 'Qualifications',    '面试': 'Entretien',    '签约': 'Contrat',    '签证': 'Visa',    '出境': 'Départ',    '在岗': 'En poste',    '回流': 'Retour',    '查看投递详情': 'Voir la candidature',    '雇主资质': 'Qualifications employeur',    '对外劳务合作资质已核验': 'Licence de coopération vérifiée',    '已核验': 'Vérifié'
  ,
    '本月应发': 'Brut du mois',    '本月已发': 'Payé ce mois',    '基本工资': 'Salaire de base',    '总收入': 'Revenu total',    '应发': 'Brut',    '已发': 'Payé',    '海外津贴': 'Indemnité d\'expatriation',    '个税代扣': 'Impôt retenu',    '社保个人部分': 'Part salariale',    '实发': 'Net à payer',    '历史发放记录': 'Historique des paiements',    '薪酬明细': 'Détails de paie',    '收入趋势': 'Tendance des revenus',    '我的': 'Mon',    '合计': 'Total',    '应急': 'Urgence',    '专属顾问': 'Conseiller dédié',    '李顾问': 'Conseiller Li',    '境外人身意外': 'Accident à l\'étranger',    '雇主责任': 'Responsabilité employeur',    '工作日': 'Jours ouvrés',    '未发现': 'Aucun trouvé',    '风险': 'Risques',    '阴阳合同': 'Incohérence contractuelle',    '三份合同关键条款一致性校验通过': 'Vérification de cohérence réussie',    '投递于': 'Postulé le',    '应急热线': 'Hotline d\'urgence',    '一键呼叫': 'Appel en un clic',    '我的待办': 'Mes tâches',    '点击了解': 'En savoir plus',    '已纳入': 'Inclus',    '风险备用金': 'Fonds de prévoyance',    '已纳入保障通道': 'Inscrit au canal d\'assistance'
  ,
    '我的月收入趋势': 'Tendance mensuelle de mes revenus',    '本月薪酬明细': 'Détails de paie du mois',    '月份': 'Mois',    '合计': 'Total',    '加班/补贴': 'Heures sup. / primes',    '万元': '10,000 CNY',    '应急热线': 'Hotline d\'urgence',    '影响签证预审': 'Affecte la pré-vérification du visa',    '补交体检报告': 'Fournir le rapport médical',    '指定医院体检': 'Examen dans un hôpital désigné',    '截止': 'Échéance',    '去处理': 'Traiter',    '投递于': 'Postulé le',    '未发现': 'Aucun trouvé',    '风险': 'Risques',    '阴阳合同': 'Incohérence contractuelle',    '三份合同关键条款一致性校验通过': 'Vérification réussie',    '境外人身意外': 'Accident à l\'étranger',    '雇主责任': 'Responsabilité employeur',    '专属顾问': 'Conseiller dédié',    '李顾问': 'Conseiller Li',    '工作日': 'Jours ouvrés',    '欠薪垫付': 'Avance sur impayés',    '提交': 'Soumis',    '雇主拖欠': 'Employeur doit',    '月工资': 'salaire mensuel',    '已催告两次未果': 'Deux relances sans réponse',    '材料齐备': 'Documents complets',    '同意垫付': 'Avance approuvée',    '应急': 'Urgence'
  ,
    '在办项目': 'Projets en cours',    '本月账单': 'Factures du mois',    '项目健康度': 'Santé des projets',    '各环节合规与进度综合评估': 'Conformité et avancement',    '人员结构': 'Structure des effectifs',    '当前在册': 'Actuellement inscrits',    '招募匹配': 'Correspondance recrutement',    '签约合规': 'Conformité des contrats',    '证照手续': 'Documents et permis',    '在岗履约': 'Performance en poste',    '结算对账': 'Règlement',    '派遣中人员': 'Personnel détaché',    '当地雇员': 'Employés locaux',    '本月应结算': 'À régler ce mois',    '项目人力资源负责人': 'Responsable RH projet',    '今日有': 'Aujourd\'hui',    '个新项目待立项': 'nouveaux projets en attente',    '个项目在册': 'projets inscrits',    '个项目岗位': 'postes projets',    '笔账单待确认': 'factures à confirmer',    '人在册': 'inscrits'
  ,
    '结算趋势': 'Tendance des règlements',    '派遣薪酬': 'Paie des détachés',    '当地薪酬': 'Paie locale',    '待办事项': 'Tâches',    '结算账单确认': 'Confirmer la facture',    '阿尔及利亚项目 9 月账单 · 截止明日': 'Facture de septembre projet Algérie · échéance demain',    '5 名派遣人员签证材料补交': '5 détachés : documents de visa',    '学历证明扫描件 · 影响签证预审': 'Scans des diplômes · affecte la pré-vérification',    '当地雇员保险续保确认': 'Renouvellement assurance locale',    '中方派遣': 'Détachement chinois',    '储备候选人': 'Candidats en réserve',    '海外项目 HR': 'RH projet international',    '近': 'Derniers',    '周末': 'week-end',    '储蓄': 'Épargne',    '招聘渠道': 'Canaux de recrutement',    '岗位简报': 'Brief du poste',    '人才库': 'Vivier de talents',    '合规': 'Conformité',    '报表': 'Rapports'
  ,
    '海外用工派遣平台': 'Plateforme de détachement international',    '全球海外派遣 · 全周期数字化平台': 'Détachement mondial · Plateforme numérique de bout en bout',    '我是应聘者': 'Je suis candidat',    '找海外工作，全程看得见进度、合同和保障。': 'Trouvez un emploi à l\'étranger avec un suivi transparent.',    '我是企业': 'Je suis employeur',    '发布岗位、管理人员、合规结算，一站式调度。': 'Publiez des offres, gérez vos équipes, réglez en conformité.',    '演示账号一键进入': 'Entrer avec le compte démo',    '保障部入口 →': 'Portail assistance →',    '保障部入口': 'Portail assistance'
  ,
    'kbQ.visa': 'Documents de visa',    'kbQ.safety': 'Sécurité',    'kbQ.wages': 'Impayés',    'kbQ.contract': 'Contrat',    'kbQ.postJob': 'Publier une offre',    'kbQ.compliance': 'Conformité',    'kbQ.settle': 'Règles de règlement',    'kbQ.risk': 'Gestion des risques',    'kbQ.ticket': 'Traiter les tickets',    'kbQ.audit': 'Audit des contrats',    'kbQ.alert': 'Alertes risques',    'kbQ.globe': 'Vue globale',    'ai.thinking': 'L\'agent consulte les données…',    'ai.source': 'Source : ',    'ai.refOnly': ' · à titre indicatif',    'ai.failed': 'Échec de l\'agent : ',    'ai.unknown': 'erreur inconnue'
  ,
    '智能体治理': 'Gouvernance des agents',    '抽检复核 · 高风险拦截 · 配额与停用，把「模型说了算」变成可管可查': 'Contrôle par échantillonnage · interception à haut risque · quotas et suspension',    '演示数据': 'Données démo',    '刷新': 'Actualiser',    '已部署智能体': 'Agents déployés',    '版本 / 状态 / 今日调用': 'Version / statut / appels du jour',    '智能体': 'Agent',    '版本': 'Version',    '今日': 'Aujourd\'hui',    '待复核': 'À vérifier',    '状态': 'Statut',    '运行策略': 'Politique d\'exécution',    '保存后立即生效': 'Effectif immédiatement après enregistrement',    '抽检比例': 'Taux d\'échantillonnage',    '按比例随机把回答送入复核队列，用于持续评估质量': 'Envoie aléatoirement des réponses à la file de vérification',    '每日调用上限': 'Limite d\'appels quotidienne',    '应聘者 / 企业 / 保障部': 'Candidat / Employeur / Assistance',    '发送前对手机号 / 身份证 / 护照做脱敏': 'Masquer téléphone / pièce d\'identité / passeport avant envoi',    '保存策略': 'Enregistrer la politique',    '复核队列': 'File de vérification',    '条待处理': 'en attente',    '成本与用量': 'Coût et utilisation',    '按 token 估算 · 单价可在 server/.env 调整': 'Estimé par token · prix unitaire dans server/.env',    '系统状态': 'État du système',    '数据库引擎与数据规模': 'Moteur de base et volumétrie',    '读取中…': 'Chargement…',    '待审批': 'En attente',    '已通过': 'Approuvé',    '已驳回': 'Rejeté',    '审批意见': 'Avis de vérification',    '通过': 'Approuver',    '驳回': 'Rejeter',    '智能体版本': 'Version de l\'agent',    '今日调用': 'Appels du jour',    '抽检': 'Échantillonnage',    '停用': 'Désactivé',    '启用': 'Activé',    '候选人发现': 'Découverte de talents',    '投递管理': 'Gestion des candidatures',    '项目管理': 'Gestion des projets',    '概览台': 'Vue d\'ensemble',    '服务台': 'Service d\'assistance',    '报告与对账': 'Rapports et règlement',    '成员与权限': 'Membres et permissions',    '全球态势': 'Vue mondiale',    '全球能力矩阵': 'Capacités mondiales',    '全周期看板': 'Tableau du cycle de vie',    '风险预警': 'Alertes risques',    '合同审计': 'Audit des contrats',    '工单': 'Tickets',    '审计日志': 'Journal d\'audit',    '报表': 'Rapports'
  ,
    '三个身份合计': 'Total des trois rôles',    '其中高风险': 'dont à haut risque',    '复核通过率': 'Taux de validation',    '已复核': 'Vérifié',    '策略页可调': 'Réglable sur la page politique',    '保存即生效': 'Effectif à l\'enregistrement',    '出海顾问': 'Conseiller international',    '启用中': 'Activé',    '合同一致性审计员': 'Auditeur de cohérence des contrats',    '签证材料预审员': 'Pré-vérificateur de visa',    '风险分诊员': 'Agent de triage des risques',    '结算核对员': 'Vérificateur de règlement',    '文书翻译与润色': 'Traduction et révision de documents',    '今日用量': 'Utilisation du jour',    '条记录': 'enregistrements',    '高风险': 'Risque élevé',    '风险命中': 'Détections de risque',    '含证件或手机号': 'Contient pièce d\'identité ou téléphone',    '结论': 'Conclusion',    '预审': 'Pré-vérification',    '项材料': 'documents',    '其中': 'dont',    '缺什么': 'Ce qui manque',    '指定医院体检报告': 'Rapport médical d\'un hôpital désigné',    '个月内': 'mois',    '这是阻断项': 'C\'est bloquant',    '截止': 'Échéance',    '还有': 'Restant',    '护照': 'Passeport',    '有效期': 'Valable jusqu\'au',    '个月': 'mois',    '系统显示': 'Le système indique',    '未上传': 'Non téléversé',    '到期': 'expire',    '满足': 'conforme',    '打回': 'Renvoyé',    '天内到期': 'jours avant expiration',    '待办截止': 'Tâche due',    '只剩': 'seulement',    '必须去阿方认可的指定医院做': 'Doit être fait dans un hôpital agréé par l\'Algérie',    '普通医院的体检单不认': 'Les rapports d\'hôpital ordinaire ne sont pas acceptés',    '本身完全够用': 'est largement suffisant',    '扫描件没传': 'le scan n\'a pas été téléversé',    '不是要换护照': 'pas besoin de renouveler le passeport',    '先确认是': 'Confirmez d\'abord si',    '你名下护照': 'Votre passeport',    '有效期到': 'valable jusqu\'au',    '这是当前唯一卡住流程的材料': 'C\'est le seul document bloquant',    '你护照本身是有效的': 'Votre passeport est valide',    '护照页未上传': 'Page de passeport non téléversée',    '帮我预审签证材料': 'Pré-vérifier mes documents de visa',    '还不能送签': 'ne peut pas encore être soumis',    '也是你当前唯一的待办': 'et c\'est votre seule tâche en attente',    '所以大概率只是': 'donc c\'est probablement juste',    '需要一起处理': 'à traiter ensemble',    '而且你手上还有一项证照快到期': 'et un document expire bientôt',    '个月内有效': 'valide dans les mois',    '项是硬性阻断项': 'sont des blocages stricts'
  ,
    '证件通过': 'Documents validés',    '当前显示': 'Affichage',    '中式厨师': 'Chef de cuisine chinoise',    '员工食堂': 'Cantine du personnel',    '驻外会计': 'Comptable expatrié',    '中文': 'Chinois',    '生产主管': 'Responsable de production',    '中方负责人': 'Responsable côté chinois',    '关键条件': 'Exigences clés',    '期望薪资': 'Salaire souhaité',    '工作年限': 'Années d\'expérience',    '驻外经历': 'Expérience à l\'étranger',    '点击查看完整简历': 'Voir le CV complet',    '邀面试': 'Convier à un entretien',    '到岗': 'Disponible',    '期望': 'Souhaité',    '证件': 'Documents',    '齐全': 'Complet',    '上一页': 'Précédent',    '下一页': 'Suivant',    '厨师长': 'Chef de cuisine',    '中级职业资格证': 'Certificat professionnel intermédiaire',    '技校': 'École professionnelle',    '大专': 'Bac+2',    '本科': 'Licence',    '初中': 'Collège',    '高中': 'Lycée',    '硕士': 'Master',    '博士': 'Doctorat'
  ,
    '小时': 'heures',    '分钟': 'minutes',    '万元': '10 000 CNY',    '待处理': 'en attente',    '条记录': 'enregistrements',    '全部': 'Tous',    '全部已读': 'Tout marquer comme lu',    '已全部读取': 'Tout chargé',    '暂无数据': 'Aucune donnée',    '加载中': 'Chargement'
  ,
    '随机抽检': 'Échantillonnage aléatoire',    '业务对象': 'objets métier',    '运行记录': 'enregistrements d\'exécution',    '复核记录': 'enregistrements de vérification',    '签证结果承诺': 'promesse de résultat de visa',    '法律定性表述': 'qualification juridique',    '知识库条目': 'entrée de la base de connaissances',    '共': 'total',    '待复核': 'à vérifier',    '已复核': 'vérifié',    '抽检': 'échantillonnage',    '治理': 'gouvernance',    '策略': 'politique',    '配额': 'quota',    '拦截': 'interception',    '脱敏': 'masquage',    '模型': 'modèle',    '费用': 'coût',    '用量': 'utilisation',    '调用': 'appels'
  ,
    '中方派遣': 'Détachement chinois',    '当地用工': 'Emploi local',    '本月用工报告': 'Rapport mensuel des effectifs',    '派遣': 'Détachement',    '当地': 'Local',    '出勤率': 'Taux de présence',    '无合规预警项': 'Aucune alerte de conformité',    '本月派遣薪酬结算': 'Règlement de paie des détachés',    '当地雇员薪酬结算': 'Règlement de paie locale',    '示例数据': 'Données d\'exemple',    '结算明细': 'Détails du règlement',    '口径': 'Base de calcul',    '结算单': 'Note de règlement',    '结算单号': 'N° de règlement',    '项目': 'Projet',    '类别': 'Catégorie',    '金额': 'Montant',    '发票': 'Facture',    '中方派遣薪酬': 'Paie des détachés chinois',    '当地雇员薪酬': 'Paie des employés locaux',    '未开票': 'Non facturé',    '已确认': 'Confirmé',    '已开票': 'Facturé',    '沙特': 'Arabie saoudite',    '沙特阿拉伯': 'Arabie saoudite',    '中国': 'Chine',    '双轨用工': 'Effectifs à double voie',    '许可': 'Permis',    '学历与无犯罪记录公证': 'Diplôme et casier notariés',    '双认证': 'Double authentification',    '指定医院体检': 'Examen dans un hôpital désigné',    '有效': 'Valide',    '配额制': 'Sous quota',    '学历': 'Études',    '无犯罪': 'Casier vierge',    '齐套率': 'Taux de complétude',    '补件': 'Pièces complémentaires',    '保险': 'Assurance',    '离职': 'Départ',    '回国': 'Retour au pays',    '每段有交付物与': 'Chaque étape a des livrables et',    '工作许可': 'Permis de travail',    '暂住卡': 'Carte de séjour',    '工作签证': 'Visa de travail',    '运行中': 'En cours',    '筹备': 'En préparation',    '可开通': 'Disponible',    '平均周期': 'Durée moyenne',    '关键合规要点': 'Points de conformité',    '在办': 'En cours',    '国家': 'Pays',    '目的地口径': 'Exigences par destination',    '全周期 8 阶段': '8 étapes du cycle de vie',    '交付物与 SLA': 'Livrables et SLA'
  ,
    '分项得分': 'Détail des scores',    '推荐理由': 'Pourquoi recommandé',    '风险提示': 'Points de risque',    '推理过程': 'Processus de raisonnement',    '候选人期望': 'Le candidat attend',    '岗位区间': 'Fourchette du poste',    '具备议价空间': 'marge de négociation',    '地点匹配': 'Correspondance du lieu',    '无语言要求': 'Aucune exigence linguistique',    '区间内': 'Dans la fourchette',    '岗位匹配结果': 'Résultats de correspondance',    '分项': 'Détail',    '得分': 'Score',    '匹配度': 'Score de correspondance',    '推荐': 'Recommandé',    '完整简历': 'CV complet',    '返回排名': 'Retour au classement',    '返回分析界面': 'Retour à l\'analyse',    '切换岗位': 'Changer de poste',    '本地服务': 'Service local',    '解析岗位要求': 'Analyse des exigences',    '读取候选人档案': 'Lecture du profil',    '硬性条件闸门': 'Filtre des critères',    '技能匹配': 'Correspondance des compétences',    '薪资区间比对': 'Comparaison des salaires',    '地点与语言': 'Lieu et langue',    '语义复核（大模型）': 'Vérification sémantique',    '加权计算': 'Score pondéré',    '生成推荐': 'Génération de recommandation',    '已完成': 'Terminé',    '进行中': 'En cours',    '条证据': 'points de preuve',    '条差距': 'écarts',    '置信度': 'Confiance',    '耗时': 'durée',    '规则分': 'Score de règles',    '自定义权重': 'Poids personnalisés',    '门槛通过': 'Seuil franchi',    '证据': 'Preuve',    '差距': 'Écarts',    '技能': 'Compétences',    '证书': 'Certificats',    '薪资': 'Salaire',    '地点': 'Lieu',    '经验': 'Expérience',    '可用性': 'Disponibilité',    '合格': 'Qualifié',    '待定': 'À déterminer',    '同传面试': 'Entretien interprété',    '雇主确认录用': 'Embauche confirmée'
  ,
    '停止': 'Arrêter',    '下一步': 'Suivant',    '面试匹配': 'Correspondance d\'entretien',    '合同签署': 'Signature du contrat',    '出境办理': 'Formalités de départ',    '期满回流': 'Retour à l\'expiration du contrat',    '我的专属顾问': 'Mon conseiller dédié',    '电话': 'Téléphone',    '我的收藏': 'Mes favoris',    '阿尔及利亚玻璃制品工厂': 'Usine de produits en verre en Algérie',    '企业已核验': 'Entreprise vérifiée',    '补充材料': 'Documents complémentaires',    '查看合同': 'Voir le contrat',    '撤回申请': 'Retirer la candidature',    '注塑调机技师': 'Technicien de réglage de machines à injection',    '展开': 'Développer',    '顾问确认': 'Confirmation du consultant',    '企业查看': 'Consultation par l\'entreprise',    '邀约面试': 'Invitation à un entretien',    '已录取': 'Recruté',    '查看岗位详情': 'Voir les détails du poste',    '撤回投递': 'Retirer la candidature',    '压机操作工（双头压机线）': 'Opérateur de presse (ligne de presses à double tête)',    '焊接技工（管道）': 'Technicien soudeur (tuyauterie)',    '玻璃压机操作工（夜班）': 'Opérateur de presse à verre (poste de nuit)',    '玻璃压机操作工': 'Opérateur de presse à verre',    '东南亚电子装配线（示例）': 'Ligne d\'assemblage électronique en Asie du Sud-Est (exemple)',    '已放弃': 'Abandonné',    '中亚矿业技术服务（示例）': 'Services techniques miniers en Asie centrale (exemple)',    '储备中': 'En réserve',    '示例对外劳务合作公司（演示）': 'Société de coopération internationale pour l\'emploi à l\'étranger (démonstration)',    '阿尔及利亚某玻璃厂（演示）': 'Une usine de verre en Algérie (démonstration)',    '遇到劳务纠纷': 'Conflit du travail',    '家属一键通知（演示）': 'Notification en un clic à la famille (démonstration)',    '已结汇到账（演示）': 'Converti et reçu (démonstration)',    '三份合同是什么、重点看哪几条、如何识别阴阳合同': 'Quels sont les trois contrats, quelles clauses examiner en priorité, comment identifier les contrats doubles',    '个税申报、税收协定、结汇合规要点': 'Déclaration d\'impôt sur le revenu, conventions fiscales, points clés de conformité pour la conversion de devises',    '治安风险、自然灾害、政局动荡时的自救与求助流程': 'Procédures d\'auto-sauvetage et de demande d\'aide en cas de risques sécuritaires, de catastrophes naturelles ou d\'instabilité politique',    '欠薪、跑路等情形下的垫付条件与材料': 'Conditions et documents pour l\'avance de fonds en cas d\'arriérés de salaire, de fuite de l\'employeur, etc.',    '签证节点': 'Étape de visa',    '保险生效': 'Prise d\'effet de l\'assurance',    '政策更新': 'Mise à jour des politiques',    '阿尔及利亚工作许可材料要求已更新至知识库': 'Les exigences relatives aux documents du permis de travail en Algérie ont été mises à jour dans la base de connaissances',    '顾问消息': 'Messages du conseiller',    '可以问我签证材料、合同须知、维权流程等问题': 'Vous pouvez me poser des questions sur les documents de visa, les points essentiels du contrat, la procédure de défense des droits, etc.',    '阿尔及利亚签证要什么材料': 'Quels documents sont nécessaires pour un visa pour l\'Algérie ?',    '欠薪怎么维权': 'Comment défendre ses droits en cas de salaire impayé ?',    '合同怎么看': 'Comment lire un contrat ?',    '体检报告去哪做': 'Où faire le rapport d\'examen médical ?',    '中式厨师（员工食堂）': 'Cuisinier chinois (cantine du personnel)',    '提醒': 'Rappel',    '重点项目进度': 'Avancement des projets clés',    '项目建档': 'Création du dossier de projet',    '岗位需求结构化': 'Structuration des besoins de postes',    '人才招募与推荐': 'Recrutement et recommandation de talents',    '合同签约与备案': 'Signature et enregistrement des contrats',    '预计批量签约': 'Signature groupée prévue',    '出境合规办理': 'Formalités de conformité pour le départ',    '新建项目': 'Nouveau projet',    '链路进度': 'Progression de la chaîne',    '双轨用工配置': 'Configuration de double dispositif d\'emploi',    '中方派遣人员': 'Personnel chinois détaché',    '派遣链': 'Chaîne de détachement',    '当地用工人员': 'Personnel local',    '当地链': 'Chaîne locale',    '合规状态': 'Statut de conformité',    '良好': 'Bon',    '发起岗位需求': 'Initier un besoin de poste',    '岗位名称与人数': 'Intitulé du poste et nombre de personnes',    '匹配评分规则': 'Règles de notation de la correspondance',    '恢复默认': 'Rétablir les valeurs par défaut',    '提交岗位需求': 'Soumettre le besoin de poste',    '增值服务': 'Services à valeur ajoutée',    '签证可行性预审': 'Pré-évaluation de la faisabilité du visa',    '简历翻译润色': 'Traduction et perfectionnement du CV',    '目的国政策问答': 'Questions-réponses sur les politiques du pays de destination',    '多语言实时同传在线面试': 'Entretien en ligne avec interprétation simultanée en temps réel multilingue',    '含加急、续签': 'Y compris procédure accélérée et renouvellement',    '合作服务商': 'Prestataire partenaire',    '百万级保额': 'Couverture à hauteur de millions',    '工资代发与国际结汇': 'Versement des salaires et règlement des devises internationales',    '多币种跨境支付': 'Paiements transfrontaliers multidevises',    '当地备案代办': 'Services d\'enregistrement local',    '工作许可、居留许可': 'Permis de travail, permis de séjour',    '账单编号': 'Numéro de facture',    '周期': 'Période',    '核对': 'Vérifier',    '异议': 'Contester',    '案例实证': 'Preuves par cas concrets',    '阿尔及利亚外国员工工作许可': 'Permis de travail pour employés étrangers en Algérie',    '办理周期与材料清单': 'Délai de traitement et liste des documents',    '渠道库': 'Base de canaux',    '目的国当地招聘渠道': 'Canaux de recrutement locaux dans le pays de destination',    '本地招聘平台、职业介绍所、社区渠道清单及使用建议': 'Liste des plateformes de recrutement locales, agences de placement, canaux communautaires et recommandations d\'utilisation',    '模板': 'Modèles',    '外派人员劳动合同（中阿双语）': 'Contrat de travail du personnel expatrié (bilingue chinois-arabe)',    '流程': 'Processus',    '结算对账与发票流程': 'Processus de règlement, rapprochement et facturation',    '导出报告': 'Exporter le rapport',    '在岗人员趋势': 'Tendance des effectifs en poste',    '添加成员': 'Ajouter un membre',    '节点自动推送': 'Notification automatique des étapes',    '保险续保': 'Renouvellement d\'assurance',    '资讯': 'Informations',    '面试安排': 'Planification d\'entretien',    '申请调整成员权限': 'Demande de modification des permissions des membres',    '暂无待审批事项': 'Aucun élément en attente d\'approbation',    '企业成员': 'Membres de l\'entreprise',    '查看项目': 'Voir le projet',    '维护项目': 'Gérer le projet',    '查看账单': 'Consulter la facture',    '确认账单/异议': 'Confirmer la facture/Contester',    '服务下单': 'Commander un service',    '查看员工材料': 'Consulter les documents des employés',    '查看消息': 'Consulter les messages',    '成员': 'Membres',    '当前账号': 'Compte actuel',    '编辑权限': 'Modifier les autorisations',    '财务专员': 'Spécialiste financier',    '项目经理': 'Chef de projet',    '离线': 'Hors ligne',    '选择岗位': 'Sélectionner un poste',    '匹配分析': 'Analyse de correspondance',    '全部分析': 'Toutes les analyses',    '收藏夹': 'Favoris',    '评分规则': 'Règles de notation',    '条件': 'Conditions',    '持证': 'Certifié',    '仅门槛通过': 'Critères minimaux validés uniquement',    '有健康证': 'Titulaire d\'un certificat de santé',    '有驻外经历': 'Expérience à l\'étranger',    '仅已投递': 'Candidatures envoyées uniquement',    '中专及以上': 'Diplôme d\'études secondaires professionnelles ou supérieur',    '大专及以上': 'Diplôme d\'études supérieures courtes ou supérieur',    '本科及以上': 'Licence ou supérieur',    '排序': 'Trier',    '综合排序': 'Tri global',    '经验优先': 'Expérience prioritaire',    '到岗优先': 'Disponibilité immédiate prioritaire',    '按姓名': 'Par nom',    '李国强': 'Li Guoqiang',    '注塑领班': 'Chef d\'équipe injection plastique',    '玻璃压机操作': 'Opérateur de presse à verre',    '工艺参数调整': 'Réglage des paramètres de process',    '安全规程': 'Règles de sécurité',    '已备': 'Prêt',    '设备点检': 'Inspection des équipements',    '三班倒作业': 'Travail en trois équipes',    '赵海涛': 'Zhao Haitao',    '压机操作工': 'Opérateur de presse',    '部分': 'Partiels',    '吴天成': 'Wu Tiancheng',    '吴卫东': 'Wu Weidong',    '张春生': 'Zhang Chunsheng',    '离心机操作工': 'Opérateur de centrifugeuse',    '高俊杰': 'Gao Junjie',    '黄立新': 'Huang Lixin',    '窑炉工': 'Opérateur de four',    '李跃进': 'Li Yuejin',    '马立新': 'Ma Lixin',    '模具维修工': 'Réparateur de moules',    '何长顺': 'He Changshun',    '赵国强': 'Zhao Guoqiang',    '徐瑞祥': 'Xu Ruixiang',    '罗国庆': 'Luo Guoqing',    '电气工程师': 'Ingénieur électricien',    '徐天成': 'Xu Tiancheng',    '质检员': 'Inspecteur qualité',    '郭少华': 'Guo Shaohua',    '全周期阶段': 'Phase du cycle complet',    '在途人员': 'Personnel en déplacement',    '全球派遣网络': 'Réseau de déploiement mondial',    '目的国口径': 'Cadre du pays de destination',    '雇主须先取得使用外籍劳工批复': 'L\'employeur doit d\'abord obtenir l\'autorisation d\'emploi de main-d\'œuvre étrangère',    '劳动合同与社保登记同步': 'Synchronisation du contrat de travail et de l\'enregistrement à la sécurité sociale',    '工作许可（配额制）': 'Permis de travail (système de quotas)',    '年度配额、传染病筛查、部分岗位需职业资质': 'Quota annuel, dépistage des maladies infectieuses, certaines fonctions nécessitent des qualifications professionnelles',    '持续': 'Continu',    '签证办理中': 'Demande de visa en cours',    '合同待签': 'Contrat en attente de signature',    '合同一致性待复核': 'Cohérence du contrat à revérifier',    '本期应急事件': 'Événements d\'urgence de la période',    '主链路泳道': 'Voie du flux principal',    '签证办理': 'Traitement du visa',    '待处理风险': 'Risques à traiter',    '欠薪风险': 'Risque d\'arriérés de salaire',    '处置': 'Traitement',    '证照过期': 'Expiration des documents',    '签证补件': 'Complément de dossier de visa',    '合同不一致': 'Incohérence contractuelle',    '审计结果': 'Résultats de l\'audit',    '人员': 'Personnel',    '薪资一致': 'Cohérence des salaires',    '工时一致': 'Cohérence des heures de travail',    '保险一致': 'Cohérence des assurances',    '解约一致': 'Cohérence des résiliations',    '一致': 'Cohérent',    '李强': 'Li Qiang',    '王芳': 'Wang Fang',    '赵磊': 'Zhao Lei',    '不一致': 'Incohérent',    '需复核': 'Nécessite une revérification',    '陈静': 'Chen Jing',    '具体税务处理建议咨询专业税务师': 'Pour des conseils spécifiques en matière de traitement fiscal, veuillez consulter un fiscaliste professionnel',    '新建工单': 'Créer un ticket',    '工单列表': 'Liste des tickets',    '处理中': 'En cours de traitement',    '闭环': 'Boucle fermée',    '已闭环': 'Boucle fermée',    '待分派': 'En attente d\'attribution',    '已处理': 'Traité',    '最近记录': 'Enregistrements récents',    '动作': 'Action',    '操作人': 'Opérateur',    '导出报表': 'Exporter le rapport',    '证照齐全率': 'Taux de complétude des licences et certificats',    '签证预审通过率': 'Taux de réussite de la pré-évaluation des visas',    '合同一致性通过率': 'Taux de conformité des contrats',    '数据库': 'Base de données'
  ,
    '已连接后端': 'Backend connecté',    '实时数据': 'Données en temps réel',    '一键呼叫': 'Appel en un clic',    '我的待办': 'Mes tâches à effectuer',    '影响签证预审': 'Impact sur la pré-évaluation du visa',    '已签署': 'Signé',    '紧急': 'Urgent',    '开始引导': 'Démarrer le guide',    '审批意见': 'Avis d\'approbation',    '材料齐备': 'Documents complets',    '同意垫付': 'Accord pour l\'avance de fonds',    '已通过': 'Approuvé',    '合计': 'Total',    '学历证明': 'Justificatif de diplôme',    '已上传': 'Téléchargé',    '查看详情': 'Voir les détails',    '虚拟': 'Virtuel',    '已纳入': 'Inclus',    '已核验': 'Vérifié',    '已生效': 'En vigueur',    '已投保': 'Assuré',    '一键触达': 'Accès en un clic',    '功能介绍': 'Présentation des fonctionnalités',    '待顾问确认': 'En attente de confirmation du consultant',    '面试中': 'En entretien',    '已投递': 'Candidature envoyée',    '已录取': 'Recruté',    '储备中': 'En réserve',    '已放弃': 'Abandonné',    '个税申报、税收协定、结汇合规要点': 'Déclaration d\'impôt sur le revenu, conventions fiscales, points clés de conformité pour la conversion de devises',    'AI 问答参考，非法律意见': 'Référence de questions-réponses IA, non un avis juridique',    '重大事项请转顾问或专业复核': 'Pour les questions importantes, veuillez consulter un conseiller ou faire une vérification professionnelle',    '投递于': 'Soumis le',    '待办': 'À faire',    '进行中': 'En cours',    '已完成': 'Terminé',    '待开始': 'En attente de démarrage',    '4月': 'avril',    '5月': 'mai',    '6月': 'juin',    '7月': 'juillet',    '8月': 'août',    '9月': 'septembre'
  ,
    '已进入工作台': 'Espace de travail ouvert',    '当前身份：{role} · 已连接后端': 'Rôle : {role} · Backend connecté',    '当前身份：{role}（演示）': 'Rôle : {role} (démo)',    '演示模式': 'Mode démo',    '「{a}」为前端原型交互，暂未接入后端': '« {a} » est une interaction de maquette, non connectée au backend',    '{n} 项 · 影响签证预审': '{n} élément(s) · affecte la pré-vérification',    '来源：{s} · 仅供参考': 'Source : {s} · à titre indicatif',    '还有 {n} 项待办': '{n} tâches restantes',    '共 {n} 个岗位': '{n} offres au total',    '共 {a} 位候选人': '{a} candidats au total',    '共 {n} 条': '{n} enregistrements',    '第 {a}/{b} 页': 'Page {a} sur {b}',    '已选 {n} 个': '{n} sélectionnés',    '{n} 天后到期': 'Expire dans {n} jours',    '还有 {n} 位未读': '{n} non lus',    '已完成 {a}/{b}': 'Terminé {a}/{b}',    '共 {n} 条记录': '{n} enregistrements au total'
  ,
    '策略页可调，保存即生效': 'Réglable sur la page politique, effectif à l\'enregistrement',    '策略页可调': 'Réglable sur la page politique',    '保存即生效': 'Effectif à l\'enregistrement',    '其中高风险 {n} 条': '{n} à haut risque',    '已复核 {n} 条': '{n} vérifiés',    '出海顾问': 'Conseiller international',    '合同一致性审计员': 'Auditeur de cohérence des contrats',    '签证材料预审员': 'Pré-vérificateur de visa',    '风险分诊员': 'Agent de triage des risques',    '结算核对员': 'Vérificateur de règlement',    '文书翻译与润色': 'Traduction et révision de documents',    '其中高风险': 'dont à haut risque',    '已复核': 'Vérifiés',    '结论': 'Conclusion',    '预审': 'Pré-vérification',    '还不能送签': 'ne peut pas encore être déposé',    '缺 {n} 项材料': '{n} documents manquants',    '缺': 'Manquant',    '项材料': 'documents',    '硬性阻断项': 'blocage strict',    '天内到期': 'jours avant expiration',    '得先处理': 'à traiter en premier',    '齐套率': 'Complétude',    '补齐后可使馆受理': 'une fois complet, l\'ambassade l\'acceptera',    '作为参考': 'à titre de référence',    '知识库条目': 'entrée de la base de connaissances',    '审计结果': 'Résultat de l\'audit',    '有没有不一致的地方': 'des incohérences',    '签证进度': 'avancement du visa',    '到哪一步了': 'à quelle étape',    '需要什么材料': 'quels documents sont nécessaires'
  ,
    '机械操作工': 'Opérateur de machine',    '酒店服务员': 'Agent d\'hôtel',    '电子厂普工': 'Ouvrier électronique',    '装配技术员': 'Technicien d\'assemblage',    '食品包装工': 'Agent de conditionnement',    '高薪': 'Haut salaire',    '急招': 'Recrutement urgent',    '推荐': 'Recommandé',    '地点': 'Lieu',    '所在地': 'Localisation',    '薪资': 'Salaire',    '工期': 'Durée',    '技能': 'Compétences',    '经验': 'Expérience',    '中国·上海': 'Chine · Shanghai',    '日本·东京': 'Japon · Tokyo',    '德国·柏林': 'Allemagne · Berlin',    '阿联酋·迪拜': 'Émirats · Dubaï',    '新加坡': 'Singapour',    '2年': '2 ans',    '3年': '3 ans',    '1年': '1 an',    '全球态势': 'Situation mondiale',    '拖动旋转 · 滚轮缩放 · 点击卡片下钻': 'Glisser pour tourner · Molette pour zoomer · Cliquer pour explorer',    '匹配度': 'Score de correspondance',    '待补充': 'À compléter',    '需 中级职业资格证': 'Nécessite un certificat professionnel',    '在分析中': 'Analyse en cours',    '分析中': 'Analyse en cours',    '个对象': 'objets',    '状态': 'Statut',    '推理阶段': 'Étape de raisonnement',    '耗时': 'Durée',    '模型': 'Modèle',    '全局': 'Global',    '自动演示': 'Démo automatique',    '跳到结果': 'Aller au résultat',    '已暂停': 'En pause',    '重放': 'Rejouer',    '查看结果': 'Voir le résultat',    '当前岗位': 'Poste actuel',    '推理过程': 'Processus de raisonnement',    '分项得分': 'Détail des scores'
  ,
    '我的偏好权重': 'Mes poids de préférence',    '权重会归一化到': 'Les poids sont normalisés à',    '默认值即原始评分': 'Les valeurs par défaut correspondent au score original',    '还缺': 'Encore manquant',    '份材料': 'documents',    '技能缺口': 'Lacunes de compétences',    '调试': 'Débogage',    '检测': 'Contrôle',    '中式烹饪': 'Cuisine chinoise',    '食堂管理': 'Gestion de cantine',    '总账核算': 'Grand livre',    '税务申报': 'Déclaration fiscale',    '编程': 'Programmation',    '确认撤回申请？': 'Retirer cette candidature ?',    '撤回后本次申请将终止': 'La candidature prendra fin après retrait',    '如需重新申请需重新走流程': 'Vous devrez refaire la démarche pour postuler à nouveau',    '确认撤回': 'Confirmer le retrait',    '确定撤回对': 'Retirer la candidature pour',    '的投递吗': ' ?',    '撤回后可重新投递': 'Vous pouvez postuler à nouveau après retrait',    '但已进行的面试安排会取消': 'mais les entretiens prévus seront annulés',    '确定撤回': 'Confirmer',    '在线对话': 'Discussion en ligne',    '签证现在办到哪一步了': 'Où en est mon visa ?',    '出发前需要准备哪些材料': 'Quels documents avant le départ ?',    '准备材料': 'Préparer les documents',    '工资什么时候发放': 'Quand les salaires sont-ils versés ?',    '怎么发': 'Comment est-ce versé ?',    '工资发放': 'Versement des salaires',    '境外遇到问题怎么联系你': 'Comment vous joindre à l\'étranger ?',    '我与派遣公司': 'Moi et l\'agence',    '服务合同': 'Contrat de service',    '签署状态': 'Statut de signature',    '签署日期': 'Date de signature',    '本页为系统生成的合同副本': 'Cette page est une copie générée par le système',    '甲方': 'Partie A',    '乙方': 'Partie B',    '派遣方': 'Agence de détachement',    '环球派遣': 'Global Dispatch',    '国外雇主': 'Employeur étranger',    '劳务合作合同': 'Contrat de coopération',    '派遣公司与国外雇主': 'Agence et employeur étranger'
  ,
    'AI 助手': 'Assistant IA',    '你好，我是海外派遣 AI 助手。可以问我签证材料、合同须知、维权流程等问题。': 'Bonjour, je suis l\'assistant IA du détachement international. Posez-moi des questions sur les visas, les contrats ou vos droits.',    '仅供参考 · 非法律意见': 'À titre indicatif · pas un avis juridique',    '输入问题…': 'Posez une question…',    '输入问题...': 'Posez une question…',    '选择智能体': 'Choisir un agent',    '当前有多少待处理风险': 'Combien de risques en attente ?',    '合同不一致的项目': 'Projets avec incohérences de contrat',    '今日应急事件': 'Urgences du jour',    '发送': 'Envoyer',    '发送中': 'Envoi',    '助手正在思考…': 'L\'assistant réfléchit…',    '智能体正在查询业务数据…': 'L\'agent consulte les données…',    '服务说明': 'Description du service',    '处置': 'Traiter',    '确认': 'Confirmer',    '确认退出': 'Confirmer la déconnexion',    '退出登录': 'Se déconnecter',    '退出后需要重新选择身份进入。': 'Vous devrez choisir un rôle pour vous reconnecter.',    '岗位市场': 'Marché de l\'emploi',    '离线模式：岗位库由后端提供，请先启动服务。': 'Mode hors ligne : la bibliothèque d\'offres vient du backend.',    '未连接后端，无法派单。': 'Backend non connecté, impossible de dispatcher.',    '将按风险等级生成应急工单并分派给保障部坐席。': 'Un ticket d\'urgence sera créé selon le niveau de risque.',    '该培训已完成，可查看结业证明。': 'Cette formation est terminée.',    '该培训尚未完成，完成后才能出境。': 'Formation non terminée, requise avant le départ.',    '办理进度': 'Avancement',    '当前状态：办理中': 'Statut : en cours',    '材料已提交': 'Documents soumis',    '合规检查清单': 'Liste de conformité',    '雇主资质：已核验': 'Qualifications employeur : vérifiées',    '添加成员': 'Ajouter un membre',    '账单核对': 'Rapprochement de facture',    '提交异议': 'Soumettre un litige',    '结算明细': 'Détails du règlement',    '离线模式：无法读取后端明细。': 'Mode hors ligne : détails indisponibles.',    '知道了': 'Compris',    '查看详情': 'Détails',    '关闭': 'Fermer',    '取消': 'Annuler',    '保存': 'Enregistrer',    '删除': 'Supprimer',    '替换': 'Remplacer',    '上传': 'Téléverser',    '下载': 'Télécharger',    '预览': 'Aperçu'
  };

  /* ---------- 阿拉伯语词典 ---------- */
  DICT.ar = {
    '岗位发现': 'اكتشاف الوظائف',
    '我的求职': 'طلباتي',
    '我的主页': 'الرئيسية',
    '合同与证照': 'العقود والوثائق',
    '海外保障中心': 'الدعم الخارجي',
    '出海知识库': 'قاعدة المعرفة',
    '我的档案': 'ملفي',
    '消息与顾问': 'الرسائل',
    '概览台': 'نظرة عامة',
    '项目管理': 'المشاريع',
    '服务台': 'مكتب الخدمة',
    '知识库': 'قاعدة المعرفة',
    '报表': 'التقارير',
    '全球态势': 'النظرة العالمية',
    '审批': 'الموافقات',
    '操作日志': 'سجل التدقيق',
    '投递管理': 'الطلبات',
    '候选人发现': 'اكتشاف المواهب',
    '全生命周期看板': 'لوحة دورة الحياة',
    '智能体治理': 'حوكمة الوكلاء',
    '应急事件工单': 'تذاكر الحوادث',
    '审计日志': 'سجل التدقيق',
    '合规报表': 'تقارير الامتثال',
    '筛出合适岗位，收藏 / 投递 / 一键 AI 分析': 'تصفية الوظائف أو حفظها أو التقديم أو تشغيل تحليل الذكاء الاصطناعي',
    '清空筛选': 'مسح عوامل التصفية',
    '分析已选': 'تحليل المحدد',
    '全部岗位分析': 'تحليل جميع الوظائف',
    '收藏': 'حفظ',
    '取消收藏': 'إزالة',
    '投递': 'تقديم',
    '投递简历': 'تقديم',
    '查看详情': 'التفاصيل',
    '关闭': 'إغلاق',
    '取消': 'إلغاء',
    '保存': 'حفظ',
    '返回': 'رجوع',
    '搜索': 'بحث',
    '刷新': 'تحديث',
    '应聘者': 'المرشح',
    '企业': 'صاحب العمل',
    '保障部': 'الدعم',
    '概览': 'نظرة عامة',
    '风险预警': 'تنبيهات المخاطر',
    '全部': 'الكل',
    '发送': 'إرسال',
    '删除': 'حذف',
    '编辑': 'تعديل',
    '上传': 'تحميل',
    '下载': 'تنزيل',
    '预览': 'معاينة',
    '查看': 'عرض',
    '详情': 'التفاصيل',
    '状态': 'الحالة',
    '时间': 'الوقت',
    '操作': 'الإجراءات',
    '加载中…': 'جارٍ التحميل…',
    '暂无数据': 'لا توجد بيانات',
    '正在加载…': 'جارٍ التحميل…',
    '确认': 'تأكيد',
    '是': 'نعم',
    '否': 'لا',
    '推理中': 'استدلال',
    '打分中': 'التقييم',
    '已完成': 'مكتمل',
    '完成': 'تم',
    '待机': 'في الانتظار',
    '技能': 'المهارات',
    '薪资': 'الراتب',
    '可用性': 'الجاهزية',
    '查看结果': 'عرض النتيجة',
    '招聘': 'الوظائف الشاغرة',
    '已投递': 'تم التقديم',
    '未投递': 'لم يتم التقديم',
    '匹配分': 'درجة التوافق',
    '推理': 'استدلال',
    '亮点': 'نقاط القوة',
    '阿尔及利亚': 'الجزائر',
    '阿尔及尔': 'الجزائر العاصمة',
    '技能岗': 'ماهر',
    '包食宿': 'الطعام والسكن',
    '往返机票': 'تذاكر ذهاب وعودة',
    '越南': 'فيتنام',
    '管理岗': 'إدارة',
    '双休': 'إجازة نهاية الأسبوع',
    '驻外补贴': 'بدل الخارج',
    '哈萨克斯坦': 'كازاخستان',
    '技术岗': 'تقني',
    '五险一金': 'التأمين الاجتماعي',
    '带薪年假': 'إجازة سنوية مدفوعة',
    '沙特阿拉伯': 'المملكة العربية السعودية',
    '利雅得': 'الرياض',
    '奥兰': 'وهران',
    '年终奖': 'مكافأة نهاية العام',
    '印度尼西亚': 'إندونيسيا',
    '坦桑尼亚': 'تنزانيا',
    '墨西哥': 'المكسيك',
    '当前岗位': 'الوظيفة الحالية',
    '候选人': 'المرشح',
    '已暂停': 'متوقف',
    '推理过程': 'عملية الاستدلال',
    '匹配评分': 'درجة التوافق',
    '候选人排名': 'ترتيب المرشحين',
    '匹配结论': 'الخلاصة',
    '风险': 'المخاطر',
    '面试建议': 'أسئلة المقابلة',
    '成长路径': 'مسار التطور',
    '档案调节台': 'ضبط الملف',
    '薪资期望': 'الراتب المتوقع',
    '到岗时间': 'الجاهزية',
    '从业年限': 'سنوات الخبرة',
    '双向智能匹配': 'المطابقة الذكية ثنائية الاتجاه',
    '跳到结果': 'الانتقال إلى النتيجة',
    '重播': 'إعادة',
    '读取中…': 'جارٍ التحميل…',
    '薪酬与结算': 'الرواتب والتسويات',
    'AI 候选人匹配': 'مطابقة المرشحين بالذكاء الاصطناعي',
    '消息与成员': 'الرسائل والأعضاء',
    '全球用工态势': 'القوى العاملة العالمية',
    '风险与合规': 'المخاطر والامتثال',
    '审计': 'التدقيق',
    '治理': 'الحوكمة',
    '工单': 'التذاكر',
    '报告与对账': 'التقارير والتسويات',
    '匹配分析结果': 'نتائج المطابقة',
    '岗位详情': 'تفاصيل الوظيفة',
    '消息中心': 'مركز الرسائل',
    '全球能力矩阵': 'مصفوفة القدرات العالمية',
    '风险预警中心': 'مركز تنبيهات المخاطر',
    '合同一致性审计': 'تدقيق اتساق العقود',
    '审批中心': 'مركز الموافقات',
    'AI 匹配推荐': 'المطابقة الذكية',
    '按岗位要求给候选人打分排名，点「AI 解释」看证据、差距与面试建议': 'رتّب المرشحين حسب متطلبات الوظيفة؛ افتح تفسير الذكاء الاصطناعي للأدلة والفجوات',
    '重新计算': 'إعادة الحساب',
    '进入分析': 'فتح التحليل',
    '查看岗位': 'عرض الوظيفة',
    '海外用工派遣平台': 'منصة الإرسال العالمي للقوى العاملة',
    '主申请 + 历史机会 · 全链路进度透明': 'الطلب الرئيسي + الفرص السابقة · شفافية كاملة للمسار',
    '按你的技能、证书、薪资与到岗时间，实时计算每个岗位的匹配度与差距': 'درجة توافق فورية وفجوات لكل وظيفة بناءً على مهاراتك وشهاداتك وراتبك وجاهزيتك',
    '完整岗位排名与匹配分，可查看详情、投递简历、收藏岗位': 'ترتيب كامل مع درجات التوافق؛ اعرض التفاصيل أو قدّم أو احفظ',
    '企业发布的岗位信息 · 可返回分析界面': 'وظيفة نشرها صاحب العمل · العودة إلى التحليل في أي وقت',
    '三份合同一致性校验 · 证照有效期与续签提醒': 'فحص اتساق العقود الثلاثة · صلاحية الوثائق وتنبيهات التجديد',
    '遇到问题别慌：欠薪、伤病、证件丢失、纠纷，一步步带你处理': 'لا تقلق: أجور غير مدفوعة، إصابة، وثائق مفقودة، نزاعات — إرشاد خطوة بخطوة',
    '我该拿多少、拿到没 · 跨境到账状态': 'كم يجب أن تتقاضى، وهل وصل · الحالة عبر الحدود',
    '我能做什么 · 出海前必读 · 遇到问题怎么办': 'ما يمكنني فعله · أساسيات ما قبل المغادرة · ماذا تفعل عند حدوث مشكلة',
    '一次上传，多处复用 · 投递新岗位自动带出': 'حمّل مرة واحدة، استخدم في كل مكان · يُملأ تلقائيًا عند التقديم',
    '三方在线沟通 · 顾问 / 企业 / 保障部 · 节点通知': 'محادثة ثلاثية · المستشار / صاحب العمل / الدعم · إشعارات المراحل',
    '月度用工与结算报告': 'تقرير القوى العاملة والتسوية الشهري',
    '双轨用工（中方派遣 + 当地用工）统一视图': 'عرض موحد للنظام المزدوج (الإرسال الصيني + التوظيف المحلي)',
    '查看主动投递简历的候选人，勾选后可匹配分析、邀面试、发 offer': 'المرشحون الذين تقدموا مباشرة؛ حدد لإجراء التحليل أو الدعوة للمقابلة أو إرسال العرض',
    '主动挖掘未投递简历的候选人，按条件筛选后可直接邀约': 'اكتشف المرشحين الذين لم يتقدموا؛ صفِّ وادعُ مباشرة',
    '完整排名与匹配分，可查看详情、邀面试、发 offer': 'ترتيب كامل مع درجات؛ اعرض التفاصيل أو ادعُ للمقابلة أو أرسل عرضًا',
    '岗位需求、服务进度、电子签署与结算对账': 'طلبات الوظائف، تقدم الخدمة، التوقيع الإلكتروني وتسوية الحسابات',
    '目的国政策、招聘渠道与文书模板': 'سياسات بلد الوجهة وقنوات التوظيف وقوالب الوثائق',
    '月度用工报告、合规健康度、结算明细与发票': 'تقارير شهرية، صحة الامتثال، تفاصيل التسوية والفواتير',
    '业务节点消息推送与企业成员权限管理': 'إشعارات المراحل وإدارة صلاحيات الأعضاء',
    '目的国签证 / 许可口径 · 平均周期 · 合规要点 · 在办项目': 'قواعد التأشيرة/التصريح حسب البلد · المدة المتوسطة · نقاط الامتثال · المشاريع النشطة',
    '人员 / 项目从投递到回流的关键卡点': 'نقاط رئيسية من التقديم إلى العودة للأشخاص والمشاريع',
    '聚合欠薪、证照过期、签证补件、保险到期、合同不一致': 'يجمع الأجور غير المدفوعة والوثائق المنتهية ومستلزمات التأشيرة وانتهاء التأمين وعدم تطابق العقود',
    '按项目 / 按人批量审计三份合同关键条款': 'تدقيق مجمّع للبنود الرئيسية للعقود الثلاثة حسب المشروع أو الشخص',
    '抽检复核 · 高风险拦截 · 配额与停用，把「模型说了算」变成可管可查': 'مراجعة بالعينة · حجب عالي المخاطر · حصص وإيقاف — قرارات ذكاء اصطناعي قابلة للإدارة والتدقيق',
    '报案 → 分派 → 处置 → 闭环': 'إبلاغ ← إسناد ← معالجة ← إغلاق',
    '风险处置备用金申请 · 通过/驳回并回写通知': 'طلبات صندوق الطوارئ · الموافقة/الرفض مع إشعار',
    '登录、写操作、材料查看、审批与治理动作全量留痕': 'سجل كامل لتسجيلات الدخول والكتابات ومشاهدات الوثائق والموافقات وإجراءات الحوكمة',
    '监管报送口径 · 证照齐全率 · 签证通过率': 'أساس التقارير التنظيمية · معدل اكتمال الوثائق · معدل الموافقة على التأشيرات',
    '个人应聘者主页': 'الصفحة الرئيسية للمرشح',
    '客户公司主页': 'الصفحة الرئيسية لشركة العميل',
    '平台运营 · 全球风控 · 合规审计': 'العمليات · المخاطر العالمية · الامتثال',
    '提交': 'إرسال',
    '解析岗位要求': 'تحليل متطلبات الوظيفة',
    '读取候选人画像': 'قراءة ملف المرشح',
    '硬性门槛校验': 'فحص المتطلبات الإلزامية',
    '技能对齐': 'مطابقة المهارات',
    '薪资区间比对': 'مقارنة نطاق الراتب',
    '地点与语言': 'الموقع واللغة',
    '语义复核（大模型）': 'المراجعة الدلالية (LLM)',
    '加权计算': 'التقييم الموزون',
    '生成推荐理由': 'إنشاء التوصية',
    '推荐': 'موصى به',
    '正在分析': 'جارٍ التحليل',
    '证据': 'دليل',
    '缺口': 'الفجوات',
    '命中': 'مطابق',
    '护照': 'جواز السفر',
    '健康证': 'الشهادة الصحية',
    '年龄': 'العمر',
    '有效': 'صالح',
    '无效': 'غير صالح',
    '缺失': 'مفقود',
    '就绪': 'جاهز',
    '通过': 'ناجح',
    '不通过': 'فاشل',
    /* 错误码 */
    'err.already_applied': 'لقد تقدمت لهذه الوظيفة بالفعل',
    'err.job_full': 'هذه الوظيفة مكتملة بالفعل',
    'err.job_not_found': 'الوظيفة غير موجودة أو محذوفة',
    'err.invalid_amount': 'يجب أن يكون المبلغ أكبر من 0',
    'err.amount_too_large': 'لا يمكن أن يتجاوز الطلب 200000 يوان',
    'err.reason_required': 'يرجى إدخال سبب الطلب',
    'err.too_many_pending': 'لديك بالفعل طلبان قيد الانتظار',
    'err.note_required': 'يجب إدخال سبب للرفض',
    'err.invalid_credentials': 'رقم الهاتف أو كلمة المرور غير صحيحة',
    'err.permission_denied': 'حسابك لا يملك هذه الصلاحية',
    'err.unauthorized': 'انتهت الجلسة، يرجى تسجيل الدخول مرة أخرى',
    'err.forbidden': 'لا تملك صلاحية الوصول إلى هذه الواجهة',
    'err.offline': 'الخادم غير متصل'
  ,
    '实时数据': 'بيانات مباشرة',    '已接入后端': 'متصل بالخادم',    '导出明细': 'تصدير التفاصيل',    '下载全部': 'تنزيل الكل',    '浏览更多岗位': 'تصفح المزيد من الوظائف',    '上传材料': 'تحميل المستندات',    '保存档案': 'حفظ الملف',    '进行中': 'قيد التنفيذ',    '待处理': 'قيد الانتظار',    '待确认': 'بانتظار التأكيد',    '待顾问确认': 'بانتظار المستشار',    '投递于': 'تم التقديم في',    '面试中': 'في المقابلة',    '我的投递': 'طلباتي',    '历史与储备机会': 'الفرص السابقة والاحتياطية',    '当前环节': 'المرحلة الحالية',    '材料待补': 'مستندات معلقة',    '体检报告': 'التقرير الطبي',    '预计出境': 'المغادرة المتوقعة',    '以签证为准': 'حسب التأشيرة',    '我的全周期链路': 'دورة حياتي الكاملة',    '进行中申请': 'الطلب النشط',    '我的链路进度': 'تقدم مساري',    '投递': 'تم التقديم',    '资质': 'المؤهلات',    '面试': 'مقابلة',    '签约': 'التعاقد',    '签证': 'التأشيرة',    '项待办': 'مهام',    '还有': 'متبقية',    '已进入': 'دخلت',    '环节': 'مرحلة',    '合同矩阵': 'مصفوفة العقود',    '阴阳合同': 'عدم تطابق العقود',    '三份合同关键条款对比': 'مقارنة البنود الرئيسية',    '薪资下限': 'الحد الأدنى للراتب',    '薪资上限': 'الحد الأعلى للراتب',    '币种': 'العملة',    '每周工时': 'ساعات العمل الأسبوعية',    '小时': 'ساعات',    '意外险保额': 'تغطية الحوادث',    '解约通知期': 'فترة الإشعار',    '试用期': 'فترة التجربة',    '未发现': 'لم يُعثر على',    '风险': 'المخاطر',    '合同': 'العقد',    '签约方': 'الأطراف',    '关键条款摘要': 'ملخص البنود الرئيسية',    '应发': 'الإجمالي',    '已发': 'المدفوع',    '基本': 'الأساسي',    '加班': 'العمل الإضافي',    '津贴': 'البدل',    '已结汇到账': 'تمت التسوية والاستلام',    '到账状态': 'حالة التسوية',    '已结汇': 'تمت التسوية',    '汇率': 'سعر الصرف',    '收入趋势': 'اتجاه الدخل',    '双显': 'كلاهما',    '折线图': 'خطي',    '柱状图': 'أعمدة',    '基本工资': 'الراتب الأساسي',    '总收入趋势': 'اتجاه إجمالي الدخل',    '合计': 'الإجمالي',    '薪酬明细': 'تفاصيل الرواتب',    '加班费': 'أجر العمل الإضافي',    '基本信息': 'المعلومات الأساسية',    '投递时自动填充': 'يُملأ تلقائيًا',    '姓名': 'الاسم',    '手机号': 'الهاتف',    '最高学历': 'أعلى مؤهل',    '初中': 'المتوسطة',    '高中': 'الثانوية',    '中专/技校': 'مهني',    '大专': 'دبلوم',    '本科': 'بكالوريوس',    '硕士（研究生）': 'ماجستير',    '博士': 'دكتوراه',    '技能证书': 'شهادات المهارات',    '材料清单': 'قائمة المستندات',    '已上传': 'تم التحميل',    '身份证正反面': 'الهوية (الوجهان)',    '替换': 'استبدال',    '学历证明': 'إثبات التعليم',    '无犯罪记录证明': 'شهادة عدم المحكومية',    '会话': 'المحادثات',    '个会话': 'محادثات',    '条未读': 'غير مقروء',    '企业招聘对接': 'التوظيف لدى صاحب العمل',    '选择左侧会话开始沟通': 'اختر محادثة من اليسار',    '从左侧选择一个会话': 'اختر محادثة من اليسار',    '通知': 'الإشعارات',    '实时': 'مباشر',    '风险处置引导': 'دليل معالجة المخاطر',    '点开看': 'اضغط للعرض',    '我该做什么': 'ماذا أفعل',    '申请风险处置备用金': 'طلب صندوق الطوارئ',    '附材料清单': 'مع قائمة المستندات',    '一键生成申诉书': 'توليد خطاب الاستئناف',    '开始引导': 'بدء الدليل',    '紧急': 'عاجل',    '应急': 'طارئ',    '助手': 'المساعد',    '参考': 'مرجع',    '更新': 'محدث',    '重点': 'مهم',    '必读': 'قراءة إلزامية',    '问答参考': 'مرجع الأسئلة والأجوبة',    '非法律意见': 'ليس استشارة قانونية',    '重大事项请转顾问或专业复核': 'استشر مستشارًا للأمور المهمة',    '公司欠薪 / 跑路怎么办？': 'أجور غير مدفوعة / هروب صاحب العمل؟',    '引导申请风险处置备用金，附材料清单 + 一键生成申诉书': 'يرشدك لصندوق الطوارئ مع قائمة المستندات',    '在海外受伤 / 生病？': 'إصابة / مرض في الخارج؟',    '24h 救援热线 + 保险报案 + 医疗转运说明': 'خط ساخن 24 ساعة + تأمين + نقل طبي',    '护照丢了 / 被扣了？': 'جواز السفر مفقود / محتجز؟',    '领事保护指引 + 当地使领馆联系方式 + 补办流程': 'إرشادات قنصلية + جهات اتصال + استبدال',    '遇到劳务纠纷？': 'نزاع عمالي؟',    '证据链整理助手（合同/考勤/工资流水）+ 律师推荐': 'مساعد الأدلة + محامٍ',    '高频': 'شائع',    '维权': 'حقوق',    '平台 24h 应急热线': 'الخط الساخن 24 ساعة',    '全年无休 · 中文服务': 'طوال العام · خدمة بالصينية',    '中国驻阿尔及利亚使馆领事保护': 'السفارة الصينية – حماية قنصلية',    '领事保护与协助（演示号码）': 'حماية قنصلية (تجريبي)',    '阿尔及利亚工作签证要什么材料': 'ما مستندات تأشيرة العمل بالجزائر؟',    '在海外遇到欠薪怎么维权': 'المطالبة بالأجور غير المدفوعة',    '出海劳务合同怎么看': 'كيف تقرأ عقد العمل الخارجي',    '个税与结汇：钱怎么合法地回国': 'الضرائب والصرف: تحويل قانوني',    '海外安全防范与应急手册': 'دليل السلامة في الخارج',    '出海前必做的 10 件事': 'عشر خطوات قبل السفر',    '风险处置备用金申请条件': 'شروط صندوق الطوارئ',    '三份合同关键条款一致性校验通过': 'تم اجتياز فحص الاتساق',    '已签署': 'موقّع',    '境外人身意外险': 'تأمين الحوادث بالخارج',    '解约提前': 'الإشعار قبل الإنهاء',    '我与派遣公司《服务合同》': 'عقد الخدمة مع الوكالة',    '派遣公司与国外雇主《劳务合作合同》': 'عقد التعاون العمالي',    '我与国外雇主《雇佣合同》': 'عقد العمل',    '海外津贴': 'بدل الخارج',    '个税代扣': 'ضريبة مستقطعة',    '社保个人部分': 'التأمين الاجتماعي',    '实发': 'صافي الراتب',    '历史发放记录': 'سجل المدفوعات',    '含基本工资与加班/补贴': 'يشمل الراتب الأساسي والبدلات',    '查看投递详情': 'عرض الطلب',    '投递报名': 'التقديم',    '简历提交 · 岗位意向确认': 'تم إرسال السيرة · تأكيد الوظيفة',    '资质核验': 'التحقق من المؤهل',    '出境': 'المغادرة',    '在岗': 'في الخدمة',    '回流': 'العودة',    '我的证照': 'وثائقي',    '有效期与续签提醒': 'الصلاحية والتجديد',    '证照': 'مستند',    '编号': 'الرقم',    '有效期至': 'صالح حتى',    '示例对外劳务合作公司': 'شركة التعاون التجريبية',    '阿尔及利亚某玻璃厂': 'مصنع زجاج بالجزائر',    '演示': 'تجريبي',    '工时': 'الساعات',    '证据收集': 'جمع الأدلة',    '联系顾问': 'التواصل مع المستشار',    '领事协助': 'المساعدة القنصلية',    '仲裁': 'التحكيم',    '诉讼路径': 'مسار التقاضي',    '三份合同是什么': 'ما هي العقود الثلاثة؟',    '重点看哪几条': 'أي البنود الأهم',    '如何识别阴阳合同': 'كيف تكتشف عدم التطابق',    '个税与结汇': 'الضرائب والصرف',    '钱怎么合法带回国': 'كيف تحول الأموال قانونيًا',    '个税申报': 'الإقرار الضريبي',    '税收协定': 'الاتفاقيات الضريبية',    '结汇合规要点': 'أساسيات الامتثال للصرف',    '手册': 'الدليل',    '治安风险': 'المخاطر الأمنية',    '自然灾害': 'الكوارث الطبيعية',    '政局动荡时的自救与求助流程': 'المساعدة أثناء الاضطرابات',    '清单': 'قائمة',    '我的保单': 'وثائق تأميني',    '境外人身意外': 'الحوادث بالخارج',    '雇主责任': 'مسؤولية صاحب العمل',    '境外人身意外伤害保险': 'تأمين الحوادث الشخصية',    '保额': 'التغطية',    '生效中': 'ساري',    '查看理赔入口': 'دليل المطالبة',    '紧急联系与领事保护': 'جهات الطوارئ والقنصلية',    '一键触达': 'بنقرة واحدة',    '呼叫': 'اتصال',    '专属顾问': 'المستشار المخصص',    '李顾问': 'المستشار لي',    '工作日': 'أيام العمل',    '国内紧急联系人': 'جهة اتصال محلية',    '家属一键通知': 'تنبيه العائلة بنقرة',    '行前培训': 'التدريب قبل المغادرة',    '完成培训才能出境': 'التدريب مطلوب قبل المغادرة',    '安全防范与应急演练': 'السلامة والتدريبات',    '目的国法律与风俗': 'قوانين وعادات البلد',    '合同与维权须知': 'العقد والحقوق',    '待完成': 'معلق',    '健康与心理适应': 'الصحة والتكيف'
  ,
    '风险保障速览': 'نظرة عامة على المخاطر',    '出海安心四件套': 'أربعة أساسيات للاطمئنان',    '意外险': 'تأمين الحوادث',    '已投保': 'مؤمّن',    '已生效': 'ساري',    '条待确认': 'بانتظار التأكيد',    '投递于': 'تم التقديم في',    '工作签证': 'تأشيرة عمل',    '待办理': 'قيد المعالجة',    '办理中': 'قيد المعالجة',    '跟进中': 'قيد المتابعة',    '工作许可': 'تصريح العمل',    '我的备用金申请': 'طلبات صندوق الطوارئ',    '笔待审批': 'بانتظار الموافقة',    '待审批': 'بانتظار الموافقة',    '欠薪垫付': 'سلفة الأجور',    '已通过': 'تمت الموافقة',    '已驳回': 'مرفوض',    '处理': 'تمت المعالجة',    '审批意见': 'ملاحظة الموافقة',    '材料齐备': 'المستندات مكتملة',    '同意垫付': 'تمت الموافقة على السلفة',    '提交': 'إرسال',    '雇主拖欠': 'صاحب العمل مدين',    '工资': 'الراتب',    '已催告两次未果': 'إشعاران دون استجابة',    '我的': 'خاصتي',    '含基本工资与加班/补贴': 'يشمل الراتب والبدلات',    '补贴': 'البدل',    '高中以上学历': 'الثانوية أو أعلى',    '毕业证': 'الشهادة',    '无犯罪记录': 'لا سجل جنائي',    '办理周期约': 'مدة المعالجة حوالي',    '已上传': 'تم التحميل',    '待补交': 'بانتظار التقديم',    '证件照': 'صورة شخصية',    '支持与顾问': 'الدعم والمستشارون',    '企业': 'صاحب العمل',    '保障部坐席在线对话': 'محادثة مع موظف الدعم',    '系统与节点提醒': 'إشعارات النظام والمراحل',    '全部已读': 'تحديد الكل كمقروء',    '海外派遣服务': 'خدمة الإرسال الخارجي',    '在线': 'متصل',    '发消息': 'إرسال رسالة',    '拨打': 'اتصال',    '应急': 'طارئ',    '查询': 'استعلام',    '查看岗位': 'عرض الوظيفة',    '撤销申请': 'سحب الطلب',    '重新投递': 'إعادة التقديم',    '状态': 'الحالة',    '关闭': 'إغلاق',    '取消': 'إلغاء',    '确认': 'تأكيد',    '查看详情': 'التفاصيل',    '标记已读': 'تحديد كمقروء',    '已读': 'مقروء',    '紧急': 'عاجل',    '待办': 'مهام'
  ,
    'AI 参考': 'مرجع ذكاء اصطناعي',    'AI 问答参考，非法律意见；重大事项请转顾问或专业复核': 'مرجع أسئلة وأجوبة بالذكاء الاصطناعي، ليس استشارة قانونية؛ استشر مستشارًا للأمور المهمة',    '高中以上学历 + 毕业证/技能证书、无犯罪记录、体检报告；办理周期约 4–6 周。': 'الثانوية أو أعلى + الشهادة، شهادة عدم المحكومية، التقرير الطبي؛ حوالي 4–6 أسابيع.',    '证据收集 → 联系顾问 → 申请风险处置备用金 → 领事协助 → 仲裁/诉讼路径。': 'جمع الأدلة ← التواصل مع المستشار ← صندوق الطوارئ ← المساعدة القنصلية ← التحكيم/التقاضي.',    '三份合同是什么、重点看哪几条、如何识别阴阳合同。': 'ما هي العقود الثلاثة وأي البنود الأهم وكيف تكتشف عدم التطابق.',    '个税申报、税收协定、结汇合规要点。': 'الإقرار الضريبي والاتفاقيات الضريبية والامتثال للصرف.',    '治安风险、自然灾害、政局动荡时的自救与求助流程。': 'المخاطر الأمنية والكوارث الطبيعية والمساعدة الذاتية أثناء الاضطرابات.',    '证件备份、保险确认、合同留存、紧急联系人设置、行前培训等。': 'نسخ الوثائق، تأكيد التأمين، حفظ العقد، جهات الطوارئ، التدريب.',    '欠薪、跑路等情形下的垫付条件与材料。': 'شروط ومستندات السلفة في حال الأجور غير المدفوعة أو هروب صاحب العمل.',    '出海知识助手': 'مساعد المعرفة الخارجية',    '签证材料': 'مستندات التأشيرة',    '安全注意': 'نصائح السلامة',    '欠薪维权': 'الأجور غير المدفوعة',    '合同要点': 'أساسيات العقد',    '更新': 'محدث',    '政策': 'سياسة',    '必备': 'أساسي',    '重点': 'مهم',    '必读': 'قراءة إلزامية',    '清单': 'قائمة',    '手册': 'الدليل',    'AI 助手': 'المساعد الذكي'
  ,
    '点开看': 'اضغط للعرض',    '我该做什么': 'ماذا أفعل',    '境外人身意外': 'الحوادث الشخصية بالخارج',    '雇主责任': 'مسؤولية صاحب العمل',    '专属顾问': 'المستشار المخصص',    '李顾问': 'المستشار لي',    '工作日': 'أيام العمل',    '欠薪垫付': 'سلفة الأجور',    '提交': 'تم الإرسال',    '雇主拖欠': 'صاحب العمل مدين',    '工资': 'الراتب',    '已催告两次未果': 'إشعاران دون استجابة',    '保障部坐席': 'مكتب الدعم',    '材料齐备': 'المستندات مكتملة',    '同意垫付': 'تمت الموافقة على السلفة',    '应发': 'الإجمالي',    '已发': 'المدفوع',    '我的': 'خاصتي',    '收入趋势': 'اتجاه الدخل',    '含基本工资与加班': 'يشمل الراتب والعمل الإضافي',    '合计': 'الإجمالي',    '薪酬明细': 'تفاصيل الرواتب',    '应急': 'طارئ',    '投递于': 'تم التقديم في',    '虚拟': 'تجريبي',    '阴阳合同': 'عدم تطابق العقود',    '未发现': 'لم يُعثر على',    '风险': 'المخاطر',    '外派培训合格证': 'شهادة التدريب',    '长期': 'طويل الأجل',    '境外保险单': 'بوليصة تأمين خارجية',    '凌晨好': 'صباح الخير',    '张伟': 'تشانغ وي',    '你的': 'الخاص بك',    '已进入': 'دخلت',    '签证材料补交': 'مستندات التأشيرة معلقة',    '环节': 'مرحلة',    '还有': 'متبقية',    '项待办': 'مهام',    '目标': 'الهدف',    '投递': 'تم التقديم',    '资质': 'المؤهل',    '面试': 'مقابلة',    '签约': 'التعاقد',    '签证': 'التأشيرة',    '出境': 'المغادرة',    '在岗': 'في الخدمة',    '回流': 'العودة',    '查看投递详情': 'عرض الطلب',    '雇主资质': 'مؤهلات صاحب العمل',    '对外劳务合作资质已核验': 'تم التحقق من ترخيص التعاون',    '已核验': 'تم التحقق'
  ,
    '本月应发': 'إجمالي هذا الشهر',    '本月已发': 'المدفوع هذا الشهر',    '基本工资': 'الراتب الأساسي',    '总收入': 'إجمالي الدخل',    '应发': 'الإجمالي',    '已发': 'المدفوع',    '海外津贴': 'بدل الخارج',    '个税代扣': 'ضريبة مستقطعة',    '社保个人部分': 'التأمين الاجتماعي',    '实发': 'صافي الراتب',    '历史发放记录': 'سجل المدفوعات',    '薪酬明细': 'تفاصيل الرواتب',    '收入趋势': 'اتجاه الدخل',    '我的': 'خاصتي',    '合计': 'الإجمالي',    '应急': 'طارئ',    '专属顾问': 'المستشار المخصص',    '李顾问': 'المستشار لي',    '境外人身意外': 'الحوادث الشخصية بالخارج',    '雇主责任': 'مسؤولية صاحب العمل',    '工作日': 'أيام العمل',    '未发现': 'لم يُعثر على',    '风险': 'المخاطر',    '阴阳合同': 'عدم تطابق العقود',    '三份合同关键条款一致性校验通过': 'تم اجتياز فحص الاتساق',    '投递于': 'تم التقديم في',    '应急热线': 'الخط الساخن',    '一键呼叫': 'اتصال بنقرة',    '我的待办': 'مهامي',    '点击了解': 'معرفة المزيد',    '已纳入': 'مشمول',    '风险备用金': 'صندوق الطوارئ',    '已纳入保障通道': 'مشمول في قناة الدعم'
  ,
    '我的月收入趋势': 'اتجاه دخلي الشهري',    '本月薪酬明细': 'تفاصيل رواتب هذا الشهر',    '月份': 'الشهر',    '合计': 'الإجمالي',    '加班/补贴': 'العمل الإضافي / البدلات',    '万元': '10,000 يوان',    '应急热线': 'الخط الساخن',    '影响签证预审': 'يؤثر على الفحص المسبق للتأشيرة',    '补交体检报告': 'تقديم التقرير الطبي',    '指定医院体检': 'الفحص في مستشفى معتمد',    '截止': 'الموعد النهائي',    '去处理': 'معالجة الآن',    '投递于': 'تم التقديم في',    '未发现': 'لم يُعثر على',    '风险': 'المخاطر',    '阴阳合同': 'عدم تطابق العقود',    '三份合同关键条款一致性校验通过': 'تم اجتياز فحص الاتساق',    '境外人身意外': 'الحوادث الشخصية بالخارج',    '雇主责任': 'مسؤولية صاحب العمل',    '专属顾问': 'المستشار المخصص',    '李顾问': 'المستشار لي',    '工作日': 'أيام العمل',    '欠薪垫付': 'سلفة الأجور',    '提交': 'تم الإرسال',    '雇主拖欠': 'صاحب العمل مدين',    '月工资': 'الراتب الشهري',    '已催告两次未果': 'إشعاران دون استجابة',    '材料齐备': 'المستندات مكتملة',    '同意垫付': 'تمت الموافقة على السلفة',    '应急': 'طارئ'
  ,
    '在办项目': 'المشاريع النشطة',    '本月账单': 'فواتير هذا الشهر',    '项目健康度': 'صحة المشاريع',    '各环节合规与进度综合评估': 'الامتثال والتقدم',    '人员结构': 'هيكل القوى العاملة',    '当前在册': 'المسجلون حاليًا',    '招募匹配': 'مطابقة التوظيف',    '签约合规': 'امتثال العقود',    '证照手续': 'الوثائق والتصاريح',    '在岗履约': 'الأداء في الخدمة',    '结算对账': 'التسوية',    '派遣中人员': 'الموظفون المرسلون',    '当地雇员': 'الموظفون المحليون',    '本月应结算': 'مستحق هذا الشهر',    '项目人力资源负责人': 'مسؤول الموارد البشرية',    '今日有': 'اليوم',    '个新项目待立项': 'مشاريع جديدة معلقة',    '个项目在册': 'مشاريع مسجلة',    '个项目岗位': 'وظائف المشاريع',    '笔账单待确认': 'فواتير بانتظار التأكيد',    '人在册': 'مسجل'
  ,
    '结算趋势': 'اتجاه التسويات',    '派遣薪酬': 'رواتب المُرسلين',    '当地薪酬': 'الرواتب المحلية',    '待办事项': 'المهام',    '结算账单确认': 'تأكيد فاتورة التسوية',    '阿尔及利亚项目 9 月账单 · 截止明日': 'فاتورة مشروع الجزائر لشهر سبتمبر · تستحق غدًا',    '5 名派遣人员签证材料补交': '5 موظفين بحاجة لمستندات تأشيرة',    '学历证明扫描件 · 影响签证预审': 'صور الشهادات · تؤثر على الفحص المسبق',    '当地雇员保险续保确认': 'تأكيد تجديد تأمين الموظفين المحليين',    '中方派遣': 'الإرسال الصيني',    '储备候选人': 'مرشحون احتياطيون',    '海外项目 HR': 'الموارد البشرية للمشروع',    '近': 'آخر',    '周末': 'عطلة',    '储蓄': 'مدخرات',    '招聘渠道': 'قنوات التوظيف',    '岗位简报': 'ملخص الوظيفة',    '人才库': 'مجموعة المواهب',    '合规': 'الامتثال',    '报表': 'التقارير'
  ,
    '海外用工派遣平台': 'منصة التوظيف الخارجي',    '全球海外派遣 · 全周期数字化平台': 'الإرسال العالمي · منصة رقمية كاملة الدورة',    '我是应聘者': 'أنا مرشح',    '找海外工作，全程看得见进度、合同和保障。': 'ابحث عن وظيفة بالخارج مع متابعة شفافة.',    '我是企业': 'أنا صاحب عمل',    '发布岗位、管理人员、合规结算，一站式调度。': 'انشر الوظائف وأدر الموظفين وسوّف بامتثال.',    '演示账号一键进入': 'الدخول بحساب تجريبي',    '保障部入口 →': 'بوابة الدعم ←',    '保障部入口': 'بوابة الدعم'
  ,
    'kbQ.visa': 'مستندات التأشيرة',    'kbQ.safety': 'نصائح السلامة',    'kbQ.wages': 'الأجور غير المدفوعة',    'kbQ.contract': 'أساسيات العقد',    'kbQ.postJob': 'نشر وظيفة',    'kbQ.compliance': 'الامتثال',    'kbQ.settle': 'قواعد التسوية',    'kbQ.risk': 'معالجة المخاطر',    'kbQ.ticket': 'معالجة التذاكر',    'kbQ.audit': 'تدقيق العقود',    'kbQ.alert': 'تنبيهات المخاطر',    'kbQ.globe': 'النظرة العالمية',    'ai.thinking': 'يقوم المساعد بالاستعلام…',    'ai.source': 'المصدر: ',    'ai.refOnly': ' · للإشارة فقط',    'ai.failed': 'فشل استدعاء المساعد: ',    'ai.unknown': 'خطأ غير معروف'
  ,
    '智能体治理': 'حوكمة المساعدين',    '抽检复核 · 高风险拦截 · 配额与停用，把「模型说了算」变成可管可查': 'مراجعة بالعينة · اعتراض المخاطر العالية · الحصص والتعطيل',    '演示数据': 'بيانات تجريبية',    '刷新': 'تحديث',    '已部署智能体': 'المساعدون المنشورون',    '版本 / 状态 / 今日调用': 'الإصدار / الحالة / الاستدعاءات اليوم',    '智能体': 'المساعد',    '版本': 'الإصدار',    '今日': 'اليوم',    '待复核': 'للمراجعة',    '状态': 'الحالة',    '运行策略': 'سياسة التشغيل',    '保存后立即生效': 'يسري فور الحفظ',    '抽检比例': 'معدل العينة',    '按比例随机把回答送入复核队列，用于持续评估质量': 'يوجه الإجابات عشوائيًا إلى قائمة المراجعة لتقييم الجودة',    '每日调用上限': 'حد الاستدعاءات اليومي',    '应聘者 / 企业 / 保障部': 'المرشح / صاحب العمل / الدعم',    '发送前对手机号 / 身份证 / 护照做脱敏': 'إخفاء الهاتف / الهوية / جواز السفر قبل الإرسال',    '保存策略': 'حفظ السياسة',    '复核队列': 'قائمة المراجعة',    '条待处理': 'معلقة',    '成本与用量': 'التكلفة والاستخدام',    '按 token 估算 · 单价可在 server/.env 调整': 'تقدير بالرمز · السعر في server/.env',    '系统状态': 'حالة النظام',    '数据库引擎与数据规模': 'محرك القاعدة وحجم البيانات',    '读取中…': 'جارٍ التحميل…',    '待审批': 'بانتظار الموافقة',    '已通过': 'تمت الموافقة',    '已驳回': 'مرفوض',    '审批意见': 'ملاحظة المراجعة',    '通过': 'موافقة',    '驳回': 'رفض',    '智能体版本': 'إصدار المساعد',    '今日调用': 'استدعاءات اليوم',    '抽检': 'العينة',    '停用': 'معطل',    '启用': 'مفعل',    '候选人发现': 'اكتشاف المواهب',    '投递管理': 'إدارة الطلبات',    '项目管理': 'إدارة المشاريع',    '概览台': 'نظرة عامة',    '服务台': 'مكتب الخدمة',    '报告与对账': 'التقارير والتسوية',    '成员与权限': 'الأعضاء والصلاحيات',    '全球态势': 'النظرة العالمية',    '全球能力矩阵': 'القدرات العالمية',    '全周期看板': 'لوحة دورة الحياة',    '风险预警': 'تنبيهات المخاطر',    '合同审计': 'تدقيق العقود',    '工单': 'التذاكر',    '审计日志': 'سجل التدقيق',    '报表': 'التقارير'
  ,
    '三个身份合计': 'إجمالي الأدوار الثلاثة',    '其中高风险': 'منها عالية الخطورة',    '复核通过率': 'معدل اجتياز المراجعة',    '已复核': 'تمت المراجعة',    '策略页可调': 'قابل للضبط في صفحة السياسة',    '保存即生效': 'يسري عند الحفظ',    '出海顾问': 'المستشار الخارجي',    '启用中': 'مفعل',    '合同一致性审计员': 'مدقق اتساق العقود',    '签证材料预审员': 'مدقق مستندات التأشيرة',    '风险分诊员': 'وكيل فرز المخاطر',    '结算核对员': 'مدقق التسوية',    '文书翻译与润色': 'ترجمة الوثائق وتحسينها',    '今日用量': 'الاستخدام اليوم',    '条记录': 'سجلات',    '高风险': 'خطورة عالية',    '风险命中': 'إصابات المخاطر',    '含证件或手机号': 'يحتوي هوية أو هاتف',    '结论': 'الخلاصة',    '预审': 'الفحص المسبق',    '项材料': 'مستندات',    '其中': 'منها',    '缺什么': 'ما الناقص',    '指定医院体检报告': 'تقرير طبي من مستشفى معتمد',    '个月内': 'أشهر',    '这是阻断项': 'هذا عائق',    '截止': 'الموعد',    '还有': 'متبقي',    '护照': 'جواز السفر',    '有效期': 'صالح حتى',    '个月': 'أشهر',    '系统显示': 'يعرض النظام',    '未上传': 'غير محمّل',    '到期': 'ينتهي',    '满足': 'مطابق',    '打回': 'معاد',    '天内到期': 'أيام قبل الانتهاء',    '待办截止': 'المهمة مستحقة',    '只剩': 'فقط',    '必须去阿方认可的指定医院做': 'يجب في مستشفى معتمد من الجزائر',    '普通医院的体检单不认': 'لا تُقبل تقارير المستشفيات العادية',    '本身完全够用': 'كافٍ تمامًا',    '扫描件没传': 'لم يتم تحميل الصورة',    '不是要换护照': 'لا حاجة لتجديد الجواز',    '先确认是': 'تأكد أولًا مما إذا',    '你名下护照': 'جواز سفرك',    '有效期到': 'صالح حتى',    '这是当前唯一卡住流程的材料': 'هذا المستند الوحيد المعيق',    '你护照本身是有效的': 'جواز سفرك صالح',    '护照页未上传': 'صفحة الجواز غير محملة',    '帮我预审签证材料': 'فحص مستندات التأشيرة',    '还不能送签': 'لا يمكن تقديمه بعد',    '也是你当前唯一的待办': 'وهي مهمتك المعلقة الوحيدة',    '所以大概率只是': 'لذلك على الأرجح هو فقط',    '需要一起处理': 'يجب معالجتها معًا',    '而且你手上还有一项证照快到期': 'وإحدى وثائقك على وشك الانتهاء',    '个月内有效': 'صالح خلال أشهر',    '项是硬性阻断项': 'عوائق صارمة'
  ,
    '证件通过': 'المستندات مقبولة',    '当前显示': 'عرض',    '中式厨师': 'طاهٍ للمأكولات الصينية',    '员工食堂': 'مقصف الموظفين',    '驻外会计': 'محاسب خارجي',    '中文': 'الصينية',    '生产主管': 'مشرف الإنتاج',    '中方负责人': 'المسؤول الصيني',    '关键条件': 'الشروط الرئيسية',    '期望薪资': 'الراتب المتوقع',    '工作年限': 'سنوات الخبرة',    '驻外经历': 'الخبرة الخارجية',    '点击查看完整简历': 'عرض السيرة الكاملة',    '邀面试': 'دعوة لمقابلة',    '到岗': 'متاح',    '期望': 'متوقع',    '证件': 'المستندات',    '齐全': 'مكتمل',    '上一页': 'السابق',    '下一页': 'التالي',    '厨师长': 'رئيس الطهاة',    '中级职业资格证': 'شهادة مهنية متوسطة',    '技校': 'مدرسة مهنية',    '大专': 'دبلوم',    '本科': 'بكالوريوس',    '初中': 'المتوسطة',    '高中': 'الثانوية',    '硕士': 'ماجستير',    '博士': 'دكتوراه'
  ,
    '小时': 'ساعات',    '分钟': 'دقائق',    '万元': '10,000 يوان',    '待处理': 'معلقة',    '条记录': 'سجلات',    '全部': 'الكل',    '全部已读': 'تحديد الكل كمقروء',    '已全部读取': 'تم تحميل الكل',    '暂无数据': 'لا توجد بيانات',    '加载中': 'جارٍ التحميل'
  ,
    '随机抽检': 'عينة عشوائية',    '业务对象': 'كائنات الأعمال',    '运行记录': 'سجلات التشغيل',    '复核记录': 'سجلات المراجعة',    '签证结果承诺': 'وعد بنتيجة التأشيرة',    '法律定性表述': 'توصيف قانوني',    '知识库条目': 'مدخل قاعدة المعرفة',    '共': 'إجمالي',    '待复核': 'للمراجعة',    '已复核': 'تمت المراجعة',    '抽检': 'العينة',    '治理': 'الحوكمة',    '策略': 'السياسة',    '配额': 'الحصة',    '拦截': 'الاعتراض',    '脱敏': 'الإخفاء',    '模型': 'النموذج',    '费用': 'التكلفة',    '用量': 'الاستخدام',    '调用': 'الاستدعاءات'
  ,
    '中方派遣': 'الإرسال الصيني',    '当地用工': 'التوظيف المحلي',    '本月用工报告': 'تقرير القوى العاملة الشهري',    '派遣': 'الإرسال',    '当地': 'محلي',    '出勤率': 'معدل الحضور',    '无合规预警项': 'لا تنبيهات امتثال',    '本月派遣薪酬结算': 'تسوية رواتب المُرسلين',    '当地雇员薪酬结算': 'تسوية رواتب الموظفين المحليين',    '示例数据': 'بيانات نموذجية',    '结算明细': 'تفاصيل التسوية',    '口径': 'الأساس',    '结算单': 'مذكرة التسوية',    '结算单号': 'رقم التسوية',    '项目': 'المشروع',    '类别': 'الفئة',    '金额': 'المبلغ',    '发票': 'الفاتورة',    '中方派遣薪酬': 'رواتب المُرسلين الصينيين',    '当地雇员薪酬': 'رواتب الموظفين المحليين',    '未开票': 'غير مفوتور',    '已确认': 'مؤكد',    '已开票': 'تم الفوترة',    '沙特': 'السعودية',    '沙特阿拉伯': 'السعودية',    '中国': 'الصين',    '双轨用工': 'توظيف مزدوج المسار',    '许可': 'التصريح',    '学历与无犯罪记录公证': 'تصديق الشهادة وعدم المحكومية',    '双认证': 'تصديق مزدوج',    '指定医院体检': 'فحص في مستشفى معتمد',    '有效': 'صالح',    '配额制': 'بنظام الحصص',    '学历': 'التعليم',    '无犯罪': 'دون سجل جنائي',    '齐套率': 'معدل الاكتمال',    '补件': 'مستندات تكميلية',    '保险': 'التأمين',    '离职': 'إنهاء الخدمة',    '回国': 'العودة للوطن',    '每段有交付物与': 'كل مرحلة لها مخرجات و',    '工作许可': 'تصريح العمل',    '暂住卡': 'بطاقة إقامة',    '工作签证': 'تأشيرة عمل',    '运行中': 'قيد التشغيل',    '筹备': 'قيد الإعداد',    '可开通': 'متاح',    '平均周期': 'المدة المتوسطة',    '关键合规要点': 'نقاط الامتثال الرئيسية',    '在办': 'نشط',    '国家': 'الدولة',    '目的地口径': 'متطلبات الوجهة',    '全周期 8 阶段': '8 مراحل دورة الحياة',    '交付物与 SLA': 'المخرجات و SLA'
  ,
    '分项得分': 'تفصيل الدرجات',    '推荐理由': 'سبب التوصية',    '风险提示': 'ملاحظات المخاطر',    '推理过程': 'عملية الاستدلال',    '候选人期望': 'المرشح يتوقع',    '岗位区间': 'نطاق الوظيفة',    '具备议价空间': 'هامش للتفاوض',    '地点匹配': 'تطابق الموقع',    '无语言要求': 'لا متطلب لغوي',    '区间内': 'داخل النطاق',    '岗位匹配结果': 'نتائج المطابقة',    '分项': 'التفصيل',    '得分': 'الدرجة',    '匹配度': 'درجة المطابقة',    '推荐': 'موصى به',    '完整简历': 'السيرة الكاملة',    '返回排名': 'العودة إلى الترتيب',    '返回分析界面': 'العودة إلى التحليل',    '切换岗位': 'تغيير الوظيفة',    '本地服务': 'خدمة محلية',    '解析岗位要求': 'تحليل المتطلبات',    '读取候选人档案': 'قراءة الملف',    '硬性条件闸门': 'بوابة الشروط',    '技能匹配': 'مطابقة المهارات',    '薪资区间比对': 'مقارنة الرواتب',    '地点与语言': 'الموقع واللغة',    '语义复核（大模型）': 'المراجعة الدلالية',    '加权计算': 'الحساب المرجح',    '生成推荐': 'توليد التوصية',    '已完成': 'مكتمل',    '进行中': 'قيد التنفيذ',    '条证据': 'نقاط دليل',    '条差距': 'فجوات',    '置信度': 'الثقة',    '耗时': 'المدة',    '规则分': 'درجة القواعد',    '自定义权重': 'أوزان مخصصة',    '门槛通过': 'تم تجاوز الحد',    '证据': 'دليل',    '差距': 'فجوات',    '技能': 'المهارات',    '证书': 'الشهادات',    '薪资': 'الراتب',    '地点': 'الموقع',    '经验': 'الخبرة',    '可用性': 'التوفر',    '合格': 'مؤهل',    '待定': 'قيد التحديد',    '同传面试': 'المقابلة المترجمة',    '雇主确认录用': 'تم تأكيد التعيين'
  ,
    '停止': 'إيقاف',    '下一步': 'الخطوة التالية',    '面试匹配': 'مطابقة المقابلة',    '合同签署': 'توقيع العقد',    '出境办理': 'إجراءات المغادرة',    '期满回流': 'العودة بعد انتهاء المدة',    '我的专属顾问': 'مستشاري المخصص',    '电话': 'هاتف',    '我的收藏': 'مفضلاتي',    '阿尔及利亚玻璃制品工厂': 'مصنع الزجاج في الجزائر',    '企业已核验': 'تم التحقق من الشركة',    '补充材料': 'مواد تكميلية',    '查看合同': 'عرض العقد',    '撤回申请': 'سحب الطلب',    '注塑调机技师': 'فني ضبط ماكينات الحقن',    '展开': 'توسيع',    '顾问确认': 'تأكيد المستشار',    '企业查看': 'مراجعة الشركة',    '邀约面试': 'دعوة للمقابلة',    '已录取': 'تم القبول',    '查看岗位详情': 'عرض تفاصيل الوظيفة',    '撤回投递': 'سحب الطلب',    '压机操作工（双头压机线）': 'مشغل مكبس (خط مكبس مزدوج الرأس)',    '焊接技工（管道）': 'فني لحام (أنابيب)',    '玻璃压机操作工（夜班）': 'عامل تشغيل مكبس الزجاج (الوردية الليلية)',    '玻璃压机操作工': 'عامل تشغيل مكبس الزجاج',    '东南亚电子装配线（示例）': 'خط تجميع الإلكترونيات في جنوب شرق آسيا (مثال)',    '已放弃': 'تم التخلي',    '中亚矿业技术服务（示例）': 'الخدمات التقنية للتعدين في آسيا الوسطى (مثال)',    '储备中': 'في الاحتياط',    '示例对外劳务合作公司（演示）': 'شركة التعاون العمالي الخارجي النموذجية (عرض توضيحي)',    '阿尔及利亚某玻璃厂（演示）': 'مصنع زجاج في الجزائر (عرض توضيحي)',    '遇到劳务纠纷': 'مواجهة نزاع عمالي',    '家属一键通知（演示）': 'إشعار الأقارب بنقرة واحدة (تجريبي)',    '已结汇到账（演示）': 'تم التحويل وتسجيل الوصول (عرض توضيحي)',    '三份合同是什么、重点看哪几条、如何识别阴阳合同': 'ما هي العقود الثلاثة، وأي البنود يجب التركيز عليها، وكيفية التعرف على العقود المزدوجة',    '个税申报、税收协定、结汇合规要点': 'الإقرار الضريبي الشخصي، الاتفاقيات الضريبية، النقاط الرئيسية للامتثال في تسوية النقد الأجنبي',    '治安风险、自然灾害、政局动荡时的自救与求助流程': 'إجراءات الحماية الذاتية وطلب المساعدة عند المخاطر الأمنية والكوارث الطبيعية والاضطرابات السياسية',    '欠薪、跑路等情形下的垫付条件与材料': 'شروط ومواد الدفع المسبق في حالات تأخر الأجور والهروب وغيرها',    '签证节点': 'مرحلة التأشيرة',    '保险生效': 'سريان التأمين',    '政策更新': 'تحديث السياسات',    '阿尔及利亚工作许可材料要求已更新至知识库': 'تم تحديث متطلبات مواد تصريح العمل في الجزائر في قاعدة المعرفة',    '顾问消息': 'رسالة المستشار',    '可以问我签证材料、合同须知、维权流程等问题': 'يمكنك سؤالي عن مواد التأشيرة، وإرشادات العقود، وإجراءات حماية الحقوق وغيرها',    '阿尔及利亚签证要什么材料': 'ما هي المواد المطلوبة لتأشيرة الجزائر',    '欠薪怎么维权': 'كيف أطالب بحقوقي عند تأخر الأجور',    '合同怎么看': 'كيف أقرأ العقد',    '体检报告去哪做': 'أين أجري تقرير الفحص الطبي',    '中式厨师（员工食堂）': 'طاهٍ صيني (مقصف الموظفين)',    '提醒': 'تذكير',    '重点项目进度': 'تقدم المشاريع الرئيسية',    '项目建档': 'إنشاء ملف المشروع',    '岗位需求结构化': 'هيكلة متطلبات الوظائف',    '人才招募与推荐': 'استقطاب المواهب والترشيح',    '合同签约与备案': 'توقيع العقود والتسجيل',    '预计批量签约': 'التوقيع الجماعي المتوقع',    '出境合规办理': 'إجراءات الامتثال للسفر إلى الخارج',    '新建项目': 'مشروع جديد',    '链路进度': 'تقدم سلسلة الإجراءات',    '双轨用工配置': 'تكوين التوظيف مزدوج المسار',    '中方派遣人员': 'الموظفون الموفدون من الصين',    '派遣链': 'سلسلة الإيفاد',    '当地用工人员': 'الموظفون المحليون',    '当地链': 'السلسلة المحلية',    '合规状态': 'حالة الامتثال',    '良好': 'جيد',    '发起岗位需求': 'بدء متطلبات الوظيفة',    '岗位名称与人数': 'اسم الوظيفة وعدد الأشخاص',    '匹配评分规则': 'قواعد تقييم المطابقة',    '恢复默认': 'استعادة الإعدادات الافتراضية',    '提交岗位需求': 'تقديم متطلبات الوظيفة',    '增值服务': 'خدمات القيمة المضافة',    '签证可行性预审': 'المراجعة المسبقة لجدوى التأشيرة',    '简历翻译润色': 'ترجمة السيرة الذاتية وتنقيحها',    '目的国政策问答': 'أسئلة وأجوبة حول سياسات الدولة المضيفة',    '多语言实时同传在线面试': 'مقابلة عبر الإنترنت بترجمة فورية متعددة اللغات في الوقت الفعلي',    '含加急、续签': 'يشمل الخدمة العاجلة والتجديد',    '合作服务商': 'مزود الخدمة المتعاون',    '百万级保额': 'تغطية تأمينية بملايين الدراهم',    '工资代发与国际结汇': 'صرف الرواتب والتحويلات الدولية',    '多币种跨境支付': 'مدفوعات عابرة للحدود متعددة العملات',    '当地备案代办': 'خدمة التسجيل المحلي بالنيابة',    '工作许可、居留许可': 'تصريح العمل وتصريح الإقامة',    '账单编号': 'رقم الفاتورة',    '周期': 'الدورة',    '核对': 'مراجعة',    '异议': 'اعتراض',    '案例实证': 'إثباتات حالة عملية',    '阿尔及利亚外国员工工作许可': 'تصريح عمل الموظفين الأجانب في الجزائر',    '办理周期与材料清单': 'مدة الإنجاز وقائمة المستندات',    '渠道库': 'مكتبة القنوات',    '目的国当地招聘渠道': 'قنوات التوظيف المحلية في بلد المقصد',    '本地招聘平台、职业介绍所、社区渠道清单及使用建议': 'منصات التوظيف المحلية ومكاتب التوظيف وقنوات المجتمع المحلي وقائمة الاستخدام والتوصيات',    '模板': 'قالب',    '外派人员劳动合同（中阿双语）': 'عقد عمل الموظفين المنتدبين (ثنائي اللغة الصينية والعربية)',    '流程': 'الإجراءات',    '结算对账与发票流程': 'إجراءات التسوية والمطابقة والفوترة',    '导出报告': 'تصدير التقرير',    '在岗人员趋势': 'اتجاه الموظفين على رأس العمل',    '添加成员': 'إضافة عضو',    '节点自动推送': 'إشعار تلقائي بالعقد',    '保险续保': 'تجديد التأمين',    '资讯': 'أخبار',    '面试安排': 'ترتيب المقابلات',    '申请调整成员权限': 'طلب تعديل صلاحيات الأعضاء',    '暂无待审批事项': 'لا توجد عناصر بانتظار الموافقة حالياً',    '企业成员': 'أعضاء المؤسسة',    '查看项目': 'عرض المشروع',    '维护项目': 'صيانة المشروع',    '查看账单': 'عرض الفاتورة',    '确认账单/异议': 'تأكيد الفاتورة/الاعتراض',    '服务下单': 'طلب الخدمة',    '查看员工材料': 'عرض مواد الموظفين',    '查看消息': 'عرض الرسائل',    '成员': 'الأعضاء',    '当前账号': 'الحساب الحالي',    '编辑权限': 'تعديل الصلاحيات',    '财务专员': 'أخصائي مالي',    '项目经理': 'مدير المشروع',    '离线': 'غير متصل',    '选择岗位': 'اختيار الوظيفة',    '匹配分析': 'تحليل المطابقة',    '全部分析': 'جميع التحليلات',    '收藏夹': 'المفضلة',    '评分规则': 'قواعد التقييم',    '条件': 'الشروط',    '持证': 'حاصل على شهادة',    '仅门槛通过': 'المجتازون للحد الأدنى فقط',    '有健康证': 'لديه شهادة صحية',    '有驻外经历': 'لديه خبرة عمل بالخارج',    '仅已投递': 'المتقدمون فقط',    '中专及以上': 'التعليم الثانوي المهني أو أعلى',    '大专及以上': 'دبلوم أو أعلى',    '本科及以上': 'بكالوريوس أو أعلى',    '排序': 'ترتيب',    '综合排序': 'ترتيب شامل',    '经验优先': 'الخبرة أولاً',    '到岗优先': 'الالتحاق أولاً',    '按姓名': 'حسب الاسم',    '李国强': 'لي قوه تشيانغ',    '注塑领班': 'مشرف حقن البلاستيك',    '玻璃压机操作': 'تشغيل مكبس الزجاج',    '工艺参数调整': 'ضبط معايير العملية',    '安全规程': 'لوائح السلامة',    '已备': 'متوفر',    '设备点检': 'فحص المعدات الدوري',    '三班倒作业': 'العمل بنظام ثلاث ورديات',    '赵海涛': 'تشاو هاي تاو',    '压机操作工': 'مشغل مكبس',    '部分': 'جزئي',    '吴天成': 'وو تيانتشنغ',    '吴卫东': 'وو وي دونغ',    '张春生': 'تشانغ تشون شنغ',    '离心机操作工': 'مشغل جهاز الطرد المركزي',    '高俊杰': 'قاو جيون جيه',    '黄立新': 'هوانغ ليشين',    '窑炉工': 'عامل فرن',    '李跃进': 'لي يويجين',    '马立新': 'ما ليشين',    '模具维修工': 'فني صيانة القوالب',    '何长顺': 'هه تشانغ شون',    '赵国强': 'تشاو قوه تشيانغ',    '徐瑞祥': 'شو رويتشيانغ',    '罗国庆': 'لو قوهتشينغ',    '电气工程师': 'مهندس كهرباء',    '徐天成': 'شو تيانتشنغ',    '质检员': 'فاحص جودة',    '郭少华': 'قوه شاوهوا',    '全周期阶段': 'المرحلة الكاملة للدورة',    '在途人员': 'الأفراد في الطريق',    '全球派遣网络': 'شبكة الإيفاد العالمية',    '目的国口径': 'معيار الدولة المستقبلة',    '雇主须先取得使用外籍劳工批复': 'يجب على صاحب العمل الحصول أولاً على موافقة استخدام العمالة الأجنبية',    '劳动合同与社保登记同步': 'تزامن عقد العمل مع تسجيل الضمان الاجتماعي',    '工作许可（配额制）': 'تصريح العمل (نظام الحصص)',    '年度配额、传染病筛查、部分岗位需职业资质': 'الحصة السنوية، فحص الأمراض المعدية، بعض الوظائف تتطلب مؤهلات مهنية',    '持续': 'مستمر',    '签证办理中': 'جارٍ إصدار التأشيرة',    '合同待签': 'العقد في انتظار التوقيع',    '合同一致性待复核': 'اتساق العقد في انتظار المراجعة',    '本期应急事件': 'أحداث الطوارئ لهذه الفترة',    '主链路泳道': 'مسار العملية الرئيسي',    '签证办理': 'إصدار التأشيرة',    '待处理风险': 'المخاطر المعلقة',    '欠薪风险': 'خطر تأخر الأجور',    '处置': 'المعالجة',    '证照过期': 'انتهاء صلاحية الوثائق',    '签证补件': 'استكمال مستندات التأشيرة',    '合同不一致': 'عدم اتساق العقد',    '审计结果': 'نتائج التدقيق',    '人员': 'الموظفون',    '薪资一致': 'تطابق الرواتب',    '工时一致': 'تطابق ساعات العمل',    '保险一致': 'تطابق التأمين',    '解约一致': 'تطابق إنهاء العقد',    '一致': 'متطابق',    '李强': 'لي تشيانغ',    '王芳': 'وانغ فانغ',    '赵磊': 'تشاو لي',    '不一致': 'غير متطابق',    '需复核': 'يحتاج إلى مراجعة',    '陈静': 'تشن جينغ',    '具体税务处理建议咨询专业税务师': 'يُنصح باستشارة خبير ضرائب محترف بشأن المعالجة الضريبية المحددة',    '新建工单': 'إنشاء تذكرة',    '工单列表': 'قائمة التذاكر',    '处理中': 'قيد المعالجة',    '闭环': 'حلقة مغلقة',    '已闭环': 'تم الإغلاق',    '待分派': 'في انتظار الإسناد',    '已处理': 'تمت المعالجة',    '最近记录': 'السجلات الأخيرة',    '动作': 'الإجراء',    '操作人': 'المشغّل',    '导出报表': 'تصدير التقرير',    '证照齐全率': 'نسبة اكتمال الوثائق',    '签证预审通过率': 'نسبة اجتياز الفحص المسبق للتأشيرة',    '合同一致性通过率': 'نسبة اجتياز اتساق العقود',    '数据库': 'قاعدة البيانات'
  ,
    '已连接后端': 'تم الاتصال بالخادم الخلفي',    '实时数据': 'بيانات فورية',    '一键呼叫': 'اتصال بنقرة واحدة',    '我的待办': 'مهامي المعلقة',    '影响签证预审': 'يؤثر على الفحص المسبق للتأشيرة',    '已签署': 'تم التوقيع',    '紧急': 'طارئ',    '开始引导': 'بدء الإرشاد',    '审批意见': 'رأي الموافقة',    '材料齐备': 'المستندات مكتملة',    '同意垫付': 'الموافقة على الدفع المسبق',    '已通过': 'تمت الموافقة',    '合计': 'الإجمالي',    '学历证明': 'إثبات المؤهل الدراسي',    '已上传': 'تم الرفع',    '查看详情': 'عرض التفاصيل',    '虚拟': 'افتراضي',    '已纳入': 'تم الإدراج',    '已核验': 'تم التحقق',    '已生效': 'ساري المفعول',    '已投保': 'مؤمَّن عليه',    '一键触达': 'وصول بنقرة واحدة',    '功能介绍': 'وصف الوظائف',    '待顾问确认': 'في انتظار تأكيد المستشار',    '面试中': 'قيد المقابلة',    '已投递': 'تم التقديم',    '已录取': 'تم القبول',    '储备中': 'في الاحتياط',    '已放弃': 'تم التخلي',    '个税申报、税收协定、结汇合规要点': 'الإقرار الضريبي الشخصي، الاتفاقيات الضريبية، النقاط الرئيسية للامتثال في تسوية النقد الأجنبي',    'AI 问答参考，非法律意见': 'مرجع أسئلة وأجوبة الذكاء الاصطناعي، وليس رأياً قانونياً',    '重大事项请转顾问或专业复核': 'يرجى إحالة الأمور المهمة إلى مستشار أو مراجعة متخصصة',    '投递于': 'تم التقديم في',    '待办': 'المهام المعلقة',    '进行中': 'قيد التنفيذ',    '已完成': 'مكتمل',    '待开始': 'في انتظار البدء',    '4月': 'أبريل',    '5月': 'مايو',    '6月': 'يونيو',    '7月': 'يوليو',    '8月': 'أغسطس',    '9月': 'سبتمبر'
  ,
    '已进入工作台': 'تم فتح مساحة العمل',    '当前身份：{role} · 已连接后端': 'الدور: {role} · متصل بالخادم',    '当前身份：{role}（演示）': 'الدور: {role} (تجريبي)',    '演示模式': 'الوضع التجريبي',    '「{a}」为前端原型交互，暂未接入后端': '"{a}" تفاعل نموذجي غير متصل بالخادم',    '{n} 项 · 影响签证预审': '{n} عنصر · يؤثر على الفحص المسبق',    '来源：{s} · 仅供参考': 'المصدر: {s} · للإشارة فقط',    '还有 {n} 项待办': '{n} مهام متبقية',    '共 {n} 个岗位': 'إجمالي {n} وظيفة',    '共 {a} 位候选人': 'إجمالي {a} مرشح',    '共 {n} 条': '{n} سجل',    '第 {a}/{b} 页': 'الصفحة {a} من {b}',    '已选 {n} 个': '{n} محدد',    '{n} 天后到期': 'ينتهي بعد {n} أيام',    '还有 {n} 位未读': '{n} غير مقروء',    '已完成 {a}/{b}': 'مكتمل {a}/{b}',    '共 {n} 条记录': 'إجمالي {n} سجل'
  ,
    '策略页可调，保存即生效': 'قابل للضبط في صفحة السياسة ويسري عند الحفظ',    '策略页可调': 'قابل للضبط في صفحة السياسة',    '保存即生效': 'يسري عند الحفظ',    '其中高风险 {n} 条': '{n} عالية الخطورة',    '已复核 {n} 条': '{n} تمت مراجعتها',    '出海顾问': 'المستشار الخارجي',    '合同一致性审计员': 'مدقق اتساق العقود',    '签证材料预审员': 'مدقق مستندات التأشيرة',    '风险分诊员': 'وكيل فرز المخاطر',    '结算核对员': 'مدقق التسوية',    '文书翻译与润色': 'ترجمة الوثائق وتحريرها',    '其中高风险': 'منها عالية الخطورة',    '已复核': 'تمت المراجعة',    '结论': 'الخلاصة',    '预审': 'الفحص المسبق',    '还不能送签': 'لا يمكن تقديمه بعد',    '缺 {n} 项材料': '{n} مستندات ناقصة',    '缺': 'ناقص',    '项材料': 'مستندات',    '硬性阻断项': 'عائق صارم',    '天内到期': 'أيام للانتهاء',    '得先处理': 'يجب معالجته أولًا',    '齐套率': 'الاكتمال',    '补齐后可使馆受理': 'بعد الاكتمال ستقبله السفارة',    '作为参考': 'للرجوع',    '知识库条目': 'مدخل قاعدة المعرفة',    '审计结果': 'نتيجة التدقيق',    '有没有不一致的地方': 'أي عدم اتساق',    '签证进度': 'تقدم التأشيرة',    '到哪一步了': 'في أي مرحلة',    '需要什么材料': 'ما المستندات المطلوبة'
  ,
    '机械操作工': 'مشغل آلة',    '酒店服务员': 'موظف فندق',    '电子厂普工': 'عامل مصنع إلكترونيات',    '装配技术员': 'فني تجميع',    '食品包装工': 'عامل تعبئة أغذية',    '高薪': 'راتب مرتفع',    '急招': 'توظيف عاجل',    '推荐': 'موصى به',    '地点': 'الموقع',    '所在地': 'الموقع',    '薪资': 'الراتب',    '工期': 'المدة',    '技能': 'المهارات',    '经验': 'الخبرة',    '中国·上海': 'الصين · شنغهاي',    '日本·东京': 'اليابان · طوكيو',    '德国·柏林': 'ألمانيا · برلين',    '阿联酋·迪拜': 'الإمارات · دبي',    '新加坡': 'سنغافورة',    '2年': 'سنتان',    '3年': '3 سنوات',    '1年': 'سنة واحدة',    '全球态势': 'الوضع العالمي',    '拖动旋转 · 滚轮缩放 · 点击卡片下钻': 'اسحب للتدوير · مرر للتكبير · انقر للتعمق',    '匹配度': 'درجة المطابقة',    '待补充': 'للإضافة',    '需 中级职业资格证': 'يتطلب شهادة مهنية',    '在分析中': 'جارٍ التحليل',    '分析中': 'جارٍ التحليل',    '个对象': 'كائنات',    '状态': 'الحالة',    '推理阶段': 'مرحلة الاستدلال',    '耗时': 'المدة',    '模型': 'النموذج',    '全局': 'عام',    '自动演示': 'عرض تلقائي',    '跳到结果': 'الانتقال إلى النتيجة',    '已暂停': 'متوقف مؤقتًا',    '重放': 'إعادة',    '查看结果': 'عرض النتيجة',    '当前岗位': 'الوظيفة الحالية',    '推理过程': 'عملية الاستدلال',    '分项得分': 'تفصيل الدرجات'
  ,
    '我的偏好权重': 'أوزان تفضيلاتي',    '权重会归一化到': 'تُطبع الأوزان إلى',    '默认值即原始评分': 'القيم الافتراضية هي التقييم الأصلي',    '还缺': 'لا يزال ناقصًا',    '份材料': 'مستندات',    '技能缺口': 'فجوات المهارات',    '调试': 'تصحيح',    '检测': 'فحص',    '中式烹饪': 'الطهي الصيني',    '食堂管理': 'إدارة المقصف',    '总账核算': 'دفتر الأستاذ',    '税务申报': 'الإقرار الضريبي',    '编程': 'البرمجة',    '确认撤回申请？': 'سحب هذا الطلب؟',    '撤回后本次申请将终止': 'سينتهي الطلب بعد السحب',    '如需重新申请需重新走流程': 'يجب إعادة العملية للتقديم مجددًا',    '确认撤回': 'تأكيد السحب',    '确定撤回对': 'سحب الطلب لـ',    '的投递吗': '؟',    '撤回后可重新投递': 'يمكنك التقديم مجددًا بعد السحب',    '但已进行的面试安排会取消': 'لكن ستُلغى المقابلات المجدولة',    '确定撤回': 'تأكيد السحب',    '在线对话': 'محادثة مباشرة',    '签证现在办到哪一步了': 'في أي مرحلة تأشيرتي؟',    '出发前需要准备哪些材料': 'ما المستندات المطلوبة قبل المغادرة؟',    '准备材料': 'تحضير المستندات',    '工资什么时候发放': 'متى تُدفع الأجور؟',    '怎么发': 'كيف تُدفع؟',    '工资发放': 'دفع الأجور',    '境外遇到问题怎么联系你': 'كيف أتواصل معك بالخارج؟',    '我与派遣公司': 'أنا ووكالة الإرسال',    '服务合同': 'عقد الخدمة',    '签署状态': 'حالة التوقيع',    '签署日期': 'تاريخ التوقيع',    '本页为系统生成的合同副本': 'هذه الصفحة نسخة مولدة من النظام',    '甲方': 'الطرف أ',    '乙方': 'الطرف ب',    '派遣方': 'الجهة المُرسِلة',    '环球派遣': 'الإرسال العالمي',    '国外雇主': 'صاحب العمل الأجنبي',    '劳务合作合同': 'عقد التعاون العمالي',    '派遣公司与国外雇主': 'الوكالة وصاحب العمل الأجنبي'
  ,
    'AI 助手': 'المساعد الذكي',    '你好，我是海外派遣 AI 助手。可以问我签证材料、合同须知、维权流程等问题。': 'مرحبًا، أنا مساعد الإرسال الخارجي. اسألني عن مستندات التأشيرة أو العقود أو حماية الحقوق.',    '仅供参考 · 非法律意见': 'للإشارة فقط · ليس استشارة قانونية',    '输入问题…': 'اطرح سؤالاً…',    '输入问题...': 'اطرح سؤالاً…',    '选择智能体': 'اختر مساعدًا',    '当前有多少待处理风险': 'كم عدد المخاطر المعلقة؟',    '合同不一致的项目': 'مشاريع بها عدم تطابق',    '今日应急事件': 'طوارئ اليوم',    '发送': 'إرسال',    '发送中': 'جارٍ الإرسال',    '助手正在思考…': 'المساعد يفكر…',    '智能体正在查询业务数据…': 'يقوم المساعد بالاستعلام…',    '服务说明': 'وصف الخدمة',    '处置': 'معالجة',    '确认': 'تأكيد',    '确认退出': 'تأكيد الخروج',    '退出登录': 'تسجيل الخروج',    '退出后需要重新选择身份进入。': 'ستحتاج لاختيار دور للدخول مجددًا.',    '岗位市场': 'سوق الوظائف',    '离线模式：岗位库由后端提供，请先启动服务。': 'الوضع غير المتصل: مكتبة الوظائف من الخادم.',    '未连接后端，无法派单。': 'غير متصل بالخادم، لا يمكن الإرسال.',    '将按风险等级生成应急工单并分派给保障部坐席。': 'سيتم إنشاء تذكرة طوارئ حسب مستوى الخطورة.',    '该培训已完成，可查看结业证明。': 'تم إكمال هذا التدريب.',    '该培训尚未完成，完成后才能出境。': 'لم يكتمل التدريب وهو مطلوب قبل المغادرة.',    '办理进度': 'حالة المعالجة',    '当前状态：办理中': 'الحالة: قيد المعالجة',    '材料已提交': 'تم تقديم المستندات',    '合规检查清单': 'قائمة الامتثال',    '雇主资质：已核验': 'مؤهلات صاحب العمل: تم التحقق',    '添加成员': 'إضافة عضو',    '账单核对': 'مطابقة الفاتورة',    '提交异议': 'تقديم اعتراض',    '结算明细': 'تفاصيل التسوية',    '离线模式：无法读取后端明细。': 'الوضع غير المتصل: التفاصيل غير متاحة.',    '知道了': 'فهمت',    '查看详情': 'التفاصيل',    '关闭': 'إغلاق',    '取消': 'إلغاء',    '保存': 'حفظ',    '删除': 'حذف',    '替换': 'استبدال',    '上传': 'تحميل',    '下载': 'تنزيل',    '预览': 'معاينة'
  };

  /* ---------- 词典：按 key 索引（新机制） ---------- */
  /* 岗位发现页样板 —— 后续按需扩充 */
  var KEYDICT = {
    en: {
      'nav.discover': 'Job Discovery',
      'nav.myJobs': 'My Applications',
      'nav.home': 'Home',
      'nav.contracts': 'Contracts & Docs',
      'nav.support': 'Overseas Support',
      'nav.payroll': 'Payroll',
      'nav.knowledge': 'Knowledge Base',
      'nav.profile': 'My Profile',
      'nav.messages': 'Messages',
      /* 企业侧导航 */
      'nav.cOverview': 'Overview', 'nav.cConsole': 'Business Board', 'nav.cPool': 'Resume Pool',
      'nav.cProjects': 'Projects',
      'nav.cApply': 'Applications',
      'nav.cTalent': 'Talent Discovery',
      'nav.cService': 'Service Desk',
      'nav.cKnowledge': 'Knowledge',
      'nav.cReport': 'Reports',
      'nav.cMembers': 'Team & Messages',
      /* 保障部导航 */
      'nav.aGlobe': 'Global View',
      'nav.aGlobal': 'Global Capability',
      'nav.aBoard': 'Lifecycle Board',
      'nav.aRisk': 'Risk Alerts',
      'nav.aAudit': 'Contract Audit',
      'nav.aGovern': 'Agent Governance',
      'nav.aApproval': 'Approvals',
      'nav.aTicket': 'Incident Tickets',
      'nav.aLog': 'Audit Log',
      'nav.aReport': 'Compliance Reports',
      'app.demoBadge': 'DEMO',
      /* 导航分组标题（侧栏小标题） */
      'nav.group.work': 'Workspace',
      'nav.group.job': 'Job Search',
      'nav.group.txn': 'Services',
      'nav.group.docs': 'Resources',
      'nav.group.biz': 'Business',
      'nav.group.situ': 'Situation',
      'nav.group.risk': 'Risk',
      'nav.group.case': 'Cases',
      /* 角色 */
      'role.persona': 'Candidate',
      'role.personaSub': 'Candidate Home',
      'role.company': 'Employer',
      'role.companySub': 'Client Company Home',
      'role.assurance': 'Support',
      'role.assuranceSub': 'Operations · Global Risk · Compliance',
      'brand.name': 'Global Dispatch',

      'discover.title': 'Job Discovery',
      'discover.desc': 'Filter jobs, save, apply, or run AI analysis',
      'discover.aiBtn': 'AI Assistant',

      'filter.search': 'Search jobs / country / skills, e.g. glass press, Algeria',
      'filter.clear': 'Clear filters',
      'filter.salary': 'Salary',
      'filter.country': 'Country',
      'filter.tags': 'Tags',
      'filter.state': 'Status',
      'filter.sort': 'Sort',
      'filter.salaryAll': 'All',
      'filter.salaryLow': 'Under 15K',
      'filter.salaryMid': '15–20K',
      'filter.salaryHigh': '20–25K',
      'filter.salaryTop': 'Above 25K',
      'filter.onlyOpen': 'Open only',
      'filter.undelivered': 'Not applied',
      'filter.favOnly': 'Saved',
      'filter.sortScore': 'Match score',
      'filter.sortNew': 'Newest',
      'filter.sortPay': 'Salary',

      'card.salary': 'Salary',
      'card.headcount': 'Open',
      'card.status': 'Status',
      'card.applied': 'Applied',
      'card.notApplied': 'Not applied',
      'card.saved': 'Saved',
      'card.people': 'people',
      'card.negotiable': 'Negotiable',

      'toolbar.analyze': 'Match analysis',
      'toolbar.analyzeAll': 'Analyze all',
      'toolbar.fav': 'Saved jobs',
      'toolbar.weights': 'Preference weights',

      'pager.total': 'jobs',
      'pager.page': 'Page',
      'pager.prev': 'Prev',
      'pager.next': 'Next',
      'pager.jump': 'Go',

      'empty.noJob': 'No jobs match your filters. Try clearing filters.',

      'toast.saved': 'Saved',
      'toast.unsaved': 'Removed from saved',
      'toast.applied': 'Application sent',
      'toast.applyFail': 'Apply failed',
      'toast.favFail': 'Save failed',

      /* 业务数据：枚举值 */
      'status.recruiting': 'Recruiting',
      'status.closed': 'Closed',
      'status.done': 'Filled',

      'tag.skill': 'Skilled',
      'tag.manage': 'Management',
      'tag.meal': 'Meals & housing',
      'tag.flight': 'Round-trip flights',
      'tag.weekend': 'Weekends off',
      'tag.allowance': 'Overseas allowance',
      'tag.simple': 'No experience required',

      /* 国家 */
      'country.DZ': 'Algeria',
      'country.VN': 'Vietnam',
      'country.KZ': 'Kazakhstan',
      'country.SA': 'Saudi Arabia',
      'country.AE': 'UAE',
      'country.SG': 'Singapore',
      'country.ID': 'Indonesia',
      'country.PH': 'Philippines',
      'country.TH': 'Thailand',
      'country.MY': 'Malaysia',
      'country.TZ': 'Tanzania',
      'country.NG': 'Nigeria',
      'country.PK': 'Pakistan',
      'country.BD': 'Bangladesh',
      'country.CN': 'China'
,
      'kbQ.visa': 'Visa documents',      'kbQ.safety': 'Safety tips',      'kbQ.wages': 'Unpaid wages',      'kbQ.contract': 'Contract basics',      'kbQ.postJob': 'Post a job',      'kbQ.compliance': 'Compliance',      'kbQ.settle': 'Settlement rules',      'kbQ.risk': 'Risk handling',      'kbQ.ticket': 'Handle tickets',      'kbQ.audit': 'Contract audit',      'kbQ.alert': 'Risk alerts',      'kbQ.globe': 'Global view',      'ai.thinking': 'The agent is querying business data…',      'ai.source': 'Source: ',      'ai.refOnly': ' · for reference only',      'ai.failed': 'Agent call failed: ',      'ai.unknown': 'unknown error'
        }
  };

  DICT.ar = Object.assign(DICT.ar || {}, {
    '岗位 AI 诊断': 'تشخيص الوظيفة بالذكاء الاصطناعي', '岗位诊断报告': 'تقرير تشخيص الوظيفة',
    '编辑岗位': 'تعديل الوظيفة', '发布岗位': 'نشر الوظيفة', '取消发布': 'إلغاء النشر',
    '查看报告': 'عرض التقرير', '返回分析': 'العودة إلى التحليل', '保存并重新分析': 'حفظ وإعادة التحليل',
    '保存并重新生成': 'حفظ وإعادة الإنشاء', 'AI 重新生成': 'إعادة الإنشاء بالذكاء الاصطناعي',
    'AI 润色': 'تحسين بالذكاء الاصطناعي', '语音 ON': 'الصوت ON', '语音 OFF': 'الصوت OFF',
    '重新分析': 'تحليل مرة أخرى', '岗位职责': 'مهام الوظيفة', '任职要求': 'متطلبات الوظيفة',
    '工作与生活': 'العمل والحياة', '招聘信息': 'معلومات التوظيف', '合同与手续': 'العقد والإجراءات',
    '诊断下一步': 'الخطوة التالية', '优势': 'المزايا', '需要补充': 'يجب استكماله',
    '分数构成': 'تفصيل الدرجات', '岗位要素对照': 'مقارنة عناصر الوظيفة', '待补充': 'غير مكتمل',
    '已发布': 'منشور', '草稿': 'مسودة', '岗位名称': 'اسم الوظيفة', '国家': 'الدولة', '项目': 'المشروع',
    '薪资': 'الراتب', '合同周期': 'مدة العقد', '招聘人数': 'عدد المطلوب', '基本信息': 'المعلومات الأساسية',
    '诊断建议': 'توصيات التشخيص', '采用建议': 'اعتماد التوصية', '返回列表': 'العودة إلى القائمة',
    '新建岗位': 'إنشاء وظيفة', '岗位信息比较完整': 'معلومات الوظيفة مكتملة نسبيًا',
    '需要补齐关键信息': 'يجب استكمال المعلومات الأساسية', '可以发布': 'جاهز للنشر',
    '建议补齐后发布': 'يُنصح بالاستكمال قبل النشر', '先补齐关键信息': 'استكمل المعلومات أولًا'
  });

  /* ---------- 日本語 / ไทย：核心固定文案（其余走实时翻译） ---------- */
  DICT.ja = Object.assign(DICT.ja || {}, {
    '岗位发现': '求人発見', '我的求职': '応募履歴', '我的主页': 'ホーム', '合同与证照': '契約・証明書',
    '海外保障中心': '海外サポート', '薪酬与结算': '給与・精算', '出海知识库': '海外ナレッジ', '我的档案': 'マイプロフィール',
    '消息与顾问': 'メッセージ', '概览台': '概要', '项目管理': 'プロジェクト管理', '投递管理': '応募管理',
    '候选人发现': '候補者発見', '匹配分析结果': 'マッチ分析結果', '服务台': 'サービスデスク', '知识库': 'ナレッジ',
    '报告与对账': 'レポート・照合', '消息与成员': 'メッセージ・メンバー', '全球态势': 'グローバル状況',
    '全球能力矩阵': 'グローバル能力マトリクス', '全生命周期看板': 'ライフサイクルボード', '风险预警中心': 'リスク警告',
    'AI 候选人匹配': 'AI候補者マッチング', 'AI 匹配推荐': 'AIマッチ推薦', '岗位详情': '求人詳細',
    '关闭': '閉じる', '取消': 'キャンセル', '保存': '保存', '返回': '戻る', '搜索': '検索', '刷新': '更新',
    '发布': '公開', '编辑': '編集', '预览': 'プレビュー', '删除': '削除', '确定': '確定', '确认': '確認',
    '查看报告': 'レポートを見る', '返回分析': '分析に戻る', '编辑岗位': '求人編集', '发布岗位': '求人を公開',
    '取消发布': '公開を停止', '岗位预览': '求人プレビュー', '岗位 AI 诊断': '求人AI診断',
    '岗位诊断报告': '求人診断レポート', '重新分析': '再分析', '重新生成': '再生成', 'AI 重新生成': 'AI再生成',
    'AI 润色': 'AI推敲', 'AI 润色这段': 'この段落をAI推敲', 'AI 重新生成岗位内容': '求人内容をAIで再生成',
    '保存草稿': '下書き保存', '保存并重新生成': '保存して再生成', '保存并重新分析': '保存して再分析',
    '语音 ON': '音声 ON', '语音 OFF': '音声 OFF', '分析中': '分析中', '分析完成': '分析完了',
    '岗位职责': '職務内容', '任职要求': '応募要件', '工作与生活': '勤務・生活', '招聘信息': '募集情報',
    '合同与手续': '契約・手続き', '诊断下一步': '次のステップ', '优势': '強み', '需要补充': '補足が必要',
    '分数构成': 'スコア内訳', '岗位要素对照': '求人要素の対照', '待补充': '未入力', '已发布': '公開済み',
    '草稿': '下書き', '招聘人数': '募集人数', '薪资': '給与', '合同周期': '契約期間', '国家': '国', '项目': 'プロジェクト',
    '岗位名称': '求人名', '基本信息': '基本情報', '诊断建议': '診断提案', '采用建议': '提案を採用',
    '主页': 'ホーム', '演示数据': 'デモデータ', '演示模式': 'デモモード', '已连接后端': 'バックエンド接続済み',
    '实时数据': 'リアルタイムデータ', '返回列表': '一覧に戻る', '新建岗位': '求人を作成', '新建项目': 'プロジェクト作成'
  });

  DICT.th = Object.assign(DICT.th || {}, {
    '岗位发现': 'ค้นหางาน', '我的求职': 'งานที่สมัคร', '我的主页': 'หน้าแรก', '合同与证照': 'สัญญาและเอกสาร',
    '海外保障中心': 'ศูนย์ช่วยเหลือต่างประเทศ', '薪酬与结算': 'เงินเดือนและการชำระ', '出海知识库': 'คลังความรู้ต่างประเทศ',
    '我的档案': 'โปรไฟล์ของฉัน', '消息与顾问': 'ข้อความ', '概览台': 'ภาพรวม', '项目管理': 'จัดการโครงการ',
    '投递管理': 'จัดการผู้สมัคร', '候选人发现': 'ค้นหาผู้สมัคร', '匹配分析结果': 'ผลวิเคราะห์การจับคู่',
    '服务台': 'ศูนย์บริการ', '知识库': 'คลังความรู้', '报告与对账': 'รายงานและกระทบยอด', '消息与成员': 'ข้อความและสมาชิก',
    '全球态势': 'สถานการณ์โลก', '全球能力矩阵': 'เมทริกซ์ความสามารถโลก', '全生命周期看板': 'บอร์ดวงจรชีวิต',
    '风险预警中心': 'ศูนย์แจ้งเตือนความเสี่ยง', 'AI 候选人匹配': 'จับคู่ผู้สมัครด้วย AI', 'AI 匹配推荐': 'แนะนำด้วย AI',
    '岗位详情': 'รายละเอียดงาน', '关闭': 'ปิด', '取消': 'ยกเลิก', '保存': 'บันทึก', '返回': 'กลับ', '搜索': 'ค้นหา',
    '刷新': 'รีเฟรช', '发布': 'เผยแพร่', '编辑': 'แก้ไข', '预览': 'ดูตัวอย่าง', '删除': 'ลบ', '确定': 'ตกลง', '确认': 'ยืนยัน',
    '查看报告': 'ดูรายงาน', '返回分析': 'กลับไปวิเคราะห์', '编辑岗位': 'แก้ไขงาน', '发布岗位': 'เผยแพร่ตำแหน่ง',
    '取消发布': 'ยกเลิกเผยแพร่', '岗位预览': 'ตัวอย่างงาน', '岗位 AI 诊断': 'วิเคราะห์งานด้วย AI',
    '岗位诊断报告': 'รายงานวิเคราะห์งาน', '重新分析': 'วิเคราะห์ใหม่', '重新生成': 'สร้างใหม่', 'AI 重新生成': 'สร้างใหม่ด้วย AI',
    'AI 润色': 'ขัดเกลาด้วย AI', 'AI 润色这段': 'ขัดเกลาส่วนนี้ด้วย AI', 'AI 重新生成岗位内容': 'สร้างเนื้อหางานใหม่ด้วย AI',
    '保存草稿': 'บันทึกร่าง', '保存并重新生成': 'บันทึกและสร้างใหม่', '保存并重新分析': 'บันทึกและวิเคราะห์ใหม่',
    '语音 ON': 'เสียง ON', '语音 OFF': 'เสียง OFF', '分析中': 'กำลังวิเคราะห์', '分析完成': 'วิเคราะห์เสร็จ',
    '岗位职责': 'หน้าที่งาน', '任职要求': 'คุณสมบัติ', '工作与生活': 'การทำงานและชีวิต', '招聘信息': 'ข้อมูลรับสมัคร',
    '合同与手续': 'สัญญาและขั้นตอน', '诊断下一步': 'ขั้นตอนถัดไป', '优势': 'จุดแข็ง', '需要补充': 'ต้องเสริม',
    '分数构成': 'รายละเอียดคะแนน', '岗位要素对照': 'เปรียบเทียบองค์ประกอบงาน', '待补充': 'ยังไม่กรอก',
    '已发布': 'เผยแพร่แล้ว', '草稿': 'ฉบับร่าง', '招聘人数': 'จำนวนรับ', '薪资': 'เงินเดือน', '合同周期': 'ระยะสัญญา',
    '国家': 'ประเทศ', '项目': 'โครงการ', '岗位名称': 'ชื่องาน', '基本信息': 'ข้อมูลพื้นฐาน', '诊断建议': 'ข้อเสนอการวินิจฉัย',
    '采用建议': 'ใช้ข้อเสนอ', '主页': 'หน้าแรก', '演示数据': 'ข้อมูลตัวอย่าง', '演示模式': 'โหมดตัวอย่าง',
    '已连接后端': 'เชื่อมต่อเซิร์ฟเวอร์แล้ว', '实时数据': 'ข้อมูลเรียลไทม์', '返回列表': 'กลับไปรายการ',
    '新建岗位': 'สร้างงาน', '新建项目': 'สร้างโครงการ'
  });

  KEYDICT.ja = Object.assign(KEYDICT.ja || {}, {
    'nav.discover': '求人発見', 'nav.myJobs': '応募履歴', 'nav.home': 'ホーム', 'nav.contracts': '契約・証明書',
    'nav.support': '海外サポート', 'nav.payroll': '給与・精算', 'nav.knowledge': '海外ナレッジ', 'nav.profile': 'マイプロフィール',
    'nav.messages': 'メッセージ', 'nav.cOverview': '概要', 'nav.cConsole': 'データダッシュボード', 'nav.cPool': '履歴書庫', 'nav.cProjects': 'プロジェクト管理', 'nav.cApply': '応募管理',
    'nav.cTalent': '候補者発見', 'nav.cService': 'サービスデスク', 'nav.cKnowledge': 'ナレッジ', 'nav.cReport': 'レポート・照合',
    'nav.cMembers': 'メッセージ・メンバー', 'nav.aGlobe': 'グローバル状況', 'nav.aGlobal': 'グローバル能力',
    'nav.aBoard': 'ライフサイクル', 'nav.aRisk': 'リスク警告', 'nav.aAudit': '契約監査', 'nav.aGovern': 'エージェント管理',
    'nav.aApproval': '承認', 'nav.aTicket': 'インシデント', 'nav.aLog': '監査ログ', 'nav.aReport': 'コンプライアンス報告',
    'role.persona': '求職者', 'role.personaSub': '求職者ホーム', 'role.company': '企業', 'role.companySub': '企業ホーム',
    'role.assurance': 'サポート', 'role.assuranceSub': '運営・グローバルリスク・コンプライアンス', 'brand.name': 'グローバル派遣'
  });

  KEYDICT.th = Object.assign(KEYDICT.th || {}, {
    'nav.discover': 'ค้นหางาน', 'nav.myJobs': 'งานที่สมัคร', 'nav.home': 'หน้าแรก', 'nav.contracts': 'สัญญาและเอกสาร',
    'nav.support': 'ศูนย์ช่วยเหลือต่างประเทศ', 'nav.payroll': 'เงินเดือนและการชำระ', 'nav.knowledge': 'คลังความรู้ต่างประเทศ',
    'nav.profile': 'โปรไฟล์ของฉัน', 'nav.messages': 'ข้อความ', 'nav.cOverview': 'ภาพรวม', 'nav.cConsole': 'แดชบอร์ดข้อมูล', 'nav.cPool': 'คลังเรซูเม่', 'nav.cProjects': 'จัดการโครงการ',
    'nav.cApply': 'จัดการผู้สมัคร', 'nav.cTalent': 'ค้นหาผู้สมัคร', 'nav.cService': 'ศูนย์บริการ', 'nav.cKnowledge': 'คลังความรู้',
    'nav.cReport': 'รายงานและกระทบยอด', 'nav.cMembers': 'ข้อความและสมาชิก', 'nav.aGlobe': 'สถานการณ์โลก',
    'nav.aGlobal': 'ความสามารถโลก', 'nav.aBoard': 'วงจรชีวิต', 'nav.aRisk': 'แจ้งเตือนความเสี่ยง', 'nav.aAudit': 'ตรวจสอบสัญญา',
    'nav.aGovern': 'การกำกับเอเจนต์', 'nav.aApproval': 'อนุมัติ', 'nav.aTicket': 'เหตุการณ์', 'nav.aLog': 'บันทึกตรวจสอบ',
    'nav.aReport': 'รายงานการปฏิบัติตาม', 'role.persona': 'ผู้สมัคร', 'role.personaSub': 'หน้าผู้สมัคร', 'role.company': 'บริษัท',
    'role.companySub': 'หน้าบริษัท', 'role.assurance': 'ฝ่ายสนับสนุน', 'role.assuranceSub': 'ปฏิบัติการ · ความเสี่ยง · การปฏิบัติตาม',
    'brand.name': 'Global Dispatch'
  });

  Object.assign(DICT.ja, {
    '岗位信息比较完整': '求人情報はほぼ完成', '需要补齐关键信息': '重要な情報を補足してください',
    '可以发布': '公開可能', '建议补齐后发布': '補足後の公開を推奨', '先补齐关键信息': 'まず重要情報を補足してください'
  });
  Object.assign(DICT.th, {
    '岗位信息比较完整': 'ข้อมูลงานค่อนข้างครบ', '需要补齐关键信息': 'ต้องเสริมข้อมูลสำคัญ',
    '可以发布': 'เผยแพร่ได้', '建议补齐后发布': 'แนะนำให้เสริมก่อนเผยแพร่', '先补齐关键信息': 'เสริมข้อมูลสำคัญก่อน'
  });

  /* 侧栏分组标题：en / zh 在上面各自的词典里，这里补齐 ja / th / ar / fr */
  KEYDICT.ja = Object.assign(KEYDICT.ja || {}, {
    'nav.group.work': 'ワークスペース', 'nav.group.job': '求職', 'nav.group.txn': '手続き',
    'nav.group.docs': '資料', 'nav.group.biz': '業務', 'nav.group.situ': '状況',
    'nav.group.risk': 'リスク管理', 'nav.group.case': '対応'
  });
  KEYDICT.th = Object.assign(KEYDICT.th || {}, {
    'nav.group.work': 'พื้นที่ทำงาน', 'nav.group.job': 'หางาน', 'nav.group.txn': 'ธุรกรรม',
    'nav.group.docs': 'เอกสาร', 'nav.group.biz': 'ธุรกิจ', 'nav.group.situ': 'สถานการณ์',
    'nav.group.risk': 'การควบคุมความเสี่ยง', 'nav.group.case': 'การจัดการ'
  });
  KEYDICT.ar = Object.assign(KEYDICT.ar || {}, {
    'nav.group.work': 'مساحة العمل', 'nav.group.job': 'البحث عن عمل', 'nav.group.txn': 'المعاملات',
    'nav.group.docs': 'الموارد', 'nav.group.biz': 'الأعمال', 'nav.group.situ': 'الوضع العام',
    'nav.group.risk': 'إدارة المخاطر', 'nav.group.case': 'المعالجة'
  });
  KEYDICT.fr = Object.assign(KEYDICT.fr || {}, {
    'nav.group.work': 'Espace de travail', 'nav.group.job': "Recherche d'emploi", 'nav.group.txn': 'Démarches',
    'nav.group.docs': 'Ressources', 'nav.group.biz': 'Activités', 'nav.group.situ': 'Situation',
    'nav.group.risk': 'Gestion des risques', 'nav.group.case': 'Traitement'
  });
  var KEY = 'hp-lang';
  var lang = 'zh';
  try { lang = localStorage.getItem(KEY) || 'zh'; } catch (e) {}

  /**
   * 翻译（兼容两种用法）
   *   t('投递成功')      → 按中文原文查（旧机制）
   *   t('btn.apply')    → 按 key 查（新机制）
   * 都查不到时：中文原样返回；非中文返回入参本身（保证不空白）
   */
  /* 用「中文原文」作为 key 的中文词典（key 找不到时兜底显示中文） */
  var ZHDICT = {
    /* 导航 */
    'nav.discover': '岗位发现', 'nav.myJobs': '我的求职', 'nav.home': '我的主页',
    'nav.contracts': '合同与证照', 'nav.support': '海外保障中心', 'nav.payroll': '薪酬与结算',
    'nav.knowledge': '出海知识库', 'nav.profile': '我的档案', 'nav.messages': '消息与顾问',
    'nav.cOverview': '概览台', 'nav.cConsole': '经营看板', 'nav.cPool': '简历库',
    'nav.cProjects': '项目管理', 'nav.cApply': '投递管理',
    'nav.cTalent': '候选人发现', 'nav.cService': '履约与保障', 'nav.cKnowledge': '知识库',
    'nav.cReport': '报告与对账', 'nav.cMembers': '消息与成员',
    'nav.aGlobe': '全球态势', 'nav.aGlobal': '全球能力矩阵', 'nav.aBoard': '全生命周期看板',
    'nav.aRisk': '风险预警', 'nav.aAudit': '合同一致性审计', 'nav.aGovern': '智能体治理',
    'nav.aApproval': '审批中心', 'nav.aTicket': '应急工单', 'nav.aLog': '审计日志',
    'nav.aReport': '合规报表',
    'app.demoBadge': '演示版',
    /* 导航分组标题 */
    'nav.group.work': '工作台', 'nav.group.job': '求职', 'nav.group.txn': '事务',
    'nav.group.docs': '资料', 'nav.group.biz': '业务', 'nav.group.situ': '态势',
    'nav.group.risk': '风控', 'nav.group.case': '处置',
    /* 角色 */
    'role.persona': '应聘者', 'role.personaSub': '个人应聘者主页',
    'role.company': '企业', 'role.companySub': '客户公司主页',
    'role.assurance': '保障部', 'role.assuranceSub': '平台运营 · 全球风控 · 合规审计',
    'brand.name': '环球派遣',
    /* === 后端错误码 === */
    'err.already_applied': '你已经投递过该岗位',
    'err.job_full': '该岗位已招满',
    'err.job_not_found': '岗位不存在或已下架',
    'err.candidate_not_found': '候选人不存在',
    'err.persona_not_found': '应聘者档案不存在',
    'err.offer_settled': '该录用通知已处理',
    'err.approval_pending': '该账单已在审批中',
    'err.invalid_permission': '请至少选择一个权限',
    'err.no_change': '与当前权限相同',
    'err.already_decided': '该审批已处理',
    'err.note_required': '驳回时必须填写理由',
    'err.bill_in_approval': '该账单正在审批中，请等待结果',
    'err.name_required': '项目名称不能为空',
    'err.invalid_amount': '申请金额需大于 0',
    'err.amount_too_large': '单笔申请不能超过 20 万元',
    'err.reason_required': '请填写申请原因',
    'err.too_many_pending': '你已有 2 笔待审批申请，请等待处理',
    'err.invalid_credentials': '手机号或密码不正确',
    'err.weak_password': '新密码至少 8 位',
    'err.phone_password_required': '请填写手机号与密码',
    'err.invalid_role': '角色参数不合法',
    'err.invalid_code': '验证码不正确或已过期',
    'err.forbidden': '没有访问该接口的权限',
    'err.permission_denied': '当前账号没有该权限，请联系企业管理员开通',
    'err.route_not_found': '接口不存在',
    'err.agent_not_found': '未知智能体',
    'err.input_required': '缺少必要参数',
    'err.invalid_action': '操作类型不合法',
    'err.file_too_large': '文件超过 10MB 限制',
    'err.unsupported_type': '仅支持 PDF / JPG / PNG / WebP',
    'err.content_mismatch': '文件内容与类型不一致（可能被改名）',
    'err.upload_failed': '上传失败',
    'err.self_permission_change_forbidden': '不能修改自己的权限',
    'err.invalid_kind': '不支持的审批类型',
    'err.offer_not_found': '录用通知不存在',
    'err.withdraw_failed': '撤回失败',
    'err.unauthorized': '登录已失效，请重新登录',
    'err.offline': '后端未连接',
    'err.missing_params': '缺少必要参数',
    /* 岗位发现页 */
    'discover.title': '岗位发现',
    'discover.desc': '筛出合适岗位，收藏 / 投递 / 一键 AI 分析',
    'discover.aiBtn': '✦ AI 助手',
    'filter.search': '搜索岗位 / 国家 / 城市 / 技能，如：注塑、越南、质检',
    'filter.clear': '清空筛选',
    'filter.salary': '薪资',
    'filter.country': '国家',
    'filter.tags': '技能',
    'filter.state': '状态',
    'filter.sort': '排序',
    'filter.salaryAll': '全部',
    'card.salary': '薪资',
    'card.headcount': '招聘',
    'card.status': '状态',
    'card.applied': '已投递',
    'card.notApplied': '未投递',
    'card.saved': '已收藏',
    'card.negotiable': '面议',
    'toolbar.analyze': '匹配分析',
    'toolbar.analyzeAll': '全部岗位分析',
    'toolbar.fav': '收藏夹',
    'toolbar.weights': '我的偏好权重',
    'pager.total': '个岗位',
    'empty.noJob': '没有符合条件的岗位，试试「清空筛选」',
    'toast.saved': '已保存',
    'toast.applied': '投递成功'
  };

  /**
   * 翻译
   *   t('btn.apply')  → 按 key 查；查不到时用 ZHDICT 兜底，再不行返回 key 本身
   *   t('投递成功')    → 按中文原文查
   */
  function t(text) {
    if (text === undefined || text === null) return '';
    var s = String(text);

    /* 中文环境：key → 中文原文 */
    if (lang === 'zh') {
      if (ZHDICT[s] !== undefined) return ZHDICT[s];
      return s;
    }

    /* 非中文：先查 key 词典，再查原文词典 */
    var kd = KEYDICT[lang];
    if (kd && kd[s] !== undefined) return kd[s];

    var d = DICT[lang] || {};

    /* ① 原文/key 直接命中当前语言词典（err.xxx 等同时存在于 ZHDICT 的 key 必须优先走这里） */
    if (d[s] !== undefined) return d[s];

    /* ② key 词典只有 en 分支时，经「ZHDICT 取中文 → 当前语言词典」两跳转换 */
    if (ZHDICT[s] !== undefined) {
      var zhOfKey = ZHDICT[s];
      if (d[zhOfKey] !== undefined) return d[zhOfKey];
      /* 再试 en 值反查中文（部分 key 的中文与 ZHDICT 不同）*/
      if (KEYDICT.en && KEYDICT.en[s] !== undefined) {
        var enVal = KEYDICT.en[s];
        var dEn = DICT.en || {};
        for (var zk in dEn) {
          if (dEn[zk] === enVal && d[zk] !== undefined) return d[zk];
        }
      }
      return zhOfKey;
    }

    /* err.xxx：去掉前缀再查一次 */
    if (s.indexOf('err.') === 0 && d[s.slice(4)] !== undefined) return d[s.slice(4)];

    return s;
  }

  /**
   * 业务数据取值（多语言对象）
   *   td({zh:'玻璃压机操作工', en:'Glass Press Operator'})  → 按当前语言
   *   td('玻璃压机操作工')                                 → 非对象直接 t()
   */
  function td(v) {
    if (v === undefined || v === null) return '';
    if (typeof v === 'string') return t(v);
    if (typeof v === 'object' && !Array.isArray(v)) {
      if (v[lang] !== undefined && v[lang] !== '') return v[lang];
      if (v.zh !== undefined && v.zh !== '') return t(v.zh);
      var first = Object.keys(v)[0];
      return first ? v[first] : '';
    }
    return String(v);
  }

  /** 枚举 code → 文案：te('status', 'recruiting') */
  function te(ns, code) {
    if (!code) return '';
    var key = ns + '.' + code;
    var kd = KEYDICT[lang] || {};
    if (kd[key] !== undefined) return kd[key];
    var zh = KEYDICT.zh || {};
    if (zh[key] !== undefined) return zh[key];
    return String(code);
  }

  /** 填充所有 [data-i18n] 元素 */
  function apply(root) {
    var scope = root || document;
    document.documentElement.setAttribute('lang', lang === 'zh' ? 'zh-CN' : lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

    /* ⓿ 切回中文：先用保存的原文还原所有被翻译过的文本节点，
       否则界面会残留英文（自动扫描替换后原文已丢失） */
    if (lang === 'zh') {
      var w0 = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT, null);
      var nd;
      while ((nd = w0.nextNode())) {
        if (nd.__hpOrig !== undefined && nd.__hpOrig !== nd.nodeValue) {
          nd.nodeValue = nd.__hpOrig;
        }
      }
    }

    /* data-i18n-skip：整块免翻（品牌名这类专有名词用），①②③ 三条通道都跳过 */
    function skipped(el) {
      return !!(el && el.closest && el.closest('[data-i18n-skip]'));
    }

    /* ① key 驱动：data-i18n="nav.discover" */
    Array.prototype.forEach.call(scope.querySelectorAll('[data-i18n]'), function (el) {
      var key = el.getAttribute('data-i18n');
      if (!key || skipped(el)) return;
      var val = t(key);
      if (el.dataset.i18nAttr) {
        el.setAttribute(el.dataset.i18nAttr, val);
      } else {
        el.textContent = val;
      }
    });

    /* ② 原文驱动：data-i18n-raw="岗位发现"（先存中文原文，再按词典翻） */
    Array.prototype.forEach.call(scope.querySelectorAll('[data-i18n-raw]'), function (el) {
      var raw = el.getAttribute('data-i18n-raw');
      if (!raw || skipped(el)) return;
      el.textContent = t(raw);
    });

    /* ③ 自动扫描：按「原文 → 词典」替换叶子节点文本。
       用于未加标记的界面（如 hp-stage-markup 生成的分析页），
       只处理纯文本节点，不破坏结构。
       兼容带图标前缀（「← 返回列表」「▶ 自动演示」）与「标签：值」组合。 */
    if (lang !== 'zh') {
      var walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT, null);
      var nodes = [];
      var n;
      while ((n = walker.nextNode())) nodes.push(n);
      nodes.forEach(function (node) {
        if (node.__hpLive && node.nodeValue !== node.__hpOrig) return;
        var val = node.nodeValue || '';
        /* 记录首次翻译前的原文，切换语言时始终从原文重新翻译，
           避免「英→中」还原失败（原文被覆盖后无法回退） */
        if (node.__hpOrig === undefined) node.__hpOrig = val;
        var src = node.__hpOrig;
        var raw = src.trim();
        if (!raw || raw.length > 80) return;
        if (!/[\u4e00-\u9fa5]/.test(raw)) {
          /* 当前节点已经是译文：若切回中文，恢复原文 */
          if (lang === 'zh' && node.__hpOrig !== val) { node.nodeValue = node.__hpOrig; }
          return;
        }
        var parent = node.parentNode;
        if (!parent) return;
        if (skipped(parent)) return;
        var tag = (parent.tagName || '').toLowerCase();
        if (tag === 'script' || tag === 'style' || tag === 'textarea') return;

        /* ① 直接命中（含完整短语，如「20,000 - 25,000 元/月」整条没收录时，
           先尝试把常见单位短语整体替换，避免单字误替） */
        var hit = t(raw);
        if (hit && hit !== raw) { node.nodeValue = src.replace(raw, hit); return; }

        /* ①a 模式替换：处理动态拼接句子（技能说明 / 分页 / 目标） */
        var PATTERNS = [
          [/^(\d{4}-\d{2})\s*更新$/, function (m) { return 'Updated ' + m[1]; }],
          [/^(\d{4}-\d{2})\s*已更新$/, function (m) { return 'Updated ' + m[1]; }],
          [/^具备\s*(.+?)\s*等\s*(\d+)\s*项岗位所需技能$/, function (m) {
            var segs = String(m[1]).split(/[、,，]/).map(function (x) {
              var k = x.trim();
              if (!k) return '';
              var v = t(k);
              return v === k ? k : v;
            }).filter(Boolean);
            return 'Has ' + segs.join(', ') + ' — ' + m[2] + ' job-required skills';
          }],
          [/^已满足当前岗位全部要求$/, function () { return 'Meets all job requirements'; }],
          [/^推荐岗位\s*$/, function () { return 'Recommended jobs'; }],
          [/^共\s*(\d+)\s*·\s*Page\s*(\d+)\/(\d+)\s*页$/, function (m) {
            return m[1] + ' · Page ' + m[2] + '/' + m[3];
          }],
          [/^分析对象[：:]?\s*(.*)$/, function (m) {
            var rest = String(m[1] || '')
              .replace(/当前岗位/g, 'Current job')
              .replace(/已选岗位/g, 'Selected jobs')
              .replace(/候选人/g, 'Candidate');
            return 'Target' + (rest ? ' ' + rest : '');
          }],
          [/^具备\s*(.+?)\s*等\s*(\d+)\s*项岗位所需技能$/, function (m) {
            var segs = String(m[1]).split(/[、,，]/).map(function (x) {
              var k = x.trim();
              var v = t(k);
              return v === k ? k : v;
            });
            return 'Has ' + segs.join(', ') + ' — ' + m[2] + ' job-required skills';
          }]
        ];
        for (var pi = 0; pi < PATTERNS.length; pi++) {
          var pm = raw.match(PATTERNS[pi][0]);
          if (pm) { node.nodeValue = val.replace(raw, PATTERNS[pi][1](pm)); return; }
        }

        /* ①b 单位短语替换：只处理「数字 + 单位」形式，避免误伤「本月」「1月」等词 */
        var UNIT_PATTERNS = [
          /* 万元必须最先处理并换算数值：100万元 → CNY 1,000,000 */
          [/(\d[\d,.]*)\s*万元/g, function (mm, num) {
            var v = parseFloat(String(num).replace(/,/g, '')) * 10000;
            return 'CNY ' + v.toLocaleString('en-US');
          }],
          [/(\d[\d,.]*)\s*元\/月/g, '$1 CNY/mo'],
          [/(\d[\d,.]*)\s*元\/天/g, '$1 CNY/day'],
          [/(\d[\d,.]*)\s*元/g, '$1 CNY'],
          [/(\d+)\s*个月/g, '$1 months'],
          [/(\d+)\s*年经验/g, '$1 yrs experience'],
          [/(\d+)\s*天/g, '$1 days'],
          [/(\d+)\s*年/g, '$1 yrs'],
          [/(\d+)\s*分/g, '$1 pts']
        ];
        var replaced = src;
        var anyUnit = false;
        UNIT_PATTERNS.forEach(function (u) {
          if (u[0].test(replaced)) {
            replaced = replaced.replace(u[0], u[1]);
            anyUnit = true;
          }
          u[0].lastIndex = 0;
        });
        if (anyUnit) { node.nodeValue = replaced; return; }

        /* ② 去掉前置图标/符号后再命中（← ▶ ⌖ ◈ · 等） */
        var stripped = raw.replace(/^[^A-Za-z0-9\u4e00-\u9fa5]+/, '').trim();
        if (stripped && stripped !== raw) {
          var h2 = t(stripped);
          if (h2 && h2 !== stripped) {
            node.nodeValue = val.replace(stripped, h2);
            return;
          }
        }

        /* ③ 组合文本逐段翻译：
             支持「：/ · — 、（）() 「」 "" 【】」等分隔符，以及「中文+数字」混排 */
        if (/[：/·—、（）()／「」【】“”‘’]/.test(raw)) {
          var parts = raw.split(/([：/·—、（）()／\s「」【】“”‘’]+)/);
          var changed = false;
          var out = parts.map(function (seg) {
            var s2 = seg.trim();
            if (!s2 || !/[\u4e00-\u9fa5]/.test(s2)) return seg;
            /* 整段命中 */
            var h3 = t(s2);
            if (h3 && h3 !== s2) { changed = true; return seg.replace(s2, h3); }
            /* 去掉图标前缀再试 */
            var s3 = s2.replace(/^[^A-Za-z0-9\u4e00-\u9fa5]+|[^A-Za-z0-9\u4e00-\u9fa5]+$/g, '').trim();
            if (s3 && s3 !== s2) {
              var h4 = t(s3);
              if (h4 && h4 !== s3) { changed = true; return seg.replace(s3, h4); }
            }
            /* 中文 + 数字混排：如「薪资 20,000」「8 年经验」 */
            var mix = s2.match(/^([\u4e00-\u9fa5]{2,10})\s*([\d,.\-–~]+.*)$/);
            if (mix) {
              var hk = t(mix[1]);
              if (hk && hk !== mix[1]) { changed = true; return seg.replace(mix[1], hk); }
            }
            /* 尾部中文单位：如「20,000 元/月」 */
            var unit = s2.match(/^([\d,.\-–~]+\s*)([\u4e00-\u9fa5\/]{1,4})$/);
            if (unit) {
              var hu = t(unit[2]);
              if (hu && hu !== unit[2]) { changed = true; return seg.replace(unit[2], hu); }
            }
            return seg;
          }).join('');
          if (changed) node.nodeValue = out;
        }
      });
    }

    /* 占位符：输入框提示也按当前语言翻译，用户输入的值不动 */
    Array.prototype.forEach.call(scope.querySelectorAll('[placeholder]'), function (el) {
      if (el.hasAttribute('data-i18n-ph') || skipped(el)) return;
      if (el.__hpPhOrig === undefined) el.__hpPhOrig = el.getAttribute('placeholder') || '';
      var src = el.__hpPhOrig;
      if (!src) return;
      if (lang === 'zh') { el.setAttribute('placeholder', src); return; }
      var v = t(src);
      if (v && v !== src) el.setAttribute('placeholder', v);
    });

    Array.prototype.forEach.call(scope.querySelectorAll('[data-i18n-ph]'), function (el) {
      var key = el.getAttribute('data-i18n-ph');
      if (key) el.setAttribute('placeholder', t(key));
    });
    Array.prototype.forEach.call(scope.querySelectorAll('[data-i18n-title]'), function (el) {
      var key = el.getAttribute('data-i18n-title');
      if (key) el.setAttribute('title', t(key));
    });

    /* 浏览器标签标题跟随语言 */
    if (!root) {
      try {
        document.title = lang === 'zh'
          ? '环球派遣 · 海外用工全周期平台'
          : 'Global Dispatch · Global Workforce Platform';
      } catch (e) {}
    }
  }

  var timer = null;
  var liveTimer = null;
  /* 动态内容延后补译：用户停留一段时间才发起，避免每次点击都触发请求 */
  function scheduleLive() {
    if (lang === 'zh') return;
    clearTimeout(liveTimer);
    liveTimer = setTimeout(function () { autoLive(); }, 700);
  }
  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(function () {
      apply();
      scheduleLive();
    }, 100);
  }

  function set(next) {
    if (next === lang) return;
    lang = next;
    try { localStorage.setItem(KEY, next); } catch (e) {}
    /* 切回中文时清掉实时翻译标记，保证原文可还原 */
    if (next === 'zh') {
      var w0 = document.createTreeWalker(document, NodeFilter.SHOW_TEXT, null);
      var z;
      while ((z = w0.nextNode())) { z.__hpLive = false; }
      clearTimeout(liveTimer);
      hideTip();
    }
    /* 立即完成本地词典替换：这一步是同步的、0 延迟，
       界面马上变成目标语言，用户感觉是「瞬间切换」 */
    apply();
    /* 侧边栏 / 面包屑由 app.html 重建（它监听同一事件） */
    document.dispatchEvent(new CustomEvent('hp:lang', { detail: { lang: lang } }));
    /* 业务页切换语言后重载当前路由：让岗位/简历数据按新 lang 重新取，避免旧语言残留 */
    if (document.getElementById('workspace') || document.querySelector('.app .workspace')) {
      setTimeout(function () { location.reload(); }, 120);
      return;
    }
    /* 动态内容（AI 回答、业务数据）在后台静默补译，不阻塞、不弹提示 */
    if (next !== 'zh') scheduleLive();
  }

  var LANGS = [
    { code: 'zh', label: '中文',        ready: true },
    { code: 'en', label: 'English',     ready: true },
    { code: 'ja', label: '日本語',        ready: true },
    { code: 'th', label: 'ไทย',          ready: true },
    { code: 'ar', label: 'العربية',      ready: true },
    { code: 'fr', label: 'Français',    ready: true },
  ];

  function mountSwitcher() {
    if (document.getElementById('hpLangSel')) return;
    var bar = document.querySelector('.topbar');
    if (!bar) return;
    var wrap = document.createElement('label');
    wrap.className = 'hp-lang';
    wrap.innerHTML = '<span>🌐</span><select id="hpLangSel">' +
      LANGS.map(function (L) {
        return '<option value="' + L.code + '">' + L.label + (L.ready ? '' : ' · soon') + '</option>';
      }).join('') +
      '</select>';
    bar.appendChild(wrap);
    var sel = wrap.querySelector('select');
    sel.value = lang;
    sel.addEventListener('change', function () { set(sel.value); });
    /* 语言变更后同步下拉框 */
    document.addEventListener('hp:lang', function (e) { sel.value = e.detail.lang; });
  }

  /* 登录页的语言切换按钮：进入应用前就能选语言 */
  function mountLoginLang() {
    var box = document.getElementById('loginLang');
    if (!box) return;
    box.innerHTML = LANGS.map(function (L) {
      return '<button type="button" data-l="' + L.code + '"' +
        (L.code === lang ? ' class="on"' : '') + '>' + L.label + '</button>';
    }).join('');
    if (box.dataset.bound === '1') return;
    box.dataset.bound = '1';
    box.addEventListener('click', function (e) {
      var b = e.target.closest('[data-l]');
      if (!b) return;
      set(b.getAttribute('data-l'));
    });
    document.addEventListener('hp:lang', function (e) {
      Array.prototype.forEach.call(box.querySelectorAll('[data-l]'), function (b) {
        b.className = b.getAttribute('data-l') === e.detail.lang ? 'on' : '';
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    mountSwitcher();
    mountLoginLang();
    apply();
    if (lang !== 'zh') scheduleLive();
    document.addEventListener('click', schedule, true);
    window.addEventListener('hashchange', schedule);

    /* 关键：渲染函数常在 apply() 之后才把中文写进 DOM。
       用 MutationObserver 监听，DOM 一变就补一次词典替换。
       必须防重入——apply() 自身会改 DOM，若不禁用会形成死循环把页面卡死。 */
    if (lang !== 'zh' && window.MutationObserver) {
      var mo = null;
      var busy = false;      /* 正在执行 apply，观察器回调直接忽略 */
      var queued = false;

      function runApplySafe() {
        if (lang === 'zh' || busy) return;
        busy = true;
        if (mo) mo.disconnect();
        try { apply(); } catch (e) {}
        scheduleLive();
        /* 等下一帧再重新挂上，确保 apply 产生的变更被丢弃 */
        requestAnimationFrame(function () {
          busy = false;
          if (mo && lang !== 'zh') mo.observe(document.body, { childList: true, subtree: true });
        });
      }

      mo = new MutationObserver(function (muts) {
        if (busy || lang === 'zh' || queued) return;
        for (var i = 0; i < muts.length; i++) {
          var added = muts[i].addedNodes;
          if (!added || !added.length) continue;
          /* 只有新增「元素」才值得重扫，纯文本变动忽略 */
          for (var k = 0; k < added.length; k++) {
            if (added[k].nodeType === 1) { queued = true; break; }
          }
          if (queued) break;
        }
        if (!queued) return;
        queued = false;
        runApplySafe();
      });
      mo.observe(document.body, { childList: true, subtree: true });
      document.addEventListener('hp:lang', function (e) {
        if (e.detail && e.detail.lang === 'zh') { if (mo) mo.disconnect(); }
        else { busy = false; runApplySafe(); }
      });
    }

    /* 动态渲染内容补齐（渲染较慢的页面兜底） */
    setInterval(function () {
      if (lang === 'zh') return;
      try { translateLive(document.body); } catch (e) {}
    }, 1200);
    var n = 0;
    var iv = setInterval(function () { apply(); if (++n > 12) clearInterval(iv); }, 400);
  });

  /**
   * 实时翻译：词典没覆盖的动态内容（AI 回答、业务数据）交给后端 DeepSeek。
   * 只在非中文语言下工作，结果写回 textContent 并记录原文以便切换还原。
   */
  function pushLangToFrames() {
    var frames = document.querySelectorAll('iframe');
    for (var i = 0; i < frames.length; i++) {
      try { frames[i].contentWindow.postMessage({ type: 'hp:lang', lang: lang }, '*'); } catch (e) {}
    }
  }
  window.addEventListener('message', function (e) {
    if (e && e.data && e.data.type === 'hp:iframe-ready') {
      try { e.source.postMessage({ type: 'hp:lang', lang: lang }, '*'); } catch (err) {}
    }
  });
  document.addEventListener('hp:lang', function () { setTimeout(pushLangToFrames, 40); });

  /* 判断一段文本是否需要实时翻译（不依赖原文一定是中文） */
  function needsLive(text, target) {
    var s = String(text || '').trim();
    if (s.length < 2) return false;
    if (/^https?:\/\//i.test(s) || /^[\w.+-]+@[\w.-]+$/.test(s)) return false;
    if (/^[\d\s.,:\/+\-()%]+$/.test(s)) return false;
    var cjk = /[\u4e00-\u9fa5]/.test(s);
    var thai = /[\u0E00-\u0E7F]/.test(s);
    var arabic = /[\u0600-\u06FF]/.test(s);
    var latin = /[A-Za-z]{3,}/.test(s);
    var jp = /[\u3040-\u30FF]/.test(s);
    if (target === 'zh' && cjk && !thai && !arabic && !latin) return false;
    if (target === 'en' && latin && !cjk && !thai && !arabic) return false;
    if (target === 'th' && thai && !cjk && !latin && !arabic) return false;
    if (target === 'ar' && arabic && !cjk && !thai && !latin) return false;
    if (target === 'ja' && jp && !latin && !thai && !arabic) return false;
    if (target === 'zh') return thai || arabic || latin;
    if (target === 'en') return cjk || thai || arabic;
    return cjk || thai || arabic || latin;
  }

  /* 语言切换前还原所有实时译文，避免 泰语→日语 时沿用旧语言 */
  function resetLive() {
    try {
      var w = document.createTreeWalker(document, NodeFilter.SHOW_TEXT, null);
      var n;
      while ((n = w.nextNode())) {
        if (n.__hpLive) {
          if (n.__hpOrig != null) n.nodeValue = n.__hpOrig;
          n.__hpLive = false;
          n.__hpTried = '';
        }
      }
      var els = document.querySelectorAll('*');
      for (var i = 0; i < els.length; i++) els[i].__hpLive = false;
    } catch (e) {}
  }

  /* 实时翻译：整页扫描，不再只认中文；一次最多 50 段，autoLive 继续补 */
  function translateLive(root) {
    if (lang === 'zh') return Promise.resolve(0);
    var scope = root || document;
    var nodes = [];
    var walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT, null);
    var n;
    while ((n = walker.nextNode())) {
      var p = n.parentNode;
      if (!p) continue;
      var tag = (p.tagName || '').toLowerCase();
      if (tag === 'script' || tag === 'style' || tag === 'textarea' || tag === 'input' || tag === 'option') continue;
      if (n.__hpLive && n.nodeValue !== n.__hpOrig) continue;
      if (n.__hpTried === lang && n.nodeValue !== n.__hpOrig) continue;
      n.__hpLive = false;
      n.__hpTried = '';
      if (p.closest && p.closest('[data-i18n-skip],.hp-no-translate,.mt-f-name,.mt-d-name,.u-name,.brand-name,.hpp-name,.hpr-name')) continue;
      if (p.getClientRects && p.getClientRects().length === 0) continue;
      if (n.__hpOrig === undefined) n.__hpOrig = n.nodeValue || '';
      var src = String(n.__hpOrig || '').trim();
      if (!src || src.length < 2 || src.length > 400) continue;
      if (!needsLive(src, lang)) continue;
      nodes.push(n);
      if (nodes.length >= 50) break;
    }
    if (!nodes.length) return Promise.resolve(0);

    var texts = nodes.map(function (x) { return String(x.__hpOrig || x.nodeValue || '').trim(); });
    var L = lang;
    return fetch('/api/translate', {
      method: 'POST', credentials: 'same-origin',
      headers: { 'content-type': 'application/json', 'x-hp-request': '1' },
      body: JSON.stringify({ texts: texts, target: L })
    }).then(function (r) { return r.json(); }).then(function (j) {
      if (!j || !j.texts || lang !== L) return 0;
      var done = 0;
      nodes.forEach(function (node, i) {
        var v = j.texts[i];
        node.__hpTried = L;
        if (!v || v === texts[i]) return;
        var raw = node.__hpOrig != null ? node.__hpOrig : node.nodeValue;
        var lead = /^\s*/.exec(raw)[0] || '';
        var tail = /\s*$/.exec(raw)[0] || '';
        node.nodeValue = lead + v + tail;
        node.__hpLive = true;
        if (node.parentNode) node.parentNode.__hpLive = true;
        done++;
      });
      return done;
    }).catch(function () { return 0; });
  }

  /**
   * 自动补齐：反复调用 translateLive 直到没有可翻的中文段。
   * 页面元素多时一次抓不完，这里分若干轮补齐（有缓存，第二轮起很快）。
   */
  var liveRunning = false;

  /* 翻译中的轻提示：超过 700ms 才显示，避免闪一下 */
  var LIVE_TIP = {
    zh: '正在实时翻译…', en: 'Translating live…',
    fr: 'Traduction en direct…', ar: 'جارٍ الترجمة الفورية…', th: 'กำลังแปล…', ja: '翻訳中…'
  };
  var tipEl = null, tipTimer = null;
  function showTip() {
    if (tipEl) return;
    tipEl = document.createElement('div');
    tipEl.id = 'hpLiveTip';
    tipEl.style.cssText = 'position:fixed;right:16px;bottom:16px;z-index:99999;' +
      'display:flex;align-items:center;gap:8px;padding:9px 15px;border-radius:99px;' +
      'background:rgba(12,26,44,.92);border:1px solid rgba(56,225,255,.35);' +
      'color:#cfe7ff;font-size:12.5px;backdrop-filter:blur(8px);' +
      'box-shadow:0 8px 26px rgba(0,0,0,.4);opacity:0;transition:opacity .25s';
    tipEl.innerHTML = '<span style="width:9px;height:9px;border-radius:50%;' +
      'background:#38e1ff;box-shadow:0 0 8px #38e1ff;animation:hpTipPulse 1s infinite"></span>' +
      '<span>' + (LIVE_TIP[lang] || LIVE_TIP.en) + '</span>';
    /* 小圆点呼吸动画 */
    if (!document.getElementById('hpTipStyle')) {
      var st = document.createElement('style');
      st.id = 'hpTipStyle';
      st.textContent = '@keyframes hpTipPulse{0%,100%{opacity:.35}50%{opacity:1}}';
      document.head.appendChild(st);
    }
    document.body.appendChild(tipEl);
    /* rAF 回调可能晚于 hideTip()，必须判空，否则 tipEl 已被置 null */
    var created = tipEl;
    requestAnimationFrame(function () {
      if (created && created.style) created.style.opacity = '1';
    });
  }
  function hideTip() {
    clearTimeout(tipTimer);
    tipTimer = null;
    var el = tipEl;
    tipEl = null;
    if (!el || !el.style) return;
    el.style.opacity = '0';
    setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 260);
  }

  function autoLive(root) {
    if (lang === 'zh' || liveRunning) return Promise.resolve(0);
    liveRunning = true;
    var scope = root || document;
    var round = 0;
    var MAX = 14;
    var total = 0;
    /* 静默后台补译，只在超过 4s 仍未完成时给个轻提示 */
    clearTimeout(tipTimer);
    tipTimer = setTimeout(showTip, 4000);

    function finish(v) {
      liveRunning = false;
      hideTip();
      return v;
    }
    function step() {
      if (lang === 'zh' || round >= MAX) return finish(total);
      round++;
      return translateLive(scope).then(function (n) {
        total += n;
        if (!n) return finish(total);
        return new Promise(function (res) { setTimeout(res, 260); }).then(step);
      }).catch(function () { return finish(total); });
    }
    return step();
  }

  /* ---------- 项目管理模块文案（ja / th） ---------- */
  DICT.ja = Object.assign(DICT.ja || {}, {
    '健康度': '健全度',
    '项目健康度': 'プロジェクト健全度',
    '中方派遣': '中国側派遣',
    '当地雇员': '現地雇用',
    '链路进度': '工程進捗',
    '新建项目': '新規プロジェクト',
    '新建岗位': '新規ポジション',
    '双轨用工配置': '二本立て雇用の構成',
    '中方派遣人员': '中国側派遣人員',
    '派遣链': '派遣ルート',
    '当地用工人员': '現地雇用人員',
    '当地链': '現地ルート',
    '合规状态': 'コンプライアンス状況',
    '良好': '良好',
    '运行中': '稼働中',
    '筹备': '準備中',
    '项目建档': 'プロジェクト登録',
    '岗位需求结构化': 'ポジション要件の構造化',
    '人才招募与推荐': '人材募集と推薦',
    '合同签约与备案': '契約締結と届出',
    '预计批量签约': '一括契約予定',
    '出境合规办理': '出国コンプライアンス手続',
    '在岗履约': '就業中の履行',
    '在岗': '就業中',
    '出境': '出国',
    '回流': '帰国',
    '人员结构': '人員構成',
    '在办项目': '進行中プロジェクト',
    '本月账单': '今月の請求',
    '招募匹配': '募集マッチング',
    '签约合规': '契約コンプライアンス',
    '证照手续': '証書・許認可',
    '结算对账': '決済照合',
  });

  DICT.th = Object.assign(DICT.th || {}, {
    '健康度': 'สุขภาพ',
    '项目健康度': 'สุขภาพโครงการ',
    '中方派遣': 'การส่งพนักงานจีน',
    '当地雇员': 'ลูกจ้างท้องถิ่น',
    '链路进度': 'ความคืบหน้าขั้นตอน',
    '新建项目': 'โครงการใหม่',
    '新建岗位': 'ตำแหน่งใหม่',
    '双轨用工配置': 'การจัดกำลังสองระบบ',
    '中方派遣人员': 'พนักงานส่งจากจีน',
    '派遣链': 'สายการส่งพนักงาน',
    '当地用工人员': 'พนักงานท้องถิ่น',
    '当地链': 'สายท้องถิ่น',
    '合规状态': 'สถานะการปฏิบัติตาม',
    '良好': 'ดี',
    '运行中': 'กำลังดำเนินการ',
    '筹备': 'เตรียมการ',
    '项目建档': 'ขึ้นทะเบียนโครงการ',
    '岗位需求结构化': 'จัดโครงสร้างความต้องการตำแหน่ง',
    '人才招募与推荐': 'สรรหาบุคลากรและแนะนำ',
    '合同签约与备案': 'ลงนามสัญญาและขึ้นทะเบียน',
    '预计批量签约': 'คาดว่าจะลงนามเป็นชุด',
    '出境合规办理': 'ดำเนินการตามกฎก่อนเดินทาง',
    '在岗履约': 'ปฏิบัติงานระหว่างประจำการ',
    '在岗': 'ประจำการ',
    '出境': 'เดินทางออก',
    '回流': 'กลับประเทศ',
    '人员结构': 'โครงสร้างบุคลากร',
    '在办项目': 'โครงการที่ดำเนินอยู่',
    '本月账单': 'ใบแจ้งหนี้เดือนนี้',
    '招募匹配': 'การจับคู่รับสมัคร',
    '签约合规': 'การปฏิบัติตามสัญญา',
    '证照手续': 'เอกสารและใบอนุญาต',
    '结算对账': 'กระทบยอดชำระ',
  });

  /* ---------- 演示项目数据（名称/规模/备注/里程碑）多语言 ---------- */
  DICT.ja = Object.assign(DICT.ja || {}, {
    '阿尔及利亚玻璃制品工厂': 'アルジェリアガラス製品工場',
    '阿尔及利亚玻璃制品厂': 'アルジェリアガラス製品工場',
    '东南亚电子装配线（示例）': '東南アジア電子組立ライン（例）',
    '中亚矿业技术服务（示例）': '中央アジア鉱業技術サービス（例）',
    '沙特光伏组件厂（测试）': 'サウジ太陽光パネル工場（テスト）',
    '测试沙特光伏项目': 'テスト用サウジ太陽光プロジェクト',
    '6 条产线': '6ライン',
    '2 条产线': '2ライン',
    '3 个作业区': '3作業区',
    '筹备中': '準備中',
    '中方 19 人 + 当地 8 人 · 两班倒 12 小时': '中国側19名＋現地8名・2交代12時間',
    '中方 5 人 + 当地 2 人 · 立项论证中': '中国側5名＋現地2名・立項審査中',
    '中方 3 人 · 商务谈判阶段': '中国側3名・商務交渉段階',
    '新建项目，待补充岗位需求': '新規プロジェクト。ポジション要件は未入力',
    '需求确认 · 双轨用工方案': '要件確認・二本立て雇用案',
    '6 条产线岗位清单 · 签证预审前置': '6ラインのポジション一覧・ビザ事前審査',
    '中方 19 人推荐完成 · 5 人待签证材料': '中国側19名の推薦完了・5名はビザ書類待ち',
    '预计批量签约': '一括契約予定',
    '签证 / 工作许可 / 保险': 'ビザ／労働許可／保険',
    '考勤 · 薪酬 · 合规巡检': '勤怠・給与・コンプライアンス巡回',
    '需求收集 · 可行性论证': '要件収集・実現可能性検討',
    '产线岗位清单编制中': 'ラインのポジション一覧を作成中',
    '等待岗位需求确认': 'ポジション要件の確認待ち',
    '意向书签署': '意向書締結',
    '等待客户确认薪酬口径': '顧客の給与基準確認待ち',
    '—': '—',
  });

  DICT.th = Object.assign(DICT.th || {}, {
    '阿尔及利亚玻璃制品工厂': 'โรงงานผลิตภัณฑ์แก้วแอลจีเรีย',
    '阿尔及利亚玻璃制品厂': 'โรงงานผลิตภัณฑ์แก้วแอลจีเรีย',
    '东南亚电子装配线（示例）': 'สายการประกอบอิเล็กทรอนิกส์เอเชียตะวันออกเฉียงใต้ (ตัวอย่าง)',
    '中亚矿业技术服务（示例）': 'บริการเทคนิคเหมืองเอเชียกลาง (ตัวอย่าง)',
    '沙特光伏组件厂（测试）': 'โรงงานแผงโซลาร์ซาอุดีอาระเบีย (ทดสอบ)',
    '测试沙特光伏项目': 'โครงการโซลาร์ซาอุดีอาระเบีย (ทดสอบ)',
    '6 条产线': '6 สายการผลิต',
    '2 条产线': '2 สายการผลิต',
    '3 个作业区': '3 พื้นที่ปฏิบัติงาน',
    '筹备中': 'กำลังเตรียมการ',
    '中方 19 人 + 当地 8 人 · 两班倒 12 小时': 'จีน 19 คน + ท้องถิ่น 8 คน · 2 กะ 12 ชั่วโมง',
    '中方 5 人 + 当地 2 人 · 立项论证中': 'จีน 5 คน + ท้องถิ่น 2 คน · อยู่ระหว่างศึกษาความเป็นไปได้',
    '中方 3 人 · 商务谈判阶段': 'จีน 3 คน · อยู่ในขั้นเจรจาธุรกิจ',
    '新建项目，待补充岗位需求': 'โครงการใหม่ รอกรอกความต้องการตำแหน่ง',
    '需求确认 · 双轨用工方案': 'ยืนยันความต้องการ · แผนจ้างสองระบบ',
    '6 条产线岗位清单 · 签证预审前置': 'รายการตำแหน่ง 6 สาย · ตรวจวีซ่าก่อน',
    '中方 19 人推荐完成 · 5 人待签证材料': 'แนะนำจีน 19 คนเสร็จ · 5 คนรอเอกสารวีซ่า',
    '预计批量签约': 'คาดว่าจะลงนามเป็นชุด',
    '签证 / 工作许可 / 保险': 'วีซ่า / ใบอนุญาตทำงาน / ประกัน',
    '考勤 · 薪酬 · 合规巡检': 'ลงเวลา · ค่าจ้าง · ตรวจ compliance',
    '需求收集 · 可行性论证': 'รวบรวมความต้องการ · ศึกษาความเป็นไปได้',
    '产线岗位清单编制中': 'กำลังจัดทำรายการตำแหน่งของสายผลิต',
    '等待岗位需求确认': 'รอยืนยันความต้องการตำแหน่ง',
    '意向书签署': 'ลงนามหนังสือแสดงเจตจำนง',
    '等待客户确认薪酬口径': 'รอลูกค้ายืนยันฐานค่าจ้าง',
    '—': '—',
  });

  DICT.fr = Object.assign(DICT.fr || {}, {
    '阿尔及利亚玻璃制品工厂': 'Usine de produits en verre en Algérie',
    '阿尔及利亚玻璃制品厂': 'Usine de produits en verre en Algérie',
    '东南亚电子装配线（示例）': 'Ligne d’assemblage électronique en Asie du Sud-Est (exemple)',
    '中亚矿业技术服务（示例）': 'Services techniques miniers d’Asie centrale (exemple)',
    '沙特光伏组件厂（测试）': 'Usine de panneaux solaires en Arabie saoudite (test)',
    '测试沙特光伏项目': 'Projet solaire saoudien (test)',
    '6 条产线': '6 lignes',
    '2 条产线': '2 lignes',
    '3 个作业区': '3 zones d’opération',
    '筹备中': 'En préparation',
    '中方 19 人 + 当地 8 人 · 两班倒 12 小时': '19 Chinois + 8 locaux · 2 équipes de 12 h',
    '中方 5 人 + 当地 2 人 · 立项论证中': '5 Chinois + 2 locaux · étude de faisabilité',
    '中方 3 人 · 商务谈判阶段': '3 Chinois · phase de négociation',
    '新建项目，待补充岗位需求': 'Nouveau projet, besoins de postes à compléter',
    '需求确认 · 双轨用工方案': 'Besoins confirmés · plan double emploi',
    '6 条产线岗位清单 · 签证预审前置': 'Liste des postes 6 lignes · pré-examen visa',
    '中方 19 人推荐完成 · 5 人待签证材料': '19 Chinois recommandés · 5 en attente de visa',
    '预计批量签约': 'Signature groupée prévue',
    '签证 / 工作许可 / 保险': 'Visa / permis de travail / assurance',
    '考勤 · 薪酬 · 合规巡检': 'Présence · paie · audit conformité',
    '需求收集 · 可行性论证': 'Collecte des besoins · faisabilité',
    '产线岗位清单编制中': 'Liste des postes en cours d’élaboration',
    '等待岗位需求确认': 'En attente de confirmation des besoins',
    '意向书签署': 'Lettre d’intention signée',
    '等待客户确认薪酬口径': 'En attente du barème salarial client',
    '—': '—',
  });

  DICT.ar = Object.assign(DICT.ar || {}, {
    '阿尔及利亚玻璃制品工厂': 'مصنع المنتجات الزجاجية في الجزائر',
    '阿尔及利亚玻璃制品厂': 'مصنع المنتجات الزجاجية في الجزائر',
    '东南亚电子装配线（示例）': 'خط تجميع إلكترونيات في جنوب شرق آسيا (مثال)',
    '中亚矿业技术服务（示例）': 'خدمات فنية للتعدين في آسيا الوسطى (مثال)',
    '沙特光伏组件厂（测试）': 'مصنع ألواح شمسية في السعودية (اختبار)',
    '测试沙特光伏项目': 'مشروع طاقة شمسية سعودي (اختبار)',
    '6 条产线': '6 خطوط إنتاج',
    '2 条产线': 'خطان إنتاج',
    '3 个作业区': '3 مناطق عمل',
    '筹备中': 'قيد الإعداد',
    '中方 19 人 + 当地 8 人 · 两班倒 12 小时': '19 صينيًا + 8 محليين · ورديتان 12 ساعة',
    '中方 5 人 + 当地 2 人 · 立项论证中': '5 صينيين + 2 محليين · قيد دراسة الجدوى',
    '中方 3 人 · 商务谈判阶段': '3 صينيين · مرحلة التفاوض التجاري',
    '新建项目，待补充岗位需求': 'مشروع جديد، متطلبات الوظائف قيد الاستكمال',
    '需求确认 · 双轨用工方案': 'تأكيد المتطلبات · خطة التوظيف المزدوج',
    '6 条产线岗位清单 · 签证预审前置': 'قائمة وظائف 6 خطوط · فحص التأشيرة المسبق',
    '中方 19 人推荐完成 · 5 人待签证材料': 'تم ترشيح 19 صينيًا · 5 بانتظار مستندات التأشيرة',
    '预计批量签约': 'توقيع جماعي متوقع',
    '签证 / 工作许可 / 保险': 'التأشيرة / تصريح العمل / التأمين',
    '考勤 · 薪酬 · 合规巡检': 'الحضور · الرواتب · جولة الامتثال',
    '需求收集 · 可行性论证': 'جمع المتطلبات · دراسة الجدوى',
    '产线岗位清单编制中': 'قائمة الوظائف قيد الإعداد',
    '等待岗位需求确认': 'بانتظار تأكيد متطلبات الوظائف',
    '意向书签署': 'توقيع خطاب النوايا',
    '等待客户确认薪酬口径': 'بانتظار تأكيد العميل لمعيار الأجر',
    '—': '—',
  });

  /* ---------- 国家名（项目卡片用） ---------- */
  DICT.ja = Object.assign(DICT.ja || {}, {
    '阿尔及利亚': 'アルジェリア',
    '越南': 'ベトナム',
    '哈萨克斯坦': 'カザフスタン',
    '沙特阿拉伯': 'サウジアラビア',
    '沙特': 'サウジアラビア',
    '阿联酋': 'アラブ首長国連邦',
    '印度尼西亚': 'インドネシア',
    '菲律宾': 'フィリピン',
    '泰国': 'タイ',
    '马来西亚': 'マレーシア',
    '中国': '中国',
    '签证预审 92% 通过 · 无预警': 'ビザ事前審査 92% 通過・警告なし',
  });

  DICT.th = Object.assign(DICT.th || {}, {
    '阿尔及利亚': 'แอลจีเรีย',
    '越南': 'เวียดนาม',
    '哈萨克斯坦': 'คาซัคสถาน',
    '沙特阿拉伯': 'ซาอุดีอาระเบีย',
    '沙特': 'ซาอุดีอาระเบีย',
    '阿联酋': 'สหรัฐอาหรับเอมิเรตส์',
    '印度尼西亚': 'อินโดนีเซีย',
    '菲律宾': 'ฟิลิปปินส์',
    '泰国': 'ไทย',
    '马来西亚': 'มาเลเซีย',
    '中国': 'จีน',
    '签证预审 92% 通过 · 无预警': 'ตรวจวีซ่าเบื้องต้นผ่าน 92% · ไม่มีคำเตือน',
  });

  DICT.fr = Object.assign(DICT.fr || {}, {
    '阿尔及利亚': 'Algérie',
    '越南': 'Viêt Nam',
    '哈萨克斯坦': 'Kazakhstan',
    '沙特阿拉伯': 'Arabie saoudite',
    '沙特': 'Arabie saoudite',
    '阿联酋': 'Émirats arabes unis',
    '印度尼西亚': 'Indonésie',
    '菲律宾': 'Philippines',
    '泰国': 'Thaïlande',
    '马来西亚': 'Malaisie',
    '中国': 'Chine',
    '签证预审 92% 通过 · 无预警': 'Pré-examen visa 92 % · aucune alerte',
  });

  DICT.ar = Object.assign(DICT.ar || {}, {
    '阿尔及利亚': 'الجزائر',
    '越南': 'فيتنام',
    '哈萨克斯坦': 'كازاخستان',
    '沙特阿拉伯': 'المملكة العربية السعودية',
    '沙特': 'السعودية',
    '阿联酋': 'الإمارات',
    '印度尼西亚': 'إندونيسيا',
    '菲律宾': 'الفلبين',
    '泰国': 'تايلاند',
    '马来西亚': 'ماليزيا',
    '中国': 'الصين',
    '签证预审 92% 通过 · 无预警': 'فحص التأشيرة المسبق 92% · بلا تنبيهات',
  });

  /* L() 文案词典：由项目内 L(zh,en) 文案生成，覆盖匹配页/控制台/岗位页 */
  Object.assign(DICT.th, {
  "实时": "เรียลไทม์",
  " 条提醒": " รายการแจ้งเตือน",
  "收起": "ย่อ",
  "分档 · 人": "แบ่งระดับ · คน",
  "营收与毛利率": "รายได้และอัตรากำไรขั้นต้น",
  "结算单口径 · 万元": "ตามใบเรียกเก็บเงิน · หมื่นหยวน",
  "应收账龄": "อายุลูกหนี้",
  "按应收到期日": "ตามวันครบกำหนดของลูกหนี้",
  "岗位健康度": "สุขภาพตำแหน่งงาน",
  "点击查看岗位": "คลิกเพื่อดูตำแหน่งงาน",
  "待办": "รายการที่ต้องดำเนินการ",
  "暂无岗位数据": "ยังไม่มีข้อมูลตำแหน่งงาน",
  "展开全部 ": "ขยายทั้งหมด ",
  "展开": "ขยาย",
  "已跳转：": "เปลี่ยนเส้นทางแล้ว：",
  "加载中…": "กำลังโหลด…",
  "接口未就绪，请重启后端后重试": "อินเทอร์เฟซยังไม่พร้อม กรุณารีสตาร์ทแบ็กเอนด์แล้วลองใหม่",
  "暂无时间戳": "ยังไม่มีเวลาประทับ",
  "暂无数据": "ยังไม่มีข้อมูล",
  "全部": "ทั้งหมด",
  "近 90 天": "90 วันล่าสุด",
  "近 30 天": "30 วันล่าสุด",
  "加载岗位…": "กำลังโหลดตำแหน่งงาน…",
  "刷新": "รีเฟรช",
  "数据来源：投递 / 面试邀约 / 录用通知（实时）": "แหล่งข้อมูล：การสมัคร / คำเชิญสัมภาษณ์ / หนังสือเสนอจ้าง (เรียลไทม์)",
  "投递": "ส่งใบสมัคร",
  "岗位收到的简历": "เรซูเม่ที่ได้รับสำหรับตำแหน่ง",
  "面试邀约": "คำเชิญสัมภาษณ์",
  "已安排面试": "นัดสัมภาษณ์แล้ว",
  "面试通过": "ผ่านการสัมภาษณ์",
  "待定 ": "รอดำเนินการ",
  "待接受 ": "รอการตอบรับ",
  "到岗": "เริ่มงานได้",
  "接受 offer": "ตอบรับ offer",
  "通过": "ผ่าน",
  "未通过": "ไม่ผ่าน",
  "已接受": "ตอบรับแล้ว",
  "已拒绝": "ปฏิเสธแล้ว",
  "待接受": "รอการตอบรับ",
  "投递明细": "รายละเอียดการสมัคร",
  "面试记录 · 可回写结果": "บันทึกการสัมภาษณ์ · สามารถเขียนผลกลับได้",
  "面试通过名单": "รายชื่อผู้ผ่านการสัมภาษณ์",
  "Offer 明细": "รายละเอียด Offer",
  "已到岗名单": "รายชื่อผู้เข้าปฏิบัติงานแล้ว",
  "阶段明细": "รายละเอียดแต่ละขั้นตอน",
  "候选人": "ผู้สมัคร",
  "投递时间": "เวลาที่สมัคร",
  "来源": "แหล่งที่มา",
  "状态": "สถานะ",
  "该时间段没有投递": "ไม่มีผู้สมัครในช่วงเวลานี้",
  "发出时间": "เวลาที่ส่งออก",
  "薪资": "เงินเดือน",
  "该时间段没有 Offer": "ไม่มี Offer ในช่วงเวลานี้",
  "面试时间": "เวลาสัมภาษณ์",
  "结果": "ผลลัพธ์",
  "回写结果": "ผลการเขียนกลับ",
  "还没有面试记录，去「投递管理」邀面试": "ยังไม่มีบันทึกการสัมภาษณ์ ไปที่「การจัดการการสมัคร」เพื่อเชิญสัมภาษณ์",
  "点上面的漏斗可以切换阶段": "คลิกกรวยด้านบนเพื่อสลับขั้นตอน",
  "这个岗位还没有招聘数据": "ตำแหน่งนี้ยังไม่มีข้อมูลการรับสมัคร",
  "招聘漏斗": "กรวยการรับสมัคร",
  "点某一段看名单": "คลิกส่วนใดส่วนหนึ่งเพื่อดูรายชื่อ",
  "环节转化率": "อัตราการแปลงแต่ละขั้นตอน",
  "越靠后越要盯": "ยิ่งอยู่ท้ายยิ่งต้องจับตา",
  "投递趋势": "แนวโน้มการสมัคร",
  "近 6 个月": "6 เดือนล่าสุด",
  "阶段平均耗时": "เวลาเฉลี่ยแต่ละขั้นตอน",
  "有真实时间戳才计算": "คำนวณเฉพาะเมื่อมีเวลาประทับจริง",
  "岗位横向对比": "เปรียบเทียบตำแหน่งแบบขวาง",
  "X=到岗转化 · Y=面试通过率 · 气泡=投递量 · 黄点=当前岗位": "X=การแปลงเป็นการเข้าทำงาน · Y=อัตราการผ่านสัมภาษณ์ · ฟอง=ปริมาณการสมัคร · จุดเหลือง=ตำแหน่งปัจจุบัน",
  "其他岗位": "ตำแหน่งอื่น",
  "当前岗位": "ตำแหน่งปัจจุบัน",
  "投递来源": "แหล่งที่มาของการสมัคร",
  "按投递渠道": "ตามช่องทางการสมัคร",
  "面试未通过原因 Top5": "5 อันดับสาเหตุที่ไม่ผ่านสัมภาษณ์",
  "点击“未通过”时可填写": "คลิก \"ไม่ผ่าน\" เพื่อกรอกได้",
  "口径：投递＝人才库/应聘者档案里的投递记录；面试＝邀约记录；通过/未通过＝回写结果；Offer/到岗＝录用通知状态。时间范围按对应记录的创建时间筛选。": "เกณฑ์: การสมัคร＝บันทึกการสมัครในคลังบุคลากร/แฟ้มผู้สมัคร; การสัมภาษณ์＝บันทึกการเชิญ; ผ่าน/ไม่ผ่าน＝ผลการเขียนกลับ; Offer/เข้าทำงาน＝สถานะหนังสือแจ้งการจ้าง ช่วงเวลากรองตามเวลาที่สร้างของบันทึกที่เกี่ยวข้อง",
  "已回写": "เขียนกลับแล้ว",
  "面试结果：": "ผลการสัมภาษณ์：",
  "回写失败": "เขียนกลับล้มเหลว",
  "请选择岗位": "กรุณาเลือกตำแหน่ง",
  "加载失败，请刷新重试": "โหลดล้มเหลว กรุณารีเฟรชแล้วลองใหม่",
  " 个岗位": " ตำแหน่ง",
  "列表": "รายการ",
  "卡片": "บัตร",
  "缺口": "ช่องว่าง",
  "推荐": "แนะนำ",
  "毛利": "กำไรขั้นต้น",
  "岗位": "ตำแหน่งงาน",
  "国家": "ประเทศ",
  "已推荐": "แนะนำแล้ว",
  "填补天数": "จำนวนวันที่เติมเต็ม",
  "毛利率": "อัตรากำไรขั้นต้น",
  " · 毛利率 ": " · อัตรากำไรขั้นต้น ",
  "关闭（列表铺满）": "ปิด (รายการเต็ม)",
  "供给漏斗": "กรวยอุปทาน",
  "阶段耗时": "ระยะเวลาของแต่ละขั้นตอน",
  "成本与收益": "ต้นทุนและผลตอบแทน",
  "渠道费用": "ค่าใช้จ่ายช่องทาง",
  "单人成本": "ต้นทุนต่อคน",
  "客户报价": "ราคาที่เสนอลูกค้า",
  " 元/月": " บาท/เดือน",
  "单毛利": "กำไรขั้นต้นต่อรายการ",
  "风险与失败原因": "ความเสี่ยงและสาเหตุความล้มเหลว",
  "关闭岗位": "ปิดตำแหน่งงาน",
  "加急推荐": "แนะนำแบบเร่งด่วน",
  "已提交关闭申请：": "ส่งคำขอปิดแล้ว: ",
  "已加急：": "เร่งด่วนแล้ว: ",
  "（优先推送 3 天）": "(ผลักดันก่อน 3 วัน)",
  "项目列表": "รายการโครงการ",
  "岗位生意账": "บัญชีธุรกิจตำแหน่งงาน",
  "连接后端…": "กำลังเชื่อมต่อแบ็กเอนด์…",
  "云端函数": "ฟังก์ชันคลาวด์",
  "本地服务": "บริการภายในเครื่อง",
  "规则引擎": "เอนจินกฎ",
  "后端未连接": "แบ็กเอนด์ยังไม่เชื่อมต่อ",
  "准备 2 个能证明动手能力的案例：什么设备、怎么调参数、产量/合格率变化": "เตรียม 2 เคสที่พิสูจน์ความสามารถลงมือทำได้：อุปกรณ์อะไร ปรับพารามิเตอร์อย่างไร ผลผลิต/อัตราของเสียเปลี่ยนไปอย่างไร",
  "准备一段能说明你适应长期外派的经历（出差、驻场、异地工作都算）": "เตรียมประสบการณ์ที่แสดงว่าคุณปรับตัวเข้ากับการไปประจำต่างถิ่นระยะยาวได้（การเดินทางไปทำงาน การประจำไซต์งาน การทำงานต่างจังหวัด นับทั้งหมด）",
  "核对护照有效期、健康证、无犯罪公证，扫描件提前备好": "ตรวจสอบอายุหนังสือเดินทาง ใบรับรองสุขภาพ ใบรับรองประวัติอาชญากรรม ให้เตรียมสำเนาสแกนไว้ล่วงหน้า",
  "准备一段英文自我介绍，熟悉设备手册里的常用词": "เตรียมแนะนำตัวเป็นภาษาอังกฤษสั้นๆ และทำความคุ้นเคยกับคำศัพท์ที่ใช้บ่อยในคู่มืออุปกรณ์",
  "把简历里与岗位最相关的 2 段经历按「背景-做法-结果」讲清楚": "อธิบายประสบการณ์ 2 ช่วงในเรซูเม่ที่เกี่ยวข้องกับตำแหน่งมากที่สุดตามโครง「ภูมิหลัง-วิธีทำ-ผลลัพธ์」ให้ชัดเจน",
  "准备 3 个问 HR 的问题：班次、住宿、签证进度、合同期": "เตรียมคำถาม 3 ข้อถาม HR：กะทำงาน ที่พัก ความคืบหน้าวีซ่า ระยะเวลาสัญญา",
  "补齐岗位要求的证书，先把已持有的证书扫描件放进档案": "เติมใบรับรองที่ตำแหน่งกำหนดให้ครบ โดยนำสำเนาสแกนใบรับรองที่มีอยู่แล้วใส่ในแฟ้มก่อน",
  "把期望薪资调到岗位区间内，或注明可接受的范围": "ปรับเงินเดือนที่คาดหวังให้อยู่ในช่วงของตำแหน่ง หรือระบุช่วงที่ยอมรับได้",
  "提前准备离职与出境材料，把到岗时间往前挪": "เตรียมเอกสารลาออกและเอกสารเดินทางออกนอกประเทศล่วงหน้า เลื่อนเวลาที่พร้อมเริ่มงานให้เร็วขึ้น",
  "保持证件有效期，简历里的项目成果尽量写数字（产量、合格率、带教人数）": "รักษาอายุเอกสารให้ยังใช้ได้ และเขียนผลงานในโครงการในเรซูเม่เป็นตัวเลขให้มากที่สุด（ผลผลิต อัตราของเสีย จำนวนคนที่สอนงาน）",
  "面试准备清单": "รายการเตรียมตัวสัมภาษณ์",
  "怎么提高匹配度": "วิธีเพิ่มความตรงกัน",
  "正在加载候选人…": "กำลังโหลดผู้สมัคร…",
  "暂无岗位": "ยังไม่มีตำแหน่งงาน",
  "选择岗位": "เลือกตำแหน่งงาน",
  "匹配分析": "วิเคราะห์ความตรงกัน",
  "全部分析": "วิเคราะห์ทั้งหมด",
  "看 AI 分析演示": "ดูตัวอย่างการวิเคราะห์ด้วย AI",
  "看 AI 演示": "ดูตัวอย่าง AI",
  "收藏夹": "รายการโปรด",
  "评分规则": "กฎการให้คะแนน",
  "搜索姓名 / 工种 / 技能，如：张伟、注塑、质检": "ค้นหาชื่อ / ประเภทงาน / ทักษะ เช่น：จางเหว่ย、ฉีดพลาสติก、ควบคุมคุณภาพ",
  "清空筛选": "ล้างตัวกรอง",
  "经验": "ประสบการณ์",
  "3 年以上": "3 ปีขึ้นไป",
  "5 年以上": "5 ปีขึ้นไป",
  "8 年以上": "8 ปีขึ้นไป",
  "10 年以上": "10 ปีขึ้นไป",
  "条件": "เงื่อนไข",
  "持证": "มีใบรับรอง",
  "仅门槛通过": "ผ่านเกณฑ์ขั้นต่ำเท่านั้น",
  "有健康证": "มีใบรับรองสุขภาพ",
  "有驻外经历": "มีประสบการณ์ทำงานต่างประเทศ",
  "仅已投递": "เฉพาะที่สมัครแล้ว",
  "15 天内": "ภายใน 15 วัน",
  "30 天内": "ภายใน 30 วัน",
  "60 天内": "ภายใน 60 วัน",
  "期望薪资": "เงินเดือนที่คาดหวัง",
  "15K 以下": "ต่ำกว่า 15K",
  "25K 以上": "25K ขึ้นไป",
  "学历": "ระดับการศึกษา",
  "中专及以上": "ประกาศนียบัตรวิชาชีพขึ้นไป",
  "大专及以上": "อนุปริญญาขึ้นไป",
  "本科及以上": "ปริญญาตรีขึ้นไป",
  "排序": "เรียงลำดับ",
  "综合排序": "เรียงลำดับแบบรวม",
  "经验优先": "ประสบการณ์ก่อน",
  "到岗优先": "เริ่มงานได้ก่อน",
  "按姓名": "ตามชื่อ",
  "仅显示已投递简历的候选人": "แสดงเฉพาะผู้สมัครที่ส่งเรซูเม่แล้ว",
  "仅显示人才库中未投递的候选人（可主动邀约）": "แสดงเฉพาะผู้สมัครในคลัง talent ที่ยังไม่สมัคร (สามารถเชิญได้)",
  " 位候选人": " ผู้สมัคร",
  "已投递 ": "ส่งใบสมัครแล้ว ",
  " 位 · 证件通过 ": " ท่าน · เอกสารผ่าน ",
  " 位 · 当前显示 ": " ท่าน · แสดงปัจจุบัน ",
  "勾选候选人后点「匹配分析」即可获得匹配分与排名": "เลือกผู้สมัครแล้วคลิก «วิเคราะห์การจับคู่» เพื่อรับคะแนนการจับคู่และอันดับ",
  " 年 · ": " ปี · ",
  "待确认": "รอยืนยัน",
  "期望": "คาดหวัง",
  "面议": "เจรจาได้",
  "证件": "เอกสาร",
  "待补": "รอเพิ่มเติม",
  "齐全": "ครบถ้วน",
  "部分": "บางส่วน",
  " · 关键条件": " · เงื่อนไขสำคัญ",
  "到岗时间": "เวลาที่พร้อมเริ่มงาน",
  "工作年限": "ปีประสบการณ์ทำงาน",
  "护照": "หนังสือเดินทาง",
  "有效": "มีผล",
  "健康证": "ใบรับรองสุขภาพ",
  "已备": "เตรียมพร้อมแล้ว",
  "缺失": "ขาดหาย",
  "驻外经历": "ประสบการณ์ประจำต่างประเทศ",
  "无技能缺口": "ไม่มีช่องว่างทักษะ",
  "暂无风险提示": "ยังไม่มีคำเตือนความเสี่ยง",
  "点击查看完整简历": "คลิกเพื่อดูเรซูเม่ฉบับเต็ม",
  "已投递": "ส่งใบสมัครแล้ว",
  "人才库": "คลังบุคลากร",
  "勾选后可批量匹配分析": "เลือกแล้วสามารถวิเคราะห์จับคู่แบบกลุ่มได้",
  "查看详情": "ดูรายละเอียด",
  "邀面试": "เชิญสัมภาษณ์",
  "分析中…": "กำลังวิเคราะห์…",
  "解释失败": "อธิบายล้มเหลว",
  "AI 解释": "คำอธิบาย AI",
  "上一页": "หน้าก่อนหน้า",
  " 页 · 共 ": " หน้า · ทั้งหมด ",
  "下一页": "หน้าถัดไป",
  "面试": "สัมภาษณ์",
  "已录用": "รับเข้าทำงานแล้ว",
  "需求": "ความต้องการ",
  "计算中…": "กำลังคำนวณ…",
  "加载失败：": "โหลดล้มเหลว：",
  "排名已重算": "คำนวณอันดับใหม่แล้ว",
  " 位上升": " อันดับขึ้น",
  " 位下降": " อันดับลง",
  "本次无排名变化": "ครั้งนี้ไม่มีการเปลี่ยนแปลงอันดับ",
  "已选 ": "เลือกแล้ว ",
  "匹配分析这 ": "วิเคราะห์จับคู่ ",
  "取消选择": "ยกเลิกการเลือก",
  "分析将逐个播放推理过程": "การวิเคราะห์จะแสดงกระบวนการให้เหตุผลทีละรายการ",
  "无法分析": "ไม่สามารถวิเคราะห์ได้",
  "当前没有可分析的候选人": "ขณะนี้ไม่มีผู้สมัครที่สามารถวิเคราะห์ได้",
  "演示未加载": "ยังไม่ได้โหลดเดโม",
  "请刷新页面后重试": "โปรดรีเฟรชหน้าแล้วลองอีกครั้ง",
  "当前筛选结果为空": "ผลการกรองปัจจุบันว่างเปล่า",
  "将对当前筛选出的 ": "จะทำการวิเคราะห์ผู้สมัครที่กรองได้ในปัจจุบันจำนวน ",
  " 位候选人逐个分析": " คนทีละคน",
  "取消收藏": "ยกเลิกการบันทึก",
  "收藏夹是空的。在候选人卡片上点「收藏」后会出现在这里。": "รายการโปรดว่างเปล่า หลังจากกด \"บันทึก\" บนการ์ดผู้สมัครจะปรากฏที่นี่",
  "候选人收藏夹": "รายการโปรดผู้สมัคร",
  "关闭": "ปิด",
  "重新计算中…": "กำลังคำนวณใหม่…",
  "失败：": "ล้มเหลว：",
  "返回分析结果": "กลับไปยังผลการวิเคราะห์",
  "技能验证": "การตรวจสอบทักษะ",
  "薪资/动机": "เงินเดือน/แรงจูงใจ",
  "判断薪资能否谈拢、动机是否真实": "ตัดสินว่าเงินเดือนสามารถเจรจาตกลงได้หรือไม่ แรงจูงใจเป็นจริงหรือไม่",
  "稳定性": "ความมั่นคง",
  "为什么想去海外？家人支持长期外派吗？": "ทำไมถึงอยากไปต่างประเทศ？ครอบครัวสนับสนุนการไปประจำต่างประเทศระยะยาวหรือไม่？",
  "外派动机与家庭支持": "แรงจูงใจในการไปประจำต่างประเทศและการสนับสนุนจากครอบครัว",
  "合规": "การปฏิบัติตามกฎระเบียบ",
  "护照、健康证、无犯罪公证什么时候能备齐？": "หนังสือเดินทาง ใบรับรองสุขภาพ ใบรับรองประวัติอาชญากรรมสามารถเตรียมให้พร้อมได้เมื่อไหร่？",
  "确认出境材料时间是否赶得上": "ยืนยันว่าเวลาของเอกสาร出境จะทันหรือไม่",
  "语言": "ภาษา",
  "现场需要看懂英文设备手册，你实际用过吗？": "ในสถานที่ทำงานต้องอ่านคู่มืออุปกรณ์ภาษาอังกฤษให้เข้าใจ คุณเคยใช้งานจริงหรือไม่？",
  "语言能否支撑上岗": "ภาษาสามารถรองรับการปฏิบัติงานได้หรือไม่",
  "经验核实": "การตรวจสอบประสบการณ์",
  "你之前做的是注塑，这次是玻璃压机，工艺差别你怎么补？": "ก่อนหน้านี้คุณทำ Injection molding ครั้งนี้เป็นเครื่องอัดแก้ว ความแตกต่างของกระบวนการคุณจะชดเชยอย่างไร？",
  "看学习与迁移能力": "ดูความสามารถในการเรียนรู้และการถ่ายทอด",
  "确认到岗节奏": "ยืนยันจังหวะการเข้าทำงาน",
  "动因": "แรงจูงใจ",
  "为什么选这个国家、这个岗位？": "ทำไมถึงเลือกประเทศนี้ ตำแหน่งนี้?",
  "判断选择是否想清楚": "ประเมินว่าคิดชัดเจนในการเลือกหรือไม่",
  "落地": "การลงพื้นที่",
  "入职前三个月，你希望达成什么？": "สามเดือนแรกก่อนเข้าทำงาน คุณหวังจะบรรลุอะไร?",
  "看目标感与计划性": "ดูเป้าหมายและความเป็นระบบแบบแผน",
  "考察点：": "ประเด็นที่พิจารณา:",
  "面试提问建议": "คำแนะนำคำถามสัมภาษณ์",
  " 条 · 按缺口与风险生成": " รายการ · สร้างตามช่องว่างและความเสี่ยง",
  "考察重点分布": "การกระจายประเด็นสำคัญที่พิจารณา",
  "分数按各分项满分归一化": "คะแนนถูกปรับมาตรฐานตามคะแนนเต็มของแต่ละรายการ"
});
  Object.assign(DICT.ja, {
  "实时": "リアルタイム",
  " 条提醒": " 件のリマインダー",
  "收起": "折りたたむ",
  "分档 · 人": "区分 · 人",
  "营收与毛利率": "売上高と粗利益率",
  "结算单口径 · 万元": "精算書ベース · 万元",
  "应收账龄": "売掛金のエイジング",
  "按应收到期日": "売掛金の期日基準",
  "岗位健康度": "ポジションの健全性",
  "点击查看岗位": "クリックしてポジションを表示",
  "待办": "ToDo",
  "暂无岗位数据": "ポジションデータはまだありません",
  "展开全部 ": "すべて展開 ",
  "展开": "展開",
  "已跳转：": "遷移済み：",
  "加载中…": "読み込み中…",
  "接口未就绪，请重启后端后重试": "インターフェースが未準備です。バックエンドを再起動してから再試行してください",
  "暂无时间戳": "タイムスタンプはありません",
  "暂无数据": "データはありません",
  "全部": "すべて",
  "近 90 天": "過去 90 日間",
  "近 30 天": "過去 30 日間",
  "加载岗位…": "ポジションを読み込み中…",
  "刷新": "更新",
  "数据来源：投递 / 面试邀约 / 录用通知（实时）": "データソース：応募 / 面接招待 / 採用通知（リアルタイム）",
  "投递": "応募",
  "岗位收到的简历": "ポジションに届いた履歴書",
  "面试邀约": "面接招待",
  "已安排面试": "面接設定済み",
  "面试通过": "面接合格",
  "待定 ": "保留",
  "待接受 ": "承諾待ち",
  "到岗": "着任",
  "接受 offer": "Offer承諾",
  "通过": "合格",
  "未通过": "不合格",
  "已接受": "承諾済み",
  "已拒绝": "辞退済み",
  "待接受": "承諾待ち",
  "投递明细": "応募明細",
  "面试记录 · 可回写结果": "面接記録・結果の書き戻し可能",
  "面试通过名单": "面接合格者リスト",
  "Offer 明细": "Offer明細",
  "已到岗名单": "入社済みリスト",
  "阶段明细": "フェーズ明細",
  "候选人": "候補者",
  "投递时间": "応募日時",
  "来源": "ソース",
  "状态": "ステータス",
  "该时间段没有投递": "該当期間に応募はありません",
  "发出时间": "送信日時",
  "薪资": "給与",
  "该时间段没有 Offer": "該当期間にOfferはありません",
  "面试时间": "面接日時",
  "结果": "結果",
  "回写结果": "結果を書き戻す",
  "还没有面试记录，去「投递管理」邀面试": "まだ面接記録がありません。「応募管理」で面接に招待してください",
  "点上面的漏斗可以切换阶段": "上のファネルをクリックするとステージを切り替えられます",
  "这个岗位还没有招聘数据": "この求人にはまだ採用データがありません",
  "招聘漏斗": "採用ファネル",
  "点某一段看名单": "セグメントをクリックすると名簿を表示",
  "环节转化率": "ステップ別転換率",
  "越靠后越要盯": "後半ほど要注意",
  "投递趋势": "応募トレンド",
  "近 6 个月": "直近6か月",
  "阶段平均耗时": "ステージ平均所要時間",
  "有真实时间戳才计算": "実際のタイムスタンプがある場合のみ計算",
  "岗位横向对比": "求人横断比較",
  "X=到岗转化 · Y=面试通过率 · 气泡=投递量 · 黄点=当前岗位": "X=入社転換 · Y=面接通過率 · バブル=応募数 · 黄点=現在の求人",
  "其他岗位": "その他の求人",
  "当前岗位": "現在の求人",
  "投递来源": "応募元",
  "按投递渠道": "応募チャネル別",
  "面试未通过原因 Top5": "面接不通過理由 Top5",
  "点击“未通过”时可填写": "「不通過」をクリックすると入力できます",
  "口径：投递＝人才库/应聘者档案里的投递记录；面试＝邀约记录；通过/未通过＝回写结果；Offer/到岗＝录用通知状态。时间范围按对应记录的创建时间筛选。": "定義：応募＝人材プール/応募者档案の応募記録；面接＝招待記録；通過/不通過＝書き戻し結果；Offer/入社＝採用通知ステータス。期間は該当記録の作成日時で絞り込み。",
  "已回写": "書き戻し済み",
  "面试结果：": "面接結果：",
  "回写失败": "書き戻し失敗",
  "请选择岗位": "求人を選択してください",
  "加载失败，请刷新重试": "読み込みに失敗しました。更新して再試行してください",
  " 个岗位": " 件の求人",
  "列表": "リスト",
  "卡片": "カード",
  "缺口": "欠員",
  "推荐": "推薦",
  "毛利": "粗利",
  "岗位": "ポジション",
  "国家": "国",
  "已推荐": "推薦済み",
  "填补天数": "充足日数",
  "毛利率": "粗利率",
  " · 毛利率 ": " · 粗利率 ",
  "关闭（列表铺满）": "クローズ（リスト満杯）",
  "供给漏斗": "供給ファネル",
  "阶段耗时": "フェーズ所要時間",
  "成本与收益": "コストと収益",
  "渠道费用": "チャネル費用",
  "单人成本": "一人当たりコスト",
  "客户报价": "顧客見積",
  "单毛利": "一件当たり粗利",
  "风险与失败原因": "リスクと失敗原因",
  "关闭岗位": "ポジションをクローズ",
  "加急推荐": "優先推薦",
  "已提交关闭申请：": "クローズ申請を提出済み：",
  "已加急：": "優先設定済み：",
  "（优先推送 3 天）": "（3日間優先配信）",
  "项目列表": "プロジェクト一覧",
  "岗位生意账": "ポジション収支",
  "连接后端…": "バックエンドに接続中…",
  "云端函数": "クラウド関数",
  "本地服务": "ローカルサービス",
  "规则引擎": "ルールエンジン",
  "后端未连接": "バックエンド未接続",
  "准备 2 个能证明动手能力的案例：什么设备、怎么调参数、产量/合格率变化": "実務能力を証明できる2つの事例を準備する：どの設備、どうパラメータを調整したか、生産量/合格率の変化",
  "准备一段能说明你适应长期外派的经历（出差、驻场、异地工作都算）": "長期海外派遣への適応力を示す経験を準備する（出張、常駐、遠隔地勤務いずれも可）",
  "核对护照有效期、健康证、无犯罪公证，扫描件提前备好": "パスポートの有効期限、健康証明書、無犯罪証明の公証を確認し、スキャン件を事前に用意する",
  "准备一段英文自我介绍，熟悉设备手册里的常用词": "英語の自己紹介を準備し、設備マニュアルの常用語に慣れておく",
  "把简历里与岗位最相关的 2 段经历按「背景-做法-结果」讲清楚": "履歴書の中で職務に最も関連する2つの経験を「背景-対応-結果」で明確に説明する",
  "准备 3 个问 HR 的问题：班次、住宿、签证进度、合同期": "HRに聞く質問を3つ準備する：シフト、宿泊、ビザの進捗、契約期間",
  "补齐岗位要求的证书，先把已持有的证书扫描件放进档案": "職務要件の資格を補い、まず保有資格のスキャン件をファイルに入れる",
  "把期望薪资调到岗位区间内，或注明可接受的范围": "希望給与を職務の範囲内に調整するか、許容範囲を明記する",
  "提前准备离职与出境材料，把到岗时间往前挪": "退職と出国の書類を前もって準備し、着任時期を早める",
  "保持证件有效期，简历里的项目成果尽量写数字（产量、合格率、带教人数）": "証明書の有効期限を維持し、履歴書のプロジェクト成果はできるだけ数字で書く（生産量、合格率、指導人数）",
  "面试准备清单": "面接準備チェックリスト",
  "怎么提高匹配度": "マッチ度を高める方法",
  "正在加载候选人…": "候補者を読み込み中…",
  "暂无岗位": "求人なし",
  "选择岗位": "求人を選択",
  "匹配分析": "マッチ分析",
  "全部分析": "すべて分析",
  "看 AI 分析演示": "AI分析デモを見る",
  "看 AI 演示": "AIデモを見る",
  "收藏夹": "お気に入り",
  "评分规则": "評価ルール",
  "搜索姓名 / 工种 / 技能，如：张伟、注塑、质检": "氏名 / 職種 / スキルで検索、例：張偉、射出成形、品質検査",
  "清空筛选": "フィルターをクリア",
  "经验": "経験",
  "3 年以上": "3年以上",
  "5 年以上": "5年以上",
  "8 年以上": "8年以上",
  "10 年以上": "10年以上",
  "持证": "資格保有",
  "仅门槛通过": "基準合格のみ",
  "有健康证": "健康証明書あり",
  "有驻外经历": "海外駐在経験あり",
  "仅已投递": "応募済みのみ",
  "15 天内": "15日以内",
  "30 天内": "30日以内",
  "60 天内": "60日以内",
  "期望薪资": "希望給与",
  "15K 以下": "15K以下",
  "25K 以上": "25K以上",
  "学历": "学歴",
  "中专及以上": "中等専門学校以上",
  "大专及以上": "短大・専門学校以上",
  "本科及以上": "大学卒以上",
  "排序": "並び替え",
  "综合排序": "総合順",
  "经验优先": "経験優先",
  "到岗优先": "着任優先",
  "按姓名": "氏名順",
  "仅显示已投递简历的候选人": "履歴書を応募済みの候補者のみ表示",
  "仅显示人才库中未投递的候选人（可主动邀约）": "人材プール内の未応募候補者のみ表示（主動的に招待可能）",
  " 位候选人": " 名の候補者",
  "已投递 ": "応募済み ",
  " 位 · 证件通过 ": " 名 · 書類審査通過 ",
  " 位 · 当前显示 ": " 名 · 現在表示 ",
  "勾选候选人后点「匹配分析」即可获得匹配分与排名": "候補者を選択して「マッチング分析」をクリックすると、マッチングスコアとランキングが表示されます",
  "待确认": "確認待ち",
  "期望": "希望",
  "面议": "応相談",
  "证件": "書類",
  "待补": "要補充",
  "齐全": "完備",
  "部分": "一部",
  " · 关键条件": " · 主要条件",
  "到岗时间": "着任時期",
  "工作年限": "実務年数",
  "护照": "パスポート",
  "有效": "有効",
  "健康证": "健康証明書",
  "已备": "準備済み",
  "缺失": "未取得",
  "驻外经历": "海外駐在経験",
  "无技能缺口": "スキルギャップなし",
  "暂无风险提示": "リスク警告なし",
  "点击查看完整简历": "クリックして履歴書全文を表示",
  "已投递": "応募済み",
  "人才库": "人材プール",
  "勾选后可批量匹配分析": "チェックすると一括マッチング分析が可能",
  "查看详情": "詳細を見る",
  "邀面试": "面接に招待",
  "解释失败": "説明に失敗しました",
  "AI 解释": "AI 説明",
  "上一页": "前のページ",
  " 页 · 共 ": " ページ · 全 ",
  "下一页": "次のページ",
  "面试": "面接",
  "已录用": "採用済み",
  "需求": "要件",
  "计算中…": "計算中…",
  "加载失败：": "読み込みに失敗しました：",
  "排名已重算": "ランキングが再計算されました",
  " 位上升": " 位上昇",
  " 位下降": "位低下",
  "本次无排名变化": "今回ランキングの変動はありません",
  "已选 ": "選択済み ",
  "匹配分析这 ": "マッチング分析対象 ",
  "取消选择": "選択を解除",
  "分析将逐个播放推理过程": "分析は推論プロセスを順に再生します",
  "无法分析": "分析できません",
  "当前没有可分析的候选人": "現在分析可能な候補者がいません",
  "演示未加载": "デモが読み込まれていません",
  "请刷新页面后重试": "ページを更新してから再試行してください",
  "当前筛选结果为空": "現在の絞り込み結果は空です",
  "将对当前筛选出的 ": "現在絞り込まれた ",
  " 位候选人逐个分析": " 名の候補者を一人ずつ分析します",
  "取消收藏": "お気に入りを解除",
  "收藏夹是空的。在候选人卡片上点「收藏」后会出现在这里。": "お気に入りは空です。候補者カードの「お気に入り」をクリックするとここに表示されます。",
  "候选人收藏夹": "候補者お気に入り",
  "关闭": "閉じる",
  "重新计算中…": "再計算中…",
  "失败：": "失敗：",
  "返回分析结果": "分析結果に戻る",
  "技能验证": "スキル検証",
  "薪资/动机": "給与/動機",
  "判断薪资能否谈拢、动机是否真实": "給与が折り合うか、動機が本物かを見極める",
  "稳定性": "安定性",
  "为什么想去海外？家人支持长期外派吗？": "なぜ海外に行きたいのですか？家族は長期海外派遣を支持していますか？",
  "外派动机与家庭支持": "海外派遣の動機と家族の支持",
  "合规": "コンプライアンス",
  "护照、健康证、无犯罪公证什么时候能备齐？": "パスポート、健康証明書、無犯罪証明の公証はいつ揃いますか？",
  "确认出境材料时间是否赶得上": "出国書類の時期に間に合うか確認",
  "语言": "言語",
  "现场需要看懂英文设备手册，你实际用过吗？": "現場では英語の設備マニュアルを読む必要がありますが、実際に使ったことはありますか？",
  "语言能否支撑上岗": "言語が業務に耐えられるか",
  "经验核实": "経験の確認",
  "你之前做的是注塑，这次是玻璃压机，工艺差别你怎么补？": "以前は射出成形をしていましたが、今回はガラスプレス機です。工程の違いをどう補いますか？",
  "看学习与迁移能力": "学習能力と応用力を見る",
  "确认到岗节奏": "着任時期の確認",
  "动因": "動機",
  "为什么选这个国家、这个岗位？": "なぜこの国、この職種を選んだのですか？",
  "判断选择是否想清楚": "選択が十分に考え抜かれたものかを判断する",
  "落地": "実行に移す",
  "入职前三个月，你希望达成什么？": "入社後3か月で何を達成したいですか？",
  "看目标感与计划性": "目標意識と計画性を見る",
  "考察点：": "評価ポイント：",
  "面试提问建议": "面接での質問提案",
  " 条 · 按缺口与风险生成": " 件 · 不足とリスクに基づいて生成",
  "考察重点分布": "評価重点の分布",
  "分数按各分项满分归一化": "スコアは各項目の満点で正規化"
});
  Object.assign(DICT.ar, {
  "实时": "في الوقت الفعلي",
  " 条提醒": " تنبيهات",
  "收起": "طي",
  "分档 · 人": "فئة · شخص",
  "营收与毛利率": "الإيرادات وهامش الربح الإجمالي",
  "结算单口径 · 万元": "أساس كشف التسوية · 10 آلاف يوان",
  "应收账龄": "أعمار الذمم المدينة",
  "按应收到期日": "حسب تاريخ استحقاق الذمم المدينة",
  "岗位健康度": "صحة الوظائف",
  "点击查看岗位": "انقر لعرض الوظائف",
  "待办": "المهام المعلقة",
  "暂无岗位数据": "لا توجد بيانات وظائف حالياً",
  "展开全部 ": "توسيع الكل ",
  "展开": "توسيع",
  "已跳转：": "تم الانتقال:",
  "加载中…": "جارٍ التحميل…",
  "接口未就绪，请重启后端后重试": "الواجهة البرمجية غير جاهزة، يرجى إعادة تشغيل الخادم الخلفي والمحاولة مرة أخرى",
  "暂无时间戳": "لا يوجد طابع زمني",
  "暂无数据": "لا توجد بيانات",
  "全部": "الكل",
  "近 90 天": "آخر 90 يوماً",
  "近 30 天": "آخر 30 يوماً",
  "加载岗位…": "جارٍ تحميل الوظائف…",
  "刷新": "تحديث",
  "数据来源：投递 / 面试邀约 / 录用通知（实时）": "مصدر البيانات: التقديمات / دعوات المقابلة / عروض العمل (في الوقت الفعلي)",
  "投递": "تقديم",
  "岗位收到的简历": "السير الذاتية المستلمة للوظيفة",
  "面试邀约": "دعوة المقابلة",
  "已安排面试": "تم ترتيب المقابلة",
  "面试通过": "اجتياز المقابلة",
  "待定 ": "قيد الانتظار",
  "Offer": "عرض العمل",
  "待接受 ": "بانتظار القبول",
  "到岗": "الالتحاق بالعمل",
  "接受 offer": "قبول عرض العمل",
  "通过": "ناجح",
  "未通过": "غير ناجح",
  "已接受": "مقبول",
  "已拒绝": "مرفوض",
  "待接受": "بانتظار القبول",
  "投递明细": "تفاصيل التقديم",
  "面试记录 · 可回写结果": "سجل المقابلات · يمكن إعادة كتابة النتيجة",
  "面试通过名单": "قائمة الناجحين في المقابلة",
  "Offer 明细": "تفاصيل عرض العمل",
  "已到岗名单": "قائمة الملتحقين بالعمل",
  "阶段明细": "تفاصيل المرحلة",
  "候选人": "المرشحون",
  "投递时间": "وقت التقديم",
  "来源": "المصدر",
  "状态": "الحالة",
  "该时间段没有投递": "لا توجد تقديمات في هذه الفترة الزمنية",
  "发出时间": "وقت الإرسال",
  "薪资": "الراتب",
  "该时间段没有 Offer": "لا توجد عروض عمل في هذه الفترة الزمنية",
  "面试时间": "وقت المقابلة",
  "结果": "النتيجة",
  "回写结果": "نتيجة إعادة الكتابة",
  "还没有面试记录，去「投递管理」邀面试": "لا توجد سجلات مقابلات بعد، انتقل إلى «إدارة التقديمات» لدعوة للمقابلة",
  "点上面的漏斗可以切换阶段": "انقر على القمع أعلاه لتبديل المرحلة",
  "这个岗位还没有招聘数据": "لا توجد بيانات توظيف لهذه الوظيفة بعد",
  "招聘漏斗": "قمع التوظيف",
  "点某一段看名单": "انقر على قسم لعرض القائمة",
  "环节转化率": "معدل التحويل بين المراحل",
  "越靠后越要盯": "كلما تأخرت المرحلة زادت أهمية المتابعة",
  "投递趋势": "اتجاه التقديمات",
  "近 6 个月": "آخر 6 أشهر",
  "阶段平均耗时": "متوسط مدة المرحلة",
  "有真实时间戳才计算": "يُحسب فقط عند وجود طوابع زمنية حقيقية",
  "岗位横向对比": "المقارنة الأفقية بين الوظائف",
  "X=到岗转化 · Y=面试通过率 · 气泡=投递量 · 黄点=当前岗位": "X=التحويل إلى الالتحاق · Y=معدل اجتياز المقابلة · الفقاعة=حجم التقديمات · النقطة الصفراء=الوظيفة الحالية",
  "其他岗位": "وظائف أخرى",
  "当前岗位": "الوظيفة الحالية",
  "投递来源": "مصدر التقديمات",
  "按投递渠道": "حسب قناة التقديم",
  "面试未通过原因 Top5": "أهم 5 أسباب لعدم اجتياز المقابلة",
  "点击“未通过”时可填写": "يمكن التعبئة عند النقر على «لم يجتز»",
  "口径：投递＝人才库/应聘者档案里的投递记录；面试＝邀约记录；通过/未通过＝回写结果；Offer/到岗＝录用通知状态。时间范围按对应记录的创建时间筛选。": "المعايير: التقديم = سجلات التقديم في بنك المواهب/ملفات المتقدمين؛ المقابلة = سجلات الدعوات؛ الاجتياز/عدم الاجتياز = نتيجة إعادة الكتابة؛ العرض/الالتحاق = حالة إشعار التوظيف. يُصفّى النطاق الزمني حسب وقت إنشاء السجلات المقابلة.",
  "已回写": "تمت إعادة الكتابة",
  "面试结果：": "نتيجة المقابلة:",
  "回写失败": "فشلت إعادة الكتابة",
  "请选择岗位": "يرجى اختيار الوظيفة",
  "加载失败，请刷新重试": "فشل التحميل، يرجى التحديث والمحاولة مرة أخرى",
  " 个岗位": " وظيفة",
  "列表": "القائمة",
  "卡片": "بطاقة",
  "缺口": "فجوة",
  "推荐": "توصية",
  "毛利": "الربح الإجمالي",
  "岗位": "وظيفة",
  "国家": "الدولة",
  "已推荐": "تمت التوصية",
  "填补天数": "أيام الشغل",
  "毛利率": "هامش الربح الإجمالي",
  " · 毛利率 ": " · هامش الربح الإجمالي ",
  "关闭（列表铺满）": "إغلاق (القائمة ممتلئة)",
  "供给漏斗": "قمع العرض",
  "阶段耗时": "الوقت المستغرق في المرحلة",
  "成本与收益": "التكلفة والعائد",
  "渠道费用": "رسوم القناة",
  "单人成本": "تكلفة الفرد",
  "客户报价": "عرض السعر للعميل",
  " 元/月": " ريال/شهر",
  "单毛利": "الربح الإجمالي للفرد",
  "风险与失败原因": "المخاطر وأسباب الفشل",
  "关闭岗位": "إغلاق الوظيفة",
  "加急推荐": "توصية عاجلة",
  "已提交关闭申请：": "تم تقديم طلب الإغلاق:",
  "已加急：": "تم التعجيل:",
  "（优先推送 3 天）": "(إرسال ذو أولوية لمدة 3 أيام)",
  "项目列表": "قائمة المشاريع",
  "岗位生意账": "حساب عمل الوظيفة",
  "连接后端…": "جارٍ الاتصال بالخادم الخلفي…",
  "云端函数": "الدوال السحابية",
  "本地服务": "الخدمة المحلية",
  "规则引擎": "محرك القواعد",
  "后端未连接": "الخادم الخلفي غير متصل",
  "准备 2 个能证明动手能力的案例：什么设备、怎么调参数、产量/合格率变化": "جهّز حالتين تُثبتان قدرتك العملية: ما المعدات، وكيف ضبطت المعلمات، وتغيّر الإنتاج/معدل المطابقة",
  "准备一段能说明你适应长期外派的经历（出差、驻场、异地工作都算）": "جهّز تجربة تُظهر تكيّفك مع الإعارة طويلة الأمد (رحلات العمل أو العمل الميداني أو العمل في مكان آخر تُحتسب جميعها)",
  "核对护照有效期、健康证、无犯罪公证，扫描件提前备好": "تحقق من صلاحية جواز السفر وشهادة الصحة وتصديق عدم وجود سجل جنائي، وجهّز النسخ الممسوحة مسبقًا",
  "准备一段英文自我介绍，熟悉设备手册里的常用词": "جهّز مقدمة تعريفية بالإنجليزية، وأتقن المصطلحات الشائعة في دليل المعدات",
  "把简历里与岗位最相关的 2 段经历按「背景-做法-结果」讲清楚": "اشرح في سيرتك الذاتية الخبرتين الأكثر صلة بالوظيفة وفق «الخلفية - الأسلوب - النتيجة»",
  "准备 3 个问 HR 的问题：班次、住宿、签证进度、合同期": "جهّز 3 أسئلة لموظف الموارد البشرية: الورديات، السكن، تقدم التأشيرة، مدة العقد",
  "补齐岗位要求的证书，先把已持有的证书扫描件放进档案": "استكمل الشهادات المطلوبة للوظيفة، وضع النسخ الممسوحة للشهادات التي تحملها في ملفك أولًا",
  "把期望薪资调到岗位区间内，或注明可接受的范围": "اضبط الراتب المتوقع ضمن نطاق الوظيفة، أو حدّد النطاق المقبول",
  "提前准备离职与出境材料，把到岗时间往前挪": "جهّز مواد الاستقالة والمغادرة مسبقًا، وقدّم موعد الالتحاق بالعمل",
  "保持证件有效期，简历里的项目成果尽量写数字（产量、合格率、带教人数）": "حافظ على صلاحية الوثائق، واكتب إنجازات المشاريع في سيرتك الذاتية بالأرقام قدر الإمكان (الإنتاج، معدل المطابقة، عدد المتدربين)",
  "面试准备清单": "قائمة التحضير للمقابلة",
  "怎么提高匹配度": "كيف ترفع درجة التوافق",
  "正在加载候选人…": "جارٍ تحميل المرشحين…",
  "暂无岗位": "لا توجد وظائف حاليًا",
  "选择岗位": "اختر الوظيفة",
  "匹配分析": "تحليل التوافق",
  "全部分析": "تحليل الكل",
  "看 AI 分析演示": "شاهد عرض تحليل الذكاء الاصطناعي",
  "看 AI 演示": "شاهد عرض الذكاء الاصطناعي",
  "收藏夹": "المفضلة",
  "评分规则": "قواعد التقييم",
  "搜索姓名 / 工种 / 技能，如：张伟、注塑、质检": "ابحث بالاسم / المهنة / المهارة، مثل: تشانغ وي، الحقن، مراقبة الجودة",
  "清空筛选": "مسح التصفية",
  "经验": "الخبرة",
  "3 年以上": "أكثر من 3 سنوات",
  "5 年以上": "أكثر من 5 سنوات",
  "8 年以上": "أكثر من 8 سنوات",
  "10 年以上": "أكثر من 10 سنوات",
  "条件": "الشروط",
  "持证": "حاصل على شهادة",
  "仅门槛通过": "اجتياز الحد الأدنى فقط",
  "有健康证": "لديه شهادة صحية",
  "有驻外经历": "لديه خبرة عمل بالخارج",
  "仅已投递": "المتقدمون فقط",
  "15 天内": "خلال 15 يومًا",
  "30 天内": "خلال 30 يومًا",
  "60 天内": "خلال 60 يومًا",
  "期望薪资": "الراتب المتوقع",
  "15K 以下": "أقل من 15K",
  "25K 以上": "أكثر من 25K",
  "学历": "المؤهل الدراسي",
  "中专及以上": "المدرسة الثانوية المهنية فما فوق",
  "大专及以上": "دبلوم جامعي فما فوق",
  "本科及以上": "بكالوريوس فما فوق",
  "排序": "الترتيب",
  "综合排序": "ترتيب شامل",
  "经验优先": "الخبرة أولاً",
  "到岗优先": "الالتحاق أولاً",
  "按姓名": "حسب الاسم",
  "仅显示已投递简历的候选人": "عرض المرشحين الذين قدموا سيرهم الذاتية فقط",
  "仅显示人才库中未投递的候选人（可主动邀约）": "عرض المرشحين في بنك المواهب الذين لم يتقدموا فقط (يمكن دعوتهم)",
  " 位候选人": " مرشح",
  "已投递 ": "تم التقديم ",
  " 位 · 证件通过 ": " · الوثائق مقبولة ",
  " 位 · 当前显示 ": " · المعروض حالياً ",
  "勾选候选人后点「匹配分析」即可获得匹配分与排名": "حدد المرشحين ثم اضغط «تحليل المطابقة» للحصول على درجة المطابقة والترتيب",
  " 年 · ": " سنة · ",
  "待确认": "بانتظار التأكيد",
  "期望": "متوقع",
  "面议": "قابل للتفاوض",
  "证件": "الوثائق",
  "待补": "بانتظار الاستكمال",
  "齐全": "مكتملة",
  "部分": "جزئية",
  " · 关键条件": " · الشروط الأساسية",
  "到岗时间": "موعد الالتحاق",
  "工作年限": "سنوات الخبرة",
  "护照": "جواز السفر",
  "有效": "ساري",
  "健康证": "الشهادة الصحية",
  "已备": "متوفرة",
  "缺失": "مفقودة",
  "驻外经历": "خبرة العمل بالخارج",
  "无技能缺口": "لا توجد فجوات مهارية",
  "暂无风险提示": "لا توجد تنبيهات مخاطر حالياً",
  "点击查看完整简历": "انقر لعرض السيرة الذاتية الكاملة",
  "已投递": "تم التقديم",
  "人才库": "بنك المواهب",
  "勾选后可批量匹配分析": "حدد للمطابقة والتحليل الجماعي",
  "查看详情": "عرض التفاصيل",
  "邀面试": "دعوة للمقابلة",
  "分析中…": "جارٍ التحليل…",
  "解释失败": "فشل التفسير",
  "AI 解释": "تفسير AI",
  "上一页": "الصفحة السابقة",
  " 页 · 共 ": " صفحة · الإجمالي ",
  "下一页": "الصفحة التالية",
  "面试": "مقابلة",
  "已录用": "تم التوظيف",
  "需求": "الطلب",
  "计算中…": "جارٍ الحساب…",
  "加载失败：": "فشل التحميل:",
  "排名已重算": "تم إعادة حساب الترتيب",
  " 位上升": " مركز صعوداً",
  " 位下降": " مركز هبوطاً",
  "本次无排名变化": "لا تغيير في الترتيب هذه المرة",
  "已选 ": "تم اختيار ",
  "匹配分析这 ": "تحليل المطابقة لهؤلاء ",
  "取消选择": "إلغاء الاختيار",
  "分析将逐个播放推理过程": "سيتم عرض عملية الاستدلال تحليلاً تلو الآخر",
  "无法分析": "تعذر التحليل",
  "当前没有可分析的候选人": "لا يوجد حاليًا مرشحون قابلون للتحليل",
  "演示未加载": "لم يتم تحميل العرض التوضيحي",
  "请刷新页面后重试": "يرجى تحديث الصفحة والمحاولة مرة أخرى",
  "当前筛选结果为空": "نتيجة التصفية الحالية فارغة",
  "将对当前筛选出的 ": "سيتم تحليل ",
  " 位候选人逐个分析": " مرشحًا من نتائج التصفية الحالية واحدًا تلو الآخر",
  "取消收藏": "إلغاء الحفظ",
  "收藏夹是空的。在候选人卡片上点「收藏」后会出现在这里。": "المفضلة فارغة. ستظهر هنا بعد النقر على «حفظ» في بطاقة المرشح.",
  "候选人收藏夹": "مفضلة المرشحين",
  "关闭": "إغلاق",
  "重新计算中…": "جارٍ إعادة الحساب…",
  "失败：": "فشل: ",
  "返回分析结果": "العودة إلى نتائج التحليل",
  "技能验证": "التحقق من المهارات",
  "薪资/动机": "الراتب/الدافع",
  "判断薪资能否谈拢、动机是否真实": "تحديد ما إذا كان الراتب قابلًا للتفاوض وما إذا كان الدافع حقيقيًا",
  "稳定性": "الاستقرار",
  "为什么想去海外？家人支持长期外派吗？": "لماذا تريد الذهاب إلى الخارج؟ هل تدعم عائلتك الإعارة طويلة الأمد؟",
  "外派动机与家庭支持": "دافع الإعارة والدعم العائلي",
  "合规": "الامتثال",
  "护照、健康证、无犯罪公证什么时候能备齐？": "متى يمكن تجهيز جواز السفر والشهادة الصحية وتصديق عدم وجود سجل جنائي؟",
  "确认出境材料时间是否赶得上": "التأكد من إمكانية تجهيز مستندات المغادرة في الوقت المناسب",
  "语言": "اللغة",
  "现场需要看懂英文设备手册，你实际用过吗？": "تحتاج في الموقع إلى فهم أدلة المعدات بالإنجليزية، هل استخدمتها فعليًا؟",
  "语言能否支撑上岗": "هل اللغة كافية لأداء العمل",
  "经验核实": "التحقق من الخبرة",
  "你之前做的是注塑，这次是玻璃压机，工艺差别你怎么补？": "كنت تعمل سابقًا في الحقن، وهذه المرة آلة ضغط الزجاج، كيف ستعوّض الفرق في العملية؟",
  "看学习与迁移能力": "تقييم القدرة على التعلم والنقل المعرفي",
  "确认到岗节奏": "تأكيد وتيرة الالتحاق بالعمل",
  "动因": "الدافع",
  "为什么选这个国家、这个岗位？": "لماذا اخترت هذا البلد وهذا المنصب؟",
  "判断选择是否想清楚": "تقييم مدى وضوح التفكير في الاختيار",
  "落地": "التنفيذ على أرض الواقع",
  "入职前三个月，你希望达成什么？": "ما الذي تأمل في تحقيقه خلال الأشهر الثلاثة الأولى بعد الالتحاق بالعمل؟",
  "看目标感与计划性": "تقييم حس الهدف والتخطيط",
  "考察点：": "نقاط التقييم:",
  "面试提问建议": "اقتراحات أسئلة المقابلة",
  " 条 · 按缺口与风险生成": " بند · يُولَّد وفق الفجوات والمخاطر",
  "考察重点分布": "توزيع نقاط التقييم الرئيسية",
  "分数按各分项满分归一化": "تُطبَّع الدرجات وفق الدرجة الكاملة لكل بند"
});
  Object.assign(DICT.fr, {
  "实时": "Temps réel",
  " 条提醒": " notifications",
  "收起": "Réduire",
  "分档 · 人": "Par tranche · personnes",
  "营收与毛利率": "Chiffre d'affaires et marge brute",
  "结算单口径 · 万元": "Base relevé de règlement · 10 000 CNY",
  "应收账龄": "Ancienneté des créances",
  "按应收到期日": "Par date d'échéance des créances",
  "岗位健康度": "Santé des postes",
  "点击查看岗位": "Cliquez pour voir le poste",
  "待办": "À faire",
  "暂无岗位数据": "Aucune donnée de poste pour le moment",
  "展开全部 ": "Tout développer ",
  "展开": "Développer",
  "已跳转：": "Redirigé vers : ",
  "加载中…": "Chargement…",
  "接口未就绪，请重启后端后重试": "Interface non prête, veuillez redémarrer le backend et réessayer",
  "暂无时间戳": "Aucun horodatage",
  "暂无数据": "Aucune donnée",
  "全部": "Tous",
  "近 90 天": "90 derniers jours",
  "近 30 天": "30 derniers jours",
  "加载岗位…": "Chargement des postes…",
  "刷新": "Actualiser",
  "数据来源：投递 / 面试邀约 / 录用通知（实时）": "Source des données : candidatures / invitations à un entretien / offres d'embauche (temps réel)",
  "投递": "Candidatures",
  "岗位收到的简历": "CV reçus pour le poste",
  "面试邀约": "Invitation à un entretien",
  "已安排面试": "Entretien planifié",
  "面试通过": "Entretien réussi",
  "待定 ": "En attente",
  "Offer": "Offre",
  "待接受 ": "En attente d'acceptation",
  "到岗": "Prise de poste",
  "接受 offer": "Offre acceptée",
  "通过": "Réussi",
  "未通过": "Non réussi",
  "已接受": "Acceptée",
  "已拒绝": "Refusée",
  "待接受": "En attente d'acceptation",
  "投递明细": "Détails des candidatures",
  "面试记录 · 可回写结果": "Historique des entretiens · Résultat modifiable",
  "面试通过名单": "Liste des entretiens réussis",
  "Offer 明细": "Détails des offres",
  "已到岗名单": "Liste des personnes en poste",
  "阶段明细": "Détails par étape",
  "候选人": "Candidats",
  "投递时间": "Date de candidature",
  "来源": "Source",
  "状态": "Statut",
  "该时间段没有投递": "Aucune candidature pour cette période",
  "发出时间": "Date d'envoi",
  "薪资": "Salaire",
  "该时间段没有 Offer": "Aucune offre pour cette période",
  "面试时间": "Date de l'entretien",
  "结果": "Résultat",
  "回写结果": "Résultat de la réécriture",
  "还没有面试记录，去「投递管理」邀面试": "Aucun enregistrement d'entretien pour l'instant, allez dans « Gestion des candidatures » pour inviter à un entretien",
  "点上面的漏斗可以切换阶段": "Cliquez sur l'entonnoir ci-dessus pour changer d'étape",
  "这个岗位还没有招聘数据": "Ce poste n'a pas encore de données de recrutement",
  "招聘漏斗": "Entonnoir de recrutement",
  "点某一段看名单": "Cliquez sur un segment pour voir la liste",
  "环节转化率": "Taux de conversion par étape",
  "越靠后越要盯": "Plus on avance, plus il faut surveiller",
  "投递趋势": "Tendance des candidatures",
  "近 6 个月": "6 derniers mois",
  "阶段平均耗时": "Durée moyenne par étape",
  "有真实时间戳才计算": "Calculé uniquement avec des horodatages réels",
  "岗位横向对比": "Comparaison horizontale des postes",
  "X=到岗转化 · Y=面试通过率 · 气泡=投递量 · 黄点=当前岗位": "X=conversion à l'embauche · Y=taux de réussite aux entretiens · bulle=volume de candidatures · point jaune=poste actuel",
  "其他岗位": "Autres postes",
  "当前岗位": "Poste actuel",
  "投递来源": "Source des candidatures",
  "按投递渠道": "Par canal de candidature",
  "面试未通过原因 Top5": "Top 5 des motifs d'échec aux entretiens",
  "点击“未通过”时可填写": "Remplissable en cliquant sur « Échec »",
  "口径：投递＝人才库/应聘者档案里的投递记录；面试＝邀约记录；通过/未通过＝回写结果；Offer/到岗＝录用通知状态。时间范围按对应记录的创建时间筛选。": "Définition : candidature = enregistrement de candidature dans la banque de talents/dossier de candidat ; entretien = enregistrement d'invitation ; réussi/échoué = résultat de la réécriture ; Offre/embauche = statut de la lettre d'embauche. La plage temporelle est filtrée selon la date de création des enregistrements correspondants.",
  "已回写": "Réécrit",
  "面试结果：": "Résultat de l'entretien :",
  "回写失败": "Échec de la réécriture",
  "请选择岗位": "Veuillez sélectionner un poste",
  "加载失败，请刷新重试": "Échec du chargement, veuillez actualiser et réessayer",
  " 个岗位": " postes",
  "列表": "Liste",
  "卡片": "Carte",
  "缺口": "Écart",
  "推荐": "Recommandation",
  "毛利": "Marge brute",
  "岗位": "Poste",
  "国家": "Pays",
  "已推荐": "Recommandé",
  "填补天数": "Jours de pourvoi",
  "毛利率": "Taux de marge brute",
  " · 毛利率 ": " · Taux de marge brute ",
  "关闭（列表铺满）": "Fermer (liste complète)",
  "供给漏斗": "Entonnoir d'approvisionnement",
  "阶段耗时": "Durée des phases",
  "成本与收益": "Coûts et bénéfices",
  "渠道费用": "Frais de canal",
  "单人成本": "Coût par personne",
  "客户报价": "Devis client",
  " 元/月": " CNY/mois",
  "单毛利": "Marge brute unitaire",
  "风险与失败原因": "Risques et causes d'échec",
  "关闭岗位": "Fermer le poste",
  "加急推荐": "Recommandation urgente",
  "已提交关闭申请：": "Demande de fermeture soumise : ",
  "已加急：": "Urgent : ",
  "（优先推送 3 天）": "(envoi prioritaire 3 jours)",
  "项目列表": "Liste des projets",
  "岗位生意账": "Compte d'exploitation du poste",
  "连接后端…": "Connexion au backend…",
  "云端函数": "Fonctions cloud",
  "本地服务": "Service local",
  "规则引擎": "Moteur de règles",
  "后端未连接": "Backend non connecté",
  "准备 2 个能证明动手能力的案例：什么设备、怎么调参数、产量/合格率变化": "Préparez 2 cas démontrant votre capacité pratique : quel équipement, comment régler les paramètres, évolution de la production/taux de conformité",
  "准备一段能说明你适应长期外派的经历（出差、驻场、异地工作都算）": "Préparez une expérience montrant votre adaptation aux affectations longue durée (déplacements, missions sur site, travail hors région comptent)",
  "核对护照有效期、健康证、无犯罪公证，扫描件提前备好": "Vérifiez la validité du passeport, le certificat de santé, le casier judiciaire notarié, préparez les scans à l'avance",
  "准备一段英文自我介绍，熟悉设备手册里的常用词": "Préparez une présentation en anglais et familiarisez-vous avec les termes courants des manuels d'équipement",
  "把简历里与岗位最相关的 2 段经历按「背景-做法-结果」讲清楚": "Présentez clairement les 2 expériences du CV les plus pertinentes pour le poste selon le schéma « contexte - démarche - résultat »",
  "准备 3 个问 HR 的问题：班次、住宿、签证进度、合同期": "Préparez 3 questions à poser aux RH : horaires, logement, avancement du visa, durée du contrat",
  "补齐岗位要求的证书，先把已持有的证书扫描件放进档案": "Complétez les certificats exigés par le poste, placez d'abord les scans des certificats déjà obtenus dans le dossier",
  "把期望薪资调到岗位区间内，或注明可接受的范围": "Ajustez le salaire souhaité dans la fourchette du poste, ou indiquez une fourchette acceptable",
  "提前准备离职与出境材料，把到岗时间往前挪": "Préparez à l'avance les documents de démission et de départ, avancez la date de prise de poste",
  "保持证件有效期，简历里的项目成果尽量写数字（产量、合格率、带教人数）": "Maintenez la validité des documents, chiffrez autant que possible les résultats de projets dans le CV (production, taux de conformité, nombre de personnes formées)",
  "面试准备清单": "Liste de préparation à l'entretien",
  "怎么提高匹配度": "Comment améliorer la correspondance",
  "正在加载候选人…": "Chargement des candidats…",
  "暂无岗位": "Aucun poste disponible",
  "选择岗位": "Sélectionner un poste",
  "匹配分析": "Analyse de correspondance",
  "全部分析": "Tout analyser",
  "看 AI 分析演示": "Voir la démo d'analyse IA",
  "看 AI 演示": "Voir la démo IA",
  "收藏夹": "Favoris",
  "评分规则": "Règles de notation",
  "搜索姓名 / 工种 / 技能，如：张伟、注塑、质检": "Rechercher nom / métier / compétence, ex. : Zhang Wei, injection plastique, contrôle qualité",
  "清空筛选": "Effacer les filtres",
  "经验": "Expérience",
  "3 年以上": "Plus de 3 ans",
  "5 年以上": "Plus de 5 ans",
  "8 年以上": "Plus de 8 ans",
  "10 年以上": "Plus de 10 ans",
  "条件": "Conditions",
  "持证": "Certifié",
  "仅门槛通过": "Seuil minimal atteint uniquement",
  "有健康证": "Certificat de santé en cours de validité",
  "有驻外经历": "Expérience à l'étranger",
  "仅已投递": "Candidatures envoyées uniquement",
  "15 天内": "Sous 15 jours",
  "30 天内": "Sous 30 jours",
  "60 天内": "Sous 60 jours",
  "期望薪资": "Salaire souhaité",
  "15K 以下": "Moins de 15K",
  "25K 以上": "Plus de 25K",
  "学历": "Niveau d'études",
  "中专及以上": "Diplôme d'études secondaires professionnelles ou supérieur",
  "大专及以上": "Diplôme d'études supérieures courtes ou supérieur",
  "本科及以上": "Licence ou supérieur",
  "排序": "Tri",
  "综合排序": "Tri global",
  "经验优先": "Expérience en priorité",
  "到岗优先": "Disponibilité en priorité",
  "按姓名": "Par nom",
  "仅显示已投递简历的候选人": "Afficher uniquement les candidats ayant envoyé leur CV",
  "仅显示人才库中未投递的候选人（可主动邀约）": "Afficher uniquement les candidats du vivier n'ayant pas postulé (invitation possible)",
  " 位候选人": " candidats",
  "已投递 ": "Candidatures envoyées ",
  " 位 · 证件通过 ": " · Documents validés ",
  " 位 · 当前显示 ": " · Affichage actuel ",
  "勾选候选人后点「匹配分析」即可获得匹配分与排名": "Sélectionnez des candidats puis cliquez sur « Analyse de correspondance » pour obtenir le score de correspondance et le classement",
  " 年 · ": " ans · ",
  "待确认": "À confirmer",
  "期望": "Souhaité",
  "面议": "À négocier",
  "证件": "Documents",
  "待补": "À compléter",
  "齐全": "Complets",
  "部分": "Partiels",
  " · 关键条件": " · Conditions clés",
  "到岗时间": "Date de prise de poste",
  "工作年限": "Années d'expérience",
  "护照": "Passeport",
  "有效": "Valide",
  "健康证": "Certificat de santé",
  "已备": "Prêt",
  "缺失": "Manquant",
  "驻外经历": "Expérience à l'étranger",
  "无技能缺口": "Aucune lacune de compétences",
  "暂无风险提示": "Aucune alerte de risque pour le moment",
  "点击查看完整简历": "Cliquez pour voir le CV complet",
  "已投递": "Candidature envoyée",
  "人才库": "Vivier de talents",
  "勾选后可批量匹配分析": "Cochez pour lancer l'analyse de correspondance par lot",
  "查看详情": "Voir les détails",
  "邀面试": "Inviter à un entretien",
  "分析中…": "Analyse en cours…",
  "解释失败": "Échec de l'explication",
  "AI 解释": "Explication IA",
  "上一页": "Page précédente",
  " 页 · 共 ": " page · sur ",
  "下一页": "Page suivante",
  "面试": "Entretien",
  "已录用": "Embauché",
  "需求": "Besoins",
  "计算中…": "Calcul en cours…",
  "加载失败：": "Échec du chargement : ",
  "排名已重算": "Classement recalculé",
  " 位上升": " places en hausse",
  " 位下降": " places en baisse",
  "本次无排名变化": "Aucun changement de classement cette fois-ci",
  "已选 ": "Sélectionné : ",
  "匹配分析这 ": "Analyser la correspondance de ces ",
  "取消选择": "Annuler la sélection",
  "分析将逐个播放推理过程": "L'analyse diffusera le raisonnement étape par étape",
  "无法分析": "Analyse impossible",
  "当前没有可分析的候选人": "Aucun candidat à analyser pour le moment",
  "演示未加载": "Démo non chargée",
  "请刷新页面后重试": "Veuillez actualiser la page et réessayer",
  "当前筛选结果为空": "Le résultat de filtrage actuel est vide",
  "将对当前筛选出的 ": "Les ",
  " 位候选人逐个分析": " candidats actuellement filtrés seront analysés un par un",
  "取消收藏": "Retirer des favoris",
  "收藏夹是空的。在候选人卡片上点「收藏」后会出现在这里。": "Le dossier de favoris est vide. Cliquez sur « Favori » sur la carte du candidat pour qu'il apparaisse ici.",
  "候选人收藏夹": "Favoris candidats",
  "关闭": "Fermer",
  "重新计算中…": "Recalcul en cours…",
  "失败：": "Échec : ",
  "返回分析结果": "Retour aux résultats d'analyse",
  "技能验证": "Vérification des compétences",
  "薪资/动机": "Salaire/Motivation",
  "判断薪资能否谈拢、动机是否真实": "Déterminer si le salaire est négociable et si la motivation est réelle",
  "稳定性": "Stabilité",
  "为什么想去海外？家人支持长期外派吗？": "Pourquoi vouloir aller à l'étranger ? La famille soutient-elle une expatriation à long terme ?",
  "外派动机与家庭支持": "Motivation d'expatriation et soutien familial",
  "合规": "Conformité",
  "护照、健康证、无犯罪公证什么时候能备齐？": "Quand le passeport, le certificat médical et l'attestation de casier judiciaire pourront-ils être prêts ?",
  "确认出境材料时间是否赶得上": "Vérifier si les documents de sortie du territoire seront prêts à temps",
  "语言": "Langue",
  "现场需要看懂英文设备手册，你实际用过吗？": "Sur site, il faut comprendre les manuels d'équipement en anglais, les avez-vous réellement utilisés ?",
  "语言能否支撑上岗": "La langue permet-elle de prendre le poste ?",
  "经验核实": "Vérification de l'expérience",
  "你之前做的是注塑，这次是玻璃压机，工艺差别你怎么补？": "Vous faisiez de l'injection plastique avant, cette fois c'est une presse à verre, comment comblez-vous la différence de procédé ?",
  "看学习与迁移能力": "Évaluer la capacité d'apprentissage et de transfert",
  "确认到岗节奏": "Confirmer le rythme de prise de poste",
  "动因": "Motif",
  "为什么选这个国家、这个岗位？": "Pourquoi ce pays et ce poste ?",
  "判断选择是否想清楚": "Évaluer si le choix est réfléchi",
  "落地": "Mise en œuvre",
  "入职前三个月，你希望达成什么？": "Quels objectifs souhaitez-vous atteindre durant les trois premiers mois après votre prise de poste ?",
  "看目标感与计划性": "Évaluer le sens des objectifs et la planification",
  "考察点：": "Points d'évaluation :",
  "面试提问建议": "Suggestions de questions d'entretien",
  " 条 · 按缺口与风险生成": " éléments · générés selon les lacunes et les risques",
  "考察重点分布": "Répartition des points d'évaluation clés",
  "分数按各分项满分归一化": "Les scores sont normalisés selon le total de chaque sous-item"
});

  /* L() 英文兜底文案词典 */
  Object.assign(DICT.th, {
  "Live": "สด",
  " alerts": "การแจ้งเตือน",
  "Collapse": "ยุบ",
  "people": "คน",
  "bucket · people": "กลุ่ม · คน",
  "Revenue & margin": "รายได้และอัตรากำไร",
  "settlement basis · CNY 10k": "เกณฑ์การชำระ · หมื่นหยวน",
  "Receivables aging": "อายุลูกหนี้",
  "by due date": "ตามวันครบกำหนด",
  "Role health": "สุขภาพบทบาท",
  "click to view role": "คลิกเพื่อดูบทบาท",
  " days": " วัน",
  "No job data": "ไม่มีข้อมูลงาน",
  "Show all ": "แสดงทั้งหมด ",
  "Expand": "ขยาย",
  "Jumped to: ": "ข้ามไปที่: ",
  "Loading…": "กำลังโหลด…",
  "API not ready, restart backend and retry": "API ยังไม่พร้อม กรุณารีสตาร์ทแบ็กเอนด์แล้วลองใหม่",
  "no timestamps": "ไม่มีเวลาestamp",
  "no data": "ไม่มีข้อมูล",
  "All": "ทั้งหมด",
  "Loading jobs…": "กำลังโหลดงาน…",
  "Refresh": "รีเฟรช",
  "Source: applications / interviews / offers (live)": "แหล่งที่มา: ใบสมัคร / สัมภาษณ์ / ข้อเสนอ (สด)",
  "Applied": "สมัครแล้ว",
  "applications received": "ใบสมัครที่ได้รับ",
  "Invited": "เชิญแล้ว",
  "interviews scheduled": "นัดสัมภาษณ์แล้ว",
  "Passed": "ผ่าน",
  "pending ": "รอดำเนินการ",
  "Offer": "ข้อเสนอ",
  "Onboarded": "เข้าทำงานแล้ว",
  "accepted offers": "ข้อเสนอที่ตอบรับแล้ว",
  "Failed": "ไม่ผ่าน",
  "Accepted": "ตอบรับแล้ว",
  "Declined": "ปฏิเสธแล้ว",
  "Pending": "รอดำเนินการ",
  "Applications": "ใบสมัคร",
  "Interviews · write back": "การสัมภาษณ์ · ตอบกลับ",
  "Passed candidates": "ผู้สมัครที่ผ่าน",
  "Offers": "ข้อเสนอ",
  "Stage detail": "รายละเอียดขั้นตอน",
  "Candidate": "ผู้สมัคร",
  "Applied at": "สมัครเมื่อ",
  "Source": "แหล่งที่มา",
  "Status": "สถานะ",
  "No applications in this range": "ไม่มีใบสมัครในช่วงนี้",
  "Sent at": "ส่งเมื่อ",
  "Salary": "เงินเดือน",
  "No offers in this range": "ไม่มีข้อเสนอในช่วงนี้",
  "Interview": "การสัมภาษณ์",
  "Result": "ผลลัพธ์",
  "Set result": "ตั้งค่าผลลัพธ์",
  "Pass": "ผ่าน",
  "Fail": "ไม่ผ่าน",
  "No interviews yet": "ยังไม่มีการสัมภาษณ์",
  "click a funnel step to switch": "คลิกขั้นตอนในกรวยเพื่อสลับ",
  "No recruiting data for this job yet": "ยังไม่มีข้อมูลการสรรหาสำหรับงานนี้",
  "Recruiting funnel": "กรวยการสรรหา",
  "click a step": "คลิกขั้นตอน",
  "Conversion": "อัตราการแปลง",
  "watch the tail": "ดูส่วนท้าย",
  "last 6 months": "6 เดือนล่าสุด",
  "Average stage duration": "ระยะเวลาเฉลี่ยแต่ละขั้น",
  "needs real timestamps": "ต้องใช้เวลาจริง",
  "Job comparison": "เปรียบเทียบงาน",
  "X = applied→onboarded · Y = interview pass · bubble = applications": "X = สมัคร→เข้าทำงาน · Y = ผ่านการสัมภาษณ์ · ฟอง = จำนวนใบสมัคร",
  "Other jobs": "งานอื่น",
  "Current job": "งานปัจจุบัน",
  "Application sources": "แหล่งที่มาของใบสมัคร",
  "by channel": "ตามช่องทาง",
  "Rejection reasons": "เหตุผลที่ไม่ผ่าน",
  "set when marking fail": "ตั้งค่าเมื่อทำเครื่องหมายว่าไม่ผ่าน",
  "Definitions: applied = application records; invited = interview invitations; passed/failed = written-back results; offer/onboarded = offer statuses. Time range filters by each record\\'s created time.": "คำจำกัดความ: สมัคร = บันทึกใบสมัคร; เชิญ = คำเชิญสัมภาษณ์; ผ่าน/ไม่ผ่าน = ผลลัพธ์ที่เขียนกลับ; เสนองาน/เข้าทำงาน = สถานะข้อเสนอ ช่วงเวลากรองตามเวลาที่สร้างของแต่ละบันทึก",
  "Saved": "บันทึกแล้ว",
  "Result: ": "ผลลัพธ์: ",
  "Save failed": "บันทึกไม่สำเร็จ",
  "Pick a job": "เลือกงาน",
  "Load failed, please refresh": "โหลดไม่สำเร็จ กรุณารีเฟรช",
  "Total ": "ทั้งหมด ",
  " jobs": " งาน",
  "List": "รายการ",
  "Cards": "การ์ด",
  "Openings": "ตำแหน่งที่เปิดรับ",
  "Referred": "แนะนำ",
  "Margin": "มาร์จิ้น",
  "Role": "บทบาท",
  "Country": "ประเทศ",
  "Days to fill": "จำนวนวันในการปิดตำแหน่ง",
  " · Margin ": " · มาร์จิ้น ",
  "Close (full list)": "ปิด (รายการเต็ม)",
  "Supply funnel": "ช่องทางจัดหา",
  "Stage duration": "ระยะเวลาแต่ละขั้น",
  "Cost & revenue": "ต้นทุนและรายได้",
  "Channel cost": "ต้นทุนช่องทาง",
  "Cost per hire": "ต้นทุนต่อการจ้าง",
  "Client price": "ราคาที่เรียกเก็บจากลูกค้า",
  " CNY/mo": " CNY/เดือน",
  "Gross profit": "กำไรขั้นต้น",
  "Risks & failure reasons": "ความเสี่ยงและสาเหตุความล้มเหลว",
  "Close role": "ปิดตำแหน่ง",
  "Urgent refer": "แนะนำเร่งด่วน",
  "Close request submitted: ": "ส่งคำขอปิดแล้ว: ",
  "Marked urgent: ": "ทำเครื่องหมายเร่งด่วน: ",
  " (pushed 3 days first)": " (เลื่อนขึ้น 3 วันก่อน)",
  "Projects": "โปรเจกต์",
  "Role P&L": "กำไรขาดทุนของตำแหน่ง",
  "Connecting…": "กำลังเชื่อมต่อ…",
  "Cloud function": "ฟังก์ชันคลาวด์",
  "Local service": "บริการภายในเครื่อง",
  "Rules engine": "ระบบกฎ",
  "Backend offline": "แบ็กเอนด์ออฟไลน์",
  "Prepare 2 hands-on cases: which machine, how you tuned it, output/quality results": "เตรียมกรณีศึกษาจริง 2 กรณี: ใช้เครื่องไหน ปรับแต่งอย่างไร ผลลัพธ์ด้านผลผลิต/คุณภาพเป็นอย่างไร",
  "Prepare one story showing you adapt to long assignments (travel, site work, relocation)": "เตรียมเรื่องราวหนึ่งเรื่องที่แสดงให้เห็นว่าคุณปรับตัวเข้ากับงานระยะยาวได้ (การเดินทาง งานหน้างาน การย้ายที่อยู่)",
  "Check passport validity, health certificate and police clearance; keep scans ready": "ตรวจสอบอายุหนังสือเดินทาง ใบรับรองสุขภาพ และใบรับรองประวัติอาชญากรรม เตรียมสำเนาให้พร้อม",
  "Prepare a short English self-intro and learn common manual terms": "เตรียมแนะนำตัวสั้นๆ เป็นภาษาอังกฤษ และเรียนรู้คำศัพท์งานฝีมือที่ใช้บ่อย",
  "Be ready to tell your 2 most relevant experiences as situation-action-result": "เตรียมเล่าประสบการณ์ที่เกี่ยวข้องที่สุด 2 อย่างในรูปแบบ สถานการณ์-การกระทำ-ผลลัพธ์",
  "Prepare 3 questions for HR: shifts, housing, visa progress, contract term": "เตรียมคำถาม 3 ข้อสำหรับฝ่ายบุคคล: กะการทำงาน ที่พัก ความคืบหน้าวีซ่า ระยะเวลาสัญญา",
  "Complete the required certificates and upload scans of the ones you hold": "ทำใบรับรองที่จำเป็นให้ครบ และอัปโหลดสำเนาใบรับรองที่คุณมี",
  "Align your expected salary with the job range, or state an acceptable range": "ปรับเงินเดือนที่คาดหวังให้สอดคล้องกับช่วงของงาน หรือระบุช่วงที่ยอมรับได้",
  "Prepare resignation and travel documents earlier to shorten your availability": "เตรียมเอกสารลาออกและเอกสารเดินทางล่วงหน้าเพื่อลดระยะเวลาที่พร้อมเริ่มงาน",
  "Keep documents valid; quantify results in your resume": "ดูแลเอกสารให้ยังใช้ได้ และระบุผลลัพธ์เป็นตัวเลขในเรซูเม่",
  "Interview checklist": "รายการตรวจสอบก่อนสัมภาษณ์",
  "How to improve your match": "วิธีเพิ่มความเหมาะสมของคุณ",
  "Loading candidates…": "กำลังโหลดผู้สมัคร…",
  "No jobs yet": "ยังไม่มีงาน",
  "Select job": "เลือกงาน",
  "Match analysis": "การวิเคราะห์ความเหมาะสม",
  "Analyze all": "วิเคราะห์ทั้งหมด",
  "Watch AI analysis demo": "ดูตัวอย่างการวิเคราะห์ด้วย AI",
  "Watch AI demo": "ดูตัวอย่าง AI",
  "Scoring rules": "กฎการให้คะแนน",
  "Search name / trade / skills": "ค้นหาชื่อ / อาชีพ / ทักษะ",
  "Clear filters": "ล้างตัวกรอง",
  "Experience": "ประสบการณ์",
  "3+ yrs": "3 ปีขึ้นไป",
  "5+ yrs": "5 ปีขึ้นไป",
  "8+ yrs": "8 ปีขึ้นไป",
  "10+ yrs": "10 ปีขึ้นไป",
  "Conditions": "เงื่อนไข",
  "Certified": "มีใบรับรอง",
  "Passed threshold": "ผ่านเกณฑ์",
  "Health cert": "ใบรับรองสุขภาพ",
  "Overseas exp": "ต่างประเทศ",
  "Applied only": "เฉพาะที่สมัครแล้ว",
  "Start": "เริ่มงาน",
  "Within 15 days": "ภายใน 15 วัน",
  "Within 30 days": "ภายใน 30 วัน",
  "Within 60 days": "ภายใน 60 วัน",
  "Expected salary": "เงินเดือนที่คาดหวัง",
  "Under 15K": "ต่ำกว่า 15K",
  "Above 25K": "มากกว่า 25K",
  "Education": "การศึกษา",
  "Secondary+": "มัธยมศึกษาตอนปลาย+",
  "College+": "อนุปริญญา+",
  "Bachelor+": "ปริญญาตรี+",
  "Sort": "เรียงลำดับ",
  "Composite": "แบบผสม",
  "Experience first": "ประสบการณ์ก่อน",
  "Availability first": "ความพร้อมก่อน",
  "By name": "ตามชื่อ",
  "Only candidates who applied": "เฉพาะผู้สมัครที่สมัครแล้ว",
  "Talent-pool candidates who have not applied (proactive invite)": "ผู้สมัครใน Talent Pool ที่ยังไม่ได้สมัคร (เชิญเชิงรุก)",
  "Candidates": "ผู้สมัคร",
  " candidates": " ผู้สมัคร",
  "Applied ": "สมัครแล้ว ",
  " · Docs passed ": " · เอกสารผ่าน ",
  " · Showing ": " · กำลังแสดง ",
  "Select candidates and click Match analysis to get scores and ranking": "เลือกผู้สมัครแล้วคลิกวิเคราะห์การจับคู่เพื่อรับคะแนนและการจัดอันดับ",
  " yrs · ": " ปี · ",
  "TBC": "รอการยืนยัน",
  "Expected": "คาดหวัง",
  "Negotiable": "ต่อรองได้",
  "Docs": "เอกสาร",
  "Complete": "ครบถ้วน",
  "Partial": "บางส่วน",
  " · Key details": " · รายละเอียดสำคัญ",
  "Start date": "วันที่เริ่ม",
  " yrs": " ปี",
  "Passport": "หนังสือเดินทาง",
  "Valid": "ถูกต้อง",
  "Ready": "พร้อม",
  "Missing": "ขาดหาย",
  "Yes": "ใช่",
  "No skill gaps": "ไม่มีช่องว่างทักษะ",
  "No risk notes": "ไม่มีบันทึกความเสี่ยง",
  "Open full resume": "เปิดเรซูเม่ฉบับเต็ม",
  "Talent pool": "คลังบุคลากร",
  "Select for batch match analysis": "เลือกสำหรับการวิเคราะห์การจับคู่แบบกลุ่ม",
  "Details": "รายละเอียด",
  "Invite": "เชิญ",
  "Analyzing…": "กำลังวิเคราะห์…",
  "Explain failed": "อธิบายล้มเหลว",
  "AI explain": "AI อธิบาย",
  "Prev": "ก่อนหน้า",
  "Page ": "หน้า ",
  "Next": "ถัดไป",
  "Hired": "รับเข้าทำงานแล้ว",
  "Need": "ต้องการ",
  "Calculating…": "กำลังคำนวณ…",
  "Load failed: ": "โหลดล้มเหลว: ",
  "Ranking updated": "อัปเดตอันดับแล้ว",
  " down": " ลง",
  "No rank changes": "อันดับไม่เปลี่ยนแปลง",
  "Selected ": "เลือกแล้ว ",
  "Analyze these ": "วิเคราะห์รายการเหล่านี้ ",
  "Clear selection": "ล้างการเลือก",
  "Analysis runs one by one": "การวิเคราะห์จะทำทีละรายการ",
  "Cannot analyze": "ไม่สามารถวิเคราะห์ได้",
  "No candidates to analyze": "ไม่มีผู้สมัครให้วิเคราะห์",
  "Demo not loaded": "ยังไม่ได้โหลดเดโม",
  "Refresh and try again": "รีเฟรชแล้วลองอีกครั้ง",
  "No rows in current filter": "ไม่มีแถวในตัวกรองปัจจุบัน",
  "Will analyze ": "จะวิเคราะห์ ",
  " filtered candidates one by one": " ผู้สมัครที่ผ่านการกรองทีละรายการ",
  "Unsave": "ยกเลิกการบันทึก",
  "Saved list is empty. Star a candidate card to see it here.": "รายการที่บันทึกว่างเปล่า กดดาวที่การ์ดผู้สมัครเพื่อดูที่นี่",
  "Saved candidates": "ผู้สมัครที่บันทึกไว้",
  "Close": "ปิด",
  "Recalculating…": "กำลังคำนวณใหม่…",
  "Failed: ": "ล้มเหลว: ",
  "Back to analysis": "กลับไปที่การวิเคราะห์",
  "Skill check": "ตรวจสอบทักษะ",
  "Pay & motive": "ค่าตอบแทนและแรงจูงใจ",
  "Check salary fit and real motivation": "ตรวจสอบความเหมาะสมของเงินเดือนและแรงจูงใจที่แท้จริง",
  "Stability": "ความมั่นคง",
  "Why overseas? Does your family support a long assignment?": "ทำไมถึงไปต่างประเทศ? ครอบครัวสนับสนุนการไปปฏิบัติงานระยะยาวหรือไม่?",
  "Motivation and family support": "แรงจูงใจและการสนับสนุนจากครอบครัว",
  "Compliance": "การปฏิบัติตามข้อกำหนด",
  "When can passport, health certificate and police clearance be ready?": "หนังสือเดินทาง ใบรับรองสุขภาพ และใบรับรองประวัติอาชญากรรมจะพร้อมเมื่อใด?",
  "Check document timeline": "ตรวจสอบไทม์ไลน์เอกสาร",
  "Language": "ภาษา",
  "The site requires English manuals — have you used them?": "ไซต์งานต้องการคู่มือภาษาอังกฤษ — คุณเคยใช้คู่มือเหล่านี้หรือไม่?",
  "Check language readiness": "ตรวจสอบความพร้อมด้านภาษา",
  "You did injection molding; this is a glass press — how will you close the process gap?": "คุณเคยทำการฉีดขึ้นรูป แต่ที่นี่เป็นการอัดแก้ว — คุณจะปิดช่องว่างของกระบวนการอย่างไร?",
  "Check learning and transferability": "ตรวจสอบการเรียนรู้และความสามารถในการถ่ายทอด",
  "Availability": "ความพร้อม",
  "Confirm start timeline": "ยืนยันไทม์ไลน์การเริ่มงาน",
  "Motivation": "แรงจูงใจ",
  "Why this country and this role?": "ทำไมถึงเลือกประเทศนี้และตำแหน่งนี้?",
  "Check whether the choice is thought through": "ตรวจสอบว่าการตัดสินใจผ่านการคิดมาอย่างดีแล้วหรือไม่",
  "Plan": "แผน",
  "What do you want to achieve in the first three months?": "คุณต้องการบรรลุอะไรในสามเดือนแรก?",
  "Check goals and planning": "ตรวจสอบเป้าหมายและการวางแผน",
  "Look for: ": "มองหา: ",
  "Interview questions": "คำถามสัมภาษณ์",
  " from gaps & risks": " จากช่องว่างและความเสี่ยง",
  "Focus radar": "เรดาร์โฟกัส",
  "Normalized to each part maximum": "ปรับให้เป็นค่าสูงสุดของแต่ละส่วน",
  "查看主动投递简历的候选人，勾选后可匹配分析、邀面试、发 offer": "ดูผู้สมัครที่ส่งเรซูเม่เข้ามาเอง เมื่อติ๊กเลือกแล้วสามารถจับคู่วิเคราะห์ เชิญสัมภาษณ์ ส่งข้อเสนอได้",
  "候选人": "ผู้สมัคร",
  "天前": "วันที่แล้ว",
  "筛选": "กรอง",
  "筛选 ▾": "กรอง ▾",
  "中图标": "ไอคอนกลาง",
  "offer": "ข้อเสนอ",
  "days": "วัน",
  "Total": "ทั้งหมด",
  "candidates": "ผู้สมัคร",
  "Filters": "ตัวกรอง",
  "Medium": "ปานกลาง",
  "Demo session · viewing": "เซสชันสาธิต · กำลังดู"
});
  Object.assign(DICT.ja, {
  "Live": "ライブ",
  " alerts": "アラート",
  "Collapse": "折りたたむ",
  "people": "人",
  "bucket · people": "バケット · 人",
  "Revenue & margin": "収益と利益率",
  "settlement basis · CNY 10k": "決済ベース · 万元",
  "Receivables aging": "売掛金のエイジング",
  "by due date": "期日別",
  "Role health": "ロールの健全性",
  "click to view role": "クリックしてロールを表示",
  " days": " 日",
  "No job data": "ジョブデータなし",
  "Show all ": "すべて表示 ",
  "Expand": "展開",
  "Jumped to: ": "ジャンプ先: ",
  "Loading…": "読み込み中…",
  "API not ready, restart backend and retry": "APIが準備できていません。バックエンドを再起動して再試行してください",
  "no timestamps": "タイムスタンプなし",
  "no data": "データなし",
  "All": "すべて",
  "Loading jobs…": "ジョブを読み込み中…",
  "Refresh": "更新",
  "Source: applications / interviews / offers (live)": "ソース: 応募 / 面接 / オファー (ライブ)",
  "Applied": "応募済み",
  "applications received": "受付済み応募",
  "Invited": "招待済み",
  "interviews scheduled": "面接予定",
  "Passed": "合格",
  "pending ": "保留中",
  "Offer": "オファー",
  "Onboarded": "入社済み",
  "accepted offers": "承諾済みオファー",
  "Failed": "不合格",
  "Accepted": "承諾済み",
  "Declined": "辞退",
  "Pending": "保留中",
  "Applications": "応募",
  "Interviews · write back": "面接・書き戻し",
  "Passed candidates": "合格候補者",
  "Offers": "オファー",
  "Stage detail": "ステージ詳細",
  "Candidate": "候補者",
  "Applied at": "応募日時",
  "Source": "ソース",
  "Status": "ステータス",
  "No applications in this range": "この範囲に応募はありません",
  "Sent at": "送信日時",
  "Salary": "給与",
  "No offers in this range": "この範囲にオファーはありません",
  "Interview": "面接",
  "Result": "結果",
  "Set result": "結果を設定",
  "Pass": "合格",
  "Fail": "不合格",
  "No interviews yet": "面接はまだありません",
  "click a funnel step to switch": "ファネルのステップをクリックして切り替え",
  "No recruiting data for this job yet": "この求人の採用データはまだありません",
  "Recruiting funnel": "採用ファネル",
  "click a step": "ステップをクリック",
  "Conversion": "コンバージョン",
  "watch the tail": "テールを注視",
  "last 6 months": "過去6か月",
  "Average stage duration": "平均ステージ期間",
  "needs real timestamps": "実際のタイムスタンプが必要",
  "Job comparison": "求人比較",
  "X = applied→onboarded · Y = interview pass · bubble = applications": "X = 応募→入社 · Y = 面接合格 · バブル = 応募数",
  "Other jobs": "その他の求人",
  "Current job": "現在の求人",
  "Application sources": "応募経路",
  "by channel": "チャネル別",
  "Rejection reasons": "不採用理由",
  "set when marking fail": "不合格マーク時に設定",
  "Definitions: applied = application records; invited = interview invitations; passed/failed = written-back results; offer/onboarded = offer statuses. Time range filters by each record\\'s created time.": "定義：応募 = 応募レコード；招待 = 面接招待；合格/不合格 = 書き戻された結果；オファー/入社 = オファーステータス。期間は各レコードの作成時刻でフィルタリングされます。",
  "Saved": "保存済み",
  "Result: ": "結果：",
  "Save failed": "保存に失敗しました",
  "Pick a job": "求人を選択",
  "Load failed, please refresh": "読み込みに失敗しました。更新してください",
  "Total ": "合計 ",
  " jobs": " 件の求人",
  "List": "リスト",
  "Cards": "カード",
  "Openings": "募集枠",
  "Referred": "紹介",
  "Margin": "マージン",
  "Role": "職種",
  "Country": "国",
  "Days to fill": "充足までの日数",
  " · Margin ": " · マージン ",
  "Close (full list)": "クローズ（全リスト）",
  "Supply funnel": "供給ファネル",
  "Stage duration": "ステージ期間",
  "Cost & revenue": "コストと収益",
  "Channel cost": "チャネルコスト",
  "Cost per hire": "採用単価",
  "Client price": "クライアント価格",
  " CNY/mo": " CNY/月",
  "Gross profit": "粗利益",
  "Risks & failure reasons": "リスクと失敗理由",
  "Close role": "職種をクローズ",
  "Urgent refer": "緊急紹介",
  "Close request submitted: ": "クローズ申請提出済み: ",
  "Marked urgent: ": "緊急指定済み: ",
  " (pushed 3 days first)": "（3日間優先でプッシュ）",
  "Projects": "プロジェクト",
  "Role P&L": "職種別損益",
  "Connecting…": "接続中…",
  "Cloud function": "クラウド関数",
  "Local service": "ローカルサービス",
  "Rules engine": "ルールエンジン",
  "Backend offline": "バックエンドオフライン",
  "Prepare 2 hands-on cases: which machine, how you tuned it, output/quality results": "実践事例を2つ準備：どのマシン、どうチューニングしたか、出力/品質の結果",
  "Prepare one story showing you adapt to long assignments (travel, site work, relocation)": "長期派遣（出張、現場作業、転居）に適応できることを示すエピソードを1つ用意する",
  "Check passport validity, health certificate and police clearance; keep scans ready": "パスポートの有効期限、健康診断書、警察証明書を確認し、スキャンを準備しておく",
  "Prepare a short English self-intro and learn common manual terms": "簡単な英語の自己紹介を用意し、よく使う作業用語を覚える",
  "Be ready to tell your 2 most relevant experiences as situation-action-result": "最も関連する2つの経験を状況・行動・結果の形式で話せるようにする",
  "Prepare 3 questions for HR: shifts, housing, visa progress, contract term": "人事向けに3つの質問を用意する：シフト、住居、ビザの進捗、契約期間",
  "Complete the required certificates and upload scans of the ones you hold": "必要な証明書を取得し、保有している証明書のスキャンをアップロードする",
  "Align your expected salary with the job range, or state an acceptable range": "希望給与を求人の範囲に合わせるか、許容できる範囲を提示する",
  "Prepare resignation and travel documents earlier to shorten your availability": "退職手続きと渡航書類を早めに準備し、就業可能時期を早める",
  "Keep documents valid; quantify results in your resume": "書類の有効期限を切らさない。履歴書では成果を数値化する",
  "Interview checklist": "面接チェックリスト",
  "How to improve your match": "マッチ度を高める方法",
  "Loading candidates…": "候補者を読み込み中…",
  "No jobs yet": "求人はまだありません",
  "Select job": "求人を選択",
  "Match analysis": "マッチ分析",
  "Analyze all": "すべて分析",
  "Watch AI analysis demo": "AI分析デモを見る",
  "Watch AI demo": "AIデモを見る",
  "Scoring rules": "スコアリングルール",
  "Search name / trade / skills": "名前・職種・スキルで検索",
  "Clear filters": "フィルターをクリア",
  "Experience": "経験",
  "3+ yrs": "3年以上",
  "5+ yrs": "5年以上",
  "8+ yrs": "8年以上",
  "10+ yrs": "10年以上",
  "Conditions": "条件",
  "Certified": "資格あり",
  "Passed threshold": "基準を通過",
  "Health cert": "健康診断書",
  "Overseas exp": "海外経験",
  "Applied only": "応募者のみ",
  "Start": "開始",
  "Within 15 days": "15日以内",
  "Within 30 days": "30日以内",
  "Within 60 days": "60日以内",
  "Expected salary": "希望給与",
  "Under 15K": "15K未満",
  "Above 25K": "25K以上",
  "Education": "学歴",
  "Secondary+": "中等教育以上",
  "College+": "短大以上",
  "Bachelor+": "学士以上",
  "Sort": "並び替え",
  "Composite": "総合",
  "Experience first": "経験優先",
  "Availability first": "着任時期優先",
  "By name": "名前順",
  "Only candidates who applied": "応募済みの候補者のみ",
  "Talent-pool candidates who have not applied (proactive invite)": "未応募のタレントプール候補者（積極的な招待）",
  "Candidates": "候補者",
  " candidates": " 名の候補者",
  "Applied ": "応募済み ",
  " · Docs passed ": " · 書類通過 ",
  " · Showing ": " · 表示中 ",
  "Select candidates and click Match analysis to get scores and ranking": "候補者を選択してマッチ分析をクリックすると、スコアとランキングが表示されます",
  " yrs · ": " 年 · ",
  "TBC": "未定",
  "Expected": "希望",
  "Negotiable": "応相談",
  "Docs": "書類",
  "Complete": "完了",
  "Partial": "一部",
  " · Key details": " · 主要な詳細",
  "Start date": "開始日",
  " yrs": " 年",
  "Passport": "パスポート",
  "Valid": "有効",
  "Ready": "準備完了",
  "Missing": "不足",
  "Yes": "はい",
  "No skill gaps": "スキルギャップなし",
  "No risk notes": "リスクメモなし",
  "Open full resume": "履歴書全文を開く",
  "Talent pool": "タレントプール",
  "Select for batch match analysis": "バッチマッチ分析のために選択",
  "Details": "詳細",
  "Invite": "招待",
  "Analyzing…": "分析中…",
  "Explain failed": "説明に失敗しました",
  "AI explain": "AI説明",
  "Prev": "前へ",
  "Page ": "ページ ",
  "Next": "次へ",
  "Hired": "採用済み",
  "Need": "必要",
  "Calculating…": "計算中…",
  "Load failed: ": "読み込みに失敗しました: ",
  "Ranking updated": "ランキング更新済み",
  " down": " ダウン",
  "No rank changes": "ランク変動なし",
  "Selected ": "選択済み ",
  "Analyze these ": "これらを分析 ",
  "Clear selection": "選択をクリア",
  "Analysis runs one by one": "分析は1件ずつ実行されます",
  "Cannot analyze": "分析できません",
  "No candidates to analyze": "分析対象の候補者がいません",
  "Demo not loaded": "デモが読み込まれていません",
  "Refresh and try again": "更新して再試行してください",
  "No rows in current filter": "現在のフィルターに行がありません",
  "Will analyze ": "分析します ",
  " filtered candidates one by one": " フィルター済み候補者を1件ずつ",
  "Unsave": "保存解除",
  "Saved list is empty. Star a candidate card to see it here.": "保存リストは空です。候補者カードにスターを付けるとここに表示されます。",
  "Saved candidates": "保存済み候補者",
  "Close": "閉じる",
  "Recalculating…": "再計算中…",
  "Failed: ": "失敗: ",
  "Back to analysis": "分析に戻る",
  "Skill check": "スキルチェック",
  "Pay & motive": "給与と意欲",
  "Check salary fit and real motivation": "給与の適合性と本当の意欲を確認",
  "Stability": "安定性",
  "Why overseas? Does your family support a long assignment?": "なぜ海外? 家族は長期赴任を支持していますか?",
  "Motivation and family support": "意欲と家族の支持",
  "Compliance": "コンプライアンス",
  "When can passport, health certificate and police clearance be ready?": "パスポート、健康診断書、警察証明はいつ準備できますか?",
  "Check document timeline": "書類のタイムラインを確認する",
  "Language": "言語",
  "The site requires English manuals — have you used them?": "この現場では英語のマニュアルが必要です — 使ったことはありますか？",
  "Check language readiness": "言語の準備状況を確認する",
  "You did injection molding; this is a glass press — how will you close the process gap?": "射出成形の経験がありますが、これはガラスプレスです — プロセスのギャップをどう埋めますか？",
  "Check learning and transferability": "学習と転用可能性を確認する",
  "Availability": "稼働可能時期",
  "Confirm start timeline": "開始時期を確認する",
  "Motivation": "志望動機",
  "Why this country and this role?": "なぜこの国で、なぜこの職種ですか？",
  "Check whether the choice is thought through": "選択が熟考されたものかを確認する",
  "Plan": "計画",
  "What do you want to achieve in the first three months?": "最初の3か月で何を達成したいですか？",
  "Check goals and planning": "目標と計画を確認する",
  "Look for: ": "注目すべき点：",
  "Interview questions": "面接質問",
  " from gaps & risks": "ギャップとリスクから",
  "Focus radar": "フォーカスレーダー",
  "Normalized to each part maximum": "各パートの最大値に正規化",
  "查看主动投递简历的候选人，勾选后可匹配分析、邀面试、发 offer": "自ら応募した候補者を確認し、チェックするとマッチング分析、面接招待、オファー送信が可能",
  "候选人": "候補者",
  "天前": "日前",
  "筛选": "絞り込み",
  "筛选 ▾": "絞り込み ▾",
  "中图标": "中アイコン",
  "offer": "オファー",
  "days": "日",
  "Total": "合計",
  "candidates": "候補者",
  "Filters": "フィルター",
  "Medium": "中",
  "Demo session · viewing": "デモセッション · 閲覧中"
});
  Object.assign(DICT.ar, {
  "Live": "مباشر",
  " alerts": "تنبيهات",
  "Collapse": "طي",
  "people": "أشخاص",
  "bucket · people": "فئة · أشخاص",
  "Revenue & margin": "الإيرادات والهامش",
  "settlement basis · CNY 10k": "أساس التسوية · 10 آلاف يوان صيني",
  "Receivables aging": "أعمار الذمم المدينة",
  "by due date": "حسب تاريخ الاستحقاق",
  "Role health": "سلامة الأدوار",
  "click to view role": "انقر لعرض الدور",
  " days": " أيام",
  "No job data": "لا توجد بيانات وظائف",
  "Show all ": "عرض الكل ",
  "Expand": "توسيع",
  "Jumped to: ": "تم الانتقال إلى: ",
  "Loading…": "جارٍ التحميل…",
  "API not ready, restart backend and retry": "واجهة API غير جاهزة، أعد تشغيل الخادم وحاول مجددًا",
  "no timestamps": "لا توجد طوابع زمنية",
  "no data": "لا توجد بيانات",
  "All": "الكل",
  "Loading jobs…": "جارٍ تحميل الوظائف…",
  "Refresh": "تحديث",
  "Source: applications / interviews / offers (live)": "المصدر: الطلبات / المقابلات / العروض (مباشر)",
  "Applied": "تم التقديم",
  "applications received": "الطلبات المستلمة",
  "Invited": "مدعو",
  "interviews scheduled": "المقابلات المجدولة",
  "Passed": "ناجح",
  "pending ": "قيد الانتظار",
  "Offer": "عرض",
  "Onboarded": "تم التوظيف",
  "accepted offers": "العروض المقبولة",
  "Failed": "راسب",
  "Accepted": "مقبول",
  "Declined": "مرفوض",
  "Pending": "قيد الانتظار",
  "Applications": "الطلبات",
  "Interviews · write back": "المقابلات · إعادة الكتابة",
  "Passed candidates": "المرشحون الناجحون",
  "Offers": "العروض",
  "Stage detail": "تفاصيل المرحلة",
  "Candidate": "المرشح",
  "Applied at": "تاريخ التقديم",
  "Source": "المصدر",
  "Status": "الحالة",
  "No applications in this range": "لا توجد طلبات في هذا النطاق",
  "Sent at": "تاريخ الإرسال",
  "Salary": "الراتب",
  "No offers in this range": "لا توجد عروض في هذا النطاق",
  "Interview": "المقابلة",
  "Result": "النتيجة",
  "Set result": "تعيين النتيجة",
  "Pass": "نجاح",
  "Fail": "رسوب",
  "No interviews yet": "لا توجد مقابلات بعد",
  "click a funnel step to switch": "انقر على خطوة في القمع للتبديل",
  "No recruiting data for this job yet": "لا توجد بيانات توظيف لهذه الوظيفة بعد",
  "Recruiting funnel": "قمع التوظيف",
  "click a step": "انقر على خطوة",
  "Conversion": "التحويل",
  "watch the tail": "راقب الذيل",
  "last 6 months": "آخر 6 أشهر",
  "Average stage duration": "متوسط مدة المرحلة",
  "needs real timestamps": "يتطلب طوابع زمنية حقيقية",
  "Job comparison": "مقارنة الوظائف",
  "X = applied→onboarded · Y = interview pass · bubble = applications": "X = من التقديم إلى الانضمام · Y = اجتياز المقابلة · الفقاعة = الطلبات",
  "Other jobs": "وظائف أخرى",
  "Current job": "الوظيفة الحالية",
  "Application sources": "مصادر الطلبات",
  "by channel": "حسب القناة",
  "Rejection reasons": "أسباب الرفض",
  "set when marking fail": "يُحدد عند وضع علامة الفشل",
  "Definitions: applied = application records; invited = interview invitations; passed/failed = written-back results; offer/onboarded = offer statuses. Time range filters by each record\\'s created time.": "التعريفات: applied = سجلات الطلبات؛ invited = دعوات المقابلات؛ passed/failed = النتائج المكتوبة؛ offer/onboarded = حالات العرض. يُصفّي النطاق الزمني حسب وقت إنشاء كل سجل.",
  "Saved": "تم الحفظ",
  "Result: ": "النتيجة: ",
  "Save failed": "فشل الحفظ",
  "Pick a job": "اختر وظيفة",
  "Load failed, please refresh": "فشل التحميل، يرجى التحديث",
  "Total ": "الإجمالي ",
  " jobs": " وظائف",
  "List": "قائمة",
  "Cards": "بطاقات",
  "Openings": "الوظائف الشاغرة",
  "Referred": "تمت الإحالة",
  "Margin": "الهامش",
  "Role": "الدور",
  "Country": "البلد",
  "Days to fill": "أيام لملء الوظيفة",
  " · Margin ": " · الهامش ",
  "Close (full list)": "إغلاق (القائمة الكاملة)",
  "Supply funnel": "قمع التوريد",
  "Stage duration": "مدة المرحلة",
  "Cost & revenue": "التكلفة والإيرادات",
  "Channel cost": "تكلفة القناة",
  "Cost per hire": "التكلفة لكل تعيين",
  "Client price": "سعر العميل",
  " CNY/mo": " CNY/شهر",
  "Gross profit": "إجمالي الربح",
  "Risks & failure reasons": "المخاطر وأسباب الفشل",
  "Close role": "إغلاق الدور",
  "Urgent refer": "إحالة عاجلة",
  "Close request submitted: ": "تم تقديم طلب الإغلاق: ",
  "Marked urgent: ": "تم وضع علامة عاجل: ",
  " (pushed 3 days first)": " (تم التقديم 3 أيام أولاً)",
  "Projects": "المشاريع",
  "Role P&L": "الأرباح والخسائر للدور",
  "Connecting…": "جارٍ الاتصال…",
  "Cloud function": "وظيفة سحابية",
  "Local service": "خدمة محلية",
  "Rules engine": "محرك القواعد",
  "Backend offline": "الخادم الخلفي غير متصل",
  "Prepare 2 hands-on cases: which machine, how you tuned it, output/quality results": "جهّز حالتين عمليتين: أي آلة، وكيف قمت بضبطها، ونتائج الإخراج/الجودة",
  "Prepare one story showing you adapt to long assignments (travel, site work, relocation)": "جهّز قصة واحدة تُظهر تكيّفك مع المهام الطويلة (السفر، العمل الميداني، الانتقال)",
  "Check passport validity, health certificate and police clearance; keep scans ready": "تحقق من صلاحية جواز السفر والشهادة الصحية وشهادة عدم المحكومية؛ واحتفظ بالنسخ الممسوحة ضوئيًا جاهزة",
  "Prepare a short English self-intro and learn common manual terms": "جهّز تقديمًا ذاتيًا قصيرًا بالإنجليزية وتعلّم المصطلحات اليدوية الشائعة",
  "Be ready to tell your 2 most relevant experiences as situation-action-result": "كن مستعدًا لسرد خبرتك الأكثر صلة بأسلوب الموقف-الإجراء-النتيجة",
  "Prepare 3 questions for HR: shifts, housing, visa progress, contract term": "جهّز 3 أسئلة لقسم الموارد البشرية: الورديات، السكن، تقدم التأشيرة، مدة العقد",
  "Complete the required certificates and upload scans of the ones you hold": "أكمل الشهادات المطلوبة وارفع نسخًا ممسوحة ضوئيًا للشهادات التي تحملها",
  "Align your expected salary with the job range, or state an acceptable range": "طابق راتبك المتوقع مع نطاق الوظيفة، أو حدد نطاقًا مقبولًا",
  "Prepare resignation and travel documents earlier to shorten your availability": "جهّز وثائق الاستقالة والسفر مبكرًا لتقصير مدة جاهزيتك",
  "Keep documents valid; quantify results in your resume": "حافظ على صلاحية الوثائق؛ وكمّم النتائج في سيرتك الذاتية",
  "Interview checklist": "قائمة التحقق للمقابلة",
  "How to improve your match": "كيف تحسّن مطابقتك",
  "Loading candidates…": "جارٍ تحميل المرشحين…",
  "No jobs yet": "لا توجد وظائف بعد",
  "Select job": "اختر الوظيفة",
  "Match analysis": "تحليل المطابقة",
  "Analyze all": "تحليل الكل",
  "Watch AI analysis demo": "شاهد عرض تحليل الذكاء الاصطناعي",
  "Watch AI demo": "شاهد عرض الذكاء الاصطناعي",
  "Scoring rules": "قواعد التقييم",
  "Search name / trade / skills": "ابحث بالاسم / المهنة / المهارات",
  "Clear filters": "مسح عوامل التصفية",
  "Experience": "الخبرة",
  "3+ yrs": "3+ سنوات",
  "5+ yrs": "5+ سنوات",
  "8+ yrs": "8+ سنوات",
  "10+ yrs": "10+ سنوات",
  "Conditions": "الشروط",
  "Certified": "معتمد",
  "Passed threshold": "اجتاز الحد الأدنى",
  "Health cert": "الشهادة الصحية",
  "Overseas exp": "خبرة خارجية",
  "Applied only": "المتقدمون فقط",
  "Start": "بدء",
  "Within 15 days": "خلال 15 يومًا",
  "Within 30 days": "خلال 30 يومًا",
  "Within 60 days": "خلال 60 يومًا",
  "Expected salary": "الراتب المتوقع",
  "Under 15K": "أقل من 15K",
  "Above 25K": "أكثر من 25K",
  "Education": "التعليم",
  "Secondary+": "ثانوي فأعلى",
  "College+": "كلية فأعلى",
  "Bachelor+": "بكالوريوس فأعلى",
  "Sort": "ترتيب",
  "Composite": "مركّب",
  "Experience first": "الخبرة أولاً",
  "Availability first": "التوفر أولاً",
  "By name": "حسب الاسم",
  "Only candidates who applied": "المرشحون الذين تقدموا فقط",
  "Talent-pool candidates who have not applied (proactive invite)": "مرشحو بنك المواهب الذين لم يتقدموا (دعوة استباقية)",
  "Candidates": "المرشحون",
  " candidates": " مرشح",
  "Applied ": "المتقدمون ",
  " · Docs passed ": " · المستندات المقبولة ",
  " · Showing ": " · عرض ",
  "Select candidates and click Match analysis to get scores and ranking": "حدد المرشحين وانقر على تحليل المطابقة للحصول على الدرجات والترتيب",
  " yrs · ": " سنة · ",
  "TBC": "يُحدد لاحقًا",
  "Expected": "متوقع",
  "Negotiable": "قابل للتفاوض",
  "Docs": "المستندات",
  "Complete": "مكتمل",
  "Partial": "جزئي",
  " · Key details": " · التفاصيل الرئيسية",
  "Start date": "تاريخ البدء",
  " yrs": " سنوات",
  "Passport": "جواز السفر",
  "Valid": "صالح",
  "Ready": "جاهز",
  "Missing": "مفقود",
  "Yes": "نعم",
  "No skill gaps": "لا توجد فجوات في المهارات",
  "No risk notes": "لا توجد ملاحظات مخاطر",
  "Open full resume": "فتح السيرة الذاتية الكاملة",
  "Talent pool": "مجمع المواهب",
  "Select for batch match analysis": "اختر لتحليل المطابقة الدفعي",
  "Details": "التفاصيل",
  "Invite": "دعوة",
  "Analyzing…": "جارٍ التحليل…",
  "Explain failed": "فشل الشرح",
  "AI explain": "شرح بالذكاء الاصطناعي",
  "Prev": "السابق",
  "Page ": "صفحة ",
  "Next": "التالي",
  "Hired": "تم التوظيف",
  "Need": "مطلوب",
  "Calculating…": "جارٍ الحساب…",
  "Load failed: ": "فشل التحميل: ",
  "Ranking updated": "تم تحديث الترتيب",
  " down": " انخفاض",
  "No rank changes": "لا تغيير في الترتيب",
  "Selected ": "تم اختيار ",
  "Analyze these ": "تحليل هؤلاء ",
  "Clear selection": "مسح التحديد",
  "Analysis runs one by one": "يتم التحليل واحداً تلو الآخر",
  "Cannot analyze": "لا يمكن التحليل",
  "No candidates to analyze": "لا يوجد مرشحون للتحليل",
  "Demo not loaded": "لم يتم تحميل العرض التجريبي",
  "Refresh and try again": "قم بالتحديث وحاول مرة أخرى",
  "No rows in current filter": "لا توجد صفوف في التصفية الحالية",
  "Will analyze ": "سيتم تحليل ",
  " filtered candidates one by one": " مرشحاً مفلتراً واحداً تلو الآخر",
  "Unsave": "إلغاء الحفظ",
  "Saved list is empty. Star a candidate card to see it here.": "قائمة المحفوظات فارغة. أضف نجمة إلى بطاقة مرشح لرؤيتها هنا.",
  "Saved candidates": "المرشحون المحفوظون",
  "Close": "إغلاق",
  "Recalculating…": "جارٍ إعادة الحساب…",
  "Failed: ": "فشل: ",
  "Back to analysis": "العودة إلى التحليل",
  "Skill check": "فحص المهارات",
  "Pay & motive": "الراتب والدافع",
  "Check salary fit and real motivation": "تحقق من ملاءمة الراتب والدافع الحقيقي",
  "Stability": "الاستقرار",
  "Why overseas? Does your family support a long assignment?": "لماذا الخارج؟ هل تدعم عائلتك مهمة طويلة الأمد؟",
  "Motivation and family support": "الدافع ودعم العائلة",
  "Compliance": "الامتثال",
  "When can passport, health certificate and police clearance be ready?": "متى يمكن تجهيز جواز السفر والشهادة الصحية وشهادة عدم المحكومية؟",
  "Check document timeline": "تحقق من الجدول الزمني للوثائق",
  "Language": "اللغة",
  "The site requires English manuals — have you used them?": "يتطلب الموقع أدلة باللغة الإنجليزية — هل استخدمتها؟",
  "Check language readiness": "تحقق من جاهزية اللغة",
  "You did injection molding; this is a glass press — how will you close the process gap?": "لقد عملت في القولبة بالحقن؛ هذه مكبس زجاج — كيف ستسد الفجوة في العملية؟",
  "Check learning and transferability": "تحقق من التعلم وقابلية النقل",
  "Availability": "التوفر",
  "Confirm start timeline": "تأكيد الجدول الزمني للبدء",
  "Motivation": "الدافع",
  "Why this country and this role?": "لماذا هذا البلد وهذا الدور؟",
  "Check whether the choice is thought through": "تحقق مما إذا كان الاختيار مدروسًا",
  "Plan": "الخطة",
  "What do you want to achieve in the first three months?": "ماذا تريد أن تحقق في الأشهر الثلاثة الأولى؟",
  "Check goals and planning": "تحقق من الأهداف والتخطيط",
  "Look for: ": "ابحث عن: ",
  "Interview questions": "أسئلة المقابلة",
  " from gaps & risks": " من الفجوات والمخاطر",
  "Focus radar": "رادار التركيز",
  "Normalized to each part maximum": "مُطبَّع إلى الحد الأقصى لكل جزء",
  "查看主动投递简历的候选人，勾选后可匹配分析、邀面试、发 offer": "عرض المرشحين الذين قدموا سيرهم الذاتية بشكل مباشر، بعد التحديد يمكن إجراء التحليل المطابق ودعوة للمقابلة وإرسال العرض",
  "候选人": "المرشح",
  "天前": "منذ أيام",
  "筛选": "تصفية",
  "筛选 ▾": "تصفية ▾",
  "中图标": "أيقونة متوسطة"
});
  Object.assign(DICT.fr, {
  "Live": "En direct",
  " alerts": " alertes",
  "Collapse": "Réduire",
  "people": "personnes",
  "bucket · people": "catégorie · personnes",
  "Revenue & margin": "Chiffre d'affaires et marge",
  "settlement basis · CNY 10k": "base de règlement · CNY 10k",
  "Receivables aging": "Vieillissement des créances",
  "by due date": "par date d'échéance",
  "Role health": "Santé du rôle",
  "click to view role": "cliquez pour voir le rôle",
  " days": " jours",
  "No job data": "Aucune donnée d'emploi",
  "Show all ": "Tout afficher ",
  "Expand": "Développer",
  "Jumped to: ": "Accès direct à : ",
  "Loading…": "Chargement…",
  "API not ready, restart backend and retry": "API non prête, redémarrez le backend et réessayez",
  "no timestamps": "aucun horodatage",
  "no data": "aucune donnée",
  "All": "Tous",
  "Loading jobs…": "Chargement des emplois…",
  "Refresh": "Actualiser",
  "Source: applications / interviews / offers (live)": "Source : candidatures / entretiens / offres (en direct)",
  "Applied": "Postulé",
  "applications received": "candidatures reçues",
  "Invited": "Invité",
  "interviews scheduled": "entretiens planifiés",
  "Passed": "Réussi",
  "pending ": "en attente",
  "Offer": "Offre",
  "Onboarded": "Intégré",
  "accepted offers": "offres acceptées",
  "Failed": "Échoué",
  "Accepted": "Accepté",
  "Declined": "Refusé",
  "Pending": "En attente",
  "Applications": "Candidatures",
  "Interviews · write back": "Entretiens · retour",
  "Passed candidates": "Candidats retenus",
  "Offers": "Offres",
  "Stage detail": "Détail de l'étape",
  "Candidate": "Candidat",
  "Applied at": "Postulé le",
  "Status": "Statut",
  "No applications in this range": "Aucune candidature dans cette période",
  "Sent at": "Envoyé le",
  "Salary": "Salaire",
  "No offers in this range": "Aucune offre dans cette période",
  "Interview": "Entretien",
  "Result": "Résultat",
  "Set result": "Définir le résultat",
  "Pass": "Réussir",
  "Fail": "Échouer",
  "No interviews yet": "Pas encore d'entretiens",
  "click a funnel step to switch": "cliquez sur une étape du funnel pour changer",
  "No recruiting data for this job yet": "Pas encore de données de recrutement pour ce poste",
  "Recruiting funnel": "Funnel de recrutement",
  "click a step": "cliquez sur une étape",
  "watch the tail": "surveiller la fin",
  "last 6 months": "6 derniers mois",
  "Average stage duration": "Durée moyenne par étape",
  "needs real timestamps": "nécessite des horodatages réels",
  "Job comparison": "Comparaison des postes",
  "X = applied→onboarded · Y = interview pass · bubble = applications": "X = candidature→intégration · Y = réussite à l'entretien · bulle = candidatures",
  "Other jobs": "Autres postes",
  "Current job": "Poste actuel",
  "Application sources": "Sources de candidatures",
  "by channel": "par canal",
  "Rejection reasons": "Motifs de rejet",
  "set when marking fail": "défini lors du marquage en échec",
  "Definitions: applied = application records; invited = interview invitations; passed/failed = written-back results; offer/onboarded = offer statuses. Time range filters by each record\\'s created time.": "Définitions : candidature = enregistrements de candidatures ; invité = invitations à un entretien ; réussi/échoué = résultats enregistrés ; offre/intégré = statuts d'offre. Le filtre de période s'applique à la date de création de chaque enregistrement.",
  "Saved": "Enregistré",
  "Result: ": "Résultat : ",
  "Save failed": "Échec de l'enregistrement",
  "Pick a job": "Choisir un poste",
  "Load failed, please refresh": "Échec du chargement, veuillez actualiser",
  " jobs": " postes",
  "List": "Liste",
  "Cards": "Cartes",
  "Openings": "Postes ouverts",
  "Referred": "Recommandé",
  "Margin": "Marge",
  "Role": "Rôle",
  "Country": "Pays",
  "Days to fill": "Jours pour pourvoir",
  " · Margin ": " · Marge ",
  "Close (full list)": "Clôturer (liste complète)",
  "Supply funnel": "Entonnoir d'approvisionnement",
  "Stage duration": "Durée de l'étape",
  "Cost & revenue": "Coûts et revenus",
  "Channel cost": "Coût du canal",
  "Cost per hire": "Coût par recrutement",
  "Client price": "Prix client",
  " CNY/mo": " CNY/mois",
  "Gross profit": "Marge brute",
  "Risks & failure reasons": "Risques et motifs d'échec",
  "Close role": "Clôturer le rôle",
  "Urgent refer": "Référence urgente",
  "Close request submitted: ": "Demande de clôture soumise : ",
  "Marked urgent: ": "Marqué urgent : ",
  " (pushed 3 days first)": " (avancé de 3 jours en priorité)",
  "Projects": "Projets",
  "Role P&L": "P&L du rôle",
  "Connecting…": "Connexion…",
  "Cloud function": "Fonction cloud",
  "Local service": "Service local",
  "Rules engine": "Moteur de règles",
  "Backend offline": "Backend hors ligne",
  "Prepare 2 hands-on cases: which machine, how you tuned it, output/quality results": "Préparez 2 cas pratiques : quelle machine, comment vous l'avez réglée, résultats de sortie/qualité",
  "Prepare one story showing you adapt to long assignments (travel, site work, relocation)": "Préparez une histoire montrant votre capacité à vous adapter à des missions longues (déplacements, travail sur site, relocalisation)",
  "Check passport validity, health certificate and police clearance; keep scans ready": "Vérifiez la validité du passeport, le certificat médical et le casier judiciaire ; gardez les scans prêts",
  "Prepare a short English self-intro and learn common manual terms": "Préparez une courte auto-présentation en anglais et apprenez les termes manuels courants",
  "Be ready to tell your 2 most relevant experiences as situation-action-result": "Soyez prêt à présenter vos 2 expériences les plus pertinentes selon le format situation-action-résultat",
  "Prepare 3 questions for HR: shifts, housing, visa progress, contract term": "Préparez 3 questions pour les RH : horaires, logement, avancement du visa, durée du contrat",
  "Complete the required certificates and upload scans of the ones you hold": "Obtenez les certificats requis et téléchargez les scans de ceux que vous possédez",
  "Align your expected salary with the job range, or state an acceptable range": "Alignez votre salaire attendu sur la fourchette du poste, ou indiquez une fourchette acceptable",
  "Prepare resignation and travel documents earlier to shorten your availability": "Préparez tôt votre démission et vos documents de voyage pour raccourcir votre disponibilité",
  "Keep documents valid; quantify results in your resume": "Maintenez vos documents valides ; quantifiez les résultats dans votre CV",
  "Interview checklist": "Liste de vérification pour l'entretien",
  "How to improve your match": "Comment améliorer votre correspondance",
  "Loading candidates…": "Chargement des candidats…",
  "No jobs yet": "Aucune offre pour le moment",
  "Select job": "Sélectionner une offre",
  "Match analysis": "Analyse de correspondance",
  "Analyze all": "Tout analyser",
  "Watch AI analysis demo": "Voir la démo d'analyse IA",
  "Watch AI demo": "Voir la démo IA",
  "Scoring rules": "Règles de notation",
  "Search name / trade / skills": "Rechercher nom / métier / compétences",
  "Clear filters": "Effacer les filtres",
  "Experience": "Expérience",
  "3+ yrs": "3+ ans",
  "5+ yrs": "5+ ans",
  "8+ yrs": "8+ ans",
  "10+ yrs": "10+ ans",
  "Certified": "Certifié",
  "Passed threshold": "Seuil atteint",
  "Health cert": "Certificat médical",
  "Overseas exp": "Expérience à l'étranger",
  "Applied only": "Candidatures uniquement",
  "Start": "Début",
  "Within 15 days": "Sous 15 jours",
  "Within 30 days": "Sous 30 jours",
  "Within 60 days": "Sous 60 jours",
  "Expected salary": "Salaire souhaité",
  "Under 15K": "Moins de 15K",
  "Above 25K": "Plus de 25K",
  "Education": "Niveau d'études",
  "Secondary+": "Secondaire+",
  "College+": "Collège+",
  "Bachelor+": "Licence+",
  "Sort": "Trier",
  "Experience first": "Expérience en priorité",
  "Availability first": "Disponibilité en priorité",
  "By name": "Par nom",
  "Only candidates who applied": "Uniquement les candidats ayant postulé",
  "Talent-pool candidates who have not applied (proactive invite)": "Candidats du vivier n'ayant pas postulé (invitation proactive)",
  "Candidates": "Candidats",
  " candidates": " candidats",
  "Applied ": "Candidatures ",
  " · Docs passed ": " · Documents validés ",
  " · Showing ": " · Affichage ",
  "Select candidates and click Match analysis to get scores and ranking": "Sélectionnez des candidats et cliquez sur Analyse de correspondance pour obtenir les scores et le classement",
  " yrs · ": " ans · ",
  "TBC": "À confirmer",
  "Expected": "Souhaité",
  "Negotiable": "Négociable",
  "Docs": "Documents",
  "Complete": "Complet",
  "Partial": "Partiel",
  " · Key details": " · Détails clés",
  "Start date": "Date de début",
  " yrs": " ans",
  "Passport": "Passeport",
  "Valid": "Valide",
  "Ready": "Prêt",
  "Missing": "Manquant",
  "Yes": "Oui",
  "No skill gaps": "Aucune lacune de compétences",
  "No risk notes": "Aucune note de risque",
  "Open full resume": "Ouvrir le CV complet",
  "Talent pool": "Vivier de talents",
  "Select for batch match analysis": "Sélectionner pour l'analyse de correspondance par lot",
  "Details": "Détails",
  "Invite": "Inviter",
  "Analyzing…": "Analyse en cours…",
  "Explain failed": "Échec de l'explication",
  "AI explain": "Explication IA",
  "Prev": "Préc.",
  "Next": "Suiv.",
  "Hired": "Embauché",
  "Need": "Besoin",
  "Calculating…": "Calcul en cours…",
  "Load failed: ": "Échec du chargement : ",
  "Ranking updated": "Classement mis à jour",
  " down": " en baisse",
  "No rank changes": "Aucun changement de rang",
  "Selected ": "Sélectionné ",
  "Analyze these ": "Analyser ces ",
  "Clear selection": "Effacer la sélection",
  "Analysis runs one by one": "L'analyse s'exécute une par une",
  "Cannot analyze": "Impossible d'analyser",
  "No candidates to analyze": "Aucun candidat à analyser",
  "Demo not loaded": "Démo non chargée",
  "Refresh and try again": "Actualisez et réessayez",
  "No rows in current filter": "Aucune ligne dans le filtre actuel",
  "Will analyze ": "Va analyser ",
  " filtered candidates one by one": " candidats filtrés un par un",
  "Unsave": "Retirer des favoris",
  "Saved list is empty. Star a candidate card to see it here.": "La liste des favoris est vide. Ajoutez une étoile à une fiche candidat pour la voir ici.",
  "Saved candidates": "Candidats enregistrés",
  "Close": "Fermer",
  "Recalculating…": "Recalcul en cours…",
  "Failed: ": "Échec : ",
  "Back to analysis": "Retour à l'analyse",
  "Skill check": "Vérification des compétences",
  "Pay & motive": "Rémunération et motivation",
  "Check salary fit and real motivation": "Vérifier l'adéquation salariale et la motivation réelle",
  "Stability": "Stabilité",
  "Why overseas? Does your family support a long assignment?": "Pourquoi l'étranger ? Votre famille soutient-elle une affectation de longue durée ?",
  "Motivation and family support": "Motivation et soutien familial",
  "Compliance": "Conformité",
  "When can passport, health certificate and police clearance be ready?": "Quand le passeport, le certificat médical et le casier judiciaire peuvent-ils être prêts ?",
  "Check document timeline": "Vérifier le calendrier du document",
  "Language": "Langue",
  "The site requires English manuals — have you used them?": "Le site exige des manuels en anglais — les avez-vous utilisés ?",
  "Check language readiness": "Vérifier la préparation linguistique",
  "You did injection molding; this is a glass press — how will you close the process gap?": "Vous avez fait du moulage par injection ; ici c'est une presse à verre — comment allez-vous combler l'écart de processus ?",
  "Check learning and transferability": "Vérifier l'apprentissage et la transférabilité",
  "Availability": "Disponibilité",
  "Confirm start timeline": "Confirmer le calendrier de démarrage",
  "Why this country and this role?": "Pourquoi ce pays et ce poste ?",
  "Check whether the choice is thought through": "Vérifier si le choix est réfléchi",
  "What do you want to achieve in the first three months?": "Que voulez-vous accomplir au cours des trois premiers mois ?",
  "Check goals and planning": "Vérifier les objectifs et la planification",
  "Look for: ": "Rechercher : ",
  "Interview questions": "Questions d'entretien",
  " from gaps & risks": " à partir des lacunes et des risques",
  "Focus radar": "Radar de focus",
  "Normalized to each part maximum": "Normalisé au maximum de chaque partie",
  "查看主动投递简历的候选人，勾选后可匹配分析、邀面试、发 offer": "Consulter les candidats ayant postulé spontanément, cochez pour l'analyse de correspondance, l'invitation à un entretien, l'envoi d'une offre",
  "候选人": "Candidat",
  "天前": "jours auparavant",
  "筛选": "Filtrer",
  "筛选 ▾": "Filtrer ▾",
  "中图标": "icône centrale",
  "offer": "offre",
  "days": "jours",
  "candidates": "candidats",
  "Filters": "Filtres",
  "Medium": "Moyen",
  "Demo session · viewing": "Session de démonstration · consultation"
});

  /* 静态导航/页面 key 补充 */
  Object.assign(KEYDICT.fr, {"nav.cConsole":"Tableau de bord","nav.cPool":"CVthèque","nav.cService":"Exécution et garanties","app.demoBadge":"Démo"});
  Object.assign(DICT.fr, {"一个项目下可以有多个岗位：先建项目，再在项目卡片上添加岗位":"Un projet peut contenir plusieurs postes : créez d'abord le projet, puis ajoutez des postes sur la fiche du projet","经营、客户、岗位、人与风险，一屏看完":"Activité, clients, postes, personnes et risques, en un seul écran","分析后自动入库，低分进待清理，删除进回收站":"Après analyse, archivage automatique ; les scores faibles vont en attente de nettoyage, les suppressions vont à la corbeille"});
  Object.assign(KEYDICT.th, {"nav.cConsole":"แดชบอร์ดข้อมูล","nav.cPool":"คลังเรซูเม่","nav.cService":"การปฏิบัติตามและการรับประกัน","app.demoBadge":"เดโม"});
  Object.assign(DICT.th, {"一个项目下可以有多个岗位：先建项目，再在项目卡片上添加岗位":"หนึ่งโปรเจกต์สามารถมีหลายตำแหน่งงาน: สร้างโปรเจกต์ก่อน แล้วเพิ่มตำแหน่งงานบนการ์ดโปรเจกต์","经营、客户、岗位、人与风险，一屏看完":"การดำเนินงาน ลูกค้า ตำแหน่ง บุคลากร และความเสี่ยง ดูได้ในหน้าจอเดียว","分析后自动入库，低分进待清理，删除进回收站":"หลังการวิเคราะห์จะเข้าคลังอัตโนมัติ คะแนนต่ำจะเข้าสู่รายการรอทำความสะอาด การลบจะเข้าถังรีไซเคิล"});
  Object.assign(KEYDICT.ja, {"nav.cConsole":"ダッシュボード","nav.cPool":"履歴書庫","nav.cService":"履行と保証","app.demoBadge":"デモ"});
  Object.assign(DICT.ja, {"一个项目下可以有多个岗位：先建项目，再在项目卡片上添加岗位":"1つのプロジェクトの下に複数のポジションを持つことができます：まずプロジェクトを作成し、次にプロジェクトカードにポジションを追加します","经营、客户、岗位、人与风险，一屏看完":"経営、顧客、ポジション、人材とリスクを一画面で確認","分析后自动入库，低分进待清理，删除进回收站":"分析後に自動でデータベースに登録され、低スコアのものはクリーンアップ待ちに入り、削除されたものはゴミ箱に入ります"});
  Object.assign(KEYDICT.ar, {"nav.cConsole":"لوحة المعلومات","nav.cPool":"مكتبة السير","nav.cService":"التنفيذ والضمانات","app.demoBadge":"تجريبي"});
  Object.assign(DICT.ar, {"一个项目下可以有多个岗位：先建项目，再在项目卡片上添加岗位":"يمكن أن يحتوي المشروع الواحد على عدة وظائف: أنشئ المشروع أولاً، ثم أضف الوظائف على بطاقة المشروع","经营、客户、岗位、人与风险，一屏看完":"العمليات والعملاء والوظائف والأفراد والمخاطر، كل ذلك في شاشة واحدة","分析后自动入库，低分进待清理，删除进回收站":"بعد التحليل يتم الإدخال التلقائي إلى قاعدة البيانات، والنتائج منخفضة الدرجات تدخل قائمة الانتظار للتنظيف، والمحذوفات تدخل سلة المحذوفات"});

  Object.assign(DICT.fr, { '中图标': 'Moyen', 'Filters': 'Filtres', 'Filters ▾': 'Filtres ▾', 'Filters ▴': 'Filtres ▴' });
  /* 角色主页副标题 */
  Object.assign(KEYDICT.fr, { 'role.personaSub': 'Accueil candidat', 'role.companySub': 'Accueil entreprise', 'role.assuranceSub': 'Opérations et conformité' });
  Object.assign(KEYDICT.th, { 'role.personaSub': 'หน้าผู้สมัคร', 'role.companySub': 'หน้าบริษัท', 'role.assuranceSub': 'ปฏิบัติการและกำกับดูแล' });
  Object.assign(KEYDICT.ja, { 'role.personaSub': '求職者ホーム', 'role.companySub': '企業ホーム', 'role.assuranceSub': '運用・コンプライアンス' });
  Object.assign(KEYDICT.ar, { 'role.personaSub': 'الصفحة الرئيسية للمتقدم', 'role.companySub': 'الصفحة الرئيسية للشركة', 'role.assuranceSub': 'العمليات والامتثال' });
  /* 看板图表/卡片补充 */
  Object.assign(DICT.th, {"项目健康度":"สุขภาพของโครงการ","各环节合规与进度综合评估":"การประเมินความสอดคล้องและความคืบหน้าในแต่ละขั้นตอนแบบองค์รวม","人员结构":"โครงสร้างบุคลากร","当前在册":"ขึ้นทะเบียนปัจจุบัน","人在册":"คนขึ้นทะเบียน","结算趋势":"แนวโน้มการชำระบัญชี","近 6 个月（万元）":"6 เดือนล่าสุด (หมื่นหยวน)","待办事项":"รายการที่ต้องดำเนินการ","结算账单确认":"การยืนยันบิลชำระบัญชี","阿尔及利亚项目 9 月账单 · 截止明日":"บิลเดือนกันยายนของโครงการแอลจีเรีย · ครบกำหนดพรุ่งนี้","待处理":"รอดำเนินการ","5 名派遣人员签证材料补交":"ยื่นเอกสารวีซ่าเพิ่มเติมสำหรับบุคลากรที่ส่งไป 5 คน","学历证明扫描件 · 影响签证预审":"สำเนาใบรับรองการศึกษา · กระทบการตรวจสอบวีซ่าเบื้องต้น","进行中":"กำลังดำเนินการ","当地雇员保险续保确认":"ยืนยันการต่ออายุประกันภัยพนักงานท้องถิ่น","3 人保单将于 11 月到期":"กรมธรรม์ของ 3 คนจะหมดอายุในเดือนพฤศจิกายน","提醒":"แจ้งเตือน","中方派遣":"การจัดส่งจากฝ่ายจีน","当地雇员":"พนักงานท้องถิ่น","储备候选人":"ผู้สมัครสำรอง","招募匹配":"การสรรหาและจับคู่","签约合规":"ความสอดคล้องของการลงนามสัญญา","证照手续":"ขั้นตอนเอกสารใบอนุญาต","在岗履约":"การปฏิบัติตามสัญญาระหว่างประจำการ","结算对账":"การกระทบยอดการชำระบัญชี","在办项目":"โครงการที่อยู่ระหว่างดำเนินการ","派遣中人员":"บุคลากรที่อยู่ระหว่างการส่งไปปฏิบัติงาน","本月应结算":"ยอดที่ต้องชำระเดือนนี้","个新项目待立项":"โครงการใหม่ที่รอการอนุมัติ","个项目在册":"โครงการที่ลงทะเบียน","覆盖 3 个项目岗位":"ครอบคลุม 3 ตำแหน่งในโครงการ","笔账单待确认":"บิลที่รอการยืนยัน","今日有 0 笔账单待确认，6 个项目在办。":"วันนี้มี 0 บิลที่รอการยืนยัน และ 6 โครงการอยู่ระหว่างดำเนินการ"});
  Object.assign(DICT.ja, {"项目健康度":"プロジェクト健全度","各环节合规与进度综合评估":"各工程のコンプライアンスと進捗の総合評価","人员结构":"人員構成","当前在册":"現在の在籍","人在册":"人在籍","结算趋势":"決済トレンド","近 6 个月（万元）":"直近6ヶ月（万元）","待办事项":"ToDo事項","结算账单确认":"決済請求書の確認","阿尔及利亚项目 9 月账单 · 截止明日":"アルジェリアプロジェクト 9月請求書 · 明日締切","待处理":"未処理","5 名派遣人员签证材料补交":"派遣人員5名のビザ材料追加提出","学历证明扫描件 · 影响签证预审":"学歴証明書のスキャン件 · ビザ事前審査に影響","进行中":"進行中","当地雇员保险续保确认":"現地雇用者の保険更新確認","3 人保单将于 11 月到期":"3名の保険証券が11月に満期","提醒":"リマインダー","中方派遣":"中国側派遣","当地雇员":"現地雇用者","储备候选人":"候補者プール","招募匹配":"募集マッチング","签约合规":"契約コンプライアンス","证照手续":"証照手続き","在岗履约":"就業履行","结算对账":"決済照合","在办项目":"進行中プロジェクト","派遣中人员":"派遣中人員","本月应结算":"今月決済予定","个新项目待立项":"件の新規プロジェクトが立項待ち","个项目在册":"件のプロジェクトが在籍","覆盖 3 个项目岗位":"3つのプロジェクト職位をカバー","笔账单待确认":"未確認の請求書","今日有 0 笔账单待确认，6 个项目在办。":"本日確認待ちの請求書は0件、6つのプロジェクトが進行中です。"});
  Object.assign(DICT.ar, {"项目健康度":"صحة المشروع","各环节合规与进度综合评估":"تقييم شامل للامتثال والتقدم في جميع المراحل","人员结构":"هيكل الموظفين","当前在册":"المسجلون حالياً","人在册":"الأفراد المسجلون","结算趋势":"اتجاه التسوية","近 6 个月（万元）":"آخر 6 أشهر (عشرة آلاف يوان)","待办事项":"المهام المعلقة","结算账单确认":"تأكيد فاتورة التسوية","阿尔及利亚项目 9 月账单 · 截止明日":"فاتورة سبتمبر لمشروع الجزائر · تنتهي غداً","待处理":"قيد المعالجة","5 名派遣人员签证材料补交":"تقديم مستندات تأشيرة 5 موظفين مُوفدين بشكل إضافي","学历证明扫描件 · 影响签证预审":"نسخ ممسوحة ضوئياً من شهادات التعليم · تؤثر على الفحص المسبق للتأشيرة","进行中":"قيد التنفيذ","当地雇员保险续保确认":"تأكيد تجديد تأمين الموظفين المحليين","3 人保单将于 11 月到期":"3 وثائق تأمين تنتهي في نوفمبر","提醒":"تذكير","中方派遣":"الموفدون الصينيون","当地雇员":"الموظفون المحليون","储备候选人":"المرشحون الاحتياطيون","招募匹配":"مطابقة التوظيف","签约合规":"امتثال التعاقد","证照手续":"إجراءات التراخيص","在岗履约":"الوفاء بالالتزامات أثناء العمل","结算对账":"مطابقة التسوية","在办项目":"المشاريع قيد التنفيذ","派遣中人员":"الموظفون المُوفدون","本月应结算":"المستحق للتسوية هذا الشهر","个新项目待立项":"مشاريع جديدة بانتظار الموافقة","个项目在册":"مشاريع مسجلة","覆盖 3 个项目岗位":"يغطي 3 وظائف مشروع","笔账单待确认":"فاتورة قيد التأكيد","今日有 0 笔账单待确认，6 个项目在办。":"اليوم هناك 0 فاتورة قيد التأكيد، و6 مشاريع قيد التنفيذ."});
  Object.assign(DICT.fr, {"项目健康度":"Santé des projets","各环节合规与进度综合评估":"Évaluation globale de la conformité et de l'avancement de chaque étape","人员结构":"Structure du personnel","当前在册":"Actuellement enregistrés","人在册":"personnes enregistrées","结算趋势":"Tendance des règlements","近 6 个月（万元）":"6 derniers mois (dix mille yuans)","待办事项":"Tâches à faire","结算账单确认":"Confirmation de facture de règlement","阿尔及利亚项目 9 月账单 · 截止明日":"Facture de septembre du projet Algérie · échéance demain","待处理":"En attente de traitement","5 名派遣人员签证材料补交":"Complément des documents de visa pour 5 personnes détachées","学历证明扫描件 · 影响签证预审":"Copies numérisées des diplômes · impact sur la pré-évaluation des visas","进行中":"En cours","当地雇员保险续保确认":"Confirmation du renouvellement de l'assurance des employés locaux","3 人保单将于 11 月到期":"Les polices de 3 personnes expirent en novembre","提醒":"Rappel","中方派遣":"Détachement chinois","当地雇员":"Employés locaux","储备候选人":"Candidats en réserve","招募匹配":"Recrutement et matching","签约合规":"Conformité des contrats","证照手续":"Formalités de licences et certificats","在岗履约":"Exécution en poste","结算对账":"Règlement et rapprochement","在办项目":"Projets en cours","派遣中人员":"Personnel en mission","本月应结算":"À régler ce mois-ci","个新项目待立项":"nouveaux projets en attente de lancement","个项目在册":"projets enregistrés","覆盖 3 个项目岗位":"Couvre 3 postes de projet","笔账单待确认":"Facture en attente de confirmation","今日有 0 笔账单待确认，6 个项目在办。":"Aujourd'hui, 0 facture en attente de confirmation, 6 projets en cours."});

  /* 翻译徽标 */
  Object.assign(DICT.th, {"机器翻译":"การแปลด้วยเครื่อง","查看原文":"ดูข้อความต้นฉบับ"});
  Object.assign(DICT.ja, {"机器翻译":"機械翻訳","查看原文":"原文を表示"});
  Object.assign(DICT.ar, {"机器翻译":"الترجمة الآلية","查看原文":"عرض النص الأصلي"});
  Object.assign(DICT.fr, {"机器翻译":"Traduction automatique","查看原文":"Voir le texte original"});

  /* 发起岗位/增值服务 */
  Object.assign(DICT.th, {"发起岗位需求":"สร้างความต้องการตำแหน่งงาน","发布面向国内 / 目的国的招聘用工信息":"เผยแพร่ข้อมูลการรับสมัครและจ้างงานสำหรับในประเทศ / ประเทศปลายทาง","项目":"โครงการ","岗位名称与人数":"ชื่อตำแหน่งและจำนวนคน","如：玻璃压机操作工 × 6":"เช่น: พนักงานควบคุมเครื่องอัดแก้ว × 6","匹配评分规则":"กฎการให้คะแนนการจับคู่","发布时即设定，权重会归一化到 100":"ตั้งค่าเมื่อเผยแพร่ น้ำหนักจะถูกปรับให้เป็น 100","恢复默认":"คืนค่าเริ่มต้น","合计":"รวม","归一化":"ปรับให้เป็นมาตรฐาน","发布岗位":"เผยแพร่ตำแหน่งงาน","当前账号没有「发布岗位」权限":"บัญชีปัจจุบันไม่มีสิทธิ์ «เผยแพร่ตำแหน่งงาน»","当前账号无「发布岗位」权限":"บัญชีปัจจุบันไม่มีสิทธิ์ «เผยแพร่ตำแหน่งงาน»","已发布岗位：":"ตำแหน่งงานที่เผยแพร่แล้ว:","增值服务":"บริการเสริม","AI 免费 · 合作交付":"AI ฟรี · ส่งมอบแบบร่วมมือ","签证可行性预审":"ตรวจสอบเบื้องต้นความเป็นไปได้ของวีซ่า","上传证件 → 出具可行性报告（AI）":"อัปโหลดเอกสาร → ออกรายงานความเป็นไปได้ (AI)","AI 免费":"AI ฟรี","简历翻译润色":"แปลและปรับปรุงเรซูเม่","中 / 英 / 法 / 阿互译（AI）":"แปลจีน / อังกฤษ / ฝรั่งเศส / อาหรับ (AI)","目的国政策问答":"ถามตอบนโยบายประเทศปลายทาง","劳动法 / 社保 / 个税问答（AI）":"ถามตอบกฎหมายแรงงาน / ประกันสังคม / ภาษีบุคคล (AI)","同传面试":"สัมภาษณ์แบบแปลสด","多语言实时同传在线面试":"สัมภาษณ์ออนไลน์แปลสดหลายภาษาแบบเรียลไทม์","护照 / 工作签证代办":"ดำเนินการหนังสือเดินทาง / วีซ่าทำงาน","含加急、续签":"รวมบริการเร่งด่วน ต่ออายุ","合作服务商":"ผู้ให้บริการพันธมิตร","境外意外 / 雇主责任险":"ประกันอุบัติเหตุต่างประเทศ / ประกันความรับผิดของนายจ้าง","百万级保额":"วงเงินคุ้มครองระดับล้าน","工资代发与国际结汇":"การจ่ายค่าจ้างแทนและการโอนเงินระหว่างประเทศ","多币种跨境支付":"การชำระเงินข้ามพรมแดนหลายสกุลเงิน","当地备案代办":"บริการยื่นจดทะเบียนในท้องถิ่น","工作许可、居留许可":"ใบอนุญาตทำงาน ใบอนุญาตพำนัก","Experience":"ประสบการณ์","薪资":"เงินเดือน","地点":"สถานที่","可用性":"ความพร้อม"});
  Object.assign(DICT.ja, {"发起岗位需求":"求人ニーズを起案する","发布面向国内 / 目的国的招聘用工信息":"国内／受入国の求人・雇用情報を公開する","项目":"プロジェクト","岗位名称与人数":"職種名と人数","如：玻璃压机操作工 × 6":"例：ガラスプレス機オペレーター × 6","匹配评分规则":"マッチングスコアのルール","发布时即设定，权重会归一化到 100":"公開時に設定、重みは100に正規化されます","恢复默认":"デフォルトに戻す","合计":"合計","归一化":"正規化","发布岗位":"求人を公開する","当前账号没有「发布岗位」权限":"現在のアカウントには「求人を公開する」権限がありません","当前账号无「发布岗位」权限":"現在のアカウントには「求人を公開する」権限がありません","已发布岗位：":"公開済みの求人：","增值服务":"付加価値サービス","AI 免费 · 合作交付":"AI 無料・提携提供","签证可行性预审":"ビザ実現可能性の事前審査","上传证件 → 出具可行性报告（AI）":"書類をアップロード → 実現可能性レポートを発行（AI）","AI 免费":"AI 無料","简历翻译润色":"履歴書の翻訳・推敲","中 / 英 / 法 / 阿互译（AI）":"中／英／仏／アラビア語の相互翻訳（AI）","目的国政策问答":"受入国の政策Q&A","劳动法 / 社保 / 个税问答（AI）":"労働法／社会保険／個人所得税のQ&A（AI）","同传面试":"同時通訳面接","多语言实时同传在线面试":"多言語リアルタイム同時通訳オンライン面接","护照 / 工作签证代办":"パスポート／就労ビザの代行手続き","含加急、续签":"急ぎ対応・更新を含む","合作服务商":"提携サービス事業者","境外意外 / 雇主责任险":"海外傷害保険／雇主責任保険","百万级保额":"百万級の保険金額","工资代发与国际结汇":"給与代理支払いと国際決済","多币种跨境支付":"多通貨クロスボーダー決済","当地备案代办":"現地届出代行","工作许可、居留许可":"就労許可、居留許可","Experience":"経験","薪资":"給与","地点":"勤務地"});
  Object.assign(DICT.ar, {"发起岗位需求":"بدء طلب الوظيفة","发布面向国内 / 目的国的招聘用工信息":"نشر معلومات التوظيف والتشغيل الموجهة للداخل / الدولة المستهدفة","项目":"المشروع","岗位名称与人数":"اسم الوظيفة وعدد الأشخاص","如：玻璃压机操作工 × 6":"مثال: مشغل مكبس زجاج × 6","匹配评分规则":"قواعد تقييم المطابقة","发布时即设定，权重会归一化到 100":"تُحدَّد عند النشر، ويتم تطبيع الأوزان إلى 100","恢复默认":"استعادة الافتراضي","合计":"الإجمالي","归一化":"التطبيع","发布岗位":"نشر الوظيفة","当前账号没有「发布岗位」权限":"الحساب الحالي لا يملك صلاحية «نشر الوظيفة»","当前账号无「发布岗位」权限":"الحساب الحالي لا يملك صلاحية «نشر الوظيفة»","已发布岗位：":"الوظائف المنشورة:","增值服务":"خدمات القيمة المضافة","AI 免费 · 合作交付":"AI مجاناً · تسليم بالتعاون","签证可行性预审":"الفحص المسبق لجدوى التأشيرة","上传证件 → 出具可行性报告（AI）":"رفع المستندات → إصدار تقرير الجدوى (AI)","AI 免费":"AI مجاناً","简历翻译润色":"ترجمة وتنقيح السيرة الذاتية","中 / 英 / 法 / 阿互译（AI）":"ترجمة متبادلة بين الصينية / الإنجليزية / الفرنسية / العربية (AI)","目的国政策问答":"أسئلة وأجوبة حول سياسات الدولة المستهدفة","劳动法 / 社保 / 个税问答（AI）":"أسئلة وأجوبة حول قانون العمل / الضمان الاجتماعي / ضريبة الدخل الفردي (AI)","同传面试":"مقابلة مع ترجمة فورية","多语言实时同传在线面试":"مقابلة عبر الإنترنت بترجمة فورية متعددة اللغات في الوقت الفعلي","护照 / 工作签证代办":"إجراءات جواز السفر / تأشيرة العمل","含加急、续签":"تشمل المعالجة العاجلة والتجديد","合作服务商":"مزود خدمة متعاون","境外意外 / 雇主责任险":"تأمين الحوادث في الخارج / مسؤولية صاحب العمل","百万级保额":"تغطية تأمينية بملايين","工资代发与国际结汇":"صرف الرواتب والتسوية الدولية للعملات","多币种跨境支付":"مدفوعات عبر الحدود متعددة العملات","当地备案代办":"خدمة التسجيل المحلي بالنيابة","工作许可、居留许可":"تصريح العمل وتصريح الإقامة","Skills":"المهارات","Certs":"الشهادات","Experience":"الخبرة","薪资":"الراتب","地点":"الموقع","可用性":"التوفر","Reset":"إعادة تعيين"});
  Object.assign(DICT.fr, {"发起岗位需求":"Créer une demande de poste","发布面向国内 / 目的国的招聘用工信息":"Publier des informations de recrutement et d'emploi pour le pays d'origine / le pays de destination","项目":"Projet","岗位名称与人数":"Intitulé du poste et nombre de personnes","如：玻璃压机操作工 × 6":"Ex. : opérateur de presse à verre × 6","匹配评分规则":"Règles de notation de correspondance","发布时即设定，权重会归一化到 100":"Défini lors de la publication, les pondérations sont normalisées à 100","恢复默认":"Rétablir les valeurs par défaut","合计":"Total","归一化":"Normalisation","发布岗位":"Publier le poste","当前账号没有「发布岗位」权限":"Le compte actuel n'a pas la permission « Publier un poste »","当前账号无「发布岗位」权限":"Le compte actuel n'a pas la permission « Publier un poste »","已发布岗位：":"Postes publiés :","增值服务":"Services à valeur ajoutée","AI 免费 · 合作交付":"IA gratuite · Livraison en partenariat","签证可行性预审":"Pré-examen de faisabilité du visa","上传证件 → 出具可行性报告（AI）":"Téléverser les documents → Émettre un rapport de faisabilité (IA)","AI 免费":"IA gratuite","简历翻译润色":"Traduction et perfectionnement du CV","中 / 英 / 法 / 阿互译（AI）":"Traduction mutuelle chinois / anglais / français / arabe (IA)","目的国政策问答":"Questions-réponses sur les politiques du pays de destination","劳动法 / 社保 / 个税问答（AI）":"Questions-réponses sur le droit du travail / la sécurité sociale / l'impôt sur le revenu des personnes physiques (IA)","同传面试":"Entretien avec interprétation simultanée","多语言实时同传在线面试":"Entretien en ligne multilingue avec interprétation simultanée en temps réel","护照 / 工作签证代办":"Services de passeport / visa de travail","含加急、续签":"Y compris traitement accéléré et renouvellement","合作服务商":"Prestataire partenaire","境外意外 / 雇主责任险":"Assurance accidents à l'étranger / responsabilité de l'employeur","百万级保额":"Couverture à hauteur de millions","工资代发与国际结汇":"Versement des salaires et règlement de devises international","多币种跨境支付":"Paiements transfrontaliers multidevises","当地备案代办":"Services d'enregistrement local","工作许可、居留许可":"Permis de travail, titre de séjour","Skills":"Compétences","Certs":"Certifications","Experience":"Expérience","薪资":"Salaire","地点":"Lieu","可用性":"Disponibilité","Reset":"Réinitialiser"});

  /* 岗位管理补充 */
  Object.assign(DICT.th, {"岗位管理":"การจัดการตำแหน่งงาน","保存但未发布的岗位可在这里编辑、发布或删除":"ตำแหน่งงานที่บันทึกแต่ยังไม่เผยแพร่สามารถแก้ไข เผยแพร่ หรือลบได้ที่นี่","全部":"ทั้งหมด","草稿（未发布）":"ฉบับร่าง (ยังไม่เผยแพร่)","已发布":"เผยแพร่แล้ว","新建岗位":"สร้างตำแหน่งงานใหม่","预览":"ดูตัวอย่าง","编辑":"แก้ไข","发布":"เผยแพร่","删除":"ลบ","取消发布":"ยกเลิกการเผยแพร่","暂无岗位，点右上角「新建岗位」。":"ยังไม่มีตำแหน่งงาน คลิก \"สร้างตำแหน่งงานใหม่\" ที่มุมขวาบน","元/月":"หยวน/เดือน","中国":"จีน","草稿":"ฉบับร่าง"});
  Object.assign(DICT.ja, {"岗位管理":"求人管理","保存但未发布的岗位可在这里编辑、发布或删除":"保存済みで未公開の求人はここで編集、公開、削除できます","全部":"すべて","草稿（未发布）":"下書き（未公開）","已发布":"公開済み","新建岗位":"求人を新規作成","预览":"プレビュー","编辑":"編集","发布":"公開","删除":"削除","取消发布":"公開を取消","暂无岗位，点右上角「新建岗位」。":"求人はまだありません。右上の「求人を新規作成」をクリックしてください。","草稿":"下書き"});
  Object.assign(DICT.ar, {"岗位管理":"إدارة الوظائف","保存但未发布的岗位可在这里编辑、发布或删除":"يمكن تعديل الوظائف المحفوظة غير المنشورة أو نشرها أو حذفها هنا","全部":"الكل","草稿（未发布）":"مسودة (غير منشورة)","已发布":"منشورة","新建岗位":"وظيفة جديدة","预览":"معاينة","编辑":"تعديل","发布":"نشر","删除":"حذف","取消发布":"إلغاء النشر","暂无岗位，点右上角「新建岗位」。":"لا توجد وظائف حالياً، انقر على «وظيفة جديدة» في الزاوية العلوية اليمنى.","元/月":"يوان/شهر","中国":"الصين","草稿":"مسودة"});
  Object.assign(DICT.fr, {"岗位管理":"Gestion des postes","保存但未发布的岗位可在这里编辑、发布或删除":"Les postes enregistrés mais non publiés peuvent être modifiés, publiés ou supprimés ici","全部":"Tout","草稿（未发布）":"Brouillon (non publié)","已发布":"Publié","新建岗位":"Nouveau poste","预览":"Aperçu","编辑":"Modifier","发布":"Publier","删除":"Supprimer","取消发布":"Dépublier","暂无岗位，点右上角「新建岗位」。":"Aucun poste pour le moment, cliquez sur « Nouveau poste » en haut à droite.","元/月":"yuan/mois","中国":"Chine","草稿":"Brouillon"});

  /* 岗位管理页面 */
  Object.assign(DICT.th, {"岗位管理":"การจัดการตำแหน่งงาน","保存但未发布的岗位可在这里编辑、发布或删除":"ตำแหน่งงานที่บันทึกแต่ยังไม่เผยแพร่สามารถแก้ไข เผยแพร่ หรือลบได้ที่นี่","全部":"ทั้งหมด","草稿（未发布）":"ฉบับร่าง (ยังไม่เผยแพร่)","已发布":"เผยแพร่แล้ว","新建岗位":"สร้างตำแหน่งงานใหม่","预览":"ดูตัวอย่าง","编辑":"แก้ไข","发布":"เผยแพร่","删除":"ลบ","取消发布":"ยกเลิกการเผยแพร่","暂无岗位":"ยังไม่มีตำแหน่งงาน","点右上角「新建岗位」。":"คลิก \"สร้างตำแหน่งงานใหม่\" ที่มุมขวาบน","薪资待定":"เงินเดือนรอเจรจา","未命名岗位":"ตำแหน่งงานที่ไม่มีชื่อ","正在翻译…":"กำลังแปล…","草稿":"ฉบับร่าง"});
  Object.assign(DICT.ja, {"岗位管理":"求人管理","保存但未发布的岗位可在这里编辑、发布或删除":"保存済みで未公開の求人はここで編集、公開、削除できます","全部":"すべて","草稿（未发布）":"下書き（未公開）","已发布":"公開済み","新建岗位":"求人を新規作成","预览":"プレビュー","编辑":"編集","发布":"公開","删除":"削除","取消发布":"公開を取消","暂无岗位":"現在、求人情報はありません","点右上角「新建岗位」。":"右上の「新規求人」をクリックしてください。","薪资待定":"給与は応相談","未命名岗位":"名称未設定の求人","正在翻译…":"翻訳中…","草稿":"下書き"});
  Object.assign(DICT.ar, {"岗位管理":"إدارة الوظائف","保存但未发布的岗位可在这里编辑、发布或删除":"يمكن تعديل الوظائف المحفوظة غير المنشورة أو نشرها أو حذفها هنا","全部":"الكل","草稿（未发布）":"مسودة (غير منشورة)","已发布":"منشورة","新建岗位":"وظيفة جديدة","预览":"معاينة","编辑":"تعديل","发布":"نشر","删除":"حذف","取消发布":"إلغاء النشر","暂无岗位":"لا توجد وظائف حالياً","点右上角「新建岗位」。":"انقر على \"وظيفة جديدة\" في الزاوية العلوية اليمنى.","薪资待定":"الراتب غير محدد","未命名岗位":"وظيفة بدون اسم","正在翻译…":"جارٍ الترجمة…","草稿":"مسودة"});
  Object.assign(DICT.fr, {"岗位管理":"Gestion des postes","保存但未发布的岗位可在这里编辑、发布或删除":"Les postes enregistrés mais non publiés peuvent être modifiés, publiés ou supprimés ici","全部":"Tout","草稿（未发布）":"Brouillon (non publié)","已发布":"Publié","新建岗位":"Nouveau poste","预览":"Aperçu","编辑":"Modifier","发布":"Publier","删除":"Supprimer","取消发布":"Dépublier","暂无岗位":"Aucun poste pour le moment","点右上角「新建岗位」。":"Cliquez sur « Nouveau poste » en haut à droite.","薪资待定":"Salaire à déterminer","未命名岗位":"Poste sans nom","正在翻译…":"Traduction en cours…","草稿":"Brouillon"});

  /* 设置-翻译 */
  Object.assign(DICT.th, {"当前":"ปัจจุบัน","语言 / 翻译":"ภาษา / การแปล","中文原文":"ข้อความต้นฉบับภาษาจีน","查看原文":"ดูข้อความต้นฉบับ"});
  Object.assign(DICT.ja, {"当前":"現在","语言 / 翻译":"言語 / 翻訳","中文原文":"中国語原文","查看原文":"原文を表示"});
  Object.assign(DICT.ar, {"当前":"الحالي","语言 / 翻译":"اللغة / الترجمة","中文原文":"النص الأصلي بالصينية","查看原文":"عرض النص الأصلي"});
  Object.assign(DICT.fr, {"当前":"Actuel","语言 / 翻译":"Langue / Traduction","中文原文":"Texte original en chinois","查看原文":"Voir le texte original"});

  Object.assign(DICT.fr,{'翻译':'Traduction'}); Object.assign(DICT.th,{'翻译':'แปล'}); Object.assign(DICT.ja,{'翻译':'翻訳'}); Object.assign(DICT.ar,{'翻译':'ترجمة'});
  /* hp-i18n-extra 补充层 */
  Object.assign(DICT.th, {"加载中…":"กำลังโหลด…","刷新":"รีเฟรช","删除":"ลบ","恢复":"กู้คืน","处理":"ดำเนินการ","取消":"ยกเลิก","关闭":"ปิด","确定":"ยืนยัน","姓名":"ชื่อ","岗位":"ตำแหน่ง","国家":"ประเทศ","匹配度":"ความสอดคล้อง","风险":"ความเสี่ยง","来源":"แหล่งที่มา","入库":"นำเข้าคลัง","状态":"สถานะ","优势":"จุดเด่น","不足":"จุดด้อย","五维得分":"คะแนนห้ามิติ","技能":"ทักษะ","证书":"ใบรับรอง","经验":"ประสบการณ์","语言":"ภาษา","合规":"การปฏิบัติตามข้อกำหนด","推荐面试":"แนะนำให้สัมภาษณ์","不推荐":"ไม่แนะนำ","推荐":"แนะนำ","待定":"รอการกำหนด","自动":"อัตโนมัติ","手动":"ด้วยตนเอง","在招":"กำลังรับสมัคร","预警":"แจ้งเตือน","低毛利":"กำไรขั้นต้นต่ำ","已处理":"ดำเนินการแล้ว","必填":"จำเป็นต้องกรอก","禁填":"ห้ามกรอก","建议隐藏":"แนะนำให้ซ่อน","格式要求":"ข้อกำหนดรูปแบบ","注意事项":"ข้อควรระวัง","字段":"ฟิลด์","规则":"กฎ","原因":"สาเหตุ","操作":"การดำเนินการ","依据来源":"แหล่งอ้างอิง","更新":"อัปเดต","主库":"ฐานข้อมูลหลัก","待清理":"รอการล้างข้อมูล","回收站":"ถังรีไซเคิล","搜姓名 / 岗位 / 国家":"ค้นหาชื่อ / ตำแหน่ง / ประเทศ","全部匹配度":"ระดับความตรงกันทั้งหมด","候选人":"ผู้สมัคร","入库时间":"เวลานำเข้า","入库规则：分析完成后自动入库，低于门槛进「待清理」；删除先进回收站，保留 30 天。已推荐 / 面试中 / 已录用 不能直接删除。":"กฎการนำเข้า: นำเข้าอัตโนมัติหลังการวิเคราะห์เสร็จสิ้น รายการที่ต่ำกว่าเกณฑ์จะถูกย้ายไปที่ 'รอการล้างข้อมูล'; การลบจะย้ายไปถังรีไซเคิลก่อน เก็บไว้ 30 วัน รายการที่ 'แนะนำแล้ว / กำลังสัมภาษณ์ / รับเข้าทำงานแล้ว' ไม่สามารถลบได้โดยตรง","回收站是空的":"ถังรีไซเคิลว่างเปล่า","没有符合条件的候选人":"ไม่มีผู้สมัครที่ตรงตามเงื่อนไข","在招岗位":"ตำแหน่งที่เปิดรับ","缺口合计":"ช่องว่างรวม","人才库":"คลังบุคลากร","匹配达标":"ตรงตามเกณฑ์","高匹配（≥80）":"ตรงกันสูง (≥80)","外派在册":"พนักงานส่งไปประจำต่างประเทศ","岗位缺口（按国家）":"ช่องว่างตำแหน่ง (ตามประเทศ)","人才匹配分布":"การกระจายการจับคู่บุคลากร","岗位健康度":"สุขภาพตำแหน่ง","待办":"รายการที่ต้องดำเนินการ","点击查看岗位":"คลิกเพื่อดูตำแหน่ง","实时":"เรียลไทม์","数据来自岗位库 / 人才档案 / 保障台账":"ข้อมูลจากคลังตำแหน่ง / แฟ้มบุคลากร / ทะเบียนการรับประกัน","暂无岗位数据":"ยังไม่มีข้อมูลตำแหน่ง","营收 / 毛利 / 回款 / 账龄需要结算与发票数据，当前 store 未包含，接上后自动显示。":"รายได้ / กำไรขั้นต้น / การรับชำระเงิน / อายุหนี้ ต้องใช้ข้อมูลการชำระบัญชีและใบแจ้งหนี้ ซึ่ง store ปัจจุบันยังไม่มี จะแสดงอัตโนมัติเมื่อเชื่อมต่อแล้ว","候选池总量":"จำนวนรวมของกลุ่มผู้สมัคร","平均招聘周期":"ระยะเวลาการรับสมัครเฉลี่ย","面试转化率":"อัตราการแปลงสัมภาษณ์","合规风险":"ความเสี่ยงด้านการปฏิบัติตามกฎ","单人成本":"ต้นทุนต่อคน","招聘漏斗":"กรวยการสรรหา","人在哪一步流失":"ผู้สมัครหลุดในขั้นตอนใด","匹配度分布":"การกระจายของระดับความเหมาะสม","10 分一档":"แบ่งช่วงละ 10 คะแนน","国家意向":"ความสนใจประเทศ","人数":"จำนวนคน","合规风险热力":"แผนภาพความร้อนความเสี่ยงด้านการปฏิบัติตามกฎ","国家 × 风险类型":"ประเทศ × ประเภทความเสี่ยง","颜色越深，问题越多":"สีเข้มขึ้นหมายถึงปัญหามากขึ้น","投递":"การสมัคร","初筛":"การคัดกรองเบื้องต้น","面试":"การสัมภาษณ์","录用":"การรับเข้าทำงาน","到岗":"การรายงานตัวเข้าทำงาน","琥珀＝达标关口":"สีอำพัน = เกณฑ์ผ่าน","青 60–79 · 琥珀 80+":"สีฟ้า 60–79 · สีอำพัน 80+","琥珀＝最大来源国":"สีอำพัน = ประเทศต้นทางที่มากที่สุด","文书模板":"แม่แบบเอกสาร","国别规则":"กฎเฉพาะประเทศ","规则用于简历上传前体检：必填项缺失会拦截投递，禁填项自动隐藏，建议隐藏项提示 HR 手动处理。":"กฎใช้สำหรับตรวจสุขภาพเรซูเม่ก่อนอัปโหลด: หากขาดฟิลด์ที่จำเป็นจะถูกบล็อกการสมัคร ฟิลด์ที่ห้ามกรอกจะถูกซ่อนอัตโนมัติ ฟิลด์ที่แนะนำให้ซ่อนจะแจ้งให้ HR ดำเนินการด้วยตนเอง","如与当地法律冲突，以法律为准；规则库由保障部维护，修改后即时生效。":"หากขัดแย้งกับกฎหมายท้องถิ่น ให้ยึดกฎหมายเป็นหลัก คลังกฎดูแลโดยฝ่ายคุ้มครอง ปรับแก้แล้วมีผลทันที","项目列表":"รายการโครงการ","岗位生意账":"บัญชีธุรกิจของตำแหน่งงาน","缺口":"ช่องว่าง","已推荐":"แนะนำแล้ว","填补天数":"จำนวนวันที่เติมเต็ม","毛利率":"อัตรากำไรขั้นต้น","供给漏斗":"กรวยการจัดหา","阶段耗时":"ระยะเวลาของแต่ละขั้นตอน","成本与收益":"ต้นทุนและผลตอบแทน","渠道费用":"ค่าใช้จ่ายช่องทาง","客户报价":"ราคาที่เสนอลูกค้า","单毛利":"กำไรขั้นต้นต่อรายการ","风险与失败原因":"ความเสี่ยงและสาเหตุของความล้มเหลว","关闭岗位":"ปิดตำแหน่งงาน","加急推荐":"แนะนำแบบเร่งด่วน","发布→首批推荐":"เผยแพร่→แนะนำชุดแรก","首批→面试":"ชุดแรก→สัมภาษณ์","面试→录用":"สัมภาษณ์→รับเข้าทำงาน","录用→到岗":"รับเข้าทำงาน→เข้าปฏิบัติงาน","匹配":"การจับคู่","档案信息":"ข้อมูลโปรไฟล์","简历体检":"ตรวจสุขภาพเรซูเม่","我的简历":"เรซูเม่ของฉัน","白纸预览 · 缺项高亮 · 演示数据":"ตัวอย่างกระดาษเปล่า · ไฮไลต์รายการที่ขาด · ข้อมูลสาธิต","目标国家":"ประเทศเป้าหมาย","规则随国家变化":"กฎเปลี่ยนแปลงตามประเทศ","简历完成度":"ความสมบูรณ์ของเรซูเม่","上传前建议 100%":"แนะนำ 100% ก่อนอัปโหลด","上传前体检":"ตรวจสุขภาพก่อนอัปโหลด","编辑档案":"แก้ไขโปรไฟล์","上传 / 替换简历":"อัปโหลด / แทนที่เรซูเม่","开始体检":"เริ่มตรวจสุขภาพ","编辑与上传沿用「档案信息」里原有的流程；体检只检查上传前该隐藏、该补齐的项。":"การแก้ไขและอัปโหลดใช้ขั้นตอนเดิมใน «ข้อมูลโปรไฟล์»; การตรวจสุขภาพตรวจเฉพาะรายการที่ควรซ่อนหรือควรเติมให้ครบก่อนอัปโหลดเท่านั้น","健康证未上传":"ยังไม่ได้อัปโหลดใบรับรองสุขภาพ","护照有效期未填":"ยังไม่ได้กรอกวันหมดอายุหนังสือเดินทาง","婚姻状况":"สถานภาพสมรส","照片":"รูปถ่าย","日期格式":"รูปแบบวันที่","去上传":"ไปอัปโหลด","去补":"ไปเติม","一键隐藏":"ซ่อนทั้งหมดในคลิกเดียว","自动修正":"แก้ไขอัตโนมัติ","还差：健康证、护照有效期、语言水平":"ยังขาด: ใบรับรองสุขภาพ, วันหมดอายุหนังสือเดินทาง, ระดับภาษา","上传后才能通过体检":"ต้องอัปโหลดก่อนจึงจะผ่านการตรวจสุขภาพ","需 ≥18 个月":"ต้อง ≥18 เดือน","建议隐藏，与岗位无关":"แนะนำให้ซ่อน ไม่เกี่ยวข้องกับตำแหน่ง","已按该国规则隐藏":"ซ่อนตามกฎของประเทศนั้นแล้ว","2021.03 与 2021-03 统一为 2021-03":"รวม 2021.03 และ 2021-03 เป็น 2021-03","投递前体检":"ตรวจสุขภาพก่อนสมัคร","继续上传":"อัปโหลดต่อ","缺项不影响上传，但投递前必须补齐；敏感项建议上传前隐藏。":"รายการที่ขาดไม่กระทบการอัปโหลด แต่ต้องเติมให้ครบก่อนสมัคร; รายการที่ละเอียดอ่อนแนะนำให้ซ่อนก่อนอัปโหลด","目标国要求必填，缺失可能被退回":"ประเทศเป้าหมายกำหนดให้ต้องกรอก หากขาดอาจถูกส่งคืน","去补资料":"ไปเติมข้อมูล","仍然投递":"ยังคงส่งใบสมัคร","档案已保存 · 可直接投递":"บันทึกแฟ้มแล้ว · สามารถส่งใบสมัครได้ทันที","档案已保存 · 投递前还需补 ":"บันทึกแฟ้มแล้ว · ก่อนส่งใบสมัครยังต้องเติม ","显示设置":"การตั้งค่าการแสดงผล","字号":"ขนาดตัวอักษร","标准":"มาตรฐาน","跳过开机动画":"ข้ามแอนิเมชันเปิดเครื่อง","跳过推理分析过程":"ข้ามกระบวนการวิเคราะห์เชิงเหตุผล","恢复默认":"คืนค่าเริ่มต้น"});
  Object.assign(DICT.ja, {"加载中…":"読み込み中…","刷新":"更新","删除":"削除","恢复":"復元","处理":"処理","取消":"キャンセル","关闭":"閉じる","确定":"確定","姓名":"氏名","岗位":"職種","国家":"国","匹配度":"マッチ度","风险":"リスク","来源":"ソース","入库":"登録","状态":"ステータス","优势":"強み","不足":"不足点","五维得分":"五次元スコア","技能":"スキル","证书":"資格","经验":"経験","语言":"言語","合规":"コンプライアンス","推荐面试":"面接推薦","不推荐":"非推奨","推荐":"推奨","待定":"保留","自动":"自動","手动":"手動","在招":"募集中","预警":"警告","低毛利":"低粗利","已处理":"処理済み","必填":"必須","禁填":"入力禁止","建议隐藏":"非表示推奨","格式要求":"形式要件","注意事项":"注意事項","字段":"フィールド","规则":"ルール","原因":"理由","依据来源":"根拠ソース","主库":"マスタ","待清理":"クリーンアップ待ち","回收站":"ゴミ箱","搜姓名 / 岗位 / 国家":"氏名 / 職種 / 国で検索","全部匹配度":"すべてのマッチ度","候选人":"候補者","入库时间":"登録日時","入库规则：分析完成后自动入库，低于门槛进「待清理」；删除先进回收站，保留 30 天。已推荐 / 面试中 / 已录用 不能直接删除。":"登録ルール：分析完了後に自動登録、基準未満は「クリーンアップ待ち」へ；削除はまずゴミ箱へ移動し、30日間保持。推薦済み / 面接中 / 採用済み は直接削除できません。","回收站是空的":"ゴミ箱は空です","没有符合条件的候选人":"条件に合う候補者がいません","在招岗位":"募集中の職種","缺口合计":"不足合計","人才库":"人材プール","匹配达标":"マッチ基準達成","高匹配（≥80）":"高マッチ（≥80）","外派在册":"海外派遣在籍","岗位缺口（按国家）":"職種別不足（国別）","人才匹配分布":"人材マッチ分布","岗位健康度":"職種の健全度","待办":"ToDo","点击查看岗位":"クリックして職種を表示","实时":"リアルタイム","数据来自岗位库 / 人才档案 / 保障台账":"データは職種庫 / 人材档案 / 保障台帳から取得","暂无岗位数据":"職種データがありません","营收 / 毛利 / 回款 / 账龄需要结算与发票数据，当前 store 未包含，接上后自动显示。":"売上 / 粗利 / 回収 / 債権年齢は決済・請求書データが必要です。現在の store には含まれていないため、接続後に自動表示されます。","候选池总量":"候補プール総数","平均招聘周期":"平均採用期間","面试转化率":"面接転換率","合规风险":"コンプライアンスリスク","单人成本":"一人当たりコスト","招聘漏斗":"採用ファネル","人在哪一步流失":"どの段階で離脱しているか","匹配度分布":"マッチ度分布","10 分一档":"10点刻み","国家意向":"国別意向","合规风险热力":"コンプライアンスリスクヒートマップ","国家 × 风险类型":"国 × リスク種別","颜色越深，问题越多":"色が濃いほど問題が多い","投递":"応募","初筛":"一次選考","面试":"面接","录用":"採用決定","到岗":"入社","琥珀＝达标关口":"琥珀＝達成基準ライン","琥珀＝最大来源国":"琥珀＝最大の出身国","文书模板":"書類テンプレート","国别规则":"国別ルール","规则用于简历上传前体检：必填项缺失会拦截投递，禁填项自动隐藏，建议隐藏项提示 HR 手动处理。":"ルールは履歴書アップロード前のチェックに使用：必須項目の欠落は応募をブロックし、入力禁止項目は自動的に非表示、非表示推奨項目はHRに手動対応を促す。","如与当地法律冲突，以法律为准；规则库由保障部维护，修改后即时生效。":"現地法と抵触する場合は法律を優先する。ルールベースは保障部が保守し、変更後は即時有効となる。","项目列表":"プロジェクト一覧","岗位生意账":"求人ビジネス収支","缺口":"不足数","已推荐":"推薦済み","填补天数":"充足日数","毛利率":"粗利率","供给漏斗":"供給ファネル","阶段耗时":"段階別所要時間","成本与收益":"コストと収益","渠道费用":"チャネル費用","客户报价":"顧客見積","单毛利":"一件あたり粗利","风险与失败原因":"リスクと失敗原因","关闭岗位":"求人クローズ","加急推荐":"優先推薦","发布→首批推荐":"掲載→初回推薦","首批→面试":"初回→面接","面试→录用":"面接→採用","录用→到岗":"採用→着任","匹配":"マッチング","档案信息":"プロフィール情報","简历体检":"履歴書チェック","我的简历":"マイ履歴書","白纸预览 · 缺项高亮 · 演示数据":"白紙プレビュー・不足項目ハイライト・デモデータ","目标国家":"対象国","规则随国家变化":"ルールは国により変動","简历完成度":"履歴書完成度","上传前建议 100%":"アップロード前に100%を推奨","上传前体检":"アップロード前チェック","编辑档案":"プロフィール編集","上传 / 替换简历":"履歴書をアップロード / 差し替え","开始体检":"チェックを開始","编辑与上传沿用「档案信息」里原有的流程；体检只检查上传前该隐藏、该补齐的项。":"編集とアップロードは「プロフィール情報」の既存フローに従います。チェックではアップロード前に隠すべき項目・補うべき項目のみを確認します。","健康证未上传":"健康診断書が未アップロード","护照有效期未填":"パスポート有効期限が未入力","婚姻状况":"婚姻状況","照片":"写真","日期格式":"日付形式","去上传":"アップロードへ","去补":"補完へ","一键隐藏":"一括非表示","自动修正":"自動修正","还差：健康证、护照有效期、语言水平":"不足：健康診断書、パスポート有効期限、語学レベル","上传后才能通过体检":"アップロード後にチェックを通過できます","需 ≥18 个月":"18ヶ月以上必要","建议隐藏，与岗位无关":"非表示を推奨、職務と無関係","已按该国规则隐藏":"当該国のルールに従い非表示済み","2021.03 与 2021-03 统一为 2021-03":"2021.03 と 2021-03 を 2021-03 に統一","投递前体检":"応募前チェック","继续上传":"アップロードを続ける","缺项不影响上传，但投递前必须补齐；敏感项建议上传前隐藏。":"不足項目はアップロードに影響しませんが、応募前に必ず補完してください。センシティブ項目はアップロード前に非表示を推奨します。","目标国要求必填，缺失可能被退回":"対象国で必須入力です。欠落すると差し戻される可能性があります","去补资料":"資料を補完する","仍然投递":"そのまま応募する","档案已保存 · 可直接投递":"書類は保存済み · そのまま応募できます","档案已保存 · 投递前还需补 ":"書類は保存済み · 応募前に補完が必要 ","显示设置":"表示設定","字号":"文字サイズ","标准":"標準","跳过开机动画":"起動アニメーションをスキップ","跳过推理分析过程":"推論分析プロセスをスキップ","恢复默认":"デフォルトに戻す"});
  Object.assign(DICT.ar, {"加载中…":"جارٍ التحميل…","刷新":"تحديث","删除":"حذف","恢复":"استعادة","处理":"معالجة","取消":"إلغاء","关闭":"إغلاق","确定":"تأكيد","姓名":"الاسم","岗位":"الوظيفة","国家":"البلد","匹配度":"درجة التوافق","风险":"المخاطر","来源":"المصدر","入库":"الإدخال إلى قاعدة البيانات","状态":"الحالة","优势":"المزايا","不足":"نقاط الضعف","五维得分":"الدرجة الخماسية الأبعاد","技能":"المهارات","证书":"الشهادات","经验":"الخبرة","语言":"اللغات","合规":"الامتثال","推荐面试":"التوصية بالمقابلة","不推荐":"غير موصى به","推荐":"موصى به","待定":"قيد الانتظار","自动":"تلقائي","手动":"يدوي","在招":"قيد التوظيف","预警":"تحذير","低毛利":"هامش ربح منخفض","已处理":"تمت المعالجة","必填":"مطلوب","禁填":"محظور الإدخال","建议隐藏":"يُنصح بالإخفاء","格式要求":"متطلبات التنسيق","注意事项":"ملاحظات","字段":"حقل","规则":"قاعدة","原因":"السبب","操作":"إجراء","依据来源":"مصدر الاستناد","更新":"تحديث","主库":"المكتبة الرئيسية","待清理":"في انتظار التنظيف","回收站":"سلة المحذوفات","搜姓名 / 岗位 / 国家":"بحث بالاسم / الوظيفة / الدولة","全部匹配度":"جميع درجات المطابقة","候选人":"المرشح","入库时间":"وقت الإدخال","入库规则：分析完成后自动入库，低于门槛进「待清理」；删除先进回收站，保留 30 天。已推荐 / 面试中 / 已录用 不能直接删除。":"قواعد الإدخال: يتم الإدخال تلقائيًا بعد اكتمال التحليل، وما دون الحد الأدنى يُنقل إلى «قيد التنظيف»؛ الحذف ينقل أولًا إلى سلة المحذوفات ويُحتفظ به 30 يومًا. لا يمكن حذف المرشَّح / قيد المقابلة / المعيَّن مباشرة.","回收站是空的":"سلة المحذوفات فارغة","没有符合条件的候选人":"لا يوجد مرشحون مطابقون للشروط","在招岗位":"الوظائف الشاغرة","缺口合计":"إجمالي الفجوات","人才库":"بنك المواهب","匹配达标":"مطابقة مؤهلة","高匹配（≥80）":"مطابقة عالية (≥80)","外派在册":"المسجلون للانتداب الخارجي","岗位缺口（按国家）":"فجوات الوظائف (حسب الدولة)","人才匹配分布":"توزيع مطابقة المواهب","岗位健康度":"سلامة الوظائف","待办":"المهام المعلقة","点击查看岗位":"انقر لعرض الوظائف","实时":"مباشر","数据来自岗位库 / 人才档案 / 保障台账":"البيانات من بنك الوظائف / ملفات المواهب / سجل الضمانات","暂无岗位数据":"لا توجد بيانات وظائف حاليًا","营收 / 毛利 / 回款 / 账龄需要结算与发票数据，当前 store 未包含，接上后自动显示。":"الإيرادات / إجمالي الربح / التحصيلات / أعمار الديون تتطلب بيانات التسوية والفواتير، وهي غير متضمنة في store الحالي، وستُعرض تلقائيًا بعد الربط.","候选池总量":"إجمالي مجموعة المرشحين","平均招聘周期":"متوسط دورة التوظيف","面试转化率":"معدل تحويل المقابلات","合规风险":"مخاطر الامتثال","单人成本":"التكلفة للفرد","招聘漏斗":"قمع التوظيف","人在哪一步流失":"في أي مرحلة يتسرب الأشخاص","匹配度分布":"توزيع درجة المطابقة","10 分一档":"فئة كل 10 نقاط","国家意向":"التوجه الوطني","人数":"عدد الأشخاص","合规风险热力":"خريطة حرارية لمخاطر الامتثال","国家 × 风险类型":"الدولة × نوع المخاطر","颜色越深，问题越多":"كلما كان اللون أغمق، زادت المشاكل","投递":"التقديم","初筛":"الفرز الأولي","面试":"المقابلة","录用":"التعيين","到岗":"الالتحاق بالعمل","琥珀＝达标关口":"العنبري = بوابة استيفاء المعايير","青 60–79 · 琥珀 80+":"سماوي 60–79 · عنبري 80+","琥珀＝最大来源国":"العنبري = أكبر دولة مصدرة","文书模板":"قوالب المستندات","国别规则":"قواعد الدول","规则用于简历上传前体检：必填项缺失会拦截投递，禁填项自动隐藏，建议隐藏项提示 HR 手动处理。":"تُستخدم القواعد للفحص قبل رفع السيرة الذاتية: الحقول الإلزامية الناقصة تمنع التقديم، والحقول المحظورة تُخفى تلقائيًا، والحقول الموصى بإخفائها تُنبّه مسؤول الموارد البشرية للمعالجة اليدوية.","如与当地法律冲突，以法律为准；规则库由保障部维护，修改后即时生效。":"في حال التعارض مع القانون المحلي، يُعتمد القانون؛ تُصان قاعدة القواعد من قبل إدارة الضمان، وتصبح التعديلات سارية فورًا بعد إجرائها.","项目列表":"قائمة المشاريع","岗位生意账":"حساب أعمال الوظيفة","缺口":"الفجوة","已推荐":"تم الترشيح","填补天数":"أيام التغطية","毛利率":"هامش الربح الإجمالي","供给漏斗":"قمع العرض","阶段耗时":"مدة المرحلة","成本与收益":"التكلفة والعائد","渠道费用":"تكاليف القنوات","客户报价":"عرض السعر للعميل","单毛利":"الهامش لكل وحدة","风险与失败原因":"المخاطر وأسباب الفشل","关闭岗位":"إغلاق الوظيفة","加急推荐":"ترشيح عاجل","发布→首批推荐":"النشر ← الدفعة الأولى من الترشيحات","首批→面试":"الدفعة الأولى ← المقابلة","面试→录用":"المقابلة ← التوظيف","录用→到岗":"التوظيف ← الالتحاق بالعمل","匹配":"المطابقة","档案信息":"معلومات الملف","简历体检":"فحص السيرة الذاتية","我的简历":"سيرتي الذاتية","白纸预览 · 缺项高亮 · 演示数据":"معاينة فارغة · إبراز النواقص · بيانات تجريبية","目标国家":"الدولة المستهدفة","规则随国家变化":"القواعد تتغير حسب الدولة","简历完成度":"اكتمال السيرة الذاتية","上传前建议 100%":"يُنصح بـ 100% قبل الرفع","上传前体检":"فحص ما قبل الرفع","编辑档案":"تعديل الملف","上传 / 替换简历":"رفع / استبدال السيرة الذاتية","开始体检":"بدء الفحص","编辑与上传沿用「档案信息」里原有的流程；体检只检查上传前该隐藏、该补齐的项。":"يتبع التعديل والرفع الإجراءات الأصلية في «معلومات الملف»؛ يفحص الفحص فقط العناصر التي يجب إخفاؤها أو استكمالها قبل الرفع.","健康证未上传":"الشهادة الصحية غير مرفوعة","护照有效期未填":"تاريخ صلاحية جواز السفر غير مُدخل","婚姻状况":"الحالة الاجتماعية","照片":"الصورة","日期格式":"تنسيق التاريخ","去上传":"إلى الرفع","去补":"إلى الاستكمال","一键隐藏":"إخفاء بنقرة واحدة","自动修正":"تصحيح تلقائي","还差：健康证、护照有效期、语言水平":"المتبقي: الشهادة الصحية، تاريخ صلاحية جواز السفر، مستوى اللغة","上传后才能通过体检":"لا يمكن اجتياز الفحص إلا بعد الرفع","需 ≥18 个月":"مطلوب ≥18 شهرًا","建议隐藏，与岗位无关":"يُنصح بالإخفاء، غير متعلق بالوظيفة","已按该国规则隐藏":"تم الإخفاء وفق قواعد الدولة","2021.03 与 2021-03 统一为 2021-03":"تم توحيد 2021.03 و 2021-03 إلى 2021-03","投递前体检":"فحص ما قبل التقديم","继续上传":"متابعة الرفع","缺项不影响上传，但投递前必须补齐；敏感项建议上传前隐藏。":"العناصر الناقصة لا تؤثر على الرفع، لكن يجب استكمالها قبل التقديم؛ يُنصح بإخفاء العناصر الحساسة قبل الرفع.","目标国要求必填，缺失可能被退回":"مطلوب إلزامي من الدولة المستهدفة، وقد يُرفض الطلب في حال نقصه","去补资料":"اذهب لاستكمال البيانات","仍然投递":"إرسال على أي حال","档案已保存 · 可直接投递":"تم حفظ الملف · يمكنك الإرسال مباشرة","档案已保存 · 投递前还需补 ":"تم حفظ الملف · لا يزال عليك استكمال ","显示设置":"إعدادات العرض","字号":"حجم الخط","标准":"قياسي","跳过开机动画":"تخطي رسوم بدء التشغيل","跳过推理分析过程":"تخطي عملية التحليل الاستدلالي","恢复默认":"استعادة الافتراضي"});
  Object.assign(DICT.fr, {"加载中…":"Chargement…","刷新":"Actualiser","删除":"Supprimer","恢复":"Restaurer","处理":"Traiter","取消":"Annuler","关闭":"Fermer","确定":"Confirmer","姓名":"Nom","岗位":"Poste","国家":"Pays","匹配度":"Taux de correspondance","风险":"Risque","来源":"Source","入库":"Entrée en base","状态":"Statut","优势":"Points forts","不足":"Points faibles","五维得分":"Score à cinq dimensions","技能":"Compétences","证书":"Certificats","经验":"Expérience","语言":"Langues","合规":"Conformité","推荐面试":"Recommander pour un entretien","不推荐":"Non recommandé","推荐":"Recommandé","待定":"En attente","自动":"Automatique","手动":"Manuel","在招":"En recrutement","预警":"Alerte","低毛利":"Faible marge","已处理":"Traité","必填":"Obligatoire","禁填":"Interdit","建议隐藏":"Masquage suggéré","格式要求":"Exigences de format","注意事项":"Points d'attention","字段":"Champ","规则":"Règle","原因":"Motif","操作":"Action","依据来源":"Source de référence","更新":"Mise à jour","主库":"Base principale","待清理":"À nettoyer","回收站":"Corbeille","搜姓名 / 岗位 / 国家":"Rechercher nom / poste / pays","全部匹配度":"Tous les niveaux de correspondance","候选人":"Candidat","入库时间":"Date d'entrée","入库规则：分析完成后自动入库，低于门槛进「待清理」；删除先进回收站，保留 30 天。已推荐 / 面试中 / 已录用 不能直接删除。":"Règle d'entrée : ajout automatique après analyse ; en dessous du seuil, envoi dans « À nettoyer » ; suppression d'abord dans la corbeille, conservation 30 jours. Les profils Recommandé / En entretien / Recruté ne peuvent pas être supprimés directement.","回收站是空的":"La corbeille est vide","没有符合条件的候选人":"Aucun candidat correspondant aux critères","在招岗位":"Postes ouverts","缺口合计":"Total des écarts","人才库":"Vivier de talents","匹配达标":"Correspondance conforme","高匹配（≥80）":"Forte correspondance (≥80)","外派在册":"Enregistrés en expatriation","岗位缺口（按国家）":"Écarts de postes (par pays)","人才匹配分布":"Répartition des correspondances de talents","岗位健康度":"Santé des postes","待办":"À faire","点击查看岗位":"Cliquez pour voir le poste","实时":"Temps réel","数据来自岗位库 / 人才档案 / 保障台账":"Données issues de la base des postes / des dossiers de talents / du registre de garantie","暂无岗位数据":"Aucune donnée de poste pour le moment","营收 / 毛利 / 回款 / 账龄需要结算与发票数据，当前 store 未包含，接上后自动显示。":"Chiffre d'affaires / marge brute / encaissements / ancienneté des créances nécessitent des données de règlement et de facturation, non incluses dans le store actuel ; elles s'afficheront automatiquement une fois connectées.","候选池总量":"Total du vivier de candidats","平均招聘周期":"Cycle de recrutement moyen","面试转化率":"Taux de conversion des entretiens","合规风险":"Risque de conformité","单人成本":"Coût par personne","招聘漏斗":"Entonnoir de recrutement","人在哪一步流失":"À quelle étape les candidats se perdent","匹配度分布":"Distribution de la correspondance","10 分一档":"Par tranche de 10 points","国家意向":"Intention par pays","人数":"Nombre de personnes","合规风险热力":"Carte thermique des risques de conformité","国家 × 风险类型":"Pays × Type de risque","颜色越深，问题越多":"Plus la couleur est foncée, plus les problèmes sont nombreux","投递":"Candidature","初筛":"Présélection","面试":"Entretien","录用":"Embauche","到岗":"Prise de poste","琥珀＝达标关口":"Ambre = seuil atteint","青 60–79 · 琥珀 80+":"Cyan 60–79 · Ambre 80+","琥珀＝最大来源国":"Ambre = principal pays source","文书模板":"Modèles de documents","国别规则":"Règles par pays","规则用于简历上传前体检：必填项缺失会拦截投递，禁填项自动隐藏，建议隐藏项提示 HR 手动处理。":"Les règles servent au contrôle avant le téléversement du CV : les champs obligatoires manquants bloquent la candidature, les champs interdits sont automatiquement masqués, et les champs recommandés masqués sont signalés au RH pour traitement manuel.","如与当地法律冲突，以法律为准；规则库由保障部维护，修改后即时生效。":"En cas de conflit avec la législation locale, la loi prévaut ; la base de règles est maintenue par le département de conformité et prend effet immédiatement après modification.","项目列表":"Liste des projets","岗位生意账":"Compte d'exploitation des postes","缺口":"Écart","已推荐":"Recommandé","填补天数":"Jours de comblement","毛利率":"Marge brute","供给漏斗":"Entonnoir d'approvisionnement","阶段耗时":"Durée par étape","成本与收益":"Coûts et bénéfices","渠道费用":"Frais de canal","客户报价":"Devis client","单毛利":"Marge brute unitaire","风险与失败原因":"Risques et causes d'échec","关闭岗位":"Poste fermé","加急推荐":"Recommandation urgente","发布→首批推荐":"Publication → Premières recommandations","首批→面试":"Premières recommandations → Entretien","面试→录用":"Entretien → Embauche","录用→到岗":"Embauche → Prise de poste","匹配":"Correspondance","档案信息":"Informations du dossier","简历体检":"Bilan du CV","我的简历":"Mon CV","白纸预览 · 缺项高亮 · 演示数据":"Aperçu vierge · Éléments manquants surlignés · Données de démonstration","目标国家":"Pays cible","规则随国家变化":"Les règles varient selon le pays","简历完成度":"Taux de complétion du CV","上传前建议 100%":"100 % recommandé avant le téléversement","上传前体检":"Contrôle avant téléversement","编辑档案":"Modifier le profil","上传 / 替换简历":"Téléverser / Remplacer le CV","开始体检":"Lancer le contrôle","编辑与上传沿用「档案信息」里原有的流程；体检只检查上传前该隐藏、该补齐的项。":"La modification et le téléversement suivent le processus existant de « Informations du profil » ; le contrôle vérifie uniquement les éléments à masquer ou à compléter avant le téléversement.","健康证未上传":"Certificat de santé non téléversé","护照有效期未填":"Date d'expiration du passeport non renseignée","婚姻状况":"Situation matrimoniale","照片":"Photo","日期格式":"Format de date","去上传":"Téléverser","去补":"Compléter","一键隐藏":"Masquer en un clic","自动修正":"Correction automatique","还差：健康证、护照有效期、语言水平":"Manquant : certificat de santé, date d'expiration du passeport, niveau de langue","上传后才能通过体检":"Le contrôle ne peut être validé qu'après le téléversement","需 ≥18 个月":"Requis ≥ 18 mois","建议隐藏，与岗位无关":"Recommandé de masquer, sans rapport avec le poste","已按该国规则隐藏":"Masqué selon les règles du pays","2021.03 与 2021-03 统一为 2021-03":"2021.03 et 2021-03 unifiés en 2021-03","投递前体检":"Contrôle avant candidature","继续上传":"Continuer le téléversement","缺项不影响上传，但投递前必须补齐；敏感项建议上传前隐藏。":"Les éléments manquants n'empêchent pas le téléversement, mais doivent être complétés avant la candidature ; il est recommandé de masquer les éléments sensibles avant le téléversement.","目标国要求必填，缺失可能被退回":"Champ obligatoire selon les exigences du pays de destination, son absence peut entraîner un rejet","去补资料":"Aller compléter les informations","仍然投递":"Soumettre quand même","档案已保存 · 可直接投递":"Dossier enregistré · Prêt à être soumis","档案已保存 · 投递前还需补 ":"Dossier enregistré · Il reste à compléter avant soumission ","显示设置":"Paramètres d'affichage","字号":"Taille de police","标准":"Standard","跳过开机动画":"Ignorer l'animation de démarrage","跳过推理分析过程":"Ignorer le processus d'analyse déductive","恢复默认":"Rétablir les valeurs par défaut"});

  /* 控制台英文源文案 */
  Object.assign(DICT.th, {"Open roles":"ตำแหน่งที่เปิดรับ","Total openings":"จำนวนอัตรารวม","Talent pool":"คลังบุคลากร","Qualified":"ผ่านคุณสมบัติ","High match (≥80)":"ความเหมาะสมสูง (≥80)","On site":"ปฏิบัติงานหน้างาน","from job bank":"จากธนาคารงาน","sum of headcount":"ผลรวมจำนวนพนักงาน","from talent records":"จากบันทึกบุคลากร","qualified":"มีคุณสมบัติ","ready to refer":"พร้อมแนะนำ","assurance ledger":"บัญชีค้ำประกัน","Job openings by country":"ตำแหน่งงานแยกตามประเทศ","Talent match distribution":"การกระจายความเหมาะสมของบุคลากร","Open over 30 days":"เปิดรับเกิน 30 วัน","Risks & tickets":"ความเสี่ยงและตั๋วงาน","Fund requests pending":"คำขอเงินรอดำเนินการ","Watch":"เฝ้าติดตาม","Revenue / margin / collection / aging need settlement & invoice data; not present in store yet, it will show once connected.":"รายได้ / กำไร / การเรียกเก็บเงิน / อายุหนี้ ต้องใช้ข้อมูลการชำระบัญชีและใบแจ้งหนี้ ซึ่งยังไม่มีในระบบ จะแสดงเมื่อเชื่อมต่อแล้ว","Job health":"สุขภาพงาน","Role health":"สุขภาพบทบาท","Click to view role":"คลิกเพื่อดูบทบาท","Live":"สด","No role data":"ไม่มีข้อมูลบทบาท","Match distribution":"การกระจายของคะแนนแมตช์","Openings by country":"ตำแหน่งงานแยกตามประเทศ","From roles / talent / assurance data":"จากข้อมูลบทบาท / บุคลากร / การรับรอง"});
  Object.assign(DICT.ja, {"Open roles":"募集中の職種","Total openings":"募集枠合計","Talent pool":"タレントプール","Qualified":"適格","High match (≥80)":"高マッチ（≥80）","On site":"オンサイト","from job bank":"ジョブバンクより","sum of headcount":"人員数の合計","from talent records":"人材記録より","qualified":"適格","ready to refer":"紹介可能","assurance ledger":"保証台帳","Job openings by country":"国別の求人","Talent match distribution":"人材マッチ分布","Open over 30 days":"30日以上募集中","Risks & tickets":"リスクとチケット","Fund requests pending":"資金申請保留中","Watch":"監視","Revenue / margin / collection / aging need settlement & invoice data; not present in store yet, it will show once connected.":"収益／マージン／回収／エイジングには決済・請求データが必要です。まだストアに存在しないため、接続後に表示されます。","Job health":"求人の健全性","Role health":"ロールの健全性","Click to view role":"クリックして職種を表示","Live":"ライブ","No role data":"職種データなし","Match distribution":"マッチ分布","Openings by country":"国別の募集枠","From roles / talent / assurance data":"職種／人材／保証データより"});
  Object.assign(DICT.ar, {"Open roles":"الوظائف المفتوحة","Total openings":"إجمالي الشواغر","Talent pool":"مجمع المواهب","Qualified":"مؤهل","High match (≥80)":"تطابق عالٍ (≥80)","On site":"في الموقع","from job bank":"من بنك الوظائف","sum of headcount":"مجموع عدد الموظفين","from talent records":"من سجلات المواهب","qualified":"مؤهل","ready to refer":"جاهز للإحالة","assurance ledger":"دفتر الضمان","Job openings by country":"الوظائف الشاغرة حسب البلد","Talent match distribution":"توزيع تطابق المواهب","Open over 30 days":"مفتوح لأكثر من 30 يومًا","Risks & tickets":"المخاطر والتذاكر","Fund requests pending":"طلبات التمويل المعلقة","Watch":"مراقبة","Revenue / margin / collection / aging need settlement & invoice data; not present in store yet, it will show once connected.":"الإيرادات / الهامش / التحصيل / التقادم تحتاج إلى بيانات التسوية والفاتورة؛ غير موجودة في المتجر بعد، وستظهر بمجرد الاتصال.","Job health":"صحة الوظيفة","Role health":"سلامة الأدوار","Click to view role":"انقر لعرض الدور","Live":"مباشر","No role data":"لا توجد بيانات دور","Match distribution":"توزيع التطابق","Openings by country":"الشواغر حسب البلد","From roles / talent / assurance data":"من بيانات الأدوار / المواهب / الضمان"});
  Object.assign(DICT.fr, {"Open roles":"Postes ouverts","Total openings":"Total des postes à pourvoir","Talent pool":"Vivier de talents","Qualified":"Qualifiés","High match (≥80)":"Correspondance élevée (≥80)","On site":"Sur site","from job bank":"de la banque de postes","sum of headcount":"somme des effectifs","from talent records":"des dossiers de talents","qualified":"qualifié","ready to refer":"prêts à être recommandés","assurance ledger":"registre d'assurance","Job openings by country":"Postes ouverts par pays","Talent match distribution":"Répartition des correspondances de talents","Open over 30 days":"Ouvert depuis plus de 30 jours","Risks & tickets":"Risques et tickets","Fund requests pending":"Demandes de fonds en attente","Watch":"Surveiller","Revenue / margin / collection / aging need settlement & invoice data; not present in store yet, it will show once connected.":"Revenus / marge / recouvrement / vieillissement nécessitent des données de règlement et de facturation ; pas encore présentes dans le magasin, elles s'afficheront une fois connectées.","Job health":"Santé des emplois","Role health":"Santé du rôle","Click to view role":"Cliquez pour voir le rôle","Live":"En direct","No role data":"Aucune donnée de rôle","Match distribution":"Répartition des correspondances","Openings by country":"Postes ouverts par pays","From roles / talent / assurance data":"À partir des données rôles / talents / assurance"});

  /* 概览台残留 */
  Object.assign(DICT.th, {"1 个新项目待立项":"มี 1 โครงการใหม่รอการอนุมัติจัดตั้ง","6 个项目在册":"มี 6 โครงการขึ้นทะเบียน","0 笔账单待确认":"0 บิลที่รอยืนยัน","3 项":"3 รายการ","阿尔及利亚玻璃制品工厂 · 中方派遣链":"โรงงานผลิตภัณฑ์แก้วแอลจีเรีย · สายการส่งบุคลากรจากจีน","待提交岗位需求":"ตำแหน่งงานที่รอส่ง","进行中":"กำลังดำเนินการ","结算账单确认":"การยืนยันบิลชำระบัญชี","阿尔及利亚项目 9 月账单 · 截止明日":"บิลเดือนกันยายนของโครงการแอลจีเรีย · ครบกำหนดพรุ่งนี้","待处理":"รอดำเนินการ","5 名派遣人员签证材料补交":"ยื่นเอกสารวีซ่าเพิ่มเติมสำหรับบุคลากรที่ส่งไป 5 คน","学历证明扫描件 · 影响签证预审":"สำเนาใบรับรองการศึกษา · กระทบการตรวจสอบวีซ่าเบื้องต้น","当地雇员保险续保确认":"ยืนยันการต่ออายุประกันภัยพนักงานท้องถิ่น","3 人保单将于 11 月到期":"กรมธรรม์ของ 3 คนจะหมดอายุในเดือนพฤศจิกายน","提醒":"แจ้งเตือน","晚上好":"สวัสดีตอนเย็น","上午好":"สวัสดีตอนเช้า","中午好":"สวัสดีตอนเที่ยง","下午好":"สวัสดีตอนบ่าย","凌晨好":"สวัสดีตอนเช้ามืด"});
  Object.assign(DICT.ja, {"1 个新项目待立项":"新規プロジェクト1件が立ち上げ待ち","6 个项目在册":"プロジェクト6件が登録済み","0 笔账单待确认":"確認待ちの請求書0件","3 项":"3項目","阿尔及利亚玻璃制品工厂 · 中方派遣链":"アルジェリアガラス製品工場・中国側派遣チェーン","待提交岗位需求":"職務要件の提出待ち","进行中":"進行中","结算账单确认":"決済請求書の確認","阿尔及利亚项目 9 月账单 · 截止明日":"アルジェリアプロジェクト 9月請求書 · 明日締切","待处理":"未処理","5 名派遣人员签证材料补交":"派遣人員5名のビザ材料追加提出","学历证明扫描件 · 影响签证预审":"学歴証明書のスキャン件 · ビザ事前審査に影響","当地雇员保险续保确认":"現地雇用者の保険更新確認","3 人保单将于 11 月到期":"3名の保険証券が11月に満期","提醒":"リマインダー","晚上好":"こんばんは","上午好":"おはようございます","中午好":"こんにちは","下午好":"こんにちは","凌晨好":"おはようございます"});
  Object.assign(DICT.ar, {"1 个新项目待立项":"مشروع جديد واحد بانتظار الإنشاء","6 个项目在册":"6 مشاريع مسجلة","0 笔账单待确认":"0 فاتورة بانتظار التأكيد","3 项":"3 بنود","阿尔及利亚玻璃制品工厂 · 中方派遣链":"مصنع الزجاج في الجزائر · سلسلة الإيفاد الصيني","待提交岗位需求":"متطلبات الوظيفة المعلقة للتقديم","进行中":"قيد التنفيذ","结算账单确认":"تأكيد فاتورة التسوية","阿尔及利亚项目 9 月账单 · 截止明日":"فاتورة سبتمبر لمشروع الجزائر · تنتهي غداً","待处理":"قيد المعالجة","5 名派遣人员签证材料补交":"تقديم مستندات تأشيرة 5 موظفين مُوفدين بشكل إضافي","学历证明扫描件 · 影响签证预审":"نسخ ممسوحة ضوئياً من شهادات التعليم · تؤثر على الفحص المسبق للتأشيرة","当地雇员保险续保确认":"تأكيد تجديد تأمين الموظفين المحليين","3 人保单将于 11 月到期":"3 وثائق تأمين تنتهي في نوفمبر","提醒":"تذكير","晚上好":"مساء الخير","上午好":"صباح الخير","中午好":"طاب منتصف النهار","下午好":"طاب بعد الظهر","凌晨好":"طاب السحر"});
  Object.assign(DICT.fr, {"1 个新项目待立项":"1 nouveau projet en attente de lancement","6 个项目在册":"6 projets enregistrés","0 笔账单待确认":"0 facture à confirmer","3 项":"3 éléments","阿尔及利亚玻璃制品工厂 · 中方派遣链":"Usine de produits en verre en Algérie · Chaîne d'envoi de personnel chinois","待提交岗位需求":"Demande de poste à soumettre","进行中":"En cours","结算账单确认":"Confirmation de facture de règlement","阿尔及利亚项目 9 月账单 · 截止明日":"Facture de septembre du projet Algérie · échéance demain","待处理":"En attente de traitement","5 名派遣人员签证材料补交":"Complément des documents de visa pour 5 personnes détachées","学历证明扫描件 · 影响签证预审":"Copies numérisées des diplômes · impact sur la pré-évaluation des visas","当地雇员保险续保确认":"Confirmation du renouvellement de l'assurance des employés locaux","3 人保单将于 11 月到期":"Les polices de 3 personnes expirent en novembre","提醒":"Rappel","晚上好":"Bonsoir","上午好":"Bonjour","中午好":"Bon midi","下午好":"Bon après-midi","凌晨好":"Bon début de matinée"});

  /* 概览桥接 */
  Object.assign(DICT.th, {"笔账单待确认":"บิลที่รอการยืนยัน","个项目在册":"โครงการที่ลงทะเบียน","当前账号无账单查看权限":"บัญชีปัจจุบันไม่มีสิทธิ์ดูใบแจ้งหนี้","企业成员":"สมาชิกองค์กร","项目人力资源负责人":"ผู้รับผิดชอบทรัพยากรบุคคลของโครงการ","今日有":"วันนี้มี","个项目在办":"โครงการที่อยู่ระหว่างดำเนินการ"});
  Object.assign(DICT.ja, {"笔账单待确认":"未確認の請求書","个项目在册":"件のプロジェクトが在籍","当前账号无账单查看权限":"現在のアカウントには請求書閲覧権限がありません","企业成员":"企業メンバー","项目人力资源负责人":"プロジェクト人材責任者","今日有":"本日","个项目在办":"件のプロジェクトが進行中"});
  Object.assign(DICT.ar, {"笔账单待确认":"فاتورة قيد التأكيد","个项目在册":"مشاريع مسجلة","当前账号无账单查看权限":"الحساب الحالي لا يملك صلاحية عرض الفواتير","企业成员":"أعضاء المؤسسة","项目人力资源负责人":"مسؤول الموارد البشرية للمشروع","今日有":"اليوم هناك","个项目在办":"مشاريع قيد التنفيذ"});
  Object.assign(DICT.fr, {"笔账单待确认":"Facture en attente de confirmation","个项目在册":"projets enregistrés","当前账号无账单查看权限":"Le compte actuel n'a pas la permission de consulter les factures","企业成员":"Membre de l'entreprise","项目人力资源负责人":"Responsable des ressources humaines du projet","今日有":"Aujourd'hui, il y a","个项目在办":"projets en cours"});

  Object.assign(DICT.fr,{'个':'projets','人':'personnes','万':'dix mille'});
  Object.assign(DICT.th,{'个':'โครงการ','人':'คน','万':'หมื่น'});
  Object.assign(DICT.ja,{'个':'件','人':'人','万':'万'});
  Object.assign(DICT.ar,{'个':'مشاريع','人':'أشخاص','万':'عشرة آلاف'});
  /* 项目管理 */
  Object.assign(DICT.th, {"健康度":"ระดับสุขภาพ","新建岗位":"สร้างตำแหน่งงานใหม่","新建项目":"สร้างโครงการใหม่","岗位管理":"การจัดการตำแหน่งงาน","保存但未发布的岗位可在这里编辑、发布或删除":"ตำแหน่งงานที่บันทึกแต่ยังไม่เผยแพร่สามารถแก้ไข เผยแพร่ หรือลบได้ที่นี่","全部":"ทั้งหมด","草稿（未发布）":"ฉบับร่าง (ยังไม่เผยแพร่)","已发布":"เผยแพร่แล้ว","演示数据":"ข้อมูลสาธิต","薪资待定":"เงินเดือนรอเจรจา","预览":"ดูตัวอย่าง","编辑":"แก้ไข","发布":"เผยแพร่","删除":"ลบ","取消发布":"ยกเลิกการเผยแพร่"});
  Object.assign(DICT.ja, {"新建岗位":"求人を新規作成","新建项目":"新規プロジェクト","岗位管理":"求人管理","保存但未发布的岗位可在这里编辑、发布或删除":"保存済みで未公開の求人はここで編集、公開、削除できます","全部":"すべて","草稿（未发布）":"下書き（未公開）","已发布":"公開済み","演示数据":"デモデータ","薪资待定":"給与は応相談","预览":"プレビュー","编辑":"編集","发布":"公開","删除":"削除","取消发布":"公開を取消"});
  Object.assign(DICT.ar, {"健康度":"مستوى الصحة","新建岗位":"وظيفة جديدة","新建项目":"مشروع جديد","岗位管理":"إدارة الوظائف","保存但未发布的岗位可在这里编辑、发布或删除":"يمكن تعديل الوظائف المحفوظة غير المنشورة أو نشرها أو حذفها هنا","全部":"الكل","草稿（未发布）":"مسودة (غير منشورة)","已发布":"منشورة","演示数据":"بيانات تجريبية","薪资待定":"الراتب غير محدد","预览":"معاينة","编辑":"تعديل","发布":"نشر","删除":"حذف","取消发布":"إلغاء النشر"});
  Object.assign(DICT.fr, {"健康度":"Niveau de santé","新建岗位":"Nouveau poste","新建项目":"Nouveau projet","岗位管理":"Gestion des postes","保存但未发布的岗位可在这里编辑、发布或删除":"Les postes enregistrés mais non publiés peuvent être modifiés, publiés ou supprimés ici","全部":"Tout","草稿（未发布）":"Brouillon (non publié)","已发布":"Publié","演示数据":"Données de démonstration","薪资待定":"Salaire à déterminer","预览":"Aperçu","编辑":"Modifier","发布":"Publier","删除":"Supprimer","取消发布":"Dépublier"});

  Object.assign(DICT.fr,{'招':'Recrute'}); Object.assign(DICT.th,{'招':'รับ'}); Object.assign(DICT.ja,{'招':'募集'}); Object.assign(DICT.ar,{'招':'توظيف'});
  /* 经营看板/服务 */
  Object.assign(DICT.th, {"经营概览":"ภาพรวมการดำเนินงาน","候选池分析":"การวิเคราะห์กลุ่มผู้สมัคร","单岗位分析":"การวิเคราะห์รายตำแหน่ง","发起岗位需求":"สร้างความต้องการตำแหน่งงาน","发布面向国内 / 目的国的招聘用工信息":"เผยแพร่ข้อมูลการรับสมัครและจ้างงานสำหรับในประเทศ / ประเทศปลายทาง","项目":"โครงการ","岗位名称与人数":"ชื่อตำแหน่งและจำนวนคน","匹配评分规则":"กฎการให้คะแนนการจับคู่","发布时即设定，权重会归一化到 100":"ตั้งค่าเมื่อเผยแพร่ น้ำหนักจะถูกปรับให้เป็น 100","恢复默认":"คืนค่าเริ่มต้น","合计":"รวม","/ 归一化 100":"/ ปรับให้เป็นมาตรฐาน 100","发布岗位":"เผยแพร่ตำแหน่งงาน","已发布岗位：":"ตำแหน่งงานที่เผยแพร่แล้ว:","增值服务":"บริการเสริม","AI 免费 · 合作交付":"AI ฟรี · ส่งมอบแบบร่วมมือ","签证可行性预审":"ตรวจสอบเบื้องต้นความเป็นไปได้ของวีซ่า","上传证件 → 出具可行性报告（AI）":"อัปโหลดเอกสาร → ออกรายงานความเป็นไปได้ (AI)","AI 免费":"AI ฟรี","简历翻译润色":"แปลและปรับปรุงเรซูเม่","中 / 英 / 法 / 阿互译（AI）":"แปลจีน / อังกฤษ / ฝรั่งเศส / อาหรับ (AI)","目的国政策问答":"ถามตอบนโยบายประเทศปลายทาง","劳动法 / 社保 / 个税问答（AI）":"ถามตอบกฎหมายแรงงาน / ประกันสังคม / ภาษีบุคคล (AI)","同传面试":"สัมภาษณ์แบบแปลสด","多语言实时同传在线面试":"สัมภาษณ์ออนไลน์แปลสดหลายภาษาแบบเรียลไทม์","护照 / 工作签证代办":"ดำเนินการหนังสือเดินทาง / วีซ่าทำงาน","含加急、续签":"รวมบริการเร่งด่วน ต่ออายุ","合作服务商":"ผู้ให้บริการพันธมิตร","境外意外 / 雇主责任险":"ประกันอุบัติเหตุต่างประเทศ / ประกันความรับผิดของนายจ้าง","百万级保额":"วงเงินคุ้มครองระดับล้าน","工资代发与国际结汇":"การจ่ายค่าจ้างแทนและการโอนเงินระหว่างประเทศ","多币种跨境支付":"การชำระเงินข้ามพรมแดนหลายสกุลเงิน","当地备案代办":"บริการยื่นจดทะเบียนในท้องถิ่น","工作许可、居留许可":"ใบอนุญาตทำงาน ใบอนุญาตพำนัก","结算对账":"การกระทบยอดการชำระบัญชี","系统生成账单 · 企业确认或提出异议":"ระบบสร้างใบแจ้งหนี้ · องค์กรยืนยันหรือยื่นข้อโต้แย้ง"});
  Object.assign(DICT.ja, {"经营概览":"経営概況","候选池分析":"候補者プール分析","单岗位分析":"単一職種分析","发起岗位需求":"求人ニーズを起案する","发布面向国内 / 目的国的招聘用工信息":"国内／受入国の求人・雇用情報を公開する","项目":"プロジェクト","岗位名称与人数":"職種名と人数","匹配评分规则":"マッチングスコアのルール","发布时即设定，权重会归一化到 100":"公開時に設定、重みは100に正規化されます","恢复默认":"デフォルトに戻す","合计":"合計","/ 归一化 100":"/ 正規化 100","发布岗位":"求人を公開する","已发布岗位：":"公開済みの求人：","增值服务":"付加価値サービス","AI 免费 · 合作交付":"AI 無料・提携提供","签证可行性预审":"ビザ実現可能性の事前審査","上传证件 → 出具可行性报告（AI）":"書類をアップロード → 実現可能性レポートを発行（AI）","AI 免费":"AI 無料","简历翻译润色":"履歴書の翻訳・推敲","中 / 英 / 法 / 阿互译（AI）":"中／英／仏／アラビア語の相互翻訳（AI）","目的国政策问答":"受入国の政策Q&A","劳动法 / 社保 / 个税问答（AI）":"労働法／社会保険／個人所得税のQ&A（AI）","同传面试":"同時通訳面接","多语言实时同传在线面试":"多言語リアルタイム同時通訳オンライン面接","护照 / 工作签证代办":"パスポート／就労ビザの代行手続き","含加急、续签":"急ぎ対応・更新を含む","合作服务商":"提携サービス事業者","境外意外 / 雇主责任险":"海外傷害保険／雇主責任保険","百万级保额":"百万級の保険金額","工资代发与国际结汇":"給与代理支払いと国際決済","多币种跨境支付":"多通貨クロスボーダー決済","当地备案代办":"現地届出代行","工作许可、居留许可":"就労許可、居留許可","结算对账":"決済照合","系统生成账单 · 企业确认或提出异议":"システム生成請求書 · 企業確認または異議申立て"});
  Object.assign(DICT.ar, {"经营概览":"نظرة عامة على الأعمال","候选池分析":"تحليل مجموعة المرشحين","单岗位分析":"تحليل وظيفة واحدة","发起岗位需求":"بدء طلب الوظيفة","发布面向国内 / 目的国的招聘用工信息":"نشر معلومات التوظيف والتشغيل الموجهة للداخل / الدولة المستهدفة","项目":"المشروع","岗位名称与人数":"اسم الوظيفة وعدد الأشخاص","匹配评分规则":"قواعد تقييم المطابقة","发布时即设定，权重会归一化到 100":"تُحدَّد عند النشر، ويتم تطبيع الأوزان إلى 100","恢复默认":"استعادة الافتراضي","合计":"الإجمالي","/ 归一化 100":"/ تطبيع 100","发布岗位":"نشر الوظيفة","已发布岗位：":"الوظائف المنشورة:","增值服务":"خدمات القيمة المضافة","AI 免费 · 合作交付":"AI مجاناً · تسليم بالتعاون","签证可行性预审":"الفحص المسبق لجدوى التأشيرة","上传证件 → 出具可行性报告（AI）":"رفع المستندات → إصدار تقرير الجدوى (AI)","AI 免费":"AI مجاناً","简历翻译润色":"ترجمة وتنقيح السيرة الذاتية","中 / 英 / 法 / 阿互译（AI）":"ترجمة متبادلة بين الصينية / الإنجليزية / الفرنسية / العربية (AI)","目的国政策问答":"أسئلة وأجوبة حول سياسات الدولة المستهدفة","劳动法 / 社保 / 个税问答（AI）":"أسئلة وأجوبة حول قانون العمل / الضمان الاجتماعي / ضريبة الدخل الفردي (AI)","同传面试":"مقابلة مع ترجمة فورية","多语言实时同传在线面试":"مقابلة عبر الإنترنت بترجمة فورية متعددة اللغات في الوقت الفعلي","护照 / 工作签证代办":"إجراءات جواز السفر / تأشيرة العمل","含加急、续签":"تشمل المعالجة العاجلة والتجديد","合作服务商":"مزود خدمة متعاون","境外意外 / 雇主责任险":"تأمين الحوادث في الخارج / مسؤولية صاحب العمل","百万级保额":"تغطية تأمينية بملايين","工资代发与国际结汇":"صرف الرواتب والتسوية الدولية للعملات","多币种跨境支付":"مدفوعات عبر الحدود متعددة العملات","当地备案代办":"خدمة التسجيل المحلي بالنيابة","工作许可、居留许可":"تصريح العمل وتصريح الإقامة","结算对账":"مطابقة التسوية","系统生成账单 · 企业确认或提出异议":"فاتورة مُنشأة من النظام · تأكيد المؤسسة أو تقديم اعتراض"});
  Object.assign(DICT.fr, {"经营概览":"Aperçu de l'activité","候选池分析":"Analyse du vivier de candidats","单岗位分析":"Analyse par poste","发起岗位需求":"Créer une demande de poste","发布面向国内 / 目的国的招聘用工信息":"Publier des informations de recrutement et d'emploi pour le pays d'origine / le pays de destination","项目":"Projet","岗位名称与人数":"Intitulé du poste et nombre de personnes","匹配评分规则":"Règles de notation de correspondance","发布时即设定，权重会归一化到 100":"Défini lors de la publication, les pondérations sont normalisées à 100","恢复默认":"Rétablir les valeurs par défaut","合计":"Total","/ 归一化 100":"/ normalisé à 100","发布岗位":"Publier le poste","已发布岗位：":"Postes publiés :","增值服务":"Services à valeur ajoutée","AI 免费 · 合作交付":"IA gratuite · Livraison en partenariat","签证可行性预审":"Pré-examen de faisabilité du visa","上传证件 → 出具可行性报告（AI）":"Téléverser les documents → Émettre un rapport de faisabilité (IA)","AI 免费":"IA gratuite","简历翻译润色":"Traduction et perfectionnement du CV","中 / 英 / 法 / 阿互译（AI）":"Traduction mutuelle chinois / anglais / français / arabe (IA)","目的国政策问答":"Questions-réponses sur les politiques du pays de destination","劳动法 / 社保 / 个税问答（AI）":"Questions-réponses sur le droit du travail / la sécurité sociale / l'impôt sur le revenu des personnes physiques (IA)","同传面试":"Entretien avec interprétation simultanée","多语言实时同传在线面试":"Entretien en ligne multilingue avec interprétation simultanée en temps réel","护照 / 工作签证代办":"Services de passeport / visa de travail","含加急、续签":"Y compris traitement accéléré et renouvellement","合作服务商":"Prestataire partenaire","境外意外 / 雇主责任险":"Assurance accidents à l'étranger / responsabilité de l'employeur","百万级保额":"Couverture à hauteur de millions","工资代发与国际结汇":"Versement des salaires et règlement de devises international","多币种跨境支付":"Paiements transfrontaliers multidevises","当地备案代办":"Services d'enregistrement local","工作许可、居留许可":"Permis de travail, titre de séjour","结算对账":"Règlement et rapprochement","系统生成账单 · 企业确认或提出异议":"Facture générée par le système · Confirmation ou contestation par l'entreprise"});

  /* 岗位弹窗 */
  Object.assign(DICT.th, {"发布后，应聘者可在岗位发现中看到这个岗位。确认发布吗？":"หลังจากเผยแพร่แล้ว ผู้สมัครจะเห็นตำแหน่งงานนี้ในส่วนการค้นหาตำแหน่งงาน ยืนยันการเผยแพร่หรือไม่?","取消发布后，岗位将从应聘者端下架。确认取消吗？":"หลังจากยกเลิกการเผยแพร่ ตำแหน่งงานจะถูกนำออกจากฝั่งผู้สมัคร ยืนยันการยกเลิกหรือไม่?","再想想":"คิดอีกที","确认发布":"ยืนยันการเผยแพร่","确认取消":"ยืนยันการยกเลิก","已取消发布":"ยกเลิกการเผยแพร่แล้ว","应聘者现在可以看到这个岗位":"ผู้สมัครสามารถเห็นตำแหน่งงานนี้ได้แล้ว","岗位已从应聘者端下架":"ตำแหน่งงานถูกนำออกจากฝั่งผู้สมัครแล้ว"});
  Object.assign(DICT.ja, {"发布后，应聘者可在岗位发现中看到这个岗位。确认发布吗？":"公開後、応募者は求人発見でこの求人を閲覧できるようになります。公開を確認しますか？","取消发布后，岗位将从应聘者端下架。确认取消吗？":"公開をキャンセルすると、求人は応募者側から非表示になります。キャンセルを確認しますか？","再想想":"もう一度考える","确认发布":"公開を確認","确认取消":"キャンセルを確認","已取消发布":"公開をキャンセルしました","应聘者现在可以看到这个岗位":"応募者は現在この求人を閲覧できます","岗位已从应聘者端下架":"求人は応募者側から非表示になりました"});
  Object.assign(DICT.ar, {"发布后，应聘者可在岗位发现中看到这个岗位。确认发布吗？":"بعد النشر، سيتمكن المتقدمون من رؤية هذه الوظيفة في اكتشاف الوظائف. هل تؤكد النشر؟","取消发布后，岗位将从应聘者端下架。确认取消吗？":"بعد إلغاء النشر، ستتم إزالة الوظيفة من جانب المتقدمين. هل تؤكد الإلغاء؟","再想想":"سأفكر مرة أخرى","确认发布":"تأكيد النشر","确认取消":"تأكيد الإلغاء","已取消发布":"تم إلغاء النشر","应聘者现在可以看到这个岗位":"يمكن للمتقدمين الآن رؤية هذه الوظيفة","岗位已从应聘者端下架":"تمت إزالة الوظيفة من جانب المتقدمين"});
  Object.assign(DICT.fr, {"发布后，应聘者可在岗位发现中看到这个岗位。确认发布吗？":"Après publication, les candidats pourront voir ce poste dans la découverte d'emplois. Confirmer la publication ?","取消发布后，岗位将从应聘者端下架。确认取消吗？":"Après annulation de la publication, le poste sera retiré de l'espace candidat. Confirmer l'annulation ?","再想想":"Réfléchir encore","确认发布":"Confirmer la publication","确认取消":"Confirmer l'annulation","已取消发布":"Publication annulée","应聘者现在可以看到这个岗位":"Les candidats peuvent désormais voir ce poste","岗位已从应聘者端下架":"Le poste a été retiré de l'espace candidat"});

  /* 岗位预览 */
  Object.assign(DICT.th, {"招聘":"รับสมัครงาน","合同":"สัญญา","企业岗位":"ตำแหน่งงานองค์กร","招聘中":"กำลังรับสมัคร","待发布":"รอเผยแพร่","岗位职责":"หน้าที่ความรับผิดชอบ","任职要求":"คุณสมบัติผู้สมัคร","硬性条件":"เงื่อนไขบังคับ","优先条件":"เงื่อนไขพิเศษ","工作与生活":"การทำงานและชีวิตความเป็นอยู่","福利":"สวัสดิการ","合同与手续":"สัญญาและขั้นตอน","合同周期":"ระยะเวลาสัญญา","工作地点":"สถานที่ทำงาน","招聘信息":"ข้อมูลการรับสมัครงาน","招聘人数":"จำนวนที่รับสมัคร","状态":"สถานะ","项目":"โครงการ","岗位标签":"แท็กตำแหน่งงาน","下一步":"ถัดไป","先做 AI 诊断，确认职责/硬性要求/合规信息完整，再发布岗位。":"ทำการวินิจฉัยด้วย AI ก่อน เพื่อยืนยันว่าข้อมูลหน้าที่ความรับผิดชอบ/ข้อกำหนดที่จำเป็น/ข้อมูลด้านการปฏิบัติตามกฎระเบียบครบถ้วน แล้วจึงเผยแพร่ตำแหน่งงาน","岗位编号":"หมายเลขตำแหน่งงาน","企业填写 · 平台结构化展示":"กรอกโดยองค์กร · แสดงผลแบบมีโครงสร้างโดยแพลตฟอร์ม","岗位预览":"ตัวอย่างตำแหน่งงาน","返回列表":"กลับไปที่รายการ","AI 诊断":"AI วินิจฉัย","AI 诊断基于当前保存版本；修改岗位后需要重新诊断。":"การวินิจฉัย AI อ้างอิงจากเวอร์ชันที่บันทึกไว้ปัจจุบัน หากแก้ไขตำแหน่งงานต้องวินิจฉัยใหม่","未命名岗位":"ตำแหน่งงานที่ไม่มีชื่อ","未填写项目":"รายการที่ยังไม่ได้กรอก","面议":"ต่อรองได้","待补充":"รอการเพิ่มเติม"});
  Object.assign(DICT.ja, {"招聘":"募集","合同":"契約","企业岗位":"企業求人","招聘中":"募集中","待发布":"公開待ち","岗位职责":"職務内容","任职要求":"応募資格","硬性条件":"必須条件","优先条件":"歓迎条件","工作与生活":"仕事と生活","福利":"福利厚生","合同与手续":"契約と手続き","合同周期":"契約期間","工作地点":"勤務地","招聘信息":"募集情報","招聘人数":"募集人数","状态":"ステータス","项目":"プロジェクト","岗位标签":"求人タグ","下一步":"次へ","先做 AI 诊断，确认职责/硬性要求/合规信息完整，再发布岗位。":"まずAI診断を実施し、職務内容・必須条件・コンプライアンス情報が完全であることを確認してから、求人を公開してください。","岗位编号":"求人番号","企业填写 · 平台结构化展示":"企業入力・プラットフォームによる構造化表示","岗位预览":"求人プレビュー","返回列表":"一覧に戻る","AI 诊断":"AI診断","AI 诊断基于当前保存版本；修改岗位后需要重新诊断。":"AI診断は現在保存されているバージョンに基づきます。求人を変更した場合は再診断が必要です。","未命名岗位":"名称未設定の求人","未填写项目":"未入力項目","面议":"応相談","待补充":"追記予定"});
  Object.assign(DICT.ar, {"招聘":"التوظيف","合同":"العقد","企业岗位":"وظائف الشركات","招聘中":"قيد التوظيف","待发布":"بانتظار النشر","岗位职责":"المسؤوليات الوظيفية","任职要求":"متطلبات الوظيفة","硬性条件":"الشروط الإلزامية","优先条件":"الشروط التفضيلية","工作与生活":"العمل والحياة","福利":"المزايا","合同与手续":"العقد والإجراءات","合同周期":"مدة العقد","工作地点":"مكان العمل","招聘信息":"معلومات التوظيف","招聘人数":"عدد الوظائف الشاغرة","状态":"الحالة","项目":"المشروع","岗位标签":"وسوم الوظيفة","下一步":"التالي","先做 AI 诊断，确认职责/硬性要求/合规信息完整，再发布岗位。":"قم أولاً بإجراء تشخيص AI للتأكد من اكتمال المسؤوليات/المتطلبات الإلزامية/معلومات الامتثال، ثم انشر الوظيفة.","岗位编号":"رقم الوظيفة","企业填写 · 平台结构化展示":"إدخال الشركة · عرض منظم من المنصة","岗位预览":"معاينة الوظيفة","返回列表":"العودة إلى القائمة","AI 诊断":"تشخيص AI","AI 诊断基于当前保存版本；修改岗位后需要重新诊断。":"يعتمد تشخيص AI على النسخة المحفوظة الحالية؛ بعد تعديل الوظيفة يجب إعادة التشخيص.","未命名岗位":"وظيفة بدون اسم","未填写项目":"عناصر غير مكتملة","面议":"قابل للتفاوض","待补充":"بانتظار الإكمال"});
  Object.assign(DICT.fr, {"招聘":"Recrutement","合同":"Contrat","企业岗位":"Poste en entreprise","招聘中":"En cours de recrutement","待发布":"À publier","岗位职责":"Responsabilités du poste","任职要求":"Exigences du poste","硬性条件":"Conditions obligatoires","优先条件":"Conditions préférentielles","工作与生活":"Travail et vie","福利":"Avantages","合同与手续":"Contrat et formalités","合同周期":"Durée du contrat","工作地点":"Lieu de travail","招聘信息":"Informations de recrutement","招聘人数":"Nombre de postes","状态":"Statut","项目":"Projet","岗位标签":"Étiquettes du poste","下一步":"Suivant","先做 AI 诊断，确认职责/硬性要求/合规信息完整，再发布岗位。":"Effectuez d'abord un diagnostic IA pour vérifier que les responsabilités, les exigences obligatoires et les informations de conformité sont complètes, puis publiez le poste.","岗位编号":"Numéro du poste","企业填写 · 平台结构化展示":"Rempli par l'entreprise · Affichage structuré par la plateforme","岗位预览":"Aperçu du poste","返回列表":"Retour à la liste","AI 诊断":"Diagnostic IA","AI 诊断基于当前保存版本；修改岗位后需要重新诊断。":"Le diagnostic IA est basé sur la version actuellement enregistrée ; après modification du poste, un nouveau diagnostic est nécessaire.","未命名岗位":"Poste sans nom","未填写项目":"Élément non renseigné","面议":"À négocier","待补充":"À compléter"});

  Object.assign(DICT.th,{'驻':'ประจำ','草稿':'ฉบับร่าง'}); Object.assign(DICT.fr,{'驻':'basé à','草稿':'Brouillon'}); Object.assign(DICT.ja,{'驻':'駐在','草稿':'下書き'}); Object.assign(DICT.ar,{'驻':'مقر','草稿':'مسودة'});
  /* 岗位编辑 */
  Object.assign(DICT.th, {"岗位名称":"ชื่อตำแหน่งงาน","项目":"โครงการ","国家":"ประเทศ","招聘人数":"จำนวนที่รับสมัคร","合同周期":"ระยะเวลาสัญญา","薪资":"เงินเดือน","岗位职责（每行一条）":"หน้าที่ความรับผิดชอบ (บรรทัดละหนึ่งข้อ)","硬性要求（每行一条）":"ข้อกำหนดบังคับ (บรรทัดละหนึ่งข้อ)","优先条件（每行一条）":"เงื่อนไขพิเศษ (บรรทัดละหนึ่งข้อ)","工作与生活 / 福利（每行一条）":"การทำงานและชีวิต / สวัสดิการ (บรรทัดละหนึ่งข้อ)","编辑岗位":"แก้ไขตำแหน่งงาน","新建岗位":"สร้างตำแหน่งงานใหม่","保存后进入纸张预览":"หลังบันทึกแล้วเข้าสู่การแสดงตัวอย่างกระดาษ","粘贴 JD 自动填":"วาง JD เพื่อกรอกอัตโนมัติ","取消":"ยกเลิก","保存草稿":"บันทึกร่าง","如：玻璃压机操作工":"เช่น: พนักงานควบคุมเครื่องอัดแก้ว","如：阿尔及利亚玻璃制品工厂":"เช่น: โรงงานผลิตภัณฑ์แก้วแอลจีเรีย","如：阿尔及利亚":"เช่น: แอลจีเรีย","如：24 个月":"เช่น: 24 เดือน","如：20,000 - 25,000 元/月":"เช่น: 20,000 - 25,000 หยวน/เดือน"});
  Object.assign(DICT.ja, {"岗位名称":"職種名","项目":"プロジェクト","国家":"国","招聘人数":"募集人数","合同周期":"契約期間","薪资":"給与","岗位职责（每行一条）":"職務内容（1行に1項目）","硬性要求（每行一条）":"必須要件（1行に1項目）","优先条件（每行一条）":"歓迎条件（1行に1項目）","工作与生活 / 福利（每行一条）":"仕事と生活 / 福利厚生（1行に1項目）","编辑岗位":"編集職","新建岗位":"求人を新規作成","保存后进入纸张预览":"保存後に用紙プレビューへ","粘贴 JD 自动填":"JDを貼り付けて自動入力","取消":"キャンセル","保存草稿":"下書きを保存","如：玻璃压机操作工":"例：ガラスプレス機オペレーター","如：阿尔及利亚玻璃制品工厂":"例：アルジェリアガラス製品工場","如：阿尔及利亚":"例：アルジェリア","如：24 个月":"例：24 か月","如：20,000 - 25,000 元/月":"例：20,000 - 25,000 元/月"});
  Object.assign(DICT.ar, {"岗位名称":"اسم الوظيفة","项目":"المشروع","国家":"البلد","招聘人数":"عدد الوظائف الشاغرة","合同周期":"مدة العقد","薪资":"الراتب","岗位职责（每行一条）":"المسؤوليات الوظيفية (سطر واحد لكل بند)","硬性要求（每行一条）":"المتطلبات الإلزامية (سطر واحد لكل بند)","优先条件（每行一条）":"الشروط المفضلة (سطر واحد لكل بند)","工作与生活 / 福利（每行一条）":"العمل والحياة / المزايا (سطر واحد لكل بند)","编辑岗位":"وظيفة التحرير","新建岗位":"وظيفة جديدة","保存后进入纸张预览":"بعد الحفظ، انتقل إلى معاينة الورق","粘贴 JD 自动填":"لصق JD للتعبئة التلقائية","取消":"إلغاء","保存草稿":"حفظ المسودة","如：玻璃压机操作工":"مثال: مشغل مكبس الزجاج","如：阿尔及利亚玻璃制品工厂":"مثال: مصنع المنتجات الزجاجية في الجزائر","如：阿尔及利亚":"مثال: الجزائر","如：24 个月":"مثال: 24 شهرًا","如：20,000 - 25,000 元/月":"مثال: 20,000 - 25,000 يوان/شهر"});
  Object.assign(DICT.fr, {"岗位名称":"Intitulé du poste","项目":"Projet","国家":"Pays","招聘人数":"Nombre de postes","合同周期":"Durée du contrat","薪资":"Salaire","岗位职责（每行一条）":"Responsabilités du poste (une par ligne)","硬性要求（每行一条）":"Exigences obligatoires (une par ligne)","优先条件（每行一条）":"Critères préférentiels (une par ligne)","工作与生活 / 福利（每行一条）":"Travail et vie / Avantages (une par ligne)","编辑岗位":"Modifier le poste","新建岗位":"Nouveau poste","保存后进入纸张预览":"Après enregistrement, passer à l'aperçu papier","粘贴 JD 自动填":"Coller la JD pour remplir automatiquement","取消":"Annuler","保存草稿":"Enregistrer le brouillon","如：玻璃压机操作工":"Ex. : opérateur de presse à verre","如：阿尔及利亚玻璃制品工厂":"Ex. : usine de produits en verre en Algérie","如：阿尔及利亚":"Ex. : Algérie","如：24 个月":"Ex. : 24 mois","如：20,000 - 25,000 元/月":"Ex. : 20 000 - 25 000 元/mois"});

  Object.assign(DICT.fr,{'删除岗位':'Supprimer le poste','确定删除该岗位吗？删除后不可恢复。':'Supprimer ce poste ? Cette action est irréversible.','已删除':'Supprimé','岗位已移除':'Le poste a été supprimé'});
  Object.assign(DICT.th,{'删除岗位':'ลบตำแหน่งงาน','确定删除该岗位吗？删除后不可恢复。':'ลบตำแหน่งงานนี้หรือไม่? ไม่สามารถกู้คืนได้','已删除':'ลบแล้ว','岗位已移除':'ตำแหน่งงานถูกลบแล้ว'});
  Object.assign(DICT.ja,{'删除岗位':'求人を削除','确定删除该岗位吗？删除后不可恢复。':'この求人を削除しますか？元に戻せません。','已删除':'削除しました','岗位已移除':'求人を削除しました'});
  Object.assign(DICT.ar,{'删除岗位':'حذف الوظيفة','确定删除该岗位吗？删除后不可恢复。':'حذف هذه الوظيفة؟ لا يمكن التراجع.','已删除':'تم الحذف','岗位已移除':'تمت إزالة الوظيفة'});
  /* AI 诊断 */
  Object.assign(DICT.th, {"职责":"หน้าที่ความรับผิดชอบ","硬性要求":"ข้อกำหนดบังคับ","工作与生活":"การทำงานและชีวิตความเป็นอยู่","当前岗位信息不完整":"ข้อมูลตำแหน่งงานปัจจุบันไม่สมบูรณ์","建议先编辑或 AI 重新生成。":"แนะนำให้แก้ไขก่อนหรือให้ AI สร้างใหม่","去编辑":"ไปแก้ไข","岗位 AI 诊断":"การวินิจฉัยตำแหน่งงานด้วย AI","基于当前保存版本":"อ้างอิงจากเวอร์ชันที่บันทึกไว้ปัจจุบัน","规则引擎 · 当前版本":"ระบบกฎ · เวอร์ชันปัจจุบัน","诊断路径":"เส้นทางการวินิจฉัย","正在生成诊断…":"กำลังสร้างการวินิจฉัย…","完整度":"ความสมบูรณ์","查看报告":"ดูรายงาน","优势":"จุดเด่น","需要补充":"ต้องเพิ่มเติม","岗位诊断报告":"รายงานการวินิจฉัยตำแหน่งงาน","关闭":"ปิด","解析岗位":"วิเคราะห์ตำแหน่งงาน","识别岗位名称、国家与招聘人数":"ระบุชื่อตำแหน่ง ประเทศ และจำนวนผู้รับสมัคร","提取职责":"สกัดหน้าที่ความรับผิดชอบ","抽取岗位职责与工作内容":"ดึงหน้าที่ความรับผิดชอบและลักษณะงาน","核验硬性":"ตรวจสอบข้อกำหนดบังคับ","检查经验、证书与语言门槛":"ตรวจสอบประสบการณ์ ใบรับรอง และเกณฑ์ภาษา","比对合规":"เปรียบเทียบความสอดคล้อง","核对合同、工时与保险信息":"ตรวจสอบข้อมูลสัญญา ชั่วโมงทำงาน และประกัน","评估吸引力":"ประเมินความน่าสนใจ","评估薪资、生活与福利":"ประเมินเงินเดือน ความเป็นอยู่ และสวัสดิการ","生成建议":"สร้างข้อเสนอแนะ","输出完整度与补充建议":"แสดงความสมบูรณ์และข้อเสนอแนะเพิ่มเติม"});
  Object.assign(DICT.ja, {"职责":"職務","硬性要求":"必須要件","工作与生活":"仕事と生活","当前岗位信息不完整":"現在の求人情報が不完全です","建议先编辑或 AI 重新生成。":"先に編集するか、AIで再生成することをお勧めします。","去编辑":"編集する","岗位 AI 诊断":"求人AI診断","基于当前保存版本":"現在保存されているバージョンに基づく","规则引擎 · 当前版本":"ルールエンジン · 現在のバージョン","诊断路径":"診断パス","正在生成诊断…":"診断を生成中…","完整度":"完全度","查看报告":"レポートを見る","优势":"強み","需要补充":"補充が必要","岗位诊断报告":"求人診断レポート","关闭":"閉じる","解析岗位":"求人を解析","识别岗位名称、国家与招聘人数":"求人名称、国、採用人数を識別","提取职责":"職務を抽出","抽取岗位职责与工作内容":"職務内容と業務内容を抽出","核验硬性":"必須要件を検証","检查经验、证书与语言门槛":"経験、資格、言語要件を確認","比对合规":"コンプライアンスを照合","核对合同、工时与保险信息":"契約、労働時間、保険情報を確認","评估吸引力":"魅力を評価","评估薪资、生活与福利":"給与、生活、福利厚生を評価","生成建议":"提案を生成","输出完整度与补充建议":"完全度と補充提案を出力"});
  Object.assign(DICT.ar, {"职责":"المسؤوليات","硬性要求":"المتطلبات الإلزامية","工作与生活":"العمل والحياة","当前岗位信息不完整":"معلومات الوظيفة الحالية غير مكتملة","建议先编辑或 AI 重新生成。":"يُنصح بالتحرير أولاً أو إعادة الإنشاء بالذكاء الاصطناعي.","去编辑":"الانتقال إلى التحرير","岗位 AI 诊断":"التشخيص بالذكاء الاصطناعي للوظيفة","基于当前保存版本":"بناءً على النسخة المحفوظة الحالية","规则引擎 · 当前版本":"محرك القواعد · النسخة الحالية","诊断路径":"مسار التشخيص","正在生成诊断…":"جارٍ إنشاء التشخيص…","完整度":"درجة الاكتمال","查看报告":"عرض التقرير","优势":"المزايا","需要补充":"يحتاج إلى استكمال","岗位诊断报告":"تقرير تشخيص الوظيفة","关闭":"إغلاق","解析岗位":"تحليل الوظيفة","识别岗位名称、国家与招聘人数":"تحديد اسم الوظيفة والدولة وعدد الموظفين المطلوبين","提取职责":"استخراج المسؤوليات","抽取岗位职责与工作内容":"استخلاص مسؤوليات الوظيفة ومحتوى العمل","核验硬性":"التحقق من المتطلبات الإلزامية","检查经验、证书与语言门槛":"فحص الخبرة والشهادات ومتطلبات اللغة","比对合规":"مقارنة الامتثال","核对合同、工时与保险信息":"التحقق من معلومات العقد وساعات العمل والتأمين","评估吸引力":"تقييم الجاذبية","评估薪资、生活与福利":"تقييم الراتب والمعيشة والمزايا","生成建议":"إنشاء التوصيات","输出完整度与补充建议":"إخراج درجة الاكتمال والتوصيات التكميلية"});
  Object.assign(DICT.fr, {"职责":"Responsabilités","硬性要求":"Exigences obligatoires","工作与生活":"Travail et vie","当前岗位信息不完整":"Les informations actuelles du poste sont incomplètes","建议先编辑或 AI 重新生成。":"Il est recommandé de modifier d'abord ou de régénérer avec l'IA.","去编辑":"Modifier","岗位 AI 诊断":"Diagnostic IA du poste","基于当前保存版本":"Basé sur la version actuellement enregistrée","规则引擎 · 当前版本":"Moteur de règles · Version actuelle","诊断路径":"Parcours de diagnostic","正在生成诊断…":"Génération du diagnostic en cours…","完整度":"Complétude","查看报告":"Voir le rapport","优势":"Points forts","需要补充":"À compléter","岗位诊断报告":"Rapport de diagnostic du poste","关闭":"Fermer","解析岗位":"Analyser le poste","识别岗位名称、国家与招聘人数":"Identifier l'intitulé du poste, le pays et le nombre de recrutements","提取职责":"Extraire les responsabilités","抽取岗位职责与工作内容":"Extraire les responsabilités et le contenu du travail","核验硬性":"Vérifier les exigences obligatoires","检查经验、证书与语言门槛":"Contrôler l'expérience, les certificats et les exigences linguistiques","比对合规":"Comparer la conformité","核对合同、工时与保险信息":"Vérifier les informations sur le contrat, les horaires et l'assurance","评估吸引力":"Évaluer l'attractivité","评估薪资、生活与福利":"Évaluer le salaire, les conditions de vie et les avantages","生成建议":"Générer des suggestions","输出完整度与补充建议":"Produire la complétude et les suggestions de complément"});

  /* AI 诊断内容 */
  Object.assign(DICT.th, {"岗位职责不足":"หน้าที่ความรับผิดชอบไม่เพียงพอ","职责少于 4 条，候选人无法判断实际工作内容":"หน้าที่น้อยกว่า 4 ข้อ ผู้สมัครไม่สามารถตัดสินเนื้อหางานจริงได้","补充日常操作、异常处理、协作与安全职责":"เพิ่มหน้าที่ด้านการปฏิบัติงานประจำวัน การจัดการข้อยกเว้น การประสานงาน และความปลอดภัย","硬性要求不足":"ข้อกำหนดบังคับไม่เพียงพอ","硬性条件少于 3 条，容易收到不匹配简历":"เงื่อนไขบังคับน้อยกว่า 3 ข้อ อาจได้รับเรซูเม่ที่ไม่ตรง","补充经验年限、证书、语言、驻外意愿等硬门槛":"เพิ่มเกณฑ์บังคับ เช่น จำนวนปีประสบการณ์ ใบรับรอง ภาษา ความยินดีไปประจำต่างประเทศ","薪资未明确":"เงินเดือนไม่ชัดเจน","薪资面议会降低投递率":"การเจรจาเงินเดือนลดอัตราการสมัคร","给出薪资区间或构成":"ระบุช่วงเงินเดือนหรือองค์ประกอบ","合同周期未写明":"ไม่ได้ระบุระยะเวลาสัญญา","合同周期是候选人最关心条件之一":"ระยะเวลาสัญญาเป็นหนึ่งในเงื่อนไขที่ผู้สมัครสนใจมากที่สุด","补充首签周期与试用期":"เพิ่มระยะเวลาสัญญาครั้งแรกและระยะทดลองงาน","工作与生活信息不足":"ข้อมูลการทำงานและชีวิตไม่เพียงพอ","住宿、班车、探亲假等信息会影响转化":"ข้อมูลที่พัก รถรับส่ง ลาพักร้อนกลับบ้าน มีผลต่อการตัดสินใจ","补充住宿、餐饮、班车、探亲假":"เพิ่มข้อมูลที่พัก อาหาร รถรับส่ง ลาพักร้อนกลับบ้าน","缺少优先条件":"ขาดเงื่อนไขพิเศษ","没有区分“硬性”和“加分项”":"ไม่แยกแยะระหว่าง \"ข้อบังคับ\" และ \"ข้อได้เปรียบ\"","补充语言、海外经历等优先条件":"เพิ่มเงื่อนไขพิเศษ เช่น ภาษา ประสบการณ์ต่างประเทศ","已填写属地：":"กรอกข้อมูลท้องถิ่นแล้ว:","生活与福利信息较完整":"ข้อมูลชีวิตและสวัสดิการค่อนข้างครบถ้วน","高优先级":"ลำดับความสำคัญสูง","建议优化":"แนะนำให้ปรับปรุง","可补充":"สามารถเพิ่มเติมได้","暂未识别到明显优势。":"ยังไม่พบจุดเด่นที่ชัดเจน","岗位信息比较完整，可以发布。":"ข้อมูลตำแหน่งงานค่อนข้างครบถ้วน สามารถเผยแพร่ได้","岗位职责":"หน้าที่ความรับผิดชอบ","硬性要求":"ข้อกำหนดบังคับ"});
  Object.assign(DICT.ja, {"岗位职责不足":"職務内容が不十分","职责少于 4 条，候选人无法判断实际工作内容":"職責が4項目未満で、候補者が実際の業務内容を判断できない","补充日常操作、异常处理、协作与安全职责":"日常業務、異常処理、連携、安全に関する職責を補足する","硬性要求不足":"必須要件が不十分","硬性条件少于 3 条，容易收到不匹配简历":"必須条件が3項目未満で、マッチしない履歴書が集まりやすい","补充经验年限、证书、语言、驻外意愿等硬门槛":"経験年数、資格、言語、海外駐在意思などの必須要件を補足する","薪资未明确":"給与が不明確","薪资面议会降低投递率":"給与面談は応募率を下げる","给出薪资区间或构成":"給与レンジまたは構成を示す","合同周期未写明":"契約期間が明記されていない","合同周期是候选人最关心条件之一":"契約期間は候補者が最も気にする条件の一つ","补充首签周期与试用期":"初回契約期間と試用期間を補足する","工作与生活信息不足":"仕事と生活の情報が不十分","住宿、班车、探亲假等信息会影响转化":"宿泊、送迎バス、帰省休暇などの情報が応募転換に影響する","补充住宿、餐饮、班车、探亲假":"宿泊、食事、送迎バス、帰省休暇を補足する","缺少优先条件":"優遇条件が欠けている","没有区分“硬性”和“加分项”":"「必須」と「加点項目」が区別されていない","补充语言、海外经历等优先条件":"言語、海外経験などの優遇条件を補足する","已填写属地：":"属地を入力済み：","生活与福利信息较完整":"生活と福利厚生の情報は比較的充実している","高优先级":"優先度：高","建议优化":"最適化を推奨","可补充":"補足可能","暂未识别到明显优势。":"現時点で明確な強みは見つかっていません。","岗位信息比较完整，可以发布。":"求人情報は比較的充実しており、公開可能です。","岗位职责":"職務内容","硬性要求":"必須要件"});
  Object.assign(DICT.ar, {"岗位职责不足":"المسؤوليات الوظيفية غير كافية","职责少于 4 条，候选人无法判断实际工作内容":"المسؤوليات أقل من 4 بنود، ولا يمكن للمرشح تحديد محتوى العمل الفعلي","补充日常操作、异常处理、协作与安全职责":"أضف مسؤوليات العمليات اليومية ومعالجة الاستثناءات والتعاون والسلامة","硬性要求不足":"المتطلبات الإلزامية غير كافية","硬性条件少于 3 条，容易收到不匹配简历":"الشروط الإلزامية أقل من 3 بنود، مما يسهل استلام سير ذاتية غير مطابقة","补充经验年限、证书、语言、驻外意愿等硬门槛":"أضف الحدود الإلزامية مثل سنوات الخبرة والشهادات واللغة والاستعداد للعمل في الخارج","薪资未明确":"الراتب غير محدد","薪资面议会降低投递率":"الراتب قابل للتفاوض سيقلل من معدل التقديم","给出薪资区间或构成":"حدد نطاق الراتب أو مكوناته","合同周期未写明":"مدة العقد غير مذكورة","合同周期是候选人最关心条件之一":"مدة العقد من أهم الشروط التي يهتم بها المرشح","补充首签周期与试用期":"أضف مدة العقد الأولي وفترة التجربة","工作与生活信息不足":"معلومات العمل والحياة غير كافية","住宿、班车、探亲假等信息会影响转化":"معلومات السكن والحافلات وإجازة زيارة الأهل تؤثر على التحويل","补充住宿、餐饮、班车、探亲假":"أضف السكن والطعام والحافلات وإجازة زيارة الأهل","缺少优先条件":"تفتقر إلى الشروط التفضيلية","没有区分“硬性”和“加分项”":"لا يوجد تمييز بين \"الإلزامي\" و\"نقاط إضافية\"","补充语言、海外经历等优先条件":"أضف الشروط التفضيلية مثل اللغة والخبرة الخارجية","已填写属地：":"تم تحديد الموقع:","生活与福利信息较完整":"معلومات الحياة والمزايا مكتملة نسبياً","高优先级":"أولوية عالية","建议优化":"يُنصح بالتحسين","可补充":"يمكن الإضافة","暂未识别到明显优势。":"لم يتم التعرف على مزايا واضحة حالياً.","岗位信息比较完整，可以发布。":"معلومات الوظيفة مكتملة نسبياً، ويمكن النشر.","岗位职责":"المسؤوليات الوظيفية","硬性要求":"المتطلبات الإلزامية"});
  Object.assign(DICT.fr, {"岗位职责不足":"Responsabilités du poste insuffisantes","职责少于 4 条，候选人无法判断实际工作内容":"Moins de 4 responsabilités, le candidat ne peut pas évaluer le contenu réel du travail","补充日常操作、异常处理、协作与安全职责":"Ajouter les opérations quotidiennes, la gestion des exceptions, la collaboration et les responsabilités en matière de sécurité","硬性要求不足":"Exigences obligatoires insuffisantes","硬性条件少于 3 条，容易收到不匹配简历":"Moins de 3 conditions obligatoires, risque de recevoir des CV non adaptés","补充经验年限、证书、语言、驻外意愿等硬门槛":"Ajouter les seuils obligatoires : années d'expérience, certifications, langues, volonté d'expatriation, etc.","薪资未明确":"Salaire non précisé","薪资面议会降低投递率":"Le salaire à négocier réduit le taux de candidature","给出薪资区间或构成":"Indiquer une fourchette ou la structure salariale","合同周期未写明":"Durée du contrat non précisée","合同周期是候选人最关心条件之一":"La durée du contrat est l'un des critères les plus importants pour les candidats","补充首签周期与试用期":"Ajouter la durée du premier contrat et la période d'essai","工作与生活信息不足":"Informations sur les conditions de vie et de travail insuffisantes","住宿、班车、探亲假等信息会影响转化":"Les informations sur le logement, la navette, les congés de visite familiale influencent la conversion","补充住宿、餐饮、班车、探亲假":"Ajouter le logement, la restauration, la navette, les congés de visite familiale","缺少优先条件":"Absence de critères préférentiels","没有区分“硬性”和“加分项”":"Pas de distinction entre « obligatoire » et « atout »","补充语言、海外经历等优先条件":"Ajouter les critères préférentiels : langues, expérience à l'étranger, etc.","已填写属地：":"Localisation renseignée :","生活与福利信息较完整":"Informations sur les conditions de vie et les avantages relativement complètes","高优先级":"Priorité élevée","建议优化":"Optimisation recommandée","可补充":"Peut être complété","暂未识别到明显优势。":"Aucun avantage évident identifié pour le moment.","岗位信息比较完整，可以发布。":"Les informations du poste sont relativement complètes, publication possible.","岗位职责":"Responsabilités du poste","硬性要求":"Exigences obligatoires"});

  /* 服务下单 */
  Object.assign(DICT.th, {"服务说明：":"คำอธิบายบริการ:","交付周期：视具体服务而定":"ระยะเวลาส่งมอบ: ขึ้นอยู่กับบริการเฉพาะ","价格：AI 类免费；合作类按服务商报价":"ราคา: บริการ AI ฟรี; บริการความร่วมมือตามใบเสนอราคาของผู้ให้บริการ","立即下单":"สั่งซื้อทันที","已受理":"รับเรื่องแล้ว","服务单已创建，顾问会联系你":"สร้างใบสั่งบริการแล้ว ที่ปรึกษาจะติดต่อคุณ","下单失败":"สั่งซื้อล้มเหลว","请稍后重试":"โปรดลองอีกครั้งภายหลัง"});
  Object.assign(DICT.ja, {"服务说明：":"サービス説明：","交付周期：视具体服务而定":"納品期間：具体的なサービスにより異なります","价格：AI 类免费；合作类按服务商报价":"価格：AI類は無料；提携類はサービス提供者の見積もりによります","立即下单":"今すぐ注文","已受理":"受付済み","服务单已创建，顾问会联系你":"サービス注文が作成されました。担当者からご連絡します","下单失败":"注文に失敗しました","请稍后重试":"しばらくしてから再度お試しください"});
  Object.assign(DICT.ar, {"服务说明：":"وصف الخدمة:","交付周期：视具体服务而定":"مدة التسليم: حسب الخدمة المحددة","价格：AI 类免费；合作类按服务商报价":"السعر: خدمات الذكاء الاصطناعي مجانية؛ خدمات التعاون حسب عرض السعر المقدم من مزود الخدمة","立即下单":"اطلب الآن","已受理":"تم الاستلام","服务单已创建，顾问会联系你":"تم إنشاء طلب الخدمة، وسيتواصل معك المستشار","下单失败":"فشل الطلب","请稍后重试":"يرجى المحاولة مرة أخرى لاحقًا"});
  Object.assign(DICT.fr, {"服务说明：":"Description du service :","交付周期：视具体服务而定":"Délai de livraison : selon le service spécifique","价格：AI 类免费；合作类按服务商报价":"Prix : gratuit pour les services d'IA ; pour les services de coopération, selon le devis du prestataire","立即下单":"Commander maintenant","已受理":"Déjà pris en charge","服务单已创建，顾问会联系你":"La demande de service a été créée, un conseiller vous contactera","下单失败":"Échec de la commande","请稍后重试":"Veuillez réessayer plus tard"});

  /* 面试/Offer */
  Object.assign(DICT.th, {"候选人：":"ผู้สมัคร:","面试时间":"เวลาสัมภาษณ์","面试形式":"รูปแบบการสัมภาษณ์","视频面试":"สัมภาษณ์ทางวิดีโอ","现场面试":"สัมภาษณ์ที่สถานที่","电话面试":"สัมภาษณ์ทางโทรศัพท์","面试地点 / 会议链接":"สถานที่สัมภาษณ์ / ลิงก์ประชุม","如：Zoom 链接 / 阿尔及尔项目现场":"เช่น ลิงก์ Zoom / สถานที่โครงการแอลเจียร์","面试官":"ผู้สัมภาษณ์","时长（分钟）":"ระยะเวลา (นาที)","给候选人的备注":"หมายเหตุถึงผู้สมัคร","如：请提前 10 分钟上线，准备作品/证书":"เช่น กรุณาเข้าสู่ระบบก่อนเวลา 10 นาที เตรียมผลงาน/ใบรับรอง","发出后候选人会收到通知，可以选择接受、申请改期或拒绝并填写理由。":"หลังจากส่งแล้วผู้สมัครจะได้รับการแจ้งเตือน สามารถเลือกตอบรับ ขอเลื่อนนัด หรือปฏิเสธพร้อมระบุเหตุผล","邀面试":"เชิญสัมภาษณ์","取消":"ยกเลิก","发送邀约":"ส่งคำเชิญ","请选择时间":"กรุณาเลือกเวลา","面试时间不能为空":"เวลาสัมภาษณ์ต้องไม่ว่าง","请填写地点":"กรุณากรอกสถานที่","视频面试可填会议链接":"การสัมภาษณ์ทางวิดีโอสามารถกรอกลิงก์ประชุมได้","已发出面试邀约":"ส่งคำเชิญสัมภาษณ์แล้ว","等待候选人确认 / 改期":"รอผู้สมัครยืนยัน / เลื่อนนัด","邀约失败":"ส่งคำเชิญไม่สำเร็จ","offer 薪资":"เงินเดือนในข้อเสนอ","如：24,000 元/月":"เช่น 24,000 หยวน/เดือน","入职时间":"วันที่เริ่มงาน","合同周期（月）":"ระยะเวลาสัญญา (เดือน)","有效期至":"ใช้ได้ถึง","福利 / 说明":"สวัสดิการ / คำอธิบาย","如：包食宿、往返机票、商业保险":"เช่น ที่พักและอาหาร ตั๋วเครื่องบินไป-กลับ ประกันภัยเชิงพาณิชย์","备注":"หมายเหตุ","给候选人的说明":"คำชี้แจงถึงผู้สมัคร","发出后候选人可以接受、拒绝或提出薪资 / 入职时间协商。":"หลังจากส่งแล้วผู้สมัครสามารถตอบรับ ปฏิเสธ หรือเจรจาเรื่องเงินเดือน / วันที่เริ่มงาน","发 offer":"ส่งข้อเสนอ","发送 offer":"ส่งข้อเสนอ","请填写薪资":"กรุณากรอกเงินเดือน","offer 薪资不能为空":"เงินเดือนในข้อเสนอต้องไม่ว่าง","offer 已发出":"ส่งข้อเสนอแล้ว","等待候选人接受 / 协商":"รอผู้สมัครตอบรับ / เจรจา","发送失败":"ส่งไม่สำเร็จ"});
  Object.assign(DICT.ja, {"候选人：":"候補者：","面试时间":"面接時間","面试形式":"面接形式","视频面试":"ビデオ面接","现场面试":"対面面接","电话面试":"電話面接","面试地点 / 会议链接":"面接場所 / 会議リンク","如：Zoom 链接 / 阿尔及尔项目现场":"例：Zoom リンク / アルジェプロジェクト現場","面试官":"面接官","时长（分钟）":"所要時間（分）","给候选人的备注":"候補者への備考","如：请提前 10 分钟上线，准备作品/证书":"例：10分前にオンラインに接続し、作品/証明書を準備してください","发出后候选人会收到通知，可以选择接受、申请改期或拒绝并填写理由。":"送信後、候補者に通知が届き、承諾・日程変更の申請・理由を記入して辞退を選択できます。","邀面试":"面接招待","取消":"キャンセル","发送邀约":"招待を送信","请选择时间":"時間を選択してください","面试时间不能为空":"面接時間は必須です","请填写地点":"場所を入力してください","视频面试可填会议链接":"ビデオ面接の場合は会議リンクを入力できます","已发出面试邀约":"面接招待を送信しました","等待候选人确认 / 改期":"候補者の確認 / 日程変更を待っています","邀约失败":"招待の送信に失敗しました","offer 薪资":"オファー給与","如：24,000 元/月":"例：24,000 元/月","入职时间":"入社日","合同周期（月）":"契約期間（月）","有效期至":"有効期限","福利 / 说明":"福利厚生 / 説明","如：包食宿、往返机票、商业保险":"例：食事・宿泊付き、往復航空券、商業保険","备注":"備考","给候选人的说明":"候補者への説明","发出后候选人可以接受、拒绝或提出薪资 / 入职时间协商。":"送信後、候補者は承諾・辞退・給与/入社日の交渉を申し出ることができます。","发 offer":"オファー送信","发送 offer":"オファーを送信","请填写薪资":"給与を入力してください","offer 薪资不能为空":"オファー給与は必須です","offer 已发出":"オファーを送信しました","等待候选人接受 / 协商":"候補者の承諾 / 交渉を待っています","发送失败":"送信に失敗しました"});
  Object.assign(DICT.ar, {"候选人：":"المرشح:","面试时间":"وقت المقابلة","面试形式":"شكل المقابلة","视频面试":"مقابلة عبر الفيديو","现场面试":"مقابلة حضورية","电话面试":"مقابلة هاتفية","面试地点 / 会议链接":"مكان المقابلة / رابط الاجتماع","如：Zoom 链接 / 阿尔及尔项目现场":"مثال: رابط Zoom / موقع المشروع في الجزائر","面试官":"المحاور","时长（分钟）":"المدة (بالدقائق)","给候选人的备注":"ملاحظات للمرشح","如：请提前 10 分钟上线，准备作品/证书":"مثال: يرجى الاتصال قبل 10 دقائق، وإحضار الأعمال/الشهادات","发出后候选人会收到通知，可以选择接受、申请改期或拒绝并填写理由。":"بعد الإرسال سيتلقى المرشح إشعارًا، ويمكنه اختيار القبول أو طلب تغيير الموعد أو الرفض مع ذكر السبب.","邀面试":"دعوة للمقابلة","取消":"إلغاء","发送邀约":"إرسال الدعوة","请选择时间":"يرجى اختيار الوقت","面试时间不能为空":"لا يمكن أن يكون وقت المقابلة فارغًا","请填写地点":"يرجى إدخال المكان","视频面试可填会议链接":"يمكن إدخال رابط الاجتماع للمقابلة عبر الفيديو","已发出面试邀约":"تم إرسال دعوة المقابلة","等待候选人确认 / 改期":"في انتظار تأكيد المرشح / تغيير الموعد","邀约失败":"فشل إرسال الدعوة","offer 薪资":"راتب العرض","如：24,000 元/月":"مثال: 24,000 يوان/شهر","入职时间":"تاريخ الالتحاق","合同周期（月）":"مدة العقد (بالأشهر)","有效期至":"صالح حتى","福利 / 说明":"المزايا / التوضيحات","如：包食宿、往返机票、商业保险":"مثال: الإقامة والطعام، تذاكر الطيران ذهابًا وإيابًا، التأمين التجاري","备注":"ملاحظات","给候选人的说明":"توضيحات للمرشح","发出后候选人可以接受、拒绝或提出薪资 / 入职时间协商。":"بعد الإرسال يمكن للمرشح القبول أو الرفض أو التفاوض على الراتب / تاريخ الالتحاق.","发 offer":"إرسال العرض","发送 offer":"إرسال العرض","请填写薪资":"يرجى إدخال الراتب","offer 薪资不能为空":"لا يمكن أن يكون راتب العرض فارغًا","offer 已发出":"تم إرسال العرض","等待候选人接受 / 协商":"في انتظار قبول المرشح / التفاوض","发送失败":"فشل الإرسال"});
  Object.assign(DICT.fr, {"候选人：":"Candidat :","面试时间":"Date de l'entretien","面试形式":"Format de l'entretien","视频面试":"Entretien vidéo","现场面试":"Entretien en présentiel","电话面试":"Entretien téléphonique","面试地点 / 会议链接":"Lieu de l'entretien / Lien de réunion","如：Zoom 链接 / 阿尔及尔项目现场":"Ex. : lien Zoom / site du projet à Alger","面试官":"Recruteur","时长（分钟）":"Durée (minutes)","给候选人的备注":"Remarques pour le candidat","如：请提前 10 分钟上线，准备作品/证书":"Ex. : veuillez vous connecter 10 minutes à l'avance et préparer vos réalisations/certificats","发出后候选人会收到通知，可以选择接受、申请改期或拒绝并填写理由。":"Après l'envoi, le candidat recevra une notification et pourra accepter, demander un report ou refuser en indiquant un motif.","邀面试":"Inviter à un entretien","取消":"Annuler","发送邀约":"Envoyer l'invitation","请选择时间":"Veuillez choisir un horaire","面试时间不能为空":"La date de l'entretien ne peut pas être vide","请填写地点":"Veuillez indiquer le lieu","视频面试可填会议链接":"Pour un entretien vidéo, vous pouvez indiquer le lien de réunion","已发出面试邀约":"Invitation à l'entretien envoyée","等待候选人确认 / 改期":"En attente de confirmation / report du candidat","邀约失败":"Échec de l'invitation","offer 薪资":"Salaire de l'offre","如：24,000 元/月":"Ex. : 24 000 CNY/mois","入职时间":"Date de prise de poste","合同周期（月）":"Durée du contrat (mois)","有效期至":"Valable jusqu'au","福利 / 说明":"Avantages / Description","如：包食宿、往返机票、商业保险":"Ex. : logement et repas inclus, billets d'avion aller-retour, assurance commerciale","备注":"Remarques","给候选人的说明":"Explications pour le candidat","发出后候选人可以接受、拒绝或提出薪资 / 入职时间协商。":"Après l'envoi, le candidat peut accepter, refuser ou demander une négociation du salaire / de la date de prise de poste.","发 offer":"Envoyer l'offre","发送 offer":"Envoyer l'offre","请填写薪资":"Veuillez indiquer le salaire","offer 薪资不能为空":"Le salaire de l'offre ne peut pas être vide","offer 已发出":"Offre envoyée","等待候选人接受 / 协商":"En attente d'acceptation / négociation du candidat","发送失败":"Échec de l'envoi"});

  /* AI 报告/编辑 */
  Object.assign(DICT.th, {"岗位 AI 诊断 · 开机动画":"การวินิจฉัยตำแหน่งด้วย AI · แอนิเมชันเปิดเครื่อง","基于当前保存版本":"อ้างอิงจากเวอร์ชันที่บันทึกไว้ปัจจุบัน","音效 ON":"เสียง ON","跳过开机 →":"ข้ามการเปิดเครื่อง →","关闭 ×":"ปิด ×","正在启动诊断引擎…":"กำลังเริ่มระบบวินิจฉัย…","重新分析":"วิเคราะห์ใหม่","完整度":"ความสมบูรณ์","可以发布":"เผยแพร่ได้","建议补齐后发布":"แนะนำให้เติมข้อมูลให้ครบแล้วเผยแพร่","先补齐关键信息":"เติมข้อมูลสำคัญให้ครบก่อน","岗位信息比较完整":"ข้อมูลตำแหน่งค่อนข้างครบถ้วน","需要补齐关键信息":"ต้องเติมข้อมูลสำคัญให้ครบ","岗位职责，硬性要求，薪资合同与生活信息越完整，候选人匹配越准确。":"หน้าที่ความรับผิดชอบ ข้อกำหนดตายตัว ข้อมูลเงินเดือนและสัญญาและข้อมูลการใช้ชีวิตยิ่งครบถ้วน การจับคู่ผู้สมัครจะยิ่งแม่นยำ","岗位职责、硬性要求、薪资合同与生活信息越完整，候选人匹配越准确。":"หน้าที่ความรับผิดชอบ ข้อกำหนดตายตัว ข้อมูลเงินเดือนและสัญญาและข้อมูลการใช้ชีวิตยิ่งครบถ้วน การจับคู่ผู้สมัครจะยิ่งแม่นยำ","岗位要素对照":"การเทียบองค์ประกอบตำแหน่ง","分数构成":"องค์ประกอบคะแนน","优势":"จุดเด่น","需要补充":"ต้องเพิ่มเติม","暂未识别到明显优势。":"ยังไม่พบจุดเด่นที่ชัดเจน","岗位信息比较完整，可以发布。":"ข้อมูลตำแหน่งงานค่อนข้างครบถ้วน สามารถเผยแพร่ได้","规则引擎 · 当前版本":"ระบบกฎ · เวอร์ชันปัจจุบัน","编辑岗位":"แก้ไขตำแหน่งงาน","保存后可重新分析，查看分数变化":"บันทึกแล้วสามารถวิเคราะห์ใหม่เพื่อดูการเปลี่ยนแปลงของคะแนน","AI 重新生成":"AI สร้างใหม่","岗位中所有信息均可修改。AI 只在你已有内容的基础上帮你表达得更清楚，不会替你编造职责或要求。":"ข้อมูลทั้งหมดในตำแหน่งสามารถแก้ไขได้ AI เพียงช่วยคุณสื่อสารให้ชัดเจนขึ้นจากเนื้อหาที่คุณมีอยู่ ไม่ได้สร้างหน้าที่หรือข้อกำหนดแทนคุณ","基本信息":"ข้อมูลพื้นฐาน","点击任意字段即可修改":"คลิกที่ฟิลด์ใดก็ได้เพื่อแก้ไข","每行一条 · 影响候选人判断":"บรรทัดละหนึ่งรายการ · มีผลต่อการตัดสินใจของผู้สมัคร","任职要求":"คุณสมบัติผู้สมัคร","硬性 / 优先分开写":"แยกข้อกำหนดตายตัว / ข้อกำหนดเสริม","硬性条件":"เงื่อนไขบังคับ","优先条件":"เงื่อนไขพิเศษ","工作与生活":"การทำงานและชีวิตความเป็นอยู่","住宿、班车、探亲假":"ที่พัก รถรับส่ง วันลากลับบ้าน","AI 润色这段":"AI ขัดเกลาส่วนนี้","诊断建议":"ข้อเสนอแนะจากการวินิจฉัย","点「采用建议」写进对应字段":"คลิก «ใช้ข้อเสนอแนะ» เพื่อเขียนลงในฟิลด์ที่เกี่ยวข้อง","AI 重新生成岗位内容":"AI สร้างเนื้อหาตำแหน่งใหม่","保存并重新分析":"บันทึกและวิเคราะห์ใหม่","保存草稿":"บันทึกร่าง","取消":"ยกเลิก"});
  Object.assign(DICT.ja, {"岗位 AI 诊断 · 开机动画":"求人 AI 診断・起動アニメーション","基于当前保存版本":"現在保存されているバージョンに基づく","音效 ON":"効果音 ON","跳过开机 →":"起動をスキップ →","关闭 ×":"閉じる ×","正在启动诊断引擎…":"診断エンジンを起動中…","重新分析":"再分析","完整度":"完全度","可以发布":"公開可能","建议补齐后发布":"補完後に公開を推奨","先补齐关键信息":"まず重要情報を補完","岗位信息比较完整":"求人情報はほぼ完全です","需要补齐关键信息":"重要情報の補完が必要","岗位职责，硬性要求，薪资合同与生活信息越完整，候选人匹配越准确。":"職務内容、必須要件、給与・契約と生活情報が完全であるほど、候補者とのマッチングが正確になります。","岗位职责、硬性要求、薪资合同与生活信息越完整，候选人匹配越准确。":"職務内容、必須要件、給与・契約と生活情報が完全であるほど、候補者とのマッチングが正確になります。","岗位要素对照":"求人要素の照合","分数构成":"スコア構成","优势":"強み","需要补充":"補充が必要","暂未识别到明显优势。":"現時点で明確な強みは見つかっていません。","岗位信息比较完整，可以发布。":"求人情報は比較的充実しており、公開可能です。","规则引擎 · 当前版本":"ルールエンジン · 現在のバージョン","编辑岗位":"編集職","保存后可重新分析，查看分数变化":"保存後に再分析して、スコアの変化を確認できます","AI 重新生成":"AI で再生成","岗位中所有信息均可修改。AI 只在你已有内容的基础上帮你表达得更清楚，不会替你编造职责或要求。":"求人内のすべての情報は編集可能です。AI は既存の内容をもとに、より明確な表現を手伝うだけで、職務内容や要件を勝手に作成することはありません。","基本信息":"基本情報","点击任意字段即可修改":"任意のフィールドをクリックして編集できます","每行一条 · 影响候选人判断":"1行に1項目・候補者の判断に影響します","任职要求":"応募資格","硬性 / 优先分开写":"必須／優先を分けて記載","硬性条件":"必須条件","优先条件":"歓迎条件","工作与生活":"仕事と生活","住宿、班车、探亲假":"宿泊、送迎バス、帰省休暇","AI 润色这段":"この部分を AI で推敲","诊断建议":"診断アドバイス","点「采用建议」写进对应字段":"「提案を採用」をクリックして該当フィールドに反映","AI 重新生成岗位内容":"AI で求人内容を再生成","保存并重新分析":"保存して再分析","保存草稿":"下書きを保存","取消":"キャンセル"});
  Object.assign(DICT.ar, {"岗位 AI 诊断 · 开机动画":"تشخيص الوظيفة بالذكاء الاصطناعي · رسوم بدء التشغيل","基于当前保存版本":"بناءً على النسخة المحفوظة الحالية","音效 ON":"المؤثرات الصوتية ON","跳过开机 →":"تخطي بدء التشغيل ←","关闭 ×":"إغلاق ×","正在启动诊断引擎…":"جارٍ تشغيل محرك التشخيص…","重新分析":"إعادة التحليل","完整度":"درجة الاكتمال","可以发布":"جاهزة للنشر","建议补齐后发布":"يُنصح بالنشر بعد الاستكمال","先补齐关键信息":"أكمل المعلومات الأساسية أولاً","岗位信息比较完整":"معلومات الوظيفة مكتملة نسبياً","需要补齐关键信息":"يلزم استكمال المعلومات الأساسية","岗位职责，硬性要求，薪资合同与生活信息越完整，候选人匹配越准确。":"كلما كانت المهام الوظيفية والمتطلبات الإلزامية ومعلومات الراتب والعقد والحياة أكثر اكتمالاً، كان مطابقة المرشحين أدق.","岗位职责、硬性要求、薪资合同与生活信息越完整，候选人匹配越准确。":"كلما كانت المهام الوظيفية والمتطلبات الإلزامية ومعلومات الراتب والعقد والحياة أكثر اكتمالاً، كان مطابقة المرشحين أدق.","岗位要素对照":"مقارنة عناصر الوظيفة","分数构成":"تكوين الدرجات","优势":"المزايا","需要补充":"يحتاج إلى استكمال","暂未识别到明显优势。":"لم يتم التعرف على مزايا واضحة حالياً.","岗位信息比较完整，可以发布。":"معلومات الوظيفة مكتملة نسبياً، ويمكن النشر.","规则引擎 · 当前版本":"محرك القواعد · النسخة الحالية","编辑岗位":"وظيفة التحرير","保存后可重新分析，查看分数变化":"بعد الحفظ يمكن إعادة التحليل لمعرفة تغيّر الدرجات","AI 重新生成":"إعادة التوليد بالذكاء الاصطناعي","岗位中所有信息均可修改。AI 只在你已有内容的基础上帮你表达得更清楚，不会替你编造职责或要求。":"جميع المعلومات في الوظيفة قابلة للتعديل. الذكاء الاصطناعي يساعدك فقط على التعبير عن محتواك الحالي بوضوح أكبر، ولن يختلق المهام أو المتطلبات نيابة عنك.","基本信息":"المعلومات الأساسية","点击任意字段即可修改":"انقر على أي حقل لتعديله","每行一条 · 影响候选人判断":"سطر واحد لكل بند · يؤثر على تقييم المرشحين","任职要求":"متطلبات الوظيفة","硬性 / 优先分开写":"افصل بين الإلزامي والأفضلي","硬性条件":"الشروط الإلزامية","优先条件":"الشروط التفضيلية","工作与生活":"العمل والحياة","住宿、班车、探亲假":"السكن، الحافلة، إجازة زيارة الأهل","AI 润色这段":"تحسين هذه الفقرة بالذكاء الاصطناعي","诊断建议":"توصيات التشخيص","点「采用建议」写进对应字段":"انقر على «اعتماد الاقتراح» لكتابته في الحقل المقابل","AI 重新生成岗位内容":"إعادة توليد محتوى الوظيفة بالذكاء الاصطناعي","保存并重新分析":"حفظ وإعادة التحليل","保存草稿":"حفظ المسودة","取消":"إلغاء"});
  Object.assign(DICT.fr, {"岗位 AI 诊断 · 开机动画":"Diagnostic IA du poste · Animation de démarrage","基于当前保存版本":"Basé sur la version actuellement enregistrée","音效 ON":"Son ON","跳过开机 →":"Passer le démarrage →","关闭 ×":"Fermer ×","正在启动诊断引擎…":"Démarrage du moteur de diagnostic…","重新分析":"Réanalyser","完整度":"Complétude","可以发布":"Prêt à publier","建议补齐后发布":"À compléter avant publication","先补齐关键信息":"Complétez d'abord les informations clés","岗位信息比较完整":"Les informations du poste sont relativement complètes","需要补齐关键信息":"Informations clés à compléter","岗位职责，硬性要求，薪资合同与生活信息越完整，候选人匹配越准确。":"Plus les responsabilités, les exigences obligatoires, le salaire, le contrat et les informations sur le cadre de vie sont complets, plus le matching des candidats est précis.","岗位职责、硬性要求、薪资合同与生活信息越完整，候选人匹配越准确。":"Plus les responsabilités, les exigences obligatoires, le contrat de salaire et les informations sur la vie quotidienne sont complètes, plus le matching des candidats est précis.","岗位要素对照":"Comparaison des éléments du poste","分数构成":"Composition du score","优势":"Points forts","需要补充":"À compléter","暂未识别到明显优势。":"Aucun avantage évident identifié pour le moment.","岗位信息比较完整，可以发布。":"Les informations du poste sont relativement complètes, publication possible.","规则引擎 · 当前版本":"Moteur de règles · Version actuelle","编辑岗位":"Modifier le poste","保存后可重新分析，查看分数变化":"Enregistrez pour relancer l'analyse et voir l'évolution du score","AI 重新生成":"Régénérer avec l'IA","岗位中所有信息均可修改。AI 只在你已有内容的基础上帮你表达得更清楚，不会替你编造职责或要求。":"Toutes les informations du poste sont modifiables. L'IA vous aide uniquement à exprimer plus clairement ce que vous avez déjà saisi, elle n'inventera pas de responsabilités ou d'exigences à votre place.","基本信息":"Informations de base","点击任意字段即可修改":"Cliquez sur n'importe quel champ pour le modifier","每行一条 · 影响候选人判断":"Une ligne par élément · Influence le jugement des candidats","任职要求":"Exigences du poste","硬性 / 优先分开写":"Exigences obligatoires / préférentielles à séparer","硬性条件":"Conditions obligatoires","优先条件":"Conditions préférentielles","工作与生活":"Travail et vie","住宿、班车、探亲假":"Logement, navette, congés pour visite familiale","AI 润色这段":"Reformuler ce passage avec l'IA","诊断建议":"Suggestions de diagnostic","点「采用建议」写进对应字段":"Cliquez sur « Adopter la suggestion » pour l'insérer dans le champ correspondant","AI 重新生成岗位内容":"Régénérer le contenu du poste avec l'IA","保存并重新分析":"Enregistrer et relancer l'analyse","保存草稿":"Enregistrer le brouillon","取消":"Annuler"});

  Object.assign(DICT.fr,{'全部岗位（最近分析）':'Tous les postes (analyse récente)','共':'Total','个板块 · 向下滑动查看完整简历':'sections · faites défiler pour voir le CV complet'});
  Object.assign(DICT.th,{'全部岗位（最近分析）':'ทุกตำแหน่ง (วิเคราะห์ล่าสุด)','共':'ทั้งหมด','个板块 · 向下滑动查看完整简历':'ส่วน · เลื่อนเพื่อดูเรซูเม่เต็ม'});
  Object.assign(DICT.ja,{'全部岗位（最近分析）':'すべての求人（最新分析）','共':'合計','个板块 · 向下滑动查看完整简历':'セクション · スクロールして履歴書全体を表示'});
  Object.assign(DICT.ar,{'全部岗位（最近分析）':'كل الوظائف (التحليل الأخير)','共':'الإجمالي','个板块 · 向下滑动查看完整简历':'أقسام · مرر لعرض السيرة الكاملة'});
  /* 报告/成员 */
  Object.assign(DICT.th, {"导出报告":"ส่งออกรายงาน","在岗人员趋势":"แนวโน้มจำนวนพนักงานที่ปฏิบัติงาน","中方派遣 + 当地用工 · 近 6 个月":"การจัดส่งจากฝ่ายจีน + การจ้างงานท้องถิ่น · 6 เดือนล่าสุด","本月用工报告":"รายงานการจ้างงานประจำเดือนนี้","在岗 29 人（派遣 21 / 当地 8），出勤率 97.2%，无合规预警项；本月派遣薪酬结算 ¥118.6 万，当地雇员薪酬结算 ¥67.8 万（示例数据）。":"พนักงานที่ปฏิบัติงาน 29 คน (จัดส่ง 21 / ท้องถิ่น 8) อัตราการเข้างาน 97.2% ไม่มีรายการแจ้งเตือนด้านการปฏิบัติตามกฎระเบียบ การชำระค่าตอบแทนพนักงานจัดส่งเดือนนี้ ¥118.6 หมื่น การชำระค่าตอบแทนพนักงานท้องถิ่น ¥67.8 หมื่น (ข้อมูลตัวอย่าง)","结算明细":"รายละเอียดการชำระบัญชี","2026 年 9 月 · 口径：结算单":"กันยายน 2026 · เกณฑ์: ใบชำระบัญชี","结算单号":"เลขที่ใบชำระบัญชี","项目":"โครงการ","类别":"ประเภท","金额":"จำนวนเงิน","状态":"สถานะ","添加成员":"เพิ่มสมาชิก","消息中心":"ศูนย์ข้อความ","节点自动推送":"การแจ้งเตือนอัตโนมัติตามโหนด","审批中心":"ศูนย์อนุมัติ","刷新":"รีเฟรช","申请调整成员权限":"ยื่นคำขอปรับสิทธิ์สมาชิก"});
  Object.assign(DICT.ja, {"导出报告":"レポートをエクスポート","在岗人员趋势":"在籍人員の推移","中方派遣 + 当地用工 · 近 6 个月":"中国側派遣 + 現地雇用 · 直近6か月","本月用工报告":"今月の用工レポート","在岗 29 人（派遣 21 / 当地 8），出勤率 97.2%，无合规预警项；本月派遣薪酬结算 ¥118.6 万，当地雇员薪酬结算 ¥67.8 万（示例数据）。":"在籍29名（派遣21 / 現地8）、出勤率97.2%、コンプライアンス警告項目なし。今月の派遣給与決済は¥118.6万、現地雇用者給与決済は¥67.8万（サンプルデータ）。","结算明细":"決済明細","2026 年 9 月 · 口径：结算单":"2026年9月 · 基準：決済書","结算单号":"決済書番号","项目":"プロジェクト","类别":"区分","金额":"金額","状态":"ステータス","添加成员":"メンバーを追加","消息中心":"メッセージセンター","节点自动推送":"ノード自動プッシュ","审批中心":"承認センター","刷新":"更新","申请调整成员权限":"メンバー権限の調整を申請"});
  Object.assign(DICT.ar, {"导出报告":"تصدير التقرير","在岗人员趋势":"اتجاه الموظفين على رأس العمل","中方派遣 + 当地用工 · 近 6 个月":"إيفاد صيني + توظيف محلي · آخر 6 أشهر","本月用工报告":"تقرير التوظيف لهذا الشهر","在岗 29 人（派遣 21 / 当地 8），出勤率 97.2%，无合规预警项；本月派遣薪酬结算 ¥118.6 万，当地雇员薪酬结算 ¥67.8 万（示例数据）。":"29 موظفًا على رأس العمل (21 مُوفدًا / 8 محليين)، معدل الحضور 97.2%، لا توجد بنود إنذار بالامتثال؛ تسوية رواتب المُوفدين لهذا الشهر ¥118.6万، تسوية رواتب الموظفين المحليين ¥67.8万 (بيانات تجريبية).","结算明细":"تفاصيل التسوية","2026 年 9 月 · 口径：结算单":"سبتمبر 2026 · الأساس: كشف التسوية","结算单号":"رقم كشف التسوية","项目":"المشروع","类别":"الفئة","金额":"المبلغ","状态":"الحالة","添加成员":"إضافة عضو","消息中心":"مركز الرسائل","节点自动推送":"دفع تلقائي للعقد","审批中心":"مركز الموافقات","刷新":"تحديث","申请调整成员权限":"طلب تعديل صلاحيات الأعضاء"});
  Object.assign(DICT.fr, {"导出报告":"Exporter le rapport","在岗人员趋势":"Tendance des effectifs en poste","中方派遣 + 当地用工 · 近 6 个月":"Détachement chinois + emploi local · 6 derniers mois","本月用工报告":"Rapport d'effectifs du mois","在岗 29 人（派遣 21 / 当地 8），出勤率 97.2%，无合规预警项；本月派遣薪酬结算 ¥118.6 万，当地雇员薪酬结算 ¥67.8 万（示例数据）。":"29 personnes en poste (21 détachées / 8 locales), taux de présence 97,2 %, aucune alerte de conformité ; règlement des salaires des détachés ce mois-ci ¥118,6万, règlement des salaires des employés locaux ¥67,8万 (données d'exemple).","结算明细":"Détail du règlement","2026 年 9 月 · 口径：结算单":"Septembre 2026 · Base : bordereau de règlement","结算单号":"N° de bordereau de règlement","项目":"Projet","类别":"Catégorie","金额":"Montant","状态":"Statut","添加成员":"Ajouter un membre","消息中心":"Centre de messages","节点自动推送":"Notification automatique aux étapes","审批中心":"Centre d'approbation","刷新":"Actualiser","申请调整成员权限":"Demander la modification des droits des membres"});

  /* 知识库/消息 */
  Object.assign(DICT.th, {"政策细则":"รายละเอียดนโยบาย","阿尔及利亚劳动法要点":"ประเด็นสำคัญกฎหมายแรงงานแอลจีเรีย","最低工资、工时与加班、社保费率、终止雇佣规则摘要（示例条目，附来源与更新日期）":"สรุปค่าจ้างขั้นต่ำ ชั่วโมงทำงานและค่าล่วงเวลา อัตราเงินสมทบประกันสังคม กฎการเลิกจ้าง (รายการตัวอย่าง พร้อมแหล่งที่มาและวันที่อัปเดต)","AI 问答 · 参考":"ถาม-ตอบ AI · อ้างอิง","阿尔及利亚外国员工工作许可":"ใบอนุญาตทำงานสำหรับพนักงานต่างชาติในแอลจีเรีย","工作签证要求：高中以上学历 + 毕业证 / 技能证书；办理周期与材料清单":"ข้อกำหนดวีซ่าทำงาน: วุฒิการศึกษาระดับมัธยมปลายขึ้นไป + ประกาศนียบัตร/ใบรับรองทักษะ; ระยะเวลาดำเนินการและรายการเอกสาร","案例实证":"กรณีศึกษาจริง","招聘渠道":"ช่องทางการสรรหาบุคลากร","目的国当地招聘渠道":"ช่องทางการสรรหาบุคลากรในประเทศปลายทาง","本地招聘平台、职业介绍所、社区渠道清单及使用建议（示例）":"รายการแพลตฟอร์มสรรหาท้องถิ่น สำนักงานจัดหางาน ช่องทางชุมชน และคำแนะนำการใช้งาน (ตัวอย่าง)","渠道库":"คลังช่องทาง","文书模板":"แม่แบบเอกสาร","外派人员劳动合同（中阿双语）":"สัญญาจ้างแรงงานพนักงานส่งไปประจำต่างประเทศ (จีน-อาหรับสองภาษา)","含合同必备事项清单：工作内容、报酬、社保、居留许可、意外险":"พร้อมรายการข้อกำหนดจำเป็นของสัญญา: เนื้อหางาน ค่าตอบแทน ประกันสังคม ใบอนุญาตพำนัก ประกันอุบัติเหตุ","模板":"แม่แบบ","当地备案文件清单":"รายการเอกสารจดทะเบียนท้องถิ่น","工作许可、居留许可、用工备案所需材料与流程":"เอกสารและขั้นตอนที่จำเป็นสำหรับใบอนุญาตทำงาน ใบอนุญาตพำนัก และการจดทะเบียนการจ้างงาน","税务合规":"การปฏิบัติตามข้อกำหนดด้านภาษี","境外派遣个税与结汇指引":"แนวทางภาษีบุคคลธรรมดาและการแลกเปลี่ยนเงินตราสำหรับการส่งพนักงานไปต่างประเทศ","个税申报、税收协定、结汇合规要点（示例条目，专业事项转复核）":"ประเด็นการยื่นภาษีบุคคลธรรมดา อนุสัญญาภาษีซ้อน และการปฏิบัติตามข้อกำหนดการแลกเปลี่ยนเงินตรา (รายการตัวอย่าง เรื่องวิชาชีพให้ส่งตรวจสอบซ้ำ)","签证节点":"จุดสำคัญวีซ่า","5 名派遣人员签证材料待补交 · 影响签证预审进度":"เอกสารวีซ่าของพนักงานส่งไปประจำ 5 คนรอส่งเพิ่มเติม · กระทบความคืบหน้าการตรวจสอบวีซ่าเบื้องต้น","紧急":"เร่งด่วน","结算对账":"การกระทบยอดการชำระบัญชี","阿尔及利亚项目 9 月账单待确认 · 截止明日":"ใบแจ้งหนี้โครงการแอลจีเรียเดือนกันยายนรอการยืนยัน · ครบกำหนดพรุ่งนี้","待办":"รายการที่ต้องดำเนินการ","保险续保":"ต่ออายุประกันภัย","3 名当地雇员保单 11 月到期 · 可发起续保":"กรมธรรม์พนักงานท้องถิ่น 3 คนหมดอายุพฤศจิกายน · สามารถเริ่มต่ออายุได้","提醒":"แจ้งเตือน","政策更新":"อัปเดตนโยบาย","阿尔及利亚工作许可材料要求已更新至知识库":"ข้อกำหนดเอกสารใบอนุญาตทำงานแอลจีเรียอัปเดตเข้าฐานความรู้แล้ว","资讯":"ข้อมูลข่าวสาร","面试安排":"การนัดสัมภาษณ์","同传面试：工艺工程师岗位 · 2 名当地候选人":"สัมภาษณ์แบบล่ามพร้อมกัน: ตำแหน่งวิศวกรกระบวนการ · ผู้สมัครท้องถิ่น 2 คน","已读":"อ่านแล้ว","知道了":"รับทราบ","条目为 AI 问答参考，非法律意见。":"รายการนี้เป็นข้อมูลอ้างอิงถาม-ตอบ AI ไม่ใช่ความเห็นทางกฎหมาย"});
  Object.assign(DICT.ja, {"政策细则":"政策細則","阿尔及利亚劳动法要点":"アルジェリア労働法の要点","最低工资、工时与加班、社保费率、终止雇佣规则摘要（示例条目，附来源与更新日期）":"最低賃金、労働時間と残業、社会保険料率、雇用終了規則の要約（サンプル項目、出典と更新日付き）","AI 问答 · 参考":"AI 質疑応答・参考","阿尔及利亚外国员工工作许可":"アルジェリア外国人従業員の労働許可","工作签证要求：高中以上学历 + 毕业证 / 技能证书；办理周期与材料清单":"就労ビザ要件：高校以上の学歴＋卒業証明書／技能証明書；手続き期間と必要書類リスト","案例实证":"事例実証","招聘渠道":"採用チャネル","目的国当地招聘渠道":"目的国現地の採用チャネル","本地招聘平台、职业介绍所、社区渠道清单及使用建议（示例）":"現地採用プラットフォーム、職業紹介所、コミュニティチャネルのリストと活用提案（サンプル）","渠道库":"チャネルライブラリ","文书模板":"書類テンプレート","外派人员劳动合同（中阿双语）":"海外派遣人員の労働契約書（中日二言語）","含合同必备事项清单：工作内容、报酬、社保、居留许可、意外险":"契約必須事項リストを含む：業務内容、報酬、社会保険、居留許可、傷害保険","模板":"テンプレート","当地备案文件清单":"現地届出書類リスト","工作许可、居留许可、用工备案所需材料与流程":"労働許可、居留許可、雇用届出に必要な書類と手続き","税务合规":"税務コンプライアンス","境外派遣个税与结汇指引":"海外派遣の個人所得税と外貨決済ガイド","个税申报、税收协定、结汇合规要点（示例条目，专业事项转复核）":"個人所得税申告、租税条約、外貨決済コンプライアンスの要点（サンプル項目、専門事項は再確認へ）","签证节点":"ビザノード","5 名派遣人员签证材料待补交 · 影响签证预审进度":"派遣人員5名のビザ書類が追加提出待ち・ビザ事前審査の進捗に影響","紧急":"緊急","结算对账":"決済照合","阿尔及利亚项目 9 月账单待确认 · 截止明日":"アルジェリアプロジェクトの9月請求書が確認待ち・締切は明日","待办":"ToDo","保险续保":"保険更新","3 名当地雇员保单 11 月到期 · 可发起续保":"現地従業員3名の保険証券が11月満期・更新手続き可能","提醒":"リマインダー","阿尔及利亚工作许可材料要求已更新至知识库":"アルジェリア労働許可の書類要件がナレッジベースに更新されました","资讯":"お知らせ","面试安排":"面接手配","同传面试：工艺工程师岗位 · 2 名当地候选人":"同時通訳面接：プロセスエンジニア職・現地候補者2名","已读":"既読","知道了":"了解しました","条目为 AI 问答参考，非法律意见。":"項目はAI質疑応答の参考であり、法的意見ではありません。"});
  Object.assign(DICT.ar, {"政策细则":"تفاصيل السياسة","阿尔及利亚劳动法要点":"النقاط الرئيسية لقانون العمل الجزائري","最低工资、工时与加班、社保费率、终止雇佣规则摘要（示例条目，附来源与更新日期）":"ملخص الحد الأدنى للأجور وساعات العمل والعمل الإضافي ومعدلات الضمان الاجتماعي وقواعد إنهاء التوظيف (بنود نموذجية مع المصدر وتاريخ التحديث)","AI 问答 · 参考":"أسئلة وأجوبة الذكاء الاصطناعي · مرجع","阿尔及利亚外国员工工作许可":"تصريح العمل للموظفين الأجانب في الجزائر","工作签证要求：高中以上学历 + 毕业证 / 技能证书；办理周期与材料清单":"متطلبات تأشيرة العمل: مؤهل التعليم الثانوي أو أعلى + شهادة التخرج / شهادة المهارات؛ مدة الإنجاز وقائمة المستندات","案例实证":"إثباتات حالة عملية","招聘渠道":"قنوات التوظيف","目的国当地招聘渠道":"قنوات التوظيف المحلية في بلد المقصد","本地招聘平台、职业介绍所、社区渠道清单及使用建议（示例）":"قائمة منصات التوظيف المحلية ومكاتب التوظيف والقنوات المجتمعية ونصائح الاستخدام (نموذج)","渠道库":"مكتبة القنوات","文书模板":"قوالب المستندات","外派人员劳动合同（中阿双语）":"عقد عمل الموظف المنتدب (ثنائي اللغة الصينية-العربية)","含合同必备事项清单：工作内容、报酬、社保、居留许可、意外险":"يتضمن قائمة البنود الإلزامية للعقد: محتوى العمل والأجر والضمان الاجتماعي وتصريح الإقامة والتأمين ضد الحوادث","模板":"قالب","当地备案文件清单":"قائمة مستندات التسجيل المحلي","工作许可、居留许可、用工备案所需材料与流程":"المستندات والإجراءات المطلوبة لتصريح العمل وتصريح الإقامة وتسجيل التوظيف","税务合规":"الامتثال الضريبي","境外派遣个税与结汇指引":"إرشادات ضريبة الدخل الفردي وتسوية النقد الأجنبي للانتداب الخارجي","个税申报、税收协定、结汇合规要点（示例条目，专业事项转复核）":"النقاط الرئيسية لإقرار ضريبة الدخل الفردي والاتفاقيات الضريبية والامتثال لتسوية النقد الأجنبي (بنود نموذجية، تُحال المسائل المتخصصة للمراجعة)","签证节点":"مراحل التأشيرة","5 名派遣人员签证材料待补交 · 影响签证预审进度":"مستندات تأشيرة 5 موظفين منتدبين بانتظار الاستكمال · تؤثر على تقدم المراجعة الأولية للتأشيرة","紧急":"عاجل","结算对账":"مطابقة التسوية","阿尔及利亚项目 9 月账单待确认 · 截止明日":"فاتورة مشروع الجزائر لشهر سبتمبر بانتظار التأكيد · الموعد النهائي غداً","待办":"المهام المعلقة","保险续保":"تجديد التأمين","3 名当地雇员保单 11 月到期 · 可发起续保":"وثائق تأمين 3 موظفين محليين تنتهي في نوفمبر · يمكن بدء التجديد","提醒":"تذكير","政策更新":"تحديث السياسة","阿尔及利亚工作许可材料要求已更新至知识库":"تم تحديث متطلبات تصريح العمل في الجزائر في قاعدة المعرفة","资讯":"معلومات","面试安排":"ترتيبات المقابلة","同传面试：工艺工程师岗位 · 2 名当地候选人":"مقابلة ترجمة فورية: وظيفة مهندس عمليات · مرشحان محليان","已读":"تمت القراءة","知道了":"فهمت","条目为 AI 问答参考，非法律意见。":"البنود هي مرجع لأسئلة وأجوبة الذكاء الاصطناعي وليست رأياً قانونياً."});
  Object.assign(DICT.fr, {"政策细则":"Détails des politiques","阿尔及利亚劳动法要点":"Points clés du droit du travail algérien","最低工资、工时与加班、社保费率、终止雇佣规则摘要（示例条目，附来源与更新日期）":"Résumé du salaire minimum, des heures de travail et des heures supplémentaires, des taux de cotisation sociale et des règles de rupture du contrat de travail (entrées d'exemple, avec sources et dates de mise à jour)","AI 问答 · 参考":"Questions-réponses IA · Référence","阿尔及利亚外国员工工作许可":"Permis de travail pour les employés étrangers en Algérie","工作签证要求：高中以上学历 + 毕业证 / 技能证书；办理周期与材料清单":"Exigences du visa de travail : diplôme d'études secondaires ou supérieur + diplôme de fin d'études / certificat de compétences ; délais de traitement et liste des documents","案例实证":"Étude de cas","招聘渠道":"Canaux de recrutement","目的国当地招聘渠道":"Canaux de recrutement locaux dans le pays de destination","本地招聘平台、职业介绍所、社区渠道清单及使用建议（示例）":"Liste des plateformes de recrutement locales, agences de placement, canaux communautaires et conseils d'utilisation (exemples)","渠道库":"Bibliothèque de canaux","文书模板":"Modèles de documents","外派人员劳动合同（中阿双语）":"Contrat de travail du personnel détaché (bilingue chinois-arabe)","含合同必备事项清单：工作内容、报酬、社保、居留许可、意外险":"Liste des éléments obligatoires du contrat : contenu du travail, rémunération, sécurité sociale, permis de séjour, assurance accidents","模板":"Modèles","当地备案文件清单":"Liste des documents d'enregistrement locaux","工作许可、居留许可、用工备案所需材料与流程":"Documents et procédures requis pour le permis de travail, le permis de séjour et l'enregistrement de l'emploi","税务合规":"Conformité fiscale","境外派遣个税与结汇指引":"Guide sur l'impôt sur le revenu des personnes physiques et la conversion de devises pour les détachements à l'étranger","个税申报、税收协定、结汇合规要点（示例条目，专业事项转复核）":"Points clés sur la déclaration d'impôt sur le revenu, les conventions fiscales et la conformité des conversions de devises (entrées d'exemple, questions professionnelles à soumettre pour vérification)","签证节点":"Étapes du visa","5 名派遣人员签证材料待补交 · 影响签证预审进度":"Documents de visa de 5 détachés à compléter · impact sur l'avancement de la pré-évaluation des visas","紧急":"Urgent","结算对账":"Règlement et rapprochement","阿尔及利亚项目 9 月账单待确认 · 截止明日":"Facture de septembre du projet Algérie en attente de confirmation · échéance demain","待办":"À faire","保险续保":"Renouvellement de l'assurance","3 名当地雇员保单 11 月到期 · 可发起续保":"3 employés locaux, police d'assurance expirant en novembre · renouvellement possible","提醒":"Rappel","政策更新":"Mise à jour des politiques","阿尔及利亚工作许可材料要求已更新至知识库":"Les exigences en matière de documents pour le permis de travail en Algérie ont été mises à jour dans la base de connaissances","资讯":"Actualités","面试安排":"Organisation des entretiens","同传面试：工艺工程师岗位 · 2 名当地候选人":"Entretien avec interprétation simultanée : poste d'ingénieur des procédés · 2 candidats locaux","已读":"Lu","知道了":"Compris","条目为 AI 问答参考，非法律意见。":"Les entrées sont des références de questions-réponses IA, et non des avis juridiques."});

  Object.assign(DICT.fr,{'当前账号':'Compte actuel','编辑权限':'Modifier les droits','无管理权限':'Aucun droit de gestion','需要「成员与权限」权限':'Droits « membres et permissions » requis','项目人力资源负责人':'Responsable RH projet','结算对账':'Rapprochement des règlements','项目管理':'Gestion de projet','在线':'En ligne','离线':'Hors ligne','成员与权限':'Membres et permissions'});
  Object.assign(DICT.th,{'当前账号':'บัญชีปัจจุบัน','编辑权限':'แก้ไขสิทธิ์','无管理权限':'ไม่มีสิทธิ์จัดการ','需要「成员与权限」权限':'ต้องมีสิทธิ์สมาชิกและสิทธิ์','项目人力资源负责人':'ผู้รับผิดชอบ HR โครงการ','结算对账':'กระทบยอดชำระ','项目管理':'จัดการโครงการ','在线':'ออนไลน์','离线':'ออฟไลน์','成员与权限':'สมาชิกและสิทธิ์'});
  Object.assign(DICT.ja,{'当前账号':'現在のアカウント','编辑权限':'権限を編集','无管理权限':'管理権限なし','需要「成员与权限」权限':'メンバーと権限の権限が必要','项目人力资源负责人':'プロジェクトHR責任者','结算对账':'決済照合','项目管理':'プロジェクト管理','在线':'オンライン','离线':'オフライン','成员与权限':'メンバーと権限'});
  Object.assign(DICT.ar,{'当前账号':'الحساب الحالي','编辑权限':'تعديل الصلاحيات','无管理权限':'لا توجد صلاحية إدارة','需要「成员与权限」权限':'صلاحية الأعضاء والصلاحيات مطلوبة','项目人力资源负责人':'مسؤول الموارد البشرية للمشروع','结算对账':'تسوية المدفوعات','项目管理':'إدارة المشاريع','在线':'متصل','离线':'غير متصل','成员与权限':'الأعضاء والصلاحيات'});
  /* 结算数据 */
  Object.assign(DICT.th, {"阿尔及利亚玻璃制品工厂":"โรงงานผลิตภัณฑ์แก้วแอลจีเรีย","中方派遣薪酬":"ค่าตอบแทนการส่งพนักงานฝ่ายจีน","当地雇员薪酬":"ค่าตอบแทนพนักงานท้องถิ่น","已确认":"ยืนยันแล้ว","待确认":"รอยืนยัน","已开票":"ออกใบแจ้งหนี้แล้ว","未开票":"ยังไม่ออกใบแจ้งหนี้","已付款":"ชำระเงินแล้ว","未付款":"ยังไม่ชำระเงิน","项目":"โครงการ","类别":"ประเภท","金额":"จำนวนเงิน","状态":"สถานะ","发票":"ใบแจ้งหนี้","结算明细":"รายละเอียดการชำระบัญชี"});
  Object.assign(DICT.ja, {"阿尔及利亚玻璃制品工厂":"アルジェリアガラス製品工場","中方派遣薪酬":"中国側派遣報酬","当地雇员薪酬":"現地雇用者報酬","已确认":"確認済み","待确认":"確認待ち","已开票":"請求済み","未开票":"未請求","已付款":"支払済み","未付款":"未払い","项目":"プロジェクト","类别":"区分","金额":"金額","状态":"ステータス","发票":"請求書","结算明细":"決済明細"});
  Object.assign(DICT.ar, {"阿尔及利亚玻璃制品工厂":"مصنع المنتجات الزجاجية في الجزائر","中方派遣薪酬":"أجور الإيفاد الصيني","当地雇员薪酬":"أجور الموظفين المحليين","已确认":"مؤكد","待确认":"قيد التأكيد","已开票":"تم إصدار الفاتورة","未开票":"لم تصدر الفاتورة","已付款":"مدفوع","未付款":"غير مدفوع","项目":"المشروع","类别":"الفئة","金额":"المبلغ","状态":"الحالة","发票":"فاتورة","结算明细":"تفاصيل التسوية"});
  Object.assign(DICT.fr, {"阿尔及利亚玻璃制品工厂":"Usine de produits en verre d'Algérie","中方派遣薪酬":"Rémunération des expatriés chinois","当地雇员薪酬":"Rémunération des employés locaux","已确认":"Confirmé","待确认":"À confirmer","已开票":"Facturé","未开票":"Non facturé","已付款":"Payé","未付款":"Non payé","项目":"Projet","类别":"Catégorie","金额":"Montant","状态":"Statut","发票":"Facture","结算明细":"Détail du règlement"});

  /* 简历库数据 */
  Object.assign(DICT.th, {"压机操作":"การควบคุมเครื่องอัด","装配技术员":"ช่างเทคนิคประกอบ","仓储物流":"คลังสินค้าและโลจิสติกส์","质检员":"เจ้าหน้าที่ควบคุมคุณภาพ","阿尔及利亚":"แอลจีเรีย","越南":"เวียดนาม","沙特":"ซาอุดีอาระเบีย","马来西亚":"มาเลเซีย","3 天前":"3 วันที่แล้ว","10 天前":"10 วันที่แล้ว","17 天前":"17 วันที่แล้ว","24 天前":"24 วันที่แล้ว","31 天前":"31 วันที่แล้ว","38 天前":"38 วันที่แล้ว","45 天前":"45 วันที่แล้ว","52 天前":"52 วันที่แล้ว","8 年压机一线，与岗位完全对口":"8 ปีในสายการผลิตเครื่องอัด ตรงกับตำแหน่งโดยตรง","有换模标准化经验":"มีประสบการณ์การเปลี่ยนแม่พิมพ์ตามมาตรฐาน","持中级职业资格证":"มีใบรับรองวิชาชีพระดับกลาง","无海外经历":"ไม่มีประสบการณ์ต่างประเทศ","语言仅基础英语":"ภาษามีเพียงภาษาอังกฤษพื้นฐาน","护照有效期未写":"ไม่ได้ระบุอายุหนังสือเดินทาง","装配 6 年，识图能力强":"ประกอบ 6 ปี ความสามารถในการอ่านแบบDrawingดี","未写过完整项目":"ไม่เคยเขียนโครงการที่สมบูรณ์","仓储流程熟":"คุ้นเคยกระบวนการคลังสินค้า","英语弱":"ภาษาอังกฤษอ่อน","压机 5 年":"เครื่องอัด 5 ปี","无证书":"ไม่มีใบรับรอง","熟悉 AQL 抽检":"คุ้นเคยการสุ่มตรวจ AQL","语言不达标":"ภาษาไม่ถึงเกณฑ์","有叉车证":"มีใบรับรองรถโฟล์คลิฟท์","合同意识弱":"จิตสำนึกเรื่องสัญญาอ่อน","基础质检经验":"ประสบการณ์ตรวจสอบคุณภาพพื้นฐาน","无稳定性":"ไม่มีความมั่นคง","智能分析":"การวิเคราะห์อัจฉริยะ","原简历":"เรซูเม่ต้นฉบับ","五维得分":"คะแนนห้ามิติ","优势":"จุดเด่น","不足":"จุดด้อย","自动入库":"นำเข้าคลังอัตโนมัติ","手动上传":"อัปโหลดด้วยตนเอง","姓名":"ชื่อ","岗位":"ตำแหน่ง","国家":"ประเทศ","匹配":"การจับคู่","风险":"ความเสี่ยง","五维":"ห้ามิติ"});
  Object.assign(DICT.ja, {"压机操作":"プレス機操作","装配技术员":"組立技術員","仓储物流":"倉庫物流","质检员":"品質検査員","阿尔及利亚":"アルジェリア","越南":"ベトナム","沙特":"サウジアラビア","马来西亚":"マレーシア","3 天前":"3 日前","10 天前":"10 日前","17 天前":"17 日前","24 天前":"24 日前","31 天前":"31 日前","38 天前":"38 日前","45 天前":"45 日前","52 天前":"52 日前","8 年压机一线，与岗位完全对口":"プレス機一線で8年、職務と完全に一致","有换模标准化经验":"段取り替えの標準化経験あり","持中级职业资格证":"中級職業資格証を保有","无海外经历":"海外経験なし","语言仅基础英语":"言語は基礎英語のみ","护照有效期未写":"パスポート有効期限の記載なし","装配 6 年，识图能力强":"組立6年、図面読解力が高い","未写过完整项目":"完全なプロジェクトの記載なし","仓储流程熟":"倉庫業務の流れに精通","英语弱":"英語が弱い","压机 5 年":"プレス機5年","无证书":"資格証なし","熟悉 AQL 抽检":"AQL抜取検査に精通","语言不达标":"言語が基準未達","有叉车证":"フォークリフト免許あり","合同意识弱":"契約意識が弱い","基础质检经验":"基礎的な品質検査経験","无稳定性":"安定性なし","智能分析":"スマート分析","原简历":"元の履歴書","五维得分":"五次元スコア","优势":"強み","不足":"不足点","自动入库":"自動登録","手动上传":"手動アップロード","姓名":"氏名","岗位":"職種","国家":"国","匹配":"マッチング","风险":"リスク","五维":"五次元"});
  Object.assign(DICT.ar, {"压机操作":"تشغيل المكبس","装配技术员":"فني تجميع","仓储物流":"التخزين والخدمات اللوجستية","质检员":"مفتش جودة","阿尔及利亚":"الجزائر","越南":"فيتنام","沙特":"السعودية","马来西亚":"ماليزيا","3 天前":"قبل 3 أيام","10 天前":"قبل 10 أيام","17 天前":"قبل 17 يومًا","24 天前":"قبل 24 يومًا","31 天前":"قبل 31 يومًا","38 天前":"قبل 38 يومًا","45 天前":"قبل 45 يومًا","52 天前":"قبل 52 يومًا","8 年压机一线，与岗位完全对口":"8 سنوات في خط تشغيل المكبس، مطابق تمامًا للوظيفة","有换模标准化经验":"لديه خبرة في توحيد إجراءات تغيير القوالب","持中级职业资格证":"حاصل على شهادة مؤهل مهني متوسط","无海外经历":"لا توجد خبرة خارجية","语言仅基础英语":"اللغة إنجليزية أساسية فقط","护照有效期未写":"لم تُذكر صلاحية جواز السفر","装配 6 年，识图能力强":"6 سنوات في التجميع، قدرة قوية على قراءة المخططات","未写过完整项目":"لم يكتب مشروعًا متكاملًا","仓储流程熟":"ملم بإجراءات التخزين","英语弱":"الإنجليزية ضعيفة","压机 5 年":"5 سنوات في المكبس","无证书":"بدون شهادات","熟悉 AQL 抽检":"ملم بفحص العينات وفق AQL","语言不达标":"اللغة غير مطابقة للمتطلبات","有叉车证":"حاصل على رخصة رافعة شوكية","合同意识弱":"الوعي التعاقدي ضعيف","基础质检经验":"خبرة أساسية في فحص الجودة","无稳定性":"لا يوجد استقرار وظيفي","智能分析":"تحليل ذكي","原简历":"السيرة الذاتية الأصلية","五维得分":"الدرجة الخماسية الأبعاد","优势":"المزايا","不足":"نقاط الضعف","自动入库":"إدخال تلقائي","手动上传":"رفع يدوي","姓名":"الاسم","岗位":"الوظيفة","国家":"البلد","匹配":"المطابقة","风险":"المخاطر","五维":"خمسة أبعاد"});
  Object.assign(DICT.fr, {"压机操作":"Conduite de presse","装配技术员":"Technicien d'assemblage","仓储物流":"Entreposage et logistique","质检员":"Contrôleur qualité","阿尔及利亚":"Algérie","越南":"Vietnam","沙特":"Arabie saoudite","马来西亚":"Malaisie","3 天前":"il y a 3 jours","10 天前":"il y a 10 jours","17 天前":"il y a 17 jours","24 天前":"il y a 24 jours","31 天前":"il y a 31 jours","38 天前":"il y a 38 jours","45 天前":"il y a 45 jours","52 天前":"il y a 52 jours","8 年压机一线，与岗位完全对口":"8 ans en première ligne sur presse, parfaitement en adéquation avec le poste","有换模标准化经验":"Expérience en standardisation des changements de moule","持中级职业资格证":"Titulaire d'un certificat de qualification professionnelle de niveau intermédiaire","无海外经历":"Aucune expérience à l'étranger","语言仅基础英语":"Langue : anglais de base uniquement","护照有效期未写":"Validité du passeport non précisée","装配 6 年，识图能力强":"6 ans en assemblage, forte capacité de lecture de plans","未写过完整项目":"N'a jamais rédigé de projet complet","仓储流程熟":"Maîtrise des processus d'entreposage","英语弱":"Anglais faible","压机 5 年":"5 ans sur presse","无证书":"Aucun certificat","熟悉 AQL 抽检":"Maîtrise du contrôle par échantillonnage AQL","语言不达标":"Niveau de langue non conforme","有叉车证":"Titulaire du permis de conduire de chariot élévateur","合同意识弱":"Faible sens du contrat","基础质检经验":"Expérience de base en contrôle qualité","无稳定性":"Aucune stabilité","智能分析":"Analyse intelligente","原简历":"CV original","五维得分":"Score à cinq dimensions","优势":"Points forts","不足":"Points faibles","自动入库":"Importation automatique","手动上传":"Téléversement manuel","姓名":"Nom","岗位":"Poste","国家":"Pays","匹配":"Correspondance","风险":"Risque","五维":"Cinq dimensions"});

  Object.assign(DICT.fr,{'当前已是原文':'Le texte original est déjà affiché'}); Object.assign(DICT.th,{'当前已是原文':'ข้อความต้นฉบับแสดงอยู่แล้ว'}); Object.assign(DICT.ja,{'当前已是原文':'すでに原文です'}); Object.assign(DICT.ar,{'当前已是原文':'النص الأصلي معروض بالفعل'}); Object.assign(DICT.en,{'当前已是原文':'Original is already shown'});
  Object.assign(DICT.fr,{'匹配分 ↓':'Score ↓','匹配分 ↑':'Score ↑','最近入库':'Récemment ajouté','预览窗格':"Volet d'aperçu",'第':'Page','条':'éléments'});
  Object.assign(DICT.th,{'匹配分 ↓':'คะแนน ↓','匹配分 ↑':'คะแนน ↑','最近入库':'เพิ่มล่าสุด','预览窗格':'แผงตัวอย่าง','第':'หน้า','条':'รายการ'});
  Object.assign(DICT.ja,{'匹配分 ↓':'スコア ↓','匹配分 ↑':'スコア ↑','最近入库':'最近追加','预览窗格':'プレビューペイン','第':'ページ','条':'件'});
  Object.assign(DICT.ar,{'匹配分 ↓':'النتيجة ↓','匹配分 ↑':'النتيجة ↑','最近入库':'أضيف حديثاً','预览窗格':'جزء المعاينة','第':'صفحة','条':'عناصر'});
  Object.assign(DICT.fr,{
    '工作签证要求：高中以上学历 + 毕业证 / 技能证书；办理周期与材料清单':'Exigences du visa de travail : niveau lycée ou plus + diplôme / certificats de compétences ; délais et liste des documents.',
    '含合同必备事项清单：工作内容、报酬、社保、居留许可、意外险':'Mentions obligatoires du contrat : missions, rémunération, sécurité sociale, titre de séjour, assurance accidents.',
    '在岗 29 人（派遣 21 / 当地 8），出勤率 97.2%，无合规预警项；本月派遣薪酬结算 ¥118.6 万，当地雇员薪酬结算 ¥67.8 万（示例数据）。':'29 personnes en poste (21 détachées / 8 locales), taux de présence 97,2 %, aucun avertissement de conformité ; règlements du mois : 1,186 M CNY pour le détachement et 678 000 CNY pour les employés locaux (données de démonstration).'
  });
  window.HPI18N = {
    lang: function () { return lang; },
    t: t,
    td: td,
    te: te,
    set: set,
    apply: apply,
    translateLive: translateLive,
    autoLive: autoLive
  };
})();