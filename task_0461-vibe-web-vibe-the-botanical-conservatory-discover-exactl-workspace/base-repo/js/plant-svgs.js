// ============================================================
// Unique SVG Plant Illustrations
// Every plant gets its own distinct botanical illustration.
// viewBox: 0 0 80 80 — lightweight, scalable, no raster.
// ============================================================

export const PLANT_SVGS = {

  // ── POTHOS ── Trailing heart-shaped leaves, variegated green/yellow
  'pothos': `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="poth-l" x1="0" y1="0" x2=".3" y2="1"><stop offset="0%" stop-color="#5dba6a"/><stop offset="100%" stop-color="#2a7a3c"/></linearGradient>
      <linearGradient id="poth-v" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#e8d870" stop-opacity=".45"/><stop offset="100%" stop-color="#5dba6a" stop-opacity="0"/></linearGradient>
    </defs>
    <!-- pot -->
    <path d="M28 62 L26 76 Q26 79 30 79 L50 79 Q54 79 54 76 L52 62Z" fill="#b87333" opacity=".85"/>
    <rect x="25" y="59" width="30" height="5" rx="2" fill="#c9884a"/>
    <!-- stems & leaves -->
    <g opacity=".9">
      <path d="M40 60 Q38 48 35 38 Q30 24 22 20" stroke="#3a7a40" stroke-width="1.5" fill="none"/>
      <path d="M22 20 Q18 14 22 10 Q28 8 30 14 Q31 18 22 20Z" fill="url(#poth-l)"/>
      <path d="M22 20 Q22 14 26 12" stroke="#e8d870" stroke-width="2" fill="none" opacity=".3"/>
    </g>
    <g opacity=".85">
      <path d="M40 60 Q44 50 48 42 Q54 30 60 28" stroke="#3a7a40" stroke-width="1.3" fill="none"/>
      <path d="M60 28 Q64 22 60 18 Q54 16 52 22 Q51 26 60 28Z" fill="url(#poth-l)"/>
      <ellipse cx="56" cy="22" rx="4" ry="2.5" fill="url(#poth-v)" transform="rotate(-20 56 22)"/>
    </g>
    <g opacity=".8">
      <path d="M40 60 Q36 52 28 48 Q18 42 14 44" stroke="#3a7a40" stroke-width="1.2" fill="none"/>
      <path d="M14 44 Q10 38 14 34 Q20 32 22 38 Q23 42 14 44Z" fill="url(#poth-l)"/>
    </g>
    <g opacity=".75">
      <path d="M40 60 Q46 54 54 54 Q62 54 64 58" stroke="#3a7a40" stroke-width="1.1" fill="none"/>
      <path d="M64 58 Q68 54 64 50 Q58 48 56 54 Q55 57 64 58Z" fill="url(#poth-l)" opacity=".8"/>
    </g>
  </svg>`,

  // ── SNAKE PLANT ── Tall upright sword leaves, dark green with yellow edges
  'snake-plant': `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="snk-l" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#2d6b3f"/><stop offset="50%" stop-color="#1e5530"/><stop offset="100%" stop-color="#15402a"/></linearGradient>
    </defs>
    <!-- pot -->
    <path d="M26 64 L24 76 Q24 79 28 79 L52 79 Q56 79 56 76 L54 64Z" fill="#8a8a80" opacity=".7"/>
    <rect x="23" y="61" width="34" height="5" rx="2" fill="#a0a098"/>
    <!-- leaves -->
    <g opacity=".95">
      <path d="M36 62 Q35 42 34 22 Q33 14 36 10 Q39 8 42 10 Q45 14 44 22 Q43 42 42 62Z" fill="url(#snk-l)" stroke="#c4a84a" stroke-width=".4"/>
      <path d="M39 15 L39 55" stroke="#1a5530" stroke-width=".5" opacity=".3"/>
    </g>
    <g opacity=".88">
      <path d="M28 62 Q26 44 25 28 Q24 20 27 16 Q30 14 32 18 Q33 24 32 38 Q31 50 30 62Z" fill="url(#snk-l)" stroke="#c4a84a" stroke-width=".35"/>
      <path d="M29 22 L29 50" stroke="#1a5530" stroke-width=".4" opacity=".25"/>
    </g>
    <g opacity=".82">
      <path d="M48 62 Q50 46 51 32 Q52 24 49 20 Q46 18 44 22 Q43 28 44 40 Q45 52 46 62Z" fill="url(#snk-l)" stroke="#c4a84a" stroke-width=".35"/>
    </g>
    <g opacity=".7">
      <path d="M20 62 Q18 48 18 36 Q17 30 20 28 Q22 26 24 30 Q24 36 23 46 Q22 54 22 62Z" fill="url(#snk-l)" stroke="#c4a84a" stroke-width=".3"/>
    </g>
    <g opacity=".65">
      <path d="M56 62 Q58 50 58 40 Q59 34 56 32 Q54 30 52 34 Q52 38 53 48 Q54 56 54 62Z" fill="url(#snk-l)" stroke="#c4a84a" stroke-width=".25"/>
    </g>
    <!-- horizontal banding -->
    <rect x="35" y="35" width="9" height="1.5" fill="#1a5530" opacity=".15" rx=".5"/>
    <rect x="34" y="45" width="11" height="1.2" fill="#1a5530" opacity=".12" rx=".5"/>
  </svg>`,

  // ── ZZ PLANT ── Arching stems with glossy oval leaflets
  'zz-plant': `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="zz-l" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#2d8040"/><stop offset="100%" stop-color="#1a5530"/></linearGradient>
    </defs>
    <!-- pot -->
    <path d="M27 63 L25 76 Q25 79 29 79 L51 79 Q55 79 55 76 L53 63Z" fill="#2a2a28" opacity=".8"/>
    <rect x="24" y="60" width="32" height="5" rx="2" fill="#3a3a38"/>
    <!-- arching stems with paired leaflets -->
    <g>
      <path d="M40 60 Q38 40 30 25 Q26 18 22 16" stroke="#1e6030" stroke-width="1.5" fill="none"/>
      <!-- leaflets along stem -->
      <ellipse cx="36" cy="45" rx="3.5" ry="5.5" fill="url(#zz-l)" opacity=".85" transform="rotate(-15 36 45)"/>
      <ellipse cx="33" cy="38" rx="3.5" ry="5" fill="url(#zz-l)" opacity=".82" transform="rotate(-20 33 38)"/>
      <ellipse cx="30" cy="31" rx="3" ry="4.5" fill="url(#zz-l)" opacity=".78" transform="rotate(-25 30 31)"/>
      <ellipse cx="27" cy="24" rx="3" ry="4" fill="url(#zz-l)" opacity=".75" transform="rotate(-30 27 24)"/>
      <ellipse cx="24" cy="18" rx="2.5" ry="3.5" fill="url(#zz-l)" opacity=".7" transform="rotate(-35 24 18)"/>
    </g>
    <g>
      <path d="M40 60 Q42 42 50 30 Q54 22 58 20" stroke="#1e6030" stroke-width="1.3" fill="none"/>
      <ellipse cx="44" cy="47" rx="3.5" ry="5.5" fill="url(#zz-l)" opacity=".82" transform="rotate(15 44 47)"/>
      <ellipse cx="47" cy="40" rx="3.5" ry="5" fill="url(#zz-l)" opacity=".8" transform="rotate(20 47 40)"/>
      <ellipse cx="50" cy="33" rx="3" ry="4.5" fill="url(#zz-l)" opacity=".76" transform="rotate(25 50 33)"/>
      <ellipse cx="53" cy="26" rx="3" ry="4" fill="url(#zz-l)" opacity=".72" transform="rotate(30 53 26)"/>
      <ellipse cx="56" cy="21" rx="2.5" ry="3.5" fill="url(#zz-l)" opacity=".68" transform="rotate(35 56 21)"/>
    </g>
    <g>
      <path d="M40 60 Q40 35 40 18 Q40 12 40 10" stroke="#1e6030" stroke-width="1.4" fill="none"/>
      <ellipse cx="40" cy="48" rx="3.5" ry="5.5" fill="url(#zz-l)" opacity=".88" transform="rotate(0 40 48)"/>
      <ellipse cx="40" cy="38" rx="3.5" ry="5" fill="url(#zz-l)" opacity=".85"/>
      <ellipse cx="40" cy="28" rx="3" ry="4.5" fill="url(#zz-l)" opacity=".82"/>
      <ellipse cx="40" cy="19" rx="2.8" ry="4" fill="url(#zz-l)" opacity=".78"/>
      <ellipse cx="40" cy="12" rx="2.5" ry="3.5" fill="url(#zz-l)" opacity=".7"/>
    </g>
    <!-- gloss highlights -->
    <ellipse cx="38" cy="37" rx="1" ry="2" fill="white" opacity=".12" transform="rotate(-20 38 37)"/>
    <ellipse cx="42" cy="39" rx="1" ry="2" fill="white" opacity=".1" transform="rotate(15 42 39)"/>
  </svg>`,

  // ── SPIDER PLANT ── Arching variegated leaves with baby plantlets
  'spider-plant': `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="spr-l" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#5ab85c"/><stop offset="100%" stop-color="#2a7a3c"/></linearGradient>
    </defs>
    <!-- hanging basket -->
    <path d="M25 55 Q25 65 40 68 Q55 65 55 55Z" fill="#8b6840" opacity=".6"/>
    <line x1="28" y1="55" x2="20" y2="42" stroke="#8b6840" stroke-width=".8" opacity=".5"/>
    <line x1="52" y1="55" x2="60" y2="42" stroke="#8b6840" stroke-width=".8" opacity=".5"/>
    <!-- arching leaves -->
    <path d="M40 55 Q30 40 15 35 Q8 33 5 38" stroke="url(#spr-l)" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M40 55 Q50 40 65 35 Q72 33 75 38" stroke="url(#spr-l)" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M40 55 Q35 38 20 28 Q14 24 10 28" stroke="url(#spr-l)" stroke-width="2.8" fill="none" stroke-linecap="round" opacity=".85"/>
    <path d="M40 55 Q45 38 60 28 Q66 24 70 28" stroke="url(#spr-l)" stroke-width="2.8" fill="none" stroke-linecap="round" opacity=".85"/>
    <path d="M40 55 Q38 30 25 18 Q20 14 16 17" stroke="url(#spr-l)" stroke-width="2.5" fill="none" stroke-linecap="round" opacity=".8"/>
    <path d="M40 55 Q42 30 55 18 Q60 14 64 17" stroke="url(#spr-l)" stroke-width="2.5" fill="none" stroke-linecap="round" opacity=".8"/>
    <!-- white center stripes -->
    <path d="M40 55 Q30 40 15 35" stroke="white" stroke-width=".8" fill="none" opacity=".15"/>
    <path d="M40 55 Q50 40 65 35" stroke="white" stroke-width=".8" fill="none" opacity=".15"/>
    <!-- baby plantlets -->
    <g transform="translate(12 36)">
      <line x1="4" y1="-3" x2="4" y2="2" stroke="#2a7a3c" stroke-width=".8" opacity=".5"/>
      <circle cx="4" cy="4" r="2.5" fill="#4aaa5c" opacity=".7"/>
      <path d="M4 4 Q0 7 -2 5" stroke="#5ab85c" stroke-width=".8" fill="none"/>
      <path d="M4 4 Q8 7 10 5" stroke="#5ab85c" stroke-width=".8" fill="none"/>
    </g>
    <g transform="translate(62 34)">
      <line x1="2" y1="-4" x2="2" y2="1" stroke="#2a7a3c" stroke-width=".8" opacity=".4"/>
      <circle cx="2" cy="3" r="2" fill="#4aaa5c" opacity=".65"/>
      <path d="M2 3 Q-1 5 -3 4" stroke="#5ab85c" stroke-width=".7" fill="none"/>
      <path d="M2 3 Q5 5 7 4" stroke="#5ab85c" stroke-width=".7" fill="none"/>
    </g>
  </svg>`,

  // ── HEARTLEAF PHILODENDRON ── Classic heart-shaped leaves on trailing stems
  'heartleaf-philodendron': `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="hlp-l" x1="0" y1="0" x2=".4" y2="1"><stop offset="0%" stop-color="#3d8b5c"/><stop offset="100%" stop-color="#1a5530"/></linearGradient>
    </defs>
    <!-- pot -->
    <path d="M28 62 L26 76 Q26 79 30 79 L50 79 Q54 79 54 76 L52 62Z" fill="#5a4030" opacity=".75"/>
    <rect x="25" y="59" width="30" height="5" rx="2" fill="#7a5a40"/>
    <!-- heart leaves on stems -->
    <g opacity=".9">
      <path d="M40 60 Q36 44 30 34" stroke="#1e5530" stroke-width="1.3" fill="none"/>
      <!-- heart shape: two arcs meeting at bottom point -->
      <path d="M30 34 Q24 26 22 30 Q20 35 24 38 Q28 40 30 38 Q32 40 36 38 Q40 35 38 30 Q36 26 30 34Z" fill="url(#hlp-l)"/>
      <path d="M30 34 L30 38" stroke="#1a5530" stroke-width=".4" opacity=".3"/>
    </g>
    <g opacity=".85">
      <path d="M40 60 Q46 46 52 38" stroke="#1e5530" stroke-width="1.2" fill="none"/>
      <path d="M52 38 Q46 30 44 34 Q42 39 46 42 Q50 44 52 42 Q54 44 58 42 Q62 39 60 34 Q58 30 52 38Z" fill="url(#hlp-l)" opacity=".85"/>
    </g>
    <g opacity=".78">
      <path d="M40 60 Q34 50 24 48" stroke="#1e5530" stroke-width="1.1" fill="none"/>
      <path d="M24 48 Q18 40 16 44 Q14 49 18 52 Q22 54 24 52 Q26 54 30 52 Q34 49 32 44 Q30 40 24 48Z" fill="url(#hlp-l)" opacity=".78"/>
    </g>
    <g opacity=".7">
      <path d="M40 60 Q48 52 58 50" stroke="#1e5530" stroke-width="1" fill="none"/>
      <path d="M58 50 Q54 44 52 46 Q50 50 54 52 Q56 53 58 52 Q60 53 62 52 Q66 50 64 46 Q62 44 58 50Z" fill="url(#hlp-l)" opacity=".68"/>
    </g>
    <!-- tiny new leaf -->
    <path d="M40 58 Q42 54 44 50 Q44 48 42 48 Q40 50 40 54Z" fill="#5ab870" opacity=".5"/>
  </svg>`,

  // ── MONSTERA DELICIOSA ── Large split leaves with fenestrations
  'monstera': `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="mon-l" x1=".2" y1="0" x2=".8" y2="1"><stop offset="0%" stop-color="#3a8f50"/><stop offset="50%" stop-color="#2a7040"/><stop offset="100%" stop-color="#1a5030"/></linearGradient>
      <radialGradient id="mon-hi" cx=".3" cy=".3"><stop offset="0%" stop-color="#5ab870" stop-opacity=".25"/><stop offset="100%" stop-color="transparent"/></radialGradient>
    </defs>
    <!-- pot -->
    <path d="M26 64 L24 76 Q24 79 28 79 L52 79 Q56 79 56 76 L54 64Z" fill="#4a3a2a" opacity=".75"/>
    <rect x="23" y="61" width="34" height="5" rx="2" fill="#6a5a40"/>
    <!-- main leaf with fenestrations -->
    <g transform="translate(40 35)">
      <path d="M0,-28 C-6,-24 -18,-18 -20,-8 C-21,-2 -14,6 -8,7 C-4,8 -1,4 0,2 C1,4 4,8 8,7 C14,6 21,-2 20,-8 C18,-18 6,-24 0,-28Z" fill="url(#mon-l)" opacity=".92"/>
      <!-- midrib -->
      <path d="M0,-28 C-1,-16 -5,-4 0,2" stroke="#1a5030" stroke-width=".7" fill="none" opacity=".4"/>
      <!-- fenestrations (holes) -->
      <ellipse cx="-8" cy="-16" rx="3" ry="4" fill="#0d2018" opacity=".5"/>
      <ellipse cx="8" cy="-16" rx="2.5" ry="3.5" fill="#0d2018" opacity=".5"/>
      <ellipse cx="-6" cy="-6" rx="2" ry="2.5" fill="#0d2018" opacity=".4"/>
      <ellipse cx="6" cy="-6" rx="2" ry="2.5" fill="#0d2018" opacity=".4"/>
      <!-- light highlight -->
      <ellipse cx="-6" cy="-22" rx="5" ry="3" fill="url(#mon-hi)"/>
    </g>
    <!-- smaller leaf -->
    <g transform="translate(20 50) rotate(-25) scale(.6)">
      <path d="M0,-22 C-5,-18 -14,-14 -16,-6 C-17,-1 -11,5 -6,5 C-3,6 -1,3 0,2 C1,3 3,6 6,5 C11,5 17,-1 16,-6 C14,-14 5,-18 0,-22Z" fill="url(#mon-l)" opacity=".75"/>
      <ellipse cx="-5" cy="-12" rx="2" ry="3" fill="#0d2018" opacity=".4"/>
      <ellipse cx="5" cy="-12" rx="2" ry="2.5" fill="#0d2018" opacity=".4"/>
    </g>
    <!-- stem -->
    <path d="M40 37 Q42 48 40 60" stroke="#1a5030" stroke-width="1.5" fill="none" opacity=".5"/>
    <path d="M20 50 Q22 55 26 60" stroke="#1a5030" stroke-width="1" fill="none" opacity=".35"/>
    <!-- water droplet -->
    <circle cx="48" cy="28" r="1.2" fill="#88c8a8" opacity=".35"/>
    <circle cx="48.3" cy="28.5" r=".5" fill="white" opacity=".25"/>
  </svg>`,

  // ── BIRD OF PARADISE ── Tall paddle-like leaves with iconic flower
  'bird-of-paradise': `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bop-l" x1=".3" y1="0" x2=".7" y2="1"><stop offset="0%" stop-color="#2a8040"/><stop offset="50%" stop-color="#1e6530"/><stop offset="100%" stop-color="#155025"/></linearGradient>
    </defs>
    <!-- pot -->
    <path d="M24 65 L22 76 Q22 79 26 79 L54 79 Q58 79 58 76 L56 65Z" fill="#3a3a38" opacity=".7"/>
    <rect x="21" y="62" width="38" height="5" rx="2" fill="#4a4a48"/>
    <!-- tall banana-like leaves -->
    <g transform="rotate(-12 40 62)">
      <path d="M40 62 Q38 40 36 20 Q35 10 38 6 Q41 4 44 6 Q46 10 45 20 Q43 40 42 62Z" fill="url(#bop-l)" opacity=".9"/>
      <path d="M40 62 Q39 40 37 18" stroke="#155025" stroke-width=".5" fill="none" opacity=".35"/>
      <!-- leaf veins -->
      <path d="M37 30 L43 30" stroke="#155025" stroke-width=".25" opacity=".2"/>
      <path d="M36 40 L44 40" stroke="#155025" stroke-width=".25" opacity=".2"/>
    </g>
    <g transform="translate(18 0) rotate(-22 40 62)">
      <path d="M40 62 Q38 42 37 26 Q36 18 38 14 Q40 12 42 14 Q44 18 43 26 Q42 42 42 62Z" fill="url(#bop-l)" opacity=".78"/>
    </g>
    <g transform="translate(16 0) rotate(10 40 62)">
      <path d="M40 62 Q42 44 43 30 Q44 22 42 18 Q40 16 38 18 Q36 22 37 30 Q38 44 38 62Z" fill="url(#bop-l)" opacity=".7"/>
    </g>
    <!-- flower spike -->
    <g transform="translate(52 18)">
      <line x1="0" y1="0" x2="0" y2="-12" stroke="#1a5530" stroke-width="1.2"/>
      <path d="M0,-10 Q6,-12 8,-8 Q9,-4 4,-6 Q0,-8 0,-10Z" fill="#ff5020" opacity=".9"/>
      <path d="M0,-8 Q-5,-10 -6,-6 Q-6,-2 -2,-5 Q0,-6 0,-8Z" fill="#3050e0" opacity=".8"/>
      <path d="M0,-12 L2,-14" stroke="#ff8030" stroke-width=".8"/>
    </g>
  </svg>`,

  // ── ALOCASIA ── Large arrow-shaped leaves with prominent veins
  'alocasia': `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="alo-l" x1=".2" y1="0" x2=".8" y2="1"><stop offset="0%" stop-color="#2d7a5a"/><stop offset="100%" stop-color="#1a4a2e"/></linearGradient>
      <linearGradient id="alo-v" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#5ab870" stop-opacity=".3"/><stop offset="100%" stop-color="transparent"/></linearGradient>
    </defs>
    <!-- pot -->
    <path d="M27 63 L25 76 Q25 79 29 79 L51 79 Q55 79 55 76 L53 63Z" fill="#d4c4b0" opacity=".6"/>
    <rect x="24" y="60" width="32" height="5" rx="2" fill="#e0d4c0"/>
    <!-- arrow/elephant ear leaves -->
    <g transform="translate(40 32)">
      <!-- main leaf: arrow shape -->
      <path d="M0,-26 C-8,-22 -20,-12 -22,-2 C-23,4 -16,10 -10,10 C-5,10 -2,6 0,4 C2,6 5,10 10,10 C16,10 23,4 22,-2 C20,-12 8,-22 0,-26Z" fill="url(#alo-l)" opacity=".9"/>
      <!-- midrib and veins -->
      <path d="M0,-26 L0,4" stroke="#1a4a2e" stroke-width=".8" fill="none" opacity=".4"/>
      <path d="M0,-18 L-12,-10" stroke="#1a4a2e" stroke-width=".3" fill="none" opacity=".25"/>
      <path d="M0,-18 L12,-10" stroke="#1a4a2e" stroke-width=".3" fill="none" opacity=".25"/>
      <path d="M0,-10 L-10,-2" stroke="#1a4a2e" stroke-width=".3" fill="none" opacity=".2"/>
      <path d="M0,-10 L10,-2" stroke="#1a4a2e" stroke-width=".3" fill="none" opacity=".2"/>
      <!-- highlight -->
      <ellipse cx="-5" cy="-18" rx="4" ry="5" fill="url(#alo-v)" transform="rotate(-5)"/>
    </g>
    <!-- second leaf -->
    <g transform="translate(22 48) rotate(-15) scale(.65)">
      <path d="M0,-22 C-7,-18 -16,-10 -18,-2 C-19,3 -13,8 -8,8 C-4,8 -1,5 0,3 C1,5 4,8 8,8 C13,8 19,3 18,-2 C16,-10 7,-18 0,-22Z" fill="url(#alo-l)" opacity=".7"/>
    </g>
    <!-- petioles -->
    <path d="M40 34 Q42 48 40 60" stroke="#1a4a2e" stroke-width="1.5" fill="none" opacity=".45"/>
    <path d="M22 48 Q24 54 28 60" stroke="#1a4a2e" stroke-width="1" fill="none" opacity=".3"/>
  </svg>`,

  // ── ANTHURIUM ── Glossy heart-shaped leaf with waxy spathe flower
  'anthurium': `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="ant-f" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#e83050"/><stop offset="100%" stop-color="#b82040"/></linearGradient>
      <linearGradient id="ant-l" x1="0" y1="0" x2=".5" y2="1"><stop offset="0%" stop-color="#3a8050"/><stop offset="100%" stop-color="#1a5530"/></linearGradient>
    </defs>
    <!-- pot -->
    <path d="M27 63 L25 76 Q25 79 29 79 L51 79 Q55 79 55 76 L53 63Z" fill="#f0e8d8" opacity=".6"/>
    <rect x="24" y="60" width="32" height="5" rx="2" fill="#f5efe0"/>
    <!-- green leaf behind -->
    <g opacity=".7">
      <path d="M34 55 Q26 40 22 32 Q18 24 22 20 Q26 17 30 22 Q32 26 34 30 Q34 34 30 38 Q34 42 34 55Z" fill="url(#ant-l)"/>
    </g>
    <!-- red spathe (waxy flower bract) -->
    <g transform="translate(42 30)">
      <path d="M0,-20 C-10,-16 -18,-6 -16,2 C-14,10 -6,14 0,12 C6,14 14,10 16,2 C18,-6 10,-16 0,-20Z" fill="url(#ant-f)" opacity=".88"/>
      <!-- vein pattern -->
      <path d="M0,-20 L0,12" stroke="#a01830" stroke-width=".5" fill="none" opacity=".25"/>
      <path d="M0,-10 L-10,-2" stroke="#a01830" stroke-width=".3" fill="none" opacity=".15"/>
      <path d="M0,-10 L10,-2" stroke="#a01830" stroke-width=".3" fill="none" opacity=".15"/>
      <!-- spadix (yellow spike) -->
      <path d="M0,-18 Q2,-14 1,-8 Q0,-4 -1,-8 Q-2,-14 0,-18Z" fill="#f0c040" opacity=".9"/>
    </g>
    <!-- stems -->
    <path d="M42 32 Q44 48 40 60" stroke="#1a5530" stroke-width="1.2" fill="none" opacity=".4"/>
    <path d="M34 38 Q34 48 36 60" stroke="#1a5530" stroke-width="1" fill="none" opacity=".3"/>
  </svg>`,

  // ── CACTUS ── Sagaro-style with arms and spines
  'cactus': `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="cac-b" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#2d7a3f"/><stop offset="30%" stop-color="#3d9b50"/><stop offset="70%" stop-color="#3d9b50"/><stop offset="100%" stop-color="#2d7a3f"/></linearGradient>
    </defs>
    <!-- terracotta pot -->
    <path d="M24 64 L22 76 Q22 79 26 79 L54 79 Q58 79 58 76 L56 64Z" fill="#c07040" opacity=".8"/>
    <rect x="21" y="61" width="38" height="5" rx="2" fill="#d08050"/>
    <!-- main body -->
    <rect x="33" y="18" width="14" height="44" rx="7" fill="url(#cac-b)"/>
    <!-- ridges -->
    <line x1="37" y1="22" x2="37" y2="58" stroke="#1a5530" stroke-width=".3" opacity=".25"/>
    <line x1="40" y1="20" x2="40" y2="60" stroke="#1a5530" stroke-width=".3" opacity=".2"/>
    <line x1="43" y1="22" x2="43" y2="58" stroke="#1a5530" stroke-width=".3" opacity=".25"/>
    <!-- left arm -->
    <g transform="translate(33 35)">
      <path d="M0,0 L-12,0 Q-16,0 -16,-4 L-16,-16 Q-16,-20 -12,-20 Q-8,-20 -8,-16 L-8,-8 L0,-8Z" fill="url(#cac-b)" opacity=".8"/>
    </g>
    <!-- right arm -->
    <g transform="translate(47 28)">
      <path d="M0,0 L10,0 Q14,0 14,-4 L14,-14 Q14,-18 10,-18 Q6,-18 6,-14 L6,-6 L0,-6Z" fill="url(#cac-b)" opacity=".75"/>
    </g>
    <!-- spines -->
    <g stroke="#a08850" stroke-width=".4" opacity=".5">
      <line x1="33" y1="30" x2="30" y2="28"/><line x1="47" y1="32" x2="50" y2="30"/>
      <line x1="33" y1="40" x2="30" y2="38"/><line x1="47" y1="42" x2="50" y2="40"/>
      <line x1="33" y1="50" x2="30" y2="48"/><line x1="47" y1="50" x2="50" y2="48"/>
      <line x1="36" y1="18" x2="35" y2="15"/><line x1="44" y1="18" x2="45" y2="15"/>
    </g>
    <!-- flower on top -->
    <circle cx="40" cy="16" r="3" fill="#ff6080" opacity=".7"/>
    <circle cx="40" cy="16" r="1.5" fill="#ff8090" opacity=".8"/>
  </svg>`,

  // ── ALOE VERA ── Rosette of thick pointed leaves with serrated edges
  'aloe-vera': `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="alo-a" x1="0" y1="0" x2=".5" y2="1"><stop offset="0%" stop-color="#5ab86a"/><stop offset="50%" stop-color="#3a8a4c"/><stop offset="100%" stop-color="#2a6a3a"/></linearGradient>
      <radialGradient id="alo-g" cx=".5" cy=".3"><stop offset="0%" stop-color="#7ad88a" stop-opacity=".3"/><stop offset="100%" stop-color="transparent"/></radialGradient>
    </defs>
    <!-- pot -->
    <path d="M27 63 L25 76 Q25 79 29 79 L51 79 Q55 79 55 76 L53 63Z" fill="#c07040" opacity=".75"/>
    <rect x="24" y="60" width="32" height="5" rx="2" fill="#d08050"/>
    <!-- rosette of thick leaves -->
    <g transform="translate(40 50)">
      <!-- back leaves -->
      <path d="M0,-10 Q-4,-28 -8,-40 Q-6,-44 -2,-42 Q2,-40 0,-28Z" fill="url(#alo-a)" opacity=".65"/>
      <path d="M0,-10 Q4,-28 8,-40 Q6,-44 2,-42 Q-2,-40 0,-28Z" fill="url(#alo-a)" opacity=".6"/>
      <!-- side leaves -->
      <path d="M-2,-8 Q-12,-22 -18,-32 Q-16,-36 -12,-34 Q-6,-26 -2,-8Z" fill="url(#alo-a)" opacity=".75"/>
      <path d="M2,-8 Q12,-22 18,-32 Q16,-36 12,-34 Q6,-26 2,-8Z" fill="url(#alo-a)" opacity=".7"/>
      <!-- wider side leaves -->
      <path d="M-4,-5 Q-16,-16 -22,-24 Q-20,-28 -16,-26 Q-8,-20 -4,-5Z" fill="url(#alo-a)" opacity=".8"/>
      <path d="M4,-5 Q16,-16 22,-24 Q20,-28 16,-26 Q8,-20 4,-5Z" fill="url(#alo-a)" opacity=".75"/>
      <!-- front leaves -->
      <path d="M-3,-3 Q-10,-12 -14,-18 Q-12,-21 -9,-19 Q-5,-14 -3,-3Z" fill="url(#alo-a)" opacity=".85"/>
      <path d="M3,-3 Q10,-12 14,-18 Q12,-21 9,-19 Q5,-14 3,-3Z" fill="url(#alo-a)" opacity=".82"/>
      <!-- center highlight -->
      <ellipse cx="0" cy="-18" rx="3" ry="6" fill="url(#alo-g)"/>
      <!-- serration dots along edges -->
      <g fill="#4aaa5c" opacity=".4">
        <circle cx="-10" cy="-24" r=".5"/><circle cx="-14" cy="-28" r=".5"/>
        <circle cx="10" cy="-24" r=".5"/><circle cx="14" cy="-28" r=".5"/>
        <circle cx="-17" cy="-22" r=".5"/><circle cx="17" cy="-22" r=".5"/>
      </g>
    </g>
  </svg>`,

  // ── ECHEVERIA ── Tight rosette of spoon-shaped leaves, pastel green
  'echeveria': `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="ech-r" cx=".5" cy=".45"><stop offset="0%" stop-color="#b8d8a8"/><stop offset="50%" stop-color="#8abc80"/><stop offset="100%" stop-color="#6a9a60"/></radialGradient>
    </defs>
    <!-- shallow bowl -->
    <ellipse cx="40" cy="64" rx="20" ry="6" fill="#e0d8c8" opacity=".5"/>
    <path d="M20 62 Q20 68 40 70 Q60 68 60 62Z" fill="#d0c8b8" opacity=".5"/>
    <!-- rosette layers from outside in -->
    <g transform="translate(40 48)">
      <!-- outermost ring -->
      <ellipse cx="0" cy="12" rx="18" ry="8" fill="#6a9a60" opacity=".6" transform="rotate(0)"/>
      <ellipse cx="0" cy="12" rx="18" ry="8" fill="#6a9a60" opacity=".55" transform="rotate(45)"/>
      <ellipse cx="0" cy="12" rx="18" ry="8" fill="#6a9a60" opacity=".5" transform="rotate(90)"/>
      <ellipse cx="0" cy="12" rx="18" ry="8" fill="#6a9a60" opacity=".55" transform="rotate(135)"/>
      <!-- middle ring -->
      <ellipse cx="0" cy="8" rx="13" ry="6" fill="#7aac70" opacity=".7" transform="rotate(22)"/>
      <ellipse cx="0" cy="8" rx="13" ry="6" fill="#7aac70" opacity=".65" transform="rotate(67)"/>
      <ellipse cx="0" cy="8" rx="13" ry="6" fill="#7aac70" opacity=".6" transform="rotate(112)"/>
      <ellipse cx="0" cy="8" rx="13" ry="6" fill="#7aac70" opacity=".65" transform="rotate(157)"/>
      <!-- inner ring -->
      <ellipse cx="0" cy="4" rx="8" ry="4" fill="#8abc80" opacity=".8" transform="rotate(10)"/>
      <ellipse cx="0" cy="4" rx="8" ry="4" fill="#8abc80" opacity=".75" transform="rotate(55)"/>
      <ellipse cx="0" cy="4" rx="8" ry="4" fill="#8abc80" opacity=".7" transform="rotate(100)"/>
      <ellipse cx="0" cy="4" rx="8" ry="4" fill="#8abc80" opacity=".75" transform="rotate(145)"/>
      <!-- center -->
      <ellipse cx="0" cy="0" rx="4" ry="3" fill="#b8d8a8" opacity=".9"/>
      <!-- pink tips on some leaves -->
      <circle cx="16" cy="14" r="1" fill="#d89090" opacity=".35"/>
      <circle cx="-14" cy="15" r=".8" fill="#d89090" opacity=".3"/>
      <circle cx="10" cy="8" r=".8" fill="#d89090" opacity=".25"/>
    </g>
  </svg>`,

  // ── JADE PLANT ── Thick rounded leaves on woody stems
  'jade-plant': `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="jde-l" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#4a9a5c"/><stop offset="100%" stop-color="#2a7a3c"/></linearGradient>
    </defs>
    <!-- pot -->
    <path d="M27 63 L25 76 Q25 79 29 79 L51 79 Q55 79 55 76 L53 63Z" fill="#b08060" opacity=".7"/>
    <rect x="24" y="60" width="32" height="5" rx="2" fill="#c89070"/>
    <!-- woody stems -->
    <path d="M40 60 Q38 50 36 42 Q34 36 32 32" stroke="#6a5040" stroke-width="2.5" fill="none" opacity=".6"/>
    <path d="M40 60 Q42 48 46 40 Q48 36 50 30" stroke="#6a5040" stroke-width="2" fill="none" opacity=".5"/>
    <path d="M36 42 Q30 38 26 34" stroke="#6a5040" stroke-width="1.5" fill="none" opacity=".45"/>
    <path d="M46 40 Q52 36 56 32" stroke="#6a5040" stroke-width="1.5" fill="none" opacity=".4"/>
    <!-- round fleshy leaves in pairs -->
    <g>
      <ellipse cx="30" cy="28" rx="5" ry="4" fill="url(#jde-l)" opacity=".88" transform="rotate(-20 30 28)"/>
      <ellipse cx="34" cy="30" rx="5" ry="4" fill="url(#jde-l)" opacity=".82" transform="rotate(15 34 30)"/>
      <ellipse cx="26" cy="32" rx="4.5" ry="3.5" fill="url(#jde-l)" opacity=".78" transform="rotate(-25 26 32)"/>
    </g>
    <g>
      <ellipse cx="52" cy="26" rx="5" ry="4" fill="url(#jde-l)" opacity=".85" transform="rotate(20 52 26)"/>
      <ellipse cx="48" cy="28" rx="5" ry="4" fill="url(#jde-l)" opacity=".8" transform="rotate(-10 48 28)"/>
      <ellipse cx="56" cy="30" rx="4.5" ry="3.5" fill="url(#jde-l)" opacity=".75" transform="rotate(25 56 30)"/>
    </g>
    <g>
      <ellipse cx="38" cy="18" rx="5.5" ry="4.5" fill="url(#jde-l)" opacity=".9" transform="rotate(-5 38 18)"/>
      <ellipse cx="42" cy="20" rx="5" ry="4" fill="url(#jde-l)" opacity=".85" transform="rotate(10 42 20)"/>
    </g>
    <!-- gloss highlights -->
    <ellipse cx="36" cy="16" rx="1.5" ry="1" fill="white" opacity=".12" transform="rotate(-10 36 16)"/>
    <ellipse cx="50" cy="24" rx="1.2" ry=".8" fill="white" opacity=".1" transform="rotate(15 50 24)"/>
    <!-- red leaf tips -->
    <circle cx="28" cy="26" r=".8" fill="#c06040" opacity=".25"/>
    <circle cx="54" cy="24" r=".7" fill="#c06040" opacity=".2"/>
  </svg>`,

  // ── VARIEGATED MONSTERA ── Monstera with cream/white variegation patches
  'variegated-monstera': `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="vm-l" x1=".2" y1="0" x2=".8" y2="1"><stop offset="0%" stop-color="#3a8f50"/><stop offset="50%" stop-color="#2a7040"/><stop offset="100%" stop-color="#1a5030"/></linearGradient>
    </defs>
    <!-- pot (luxury white) -->
    <path d="M26 64 L24 76 Q24 79 28 79 L52 79 Q56 79 56 76 L54 64Z" fill="#f0ede8" opacity=".65"/>
    <rect x="23" y="61" width="34" height="5" rx="2" fill="#f5f2ed"/>
    <!-- main leaf with fenestrations and variegation -->
    <g transform="translate(40 32)">
      <path d="M0,-26 C-6,-22 -18,-16 -20,-6 C-21,0 -14,8 -8,8 C-4,8 -1,4 0,2 C1,4 4,8 8,8 C14,8 21,0 20,-6 C18,-16 6,-22 0,-26Z" fill="url(#vm-l)" opacity=".9"/>
      <!-- fenestrations -->
      <ellipse cx="-8" cy="-14" rx="2.5" ry="3.5" fill="#0d2018" opacity=".45"/>
      <ellipse cx="8" cy="-14" rx="2.5" ry="3" fill="#0d2018" opacity=".45"/>
      <ellipse cx="-5" cy="-4" rx="1.5" ry="2" fill="#0d2018" opacity=".35"/>
      <ellipse cx="5" cy="-4" rx="1.5" ry="2" fill="#0d2018" opacity=".35"/>
      <!-- VARIEGATION: cream patches -->
      <ellipse cx="-10" cy="-20" rx="5" ry="3" fill="#e8e0c0" opacity=".35" transform="rotate(-15 -10 -20)"/>
      <ellipse cx="6" cy="-8" rx="4" ry="5" fill="#f0e8d0" opacity=".3" transform="rotate(10 6 -8)"/>
      <ellipse cx="-4" cy="-22" rx="3" ry="2" fill="#d8d0a0" opacity=".25"/>
      <!-- midrib -->
      <path d="M0,-26 L0,2" stroke="#1a5030" stroke-width=".6" fill="none" opacity=".35"/>
    </g>
    <!-- smaller leaf -->
    <g transform="translate(22 48) rotate(-20) scale(.55)">
      <path d="M0,-22 C-5,-18 -14,-12 -16,-4 C-17,1 -11,6 -6,6 C-3,6 -1,3 0,2 C1,3 3,6 6,6 C11,6 17,1 16,-4 C14,-12 5,-18 0,-22Z" fill="url(#vm-l)" opacity=".7"/>
      <ellipse cx="-6" cy="-14" rx="3" ry="2.5" fill="#e8e0c0" opacity=".3"/>
      <ellipse cx="4" cy="-6" rx="2.5" ry="3" fill="#f0e8d0" opacity=".25"/>
    </g>
    <path d="M40 34 Q42 48 40 60" stroke="#1a5030" stroke-width="1.5" fill="none" opacity=".45"/>
  </svg>`,

  // ── PINK PRINCESS PHILODENDRON ── Dark leaves with pink variegation splashes
  'pink-princess': `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="pp-l" x1="0" y1="0" x2=".5" y2="1"><stop offset="0%" stop-color="#2a4a30"/><stop offset="100%" stop-color="#1a3020"/></linearGradient>
      <linearGradient id="pp-p" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#e870a0"/><stop offset="100%" stop-color="#d05080"/></linearGradient>
    </defs>
    <!-- pot (matte black) -->
    <path d="M27 63 L25 76 Q25 79 29 79 L51 79 Q55 79 55 76 L53 63Z" fill="#2a2a28" opacity=".8"/>
    <rect x="24" y="60" width="32" height="5" rx="2" fill="#3a3a38"/>
    <!-- dark heart-shaped leaves -->
    <g transform="translate(38 30)">
      <path d="M0,-22 C-6,-18 -16,-10 -16,-2 C-16,4 -10,10 -4,10 C-1,10 0,6 0,4 C0,6 1,10 4,10 C10,10 16,4 16,-2 C16,-10 6,-18 0,-22Z" fill="url(#pp-l)" opacity=".92"/>
      <!-- pink variegation splashes -->
      <ellipse cx="-6" cy="-16" rx="5" ry="3" fill="url(#pp-p)" opacity=".6" transform="rotate(-20 -6 -16)"/>
      <ellipse cx="8" cy="-8" rx="4" ry="6" fill="url(#pp-p)" opacity=".5" transform="rotate(15 8 -8)"/>
      <ellipse cx="-3" cy="0" rx="3" ry="2.5" fill="#e880a8" opacity=".35"/>
      <circle cx="5" cy="-18" r="2" fill="#d06090" opacity=".3"/>
      <!-- midrib -->
      <path d="M0,-22 L0,4" stroke="#1a3020" stroke-width=".5" fill="none" opacity=".3"/>
    </g>
    <!-- second leaf -->
    <g transform="translate(22 48) rotate(-18) scale(.7)">
      <path d="M0,-20 C-5,-16 -14,-9 -14,-2 C-14,4 -9,8 -4,8 C-1,8 0,5 0,3 C0,5 1,8 4,8 C9,8 14,4 14,-2 C14,-9 5,-16 0,-20Z" fill="url(#pp-l)" opacity=".75"/>
      <ellipse cx="-5" cy="-14" rx="4" ry="2.5" fill="url(#pp-p)" opacity=".45" transform="rotate(-15)"/>
      <ellipse cx="6" cy="-6" rx="3" ry="4" fill="url(#pp-p)" opacity=".35"/>
    </g>
    <!-- stem -->
    <path d="M38 32 Q40 48 38 60" stroke="#1a3020" stroke-width="1.2" fill="none" opacity=".4"/>
    <path d="M22 48 Q24 54 28 60" stroke="#1a3020" stroke-width="1" fill="none" opacity=".3"/>
  </svg>`,

  // ── THAI CONSTELLATION ── Monstera with cream speckled constellation pattern
  'thai-constellation': `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="tc-l" x1=".2" y1="0" x2=".8" y2="1"><stop offset="0%" stop-color="#3a8f50"/><stop offset="50%" stop-color="#2a7040"/><stop offset="100%" stop-color="#1a5030"/></linearGradient>
    </defs>
    <!-- luxury pot -->
    <path d="M26 64 L24 76 Q24 79 28 79 L52 79 Q56 79 56 76 L54 64Z" fill="#d8d0c0" opacity=".55"/>
    <rect x="23" y="61" width="34" height="5" rx="2" fill="#e8e0d0"/>
    <line x1="23" y1="63.5" x2="57" y2="63.5" stroke="#c4a84a" stroke-width=".4" opacity=".5"/>
    <!-- main leaf -->
    <g transform="translate(40 32)">
      <path d="M0,-26 C-6,-22 -18,-16 -20,-6 C-21,0 -14,8 -8,8 C-4,8 -1,4 0,2 C1,4 4,8 8,8 C14,8 21,0 20,-6 C18,-16 6,-22 0,-26Z" fill="url(#tc-l)" opacity=".9"/>
      <!-- fenestrations -->
      <ellipse cx="-8" cy="-14" rx="2.5" ry="3.5" fill="#0d2018" opacity=".45"/>
      <ellipse cx="8" cy="-14" rx="2.5" ry="3" fill="#0d2018" opacity=".45"/>
      <ellipse cx="-5" cy="-4" rx="1.5" ry="2" fill="#0d2018" opacity=".35"/>
      <ellipse cx="5" cy="-4" rx="1.5" ry="2" fill="#0d2018" opacity=".35"/>
      <!-- CONSTELLATION SPECKLES: many small cream dots -->
      <circle cx="-10" cy="-22" r="1.5" fill="#f0e8a0" opacity=".5"/>
      <circle cx="-12" cy="-16" r="1" fill="#e8e090" opacity=".4"/>
      <circle cx="-7" cy="-10" r="1.2" fill="#f0e8a0" opacity=".45"/>
      <circle cx="4" cy="-20" r="1.8" fill="#f0e8a0" opacity=".5"/>
      <circle cx="10" cy="-10" r="1" fill="#e8e090" opacity=".4"/>
      <circle cx="2" cy="-6" r="1.3" fill="#f0e8a0" opacity=".45"/>
      <circle cx="-3" cy="-18" r=".8" fill="#e8e090" opacity=".35"/>
      <circle cx="12" cy="-18" r="1.2" fill="#f0e8a0" opacity=".4"/>
      <circle cx="-1" cy="-2" r="1" fill="#f0e8a0" opacity=".3"/>
      <circle cx="7" cy="-2" r=".8" fill="#e8e090" opacity=".3"/>
      <!-- midrib -->
      <path d="M0,-26 L0,2" stroke="#1a5030" stroke-width=".6" fill="none" opacity=".3"/>
    </g>
    <!-- smaller leaf -->
    <g transform="translate(22 50) rotate(-18) scale(.5)">
      <path d="M0,-22 C-5,-18 -14,-12 -16,-4 C-17,1 -11,6 -6,6 C-3,6 -1,3 0,2 C1,3 3,6 6,6 C11,6 17,1 16,-4 C14,-12 5,-18 0,-22Z" fill="url(#tc-l)" opacity=".65"/>
      <circle cx="-6" cy="-16" r="1.5" fill="#f0e8a0" opacity=".4"/>
      <circle cx="4" cy="-8" r="1.2" fill="#f0e8a0" opacity=".35"/>
      <circle cx="0" cy="-2" r="1" fill="#f0e8a0" opacity=".3"/>
    </g>
    <path d="M40 34 Q42 48 40 60" stroke="#1a5030" stroke-width="1.5" fill="none" opacity=".4"/>
  </svg>`,

  // ── CALATHEA ── Round leaves with striking patterned markings
  'calathea': `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="cal-l" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#3a7a50"/><stop offset="100%" stop-color="#1a5530"/></linearGradient>
    </defs>
    <!-- pot -->
    <path d="M27 63 L25 76 Q25 79 29 79 L51 79 Q55 79 55 76 L53 63Z" fill="#e0d4c0" opacity=".55"/>
    <rect x="24" y="60" width="32" height="5" rx="2" fill="#e8dcc8"/>
    <!-- large round leaves on long petioles -->
    <g transform="translate(40 32)">
      <!-- leaf shape: rounded -->
      <ellipse cx="0" cy="0" rx="18" ry="16" fill="url(#cal-l)" opacity=".88"/>
      <!-- pattern: concentric rings like a Calathea orbifolia -->
      <ellipse cx="0" cy="0" rx="14" ry="12" fill="none" stroke="#2a6a40" stroke-width="1.5" opacity=".25"/>
      <ellipse cx="0" cy="0" rx="10" ry="8" fill="none" stroke="#2a6a40" stroke-width="1.2" opacity=".2"/>
      <ellipse cx="0" cy="0" rx="5" ry="4" fill="none" stroke="#2a6a40" stroke-width="1" opacity=".15"/>
      <!-- midrib -->
      <path d="M0,-16 L0,16" stroke="#2a6a40" stroke-width=".6" fill="none" opacity=".3"/>
      <!-- dark green patch between veins -->
      <ellipse cx="-8" cy="-4" rx="3" ry="6" fill="#1a4a2e" opacity=".15" transform="rotate(-5 -8 -4)"/>
      <ellipse cx="8" cy="-4" rx="3" ry="6" fill="#1a4a2e" opacity=".15" transform="rotate(5 8 -4)"/>
    </g>
    <!-- second leaf -->
    <g transform="translate(22 48) rotate(-20) scale(.6)">
      <ellipse cx="0" cy="0" rx="16" ry="14" fill="url(#cal-l)" opacity=".7"/>
      <ellipse cx="0" cy="0" rx="12" ry="10" fill="none" stroke="#2a6a40" stroke-width="1.2" opacity=".2"/>
      <ellipse cx="0" cy="0" rx="8" ry="6" fill="none" stroke="#2a6a40" stroke-width="1" opacity=".15"/>
      <path d="M0,-14 L0,14" stroke="#2a6a40" stroke-width=".5" fill="none" opacity=".25"/>
    </g>
    <!-- petioles -->
    <path d="M40 32 Q42 46 40 60" stroke="#2a6a40" stroke-width="1.3" fill="none" opacity=".4"/>
    <path d="M22 48 Q24 54 28 60" stroke="#2a6a40" stroke-width="1" fill="none" opacity=".3"/>
    <!-- purple underside hint -->
    <ellipse cx="40" cy="44" rx="4" ry="2" fill="#6a3a7a" opacity=".12"/>
  </svg>`,

  // ── PRAYER PLANT ── Oval leaves with herringbone vein pattern, folds at night
  'prayer-plant': `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="prl-l" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#4a9a60"/><stop offset="100%" stop-color="#2a7a40"/></linearGradient>
    </defs>
    <!-- pot -->
    <path d="M27 63 L25 76 Q25 79 29 79 L51 79 Q55 79 55 76 L53 63Z" fill="#c8a880" opacity=".55"/>
    <rect x="24" y="60" width="32" height="5" rx="2" fill="#d8b890"/>
    <!-- oval leaves with herringbone pattern -->
    <g transform="translate(40 30)">
      <ellipse cx="0" cy="0" rx="16" ry="13" fill="url(#prl-l)" opacity=".9" transform="rotate(-5)"/>
      <!-- herringbone vein pattern -->
      <path d="M0,-13 L0,13" stroke="#2a6a30" stroke-width=".6" fill="none" opacity=".35"/>
      <path d="M0,-10 L-12,-4" stroke="#2a6a30" stroke-width=".4" fill="none" opacity=".2"/>
      <path d="M0,-10 L12,-4" stroke="#2a6a30" stroke-width=".4" fill="none" opacity=".2"/>
      <path d="M0,-6 L-10,0" stroke="#2a6a30" stroke-width=".4" fill="none" opacity=".2"/>
      <path d="M0,-6 L10,0" stroke="#2a6a30" stroke-width=".4" fill="none" opacity=".2"/>
      <path d="M0,-2 L-8,4" stroke="#2a6a30" stroke-width=".4" fill="none" opacity=".18"/>
      <path d="M0,-2 L8,4" stroke="#2a6a30" stroke-width=".4" fill="none" opacity=".18"/>
      <path d="M0,2 L-6,7" stroke="#2a6a30" stroke-width=".35" fill="none" opacity=".15"/>
      <path d="M0,2 L6,7" stroke="#2a6a30" stroke-width=".35" fill="none" opacity=".15"/>
      <!-- dark patches between veins -->
      <ellipse cx="-7" cy="-6" rx="3" ry="3" fill="#1a5530" opacity=".12" transform="rotate(-10)"/>
      <ellipse cx="7" cy="-6" rx="3" ry="3" fill="#1a5530" opacity=".12" transform="rotate(10)"/>
      <!-- pink/red underside hint -->
      <ellipse cx="0" cy="0" rx="14" ry="11" fill="#c06070" opacity=".08" transform="rotate(-5)"/>
    </g>
    <!-- second leaf (folded up — prayer position) -->
    <g transform="translate(22 46) rotate(-25) scale(.55)">
      <ellipse cx="0" cy="0" rx="14" ry="12" fill="url(#prl-l)" opacity=".7"/>
      <path d="M0,-12 L0,12" stroke="#2a6a30" stroke-width=".5" fill="none" opacity=".3"/>
      <path d="M0,-8 L-10,-2" stroke="#2a6a30" stroke-width=".35" fill="none" opacity=".18"/>
      <path d="M0,-8 L10,-2" stroke="#2a6a30" stroke-width=".35" fill="none" opacity=".18"/>
    </g>
    <path d="M40 32 Q42 46 40 60" stroke="#2a6a30" stroke-width="1.2" fill="none" opacity=".4"/>
    <path d="M22 46 Q24 52 28 60" stroke="#2a6a30" stroke-width="1" fill="none" opacity=".3"/>
  </svg>`,

  // ── PARLOR PALM ── Graceful feathery fronds
  'parlor-palm': `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="ppl-l" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#4aaa5c"/><stop offset="100%" stop-color="#2a7a3c"/></linearGradient>
    </defs>
    <!-- pot -->
    <path d="M27 63 L25 76 Q25 79 29 79 L51 79 Q55 79 55 76 L53 63Z" fill="#8a7a60" opacity=".6"/>
    <rect x="24" y="60" width="32" height="5" rx="2" fill="#a09070"/>
    <!-- fronds (feathery palm leaves) -->
    <g opacity=".9">
      <path d="M40 58 Q38 40 32 22 Q28 14 24 10" stroke="#2a7a3c" stroke-width="1.2" fill="none"/>
      <!-- pinnae (leaflets) along frond -->
      <path d="M34 30 Q30 26 26 24" stroke="url(#ppl-l)" stroke-width="1.5" fill="none" stroke-linecap="round"/>
      <path d="M35 26 Q32 22 28 20" stroke="url(#ppl-l)" stroke-width="1.3" fill="none" stroke-linecap="round" opacity=".85"/>
      <path d="M33 34 Q28 30 24 28" stroke="url(#ppl-l)" stroke-width="1.5" fill="none" stroke-linecap="round" opacity=".88"/>
      <path d="M32 22 Q29 18 26 16" stroke="url(#ppl-l)" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".8"/>
      <path d="M31 26 Q26 22 22 22" stroke="url(#ppl-l)" stroke-width="1.1" fill="none" stroke-linecap="round" opacity=".75"/>
    </g>
    <g opacity=".85">
      <path d="M40 58 Q42 38 48 24 Q52 16 56 12" stroke="#2a7a3c" stroke-width="1.1" fill="none"/>
      <path d="M46 32 Q50 28 54 26" stroke="url(#ppl-l)" stroke-width="1.4" fill="none" stroke-linecap="round"/>
      <path d="M47 28 Q51 24 55 22" stroke="url(#ppl-l)" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".82"/>
      <path d="M48 36 Q52 32 56 30" stroke="url(#ppl-l)" stroke-width="1.3" fill="none" stroke-linecap="round" opacity=".8"/>
      <path d="M49 24 Q53 20 56 18" stroke="url(#ppl-l)" stroke-width="1.1" fill="none" stroke-linecap="round" opacity=".75"/>
    </g>
    <g opacity=".78">
      <path d="M40 58 Q39 34 36 20 Q34 14 32 10" stroke="#2a7a3c" stroke-width="1" fill="none"/>
      <path d="M37 28 Q34 24 30 22" stroke="url(#ppl-l)" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".7"/>
      <path d="M38 22 Q36 18 33 16" stroke="url(#ppl-l)" stroke-width="1" fill="none" stroke-linecap="round" opacity=".65"/>
    </g>
    <g opacity=".72">
      <path d="M40 58 Q41 36 44 22 Q46 16 48 12" stroke="#2a7a3c" stroke-width=".9" fill="none"/>
      <path d="M43 30 Q46 26 50 24" stroke="url(#ppl-l)" stroke-width="1.1" fill="none" stroke-linecap="round" opacity=".65"/>
      <path d="M44 24 Q47 20 50 18" stroke="url(#ppl-l)" stroke-width=".9" fill="none" stroke-linecap="round" opacity=".6"/>
    </g>
  </svg>`,

  // ── PEPEROMIA ── Thick, round, glossy leaves on compact stems
  'peperomia': `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="pep-l" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#4a9a60"/><stop offset="100%" stop-color="#2a7a3c"/></linearGradient>
    </defs>
    <!-- pot -->
    <path d="M28 62 L26 76 Q26 79 30 79 L50 79 Q54 79 54 76 L52 62Z" fill="#e0d0c0" opacity=".55"/>
    <rect x="25" y="59" width="30" height="5" rx="2" fill="#f0e0d0"/>
    <!-- compact bushy form with round leaves -->
    <g>
      <path d="M40 58 Q40 48 40 42" stroke="#2a6a3c" stroke-width="1.5" fill="none" opacity=".5"/>
      <!-- peltate leaves (stem attaches in middle) -->
      <circle cx="40" cy="32" r="8" fill="url(#pep-l)" opacity=".88"/>
      <circle cx="40" cy="32" r="2" fill="#2a6a3c" opacity=".3"/>
      <!-- petiole connection -->
      <path d="M40 34 L40 42" stroke="#2a6a3c" stroke-width="1" opacity=".35"/>
    </g>
    <g>
      <path d="M32 56 Q28 46 26 40" stroke="#2a6a3c" stroke-width="1.3" fill="none" opacity=".45"/>
      <circle cx="26" cy="34" r="7" fill="url(#pep-l)" opacity=".82"/>
      <circle cx="26" cy="34" r="1.8" fill="#2a6a3c" opacity=".25"/>
    </g>
    <g>
      <path d="M48 56 Q52 46 54 40" stroke="#2a6a3c" stroke-width="1.3" fill="none" opacity=".45"/>
      <circle cx="54" cy="34" r="7" fill="url(#pep-l)" opacity=".8"/>
      <circle cx="54" cy="34" r="1.8" fill="#2a6a3c" opacity=".25"/>
    </g>
    <g>
      <path d="M36 54 Q32 42 30 36" stroke="#2a6a3c" stroke-width="1.2" fill="none" opacity=".4"/>
      <circle cx="30" cy="28" r="6.5" fill="url(#pep-l)" opacity=".75"/>
      <circle cx="30" cy="28" r="1.5" fill="#2a6a3c" opacity=".22"/>
    </g>
    <g>
      <path d="M44 54 Q48 42 50 36" stroke="#2a6a3c" stroke-width="1.2" fill="none" opacity=".4"/>
      <circle cx="50" cy="28" r="6.5" fill="url(#pep-l)" opacity=".73"/>
      <circle cx="50" cy="28" r="1.5" fill="#2a6a3c" opacity=".22"/>
    </g>
    <!-- small new leaves -->
    <circle cx="40" cy="22" r="4" fill="#5ab870" opacity=".5"/>
    <circle cx="34" cy="24" r="3.5" fill="#5ab870" opacity=".4"/>
    <!-- gloss -->
    <circle cx="38" cy="30" r="2" fill="white" opacity=".08"/>
    <circle cx="52" cy="32" r="1.8" fill="white" opacity=".07"/>
  </svg>`
};

// ── Fallback SVG for any plant without a custom illustration ──
function generateFallbackSVG(id, color1 = '#3a8f50', color2 = '#1a5530') {
  return `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="fb-l-${id}" x1=".2" y1="0" x2=".8" y2="1"><stop offset="0%" stop-color="${color1}"/><stop offset="100%" stop-color="${color2}"/></linearGradient>
    </defs>
    <path d="M28 62 L26 76 Q26 79 30 79 L50 79 Q54 79 54 76 L52 62Z" fill="#8a8a80" opacity=".6"/>
    <rect x="25" y="59" width="30" height="5" rx="2" fill="#a0a098" opacity=".6"/>
    <g transform="translate(40 38)">
      <path d="M0,-26 C-8,-20 -20,-10 -22,0 C-23,6 -16,12 -10,12 C-4,12 -1,6 0,4 C1,6 4,12 10,12 C16,12 23,6 22,0 C20,-10 8,-20 0,-26Z" fill="url(#fb-l-${id})" opacity=".85"/>
      <path d="M0,-26 L0,4" stroke="${color2}" stroke-width=".6" fill="none" opacity=".3"/>
      <path d="M0,-16 L-14,-6" stroke="${color2}" stroke-width=".35" fill="none" opacity=".2"/>
      <path d="M0,-16 L14,-6" stroke="${color2}" stroke-width=".35" fill="none" opacity=".2"/>
    </g>
    <path d="M40 40 Q42 50 40 58" stroke="${color2}" stroke-width="1.2" fill="none" opacity=".4"/>
  </svg>`;
}

/**
 * Get a unique SVG illustration for a plant.
 * @param {string} plantId - The plant's unique ID
 * @param {number} [size] - Optional pixel size; if omitted, CSS controls sizing
 * @returns {string} SVG markup string
 */
export function getPlantSVG(plantId, size) {
  let svg = PLANT_SVGS[plantId] || generateFallbackSVG(plantId);
  if (size) {
    // Inject explicit width/height attributes for precise sizing
    svg = svg.replace(
      '<svg ',
      `<svg width="${size}" height="${size}" `
    );
  }
  return svg;
}
