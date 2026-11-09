(function(){'use strict';
if(!window.THREE||!window.WORLD_GEOJSON)return;
const R=1.6,LNG_OFFSET=105,LINE_COLOR=0x83dfff,GRID_COLOR=0x397493;
try{
function latLngToVec3(lat, lng, radius) {
  const phi = lat * Math.PI / 180, theta = (lng - LNG_OFFSET) * Math.PI / 180;
  return new THREE.Vector3(radius * Math.cos(phi) * Math.sin(theta), radius * Math.sin(phi), radius * Math.cos(phi) * Math.cos(theta));
}

const container = document.getElementById('scene');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x071b2b);
const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 100);
camera.position.set(0, 0.3, 4.8);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
container.appendChild(renderer.domElement);

const globeGroup = new THREE.Group();
scene.add(globeGroup);
globeGroup.add(new THREE.Mesh(new THREE.SphereGeometry(R, 64, 64), new THREE.MeshBasicMaterial({ color: 0x050d1f, transparent: true, opacity: 0.6 })));

(function () {
  const p = [];
  for (let lat = -60; lat <= 60; lat += 30) for (let lng = -180; lng < 180; lng += 5) {
    const a = latLngToVec3(lat, lng, R * 1.001), b = latLngToVec3(lat, lng + 5, R * 1.001);
    p.push(a.x, a.y, a.z, b.x, b.y, b.z);
  }
  for (let lng = -180; lng < 180; lng += 30) for (let lat = -90; lat < 90; lat += 5) {
    const a = latLngToVec3(lat, lng, R * 1.001), b = latLngToVec3(lat + 5, lng, R * 1.001);
    p.push(a.x, a.y, a.z, b.x, b.y, b.z);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3));
  globeGroup.add(new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: GRID_COLOR, transparent: true, opacity: 0.5 })));
})();

(function () {
  const p = [];
  window.WORLD_GEOJSON.features.forEach(f => {
    const g = f.geometry; if (!g) return;
    const ring = r => { for (let i = 0; i < r.length - 1; i++) {
      const a = latLngToVec3(r[i][1], r[i][0], R * 1.002), b = latLngToVec3(r[i+1][1], r[i+1][0], R * 1.002);
      p.push(a.x, a.y, a.z, b.x, b.y, b.z);
    }};
    if (g.type === 'Polygon') g.coordinates.forEach(ring);
    else if (g.type === 'MultiPolygon') g.coordinates.forEach(poly => poly.forEach(ring));
  });
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3));
  globeGroup.add(new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: LINE_COLOR, transparent: true, opacity: 0.85 })));
})();


const reduce=matchMedia('(prefers-reduced-motion: reduce)');
let previous=0;
function animate(now){requestAnimationFrame(animate);if(document.hidden||now-previous<40)return;previous=now;if(!reduce.matches)globeGroup.rotation.y+=0.0012;renderer.render(scene,camera);}
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});
requestAnimationFrame(animate);
}catch(e){document.documentElement.dataset.fallback='true';}
})();