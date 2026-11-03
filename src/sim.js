// ===== Wind Tunnel simulation core (shared by node tests and the page) =====
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}

// corridors: which real cable corridor a long link rides
const CORRIDORS={
  TA:{en:'Transatlantic',tr:'Transatlantik'},
  TP:{en:'Transpacific',tr:'Transpasifik'},
  RS:{en:'Red Sea / Suez',tr:'Kızıldeniz / Süveyş'},
  BA:{en:'Baltic Sea',tr:'Baltık Denizi'},
  AM:{en:'Caribbean (N↔S America)',tr:'Karayipler (K↔G Amerika)'},
  SA:{en:'South Atlantic',tr:'Güney Atlantik'},
  WA:{en:'West Africa',tr:'Batı Afrika'},
  IP:{en:'Asia ↔ Oceania',tr:'Asya ↔ Okyanusya'},
};
const AMER=new Set(['NA','CA']), EUR=new Set(['EU','ME']), ASI=new Set(['AS']);
const BALTIC=new Set(['Helsinki','Stockholm']);
function corridorOf(a,b){
  const ra=a.r, rb=b.r;
  const pair=(x,y)=>(x.has(ra)&&y.has(rb))||(y.has(ra)&&x.has(rb));
  const S=s=>new Set([s]);
  if((BALTIC.has(a.n)&&!BALTIC.has(b.n)&&rb==='EU')||(BALTIC.has(b.n)&&!BALTIC.has(a.n)&&ra==='EU')) return 'BA';
  if(pair(AMER,EUR)||pair(AMER,S('AF'))) return 'TA';
  if(pair(AMER,ASI)||pair(AMER,S('OC'))) return 'TP';
  if(pair(EUR,ASI)||pair(EUR,S('OC'))||pair(S('AF'),ASI)) return 'RS';
  if(pair(AMER,S('SA'))) return 'AM';
  if(pair(EUR,S('SA'))||pair(S('SA'),S('AF'))) return 'SA';
  if(pair(EUR,S('AF'))) return 'WA';
  if(pair(ASI,S('OC'))) return 'IP';
  if(pair(S('SA'),ASI)||pair(S('SA'),S('OC'))) return 'TP';
  return null;
}
function hav(a,b){const R=6371,r=Math.PI/180;const dLa=(b.la-a.la)*r,dLo=(b.lo-a.lo)*r;const s=Math.sin(dLa/2)**2+Math.cos(a.la*r)*Math.cos(b.la*r)*Math.sin(dLo/2)**2;return 2*R*Math.asin(Math.sqrt(s))}

// Build network. Fibre: ~200 km per ms, route factor 1.5 over great circle, +1 ms access.
function buildNet(cities,{N=160,D=6,G=6,seed=7}={}){
  const rnd=mulberry32(seed);
  const tot=cities.reduce((a,c)=>a+c.w,0);
  const nodes=[];
  // allocate counts by weight (largest remainder)
  const raw=cities.map(c=>c.w/tot*N); const cnt=raw.map(Math.floor);
  let left=N-cnt.reduce((a,b)=>a+b,0); raw.map((v,i)=>[v-cnt[i],i]).sort((a,b)=>b[0]-a[0]).slice(0,left).forEach(([,i])=>cnt[i]++);
  cities.forEach((c,ci)=>{for(let j=0;j<cnt[ci];j++){const ang=rnd()*6.283,rad=2+rnd()*5;
    nodes.push({id:nodes.length,ci,c,x:c.x+Math.cos(ang)*rad,y:c.y+Math.sin(ang)*rad*0.8,bw:rnd()<0.2?125000:6250});}}); // bytes per ms: 1 Gbps / 50 Mbps
  const n=nodes.length;
  // pick publisher on a 1 Gbps node in Ashburn-ish by default (index chosen later)
  nodes.forEach(nd=>{nd.mesh=[];nd.gossip=[]});
  const linkSet=new Set(); const key=(a,b)=>a<b?a+'_'+b:b+'_'+a;
  // random mesh like libp2p (peer discovery is not geographic)
  for(let pass=0;pass<4;pass++) for(const a of nodes){ let tries=0; while(a.mesh.length<D&&tries++<50){ const b=nodes[Math.floor(rnd()*n)];
      if(b===a||b.mesh.length>=D+2||linkSet.has(key(a.id,b.id))) continue; linkSet.add(key(a.id,b.id)); a.mesh.push(b.id); b.mesh.push(a.id);} }
  for(const a of nodes){ let tries=0; while(a.gossip.length<G&&tries++<50){ const b=nodes[Math.floor(rnd()*n)]; if(b===a||linkSet.has(key(a.id,b.id))) continue; linkSet.add(key(a.id,b.id)); a.gossip.push(b.id); b.gossip.push(a.id);} }
  const lat=new Map(), cor=new Map();
  for(const k of linkSet){const [i,j]=k.split('_').map(Number);const A=nodes[i],B=nodes[j];
    const km=A.ci===B.ci?20:hav(A.c,B.c); lat.set(k,1+km*1.5/200); cor.set(k,A.ci===B.ci?null:corridorOf(A.c,B.c));}
  return {nodes,lat,cor,key,links:[...linkSet]};
}

class Heap{constructor(){this.a=[]}push(e){const a=this.a;a.push(e);let i=a.length-1;while(i>0){const p=(i-1)>>1;if(a[p].t<=e.t)break;a[i]=a[p];i=p}a[i]=e}
  pop(){const a=this.a,top=a[0],last=a.pop();const n=a.length;if(n){let i=0;while(true){let l=2*i+1,r=l+1,m=-1,mt=last.t;if(l<n&&a[l].t<mt){m=l;mt=a[l].t}if(r<n&&a[r].t<mt){m=r}if(m<0)break;a[i]=a[m];i=m}a[i]=last;}return top}get size(){return this.a.length}}

// retransmission delay for a payload of `bytes` over a link with packet loss p (MTU 1400): max over packets of geometric retries, each costs one RTT + 5 ms
function retrans(bytes,p,rtt,rnd){ if(p<=0) return 0; const S=Math.ceil(bytes/1400); const u=rnd(); let r=0; while(r<20&&Math.pow(1-Math.pow(p,r+1),S)<u) r++; return r*(rtt+5); }

// ---- GF(256) (coefficient vectors only; payload math is linear and done on demand) ----
const EXP=new Uint8Array(512),LOG=new Uint8Array(256);(function(){let x=1;for(let i=0;i<255;i++){EXP[i]=x;LOG[x]=i;x<<=1;if(x&0x100)x^=0x11d}for(let i=255;i<512;i++)EXP[i]=EXP[i-255]})();
const gmul=(a,b)=>(a===0||b===0)?0:EXP[LOG[a]+LOG[b]]; const ginv=a=>EXP[255-LOG[a]];
class Span{ // reduced row echelon basis over GF(256)
  constructor(k){this.k=k;this.rows=[];this.piv=[]}
  get rank(){return this.rows.length}
  reduce(v){const c=Uint8Array.from(v);for(let r=0;r<this.rows.length;r++){const f=c[this.piv[r]];if(f){const R=this.rows[r];for(let j=0;j<this.k;j++)c[j]^=gmul(f,R[j])}}return c}
  add(v){const c=this.reduce(v);let p=-1;for(let j=0;j<this.k;j++)if(c[j]){p=j;break}if(p<0)return false;const inv=ginv(c[p]);for(let j=0;j<this.k;j++)c[j]=gmul(c[j],inv);
    for(const R of this.rows){const f=R[p];if(f)for(let j=0;j<this.k;j++)R[j]^=gmul(f,c[j])}this.rows.push(c);this.piv.push(p);return true}
  recode(rnd){const c=new Uint8Array(this.k);for(const R of this.rows){const f=1+Math.floor(rnd()*255);for(let j=0;j<this.k;j++)c[j]^=gmul(f,R[j])}return c}
}

/* simulate(proto, net, P)
   P: {B bytes, loss p, k, r threshold, m publisher multiplier, pub id, cut:Set corridors, dark:Set city indices, seed, hb heartbeat ms}
   returns {t[] decode/arrival time per node, ev[] transmissions, log per node, stats} */
function simulate(proto,net,P){
  const {nodes,lat,cor,key}=net; const n=nodes.length; const rnd=mulberry32(P.seed*97+(proto==='g'?1:2));
  const alive=nodes.map(nd=>!P.dark.has(nd.ci));
  const up=(a,b)=>alive[a]&&alive[b]&&!(P.cut.has(cor.get(key(a,b))));
  const L=(a,b)=>lat.get(key(a,b));
  const free=new Float64Array(n), T=new Float64Array(n).fill(Infinity), idw=nodes.map(()=>new Set());
  const ev=[]; const st={sent:0,bytes:0,useful:0,dup:0,unhelpful:0,unnecessary:0,dead:0,retx:0};
  const H=new Heap(); const HB=P.hb||700;
  const pub=P.pub;
  const k=P.k, shard=Math.ceil(P.B/k)+k; // payload + coefficient header
  const span=proto==='m'?nodes.map(()=>new Span(k)):null;
  const rankLog=nodes.map(()=>[]); const recv=nodes.map(()=>[]); // mump2p: per node list of {t,v,from,inn}
  // per-node upload queue: items are taken at line rate; IDONTWANT received before an item starts cancels it
  const Q=nodes.map(()=>[]), busy=new Uint8Array(n);
  const sentTo=nodes.map(()=>new Map()), pend=nodes.map(()=>new Set());
  const cap=a=>a===P.pub?Infinity:Math.ceil(P.beta*k/nodes[a].mesh.length);
  function xmit(a,b,t,bytes,payload){ if(payload==='rec'){ if(pend[a].has(b)) return; pend[a].add(b);} Q[a].push({b,bytes,payload}); if(!busy[a]){busy[a]=1;H.push({t,type:'tx',a});} }
  function startTx(a,t){
    while(Q[a].length){ const it=Q[a].shift(); const b=it.b; if(it.payload==='rec') pend[a].delete(b);
      if(idw[a].has(b)) continue;                       // peer already has it
      if(proto==='m'&&it.payload==='rec'&&(it.pull?span[a].rank===0:sentTo[a].get(b)>=Math.min(span[a].rank,cap(a)))) continue; // nothing new to give
      let pl=it.payload; if(pl==='rec') pl=span[a].recode(rnd);
      if(proto==='m') sentTo[a].set(b,(sentTo[a].get(b)||0)+1);
      st.sent++; st.bytes+=it.bytes; const d=it.bytes/nodes[a].bw;
      if(!up(a,b)){ st.dead++; ev.push({a,b,ts:t,ta:t+d+L(a,b),k:4}); }
      else { const l=L(a,b); const rt=retrans(it.bytes,P.loss,2*l,rnd); if(rt>0) st.retx++; H.push({t:t+d+l+rt,type:'rx',a,b,payload:pl,ts:t}); }
      // keep streaming fresh combinations to this peer round-robin while we hold degrees of freedom it has not been offered
      if(proto==='m'&&it.payload==='rec'&&!idw[a].has(b)&&sentTo[a].get(b)<Math.min(span[a].rank,cap(a))&&(nodes[a].mesh.includes(b))){pend[a].add(b);Q[a].push({b,bytes:it.bytes,payload:'rec'});}
      H.push({t:t+d,type:'tx',a}); return; }
    busy[a]=0;
  }
  if(proto==='g'){
    T[pub]=0; for(const b of nodes[pub].mesh) xmit(pub,b,0,P.B);
    for(let i=0;i<n;i++) if(i!==pub) H.push({t:HB*(0.5+rnd()*0.5),type:'hb',a:i});
    while(H.size){const e=H.pop(); if(e.t>15000) break;
      if(e.type==='tx'){startTx(e.a,e.t);continue}
      if(e.type==='rx'){const {a,b}=e; if(T[b]<Infinity){st.dup++;ev.push({a,b,ts:e.ts,ta:e.t,k:1});continue}
        st.useful++; ev.push({a,b,ts:e.ts,ta:e.t,k:0}); T[b]=e.t;
        for(const c of nodes[b].mesh) if(c!==a&&up(b,c)) H.push({t:e.t+L(b,c),type:'idw',a:b,b:c});
        for(const c of nodes[b].mesh) if(c!==a&&!idw[b].has(c)) xmit(b,c,e.t,P.B);
      } else if(e.type==='idw'){ idw[e.b].add(e.a); }
      else if(e.type==='hb'){const i=e.a; if(T[i]<Infinity||!alive[i]) continue;
        // IHAVE/IWANT: ask a connected peer (mesh or gossip) that already has the block
        const peers=[...nodes[i].mesh,...nodes[i].gossip].filter(c=>up(i,c)&&T[c]<=e.t);
        if(peers.length){const c=peers[Math.floor(rnd()*peers.length)]; xmit(c,i,e.t+L(i,c),P.B);}
        H.push({t:e.t+HB,type:'hb',a:i}); }
    }
  } else {
    T[pub]=0; const ps=span[pub]; for(let i=0;i<k;i++){const v=new Uint8Array(k);v[i]=1;ps.add(v)} rankLog[pub].push([0,k]);
    const M=nodes[pub].mesh; const tot=Math.ceil(k*P.m);
    for(let i=0;i<tot;i++){ const b=M[i%M.length]; xmit(pub,b,0,shard,'rec'); }
    for(let i=0;i<n;i++) if(i!==pub) H.push({t:HB*(0.5+rnd()*0.5),type:'hb',a:i});
    while(H.size){const e=H.pop(); if(e.t>15000) break;
      if(e.type==='tx'){startTx(e.a,e.t);continue}
      if(e.type==='rx'){const {a,b,payload}=e; const S=span[b];
        if(T[b]<Infinity){st.unnecessary++;ev.push({a,b,ts:e.ts,ta:e.t,k:3});continue}
        const inn=S.add(payload); recv[b].push({t:e.t,v:payload,from:a,inn});
        if(!inn){st.unhelpful++;ev.push({a,b,ts:e.ts,ta:e.t,k:2});continue}
        st.useful++; ev.push({a,b,ts:e.ts,ta:e.t,k:0}); rankLog[b].push([e.t,S.rank]);
        if(S.rank===k){T[b]=e.t; for(const c of nodes[b].mesh) if(up(b,c)) H.push({t:e.t+L(b,c),type:'idw',a:b,b:c});}
        // relay before decoding: forward to mesh peers that have not said IDONTWANT
        if(S.rank>k*P.r) for(const c of nodes[b].mesh){ if(c===a||idw[b].has(c)) continue; xmit(b,c,e.t,shard,'rec'); }
      } else if(e.type==='idw'){ idw[e.b].add(e.a); }
      else if(e.type==='hb'){const i=e.a; if(T[i]<Infinity||!alive[i]) continue;
        const need=k-span[i].rank;
        const peers=[...nodes[i].mesh,...nodes[i].gossip].filter(c=>up(i,c)&&span[c].rank>span[i].rank);
        peers.sort((x,y)=>span[y].rank-span[x].rank);
        let sent=0; for(const c of peers.slice(0,3)){ const q=Math.ceil((need+1)/Math.min(3,peers.length)); for(let j=0;j<q;j++){Q[c].push({b:i,bytes:shard,payload:'rec',pull:1}); if(!busy[c]){busy[c]=1;H.push({t:e.t+L(i,c),type:'tx',a:c});} sent++} }
        H.push({t:e.t+HB,type:'hb',a:i}); }
    }
  }
  return {T,ev,st,rankLog,recv,alive};
}
if(typeof module!=='undefined') module.exports={buildNet,simulate,mulberry32,Span,gmul,ginv,CORRIDORS,corridorOf};
