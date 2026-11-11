/* 图表文字翻译：ECharts/原生 Canvas 的坐标轴、图例、雷达标签。 */
(function () {
  'use strict';
  if (!window.CanvasRenderingContext2D) return;
  var proto = window.CanvasRenderingContext2D.prototype;
  ['fillText', 'strokeText'].forEach(function (name) {
    var orig = proto[name];
    if (!orig || orig.__hpWrapped) return;
    var wrapped = function (text, x, y, maxWidth) {
      try {
        if (window.HPI18N && HPI18N.lang && HPI18N.lang() !== 'zh' && typeof text === 'string' && text.trim()) {
          var v = HPI18N.t(text);
          if (v && v !== text) text = v;
        }
      } catch (e) {}
      return maxWidth === undefined ? orig.call(this, text, x, y) : orig.call(this, text, x, y, maxWidth);
    };
    wrapped.__hpWrapped = true;
    proto[name] = wrapped;
  });
})();
