'use client';
// pages/About.tsx
import { PageHero } from '@/components/sections/PageHero';
import { WhoWeAre } from '@/components/sections/WhoWeAre';
import { WhatWeDo, FocusArea } from '@/components/sections/WhatWeDo';
import { OurTeam, TeamMember } from '@/components/sections/OurTeam';
import { GraduationCap, Rocket, Smartphone, Coins } from 'lucide-react';
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
    name: 'Kwame Mensah',
    role: 'Founder & CEO',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
  },
  {
    name: 'Ama Darko',
    role: 'Head of Education',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
  },
  {
    name: 'Kofi Asante',
    role: 'Blockchain Lead',
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
  },
  {
    name: 'Akua Boateng',
    role: 'Operations Manager',
    image:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
  },
  {
    name: 'Yaw Owusu',
    role: 'Technical Director',
    image:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
  },
  {
    name: 'Efua Adjei',
    role: 'Community Manager',
    image:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop',
  },
];

const About = () => {
  return (
    <div>
      <NavBar />
      <PageHero title="About Us" />

      <WhoWeAre
        description="Chosen Fintech Solutions, formerly established and registered in 2020, and based in Tamale, Ghana, is committed to promoting financial technology (fintech) adoption and inclusion across Africa. Our core aim is to harness the power of fintech to strengthen political, economic, and social systems through digital empowerment in Africa."
        vision="To be a leading catalyst for digital transformation in Africa by empowering individuals, businesses and governments, through inclusive access to blockchain, financial technology, and digital education."
        mission="To make financial technology accessible by educating Africans, supporting entrepreneurs, and providing digital tools for payments, blockchain, and asset management."
      />

      <WhatWeDo
        description="At Chosen Fintech Solutions, our work is centered around building a digitally inclusive Africa through strategic focus areas that empower individuals and organizations."
        focusAreas={focusAreas}
      />

      <OurTeam teamMembers={teamMembers} />
      <Footer />
    </div>
  );
};

export default About;
