const skills = [
  "Java",
  "Python",
  "C",
  "C++",
  "HTML",
  "CSS",
  "JavaScript",
  "React",
  "Node.js",
  "Express",
  "MySQL",
  "MongoDB",
  "Git",
  "GitHub",
];

const analyzeResume = (text) => {

  // Name (First non-empty line)
  const lines = text
    .split("\n")
    .map(line => line.trim())
    .filter(line => line.length > 0);

  const name = lines[0] || "Not Found";

  // Email
  const emailMatch = text.match(
    /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/
  );

  const email = emailMatch
    ? emailMatch[0]
    : "Not Found";

  // Phone
  const phoneMatch = text.match(
    /(\+91[- ]?)?[6-9]\d{9}/
  );

  const phone = phoneMatch
    ? phoneMatch[0]
    : "Not Found";

  // GitHub
  const githubMatch = text.match(
    /https?:\/\/(www\.)?github\.com\/[A-Za-z0-9_-]+/i
  );

  const github = githubMatch
    ? githubMatch[0]
    : "Not Found";

  // LinkedIn
  const linkedinMatch = text.match(
    /https?:\/\/(www\.)?linkedin\.com\/in\/[A-Za-z0-9_-]+/i
  );

  const linkedin = linkedinMatch
    ? linkedinMatch[0]
    : "Not Found";

// Education
let education = "Not Found";

const educationRegex =
  /education([\s\S]*?)(projects|certifications|skills|experience|languages|$)/i;

const educationMatch = text.match(educationRegex);

if (educationMatch) {
  education = educationMatch[1].trim();
}

// Projects
let projects = "Not Found";

const projectRegex =
  /projects([\s\S]*?)(certifications|skills|experience|education|languages|$)/i;

const projectMatch = text.match(projectRegex);

if (projectMatch) {
  projects = projectMatch[1].trim();
}

// Certifications
let certifications = "Not Found";

const certificationRegex =
  /certifications([\s\S]*?)(skills|projects|experience|languages|education|$)/i;

const certificationMatch = text.match(certificationRegex);

if (certificationMatch) {
  certifications = certificationMatch[1].trim();
}

  // Skills
  const foundSkills = [];

  skills.forEach(skill => {
    if (text.toLowerCase().includes(skill.toLowerCase())) {
      foundSkills.push(skill);
    }
  });

  const missingSkills = skills.filter(
    skill => !foundSkills.includes(skill)
  );

  // Score
  let score = Math.round(
    (foundSkills.length / skills.length) * 100
  );

  // Suggestions
  const suggestions = [];

  if (github === "Not Found") {
    suggestions.push("Add your GitHub profile.");
  }

  if (linkedin === "Not Found") {
    suggestions.push("Add your LinkedIn profile.");
  }

  if (foundSkills.length < 5) {
    suggestions.push("Include more technical skills.");
  }

 return {
  score,

  name,
  email,
  phone,

  github,
  linkedin,

  education,
  projects,
  certifications,

  foundSkills,
  missingSkills,
  suggestions,
};
};

module.exports = analyzeResume;