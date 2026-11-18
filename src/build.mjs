import fs from 'fs'; import {geoNaturalEarth1} from 'd3-geo';
const W=1000,H=520; const proj=geoNaturalEarth1().fitExtent([[10,10],[W-10,H-10]],{type:'Sphere'});
const CUTPOS={TA:[-40,47],TP:[-160,32],RS:[39,18],BA:[19,57],AM:[-78,14],SA:[-26,-10],WA:[-13,10],IP:[128,-14]};
const CUTXY={}; for(const k in CUTPOS){const [x,y]=proj(CUTPOS[k]); CUTXY[k]=[+x.toFixed(1),+y.toFixed(1)];}
const map=JSON.parse(fs.readFileSync('map.json'));
const data=`const MAP=${JSON.stringify({d:map.d})};\nconst CITIES=${fs.readFileSync('cities.json','utf8')};\nconst CUTXY=${JSON.stringify(CUTXY)};`;
const sim=fs.readFileSync('sim.js','utf8');
let html=fs.readFileSync('src.html','utf8').replace('/*DATA*/',()=>data).replace('/*SIM*/',()=>sim).replace('/*APP*/',()=>fs.readFileSync('app.js','utf8'));
const SITE='https://optimum-wind-tunnel.netlify.app';
const today=new Date().toISOString().slice(0,10);
const META={
 en:{path:'/',locale:'en_US',title:'Optimum Wind Tunnel: mump2p vs Gossipsub block propagation simulator',
   desc:'Interactive simulation of Optimum mump2p (RLNC coded gossip) vs libp2p Gossipsub on a real world map. Cut undersea cables, black out data centres and count how many Ethereum validators miss the attestation deadline.',
   og:'What happens to a block when the Red Sea goes dark? Cut real cables and count missed votes on Gossipsub vs Optimum mump2p.'},
 tr:{path:'/tr/',locale:'tr_TR',title:'Optimum Wind Tunnel: mump2p ve Gossipsub blok yayılımı simülasyonu',
   desc:'Optimum mump2p (RLNC kodlu gossip) ile libp2p Gossipsub\'ı gerçek bir dünya haritasında karşılaştıran etkileşimli simülasyon. Denizaltı kablolarını kes, veri merkezlerini karart ve kaç Ethereum validator\'ının attestation sınırını kaçırdığını say.',
   og:'Kızıldeniz karardığında bir bloğa ne olur? Gerçek kabloları kes, Gossipsub ve Optimum mump2p\'de kaçan oyları say.'}};
const FAQ=[
 ['What is mump2p?','mump2p (formerly OptimumP2P) is Optimum\'s peer to peer propagation protocol. It runs inside libp2p and reuses the Gossipsub mesh, but instead of forwarding whole messages it sends coded shards made with random linear network coding (RLNC). It went live on Ethereum mainnet in October 2026 through the Optimum gateway.'],
 ['What is random linear network coding (RLNC)?','RLNC splits data into k pieces and sends random linear combinations of them over a finite field, here GF(2^8). Any k independent combinations are enough to rebuild the original. Relays can mix the combinations they hold into new ones without decoding first, so they can forward useful data as soon as the first piece arrives.'],
 ['How is mump2p different from Gossipsub?','Gossipsub, used by Ethereum today, forwards a full block only after a node has received all of it, so every hop pays the full transfer time again. mump2p forwards coded shards immediately and a node needs any k independent shards, not specific ones, so slow or lost packets on one path stop mattering.'],
 ['Why does propagation speed matter for Ethereum validators?','Attesters vote 4 seconds into each 12 second slot. A validator that has not received the block by then votes for the wrong head and loses rewards. Late published blocks and network trouble make this worse, which is what the cable cut scenarios show.'],
 ['Is this an official Optimum tool?','No. The Optimum Wind Tunnel is a fan made, open source simulation built by ecamli for the Optimum community. It follows the published OptimumP2P paper, the mump2p docs and the dev setup defaults, and it is a simulation, not a benchmark.']];
const esc=s=>s.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
function head(l){ const m=META[l], url=SITE+m.path;
 const ld=[{"@context":"https://schema.org","@type":"WebApplication","name":"Optimum Wind Tunnel","url":url,"description":m.desc,"applicationCategory":"EducationalApplication","operatingSystem":"Any (web browser)","inLanguage":l,"isAccessibleForFree":true,"offers":{"@type":"Offer","price":"0","priceCurrency":"USD"},"image":SITE+"/og.png","author":{"@type":"Person","name":"ecamli","url":"https://x.com/ekinoks_26","sameAs":["https://github.com/erkancamli"]},"codeRepository":"https://github.com/erkancamli/optimum-wind-tunnel","license":"https://opensource.org/licenses/MIT","about":[{"@type":"Thing","name":"Optimum mump2p","sameAs":"https://www.getoptimum.xyz"},{"@type":"Thing","name":"Random linear network coding","sameAs":"https://en.wikipedia.org/wiki/Linear_network_coding"},{"@type":"Thing","name":"Ethereum","sameAs":"https://en.wikipedia.org/wiki/Ethereum"}],"keywords":"Optimum, mump2p, OptimumP2P, RLNC, random linear network coding, Gossipsub, libp2p, Ethereum, block propagation, attestation deadline, simulation"}];
 if(l==='en') ld.push({"@context":"https://schema.org","@type":"FAQPage","mainEntity":FAQ.map(([q,a])=>({"@type":"Question","name":q,"acceptedAnswer":{"@type":"Answer","text":a}}))});
 return `<!doctype html>
<html lang="${l}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(m.title)}</title>
<meta name="description" content="${esc(m.desc)}">
<meta name="author" content="ecamli">
<meta name="robots" content="index,follow,max-image-preview:large">
<link rel="canonical" href="${url}">
<link rel="alternate" hreflang="en" href="${SITE}/">
<link rel="alternate" hreflang="tr" href="${SITE}/tr/">
<link rel="alternate" hreflang="x-default" href="${SITE}/">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="#121417">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Optimum Wind Tunnel">
<meta property="og:url" content="${url}">
<meta property="og:locale" content="${m.locale}">
<meta property="og:locale:alternate" content="${l==='en'?'tr_TR':'en_US'}">
<meta property="og:title" content="${esc(m.title)}">
<meta property="og:description" content="${esc(m.og)}">
<meta property="og:image" content="${SITE}/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Two world maps side by side: Gossipsub and Optimum mump2p spreading a block during a Red Sea cable cut">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:creator" content="@ekinoks_26">
<meta name="twitter:title" content="${esc(m.title)}">
<meta name="twitter:description" content="${esc(m.og)}">
<meta name="twitter:image" content="${SITE}/og.png">
<script type="application/ld+json">${JSON.stringify(ld.length===1?ld[0]:ld)}</script>
${l==='tr'?'<script>window.WT_LANG="tr"</script>\n':''}<style>html{color-scheme:dark}body{margin:0}img{max-width:100%}[hidden]{display:none!important}:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}</style>
</head>
<body>
<noscript><p style="padding:16px;font-family:sans-serif">The Optimum Wind Tunnel is an interactive simulation and needs JavaScript. It compares Optimum mump2p and libp2p Gossipsub block propagation on a real world map.</p></noscript>
`;}
if(process.argv.includes('--standalone')){
  const body=html.replace(/^<title>[^<]*<\/title>\n/,'');
  fs.writeFileSync('../index.html',head('en')+body+'\n</body>\n</html>\n');
  fs.mkdirSync('../tr',{recursive:true}); fs.writeFileSync('../tr/index.html',head('tr')+body+'\n</body>\n</html>\n');
  fs.writeFileSync('../robots.txt',`User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
  fs.writeFileSync('../sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${['/','/tr/'].map(p=>`  <url>
    <loc>${SITE}${p}</loc>
    <lastmod>${today}</lastmod>
    <xhtml:link rel="alternate" hreflang="en" href="${SITE}/"/>
    <xhtml:link rel="alternate" hreflang="tr" href="${SITE}/tr/"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}/"/>
  </url>`).join('\n')}
</urlset>
`);
  console.log('standalone en+tr written');
} else { fs.writeFileSync('../artifact.html',html); console.log('bytes',html.length); }
