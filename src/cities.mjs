import fs from 'fs'; import {geoNaturalEarth1} from 'd3-geo';
const W=1000,H=520; const proj=geoNaturalEarth1().fitExtent([[10,10],[W-10,H-10]],{type:'Sphere'});
// [name, lat, lon, region, weight]
const C=[
['Ashburn',39.04,-77.49,'NA',14],['New York',40.71,-74.0,'NA',6],['Chicago',41.88,-87.63,'NA',4],['Dallas',32.78,-96.8,'NA',3],
['San Jose',37.34,-121.89,'NA',5],['Seattle',47.6,-122.33,'NA',3],['Los Angeles',34.05,-118.24,'NA',3],['Toronto',43.65,-79.38,'CA',3],['Montreal',45.5,-73.57,'CA',2],['Miami',25.76,-80.19,'NA',2],
['Frankfurt',50.11,8.68,'EU',12],['Falkenstein',50.48,12.37,'EU',6],['Amsterdam',52.37,4.9,'EU',6],['London',51.5,-0.12,'EU',6],['Paris',48.86,2.35,'EU',4],['Helsinki',60.17,24.94,'EU',4],
['Stockholm',59.33,18.07,'EU',2],['Warsaw',52.23,21.01,'EU',2],['Zurich',47.37,8.54,'EU',2],['Madrid',40.42,-3.7,'EU',2],['Milan',45.46,9.19,'EU',1],['Istanbul',41.01,28.98,'EU',2],['Kyiv',50.45,30.52,'EU',1],['Dublin',53.35,-6.26,'EU',2],
['Singapore',1.35,103.82,'AS',5],['Tokyo',35.68,139.69,'AS',4],['Seoul',37.57,126.98,'AS',3],['Hong Kong',22.32,114.17,'AS',3],['Mumbai',19.08,72.88,'AS',2],['Bangalore',12.97,77.59,'AS',1],['Taipei',25.03,121.57,'AS',1],
['Sydney',-33.87,151.21,'OC',2],['São Paulo',-23.55,-46.63,'SA',2],['Buenos Aires',-34.6,-58.38,'SA',1],['Lagos',6.52,3.38,'AF',1],['Johannesburg',-26.2,28.05,'AF',1],['Dubai',25.2,55.27,'ME',1],['Tel Aviv',32.08,34.78,'ME',1]];
const out=C.map(([n,la,lo,r,w])=>{const [x,y]=proj([lo,la]);return {n,la,lo,r,w,x:+x.toFixed(1),y:+y.toFixed(1)}});
fs.writeFileSync('cities.json',JSON.stringify(out)); console.log(out.length, out.reduce((a,c)=>a+c.w,0));
