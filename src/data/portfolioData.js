import portrait from "../assets/images/portrait-professional.jpg";

export const siteUrl = "https://daniel.kavangi.co.ke";

export const site = {
  title: "Daniel Mwendwa Kavangi | Data & Risk Analyst",
  shortTitle: "Daniel Mwendwa Kavangi",
  shareTitle: "Meet Daniel Mwendwa Kavangi",
  description:
    "Daniel Mwendwa Kavangi is an actuarial science candidate and data & risk analyst in Nairobi, using Python, R and Excel for insurance, banking and fintech decisions.",
};

export const personalInfo = {
  name: "Daniel Mwendwa Kavangi",
  firstName: "Daniel",
  middleName: "Mwendwa",
  lastName: "Kavangi",
  shortName: "Daniel Kavangi",
  initials: "DK",
  role: "Data & Risk Analyst",
  headline: "Actuarial science · data & risk analysis",
  location: "Nairobi, Kenya",
  email: "danielmwendwa494@gmail.com",
  phone: "+254715417220",
  phoneDisplay: "+254 715 417 220",
  whatsapp: "@riskraptor",
  whatsappUser: "riskraptor",
  whatsappUrl: "https://wa.me/254715417220",
  photo: portrait,
  resumeUrl: "/Daniel-Mwendwa-Kavangi-Resume.pdf",
  resumeFileName: "Daniel-Mwendwa-Kavangi-Resume.pdf",
  availability: "Open to actuarial, insurance, banking, data analysis and fintech roles",
  summary:
    "I use Python, R and Excel to analyse data, quantify risk and turn financial information into decisions. I am looking for analyst roles in actuarial, insurance, banking, data and fintech teams.",
  bio: "I am Daniel Mwendwa Kavangi, based in Nairobi. I am an actuarial science candidate at Chuka University, working with data, finance and technology: cleaning datasets, building models, tracking variance and turning results into reports people can use.",
  seeking:
    "I want to join a team in actuarial analysis, insurance, banking, data analysis or fintech, and contribute from day one.",
  university: "Chuka University",
  universityUrl: "https://www.chuka.ac.ke/",
};

export const socials = [
  {
    id: "email",
    label: "Email",
    action: "Write an email",
    value: personalInfo.email,
    href: `mailto:${personalInfo.email}`,
    external: false,
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    action: "Chat on WhatsApp",
    value: personalInfo.whatsapp,
    href: personalInfo.whatsappUrl,
    callHref: `tel:${personalInfo.phone}`,
    callLabel: personalInfo.phoneDisplay,
    external: true,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    action: "Open profile",
    value: "",
    href: "https://www.linkedin.com/in/daniel-mwendwa-kavangi",
    external: true,
  },
  {
    id: "github",
    label: "GitHub",
    action: "View GitHub",
    value: "",
    href: "https://github.com/DANIELMWENDWA9451",
    external: true,
  },
];

export const languages = [
  { name: "English", level: "Fluent" },
  { name: "Kiswahili", level: "Fluent" },
];

export const navLinks = [
  { path: "/", label: "Home" },
  { path: "/about", label: "About" },
  { path: "/work", label: "Selected work" },
  { path: "/experience", label: "Experience" },
  { path: "/education", label: "Education" },
  { path: "/contact", label: "Contact" },
];

export const pageMeta = {
  "/": {
    title: site.title,
    description: site.description,
    shareTitle: "Daniel Mwendwa Kavangi | Data & Risk Analyst",
    shareDescription: site.description,
    socialImage: "social-home.png",
  },
  "/about": {
    title: "About | Daniel Mwendwa Kavangi",
    description:
      "Actuarial science, data and risk analysis by Daniel Mwendwa Kavangi. Python, R and Excel for insurance, banking and fintech.",
    shareTitle: "About Daniel Mwendwa Kavangi | Data & Risk Analyst",
    shareDescription: "Actuarial science, data and risk analysis for insurance, banking and fintech decisions.",
    socialImage: "social-about.png",
  },
  "/experience": {
    title: "Experience | Daniel Mwendwa Kavangi",
    description:
      "Data Visualization Intern at Excelerate and Budget Assistant at Machakos County Assembly.",
    shareTitle: "Experience | Daniel Mwendwa Kavangi",
    shareDescription: "Data visualisation, budget analysis and financial reporting experience using Python, R, Excel and VBA.",
    socialImage: "social-experience.png",
  },
  "/work": {
    title: "Selected work | Daniel Mwendwa Kavangi",
    description:
      "Team-led actuarial research: stochastic modelling of retirement adequacy for informal-sector workers in Chuka Municipality.",
    shareTitle: "Selected Work | Retirement Adequacy Research",
    shareDescription: "A team-led actuarial study using 3,000 financial-diary entries and 10,000 Monte Carlo iterations.",
    socialImage: "social-work.png",
  },
  "/education": {
    title: "Education | Daniel Mwendwa Kavangi",
    description: "BSc Actuarial Science, Chuka University, professional certificates and referees.",
    shareTitle: "Education & Credentials | Daniel Mwendwa Kavangi",
    shareDescription: "Actuarial science education, quantitative training and selected professional certificates.",
    socialImage: "social-education.png",
  },
  "/contact": {
    title: "Contact | Daniel Mwendwa Kavangi",
    description: "Contact Daniel Mwendwa Kavangi about actuarial, insurance, banking, data or fintech roles.",
    shareTitle: "Contact Daniel Mwendwa Kavangi",
    shareDescription: "Get in touch about actuarial, insurance, banking, data-analysis and fintech opportunities.",
    socialImage: "social-contact.png",
  },
  "/404": {
    title: "Page not found | Daniel Mwendwa Kavangi",
    description: "This page is not on Daniel Mwendwa Kavangi's site.",
  },
};

export const referees = [
  {
    id: "misati",
    name: "Edwin Misati",
    title: "Lecturer, Actuarial Science",
    organisation: "Chuka University",
    email: "emisati@chuka.ac.ke",
    phone: "+254724945510",
    phoneDisplay: "+254 724 945 510",
  },
  {
    id: "magero",
    name: "Elizabeth Magero",
    title: "Lecturer and Section Head, Actuarial Science",
    organisation: "Chuka University",
    email: "emagero@chuka.ac.ke",
    phone: "+254726872725",
    phoneDisplay: "+254 726 872 725",
  },
];

export const education = [
  {
    id: "chuka",
    degree: "Bachelor of Science in Actuarial Science",
    credential: "BSc",
    institution: "Chuka University",
    period: "2022 to 2026",
    href: "https://www.chuka.ac.ke/",
  },
];

export const certifications = [
  {
    id: "r-google",
    title: "Data Analysis with R Programming",
    issuer: "Google",
    year: "2023",
    href: "https://www.coursera.org/account/accomplishments/records/VYMMU9UKUQFQ",
  },
  {
    id: "excel-coursera",
    title: "Introduction to Microsoft Excel",
    issuer: "Coursera",
    year: "2023",
    href: "https://www.coursera.org/account/accomplishments/records/GAFVFN3VSFEH",
  },
  {
    id: "tsf-google",
    title: "Technical Support Fundamentals",
    issuer: "Google",
    year: "2023",
    href: "https://www.coursera.org/account/accomplishments/verify/DK43HJMGD3MM",
  },
  {
    id: "java-linkedin",
    title: "Java (Object-Oriented Programming)",
    issuer: "LinkedIn Learning",
    year: "2022",
    href: "https://www.linkedin.com/learning/certificates/6f9b25d4e7d83b9aed48ba6025de4879572921381d517710f3f570cbc2bed3c7",
  },
];

export const experience = [
  {
    id: "excelerate",
    title: "Data Visualization Intern",
    company: "Excelerate",
    location: "Remote",
    period: "Nov 2025 to Dec 2025",
    summary:
      "Built interactive charts and dashboards in Python, R and Excel, cleaned datasets, and presented findings through structured visual reports.",
    highlights: [
      "Created interactive charts and dashboards using Python, Excel and R.",
      "Cleaned and analyzed datasets to support visual reporting.",
      "Presented insights through structured data visualizations.",
    ],
    tools: ["Python", "R", "Excel", "Data visualization"],
  },
  {
    id: "machakos",
    title: "Budget Assistant",
    company: "Machakos County Assembly",
    location: "Machakos, Kenya",
    period: "May 2025 to Aug 2025",
    summary:
      "Supported departmental budget preparation, expenditure tracking and audit documentation using Excel and VBA.",
    highlights: [
      "Assisted in preparation and analysis of departmental budgets using Excel and VBA macros.",
      "Supported expenditure tracking and variance analysis.",
      "Contributed to financial reports and documentation for audit purposes.",
    ],
    tools: ["Excel", "VBA"],
  },
];

export const skills = {
  analysis: [
    "Data analysis",
    "Statistical analysis",
    "Quantitative analysis",
    "Predictive modelling",
    "Financial mathematics",
    "Quantitative risk analysis",
    "Stochastic modelling",
    "Data visualisation",
  ],
  tools: ["Python", "R", "Microsoft Excel", "VBA"],
  domains: ["Actuarial analysis", "Insurance", "Banking and finance", "Fintech", "Data analysis"],
  professional: [
    "Analytical thinking and problem-solving",
    "Time management and organization",
    "Professional communication",
    "Team collaboration",
  ],
};

export const skillMeta = {
  analysis: {
    label: "Analysis",
    blurb: "The quantitative core I bring to every role.",
  },
  tools: {
    label: "Tools",
    blurb: "Python, R and Excel for analysis, models and reports.",
  },
  domains: {
    label: "Where I fit",
    blurb: "Teams I am ready to join.",
  },
  professional: {
    label: "Professional",
    blurb: "How I work with colleagues and stakeholders.",
  },
};

export const focusAreas = [
  "Actuarial analysis",
  "Insurance",
  "Data analysis",
  "Banking and finance",
  "Fintech",
  "Data visualisation",
];

export const toolkit = ["Python", "R", "Microsoft Excel", "VBA"];

export const fitAreas = [
  {
    title: "Insurance",
    text: "Actuarial training in financial mathematics and risk analysis, ready for insurance teams.",
  },
  {
    title: "Banking",
    text: "Budget analysis, variance tracking and financial reporting that stands up to review.",
  },
  {
    title: "Data analysis",
    text: "Python, R and Excel to clean data, find the signal and present it clearly.",
  },
  {
    title: "Fintech",
    text: "I care about technology in finance, and I want to put quantitative work into products, credit, insurance and operations.",
  },
];

export const researchProject = {
  label: "Team-led actuarial research · 2026",
  title: "Can flexible micro-pensions deliver retirement adequacy?",
  shortTitle: "Retirement adequacy under volatile income",
  summary:
    "I led a six-member undergraduate research team that used financial diaries and actuarial simulation to examine retirement adequacy for informal-sector workers in Chuka Municipality.",
  context:
    "For workers with volatile daily income, a fixed monthly contribution can be unrealistic. We tested what happens when retirement saving follows real surplus income instead.",
  scope: [
    { value: "100", label: "participants" },
    { value: "3,000", label: "participant-day entries" },
    { value: "10,000", label: "Monte Carlo iterations" },
    { value: "30 years", label: "projection horizon" },
  ],
  methods: [
    "30-day financial diaries across boda-boda operators, market vendors and technical artisans",
    "Descriptive analysis of surplus income and zero-surplus days",
    "Goodness-of-fit testing with a bootstrap contingency approach",
    "Discrete-time Monte Carlo projection of retirement funds and replacement rates",
  ],
  strata: [
    {
      id: "boda",
      name: "Boda-boda operators",
      meanSurplus: 250.74,
      positiveDaySurplus: 384.59,
      zeroDays: 34.8,
      replacementRate: 14.12,
      requiredRate: 29,
    },
    {
      id: "vendor",
      name: "Market vendors",
      meanSurplus: 298.23,
      positiveDaySurplus: 522.57,
      zeroDays: 42.9,
      replacementRate: 17.71,
      requiredRate: 23,
    },
    {
      id: "artisan",
      name: "Technical artisans",
      meanSurplus: 324.93,
      positiveDaySurplus: 731.1,
      zeroDays: 55.6,
      replacementRate: 20.77,
      requiredRate: 20,
    },
  ],
  finding:
    "At a 10% contribution rate, every group had a 0% simulated probability of reaching the 40% replacement-rate benchmark. The model identified minimum contribution rates of 29%, 23% and 20% for a 75% adequacy-probability target, showing why one-size-fits-all pension design fails.",
  recommendation:
    "Design mobile, income-aware micro-pensions with occupation-calibrated contributions, zero-surplus protection and matching mechanisms rather than fixed monthly deductions.",
  note:
    "Figures are aggregate outputs from the attached research report and financial-diary analysis. No participant-level diary data, personal identifiers or research-team registration details are published here.",
};
