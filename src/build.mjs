import fs from 'fs'; import {geoNaturalEarth1} from 'd3-geo';
const W=1000,H=520; const proj=geoNaturalEarth1().fitExtent([[10,10],[W-10,H-10]],{type:'Sphere'});
const CUTPOS={TA:[-40,47],TP:[-160,32],RS:[39,18],BA:[19,57],AM:[-78,14],SA:[-26,-10],WA:[-13,10],IP:[128,-14]};
const CUTXY={}; for(const k in CUTPOS){const [x,y]=proj(CUTPOS[k]); CUTXY[k]=[+x.toFixed(1),+y.toFixed(1)];}
const map=JSON.parse(fs.readFileSync('map.json'));
const data=`const MAP=${JSON.stringify({d:map.d})};\nconst CITIES=${fs.readFileSync('cities.json','utf8')};\nconst CUTXY=${JSON.stringify(CUTXY)};`;
const sim=fs.readFileSync('sim.js','utf8');
let html=fs.readFileSync('src.html','utf8').replace('/*DATA*/',()=>data).replace('/*SIM*/',()=>sim).replace('/*APP*/',()=>fs.readFileSync('app.js','utf8'));
const head=`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="description" content="mump2p (RLNC) vs Gossipsub on a real-world map. Your own file is coded with real GF(2^8) arithmetic. Cut undersea cables, black out data centres, watch the attestation deadline.">
<meta property="og:title" content="Optimum Wind Tunnel">
<meta property="og:description" content="Same Earth. Same cables. Same block. Two ways to move it.">
<meta property="og:image" content="https://optimum-wind-tunnel.netlify.app/og.png">
<meta name="twitter:card" content="summary_large_image">
<style>html{color-scheme:dark}body{margin:0}img{max-width:100%}[hidden]{display:none!important}:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}</style>
</head>
<body>
`;
if(process.argv.includes('--standalone')) html=head+html+'\n</body>\n</html>\n';
fs.writeFileSync(process.argv.includes('--standalone')?'../index.html':'../artifact.html',html); console.log('bytes',html.length);
