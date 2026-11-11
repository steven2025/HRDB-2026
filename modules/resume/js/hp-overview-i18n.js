/* Scoped overview labels. Immutable originals prevent repeated translation drift. */
(function(){
 'use strict';
 var originals=new WeakMap(),last=new WeakMap(),timer=0;
 function sweep(){
  timer=0;var api=window.HPI18N;if(!api||!api.lang||!api.t)return;
  var lang=api.lang();
  document.querySelectorAll('.view[data-view="overview"] .k-label,.view[data-view="overview"] .k-foot,.view[data-view="overview"] .card-title,.view[data-view="overview"] .page-head h1,.view[data-view="overview"] .page-head .desc').forEach(function(el){
   if(el.closest('[data-i18n-skip],.brand-name,.u-name,.mt-f-name'))return;
   Array.prototype.forEach.call(el.childNodes,function(node){
    if(node.nodeType!==3)return;
    var value=node.nodeValue||'',source=originals.get(node);
    if(source===undefined||value!==last.get(node)){
     if(!/[\u4e00-\u9fff]/.test(value))return;
     source=value;originals.set(node,source);
    }
    var key=source.trim();if(!key||key.length>150)return;
    var translated=lang==='zh'?key:(api.t(key)||key),next=source.replace(key,translated);
    last.set(node,next);if(value!==next)node.nodeValue=next;
   });
  });
 }
 function schedule(){if(!timer)timer=setTimeout(sweep,80);}
 document.addEventListener('hp:lang',schedule);
 document.addEventListener('hp:data',schedule);
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule);else schedule();
 if(window.MutationObserver){var observer=new MutationObserver(schedule);observer.observe(document.body,{childList:true,subtree:true,characterData:true});}
})();
