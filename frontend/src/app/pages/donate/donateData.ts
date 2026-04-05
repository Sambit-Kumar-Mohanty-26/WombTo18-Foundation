export interface ProgramOption {
  id: string;
  name: string;
  category: string;
  description: string;
  costPerUnit: number;
  unit: string;
  icon: string;
  minQty?: number;
  hasSchoolDropdown?: boolean;
}

export const PROGRAM_CATEGORIES = [
  "Child Health & Wellness",
  "Education & Development",
  "Climate & Environment",
  "Community Empowerment",
  "Technology & Innovation",
  "Emergency & Safety",
] as const;

export const PROGRAMS: ProgramOption[] = [
  // Child Health & Wellness
  { id: "p1", name: "Full Child Health Screening", category: "Child Health & Wellness", description: "Complete annual health check-up for one child", costPerUnit: 500, unit: "child", icon: "🩺" },
  { id: "p2", name: "Dental Check-up Camp", category: "Child Health & Wellness", description: "Dental screening and awareness for students", costPerUnit: 300, unit: "child", icon: "🦷" },
  { id: "p3", name: "Eye Check-up & Glasses", category: "Child Health & Wellness", description: "Vision screening and free spectacles", costPerUnit: 750, unit: "child", icon: "👓" },
  { id: "p4", name: "Nutrition Support Program", category: "Child Health & Wellness", description: "Monthly nutrition supplement for malnourished children", costPerUnit: 1200, unit: "child/month", icon: "🥗" },
  { id: "p5", name: "Mental Wellness Module", category: "Child Health & Wellness", description: "SEL and mental health sessions for a class", costPerUnit: 2500, unit: "class", icon: "🧠" },
  { id: "p6", name: "Vaccination Awareness Drive", category: "Child Health & Wellness", description: "Immunisation awareness camp at school", costPerUnit: 5000, unit: "school", icon: "💉", hasSchoolDropdown: true },

  // Education & Development
  { id: "p7", name: "School Adoption Program", category: "Education & Development", description: "Full year sponsorship of a school", costPerUnit: 150000, unit: "school/year", icon: "🏫", hasSchoolDropdown: true },
  { id: "p8", name: "Student Scholarship Fund", category: "Education & Development", description: "Annual scholarship for one underprivileged student", costPerUnit: 12000, unit: "student/year", icon: "🎓" },
  { id: "p9", name: "Digital Classroom Setup", category: "Education & Development", description: "Smart classroom setup for a school", costPerUnit: 75000, unit: "classroom", icon: "💻", hasSchoolDropdown: true },
  { id: "p10", name: "Library Development", category: "Education & Development", description: "Setup/upgrade school library", costPerUnit: 25000, unit: "library", icon: "📚", hasSchoolDropdown: true },
  { id: "p11", name: "STEM Learning Kit", category: "Education & Development", description: "Science & math kits for hands-on learning", costPerUnit: 3500, unit: "kit", icon: "🔬" },
  { id: "p12", name: "Teacher Training Workshop", category: "Education & Development", description: "Professional development for teachers", costPerUnit: 8000, unit: "teacher", icon: "👩‍🏫" },

  // Climate & Environment
  { id: "p13", name: "One Child One Tree", category: "Climate & Environment", description: "Plant & maintain a tree per child enrolled", costPerUnit: 250, unit: "tree", icon: "🌳" },
  { id: "p14", name: "School Green Campus", category: "Climate & Environment", description: "Full campus greening program", costPerUnit: 50000, unit: "school", icon: "🌿", hasSchoolDropdown: true },
  { id: "p15", name: "Rain Water Harvesting", category: "Climate & Environment", description: "Install rainwater harvesting at school", costPerUnit: 35000, unit: "unit", icon: "💧", hasSchoolDropdown: true },
  { id: "p16", name: "Solar Panel for School", category: "Climate & Environment", description: "Solar energy setup for a rural school", costPerUnit: 100000, unit: "school", icon: "☀️", hasSchoolDropdown: true },
  { id: "p17", name: "Waste Management Program", category: "Climate & Environment", description: "Waste segregation and composting training", costPerUnit: 15000, unit: "school", icon: "♻️", hasSchoolDropdown: true },
  { id: "p18", name: "Carbon Neutral Cohort", category: "Climate & Environment", description: "Offset carbon footprint of child cohort", costPerUnit: 500, unit: "child", icon: "🌍" },

  // Community Empowerment
  { id: "p19", name: "Parent Awareness Program", category: "Community Empowerment", description: "Health & education awareness for parents", costPerUnit: 5000, unit: "session", icon: "👨‍👩‍👧" },
  { id: "p20", name: "Women Health Camp", category: "Community Empowerment", description: "Maternal health check-up camp", costPerUnit: 10000, unit: "camp", icon: "🤱" },
  { id: "p21", name: "Community First Aid Training", category: "Community Empowerment", description: "First aid certification for community members", costPerUnit: 3000, unit: "person", icon: "🏥" },
  { id: "p22", name: "Youth Leadership Program", category: "Community Empowerment", description: "Leadership training for adolescents", costPerUnit: 5000, unit: "student", icon: "🌟" },
  { id: "p23", name: "Menstrual Hygiene Initiative", category: "Community Empowerment", description: "Pad distribution and awareness for girls", costPerUnit: 200, unit: "girl/month", icon: "🎀" },
  { id: "p24", name: "Skill Development Workshop", category: "Community Empowerment", description: "Vocational skills for school dropouts", costPerUnit: 7500, unit: "student", icon: "🛠️" },

  // Technology & Innovation
  { id: "p25", name: "Student Health Dashboard", category: "Technology & Innovation", description: "Digital health tracking platform per school", costPerUnit: 20000, unit: "school", icon: "📊", hasSchoolDropdown: true },
  { id: "p26", name: "AI Health Analytics", category: "Technology & Innovation", description: "AI-powered health trend analysis", costPerUnit: 50000, unit: "district", icon: "🤖" },
  { id: "p27", name: "Mobile App Development", category: "Technology & Innovation", description: "Regional language health app development", costPerUnit: 100000, unit: "language", icon: "📱" },
  { id: "p28", name: "Data Infrastructure", category: "Technology & Innovation", description: "Cloud infrastructure for health records", costPerUnit: 30000, unit: "quarter", icon: "☁️" },

  // Emergency & Safety
  { id: "p29", name: "Emergency Drill Training", category: "Emergency & Safety", description: "Fire & earthquake drill at school", costPerUnit: 8000, unit: "school", icon: "🚨", hasSchoolDropdown: true },
  { id: "p30", name: "First Aid Kit Distribution", category: "Emergency & Safety", description: "Fully stocked first aid kit for school", costPerUnit: 2500, unit: "kit", icon: "🧰", hasSchoolDropdown: true },
  { id: "p31", name: "Safety Infrastructure", category: "Emergency & Safety", description: "CCTV and safety equipment for school", costPerUnit: 45000, unit: "school", icon: "📷", hasSchoolDropdown: true },
  { id: "p32", name: "Disaster Preparedness Program", category: "Emergency & Safety", description: "Community disaster readiness training", costPerUnit: 12000, unit: "community", icon: "🛡️" },
];

export const SCHOOLS = [
  "Govt. Primary School, Bhubaneswar",
  "Kendriya Vidyalaya, Cuttack",
  "Municipal School No. 3, Puri",
  "Gram Panchayat School, Jajpur",
  "Tribal Welfare School, Koraput",
  "DAV Public School, Rourkela",
  "Govt. Girls' High School, Sambalpur",
  "Zilla Parishad School, Berhampur",
  "Primary School, Jharsuguda",
  "Adarsha Vidyalaya, Angul",
  "Model School, Balasore",
  "Block Grant School, Dhenkanal",
  "Govt. UP School, Mayurbhanj",
  "Mission School, Keonjhar",
  "Govt. High School, Sundargarh",
];

export const VOLUNTEER_SKILLS = [
  "Healthcare / Medical",
  "Teaching / Education",
  "Technology / Web Dev",
  "Content Writing / Design",
  "Data Analysis / Research",
  "Event Management",
  "Counselling / Mental Health",
  "First Aid / Emergency Response",
  "Environmental / Sustainability",
  "Translation / Regional Languages",
  "Photography / Videography",
  "Social Media / Marketing",
];

export const IMPACT_STATS = [
  { value: "5,200+", label: "Children Registered", icon: "👶", color: "#FF9900" },
  { value: "4,300+", label: "Trees Planted", icon: "🌳", color: "#1D6E3F" },
  { value: "120+", label: "Schools Onboarded", icon: "🏫", color: "#00AEEF" },
  { value: "₹7.7L", label: "Raised This Month", icon: "💰", color: "#FF9900" },
  { value: "32", label: "Active Programs", icon: "📋", color: "#1D6E3F" },
  { value: "100%", label: "Transparent", icon: "🔍", color: "#00AEEF" },
];

export const RECENT_DONORS = [
  { name: "Sambit Kumar Mohanty", amount: "₹1K", timeAgo: "18 days ago", initial: "S", color: "#1D6E3F" },
  { name: "Sambit Kumar Mohanty", amount: "₹5K", timeAgo: "19 days ago", initial: "S", color: "#9333ea" },
  { name: "Sambit Mohanty", amount: "₹5K", timeAgo: "21 days ago", initial: "S", color: "#FF9900" },
];

export const WHY_SUPPORT_ITEMS = [
  { text: "Every contribution supports child health, education, and climate action.", icon: "💚" },
  { text: "One child registered = one tree planted.", icon: "🌳" },
  { text: "100% transparent. Every rupee is accounted for.", icon: "🤝" },
];

export const MONTHLY_GOAL = { raised: 77500, target: 500000 };
