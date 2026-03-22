// Stars
!function(){
    const e=document.getElementById('starsLayer');
    const isM=matchMedia('(max-width:768px)').matches;
    const count=isM?30:80;
    for(let i=0;i<count;i++){
        const s=document.createElement('div');
        s.className='star';
        const colors=['rgba(167,139,250,1)','rgba(129,140,248,1)','rgba(196,181,253,1)','rgba(255,255,255,1)','rgba(99,102,241,1)'];
        const col=colors[Math.floor(Math.random()*colors.length)];
        s.style.cssText=`position:absolute;left:${Math.random()*100}%;top:${Math.random()*100}%;width:${1+Math.random()*1.5}px;height:${1+Math.random()*1.5}px;--d:${3+Math.random()*4}s;--o:${.15+Math.random()*.5};animation-delay:${Math.random()*5}s;background:${col};box-shadow:0 0 ${2+Math.random()*4}px ${col}`;
        e.appendChild(s)
    }
}();

// Particles
const cvs=document.getElementById('pc'),cx=cvs.getContext('2d');
let pts=[],mx=innerWidth/2,my=innerHeight/2;
const isM=matchMedia('(max-width:768px)').matches,pC=isM?0:40;
function rz(){cvs.width=innerWidth;cvs.height=innerHeight}
rz();addEventListener('resize',rz);

addEventListener('mousemove',e=>{
    mx=e.clientX;my=e.clientY;
    const g=document.getElementById('cursorGlow');
    if(g){g.style.left=e.clientX+'px';g.style.top=e.clientY+'px'}
});

class P{
    constructor(){this.reset()}
    reset(){
        this.x=Math.random()*cvs.width;this.y=Math.random()*cvs.height;
        this.s=Math.random()*1.1+.3;this.vx=(Math.random()-.5)*.12;
        this.vy=(Math.random()-.5)*.12;this.o=Math.random()*.2+.04;
        const hues=[260,270,280,240,250];
        this.h=hues[Math.floor(Math.random()*hues.length)];
    }
    update(){
        this.x+=this.vx;this.y+=this.vy;
        if(!isM){
            const dx=mx-this.x,dy=my-this.y,d=Math.sqrt(dx*dx+dy*dy);
            if(d<160){this.x-=dx*.0012;this.y-=dy*.0012;this.o=Math.min(.35,this.o+.006)}
            else this.o=Math.max(.04,this.o-.001)
        }
        if(this.x<0||this.x>cvs.width)this.vx*=-1;
        if(this.y<0||this.y>cvs.height)this.vy*=-1
    }
    draw(){
        cx.beginPath();cx.arc(this.x,this.y,this.s,0,Math.PI*2);
        cx.fillStyle=`hsla(${this.h},70%,65%,${this.o})`;cx.fill()
    }
}
for(let i=0;i<pC;i++)pts.push(new P);

function dl(){
    if(isM)return;
    for(let i=0;i<pts.length;i++)
        for(let j=i+1;j<pts.length;j++){
            const dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y,d=Math.sqrt(dx*dx+dy*dy);
            if(d<80){
                cx.beginPath();cx.moveTo(pts[i].x,pts[i].y);cx.lineTo(pts[j].x,pts[j].y);
                cx.strokeStyle=`rgba(124,58,237,${.03*(1-d/80)})`;cx.lineWidth=.4;cx.stroke()
            }
        }
}
function an(){
    if(isM)return;
    cx.clearRect(0,0,cvs.width,cvs.height);pts.forEach(p=>{p.update();p.draw()});dl();requestAnimationFrame(an)
}
if(!isM)an();

// Language
function toggleLang(){document.getElementById('langWrap').classList.toggle('open')}
document.addEventListener('click',e=>{
    if(!e.target.closest('.lang-wrap'))document.getElementById('langWrap').classList.remove('open');
    if(!e.target.closest('.mob-nav-wrap'))closeMobNav();
});

// Theme
function toggleTheme(){
    const h=document.documentElement;
    const n=h.getAttribute('data-theme')==='dark'?'light':'dark';
    h.setAttribute('data-theme',n);
    localStorage.setItem('theme',n);
    document.getElementById('themeToggle').textContent=n==='dark'?'🌙':'☀️';
}
(function(){
    const s=localStorage.getItem('theme');
    if(s){
        document.documentElement.setAttribute('data-theme',s);
        const b=document.getElementById('themeToggle');
        if(b)b.textContent=s==='dark'?'🌙':'☀️';
    }
})();

// Share
function shareWebsite(){
    const d={
        title:'Paytaoff — Честные обзоры казино 2026',
        text:'Проверенные рейтинги лучших казино!',
        url:location.href
    };
    if(navigator.share){
        navigator.share(d).catch(()=>{});
    }else{
        navigator.clipboard.writeText(location.href).then(()=>{
            const b=event.target.closest('.share-btn');
            if(b){const o=b.innerHTML;b.innerHTML='✅ Скопировано!';setTimeout(()=>b.innerHTML=o,2e3)}
        }).catch(()=>prompt('Скопируйте:',location.href));
    }
}

// Scroll
let sbClosed=false;
const sp=document.getElementById('scrollProgress');
let scrollTick=false;
addEventListener('scroll',()=>{
    if(scrollTick)return;
    scrollTick=true;
    requestAnimationFrame(()=>{
        const y=scrollY,h=document.body.scrollHeight-innerHeight;
        if(sp&&h>0)sp.style.transform=`scaleX(${y/h})`;
        document.getElementById('scrollTop').classList.toggle('show',y>300);
        document.getElementById('island').classList.toggle('scrolled',y>60);
        if(!sbClosed)document.getElementById('stickyBar').classList.toggle('show',y>500);
        const s=['top','guide','help','faq'];
        const l=document.querySelectorAll('.i-link');
        let c='';
        s.forEach(id=>{const e=document.getElementById(id);if(e&&y>=e.offsetTop-160)c=id});
        l.forEach(a=>{
            const hr=a.getAttribute('href');
            if(hr&&hr.startsWith('#'))a.classList.toggle('active',hr==='#'+c)
        });
        scrollTick=false;
    });
},{passive:true});

function closeSB(){sbClosed=true;document.getElementById('stickyBar').classList.remove('show')}

// Parallax
if(!isM){
    let parTick=false;
    addEventListener('scroll',()=>{
        if(parTick)return;
        parTick=true;
        requestAnimationFrame(()=>{
            document.querySelectorAll('.ios-f').forEach(f=>{
                const r=f.getBoundingClientRect();
                f.style.transform=`translateY(${(r.top/innerHeight-.5)*6}px)`;
            });
            parTick=false;
        });
    },{passive:true});
}

// Reveal
const rO=new IntersectionObserver(e=>{
    e.forEach(e=>{if(e.isIntersecting)e.target.classList.add('vis')});
},{threshold:.06,rootMargin:'0px 0px -20px 0px'});
document.querySelectorAll('.reveal').forEach(e=>rO.observe(e));

// Counter
const cO=new IntersectionObserver(e=>{
    e.forEach(e=>{
        if(!e.isIntersecting)return;
        const el=e.target,t=+el.dataset.count,d=1600,st=performance.now();
        !function s(n){
            const p=Math.min((n-st)/d,1);
            el.textContent=Math.floor(t*(1-Math.pow(1-p,3)))+(t===50?'+':'');
            if(p<1)requestAnimationFrame(s);
        }(st);
        cO.unobserve(el);
    });
},{threshold:.5});
document.querySelectorAll('[data-count]').forEach(e=>cO.observe(e));

// Mobile menu (old — disabled)
function toggleMob(){}
function closeMob(){}

// Mobile Nav Dropdown
function toggleMobNav(){
    const dd=document.getElementById('mobNavDropdown');
    dd.classList.toggle('open');
}
function closeMobNav(){
    const dd=document.getElementById('mobNavDropdown');
    if(dd)dd.classList.remove('open');
}

// FAQ
function toggleFaq(el){
    const fi=el.closest('.fi');
    const fa=fi.querySelector('.fa');
    const isOpen=fi.classList.contains('on');
    document.querySelectorAll('.fi.on').forEach(f=>{
        f.classList.remove('on');
        f.querySelector('.fa').style.maxHeight='0';
    });
    if(!isOpen){
        fi.classList.add('on');
        fa.style.maxHeight=fa.scrollHeight+'px';
    }
}

// Copy promo — универсальная
function copyPromo(code,elId){
    navigator.clipboard.writeText(code).then(()=>{
        const el=document.getElementById(elId);
        if(el){
            el.textContent='✅ Скопировано!';
            el.classList.add('copied');
            setTimeout(()=>{
                el.textContent='📋 Скопировать код';
                el.classList.remove('copied');
            },2500);
        }
    }).catch(()=>prompt('Скопируйте промокод:',code));
}

// Calculator
function calcBonus(){
    const v=parseFloat(document.getElementById('calcInput').value)||0;
    const b=Math.min(v*5,200000);
    const t=v+b;
    document.getElementById('calcDeposit').textContent=v.toLocaleString('ru')+' ₽';
    document.getElementById('calcBonusVal').textContent=b.toLocaleString('ru')+' ₽';
    const totalEl=document.getElementById('calcTotal');
    totalEl.textContent=t.toLocaleString('ru')+' ₽';
    totalEl.style.transform='scale(1.08)';
    setTimeout(()=>totalEl.style.transform='scale(1)',300);
}

// Ripple
document.querySelectorAll('.ripple').forEach(btn=>{
    btn.addEventListener('click',function(e){
        const w=document.createElement('span');
        w.className='ripple-wave';
        const r=this.getBoundingClientRect();
        const s=Math.max(r.width,r.height);
        w.style.width=w.style.height=s+'px';
        w.style.left=(e.clientX-r.left-s/2)+'px';
        w.style.top=(e.clientY-r.top-s/2)+'px';
        this.appendChild(w);
        setTimeout(()=>w.remove(),600);
    });
});

// Easter Egg — Konami
let konamiSeq=[];
const konamiCode=[38,38,40,40,37,39,37,39,66,65];
document.addEventListener('keydown',e=>{
    konamiSeq.push(e.keyCode);
    konamiSeq=konamiSeq.slice(-10);
    if(konamiSeq.join(',')==konamiCode.join(','))document.getElementById('easterEgg').classList.add('show');
});
function closeEasterEgg(){document.getElementById('easterEgg').classList.remove('show')}

// Logo tooltip + double click
const logo=document.querySelector('.i-logo');
if(logo){
    logo.addEventListener('mouseenter',function(e){
        const tt=document.getElementById('logoTooltip');
        tt.style.left=(e.clientX+10)+'px';
        tt.style.top=(e.clientY+10)+'px';
        tt.classList.add('show');
    });
    logo.addEventListener('mouseleave',function(){document.getElementById('logoTooltip').classList.remove('show')});
    logo.addEventListener('dblclick',function(){document.getElementById('easterEgg').classList.add('show')});
}

// Float scene parallax
if(!isM){
    const scene=document.getElementById('floatScene');
    if(scene){
        document.addEventListener('mousemove',e=>{
            const x=(e.clientX/innerWidth-.5)*20;
            const y=(e.clientY/innerHeight-.5)*20;
            scene.style.transform=`rotateY(${x*0.3}deg) rotateX(${-y*0.3}deg)`;
        });
    }
}
