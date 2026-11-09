/* =====================================================================
 * hp-boot.js —— AI 匹配分析 · 开机动画（重新生成版）
 * ---------------------------------------------------------------------
 * 依据：demo-开机-match风格.html（用户实测可见，作为基准实现）
 *
 * 与基准保持一致的关键点（这几点是"能看到动画"的前提）：
 *   1. position:fixed 全屏，z-index 9000 —— 不依赖任何祖先高度/可见性
 *   2. 挂到 document.body —— 不放进舞台容器（容器 visibility 会传染，导致隐形）
 *   3. 样式用独立 class 前缀 hpb-，不与被接入页面冲突
 *
 * 对基准的改造（仅为接入，不改动画面本身）：
 *   · 元素 id 加 hpb 前缀，避免与页面既有 id 撞车
 *   · 提供 ?skipboot=1 / ?fastboot=1 开关
 *   · 结束时移除 DOM，杜绝残影
 *   · 支持"只盖分析区"（可选）：传入 host 则量取其屏幕区域做内嵌定位
 *
 * 用法：
 *   await window.HPBoot.play();                      // 全屏
 *   await window.HPBoot.play({ host: stageRoot });   // 对准该容器区域
 *   await window.HPBoot.play({ compact: true });     // 精简（约 1.3s）
 * ===================================================================== */
(function () {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';
  var playing = false;

  /* ================= 样式（与基准一致，加 hpb- 前缀） ================= */
  var CSS = [
    /* 覆盖分析区（不遮菜单/导航）。
       实测数据：舞台容器 .hps 的实际高度是 10946px（因为它 height:100% 而父级
       height:auto，内部内容又把滚动高度撑开）。若让动画 absolute inset:0 跟着它，
       内容会被居中到 y=5367 —— 屏幕外，表现为"没有画面"。
       解决：播放期间用 CSS 把容器高度强制锁到视口高度，动画就居中在可视区。
       结束时会移除这个类，容器恢复原高度，不影响分析界面的正常布局与滚动。 */
    '.hpb-lock{height:calc(100vh - 84px)!important;max-height:calc(100vh - 84px)!important;',
    'overflow:hidden!important}',
    '.hpb-host{position:relative!important}',

    /* ===== 主题变量：开机动画跟随三套主题 ===== */
    '.hpb-boot{',
    '--hpb-bg1:#0b1424;--hpb-bg2:#070b14;',
    '--hpb-grid:rgba(120,200,255,.07);',
    '--hpb-cyan:rgba(56,189,248,.8);--hpb-cyan-soft:rgba(56,189,248,.14);',
    '--hpb-cyan-line:rgba(56,189,248,.16);--hpb-cyan-lit:#38bdf8;--hpb-cyan-glow:rgba(56,189,248,.6);',
    '--hpb-violet:rgba(125,211,252,.16);--hpb-violet-lit:#7dd3fc;--hpb-violet-glow:rgba(125,211,252,.95);',
    '--hpb-hex:rgba(120,200,255,.34);--hpb-tick:rgba(139,163,194,.5);',
    '--hpb-noise:rgba(255,255,255,.014);',
    '--hpb-halo1:rgba(56,189,248,.3);--hpb-halo2:rgba(125,211,252,.14);',
    '--hpb-text:#dff7ff;--hpb-text-dim:#7c93b3;',
    '--hpb-track:rgba(255,255,255,.08);--hpb-voice-bg:rgba(7,11,20,.9);--hpb-voice-fg:#d6ecff;',
    '--hpb-core:#eafcff;--hpb-core-glow:rgba(255,255,255,.9);--hpb-glyph:#04121a;',
    '}',
    /* 明亮主题 */
    '[data-theme="light"] .hpb-boot{',
    '--hpb-bg1:#EAF1FB;--hpb-bg2:#F3F6FB;',
    '--hpb-grid:rgba(37,99,235,.06);',
    '--hpb-cyan:rgba(37,99,235,.75);--hpb-cyan-soft:rgba(37,99,235,.10);',
    '--hpb-cyan-line:rgba(37,99,235,.18);--hpb-cyan-lit:#2563EB;--hpb-cyan-glow:rgba(37,99,235,.35);',
    '--hpb-violet:rgba(124,58,237,.18);--hpb-violet-lit:#7C3AED;--hpb-violet-glow:rgba(124,58,237,.4);',
    '--hpb-hex:rgba(37,99,235,.28);--hpb-tick:rgba(81,98,124,.55);',
    '--hpb-noise:rgba(22,35,59,.02);',
    '--hpb-halo1:rgba(37,99,235,.16);--hpb-halo2:rgba(124,58,237,.10);',
    '--hpb-text:#16233B;--hpb-text-dim:#51627C;--hpb-track:rgba(22,35,59,.10);--hpb-voice-bg:rgba(255,255,255,.94);--hpb-voice-fg:#16233B;',
    '}',
    /* 极简主题 */
    '[data-theme="mono"] .hpb-boot{',
    '--hpb-bg1:#F5F5F5;--hpb-bg2:#FAFAFA;',
    '--hpb-grid:rgba(0,0,0,.05);',
    '--hpb-cyan:rgba(0,0,0,.7);--hpb-cyan-soft:rgba(0,0,0,.06);',
    '--hpb-cyan-line:rgba(0,0,0,.16);--hpb-cyan-lit:#000000;--hpb-cyan-glow:rgba(0,0,0,.25);',
    '--hpb-violet:rgba(0,0,0,.10);--hpb-violet-lit:#404040;--hpb-violet-glow:rgba(0,0,0,.2);',
    '--hpb-hex:rgba(0,0,0,.22);--hpb-tick:rgba(82,82,82,.5);',
    '--hpb-noise:rgba(0,0,0,.012);',
    '--hpb-halo1:rgba(0,0,0,.08);--hpb-halo2:rgba(0,0,0,.05);',
    '--hpb-text:#111111;--hpb-text-dim:#525252;--hpb-track:rgba(0,0,0,.10);--hpb-voice-bg:rgba(255,255,255,.96);--hpb-voice-fg:#111111;',
    '}',

    '.hpb-boot{position:absolute;top:0;left:0;right:0;bottom:0;z-index:9000;',
    'display:flex;align-items:center;justify-content:center;',
    'overflow:hidden;background:radial-gradient(ellipse 80% 60% at 50% 45%,var(--hpb-bg1) 0%,var(--hpb-bg2) 70%);',
    'transition:opacity .9s cubic-bezier(.16,1,.3,1),visibility 0s linear .9s}',
    /* 退回 body 时（无 host）用全屏 */
    '.hpb-boot.hpb-full{position:fixed}',
    '.hpb-boot.out{opacity:0;visibility:hidden;pointer-events:none}',

    '.hpb-noise{position:absolute;inset:0;pointer-events:none;opacity:.4;',
    'background-image:repeating-linear-gradient(0deg,var(--hpb-noise) 0 1px,transparent 1px 2px);',
    'animation:hpbNoise .6s steps(3) infinite}',
    '@keyframes hpbNoise{0%{transform:translate(0,0)}33%{transform:translate(-1px,1px)}66%{transform:translate(1px,-1px)}}',

    '.hpb-grid{position:absolute;inset:-20% -10%;pointer-events:none;',
    'background-image:linear-gradient(var(--hpb-grid) 1px,transparent 1px),',
    'linear-gradient(90deg,var(--hpb-grid) 1px,transparent 1px);background-size:54px 54px;',
    '-webkit-mask-image:radial-gradient(ellipse 62% 62% at 50% 50%,#000 12%,transparent 78%);',
    'mask-image:radial-gradient(ellipse 62% 62% at 50% 50%,#000 12%,transparent 78%);',
    'transform:perspective(700px) rotateX(58deg) translateY(6%) scale(1.5);',
    'opacity:0;animation:hpbGridIn 1.1s cubic-bezier(.16,1,.3,1) .1s forwards}',
    '@keyframes hpbGridIn{to{opacity:1}}',
    '.hpb-grid::after{content:"";position:absolute;inset:0;height:26%;',
    'background:linear-gradient(180deg,transparent,var(--hpb-cyan-soft),transparent);',
    'animation:hpbGridSweep 2.4s linear infinite}',
    '@keyframes hpbGridSweep{from{transform:translateY(-120%)}to{transform:translateY(520%)}}',

    '.hpb-scan{position:absolute;left:0;right:0;top:0;height:2px;pointer-events:none;',
    'background:linear-gradient(90deg,transparent,var(--hpb-cyan),transparent);',
    'box-shadow:0 0 22px var(--hpb-cyan-glow);animation:hpbScanDown 2.6s cubic-bezier(.16,1,.3,1) infinite}',
    '@keyframes hpbScanDown{0%{opacity:0;transform:translateY(0)}10%{opacity:1}90%{opacity:1}100%{opacity:0;transform:translateY(100vh)}}',

    '.hpb-stage{position:relative;z-index:2;width:min(620px,86vw);display:flex;flex-direction:column;align-items:center}',

    '.hpb-core{position:relative;width:230px;height:230px;margin-bottom:6px}',
    '.hpb-core svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}',
    '.hpb-core .sa{transform-origin:115px 115px;animation:hpbSpin 9s linear infinite}',
    '.hpb-core .sb{transform-origin:115px 115px;animation:hpbSpin 15s linear infinite reverse}',
    '.hpb-core .sc{transform-origin:115px 115px;animation:hpbSpin 26s linear infinite}',
    '@keyframes hpbSpin{to{transform:rotate(360deg)}}',
    '.hpb-core .hex{fill:none;stroke:var(--hpb-hex);stroke-width:1.2;transform-origin:115px 115px}',
    '.hpb-core .arc{fill:none;stroke-width:2.4;stroke-linecap:round;stroke:var(--hpb-cyan-line);',
    'transition:stroke .5s cubic-bezier(.16,1,.3,1),filter .5s cubic-bezier(.16,1,.3,1)}',
    '.hpb-core .arc.v{stroke:var(--hpb-violet)}',
    '.hpb-core .arc.lit{stroke:var(--hpb-cyan-lit);filter:drop-shadow(0 0 8px var(--hpb-cyan-glow))}',
    '.hpb-core .arc.v.lit{stroke:var(--hpb-violet-lit);filter:drop-shadow(0 0 8px var(--hpb-violet-glow))}',
    '.hpb-core .rtxt{font-family:ui-monospace,Consolas,monospace;font-size:7.4px;',
    'letter-spacing:2.6px;fill:var(--hpb-tick)}',

    '.hpb-nuc{position:absolute;left:50%;top:50%;width:96px;height:96px;transform:translate(-50%,-50%);',
    'border-radius:50%;display:grid;place-items:center;',
    'background:radial-gradient(circle,var(--hpb-halo1),var(--hpb-halo2) 55%,transparent 72%);',
    'box-shadow:0 0 0 rgba(56,189,248,0);transition:box-shadow .6s cubic-bezier(.16,1,.3,1)}',
    '.hpb-nuc::before{content:"";position:absolute;inset:16px;border-radius:50%;',
    'background:radial-gradient(circle,var(--hpb-core),var(--hpb-cyan) 38%,var(--hpb-violet) 62%,transparent 78%);',
    'opacity:.22;transform:scale(.7);transition:opacity .5s cubic-bezier(.16,1,.3,1),transform .7s cubic-bezier(.16,1,.3,1)}',
    '.hpb-nuc.on::before{opacity:1;transform:scale(1)}',
    '.hpb-nuc.on{box-shadow:0 0 70px var(--hpb-cyan-glow),0 0 140px rgba(125,211,252,.32);',
    'animation:hpbNucPulse 2s ease-in-out infinite}',
    '@keyframes hpbNucPulse{0%,100%{box-shadow:0 0 60px var(--hpb-cyan-glow),0 0 120px rgba(125,211,252,.26)}',
    '50%{box-shadow:0 0 92px rgba(56,189,248,.8),0 0 170px rgba(125,211,252,.44)}}',
    '.hpb-nuc .glyph{position:relative;z-index:2;font-size:26px;color:var(--hpb-glyph);font-weight:700;opacity:0;',
    'transform:scale(.6);transition:opacity .5s cubic-bezier(.16,1,.3,1),transform .6s cubic-bezier(.16,1,.3,1);',
    'text-shadow:0 0 14px var(--hpb-core-glow)}',
    '.hpb-nuc.on .glyph{opacity:1;transform:scale(1);color:var(--hpb-core)}',

    '.hpb-shock{position:absolute;left:50%;top:50%;width:96px;height:96px;transform:translate(-50%,-50%);',
    'border-radius:50%;border:2px solid rgba(56,189,248,.85);opacity:0}',
    '.hpb-shock.go{animation:hpbShock .95s cubic-bezier(.16,1,.3,1) forwards}',
    '@keyframes hpbShock{0%{opacity:.9;transform:translate(-50%,-50%) scale(1)}',
    '100%{opacity:0;transform:translate(-50%,-50%) scale(4.2)}}',

    '.hpb-title{margin-top:14px;text-align:center;font-size:26px;font-weight:700;letter-spacing:5px;',
    'color:var(--hpb-core);opacity:0;transform:translateY(10px);filter:blur(6px);',
    'transition:opacity 1s cubic-bezier(.16,1,.3,1),transform 1s cubic-bezier(.16,1,.3,1),filter 1s cubic-bezier(.16,1,.3,1);',
    'text-shadow:0 0 26px var(--hpb-cyan)}',
    '.hpb-title.on{opacity:1;transform:none;filter:none}',
    '.hpb-title em{font-style:normal;display:block;margin-top:8px;font-size:10.5px;letter-spacing:5.5px;',
    'font-weight:600;color:var(--hpb-cyan-lit);opacity:.8}',

    '.hpb-log{margin-top:22px;width:100%;height:62px;font-family:ui-monospace,Consolas,monospace;',
    'font-size:12px;line-height:1.9;text-align:center;color:rgba(150,200,230,.72)}',
    '.hpb-log .ln{opacity:0;transform:translateY(5px);animation:hpbLnIn .3s cubic-bezier(.16,1,.3,1) forwards}',
    '@keyframes hpbLnIn{to{opacity:1;transform:none}}',
    '.hpb-log .ln em{font-style:normal;color:var(--hpb-cyan-lit)}',
    '.hpb-log .ln b{color:#9ff6d4;font-weight:600}',

    '.hpb-bar{margin-top:20px;width:min(420px,80vw);height:3px;border-radius:3px;',
    'background:var(--hpb-track);overflow:hidden;position:relative}',
    '.hpb-bar i{display:block;height:100%;width:0;border-radius:3px;',
    'background:linear-gradient(90deg,var(--hpb-cyan-lit),var(--hpb-violet-lit));box-shadow:0 0 12px var(--hpb-cyan-glow)}',
    '.hpb-pct{margin-top:10px;font-family:ui-monospace,Consolas,monospace;font-size:12px;',
    'letter-spacing:3px;color:var(--hpb-cyan-lit);opacity:.85;font-variant-numeric:tabular-nums}',

    '.hpb-voice{position:absolute;left:50%;bottom:74px;transform:translate(-50%,10px);z-index:3;',
    'max-width:min(760px,88vw);text-align:center;padding:11px 22px;border-radius:11px;',
    'background:var(--hpb-voice-bg);border:1px solid var(--hpb-hex);color:var(--hpb-voice-fg);font-size:13.5px;',
    'letter-spacing:.3px;backdrop-filter:blur(10px);box-shadow:0 0 34px var(--hpb-cyan-line);',
    'opacity:0;transition:opacity .42s cubic-bezier(.16,1,.3,1),transform .42s cubic-bezier(.16,1,.3,1)}',
    '.hpb-voice.on{opacity:1;transform:translate(-50%,0)}',
    '.hpb-voice .wave{display:inline-flex;align-items:flex-end;gap:2px;height:13px;margin-right:9px;vertical-align:-2px}',
    '.hpb-voice .wave i{width:2px;height:4px;background:var(--hpb-cyan-lit);border-radius:1px;',
    'animation:hpbWave .7s ease-in-out infinite}',
    '.hpb-voice .wave i:nth-child(2){animation-delay:.1s}',
    '.hpb-voice .wave i:nth-child(3){animation-delay:.2s}',
    '.hpb-voice .wave i:nth-child(4){animation-delay:.3s}',
    '.hpb-voice .wave i:nth-child(5){animation-delay:.4s}',
    '@keyframes hpbWave{0%,100%{height:4px}50%{height:13px}}',

    '.hpb-skip{position:absolute;left:50%;bottom:26px;transform:translateX(-50%);font-size:11.5px;',
    'letter-spacing:.6px;color:var(--hpb-tick);opacity:0;animation:hpbSkipIn .6s cubic-bezier(.16,1,.3,1) 1.4s forwards}',
    '@keyframes hpbSkipIn{to{opacity:1}}',
    '.hpb-skip b{color:var(--hpb-cyan-lit);font-weight:600}',

    '@media (prefers-reduced-motion:reduce){.hpb-boot *{animation-duration:.01ms!important;',
    'animation-iteration-count:1!important;transition-duration:.01ms!important}}'
  ].join('');

  function injectCSS() {
    if (document.getElementById('hpb-css')) return;
    var s = document.createElement('style');
    s.id = 'hpb-css';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  /* ================= 音效（与基准一致：含方波，机械感来源） ================= */
  var ac = null, master = null;
  function audioReady() {
    if (ac) return ac;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    try {
      ac = new AC();
      master = ac.createGain();
      master.gain.value = 0.5;
      master.connect(ac.destination);
    } catch (e) { ac = null; }
    return ac;
  }
  function beep(freq, dur, type, gain, sweep) {
    var a = audioReady(); if (!a) return;
    var o = a.createOscillator(), g = a.createGain();
    o.type = type || 'square';
    o.frequency.setValueAtTime(freq, a.currentTime);
    if (sweep) o.frequency.exponentialRampToValueAtTime(Math.max(40, freq + sweep), a.currentTime + dur);
    g.gain.setValueAtTime(0, a.currentTime);
    g.gain.linearRampToValueAtTime(gain || 0.05, a.currentTime + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + dur);
    o.connect(g); g.connect(master);
    o.start(); o.stop(a.currentTime + dur + 0.02);
  }
  function powerUp() {
    var a = audioReady(); if (!a) return;
    [110, 165, 220].forEach(function (f, i) {
      var o = a.createOscillator(), g = a.createGain();
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(f * 0.75, a.currentTime);
      o.frequency.exponentialRampToValueAtTime(f, a.currentTime + 1.1 + i * 0.1);
      g.gain.setValueAtTime(0, a.currentTime);
      g.gain.linearRampToValueAtTime(0.035, a.currentTime + 0.4);
      g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + 1.5 + i * 0.12);
      o.connect(g); g.connect(master);
      o.start(); o.stop(a.currentTime + 1.7);
    });
    [523, 659, 784, 1046].forEach(function (f, i) {
      var t = a.currentTime + 0.55 + i * 0.13;
      var o = a.createOscillator(), g = a.createGain();
      o.type = 'square'; o.frequency.setValueAtTime(f, t);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.05, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
      o.connect(g); g.connect(master);
      o.start(t); o.stop(t + 0.26);
    });
  }
  function dataStream(dur) {
    dur = dur || 0.5;
    var a = audioReady(); if (!a) return;
    var len = Math.floor(a.sampleRate * dur);
    var buf = a.createBuffer(1, len, a.sampleRate);
    var d = buf.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * 0.5;
    var src = a.createBufferSource(); src.buffer = buf;
    var bp = a.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 9;
    bp.frequency.setValueAtTime(400, a.currentTime);
    bp.frequency.exponentialRampToValueAtTime(4200, a.currentTime + dur);
    var g = a.createGain();
    g.gain.setValueAtTime(0.05, a.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + dur);
    src.connect(bp); bp.connect(g); g.connect(master);
    src.start(); src.stop(a.currentTime + dur);
  }
  function readyChime() {
    var a = audioReady(); if (!a) return;
    [[784, 0], [1046, 0.12], [1318, 0.24]].forEach(function (pair) {
      var t = a.currentTime + pair[1];
      var o = a.createOscillator(), g = a.createGain();
      o.type = 'sine'; o.frequency.setValueAtTime(pair[0], t);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.09, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
      o.connect(g); g.connect(master);
      o.start(t); o.stop(t + 0.55);
    });
  }

  /* ================= 机器人人声 ================= */
  var voices = [];
  function loadVoices() {
    if (!('speechSynthesis' in window)) return;
    voices = window.speechSynthesis.getVoices() || [];
  }
  if ('speechSynthesis' in window) {
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }
  /** 当前界面语言（zh / en / …） */
  function curLang() {
    if (window.HPI18N && window.HPI18N.lang) {
      try { return window.HPI18N.lang() || 'zh'; } catch (e) {}
    }
    try { return localStorage.getItem('hp-lang') || 'zh'; } catch (e) { return 'zh'; }
  }

  /** 语言 → BCP-47 与语音匹配正则 */
  var LANG_VOICE = {
    zh: { tag: 'zh-CN', re: /zh|cmn|Chinese|中文|普通话/i },
    en: { tag: 'en-US', re: /^en|English|US English|UK English/i },
    fr: { tag: 'fr-FR', re: /^fr|French|Français/i },
    ar: { tag: 'ar-SA', re: /^ar|Arabic|العربية/i },
    es: { tag: 'es-ES', re: /^es|Spanish|Español/i },
    ru: { tag: 'ru-RU', re: /^ru|Russian|Русский/i },
    vi: { tag: 'vi-VN', re: /^vi|Vietnamese|Tiếng Việt/i },
    ja: { tag: 'ja-JP', re: /^ja|Japanese|日本語/i },
    ko: { tag: 'ko-KR', re: /^ko|Korean|한국어/i },
    de: { tag: 'de-DE', re: /^de|German|Deutsch/i },
    pt: { tag: 'pt-BR', re: /^pt|Portuguese|Português/i },
    th: { tag: 'th-TH', re: /^th|Thai|ไทย/i },
    id: { tag: 'id-ID', re: /^id|Indonesian|Bahasa/i }
  };

  function pickVoice(lang) {
    if (!voices.length) loadVoices();
    if (!voices.length) return null;
    var L = LANG_VOICE[lang] || LANG_VOICE.zh;
    var pool = voices.filter(function (v) {
      return L.re.test(v.lang) || L.re.test(v.name);
    });
    if (!pool.length) return null;      /* 没有对应语音 → 交给浏览器按 lang 处理 */
    /* 优先男声，营造机器人质感 */
    var male = pool.find(function (v) {
      return /Yunxi|Yunjian|Kangkang|male|男|Liang|Yunyang|Daniel|Alex|Google UK English Male/i.test(v.name);
    });
    return male || pool[0];
  }


  /* ===== 启动台词（多语言） ===== */
  var BOOT_LINES = {
    zh: {
      selfTest: '系统自检完成，正在初始化双向智能匹配引擎。',
      neural:   '神经网络已唤醒，正在加载岗位画像与候选人特征。',
      ready:    '匹配引擎就绪，开始为你寻找最合适的人选。'
    },
    en: {
      selfTest: 'Self-test complete. Initializing the bidirectional AI matching engine.',
      neural:   'Neural network online. Loading job profiles and candidate features.',
      ready:    'Matching engine ready. Searching for the best fit for you.'
    }
  };

  /** 取当前语言的启动台词，未收录语言回退英文（非中文环境） */
  function bootLine(key) {
    var L = curLang();
    var pack = BOOT_LINES[L] || (L === 'zh' ? BOOT_LINES.zh : BOOT_LINES.en);
    return pack[key] || BOOT_LINES.zh[key];
  }

  function smoothSpeech(text) {
    return String(text || '').replace(/\s+/g, ' ').trim();
  }

  function speak(text, rate) {
    if (!('speechSynthesis' in window) || !text) return;
    text = smoothSpeech(text);
    loadVoices();
    var lang = curLang();
    var u = new SpeechSynthesisUtterance(text);
    var v = pickVoice(lang);
    var fallbackTag = (LANG_VOICE[lang] || LANG_VOICE.zh).tag;
    if (v) { u.voice = v; u.lang = v.lang; } else { u.lang = fallbackTag; }
    u.rate = rate || 0.92;
    u.pitch = 0.62;      // 机器人感：低音高
    u.volume = 1;
    try { window.speechSynthesis.speak(u); } catch (e) {}
  }
  function stopSpeak() {
    try { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); } catch (e) {}
  }

  /* ================= 构建 DOM（结构与基准一致） ================= */
  function buildDom(host) {
    injectCSS();
    var el = document.createElement('div');
    el.className = 'hpb-boot' + (host ? '' : ' hpb-full');
    el.id = 'hpbBoot';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', '系统启动中');
    el.innerHTML = [
      '<div class="hpb-noise"></div>',
      '<div class="hpb-grid"></div>',
      '<div class="hpb-scan"></div>',
      '<div class="hpb-stage">',
      '  <div class="hpb-core" id="hpbCore">',
      '    <svg viewBox="0 0 230 230" aria-hidden="true">',
      '      <g id="hpbTicks"></g>',
      '      <g class="sa"><circle class="arc" id="hpbArcA" cx="115" cy="115" r="78" pathLength="1" stroke-dasharray=".22 .78"/></g>',
      '      <g class="sb"><circle class="arc v" id="hpbArcB" cx="115" cy="115" r="94" pathLength="1" stroke-dasharray=".14 .86"/></g>',
      '      <g class="sc"><circle class="arc" id="hpbArcC" cx="115" cy="115" r="108" pathLength="1" stroke-dasharray=".07 .93"/></g>',
      '      <polygon class="hex" id="hpbHex1" points="115,32 187,73.5 187,156.5 115,198 43,156.5 43,73.5"/>',
      '      <polygon class="hex" id="hpbHex2" points="115,48 173,81.5 173,148.5 115,182 57,148.5 57,81.5"/>',
      '      <path id="hpbTxtPath" d="M115,115 m-101,0 a101,101 0 1,1 202,0 a101,101 0 1,1 -202,0" fill="none"/>',
      '      <text class="rtxt"><textPath href="#hpbTxtPath" startOffset="0">',
      'AI MATCHING ENGINE · 双向智能匹配系统 · DEEPSEEK CHAT · REASONING CORE · AI MATCHING ENGINE · 双向智能匹配系统 ·',
      '</textPath></text>',
      '    </svg>',
      '    <div class="hpb-nuc" id="hpbNuc"><span class="glyph">◈</span></div>',
      '    <div class="hpb-shock" id="hpbShock"></div>',
      '  </div>',
      '  <div class="hpb-title" id="hpbTitle">双向智能匹配<em>AI MATCHING SYSTEM</em></div>',
      '  <div class="hpb-log" id="hpbLog"></div>',
      '  <div class="hpb-bar"><i id="hpbBar"></i></div>',
      '  <div class="hpb-pct" id="hpbPct">000 %</div>',
      '</div>',
      '<div class="hpb-voice" id="hpbVoice"></div>',
      '<div class="hpb-skip">任意点击 或 按 <b>ESC</b> 跳过</div>'
    ].join('\n');

    /* 挂载点：放进传入的 host（分析舞台容器）；无 host 时退回 body。
       这样动画只覆盖"内容区"，左侧菜单与顶部导航栏保持可见（满足需求）。
       容器由 CSS 负责铺满（见 .hpb-boot + .hps-host 规则），不做任何 JS 量尺寸。 */
    (host || document.body).appendChild(el);

    /* 60 根刻度（每 5 根加长） */
    var g = el.querySelector('#hpbTicks');
    for (var i = 0; i < 60; i++) {
      var a = (i / 60) * Math.PI * 2;
      var r1 = 86, r2 = (i % 5 === 0) ? 96 : 91;
      var l = document.createElementNS(NS, 'line');
      l.setAttribute('x1', 115 + Math.cos(a) * r1);
      l.setAttribute('y1', 115 + Math.sin(a) * r1);
      l.setAttribute('x2', 115 + Math.cos(a) * r2);
      l.setAttribute('y2', 115 + Math.sin(a) * r2);
      l.setAttribute('stroke', i % 5 === 0 ? 'var(--hpb-hex)' : 'rgba(120,200,255,.16)');
      g.appendChild(l);
    }
    return el;
  }

  /* ================= 播放 ================= */
  function play(opts) {
    opts = opts || {};
    var compact = !!opts.compact;
    var host = opts.host || null;      // 分析舞台容器：动画只盖它，菜单/导航保持可见
    if (playing) return Promise.resolve();
    playing = true;

    /* 播放期间把舞台内的分析内容藏起来，确保"先动画、后界面"。
       用 visibility+opacity，不动 display，避免影响既有布局与事件绑定。
       注意：动画层是 host 的子元素，必须在隐藏循环之后创建。            */
    var hidden = [];
    function hideContent() {
      if (!host) return;
      Array.prototype.forEach.call(host.children, function (c) {
        if (c.id === 'hpbBoot') return;
        hidden.push({ el: c, vis: c.style.visibility, op: c.style.opacity });
        c.style.visibility = 'hidden';
        c.style.opacity = '0';
      });
    }
    function showContent() {
      hidden.forEach(function (h) {
        h.el.style.visibility = h.vis || '';
        h.el.style.opacity = h.op || '';
      });
      hidden.length = 0;
    }
    hideContent();

    var el = buildDom(host);
    var q = function (id) { return el.querySelector('#' + id); };
    var core = q('hpbCore'), nuc = q('hpbNuc'), shock = q('hpbShock'),
        title = q('hpbTitle'), logBox = q('hpbLog'), barEl = q('hpbBar'),
        pctEl = q('hpbPct'), voiceEl = q('hpbVoice');

    var timers = [];
    var finished = false;

    /* 播放期间把舞台高度锁到视口，让动画居中在可视区（否则容器 10946px 高，
       动画会被居中到屏幕外）。结束时会移除 .hpb-lock，恢复容器原状。 */
    if (host) {
      try { host.scrollTop = 0; } catch (e) {}
      host.classList.add('hpb-host', 'hpb-lock');
    }

    function at(ms, fn) { timers.push(setTimeout(fn, ms)); }
    function clearAll() { timers.forEach(clearTimeout); timers.length = 0; }
    function setProgress(p) {
      p = Math.max(0, Math.min(100, p));
      barEl.style.width = p + '%';
      pctEl.textContent = String(Math.round(p)).padStart(3, '0') + ' %';
    }
    function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
    function progressTo(target, dur) {
      var from = parseFloat(barEl.style.width) || 0;
      var t0 = performance.now();
      (function tick(now) {
        if (finished) return;
        var p = Math.min(1, (now - t0) / (dur || 700));
        setProgress(from + (target - from) * easeOut(p));
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
    }
    function bootLog(html) {
      var d = document.createElement('div');
      d.className = 'ln'; d.innerHTML = html;
      logBox.appendChild(d);
      while (logBox.childElementCount > 4) logBox.removeChild(logBox.firstChild);
    }
    function voiceLine(html, hold) {
      voiceEl.innerHTML = '<span class="wave"><i></i><i></i><i></i><i></i><i></i></span>' + html;
      voiceEl.classList.add('on');
      timers.push(setTimeout(function () { voiceEl.classList.remove('on'); }, hold || 2600));
    }
    function lightCore(level) {
      [[q('hpbArcA'), 1], [q('hpbArcB'), 2], [q('hpbArcC'), 3]].forEach(function (p) {
        if (p[0]) p[0].classList.toggle('lit', level >= p[1]);
      });
      [q('hpbHex1'), q('hpbHex2')].forEach(function (h, i) {
        if (h) h.style.stroke = level >= i + 2 ? 'rgba(120,200,255,.62)' : 'var(--hpb-hex)';
      });
    }

    var resolve;
    var done = new Promise(function (r) { resolve = r; });

    function enterMain() {
      if (finished) return;
      finished = true;
      clearAll();
      stopSpeak();
      el.classList.add('out');
      /* 解开容器高度锁 + 揭晓分析界面（与淡出同时进行）→ "动画过了才进入匹配界面" */
      if (host) host.classList.remove('hpb-lock');
      showContent();
      setTimeout(function () {
        if (el.parentNode) el.parentNode.removeChild(el);
        playing = false;
        resolve();
      }, 900);
    }
    function skip() {
      if (finished) return;
      clearAll();
      stopSpeak();
      if (master) { try { master.gain.value = 0; } catch (e) {} }
      lightCore(3);
      nuc.classList.add('on');
      title.classList.add('on');
      setProgress(100);
      enterMain();
    }

    el.addEventListener('click', skip);
    var onKey = function (e) {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        window.removeEventListener('keydown', onKey);
        skip();
      }
    };
    window.addEventListener('keydown', onKey);

    var T = compact
      ? { power: 80, selfTest: 320, scan: 700, ready: 1050, enter: 1300 }
      : { power: 200, selfTest: 900, scan: 2400, ready: 4200, enter: 5300 };

    setProgress(0);

    at(T.power, function () {
      powerUp(); core.classList.add('loading'); lightCore(1);
      bootLog('<em>[ 00.00 ]</em> POWER ON · 电压稳定 12.0V');
      progressTo(12, compact ? 200 : 600);
    });
    at(T.selfTest, function () {
      lightCore(2);
      bootLog('<em>[ 00.01 ]</em> SELF-TEST · 硬件自检 <b>通过</b>');
      var L1 = bootLine('selfTest');
      voiceLine(L1, 3200);
      speak(L1);
      beep(880, 0.09, 'square', 0.05);
      progressTo(34, compact ? 380 : 1100);
      at(compact ? 140 : 400, function () {
        dataStream(0.45);
        bootLog('<em>[ 00.02 ]</em> LOAD  profile · candidate × job');
      });
    });
    at(T.scan, function () {
      bootLog('<em>[ 00.03 ]</em> WAKING  neural network · 12 features');
      voiceLine(bootLine('neural'), 3200);
      speak(bootLine('neural'));
      beep(660, 0.1, 'square', 0.045);
      at(260, function () { dataStream(compact ? 0.3 : 0.6); });
      progressTo(66, compact ? 500 : 1400);
    });
    at(T.ready, function () {
      core.classList.remove('loading');
      lightCore(3);
      nuc.classList.add('on');
      title.classList.add('on');
      shock.classList.remove('go'); void shock.offsetWidth; shock.classList.add('go');
      readyChime();
      bootLog('<em>[ 00.04 ]</em> ENGINE READY · deepseek-chat <b>在线</b>');
      voiceLine(bootLine('ready'), 3000);
      speak(bootLine('ready'));
      progressTo(100, compact ? 350 : 900);
    });
    at(T.enter, enterMain);

    return done;
  }

  /* 首次交互解锁音频 */
  var unlocked = false;
  function unlockAudio() {
    if (unlocked) return;
    unlocked = true;
    var a = audioReady();
    if (a && a.state === 'suspended') { try { a.resume(); } catch (e) {} }
  }
  ['pointerdown', 'keydown', 'touchstart'].forEach(function (ev) {
    window.addEventListener(ev, unlockAudio, { once: true, passive: true });
  });

  window.HPBoot = {
    play: play,
    isPlaying: function () { return playing; }
  };
})();