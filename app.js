{
const env=document.getElementById('env'),mus=document.getElementById('mus'),photo=document.getElementById('photo');

// venue photo, loaded in small parts
const mi=document.querySelector('.map img');
const ld=i=>{if(i>4){if(window.VB&&mi){mi.src='data:image/jpeg;base64,'+window.VB;mi.parentElement.style.aspectRatio='3/2'}return}const s=document.createElement('script');s.src='v'+i+'.js';s.onload=()=>ld(i+1);document.head.appendChild(s)};
ld(1);

// background music: song4 only (no generated fallback)
const song=new Audio('song4.mp3?v=7');song.loop=true;song.preload='auto';song.setAttribute('playsinline','');
let songOn=false;
const W=()=>document.getElementById('w');
const play=()=>{const p=song.play();if(p&&p.then){p.then(()=>{songOn=true;W().style.opacity=1}).catch(()=>{songOn=false;retry()})}else{songOn=true}};
const retry=()=>{const f=()=>{['touchend','click'].forEach(e=>window.removeEventListener(e,f,true));if(!songOn)play()};['touchend','click'].forEach(e=>window.addEventListener(e,f,true))};
const stop=()=>{song.pause();songOn=false;W().style.opacity=.2};
mus.hidden=false;
mus.addEventListener('click',()=>{try{songOn?stop():play()}catch(e){}});

// gentle auto scroll to the very end; pauses while the guest touches, then carries on
document.documentElement.style.scrollBehavior='auto';
let autoOn=false,started=false,lastT=0,acc=0,rt=null;
const atEnd=()=>window.innerHeight+window.scrollY>=document.documentElement.scrollHeight-2;
const stepScroll=t=>{
if(!autoOn)return;
if(lastT){acc+=Math.min(t-lastT,60)*0.05;const px=Math.floor(acc);if(px>0){window.scrollTo(0,window.scrollY+px);acc-=px}}
lastT=t;
if(atEnd()){autoOn=false;return}
requestAnimationFrame(stepScroll);
};
const resume=()=>{if(!started||atEnd())return;autoOn=true;lastT=0;requestAnimationFrame(stepScroll)};
const halt=()=>{if(!started)return;autoOn=false;clearTimeout(rt);rt=setTimeout(resume,3500)};
['wheel','touchstart','touchmove','keydown','mousedown'].forEach(ev=>window.addEventListener(ev,halt,{passive:true}));
const auto=()=>{started=true;resume()};
const open=()=>{
if(env.classList.contains('open'))return;
env.classList.add('open');try{play()}catch(e){}
setTimeout(()=>{env.classList.add('gone');document.body.classList.remove('locked');setTimeout(auto,2500)},1500);
};
env.addEventListener('click',open);
env.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}});

const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.rv').forEach(x=>io.observe(x));

const target=Date.parse('2026-12-04T17:00:00+02:00');
const pad=n=>String(n).padStart(2,'0'),$=id=>document.getElementById(id);
const tick=()=>{
let t=Math.max(0,target-Date.now());
const d=Math.floor(t/864e5);t%=864e5;const h=Math.floor(t/36e5);t%=36e5;
$('d').textContent=pad(d);$('h').textContent=pad(h);$('m').textContent=pad(Math.floor(t/6e4));$('s').textContent=pad(Math.floor(t%6e4/1e3));
};
tick();setInterval(tick,1000);
}
