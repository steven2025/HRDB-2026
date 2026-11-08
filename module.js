(function(){"use strict";
const modules={recruit:{name:'智能简历匹配',url:'modules/resume/index.html'},interview:{name:'多语言AI面试',url:'https://steven2025.github.io/haiwai/'},compliance:{name:'合规签约',url:'heguiqianyue.html'}};
const id=new URLSearchParams(location.search).get('module'),item=modules[id];
if(!item){location.replace('platform.html');return;}
document.title=item.name+' · 全球劳务外派智能平台';
document.getElementById('moduleName').textContent=item.name;
document.getElementById('moduleFrame').title=item.name;
document.getElementById('moduleFrame').src=item.url;
document.getElementById('external').href=item.url;
if(id==='interview')document.getElementById('moduleHint').textContent='左上角可返回主页。若外部站点限制嵌入，或摄像头、麦克风不可用，请点“新窗口打开”；关闭新窗口后仍可返回这里。';
})();