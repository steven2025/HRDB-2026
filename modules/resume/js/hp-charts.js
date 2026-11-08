/* =====================================================================
 * hp-charts.js —— 零依赖 SVG 图表
 * 用途：ECharts CDN 不可达（内网 / 断网）时提供雷达、环形、柱线、折线四种图，
 * 保证企业概览与报告页在离线环境下依然有可视化（不引入新依赖）。
 * ===================================================================== */
(function () {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';

  function cssVar(name, fallback) {
    try {
      var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      return v || fallback;
    } catch (e) { return fallback; }
  }

  function el(tag, attrs, parent) {
    var node = document.createElementNS(NS, tag);
    Object.keys(attrs || {}).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    if (parent) parent.appendChild(node);
    return node;
  }

  function svgRoot(host) {
    host.innerHTML = '';
    var w = host.clientWidth || 360;
    var h = host.clientHeight || 240;
    var svg = el('svg', {
      viewBox: '0 0 ' + w + ' ' + h,
      width: '100%',
      height: '100%',
      preserveAspectRatio: 'xMidYMid meet',
      style: 'display:block'
    }, host);
    return { svg: svg, w: w, h: h };
  }

  function text(parent, x, y, str, opts) {
    opts = opts || {};
    var t = el('text', {
      x: x, y: y,
      fill: opts.color || cssVar('--text-3', '#8A97AC'),
      'font-size': opts.size || 11,
      'font-weight': opts.weight || 400,
      'text-anchor': opts.anchor || 'middle',
      'font-family': 'inherit'
    }, parent);
    t.textContent = str;
    return t;
  }

  function fmt(n) {
    if (n >= 10000) return (n / 10000).toFixed(0) + '万';
    return String(Math.round(n));
  }

  /** 雷达图：indicators [{name, value, max}] */
  function radar(host, indicators) {
    var r = svgRoot(host);
    var cx = r.w / 2;
    var cy = r.h / 2 + 6;
    var radius = Math.min(r.w, r.h) / 2 - 34;
    if (radius < 30) radius = 30;
    var n = indicators.length;
    var angle = function (i) { return (Math.PI * 2 * i) / n - Math.PI / 2; };

    for (var ring = 1; ring <= 4; ring++) {
      var pts = indicators.map(function (_, i) {
        var rr = (radius * ring) / 4;
        return [cx + Math.cos(angle(i)) * rr, cy + Math.sin(angle(i)) * rr].join(',');
      }).join(' ');
      el('polygon', {
        points: pts,
        fill: ring % 2 === 0 ? cssVar('--surface-2', '#F0F4FA') : 'none',
        stroke: cssVar('--border', '#E1E8F2'),
        'stroke-width': 1,
        opacity: ring % 2 === 0 ? 0.55 : 1
      }, r.svg);
    }

    indicators.forEach(function (ind, i) {
      var a = angle(i);
      el('line', {
        x1: cx, y1: cy,
        x2: cx + Math.cos(a) * radius, y2: cy + Math.sin(a) * radius,
        stroke: cssVar('--border', '#E1E8F2'), 'stroke-width': 1
      }, r.svg);
      var lx = cx + Math.cos(a) * (radius + 22);
      var ly = cy + Math.sin(a) * (radius + 20);
      text(r.svg, lx, ly + 4, ind.name, { size: 11, anchor: 'middle' });
    });

    var dataPts = indicators.map(function (ind, i) {
      var a = angle(i);
      var rr = (radius * Math.max(0, Math.min(100, ind.value))) / 100;
      return [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr].join(',');
    }).join(' ');
    el('polygon', {
      points: dataPts,
      fill: cssVar('--primary', '#2563EB'),
      'fill-opacity': 0.16,
      stroke: cssVar('--primary', '#2563EB'),
      'stroke-width': 2,
      'stroke-linejoin': 'round'
    }, r.svg);

    indicators.forEach(function (ind, i) {
      var a = angle(i);
      var rr = (radius * Math.max(0, Math.min(100, ind.value))) / 100;
      el('circle', {
        cx: cx + Math.cos(a) * rr, cy: cy + Math.sin(a) * rr, r: 3,
        fill: cssVar('--primary', '#2563EB')
      }, r.svg);
    });
  }

  /** 环形图：items [{name, value, color}] */
  function donut(host, items) {
    var r = svgRoot(host);
    var cx = r.w / 2;
    var cy = r.h / 2;
    var outer = Math.min(r.w, r.h) / 2 - 34;
    if (outer < 30) outer = 30;
    var inner = outer * 0.62;
    var total = items.reduce(function (s, x) { return s + x.value; }, 0) || 1;
    var start = -Math.PI / 2;

    items.forEach(function (it) {
      var sweep = (it.value / total) * Math.PI * 2;
      var end = start + sweep;
      var large = sweep > Math.PI ? 1 : 0;
      var p1 = [cx + Math.cos(start) * outer, cy + Math.sin(start) * outer];
      var p2 = [cx + Math.cos(end) * outer, cy + Math.sin(end) * outer];
      var p3 = [cx + Math.cos(end) * inner, cy + Math.sin(end) * inner];
      var p4 = [cx + Math.cos(start) * inner, cy + Math.sin(start) * inner];
      el('path', {
        d: 'M' + p1.join(' ') + ' A' + outer + ' ' + outer + ' 0 ' + large + ' 1 ' + p2.join(' ') +
          ' L' + p3.join(' ') + ' A' + inner + ' ' + inner + ' 0 ' + large + ' 0 ' + p4.join(' ') + ' Z',
        fill: it.color || cssVar('--primary', '#2563EB'),
        stroke: cssVar('--surface', '#fff'),
        'stroke-width': 2
      }, r.svg);
      start = end;
    });

    text(r.svg, cx, cy + 2, String(total), { size: 18, weight: 700, color: cssVar('--text', '#16233B') });
    text(r.svg, cx, cy + 18, '人在册', { size: 10.5 });

    var legendY = r.h - 10;
    var step = r.w / Math.max(1, items.length);
    items.forEach(function (it, i) {
      var x = step * i + step / 2;
      el('rect', {
        x: x - 26, y: legendY - 8, width: 8, height: 8, rx: 2,
        fill: it.color || cssVar('--primary', '#2563EB')
      }, r.svg);
      text(r.svg, x - 14, legendY, it.name + ' ' + it.value, { size: 10.5, anchor: 'start' });
    });
  }

  /** 柱线组合图：categories + bars[{name,data,color}] + line{name,data,color} */
  function bars(host, opt) {
    var r = svgRoot(host);
    var pad = { l: 40, r: 10, t: 26, b: 24 };
    var plotW = r.w - pad.l - pad.r;
    var plotH = r.h - pad.t - pad.b;
    var cats = opt.categories || [];
    var series = opt.series || [];
    var all = [];
    series.forEach(function (s) { all = all.concat(s.data); });
    if (opt.line) all = all.concat(opt.line.data);
    var max = Math.max.apply(null, all.concat([1])) * 1.15;

    for (var g = 0; g <= 3; g++) {
      var y = pad.t + (plotH * g) / 3;
      el('line', {
        x1: pad.l, y1: y, x2: pad.l + plotW, y2: y,
        stroke: cssVar('--border', '#E1E8F2'), 'stroke-width': 1
      }, r.svg);
      text(r.svg, pad.l - 6, y + 4, fmt(max * (1 - g / 3)), { size: 10, anchor: 'end' });
    }

    var groupW = plotW / Math.max(1, cats.length);
    var barW = Math.min(14, (groupW * 0.55) / Math.max(1, series.length));
    cats.forEach(function (c, i) {
      var gx = pad.l + groupW * i + groupW / 2;
      series.forEach(function (s, si) {
        var v = s.data[i] || 0;
        var hgt = (v / max) * plotH;
        var x = gx - (series.length * barW) / 2 + si * barW;
        el('rect', {
          x: x, y: pad.t + plotH - hgt, width: barW - 1.5, height: Math.max(1, hgt),
          rx: 3, fill: s.color || cssVar('--primary', '#2563EB')
        }, r.svg);
      });
      text(r.svg, gx, pad.t + plotH + 15, c, { size: 10.5 });
    });

    if (opt.line) {
      var pts = opt.line.data.map(function (v, i) {
        var x = pad.l + groupW * i + groupW / 2;
        var y = pad.t + plotH - (v / max) * plotH;
        return [x, y];
      });
      el('polyline', {
        points: pts.map(function (p) { return p.join(','); }).join(' '),
        fill: 'none',
        stroke: opt.line.color || cssVar('--gold', '#B45309'),
        'stroke-width': 2.2,
        'stroke-linejoin': 'round'
      }, r.svg);
      pts.forEach(function (p) {
        el('circle', { cx: p[0], cy: p[1], r: 2.8, fill: opt.line.color || cssVar('--gold', '#B45309') }, r.svg);
      });
    }

    var lx = pad.l;
    series.concat(opt.line ? [opt.line] : []).forEach(function (s) {
      el('rect', { x: lx, y: 6, width: 8, height: 8, rx: 2, fill: s.color || cssVar('--primary', '#2563EB') }, r.svg);
      text(r.svg, lx + 12, 14, s.name, { size: 10.5, anchor: 'start' });
      lx += 18 + String(s.name).length * 11;
    });
  }

  /** 多折线图 */
  function lines(host, opt) {
    var r = svgRoot(host);
    var pad = { l: 36, r: 12, t: 26, b: 24 };
    var plotW = r.w - pad.l - pad.r;
    var plotH = r.h - pad.t - pad.b;
    var cats = opt.categories || [];
    var series = opt.series || [];
    var all = [];
    series.forEach(function (s) { all = all.concat(s.data); });
    var max = Math.max.apply(null, all.concat([1])) * 1.2;

    for (var g = 0; g <= 3; g++) {
      var y = pad.t + (plotH * g) / 3;
      el('line', { x1: pad.l, y1: y, x2: pad.l + plotW, y2: y, stroke: cssVar('--border', '#E1E8F2') }, r.svg);
      text(r.svg, pad.l - 6, y + 4, fmt(max * (1 - g / 3)), { size: 10, anchor: 'end' });
    }

    var step = plotW / Math.max(1, cats.length - 1);
    cats.forEach(function (c, i) {
      text(r.svg, pad.l + step * i, pad.t + plotH + 15, c, { size: 10.5 });
    });

    series.forEach(function (s) {
      var pts = s.data.map(function (v, i) {
        return [pad.l + step * i, pad.t + plotH - (v / max) * plotH];
      });
      el('polyline', {
        points: pts.map(function (p) { return p.join(','); }).join(' '),
        fill: 'none',
        stroke: s.color || cssVar('--primary', '#2563EB'),
        'stroke-width': 2.2,
        'stroke-linejoin': 'round'
      }, r.svg);
      pts.forEach(function (p) {
        el('circle', { cx: p[0], cy: p[1], r: 2.6, fill: s.color || cssVar('--primary', '#2563EB') }, r.svg);
      });
    });

    var lx = pad.l;
    series.forEach(function (s) {
      el('rect', { x: lx, y: 6, width: 8, height: 8, rx: 2, fill: s.color || cssVar('--primary', '#2563EB') }, r.svg);
      text(r.svg, lx + 12, 14, s.name, { size: 10.5, anchor: 'start' });
      lx += 18 + String(s.name).length * 11;
    });
  }

  window.HPCharts = { radar: radar, donut: donut, bars: bars, lines: lines, available: true };
})();
