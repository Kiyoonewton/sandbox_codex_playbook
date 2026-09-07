// ---------------- carried item visuals ----------------
let carriedMesh=null;
function setCarriedVisual(){
  if(carriedMesh){chef.carry.remove(carriedMesh);carriedMesh=null;}
  if(!chef.carrying)return;
  const c=chef.carrying;
  if(c.kind==='ing'){
    carriedMesh=makeFoodMesh(c.type,c.state);
    carriedMesh.scale.setScalar(1.35);
  }else if(c.kind==='plate'){
    carriedMesh=makePlateMesh();
    carriedMesh.scale.setScalar(1.15);
    if(c.comps.length){
      const content=buildPlateContents({comps:c.comps});
      content.scale.setScalar(0.9); content.position.y=0.04;
      carriedMesh.add(content);
      const lbl=textSprite(compsLabel(c.comps),'#B92338');
      lbl.position.set(0,0.62,0); lbl.scale.set(1.2,0.34,1); carriedMesh.add(lbl);
    }
  }
  chef.carry.add(carriedMesh);
  updateHeldChip();
}
function updateHeldChip(){
  const chip=el('heldChip');
  if(!chef.carrying){chip.classList.remove('on');return;}
  const c=chef.carrying;
  let html='';
  if(c.kind==='ing'){
    const key=c.type==='patty'&&c.state==='cooked'?'patty_cooked':c.type;
    html=ICONS[key]+'<span>'+NICE[key]+(c.state==='chopped'?' (chopped)':'')+'</span>';
  }else{
    html=ICONS.plate+'<span>'+(c.comps.length?c.comps.map(x=>COMP_INFO[x].label).join(' + '):'Empty plate')+'</span>';
  }
  chip.innerHTML=html; chip.classList.add('on');
}
