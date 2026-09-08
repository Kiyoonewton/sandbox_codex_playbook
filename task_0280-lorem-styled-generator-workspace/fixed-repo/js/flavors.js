/**
 * Flavor definitions — each has label, accent color, and word pool
 */

export const FLAVORS = {
  'classic-lorem': {
    label: 'Classic Lorem',
    color: '#8b3a2a',
    words: [
      'lorem','ipsum','dolor','sit','amet','consectetur','adipiscing','elit',
      'sed','do','eiusmod','tempor','incididunt','ut','labore','et','dolore',
      'magna','aliqua','enim','ad','minim','veniam','quis','nostrud',
      'exercitation','ullamco','laboris','nisi','aliquip','ex','ea','commodo',
      'consequat','duis','aute','irure','in','reprehenderit','voluptate',
      'velit','esse','cillum','fugiat','nulla','pariatur','excepteur','sint',
      'occaecat','cupidatat','non','proident','sunt','culpa','qui','officia',
      'deserunt','mollit','anim','id','est','laborum','perspiciatis','unde',
      'omnis','iste','natus','error','voluptatem','accusantium','doloremque',
      'laudantium','totam','rem','aperiam','eaque','ipsa','quae','ab','illo',
      'inventore','veritatis','quasi','architecto','beatae','vitae','dicta',
      'explicabo','nemo','ipsam','quia','voluptas','aspernatur','aut','odit',
      'fugit','consequuntur','magni','dolores','ratione','sequi','nesciunt',
      'neque','porro','quisquam','nihil','impedit','quo','minus'
    ]
  },
  'cat-ipsum': {
    label: 'Cat Ipsum',
    color: '#d23090',
    words: [
      'meow','purr','treat','catnip','scratching','post','litter','box',
      'kitten','whiskers','paws','nap','sunbeam','laser','pointer','mouse',
      'toy','yarn','ball','fish','tuna','milk','curl','stretch','hiss',
      'swat','chase','bird','window','box','bag','keyboard','laptop',
      'sit','lap','rub','belly','chin','headbutt','knead','loud',
      'knock','over','cup','plant','shelf','climb','jump','land','stare',
      'judge','ignore','hungry','breakfast','dinner','bowl','water',
      'fountain','groom','bathe','hate','hide','under','bed','couch',
      'cave','tunnel','crinkle','feather','dangle','blink','slow',
      'tail','flick','ears','flat','crouch','pounce','catch','drop',
      'bring','gift','breathe','loudly','snore','drool','lick',
      'sofa','pillow','blanket','warm','cozy','furry','fluffy',
      'soft','shred','destroy','furniture','curtain','carpet','door'
    ]
  },
  'hipster-ipsum': {
    label: 'Hipster Ipsum',
    color: '#7a8a3a',
    words: [
      'artisan','vinyl','kombucha','craft','coffee','pour','over','beans',
      'sourdough','ferment','organic','farm','table','brunch','avocado',
      'toast','cold','press','juice','matcha','oat','milk','vegan',
      'gluten','free','thrift','vintage','retro','analog','polaroid',
      'film','camera','typewriter','zine','independent','curate','aesthetic',
      'minimalism','brutalist','scandinavian','mid','century','IKEA',
      'plant','monstera','fiddle','fig','succulent','terracotta','macrame',
      'wall','hanging','bamboo','straw','reusable','eco',
      'sustainability','zero','waste','compost','upcycle','reclaim',
      'fixie','bicycle','helmet','turntable','amp',
      'tube','synth','indie','band','gig','basement','show','DIY',
      'maker','space','co','working','startup','remote','digital','nomad',
      'yoga','studio','meditation','mindful','breath','intention','journey'
    ]
  },
  'sci-fi': {
    label: 'Sci-Fi',
    color: '#2a7a8b',
    words: [
      'quantum','nebula','starship','warp','hyperdrive','galaxy','asteroid',
      'android','cyborg','plasma','laser','photon','neutron','proton',
      'antimatter','dark','energy','space','station','orbit','planet',
      'exoplanet','wormhole','singularity','black','hole','supernova',
      'fusion','reactor','shield','force','field','teleport',
      'holodeck','replicator','terraform','biosphere','nanotech','robot',
      'sentient','hivemind','neural','link','implant','cybernetic',
      'matrix','simulation','virtual','reality','augmented','hologram',
      'phaser','blaster','torpedo','fleet','admiral','captain','crew',
      'mission','exploration','frontier','colonize','habitat','dome',
      'airlock','hull','cockpit','thruster','propulsion','ion','solar',
      'sail','comet','meteor','void','infinity','eternal',
      'cosmos','universe','multiverse','dimension','parallel','timeline',
      'paradox','enigma','cipher','decode','encrypt','protocol','override'
    ]
  },
  'medieval': {
    label: 'Medieval',
    color: '#3a6b4a',
    words: [
      'knight','castle','dragon','sword','shield','armor','helmet','lance',
      'squire','messenger','herald','banner','coat','arms','crest','sigil',
      'moat','drawbridge','turret','tower','rampart','battlement','parapet',
      'fortress','citadel','kingdom','realm','sovereign','crown','throne',
      'scepter','orb','monarch','queen','prince','princess','duke','duchess',
      'baron','count','earl','vassal','lord','lady','peasant','serf',
      'tournament','joust','quest','crusade',
      'siege','battlefield','warrior','mercenary','swordsman','archer',
      'crossbow','catapult','trebuchet','garrison','alchemy','grimoire',
      'potion','elixir','sorcery','witchcraft',
      'holy','grail','prophecy','oracle','rune','talisman','amulet',
      'chapel','cathedral','monastery','monk','scribe','illuminated',
      'parchment','quill','ink','manuscript','chronicle','saga','ballad',
      'feast','mead','ale','harvest','festival','mystic','legend'
    ]
  },
  'food': {
    label: 'Food',
    color: '#c46030',
    words: [
      'sourdough','umami','fermentation','deglaze','roux','emulsify',
      'chiffonade','julienne','brunoise','confit','sous','vide','blanch',
      'saute','braise','roast','grill','smoke','cure','brine','marinade',
      'baste','fold','whisk','cream','caramelize','reduce',
      'truffle','saffron','vanilla','cardamom','turmeric','cumin','paprika',
      'coriander','basil','thyme','rosemary','oregano','sage','chive',
      'shallot','leek','fennel','artichoke','morel','chanterelle','porcini',
      'wagyu','prosciutto','pancetta','guanciale','burrata','ricotta',
      'gruyere','parmesan','brie','camembert','pecorino','aged','artisan',
      'farm','organic','heritage','heirloom','forage','seasonal',
      'mirepoix','sofrito','gastrique','veloute','bechamel','hollandaise',
      'pesto','chimichurri','aioli','tahini','miso','wasabi','sriracha',
      'chutney','harissa','sumac','technique','plating','garnish','pairing','bouquet'
    ]
  },
  'pirate-speak': {
    label: 'Pirate Speak',
    color: '#d8a23a',
    words: [
      'arrgh','matey','scallywag','bilge','rat','ye','landlubber',
      'blimey','ahoy','sail','batten','hatches','plank','keelhaul',
      'brig','cannon','broadside','starboard','port','bow','stern',
      'mast','crow','nest','jolly','roger','cutlass','grog','rum',
      'tankard','galleon','sloop','frigate','brigantine','schooner',
      'treasure','booty','doubloon','pieces','eight','chest','buried',
      'marks','spot','map','compass','chronometer','spyglass',
      'anchor','rigging','knot','league','fathom','horizon','seven',
      'seas','ocean','tidal','wave','storm','tempest','squall',
      'sunset','sunrise','harbor','cove','island',
      'parrot','monkey','peg','hook','eye','patch','scar','tattoo',
      'captain','crew','mutiny','quartermaster','bosun',
      'first','mate','deckhand','swab','surrender','mercy','victory'
    ]
  }
};

export const FLAVOR_KEYS = Object.keys(FLAVORS);
