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
      '我的偏好权重': 'My preference weights',      '权重会归一化到': 'Weights are normalised to',      '默认值即原始评分': 'Defaults are the original scoring',      '还缺': 'Still missing',      '份材料': 'documents',      '技能缺口': 'Skill gaps',      '调试': 'Debugging',      '检测': 'Inspection',      '中式烹饪': 'Chinese cooking',      '食堂管理': 'Canteen management',      '总账核算': 'General ledger',      '税务申报': 'Tax filing',      '编程': 'Programming',      '确认撤回申请？': 'Withdraw this application?',      '撤回后本次申请将终止': 'The application will end after withdrawal',      '如需重新申请需重新走流程': 'You must go through the process again to reapply',      '确认撤回': 'Confirm withdrawal',      '确定撤回对': 'Withdraw the application for',      '的投递吗': '?',      '撤回后可重新投递': 'You can apply again after withdrawing',      '但已进行的面试安排会取消': 'but scheduled interviews will be cancelled',      '确定撤回': 'Confirm withdrawal',      '在线对话': 'Online chat',      '签证现在办到哪一步了': 'What stage is my visa at?',      '出发前需要准备哪些材料': 'What documents do I need before departure?',      '准备材料': 'Prepare documents',      '工资什么时候发放': 'When are wages paid?',      '怎么发': 'How is it paid?',      '工资发放': 'Wage payment',      '境外遇到问题怎么联系你': 'How do I reach you overseas?',      '我与派遣公司': 'Me and the dispatch agency',      '服务合同': 'Service contract',      '签署状态': 'Signature status',      '签署日期': 'Signed on',      '本页为系统生成的合同副本': 'This page is a system-generated copy of the contract',      '甲方': 'Party A',      '乙方': 'Party B',      '派遣方': 'Dispatcher',      '智能简历匹配': 'Global Dispatch',      '国外雇主': 'Overseas employer',      '劳务合作合同': 'Labour cooperation contract',      '派遣公司与国外雇主': 'Dispatch agency and overseas employer'
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
    '我的偏好权重': 'Mes poids de préférence',    '权重会归一化到': 'Les poids sont normalisés à',    '默认值即原始评分': 'Les valeurs par défaut correspondent au score original',    '还缺': 'Encore manquant',    '份材料': 'documents',    '技能缺口': 'Lacunes de compétences',    '调试': 'Débogage',    '检测': 'Contrôle',    '中式烹饪': 'Cuisine chinoise',    '食堂管理': 'Gestion de cantine',    '总账核算': 'Grand livre',    '税务申报': 'Déclaration fiscale',    '编程': 'Programmation',    '确认撤回申请？': 'Retirer cette candidature ?',    '撤回后本次申请将终止': 'La candidature prendra fin après retrait',    '如需重新申请需重新走流程': 'Vous devrez refaire la démarche pour postuler à nouveau',    '确认撤回': 'Confirmer le retrait',    '确定撤回对': 'Retirer la candidature pour',    '的投递吗': ' ?',    '撤回后可重新投递': 'Vous pouvez postuler à nouveau après retrait',    '但已进行的面试安排会取消': 'mais les entretiens prévus seront annulés',    '确定撤回': 'Confirmer',    '在线对话': 'Discussion en ligne',    '签证现在办到哪一步了': 'Où en est mon visa ?',    '出发前需要准备哪些材料': 'Quels documents avant le départ ?',    '准备材料': 'Préparer les documents',    '工资什么时候发放': 'Quand les salaires sont-ils versés ?',    '怎么发': 'Comment est-ce versé ?',    '工资发放': 'Versement des salaires',    '境外遇到问题怎么联系你': 'Comment vous joindre à l\'étranger ?',    '我与派遣公司': 'Moi et l\'agence',    '服务合同': 'Contrat de service',    '签署状态': 'Statut de signature',    '签署日期': 'Date de signature',    '本页为系统生成的合同副本': 'Cette page est une copie générée par le système',    '甲方': 'Partie A',    '乙方': 'Partie B',    '派遣方': 'Agence de détachement',    '智能简历匹配': 'Global Dispatch',    '国外雇主': 'Employeur étranger',    '劳务合作合同': 'Contrat de coopération',    '派遣公司与国外雇主': 'Agence et employeur étranger'
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
    '我的偏好权重': 'أوزان تفضيلاتي',    '权重会归一化到': 'تُطبع الأوزان إلى',    '默认值即原始评分': 'القيم الافتراضية هي التقييم الأصلي',    '还缺': 'لا يزال ناقصًا',    '份材料': 'مستندات',    '技能缺口': 'فجوات المهارات',    '调试': 'تصحيح',    '检测': 'فحص',    '中式烹饪': 'الطهي الصيني',    '食堂管理': 'إدارة المقصف',    '总账核算': 'دفتر الأستاذ',    '税务申报': 'الإقرار الضريبي',    '编程': 'البرمجة',    '确认撤回申请？': 'سحب هذا الطلب؟',    '撤回后本次申请将终止': 'سينتهي الطلب بعد السحب',    '如需重新申请需重新走流程': 'يجب إعادة العملية للتقديم مجددًا',    '确认撤回': 'تأكيد السحب',    '确定撤回对': 'سحب الطلب لـ',    '的投递吗': '؟',    '撤回后可重新投递': 'يمكنك التقديم مجددًا بعد السحب',    '但已进行的面试安排会取消': 'لكن ستُلغى المقابلات المجدولة',    '确定撤回': 'تأكيد السحب',    '在线对话': 'محادثة مباشرة',    '签证现在办到哪一步了': 'في أي مرحلة تأشيرتي؟',    '出发前需要准备哪些材料': 'ما المستندات المطلوبة قبل المغادرة؟',    '准备材料': 'تحضير المستندات',    '工资什么时候发放': 'متى تُدفع الأجور؟',    '怎么发': 'كيف تُدفع؟',    '工资发放': 'دفع الأجور',    '境外遇到问题怎么联系你': 'كيف أتواصل معك بالخارج؟',    '我与派遣公司': 'أنا ووكالة الإرسال',    '服务合同': 'عقد الخدمة',    '签署状态': 'حالة التوقيع',    '签署日期': 'تاريخ التوقيع',    '本页为系统生成的合同副本': 'هذه الصفحة نسخة مولدة من النظام',    '甲方': 'الطرف أ',    '乙方': 'الطرف ب',    '派遣方': 'الجهة المُرسِلة',    '智能简历匹配': 'الإرسال العالمي',    '国外雇主': 'صاحب العمل الأجنبي',    '劳务合作合同': 'عقد التعاون العمالي',    '派遣公司与国外雇主': 'الوكالة وصاحب العمل الأجنبي'
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
    'brand.name': '智能简历匹配',
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
          ? '智能简历匹配 · 海外用工全周期平台'
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
    liveTimer = setTimeout(function () { autoLive(); }, 1800);
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
      if (tag === 'script' || tag === 'style' || tag === 'textarea' || tag === 'input') continue;
      if (n.__hpLive) continue;                 /* 已翻译过 */
      if (n.__hpOrig === undefined) n.__hpOrig = n.nodeValue || '';
      var src = n.__hpOrig.trim();
      if (!src || src.length < 2 || src.length > 400) continue;
      if (!/[\u4e00-\u9fa5]/.test(src)) continue;
      nodes.push(n);
      if (nodes.length >= 60) break;            /* 单次最多 60 段 */
    }
    if (!nodes.length) return Promise.resolve(0);

    /* 长段落按句切分，短句命中率更高、缓存更省 */
    var SPLIT = /([。！？；\n]+)/;
    var jobs = [];      /* {node, segs:[], seps:[]} */
    var allSegs = [];
    nodes.forEach(function (node) {
      var raw = node.__hpOrig;
      var parts = raw.split(SPLIT);
      var segs = [], seps = [];
      parts.forEach(function (p, i) {
        if (i % 2 === 1) { seps.push(p); return; }
        segs.push(p);
        seps.push('');
      });
      var idxs = [];
      segs.forEach(function (g) {
        var t2 = g.trim();
        if (t2.length >= 2 && /[\u4e00-\u9fa5]/.test(t2)) {
          idxs.push(allSegs.length);
          allSegs.push(t2);
        } else {
          idxs.push(-1);
        }
      });
      jobs.push({ node: node, segs: segs, seps: seps, idxs: idxs });
    });
    if (!allSegs.length) return Promise.resolve(0);

    var texts = allSegs;
    var L = lang;
    /* 单次抓到的是「未翻译段」快照；页面元素多时由 autoLive 循环补齐 */
    return fetch('/api/translate', {
      method: 'POST',
      credentials: 'include',
      headers: { 'content-type': 'application/json', 'x-hp-request': '1' },
      body: JSON.stringify({ texts: texts, target: L })
    }).then(function (r) { return r.json(); }).then(function (j) {
      if (!j || !j.texts || lang !== L) return 0;   /* 翻译期间语言又变了 → 丢弃 */
      var done = 0;
      jobs.forEach(function (job) {
        var changed = false;
        var out = job.segs.map(function (g, i) {
          var gi = job.idxs[i];
          if (gi < 0) return g;
          var v = j.texts[gi];
          if (v && v !== texts[gi]) { changed = true; return g.replace(texts[gi], v); }
          return g;
        }).join('');
        if (changed) {
          job.node.nodeValue = out;
          job.node.__hpLive = true;
          done++;
        }
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
    fr: 'Traduction en direct…', ar: 'جارٍ الترجمة الفورية…'
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
    var MAX = 8;
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