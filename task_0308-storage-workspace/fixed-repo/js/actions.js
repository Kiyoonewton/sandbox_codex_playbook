// ---------------- action (SPACE / tap) ----------------
function tryAction(){
  if(G.state!=='playing')return;
  if(chef.actionCd>0||chef.chopping)return;
  const s=nearestStation();
  if(!s){nopeFeedback();return;}
  const c=chef.carrying;

  if(s.ing){ // ingredient bin
    if(!c){
      chef.carrying={kind:'ing',type:s.ing,state:'raw'};
      setCarriedVisual(); chefSquash(0.25); AudioSys.pickup();
      // pop one from the pile
      if(s.pile.length){const p=s.pile.pop();s.group.remove(p);setTimeout(()=>{if(G.state==='playing'||G.state==='paused'){const np=makeFoodMesh(s.ing);np.position.set(rand(-0.28,0.28),1.62,rand(-0.28,0.28));np.rotation.y=rand(0,6);s.group.add(np);s.pile.push(np);}},1400);}
      spawnParticles(stationTopPos(s),{n:6,colors:[0xFFF3CF,0xFFD93B],up:1.2});
    }else nopeFeedback();
    return;
  }
  switch(s.id){
    case 'chop':
      if(c&&c.kind==='plate'&&boardItem&&boardItem.state==='chopped'){
        c.comps.push(compCode({type:boardItem.type}));
        clearBoard(); setCarriedVisual(); AudioSys.pickup(); chefSquash(0.2);
        spawnParticles(stationTopPos(chopSt),{n:5,colors:[0x38B96A,0xFFF3CF],up:1});
      }else if(!c&&boardItem&&boardItem.state==='chopped'){
        chef.carrying={kind:'ing',type:boardItem.type,state:'chopped'};
        clearBoard(); setCarriedVisual(); AudioSys.pickup(); chefSquash(0.2);
      }else if(!c&&boardItem&&boardItem.state==='raw'){
        startChopping();
      }else if(c&&c.kind==='ing'&&!boardItem){
        const info=Object.values(COMP_INFO).find(i=>i.base===c.type);
        if(c.state==='raw'&&info&&info.need==='chop'){
          boardItem={type:c.type,state:'raw'};
          chef.carrying=null; setCarriedVisual(); updateBoardVisual();
          chefSquash(0.15); AudioSys.pickup();
        }else nopeFeedback();
      }else nopeFeedback();
      break;
    case 'stove':{
      const free=stoveSt.burners.find(b=>!b.item);
      if(c&&c.kind==='ing'&&c.type==='patty'&&c.state==='raw'&&free){
        free.item={type:'patty'}; free.done=false; free.prog=0; free.burned=false;
        chef.carrying=null; setCarriedVisual(); refreshBurnerVisual(free);
        AudioSys.sizzleOn(); chefSquash(0.15);
      }else if(c&&c.kind==='plate'){
        const doneB=stoveSt.burners.find(b=>b.item&&b.done);
        if(doneB){
          c.comps.push('P');
          doneB.item=null; doneB.done=false; refreshBurnerVisual(doneB);
          setCarriedVisual(); AudioSys.pickup(); chefSquash(0.2);
        }else nopeFeedback();
      }else{
        const doneB=stoveSt.burners.find(b=>b.item&&b.done);
        if(!c&&doneB){
          chef.carrying={kind:'ing',type:'patty',state:'cooked'};
          doneB.item=null; doneB.done=false; refreshBurnerVisual(doneB);
          setCarriedVisual(); AudioSys.pickup(); chefSquash(0.2);
        }else if(!c){
          const burnedB=stoveSt.burners.find(b=>b.item&&b.burned);
          if(burnedB){burnedB.item=null;refreshBurnerVisual(burnedB);spawnParticles(stationTopPos(stoveSt),{n:8,colors:[0x4A4038,0x6B5D4F],up:1});AudioSys.nope();}
          else nopeFeedback();
        }else nopeFeedback();
      }
      break;}
    case 'stack':
      if(!c){chef.carrying={kind:'plate',comps:[]};setCarriedVisual();AudioSys.pickup();chefSquash(0.2);
        if(stackSt.stack.length>1){const p=stackSt.stack.pop();stackSt.group.remove(p);
          setTimeout(()=>{const np=makePlateMesh();np.position.set(-0.45,1.18+stackSt.stack.length*0.055,0);stackSt.group.add(np);stackSt.stack.push(np);},2500);}
      }else nopeFeedback();
      break;
    case 'plate':{
      if(c&&c.kind==='ing'){
        const free=plateSt.plates.findIndex(p=>p===null);
        if(free>=0&&plateReadyFor(c)){
          plateSt.plates[free]={comps:[compCode(c)]};
          chef.carrying=null; setCarriedVisual(); refreshPlateCounterVisual();
          AudioSys.pickup(); chefSquash(0.15);
          spawnParticles(stationTopPos(plateSt),{n:5,colors:[0x8FA6E8,0xFFF3CF],up:1});
        }else nopeFeedback();
      }else if(c&&c.kind==='plate'&&c.comps.length>0){
        const free=plateSt.plates.findIndex(p=>p===null);
        if(free>=0){plateSt.plates[free]={comps:c.comps.slice()};chef.carrying=null;setCarriedVisual();refreshPlateCounterVisual();AudioSys.pickup();}
        else nopeFeedback();
      }else if(c&&c.kind==='plate'&&c.comps.length===0){
        const pl=plateSt.plates.find(p=>p&&p.comps.length>0);
        if(pl){c.comps=pl.comps.slice();plateSt.plates[plateSt.plates.indexOf(pl)]=null;refreshPlateCounterVisual();setCarriedVisual();AudioSys.pickup();chefSquash(0.2);}
        else nopeFeedback();
      }else if(!c){
        const pl=plateSt.plates.find(p=>p&&p.comps.length>0);
        if(pl){chef.carrying={kind:'plate',comps:pl.comps.slice()};plateSt.plates[plateSt.plates.indexOf(pl)]=null;refreshPlateCounterVisual();setCarriedVisual();AudioSys.pickup();chefSquash(0.2);}
        else nopeFeedback();
      }else nopeFeedback();
      break;}
    case 'serve':
      if(c&&c.kind==='plate'&&c.comps.length>0)servePlate(c.comps);
      else nopeFeedback();
      break;
    case 'trash':
      if(c){chef.carrying=null;setCarriedVisual();AudioSys.nope===undefined?0:AudioSys.nope();
        spawnParticles(stationTopPos(trashSt),{n:8,colors:[0x8A94A6,0xC9CED6],up:1.2});chefSquash(0.15);}
      else nopeFeedback();
      break;
  }
  chef.actionCd=0.22;
}
function plateReadyFor(c){
  // an ingredient is ready to go on a plate if it's prepared or needs no prep
  if(c.kind!=='ing')return false;
  const info=Object.values(COMP_INFO).find(i=>i.base===c.type);
  if(!info)return false;
  if(info.need==='chop')return c.state==='chopped';
  if(info.need==='cook')return c.state==='cooked';
  return true; // bun as-is
}
function compCode(c){
  return Object.keys(COMP_INFO).find(k=>COMP_INFO[k].base===c.type);
}
function startChopping(){
  chef.chopping={t:0};
  chef.knife.visible=true;
  AudioSys.chop();
}
function nopeFeedback(){
  chef.bump=1; AudioSys.nope();
}

// ---------------- serving ----------------
function servePlate(comps){
  const sorted=a=>a.slice().sort().join('');
  const t=G.tickets.find(t=>sorted(t.recipe.comps)===sorted(comps));
  if(t){
    const patienceFrac=t.timeLeft/t.timeTotal;
    const tip=Math.round(t.recipe.comps.length*10*(0.5+patienceFrac));
    const pts=50+t.recipe.comps.length*15+tip;
    G.score+=pts; G.served++;
    removeTicket(t,true);
    spawnPopup('+'+pts,'',serveSt);
    if(patienceFrac>0.55)spawnPopup('TIP +'+tip,'gold',serveSt,26);
    confettiBurst(new THREE.Vector3(serveSt.x,1.6,serveSt.z));
    AudioSys.chaching();
    serveSt.bell.scale.setScalar(1.6);
    chef.carrying=null; setCarriedVisual();
    chefSquash(0.35);
    updateScoreHUD();
  }else{
    G.mistakes++;
    G.lives--; updateLivesHUD();
    spawnPopup('WRONG DISH!','bad',serveSt);
    AudioSys.fail();
    chef.carrying=null; setCarriedVisual();
    shakeScreen(0.35);
    if(G.lives<=0)gameOver();
  }
}
function confettiBurst(pos){
  spawnParticles(pos,{n:26,colors:[0xE8354A,0xFFD93B,0x38B96A,0x3E5FB8,0xFF8A3C,0xFF8B97],spread:3.2,up:2.2,life:1.3,size:1.1});
}
