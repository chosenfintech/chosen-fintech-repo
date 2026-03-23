// src/app/page.tsx
import { HeroSection } from '@/components/sections/HeroSection';
import { PartnersSection } from '@/components/sections/PartnersSection';
import { CardanoSection } from '@/components/sections/HomeMissionAndVision';
import { StatsSection } from '@/components/sections/StatsSection';
import { LatestStoriesSection } from '@/components/sections/LatestStoriesSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { FounderSection } from '@/components/sections/FounderSection';
import { NavBar } from '@/components/layout/NavBar';
import { Footer } from '@/components/layout/Footer';

const Home = () => {
  return (
    <>
      <NavBar />
      <HeroSection />
      <CardanoSection />
      <StatsSection />
      <LatestStoriesSection />
      <ProjectsSection />
      <FounderSection />
      <PartnersSection />
      <Footer />
    </>
  );
};

export default Home;
