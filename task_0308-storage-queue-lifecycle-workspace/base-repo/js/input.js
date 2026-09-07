// ---------------- input ----------------
const keys={};
const joy={active:false,dx:0,dz:0,id:null};
window.addEventListener('keydown',e=>{
  if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code))e.preventDefault();
  keys[e.code]=true;
  if(e.code==='Space'||e.code==='KeyE')tryAction();
  if(e.code==='KeyP'||e.code==='Escape')togglePause();
});
window.addEventListener('keyup',e=>{keys[e.code]=false;});
// click-to-move
let clickTarget=null;
const ray=new THREE.Raycaster(), mouseV=new THREE.Vector2();
const floorPlane=new THREE.Plane(new THREE.Vector3(0,1,0),0);
canvas.addEventListener('pointerdown',e=>{
  if(G.state!=='playing')return;
  if(e.pointerType==='touch')return; // touch uses joystick
  mouseV.set((e.clientX/window.innerWidth)*2-1,-(e.clientY/window.innerHeight)*2+1);
  ray.setFromCamera(mouseV,camera);
  const pt=new THREE.Vector3();
  if(ray.ray.intersectPlane(floorPlane,pt)){
    // if click is near chef -> context action, else move target
    if(pt.distanceTo(chef.pos)<1.4)tryAction();
    else clickTarget=pt.clone();
  }
});
// double-tap canvas = action
let lastTap=0;
canvas.addEventListener('dblclick',()=>{if(G.state==='playing')tryAction();});

// joystick
const joyBase=el('joyBase'), joyStick=el('joyStick');
joyBase.addEventListener('pointerdown',e=>{
  joy.active=true; joy.id=e.pointerId; joyBase.setPointerCapture(e.pointerId); moveJoy(e);
});
joyBase.addEventListener('pointermove',e=>{if(joy.active&&e.pointerId===joy.id)moveJoy(e);});
['pointerup','pointercancel'].forEach(ev=>joyBase.addEventListener(ev,e=>{
  if(e.pointerId===joy.id){joy.active=false;joy.dx=joy.dz=0;joyStick.style.transform='translate(-50%,-50%)';}
}));
function moveJoy(e){
  const r=joyBase.getBoundingClientRect();
  let dx=e.clientX-(r.left+r.width/2), dz=e.clientY-(r.top+r.height/2);
  const max=r.width/2, len=Math.hypot(dx,dz);
  if(len>max){dx*=max/len;dz*=max/len;}
  joy.dx=dx/max; joy.dz=dz/max;
  joyStick.style.transform=`translate(calc(-50% + ${dx}px),calc(-50% + ${dz}px))`;
}
el('actBtn').addEventListener('pointerdown',e=>{e.preventDefault();tryAction();});
