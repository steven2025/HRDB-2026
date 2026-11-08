(function(){"use strict";
const names={recruit:'智能简历匹配',interview:'多语言AI面试',compliance:'合规签约'};
document.querySelectorAll('[data-module]').forEach(el=>{
 const id=el.dataset.module;if(!names[id])return;
 el.setAttribute('aria-label','打开'+names[id]);
 const open=()=>{location.href='module.html?module='+encodeURIComponent(id);};
 el.addEventListener('click',open);
 if(el.tagName.toLowerCase()==='g')el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}});
});
})();
