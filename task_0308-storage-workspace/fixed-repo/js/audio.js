// ---------------- audio (tiny WebAudio synth) ----------------
const AudioSys=(()=>{
  let ctx=null, master=null, muted=false;
  function ensure(){
    if(!ctx){
      ctx=new (window.AudioContext||window.webkitAudioContext)();
      master=ctx.createGain(); master.gain.value=0.5; master.connect(ctx.destination);
    }
    if(ctx.state==='suspended') ctx.resume();
  }
  function tone(freq,dur,type,vol,when=0,slideTo=null){
    if(!ctx||muted) return;
    const t=ctx.currentTime+when;
    const o=ctx.createOscillator(), g=ctx.createGain();
    o.type=type; o.frequency.setValueAtTime(freq,t);
    if(slideTo) o.frequency.exponentialRampToValueAtTime(slideTo,t+dur);
    g.gain.setValueAtTime(vol,t);
    g.gain.exponentialRampToValueAtTime(0.001,t+dur);
    o.connect(g); g.connect(master); o.start(t); o.stop(t+dur+0.02);
  }
  function noise(dur,vol,freq=1200,when=0){
    if(!ctx||muted) return;
    const t=ctx.currentTime+when;
    const len=Math.floor(ctx.sampleRate*dur);
    const buf=ctx.createBuffer(1,len,ctx.sampleRate);
    const d=buf.getChannelData(0);
    for(let i=0;i<len;i++) d[i]=(Math.random()*2-1)*(1-i/len);
    const src=ctx.createBufferSource(); src.buffer=buf;
    const f=ctx.createBiquadFilter(); f.type='bandpass'; f.frequency.value=freq;
    const g=ctx.createGain(); g.gain.value=vol;
    src.connect(f); f.connect(g); g.connect(master); src.start(t);
  }
  return {
    ensure,
    pickup(){ensure(); tone(520,.09,'triangle',.25,0,780);},
    chop(){ensure(); noise(.07,.35,900); tone(190,.06,'square',.12);},
    chopDone(){ensure(); tone(660,.08,'triangle',.22); tone(880,.1,'triangle',.22,.07);},
    sizzleOn(){ensure(); noise(.25,.18,2400);},
    ding(){ensure(); tone(1046,.25,'sine',.3); tone(1568,.3,'sine',.22,.1);},
    chaching(){ensure(); tone(988,.1,'triangle',.28); tone(1318,.14,'triangle',.28,.09); tone(1760,.3,'triangle',.26,.18);},
    fail(){ensure(); tone(392,.18,'sawtooth',.16,0,300); tone(294,.3,'sawtooth',.16,.16,220);},
    nope(){ensure(); tone(220,.09,'square',.14); tone(180,.1,'square',.14,.08);},
    step(){ensure(); noise(.04,.06,700);},
    newbest(){ensure(); [523,659,784,1046,1318].forEach((f,i)=>tone(f,.16,'triangle',.25,i*.09));},
    tick(){ensure(); tone(1400,.04,'square',.07);}
  };
})();
