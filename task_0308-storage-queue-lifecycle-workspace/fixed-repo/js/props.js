//---------------- 3D food props ----------------
function makeFoodMesh(type,state){
  const g=new THREE.Group();
  state=state||'raw';
  if(type==='tomato'){
    if(state==='chopped'){
      for(let i=0;i<3;i++){
        // rounded juicy chunks
        const s=new THREE.Mesh(sph(0.095,20,16),glossy(0xE8354A));
        s.scale.set(1,0.62,1);
        s.position.set((i-1)*0.15,0.055,rand(-0.06,0.06)); s.rotation.y=rand(0,3); s.castShadow=true; g.add(s);
        const seed=new THREE.Mesh(new THREE.CylinderGeometry(0.052,0.052,0.014,20),mat(0xFF8B97,0.4));
        seed.position.copy(s.position); seed.position.y+=0.045; seed.rotation.y=s.rotation.y; g.add(seed);
      }
    }else{
      const b=new THREE.Mesh(sph(0.19,32,24),glossy(0xE8354A));
      b.position.y=0.17; b.scale.y=0.9; b.castShadow=true; g.add(b);
      const leaf=new THREE.Mesh(new THREE.ConeGeometry(0.085,0.1,12),mat(0x38B96A,0.5));
      leaf.position.y=0.34; g.add(leaf);
      const stem=new THREE.Mesh(new THREE.CylinderGeometry(0.016,0.02,0.07,10),mat(0x239152,0.5));
      stem.position.y=0.38; g.add(stem);
    }
  }else if(type==='lettuce'){
    if(state==='chopped'){
      for(let i=0;i<4;i++){
        // soft shredded leaves
        const s=new THREE.Mesh(sph(0.075,16,12),mat(i%2?0x9FE3BC:0x38B96A,0.45));
        s.scale.set(1,0.28,1);
        s.position.set(rand(-0.16,0.16),0.035+i*0.014,rand(-0.14,0.14)); s.rotation.y=rand(0,3); s.castShadow=true; g.add(s);
      }
    }else{
      const b=new THREE.Mesh(sph(0.21,32,24),mat(0x38B96A,0.42,0,{emissive:0x0E4D28,emissiveIntensity:0.28}));
      b.position.y=0.19; b.scale.y=0.82; b.castShadow=true; g.add(b);
      for(let i=0;i<4;i++){
        const lf=new THREE.Mesh(sph(0.115,20,16),mat(0x5ED689,0.42,0,{emissive:0x1A6B3A,emissiveIntensity:0.22}));
        const a=i/4*Math.PI*2;
        lf.position.set(Math.cos(a)*0.13,0.25,Math.sin(a)*0.13); lf.scale.set(1,0.4,1); lf.castShadow=true; g.add(lf);
      }
    }
  }else if(type==='patty'){
    const cooked=state==='cooked';
    // rounded-edge patty
    const b=new THREE.Group();
    const core=new THREE.Mesh(new THREE.CylinderGeometry(0.17,0.17,0.075,32),mat(cooked?0x5E3317:0xC9714B,0.6));
    b.add(core);
    const rim=new THREE.Mesh(new THREE.TorusGeometry(0.17,0.038,14,32),mat(cooked?0x5E3317:0xC9714B,0.6));
    rim.rotation.x=Math.PI/2; b.add(rim);
    b.position.y=0.075; b.traverse(o=>{if(o.isMesh)o.castShadow=true;}); g.add(b);
    if(cooked){
      for(let i=0;i<3;i++){
        const mark=capsuleMesh(0.017,0.2,mat(0x2C150A,0.8),10);
        mark.rotation.z=Math.PI/2; mark.rotation.y=0.4;
        mark.position.set(0,0.155,(i-1)*0.09); g.add(mark);
      }
    }
  }else if(type==='bun'){
    const top=new THREE.Mesh(sph(0.2,32,24,0,Math.PI*2,0,Math.PI/2),glossy(0xF2A93B));
    top.position.y=0.09; top.castShadow=true; g.add(top);
    const botG=new THREE.Group();
    const botCore=new THREE.Mesh(new THREE.CylinderGeometry(0.165,0.16,0.06,32),glossy(0xE8930F));
    botG.add(botCore);
    const botRim=new THREE.Mesh(new THREE.TorusGeometry(0.165,0.032,14,32),glossy(0xE8930F));
    botRim.rotation.x=Math.PI/2; botG.add(botRim);
    botG.position.y=0.05; g.add(botG);
    for(let i=0;i<5;i++){
      const sd=new THREE.Mesh(sph(0.017,10,8),mat(0xFFF3CF,0.4));
      sd.position.set(rand(-0.1,0.1),0.27,rand(-0.1,0.1)); g.add(sd);
    }
  }else if(type==='cheese'){
    if(state==='chopped'){
      for(let i=0;i<2;i++){
        const s=new THREE.Mesh(roundedBoxGeo(0.2,0.02,0.2,0.05,0.012),glossy(0xFFC93A));
        s.position.set((i-0.5)*0.12,0.025+i*0.03,(i-0.5)*0.06); s.rotation.y=rand(-0.4,0.4); s.castShadow=true; g.add(s);
      }
    }else{
      // smooth wedge of cheese
      const b=new THREE.Mesh(roundedBoxGeo(0.26,0.13,0.26,0.05),glossy(0xFFC93A));
      b.position.y=0.075; b.rotation.y=0.5; b.castShadow=true; g.add(b);
      const hole=new THREE.Mesh(sph(0.04,14,10),mat(0xE8A90C,0.5));
      hole.position.set(0.05,0.14,0.03); g.add(hole);
      const hole2=new THREE.Mesh(sph(0.028,12,9),mat(0xE8A90C,0.5));
      hole2.position.set(-0.06,0.135,-0.04); g.add(hole2);
    }
  }
  return g;
}
function makePlateMesh(){
  const g=new THREE.Group();
  const base=new THREE.Mesh(new THREE.CylinderGeometry(0.33,0.24,0.05,40),glossy(0xFFFDF4,{roughness:0.15}));
  base.castShadow=true; g.add(base);
  const rim=new THREE.Mesh(new THREE.TorusGeometry(0.29,0.042,16,40),glossy(0xDCE4FA,{roughness:0.15}));
  rim.rotation.x=Math.PI/2; rim.position.y=0.032; g.add(rim);
  const inner=new THREE.Mesh(new THREE.CircleGeometry(0.26,32),glossy(0xF4F7FF,{roughness:0.18}));
  inner.rotation.x=-Math.PI/2; inner.position.y=0.027; g.add(inner);
  return g;
}
// build assembled plate contents by recipe comps
function buildPlateContents(recipe){
  const g=new THREE.Group();
  const order=['B','P','C','T','L'];
  const ordered=order.filter(o=>recipe.comps.includes(o));
  // bun bottom special: draw bun base first if B
  let y=0.05;
  ordered.forEach(c=>{
    let m;
    if(c==='B'){
      m=new THREE.Group();
      const botG=new THREE.Group();
      const bc=new THREE.Mesh(new THREE.CylinderGeometry(0.2,0.19,0.055,32),glossy(0xE8930F));
      botG.add(bc);
      const br=new THREE.Mesh(new THREE.TorusGeometry(0.2,0.036,14,32),glossy(0xE8930F));
      br.rotation.x=Math.PI/2; botG.add(br);
      botG.position.y=0.05; m.add(botG);
      const top=new THREE.Mesh(sph(0.24,32,24,0,Math.PI*2,0,Math.PI/2),glossy(0xF2A93B));
      top.position.y=0.07+ (ordered.length-1)*0.09; top.castShadow=true; m.add(top);
    }else if(c==='P'){ m=makeFoodMesh('patty','cooked'); m.scale.setScalar(1.15); }
    else if(c==='C'){ m=makeFoodMesh('cheese','chopped'); m.scale.setScalar(1.4); }
    else if(c==='T'){ m=makeFoodMesh('tomato','chopped'); m.scale.setScalar(1.1); }
    else if(c==='L'){ m=makeFoodMesh('lettuce','chopped'); m.scale.setScalar(1.3); }
    m.position.y=y; y+=0.09; g.add(m);
  });
  return g;
}
