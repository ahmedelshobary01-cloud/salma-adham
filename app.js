{
const env=document.getElementById('env'),song=document.getElementById('song'),mus=document.getElementById('mus');
const hasSong=song.getAttribute('src')&&!song.getAttribute('src').startsWith('__');
if(hasSong)mus.hidden=false;
const play=()=>{if(hasSong){const p=song.play();if(p)p.catch(()=>{})}};
const open=()=>{
if(env.classList.contains('open'))return;
env.classList.add('open');play();
setTimeout(()=>{env.classList.add('gone');document.body.classList.remove('locked')},1500);
};
env.addEventListener('click',open);
env.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}});
mus.addEventListener('click',()=>{if(song.paused)play();else song.pause()});
song.addEventListener('play',()=>document.getElementById('w').style.opacity=1);
song.addEventListener('pause',()=>document.getElementById('w').style.opacity=.2);
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
