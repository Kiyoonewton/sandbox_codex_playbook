// ---------------- station helpers ----------------
function nearestStation(){
  let best=null,bd=1e9;
  stations.forEach(s=>{
    const d=Math.hypot(chef.pos.x-s.x,chef.pos.z-s.z);
    const reach=Math.max(s.w,s.d)/2+1.15;
    if(d<reach&&d<bd){bd=d;best=s;}
  });
  return best;
}
function stationTopPos(s,i=0){
  return new THREE.Vector3(s.x+(i?i*0.8:0),1.45,s.z);
}

// board & counter item meshes
let boardItem=null;        // {type,mesh}
const CHOP_TIME=1.15;
const COOK_TIME=2.6, BURN_TIME=6.5;
plateSt.plates=[null,null]; // {comps:[], mesh}

function updateBoardVisual(){
  if(boardItem&&!boardItem.mesh){
    boardItem.mesh=makeFoodMesh(boardItem.type,boardItem.state);
    boardItem.mesh.position.set(chopSt.x,1.28,chopSt.z);
    boardItem.mesh.scale.setScalar(1.3);
    scene.add(boardItem.mesh);
  }
  if(boardItem&&boardItem.mesh){
    scene.remove(boardItem.mesh);
    boardItem.mesh=makeFoodMesh(boardItem.type,boardItem.state);
    boardItem.mesh.position.set(chopSt.x,1.28,chopSt.z);
    boardItem.mesh.scale.setScalar(1.3);
    scene.add(boardItem.mesh);
  }
}
function clearBoard(){
  if(boardItem&&boardItem.mesh)scene.remove(boardItem.mesh);
  boardItem=null;
}
function compsLabel(comps){
  return comps.map(c=>COMP_INFO[c].label).join('+');
}
function refreshPlateCounterVisual(){
  plateSt.plates.forEach((pl,i)=>{
    if(pl&&pl.mesh){scene.remove(pl.mesh);pl.mesh=null;}
    if(pl){
      pl.mesh=makePlateMesh();
      const content=buildPlateContents({comps:pl.comps});
      content.scale.setScalar(0.9); content.position.y=0.04; pl.mesh.add(content);
      pl.mesh.position.set(plateSt.x-0.7+i*1.4,1.18,plateSt.z);
      pl.mesh.scale.setScalar(1.2);
      const lbl=textSprite(compsLabel(pl.comps),'#2C4799');
      lbl.position.set(0,0.72,0); lbl.scale.set(1.5,0.42,1); pl.mesh.add(lbl);
      scene.add(pl.mesh);
    }
  });
}
function refreshStackVisual(){
  const n=5-Math.min(5,G.platesUsed||0);
}
function refreshBurnerVisual(b){
  if(b.mesh){stoveSt.group.remove(b.mesh);b.mesh=null;}
  if(b.item){
    b.mesh=makeFoodMesh(b.item.type,b.done?'cooked':'raw');
    b.mesh.scale.setScalar(1.4);
    b.mesh.position.copy(b.ring.position); b.mesh.position.y=1.32;
    // pan
    const pan=new THREE.Group();
    const pbase=new THREE.Mesh(new THREE.CylinderGeometry(0.36,0.3,0.09,36),mat(0x4A4038,0.4,0.6));
    pbase.castShadow=true; pan.add(pbase);
    const prim=new THREE.Mesh(new THREE.TorusGeometry(0.33,0.03,12,36),mat(0x4A4038,0.4,0.6));
    prim.rotation.x=Math.PI/2; prim.position.y=0.045; pan.add(prim);
    const phandle=capsuleMesh(0.035,0.28,mat(0x4A4038,0.4,0.6),14);
    phandle.rotation.z=Math.PI/2; phandle.position.set(0.5,0.02,0); pan.add(phandle);
    b.mesh.add(pan); pan.position.y=-0.02;
    stoveSt.group.add(b.mesh);
  }
}
