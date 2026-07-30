#!/usr/bin/env python3
"""build_about.py - assembles about.html from transplant blocks + page sections.
Prints a loud warning for any expected asset that is missing (lesson from handoff F).
Placeholder slots are dashed and labeled; real headshots drop in by filename convention:
  headshots/firstname-lastname.jpg   headshots/board-*.jpg   headshots/adv-*.jpg
"""
import base64, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))

def read(p):
    with open(os.path.join(HERE, p), encoding='utf-8') as f:
        return f.read()

def b64(path, mime='image/jpeg'):
    with open(os.path.join(HERE, path), 'rb') as f:
        return f'data:{mime};base64,' + base64.b64encode(f.read()).decode()

def warn_missing(path):
    print(f'!! WARNING: expected asset missing: {path}', file=sys.stderr)

# ---------------- people (VERIFY AGAINST SOURCE BEFORE DEPLOY - see manifest) ----------
TEAM = [  # (name, title, slug) - rank order per Dave 2026-07-19
    ("Navin Amarasuriya", "Chief Executive Officer", "navin-amarasuriya"),
    ("Lorna Holman", "Chief Financial Officer", "lorna-holman"),
    ("Dave Kebo", "Chief Creative Officer", "dave-kebo"),
    ("Jennifer Jones", "Chief Implementation Officer", "jennifer-jones"),
    ("WoeiJing Teng", "Mission Advancement + Community Building", "woeijing-teng"),
    ("Somesh Bhardwaj", "Senior System Administrator", "somesh-bhardwaj"),
    ("Kristina Blundon", "Director of Operations", "kristina-blundon"),
    ("Pamila Nigah", "Finance Director", "pamila-nigah"),
    ("Tim Huang", "Director, Global Implementation", "tim-huang"),
    ("Tshering Eudon", "Director, Asia", "tshering-eudon"),
    ("Karma Doma Tshering", "Director, Bhutan", "karma-doma-tshering"),
    ("Tempa Ragbay", "Associate Director, Bhutan", "tempa-ragbay"),
    ("Susan Gathu", "Senior Program Lead, Africa", "susan-gathu"),
    ("Jennifer Gonsalves", "Outreach &amp; Implementation Specialist, Hawaiʻi", "jennifer-gonsalves"),
    ("Anik Ghosh", "Senior Software Engineer", "anik-ghosh"),
    ("Ryan Miller", "Internal Culture Associate", "ryan-miller"),
    ("Cikara Ni Luh", "Community Engagement Coordinator", "cikara-ni-luh"),
]
BOARD = [
    ("Emmet B. Keeffe III", "Chairman &amp; Co-Founder of The Contentment Foundation", "board-emmet-keeffe"),
    ("Heidi Roddenberry", "President at The Roddenberry Foundation", "board-heidi-roddenberry"),
    ("Yossri Abdou, J.D.", "Founder &amp; Partner at Libertas Law", "board-yossri-abdou"),
    ("David Simas, J.D.", "Managing Director of Research, Emerson Collective", "board-david-simas"),
]
ADVISORY = [
    ("Yikai Xu", "Scientific Advisor (New York University)", "adv-yikai-xu"),
    ("Robin Graat", "Events Strategy Advisor", "adv-robin-graat"),
    ("Lakhan Samani", "Tech Advisor", "adv-lakhan-samani"),
]

def person_card(name, title, slug, cls="tcard"):
    photo = f'headshots/{slug}.jpg'
    if os.path.exists(os.path.join(HERE, photo)):
        img = f'<span class="pface"><img src="{b64(photo)}" alt="{name}"></span>'
    else:
        img = f'<span class="pface ph" aria-hidden="true"><span>{slug}.jpg</span></span>'
    return (f'<figure class="{cls} anim">{img}'
            f'<figcaption><strong>{name}</strong><span>{title}</span></figcaption></figure>')

# ---------------- assets ----------------
dan_path = 'dan_q82.jpg'
if not os.path.exists(os.path.join(HERE, dan_path)):
    warn_missing(dan_path); sys.exit(1)
DAN = b64(dan_path)
for pth in ('hero_bali5.jpg','story_country3.jpg'):
    if not os.path.exists(os.path.join(HERE,pth)): warn_missing(pth); sys.exit(1)
HERO_IMG = b64('hero_bali5.jpg')
STORY3_IMG = b64('story_country3.jpg')

header = read('t_header.html')
# kit-v2: About already ships as a real href (about.html). Mark it current on this page.
# nav markup: <a href="about.html" data-page="about">About</a>
assert header.count('<a href="about.html" data-page="about">About</a>') == 1, "kit-v2 About nav link not found"
header = header.replace('<a href="about.html" data-page="about">About</a>',
                        '<a href="about.html" aria-current="page" data-page="about">About</a>')

footer = read('t_footer.html')
base_css   = read('t_base.css')  # site global resets + body typography (kit assumes these exist)
kit_css    = read('t_kit.css')   # header+footer+root; kit-v2 (logo lockup + coin), 2026-07-28
shared_css = read('t_shared.css')
news_css   = read('t_news.css')  # kept for input styling reuse in conversion band



page_css = read('about_addendum.css')

html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>About · The Contentment Foundation</title>
<meta name="description" content="Meet the small, remote team behind the Contentment Foundation. For ten years, in twelve countries, one job: tend to the wellbeing of teachers.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400;1,6..72,500&family=Inter:wght@400;500;600;700&family=Varela+Round&family=Cedarville+Cursive&display=swap" rel="stylesheet">
<style>
{base_css}
{kit_css}
{shared_css}
{news_css}
{page_css}
</style>
</head>
<body>

{header}

<!-- 1 HERO - photo placeholder. Real candid team photo drops into .about-hero-bg. -->
<section class="about-hero" id="top">
  <div class="about-hero-bg" role="img" aria-label="The Contentment Foundation team, arms raised, on a Bali hilltop at dusk" style="background-image:url('{HERO_IMG}');background-position:50% 26%"></div>
  <div class="about-hero-scrim" aria-hidden="true"></div>
  <div class="wrap about-hero-inner">
    <h1>We're the people<br>who look after the people<br>who look after&nbsp;kids.</h1>
    <p class="hero-sub">For ten years, in twelve countries, we've had one job: tend to the wellbeing of teachers so that every student walks into a room and can truly be seen, heard and supported.</p>
    <a class="skiplink" href="#team">Skip to meet the team &darr;</a>
  </div>
  <span class="hero-caption">Most of us, Bali, July 2025</span>
</section>

<!-- 2 OUR STORY -->
<section class="band story">
  <div class="story-grid">
    <div class="story-txt">
      <span class="eyebrow anim">Where this started</span>
      <h2 class="title anim d1">Before this was an organization, there was a scientist with a curiosity he couldn't shake.</h2>
      <p class="body anim d2">Dr. Daniel Cordaro spent years tracing emotions across cultures, from research labs to the mountains of Eastern Bhutan. Along the way, an insight came into focus: Contentment. The quiet perception that this moment is truly enough, complete in itself, with nothing really missing.</p>
      <p class="body anim d3">Ten years on, this work of wellbeing has grown as a labour of love, co-created by a principal who opened a door with fierce love, teachers who made room in already-full days, families who offered trust, and donors, volunteers, and countless others&hellip;</p>
      <p class="body anim d3">And inside schools, a deeper question was revealed: so much is built for students. Who cares for the people who care for them?</p>
      <a class="textlink anim d4" href="why-wellbeing.html">Our answer lives here &rarr;</a>
    </div>
    <div class="story-photos">
      <figure class="sphoto live anim"><img src="{DAN}" alt="Dan Cordaro holding a globe for a circle of schoolchildren outside a school in Eastern Bhutan"><figcaption>Dan teaching in Bhutan, 2014</figcaption></figure>
      <figure class="sphoto live anim d1"><img src="{STORY3_IMG}" alt="A teacher and her young students standing together with hands on their hearts in a classroom"><figcaption>Hands on hearts. The Country School, Los Angeles, May 2025</figcaption></figure>
    </div>
  </div>
</section>

<!-- 3 WHAT WE BELIEVE - full-bleed halves, cursive labels, columns hug the seam (Dave 2026-07-20) -->
<section class="believe">
  <div class="believe-halves">
    <div class="bhalf bh-vision">
      <div class="bhalf-inner anim">
        <span class="blabel">Vision</span>
        <p class="bstatement">A world where thriving teachers nurture wiser &amp; kinder generations.</p>
      </div>
    </div>
    <div class="bhalf bh-mission">
      <div class="bhalf-inner anim d1">
        <span class="blabel">Mission</span>
        <p class="bstatement bsm">We empower teachers to cultivate wellbeing in themselves and their classrooms. Our scientifically evidenced work is rooted in cultivating mindfulness, community, self-curiosity, and contentment. When teachers thrive, their ripples reach every corner of the world their students will one day shape.</p>
        <p class="humility anim d2">We're not there yet. Twelve countries in, we've mostly learned how much further there is to go, and that it's worth going.</p>
      </div>
    </div>
  </div>
</section>

<!-- 4 THE TEAM -->
<section class="band team" id="team">
  <div class="wrap">
    <span class="eyebrow anim">Our Team</span>
    <h2 class="title anim d1">A small, remote team.</h2>
    <p class="body anim d2">All of us are people who've either taught, been raised by a teacher, or been saved by one.</p>
    <div class="tgrid">
      {''.join(person_card(*p) for p in TEAM)}
    </div>
  </div>
</section>

<!-- 5 CONVERSION BAND -->
<section class="band convert">
  <div class="wrap">
    <h2 class="title anim">You don't have to donate to matter here.</h2>
    <div class="cgrid">
      <div class="ccard c-green anim d1">
        <h3>Get the Newsletter</h3>
        <p>Join thousands of supporters building a more compassionate and calm world. One-ish email a month, usually about a teacher, a tool or resource you can try and experiences you can join.</p>
        <form onsubmit="return false" data-embed="newsletter">
          <input type="text" placeholder="First name" aria-label="First name">
          <input type="email" placeholder="Email address" aria-label="Email address">
          <button class="btn cbtn" type="submit">Keep me in the loop</button>
        </form>
      </div>
      <div class="ccard c-blue anim d2">
        <h3>Talk with Us</h3>
        <p>Question about our work, your school, a partnership, anything. Kristina and WoeiJing read every message and reply within the week.</p>
        <a class="btn cbtn" href="mailto:hello@contentment.org">Email a real person &rarr;</a>
      </div>
      <div class="ccard c-sand anim d3">
        <h3>Pass it On</h3>
        <p>The most useful thing you can do in ten seconds is show this to someone who loves a teacher.</p>
        <div class="crow">
          <a class="btn cbtn dark" href="https://www.instagram.com/contentmentorg/" target="_blank" rel="noopener">Instagram</a>
          <a class="btn cbtn dark" href="#" data-link="linkedin">LinkedIn</a>
          <a class="btn cbtn dark" href="mailto:?subject=Thought%20of%20you.%20This%20is%20what%20teacher%20wellbeing%20looks%20like.&body=Met%20an%20organization%20I%20think%20you%27d%20like.%20Start%20here%3A%20http%3A%2F%2Fwww.contentment.org">Email this to someone</a>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- 6 BOARD + ADVISORY -->
<section class="band-tight governance">
  <div class="wrap">
    <span class="eyebrow anim">Board of Directors</span>
    <div class="ggrid anim d1">
      {''.join(person_card(*p, cls="gcard") for p in BOARD)}
    </div>
    <span class="eyebrow anim gov-second">Advisors</span>
    <div class="ggrid g3 anim d1">
      {''.join(person_card(*p, cls="gcard") for p in ADVISORY)}
    </div>
  </div>
</section>

{footer}

<script>
const hdr=document.getElementById('hdr');
addEventListener('scroll',()=>{{hdr.classList.toggle('scrolled',scrollY>40)}},{{passive:true}});
addEventListener('load',()=>document.body.classList.add('hero-loaded'));
setTimeout(()=>document.body.classList.add('hero-loaded'),400);
const io=new IntersectionObserver((es)=>{{es.forEach(e=>{{if(e.isIntersecting){{e.target.classList.add('in');io.unobserve(e.target)}}}})}},{{threshold:.16,rootMargin:'0px 0px -7% 0px'}});
document.querySelectorAll('.anim').forEach(el=>{{if(!el.closest('.about-hero'))io.observe(el)}});
</script>
</body>
</html>
"""

out = os.path.join(HERE, 'about.html')
open(out, 'w', encoding='utf-8').write(html)
print('wrote', out, len(html)//1024, 'KB')

# copy checks: banned words + em-dash in rendered text only
text = re.sub(r'<style[\s\S]*?</style>|<script[\s\S]*?</script>|<[^>]+>', ' ', html)
for bad in ['\u2014', ' donor', 'quiet', 'steady', 'upstream']:
    hits = len(re.findall(bad, text, re.I))
    if hits: print(f'!! COPY WARNING: "{bad.strip()}" x{hits} in rendered text', file=sys.stderr)
print('copy checks done')
