// Shared program + story data for Foundation Reach map and Story Board prototypes.
// Edit here once — both site/foundation-reach-map.html and site/story-board.html load this file.
// Deploy: contentmentweb2.netlify.app/foundation-reach-map · /story-board (see netlify.toml)
//
// Demo stock photos (Pexels CDN) on selected stories — replace with real program photos before launch.
// Pexels hotlinks reliably from static pages, file:// previews, and Netlify deploys.

const PX = id =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=640&h=360&fit=crop`;

const SAMPLE = {
  educatorClass:      PX(8617539),  // teacher with students at desks
  educatorReading:    PX(8613062),  // teacher reading with children
  educatorWithKids:   PX(8422987),  // educator among students in class
  educatorTeaching:   PX(8613310),  // teacher at front of classroom
  classroomAfrica:    PX(7688336),  // classroom in global south setting
  classroomLesson:    PX(8613089),  // lesson in progress
  kidsClassroom:      PX(8199572),  // children engaged in class activity
  studentsDesks:      PX(5542943),  // students at desks
  studentsGroup:      PX(8088427),  // group of students together
  studentLearning:    PX(366139),   // child learning in classroom
  studentPortrait:    PX(6740804),  // student portrait in school
  studentWriting:     PX(590086),   // student writing at desk
  happyStudents:      PX(301926),  // smiling students in class
  childrenPlaying:    PX(4145352),  // children playing together
  playground:         PX(5212342),  // playground / outdoor school area
  playgroundActivity: PX(1128317),  // kids active outdoors
  kidsSoccer:         PX(1267694),  // children playing football
  youngChild:         PX(256520)    // young child at school
};

const PROGRAM = {
  "United States of America":{iso:"840",region:"Americas",since:2016,schools:142,educators:5100,students:180000,
    impact:{wellbeing:82,attendance:64,teacherRetention:71},programs:["Mindful Classrooms","Educator Well-being","Student Voice"],
    stories:[
      {q:"The curriculum changed how our whole school handles conflict.",by:"Maria S., Principal, Ohio",role:"educator",
       img:SAMPLE.educatorWithKids, cap:"An educator with students in the classroom",
       text:"Before the program, disagreements ended in the office. Now our fifth-graders run their own restorative circles. Suspensions are down 40% this year.",
       full:"Before the program, every disagreement seemed to end in my office. Teachers were exhausted from mediating, and students didn't feel heard. We piloted Mindful Classrooms in two grade levels first. Within six months, fifth-graders were running restorative circles on their own. Suspensions dropped 40% year over year, and staff surveys show educators feel more equipped — and less alone — when hard moments arise.",
       video:"https://youtu.be/j1qMIFUHoFU" /* DEMO placeholder: real TCF channel video (Schools of Wellbeing — Grenada Elementary, California), remove once a real matching clip exists */},
      {q:"I used to feel like a volcano. Now I know how to breathe first.",by:"Jayden, age 11, Texas",role:"student",
       img:SAMPLE.studentLearning, cap:"Students during a classroom activity",
       text:"When I get really mad I do the four-corner breathing my teacher taught us. My little brother uses it too now.",
       full:"I used to get sent out of class a lot because I'd blow up before I could explain what was wrong. My teacher taught us four-corner breathing and a feelings check-in every morning. Now when I'm mad I pause, breathe, and write down what happened. My little brother started copying me at home. School feels safer because people listen before they yell."},
      {q:"Parents notice the difference at home too.",by:"Denise R., Parent & PTA lead, Atlanta",role:"educator",
       text:"Kids are naming emotions at the dinner table. That never happened before.",
       full:"Our PTA was skeptical at first — another program, another binder. But within a semester, parents started reporting the same language at home: 'I need a reset,' 'I'm in the red zone.' Teachers finally have a shared vocabulary with families. Attendance at parent nights went up because people see real change, not just posters on a wall.",
       video:"https://youtu.be/eZXBmoe-RZk" /* DEMO placeholder: real TCF channel video (Schools of Wellbeing — Corbett Prep, Tampa FL), remove once a real matching clip exists */}
    ]},
  "Canada":{iso:"124",region:"Americas",since:2018,schools:28,educators:720,students:24000,
    impact:{wellbeing:76,attendance:58,teacherRetention:69},programs:["Mindful Classrooms","Student Voice"],
    stories:[
      {q:"Students finally have language for what they feel.",by:"Amira K., Teacher, Toronto",role:"educator",
       img:SAMPLE.classroomLesson, cap:"An educator teaching a classroom lesson",
       text:"We went from 'I'm fine' to honest check-ins in under a month.",
       full:"In a class of 28, almost everyone used to answer 'I'm fine' during morning meetings. We introduced a simple mood meter and paired it with student voice circles once a week. Students began naming anxiety before tests, loneliness at recess, pride after group work. Referrals didn't disappear overnight, but the quality of conversations changed completely — we intervene earlier now.",
       video:"https://youtu.be/3x9WtrhjKPc" /* DEMO placeholder: real TCF channel video (Schools of Wellbeing — Henry Lord Community School, Fall River MA), remove once a real matching clip exists */},
      {q:"I spoke at our school assembly about worry.",by:"Leo, age 13, Vancouver",role:"student",
       img:SAMPLE.studentWriting, cap:"A student working in class",
       text:"I told everyone that feeling nervous is normal. A lot of kids came up to me after.",
       full:"I always thought I was the only one who got nervous before presentations. Our teacher asked if anyone wanted to share how they handle worry. I volunteered and talked about journaling and walking outside at lunch. After assembly, kids I barely knew said they felt the same way. It made the school feel smaller in a good way."}
    ]},
  "Mexico":{iso:"484",region:"Americas",since:2020,schools:17,educators:410,students:28500,
    impact:{wellbeing:73,attendance:60,teacherRetention:62},programs:["Mindful Classrooms","Rural Outreach"],
    stories:[
      {q:"Rural schools finally have the same tools as the city.",by:"Carlos M., Coordinator, Oaxaca",role:"educator",
       img:SAMPLE.classroomAfrica, cap:"An educator with students in a rural classroom",
       text:"Distance used to mean isolation. Now our facilitators connect weekly.",
       full:"Our rural cohorts used to receive materials once a year and then figure it out alone. We built a lightweight facilitator network with weekly virtual check-ins and peer observation visits. Teachers swap lesson adaptations for multigrade classrooms, and student well-being data is tracked consistently for the first time across the region."},
      {q:"I help my classmates when they feel sad.",by:"Sofía, age 10, Guadalajara",role:"student",
       img:SAMPLE.childrenPlaying, cap:"Children playing together at school",
       text:"We have a peace corner in our classroom. I sit with friends there.",
       full:"When someone is crying we don't laugh anymore. We walk them to the peace corner, get water, and ask if they want to talk or just breathe. I like being a helper. My teacher says I'm a 'calm leader,' which makes me proud."}
    ]},
  "Brazil":{iso:"076",region:"Americas",since:2021,schools:13,educators:340,students:22000,
    impact:{wellbeing:71,attendance:57,teacherRetention:58},programs:["Educator Well-being","Student Voice"],
    stories:[
      {q:"Teacher burnout was our hidden crisis.",by:"Fernanda L., School lead, São Paulo",role:"educator",
       img:SAMPLE.educatorTeaching, cap:"An educator in a partner school classroom",
       text:"We started with staff well-being before pushing another student initiative.",
       full:"We had tried student programs before, but exhausted teachers couldn't sustain them. Educator Well-being sessions gave staff protected time, peer coaching, and clear boundaries around workload. Only then did classroom practices stick. Retention improved and classroom climate scores followed six months later."}
    ]},
  "India":{iso:"356",region:"Asia",since:2019,schools:64,educators:2300,students:95000,
    impact:{wellbeing:79,attendance:73,teacherRetention:66},programs:["Mindful Classrooms","Rural Outreach","Educator Well-being"],
    stories:[
      {q:"Attendance rose sharply after daily check-ins.",by:"Priya N., Head teacher, Pune",role:"educator",
       img:SAMPLE.kidsClassroom, cap:"Children in a classroom morning activity",
       text:"We started every morning with a two-minute check-in. Within a term, the children who used to skip class were the ones leading it.",
       full:"Chronic absenteeism was tied to shame — students fell behind and stopped coming. A two-minute morning check-in lowered the stakes: name your mood, set one intention. Within one term, several previously disengaged students volunteered to lead the ritual. Attendance climbed and so did participation in afternoon clubs.",
       video:"https://youtu.be/QSbvbbkQcGI" /* DEMO placeholder: real TCF channel video (The Four Pillars of Wellbeing — Corbett Prep, Tampa FL), remove once a real matching clip exists */},
      {q:"Now I tell my teacher when I feel worried.",by:"Ananya, age 10, Delhi",role:"student",
       img:SAMPLE.studentPortrait, cap:"A student in a partner school classroom",
       text:"Before, I kept everything inside. Now I raise my hand.",
       full:"I used to get stomach aches and wouldn't say why. We learned that worry can live in your body. Now I put a card on my desk — green, yellow, or red — and my teacher checks in privately. I don't miss as much school because someone notices early."},
      {q:"Our village school finally feels connected.",by:"Ravi S., Facilitator, Rajasthan",role:"educator",
       text:"Rural outreach brought mentors who understand our context.",
       full:"Urban training models rarely fit our classrooms — different languages, multigrade rooms, seasonal migration. The Rural Outreach track paired us with mentors who adapted tools instead of copying them. Parents trust the program because facilitators visit homes and listen before prescribing solutions."}
    ]},
  "Indonesia":{iso:"360",region:"Asia",since:2021,schools:19,educators:480,students:31000,
    impact:{wellbeing:74,attendance:61,teacherRetention:63},programs:["Mindful Classrooms"],
    stories:[
      {q:"Our teachers feel supported for the first time.",by:"Dewi A., Coordinator, Jakarta",role:"educator",
       img:SAMPLE.studentsGroup, cap:"Students and educators learning together",
       text:"Peer learning circles changed staff culture in one semester.",
       full:"Teachers were isolated in their own classrooms, comparing themselves silently on social media. Monthly peer circles — structured, confidential, practical — normalized struggle and shared wins. Sick days dropped, collaboration increased, and students noticed calmer adults in the building."},
      {q:"We made a calm-down playlist for our class.",by:"Bima, age 12, Surabaya",role:"student",
       img:SAMPLE.happyStudents, cap:"Students in a partner school classroom",
       text:"Everyone added one song that helps them feel steady.",
       full:"Our class made a playlist together — gamelan, pop, even one teacher's acoustic track. When the room gets loud, we play it for two minutes and reset. It sounds small, but it gave us ownership over our environment instead of just being told to be quiet."}
    ]},
  "Philippines":{iso:"608",region:"Asia",since:2022,schools:15,educators:390,students:26500,
    impact:{wellbeing:75,attendance:63,teacherRetention:61},programs:["Mindful Classrooms","Rural Outreach"],
    stories:[
      {q:"After the typhoon, school became our anchor again.",by:"Elena V., Principal, Cebu",role:"educator",
       img:SAMPLE.educatorClass, cap:"An educator leading students in class",
       text:"Routines for well-being helped students process trauma without forcing them to talk.",
       full:"When classes resumed after the storm, many students were grieving losses we couldn't fix with worksheets. Predictable morning rituals — breathing, gratitude, optional sharing — gave children agency. Counselors reported fewer crisis escalations because teachers had language and structure before problems peaked."}
    ]},
  "Saudi Arabia":{iso:"682",region:"Asia",since:2022,schools:11,educators:260,students:14000,
    impact:{wellbeing:70,attendance:55,teacherRetention:60},programs:["Educator Well-being"],
    stories:[
      {q:"Well-being is now part of every morning.",by:"Noura H., Educator, Riyadh",role:"educator",
       img:SAMPLE.classroomLesson, cap:"An educator with students in class",
       text:"Five minutes of intentional calm changed the tone of the whole day.",
       full:"We integrated a five-minute staff-and-student grounding practice at the start of each day. Skeptics worried about lost instructional time, but transitions shortened and disruptions fell. Educators report leaving school less depleted, which was the metric leadership cared about most."}
    ]},
  "Nepal":{iso:"524",region:"Asia",since:2023,schools:8,educators:175,students:9800,
    impact:{wellbeing:78,attendance:68,teacherRetention:65},programs:["Rural Outreach","Student Voice"],
    stories:[
      {q:"Students designed our well-being board.",by:"Karma T., Teacher, Kathmandu",role:"educator",
       img:SAMPLE.kidsClassroom, cap:"Children collaborating in a classroom",
       text:"When students own the visuals, they use the tools more.",
       full:"We stopped printing generic posters and ran a student design sprint instead. The well-being board now includes Nepali phrases, local symbols, and grade-level tips written by students. Usage of the calm corner tripled because it finally felt like theirs, not an import."}
    ]},
  "Kenya":{iso:"404",region:"Africa",since:2019,schools:22,educators:540,students:38000,
    impact:{wellbeing:81,attendance:70,teacherRetention:64},programs:["Mindful Classrooms","Rural Outreach"],
    stories:[
      {q:"The children lead the breathing exercises now.",by:"Grace W., Teacher, Nairobi",role:"educator",
       img:SAMPLE.educatorClass, cap:"An educator leading a classroom lesson",
       text:"I only had to model the morning check-in for two weeks. Now the students remind me if we skip it.",
       full:"I modeled the morning check-in for two weeks, then handed leadership to student captains. They rotate prompts, watch the clock, and invite quieter classmates in. The ritual became the heartbeat of our classroom — academic risk-taking went up because emotional safety went up first."},
      {q:"School feels calm now. I like coming here.",by:"Amani, age 9, Kisumu",role:"student",
       img:SAMPLE.studentsDesks, cap:"Students learning together in class",
       text:"We start the day sitting quietly and saying how we feel. On sad days my teacher notices and we talk.",
       full:"Before, I sometimes hid behind the classroom because mornings at home were loud. Now we sit together and say how we feel. On sad days my teacher checks in without embarrassing me in front of everyone. I made two new friends this term because we learned how to repair after arguments."},
      {q:"Girls stay in school when they feel seen.",by:"Faith O., Counselor, Nakuru",role:"educator",
       text:"Targeted girl circles reduced early dropouts in our partner schools.",
       full:"We paired Mindful Classrooms with small girl-led circles addressing safety, confidence, and attendance barriers. Girls who previously left after upper primary began staying through the term. The common thread in interviews: 'An adult listened before punishing me.'"}
    ]},
  "Uganda":{iso:"800",region:"Africa",since:2020,schools:14,educators:300,students:21000,
    impact:{wellbeing:77,attendance:66,teacherRetention:61},programs:["Mindful Classrooms"],
    stories:[
      {q:"Calm classrooms, calmer communities.",by:"James O., Head teacher, Kampala",role:"educator",
       img:SAMPLE.educatorTeaching, cap:"An educator teaching in a classroom",
       text:"Students brought conflict-resolution language home to their families.",
       full:"We tracked playground incidents and home visit anecdotes over a year. Students began mediating sibling conflicts and advocating for pauses during family disputes. The program didn't just change lessons — it gave children transferable skills their parents adopted because they worked.",
       video:"https://youtu.be/nGA-M7GDQg0" /* DEMO placeholder: real TCF channel video ("The Bank of Trust"), remove once a real matching clip exists */},
      {q:"I don't fight on the field anymore.",by:"Samuel, age 12, Jinja",role:"student",
       img:SAMPLE.kidsSoccer, cap:"Children playing football at school",
       text:"We have a hand signal for 'time out' during football.",
       full:"Football used to end in fights almost every day. Our coach and teacher taught a hand signal for timeout when emotions run high. We walk to the sideline, breathe, and decide if we want to keep playing. Games finish now. I even taught it to my cousins."}
    ]},
  "Tanzania":{iso:"834",region:"Africa",since:2021,schools:12,educators:240,students:17000,
    impact:{wellbeing:75,attendance:62,teacherRetention:59},programs:["Rural Outreach"],
    stories:[
      {q:"A quiet revolution in how we teach.",by:"Neema J., Educator, Dodoma",role:"educator",
       img:SAMPLE.educatorReading, cap:"An educator reading with students",
       text:"We stopped treating well-being as extra — it's how we teach.",
       full:"Rural Outreach training reframed well-being as instructional design, not an add-on. We embedded reflection into science labs and literacy blocks. Teachers who once saw social-emotional learning as foreign now describe it as 'how we keep children in the room mentally, not just physically.'"},
      {q:"My teacher asks how I slept.",by:"Zawadi, age 8, Arusha",role:"student",
       img:SAMPLE.youngChild, cap:"A young student at a partner school",
       text:"It helps when she knows I'm tired before math.",
       full:"Some mornings I'm tired because we had guests at home. My teacher asks how we slept and changes the first activity if many of us are low-energy. I don't get in trouble for being slow on those days. I feel respected."}
    ]},
  "Rwanda":{iso:"646",region:"Africa",since:2022,schools:10,educators:210,students:14500,
    impact:{wellbeing:80,attendance:69,teacherRetention:63},programs:["Mindful Classrooms","Student Voice"],
    stories:[
      {q:"Healing and learning can happen together.",by:"Claudine U., Facilitator, Kigali",role:"educator",
       img:SAMPLE.educatorWithKids, cap:"An educator with students in school",
       text:"Structured rituals created safety for hard conversations.",
       full:"Our context carries historical weight that surfaces in classrooms subtly. Predictable rituals — openings, closings, optional sharing — created enough safety for honest conversations without forcing disclosure. Student voice sessions revealed bullying patterns early, before they became crises."}
    ]},
  "Ghana":{iso:"288",region:"Africa",since:2023,schools:7,educators:165,students:11200,
    impact:{wellbeing:76,attendance:64,teacherRetention:60},programs:["Educator Well-being","Mindful Classrooms"],
    stories:[
      {q:"Teachers asked for support — and got it.",by:"Kwame A., District lead, Accra",role:"educator",
       img:SAMPLE.studentsGroup, cap:"Educators and students in a school setting",
       text:"When staff well-being improved, classroom climate followed within a term.",
       full:"District leaders assumed student programs were the priority, but teachers pushed back: 'We cannot pour from empty cups.' Educator Well-being cohorts ran first. Within one term, classroom observations showed warmer tone, clearer boundaries, and fewer shouting matches. Student climate surveys improved without a separate student campaign."}
    ]},
  "Dem. Rep. Congo":{iso:"180",region:"Africa",since:2022,schools:9,educators:180,students:12000,
    impact:{wellbeing:72,attendance:57,teacherRetention:55},programs:["Rural Outreach"],
    stories:[
      {q:"Hope, taught daily.",by:"Patrick M., Coordinator, Goma",role:"educator",
       img:SAMPLE.classroomAfrica, cap:"An educator with students in a rural classroom",
       text:"Even brief stability rituals matter when everything else is uncertain.",
       full:"Our schools operate amid constant disruption — displacement, infrastructure gaps, staffing churn. Short, reliable rituals gave children something to predict when much else could not be predicted. Teachers described the program as 'small but steady,' which is exactly what families said they needed."},
      {q:"We sing before we study.",by:"Amina, age 11, Bukavu",role:"student",
       img:SAMPLE.playground, cap:"Children in a school playground area",
       text:"The song reminds us we belong to the same class.",
       full:"We sing the same welcome song every morning. New students learn it on day one. When someone is absent we ask if they are okay the next day. I like school more because we start together instead of jumping straight into copying from the board."}
    ]},
  "Bhutan":{iso:"064",region:"Asia",since:2023,schools:6,educators:120,students:5400,
    impact:{wellbeing:85,attendance:78,teacherRetention:74},programs:["Mindful Classrooms","Student Voice"],
    stories:[
      {q:"Gross National Happiness, in the classroom.",by:"Sonam D., Teacher, Thimphu",role:"educator",
       img:SAMPLE.educatorReading, cap:"An educator reading with students",
       text:"National values aligned with what we were already trying to build.",
       full:"GNH is not abstract here — it's a design principle. Mindful Classrooms gave us shared practices for compassion, reflection, and community responsibility. Student voice forums let children propose service projects tied to local needs. The program felt like an extension of national identity, not an import.",
       video:"https://youtu.be/BZ_rDqmtm1U" /* DEMO placeholder: real TCF channel video (ELC High School — TCF in Bhutan), remove once a real matching clip exists */},
      {q:"I journal about gratitude every Friday.",by:"Pema, age 14, Paro",role:"student",
       img:SAMPLE.studentWriting, cap:"A student writing in class",
       text:"It helps me notice good things even on hard weeks.",
       full:"Fridays we write three gratitudes — small ones are allowed: hot lunch, a friend sharing a pen, clear weather. On hard weeks it feels impossible at first, then I always find something. My teacher reads hers aloud too, which makes it fair.",
       video:"https://youtu.be/5pLIASeoSMU" /* DEMO placeholder: real TCF channel video (Schools of Wellbeing — Shari ECCD Centre, Paro Bhutan — exact city match), remove once a real matching clip exists */}
    ]},
  "United Kingdom":{iso:"826",region:"Europe",since:2024,schools:9,educators:280,students:15400,
    impact:{wellbeing:74,attendance:59,teacherRetention:67},programs:["Educator Well-being","Student Voice"],
    stories:[
      {q:"Staff rooms became places of honesty again.",by:"Hannah C., Deputy head, Manchester",role:"educator",
       img:SAMPLE.educatorTeaching, cap:"An educator in a partner school",
       text:"Protected peer time reduced the 'performative okay' culture among teachers.",
       full:"After years of pressure and post-pandemic fatigue, staff rooms were transactional. Educator Well-being cohorts created protected peer time with clear norms — no fixing, no judgment. Teachers began naming workload limits earlier. Supply cover requests dropped because fewer staff hit crisis-level burnout."}
    ]},
  "Australia":{iso:"036",region:"Oceania",since:2024,schools:11,educators:310,students:18600,
    impact:{wellbeing:77,attendance:61,teacherRetention:68},programs:["Mindful Classrooms","Educator Well-being"],
    stories:[
      {q:"Remote schools need connection, not just content.",by:"Liam P., Facilitator, Darwin",role:"educator",
       img:SAMPLE.classroomLesson, cap:"An educator teaching in a rural classroom",
       text:"Virtual circles kept isolated teachers from leaving mid-year.",
       full:"Remote educators often quit from isolation, not lack of skill. We built lightweight virtual circles — same time each fortnight, rotating facilitation, practical swaps for mixed-age classes. Retention among our most isolated cohort improved because teachers felt professionally connected again."},
      {q:"We have a feelings weather report.",by:"Mia, age 9, Brisbane",role:"student",
       img:SAMPLE.playgroundActivity, cap:"Children playing outdoors at school",
       text:"Sunny, cloudy, or stormy — everyone shares without saying private stuff.",
       full:"Our feelings weather report is quick: sunny, cloudy, or stormy. You don't have to explain unless you want to. Teachers adjust the day — more movement if we're stormy, partner work if we're sunny. It sounds silly but it works."}
    ]}
};
const CITIES = [
  { name:"Honolulu", coords:[-157.86,21.31], key:"__Honolulu" },
  { name:"Singapore", coords:[103.82,1.35], key:"__Singapore" },
  { name:"New York", coords:[-74.01,40.71], key:"__NewYork" },
  { name:"London", coords:[-0.12,51.51], key:"__London" },
  { name:"Nairobi", coords:[36.82,-1.29], key:"__Nairobi" },
  { name:"Mumbai", coords:[72.88,19.08], key:"__Mumbai" }
];
PROGRAM["__Honolulu"]={label:"Honolulu, Hawaiʻi",region:"Americas",since:2017,schools:8,educators:190,students:6200,
  impact:{wellbeing:83,attendance:69,teacherRetention:72},programs:["Mindful Classrooms","Student Voice"],
  stories:[
    {q:"Aloha as pedagogy.",by:"Kai L., Educator, Oʻahu",role:"educator",
     text:"Place-based practices rooted in community made the curriculum feel local.",
     full:"We adapted Mindful Classrooms to honor place — moʻolelo storytelling, outdoor reflection, and community guests. Students connected breathing practices to ocean imagery and family traditions. Engagement rose because the tools felt culturally grounded, not transplanted."}
  ]};
PROGRAM["__Singapore"]={label:"Singapore",region:"Asia",since:2022,schools:5,educators:130,students:4100,
  impact:{wellbeing:80,attendance:67,teacherRetention:70},programs:["Educator Well-being"],
  stories:[
    {q:"Small nation, big shift in student well-being.",by:"Mei Lin T., Principal",role:"educator",
     text:"A city-state pilot became a model for dense urban schools.",
     full:"Space is limited and schedules are tight, so we integrated micro-practices — ninety-second resets between blocks, silent transitions, staff breathing before assemblies. The model spread to three sister schools because it respected time constraints instead of fighting them."}
  ]};
PROGRAM["__NewYork"]={label:"New York City, USA",region:"Americas",since:2018,schools:24,educators:680,students:28500,
  impact:{wellbeing:79,attendance:62,teacherRetention:70},programs:["Mindful Classrooms","Educator Well-being","Student Voice"],
  stories:[
    {q:"A borough-wide cohort changed our staff culture.",by:"Jordan P., Coach, Brooklyn",role:"educator",
     text:"Cross-school peer visits made best practices spread faster than top-down training.",
     full:"We linked twelve schools in a borough cohort with monthly peer visits. Teachers filmed short practice clips, shared adaptations for large classes, and celebrated wins publicly. Student voice forums ran in parallel so children shaped norms, not just adults."},
    {q:"I run the morning check-in on Mondays.",by:"Zara, age 12, Bronx",role:"student",
     text:"My job is to make sure everyone gets a turn.",
     full:"I'm the Monday check-in leader. I ask a question like 'What's one thing you're looking forward to?' and make sure quiet kids get a turn without pressure. It made me more confident in other classes too."}
  ]};
PROGRAM["__London"]={label:"London, United Kingdom",region:"Europe",since:2024,schools:6,educators:210,students:11800,
  impact:{wellbeing:75,attendance:58,teacherRetention:66},programs:["Educator Well-being","Student Voice"],
  stories:[
    {q:"Secondary schools need different tools.",by:"Oliver W., Lead, Southwark",role:"educator",
     text:"We adapted practices for adolescent skepticism — and it worked.",
     full:"Teenagers saw primary-style rituals as childish until we co-designed them. Student committees renamed practices, chose music, and set privacy rules. Participation jumped when adolescents owned the format instead of inheriting it."}
  ]};
PROGRAM["__Nairobi"]={label:"Nairobi, Kenya",region:"Africa",since:2019,schools:11,educators:290,students:19200,
  impact:{wellbeing:82,attendance:71,teacherRetention:65},programs:["Mindful Classrooms","Rural Outreach"],
  stories:[
    {q:"Urban schools became hubs for rural training.",by:"Grace W., Teacher, Nairobi",role:"educator",
     text:"City educators mentor rural partners — both sides grow.",
     full:"Nairobi partner schools host quarterly exchanges where urban and rural teachers co-teach, observe, and adapt materials for different contexts. City teachers learn humility and practicality; rural teachers gain allies and resources. The network keeps growing without centralizing everything in one office."}
  ]};
PROGRAM["__Mumbai"]={label:"Mumbai, India",region:"Asia",since:2020,schools:14,educators:420,students:31000,
  impact:{wellbeing:78,attendance:72,teacherRetention:64},programs:["Mindful Classrooms","Educator Well-being"],
  stories:[
    {q:"Commute stress was showing up in first period.",by:"Rahul K., Teacher, Mumbai",role:"educator",
     text:"A ten-minute arrival ritual helped students transition from crowded trains to class.",
     full:"Many students arrive after long commutes — overstimulated, hungry, late. We built a ten-minute arrival ritual: hydrate, breathe, optional journal. First-period disruptions fell and teachers recovered instructional time by investing ten minutes upfront."},
    {q:"My friends and I made a worry box.",by:"Isha, age 11, Mumbai",role:"student",
     text:"We drop notes when we don't want to speak out loud.",
     full:"Sometimes you want help but don't want everyone to know. We decorated a worry box and our teacher checks it at lunch. She talks to us privately. It feels safer than raising your hand about something embarrassing."}
  ]};

// Placeholder image generator (offline-safe). Set story.img to a real URL/path to use photos.
// Stories with story.video still default to YouTube thumbnails unless story.img is set.
function ph(label,seed){
  const pals=[["#7ec98f","#3f8a5b"],["#6ea8e0","#2f5f9e"],["#e0b56e","#a5772f"],["#c98fbf","#8a3f7d"],["#8fc9c5","#3f8a84"]];
  const c=pals[Math.abs(seed)%pals.length];
  const svg=`<svg xmlns='http://www.w3.org/2000/svg' width='640' height='360'>
    <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${c[0]}'/><stop offset='1' stop-color='${c[1]}'/></linearGradient></defs>
    <rect width='640' height='360' fill='url(#g)'/>
    <circle cx='520' cy='70' r='120' fill='rgba(255,255,255,0.12)'/><circle cx='90' cy='300' r='90' fill='rgba(255,255,255,0.10)'/>
    <text x='32' y='326' font-family='sans-serif' font-size='24' font-weight='700' fill='rgba(255,255,255,0.92)'>${label}</text>
    <text x='32' y='298' font-family='sans-serif' font-size='12' fill='rgba(255,255,255,0.7)'>PROGRAM PHOTO · replace via story.img</text></svg>`;
  return "data:image/svg+xml;utf8,"+encodeURIComponent(svg);
}
// Extracts an 11-char YouTube video ID from any watch/share/embed URL shape.
function ytIdFromUrl(url){
  if(!url) return null;
  const m=String(url).match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
  return m?m[1]:null;
}
Object.keys(PROGRAM).forEach(k=>{ (PROGRAM[k].stories||[]).forEach((s,i)=>{
  if(!s.role) s.role = i%2 ? "student":"educator";
  if(!s.text) s.text = s.q;
  if(!s.img){
    const yt=ytIdFromUrl(s.video);
    s.img = yt ? `https://img.youtube.com/vi/${yt}/hqdefault.jpg` : ph((PROGRAM[k].label||k)+" · "+(i+1), k.length+i);
  }
  if(!s.cap)  s.cap  = (s.role==="student"?"A student":"An educator")+" at a partner school in "+(PROGRAM[k].label||k);
  if(!s.full) s.full = s.text + (s.text.length > 80
    ? " This is placeholder copy for team review — replace with the real full story, photo, and attribution before launch."
    : " " + s.text + " This is placeholder copy for team review — replace with the real full story before launch.");
}); });
// Shared card shapes — Story Board + Foundation Reach Map use the same shape/tape per story
const STORY_SHAPES = [
  "shape-sticky","shape-polaroid","shape-torn","shape-ticket","shape-postcard","shape-tag",
  "shape-rounded","shape-notebook","shape-circle","shape-arch"
];
const STORY_META = {};
let _storyCatalogIdx = 0;
Object.keys(PROGRAM).forEach(k=>{
  (PROGRAM[k].stories||[]).forEach((s, si)=>{
    STORY_META[k + "\0" + si] = {
      globalIdx: _storyCatalogIdx,
      shape: STORY_SHAPES[_storyCatalogIdx % STORY_SHAPES.length],
      tape: "t" + (_storyCatalogIdx % 4)
    };
    _storyCatalogIdx++;
  });
});
function getStoryMeta(countryKey, storyIdx){
  return STORY_META[countryKey + "\0" + storyIdx] || { globalIdx:0, shape:"shape-notebook", tape:"t0" };
}
// id -> program key
const isoToKey={}; Object.keys(PROGRAM).forEach(k=>{ if(PROGRAM[k].iso) isoToKey[PROGRAM[k].iso]=k; });
