// src/components/home/Partners.tsx
'use client';

import Image from 'next/image';

const partners = [
  { name: 'Cardano', logo: '/cardano-ghana-community-partner.png' },
  { name: 'Project Catalyst', logo: '/project-catalyst-logo.png' },
  {
    name: 'Africa Real Estate International',
    logo: '/africa-real-estate-international.png',
  },
];

export function Partners() {
  const partnersBoxColor = '#2c2c36';

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-6 md:mb-16 lg:my-16">
      <div
        className="relative text-center space-y-8 shadow-2xl p-6 md:p-8 lg:p-14"
        style={{
          backgroundColor: partnersBoxColor,
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        }}
      >
        <h2 className="text-xs md:text-sm font-light text-white uppercase tracking-widest">
          TRUSTED BY BIG ONES.
        </h2>

        <div className="flex flex-wrap justify-center gap-6 md:gap-8 lg:gap-10 items-center">
          {partners.map(({ name, logo }) => (
            <div
              key={name}
              className="flex items-center justify-center h-10 md:h-12 lg:h-16 w-32 md:w-36 lg:w-40"
            >
              <Image
                src={logo}
                alt={`${name} logo`}
                width={160}
                height={64}
                className="object-contain w-full h-full opacity-90 transition-opacity duration-300 hover:opacity-100"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
