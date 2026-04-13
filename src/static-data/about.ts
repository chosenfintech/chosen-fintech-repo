// src/static-data/about.ts
import {
  GraduationCap,
  Rocket,
  Smartphone,
  Coins,
  Facebook,
  Linkedin,
  X,
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export interface ISocialLink {
  icon: React.FC<{ className?: string }>;
  href: string;
  label: string;
}

export interface ITeamMember {
  name: string;
  role: string;
  image: string;
  socials?: ISocialLink[];
}

export interface IFocusArea {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const focusAreas: IFocusArea[] = [
  {
    icon: GraduationCap,
    title: 'Blockchain & ICT Education',
    description:
      "We educate, develop, empower, and onboard Africans into the world of blockchain and cryptocurrency, while promoting digital literacy by equipping individuals with essential ICT skills to thrive in today's technology-driven world.",
  },
  {
    icon: Rocket,
    title: 'Entrepreneurship Development',
    description:
      'We support startups and small businesses through incubation and acceleration programs, providing tools, mentorship, and resources to scale sustainable ventures and drive economic growth.',
  },
  {
    icon: Smartphone,
    title: 'Mobile Money Transactions',
    description:
      'We deliver seamless mobile money payment solutions across platforms including MTN Ghana, Telecel, and other telecom networks—enhancing financial accessibility and convenience.',
  },
  {
    icon: Coins,
    title: 'Digital Asset Trading & Management',
    description:
      'We empower users to safely trade and manage digital tokens, ensuring secure and value-driven participation in the digital economy.',
  },
];

export const teamMembers: ITeamMember[] = [
  {
    name: 'Mohammed Mustapha Yakubu',
    role: 'Founder & CEO',
    image: '/founder.jpg',
    socials: [
      { icon: Facebook, href: '#', label: 'Facebook' },
      { icon: X, href: 'x.com/mmustaphayakubu', label: 'X / Twitter' },
      {
        icon: Linkedin,
        href: 'https://www.linkedin.com/in/mohammed-mustapha-yakubu-a08455125',
        label: 'Linkedin',
      },
    ],
  },
  {
    name: 'Seidu Ziblim',
    role: 'Project Support',
    image: '/seidu-ziblim.jpeg',
    socials: [
      { icon: Facebook, href: '#', label: 'Facebook' },
      { icon: X, href: '#', label: 'X / Twitter' },
      { icon: Linkedin, href: '#', label: 'Linkedin' },
    ],
  },
  {
    name: 'Osman Mohammed',
    role: 'Events Support',
    image: '/osman-mohammed.jpeg',
  },
];

export const faqCategories = [
  {
    category: 'ABOUT CHOSEN FINTECH',
    questions: [
      {
        q: 'What is Chosen Fintech?',
        a: 'Chosen Fintech is a fintech education agency dedicated to cryptocurrency and blockchain education. We specialize in the Cardano ecosystem while also covering broader topics in DeFi, financial literacy, and digital asset management.',
      },
      {
        q: 'Why do you focus on Cardano?',
        a: 'We focus on Cardano because of its scientific, peer-reviewed approach to blockchain development, its commitment to sustainability through proof-of-stake, and its mission to provide financial services to the underbanked. Cardano represents the values we believe in: rigorous research, security, and real-world impact.',
      },
      {
        q: 'Who are your programs designed for?',
        a: 'Our programs cater to everyone from complete beginners curious about cryptocurrency to developers wanting to build on Cardano. We offer different learning paths based on experience level and goals.',
      },
    ],
  },
  {
    category: 'CRYPTO AND BLOCKCHAIN',
    questions: [
      {
        q: 'What is cryptocurrency?',
        a: 'Cryptocurrency is a digital or virtual form of currency that uses cryptography for security. Unlike traditional currencies issued by governments, cryptocurrencies operate on decentralized networks using blockchain technology.',
      },
      {
        q: 'What is blockchain technology?',
        a: "Blockchain is a distributed ledger technology that records transactions across many computers in a way that makes the records difficult to alter. Each 'block' contains transaction data and is linked to the previous block, forming a 'chain' of transparent, immutable records.",
      },
      {
        q: 'Is cryptocurrency safe to invest in?',
        a: 'Cryptocurrency investments carry significant risks including volatility, regulatory uncertainty, and security concerns. We encourage thorough research and education before investing. Our programs focus on education, not investment advice—we help you understand the technology so you can make informed decisions.',
      },
    ],
  },
  {
    category: 'CARDANO SPECIFIC',
    questions: [
      {
        q: 'What is ADA?',
        a: "ADA is the native cryptocurrency of the Cardano blockchain. It's named after Ada Lovelace, a 19th-century mathematician considered to be the first computer programmer. ADA is used for transactions, staking, and governance on the Cardano network.",
      },
      {
        q: 'How do I stake my ADA?',
        a: 'Staking ADA involves delegating your tokens to a stake pool, which helps secure the network while earning you rewards. You maintain full control of your ADA—it never leaves your wallet. We offer comprehensive guides on how to stake through our Cardano Hub.',
      },
      {
        q: 'What is Project Catalyst?',
        a: "Project Catalyst is Cardano's community-driven innovation fund. ADA holders can submit proposals for projects, vote on proposals, and help guide the development of the Cardano ecosystem. It's one of the largest decentralized innovation funds in the world.",
      },
    ],
  },
  {
    category: 'GETTING STARTED',
    questions: [
      {
        q: 'How do I start learning about crypto?',
        a: 'Start with our beginner resources in the Cardano Hub or Blog sections. We recommend beginning with foundational concepts before diving into specific technologies. Our learning paths are designed to guide you step-by-step.',
      },
      {
        q: 'Do I need any technical background?',
        a: 'Not at all! Our beginner programs are designed for people with no prior technical or financial background. We break down complex concepts into digestible, easy-to-understand content.',
      },
      {
        q: 'How can I get involved with Chosen Fintech?',
        a: 'There are many ways to get involved: follow our blog and social media, attend our workshops, join our community events, or reach out through our contact page. We welcome everyone who shares our passion for financial education.',
      },
    ],
  },
];
