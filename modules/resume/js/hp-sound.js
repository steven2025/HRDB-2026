/* =====================================================================
 * hp-sound.js —— 科技感音效 + 机械音播报
 *  - 纯 WebAudio 合成音效（不依赖任何音频文件，离线可用）
 *  - Web Speech API 播报固定话术（语速/音调调成机械感）
 *  - 默认关闭，需用户手动开启（浏览器自动播放策略 + 演示场合需要安静）
 * ===================================================================== */
(function () {
  'use strict';

  var KEY = 'hp-sound';
  // 默认开启（演示场景）；用户手动关掉后由 localStorage 记住 '0'
  var enabled = true;
  try { var saved = localStorage.getItem(KEY); if (saved !== null) enabled = saved === '1'; } catch (e) {}

  var ctx = null;
  function ac() {
    if (!ctx) {
      var C = window.AudioContext || window.webkitAudioContext;
      if (!C) return null;
      ctx = new C();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  /* ---------- 基础音块 ---------- */
  function tone(freq, dur, type, gain, slideTo) {
    var a = ac(); if (!a) return;
    var o = a.createOscillator();
    var g = a.createGain();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(freq, a.currentTime);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, a.currentTime + dur);
    g.gain.setValueAtTime(0, a.currentTime);
    g.gain.linearRampToValueAtTime(gain || 0.14, a.currentTime + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + dur);
    o.connect(g); g.connect(a.destination);
    o.start(); o.stop(a.currentTime + dur + 0.02);
  }

  function noise(dur, gain, freq) {
    var a = ac(); if (!a) return;
    var len = Math.floor(a.sampleRate * dur);
    var buf = a.createBuffer(1, len, a.sampleRate);
    var ch = buf.getChannelData(0);
    for (var i = 0; i < len; i++) ch[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2);
    var src = a.createBufferSource(); src.buffer = buf;
    var f = a.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = freq || 1400; f.Q.value = 1.2;
    var g = a.createGain(); g.gain.value = gain || 0.08;
    src.connect(f); f.connect(g); g.connect(a.destination);
    src.start();
  }

  /* ---------- 音效库 ---------- */
  var SFX = {
    /** 启动扫描：低频嗡鸣 + 上扬扫频 */
    boot: function () {
      tone(70, 1.1, 'sawtooth', 0.05, 220);
      tone(320, 1.2, 'sine', 0.07, 1180);
      noise(0.9, 0.05, 1200);
    },
    /** 数据流：短促高频滴滴 */
    tick: function () { tone(1560, 0.05, 'square', 0.035); },
    /** 单步完成 */
    step: function () { tone(880, 0.09, 'triangle', 0.06, 1320); },
    /** 分析完成：三音上行「叮咚」 */
    done: function () {
      tone(784, 0.16, 'sine', 0.1);
      setTimeout(function () { tone(1046, 0.16, 'sine', 0.1); }, 130);
      setTimeout(function () { tone(1568, 0.5, 'sine', 0.12); }, 270);
    },
    /** 投递/提交成功 */
    success: function () {
      tone(660, 0.1, 'triangle', 0.09);
      setTimeout(function () { tone(990, 0.22, 'triangle', 0.09); }, 100);
    },
    /** 警告 / 风险 */
    warn: function () { tone(300, 0.22, 'square', 0.07, 180); },
    /** 界面点击 */
    click: function () { tone(1200, 0.035, 'square', 0.03); },
    /** 分数炸开 */
    burst: function () {
      noise(0.35, 0.09, 2200);
      tone(160, 0.4, 'sawtooth', 0.06, 640);
    }
  };

  /* ---------- 机械音播报 ---------- */
  var VOICE = null;

  /** 当前界面语言 */
  function curLang() {
    if (window.HPI18N && window.HPI18N.lang) {
      try { return window.HPI18N.lang() || 'zh'; } catch (e) {}
    }
    try { return localStorage.getItem('hp-lang') || 'zh'; } catch (e) { return 'zh'; }
  }

  /* 语言 → BCP-47 + 语音名匹配 */
  var LANG_TAG = {
    zh: { tag: 'zh-CN', re: /^zh|cmn|Chinese|中文|普通话/i },
    en: { tag: 'en-US', re: /^en|English/i },
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

  /** 按当前语言挑选语音；找不到对应语音时返回 null（交给浏览器按 lang 处理） */
  function pickVoice(lang) {
    if (!window.speechSynthesis) return null;
    var vs = window.speechSynthesis.getVoices() || [];
    if (!vs.length) return null;
    var L = LANG_TAG[lang || curLang()] || LANG_TAG.zh;
    return vs.find(function (v) { return L.re.test(v.lang) || L.re.test(v.name); }) || null;
  }

  function refreshVoice() { VOICE = pickVoice(curLang()); }

  if (window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = refreshVoice;
    refreshVoice();
    /* 切换语言后重新挑选语音 */
    document.addEventListener('hp:lang', refreshVoice);
  }

  function smoothSpeech(text) {
    return String(text || '').replace(/\s+/g, ' ').trim();
  }

  function say(text, opts) {
    if (!enabled || !window.speechSynthesis || !text) return;
    opts = opts || {};
    text = smoothSpeech(text);
    try {
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      var lang = curLang();
      /* 每次播报都按当前语言重新取语音，避免语言切换后仍用旧语音 */
      var v = pickVoice(lang);
      if (v) { u.voice = v; u.lang = v.lang; }
      else { u.lang = opts.lang || (LANG_TAG[lang] || LANG_TAG.zh).tag; }
      u.rate = opts.rate || 1.12;    // 略快 → 机械播报感
      u.pitch = opts.pitch || 0.82;  // 略低 → 冷峻
      u.volume = opts.volume || 0.9;
      window.speechSynthesis.speak(u);
    } catch (e) {}
  }

  /* ---------- 开关 ---------- */
  function set(on) {
    enabled = !!on;
    try { localStorage.setItem(KEY, enabled ? '1' : '0'); } catch (e) {}
    if (!enabled && window.speechSynthesis) { try { window.speechSynthesis.cancel(); } catch (e) {} }
    paint();
    if (enabled) { ac(); SFX.click(); say('声音已开启'); }
    return enabled;
  }

  function paint() {
    var btn = document.getElementById('hpSoundBtn');
    if (!btn) return;
    btn.textContent = enabled ? '🔊' : '🔇';
    btn.title = enabled ? '声音已开启（点击关闭）' : '声音已关闭（点击开启）';
    btn.classList.toggle('on', enabled);
  }

  function mountBtn() {
    if (document.getElementById('hpSoundBtn')) return;
    var bar = document.querySelector('.topbar');
    if (!bar) return;
    var b = document.createElement('button');
    b.id = 'hpSoundBtn';
    b.className = 'hp-snd';
    b.type = 'button';
    b.addEventListener('click', function () { set(!enabled); });
    // 锚定稳定存在的 #themeBtn（#hpLangSel 由 hp-i18n.js 运行时注入，时序不可靠）
    var anchor = document.getElementById('themeBtn');
    if (anchor && anchor.parentNode === bar) bar.insertBefore(b, anchor);
    else bar.appendChild(b);
    paint();
  }

  document.addEventListener('DOMContentLoaded', function () {
    mountBtn();
    /* 首次用户交互后解锁音频：AudioContext 与 speechSynthesis 都需要手势 */
    var unlock = function () {
      ac();
      // 用一段空播报「解锁」语音通道，避免首句被浏览器静默丢弃
      try {
        if (window.speechSynthesis && enabled) {
          var u = new SpeechSynthesisUtterance(' ');
          u.volume = 0;
          window.speechSynthesis.speak(u);
        }
      } catch (e) {}
      document.removeEventListener('click', unlock);
      document.removeEventListener('keydown', unlock);
    };
    document.addEventListener('click', unlock);
    document.addEventListener('keydown', unlock);
  });

  window.HPSound = {
    on: function () { return enabled; },
    set: set,
    sfx: function (name) { if (!enabled) return; var f = SFX[name]; if (f) { try { f(); } catch (e) {} } },
    say: say,
    /** 一站式：音效 + 播报 */
    cue: function (name, text, opts) {
      if (!enabled) return;
      window.HPSound.sfx(name);
      if (text) setTimeout(function () { say(text, opts); }, opts && opts.delay ? opts.delay : 120);
    }
  };
})();