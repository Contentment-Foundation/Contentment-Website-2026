#!/usr/bin/env python3
import re, base64, io
from PIL import Image, ImageDraw

CF="/home/claude/cf/"

head   = open(CF+"head.html").read()
header = open(CF+"header.html").read()
footer = open(CF+"footer.html").read()
body   = open(CF+"ev_body.html").read()
addendum = open(CF+"ev_addendum.css").read()

# add Dancing Script + Cedarville Cursive (accent fonts) to the shared font link
head = head.replace("&family=Varela+Round&display=swap",
  "&family=Varela+Round&family=Dancing+Script:wght@500;600;700&family=Cedarville+Cursive&display=swap")

# title + description
head = re.sub(r"<title>.*?</title>",
  "<title>Events &amp; Experiences &middot; The Contentment Foundation</title>", head, flags=re.S)
head = re.sub(r'(<meta name="description" content=")[^"]*(")',
  r"\1From a retreat on the Bali coast to a workshop in your living room, our gatherings are where teachers, members, and friends pause, connect, and practice together.\2",
  head)

# addendum CSS
head = head.replace("</style>", addendum + "\n</style>")

# nav current state
header = header.replace('<a href="why-wellbeing.html" aria-current="page">','<a href="why-wellbeing.html">')
header = header.replace('<a href="events.html">Events</a>','<a href="events.html" aria-current="page">Events</a>')

# ---- branded duotone placeholders (real photos drop in later) ----
def duotone(w,h,shift=0.0,variant=0):
    img=Image.new("RGB",(w,h)); px=img.load()
    palettes=[
        [(2,55,79),(0,128,176),(31,175,192)],   # ocean
        [(2,45,66),(2,78,112),(0,128,176)],      # deep
        [(31,110,120),(79,169,140),(60,142,116)],# green-teal
    ]
    c0,c1,c2=palettes[variant%len(palettes)]
    for y in range(h):
        for x in range(w):
            t=(x/w*0.55 + y/h*0.45 + shift)%1.0
            if t<0.5:
                k=t/0.5; r=int(c0[0]+(c1[0]-c0[0])*k);g=int(c0[1]+(c1[1]-c0[1])*k);b=int(c0[2]+(c1[2]-c0[2])*k)
            else:
                k=(t-0.5)/0.5; r=int(c1[0]+(c2[0]-c1[0])*k);g=int(c1[1]+(c2[1]-c1[1])*k);b=int(c1[2]+(c2[2]-c1[2])*k)
            px[x,y]=(r,g,b)
    d=ImageDraw.Draw(img)
    d.ellipse([w-int(w*0.45),-int(h*0.35),w+int(w*0.15),int(h*0.5)],outline=(255,255,255),width=2)
    buf=io.BytesIO(); img.save(buf,"JPEG",quality=72)
    return "data:image/jpeg;base64,"+base64.b64encode(buf.getvalue()).decode()

# real photos: hero (1) + 5 recaps
import json
A=json.load(open(CF+"assets_ev.json"))
for k in ["EV_HERO","EV_FLAGSHIP","EV_WHY","EV_CTA","EV_RECAP_BALI","EV_RECAP_SHASTA","EV_RECAP_BHUTAN","EV_RECAP_UGANDA","EV_RECAP_SINGAPORE"]:
    body=body.replace("__"+k+"__", A[k])

doc = head + "\n</head>\n<body>\n" + header + "\n" + body + "\n" + footer + "\n"

# CSS-side asset tokens (live in the addendum, which is already inside head) --
# resolved at doc level after assets_ev.json is loaded.
for k in ["EV_ACCESS_BG","EV_SIGNUP_BG","EV_RECAPS_BG"]:
    doc = doc.replace("__"+k+"__", A[k])

js = '''
<script>
const hdr=document.getElementById('hdr');
addEventListener('scroll',()=>{hdr.classList.toggle('scrolled',scrollY>40)},{passive:true});
addEventListener('load',()=>document.body.classList.add('hero-loaded'));
setTimeout(()=>document.body.classList.add('hero-loaded'),400);
const io=new IntersectionObserver((es)=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.14,rootMargin:'0px 0px -6% 0px'});
document.querySelectorAll('.anim').forEach(el=>{if(!el.closest('.ev-hero'))io.observe(el)});

// ---- parallax on full-bleed media layers (respects reduced-motion) ----
const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!prefersReduced){
  const layers=[...document.querySelectorAll('[data-parallax]')];
  const SCALE=1.14, RANGE=48; // px of drift
  let ticking=false;
  function updateParallax(){
    const vh=innerHeight;
    layers.forEach(el=>{
      const sec=el.parentElement;
      const r=sec.getBoundingClientRect();
      if(r.bottom<0||r.top>vh) return; // offscreen, skip
      // progress: -1 (section below viewport) .. 1 (section above)
      const p=(r.top+r.height/2 - vh/2)/(vh/2 + r.height/2);
      const y=Math.max(-1,Math.min(1,p))*RANGE;
      el.style.transform='scale('+SCALE+') translate3d(0,'+y.toFixed(1)+'px,0)';
    });
    ticking=false;
  }
  function onScroll(){ if(!ticking){ requestAnimationFrame(updateParallax); ticking=true; } }
  addEventListener('scroll',onScroll,{passive:true});
  addEventListener('resize',onScroll,{passive:true});
  updateParallax();
}

// ---- live event filtering ----
const filters=[...document.querySelectorAll('.ev-filter')];
const cards=[...document.querySelectorAll('.ev-card')];
const emptyMsg=document.querySelector('.ev-empty');
function applyFilter(f){
  let shown=0;
  cards.forEach(c=>{
    const match = f==='all' || c.dataset.access===f || c.dataset.format===f;
    c.hidden=!match; if(match)shown++;
  });
  if(emptyMsg) emptyMsg.hidden = shown>0;
}
filters.forEach(btn=>{
  btn.addEventListener('click',()=>{
    filters.forEach(b=>{b.classList.remove('is-active');b.setAttribute('aria-selected','false');});
    btn.classList.add('is-active');btn.setAttribute('aria-selected','true');
    applyFilter(btn.dataset.filter);
  });
});

// ---- SEAM: join / rsvp flow. Every gated action routes here carrying its
// event id, so tech wires ONE handler that redirects into Homeroom/Keela and
// returns to this event with the RSVP one tap away. ----
document.querySelectorAll('[data-join],[data-rsvp]').forEach(el=>{
  el.addEventListener('click',e=>{
    // let real anchors to other pages (get-involved) through; only trap in-page seams
    const href=el.getAttribute('href');
    if(href && href!=='#' && !href.startsWith('#')) return;
    e.preventDefault();
    const intent=el.dataset.join?('join:'+el.dataset.join):('rsvp:'+el.dataset.rsvp);
    const ev=el.closest('[data-event]');
    console.log('[event-flow]',intent,'event:',ev?ev.dataset.event:'(none)','- pending tech wiring');
  });
});

// ---- click-to-play YouTube tiles (loads iframe only on interaction) ----
document.querySelectorAll('[data-yt]').forEach(el=>{
  function play(){
    if(el.classList.contains('playing')) return;
    const id=el.dataset.yt;
    const f=document.createElement('iframe');
    f.src='https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0&modestbranding=1';
    f.title='Video';
    f.allow='autoplay; encrypted-media; picture-in-picture';
    f.allowFullscreen=true;
    el.appendChild(f);
    el.classList.add('playing');
  }
  el.addEventListener('click',play);
  el.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); play(); } });
});
</script>'''

doc = doc + js + "\n</body>\n</html>"

for path in [CF+"events.html","/mnt/user-data/outputs/events.html"]:
    open(path,"w").write(doc)

# ---- verification ----
print("bytes:", len(doc))
print("em-dashes (\u2014):", doc.count("\u2014"))
for w in ["quiet","steady","steadiness","upstream","donor"]:
    n=len(re.findall(r"\b"+w+r"\b", doc, flags=re.I))
    print(f"banned '{w}':", n)
print("event cards:", doc.count('class="ev-card '))
print("member cards:", doc.count('ev-card-member'))
print("filters:", doc.count('class="ev-filter'))
print("join seams:", doc.count("data-join"))
print("rsvp seams:", doc.count("data-rsvp"))
print("embed seams:", doc.count("data-embed"))
print("recap cards:", doc.count('class="ev-recap '))
