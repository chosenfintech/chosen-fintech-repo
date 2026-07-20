// src/components/about/AboutPageClient.tsx
'use client';

import { PageHero } from '@/components/ui/PageHero';
import { WhoWeAre } from '@/components/about/WhoWeAre';
import { WhatWeDo } from './WhatWeDo';
import { OurTeam } from './OurTeam';
import { focusAreas } from '@/static-data/about';
import type { ITeamMember } from '@/types/team/team-member.types';

interface AboutPageClientProps {
  teamMembers: ITeamMember[];
}

export default function AboutPageClient({
  teamMembers,
}: AboutPageClientProps) {
  return (
    <>
      <PageHero title="About Us" />
      <WhoWeAre
        description="Chosen Fintech Solutions, founded and registered in 2020, based in Tamale, Ghana, is committed to promoting financial technology (fintech) adoption and inclusion across Africa. Our core objective is to drive financial inclusion and economic empowerment through innovative fintech and digital services."
        vision="To be a global catalyst for fintech innovation, mass adoption and ethical governance."
        mission="To educate, onboard and empower individuals and organisations to navigate digital technology for effective socio-economic systems."
      />
      <WhatWeDo
        description="At Chosen Fintech Solutions, our work is centered around enhancing digital inclusion through strategic focus areas that empower individuals and organizations."
        focusAreas={focusAreas}
      />
      <OurTeam teamMembers={teamMembers} />
    </>
  );
}
