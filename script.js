// Stars — меньше на мобилке
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

// Particles — отключены на мобилке
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
        // фиолетовые/индиго цвета
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
    if(!e.target.closest('.lang-wrap'))document.getElementById('langWrap').classList.remove('open')
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
            if(b){
                const o=b.innerHTML;
                b.innerHTML='✅ Скопировано!';
                setTimeout(()=>b.innerHTML=o,2e3);
            }
        }).catch(()=>prompt('Скопируйте:',location.href));
    }
}

// Scroll — оптимизировано с throttle
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

// Parallax — только на десктопе
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

// Mobile menu
function toggleMob(){
    document.getElementById('burger').classList.toggle('on');
    document.getElementById('mobMenu').classList.toggle('on');
}
function closeMob(){
    document.getElementById('burger').classList.remove('on');
    document.getElementById('mobMenu').classList.remove('on');
}

// FAQ
function toggleFaq(e){
    const i=e.parentElement,a=i.querySelector('.fa'),w=i.classList.contains('on');
    document.querySelectorAll('.fi').forEach(f=>{
        f.classList.remove('on');
        f.querySelector('.fa').style.maxHeight='0';
    });
    if(!w){i.classList.add('on');a.style.maxHeight=a.scrollHeight+'px'}
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',e=>{
        e.preventDefault();
        const t=document.querySelector(a.getAttribute('href'));
        if(t){window.scrollTo({top:t.offsetTop-55,behavior:'smooth'});closeMob()}
    });
});

// Tilt effects — только десктоп
if(!isM){
    function addT(s,i=3){
        document.querySelectorAll(s).forEach(c=>{
            c.addEventListener('mousemove',e=>{
                const r=c.getBoundingClientRect();
                c.style.transform=`perspective(800px) rotateX(${(e.clientY-r.top-r.height/2)/r.height*-i}deg) rotateY(${(e.clientX-r.left-r.width/2)/r.width*i}deg) translateY(-3px)`;
            });
            c.addEventListener('mouseleave',()=>{c.style.transform=''});
        });
    }
    addT('.cc-hero',2);addT('.cc',3);addT('.mc',4);addT('.gc',3);addT('.help-card',3);

    const fs=document.getElementById('floatScene');
    if(fs){
        addEventListener('mousemove',e=>{
            const x=(e.clientX/innerWidth-.5)*10,y=(e.clientY/innerHeight-.5)*10;
            fs.style.transform=`rotateY(${x*.5}deg) rotateX(${-y*.5}deg)`;
        });
    }

    document.querySelectorAll('.cbtn,.cbtn-gold,.tb,.btn-glow,.sb-b,.tg-banner-btn').forEach(b=>{
        b.addEventListener('mousemove',e=>{
            const r=b.getBoundingClientRect();
            b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.08}px,${(e.clientY-r.top-r.height/2)*.08}px) scale(1.03)`;
        });
        b.addEventListener('mouseleave',()=>{b.style.transform=''});
    });
}

// Ripple
document.querySelectorAll('.ripple').forEach(btn=>{
    btn.addEventListener('click',function(e){
        const r=this.getBoundingClientRect();
        const w=document.createElement('span');
        w.className='ripple-wave';
        const s=Math.max(r.width,r.height);
        w.style.width=w.style.height=s+'px';
        w.style.left=(e.clientX-r.left-s/2)+'px';
        w.style.top=(e.clientY-r.top-s/2)+'px';
        this.appendChild(w);
        setTimeout(()=>w.remove(),600);
    });
});

// Copy promo
function copyPromo(){
    const done=()=>{
        const b=document.getElementById('promoCopy');
        b.textContent='✅ Скопировано!';
        b.classList.add('copied');
        setTimeout(()=>{b.textContent='📋 Скопировать код';b.classList.remove('copied')},2e3);
    };
    if(navigator.clipboard){
        navigator.clipboard.writeText('SMOG').then(done).catch(()=>{
            const t=document.createElement('textarea');
            t.value='SMOG';document.body.appendChild(t);
            t.select();document.execCommand('copy');
            document.body.removeChild(t);done();
        });
    }else{done()}
}

// Calculator
function calcBonus(){
    let v=parseInt(document.getElementById('calcInput').value)||0;
    if(v<0)v=0;if(v>1e7)v=1e7;
    const b=v*5;
    document.getElementById('calcDeposit').textContent=v.toLocaleString()+' ₽';
    document.getElementById('calcBonusVal').textContent=b.toLocaleString()+' ₽';
    const t=document.getElementById('calcTotal');
    t.textContent=(v+b).toLocaleString()+' ₽';
    t.style.transform='scale(1.1)';
    setTimeout(()=>t.style.transform='',300);
}

// ===== ПРИКАЛЮХИ =====

// 1. Конами код (↑↑↓↓←→←→BA) — пасхалка
let konamiSeq=[];
const konamiCode=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','KeyB','KeyA'];
document.addEventListener('keydown',e=>{
    konamiSeq.push(e.code);
    if(konamiSeq.length>10)konamiSeq.shift();
    if(konamiSeq.join(',')===konamiCode.join(',')){
        document.getElementById('easterEgg').classList.add('show');
        launchFireworks();
        konamiSeq=[];
    }
});
function closeEasterEgg(){
    document.getElementById('easterEgg').classList.remove('show');
}

// 2. Двойной клик на лого — космический фейерверк
const logoEl=document.querySelector('.i-logo');
if(logoEl){
    logoEl.addEventListener('dblclick',()=>{
        launchFireworks();
    });

    // Tooltip на наведение
    logoEl.addEventListener('mouseenter',(e)=>{
        const tip=document.getElementById('logoTooltip');
        tip.style.left=e.clientX+'px';
        tip.style.top=(e.clientY+30)+'px';
        tip.classList.add('show');
    });
    logoEl.addEventListener('mouseleave',()=>{
        document.getElementById('logoTooltip').classList.remove('show');
    });
}

// 3. Космический фейерверк
function launchFireworks(){
    const colors=['#7c3aed','#a78bfa','#4f46e5','#818cf8','#c4b5fd','#6366f1','#ddd6fe','#f59e0b'];
    for(let i=0;i<50;i++){
        const spark=document.createElement('div');
        spark.style.cssText=`
            position:fixed;
            z-index:99997;
            width:${3+Math.random()*5}px;
            height:${3+Math.random()*5}px;
            background:${colors[Math.floor(Math.random()*colors.length)]};
            border-radius:50%;
            pointer-events:none;
            left:50%;top:50%;
            box-shadow:0 0 ${4+Math.random()*8}px currentColor;
        `;
        document.body.appendChild(spark);
        const angle=Math.random()*Math.PI*2;
        const dist=100+Math.random()*250;
        const dx=Math.cos(angle)*dist;
        const dy=Math.sin(angle)*dist;
        spark.animate([
            {transform:'translate(-50%,-50%) scale(1)',opacity:1},
            {transform:`translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px)) scale(0)`,opacity:0}
        ],{duration:800+Math.random()*600,easing:'cubic-bezier(.22,1,.36,1)'});
        setTimeout(()=>spark.remove(),1400);
    }
}

// 4. Частицы при клике
document.addEventListener('click',e=>{
    if(isM)return;
    const colors=['#7c3aed','#a78bfa','#4f46e5','#c4b5fd'];
    for(let i=0;i<6;i++){
        const p=document.createElement('div');
        p.style.cssText=`
            position:fixed;z-index:99996;pointer-events:none;
            width:${2+Math.random()*4}px;height:${2+Math.random()*4}px;
            background:${colors[Math.floor(Math.random()*colors.length)]};
            border-radius:50%;left:${e.clientX}px;top:${e.clientY}px;
            box-shadow:0 0 4px currentColor;
        `;
        document.body.appendChild(p);
        const angle=Math.random()*Math.PI*2;
        const dist=20+Math.random()*40;
        p.animate([
            {transform:'translate(-50%,-50%) scale(1)',opacity:1},
            {transform:`translate(calc(-50% + ${Math.cos(angle)*dist}px),calc(-50% + ${Math.sin(angle)*dist}px)) scale(0)`,opacity:0}
        ],{duration:500+Math.random()*300,easing:'ease-out'});
        setTimeout(()=>p.remove(),800);
    }
});

// 5. Hover-трейл за курсором (десктоп)
if(!isM){
    let lastTrail=0;
    document.addEventListener('mousemove',e=>{
        const now=Date.now();
        if(now-lastTrail<50)return;
        lastTrail=now;
        const trail=document.createElement('div');
        trail.style.cssText=`
            position:fixed;z-index:0;pointer-events:none;
            width:6px;height:6px;border-radius:50%;
            background:rgba(124,58,237,.15);
            left:${e.clientX}px;top:${e.clientY}px;
            transform:translate(-50%,-50%);
            box-shadow:0 0 8px rgba(124,58,237,.1);
        `;
        document.body.appendChild(trail);
        trail.animate([
            {opacity:1,transform:'translate(-50%,-50%) scale(1)'},
            {opacity:0,transform:'translate(-50%,-50%) scale(2.5)'}
        ],{duration:600,easing:'ease-out'});
        setTimeout(()=>trail.remove(),600);
    });
}
