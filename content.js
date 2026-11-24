/*
  ALL THE WORDS ON THE SITE LIVE HERE.
  Change anything in this file, save, refresh the page.
  Photos and renders: drop files into the "images" folder and point to them,
  e.g. photo: "images/me.jpg".
*/
window.SITE = {
  // ---------- Top of the page ----------
  name: "Hamdan Zahid", // first word is ink, the rest is blue (like MyLaTeX)
  role: "Mechanical Engineering & Business student",
  location: "RMIT University · Melbourne, Australia",
  summary:
    "Mechanical engineering and business student at RMIT, with internship experience in industrial compressed-air systems and hands-on projects in design, fabrication and testing.",

  // ---------- About ----------
  about: {
    kicker: "Engineer in training, with a business degree on the side.",
    photo: "", // e.g. "images/me.jpg"
    caption: "Hamdan Zahid, Melbourne",
    paragraphs: [
      "I'm studying Mechanical Engineering (Honours) and Business at RMIT in Melbourne.",
      "On the engineering side I design, build and test things: an aluminium wing-box, a rock-collecting robot, compressor parts in SolidWorks. On the business side I've led a student consulting team and written a sponsorship prospectus. I like work where both halves show up.",
    ],
    facts: [
      { label: "Degree", lines: ["B.Eng (Mechanical)(Honours) / B.Business", "RMIT University · 2024 — expected 2028"] },
      { label: "Eng minor", lines: ["Intelligent Manufacturing Technologies"] },
      { label: "Bus major", lines: ["Logistics & Supply Chain, with a minor in Marketing"] },
      { label: "Languages", lines: ["English, Urdu, Punjabi, Hindi"] },
    ],
  },

  // ---------- Skills & tools ----------
  // icon: a file in images/tools.  No icon? Use mono (two letters) and a colour:
  // "blue", "orange", "teal", "purple" or "ink".
  skills: {
    note: "What I reach for to design, simulate, build and write up.",
    items: [
      { name: "SolidWorks", icon: "images/tools/solidworks.svg" },
      { name: "MATLAB", icon: "images/tools/matlab.svg" },
      { name: "LaTeX", icon: "images/tools/latex.svg" },
      { name: "Excel", icon: "images/tools/excel.svg" },
      { name: "Creo Parametric", mono: "Cr", color: "teal" },
      { name: "ANSYS Mechanical", mono: "An", color: "orange" },
      { name: "Arduino", mono: "Ar", color: "blue" },
      { name: "3D printing", mono: "3D", color: "purple" },
    ],
  },

  // ---------- Work (shown as tabs: pick a role on the left) ----------
  // short: the label on the tab.  mono + color: the little badge beside it
  // ("blue", "orange", "teal", "purple" or "ink").  The length of each role
  // (e.g. "2 mos") is worked out from the dates automatically.
  work: [
    {
      short: "BOGE",
      org: "BOGE Compressors Australia",
      role: "Student Engineering Intern",
      mono: "BG",
      color: "orange",
      dates: "Jun 2025 — Jul 2025",
      place: "Pakenham, Melbourne",
      summary: "Tenders, system sizing and CAD at an industrial compressed-air company.",
      points: [
        "Analysed compressed-air systems and compressor machinery across BOGE's product range, from critical components to operating principles.",
        "Helped build tailored system proposals from client tenders, sizing compressor configurations against pressure and flow requirements.",
        "Modelled a pre-suction filter assembly and a compressor rotor in SolidWorks to in-house specifications.",
        "Worked with the marketing team to turn technical detail into LinkedIn posts.",
      ],
      tags: ["SolidWorks", "Tender analysis", "System sizing", "Technical writing"],
    },
    {
      short: "Practera",
      org: "Practera",
      role: "Student Project Consultant",
      mono: "Pr",
      color: "purple",
      dates: "Dec 2025 — Jan 2026",
      place: "Remote",
      summary: "A two-week consulting sprint: a social media launch strategy for the non-profit AIGA.",
      points: [
        "Led a team of six student consultants to deliver inside a two-week deadline.",
        "Built a three-platform market entry strategy to launch AIGA on LinkedIn, Instagram and TikTok from zero, based on audience and content consumption patterns.",
        "Designed platform-native campaigns: content themes, video structures and repeatable content workflows.",
      ],
      tags: ["Team leadership", "Market entry", "Content strategy"],
    },
    {
      short: "MAEA",
      org: "Mechanical and Automotive Engineering Association, RMIT",
      role: "Industry Relations Representative",
      mono: "MA",
      color: "teal",
      dates: "Jul 2026 — Present",
      place: "RMIT, Melbourne",
      summary: "I sit on the club's General Committee and look after industry sponsorship.",
      points: [
        "Wrote the club's sponsorship prospectus and lead its ongoing outreach to industry.",
        "Work with industry partners on sponsorship and event participation, and help run club events.",
      ],
      tags: ["Sponsorship", "Industry outreach", "Events"],
    },
    {
      short: "RUASRT",
      org: "RMIT Uncrewed Aircraft Systems Research Team",
      role: "Research Team Member",
      mono: "UA",
      color: "blue",
      dates: "Apr 2026 — Present",
      place: "RMIT, Melbourne",
      summary: "Flight research alongside my degree, and a lot more CAD practice.",
      points: [
        "Contribute to research projects including quadcopter flight tests and building a remote-controlled aircraft.",
        "Building CAD proficiency through the team's targeted workshops.",
      ],
      tags: ["CAD", "Flight testing", "Research"],
    },
    {
      short: "Bunnings",
      org: "Bunnings",
      role: "Customer Service Team Member",
      mono: "Bu",
      color: "ink",
      dates: "Sep 2026 — Present",
      place: "Melbourne",
      summary: "Helping customers find what they need and keeping the store stocked, safe and tidy.",
      points: [
        "Help customers with product enquiries and locating items across the store.",
        "Support stock replenishment and organise shelves and displays, keeping the store safe and clean.",
      ],
      tags: ["Customer service", "Stock management", "Workplace safety"],
    },
  ],

  // ---------- Projects (shown as case studies) ----------
  // The left column lists dates, context, role and tools. Leave any of them "" to hide it.
  // image: a real photo, CAD render or screenshot, e.g. "images/wingbox.jpg".
  //        Leave "" until you have one; the project still looks complete without it.
  // fit: "cover" fills the frame (photos), "contain" shows the whole image on white
  //      (screenshots, drawings, renders).
  projects: [
    {
      title: "Wing-box design and fabrication",
      dates: "Mar – Jun 2026",
      context: "RMIT University",
      role: "Design and fabrication lead",
      tools: ["SolidWorks", "MATLAB", "Excel"],
      summary: "A lightweight aluminium wing-box, taken from design through fabrication to structural testing.",
      image: "",
      fit: "cover",
      points: [
        "Optimised the cross-sectional geometry to maximise strength-to-weight ratio under the specified load conditions.",
        "Ran tensile and three-point bending tests, supported by a SolidWorks model of the assembly.",
        "Produced manufacturing drawings that account for sheet-metal bend allowances and dimensional constraints.",
      ],
    },
    {
      title: "Autonomous rock-collecting robot",
      dates: "Jul – Nov 2024",
      context: "Warman design and build project",
      role: "Design and fabrication lead",
      tools: ["SolidWorks", "Arduino", "3D printing", "Soldering"],
      summary: "An autonomous robot that collects, secures and deposits a payload, built from concept to working prototype.",
      image: "",
      fit: "cover",
      points: [
        "Built the drive and control system around an Arduino Uno, an Adafruit microcontroller and four 12V 99:1 Pololu gearmotors.",
        "Iterated on custom 3D-printed motor mounts for the servo actuators and the scooper arms that handle the payload.",
      ],
    },
    {
      title: "MyLaTeX",
      dates: "",
      context: "Personal project",
      role: "Built and maintain",
      tools: ["LaTeX", "Python", "GitHub Pages"],
      summary: "A personal library of LaTeX snippets, preambles, templates and icons, published as a searchable website.",
      image: "images/renders/aligned-equations.svg",
      fit: "contain",
      alt: "A typeset page of aligned equations rendered from one of the library's snippets",
      points: [
        "Every entry is a complete test file with a rendered preview, so each one is known to compile.",
        "Python scripts scaffold new entries and rebuild the site; pushing to GitHub renders the previews and redeploys.",
      ],
      link: { label: "Visit the site", url: "https://hzled27723.github.io/LaTeX-Website/" },
    },
  ],

  // ---------- Volunteering ----------
  volunteering: [
    {
      title: "Open Day Crew Member",
      org: "RMIT University",
      dates: "Aug 2026 – Present",
      points: ["Answer course selection questions from prospective students and families and direct attendees around the City Campus."],
    },
    {
      title: "Start-line Assistant",
      org: "Sole Motive",
      dates: "Jul 2026 – Present",
      points: ["Point of contact for participants and spectators on race routes and wave starts; help with start-line signage and pack-down."],
    },
  ],

  // ---------- Contact ----------
  contact: {
    text: "I'm open to internship opportunities and happy to talk through any of the work above.",
    email: "hamdan3809@gmail.com",
    links: [{ label: "LinkedIn", url: "https://www.linkedin.com/in/hamdanzahid/" }],
  },
};
