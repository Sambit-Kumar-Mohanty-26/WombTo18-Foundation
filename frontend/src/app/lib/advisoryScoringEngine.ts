export type DomainCategory = "HEALTHCARE" | "CHILD DEV" | "EDUCATION" | "SAFETY" | "SOCIAL" | "CONTENT" | "TECH" | "BUSINESS" | "POLICY";

export interface AdvisoryFormData {
  // Step 1
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  city: string;
  state: string;
  linkedInUrl: string;
  designation: string;
  organization: string;
  
  // Step 2
  primaryDomains: string[];
  secondaryDomains: string[];
  customDomain: string;

  // Step 3
  experienceYears: string;
  qualification: string;
  expertiseSummary: string;
  majorAchievements: string;
  previousRoles: string;
  contributionAreas: string[];

  // Step 4 (documents)
  documents: {
    photo: File | null | boolean;
    cv: File | null | boolean;
    bio: File | null | boolean;
    qualificationProof: File | null | boolean;
    registration: File | null | boolean;
    idProof: File | null | boolean;
  };

  // Step 5
  whyJoin: string;
  contributions6Months: string;
  availability: "passive" | "active" | "strategic" | "";
}

export function calculateAdvisoryScore(data: Partial<AdvisoryFormData>): number {
  let score = 0;

  // Domain Relevance (Max 25 points)
  // Full 25 if they pick at least 1 primary. Scales up to 25.
  const primaryCount = data.primaryDomains?.length || 0;
  const secondaryCount = data.secondaryDomains?.length || 0;
  
  let domainScore = 0;
  if (primaryCount > 0) domainScore += 15; // Base for having a primary
  if (primaryCount > 1) domainScore += 5; // Bonus
  if (secondaryCount > 0) domainScore += 5; // Diversity
  if (data.customDomain?.trim()) domainScore += 2; // Unique expertise
  score += Math.min(25, domainScore);

  // Experience Depth (Max 20 points)
  let expScore = 0;
  if (data.experienceYears) {
    if (data.experienceYears === "25+ years") expScore += 15;
    else if (data.experienceYears === "15–25 years") expScore += 12;
    else if (data.experienceYears === "7–15 years") expScore += 8;
    else if (data.experienceYears === "3–7 years") expScore += 5;
    else expScore += 2;
  }
  
  const higherEd = ["MD/MS", "DM/MCh", "PhD", "IAS/IPS (Retd.)"];
  if (data.qualification && higherEd.includes(data.qualification)) {
    expScore += 5; // Bonus for high qualifications
  } else if (data.qualification) {
    expScore += 2;
  }
  score += Math.min(20, expScore);

  // Strategic Value (Max 15 points)
  let stratScore = 0;
  if (data.majorAchievements && data.majorAchievements.length > 20) stratScore += 5;
  if (data.previousRoles && data.previousRoles.length > 15) stratScore += 5;
  if (data.contributionAreas && data.contributionAreas.length >= 2) stratScore += 5;
  score += Math.min(15, stratScore);

  // Intent Quality (Max 15 points)
  let intentScore = 0;
  if (data.whyJoin && data.whyJoin.length > 50) intentScore += 5;
  if (data.contributions6Months && data.contributions6Months.length > 50) intentScore += 5;
  
  if (data.availability === "strategic") intentScore += 5;
  else if (data.availability === "active") intentScore += 3;
  else if (data.availability === "passive") intentScore += 1;
  score += Math.min(15, intentScore);

  // Credibility Signals (Max 15 points)
  let credScore = 0;
  if (data.linkedInUrl && data.linkedInUrl.includes("linkedin.com/")) credScore += 7;
  if (data.designation && data.organization) credScore += 8;
  score += Math.min(15, credScore);

  // Documents Complete (Max 10 points)
  let docScore = 0;
  if (data.documents) {
    if (data.documents.cv) docScore += 3;
    if (data.documents.photo) docScore += 1;
    if (data.documents.bio) docScore += 2;
    if (data.documents.idProof) docScore += 2;
    if (data.documents.qualificationProof) docScore += 1;
    if (data.documents.registration) docScore += 1;
  }
  score += Math.min(10, docScore);

  return score;
}
