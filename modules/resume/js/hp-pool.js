/* ==================================================================
   简历库 —— 筛选折叠 + 视图模式 + 预览窗格
   对外：window.HPPOOL.mount(el)
   ================================================================== */
(function () {
  'use strict';

  var DEMO = [
    { id: 1, name: '张*伟', job: '压机操作', country: '阿尔及利亚', score: 86, risk: '中', state: 'main', src: 'auto', inAt: '3 天前', dims: [92, 85, 88, 52, 70],
      pros: ['8 年压机一线，与岗位完全对口', '有换模标准化经验', '持中级职业资格证'], cons: ['无海外经历', '语言仅基础英语', '护照有效期未写'] },
    { id: 2, name: '李*华', job: '装配技术员', country: '越南', score: 81, risk: '低', state: 'main', src: 'manual', inAt: '10 天前', dims: [86, 80, 82, 66, 74],
      pros: ['装配 6 年，识图能力强'], cons: ['未写过完整项目'] },
    { id: 3, name: '王*强', job: '仓储物流', country: '沙特', score: 78, risk: '中', state: 'main', src: 'auto', inAt: '17 天前', dims: [74, 82, 76, 58, 70],
      pros: ['仓储流程熟'], cons: ['英语弱'] },
    { id: 4, name: '阮*安', job: '压机操作', country: '越南', score: 76, risk: '低', state: 'main', src: 'manual', inAt: '24 天前', dims: [80, 72, 70, 62, 72],
      pros: ['压机 5 年'], cons: ['无证书'] },
    { id: 5, name: '刘*', job: '质检员', country: '马来西亚', score: 73, risk: '中', state: 'main', src: 'auto', inAt: '31 天前', dims: [70, 76, 72, 60, 66],
      pros: ['熟悉 AQL 抽检'], cons: ['无海外经历'] },
    { id: 6, name: '陈*明', job: '装配技术员', country: '阿尔及利亚', score: 69, risk: '高', state: 'clean', src: 'manual', inAt: '38 天前', dims: [64, 70, 66, 48, 58],
      pros: ['装配 4 年'], cons: ['语言不达标'] },
    { id: 7, name: '赵*', job: '仓储物流', country: '沙特', score: 64, risk: '高', state: 'clean', src: 'auto', inAt: '45 天前', dims: [60, 66, 62, 44, 52],
      pros: ['有叉车证'], cons: ['合同意识弱'] },
    { id: 8, name: '孙*', job: '质检员', country: '马来西亚', score: 61, risk: '中', state: 'clean', src: 'manual', inAt: '52 天前', dims: [58, 62, 60, 50, 55],
      pros: ['基础质检经验'], cons: ['无稳定性'] }
  ];

  var DIMS = ['技能', '证书', '经验', '语言', '合规'];
  var VIEWS = [
    { k: 'xl', n: '超大图标', ic: '▢' },
    { k: 'l', n: '大图标', ic: '▣' },
    { k: 'm', n: '中图标', ic: '▤' },
    { k: 's', n: '小图标', ic: '▦' },
    { k: 'list', n: '列表', ic: '☰' },
    { k: 'detail', n: '详细信息', ic: '≡' },
    { k: 'tiles', n: '平铺', ic: '▥' },
    { k: 'content', n: '内容', ic: '≣' }
  ];

  var CSS = [
    '.hpp-bar{display:flex;align-items:center;gap:8px;margin-bottom:10px;flex-wrap:wrap;position:relative}',
    '.hpp-seg{display:flex;border:1px solid var(--border);border-radius:10px;overflow:hidden}',
    '.hpp-seg button{height:32px;padding:0 14px;border:0;background:transparent;color:var(--text-2);font-size:12.5px;cursor:pointer}',
    '.hpp-seg button.on{background:var(--primary);color:#02131f;font-weight:600}',
    '.hpp-bar input{height:32px;padding:0 10px;border:1px solid var(--border);border-radius:9px;background:var(--surface-2);color:var(--text);font-size:12.5px;outline:none;width:200px}',
    '.hpp-btn{height:32px;padding:0 12px;border:1px solid var(--border);border-radius:9px;background:none;color:var(--text-2);font-size:12.5px;cursor:pointer;display:inline-flex;align-items:center;gap:6px}',
    '.hpp-btn:hover,.hpp-btn.on{border-color:var(--primary);color:var(--primary)}',
    '.hpp-btn b{color:#38bdf8;font-weight:600}',
    '.hpp-bar .sp{flex:1}',
    '.hpp-panel{position:absolute;right:0;top:38px;z-index:30;width:340px;background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:14px;box-shadow:0 20px 50px rgba(0,0,0,.5);display:none}',
    '.hpp-panel.on{display:block}',
    '.hpp-row{display:flex;align-items:center;gap:10px;margin-bottom:8px}',
    '.hpp-row label{flex:0 0 62px;font-size:12px;color:var(--text-3)}',
    '.hpp-row select{flex:1;height:30px;background:var(--surface-2);border:1px solid var(--border);color:var(--text);font-size:12.5px;border-radius:8px;padding:0 6px;outline:none}',
    '.hpp-acts{display:flex;gap:8px;margin-top:12px}',
    '.hpp-acts button{flex:1;height:32px;border-radius:9px;border:1px solid var(--border);background:none;color:var(--text-2);font-size:12.5px;cursor:pointer}',
    '.hpp-acts button.p{border-color:var(--primary);color:var(--primary)}',
    '.hpp-frow{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin:4px 0}',
    '.hpp-frow .lab{width:48px;font-size:12px;color:var(--text-3);flex:0 0 48px}',
    '.hpp-fchip{height:26px;padding:0 12px;border:1px solid var(--border);border-radius:999px;background:none;color:var(--text-2);font-size:12px;cursor:pointer;line-height:24px}',
    '.hpp-fchip:hover{border-color:#38bdf8;color:#38bdf8}',
    '.hpp-fchip.on{background:#38bdf8;border-color:#38bdf8;color:#02131f;font-weight:600}',
    '.hpp-chips{display:flex;gap:6px;flex-wrap:wrap;margin:8px 0 10px}',
    '.hpp-chip{font-size:11px;padding:3px 9px;border:1px solid rgba(56,189,248,.4);color:#38bdf8;border-radius:7px;cursor:pointer}',
    '.hpp-chip:hover{border-color:#f87171;color:#f87171}',
    '.hpp-menu{position:absolute;right:0;top:38px;z-index:31;width:180px;background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:6px;display:none;box-shadow:0 18px 40px rgba(0,0,0,.5)}',
    '.hpp-menu.on{display:block}',
    '.hpp-menu button{display:flex;align-items:center;gap:8px;width:100%;height:30px;padding:0 10px;border:0;background:none;color:var(--text-2);font-size:12.5px;border-radius:7px;cursor:pointer;text-align:left}',
    '.hpp-menu button:hover{background:var(--surface-2);color:var(--text)}',
    '.hpp-menu button.on{color:#38bdf8}',
    '.hpp-menu .tick{margin-left:auto;font-size:11px}',
    /* 原简历大弹窗：单页长卷 + 滑动，颜色全部走主题变量（dark / light / mono 通用） */
    '.hpm-mask{position:fixed;inset:0;z-index:70;background:rgba(6,12,22,.72);display:flex;align-items:center;justify-content:center;padding:calc(22px / var(--hp-zoom,1))}',
    'html[data-theme="light"] .hpm-mask{background:rgba(16,24,40,.32)}',
    'html[data-theme="mono"] .hpm-mask{background:rgba(17,17,17,.32)}',
    '.hpm-dlg{width:min(1120px,calc(97vw / var(--hp-zoom,1)));max-height:calc((100vh / var(--hp-zoom,1)) - 28px);display:flex;flex-direction:column;background:var(--surface);color:var(--text);border:1px solid var(--border);border-radius:16px;overflow:hidden;box-shadow:var(--shadow-lg,0 30px 90px rgba(0,0,0,.55))}',
    '.hpm-h{display:flex;align-items:center;gap:10px;padding:14px 18px;border-bottom:1px solid var(--border);background:var(--surface)}',
    '.hpm-h .n{font-size:16px;font-weight:700;color:var(--text)}',
    '.hpm-h .s{font-size:12px;color:var(--text-3);margin-top:3px}',
    '.hpm-h .sp{flex:1}',
    '.hpm-x{width:30px;height:30px;border-radius:8px;border:1px solid var(--border);background:var(--surface-2);color:var(--text-2);cursor:pointer;font-size:14px}',
    '.hpm-x:hover{border-color:var(--danger);color:var(--danger)}',
    '.hpm-body{padding:16px 20px 18px;overflow:auto;flex:1;background:var(--surface);scrollbar-color:var(--border-strong) transparent}',
    '.hpm-legend{display:flex;gap:16px;font-size:11.5px;color:var(--text-3);margin-bottom:10px}',
    '.hpm-legend i{display:inline-block;width:10px;height:10px;border-radius:3px;margin-right:5px;vertical-align:-1px}',
    '.hpm-legend i.ok{background:var(--success)}',
    '.hpm-legend i.gap{background:var(--danger)}',
    '.hpm-legend i.warn{background:var(--warning)}',
    '.hpm-f{display:flex;align-items:center;justify-content:center;gap:14px;padding:10px 18px;border-top:1px solid var(--border);font-size:12px;color:var(--text-3);background:var(--surface-2)}',
    '.hpm-f button{height:30px;padding:0 16px;border:1px solid var(--border);border-radius:8px;background:var(--surface);color:var(--text-2);cursor:pointer;font-size:12px}',
    '.hpm-f button:hover{border-color:var(--primary);color:var(--primary)}',
    '@media print{body.hpm-printing *{visibility:hidden}body.hpm-printing .hpm-dlg,body.hpm-printing .hpm-dlg *{visibility:visible}body.hpm-printing .hpm-dlg{position:absolute;left:0;top:0;width:100%;max-height:none;box-shadow:none;border:0}body.hpm-printing .hpm-mask{position:absolute;inset:auto;display:block;padding:0;background:#fff}body.hpm-printing .hpm-body{max-height:none;overflow:visible;padding:0}body.hpm-printing .hpm-f,body.hpm-printing .hpm-x{display:none}body.hpm-printing .hpm-body .kv{break-inside:avoid}body.hpm-printing .aic{break-inside:avoid}}',
    '.hpm-body .kv{display:grid;grid-template-columns:130px minmax(0,1fr) auto;gap:10px;align-items:start;padding:8px 10px;border-bottom:1px dashed var(--border);font-size:13px}',
    '.hpm-body .kv .k{color:var(--text-3);font-size:12px;line-height:1.7}',
    '.hpm-body .kv .v{color:var(--text-2);line-height:1.75;word-break:break-word}',
    '.hpm-body .aic{background:var(--surface);border:1px solid var(--border);border-radius:12px;margin-bottom:12px}',
    '.hpm-body .aic:last-child{margin-bottom:0}',
    '.hpm-body .aic-h{border-bottom:1px solid var(--border);color:var(--text)}',
    '.hpm-body .aic-b{padding:10px 14px}',
    '.hpm-body .aic-h .n{margin-left:auto;font-weight:400;font-size:11px;color:var(--text-3)}',
    '.hpm-body .aic-b .kv{border-left:3px solid transparent}',
    '.hpm-body .aic-b .kv.ai-hit-row{border-left-color:var(--success);background:color-mix(in srgb, var(--success) 9%, transparent)}',
    '.hpm-body .aic-b .kv.ai-gap-row{border-left-color:var(--danger);background:color-mix(in srgb, var(--danger) 9%, transparent)}',
    '.hpm-body .aic-b .kv.ai-warn-row{border-left-color:var(--warning);background:color-mix(in srgb, var(--warning) 10%, transparent)}',
    /* 正文高亮：三套主题都用 inherit 文字色，避免浅色主题下看不见 */
    '.hpm-body mark{color:inherit;padding:0 2px;border-radius:3px;background:transparent}',
    '.hpm-body mark.ai-hit{background:color-mix(in srgb, var(--success) 24%, transparent);border-bottom:1px dashed var(--success)}',
    '.hpm-body mark.ai-gap{background:color-mix(in srgb, var(--danger) 20%, transparent);border-bottom:1px dashed var(--danger)}',
    '.hpm-body mark.ai-partial{background:color-mix(in srgb, var(--warning) 24%, transparent);border-bottom:1px dashed var(--warning)}',
    '.hpp-chk.ok{color:var(--success);border-color:color-mix(in srgb, var(--success) 45%, transparent)}',
    '.hpp-chk.gap{color:var(--danger);border-color:color-mix(in srgb, var(--danger) 45%, transparent)}',
    '.hpp-chk.warn{color:var(--warning);border-color:color-mix(in srgb, var(--warning) 45%, transparent)}',
    '.hpp-mark.ok{color:var(--success);border-color:color-mix(in srgb, var(--success) 45%, transparent)}',
    '.hpp-mark.gap{color:var(--danger);border-color:color-mix(in srgb, var(--danger) 45%, transparent)}',
    '.hpp-mark.warn{color:var(--warning);border-color:color-mix(in srgb, var(--warning) 45%, transparent)}',

    /* 详情页两个页签：智能分析 / 原简历 */
    '.hpp-dtabs{display:flex;gap:4px;margin:12px 0 2px;border-bottom:1px solid var(--border)}',
    '.hpp-dtabs button{height:30px;padding:0 12px;border:0;background:none;color:var(--text-3);font-size:12.5px;cursor:pointer;border-bottom:2px solid transparent}',
    '.hpp-dtabs button.on{color:#38bdf8;border-bottom-color:#38bdf8;font-weight:600}',
    '.hpp-resume{max-height:calc(100vh - 260px);overflow:auto;padding-top:10px}',
    '.hpp-rload{padding:20px 0;text-align:center;color:var(--text-3);font-size:12.5px}',
    '.hpp-rjob{font-size:12px;color:var(--text-3);margin-bottom:8px}',
    '.hpp-checks{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px}',
    '.hpp-chk{font-size:11px;padding:2px 8px;border-radius:7px;border:1px solid var(--border);color:var(--text-2);cursor:help}',
    '.hpp-chk.ok{color:#4ade80;border-color:rgba(74,222,128,.45)}',
    '.hpp-chk.gap{color:#f87171;border-color:rgba(248,113,113,.45)}',
    '.hpp-chk.warn{color:#f0b429;border-color:rgba(240,180,41,.45)}',
    '.hpp-rtitle{display:flex;align-items:center;gap:8px;font-size:12.5px;font-weight:600;color:var(--text);margin:2px 0 8px}',
    '.hpp-rtitle span{margin-left:auto;font-weight:400;font-size:11px;color:var(--text-3)}',
    '.hpp-rrows{display:flex;flex-direction:column;gap:8px}',
    '.hpp-rrow{display:grid;grid-template-columns:86px 1fr auto;gap:8px;align-items:start;font-size:12.5px;padding:7px 0;border-bottom:1px dashed var(--border)}',
    '.hpp-rrow .k{color:var(--text-3);font-size:11.5px}',
    '.hpp-rrow .v{color:var(--text-2);line-height:1.7}',
    '.hpp-mark{font-size:10.5px;padding:1px 7px;border-radius:6px;border:1px solid var(--border);white-space:nowrap}',
    '.hpp-mark.ok{color:#4ade80;border-color:rgba(74,222,128,.45)}',
    '.hpp-mark.gap{color:#f87171;border-color:rgba(248,113,113,.45)}',
    '.hpp-mark.warn{color:#f0b429;border-color:rgba(240,180,41,.45)}',
    '.hpp-pager{display:flex;align-items:center;justify-content:center;gap:12px;margin:14px 0 4px;font-size:12px;color:var(--text-3)}',
    '.hpp-pager button{height:28px;padding:0 12px;border:1px solid var(--border);border-radius:8px;background:var(--surface-2);color:var(--text-2);cursor:pointer;font-size:12px}',
    '.hpp-pager button:disabled{opacity:.4;cursor:default}',
    '.hpp-pager button:not(:disabled):hover{border-color:#38bdf8;color:#38bdf8}',
    '.hpp-wrap{display:grid;grid-template-columns:1fr 400px;gap:14px;align-items:start}',
    '.hpp-wrap.full{grid-template-columns:1fr}',
    '.hpp-body{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:12px;min-height:220px}',
    '.hpp-cards{display:grid;gap:12px}',
    '.hpp-cards.xl{grid-template-columns:repeat(auto-fill,minmax(380px,1fr))}',
    '.hpp-cards.l{grid-template-columns:repeat(auto-fill,minmax(300px,1fr))}',
    '.hpp-cards.m{grid-template-columns:repeat(auto-fill,minmax(230px,1fr))}',
    '.hpp-cards.s{grid-template-columns:repeat(auto-fill,minmax(170px,1fr))}',
    '.hpp-tiles{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:8px}',
    '.hpp-tile{display:flex;align-items:center;gap:10px;border:1px solid var(--border);border-radius:12px;padding:8px 12px;cursor:pointer;background:var(--surface-2)}',
    '.hpp-tile:hover,.hpp-tile.on{border-color:#38bdf8}',
    '.hpp-tile .nm{font-size:13px;font-weight:600;min-width:64px}',
    '.hpp-tile .m{font-size:11.5px;color:var(--text-3)}',
    '.hpp-tile .sc{margin-left:auto;color:#38bdf8;font-size:16px}',
    '.hpp-content .row{display:flex;align-items:baseline;gap:10px;padding:8px 6px;border-bottom:1px solid var(--border);cursor:pointer;font-size:12.5px}',
    '.hpp-content .row:hover{background:rgba(56,189,248,.06)}',
    '.hpp-content .nm{font-weight:600;min-width:80px}',
    '.hpp-content .m{color:var(--text-3);font-size:11.5px}',
    '.hpp-content .sc{margin-left:auto;color:#38bdf8}',
    '.hpp-detailbar{margin-top:12px;border:1px solid var(--border);border-radius:12px;padding:10px 14px;background:var(--surface-2);font-size:12.5px;color:var(--text-2);display:flex;gap:18px;flex-wrap:wrap}',
    '.hpp-detailbar b{color:var(--text);font-weight:600}',
    '.hpp-card{border:1px solid var(--border);border-radius:14px;padding:12px 14px;cursor:pointer;transition:.15s;background:var(--surface-2)}',
    '.hpp-card:hover{border-color:#38bdf8}',
    '.hpp-card.on{border-color:#38bdf8;box-shadow:inset 0 0 0 1px #38bdf8}',
    '.hpp-card .top{display:flex;align-items:center;gap:8px}',
    '.hpp-card .nm{font-size:14px;font-weight:600}',
    '.hpp-card .sc{margin-left:auto;font-size:20px;font-weight:300;color:#38bdf8}',
    '.hpp-card .sub{margin-top:4px;font-size:11.5px;color:var(--text-3)}',
    '.hpp-card .dim{margin-top:8px}',
    '.hpp-card .dim .l{display:flex;justify-content:space-between;font-size:11px;color:var(--text-3)}',
    '.hpp-card .dim .t{height:3px;background:rgba(56,189,248,.14);margin-top:3px;border-radius:2px}',
    '.hpp-card .dim .t i{display:block;height:100%;background:#38bdf8;border-radius:2px}',
    '.hpp-table{width:100%;border-collapse:collapse;font-size:13px}',
    '.hpp-table th{text-align:left;padding:11px;font-size:11.5px;color:var(--text-3);font-weight:400;border-bottom:1px solid var(--border)}',
    '.hpp-table td{padding:11px;border-bottom:1px solid var(--border);white-space:nowrap}',
    '.hpp-table tbody tr{cursor:pointer}',
    '.hpp-table tbody tr:hover,.hpp-table tbody tr.on{background:rgba(56,189,248,.08)}',
    '.hpp-tag{font-size:11px;padding:2px 8px;border:1px solid var(--border);border-radius:7px;color:var(--text-3)}',
    '.hpp-tag.ok{color:#4ade80;border-color:rgba(74,222,128,.4)}',
    '.hpp-tag.warn{color:#f0b429;border-color:rgba(240,180,41,.4)}',
    '.hpp-tag.bad{color:#f87171;border-color:rgba(248,113,113,.4)}',
    '.hpp-act{height:26px;padding:0 10px;border:1px solid var(--border);border-radius:7px;background:none;color:var(--text-2);font-size:11.5px;cursor:pointer;margin-left:4px}',
    '.hpp-act:hover{border-color:#38bdf8;color:#38bdf8}',
    '.hpp-empty{padding:48px;text-align:center;color:var(--text-3);font-size:13px}',
    '.hpp-pagerbar{display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap;margin:16px 0 6px;font-size:12px;color:var(--text-3)}',
    '.hpp-pagerbar button{height:28px;min-width:30px;padding:0 10px;border:1px solid var(--border);border-radius:8px;background:var(--surface);color:var(--text-2);cursor:pointer;font-size:12px}',
    '.hpp-pagerbar button.on{background:var(--primary);border-color:var(--primary);color:#fff;font-weight:600}',
    '.hpp-pagerbar button:disabled{opacity:.4;cursor:default}',
    '.hpp-pagerbar button:not(:disabled):not(.on):hover{border-color:var(--primary);color:var(--primary)}',
    '.hpp-detail{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:16px 18px}',
    '.hpp-detail.hide{display:none}',
    '.hpp-dh{display:flex;align-items:flex-start;gap:10px;border-bottom:1px solid var(--border);padding-bottom:12px}',
    '.hpp-dh .n{font-size:18px;font-weight:600}',
    '.hpp-dh .s{margin-top:4px;font-size:12.5px;color:var(--text-3)}',
    '.hpp-x{margin-left:auto;width:30px;height:30px;border:1px solid var(--border);border-radius:8px;background:none;color:var(--text-3);font-size:13px;cursor:pointer;flex:0 0 30px}',
    '.hpp-big{font-size:38px;font-weight:300;color:#38bdf8;line-height:1}',
    '.hpp-big small{font-size:12px;color:var(--text-3);margin-left:3px}',
    '.hpp-h5{font-size:11.5px;letter-spacing:.16em;color:var(--text-3);margin:16px 0 8px}',
    '.hpp-dim{margin:9px 0}',
    '.hpp-dim .l{display:flex;justify-content:space-between;font-size:12px;color:var(--text-3)}',
    '.hpp-dim .l b{color:var(--text);font-weight:400}',
    '.hpp-dim .t{height:4px;background:rgba(56,189,248,.14);margin-top:5px;border-radius:2px}',
    '.hpp-dim .t i{display:block;height:100%;background:#38bdf8;border-radius:2px}',
    '.hpp-li{display:flex;gap:8px;font-size:12.5px;line-height:1.7;padding:6px 0;border-top:1px solid var(--border)}',
    '.hpp-li:first-of-type{border-top:0}',
    '.hpp-li i{width:5px;height:5px;border-radius:50%;margin-top:7px;flex:0 0 5px}',
    '.hpp-li.g i{background:#4ade80}.hpp-li.w i{background:#f0b429}',
    '.hpp-acts2{display:flex;gap:8px;margin-top:18px}',
    '.hpp-acts2 button{flex:1;height:34px;border:1px solid var(--border);border-radius:10px;background:none;color:var(--text-2);font-size:12.5px;cursor:pointer}',
    '.hpp-acts2 button.p{border-color:#38bdf8;color:#38bdf8}',
    '.hpp-note{margin-top:10px;font-size:11.5px;color:var(--text-3);line-height:1.9;display:flex;gap:8px;align-items:flex-start}',
    '.hpp-note .q{width:18px;height:18px;border:1px solid var(--border);border-radius:50%;display:grid;place-items:center;font-size:11px;cursor:pointer;flex:0 0 18px;color:var(--text-3)}',
    '.hpp-note .txt{display:none}',
    '.hpp-note.on .txt{display:block}',
    '.hpp-note .lbl{color:var(--text-3);font-size:11.5px}'
  ].join('');

  var state = {
    tab: 'main', q: '', sel: null, view: 'm', preview: true, detailPane: false, showFilters: false, page: 1,
    F: { job: '', country: '', score: '', risk: '', src: '', days: '' }
  };
  try {
    var saved = JSON.parse(localStorage.getItem('hp.pool.view') || '{}');
    if (saved.view) state.view = saved.view;
    if (typeof saved.preview === 'boolean') state.preview = saved.preview;
    if (typeof saved.detailPane === 'boolean') state.detailPane = saved.detailPane;
  } catch (e) {}
  function saveView() {
    try { localStorage.setItem('hp.pool.view', JSON.stringify({ view: state.view, preview: state.preview, detailPane: state.detailPane })); } catch (e) {}
  }

  var list = [];

  function injectCSS() {
    if (document.getElementById('hpPoolCSS')) return;
    var st = document.createElement('style');
    st.id = 'hpPoolCSS'; st.textContent = CSS;
    document.head.appendChild(st);
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); }
  function counts() {
    return {
      main: list.filter(function (x) { return x.state === 'main'; }).length,
      clean: list.filter(function (x) { return x.state === 'clean'; }).length,
      trash: list.filter(function (x) { return x.state === 'trash'; }).length
    };
  }
  function days(x) {
    var m = String(x.inAt || '').match(/(\d+)/);
    if (m) return +m[1];
    var t = Date.parse(x.inAt);
    if (!isNaN(t)) return Math.round((Date.now() - t) / 86400000);
    return 0;
  }
  function pass(x) {
    var F = state.F;
    if (F.job && x.job !== F.job) return false;
    if (F.country && x.country !== F.country) return false;
    if (F.risk && x.risk !== F.risk) return false;
    if (F.src && x.src !== F.src) return false;
    if (F.score) {
      if (F.score === '80' && x.score < 80) return false;
      if (F.score === '70' && (x.score < 70 || x.score >= 80)) return false;
      if (F.score === '60' && (x.score < 60 || x.score >= 70)) return false;
    }
    if (F.days && days(x) > +F.days) return false;
    return true;
  }
  function rows() {
    return list.filter(function (x) {
      if (x.state !== state.tab) return false;
      if (state.q && (x.name + x.job + x.country).indexOf(state.q) < 0) return false;
      return pass(x);
    });
  }
  function fcount() { return Object.keys(state.F).filter(function (k) { return state.F[k]; }).length; }

  function sel(label, key, opts) {
    return '<div class="hpp-row"><label>' + label + '</label><select data-f="' + key + '">' +
      '<option value="">全部</option>' + opts.map(function (o) {
        return '<option value="' + o + '"' + (state.F[key] === o ? ' selected' : '') + '>' + o + '</option>';
      }).join('') + '</select></div>';
  }
  function sel2(label, key, opts) {
    return '<div class="hpp-row"><label>' + label + '</label><select data-f="' + key + '">' +
      '<option value="">全部</option>' + opts.map(function (o) {
        return '<option value="' + o[0] + '"' + (state.F[key] === o[0] ? ' selected' : '') + '>' + o[1] + '</option>';
      }).join('') + '</select></div>';
  }

  function toolbar() {
    var c = counts(), n = fcount();
    var cur = VIEWS.filter(function (v) { return v.k === state.view; })[0] || VIEWS[1];
    return '<div class="hpp-bar">' +
      '<div class="hpp-seg">' +
        '<button data-tab="main" class="' + (state.tab === 'main' ? 'on' : '') + '">主库 ' + c.main + '</button>' +
        '<button data-tab="clean" class="' + (state.tab === 'clean' ? 'on' : '') + '">待清理 ' + c.clean + '</button>' +
        '<button data-tab="trash" class="' + (state.tab === 'trash' ? 'on' : '') + '">回收站 ' + c.trash + '</button>' +
      '</div>' +
      '<input id="hppQ" placeholder="搜姓名 / 岗位 / 国家" value="' + esc(state.q) + '">' +
      '<button class="hpp-btn" id="hppVbtn">' + cur.ic + ' ' + cur.n + '</button>' +
      '<button class="hpp-btn ' + (state.preview ? 'on' : '') + '" id="hppPbtn">预览窗格</button>' +
      '<button class="hpp-btn ' + (state.showFilters || fcount() ? 'on' : '') + '" id="hppFbtn">筛选' + (fcount() ? ' <b>' + fcount() + '</b>' : '') + ' ▾</button>' +
      (fcount() ? '<button class="hpp-btn" data-clear>清空</button>' : '') +
      '<span class="sp"></span>' +
      '<button class="hpp-btn" id="hppRefresh">刷新</button>' +
      '<div class="hpp-menu" id="hppMenu">' +
        VIEWS.map(function (v) {
          return '<button data-view="' + v.k + '" class="' + (v.k === state.view ? 'on' : '') + '">' +
            '<span style="width:22px">' + v.ic + '</span><span>' + v.n + '</span>' +
            '<span class="tick">' + (v.k === state.view ? '●' : '') + '</span></button>';
        }).join('') +
        '<div style="height:1px;background:var(--border);margin:6px 4px"></div>' +
        '<button data-pane="detail">' +
          '<span style="width:22px">▭</span><span>详细信息窗格</span>' +
          '<span class="tick">' + (state.detailPane ? '●' : '') + '</span></button>' +
        '<button data-pane="preview">' +
          '<span style="width:22px">▯</span><span>预览窗格</span>' +
          '<span class="tick">' + (state.preview ? '●' : '') + '</span></button>' +
      '</div>' +
    '</div>';
  }

  var FILTER_ROWS = [
    { k: 'job', lab: '岗位', opts: [['压机操作', '压机操作'], ['装配技术员', '装配技术员'], ['仓储物流', '仓储物流'], ['质检员', '质检员']] },
    { k: 'country', lab: '国家', opts: [['阿尔及利亚', '阿尔及利亚'], ['越南', '越南'], ['沙特', '沙特'], ['马来西亚', '马来西亚']] },
    { k: 'score', lab: '匹配', opts: [['80', '≥80'], ['70', '70–79'], ['60', '60–69']] },
    { k: 'risk', lab: '风险', opts: [['低', '低'], ['中', '中'], ['高', '高']] },
    { k: 'src', lab: '来源', opts: [['auto', '自动入库'], ['manual', '手动上传']] },
    { k: 'days', lab: '时间', opts: [['7', '近 7 天'], ['30', '近 30 天'], ['90', '近 90 天']] }
  ];

  function filterRows() {
    return FILTER_ROWS.map(function (r) {
      var cur = state.F[r.k];
      return '<div class="hpp-frow"><span class="lab">' + r.lab + '</span>' +
        '<button class="hpp-fchip ' + (cur === '' ? 'on' : '') + '" data-fk="' + r.k + '" data-fv="">全部</button>' +
        r.opts.map(function (o) {
          return '<button class="hpp-fchip ' + (cur === o[0] ? 'on' : '') + '" data-fk="' + r.k + '" data-fv="' + o[0] + '">' + o[1] + '</button>';
        }).join('') +
      '</div>';
    }).join('');
  }

  function chips() {
    var map = { job: '岗位', country: '国家', score: '匹配度', risk: '风险', src: '来源', days: '时间' };
    var items = Object.keys(state.F).filter(function (k) { return state.F[k]; });
    if (!items.length) return '';
    return '<div class="hpp-chips">' + items.map(function (k) {
      var v = state.F[k];
      var txt = k === 'src' ? (v === 'auto' ? '自动' : '手动') : (k === 'days' ? '近 ' + v + ' 天' : v);
      return '<span class="hpp-chip" data-k="' + k + '">' + map[k] + '：' + txt + ' ×</span>';
    }).join('') + '</div>';
  }

  var PAGE_SIZE = 12;
  function pageOf(all) {
    var pages = Math.max(1, Math.ceil(all.length / PAGE_SIZE));
    if (state.page > pages) state.page = pages;
    if (state.page < 1) state.page = 1;
    var start = (state.page - 1) * PAGE_SIZE;
    return { list: all.slice(start, start + PAGE_SIZE), total: all.length, pages: pages, page: state.page };
  }
  function pagerHtml(pg) {
    if (pg.pages <= 1) return pg.total ? '<div class="hpp-pagerbar"><span>共 ' + pg.total + ' 人</span></div>' : '';
    var from = Math.max(1, pg.page - 2), to = Math.min(pg.pages, from + 4);
    from = Math.max(1, to - 4);
    var nums = '';
    for (var i = from; i <= to; i++) nums += '<button data-pg="' + i + '" class="' + (i === pg.page ? 'on' : '') + '">' + i + '</button>';
    return '<div class="hpp-pagerbar">' +
      '<span>共 ' + pg.total + ' 人 · 第 ' + pg.page + ' / ' + pg.pages + ' 页</span>' +
      '<button data-pg="' + (pg.page - 1) + '"' + (pg.page === 1 ? ' disabled' : '') + '>上一页</button>' + nums +
      '<button data-pg="' + (pg.page + 1) + '"' + (pg.page === pg.pages ? ' disabled' : '') + '>下一页</button></div>';
  }
  function bodyHtml() {
    var all = rows();
    if (!all.length) return '<div class="hpp-empty">' + (state.tab === 'trash' ? '回收站是空的' : '没有符合条件的候选人') + '</div>';
    var pg = pageOf(all);
    var rs = pg.list;

    if (state.view === 'list') return table(rs, false) + pagerHtml(pg);
    if (state.view === 'detail') return table(rs, true) + pagerHtml(pg);

    if (state.view === 'tiles') {
      return '<div class="hpp-tiles">' + rs.map(function (x) {
        var rt = x.risk === '高' ? 'bad' : x.risk === '中' ? 'warn' : 'ok';
        return '<div class="hpp-tile ' + (state.sel === x.id ? 'on' : '') + '" data-id="' + x.id + '">' +
          '<span class="nm">' + esc(x.name) + '</span>' +
          '<span class="m">' + esc(x.job) + ' · <span class="hpp-tag ' + rt + '">' + esc(x.risk) + '</span></span>' +
          '<span class="sc">' + x.score + '</span></div>';
      }).join('') + '</div>' + pagerHtml(pg);
    }

    if (state.view === 'content') {
      return '<div class="hpp-content">' + rs.map(function (x) {
        return '<div class="row" data-id="' + x.id + '">' +
          '<span class="nm">' + esc(x.name) + '</span>' +
          '<span class="m">' + esc(x.job) + ' · ' + esc(x.country) + ' · ' + esc(x.inAt) + '</span>' +
          '<span class="sc">' + x.score + ' 分</span></div>';
      }).join('') + '</div>' + pagerHtml(pg);
    }

    var g = state.view;
    var dimN = g === 'xl' ? 5 : g === 'l' ? 4 : g === 'm' ? 3 : 0;
    return '<div class="hpp-cards ' + g + '">' + rs.map(function (x) {
      var d = x.dims || [70, 70, 70, 60, 60];
      var rt = x.risk === '高' ? 'bad' : x.risk === '中' ? 'warn' : 'ok';
      return '<div class="hpp-card ' + (state.sel === x.id ? 'on' : '') + '" data-id="' + x.id + '">' +
        '<div class="top"><span class="nm">' + esc(x.name) + '</span>' +
          '<span class="hpp-tag ' + rt + '">' + esc(x.risk) + '</span>' +
          '<span class="sc">' + x.score + '</span></div>' +
        '<div class="sub">' + esc(x.job) + ' · ' + esc(x.country) + '</div>' +
        d.slice(0, dimN).map(function (v, i) {
          return '<div class="dim"><div class="l"><span>' + DIMS[i] + '</span><b>' + v + '</b></div>' +
            '<div class="t"><i style="width:' + v + '%"></i></div></div>';
        }).join('') +
        '</div>';
    }).join('') + '</div>' + pagerHtml(pg);
  }

  function table(rs, full) {
    var head = full
      ? '<th>候选人</th><th>岗位</th><th>国家</th><th>匹配度</th><th>五维</th><th>风险</th><th>来源</th><th>入库</th><th style="text-align:right">操作</th>'
      : '<th>候选人</th><th>岗位</th><th>国家</th><th>匹配度</th><th>风险</th><th style="text-align:right">操作</th>';
    var body = rs.map(function (x) {
      var rt = x.risk === '高' ? 'bad' : x.risk === '中' ? 'warn' : 'ok';
      var ops = state.tab === 'trash'
        ? '<button class="hpp-act" data-restore="' + x.id + '">恢复</button>'
        : '<button class="hpp-act" data-del="' + x.id + '">删除</button>';
      var cells = '<td>' + esc(x.name) + '</td><td>' + esc(x.job) + '</td><td>' + esc(x.country) + '</td><td>' + x.score + ' 分</td>';
      if (full) cells += '<td style="color:var(--text-3)">' + (x.dims || []).join(' / ') + '</td>';
      cells += '<td><span class="hpp-tag ' + rt + '">' + esc(x.risk) + '</span></td>';
      if (full) cells += '<td><span class="hpp-tag">' + (x.src === 'auto' ? '自动' : '手动') + '</span></td><td style="color:var(--text-3)">' + esc(x.inAt) + '</td>';
      cells += '<td style="text-align:right">' + ops + '</td>';
      return '<tr data-id="' + x.id + '" class="' + (state.sel === x.id ? 'on' : '') + '">' + cells + '</tr>';
    }).join('');
    return '<table class="hpp-table"><thead><tr>' + head + '</tr></thead><tbody>' + body + '</tbody></table>';
  }

  function render(host) {
    host.innerHTML = toolbar() + (state.showFilters ? filterRows() : '') + chips() +
      '<div class="hpp-wrap' + (state.preview && state.sel !== null ? '' : ' full') + '">' +
        '<div class="hpp-body">' + bodyHtml() + '</div>' +
        '<div class="hpp-detail' + (state.preview && state.sel !== null ? '' : ' hide') + '" id="hppDetail"></div>' +
      '</div>' +
      (state.detailPane && state.sel !== null ? detailBar() : '') +
      '<div class="hpp-note" id="hppNote"><span class="q" id="hppNoteQ">?</span>' +
      '<span class="lbl" id="hppNoteL">入库规则</span>' +
      '<div class="txt">分析完成后自动入库，低于门槛进「待清理」；删除先进回收站，保留 30 天。已推荐 / 面试中 / 已录用 不能直接删除。</div></div>';
    bind(host);
    var nq = host.querySelector('#hppNoteQ');
    if (nq) nq.onclick = function () {
      var n = host.querySelector('#hppNote');
      n.classList.toggle('on');
      host.querySelector('#hppNoteL').textContent = n.classList.contains('on') ? '入库规则' : '入库规则（点击展开）';
    };
    if (state.preview && state.sel !== null) detail(host);
  }

  function bind(host) {
    host.querySelectorAll('[data-tab]').forEach(function (b) {
      b.onclick = function () { state.tab = b.dataset.tab; state.sel = null; state.page = 1; render(host); };
    });
    host.querySelector('#hppQ').oninput = function (e) { state.q = e.target.value.trim(); state.page = 1; render(host); };

    var fb = host.querySelector('#hppFbtn');
    if (fb) fb.onclick = function (e) { e.stopPropagation(); state.showFilters = !state.showFilters; render(host); };

    host.querySelectorAll('[data-fk]').forEach(function (b) {
      b.onclick = function () {
        var k = b.dataset.fk, v = b.dataset.fv;
        state.F[k] = (state.F[k] === v) ? '' : v;
        state.page = 1;
        render(host);
      };
    });
    host.querySelector('#hppVbtn').onclick = function (e) {
      e.stopPropagation();
      host.querySelector('#hppMenu').classList.toggle('on');
      host.querySelector('#hppPanel').classList.remove('on');
    };
    host.querySelectorAll('#hppMenu [data-view]').forEach(function (b) {
      b.onclick = function () { state.view = b.dataset.view; saveView(); render(host); };
    });
    host.querySelectorAll('#hppMenu [data-pane]').forEach(function (b) {
      b.onclick = function (e) {
        e.stopPropagation();
        if (b.dataset.pane === 'preview') state.preview = !state.preview;
        if (b.dataset.pane === 'detail') state.detailPane = !state.detailPane;
        saveView(); render(host);
      };
    });
    host.querySelector('#hppPbtn').onclick = function () { state.preview = !state.preview; saveView(); render(host); };
    host.querySelector('#hppRefresh').onclick = function () { load(host, true); };
    host.querySelectorAll('[data-clear]').forEach(function (b) {
      b.onclick = function () { Object.keys(state.F).forEach(function (k) { state.F[k] = ''; }); state.page = 1; render(host); };
    });
    host.querySelectorAll('.hpp-chip').forEach(function (c) {
      c.onclick = function () { state.F[c.dataset.k] = ''; state.page = 1; render(host); };
    });
    host.querySelectorAll('[data-pg]').forEach(function (b) {
      b.onclick = function () {
        if (b.disabled) return;
        var n = Number(b.getAttribute('data-pg'));
        if (!n || n === state.page) return;
        state.page = n;
        render(host);
        try { host.scrollIntoView({ block: 'start', behavior: 'smooth' }); } catch (e) {}
      };
    });
    host.querySelectorAll('[data-id]').forEach(function (el) {
      el.onclick = function (e) {
        if (e.target.closest('button')) return;
        /* id 是字符串（如 t-001），不能转数字，否则详情匹配不到 */
        state.sel = el.dataset.id;
        if (!state.preview) { state.preview = true; saveView(); }
        render(host);
      };
    });
    host.querySelectorAll('[data-del]').forEach(function (b) {
      b.onclick = function (e) { e.stopPropagation(); move(host, b.dataset.del, 'trash'); };
    });
    host.querySelectorAll('[data-restore]').forEach(function (b) {
      b.onclick = function (e) { e.stopPropagation(); move(host, b.dataset.restore, 'main'); };
    });
  }

  function detailBar() {
    var x = list.filter(function (y) { return y.id === state.sel; })[0];
    if (!x) return '';
    return '<div class="hpp-detailbar"><span>姓名 <b>' + esc(x.name) + '</b></span>' +
      '<span>岗位 <b>' + esc(x.job) + '</b></span>' +
      '<span>国家 <b>' + esc(x.country) + '</b></span>' +
      '<span>匹配 <b>' + x.score + ' 分</b></span>' +
      '<span>风险 <b>' + esc(x.risk) + '</b></span>' +
      '<span>五维 <b>' + (x.dims || []).join(' / ') + '</b></span>' +
      '<span>入库 <b>' + esc(x.inAt) + '</b></span></div>';
  }

  var resumeCache = {};
  var RTAB = { analysis: '智能分析', resume: '原简历' };

  function detail(host) {
    var d = host.querySelector('#hppDetail');
    var x = list.filter(function (y) { return y.id === state.sel; })[0];
    if (!d || !x) { if (d) d.classList.add('hide'); return; }
    var tab = state.dtab || 'analysis';

    var head = '<div class="hpp-dh"><div><div class="n">' + esc(x.name) + '</div>' +
      '<div class="s">' + esc(x.job) + ' · ' + esc(x.country) + '</div></div>' +
      '<button class="hpp-x" data-close>✕</button></div>' +
      '<div class="hpp-dtabs">' + Object.keys(RTAB).map(function (k) {
        return '<button data-dtab="' + k + '" class="' + (tab === k ? 'on' : '') + '">' + RTAB[k] + '</button>';
      }).join('') + '</div>';

    var dims = x.dims || [70, 70, 70, 60, 60];
    var pros = (x.pros || []).slice(0, 3), cons = (x.cons || []).slice(0, 3);
    d.innerHTML = head +
      '<div style="display:flex;align-items:flex-end;gap:10px;margin-top:14px">' +
        '<div class="hpp-big">' + x.score + '<small>分</small></div>' +
        '<div style="font-size:12.5px;color:var(--text-3)">风险 ' + esc(x.risk) + ' · ' + (x.src === 'auto' ? '自动入库' : '手动上传') + '</div>' +
      '</div>' +
      '<div class="hpp-h5">五维得分</div>' +
      dims.map(function (v, i) {
        return '<div class="hpp-dim"><div class="l"><span>' + DIMS[i] + '</span><b>' + v + '</b></div>' +
          '<div class="t"><i style="width:' + v + '%"></i></div></div>';
      }).join('') +
      (pros.length ? '<div class="hpp-h5">优势</div>' + pros.map(function (t) {
        return '<div class="hpp-li g"><i></i><span>' + esc(t) + '</span></div>';
      }).join('') : '') +
      (cons.length ? '<div class="hpp-h5">不足</div>' + cons.map(function (t) {
        return '<div class="hpp-li w"><i></i><span>' + esc(t) + '</span></div>';
      }).join('') : '') +
      '<div class="hpp-acts2"><button data-no>不推荐</button><button class="p" data-yes>推荐面试</button></div>';

    bindDetail(host, d);
  }

  function bindDetail(host, d) {
    var close = d.querySelector('[data-close]'); if (close) close.onclick = function () { state.sel = null; render(host); };
    var yes = d.querySelector('[data-yes]'); if (yes) yes.onclick = function () { if (window.demoToast) demoToast('已推荐面试'); };
    var no = d.querySelector('[data-no]'); if (no) no.onclick = function () { if (window.demoToast) demoToast('已标记不推荐'); };
    d.querySelectorAll('[data-dtab]').forEach(function (b) {
      b.onclick = function () {
        var k = b.getAttribute('data-dtab');
        if (k === 'resume') { openResumeModal(state.sel); return; }   /* 原简历走大弹窗 */
        state.dtab = k; state.rpage = 0; detail(host);
      };
    });
  }

  /* ---------- 原简历大弹窗（单页长卷 + 滑动，不翻页；沿用 HPAI 简历版式并叠加标注） ---------- */
  var modalState = { data: null, id: null, keyHandler: null };

  function closeResumeModal() {
    var m = document.getElementById('hpmMask');
    if (m) m.remove();
    if (modalState.keyHandler) { document.removeEventListener('keydown', modalState.keyHandler); modalState.keyHandler = null; }
  }

  function openResumeModal(id) {
    if (!id) return;
    if (window.HPAI && window.HPAI.injectCSS) { try { window.HPAI.injectCSS(); } catch (e) {} }
    closeResumeModal();
    modalState.id = id;
    modalState.data = null;

    var mask = document.createElement('div');
    mask.className = 'hpm-mask';
    mask.id = 'hpmMask';
    mask.innerHTML =
      '<div class="hpm-dlg" role="dialog" aria-modal="true" aria-label="原简历">' +
        '<div class="hpm-h">' +
          '<div><div class="n" id="hpmName">原简历</div><div class="s" id="hpmSub">加载中…</div></div>' +
          '<span class="sp"></span>' +
          '<button class="hpm-x" data-x title="关闭（Esc）">✕</button>' +
        '</div>' +
        '<div class="hpm-body" id="hpmBody"><div class="hpp-rload">加载中…</div></div>' +
        '<div class="hpm-f"><span id="hpmHint">向下滑动查看完整简历</span>' +
          '<button data-print>打印 / 另存 PDF</button>' +
          '<button data-x2>关闭</button></div>' +
      '</div>';
    document.body.appendChild(mask);

    mask.addEventListener('mousedown', function (e) { if (e.target === mask) closeResumeModal(); });
    mask.querySelector('[data-x]').onclick = closeResumeModal;
    mask.querySelector('[data-x2]').onclick = closeResumeModal;
    var pb = mask.querySelector('[data-print]');
    if (pb) pb.onclick = function () { document.body.classList.add('hpm-printing'); setTimeout(function () { window.print(); }, 60); };
    modalState.keyHandler = function (e) { if (e.key === 'Escape') closeResumeModal(); };
    window.addEventListener('afterprint', function () { document.body.classList.remove('hpm-printing'); });
    document.addEventListener('keydown', modalState.keyHandler);

    if (resumeCache[id]) { paintModal(resumeCache[id]); return; }
    fetch('/api/pool/resume?id=' + encodeURIComponent(id), { credentials: 'same-origin' })
      .then(function (r) { if (!r.ok) throw new Error('http ' + r.status); return r.json(); })
      .then(function (data) { resumeCache[id] = data; paintModal(data); })
      .catch(function () {
        var b = document.getElementById('hpmBody');
        if (b) b.innerHTML = '<div class="hpp-rload">原简历加载失败，请刷新重试</div>';
      });
  }

  /* 行内高亮：沿用「简历 AI 分析」的 mark.ai-hit / ai-gap / ai-partial 样式，
     但只标精确词（不含它的 2 字滑窗），避免把「元/月」「2 人」也染绿 */
  function kwOf(evidence) {
    var kws = [];
    (evidence || []).forEach(function (e) {
      var names = [];
      (e.evidence || []).forEach(function (ev) { if (ev && ev.value) names.push(String(ev.value)); });
      var rt = String(e.reqText || '').replace(/^具备「|」能力$|^持「|」$/g, '').trim();
      if (rt && rt.length <= 14) names.push(rt);
      names.forEach(function (n) {
        n = String(n).trim();
        if (n.length < 2) return;
        if (/^[\d\s.\/年月天元%（）()·-]+$/.test(n)) return;   /* 纯数字/单位不标 */
        if (!kws.some(function (k) { return k.kw === n; })) kws.push({ kw: n, status: e.status || 'hit' });
      });
    });
    kws.sort(function (a, b) { return b.kw.length - a.kw.length; });
    return kws;
  }
  function hl(text, evidence) {
    var s = String(text == null ? '' : text);
    if (!s) return '';
    var kws = kwOf(evidence);
    if (!kws.length) return esc(s).replace(/\n/g, '<br>');
    var marks = [];
    kws.forEach(function (k) {
      var idx = s.indexOf(k.kw);
      while (idx >= 0) {
        var e2 = idx + k.kw.length;
        var overlap = marks.some(function (m) { return !(e2 <= m.s || idx >= m.e); });
        if (!overlap) marks.push({ s: idx, e: e2, status: k.status });
        idx = s.indexOf(k.kw, e2);
      }
    });
    if (!marks.length) return esc(s).replace(/\n/g, '<br>');
    marks.sort(function (a, b) { return a.s - b.s; });
    var out = '', cur = 0;
    marks.forEach(function (m) {
      out += esc(s.slice(cur, m.s));
      out += '<mark class="ai-' + m.status + '">' + esc(s.slice(m.s, m.e)) + '</mark>';
      cur = m.e;
    });
    out += esc(s.slice(cur));
    return out.replace(/\n/g, '<br>');
  }

  function paintModal(data) {
    var d = data || modalState.data;
    var body = document.getElementById('hpmBody');
    if (!body || !d) return;
    modalState.data = d;

    var nameEl = document.getElementById('hpmName');
    var subEl = document.getElementById('hpmSub');
    if (nameEl) nameEl.textContent = d.name || '原简历';
    if (subEl) {
      subEl.textContent = d.job
        ? ('对照岗位：' + d.job.title + (d.job.country ? (' · ' + d.job.country) : ''))
        : 'AI 已按岗位要求标注';
    }

    if (!d.ok || !d.pages || !d.pages.length) {
      body.innerHTML = '<div class="hpp-rload">该候选人没有可展示的原简历</div>';
      return;
    }

    var checks = (d.checks || []).map(function (c) {
      var icon = c.level === 'ok' ? '✓' : c.level === 'gap' ? '✕' : '!';
      return '<span class="hpp-chk ' + c.level + '" title="' + esc(c.detail || '') + '">' + icon + ' ' + esc(c.text) + '</span>';
    }).join('');

    var sections = d.pages.map(function (p) {
      var rows = p.rows.map(function (r) {
        var cls = 'kv' + (r.mark ? (r.mark.level === 'ok' ? ' ai-hit-row' : r.mark.level === 'gap' ? ' ai-gap-row' : ' ai-warn-row') : '');
        return '<div class="' + cls + '">' +
          '<span class="k">' + esc(r.k).replace(/\n/g, '<br>') + '</span>' +
          '<span class="v">' + hl(r.v, d.evidence) + '</span>' +
          (r.mark ? '<span class="hpp-mark ' + r.mark.level + '">' + esc(r.mark.text) + '</span>' : '') +
        '</div>';
      }).join('');
      return '<div class="aic"><div class="aic-h"><span>▍</span><span>' + esc(p.title) + '</span>' +
        '<span class="n">' + p.rows.length + ' 项</span></div>' +
        '<div class="aic-b">' + rows + '</div></div>';
    }).join('');

    body.innerHTML =
      '<div class="hpm-legend">' +
        '<span><i class="ok"></i>正文绿色高亮 = 命中岗位要求</span>' +
        '<span><i class="gap"></i>红色 = 缺口</span>' +
        '<span><i class="warn"></i>黄色 = 待确认</span>' +
        '<span class="hpm-legend-hint">左侧色条 = 该行整体判定</span>' +
      '</div>' +
      (checks ? '<div class="hpp-checks">' + checks + '</div>' : '') +
      '<div class="aiw">' + sections + '</div>';

    var hint = document.getElementById('hpmHint');
    if (hint) hint.textContent = '共 ' + d.pages.length + ' 个板块 · 向下滑动查看完整简历';
  }

  function move(host, id, to) {
    var it = list.filter(function (x) { return x.id === id; })[0];
    if (!it) return;
    it.state = to;
    if (state.sel === id) state.sel = null;
    render(host);
    fetch('/api/pool/' + (to === 'trash' ? 'delete' : 'restore'), {
      method: 'POST', credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id })
    }).catch(function () {});
  }

  function load(host, force) {
    if (list.length && !force) { render(host); return; }
    fetch('/api/pool', { credentials: 'same-origin' })
      .then(function (r) { if (!r.ok) throw new Error('http'); return r.json(); })
      .then(function (d) { list = (d && d.items) ? d.items : DEMO.slice(); render(host); })
      .catch(function () { list = DEMO.slice(); render(host); });
  }

  function mount(host) {
    if (!host) return;
    injectCSS();
    if (list.length) { render(host); return; }
    host.innerHTML = '<div style="color:var(--text-3);font-size:13px;padding:10px 0">加载中…</div>';
    load(host);
  }

  document.addEventListener('click', function (e) {
    var p = document.getElementById('hppPanel'), m = document.getElementById('hppMenu');
    if (p && !e.target.closest('#hppPanel') && !e.target.closest('#hppFbtn')) p.classList.remove('on');
    if (m && !e.target.closest('#hppMenu') && !e.target.closest('#hppVbtn')) m.classList.remove('on');
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape' || state.sel === null) return;
    var h = document.getElementById('hpPool');
    if (h) { state.sel = null; render(h); }
  });

  /* 切语言时清缓存，让 showView 重新按新语言拉数据 */
  function invalidate() {
    list.length = 0;
    state.sel = null;
  }

  window.HPPOOL = { mount: mount, invalidate: invalidate, DEMO: DEMO };
})();
