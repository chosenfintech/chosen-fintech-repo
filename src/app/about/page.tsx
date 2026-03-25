'use client';
// pages/About.tsx
import { PageHero } from '@/components/sections/PageHero';
import { WhoWeAre } from '@/components/sections/WhoWeAre';
import { WhatWeDo, FocusArea } from '@/components/sections/WhatWeDo';
import { OurTeam, TeamMember } from '@/components/sections/OurTeam';
import {
  GraduationCap,
  Rocket,
  Smartphone,
  Coins,
  Facebook,
  Linkedin,
  X,
} from 'lucide-react';
import { NavBar } from '@/components/layout/NavBar';
import { Footer } from '@/components/layout/Footer';

const focusAreas: FocusArea[] = [
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

const teamMembers: TeamMember[] = [
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
      { icon: X, href: 'v', label: 'X / Twitter' },
      {
        icon: Linkedin,
        href: '#',
        label: 'Linkedin',
      },
    ],
  },
  {
    name: 'Osman Mohammed',
    role: 'Events Support',
    image: '/osman-mohammed.jpeg',
  },
];

const About = () => {
  return (
    <div>
      <NavBar />
      <PageHero title="About Us" />

      <WhoWeAre
        description="Chosen Fintech Solutions, founded and registered in 2020,based in Tamale, Ghana, is committed to promoting financial technology (fintech) adoption and inclusion across Africa. Our core objective is to drive financial inclusion and economic empowerment through innovative fintech and digital services."
        vision="To be a global catalyst for fintech innovation, mass adoption and ethical governance."
        mission="To educate, onboard and empower individuals and organisations to naviage digital technology for effective socio-economic systems."
      />

      <WhatWeDo
        description="At Chosen Fintech Solutions, our work is centered around enhancing digital inclusion through strategic focus areas that empower individuals and organizations."
        focusAreas={focusAreas}
      />

      <OurTeam teamMembers={teamMembers} />
      <Footer />
    </div>
  );
};

export default About;
