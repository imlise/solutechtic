if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);



(function(){
  const footer = document.getElementById('siteFooter');
  // Anime le footer une seule fois, après le premier paint,
  // mais le footer est DÉJÀ visible (opacity:1 par défaut en CSS) —
  // donc même si ce script échoue ou est bloqué, rien ne casse.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      footer.classList.add('footer-animate-in');
    });
  });
})();



(function(){
const canvas=document.getElementById('waveCanvas');
const wrap=document.getElementById('ctaWrap');
let W,H,ctx;
function resize(){W=wrap.offsetWidth;H=wrap.offsetHeight;canvas.width=W*devicePixelRatio;canvas.height=H*devicePixelRatio;canvas.style.width=W+'px';canvas.style.height=H+'px';ctx=canvas.getContext('2d');ctx.scale(devicePixelRatio,devicePixelRatio);}
resize();window.addEventListener('resize',resize);
const CELL=52,HALF=CELL/2;
function cellCenter(col,row){return{x:col*CELL+(row%2===0?0:HALF),y:row*HALF}}
function drawDiamond(cx,cy,s,alpha,tint){ctx.save();ctx.globalAlpha=alpha;ctx.strokeStyle=tint;ctx.lineWidth=0.6;ctx.beginPath();ctx.moveTo(cx,cy-s);ctx.lineTo(cx+s,cy);ctx.lineTo(cx,cy+s);ctx.lineTo(cx-s,cy);ctx.closePath();ctx.stroke();ctx.restore();}
class Impulse{constructor(){this.reset()}reset(){const m=CELL*2;this.ox=-m+Math.random()*(W+m*2);this.oy=-m+Math.random()*(H+m*2);this.r=0;this.speed=12+Math.random()*10;this.bandwidth=CELL*(2.2+Math.random()*1.8);this.maxR=Math.sqrt(Math.pow(Math.max(this.ox,W-this.ox),2)+Math.pow(Math.max(this.oy,H-this.oy),2))+CELL*2;this.tint=Math.random()<.55?'rgba(180,30,26,1)':'rgba(40,70,160,1)';this.delay=Math.random()*7000;this.born=performance.now();this.active=false;}update(now,dt){if(!this.active){if(now-this.born>=this.delay)this.active=true;return;}this.r+=this.speed*dt*.001;}draw(){if(!this.active)return;if(this.r>this.maxR){this.reset();return;}const rMin=Math.max(0,this.r-this.bandwidth),rMax=this.r;const xMin=Math.floor((this.ox-rMax-CELL)/CELL),xMax=Math.ceil((this.ox+rMax+CELL)/CELL);const yMin=Math.floor((this.oy-rMax-CELL)/HALF),yMax=Math.ceil((this.oy+rMax+CELL)/HALF);for(let row=yMin;row<=yMax;row++)for(let col=xMin;col<=xMax;col++){const c=cellCenter(col,row);const dx=c.x-this.ox,dy=c.y-this.oy,d=Math.sqrt(dx*dx+dy*dy);if(d<rMin||d>rMax)continue;const t=(d-rMin)/(rMax-rMin),envelope=Math.pow(Math.sin(t*Math.PI),1.4),alpha=envelope*0.11;if(alpha<.005)continue;const s=HALF*.62*(1-d/(this.maxR*1.4)*.3);drawDiamond(c.x,c.y,s,alpha,this.tint);}}}
const impulses=Array.from({length:5},()=>new Impulse());
impulses.forEach((imp,i)=>{imp.born-=i*1800});
function drawAmbient(t){const cx1=W*(.22+Math.sin(t*.00008)*.06),cy1=H*(.55+Math.cos(t*.00006)*.08);const cx2=W*(.78+Math.cos(t*.00007)*.05),cy2=H*(.38+Math.sin(t*.00009)*.07);const g1=ctx.createRadialGradient(cx1,cy1,0,cx1,cy1,W*.55);g1.addColorStop(0,'rgba(100,12,10,0.18)');g1.addColorStop(1,'rgba(100,12,10,0)');ctx.fillStyle=g1;ctx.fillRect(0,0,W,H);const g2=ctx.createRadialGradient(cx2,cy2,0,cx2,cy2,W*.50);g2.addColorStop(0,'rgba(18,38,90,0.20)');g2.addColorStop(1,'rgba(18,38,90,0)');ctx.fillStyle=g2;ctx.fillRect(0,0,W,H);}
let prev=0;
function render(now){const dt=Math.min(now-prev,80);prev=now;ctx.clearRect(0,0,W,H);ctx.fillStyle='#0d0d15';ctx.fillRect(0,0,W,H);drawAmbient(now);impulses.forEach(imp=>{imp.update(now,dt);imp.draw()});requestAnimationFrame(render);}
requestAnimationFrame(ts=>{prev=ts;render(ts)});
const ctaRoot=document.getElementById('projets');
const transformBtn=document.getElementById('transformCta');
const ctaContact=document.getElementById('ctaContact');
const ctaGoContact=document.getElementById('ctaGoContact');
const ctaReset=document.getElementById('ctaReset');
function transformCtaFromButton(){const wrapRect=wrap.getBoundingClientRect();const btnRect=transformBtn.getBoundingClientRect();const x=btnRect.left+btnRect.width/2-wrapRect.left;const y=btnRect.top+btnRect.height/2-wrapRect.top;ctaRoot.style.setProperty('--wave-x',x+'px');ctaRoot.style.setProperty('--wave-y',y+'px');ctaRoot.classList.add('is-contact');transformBtn.setAttribute('aria-expanded','true');ctaContact.setAttribute('aria-hidden','false');}
transformBtn.addEventListener('click',transformCtaFromButton);
ctaReset&&ctaReset.addEventListener('click',()=>{ctaRoot.classList.remove('is-contact');transformBtn.setAttribute('aria-expanded','false');ctaContact.setAttribute('aria-hidden','true');setTimeout(()=>transformBtn.focus(),260)});
ctaGoContact&&ctaGoContact.addEventListener('click',e=>{e.preventDefault();const contact=document.getElementById('contact');if(contact)contact.scrollIntoView({behavior:'smooth',block:'start'})});
})();



(function(){
'use strict';
const SLIDES=[
  {label:'AGENCE · LOMÉ',img:'images/slide_devanture.png',lines:['SOLUTECH','INNOVATION','GROUP'],body:'Votre partenaire technologique au Togo.',sub:'Entreprises, administrations, ONG et institutions font confiance à S.I.G pour moderniser leurs infrastructures et sécuriser leurs activités.',stats:[{n:'+200',l:'Projets livrés'},{n:'15+',l:'Années d\'expérience'},{n:'8',l:'Domaines d\'expertise'}],btn1:'Nos services',href1:'#services',btn2:'Voir les produits',href2:'#produits'},
  {label:'SÉCURITÉ INCENDIE',img:'images/slide_incendie.jpg',lines:['SYSTÈMES','INCENDIE','& SÉCURITÉ'],body:'Protection contre l\'incendie aux normes internationales.',sub:'Détection précoce, extinction automatique et évacuation maîtrisée pour la sécurité de vos bâtiments et de vos équipes.',stats:[{n:'100%',l:'Conformité normes'},{n:'24h/7',l:'Intervention'},{n:'48h',l:'Installation'}],btn1:'Nous contacter',href1:'#contact',btn2:'Voir les references',href2:'#refs'},
  {label:'VIDÉOSURVEILLANCE',img:'images/slide_camera.png',lines:['CAMÉRAS','& CONTRÔLE','D\'ACCÈS'],body:'Vidéosurveillance HD et contrôle d\'accès intelligent.',sub:'Surveillance en temps réel, stockage cloud sécurisé et gestion centralisée des accès pour vos sites sensibles.',stats:[{n:'4K',l:'Résolution'},{n:'+500',l:'Caméras posées'},{n:'Cloud',l:'Stockage sécurisé'}],btn1:'Nos services',href1:'#services',btn2:'Voir la boutique',href2:'#produits'},
  {label:'RÉSEAUX & TÉLÉCOMS',img:'images/slide_reseau.jpg',lines:['RÉSEAUX','& TÉLÉ','COM'],body:'Infrastructure télécom haute performance.',sub:'Conception, déploiement et maintenance de réseaux LAN/WAN, fibre optique et solutions sans fil pour entreprises et institutions.',stats:[{n:'10 Gb',l:'Débit max'},{n:'ISO',l:'Certifié'},{n:'+80',l:'Clients connectés'}],btn1:'Nous contacter',href1:'#contact',btn2:'Voir les références',href2:'#refs'},
  {label:'BTP & CONSTRUCTION',img:'images/slide_bureau.jpg',lines:['TRAVAUX','& SERVICES','BTP'],body:'Construction, rénovation et maintenance de bâtiments.',sub:'De l\'étude à la réalisation, Solutech accompagne vos projets de construction, réhabilitation et aménagement.',stats:[{n:'+50',l:'Projets réalisés'},{n:'24/7',l:'Assistance chantier'},{n:'10 ans',l:'Expérience'}],btn1:'Nous contacter',href1:'#contact',btn2:'Voir les references',href2:'#refs'},
  {label:'FORMATION',img:'images/slide_reunion.png',lines:['FORMATION','& CONSEIL','ICT'],body:'Renforcement des capacités numériques.',sub:'Programmes de formation certifiants en informatique, cybersécurité, réseaux et gestion de projet pour professionnels et organisations.',stats:[{n:'+300',l:'Stagiaires formés'},{n:'15',l:'Modules certifiants'},{n:'100%',l:'Présentiel & online'}],btn1:'Voir le catalogue',href1:'#produits',btn2:'Voir les references',href2:'#refs'},
  {label:'ACCOMPAGNEMENT PROJETS',img:'images/slide_projets.png',lines:['ACCOMPAGNEMENT','DE VOS','PROJETS'],body:'Conseil, étude et suivi pour la réussite de vos projets.',sub:'Nous accompagnons les entreprises, institutions et particuliers dans la conception et la mise en œuvre de leurs projets.',stats:[{n:'+100',l:'Projets accompagnés'},{n:'360°',l:'Suivi complet'},{n:'100%',l:'Solutions sur mesure'}],btn1:'Nos services',href1:'#services',btn2:'Parler à un expert',href2:'#contact'},
  {label:'ÉNERGIE SOLAIRE',img:'images/slide_solaire.jpg',lines:['ÉNERGIE','SOLAIRE','& VERTE'],body:'Solutions photovoltaïques pour particuliers et entreprises.',sub:'Conception et installation de systèmes solaires autonomes ou connectés au réseau, pour réduire votre facture énergétique à zéro.',stats:[{n:'0 FCFA',l:'Facture visée'},{n:'25 ans',l:'Durée de vie'},{n:'100%',l:'Énergie propre'}],btn1:'Nous contacter',href1:'#contact',btn2:'Voir les references',href2:'#refs'},
  {label:'AGRITECH & RURAL',img:'images/slide_agritech.jpg',lines:['AGRITECH','& DIGITAL','RURAL'],body:'Technologies agricoles pour le monde rural.',sub:'Déploiement de solutions numériques en zones rurales : capteurs IoT, applications de gestion agricole et formation des communautés locales.',stats:[{n:'+40',l:'Villages couverts'},{n:'12',l:'ONG partenaires'},{n:'2×',l:'Rendement moyen'}],btn1:'Nos services',href1:'#services',btn2:'Devenir partenaire',href2:'#contact'},
  {label:'BOUTIQUE TECH',img:'images/slide_informatique.png',lines:['BOUTIQUE','TECH &','CONSOMMABLES'],body:'Consommables et accessoires informatiques en stock.',sub:'Cartouches, câbles, périphériques et pièces détachées pour toutes marques. Livraison rapide sur Lomé avec tarifs professionnels.',stats:[{n:'+500',l:'Références en stock'},{n:'J+1',l:'Livraison Lomé'},{n:'Pro',l:'Tarifs négociés'}],btn1:'Nous contacter',href1:'#contact',btn2:'Voir la boutique',href2:'#produits'},
];
const grid=document.getElementById('hexGrid'),decor=document.getElementById('hexDecor'),defs=document.querySelector('defs');
const VB_W=600,VB_H=800,R=48,W=R*Math.sqrt(3),H=R*2,GAP=4,COLS=8,ROWS=9,OX=-20,OY=-20;
const ACCENTS={40:'var(--red)',46:'var(--blue)',10:'#14141C',14:'#14141C',15:'#14141C',13:'var(--blue)',12:'var(--red)',11:'var(--blue)'};
function pts(cx,cy,r){return Array.from({length:6},(_,i)=>{const a=Math.PI/180*(60*i-30);return`${(cx+r*Math.cos(a)).toFixed(2)},${(cy+r*Math.sin(a)).toFixed(2)}`}).join(' ')}
SLIDES.forEach((s,i)=>{const pat=document.createElementNS('http://www.w3.org/2000/svg','pattern');pat.setAttribute('id',`pat${i}`);pat.setAttribute('patternUnits','userSpaceOnUse');pat.setAttribute('x','-180');pat.setAttribute('y','50');pat.setAttribute('width','950');pat.setAttribute('height','700');const img=document.createElementNS('http://www.w3.org/2000/svg','image');img.setAttributeNS('http://www.w3.org/1999/xlink','href',s.img);img.setAttribute('x','0');img.setAttribute('y','0');img.setAttribute('width','950');img.setAttribute('height','700');img.setAttribute('preserveAspectRatio','xMidYMid slice');pat.appendChild(img);defs.appendChild(pat)});
let hexGroups=[],imgHexRects=[],mainCenters=[],hexIdx=0;
for(let row=0;row<ROWS;row++)for(let col=0;col<COLS;col++){const cx=col*(W+GAP)+(row%2===0?0:(W+GAP)/2)+R+OX,cy=row*(H*0.75+GAP*0.58)+R+OY,id=hexIdx,cid=`cp${hexIdx++}`,delay=(Math.random()*.8).toFixed(2),dur=(.3+Math.random()*.2).toFixed(2);mainCenters.push({cx,cy});const cp=document.createElementNS('http://www.w3.org/2000/svg','clipPath');cp.setAttribute('id',cid);const pl=document.createElementNS('http://www.w3.org/2000/svg','polygon');pl.setAttribute('points',pts(cx,cy,R-2));cp.appendChild(pl);defs.appendChild(cp);const g=document.createElementNS('http://www.w3.org/2000/svg','g');g.setAttribute('data-cx',cx.toFixed(2));g.setAttribute('data-cy',cy.toFixed(2));g.setAttribute('data-idx',id);g.setAttribute('clip-path',`url(#${cid})`);g.style.cssText=`opacity:0;transform:scale(.82);transform-origin:${cx.toFixed(2)}px ${cy.toFixed(2)}px;transition:opacity ${dur}s ease ${delay}s,transform ${dur}s ease ${delay}s`;if(ACCENTS[id]){const r2=document.createElementNS('http://www.w3.org/2000/svg','polygon');r2.setAttribute('points',pts(cx,cy,R-2));r2.setAttribute('fill',ACCENTS[id]);g.appendChild(r2)}else{const rect=document.createElementNS('http://www.w3.org/2000/svg','rect');rect.setAttribute('x',(cx-R).toFixed(2));rect.setAttribute('y',(cy-R).toFixed(2));rect.setAttribute('width',(R*2).toFixed(2));rect.setAttribute('height',(R*2).toFixed(2));rect.setAttribute('fill','url(#pat0)');g.appendChild(rect);imgHexRects.push(rect);g.classList.add('img-hex')}grid.appendChild(g);hexGroups.push(g);const bd=document.createElementNS('http://www.w3.org/2000/svg','polygon');bd.setAttribute('points',pts(cx,cy,R-2));bd.setAttribute('fill','none');bd.setAttribute('stroke','rgba(255,255,255,0.07)');bd.setAttribute('stroke-width','1');grid.appendChild(bd)}
const DECOR_W=['rgba(255,255,255,0.10)','rgba(255,255,255,0.10)','rgba(255,255,255,0.06)','var(--red)','var(--blue)','rgba(255,255,255,0.06)'];
const gMinX=Math.min(...mainCenters.map(c=>c.cx))-R,gMaxX=Math.max(...mainCenters.map(c=>c.cx))+R,gMinY=Math.min(...mainCenters.map(c=>c.cy))-R,gMaxY=Math.max(...mainCenters.map(c=>c.cy))+R;
function overlaps(cx,cy){const i=R*.4;return cx>gMinX+i&&cx<gMaxX-i&&cy>gMinY+i&&cy<gMaxY-i}
const DCOLS=Math.ceil(VB_W/(W+GAP))+2,DROWS=Math.ceil(VB_H/(H*.75+GAP*.58))+2,DOX=OX-(W+GAP),DOY=OY-(H*.75+GAP*.58);let ds=0;
for(let row=-1;row<DROWS;row++)for(let col=-1;col<DCOLS;col++){const cx=col*(W+GAP)+(row%2===0?0:(W+GAP)/2)+R+DOX,cy=row*(H*.75+GAP*.58)+R+DOY;if(cx<-R||cx>VB_W+R||cy<-R||cy>VB_H+R)continue;if(overlaps(cx,cy))continue;ds++;const delay=(Math.random()*1).toFixed(2),dur=(.3+Math.random()*.28).toFixed(2),fill=DECOR_W[ds%DECOR_W.length];const poly=document.createElementNS('http://www.w3.org/2000/svg','polygon');poly.setAttribute('points',pts(cx,cy,R-3));poly.setAttribute('fill',fill);poly.style.cssText=`opacity:0;transform:scale(.7);transform-origin:${cx.toFixed(2)}px ${cy.toFixed(2)}px;transition:opacity ${dur}s ease ${delay}s,transform ${dur}s ease ${delay}s`;decor.appendChild(poly);const border=document.createElementNS('http://www.w3.org/2000/svg','polygon');border.setAttribute('points',pts(cx,cy,R-3));border.setAttribute('fill','none');border.setAttribute('stroke','rgba(255,255,255,0.06)');border.setAttribute('stroke-width','1');decor.appendChild(border)}
const fullBgLayer=document.createElementNS('http://www.w3.org/2000/svg','g');hcSvg.insertBefore(fullBgLayer,document.getElementById('hexDecor'));
const fullBgRect=document.createElementNS('http://www.w3.org/2000/svg','rect');fullBgRect.setAttribute('x','0');fullBgRect.setAttribute('y','0');fullBgRect.setAttribute('width','600');fullBgRect.setAttribute('height','800');fullBgRect.setAttribute('fill','#14141C');fullBgLayer.appendChild(fullBgRect);
const fullImg=document.createElementNS('http://www.w3.org/2000/svg','image');fullImg.setAttribute('x','-180');fullImg.setAttribute('y','50');fullImg.setAttribute('width','950');fullImg.setAttribute('height','700');fullImg.setAttribute('preserveAspectRatio','xMidYMid slice');fullImg.style.opacity='0';fullBgLayer.appendChild(fullImg);
requestAnimationFrame(()=>requestAnimationFrame(()=>{document.querySelectorAll('#hexGrid g[data-idx],#hexDecor polygon[style]').forEach(g=>{g.style.opacity='1';g.style.transform='scale(1)'})}));
let currentSlide=0,isTransitioning=false;const INTERVAL=5000;let progressStart=null,progressRAF=null;
const heroContent=document.getElementById('heroContent');
SLIDES.forEach((s,i)=>{const div=document.createElement('div');div.className='content-slide'+(i===0?' active':' entering');div.innerHTML=`<p class="eyebrow"><span class="eyebrow-line"></span>${s.label}</p><h1 class="hero-title"><span class="tl">${s.lines[0]}</span><span class="tl">${s.lines[1]}</span><span class="tl">${s.lines[2]}</span></h1><div class="h-rule"></div><p class="hero-body">${s.body}</p><p class="hero-sub">${s.sub}</p><div class="stat-bar">${s.stats.map(st=>`<div class="stat-item"><div class="stat-num">${st.n}</div><div class="stat-lbl">${st.l}</div></div>`).join('')}</div><div class="hero-actions"><a href="${s.href1}" class="btn-p">${s.btn1}</a><a href="${s.href2}" class="btn-s">${s.btn2}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="13 6 19 12 13 18"/></svg></a></div>`;heroContent.appendChild(div)});
const dotsContainer=document.getElementById('slideDots');
SLIDES.forEach((_,i)=>{const btn=document.createElement('button');btn.className='slide-dot'+(i===0?' active':'');btn.setAttribute('aria-label',`Slide ${i+1}`);btn.addEventListener('click',()=>{if(!isTransitioning)goToSlide(i)});dotsContainer.appendChild(btn)});
function honeycombDissolve(next){const imgHexes=hexGroups.filter(g=>g.classList.contains('img-hex'));const cxAll=imgHexes.map(g=>parseFloat(g.getAttribute('data-cx'))),cyAll=imgHexes.map(g=>parseFloat(g.getAttribute('data-cy')));const cx0=cxAll.reduce((a,b)=>a+b,0)/cxAll.length,cy0=cyAll.reduce((a,b)=>a+b,0)/cyAll.length;const wd=imgHexes.map(g=>({g,dist:Math.sqrt((parseFloat(g.getAttribute('data-cx'))-cx0)**2+(parseFloat(g.getAttribute('data-cy'))-cy0)**2)}));const mx=Math.max(...wd.map(d=>d.dist)),FO=700;wd.forEach(({g,dist})=>{const t=dist/mx;setTimeout(()=>{g.style.transition=`opacity ${180+t*120}ms cubic-bezier(.4,0,.6,1)`;g.style.opacity='0'},t*FO*.65)});setTimeout(()=>{fullImg.setAttributeNS('http://www.w3.org/1999/xlink','href',SLIDES[currentSlide].img);fullImg.style.transition='opacity 0.25s ease';fullImg.style.opacity='1'},60);setTimeout(()=>{fullImg.setAttributeNS('http://www.w3.org/1999/xlink','href',SLIDES[next].img);imgHexRects.forEach(r=>r.setAttribute('fill',`url(#pat${next})`))},FO*.65);const RS=FO*.75,RD=750;wd.forEach(({g,dist})=>{const t=1-dist/mx;setTimeout(()=>{g.style.transition=`opacity ${220+t*160}ms cubic-bezier(.22,1,.36,1)`;g.style.opacity='1'},RS+t*RD*.55)});setTimeout(()=>{fullImg.style.transition='opacity 0.3s ease';fullImg.style.opacity='0'},RS+RD*.85)}
function goToSlide(next){if(next===currentSlide||isTransitioning)return;isTransitioning=true;const slides=heroContent.querySelectorAll('.content-slide'),dots=dotsContainer.querySelectorAll('.slide-dot');slides[currentSlide].classList.remove('active');slides[currentSlide].classList.add('leaving');slides[next].classList.remove('entering');slides[next].classList.add('active');honeycombDissolve(next);dots[currentSlide].classList.remove('active');dots[next].classList.add('active');const prev=currentSlide;currentSlide=next;setTimeout(()=>{slides[prev].classList.remove('leaving');slides[prev].classList.add('entering');isTransitioning=false},1700);resetProgress()}
const progressFill=document.getElementById('progressFill');
function resetProgress(){progressFill.style.transition='none';progressFill.style.width='0%';progressStart=performance.now();cancelAnimationFrame(progressRAF);runProgress()}
function runProgress(){progressRAF=requestAnimationFrame(ts=>{if(!progressStart)progressStart=ts;const pct=Math.min(((ts-progressStart)/INTERVAL)*100,100);progressFill.style.width=pct+'%';if(pct<100)runProgress();else goToSlide((currentSlide+1)%SLIDES.length)})}
setTimeout(resetProgress,500);
const navAnchors=[...document.querySelectorAll('#navLinks > li > a:first-child')];
const sectionIds=['about','services','projets','refs','produits','contact'];
const sections=sectionIds.map(id=>document.getElementById(id)).filter(Boolean);
const spyIO=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){const id='#'+e.target.id;navAnchors.forEach(a=>a.classList.toggle('active',a.getAttribute('href')===id))}});},{rootMargin:'-35% 0px -55% 0px'});
sections.forEach(s=>spyIO.observe(s));
const burger=document.getElementById('burger'),navLinks=document.getElementById('navLinks');
burger.addEventListener('click',()=>{const o=navLinks.classList.toggle('open');burger.classList.toggle('open',o)});
document.querySelectorAll('#navLinks a').forEach(a=>a.addEventListener('click',()=>{navLinks.classList.remove('open');burger.classList.remove('open')}));
document.querySelectorAll('a[href^="#"]').forEach(a=>{a.addEventListener('click',e=>{const h=a.getAttribute('href');const t=document.querySelector(h);if(t&&h!=='#hero'){e.preventDefault();t.scrollIntoView({behavior:'smooth',block:'start'})}else if(h==='#hero'){e.preventDefault();window.scrollTo({top:0,behavior:'smooth'})}})});
const animEls=[...document.querySelectorAll('.rv,.rv-left,.rv-right,.rv-scale,.rv-clip,.rv-line')];
const triggered=new WeakSet();
function checkReveal(){const vh=window.innerHeight;animEls.forEach(el=>{if(triggered.has(el))return;const r=el.getBoundingClientRect();if(r.top<vh*.88&&r.bottom>0){triggered.add(el);requestAnimationFrame(()=>el.classList.add('in'))}})}
window.addEventListener('scroll',checkReveal,{passive:true});
setTimeout(checkReveal,150);
const pushUpSets=[{selector:'#contactFormBox',stagger:0,offset:.75}];
const pushedUp=new WeakSet();
function checkPushUp(){const vh=window.innerHeight;pushUpSets.forEach(({selector,stagger,offset})=>{[...document.querySelectorAll(selector)].forEach((el,i)=>{if(pushedUp.has(el))return;const r=el.getBoundingClientRect();if(r.top<vh*offset&&r.bottom>0){pushedUp.add(el);setTimeout(()=>el.classList.add('up'),i*stagger)}})})}
window.addEventListener('scroll',checkPushUp,{passive:true});
setTimeout(checkPushUp,200);
document.querySelectorAll('img').forEach(img=>{const done=()=>img.classList.add('loaded');if(img.complete&&img.naturalWidth)done();else img.addEventListener('load',done,{once:true})});
const refsTrack=document.querySelector('.refs-track');
if(refsTrack&&!refsTrack.dataset.cloned){refsTrack.innerHTML+=refsTrack.innerHTML;refsTrack.dataset.cloned='true'}
const aboutParallax=document.getElementById('aboutParallax');
function updateEditorialMotion(){
  const vh=window.innerHeight;
  if(aboutParallax){const section=document.getElementById('about');const rect=section.getBoundingClientRect();const total=Math.max(1,rect.height-vh*.55);const p=Math.max(0,Math.min(1,(vh*.62-rect.top)/total));aboutParallax.style.setProperty('--about-img-y',((p-.5)*-14).toFixed(1)+'px');}
}
window.addEventListener('scroll',updateEditorialMotion,{passive:true});
window.addEventListener('resize',updateEditorialMotion);
setTimeout(updateEditorialMotion,180);
const form=document.getElementById('contactForm'),formNote=document.getElementById('formNote');
if(form){form.addEventListener('submit',e=>{e.preventDefault();if(!form.checkValidity()){form.reportValidity();return}formNote.classList.add('show');setTimeout(()=>{form.reset();setTimeout(()=>formNote.classList.remove('show'),6000)},300)})}
document.getElementById('year').textContent=new Date().getFullYear();
})();


(function(){
'use strict';

// ════════════════════════════════════════════
//  SERVICES  —  Sakazuki-style sticky panels
//  Each panel is position:sticky (full-height).
//  A small #sv-spacer sits below them.
//  Everything is driven directly by real scroll position every frame
//  (--entry / --cover / --wobble custom properties) — no fixed-duration
//  CSS transition/animation for the entrance, so the card's look is
//  ALWAYS exactly what the scroll position says it should be: no lag,
//  never "freezes" later than the scroll amount that produced it.
// ════════════════════════════════════════════

const panels    = Array.from(document.querySelectorAll('.sv-panel'));
const labelWrap = document.querySelector('.sv-label-wrap');
const spacer    = document.getElementById('sv-spacer');

if (!panels.length || !spacer) return;

// Each panel gets a progress fill; we update it on scroll
const fills = panels.map(p => p.querySelector('.sv-progress-fill'));

// Detect when services section is in view → show/hide label
const sectionObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (labelWrap) labelWrap.classList.toggle('sv-visible', e.isIntersecting);
  });
}, { threshold: 0.01 });
sectionObs.observe(document.getElementById('services'));

// rAF-throttled so getBoundingClientRect() reads never pile up mid-scroll
// (unthrottled reads here were forcing layout on every scroll event —
// that's what made the page feel unstable).
let svTicking = false;
function onScroll() {
  if (svTicking) return;
  svTicking = true;
  requestAnimationFrame(() => {
    updateSvProgress();
    svTicking = false;
  });
}

// Header height (nav is position:fixed, panels pin just below it — read the
// CSS var so this stays in sync with the mobile breakpoint override).
let navH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 68;
window.addEventListener('resize', () => {
  navH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 68;
}, { passive: true });

function updateSvProgress() {
  if (!spacer) return;
  const vh    = window.innerHeight;
  const avail = Math.max(1, vh - navH); // usable height below the fixed header
  const n     = panels.length;

  panels.forEach((panel, i) => {
    const rect = panel.getBoundingClientRect();

    // entry: 0 → 1 as the panel's own top rises from the bottom of the
    // viewport up to navH (the exact instant it becomes sticky-pinned,
    // right BELOW the header — not behind it). Real scroll position,
    // not a timer — the card is fully "arrived" exactly when the scroll
    // amount says it should be, with its margin/notch visible under the nav.
    const entryT = Math.max(0, Math.min(1, 1 - (rect.top - navH) / avail));

    // cover: 0 → 1 as the NEXT panel rises up to cover this one.
    // Also reused below for the progress-fill bar.
    let coverT = 0;
    let fillT  = 0;
    if (i < n - 1) {
      const nextRect = panels[i + 1].getBoundingClientRect();
      coverT = 1 - Math.max(0, Math.min(1, (nextRect.top - navH) / avail));
      fillT  = coverT;
    } else {
      const sRect = spacer.getBoundingClientRect();
      const total = Math.max(1, spacer.offsetHeight);
      fillT = Math.max(0, Math.min(1, (vh - sRect.top) / total));
    }

    // tilt: only for panel 2 — it rises very slightly rotated (like a card
    // being flopped into place) and straightens to exactly 0deg by the time
    // entryT reaches 1. Matches the sakazuki.io Benefits reference, where
    // the incoming card visibly tilts before settling flat — never a
    // left/right shake, a single settle.
    let tilt = 0;
    if (panel.id === 'sv2') {
      tilt = (1 - entryT) * (1 - entryT) * -3.2;
    }

    panel.style.setProperty('--entry', entryT.toFixed(4));
    panel.style.setProperty('--cover', coverT.toFixed(4));
    panel.style.setProperty('--tilt', tilt.toFixed(3) + 'deg');

    // IMPORTANT: .sv-card declares its own local --entry/--cover/--tilt
    // defaults in CSS (so it has a safe fallback before JS runs). That
    // local declaration means .sv-card no longer *inherits* the values
    // set above on its parent .sv-panel — a directly-declared custom
    // property always wins over an inherited one, even if the ancestor's
    // value changes. So we set the same values directly on .sv-card too,
    // otherwise it stays permanently stuck at its CSS defaults (invisible).
    const card = panel.querySelector('.sv-card');
    if (card) {
      card.style.setProperty('--entry', entryT.toFixed(4));
      card.style.setProperty('--cover', coverT.toFixed(4));
      card.style.setProperty('--tilt', tilt.toFixed(3) + 'deg');
    }

    if (fills[i]) {
      fills[i].style.setProperty('--fill', (fillT * 100) + '%');
    }
  });
}

window.addEventListener('scroll', onScroll, { passive: true });
updateSvProgress();

})();




(function(){
  const section  = document.getElementById('produits');
  const viewport = document.getElementById('catViewport');
  const stage     = document.getElementById('catStage');
  const typeLayer  = document.getElementById('catTypeLayer');
  const itemsLayer = document.getElementById('catItemsLayer');
  const items       = Array.from(itemsLayer.querySelectorAll('.cat-item'));
  const catNow      = document.getElementById('catNow');
  const progressFill = document.getElementById('catProgressFill');
  const hint        = document.getElementById('catHint');

  const mq = window.matchMedia('(min-width: 900px)');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let enabled = mq.matches;
  let targetX = 0, currentX = 0;
  let parTX = 0, parTY = 0, parX = 0, parY = 0;
  let maxRange = 0;
  let hasInteracted = false;
  let dragging = false, lastPointerX = 0;

  function measure(){
    if (!enabled) { maxRange = 0; return; }
    maxRange = Math.max(0, stage.scrollWidth - window.innerWidth);
  }
  function markInteracted(){
    if (hasInteracted) return;
    hasInteracted = true;
    hint.classList.add('is-hidden');
  }
  function updateActiveIndex(){
    const center = currentX + window.innerWidth / 2;
    let closest = 0, dist = Infinity;
    items.forEach((it, i) => {
      const mid = it.offsetLeft + it.offsetWidth / 2;
      const d = Math.abs(mid - center);
      if (d < dist) { dist = d; closest = i; }
    });
    catNow.textContent = String(closest + 1).padStart(2, '0');
  }
  function handleScroll(){
    if (!enabled) return;
    const total = section.offsetHeight - window.innerHeight;
    if (total <= 0) { targetX = 0; return; }
    const progress = Math.min(1, Math.max(0, -section.getBoundingClientRect().top / total));
    targetX = progress * maxRange;
    if (progressFill && maxRange > 0) {
      progressFill.style.left = `calc(${progress * 100}% - ${progress * 34}px)`;
    }
    updateActiveIndex();
    const rect = section.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0 && progress > 0.01) markInteracted();
  }
  let catResizeTimer = null;
  window.addEventListener('scroll', handleScroll, { passive:true });
  window.addEventListener('resize', () => {
    clearTimeout(catResizeTimer);
    catResizeTimer = setTimeout(() => { enabled = mq.matches; measure(); handleScroll(); }, 150);
  });
  window.addEventListener('orientationchange', () => {
    setTimeout(() => { enabled = mq.matches; measure(); handleScroll(); }, 250);
  });
  viewport.addEventListener('mousemove', (e) => {
    const rect = viewport.getBoundingClientRect();
    parTX = ((e.clientX - rect.left) / rect.width - 0.5) * -32;
    parTY = ((e.clientY - rect.top) / rect.height - 0.5) * -18;
  });
  viewport.addEventListener('mouseleave', () => { parTX = 0; parTY = 0; });
  viewport.addEventListener('pointerdown', (e) => {
    if (!enabled) return;
    dragging = true; lastPointerX = e.clientX;
    try { viewport.setPointerCapture(e.pointerId); } catch(err) {}
  });
  viewport.addEventListener('pointermove', (e) => {
    if (!dragging || !enabled) return;
    const dx = e.clientX - lastPointerX;
    lastPointerX = e.clientX;
    if (Math.abs(dx) > 0.5) { markInteracted(); window.scrollBy({ top: -dx * 2.4 }); }
  });
  window.addEventListener('pointerup', () => { dragging = false; });
  window.addEventListener('pointercancel', () => { dragging = false; });
  section.addEventListener('wheel', () => markInteracted(), { passive:true });
  window.addEventListener('keydown', (e) => {
    const rect = section.getBoundingClientRect();
    const inView = rect.top < window.innerHeight * 0.5 && rect.bottom > window.innerHeight * 0.5;
    if (!inView || !enabled) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); markInteracted(); window.scrollBy({ top: 90, behavior:'smooth' }); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); markInteracted(); window.scrollBy({ top: -90, behavior:'smooth' }); }
  });
  function loop(){
    currentX += (targetX - currentX) * 0.16;
    parX += (parTX - parX) * 0.08;
    parY += (parTY - parY) * 0.08;
    if (Math.abs(targetX - currentX) < 0.05) currentX = targetX;
    stage.style.transform     = `translate3d(${-currentX}px,0,0)`;
    typeLayer.style.transform  = `translate3d(${parX * 0.35}px, ${parY * 0.35}px, 0)`;
    itemsLayer.style.transform = `translate3d(${parX * 0.6}px, ${parY * 0.6}px, 0)`;
    requestAnimationFrame(loop);
  }
  measure(); handleScroll();
  if (!reduceMotion) { requestAnimationFrame(loop); }
  else { stage.style.transform = 'translate3d(0,0,0)'; }
})();

/* ── FORMULAIRE CORRIGÉ ── */
(function () {
  'use strict';

  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');
  if (!form || !note) return;

  // Supprime l'ancien listener submit (défini plus haut) en clonant le nœud
  const freshForm = form.cloneNode(true);
  form.parentNode.replaceChild(freshForm, form);

  const f   = document.getElementById('contactForm');
  const n   = document.getElementById('formNote');
  const btn = f.querySelector('.btn-submit');

  const ORIGINAL_TEXT = 'Envoyer la demande →';
  const LOADING_TEXT  = 'Envoi en cours…';

  f.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!f.checkValidity()) { f.reportValidity(); return; }

    // ✅ État bouton géré ICI, dans le handler, pas au chargement
    btn.disabled    = true;
    btn.textContent = LOADING_TEXT;
    n.classList.remove('show');

    try {
      const formData = new FormData(f);
      const payload  = Object.fromEntries(formData.entries());

      const response = await fetch('/api/contact', {
        method  : 'POST',
        headers : { 'Content-Type': 'application/json' },
        body    : JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      n.textContent = data.message || (data.success
        ? '✓ Votre demande a été envoyée avec succès.'
        : 'Une erreur est survenue. Veuillez réessayer.');
      n.classList.add('show');

      if (data.success) {
        f.reset();
        setTimeout(() => n.classList.remove('show'), 8000);
      }

    } catch (err) {
      n.textContent = '⚠ Impossible de joindre le serveur. Appelez-nous au +228 99 26 96 29.';
      n.classList.add('show');
      console.error('[contact form]', err);

    } finally {
      // ✅ Réactivé TOUJOURS, même en cas d'erreur
      btn.disabled    = false;
      btn.textContent = ORIGINAL_TEXT;
    }
  });
})();
const form = document.getElementById('contactForm');
const note = document.getElementById('formNote');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const payload  = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (data.success) {
            note.textContent = data.message;
            note.classList.add('show');
            form.reset();
        } else {
            note.textContent = data.message;
            note.classList.add('show');
        }

    } catch (error) {
        note.textContent = "Erreur lors de l'envoi.";
        note.classList.add('show');
    }
});


// ── PRIVACY MODAL + COOKIE BANNER ──
(function(){
  const modal    = document.getElementById('privacyModal');
  const opener   = document.getElementById('openPrivacy');
  const closer   = document.getElementById('closePrivacy');
  const banner   = document.getElementById('cookieBanner');
  const ckMore   = document.getElementById('ckMore');
  const ckAccept = document.getElementById('ckAccept');

  function openModal(){
    modal.classList.add('open');
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
    closer.focus();
  }
  function closeModal(){
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  }

  if(opener) opener.addEventListener('click', e => { e.preventDefault(); openModal(); });
  if(closer) closer.addEventListener('click', closeModal);
  if(modal)  modal.addEventListener('click', e => { if(e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => {
    if(e.key === 'Escape' && modal && modal.classList.contains('open')) closeModal();
  });

  const COOKIE_KEY = 'sig_cookies_accepted';

  function acceptCookies(){
    localStorage.setItem(COOKIE_KEY, '1');
    banner.classList.remove('visible');
    banner.classList.add('hidden');
    banner.setAttribute('aria-hidden','true');
  }

  if(banner && !localStorage.getItem(COOKIE_KEY)){
    setTimeout(() => {
      banner.classList.add('visible');
      banner.setAttribute('aria-hidden','false');
    }, 1200);
  } else if(banner){
    banner.classList.add('hidden');
  }

  if(ckAccept) ckAccept.addEventListener('click', acceptCookies);
  if(ckMore)   ckMore.addEventListener('click', () => { acceptCookies(); openModal(); });

})();