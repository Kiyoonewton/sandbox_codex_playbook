// ---------------- helpers ----------------
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const lerp=(a,b,t)=>a+(b-a)*t;
const rand=(a,b)=>a+Math.random()*(b-a);
const pick=a=>a[Math.floor(Math.random()*a.length)];
const el=id=>document.getElementById(id);
const fmt=n=>n.toLocaleString('en-US');
