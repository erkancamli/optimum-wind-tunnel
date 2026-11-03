import fs from 'fs'; import {feature} from 'topojson-client'; import {geoNaturalEarth1,geoPath} from 'd3-geo';
const topo=JSON.parse(fs.readFileSync('node_modules/world-atlas/land-110m.json'));
const land=feature(topo,topo.objects.land);
const W=1000,H=520; const proj=geoNaturalEarth1().fitExtent([[10,10],[W-10,H-10]],{type:'Sphere'});
const path=geoPath(proj); path.digits?.(1);
let d=path(land); d=d.replace(/(\d+\.\d)\d+/g,'$1');
const sphere=path({type:'Sphere'}).replace(/(\d+\.\d)\d+/g,'$1');
// export projection params
fs.writeFileSync('map.json',JSON.stringify({d,sphere,scale:proj.scale(),tr:proj.translate()}));
console.log(d.length, proj.scale(), proj.translate());
