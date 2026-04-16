export const impactPageContent = {
  hero: {
    badge: 'Projecting the Future',
    titlePrefix: 'A Roadmap to',
    titleAccent: 'Transformative Scale',
    subtitle:
      'Our vision is massive, and we are laying down the exact financial and structural framework needed to achieve it. Here is our rigorous blueprint for long-term growth and accountability.',
    primaryCta: 'Strategic Plan 2026-2030',
    primaryToastTitle: 'Download started',
    primaryToastDescription: 'Downloading Strategic Plan 2026-2030',
    secondaryCta: 'Financial Blueprint',
    secondaryToastTitle: 'Download started',
    secondaryToastDescription: 'Downloading Financial Blueprint',
  },
  sdg: {
    title: 'Aligned with Global Goals',
    subtitle:
      'Our grassroots execution directly contributes to three core United Nations Sustainable Development Goals, driving systemic change.',
    cards: [
      {
        id: '3',
        title: 'Good Health & Well-being',
        color: '#4C9F38',
        image: '/images/site-assets/SDG3.png',
        desc:
          'Ensuring healthy lives and promoting well-being for all ages through practical, community-led interventions.',
        points: [
          'Children vaccinated on schedule',
          'Maternal health reminders delivered',
          'Mental wellness sessions conducted',
          'Emergency preparedness trainings run',
          'Health screenings completed in schools',
        ],
      },
      {
        id: '4',
        title: 'Quality Education',
        color: '#C5192D',
        image: '/images/site-assets/SDG-4.png',
        desc:
          'Strengthening learning environments so children are healthy, supported, and ready to learn.',
        points: [
          'Schools operating as Health Promoting Schools',
          'Teachers trained in wellness delivery',
          'Student wellness reports generated',
          'NEP 2020-aligned modules deployed',
          'Parent education sessions delivered',
        ],
      },
      {
        id: '13',
        title: 'Climate Action',
        color: '#3F7E44',
        image: '/images/site-assets/SDG-13.png',
        desc:
          'Embedding environmental stewardship into child and community health through measurable green action.',
        points: [
          'Geo-tagged trees planted and maintained',
          'Carbon offset (kg CO2) tracked per cohort',
          'Eco-learning sessions in partner schools',
          'Green Cohort dashboard entries active',
          'Children enrolled in Carbon-Neutral Cohort',
        ],
      },
    ],
  },
  reporting: {
    title: 'Reporting Calendar',
    subtitle: 'Transparent, verifiable impact published on schedule, every quarter.',
    items: [
      {
        quarter: 'Q1',
        report: 'Q1 Impact Report',
        month: 'APR',
        day: '30',
        color: '#1D6E3F',
        lightBg: 'rgba(29,110,63,0.07)',
        contents:
          'Programme delivery, fund utilisation, children reached, schools served, trees planted from January to March.',
        side: 'left' as const,
      },
      {
        quarter: 'Q2',
        report: 'Q2 Impact Report',
        month: 'JUL',
        day: '31',
        color: '#F29F05',
        lightBg: 'rgba(242,159,5,0.07)',
        contents: 'Same metrics for April to June. Annual Report also published in July.',
        side: 'right' as const,
      },
      {
        quarter: 'Q3',
        report: 'Q3 Impact Report',
        month: 'OCT',
        day: '31',
        color: '#0284c7',
        lightBg: 'rgba(2,132,199,0.07)',
        contents: 'July to September metrics. Mid-year programme performance review.',
        side: 'left' as const,
      },
      {
        quarter: 'Q4',
        report: 'Q4 Impact Report',
        month: 'JAN',
        day: '31',
        color: '#8b5cf6',
        lightBg: 'rgba(139,92,246,0.07)',
        contents: 'October to December. Full-year preview ahead of Annual Report.',
        side: 'right' as const,
      },
      {
        quarter: 'Annual',
        report: 'Annual Report',
        month: 'JUL',
        day: '31',
        color: '#1D6E3F',
        lightBg: 'rgba(29,110,63,0.07)',
        contents:
          'Audited accounts, programme outcomes versus targets, governance report, donor acknowledgements, and next-year plan.',
        side: 'left' as const,
        extraLabel: 'For prior FY',
      },
    ],
  },
  metrics: [
    { label: 'Funding Target (2030)', change: 'Infrastructure Goal' },
    { label: 'Projected Cost-Ratio', change: 'Direct to programs' },
    { label: 'Children (2030 Goal)', change: 'Expansive Reach' },
    { label: 'Target Cost per Child', change: 'Maximum efficiency' },
  ],
  charts: {
    fundUtilizationTitle: 'Capped Implementation Costs',
    fundUtilizationBadge: 'Committed limits',
    fundUtilization: [
      'Direct Programs',
      'Field Healthcare',
      'School Infrastructure',
      'Administration Cap',
      'Fundraising Core',
    ],
    expenseBreakdownTitle: 'Strict Budgetary Boundaries',
    expenseBreakdown: [
      'Field Salaries & Medical Staff',
      'Program Delivery Materials',
      'Local Field Operations',
      'Anganwadi & School Infra',
      'Tech & Tracking Systems',
      'Rural Travel & Logistics',
      'Contingency Fund',
    ],
    programSpendTitle: 'Phased Scaling Allocation (INR Cr)',
    programSpendLegendBaseline: 'Baseline Foundation',
    programSpendLegendTarget: 'Full Scale Objective',
    programSpendPrograms: ['Prenatal', 'Early Child', /* 'Nutrition', */ 'Education', 'Youth', 'Protection'],
    growthTitle: '5-Year Exponential Output Scaling',
    growthSeries: {
      children: 'Children',
      mothers: 'Mothers',
      communities: 'Communities',
    },
  },
  programProgress: {
    title: 'Program Outreach Framework',
    subtitle:
      'Our financial commitments mapped against exact outreach targets to guarantee efficiency.',
    seedPhase: 'Seed Phase - Preparing to scale',
    items: [
      { program: 'Prenatal & Maternal Care', beneficiaries: 'Target: Scaling phased' },
      { program: 'Early Childhood Development', beneficiaries: 'Target: Scaling phased' },
      // { program: 'Nutrition Programs', beneficiaries: 'Target: Scaling phased' },
      { program: 'Education Support', beneficiaries: 'Target: Scaling phased' },
      { program: 'Youth Empowerment', beneficiaries: 'Target: Scaling phased' },
      { program: 'Child Protection', beneficiaries: 'Target: Scaling phased' },
    ],
  },
  outcomes: {
    title: 'Strategic Key Performance Indicators (KPIs)',
    subtitle: 'The strict milestones we will hold ourselves to, with zero compromise.',
    items: [
      {
        metric: 'Infant Mortality Target',
        detail: 'Aiming for 50% reduction in partner districts by 2030',
      },
      {
        metric: 'Universal School Enrollment',
        detail: 'Targeting 100% enrollment for program cohort',
      },
      {
        metric: 'Zero Malnutrition Goal',
        detail: 'Setting benchmark at 100% children meeting healthy growth points',
      },
      {
        metric: 'Complete Immunization',
        detail: 'Total coverage planned for all infants in registry',
      },
      {
        metric: 'Youth Employability',
        detail: 'Targeting 90% post-training employment placement',
      },
    ],
  },
  trust: {
    title: 'Verified & Audited',
    subtitle:
      'Our financials are independently audited annually. We maintain the highest standards of nonprofit accountability.',
    badges: ['80G Certified', '12A Registered', 'GuideStar Platinum', 'NITI Aayog Listed'],
  },
} as const;
