// Stars
!function(){const e=document.getElementById('starsLayer');for(let i=0;i<80;i++){const s=document.createElement('div');s.className='star';s.style.cssText=`position:absolute;left:${Math.random()*100}%;top:${Math.random()*100}%;width:${1+Math.random()*1.2}px;height:${1+Math.random()*1.2}px;--d:${3+Math.random()*4}s;--o:${.15+Math.random()*.4};animation-delay:${Math.random()*5}s`;e.appendChild(s)}}();

// Particles
const cvs=document.getElementById('pc'),cx=cvs.getContext('2d');let pts=[],mx=innerWidth/2,my=innerHeight/2;
const isM=matchMedia('(max-width:768px)').matches,pC=isM?20:50;
function rz(){cvs.width=innerWidth;cvs.height=innerHeight}rz();addEventListener('resize',rz);
addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;const g=document.getElementById('cursorGlow');if(g){g.style.left=e.clientX+'px';g.style.top=e.clientY+'px'}});
class P{constructor(){this.reset()}reset(){this.x=Math.random()*cvs.width;this.y=Math.random()*cvs.height;this.s=Math.random()*1.1+.3;this.vx=(Math.random()-.5)*.12;this.vy=(Math.random()-.5)*.12;this.o=Math.random()*.2+.04;this.h=Math.random()>.5?195:260}update(){this.x+=this.vx;this.y+=this.vy;if(!isM){const dx=mx-this.x,dy=my-this.y,d=Math.sqrt(dx*dx+dy*dy);if(d<160){this.x-=dx*.0012;this.y-=dy*.0012;this.o=Math.min(.35,this.o+.006)}else this.o=Math.max(.04,this.o-.001)}if(this.x<0||this.x>cvs.width)this.vx*=-1;if(this.y<0||this.y>cvs.height)this.vy*=-1}draw(){cx.beginPath();cx.arc(this.x,this.y,this.s,0,Math.PI*2);cx.fillStyle=`hsla(${this.h},70%,65%,${this.o})`;cx.fill()}}
for(let i=0;i<pC;i++)pts.push(new P);
function dl(){if(isM)return;for(let i=0;i<pts.length;i++)for(let j=i+1;j<pts.length;j++){const dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y,d=Math.sqrt(dx*dx+dy*dy);if(d<80){cx.beginPath();cx.moveTo(pts[i].x,pts[i].y);cx.lineTo(pts[j].x,pts[j].y);cx.strokeStyle=`rgba(56,189,248,${.025*(1-d/80)})`;cx.lineWidth=.4;cx.stroke()}}}
function an(){cx.clearRect(0,0,cvs.width,cvs.height);pts.forEach(p=>{p.update();p.draw()});dl();requestAnimationFrame(an)}an();

// Language
function toggleLang(){document.getElementById('langWrap').classList.toggle('open')}
document.addEventListener('click',e=>{if(!e.target.closest('.lang-wrap'))document.getElementById('langWrap').classList.remove('open')});

// Theme
function toggleTheme(){
    const html=document.documentElement;
    const next=html.getAttribute('data-theme')==='dark'?'light':'dark';
    html.setAttribute('data-theme',next);
    localStorage.setItem('theme',next);
    document.getElementById('themeToggle').textContent=next==='dark'?'🌙':'☀️';
}
(function(){
    const saved=localStorage.getItem('theme');
    if(saved){
        document.documentElement.setAttribute('data-theme',saved);
        const btn=document.getElementById('themeToggle');
        if(btn)btn.textContent=saved==='dark'?'🌙':'☀️';
    }
})();

// Share
function shareWebsite(){
    const data={title:'BonusVault — Честный гид по казино 2026',text:'Проверенные обзоры и рейтинги лучших казино!',url:location.href};
    if(navigator.share){navigator.share(data).catch(()=>{})}
    else{navigator.clipboard.writeText(location.href).then(()=>{
        const b=event.target.closest('.share-btn');
        if(b){const o=b.innerHTML;b.innerHTML='✅ Скопировано!';setTimeout(()=>b.innerHTML=o,2e3)}
    }).catch(()=>prompt('Скопируйте ссылку:',location.href))}
}

// Scroll
let sbClosed=false;
const sp=document.getElementById('scrollProgress');
addEventListener('scroll',()=>{
    const y=scrollY,h=document.body.scrollHeight-innerHeight;
    if(sp&&h>0)sp.style.transform=`scaleX(${y/h})`;
    document.getElementById('scrollTop').classList.toggle('show',y>300);
    document.getElementById('island').classList.toggle('scrolled',y>60);
    if(!sbClosed)document.getElementById('stickyBar').classList.toggle('show',y>500);
    const s=['top','guide','help','faq'];
    const l=document.querySelectorAll('.i-link');let c='';
    s.forEach(id=>{const e=document.getElementById(id);if(e&&y>=e.offsetTop-160)c=id});
    l.forEach(a=>{const hr=a.getAttribute('href');if(hr&&hr.startsWith('#'))a.classList.toggle('active',hr==='#'+c)});
},{passive:true});
function closeSB(){sbClosed=true;document.getElementById('stickyBar').classList.remove('show')}

// Parallax
if(!isM){addEventListener('scroll',()=>{document.querySelectorAll('.ios-f').forEach(f=>{const r=f.getBoundingClientRect();f.style.transform=`translateY(${(r.top/innerHeight-.5)*6}px)`})},{passive:true})}

// Reveal
const rO=new IntersectionObserver(e=>{e.forEach(e=>{if(e.isIntersecting)e.target.classList.add('vis')})},{threshold:.06,rootMargin:'0px 0px -20px 0px'});
document.querySelectorAll('.reveal').forEach(e=>rO.observe(e));

// Counter
const cO=new IntersectionObserver(e=>{e.forEach(e=>{if(!e.isIntersecting)return;const el=e.target,t=+el.dataset.count,d=1600,st=performance.now();!function s(n){const p=Math.min((n-st)/d,1);el.textContent=Math.floor(t*(1-Math.pow(1-p,3)))+(t===50?'+':'');if(p<1)requestAnimationFrame(s)}(st);cO.unobserve(el)})},{threshold:.5});
document.querySelectorAll('[data-count]').forEach(e=>cO.observe(e));

// Mobile menu
function toggleMob(){document.getElementById('burger').classList.toggle('on');document.getElementById('mobMenu').classList.toggle('on')}
function closeMob(){document.getElementById('burger').classList.remove('on');document.getElementById('mobMenu').classList.remove('on')}

// FAQ
function toggleFaq(e){const i=e.parentElement,a=i.querySelector('.fa'),w=i.classList.contains('on');document.querySelectorAll('.fi').forEach(f=>{f.classList.remove('on');f.querySelector('.fa').style.maxHeight='0'});if(!w){i.classList.add('on');a.style.maxHeight=a.scrollHeight+'px'}}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a=>{a.addEventListener('click',e=>{e.preventDefault();const t=document.querySelector(a.getAttribute('href'));if(t){window.scrollTo({top:t.offsetTop-55,behavior:'smooth'});closeMob()}})});

// Tilt
if(!isM){
    function addT(s,i=3){document.querySelectorAll(s).forEach(c=>{c.addEventListener('mousemove',e=>{const r=c.getBoundingClientRect();c.style.transform=`perspective(800px) rotateX(${(e.clientY-r.top-r.height/2)/r.height*-i}deg) rotateY(${(e.clientX-r.left-r.width/2)/r.width*i}deg) translateY(-3px)`});c.addEventListener('mouseleave',()=>{c.style.transform=''})})}
    addT('.cc-hero',2);addT('.cc',3);addT('.mc',4);addT('.gc',3);addT('.help-card',3);
    const fs=document.getElementById('floatScene');
    if(fs)addEventListener('mousemove',e=>{const x=(e.clientX/innerWidth-.5)*10,y=(e.clientY/innerHeight-.5)*10;fs.style.transform=`rotateY(${x*.5}deg) rotateX(${-y*.5}deg)`});
    document.querySelectorAll('.cbtn,.cbtn-gold,.tb,.btn-glow,.sb-b,.tg-banner-btn').forEach(b=>{
        b.addEventListener('mousemove',e=>{const r=b.getBoundingClientRect();b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.08}px,${(e.clientY-r.top-r.height/2)*.08}px) scale(1.03)`});
        b.addEventListener('mouseleave',()=>{b.style.transform=''});
    });
}

// Ripple
document.querySelectorAll('.ripple').forEach(btn=>{
    btn.addEventListener('click',function(e){
        const r=this.getBoundingClientRect(),wave=document.createElement('span');
        wave.className='ripple-wave';
        const size=Math.max(r.width,r.height);
        wave.style.width=wave.style.height=size+'px';
        wave.style.left=(e.clientX-r.left-size/2)+'px';
        wave.style.top=(e.clientY-r.top-size/2)+'px';
        this.appendChild(wave);setTimeout(()=>wave.remove(),600);
    });
});

// Copy promo
function copyPromo(){
    const copy=t=>{const b=document.getElementById('promoCopy');b.textContent='✅ Скопировано!';b.classList.add('copied');setTimeout(()=>{b.textContent='📋 Скопировать код';b.classList.remove('copied')},2e3)};
    navigator.clipboard?navigator.clipboard.writeText('SMOG').then(copy).catch(()=>{const t=document.createElement('textarea');t.value='SMOG';document.body.appendChild(t);t.select();document.execCommand('copy');document.body.removeChild(t);copy()}):copy();
}

// Calculator
function calcBonus(){
    let v=parseInt(document.getElementById('calcInput').value)||0;
    if(v<0)v=0;if(v>1e7)v=1e7;const b=v*5;
    document.getElementById('calcDeposit').textContent=v.toLocaleString()+' ₽';
    document.getElementById('calcBonusVal').textContent=b.toLocaleString()+' ₽';
    const total=document.getElementById('calcTotal');
    total.textContent=(v+b).toLocaleString()+' ₽';
    total.style.transform='scale(1.1)';
    setTimeout(()=>total.style.transform='',300);
}
