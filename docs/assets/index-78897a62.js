(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))n(e);new MutationObserver(e=>{for(const r of e)if(r.type==="childList")for(const m of r.addedNodes)m.tagName==="LINK"&&m.rel==="modulepreload"&&n(m)}).observe(document,{childList:!0,subtree:!0});function t(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerPolicy&&(r.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?r.credentials="include":e.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(e){if(e.ep)return;e.ep=!0;const r=t(e);fetch(e.href,r)}})();let f,i,l,d,o,h;const v=new Map,w=new Map;let c=new Map,[x,p]=[0,0],E,M=0,u="ready";function g(){l=window.innerWidth,d=window.innerHeight,[o,h]=[l/2,d/2],f&&(f.width=l,f.height=d)}class P{constructor(a){this.x=a*l,this.y=d,this.dx=(o-this.x)/19,this.dy=-h/19,this.status="alive"}update(a,t){this.x+=this.dx-a/2,this.y+=this.dy-t/2,this.dx*=.95,this.dy*=.95,i.beginPath(),i.moveTo(this.x,this.y),i.lineTo(this.x+this.dx,this.y+this.dy),i.stroke(),Math.abs(this.dx)<1&&(this.status="Dead")}}class L{constructor(){this.x=Math.random()*(l-100)+50,this.y=Math.random()*(d-100)+50,this.vx=Math.random()*Math.sign(o-this.x),this.vy=Math.random()*Math.sign(h-this.y),this.size=0,this.delay=10,this.status="alive"}update(a,t){this.x+=this.vx-a,this.y+=this.vy-t,this.status=="alive"?(y("0x1F47E",this.x,this.y,this.size,"center"),this.size+=.2,this.size>100&&([this.size,this.delay]=[this.size+5,this.delay-1])):this.status=="explosion"&&(y("0x1F4A5",this.x,this.y,this.size,"center"),this.size+=5,this.delay--),this.delay==0&&(this.status="Dead")}}class S{constructor(){this.x=Math.random()*l*2-o,this.y=Math.random()*d*2-h,this.speed=Math.random()*2+.1}update(a,t){this.x-=a*this.speed,this.y-=t*this.speed,(this.x<-o||this.x>l+o)&&(this.x=l-this.x),(this.y<-h||this.y>d+h)&&(this.y=d-this.y),i.fillStyle="white",i.fillRect(this.x,this.y,this.speed,this.speed)}}const O=()=>{f=document.getElementById("stage"),i=f.getContext("2d"),i.lineWidth=2,g(),window.addEventListener("resize",g),f.addEventListener("mouseleave",()=>[x,p]=[0,0]),f.addEventListener("mousemove",s=>{[x,p]=[(s.offsetX-o)/50,(s.offsetY-h)/50]}),f.addEventListener("click",()=>{u!="Play"&&T()});for(let s=0;s<200;s++)v.set(s,new S);z()},T=()=>{c.clear(),[E,M,u]=[Date.now(),0,"Play"]},z=()=>{i.fillStyle="black",i.fillRect(0,0,l,d),v.forEach(t=>t.update(x,p));let s=600-Math.floor((Date.now()-E)/100);s<=0&&(u="Retry");let a=!1;Math.floor(s)%20==0&&!c.has(s)&&(c.set(s,new L),c=new Map([...c].sort((t,n)=>t[0]-n[0]))),c.forEach((t,n)=>{t.update(x,p),Math.hypot(t.x-o,t.y-h)<t.size/3&&(a=!0),t.status=="Dead"&&c.delete(n)}),a&&u=="Play"&&w.set(s,new P(s%2)),w.forEach((t,n)=>{t.update(x,p),t.status=="Dead"&&w.delete(n),c.forEach(e=>{Math.hypot(t.x-e.x,t.y-e.y)<e.size/3&&e.status=="alive"&&(M+=10,e.status="explosion")})}),i.strokeStyle="cyan",a&&u=="play"&&(i.strokeStyle="red"),i.setLineDash([10,20,20,20,20,20,20,20,20,10]),i.strokeRect(o-20,h-20,40,40),u!="Play"&&(y("TIME UP!",o,h+40,20,"center"),s=600,u=="Retry"&&(y("TIME UP!",o,h-40,20,"center"),s=0)),y("SCORE : "+M,5,20),y("TIME : "+(s/10).toFixed(1),l-130,20),window.requestAnimationFrame(z)},y=(s,a,t,n=20,e="left")=>{let r=String(s);r.indexOf("0x")>-1&&(r=String.fromCodePoint(parseInt(r.substring(2),16))),i.font=`${n}px Arial Black`,i.textAlign=e,i.textBaseline="middle",i.fillStyle="white",i.fillText(r,a,t)};window.onload=O;
//# sourceMappingURL=index-78897a62.js.map
