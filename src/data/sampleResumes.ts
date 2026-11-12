import type { SampleResume } from '@/types';

export const SAMPLE_RESUMES: SampleResume[] = [
  {
    id: 'strong_fs',
    candidateName: 'Alex Rivera',
    targetRole: 'Senior Full Stack Engineer',
    fileName: 'Alex_Rivera_Resume_2026.pdf',
    fileKind: 'pdf',
    text: `ALEX RIVERA | Senior Full Stack Developer
Email: alex.rivera@devmail.io | GitHub: github.com/arivera | Location: San Francisco, CA

SUMMARY
Results-driven Full Stack Engineer with 5+ years of experience engineering high-scale web platforms using React, TypeScript, and Node.js backend services. Microservices architecture, AWS cloud deployments, and automated testing pipelines.

EXPERIENCE
Senior Full Stack Engineer | TechCorp Inc. (2022 - Present)
- Architected real-time analytics dashboard serving 150k daily active users using React, TypeScript, and Zustand.
- Engineered high-performance Node.js microservices with PostgreSQL and Redis cache layers, cutting API response times by 40%.
- Established automated CI/CD workflows using GitHub Actions and AWS ECS with Docker containers, achieving 99.9% uptime.
- Mentored 4 junior developers and enforced 85%+ code coverage using Jest and Cypress.

Software Developer | CloudScale Solutions (2019 - 2022)
- Built scalable web APIs in Node.js and Express connected to MongoDB databases.
- Developed dynamic responsive UI pages using React and Tailwind CSS, reducing bundle load time by 30%.

TECHNICAL SKILLS
Languages: JavaScript, TypeScript, Python, SQL, HTML/CSS
Frontend: React, Redux, Zustand, Tailwind CSS, Next.js
Backend: Node.js, Express, REST APIs, GraphQL, PostgreSQL, MongoDB, Redis
DevOps: Docker, AWS (S3, ECS), GitHub Actions, Jest`,
  },
  {
    id: 'partial_pm',
    candidateName: 'Jordan Lee',
    targetRole: 'Product Manager / Analyst',
    fileName: 'Jordan_Lee_Resume.docx',
    fileKind: 'docx',
    text: `JORDAN LEE
Product Analyst & Tech Coordinator
Location: Chicago, IL | Email: jordan.l@example.com

SUMMARY
Creative Product Specialist with 3 years of hands-on experience in wireframing, sprint planning, customer interviews, and basic web development.

EXPERIENCE
Associate Product Specialist | WebCraft Studio (2022 - Present)
- Gathered product feedback from 50+ enterprise clients to write user stories and sprint backlogs.
- Collaborated with UI designers to convert Figma prototypes into client deliverables.
- Analyzed website drop-off rates using Google Analytics and hotjar user session recordings.

Junior Project Manager | Digital Startups Inc (2020 - 2022)
- Coordinated weekly Agile Scrum standups for cross-functional developer teams.
- Prepared product release notes and user documentation for client onboarding.

SKILLS & TOOLS
Product: Agile/Scrum, Figma, Jira, User Stories, PRD Basics, A/B Testing
Technical: HTML5, CSS3, Basic SQL, Excel Analytics`,
  },
];
