(function(){
"use strict";
const form=document.getElementById("intelForm"),input=document.getElementById("intelInput");
form?.addEventListener("submit",e=>{e.preventDefault();const n=input.value.trim();if(!n){input.focus();return}const id=n.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");location.href="research.html?workspace="+encodeURIComponent(id)+"&company="+encodeURIComponent(n)});
})();