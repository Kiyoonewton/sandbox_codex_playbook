// ---------------- particles ----------------
const particles=[];
const particleGeo=new THREE.SphereGeometry(0.06,10,8);
function spawnParticles(pos,opts={}){
  const n=opts.n||10;
  for(let i=0;i<n;i++){
    const m=new THREE.Mesh(particleGeo,new THREE.MeshBasicMaterial({
      color:pick(opts.colors||[0xFFFFFF]),transparent:true}));
    m.position.copy(pos);
    const sc=rand(0.5,1.3)*(opts.size||1); m.scale.setScalar(sc);
    scene.add(m);
    particles.push({
      mesh:m,
      vel:new THREE.Vector3(rand(-1,1)*(opts.spread||2),rand(1.5,3.5)*(opts.up||1.4),rand(-1,1)*(opts.spread||2)),
      life:rand(0.5,0.9)*(opts.life||1),
      maxLife:1, grav:opts.grav!==undefined?opts.grav:7,
      shrink:opts.shrink!==false
    });
    particles[particles.length-1].maxLife=particles[particles.length-1].life;
  }
}
const steamGeo=new THREE.SphereGeometry(0.12,14,10);
function spawnSteam(pos){
  const m=new THREE.Mesh(steamGeo,new THREE.MeshBasicMaterial({color:0xFFFFFF,transparent:true,opacity:0.55}));
  m.position.set(pos.x+rand(-0.15,0.15),pos.y,pos.z+rand(-0.15,0.15));
  m.scale.setScalar(rand(0.5,0.9)); scene.add(m);
  particles.push({mesh:m,vel:new THREE.Vector3(rand(-0.15,0.15),rand(0.9,1.5),rand(-0.15,0.15)),
    life:rand(0.9,1.5),maxLife:1.5,grav:-0.4,shrink:false,grow:1.8});
}
function updateParticles(dt){
  for(let i=particles.length-1;i>=0;i--){
    const p=particles[i];
    p.life-=dt;
    if(p.life<=0){scene.remove(p.mesh);p.mesh.material.dispose();particles.splice(i,1);continue;}
    p.vel.y-=p.grav*dt;
    p.mesh.position.addScaledVector(p.vel,dt);
    if(p.grav>0&&p.mesh.position.y<0.06){p.mesh.position.y=0.06;p.vel.y*=-0.4;p.vel.x*=0.7;p.vel.z*=0.7;}
    const k=p.life/p.maxLife;
    p.mesh.material.opacity=Math.min(1,k*1.6);
    if(p.shrink)p.mesh.scale.setScalar(Math.max(0.05,p.mesh.scale.x*(1-dt*1.2)));
    else if(p.grow)p.mesh.scale.multiplyScalar(1+dt*p.grow*0.5);
  }
}
