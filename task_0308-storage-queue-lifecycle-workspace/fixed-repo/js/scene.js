// ---------------- three.js setup ----------------
const canvas=el('game');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true});
renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.5));
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.outputEncoding=THREE.sRGBEncoding;

const scene=new THREE.Scene();
scene.background=new THREE.Color(0xF0CE7C);         // warm honey haze
scene.fog=new THREE.Fog(0xF0CE7C,26,46);

const camera=new THREE.PerspectiveCamera(38,1,0.1,100);
camera.position.set(0,13.2,9.8);
camera.lookAt(0,0,0.7);

function resize(){
  const w=window.innerWidth,h=window.innerHeight;
  renderer.setSize(w,h);
  camera.aspect=w/h;
  // widen view on narrow/portrait screens so the whole kitchen stays visible
  camera.fov=camera.aspect<0.8?72:camera.aspect<1.2?54:38;
  camera.updateProjectionMatrix();
}
window.addEventListener('resize',resize); resize();

// lights — warm golden-hour ambience (deeper, cozier than noon sun)
scene.add(new THREE.HemisphereLight(0xFFE3AC,0xD98F3E,0.6));
const sun=new THREE.DirectionalLight(0xFFD396,0.9);
sun.position.set(6,14,6); sun.castShadow=true;
sun.shadow.mapSize.set(2048,2048);
sun.shadow.camera.left=-12; sun.shadow.camera.right=12;
sun.shadow.camera.top=12; sun.shadow.camera.bottom=-12;
sun.shadow.bias=-0.0004;
scene.add(sun);
const fill=new THREE.DirectionalLight(0xD9B98F,0.12); fill.position.set(-6,8,-4); scene.add(fill);

// material helpers — candy matte-plastic
function mat(color,rough=0.55,metal=0.0,extra={}){
  return new THREE.MeshStandardMaterial(Object.assign({color,roughness:rough,metalness:metal},extra));
}
function glossy(color,extra={}){ return mat(color,0.22,0.05,extra); }

// --- anti-low-poly sweep: upscale every primitive to smooth segment counts ---
// (wraps the constructors so ALL existing code automatically becomes high-poly,
//  and patches BoxGeometry onto the global so scene code can keep using it)
(function smoothPrimitives(){
  const _S=THREE.SphereGeometry, _C=THREE.CylinderGeometry, _T=THREE.TorusGeometry,
        _Co=THREE.ConeGeometry, _Ci=THREE.CircleGeometry, _E=THREE.ExtrudeGeometry;
  const H=36; // smooth-segment floor — curves read as smooth, no visible facets
  THREE.SphereGeometry=function(r,a=H,b=H*0.75,ps,pt,ts,tl){return new _S(r,Math.max(a,H),Math.max(b,H*0.75),ps,pt,ts,tl);};
  THREE.CylinderGeometry=function(a,b,h,s=H,hs){return new _C(a,b,h,Math.max(s,H),hs||1);};
  THREE.TorusGeometry=function(r,t,a=20,b=H,arc){return new _T(r,t,Math.max(a,20),Math.max(b,H),arc);};
  THREE.ConeGeometry=function(r,h,s=H){return new _Co(r,h,Math.max(s,H));};
  THREE.CircleGeometry=function(r,s=H,t0,tl){return new _Ci(r,Math.max(s,H),t0,tl);};
  THREE.ExtrudeGeometry=function(sh,o={}){
    o=Object.assign({bevelSegments:5,curveSegments:14},o);
    o.bevelSegments=Math.max(o.bevelSegments,5); o.curveSegments=Math.max(o.curveSegments,14);
    const g=new _E(sh,o); g.computeVertexNormals(); return g;
  };
  const _B=THREE.BoxGeometry;
  window.__FlatBoxGeo=function(w,h,d,ws,hs,ds){return new _B(w,h,d,ws,hs,ds);};
  // rounded beveled box replaces flat box (soft toy-plastic edges, zero hard corners)
  THREE.BoxGeometry=function(w,h,d,ws,hs,ds){
    const minD=Math.min(w,h,d);
    // small/thin pieces (tiles, planks, frames, shelf) stay flat; boxy volumes get rounded
    if(minD<=0.3)return new _B(w,h,d,ws,hs,ds);
    return roundedBoxGeo(w,h,d,Math.min(0.16,minD*0.3),Math.min(0.07,minD*0.22));
  };
})();
// --- high-poly smooth geometry helpers (nothing low-poly) ---
function sph(r,w=36,h=28){return new THREE.SphereGeometry(r,w,h);}
function capsuleMesh(r,len,material,rad=32){
  const g=new THREE.Group();
  const cyl=new THREE.Mesh(new THREE.CylinderGeometry(r,r,len,rad),material);
  g.add(cyl);
  const top=new THREE.Mesh(sph(r,rad,Math.max(18,rad>>1)),material); top.position.y=len/2; g.add(top);
  const bot=top.clone(); bot.position.y=-len/2; g.add(bot);
  g.traverse(o=>{if(o.isMesh)o.castShadow=true;});
  return g;
}
// smooth organic limb/tube along a spine (e.g. arm curving to hands, leg to foot)
function latheMesh(pts,matl,seg=36){
  const g=new THREE.LatheGeometry(pts.map(p=>new THREE.Vector2(p[0],p[1])),seg);
  g.computeVertexNormals();
  const m=new THREE.Mesh(g,matl); m.castShadow=true; return m;
}
function roundedBoxGeo(w,h,d,r,bev=0.045){
  r=Math.min(r,h*0.45,w*0.45);
  const s=new THREE.Shape();
  const x=-w/2,y=-h/2;
  s.moveTo(x+r,y); s.lineTo(x+w-r,y); s.quadraticCurveTo(x+w,y,x+w,y+r);
  s.lineTo(x+w,y+h-r); s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  s.lineTo(x+r,y+h); s.quadraticCurveTo(x,y+h,x,y+h-r);
  s.lineTo(x,y+r); s.quadraticCurveTo(x,y,x+r,y);
  bev=Math.min(bev,d*0.45);
  const depth=Math.max(0.01,d-2*bev);
  const g=new THREE.ExtrudeGeometry(s,{depth,bevelEnabled:true,bevelThickness:bev,
    bevelSize:Math.min(bev,r*0.7),bevelSegments:5,curveSegments:14});
  g.translate(0,0,-depth/2);
  g.computeVertexNormals();
  return g;
}

// ---------------- floor: lemon checker tiles ----------------
(function buildFloor(){
  const S=1; const half=11;
  const geo=new THREE.BoxGeometry(S,0.1,S);
  const m1=mat(0xF0C233,0.9), m2=mat(0xE0AC14,0.9);
  const group=new THREE.Group();
  for(let x=-half;x<=half;x++)for(let z=-half;z<=half;z++){
    const m=new THREE.Mesh(geo,((x+z)&1)===0?m1:m2);
    m.position.set(x*S,-0.05,z*S); m.receiveShadow=true; group.add(m);
  }
  scene.add(group);
  // big soft ground plane beyond tiles
  const outer=new THREE.Mesh(new THREE.PlaneGeometry(80,80),mat(0xDDA410,0.95));
  outer.rotation.x=-Math.PI/2; outer.position.y=-0.12; outer.receiveShadow=true; scene.add(outer);
})();

// ---------------- walls, window, shelves ----------------
const swingers=[];
(function buildWalls(){
  const wallM=mat(0xF5DCA6,0.9);
  // back wall (berry base + cream upper)
  const back=new THREE.Mesh(new THREE.BoxGeometry(24,1.6,0.4),mat(0x3E5FB8,0.7));
  back.position.set(0,0.8,-5.9); back.castShadow=back.receiveShadow=true; scene.add(back);
  const backUp=new THREE.Mesh(new THREE.BoxGeometry(24,4.6,0.3),wallM);
  backUp.position.set(0,3.9,-6.0); scene.add(backUp);
  // side walls
  [-11.6,11.6].forEach(x=>{
    const w=new THREE.Mesh(new THREE.BoxGeometry(0.4,1.6,12.4),mat(0x3E5FB8,0.7));
    w.position.set(x,0.8,-0.2); w.castShadow=true; scene.add(w);
    const up=new THREE.Mesh(new THREE.BoxGeometry(0.3,4.6,12.4),wallM);
    up.position.set(x,3.9,-0.2); scene.add(up);
  });
  // sunny serving window
  const win=new THREE.Group();
  const sky=new THREE.Mesh(new THREE.PlaneGeometry(4.6,2.7),new THREE.MeshBasicMaterial({color:0xFFC27A}));
  sky.position.set(0,0,0.02); win.add(sky);
  const cloudM=new THREE.MeshBasicMaterial({color:0xFFF2DC});
  [[-1.3,0.6],[0.9,0.9],[1.6,0.2]].forEach(([cx,cy])=>{
    const c=new THREE.Mesh(new THREE.CircleGeometry(0.34,16),cloudM);
    c.position.set(cx,cy,0.03); win.add(c);
    const c2=new THREE.Mesh(new THREE.CircleGeometry(0.24,16),cloudM);
    c2.position.set(cx+0.34,cy-0.06,0.03); win.add(c2);
  });
  const sunDisc=new THREE.Mesh(new THREE.CircleGeometry(0.42,20),new THREE.MeshBasicMaterial({color:0xFF9640}));
  sunDisc.position.set(-1.6,0.85,0.03); win.add(sunDisc);
  const hillM=new THREE.MeshBasicMaterial({color:0x7ED491});
  const hill=new THREE.Mesh(new THREE.CircleGeometry(2.6,24,0,Math.PI),hillM);
  hill.scale.y=0.4; hill.position.set(0.4,-1.35,0.03); win.add(hill);
  // frame
  const frameM=mat(0xE8661C,0.5);
  const fr=[[4.9,0.24,0,1.45],[4.9,0.24,0,-1.45],[0.24,3.1,-2.42,0],[0.24,3.1,2.42,0],[0.16,3.1,0,0]];
  fr.forEach(([w,h,x,y])=>{
    const f=new THREE.Mesh(new THREE.BoxGeometry(w,h,0.24),frameM);
    f.position.set(x,y,0.06); f.castShadow=true; win.add(f);
  });
  win.position.set(0,3.1,-5.82); scene.add(win);
  // window awning (striped)
  const awn=new THREE.Group();
  for(let i=0;i<8;i++){
    const s=new THREE.Mesh(new THREE.BoxGeometry(0.66,0.1,1.1),mat(i%2?0xFFFBEF:0xE8354A,0.6));
    s.position.set(-2.31+i*0.66,0,0); awn.add(s);
  }
  awn.position.set(0,4.85,-5.35); awn.rotation.x=0.5; scene.add(awn);
  // shelf with jars (right wall)
  const shelf=new THREE.Mesh(new THREE.BoxGeometry(0.5,0.12,4.6),mat(0xE8661C,0.55));
  shelf.position.set(11.1,2.6,-1); shelf.castShadow=true; scene.add(shelf);
  const jarCols=[0xE8354A,0xFFD93B,0x38B96A,0xFF8A3C,0x8FA6E8];
  jarCols.forEach((c,i)=>{
    const jar=new THREE.Group();
    const body=new THREE.Mesh(new THREE.CylinderGeometry(0.2,0.22,0.44,28),glossy(c,{transparent:true,opacity:0.92}));
    body.castShadow=true; jar.add(body);
    const shoulder=new THREE.Mesh(sph(0.2,24,16,0,Math.PI*2,0,Math.PI/2),glossy(c,{transparent:true,opacity:0.92}));
    shoulder.position.y=0.22; shoulder.scale.y=0.55; jar.add(shoulder);
    const lid=new THREE.Mesh(new THREE.CylinderGeometry(0.13,0.15,0.12,24),mat(0xFFFBEF,0.5));
    lid.position.y=0.36; jar.add(lid);
    jar.position.set(11.1,2.95,-2.9+i*0.95); scene.add(jar);
  });
  // hanging utensils (left wall)
  const rack=new THREE.Mesh(new THREE.BoxGeometry(0.1,0.1,4),mat(0x8A5A2B,0.5));
  rack.position.set(-11.25,3.3,-1); scene.add(rack);
  for(let i=0;i<4;i++){
    const u=new THREE.Group();
    const hook=new THREE.Mesh(new THREE.TorusGeometry(0.07,0.025,12,24),mat(0xC9CED6,0.35,0.7));
    u.add(hook);
    const handle=capsuleMesh(0.035,0.45,mat(0xE8354A,0.5),14);
    handle.position.y=-0.33; u.add(handle);
    const head=new THREE.Mesh(sph(0.12,20,16),mat(0xC9CED6,0.35,0.7));
    head.position.y=-0.68; head.scale.y=1.35; head.castShadow=true; u.add(head);
    u.position.set(-11.25,3.26,-2.5+i*1.05); u.rotation.z=Math.sin(i)*0.06;
    u.userData.swingPhase=i*1.7; scene.add(u); swingers.push(u);
  }
})();
