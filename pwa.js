(function(){
 'use strict';
 if(window.self!==window.top)return;
 if(!('serviceWorker' in navigator)||!window.isSecureContext)return;
 var installed=window.matchMedia('(display-mode: standalone)').matches||navigator.standalone;
 var deferred=null,updateWorker=null;
 var box=document.createElement('div');
 box.style.cssText='position:fixed;right:14px;bottom:70px;z-index:9999;display:flex;gap:7px;align-items:center;max-width:calc(100vw - 28px)';
 function button(text){var b=document.createElement('button');b.type='button';b.textContent=text;b.style.cssText='font:600 13px/1.4 system-ui;padding:9px 13px;border:1px solid #60b8ca;border-radius:10px;background:#0a2634;color:#f0d59c;box-shadow:0 3px 15px #0002;cursor:pointer';box.appendChild(b);return b;}
 document.body.appendChild(box);
 var install=button('安装到桌面');install.hidden=!!installed;
 install.onclick=async function(){
  if(deferred){var prompt=deferred;deferred=null;await prompt.prompt();var choice=await prompt.userChoice;if(choice.outcome==='accepted')install.hidden=true;return;}
  var ios=/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  alert(ios?'请在 Safari 中打开本站，点击“分享”，选择“添加到主屏幕”。':'请在 Chrome 或 Edge 中打开本站，使用地址栏安装图标，或浏览器菜单中的“安装应用 / 将此网站作为应用安装”。若暂未出现，请刷新后稍候再试。');
 };
 window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();deferred=e;if(!installed)install.hidden=false;});
 window.addEventListener('appinstalled',function(){installed=true;deferred=null;install.hidden=true;});
 var update=button('更新应用');update.hidden=true;
 update.onclick=function(){if(updateWorker)updateWorker.postMessage({type:'ACTIVATE_UPDATE'});};
 var refreshing=false;
 navigator.serviceWorker.addEventListener('controllerchange',function(){if(refreshing||!updateWorker)return;refreshing=true;location.reload();});
 function offer(worker){if(!navigator.serviceWorker.controller)return;updateWorker=worker;update.hidden=false;}
 navigator.serviceWorker.register(new URL('sw.js',document.baseURI),{scope:'./',updateViaCache:'none'}).then(function(reg){
  if(reg.waiting)offer(reg.waiting);
  reg.addEventListener('updatefound',function(){var worker=reg.installing;if(worker)worker.addEventListener('statechange',function(){if(worker.state==='installed')offer(worker);});});
 }).catch(function(err){console.warn('PWA 注册失败',err);});
})();
