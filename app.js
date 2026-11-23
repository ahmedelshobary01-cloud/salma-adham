{
const env=document.getElementById('env'),mus=document.getElementById('mus'),photo=document.getElementById('photo');

// soft background music, generated in the browser
let ctx=null,master=null,timer=null,playing=false,step=0,nextT=0;
const chords=[[60,64,67,71],[57,60,64,67],[53,57,60,64],[55,59,62,67]];
const hz=m=>440*Math.pow(2,(m-69)/12);
const note=(m,t,len,vol,type)=>{
const o=ctx.createOscillator(),g=ctx.createGain();
o.type=type;o.frequency.value=hz(m);
g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+0.03);g.gain.exponentialRampToValueAtTime(0.0001,t+len);
o.connect(g);g.connect(master);o.start(t);o.stop(t+len+0.05);
};
const setup=()=>{
const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return false;
ctx=new AC();master=ctx.createGain();master.gain.value=0.5;
const rev=ctx.createConvolver(),len=ctx.sampleRate*2.6,buf=ctx.createBuffer(2,len,ctx.sampleRate);
for(let c=0;c<2;c++){const d=buf.getChannelData(c);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2.4)}
rev.buffer=buf;const wet=ctx.createGain();wet.gain.value=0.55;
master.connect(ctx.destination);master.connect(rev);rev.connect(wet);wet.connect(ctx.destination);
return true;
};
const pattern=[0,1,2,3,2,1,2,3];
const sched=()=>{
while(nextT<ctx.currentTime+0.6){
const bar=Math.floor(step/8)%chords.length,ch=chords[bar],i=step%8;
if(i===0){note(ch[0]-12,nextT,4.2,0.16,'sine');note(ch[0]-24,nextT,4.2,0.10,'sine')}
note(ch[pattern[i]]+12,nextT,1.8,0.07,'triangle');
if(i===0||i===4)note(ch[(i/4+2)%4]+24,nextT+0.02,2.2,0.035,'sine');
step++;nextT+=0.5;
}
};
const synthPlay=()=>{
if(!ctx&&!setup())return;
if(ctx.state==='suspended')ctx.resume();
if(playing)return;playing=true;nextT=ctx.currentTime+0.1;
master.gain.cancelScheduledValues(ctx.currentTime);master.gain.setValueAtTime(0.0001,ctx.currentTime);master.gain.exponentialRampToValueAtTime(0.5,ctx.currentTime+2);
timer=setInterval(sched,150);sched();
document.getElementById('w').style.opacity=1;
};
const synthStop=()=>{
if(!playing)return;playing=false;clearInterval(timer);
master.gain.setTargetAtTime(0.0001,ctx.currentTime,0.3);
document.getElementById('w').style.opacity=.2;
};
const song=new Audio('song.mp3');song.loop=true;song.preload='auto';
let useSong=true,songOn=false;
song.addEventListener('error',()=>{useSong=false});
const play=()=>{
if(useSong){song.play().then(()=>{songOn=true;document.getElementById('w').style.opacity=1}).catch(()=>{useSong=false;synthPlay()})}
else synthPlay();
};
const stop=()=>{
if(songOn){song.pause();songOn=false;document.getElementById('w').style.opacity=.2}
synthStop();
};
mus.hidden=false;
mus.addEventListener('click',()=>{try{(playing||songOn)?stop():play()}catch(e){}});

const open=()=>{
if(env.classList.contains('open'))return;
env.classList.add('open');try{play()}catch(e){}
setTimeout(()=>{env.classList.add('gone');document.body.classList.remove('locked')},1500);
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
