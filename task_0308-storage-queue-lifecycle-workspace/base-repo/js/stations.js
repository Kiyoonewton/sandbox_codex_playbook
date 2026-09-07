// ---------------- stations ----------------
const stations=[]; // {id,x,z,w,d,group,glow,light}
function counterBlock(x,z,w,d,h,color,trim){
  const g=new THREE.Group();
  const body=new THREE.Mesh(roundedBoxGeo(w,h,d,Math.min(0.16,h*0.25),0.05),mat(color,0.55));
  body.position.y=h/2; body.castShadow=body.receiveShadow=true; g.add(body);
  const top=new THREE.Mesh(roundedBoxGeo(w+0.14,0.13,d+0.14,0.06,0.04),mat(trim,0.35));
  top.position.y=h+0.065; top.castShadow=top.receiveShadow=true; g.add(top);
  g.position.set(x,0,z); scene.add(g);
  return g;
}
function addGlowRing(x,z,w,d,color){
  const g=new THREE.Mesh(new THREE.PlaneGeometry(w+0.9,d+0.9),
    new THREE.MeshBasicMaterial({color,transparent:true,opacity:0}));
  g.rotation.x=-Math.PI/2; g.position.set(x,0.02,z); scene.add(g); return g;
}
function addStationLight(x,y,z,color){
  const L=new THREE.PointLight(color,0,4.5); L.position.set(x,y,z); scene.add(L); return L;
}

// back row: chop / stove / plate  (counter z=-4.9) — compacted inward
const chopSt ={id:'chop', x:-4.6, z:-4.9, w:3.4, d:1.7};
const stoveSt={id:'stove',x:-0.3, z:-4.9, w:3.4, d:1.7};
const plateSt={id:'plate',x:4.0,  z:-4.9, w:3.4, d:1.7};
// left/right bins — pulled in closer to the play area
const binDefs=[
  {id:'bin_tomato', ing:'tomato', x:-7.9, z:-3.4, w:1.9, d:1.9, label:'TOMATO'},
  {id:'bin_patty',  ing:'patty',  x:-7.9, z:0.1,  w:1.9, d:1.9, label:'PATTY'},
  {id:'bin_bun',    ing:'bun',    x:7.9,  z:-3.4, w:1.9, d:1.9, label:'BUN'},
  {id:'bin_lettuce',ing:'lettuce',x:7.9,  z:0.1,  w:1.9, d:1.9, label:'LETTUCE'},
  {id:'bin_cheese', ing:'cheese', x:7.9,  z:3.6,  w:1.9, d:1.9, label:'CHEESE'},
];
// front: serve + plates + trash
const serveSt={id:'serve',x:-4.0,z:4.9,w:3.2,d:1.7};
const stackSt={id:'stack',x:0.3, z:4.9,w:2.6,d:1.7};
const trashSt={id:'trash',x:4.4, z:4.9,w:2.4,d:1.7};

function textSprite(text,color='#4A2E12',bg='rgba(255,251,239,0)'){
  const c=document.createElement('canvas'); c.width=256; c.height=72;
  const ctx=c.getContext('2d');
  ctx.font='700 44px Fredoka, sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillStyle=color; ctx.fillText(text,128,38);
  const tex=new THREE.CanvasTexture(c); tex.encoding=THREE.sRGBEncoding;
  const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true}));
  sp.scale.set(2.1,0.6,1); return sp;
}

(function buildStations(){
  // chopping board (basil green)
  const cg=counterBlock(chopSt.x,chopSt.z,chopSt.w,chopSt.d,1.0,0x38B96A,0x2FA05C);
  const board=new THREE.Mesh(roundedBoxGeo(1.5,0.07,1.1,0.12,0.025),mat(0xFFE9B8,0.6));
  board.position.set(0,1.19,0); board.castShadow=true; cg.add(board);
  chopSt.group=cg; chopSt.glow=addGlowRing(chopSt.x,chopSt.z,chopSt.w,chopSt.d,0x38B96A);
  chopSt.light=addStationLight(chopSt.x,2.6,chopSt.z+0.4,0x7BFFA8);
  const chopLbl=textSprite('CHOP'); chopLbl.position.set(chopSt.x,2.05,chopSt.z); scene.add(chopLbl);

  // stove (cherry red, 2 burners + hood)
  const sg=counterBlock(stoveSt.x,stoveSt.z,stoveSt.w,stoveSt.d,1.0,0xE8354A,0xB92338);
  const burnerM=mat(0x3A2415,0.7);
  stoveSt.burners=[];
  [-0.8,0.8].forEach(bx=>{
    const b=new THREE.Mesh(new THREE.CylinderGeometry(0.42,0.42,0.07,36),burnerM.clone());
    b.position.set(bx,1.2,0); sg.add(b);
    const ring=new THREE.Mesh(new THREE.TorusGeometry(0.34,0.035,12,36),
      new THREE.MeshStandardMaterial({color:0xFF7A2E,emissive:0xFF5A00,emissiveIntensity:0}));
    ring.rotation.x=Math.PI/2; ring.position.set(bx,1.25,0); sg.add(ring);
    stoveSt.burners.push({mesh:b,ring,item:null,done:false,prog:0});
  });
  // hood (rounded)
  const hood=new THREE.Mesh(roundedBoxGeo(2.9,0.65,1.4,0.22,0.06),mat(0xC9CED6,0.35,0.6));
  hood.position.set(stoveSt.x,3.15,stoveSt.z); hood.castShadow=true; scene.add(hood);
  const hoodPipe=new THREE.Mesh(roundedBoxGeo(0.8,1.6,0.8,0.2,0.05),mat(0xC9CED6,0.35,0.6));
  hoodPipe.position.set(stoveSt.x,4.2,stoveSt.z-0.2); scene.add(hoodPipe);
  stoveSt.group=sg; stoveSt.glow=addGlowRing(stoveSt.x,stoveSt.z,stoveSt.w,stoveSt.d,0xFF8A3C);
  stoveSt.light=addStationLight(stoveSt.x,2.6,stoveSt.z+0.4,0xFFA245);
  const stLbl=textSprite('COOK'); stLbl.position.set(stoveSt.x,2.35,stoveSt.z); scene.add(stLbl);

  // plating counter (blueberry)
  const pg=counterBlock(plateSt.x,plateSt.z,plateSt.w,plateSt.d,1.0,0x3E5FB8,0x2C4799);
  plateSt.group=pg; plateSt.glow=addGlowRing(plateSt.x,plateSt.z,plateSt.w,plateSt.d,0x8FA6E8);
  plateSt.light=addStationLight(plateSt.x,2.6,plateSt.z+0.4,0x9DB4FF);
  plateSt.plates=[null,null]; // assembled plates on counter
  const plLbl=textSprite('PLATE'); plLbl.position.set(plateSt.x,2.05,plateSt.z); scene.add(plLbl);

  // ingredient bins
  binDefs.forEach(bd=>{
    const g=counterBlock(bd.x,bd.z,1.9,1.9,0.85,0xFF8A3C,0xE8661C);
    const crate=new THREE.Mesh(roundedBoxGeo(1.25,0.48,1.25,0.14,0.04),mat(0xB9713B,0.7));
    crate.position.set(0,1.28,0); crate.castShadow=true; g.add(crate);
    const inner=new THREE.Mesh(roundedBoxGeo(1.05,0.38,1.05,0.12,0.03),mat(0x8A5326,0.8));
    inner.position.set(0,1.3,0); g.add(inner);
    bd.group=g; bd.glow=addGlowRing(bd.x,bd.z,1.9,1.9,0xFFD93B);
    bd.light=addStationLight(bd.x+(bd.x<0?1:0),2.4,bd.z,0xFFF3CF);
    // pile of ingredients in crate (3 sample props)
    bd.pile=[];
    for(let i=0;i<3;i++){
      const p=makeFoodMesh(bd.ing);
      p.position.set(rand(-0.28,0.28),1.62,rand(-0.28,0.28));
      p.rotation.y=rand(0,6); g.add(p); bd.pile.push(p);
    }
    const lbl=textSprite(bd.label); lbl.position.set(bd.x,2.35,bd.z); scene.add(lbl);
    stations.push(bd);
  });

  // serve window counter (cherry, matches window above)
  const svg=counterBlock(serveSt.x,serveSt.z,serveSt.w,serveSt.d,1.0,0xE8354A,0xFF8B97);
  serveSt.group=svg; serveSt.glow=addGlowRing(serveSt.x,serveSt.z,serveSt.w,serveSt.d,0xFF8B97);
  serveSt.light=addStationLight(serveSt.x,2.6,serveSt.z-0.4,0xFFB3BC);
  const bell=new THREE.Group();
  const bellDome=new THREE.Mesh(sph(0.22,32,20,0,Math.PI*2,0,Math.PI/2),glossy(0xFFD93B,{metalness:0.4,roughness:0.25}));
  bellDome.castShadow=true; bell.add(bellDome);
  const bellBtn=capsuleMesh(0.04,0.05,mat(0xB92338,0.4),14);
  bellBtn.position.y=0.24; bell.add(bellBtn);
  bell.position.set(1.0,1.16,0); svg.add(bell); serveSt.bell=bell;
  const svLbl=textSprite('SERVE!'); svLbl.position.set(serveSt.x,2.05,serveSt.z); scene.add(svLbl);

  // plate stack
  const stg=counterBlock(stackSt.x,stackSt.z,stackSt.w,stackSt.d,1.0,0x3E5FB8,0x2C4799);
  stackSt.group=stg; stackSt.glow=addGlowRing(stackSt.x,stackSt.z,stackSt.w,stackSt.d,0x8FA6E8);
  stackSt.light=addStationLight(stackSt.x,2.4,stackSt.z,0xC6D4FF);
  stackSt.stack=[]; // plate meshes
  for(let i=0;i<5;i++){
    const p=makePlateMesh();
    p.position.set(-0.45,1.18+i*0.055,0); stg.add(p); stackSt.stack.push(p);
  }
  const pkLbl=textSprite('PLATES'); pkLbl.position.set(stackSt.x,2.05,stackSt.z); scene.add(pkLbl);

  // trash
  const tg=counterBlock(trashSt.x,trashSt.z,trashSt.w,trashSt.d,1.0,0x8A94A6,0x6E7889);
  const binTop=new THREE.Mesh(roundedBoxGeo(1.1,0.09,1.1,0.18,0.03),mat(0x3A4250,0.7));
  binTop.position.set(0,1.2,0); tg.add(binTop);
  trashSt.group=tg; trashSt.glow=addGlowRing(trashSt.x,trashSt.z,trashSt.w,trashSt.d,0xC9CED6);
  trashSt.light=addStationLight(trashSt.x,2.4,trashSt.z,0xE0E5EE);
  const trLbl=textSprite('TRASH'); trLbl.position.set(trashSt.x,2.05,trashSt.z); scene.add(trLbl);

  stations.push(chopSt,stoveSt,plateSt,serveSt,stackSt,trashSt);
})();

// decorative center island (small, with fruit bowl — outside walk loop is clear)
(function deco(){
  const rug=new THREE.Mesh(new THREE.CircleGeometry(1.6,28),mat(0xFF8A3C,0.9));
  rug.rotation.x=-Math.PI/2; rug.position.set(0,0.015,0.3); rug.receiveShadow=true; scene.add(rug);
  const rugIn=new THREE.Mesh(new THREE.CircleGeometry(1.1,28),mat(0xFFB37A,0.9));
  rugIn.rotation.x=-Math.PI/2; rugIn.position.set(0,0.025,0.3); rugIn.receiveShadow=true; scene.add(rugIn);
})();
