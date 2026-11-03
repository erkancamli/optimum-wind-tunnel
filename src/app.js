(function(){
'use strict';
const $=id=>document.getElementById(id);
const W=1000,H=520,GW=250,GH=130,CELL=4;
const SIZES=[131072,262144,524288,1048576,2097152,4194304];
const fmtB=b=>b>=1048576?(b/1048576)+' MB':(b/1024)+' KB';
const PX=128, BYTES=PX*PX*3;

// ---------- i18n ----------
const TR={
 sub:'Bir blok Virginia\'dan çıkıyor ve dünyanın dört bir yanındaki 159 düğüm, validator\'lar oy vermeden önce ona ulaşmak için yarışıyor. libp2p Gossipsub ile Optimum\'un mump2p\'sinin aynı ağ üzerinde bloğu nasıl taşıdığını izle, sonra o ağı boz ve kimin hâlâ zamanında yetiştiğini gör.',
 tourBtn:'▶ 60 saniyelik turu başlat', eyebrow:'mump2p ve Gossipsub · etkileşimli simülasyon', tourSub:'7 kısa adım. İstediğin an durabilirsin.', vT:'Yan yana', share:'X\'te paylaş', gsub:'Bugünkü Ethereum. Her atlamada bloğun tamamını bekler.', msub:'Optimum. Bloğu kodlar ve ilk sharddan itibaren aktarır.', recT:'Uçuş kaydı', c2x:'Bir senaryo dene', labT:'Laboratuvar ayarları', labS:'meraklısı için',
 close:'Kapat', back:'Geri', next:'İleri',
 fan:'hayran yapımı · resmi bir Optimum ürünü değil', sound:'♪ Dinle', dark:'Koyu', light:'Açık',
 lede:'Aynı Dünya. Aynı kablolar. Aynı blok. <em>Onu taşımanın iki yolu.</em>',
 c1:'Senin bloğun', drop:'Buraya bir resim bırak ya da', pick:'dosya seç', kL:'Blok başına shard (k)',
 c2:'Bir senaryo dene', bL:'Blok boyutu', lL:'Bağlantı başına paket kaybı', pL:'Bloğun yayınlandığı an', betaL:'Eş başına shard bütçesi (β)',
 betaN:'β bant genişliği ile hızı takas eder: her aktarıcı bir eşe, istenmeden önce en fazla β·k/D taze kombinasyon sunar.',
 c3:'Sabotaj', cutN:'Bir kablo koridorunu buradan ya da haritadan kes. O koridordan geçen tüm eş bağlantıları kararır.',
 darkN:'Bir şehri karartmak için haritada düğümlerinden birine tıkla, sonra sondanın altındaki düğmeyi kullan.', _oldDarkN:'Bir şehri karartmak için düğümlerinden birine tıkla ve sağdaki sondadaki düğmeyi kullan.',
 vD:'Kim nerede kazanıyor', hint:'Bir düğümü incelemek için herhangi bir noktaya tıkla · kablo koridorunu kesmek için ✂ işaretine tıkla', _oldHint:'Düğüme tıkla, sonda ile incele · koridoru kesmek için ✂ rozetine tıkla',
 rlnc:'RLNC shardları', full:'tam blok', probe:'Sonda: tek bir düğümün içi', rankL:'Bağımsız shard (rank)',
 mxN:'Solda bu düğümün elindeki karıştırma tarifleri, çözülebildiği kadar çözülmüş hâlde. Temiz bir köşegen oluştuğunda bloğun her parçası geri kazanılmış demektir.', _oldMxN:'Solda bu düğümün elindeki katsayı matrisi, GF(2⁸) üzerinde basamak formuna indirgenmiş hâli. Köşegende tek parlak pikseller varsa her parça çözülmüş demektir.',
 feedT:'Buraya gelen shardlar',
 h1:'Burada gerçek olan ne',
 r1:'<b>Kodlama.</b> Her shard GF(2⁸) üzerinde rastgele bir katsayı vektörü taşır. Aktarıcılar önce çözmeden, ellerindekini karıştırarak yeniden kodlar. Sonda, Gauss eliminasyonunu dosyanın gerçek baytları üzerinde çalıştırır.',
 r2:'<b>Coğrafya.</b> Düğümler, Ethereum düğümlerinin yoğunlaştığı yerlere göre ağırlıklandırılmış 38 barındırma merkezinde. Gecikme, büyük daire mesafesi × 1,5, fiberde milisaniyede 200 km ile hesaplanır.',
 r3:'<b>Bant genişliği.</b> Düğümlerin %20\'si 1 Gbps, %80\'i 50 Mbps. OptimumP2P makalesinin Ethshadow testlerinde kullandığı dağılımın aynısı.',
 r4:'<b>Adalet.</b> İki protokol de aynı eşleri, aynı bağlantıları, aynı kaybı ve aynı güvenilir taşıma katmanını kullanır. Kaybolan paket ikisinde de yeniden gönderim ister. Kodlama, düğüm hiçbir zaman belirli bir shardı beklemediği için öne geçer.',
 h2:'Her tarafın kuralları',
 g1:'<b>Gossipsub:</b> D = 6 mesh. Düğüm bloğu iletmeden önce tamamını almak zorunda. IDONTWANT kuyruktaki kopyaları iptal eder, 700 ms\'lik heartbeat ile IHAVE/IWANT mahsur kalan düğümleri kurtarır.',
 m1:'<b>mump2p:</b> Yayıncı, geliştirici varsayılanlarına uygun olarak 1,5·k kodlu shardı sırayla gönderir. Aktarıcılar ellerine ilk shard geçer geçmez taze yeniden kodlanmış shard iletir, çözünce IDONTWANT yollar, takılınca IWANT ile çeker.',
 x1:'<b>Modellenmeyenler:</b> doğrulama ve çözme için CPU, QUIC, eş puanlama, imza kontrolleri ve gerçek mesh. Bu bir rüzgar tüneli, mainnet tekrarı değil.',
 h3:'Gerçek dünyada',
 w1:'mump2p, <b>20 Ekim 2026</b>\'da 16 operatörle Ethereum mainnet\'te canlıya geçti. <a href="https://chainwire.org/2026/10/20/optimum-launches-on-ethereum-mainnet-reaching-3-4b-in-total-value-boosted-across-leading-validators/" target="_blank" rel="noopener">Duyuru</a>',
 w2:'Lido\'nun bağımsız Hoodi testi: p95 blok varışı <b>1.614 ms\'den 1.207 ms\'ye</b>, geç bloklar %1,97\'den %0,34\'e indi, yanlış head oyları %45 azaldı. <a href="https://research.lido.fi/t/perch-request-for-node-operators-to-run-and-test-optimum-mump2p/11786" target="_blank" rel="noopener">Lido forumu</a>',
 w3:'Kablo senaryoları gerçek olaylardan esinlendi: Kasım 2024\'teki <a href="https://en.wikipedia.org/wiki/C-Lion1" target="_blank" rel="noopener">C-Lion1</a> Baltık kesintisi ve Eylül 2025\'te <a href="https://www.thenationalnews.com/future/technology/2025/09/07/middle-east-internet-slowdowns-could-last-months-after-red-sea-cable-damage" target="_blank" rel="noopener">Cidde açıklarındaki Kızıldeniz kesintileri</a>. Burada kesilen koridor, üzerinden geçen tüm bağlantıları düşürür; yani en kötü durum.',
 w4:'Protokol kaynakları: <a href="https://arxiv.org/abs/2508.04833" target="_blank" rel="noopener">OptimumP2P makalesi</a>, <a href="https://docs.getoptimum.xyz/docs/learn/overview/p2p" target="_blank" rel="noopener">mump2p dokümanları</a>, <a href="https://github.com/getoptimum/optimum-dev-setup-guide" target="_blank" rel="noopener">geliştirici varsayılanları</a>.',
 foot:'Optimum topluluğu için ecamli tarafından yapıldı. Bir simülasyondur, benchmark değildir.'
};
const EN={}; document.querySelectorAll('[data-i]').forEach(el=>{EN[el.dataset.i]=el.dataset.html?el.innerHTML:el.textContent});
let lang='en'; try{ if((localStorage.getItem('wt-lang')||(navigator.language||'').slice(0,2))==='tr') lang='tr'; }catch(e){}
const L=(en,tr)=>lang==='tr'?tr:en;
function applyLang(){
  document.documentElement.lang=lang;
  document.querySelectorAll('[data-i]').forEach(el=>{const v=lang==='tr'?(TR[el.dataset.i]??EN[el.dataset.i]):EN[el.dataset.i]; if(el.dataset.html) el.innerHTML=v; else el.textContent=v;});
  $('lEN').setAttribute('aria-pressed',lang==='en'); $('lTR').setAttribute('aria-pressed',lang==='tr');
  $('msg').placeholder=L('…or type a message','…ya da bir mesaj yaz');
  $('k').options[0].textContent=L('4 (mump2p dev default)','4 (mump2p geliştirici varsayılanı)');
  buildChips(); syncLabels(); writeVerdict(); legend(); inspector(true); if(typeof refreshTourText==='function') refreshTourText();
}
$('lEN').onclick=()=>{lang='en';try{localStorage.setItem('wt-lang','en')}catch(e){};applyLang()};
$('lTR').onclick=()=>{lang='tr';try{localStorage.setItem('wt-lang','tr')}catch(e){};applyLang()};

// ---------- theme ----------
let COL={};
function readCols(){const cs=getComputedStyle(document.documentElement);const get=n=>cs.getPropertyValue(n).trim();
  const hex=h=>{h=h.replace('#','');return [parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)]};
  ['bg','panel','line','line2','fg','mute','faint','land','ocean','m','m2','mdeep','g','g2','gdeep','late','dead','ok'].forEach(n=>{COL[n]=get('--'+n);COL[n+'_']=hex(COL[n])});
  }
function setTheme(t){ if(t) document.documentElement.setAttribute('data-theme',t); else document.documentElement.removeAttribute('data-theme');
  const cur=t||(matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');
  $('thD').setAttribute('aria-pressed',cur==='dark'); $('thL').setAttribute('aria-pressed',cur==='light'); readCols(); legend(); try{dirtyAll();PANES.forEach(p=>p.land=null)}catch(e){} }
$('thD').onclick=()=>setTheme('dark'); $('thL').onclick=()=>setTheme('light');
matchMedia('(prefers-color-scheme: light)').addEventListener?.('change',()=>{ if(!document.documentElement.hasAttribute('data-theme')) setTheme(null); });

// ---------- state ----------
const S={k:4,Bi:3,loss:0.5,pubAt:3000,beta:3,cut:new Set(),dark:new Set(),mode:'t',t:0,playing:true,speed:0.25,sel:null};
const net=buildNet(CITIES,{N:160,seed:7});
const NODES=net.nodes, N=NODES.length;
const PUB=NODES.findIndex(n=>n.c.n==='Ashburn'&&n.bw>10000);
const cityIdx=n=>CITIES.findIndex(c=>c.n===n);
let R=null; // results

// ---------- payload ----------
const srcCv=$('srcCv'), sctx=srcCv.getContext('2d',{willReadFrequently:true});
let SRC=new Uint8Array(BYTES);
const markPath=new Path2D(document.querySelector('.brand path').getAttribute('d'));
function drawDefault(text){
  const g=sctx.createLinearGradient(0,0,128,128); g.addColorStop(0,'#16181a'); g.addColorStop(1,'#5d6872');
  sctx.fillStyle=g; sctx.fillRect(0,0,128,128);
  for(let i=0;i<9;i++){sctx.strokeStyle='rgba(255,255,255,'+(0.05+i*0.012)+')';sctx.beginPath();sctx.arc(64,128,20+i*12,Math.PI,0);sctx.stroke()}
  sctx.save(); sctx.translate(30,18); sctx.scale(1.85,1.85); sctx.fillStyle='#fff'; sctx.fill(markPath); sctx.restore();
  sctx.fillStyle='#fff'; sctx.textAlign='center'; sctx.font='800 15px Geist, sans-serif';
  const words=(text||'SPEED IS MONEY').toUpperCase().split(/\s+/); let lines=[],cur='';
  for(const w of words){const tst=(cur?cur+' ':'')+w; if(sctx.measureText(tst).width>116&&cur){lines.push(cur);cur=w}else cur=tst} if(cur) lines.push(cur);
  lines=lines.slice(0,3); lines.forEach((l,i)=>sctx.fillText(l,64,92+i*16-(lines.length-1)*8));
  readSrc();
}
function readSrc(){const d=sctx.getImageData(0,0,128,128).data; for(let i=0,j=0;i<d.length;i+=4){SRC[j++]=d[i];SRC[j++]=d[i+1];SRC[j++]=d[i+2]} resetDec(); drawStripes(); inspector(true);}
function loadImg(file){const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const s=Math.min(im.width,im.height);sctx.drawImage(im,(im.width-s)/2,(im.height-s)/2,s,s,0,0,128,128);readSrc()};im.src=r.result};r.readAsDataURL(file)}
$('pick').onclick=()=>$('file').click(); $('file').onchange=e=>{if(e.target.files[0]) loadImg(e.target.files[0])};
const drop=$('drop'); ['dragenter','dragover'].forEach(t=>drop.addEventListener(t,e=>{e.preventDefault();drop.classList.add('over')}));
['dragleave','drop'].forEach(t=>drop.addEventListener(t,e=>{e.preventDefault();drop.classList.remove('over')}));
drop.addEventListener('drop',e=>{const f=e.dataTransfer.files[0]; if(f&&f.type.startsWith('image/')) loadImg(f)});
let msgT; $('msg').oninput=e=>{clearTimeout(msgT);msgT=setTimeout(()=>drawDefault(e.target.value.trim()||null),250)};
function drawStripes(){const k=S.k, el=$('stripes'); el.style.gridTemplateColumns='repeat('+Math.min(k,16)+',1fr)'; el.innerHTML='';
  for(let i=0;i<k;i++){const d=document.createElement('div');const o=(i*(BYTES/k))+((64/k|0)*128+64)*3;d.style.background='rgb('+SRC[o]+','+SRC[o+1]+','+SRC[o+2]+')';el.appendChild(d)}
  $('fragNote').textContent=L(`This picture rides along as the block's content. It is cut into ${k} pieces, and every node must collect ${k} independent coded shards to rebuild it.`,`Bu resim bloğun içeriği olarak yolculuk ediyor. ${k} parçaya bölünüyor ve her düğüm onu geri kurmak için ${k} bağımsız kodlu shard toplamak zorunda.`);}

// ---------- controls ----------
const SCEN_D={calm:['An ordinary day: 1 MB block, light packet loss.','Sıradan bir gün: 1 MB blok, hafif paket kaybı.'],red:['Every Europe to Asia link that rides the Red Sea is gone, like the Sep 2025 cuts near Jeddah.','Kızıldeniz\'den geçen tüm Avrupa Asya bağlantıları gitti, Eylül 2025\'teki Cidde kesintileri gibi.'],baltic:['Finland and Sweden lose their direct links to Central Europe, like the C-Lion1 cut in Nov 2024.','Finlandiya ve İsveç Orta Avrupa\'ya doğrudan bağlantılarını kaybediyor, Kasım 2024\'teki C-Lion1 kesintisi gibi.'],islands:['Both oceans cut: the Americas only reach the rest of the world through Latin America.','İki okyanus da kesik: Amerika dünyanın geri kalanına yalnızca Latin Amerika üzerinden ulaşıyor.'],dc:['A thought experiment: two big hosting regions go dark at once.','Bir düşünce deneyi: iki büyük barındırma bölgesi aynı anda kararıyor.'],storm:['5% of packets are lost on every link. Both sides must retransmit.','Her bağlantıda paketlerin %5\'i kayboluyor. İki taraf da yeniden göndermek zorunda.'],blob:['A 4 MB block, roughly a blob heavy slot.','4 MB\'lık bir blok, kabaca blob yüklü bir slot.']};
const SCEN=[
 {id:'calm',en:'Calm day',tr:'Sakin gün',set:{Bi:3,loss:0.5,cut:[],dark:[]}},
 {id:'red',en:'Red Sea cut',tr:'Kızıldeniz kesildi',set:{Bi:3,loss:1,cut:['RS'],dark:[]}},
 {id:'baltic',en:'Baltic cut',tr:'Baltık kesildi',set:{Bi:3,loss:1,cut:['BA'],dark:[]}},
 {id:'islands',en:'Americas cut off',tr:'Amerika koptu',set:{Bi:3,loss:1,cut:['TA','TP'],dark:[]}},
 {id:'dc',en:'Hetzner regions dark (what if)',tr:'Hetzner bölgeleri karanlık (varsayım)',set:{Bi:3,loss:1,cut:[],dark:['Falkenstein','Helsinki']}},
 {id:'storm',en:'Lossy internet (5%)',tr:'Kayıplı internet (%5)',set:{Bi:3,loss:5,cut:[],dark:[]}},
 {id:'blob',en:'4 MB blob-heavy block',tr:'4 MB blob yüklü blok',set:{Bi:5,loss:1,cut:[],dark:[]}},
];
function buildChips(){
  const sc=$('scen'); sc.innerHTML=''; $('scenNote').textContent=L('Custom settings. Pick a scenario to reset.','Özel ayarlar. Sıfırlamak için bir senaryo seç.');
  for(const s of SCEN){const b=document.createElement('button');b.className='chip scen';b.textContent=L(s.en,s.tr);
    const m=s.set; const match=S.Bi===m.Bi&&S.loss===m.loss&&S.cut.size===m.cut.length&&m.cut.every(c=>S.cut.has(c))&&S.dark.size===m.dark.length&&m.dark.every(c=>S.dark.has(cityIdx(c)));
    b.setAttribute('aria-pressed',match); if(match) $('scenNote').textContent=L(...SCEN_D[s.id]);
    b.onclick=()=>{try{history.replaceState(null,'','#'+s.id)}catch(e){location.hash=s.id};S.Bi=m.Bi;S.loss=m.loss;S.cut=new Set(m.cut);S.dark=new Set(m.dark.map(cityIdx));$('B').value=S.Bi;$('loss').value=S.loss;rerun()}; sc.appendChild(b)}
  const cu=$('cuts'); cu.innerHTML='';
  for(const id in CORRIDORS){const b=document.createElement('button');b.className='chip';b.textContent='✂ '+CORRIDORS[id][lang];b.setAttribute('aria-pressed',S.cut.has(id));
    b.onclick=()=>{S.cut.has(id)?S.cut.delete(id):S.cut.add(id);rerun()}; cu.appendChild(b)}
  const dl=$('darkList'); dl.innerHTML='';
  for(const ci of S.dark){const b=document.createElement('button');b.className='chip';b.setAttribute('aria-pressed','true');b.textContent=CITIES[ci].n;b.title=L('Restore','Geri aç');
    b.onclick=()=>{S.dark.delete(ci);rerun()}; dl.appendChild(b)}
}
function syncLabels(){
  $('kV').textContent=S.k; $('bV').textContent=fmtB(SIZES[S.Bi]); $('lV').textContent=S.loss+' %';
  $('pV').textContent=(S.pubAt/1000).toFixed(2).replace('.',lang==='tr'?',':'.')+(lang==='tr'?' sn':' s'); $('betaV').textContent=S.beta.toFixed(1);
}
$('k').onchange=e=>{S.k=+e.target.value;resetDec();drawStripes();rerun()};
$('B').oninput=e=>{S.Bi=+e.target.value;syncLabels();rerunSoon()};
$('loss').oninput=e=>{S.loss=+e.target.value;syncLabels();rerunSoon()};
$('pubAt').oninput=e=>{S.pubAt=+e.target.value;syncLabels();writeVerdict();dirtyAll();drawBarcode()};
$('beta').oninput=e=>{S.beta=+e.target.value;syncLabels();rerunSoon()};
$('speed').onchange=e=>{S.speed=+e.target.value};
const budget=()=>4000-S.pubAt;
let rt; function rerunSoon(){clearTimeout(rt);rt=setTimeout(rerun,140)}

// ---------- simulation + post-processing ----------
function post(res,proto){
  const shard=Math.ceil(SIZES[S.Bi]/S.k)+S.k, size=proto==='g'?SIZES[S.Bi]:shard;
  const ev=res.ev.slice().sort((a,b)=>a.ts-b.ts);
  const byTa=res.ev.slice().sort((a,b)=>a.ta-b.ta);
  const tsArr=Float64Array.from(ev,e=>e.ts); const wasteCum=new Uint32Array(ev.length+1);
  ev.forEach((e,i)=>wasteCum[i+1]=wasteCum[i]+(e.k>0&&e.k<4?1:0));
  const fin=[...res.T].filter((x,i)=>x<Infinity&&res.alive[i]&&i!==PUB).sort((a,b)=>a-b);
  const alive=res.alive.filter(Boolean).length;
  // first inbound full-block transfer per node (gossipsub progress ring)
  const inb=new Array(N).fill(null); if(proto==='g') for(const e of ev) if(e.k===0&&!inb[e.b]) inb[e.b]=e;
  return {...res,proto,ev,byTa,tsArr,wasteCum,size,fin,aliveN:alive,inb,grid:heatGrid(res.T,res.alive)};
}
function rerun(){
  const P={B:SIZES[S.Bi],loss:S.loss/100,k:S.k,r:0,m:1.5,beta:S.beta,pub:PUB,cut:S.cut,dark:S.dark,seed:3,hb:700};
  const t0=performance.now();
  const m=post(simulate('m',net,P),'m'), g=post(simulate('g',net,P),'g');
  R={m,g,ms:performance.now()-t0};
  const mx=Math.max(m.fin.at(-1)||0, g.fin.at(-1)||0);
  R.tMax=Math.max(budget()+150, Math.ceil((mx+60)/50)*50);
  S.t=0; S.playing=true; playIco(); resetDec(); buildChips(); writeVerdict(); dirtyAll(); drawBarcode(); inspector(true);
  $('build').textContent=L(`${N} nodes · ${R.m.ev.length.toLocaleString()} shard transfers + ${R.g.ev.length.toLocaleString()} block transfers simulated in ${R.ms|0} ms`,`${N} düğüm · ${R.m.ev.length.toLocaleString('tr')} shard + ${R.g.ev.length.toLocaleString('tr')} blok aktarımı ${R.ms|0} ms'de simüle edildi`);
}

// ---------- heat grid (inverse distance interpolation over land) ----------
let landMask=null; const ALPHA=new Float32Array(GW*GH);
const landPath=new Path2D(MAP.d);
function buildMask(){const c=document.createElement('canvas');c.width=GW;c.height=GH;const x=c.getContext('2d');x.scale(GW/W,GH/H);x.fill(landPath);
  const d=x.getImageData(0,0,GW,GH).data; landMask=new Uint8Array(GW*GH); for(let i=0;i<GW*GH;i++) landMask[i]=d[i*4+3]>60?1:0;}
function heatGrid(T,alive){
  if(!landMask) buildMask();
  const g=new Float32Array(GW*GH).fill(NaN); const R2=42*42; if(!heatGrid.A) heatGrid.A=new Float32Array(GW*GH);
  const pts=NODES.filter((n,i)=>alive[i]).map(n=>[n.x,n.y,T[n.id]<Infinity?T[n.id]:20000]);
  for(let gy=0;gy<GH;gy++)for(let gx=0;gx<GW;gx++){const i=gy*GW+gx; if(!landMask[i]) continue;
    const x=gx*CELL+2,y=gy*CELL+2; let sw=0,sv=0;
    let dmin=1e9; for(const p of pts){const dx=p[0]-x,dy=p[1]-y,d2=dx*dx+dy*dy; if(d2<dmin) dmin=d2; if(d2>R2) continue; const w=1/((d2+16)*(d2+16)); sw+=w; sv+=w*p[2];}
    if(sw>0) g[i]=sv/sw; const dm=Math.sqrt(dmin); ALPHA[i]=dm<14?1:Math.max(0,1-(dm-14)/26); }
  return g;
}

// ---------- map rendering (two panes) ----------
let dpr=1;
function mkPane(view,cv){const hc=document.createElement('canvas');hc.width=GW;hc.height=GH;const hx=hc.getContext('2d');
  return {view,cv,ctx:cv.getContext('2d'),hc,hx,img:hx.createImageData(GW,GH),land:null,lastT:-1,lastV:'',cw:0};}
const PANES=[mkPane('g',$('mapG')),mkPane('m',$('mapM'))];
function dirtyAll(){PANES.forEach(p=>{p.lastT=-1})}
function resize(){ dpr=Math.min(2,window.devicePixelRatio||1);
  for(const p of PANES){ const r=p.cv.getBoundingClientRect(); p.cw=r.width; if(!r.width) continue; p.cv.width=Math.round(r.width*dpr); p.cv.height=Math.round(r.height*dpr); p.land=null; p.lastT=-1; }
  const b=$('bc'), br=b.getBoundingClientRect(); b.width=Math.round(br.width*dpr); b.height=Math.round(br.height*dpr); drawBarcode();}
new ResizeObserver(resize).observe($('twin'));
function landLayer(p){ if(p.land) return p.land; const c=document.createElement('canvas'); c.width=p.cv.width; c.height=p.cv.height; const x=c.getContext('2d');
  x.scale(c.width/W,c.height/H); x.fillStyle=COL.ocean; x.fillRect(0,0,W,H);
  x.fillStyle=COL.land; x.fill(landPath); x.strokeStyle=COL.line2; x.lineWidth=0.6; x.stroke(landPath); p.land=c; return c; }
const mix=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t];
function paintHeat(p){
  if(!R) return; const t=S.t, v=p.view, bud=budget(); const d=p.img.data; const gm=R.m.grid, gg=R.g.grid;
  const A=v==='g'?COL.g2_:COL.m2_, B=v==='g'?COL.gdeep_:COL.mdeep_, late=COL.late_, land=COL.land_;
  for(let i=0;i<GW*GH;i++){ const o=i*4; let a=0,c=land; const al=ALPHA[i];
    if(v==='d'){ const x=gm[i],y=gg[i]; if(!isNaN(x)&&Math.min(x,y)<=t){ const df=Math.min(y,2e4)-Math.min(x,2e4); const s=Math.max(-1,Math.min(1,df/400)); c=s>=0?mix(land,COL.m_,0.25+0.75*s):mix(land,COL.g_,0.25+0.75*-s); a=225; } }
    else { const val=(v==='g'?gg:gm)[i]; if(!isNaN(val)&&val<=t){ if(val>bud){c=late;a=200}else{c=mix(A,B,Math.pow(val/bud,0.8));a=230} } }
    d[o]=c[0];d[o+1]=c[1];d[o+2]=c[2];d[o+3]=a*al; }
  p.hx.putImageData(p.img,0,0); p.lastT=t; p.lastV=v;
}
// marching squares contour of grid at level lv
function contour(grid,lv,x){
  x.beginPath();
  for(let gy=0;gy<GH-1;gy++)for(let gx=0;gx<GW-1;gx++){
    const i=gy*GW+gx, a=grid[i],b=grid[i+1],c=grid[i+GW+1],d=grid[i+GW];
    if(isNaN(a)||isNaN(b)||isNaN(c)||isNaN(d)) continue;
    const idx=(a>lv?8:0)|(b>lv?4:0)|(c>lv?2:0)|(d>lv?1:0); if(idx===0||idx===15) continue;
    const X=gx*CELL+2,Y=gy*CELL+2, f=(p,q)=>(lv-p)/(q-p);
    const top=[X+CELL*f(a,b),Y], right=[X+CELL,Y+CELL*f(b,c)], bot=[X+CELL*f(d,c),Y+CELL], left=[X,Y+CELL*f(a,d)];
    const seg=(p,q)=>{x.moveTo(p[0],p[1]);x.lineTo(q[0],q[1])};
    switch(idx){case 1:case 14:seg(left,bot);break;case 2:case 13:seg(bot,right);break;case 3:case 12:seg(left,right);break;case 4:case 11:seg(top,right);break;
      case 5:seg(left,top);seg(bot,right);break;case 6:case 9:seg(top,bot);break;case 7:case 8:seg(left,top);break;case 10:seg(left,bot);seg(top,right);break;}
  }
  x.stroke();
}
const rankAt=(log,t)=>{let lo=0,hi=log.length;while(lo<hi){const m=(lo+hi)>>1;if(log[m][0]<=t)lo=m+1;else hi=m}return lo?log[lo-1][1]:0};
function wrapTo(ax,bx){ if(bx-ax>500) return bx-1000; if(ax-bx>500) return bx+1000; return bx; }
function frameMap(p){
  if(!R||!p.cw||!p.cv.width||p.cv.offsetParent===null) return;
  const ctx=p.ctx, map=p.cv, v=p.view;
  const sx=map.width/W, sy=map.height/H; ctx.setTransform(1,0,0,1,0,0);
  ctx.drawImage(landLayer(p),0,0);
  if(Math.abs(S.t-p.lastT)>0.5||p.lastV!==v||p.lastT<0) paintHeat(p);
  ctx.save(); ctx.scale(sx,sy); ctx.clip(landPath); ctx.imageSmoothingEnabled=true; ctx.drawImage(p.hc,0,0,W,H); ctx.restore();
  ctx.save(); ctx.scale(sx,sy);
  const res=v==='g'?R.g:R.m;
  if(v!=='d'){ ctx.lineWidth=1.1/sx; ctx.setLineDash([4/sx,3/sx]); ctx.strokeStyle=COL.fg; ctx.globalAlpha=0.55; contour(res.grid,budget(),ctx); ctx.setLineDash([]);
    if(S.t>0&&S.t<R.tMax){ctx.globalAlpha=0.9; ctx.lineWidth=1.6/sx; ctx.strokeStyle=v==='g'?COL.g:COL.m; contour(res.grid,S.t,ctx);} ctx.globalAlpha=1; }
  if(S.cut.size){ ctx.strokeStyle=COL.dead; ctx.globalAlpha=0.25; ctx.lineWidth=0.7/sx; ctx.setLineDash([3/sx,3/sx]); ctx.beginPath();
    for(const k of net.links){ if(!S.cut.has(net.cor.get(k))) continue; const [i,j]=k.split('_').map(Number); const A=NODES[i],B=NODES[j]; const bx=wrapTo(A.x,B.x); ctx.moveTo(A.x,A.y); ctx.lineTo(bx,B.y); if(bx!==B.x){ctx.moveTo(B.x,B.y);ctx.lineTo(wrapTo(B.x,A.x),A.y)} }
    ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha=1; }
  if(S.sel!=null){ const A=NODES[S.sel]; ctx.strokeStyle=COL.fg; ctx.globalAlpha=0.35; ctx.lineWidth=0.8/sx; ctx.beginPath();
    for(const j of A.mesh){const B=NODES[j]; ctx.moveTo(A.x,A.y); ctx.lineTo(wrapTo(A.x,B.x),B.y);} ctx.stroke(); ctx.globalAlpha=1; }
  const t=S.t;
  if(v!=='d'){ const evs=res.ev; const big=v==='g';
    let drawn=0; const cap=v==='g'?600:1800; ctx.lineCap='round';
    for(let i=0;i<evs.length;i++){ const e=evs[i]; if(e.ts>t) break; if(e.ta<=t) continue; if(++drawn>cap) break;
      const A=NODES[e.a],B=NODES[e.b]; const bx=wrapTo(A.x,B.x); const q0=(t-e.ts)/(e.ta-e.ts);
      const mx=(A.x+bx)/2, my=(A.y+B.y)/2-Math.hypot(bx-A.x,B.y-A.y)*0.12;
      const at=u=>{const q=1-u;return [q*q*A.x+2*q*u*mx+u*u*bx, q*q*A.y+2*q*u*my+u*u*B.y]};
      const len=Math.min(0.25,18/Math.max(20,Math.hypot(bx-A.x,B.y-A.y)));
      let [x,y]=at(q0), [x0,y0]=at(Math.max(0,q0-len)); let off=0; if(x<0)off=1000; if(x>1000)off=-1000;
      ctx.strokeStyle=e.k===0?(big?COL.g:COL.m):e.k===4?COL.dead:COL.faint; ctx.globalAlpha=e.k===0?(big?0.95:0.7):0.45; ctx.lineWidth=(big?2.4:1.2)/Math.max(0.6,sx);
      ctx.beginPath(); ctx.moveTo(x0+off,y0); ctx.lineTo(x+off,y); ctx.stroke(); }
    ctx.globalAlpha=1; }
  const rr=3.6/Math.max(0.55,sx);
  for(const nd of NODES){ const i=nd.id; const x=nd.x,y=nd.y;
    if(!R.m.alive[i]){ ctx.strokeStyle=COL.dead; ctx.lineWidth=1.2/sx; ctx.beginPath(); ctx.moveTo(x-rr,y-rr);ctx.lineTo(x+rr,y+rr);ctx.moveTo(x+rr,y-rr);ctx.lineTo(x-rr,y+rr);ctx.stroke(); continue; }
    if(v==='d'){ const a=R.m.T[i],b=R.g.T[i]; const done=Math.min(a,b)<=t; ctx.fillStyle=!done?COL.panel:(a<b?COL.m:a>b?COL.g:COL.mute); ctx.strokeStyle=COL.line2; ctx.lineWidth=0.6/sx;
      ctx.beginPath(); ctx.arc(x,y,rr,0,6.283); ctx.fill(); ctx.stroke(); }
    else if(v==='m'){ const T=R.m.T[i]; const done=T<=t; const r=done?S.k:rankAt(R.m.rankLog[i],t);
      ctx.fillStyle=done?COL.m:COL.panel; ctx.beginPath(); ctx.arc(x,y,rr,0,6.283); ctx.fill();
      if(!done&&r>0){ ctx.strokeStyle=COL.m; ctx.lineWidth=1.6/sx; ctx.beginPath(); ctx.arc(x,y,rr+0.6/sx,-Math.PI/2,-Math.PI/2+6.283*r/S.k); ctx.stroke(); }
      if(done&&t-T<60){ ctx.strokeStyle=COL.m2; ctx.globalAlpha=1-(t-T)/60; ctx.lineWidth=1/sx; ctx.beginPath(); ctx.arc(x,y,rr+(t-T)/8,0,6.283); ctx.stroke(); ctx.globalAlpha=1; } }
    else { const T=R.g.T[i]; const done=T<=t; ctx.fillStyle=done?COL.g:COL.panel; ctx.beginPath(); ctx.arc(x,y,rr,0,6.283); ctx.fill();
      const e=R.g.inb[i]; if(!done&&e&&e.ts<=t){ const q=Math.min(1,(t-e.ts)/(e.ta-e.ts)); ctx.strokeStyle=COL.g; ctx.globalAlpha=0.6; ctx.setLineDash([1.5/sx,1.5/sx]); ctx.lineWidth=1.4/sx; ctx.beginPath(); ctx.arc(x,y,rr+0.6/sx,-Math.PI/2,-Math.PI/2+6.283*q); ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha=1; }
      if(done&&t-T<60){ ctx.strokeStyle=COL.g2; ctx.globalAlpha=1-(t-T)/60; ctx.lineWidth=1/sx; ctx.beginPath(); ctx.arc(x,y,rr+(t-T)/8,0,6.283); ctx.stroke(); ctx.globalAlpha=1; } }
    if(v!=='d'){ ctx.strokeStyle=COL.line2; ctx.lineWidth=0.5/sx; ctx.beginPath(); ctx.arc(x,y,rr,0,6.283); ctx.stroke(); }
  }
  const P=NODES[PUB]; ctx.strokeStyle=COL.fg; ctx.lineWidth=1.2/sx; ctx.beginPath(); ctx.arc(P.x,P.y,rr*2.2,0,6.283); ctx.stroke();
  const fs=11/Math.max(sx,0.45);
  ctx.fillStyle=COL.fg; ctx.font=`600 ${fs}px Geist, sans-serif`; ctx.textAlign='left'; ctx.fillText(L('publisher','yayıncı'),P.x+rr*2.6,P.y-rr*1.6);
  if(S.sel!=null){ const Q=NODES[S.sel]; ctx.strokeStyle=COL.fg; ctx.lineWidth=1.5/sx; ctx.beginPath(); ctx.arc(Q.x,Q.y,rr*2.4,0,6.283); ctx.stroke();
    ctx.fillText(Q.c.n,Q.x+rr*2.8,Q.y+rr*3.4); }
  for(const id in CUTXY){ const [x,y]=CUTXY[id]; const on=S.cut.has(id); const r=9/Math.max(sx,0.6);
    ctx.fillStyle=on?COL.dead:COL.panel; ctx.strokeStyle=on?COL.dead:COL.line2; ctx.lineWidth=1/sx; ctx.beginPath(); ctx.arc(x,y,r,0,6.283); ctx.fill(); ctx.stroke();
    ctx.fillStyle=on?'#fff':COL.fg; ctx.font=`${11/Math.max(sx,0.6)}px Geist, sans-serif`; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText('✂',x,y+0.5/sx); ctx.textBaseline='alphabetic'; }
  ctx.restore();
}
for(const p of PANES){ const map=p.cv;
  const pos=e=>{const r=map.getBoundingClientRect(); return [(e.clientX-r.left)/r.width*W,(e.clientY-r.top)/r.height*H]};
  const badgeR=()=>14/Math.max(0.6,map.width/W/dpr*1.4);
  map.addEventListener('click',e=>{ const [x,y]=pos(e);
    for(const id in CUTXY){const [bx,by]=CUTXY[id]; if(Math.hypot(bx-x,by-y)<Math.max(14,badgeR())){S.cut.has(id)?S.cut.delete(id):S.cut.add(id);rerun();return}}
    let best=-1,bd=1e9; for(const n of NODES){const d=Math.hypot(n.x-x,n.y-y); if(d<bd){bd=d;best=n.id}} if(bd<18){S.sel=best;resetDec();inspector(true); if(innerWidth<820) $('insp').scrollIntoView({behavior:'smooth',block:'start'});} });
  map.addEventListener('mousemove',e=>{const [x,y]=pos(e);
    let hit=false; for(const id in CUTXY){const [bx,by]=CUTXY[id]; if(Math.hypot(bx-x,by-y)<14){hit=true;map.title='✂ '+CORRIDORS[id][lang];break}}
    if(!hit){ let bd=1e9,bn=null; for(const n of NODES){const d=Math.hypot(n.x-x,n.y-y); if(d<bd){bd=d;bn=n}} map.title=bd<18?bn.c.n:''; } map.style.cursor=(hit||map.title)?'pointer':'crosshair'; });
}

// ---------- view + legend ----------
function setView(v){ S.mode=v; const diff=v==='d'; $('twin').classList.toggle('diff',diff); PANES[1].view=diff?'d':'m';
  $('vT').setAttribute('aria-pressed',!diff); $('vD').setAttribute('aria-pressed',diff);
  $('mTitle').textContent=diff?L('Who got it first','Kim önce aldı'):'mump2p';
  $('msub').textContent=diff?L('Silver: mump2p first. Coral: Gossipsub first.','Gümüş: önce mump2p. Mercan: önce Gossipsub.'):L('Optimum. Codes the block and relays from the first shard.','Optimum. Bloğu kodlar ve ilk sharddan itibaren aktarır.');
  legend(); dirtyAll(); requestAnimationFrame(resize); }
$('vT').onclick=()=>setView('t'); $('vD').onclick=()=>setView('d');
const HOWTO={
 t:['Each dot is a node. On the left a dotted ring means the node is still downloading the whole block and cannot pass anything on. On the right a ring fills shard by shard, and the node relays from the very first one. A dot turns solid once the node has the block; shading shows when each area got it, and the dashed line marks the vote deadline.','Her nokta bir düğüm. Solda noktalı halka, düğümün hâlâ bloğun tamamını indirdiğini ve hiçbir şey iletemediğini gösterir. Sağda halka shard shard dolar ve düğüm daha ilk sharddan aktarmaya başlar. Düğüm bloğa sahip olunca nokta dolar; gölgeleme her bölgenin bloğu ne zaman aldığını, kesikli çizgi oylama sınırını gösterir.'],
 d:['Silver areas got the block first with mump2p, coral areas with Gossipsub. The stronger the colour, the bigger the gap (full at 400 ms).','Gümüş bölgeler bloğu mump2p ile, mercan bölgeler Gossipsub ile önce aldı. Renk ne kadar güçlüyse fark o kadar büyük (400 ms\'de tam).']};
function legend(){ const el=$('legend'); if(!COL.m) return; const v=S.mode||'t'; $('howto').textContent=L(...HOWTO[v]);
  if(v==='d') el.innerHTML=`<span>${L('mump2p first','önce mump2p')}</span><span class="ramp" style="background:linear-gradient(90deg,${COL.m},${COL.land},${COL.g})"></span><span>${L('Gossipsub first','önce Gossipsub')}</span>`;
  else el.innerHTML=`<span>${L('early','erken')}</span><span class="ramp" style="width:60px;background:linear-gradient(90deg,${COL.g2},${COL.gdeep})"></span><span class="ramp" style="width:60px;background:linear-gradient(90deg,${COL.m2},${COL.mdeep})"></span><span>${L('deadline','sınır')} ┄</span><span class="ramp" style="width:18px;background:${COL.late}"></span><span>${L('late','geç')}</span>`; }
function counters(){ if(!R) return; const t=S.t, bud=budget(), n=R.m.aliveN-1;
  if(S.mode==='d'){ let first=0,seen=0; for(let i=0;i<N;i++){ if(i===PUB||!R.m.alive[i]) continue; const a=R.m.T[i],b=R.g.T[i]; if(Math.min(a,b)<=t){seen++; if(a<b) first++;} }
    $('cntM').textContent=`${first}/${seen}`; $('cntMl').textContent=L('got it first via mump2p','bloğu önce mump2p ile aldı'); $('barM').style.width=(seen?100*first/seen:0)+'%'; return; }
  for(const [res,c,l,bar,dl] of [[R.g,'cntG','cntGl','barG','dlG'],[R.m,'cntM','cntMl','barM','dlM']]){
    const done=countLE(res.fin,t); $(c).textContent=`${done}/${n}`;
    const late=n-countLE(res.fin,bud);
    $(l).textContent=t<bud?L('nodes have the block','düğüm bloğa sahip'):L(`${late===0?'none':late} missed the vote`,`${late===0?'hiçbiri':late} oylamayı kaçırdı`);
    $(bar).style.width=(100*done/n)+'%'; }
}
// ---------- timeline barcode ----------
const bc=$('bc'), bx=bc.getContext('2d');
function drawBarcode(){ if(!R||!bc.width) return; const w=bc.width,h=bc.height,d=dpr; bx.clearRect(0,0,w,h);
  const X=t=>t/R.tMax*w; bx.font=`${10*d}px Geist Mono, monospace`; bx.textBaseline='middle';
  const rows=[[R.m,COL.m,h*0.42],[R.g,COL.g,h*0.68]];
  bx.fillStyle=COL.line; bx.fillRect(0,h*0.86,w,1*d);
  for(let s=0;s<=R.tMax;s+=(R.tMax>3000?1000:R.tMax>1200?500:250)){ bx.fillStyle=COL.faint; bx.fillRect(X(s),h*0.86,1*d,4*d); bx.textAlign=s?'center':'left'; bx.fillText(s+'',X(s)+(s?0:2*d),h*0.95); }
  for(const [res,col,y] of rows){ bx.fillStyle=col; for(let i=0;i<N;i++){const T=res.T[i]; if(T<Infinity&&i!==PUB) bx.fillRect(X(T),y-7*d,1.4*d,14*d);} }
  const bd=X(budget()); bx.fillStyle=COL.fg; bx.globalAlpha=0.7; for(let y=h*0.24;y<h*0.86;y+=4*d) bx.fillRect(bd,y,1*d,2*d); bx.globalAlpha=1;
  bx.textAlign='right'; bx.fillStyle=COL.mute; bx.fillText(L('4 s attestation deadline','4 sn attestation sınırı'),bd-4*d,h*0.12);
  const ph=X(S.t); bx.fillStyle=COL.fg; bx.fillRect(ph-1*d,0,2*d,h*0.86);
}
let scrub=false; const scrubTo=e=>{const r=bc.getBoundingClientRect(); S.t=Math.max(0,Math.min(R.tMax,(e.clientX-r.left)/r.width*R.tMax)); S.playing=false; playIco(); lastSound=S.t;};
bc.addEventListener('pointerdown',e=>{scrub=true;bc.setPointerCapture(e.pointerId);scrubTo(e)}); bc.addEventListener('pointermove',e=>{if(scrub)scrubTo(e)}); bc.addEventListener('pointerup',()=>scrub=false);
function playIco(){$('playIco').innerHTML=S.playing?'<path d="M2 1h2v8H2zM6 1h2v8H6z"/>':'<path d="M2 1l7 4-7 4z"/>'}
$('play').onclick=()=>{ if(!S.playing&&S.t>=R.tMax) S.t=0; S.playing=!S.playing; playIco(); ensureAudio(); };

// ---------- recorder + verdict ----------
function countLE(arr,t){let lo=0,hi=arr.length;while(lo<hi){const m=(lo+hi)>>1;if(arr[m]<=t)lo=m+1;else hi=m}return lo}
function q(a,p){return a.length?a[Math.min(a.length-1,Math.floor(a.length*p))]:NaN}
const nf=x=>isFinite(x)?Math.round(x).toLocaleString(lang==='tr'?'tr':'en'):'∞';
function recorder(){ if(!R) return; const t=S.t;
  for(const [res,id] of [[R.m,'kvM'],[R.g,'kvG']]){
    const done=countLE(res.fin,t), sent=countLE(res.tsArr,t), waste=res.wasteCum[sent];
    const late=res.aliveN-1-countLE(res.fin,budget());
    const mb=(sent*res.size/1048576);
    const wl=res.proto==='g'?L('Duplicate blocks','Tekrar bloklar'):L('Unhelpful + unnecessary shards','İşe yaramayan + gereksiz shard');
    $(id).innerHTML=`<span>${L('Decoded now','Şu an çözülmüş')}</span><span>${done} / ${res.aliveN-1}</span>
      <span>${L('Median · p95 (final)','Medyan · p95 (son)')}</span><span>${nf(q(res.fin,.5))} · ${nf(q(res.fin,.95))} ms</span>
      <span>${L('Miss the deadline','Sınırı kaçıran')}</span><span>${late}</span>
      <span>${L('Uploaded so far','Şimdiye dek yüklenen')}</span><span>${mb.toFixed(mb<10?1:0)} MB</span>
      <span>${wl}</span><span>${waste.toLocaleString()}</span>`; }
}
function writeVerdict(){ if(!R) return; const bud=budget(); const n=R.m.aliveN-1;
  const lm=n-countLE(R.m.fin,bud), lg=n-countLE(R.g.fin,bud); const mm=q(R.m.fin,.5), mg=q(R.g.fin,.5);
  const at=(S.pubAt/1000).toFixed(2).replace('.',lang==='tr'?',':'.');
  const late=(x)=>x===0?L('none','hiçbiri'):x;
  $('verdict').innerHTML=L(
   `With <b>${nf(bud)} ms</b> left before validators vote, <span class="g">${late(lg)}</span> of ${n} nodes miss the block on Gossipsub and <span class="m">${late(lm)}</span> miss it on mump2p. Half the network has it after <span class="g">${nf(mg)} ms</span> on Gossipsub versus <span class="m">${nf(mm)} ms</span> on mump2p.`,
   `Validator'ların oy vermesine <b>${nf(bud)} ms</b> kala, ${n} düğümden Gossipsub'da <span class="g">${late(lg)}</span>, mump2p'de <span class="m">${late(lm)}</span> tanesi bloğu kaçırıyor. Ağın yarısı bloğa Gossipsub'da <span class="g">${nf(mg)} ms</span>, mump2p'de <span class="m">${nf(mm)} ms</span> sonra sahip oluyor.`);
}

// ---------- probe: real decoding of the payload at one node ----------
let DEC=null;
function resetDec(){DEC=null}
function encodeFrag(c,k){ const F=BYTES/k, out=new Uint8Array(F); for(let i=0;i<k;i++){const ci=c[i]; if(!ci) continue; const l=LOG[ci], o=i*F; for(let j=0;j<F;j++){const x=SRC[o+j]; if(x) out[j]^=EXP[l+LOG[x]];}} return out; }
function decStep(node,t){
  const k=S.k, F=BYTES/k; const list=R.m.recv[node];
  if(!DEC||DEC.node!==node||DEC.k!==k||DEC.R!==R) DEC={node,k,R,n:0,rows:[],piv:[],feed:[]};
  let want=0; while(want<list.length&&list[want].t<=t) want++;
  if(want<DEC.n) DEC={node,k,R,n:0,rows:[],piv:[],feed:[]};
  if(node===PUB){ if(!DEC.rows.length){ for(let i=0;i<k;i++){const c=new Uint8Array(k);c[i]=1;DEC.rows.push({c,p:SRC.slice(i*F,(i+1)*F)});DEC.piv.push(i);} } return; }
  for(;DEC.n<want;DEC.n++){ const r=list[DEC.n]; const c=Uint8Array.from(r.v), p=encodeFrag(r.v,k); const raw=p.slice();
    for(let q=0;q<DEC.rows.length;q++){const f=c[DEC.piv[q]]; if(!f) continue; const Rw=DEC.rows[q], lf=LOG[f]; for(let j=0;j<k;j++) if(Rw.c[j]) c[j]^=EXP[lf+LOG[Rw.c[j]]]; for(let j=0;j<F;j++) if(Rw.p[j]) p[j]^=EXP[lf+LOG[Rw.p[j]]];}
    let pv=-1; for(let j=0;j<k;j++) if(c[j]){pv=j;break}
    if(pv>=0){ const li=255-LOG[c[pv]]; for(let j=0;j<k;j++) if(c[j]) c[j]=EXP[li+LOG[c[j]]]; for(let j=0;j<F;j++) if(p[j]) p[j]=EXP[li+LOG[p[j]]];
      for(const Rw of DEC.rows){const f=Rw.c[pv]; if(!f) continue; const lf=LOG[f]; for(let j=0;j<k;j++) if(c[j]) Rw.c[j]^=EXP[lf+LOG[c[j]]]; for(let j=0;j<F;j++) if(p[j]) Rw.p[j]^=EXP[lf+LOG[p[j]]];}
      DEC.rows.push({c,p}); DEC.piv.push(pv); }
    DEC.feed.push({t:r.t,from:r.from,inn:pv>=0,raw}); if(DEC.feed.length>6) DEC.feed.shift(); }
}
const hM=$('hM').getContext('2d'), hG=$('hG').getContext('2d'), mxc=$('mx').getContext('2d');
const imgM=hM.createImageData(128,128), imgG=hG.createImageData(128,128);
function blit(img,ctx,rowsFn){ctx.putImageData(img,0,0)}
function stripeToImg(img,stripe,bytes,k,mode){ const rows=128/k, d=img.data; const F=BYTES/k;
  for(let j=0,px=stripe*rows*128;j<F;j+=3,px++){const o=px*4; if(mode==='dark'){const y=Math.floor((px%(rows*128))/128); const v=(y%2)?14:22; d[o]=v;d[o+1]=v;d[o+2]=v+4;} else {d[o]=bytes[j];d[o+1]=bytes[j+1];d[o+2]=bytes[j+2];} d[o+3]=255;} }
let lastInspKey='';
function inspector(force){
  if(!R) return; if(S.sel==null){ S.sel=NODES.findIndex(n=>n.c.n==='Sydney'); }
  const i=S.sel, nd=NODES[i], t=S.t, k=S.k;
  const key=[i,k,Math.round(t),R.ms,lang].join('|'); if(!force&&key===lastInspKey) return; lastInspKey=key;
  const alive=R.m.alive[i];
  $('iName').textContent=nd.c.n+(i===PUB?L(' · publisher',' · yayıncı'):'');
  $('iMeta').textContent=L(`node #${i} · uplink ${nd.bw>10000?'1 Gbps':'50 Mbps'} · ${nd.mesh.length} mesh peers`,`düğüm #${i} · çıkış ${nd.bw>10000?'1 Gbps':'50 Mbps'} · ${nd.mesh.length} mesh eşi`);
  const db=$('darkBtn'); const dark=S.dark.has(nd.ci); db.disabled=i===PUB; db.style.opacity=i===PUB?0.4:1;
  db.textContent=dark?L(`Restore ${nd.c.n}`,`${nd.c.n} şehrini geri aç`):L(`Black out ${nd.c.n}`,`${nd.c.n} şehrini karart`);
  db.onclick=()=>{ if(i===PUB) return; dark?S.dark.delete(nd.ci):S.dark.add(nd.ci); rerun(); };
  // mump2p holdings
  decStep(i,t);
  const d=imgM.data; let solved=0;
  for(let s=0;s<k;s++){ const r=DEC.piv.indexOf(s); if(r<0) stripeToImg(imgM,s,null,k,'dark'); else { const Rw=DEC.rows[r]; stripeToImg(imgM,s,Rw.p,k); let unit=true; for(let j=0;j<k;j++) if(j!==s&&Rw.c[j]){unit=false;break} if(unit) solved++; } }
  hM.putImageData(imgM,0,0);
  const rank=DEC.rows.length, Tm=R.m.T[i], Tg=R.g.T[i];
  $('hMt').textContent=Tm<=t?nf(Tm)+' ms':`${rank}/${k}`;
  // matrix
  const mc=$('mx'); if(mc.width!==k){mc.width=k;mc.height=k} const mi=mxc.createImageData(k,k);
  for(let s=0;s<k;s++){ const r=DEC.piv.indexOf(s); for(let j=0;j<k;j++){const o=(s*k+j)*4; let c=[10,10,14];
      if(r>=0){const v=DEC.rows[r].c[j]; if(j===s) c=[255,255,255]; else if(v){const a=60+170*v/255; c=[a,a*1.02,a*1.06];} else c=[26,29,33];}
      mi.data[o]=c[0];mi.data[o+1]=c[1];mi.data[o+2]=c[2];mi.data[o+3]=255;} }
  mxc.putImageData(mi,0,0);
  const re=$('rank'); if(re.children.length!==k){ re.style.gridTemplateColumns=`repeat(${k},1fr)`; re.innerHTML=''; for(let j=0;j<k;j++) re.appendChild(document.createElement('i')); }
  [...re.children].forEach((el,j)=>el.classList.toggle('on',j<rank)); $('rankV').textContent=`${rank} / ${k}`;
  // gossipsub holdings
  const g=imgG.data; const have=Tg<=t; const e=R.g.inb[i];
  for(let p=0,j=0;p<128*128;p++,j+=3){const o=p*4; if(have||i===PUB){g[o]=SRC[j];g[o+1]=SRC[j+1];g[o+2]=SRC[j+2];} else {const y=p>>7; const v=(y%2)?14:22; g[o]=v;g[o+1]=v;g[o+2]=v+4;} g[o+3]=255;}
  hG.putImageData(imgG,0,0);
  if(!have&&e&&e.ts<=t&&i!==PUB){ const pr=Math.min(1,(t-e.ts)/(e.ta-e.ts)); hG.fillStyle=COL.g; hG.globalAlpha=0.9; hG.fillRect(8,116,112*pr,5); hG.globalAlpha=0.35; hG.fillRect(8+112*pr,116,112*(1-pr),5); hG.globalAlpha=1; }
  $('hGt').textContent=have||i===PUB?nf(i===PUB?0:Tg)+' ms':(e&&e.ts<=t?Math.round(100*Math.min(1,(t-e.ts)/(e.ta-e.ts)))+'%':'-');
  // note
  let note;
  if(!alive) note=L('This city is blacked out. Nothing reaches it.','Bu şehir karartıldı. Buraya hiçbir şey ulaşmıyor.');
  else if(i===PUB) note=L('The publisher holds all fragments from the start.','Yayıncı tüm parçalara baştan sahip.');
  else if(Tm<=t&&Tg<=t) note=L(`Both have it. mump2p got here ${nf(Tg-Tm)} ms ${Tg>=Tm?'earlier':'later'}.`,`İkisinde de var. mump2p buraya ${nf(Math.abs(Tg-Tm))} ms ${Tg>=Tm?'önce':'sonra'} ulaştı.`);
  else if(rank===0) note=L('Nothing has arrived yet.','Henüz hiçbir şey gelmedi.');
  else if(Tm>t) note=L(`Holds ${rank} of ${k} degrees of freedom and ${solved} readable fragments. The image stays noise until the ${k}th independent shard, then every stripe resolves at once. Meanwhile this node is already relaying fresh mixtures to its peers.`,
                       `${k} serbestlik derecesinin ${rank} tanesine ve ${solved} okunabilir parçaya sahip. Resim ${k}. bağımsız shard gelene kadar gürültü olarak kalır, sonra tüm şeritler aynı anda çözülür. Bu arada düğüm, eşlerine taze karışımlar aktarmaya çoktan başladı.`);
  else note=L(`Decoded at ${nf(Tm)} ms. Gossipsub is ${e&&e.ts<=t?'still downloading the whole block and cannot forward a byte of it yet':'still waiting for the first byte'}.`,`${nf(Tm)} ms'de çözüldü. Gossipsub ${e&&e.ts<=t?'hâlâ bloğun tamamını indiriyor ve henüz tek bir baytını bile iletemiyor':'hâlâ ilk baytı bekliyor'}.`);
  $('holdNote').textContent=note;
  // feed
  const fe=$('feed'); fe.innerHTML='';
  if(!DEC.feed.length){ const s=document.createElement('div'); s.className='note'; s.textContent=i===PUB?L('The publisher creates shards; it does not receive them.','Yayıncı shard üretir, almaz.'):L('No shards yet.','Henüz shard yok.'); fe.appendChild(s); }
  for(const f of DEC.feed.slice().reverse()){ const row=document.createElement('div'); row.className='fe';
    const cv=document.createElement('canvas'); const rows=128/k; cv.width=128; cv.height=rows; const cx=cv.getContext('2d'); const im=cx.createImageData(128,rows);
    for(let p=0,j=0;p<128*rows;p++,j+=3){im.data[p*4]=f.raw[j];im.data[p*4+1]=f.raw[j+1];im.data[p*4+2]=f.raw[j+2];im.data[p*4+3]=255} cx.putImageData(im,0,0);
    const ev=document.createElement('span'); ev.className='ev '+(f.inn?'new':'unh'); ev.textContent=f.inn?'NEW_SHARD':'UNHELPFUL_SHARD';
    const tt=document.createElement('span'); tt.className='t'; tt.textContent=`${NODES[f.from].c.n} · ${nf(f.t)} ms`;
    row.append(cv,ev,tt); fe.appendChild(row); }
}

// ---------- sound ----------
let AC=null, sound=false, lastSound=0;
const PENTA=[0,2,4,7,9,12,14,16,19,21,24,26,28];
function ensureAudio(){ if(sound&&!AC){ try{AC=new (window.AudioContext||window.webkitAudioContext)()}catch(e){} } if(AC&&AC.state==='suspended') AC.resume(); }
$('soundBtn').onclick=()=>{ sound=!sound; $('soundBtn').setAttribute('aria-pressed',sound); ensureAudio(); lastSound=S.t; };
const outP=pan=>{ if(!AC.createStereoPanner) return AC.destination; const p=AC.createStereoPanner(); p.pan.value=pan; p.connect(AC.destination); return p; };
function pluck(freq,gain,dur,type,pan){ const o=AC.createOscillator(), g=AC.createGain(); o.type=type||'triangle'; o.frequency.value=freq; const n=AC.currentTime;
  g.gain.setValueAtTime(0,n); g.gain.linearRampToValueAtTime(gain,n+0.005); g.gain.exponentialRampToValueAtTime(0.0001,n+dur); o.connect(g).connect(outP(pan||0)); o.start(n); o.stop(n+dur+0.02); }
let noiseBuf=null; function thud(gain,pan){ if(!noiseBuf){noiseBuf=AC.createBuffer(1,AC.sampleRate*0.06,AC.sampleRate); const d=noiseBuf.getChannelData(0); for(let i=0;i<d.length;i++) d[i]=(Math.random()*2-1)*(1-i/d.length);}
  const s=AC.createBufferSource(); s.buffer=noiseBuf; const f=AC.createBiquadFilter(); f.type='lowpass'; f.frequency.value=260; const g=AC.createGain(); g.gain.value=gain; s.connect(f).connect(g).connect(outP(pan||0)); s.start(); }
function sonify(t0,t1){ if(!sound||!AC||!R||t1<=t0) return;
  for(const [res,pan] of [[R.g,-0.7],[R.m,0.7]]){ const arr=res.byTa;
    let lo=0,hi=arr.length; while(lo<hi){const m=(lo+hi)>>1; if(arr[m].ta<=t0) lo=m+1; else hi=m}
    let notes=0, thuds=0;
    for(let i=lo;i<arr.length&&arr[i].ta<=t1;i++){ const e=arr[i]; const nd=NODES[e.b];
      if(e.k===0){ if(notes<4){ const idx=Math.floor(nd.x/1000*PENTA.length); pluck(220*Math.pow(2,PENTA[Math.min(PENTA.length-1,idx)]/12),res.proto==='g'?0.06:0.03,res.proto==='g'?0.9:0.35,'triangle',pan); notes++; } }
      else if(e.k!==4){ if(thuds<2){ thud(0.1,pan); thuds++; } } }
    for(let i=0;i<N;i++){ const T=res.T[i]; if(T>t0&&T<=t1&&notes<7){ pluck(440*Math.pow(2,PENTA[(i*7)%PENTA.length]/12),0.035,1.2,'sine',pan); notes++; } } }
}


// ---------- tips ----------
const TIPS={
 cut:['A corridor is a group of real undersea cable routes. Cutting one removes every peer link that would cross it, which is the worst case; real outages often reroute traffic slowly instead.','Koridor, gerçek denizaltı kablo güzergâhlarından oluşan bir grup. Birini kesmek, onu geçecek tüm eş bağlantılarını kaldırır; bu en kötü durumdur, gerçek kesintilerde trafik çoğu zaman yavaşça başka yoldan akar.'],
 payload:['Your image is the block\'s actual content. Every coded shard you see is a real linear mix of its bytes over GF(2⁸), and the probe really solves those mixes back into the picture.','Resmin bloğun gerçek içeriği. Gördüğün her kodlu shard, baytlarının GF(2⁸) üzerinde gerçek bir doğrusal karışımı; sonda da bu karışımları gerçekten çözüp resme geri dönüştürüyor.'],
 k:['How many pieces the block is cut into. Any k independent coded shards rebuild it. More, smaller shards let nodes start relaying sooner, but cost more CPU and header bytes, which this model does not charge for. 4 is the default in Optimum\'s dev setup; production values are not public.','Bloğun kaç parçaya bölündüğü. Herhangi k bağımsız kodlu shard onu geri kurar. Daha çok ve daha küçük shard, düğümlerin daha erken aktarmaya başlamasını sağlar ama daha fazla CPU ve başlık baytı ister; bu model o maliyeti hesaba katmıyor. 4, Optimum\'un geliştirici kurulumundaki varsayılan; üretim değerleri açık değil.'],
 size:['Bytes on the wire. Post Dencun blocks with blobs commonly reach several hundred KB to a few MB.','Ağdaki bayt miktarı. Dencun sonrası bloblu bloklar genellikle birkaç yüz KB ile birkaç MB arasında.'],
 loss:['Share of packets dropped on each link. Both protocols run over reliable transport, so every loss costs a retransmit round trip for both.','Her bağlantıda düşen paket oranı. İki protokol de güvenilir taşıma kullanır, yani her kayıp iki tarafa da bir yeniden gönderim turu kaybettirir.'],
 pub:['Ethereum validators vote 4 s into each 12 s slot. A proposer that publishes late (timing games) leaves less time for the block to spread, which is when propagation speed decides the vote.','Ethereum validator\'ları her 12 sn\'lik slotun 4. saniyesinde oy verir. Geç yayınlayan bir proposer (timing games) bloğun yayılmasına daha az zaman bırakır; yayılım hızının oyu belirlediği an budur.'],
 beta:['How many fresh mixes a relay pushes to each peer before waiting to be asked. Higher is faster but sends more spare shards. This rule is our modelling choice, not a published mump2p parameter.','Bir aktarıcının, istenmeden önce her eşe kaç taze karışım ittiği. Yüksek değer daha hızlı ama daha fazla fazlalık shard gönderir. Bu kural bizim modelleme tercihimiz, yayınlanmış bir mump2p parametresi değil.'],
 probe:['Click any dot on the map to look inside that node. Left: what it holds on mump2p. Right: what it holds on Gossipsub.','Haritada herhangi bir noktaya tıklayarak o düğümün içine bak. Solda mump2p\'de, sağda Gossipsub\'da elinde ne olduğu.'],
 rank:['How many of the received shards are truly new information. A random mix over GF(2⁸) is new with probability 255/256, so almost nothing is wasted. At rank k the block is fully recoverable.','Gelen shardların kaçının gerçekten yeni bilgi olduğu. GF(2⁸) üzerinde rastgele bir karışım 255/256 olasılıkla yenidir, yani neredeyse hiçbir şey boşa gitmez. Rank k olduğunda blok tamamen geri kurulabilir.'],
 feed:['Each strip is the raw bytes of one coded shard: pure noise on its own. NEW_SHARD and UNHELPFUL_SHARD are the names Optimum\'s own tracing uses.','Her şerit, bir kodlu shardın ham baytları: tek başına saf gürültü. NEW_SHARD ve UNHELPFUL_SHARD, Optimum\'un kendi izleme sisteminin kullandığı adlar.'],
};
const pop=document.createElement('div'); pop.id='tipPop'; pop.hidden=true; pop.setAttribute('role','tooltip'); document.body.appendChild(pop);
let tipOpen=null;
document.addEventListener('click',e=>{ const b=e.target.closest('.tip');
  if(b){ e.preventDefault(); e.stopPropagation(); if(tipOpen===b){closeTip();return} closeTip(); tipOpen=b; b.setAttribute('aria-expanded','true');
    pop.textContent=L(...TIPS[b.dataset.tip]); pop.hidden=false; const r=b.getBoundingClientRect(); const w=Math.min(300,innerWidth-24);
    pop.style.maxWidth=w+'px'; let x=Math.min(innerWidth-w-12,Math.max(12,r.left-20)); pop.style.left=x+'px';
    const ph=pop.offsetHeight; pop.style.top=(r.bottom+8+ph>innerHeight?Math.max(8,r.top-ph-8):r.bottom+8)+'px'; return; }
  if(!e.target.closest('#tipPop')) closeTip(); },true);
function closeTip(){ if(tipOpen) tipOpen.setAttribute('aria-expanded','false'); tipOpen=null; pop.hidden=true; }
addEventListener('scroll',closeTip,{passive:true}); addEventListener('keydown',e=>{if(e.key==='Escape'){closeTip(); if(!$('tour').hidden) endTour();}});

// ---------- guided tour ----------
function applyScen(id){ const m=SCEN.find(x=>x.id===id).set; S.Bi=m.Bi;S.loss=m.loss;S.cut=new Set(m.cut);S.dark=new Set(m.dark.map(cityIdx));$('B').value=S.Bi;$('loss').value=S.loss; syncLabels(); }
function setK(k){ S.k=k; $('k').value=String(k); resetDec(); drawStripes(); syncLabels(); }
const SYD=()=>NODES.findIndex(n=>n.c.n==='Sydney');
const TOUR=[
 {t:['One block, 159 nodes, 1 second','Bir blok, 159 düğüm, 1 saniye'],
  b:['A proposer in Virginia (circled) publishes a block 3 s into the slot. Validators vote at 4 s, so every node has about one second to receive it. Nodes are placed where Ethereum infrastructure actually clusters.','Virginia\'daki bir proposer (halkalı nokta) bloğu slotun 3. saniyesinde yayınlıyor. Validator\'lar 4. saniyede oy veriyor, yani her düğümün bloğu almak için yaklaşık bir saniyesi var. Düğümler Ethereum altyapısının gerçekte yoğunlaştığı yerlere yerleştirildi.'],
  spot:'#twin', run(){ setK(4); applyScen('calm'); setView('t'); rerun(); S.speed=0.25; $('speed').value='0.25'; }},
 {t:['Gossipsub: wait for all of it, then pass it on','Gossipsub: hepsini bekle, sonra ilet'],
  b:['On the left, watch the dotted coral rings. Each node downloads the entire block before it can forward one byte, and every hop pays that full transfer time again. Far away nodes inherit all the waiting.','Soldaki noktalı mercan halkalara bak. Her düğüm tek bir bayt iletebilmek için önce bloğun tamamını indiriyor ve her atlama bu aktarım süresini baştan ödüyor. Uzaktaki düğümler tüm bu bekleyişi miras alıyor.'],
  spot:'#paneG', run(){ setView('t'); S.t=0; S.playing=true; playIco(); }},
 {t:['mump2p: start passing it on from the first shard','mump2p: ilk sharddan itibaren iletmeye başla'],
  b:['On the right: same block, same links, but it travels as coded shards, and a node relays fresh mixes the moment it holds anything. Rings fill bit by bit and the whole map lights up sooner. Compare the two counters at the top of each map.','Sağda: aynı blok, aynı bağlantılar, ama kodlu shardlar hâlinde yolculuk ediyor ve düğüm eline bir şey geçtiği an taze karışımlar aktarıyor. Halkalar azar azar doluyor ve tüm harita daha erken aydınlanıyor. Her haritanın üstündeki iki sayacı karşılaştır.'],
  spot:'#paneM', run(){ setView('t'); S.t=0; S.playing=true; playIco(); }},
 {t:['Inside Sydney: noise, noise, then the picture','Sydney\'nin içi: gürültü, gürültü, sonra resim'],
  b:['The probe shows what Sydney holds. Each shard alone is noise. The moment the last independent one lands, the recipes on the left form a clean diagonal and the image appears in a single frame. That decoding is real, done on the picture\'s bytes.','Sonda Sydney\'nin elindekini gösteriyor. Her shard tek başına gürültü. Son bağımsız shard geldiği an soldaki tarifler temiz bir köşegene dönüşüyor ve resim tek karede beliriyor. Bu çözme gerçek, resmin baytları üzerinde yapılıyor.'],
  spot:'#insp', run(){ setView('t'); S.sel=SYD(); resetDec(); const T=R.m.T[S.sel]; S.t=Math.max(0,T-90); S.speed=0.1; $('speed').value='0.1'; S.playing=true; playIco(); }},
 {t:['Now cut the Red Sea','Şimdi Kızıldeniz\'i kes'],
  b:['In Sep 2025 cables near Jeddah were cut. Here every Europe to Asia link through the Red Sea is gone. The view switches to who wins where: silver areas got the block first with mump2p, coral areas with Gossipsub. Read the sentence above the map.','Eylül 2025\'te Cidde açıklarında kablolar kesildi. Burada Kızıldeniz\'den geçen tüm Avrupa Asya bağlantıları gitti. Görünüm, kimin nerede kazandığına geçiyor: gümüş bölgeler bloğu mump2p ile, mercan bölgeler Gossipsub ile önce aldı. Haritanın üstündeki cümleyi oku.'],
  spot:'#twin', run(){ applyScen('red'); rerun(); setView('d'); S.speed=0.5; $('speed').value='0.5'; }},
 {t:['Finer shards, faster spread','Daha ince shard, daha hızlı yayılım'],
  b:['So far the block was cut into 4 shards, the default in Optimum\'s dev setup. Cut it into 16 and nodes can start relaying even sooner. It is not free: more shards mean more decoding work, which this model does not charge for. You can change this in Lab settings.','Şimdiye kadar blok, Optimum\'un geliştirici kurulumundaki varsayılan olan 4 sharda bölündü. 16\'ya böl, düğümler aktarmaya daha da erken başlasın. Bedava değil: daha çok shard daha çok çözme işi demek ve bu model o maliyeti hesaba katmıyor. Bunu Laboratuvar ayarlarından değiştirebilirsin.'],
  spot:'#verdict', run(){ setK(16); rerun(); setView('d'); }},
 {t:['Your turn','Sıra sende'],
  b:['Pick a scenario above the maps, cut any ✂ cable, drop your own image into "Your block", or press ♪ Listen: Gossipsub plays in your left ear, mump2p in your right. Share your result on X.','"Senin bloğun" kısmına kendi resmini bırak, haritada istediğin kabloyu kes, sondadan bir şehri karart ya da ♪ Dinle\'ye bas: işe yarayan shardlar nota çalar, boşa giden kopyalar boğuk ses çıkarır.'],
  spot:'#paneM', run(){ setView('t'); S.t=0; S.playing=true; playIco(); }},
];
let step=0;
function showStep(i){ step=i; const st=TOUR[i]; document.querySelectorAll('.spot').forEach(e=>e.classList.remove('spot'));
  st.run(); const sp=document.querySelector(st.spot); if(sp) sp.classList.add('spot');
  $('tour').hidden=false; $('tourN').textContent=`${i+1} / ${TOUR.length}`; $('tourT').textContent=L(...st.t); $('tourB').textContent=L(...st.b);
  $('tourPrev').disabled=i===0; $('tourPrev').style.opacity=i===0?0.4:1; $('tourNext').textContent=i===TOUR.length-1?L('Explore','Keşfet'):L('Next','İleri');
  inspector(true); buildChips(); }
function endTour(){ $('tour').hidden=true; document.querySelectorAll('.spot').forEach(e=>e.classList.remove('spot')); try{localStorage.setItem('wt-toured','1')}catch(e){} }
$('tourBtn').onclick=()=>{ showStep(0); $('tour').scrollIntoView({behavior:'smooth',block:'start'}); };
$('tourNext').onclick=()=>{ if(step>=TOUR.length-1) endTour(); else showStep(step+1); };
$('tourPrev').onclick=()=>{ if(step>0) showStep(step-1); };
$('tourX').onclick=endTour;
function refreshTourText(){ if($('tour').hidden) return; const st=TOUR[step]; $('tourT').textContent=L(...st.t); $('tourB').textContent=L(...st.b); $('tourNext').textContent=step===TOUR.length-1?L('Explore','Keşfet'):L('Next','İleri'); }

// ---------- share ----------
$('shareBtn').onclick=()=>{ if(!R) return; const n=R.m.aliveN-1, bud=budget();
  const lg=n-countLE(R.g.fin,bud), lm=n-countLE(R.m.fin,bud); const sc=SCEN.find(x=>{const m=x.set;return S.Bi===m.Bi&&S.loss===m.loss&&S.cut.size===m.cut.length&&m.cut.every(c=>S.cut.has(c))&&S.dark.size===m.dark.length});
  const name=sc?sc.en:'Custom run'; const url='https://optimum-wind-tunnel.netlify.app/'+(sc?'#'+sc.id:'');
  const txt=`${name} in the Optimum Wind Tunnel: ${lg} of ${n} nodes miss the vote deadline on Gossipsub, ${lm} on @get_optimum mump2p.\n\nSame Earth. Same cables. Same block.`;
  const a=document.createElement('a'); a.href='https://x.com/intent/post?text='+encodeURIComponent(txt)+'&url='+encodeURIComponent(url); a.target='_blank'; a.rel='noopener'; document.body.appendChild(a); a.click(); a.remove(); };

// ---------- loop ----------
let last=performance.now();
function loop(now){ const dt=Math.min(64,now-last); last=now;
  if(R&&S.playing){ const t0=S.t; S.t=Math.min(R.tMax,S.t+dt*S.speed); sonify(t0,S.t); if(S.t>=R.tMax){S.playing=false;playIco();} }
  PANES.forEach(frameMap); counters(); drawBarcode(); recorder(); inspector(false); $('tread').textContent=nf(S.t)+' ms';
  requestAnimationFrame(loop); }

// ---------- boot ----------
document.fonts?.ready.then(()=>drawDefault()); drawDefault();
setTheme(null); applyLang(); syncLabels();
{const h=location.hash.slice(1); const sc=SCEN.find(x=>x.id===h); if(sc){const m=sc.set;S.Bi=m.Bi;S.loss=m.loss;S.cut=new Set(m.cut);S.dark=new Set(m.dark.map(cityIdx));$('B').value=S.Bi;$('loss').value=S.loss;syncLabels();}}
rerun(); resize(); requestAnimationFrame(loop);
{let seen=null; try{seen=localStorage.getItem('wt-toured')}catch(e){} if(!seen&&!location.hash) setTimeout(()=>showStep(0),400);}
})();
