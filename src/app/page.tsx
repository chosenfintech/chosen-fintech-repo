import { Suspense } from 'react';
import { Hero } from '@/components/home/Hero';
import { Partners } from '@/components/home/Partners';
import { MissionAndVision } from '@/components/home/MissionAndVision';
import { Stats } from '@/components/home/Stats';
import LatestEventsServer from '@/components/home/LatestEventsServer';
import { LatestEventsSkeleton } from '@/components/home/LatestEventsSkeleton';
import { LatestProjects } from '@/components/home/LatestProjects';
import { AboutFounder } from '@/components/home/AboutFounder';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';

const Home = () => {
  return (
    <>
      <NavBar />
      <Hero />
      <MissionAndVision />
      <Stats />
      <Suspense fallback={<LatestEventsSkeleton />}>
        <LatestEventsServer />
      </Suspense>
      <LatestProjects />
      <AboutFounder />
      <Partners />
      <Footer />
    </>
  );
};

export default Home;