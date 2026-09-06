// ---------------- the chef — smooth, sculpted casual-game human ----------------
// Design: organic rounded forms, ~1:5.5 head-to-body casual-hero proportions,
// one continuous lathe silhouette for hips→torso→chest→shoulders (zero seams),
// tapered capsule limbs with sphere joints, sculpted head with friendly face,
// soft matte-plastic materials with gentle specular life. Everything smooth-shaded.
const chef={};
(function buildChef(){
  const root=new THREE.Group();
  const body=new THREE.Group(); root.add(body);

  // materials — soft matte plastic with subtle gloss where it helps
  const skin  =glossy(0xFFDDB8,{roughness:0.45});
  const white =mat(0xFFFBEF,0.42);            // chef whites, softly lit
  const blueM =mat(0x3E5FB8,0.5);             // blueberry pants
  const apronM=mat(0xE8354A,0.5);             // cherry apron
  const shoeM =glossy(0x2C4799,{roughness:0.3});
  const hairM =mat(0x6B4A2F,0.55);

  // ---- LEGS — pivot at hips (y=0.78). Smooth pants capsules flowing into
  // rounded mary-jane shoes; sphere hip joints erase any seam at the pelvis.
  const legL=new THREE.Group(), legR=new THREE.Group();
  [[legL,-0.145],[legR,0.145]].forEach(([lg,x])=>{
    const hip=new THREE.Mesh(sph(0.1,28,22),blueM); lg.add(hip);
    const leg=capsuleMesh(0.092,0.5,blueM,32);
    leg.position.y=-0.35; lg.add(leg);
    const shoe=new THREE.Mesh(sph(0.115,32,24),shoeM);
    shoe.scale.set(1,0.6,1.55); shoe.position.set(0,-0.71,0.06); shoe.castShadow=true; lg.add(shoe);
    const sole=new THREE.Mesh(sph(0.115,28,20),mat(0xFFFBEF,0.5));
    sole.scale.set(1.02,0.28,1.6); sole.position.set(0,-0.755,0.06); lg.add(sole);
    lg.position.set(x,0.78,0); body.add(lg);
  });

  // ---- TORSO — one continuous organic lathe: pelvis → waist → chest → shoulders → neck.
  // No stacked primitives = no visible segment seams; reads as one sculpted body.
  const torso=new THREE.Group(); torso.position.y=0.72; body.add(torso);
  const torsoPts=[
    [0.001,-0.02],[0.15,-0.015],[0.235,0.03],   // pelvis / hips
    [0.262,0.1],[0.245,0.2],                     // waist (gentle taper)
    [0.268,0.32],[0.285,0.42],                   // belly → chest swell
    [0.27,0.52],[0.215,0.62],[0.145,0.68],       // chest → shoulder slope
    [0.085,0.715],[0.07,0.76],[0.001,0.78]       // neck cap
  ].map(p=>new THREE.Vector2(p[0],p[1]));
  const chestGeo=new THREE.LatheGeometry(torsoPts,48); chestGeo.computeVertexNormals();
  const chest=new THREE.Mesh(chestGeo,white);
  chest.scale.set(1,1,0.86); chest.castShadow=true; torso.add(chest);
  // soft shoulder pads — smooth spheres melting arms into torso
  [-0.24,0.24].forEach(x=>{
    const sh=new THREE.Mesh(sph(0.105,28,22),white);
    sh.position.set(x,0.66,0); sh.castShadow=true; torso.add(sh);
  });

  // ---- APRON — curved bib + skirt hugging the lathe, rounded edges everywhere
  const apron=new THREE.Mesh(roundedBoxGeo(0.46,0.44,0.06,0.14,0.025),apronM);
  apron.position.set(0,0.18,0.235); apron.rotation.x=0.06; apron.castShadow=true; torso.add(apron);
  const bib=new THREE.Mesh(roundedBoxGeo(0.3,0.2,0.055,0.08,0.02),apronM);
  bib.position.set(0,0.47,0.225); bib.rotation.x=0.1; torso.add(bib);
  // straps over the shoulders
  [-0.1,0.1].forEach(x=>{
    const strap=capsuleMesh(0.024,0.22,apronM,16);
    strap.position.set(x,0.64,0.17); strap.rotation.x=-0.35; torso.add(strap);
  });
  // waist tie — smooth torus belt + little knot
  const belt=new THREE.Mesh(new THREE.TorusGeometry(0.252,0.042,20,64),mat(0xB92338,0.45));
  belt.rotation.x=Math.PI/2; belt.position.y=0.2; belt.scale.set(1,0.88,1); torso.add(belt);
  const knot=new THREE.Mesh(sph(0.045,20,16),mat(0xB92338,0.45));
  knot.position.set(0,0.2,-0.235); torso.add(knot);

  // neckerchief — soft scarf ring + knot
  const scarf=new THREE.Mesh(new THREE.TorusGeometry(0.105,0.048,20,56),mat(0xFFB37A,0.45));
  scarf.rotation.x=Math.PI/2; scarf.position.y=0.72; torso.add(scarf);
  const sknot=new THREE.Mesh(sph(0.05,24,18),mat(0xFFB37A,0.45));
  sknot.position.set(0,0.68,0.14); torso.add(sknot);

  // ---- ARMS — pivot at shoulders (y=1.38). Tapered smooth capsules with
  // elbow bulge and rounded mitten hands; natural relaxed A-pose.
  const armL=new THREE.Group(), armR=new THREE.Group();
  [[armL,-1],[armR,1]].forEach(([ag,side])=>{
    const shoulder=new THREE.Mesh(sph(0.095,28,22),white); ag.add(shoulder);
    const arm=capsuleMesh(0.075,0.34,white,32);
    arm.scale.set(1,1,0.92); arm.position.y=-0.26; ag.add(arm);
    const cuff=new THREE.Mesh(new THREE.TorusGeometry(0.078,0.024,16,40),apronM);
    cuff.rotation.x=Math.PI/2; cuff.position.y=-0.42; ag.add(cuff);
    const hand=new THREE.Mesh(sph(0.085,32,24),skin);
    hand.scale.set(0.9,1.05,1.1); hand.position.y=-0.52; hand.castShadow=true; ag.add(hand);
    const thumb=new THREE.Mesh(sph(0.034,18,14),skin);
    thumb.position.set(-side*0.055,-0.5,0.05); ag.add(thumb);
    ag.position.set(side*0.31,1.38,0); ag.rotation.z=side*0.14; body.add(ag);
  });

  // ---- HEAD — smooth sculpted sphere, soft jaw taper, friendly detailed face
  const headG=new THREE.Group(); headG.position.y=1.58; body.add(headG);
  const head=new THREE.Mesh(sph(0.235,48,36),skin);
  head.scale.set(0.96,1.02,0.98); head.castShadow=true; headG.add(head);
  // jaw/chin softener
  const chin=new THREE.Mesh(sph(0.16,32,24),skin);
  chin.position.set(0,-0.09,0.05); chin.scale.set(0.95,0.8,0.95); headG.add(chin);
  // ears
  [-0.225,0.225].forEach(x=>{
    const ear=new THREE.Mesh(sph(0.05,24,18),skin);
    ear.position.set(x,-0.01,0); headG.add(ear);
  });
  // hair — smooth sideburn arcs peeking from under the hat
  [-0.19,0.19].forEach(x=>{
    const hb=new THREE.Mesh(sph(0.075,24,18),hairM);
    hb.position.set(x,0.1,0.02); hb.scale.set(0.55,1,0.9); headG.add(hb);
  });
  // eyes — glossy dark with big sparkle highlights (alive, friendly)
  [-0.088,0.088].forEach(x=>{
    const eye=new THREE.Mesh(sph(0.037,24,18),glossy(0x33241A,{roughness:0.15}));
    eye.position.set(x,0.02,0.2); eye.scale.set(1,1.15,0.7); headG.add(eye);
    const shine=new THREE.Mesh(sph(0.014,14,10),new THREE.MeshBasicMaterial({color:0xFFFFFF}));
    shine.position.set(x+0.014,0.038,0.227); headG.add(shine);
    const shine2=new THREE.Mesh(sph(0.007,10,8),new THREE.MeshBasicMaterial({color:0xFFFFFF}));
    shine2.position.set(x-0.012,0.005,0.228); headG.add(shine2);
  });
  // soft arched brows
  [-0.088,0.088].forEach(x=>{
    const brow=new THREE.Mesh(new THREE.TorusGeometry(0.048,0.013,14,28,Math.PI*0.75),hairM);
    brow.position.set(x,0.095,0.195); brow.rotation.x=0.4; brow.rotation.z=0.25; headG.add(brow);
  });
  // blush cheeks
  [-0.15,0.15].forEach(x=>{
    const ch=new THREE.Mesh(sph(0.042,24,18),mat(0xFF9E9E,0.55));
    ch.position.set(x,-0.045,0.165); ch.scale.set(1,0.75,0.4); headG.add(ch);
  });
  // nose + smile
  const nose=new THREE.Mesh(sph(0.034,24,18),mat(0xFFC79B,0.5));
  nose.position.set(0,-0.015,0.23); headG.add(nose);
  const smile=new THREE.Mesh(new THREE.TorusGeometry(0.062,0.016,14,36,Math.PI*0.85),mat(0x8A4A2B,0.5));
  smile.position.set(0,-0.055,0.2); smile.rotation.x=0.25; smile.rotation.z=Math.PI*1.075; headG.add(smile);

  // ---- HAT — tall puffy toque, smooth gathered lobes, soft band
  const hatG=new THREE.Group(); hatG.position.y=0.17; headG.add(hatG);
  const brim=new THREE.Mesh(new THREE.TorusGeometry(0.205,0.06,22,64),white);
  brim.rotation.x=Math.PI/2; brim.position.y=0.03; brim.castShadow=true; hatG.add(brim);
  const band=new THREE.Mesh(new THREE.CylinderGeometry(0.21,0.215,0.1,40),white);
  band.position.y=0.03; hatG.add(band);
  const puff=new THREE.Mesh(sph(0.24,48,36),white);
  puff.position.y=0.26; puff.scale.set(1,0.82,1); puff.castShadow=true; hatG.add(puff);
  [[-0.15,0.02],[0.15,0.02]].forEach(([x,z])=>{
    const p2=new THREE.Mesh(sph(0.125,32,24),white);
    p2.position.set(x,0.21,z); p2.castShadow=true; hatG.add(p2);
  });
  const p3=new THREE.Mesh(sph(0.115,32,24),white);
  p3.position.set(0,0.22,-0.14); p3.castShadow=true; hatG.add(p3);

  // ---- carry anchor (in front, above hands)
  const carry=new THREE.Group(); carry.position.set(0,0.94,0.42); body.add(carry);

  // ---- knife (hidden unless chopping) — rounded blade + wooden grip
  const knife=new THREE.Group();
  const blade=new THREE.Mesh(roundedBoxGeo(0.05,0.3,0.14,0.022,0.015),mat(0xD9DEE6,0.2,0.8));
  blade.position.y=-0.15; knife.add(blade);
  const grip=capsuleMesh(0.032,0.1,mat(0x8A5326,0.55),18);
  grip.position.y=0.06; knife.add(grip);
  knife.position.set(0,-0.53,0.08); knife.visible=false; armR.add(knife);

  root.traverse(o=>{if(o.isMesh)o.castShadow=o.castShadow!==false;});
  scene.add(root);

  Object.assign(chef,{
    root,body,torso,headG,hatG,armL,armR,legL,legR,carry,knife,
    pos:new THREE.Vector3(0,0,2.2), facing:0, speed:5.4,
    carrying:null,          // {kind:'ing',type,state} | {kind:'plate',recipe|null comps:[]}
    walkPhase:0, moving:false,
    chopTimer:0, chopping:null, actionCd:0,
    squash:0, bump:0,
    bobT:0
  });
})();

function chefSquash(v){chef.squash=Math.max(chef.squash,v);}
