(function(){
  const cfgPath="data/public/analytics-config.json";
  async function boot(){
    try{
      const r=await fetch(cfgPath,{cache:"no-store"}); if(!r.ok)return;
      const c=await r.json(); const id=String(c.measurement_id||"").trim();
      if(!c.enabled || !/^G-[A-Z0-9]+$/i.test(id)) return;
      if(window.__pirepointGA4Loaded)return; window.__pirepointGA4Loaded=true;
      window.dataLayer=window.dataLayer||[];
      window.gtag=function(){window.dataLayer.push(arguments)};
      window.gtag("js",new Date()); window.gtag("config",id,{send_page_view:true});
      const s=document.createElement("script"); s.async=true; s.src="https://www.googletagmanager.com/gtag/js?id="+encodeURIComponent(id); document.head.appendChild(s);
    }catch(e){console.warn("Analytics bootstrap unavailable",e)}
  }
  boot();
})();
