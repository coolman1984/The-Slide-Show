'use strict';
/*
 * CLIENT RUNTIME — the JavaScript injected into every built deck.
 * Handles navigation, chrome, entrance replay, viewport scaling, and the
 * ambient background (waves / grid canvas, orbs are CSS-only).
 * CONFIG is serialized per-deck by build.js.
 */

function buildRuntime(config) {
  return `
'use strict';
const CFG = ${JSON.stringify(config)};

/* ---------- ambient background canvas ---------- */
const cvs = document.getElementById('fx'), ctx = cvs ? cvs.getContext('2d') : null;
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
let dots = [], phase = 0, raf = null;
const lerp = (a,b,t)=>a+(b-a)*t;

function seedDots(){
  dots = [];
  if(CFG.bg === 'waves'){
    for(let k=0;k<22;k++){
      const yb = 1076 - k*13;
      for(let x=-40;x<840-k*8;x+=13+Math.random()*6){
        dots.push({x, y:yb+Math.sin(x*0.006+k*0.55)*14, amp:5+k*0.25, ph:x*0.012+k*0.7,
                   r:0.7+Math.random()*1.1, t:Math.random(), a:0.13+Math.random()*0.55*(1-k/26)});
      }
    }
    for(let k=0;k<26;k++){
      for(let x=1030;x<1935;x+=12+Math.random()*6){
        const yb = 1090 - k*15 - (x-1030)*0.17 + Math.sin(x*0.004+k)*15;
        if(yb<560) continue;
        dots.push({x, y:yb, amp:6, ph:x*0.01+k*0.5,
                   r:0.7+Math.random()*1.2, t:Math.random(), a:0.11+Math.random()*0.6*(1-k/30)});
      }
    }
    for(let k=0;k<8;k++){
      for(let x=1350;x<1950;x+=16+Math.random()*8){
        const yb = 34 + k*12 + (x-1350)*0.16 + Math.sin(x*0.008+k*0.9)*8;
        dots.push({x, y:yb, amp:3, ph:x*0.01+k, r:0.6+Math.random(), t:Math.random(), a:0.07+Math.random()*0.32});
      }
    }
  } else if(CFG.bg === 'grid'){
    for(let gy=0;gy<28;gy++){
      for(let gx=0;gx<50;gx++){
        dots.push({x:gx*40-10, y:gy*40-10, amp:4, ph:(gx+gy)*0.35,
                   r:0.9+Math.random()*0.7, t:(gx/50+gy/28)/2, a:0.05+0.22*Math.abs(Math.sin(gx*0.4+gy*0.6))});
      }
    }
  }
}
function paint(){
  if(!ctx) return;
  ctx.clearRect(0,0,1920,1080);
  const F = CFG.pFrom, T = CFG.pTo;
  for(const d of dots){
    const y = d.y + Math.sin(phase + d.ph) * d.amp;
    ctx.fillStyle = 'rgba(' + (lerp(F[0],T[0],d.t)|0) + ',' + (lerp(F[1],T[1],d.t)|0) + ',' + (lerp(F[2],T[2],d.t)|0) + ',' + d.a + ')';
    ctx.beginPath(); ctx.arc(d.x, y, d.r, 0, 6.2832); ctx.fill();
  }
}
function tick(){ phase += 0.016; paint(); raf = requestAnimationFrame(tick); }
function fxResume(){ if(!ctx || !dots.length) return; if(REDUCED){ paint(); return; } if(!raf) raf = requestAnimationFrame(tick); }
function fxPause(){ if(raf){ cancelAnimationFrame(raf); raf = null; } }
seedDots(); paint();

/* ---------- navigation ---------- */
const stage   = document.getElementById('stage');
const slides  = [...document.querySelectorAll('.slide')];
const chrome_ = document.getElementById('chrome');
const dotsBox = document.getElementById('dots');
const counter = document.getElementById('counter');
const hairbar = document.querySelector('#hair i');
const toast   = document.getElementById('toast');
let cur = -1, cleanupTimer = null, autoplayTimer = null;

slides.forEach((_,i)=>{
  const d = document.createElement('span');
  d.className = 'dot'; d.addEventListener('click', ()=>{ stopAutoplay(); goTo(i); });
  dotsBox.appendChild(d);
});
const dotEls = [...dotsBox.children];

function goTo(i, dir){
  i = Math.max(0, Math.min(slides.length-1, i));
  if(i === cur) return;
  dir = dir || (i > cur ? 1 : -1);
  stage.style.setProperty('--dir', dir);
  clearTimeout(cleanupTimer);
  slides.forEach(s=>s.classList.remove('leaving'));
  if(cur >= 0){
    const old = slides[cur];
    old.classList.remove('active','play');
    old.classList.add('leaving');
    cleanupTimer = setTimeout(()=>old.classList.remove('leaving'), 600);
  }
  cur = i;
  const s = slides[cur];
  s.classList.add('active');
  requestAnimationFrame(()=>requestAnimationFrame(()=>s.classList.add('play')));
  dotEls.forEach((d,k)=>d.classList.toggle('on', k===cur));
  counter.textContent = (cur+1) + ' / ' + slides.length;
  hairbar.style.width = (((cur+1)/slides.length)*100) + '%';
  chrome_.classList.toggle('lite', s.dataset.mode === 'light');
  s.classList.contains('opaque') ? fxPause() : fxResume();
}
const next = ()=>goTo(cur >= slides.length-1 ? (autoplayTimer ? 0 : cur) : cur+1, 1);
const prev = ()=>goTo(cur-1, -1);

addEventListener('keydown', e=>{
  const k = e.key;
  if(k==='ArrowRight' || k===' ' || k==='PageDown'){ stopAutoplay(); next(); }
  else if(k==='ArrowLeft' || k==='PageUp'){ stopAutoplay(); prev(); }
  else if(k==='Home'){ stopAutoplay(); goTo(0); }
  else if(k==='End'){ stopAutoplay(); goTo(slides.length-1); }
  else if(/^[1-9]$/.test(k) && +k <= slides.length){ stopAutoplay(); goTo(+k-1); }
  else if(k==='f' || k==='F'){ toggleFullscreen(); }
  else if(k==='p' || k==='P'){ toggleAutoplay(); }
  else return;
  wake();
});
addEventListener('click', e=>{
  if(e.target.closest('#chrome')) return;
  const x = e.clientX / innerWidth;
  if(x > 0.8){ stopAutoplay(); next(); }
  else if(x < 0.2){ stopAutoplay(); prev(); }
});
document.getElementById('next').addEventListener('click', e=>{ e.stopPropagation(); stopAutoplay(); next(); });
document.getElementById('prev').addEventListener('click', e=>{ e.stopPropagation(); stopAutoplay(); prev(); });
let tx0 = null;
addEventListener('touchstart', e=>{ tx0 = e.touches[0].clientX; }, {passive:true});
addEventListener('touchend', e=>{
  if(tx0===null) return;
  const dx = e.changedTouches[0].clientX - tx0; tx0 = null;
  if(Math.abs(dx) >= 50){ stopAutoplay(); dx < 0 ? next() : prev(); wake(); }
}, {passive:true});

function toggleFullscreen(){
  document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
}
function showToast(msg, ms){
  toast.innerHTML = msg; toast.classList.add('show');
  clearTimeout(showToast.t); showToast.t = setTimeout(()=>toast.classList.remove('show'), ms);
}
function toggleAutoplay(){
  if(autoplayTimer){ stopAutoplay(); showToast('Autoplay off', 1600); }
  else{ autoplayTimer = setInterval(next, CFG.autoplayMs); showToast('Autoplay on &nbsp;&middot;&nbsp; every ' + (CFG.autoplayMs/1000) + 's', 1600); }
}
function stopAutoplay(){ if(autoplayTimer){ clearInterval(autoplayTimer); autoplayTimer = null; } }

let idleTimer = null;
function wake(){
  chrome_.classList.remove('hid');
  clearTimeout(idleTimer);
  idleTimer = setTimeout(()=>chrome_.classList.add('hid'), 3000);
}
addEventListener('mousemove', wake);
wake();

function fit(){
  const k = Math.min(innerWidth/1920, innerHeight/1080);
  stage.style.transform = 'translate(-50%,-50%) scale(' + k + ')';
}
addEventListener('resize', fit); fit();

document.addEventListener('visibilitychange', ()=>{
  if(document.hidden) fxPause();
  else if(cur>=0 && !slides[cur].classList.contains('opaque')) fxResume();
});

goTo(0, 1);
setTimeout(()=>toast.classList.add('show'), 600);
setTimeout(()=>toast.classList.remove('show'), 4600);
`;
}

module.exports = { buildRuntime };
