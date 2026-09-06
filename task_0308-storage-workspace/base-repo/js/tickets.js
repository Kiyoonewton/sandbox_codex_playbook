// ---------------- tickets ----------------
function difficulty(){
  const t=G.elapsed;
  return {
    maxTickets:t<25?2:t<55?3:t<95?4:4,
    patienceBase:Math.max(26,42-t*0.16),
    spawnInterval:Math.max(5,11-t*0.06),
    tierMax:t<18?0:t<40?1:t<70?2:t<110?3:4
  };
}
function spawnTicket(){
  const d=difficulty();
  if(G.tickets.length>=d.maxTickets)return;
  const pool=RECIPES.filter(r=>r.tier<=d.tierMax);
  // avoid duplicating an active recipe
  const active=G.tickets.map(t=>t.recipe.name);
  const choices=pool.filter(r=>!active.includes(r.name));
  const recipe=choices.length?pick(choices):pick(pool);
  const patience=d.patienceBase*(0.85+recipe.comps.length*0.14)*rand(0.92,1.1);
  const ticket={
    id:++G.ticketSeq, recipe, timeTotal:patience, timeLeft:patience, warned:false, beeped:0
  };
  G.tickets.push(ticket);
  renderTicketRail();
  AudioSys.tick();
}
function removeTicket(t,served){
  const i=G.tickets.indexOf(t);
  if(i<0)return;
  G.tickets.splice(i,1);
  const card=el('ticket-'+t.id);
  if(card){
    if(served){card.classList.add('served');setTimeout(renderTicketRail,380);}
    else renderTicketRail();
  }else renderTicketRail();
}
function renderTicketRail(){
  const rail=el('rail');
  rail.innerHTML='';
  G.tickets.forEach(t=>{
    const card=document.createElement('div');
    card.className='ticket'; card.id='ticket-'+t.id;
    card.innerHTML=`<div class="t-name">${t.recipe.name}</div>
      <div class="t-icons">${recipeIconHTML(t.recipe)}</div>
      <div class="t-barwrap"><div class="t-bar"></div></div>`;
    rail.appendChild(card);
    t.el=card; t.bar=card.querySelector('.t-bar');
  });
}
function updateTickets(dt){
  for(let i=G.tickets.length-1;i>=0;i--){
    const t=G.tickets[i];
    t.timeLeft-=dt;
    const f=clamp(t.timeLeft/t.timeTotal,0,1);
    if(t.bar)t.bar.style.width=(f*100)+'%';
    if(t.el){
      t.el.classList.toggle('warn',f<0.5&&f>=0.25);
      t.el.classList.toggle('crit',f<0.25);
    }
    if(f<0.25&&t.timeLeft>0){
      t.beeped-=dt;
      if(t.beeped<=0){AudioSys.tick();t.beeped=0.8;}
    }
    if(t.timeLeft<=0){
      // expired
      removeTicket(t,false);
      G.lives--; updateLivesHUD();
      spawnPopup('TOO SLOW!','bad',serveSt);
      AudioSys.fail(); shakeScreen(0.4);
      if(G.lives<=0){gameOver();return;}
    }
  }
}

// ---------------- HUD ----------------
function cherrySVG(){
  return `<svg class="cherry-life" viewBox="0 0 28 28"><path d="M14 8 Q10 2 5 3" stroke="#239152" stroke-width="2.2" fill="none"/><path d="M14 8 Q18 2 22 4" stroke="#239152" stroke-width="2.2" fill="none"/><circle cx="10" cy="17" r="6.5" fill="#E8354A" stroke="#B92338" stroke-width="1.6"/><circle cx="19" cy="18" r="6" fill="#E8354A" stroke="#B92338" stroke-width="1.6"/><circle cx="8" cy="14.5" r="1.8" fill="#FF8B97"/><circle cx="17" cy="15.5" r="1.6" fill="#FF8B97"/></svg>`;
}
function updateLivesHUD(){
  el('livesRow').innerHTML=[0,1,2].map(i=>
    cherrySVG().replace('class="cherry-life"',`class="cherry-life ${i<G.lives?'':'lost'}'`)).join('');
}
function updateScoreHUD(){
  el('scoreVal').textContent=fmt(G.score);
  el('bestMini').textContent='BEST '+fmt(Math.max(G.best,G.score));
}
function spawnPopup(text,cls,station,dy=0){
  const p=document.createElement('div');
  p.className='pop '+cls; p.textContent=text;
  const v=new THREE.Vector3(station.x,1.6,station.z).project(camera);
  p.style.left=((v.x*0.5+0.5)*window.innerWidth)+'px';
  p.style.top=((-v.y*0.5+0.5)*window.innerHeight+dy)+'px';
  el('popups').appendChild(p);
  setTimeout(()=>p.remove(),1150);
}
let shakeAmt=0;
function shakeScreen(v){shakeAmt=Math.max(shakeAmt,v);}
