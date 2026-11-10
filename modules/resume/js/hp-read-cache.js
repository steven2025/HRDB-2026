/* Private, current-page-only read cache. No resume data is written to web storage. */
(function(){
  'use strict';
  if(window.HPReadCache||!window.fetch||typeof Response==='undefined')return;
  var original=window.fetch,entries=new Map(),pending=new Map(),epoch=0,current='',LIMIT=80;
  var policies={
    '/api/company/jobs':[60000,300000],
    '/api/company/resumes':[60000,180000],
    '/api/pool':[30000,120000],
    '/api/pool/resume':[120000,300000],
    '/api/jobs/analysis/list':[30000,120000],
    '/api/jobs/analysis':[30000,120000],
    '/api/jobs/ledger':[30000,120000],
    '/api/report/pool':[30000,120000]
  };
  function token(){try{return sessionStorage.getItem('hp-token')||localStorage.getItem('hp-token')||'';}catch(e){return '';}}
  function context(){
    var role='',lang='zh';try{role=localStorage.getItem('hp-role')||'';lang=(window.HPI18N&&window.HPI18N.lang&&window.HPI18N.lang())||localStorage.getItem('hp-lang')||'zh';}catch(e){}
    return token()+'|'+role+'|'+lang;
  }
  function clear(){epoch++;entries.clear();pending.clear();}
  function sync(){var next=context();if(next!==current){clear();current=next;}return next;}
  function parse(input){
    var raw=typeof input==='string'?input:(input&&input.url)||'';
    try{
      var url=new URL(raw,location.href),base=new URL(window.HP_API_BASE||location.origin,location.href);
      if(raw.indexOf('/api/')===0)url=new URL(raw,base.origin);
      if(url.origin!==base.origin||url.pathname.indexOf('/api/')!==0)return null;
      url.searchParams.sort();
      return {path:url.pathname,query:url.searchParams.toString(),url:url};
    }catch(e){return null;}
  }
  function remember(key,value){entries.delete(key);entries.set(key,value);while(entries.size>LIMIT)entries.delete(entries.keys().next().value);}
  function valid(path,data){
    if(path==='/api/pool')return !!data&&Array.isArray(data.items);
    if(path==='/api/pool/resume')return !!data&&data.ok===true&&Array.isArray(data.pages)&&data.pages.every(function(p){return p&&Array.isArray(p.rows);});
    if(path==='/api/company/jobs')return !!data&&(Array.isArray(data.jobs)||Array.isArray(data.items));
    return data!==null&&typeof data==='object';
  }
  function cloned(entry,kind){var h=new Headers(entry.headers);h.set('x-hp-read-cache',kind);return new Response(entry.body,{status:entry.status,statusText:entry.statusText,headers:h});}
  function subscribe(promise,signal){
    if(!signal)return promise.then(function(entry){return cloned(entry,'network');});
    return new Promise(function(resolve,reject){
      var finished=false;
      function abort(){if(finished)return;finished=true;signal.removeEventListener('abort',abort);var e=new Error('Request aborted');e.name='AbortError';reject(e);}
      if(signal.aborted){abort();return;}
      signal.addEventListener('abort',abort,{once:true});
      promise.then(function(entry){if(finished)return;finished=true;signal.removeEventListener('abort',abort);resolve(cloned(entry,'network'));},function(err){if(finished)return;finished=true;signal.removeEventListener('abort',abort);reject(err);});
    });
  }
  function announce(meta,error){try{document.dispatchEvent(new CustomEvent('hp:read-cache-update',{detail:{path:meta.path,query:meta.query,error:error||null}}));}catch(e){}}
  window.fetch=function(input,init){
    var opts=Object.assign({},init||{}),meta=parse(input),method=String(opts.method||(input&&input.method)||'GET').toUpperCase();
    if(!meta)return original.apply(this,arguments);
    var scope=sync();
    if(method!=='GET')return original.call(this,input,opts).then(function(res){if(res.ok&&method!=='HEAD'&&method!=='OPTIONS')clear();if(res.status===401||res.status===403)clear();return res;});
    if(init&&init.signal&&init.signal.aborted){var aborted=new Error('Request aborted');aborted.name='AbortError';return Promise.reject(aborted);}
    var auth=new Headers(opts.headers||{}).get('authorization');
    if(auth&&auth!=='Bearer '+token())return original.call(this,input,opts);
    var policy=policies[meta.path];
    if(!policy||!token()||typeof input!=='string')return original.call(this,input,opts);
    var key=scope+'|'+meta.path+'?'+meta.query,existing=entries.get(key),age=existing?Date.now()-existing.at:Infinity;
    var reload=opts.hpCacheMode==='reload',allowStale=opts.hpCacheMode==='stale';
    delete opts.hpCacheMode;
    if(existing&&!reload&&age<policy[0])return Promise.resolve(cloned(existing,'fresh'));
    var promise=pending.get(key);
    if(!promise){
      var generation=epoch,requestScope=scope,previous=existing;
      var controller=typeof AbortController!=='undefined'?new AbortController():null;
      var timer=setTimeout(function(){if(controller)controller.abort();},45000);
      // A subscriber's cancellation must not abort another module's shared request.
      delete opts.signal;if(controller)opts.signal=controller.signal;
      promise=Promise.resolve().then(function(){return original.call(window,input,opts);}).then(function(res){
        return res.text().then(function(body){
          var entry={body:body,status:res.status,statusText:res.statusText,headers:Array.from(res.headers.entries()),at:Date.now()};
          if(res.status===401||res.status===403){clear();return entry;}
          var data=null;try{data=JSON.parse(body);}catch(e){}
          if(res.ok&&valid(meta.path,data)&&generation===epoch&&context()===requestScope){
            remember(key,entry);if(previous)announce(meta);
          }
          if(res.ok&&!valid(meta.path,data)&&previous&&generation===epoch&&context()===requestScope)announce(meta,'INVALID_RESPONSE');
          return entry;
        });
      }).finally(function(){clearTimeout(timer);if(pending.get(key)===promise)pending.delete(key);});
      pending.set(key,promise);
    }
    if(existing&&!reload&&allowStale&&age<policy[1]){
      promise.then(function(entry){if(entry.status>=400&&context()===scope)announce(meta,'HTTP '+entry.status);},function(){if(context()===scope)announce(meta,'NETWORK_ERROR');});
      return Promise.resolve(cloned(existing,'stale'));
    }
    return subscribe(promise,init&&init.signal);
  };
  window.HPReadCache={invalidate:clear,stats:function(){return {entries:entries.size,pending:pending.size};}};
  document.addEventListener('hp:weights',clear);
  window.addEventListener('storage',function(e){if(e.key==='hp-token'||e.key==='hp-role'||e.key==='hp-lang')sync();});
})();
