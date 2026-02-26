/**
 * Developer Information for CODEEX AI
 * Contains all information about the creator and development team
 */

export const DEVELOPER_INFO = {
  // Personal Information
  name: "CODEEX Heoster",
  alias: "Heoster",
  realName: "Harsh",
  age: 16,
  location: {
    city: "Khatauli",
    state: "Uttar Pradesh",
    country: "India"
  },

  // Education
  education: {
    class: "Class 11th",
    stream: "PCM (Physics, Chemistry, Mathematics)",
    school: "Maples Academy",
    year: "2025-2026"
  },

  // Professional
  company: {
    name: "CODEEX AI",
    role: "Founder & Lead Developer",
    founded: "2024",
    type: "AI Startup"
  },

  // Contact & Social
  contact: {
    email: "codeex@email.com",
    linkedin: "https://in.linkedin.com/in/codeex-heoster-4b60b8399",
    linkedinVanity: "codeex-heoster-4b60b8399",
    github: "https://github.com/heoster",
    twitter: "https://twitter.com/The_Heoster_"
  },

  social: {
    github: "heoster",
    instagram: "heoster_official",
    linkedin: "codeex-heoster-4b60b8399",
    Twitter: "The_Heoster_"
  },

  // Vision & Mission
  vision: "To democratize AI education in India and make advanced technology accessible to every student, regardless of their background or resources.",

  mission: "Building the world's most comprehensive free AI platform to empower the next generation of innovators and creators.",

  // Technical Skills
  skills: [
    "React", "Next.js", "TypeScript", "JavaScript",
    "Node.js", "Python", "Firebase", "Netlify",
    "Tailwind CSS", "Framer Motion", "AI/ML Integration",
    "API Development", "PWA Development", "Mobile-First Design",
    "Performance Optimization", "SEO", "Accessibility",
    "Git", "GitHub", "CI/CD", "Cloud Deployment"
  ],

  // AI Technologies
  aiTechnologies: [
    "Groq API Integration", "Hugging Face Models", "Google Gemini",
    "ElevenLabs Voice Synthesis", "OpenAI GPT Models",
    "Model Orchestration", "Prompt Engineering", "AI Routing",
    "Streaming Responses", "Multi-Provider Architecture"
  ],

  // Key Achievements
  achievements: [
    "Built CODEEX AI with 26+ AI models at age 16",
    "Created the world's largest free AI model collection",
    "Developed innovative 'Six Souls' workflow for Smart Notes Pro",
    "Achieved sub-second load times with advanced optimization",
    "Built comprehensive PWA with 99.9% uptime",
    "Integrated voice synthesis and speech recognition",
    "Implemented advanced trust scoring system",
    "Created privacy-first web search integration",
    "Developed mobile-first responsive design",
    "Built comprehensive API with developer tools"
  ],

  // Current Projects
  currentProjects: [
    "CODEEX AI Platform Development",
    "Smart Notes Pro Enhancement",
    "Mobile App Development",
    "API Ecosystem Expansion",
    "Educational Content Creation",
    "Community Building",
    "Performance Optimization"
  ],

  // Support Network (Friends who help test and provide feedback)
  friends: [
    "VIDHAn", "AVINEEt", "vansh",
    "AAYUSH", "VARUN", "pankaj", "MASUM", "SACHIN",
    "pardhuman", "shivansh", "Vaibhav", "Kartik", "Harsh"
  ],

  // Project Statistics
  projectStats: {
    linesOfCode: "50,000+",
    components: "200+",
    apiEndpoints: "25+",
    testCoverage: "85%+",
    lighthouseScore: "95+",
    modelsIntegrated: 26,
    countriesReached: "100+",
    dailyUsers: "1000+",
    uptime: "99.9%"
  },

  // Development Philosophy
  philosophy: [
    "User-first design and experience",
    "Performance and speed optimization",
    "Accessibility and inclusive design",
    "Open source and transparent development",
    "Privacy protection and security",
    "Continuous learning and improvement",
    "Community-driven innovation",
    "Democratizing technology access"
  ],

  // Future Goals
  futureGoals: [
    "Expand CODEEX AI to 1 million users",
    "Launch native mobile applications",
    "Create AI education curriculum for schools",
    "Build developer ecosystem and marketplace",
    "Establish CODEEX AI as leading AI platform in India",
    "Mentor other young developers and entrepreneurs",
    "Contribute to open source AI community",
    "Advance AI accessibility and education globally"
  ],

  // Recognition & Awards
  recognition: [
    "Youngest AI platform founder in India",
    "Featured in tech communities for innovation",
    "Recognized for democratizing AI access",
    "Praised for technical excellence at young age",
    "Community leader in AI education"
  ],

  // Development Timeline
  timeline: [
    {
      year: "2024",
      milestone: "Founded CODEEX AI",
      description: "Started building the comprehensive AI platform"
    },
    {
      year: "2024",
      milestone: "Launched Multi-Model Integration",
      description: "Integrated 26+ AI models from multiple providers"
    },
    {
      year: "2025",
      milestone: "Developed Smart Notes Pro",
      description: "Created revolutionary Six Souls workflow"
    },
    {
      year: "2025",
      milestone: "Achieved Global Reach",
      description: "Platform reached users in 100+ countries"
    },
    {
      year: "2026",
      milestone: "Continuous Innovation",
      description: "Ongoing development and feature expansion"
    }
  ]
};

// Helper functions for developer info
export const getDeveloperAge = () => DEVELOPER_INFO.age;
export const getDeveloperName = () => DEVELOPER_INFO.name;
export const getDeveloperEmail = () => DEVELOPER_INFO.contact.email;
export const getDeveloperLinkedIn = () => DEVELOPER_INFO.contact.linkedin;
export const getDeveloperGitHub = () => `https://github.com/${DEVELOPER_INFO.social.github}`;
export const getDeveloperInstagram = () => `https://instagram.com/${DEVELOPER_INFO.social.instagram}`;
export const getDeveloperTwitter = () => `https://twitter.com/${DEVELOPER_INFO.social.Twitter}`;

// Get formatted developer info for display
export const getFormattedDeveloperInfo = () => ({
  name: DEVELOPER_INFO.name,
  title: `${DEVELOPER_INFO.company.role} at ${DEVELOPER_INFO.company.name}`,
  age: DEVELOPER_INFO.age,
  location: `${DEVELOPER_INFO.location.city}, ${DEVELOPER_INFO.location.country}`,
  education: `${DEVELOPER_INFO.education.class} ${DEVELOPER_INFO.education.stream} Student`,
  school: DEVELOPER_INFO.education.school,
  vision: DEVELOPER_INFO.vision,
  contact: DEVELOPER_INFO.contact,
  social: DEVELOPER_INFO.social
});

/**
 * Check if a user query is about the developer
 */
export function isDeveloperQuery(message: string): boolean {
  const lowercaseMsg = message.toLowerCase();
  const keywords = [
    'who made you',
    'who created you',
    'who is your creator',
    'who is your developer',
    'who built you',
    'who coded you',
    'who designed you',
    'who is heoster',
    'who is harsh',
    'tell me about your creator',
    'tell me about your developer',
    'developer info',
    'creator info',
    'about the developer'
  ];

  return keywords.some(keyword => lowercaseMsg.includes(keyword));
}

/**
 * Get a contextual response about the developer
 */
export function getContextualDeveloperResponse(message: string): string {
  const lowercaseMsg = message.toLowerCase();

  // Basic intro response
  let response = `I was created by **${DEVELOPER_INFO.name}** (also known as **${DEVELOPER_INFO.realName}**), a ${DEVELOPER_INFO.age}-year-old visionary developer from ${DEVELOPER_INFO.location.city}, India. He is the founder of **${DEVELOPER_INFO.company.name}** and currently studies in ${DEVELOPER_INFO.education.class}.`;

  // Customization based on specific questions
  if (lowercaseMsg.includes('age') || lowercaseMsg.includes('old')) {
    response = `My creator, **${DEVELOPER_INFO.realName}** (${DEVELOPER_INFO.alias}), is just **${DEVELOPER_INFO.age} years old**! He built this entire platform while studying in ${DEVELOPER_INFO.education.class}.`;
  } else if (lowercaseMsg.includes('where') || lowercaseMsg.includes('location') || lowercaseMsg.includes('from')) {
    response = `**${DEVELOPER_INFO.alias}** is from **${DEVELOPER_INFO.location.city}, ${DEVELOPER_INFO.location.state}, India**. He's working to democratize AI education across the country.`;
  } else if (lowercaseMsg.includes('why') || lowercaseMsg.includes('vision') || lowercaseMsg.includes('mission')) {
    response = `**${DEVELOPER_INFO.alias}'s** vision is "${DEVELOPER_INFO.vision}". He wants to ensure every student has access to advanced AI tools for learning, completely free.`;
  } else if (lowercaseMsg.includes('stack') || lowercaseMsg.includes('tech') || lowercaseMsg.includes('built with')) {
    response = `I was built using **Next.js, TypeScript, and Tailwind CSS**. My creator integrated **26+ AI models** (including GPT-4, Gemini, Claude) using a custom multi-provider architecture he designed from scratch.`;
  } else if (lowercaseMsg.includes('school') || lowercaseMsg.includes('study')) {
    response = `He studies at **${DEVELOPER_INFO.education.school}** in **${DEVELOPER_INFO.education.class}** (${DEVELOPER_INFO.education.stream} stream). Balancing full-stack AI development with school studies is one of his remarkable achievements!`;
  }

  return response;
}

export default DEVELOPER_INFO;