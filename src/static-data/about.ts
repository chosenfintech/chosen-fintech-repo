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
