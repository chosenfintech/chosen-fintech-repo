// src/components/about/OurTeam.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { Facebook, Linkedin, Mail, X } from 'lucide-react';
import { motion } from 'motion/react';
import {
  containerVariants,
  lineRevealVariants,
  fadeUpVariants,
  cardVariants,
} from '@/static-data/motion-variants';
import type { ITeamMember } from '@/types/team/team-member.types';

interface OurTeamProps {
  title?: string;
  teamMembers: ITeamMember[];
}

/** Only the links an admin actually filled in get an icon on the card. */
const socialLinksFor = (member: ITeamMember) =>
  [
    {
      icon: Facebook,
      href: member.facebookUrl,
      label: `${member.name} on Facebook`,
    },
    { icon: X, href: member.twitterUrl, label: `${member.name} on X` },
    {
      icon: Linkedin,
      href: member.linkedinUrl,
      label: `${member.name} on LinkedIn`,
    },
    {
      icon: Mail,
      href: member.email ? `mailto:${member.email}` : null,
      label: `Email ${member.name}`,
    },
  ].filter((social): social is typeof social & { href: string } =>
    Boolean(social.href),
  );

export const OurTeam: React.FC<OurTeamProps> = ({
  title = 'OUR TEAM',
  teamMembers,
}) => {
  const containerClasses = 'w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8';

  // Nothing published yet - drop the section rather than show an empty grid.
  if (teamMembers.length === 0) return null;

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={containerVariants}
      className="py-16 bg-background"
    >
      <div className={containerClasses}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
          <motion.div
            variants={fadeUpVariants}
            className="lg:col-span-1 lg:sticky lg:top-8 lg:self-start"
          >
            {/* dark:text-white so the heading stays legible in dark mode */}
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary dark:text-white leading-tight">
              {title.split(' ').map((word, index) => (
                <React.Fragment key={index}>
                  {word}
                  {index < title.split(' ').length - 1 && <br />}
                </React.Fragment>
              ))}
            </h2>

            <motion.div
              variants={lineRevealVariants}
              className="w-10 h-0.5 bg-primary mt-4 origin-left"
            />

            <p className="mt-4 text-muted-foreground leading-relaxed">
              Meet the talented individuals driving our mission forward.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {teamMembers.map((member) => {
              const socials = socialLinksFor(member);

              return (
                <motion.div
                  key={member.id}
                  variants={cardVariants}
                  whileHover="hover"
                  className="group bg-card border border-border overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="relative">
                    <div className="relative aspect-3/4 overflow-hidden bg-muted">
                      {socials.length > 0 && (
                        <motion.div
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{
                            duration: 0.6,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-1 p-2"
                        >
                          {socials.map((social) => {
                            const IconComponent = social.icon;
                            const isMailto = social.href.startsWith('mailto:');

                            return (
                              <motion.a
                                key={social.label}
                                href={social.href}
                                aria-label={social.label}
                                {...(isMailto
                                  ? {}
                                  : {
                                      target: '_blank',
                                      rel: 'noopener noreferrer',
                                    })}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-10 h-10 bg-primary text-primary-foreground flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors duration-300 shadow-md"
                              >
                                <IconComponent className="w-5 h-5" />
                              </motion.a>
                            );
                          })}
                        </motion.div>
                      )}

                      <Image
                        src={member.imageUrl}
                        alt={member.name}
                        fill
                        className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>

                    <motion.div
                      variants={fadeUpVariants}
                      className="p-4 bg-card"
                    >
                      <h3 className="text-lg font-semibold text-card-foreground">
                        {member.name}
                      </h3>
                      {/* Name and role only. A bio would have to be clamped
                          here with no way to read the rest of it. */}
                      <p className="text-sm text-muted-foreground mt-1">
                        {member.role}
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};
