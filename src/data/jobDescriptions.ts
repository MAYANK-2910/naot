import type { JobDescription } from '@/types';

export const JOB_DESCRIPTIONS: JobDescription[] = [
  {
    id: 'fullstack',
    title: 'Senior Full Stack Engineer',
    department: 'Engineering',
    location: 'Remote',
    requiredSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS', 'GraphQL', 'Jest'],
    text: `Job Title: Senior Full Stack Engineer (React + Node.js)

Key Responsibilities:
- Design, build, and maintain scalable web applications using React, TypeScript, and Node.js.
- Architect and optimize RESTful and GraphQL APIs for low latency and high availability.
- Integrate databases like PostgreSQL, Redis, and MongoDB with proper ORM design.
- Work closely with DevOps to maintain Docker containers, Kubernetes deployments, and CI/CD pipelines on AWS.
- Mentor junior engineers and champion clean code, unit testing (Jest/Cypress), and code reviews.

Requirements:
- 4+ years software engineering experience with JavaScript/TypeScript.
- Expert knowledge in React, Tailwind CSS, State Management (Zustand/Redux).
- Strong proficiency in Node.js, Express, and async microservice patterns.
- Solid experience with SQL/NoSQL databases, indexing, and query optimization.`,
  },
  {
    id: 'data_scientist',
    title: 'AI / Data Scientist',
    department: 'Data & AI',
    location: 'Hybrid',
    requiredSkills: ['Python', 'PyTorch', 'Hugging Face', 'Transformers', 'FastAPI', 'Docker', 'Vector DBs', 'SQL'],
    text: `Job Title: AI / Data Scientist

Key Responsibilities:
- Develop and fine-tune machine learning and LLM models for text processing and predictive analytics.
- Build automated ETL data pipelines using Python, PyTorch/TensorFlow, and Apache Spark.
- Implement Retrieval-Augmented Generation (RAG) pipelines with vector databases (ChromaDB, Pinecone).
- Deploy ML models to production as low-latency microservices using FastAPI and Docker.

Requirements:
- Master’s or Bachelor’s degree in CS, Data Science, or related technical field.
- 3+ years experience developing end-to-end Machine Learning models in Python.
- Deep understanding of NLP, Transformer models, Hugging Face pipelines, and LangChain.`,
  },
  {
    id: 'product_manager',
    title: 'Senior Product Manager',
    department: 'Product Strategy',
    location: 'New York, NY',
    requiredSkills: [
      'Product Roadmap',
      'Agile/Scrum',
      'User Research',
      'SQL Analytics',
      'A/B Testing',
      'Stakeholder Management',
      'PRD Writing',
    ],
    text: `Job Title: Senior Product Manager

Key Responsibilities:
- Define product vision, roadmap, and core specs (PRDs) for enterprise SaaS products.
- Work with UX designers and software engineering teams to ship high-impact features.
- Analyze customer feedback, user analytics (Amplitude/Mixpanel), and conduct A/B testing.
- Align key stakeholders across engineering, sales, and executive leadership.

Requirements:
- 4+ years of Product Management experience in modern B2B SaaS applications.
- Strong analytical skills using SQL and BI tools for product metrics.
- Proven track record leading cross-functional Agile teams from concept to release.`,
  },
];
