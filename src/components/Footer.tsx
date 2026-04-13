// src/components/Footer.tsx
'use client';

import Link from 'next/link';
import { Facebook, Twitter, Linkedin, Youtube, Sun, Moon } from 'lucide-react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { motion } from 'motion/react';

const footerLinks = {
  company: [
    { to: '/about', label: 'About Us' },
    { to: '/contact', label: 'Contact' },
    { to: '/about/faq', label: 'FAQ' },
  ],
  resources: [
    { to: '/events', label: 'Events' },
    { to: '/academy', label: 'Academy' },
    { to: '/donate', label: 'Donate' },
  ],
  social: [
    { href: 'https://fb.com/chosenfintech', icon: Facebook, label: 'Facebook' },
    { href: 'https://x.com/chosenfintech', icon: Twitter, label: 'Twitter' },
    {
      href: 'https://www.linkedin.com/company/chosenfintech/',
      icon: Linkedin,
      label: 'LinkedIn',
    },
    {
      href: 'https://youtube.com/@cardanoghana',
      icon: Youtube,
      label: 'YouTube',
    },
  ],
};

export function Footer() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';
  const themeReady = theme !== undefined;

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <footer
      className="font-light text-white"
      style={{ backgroundColor: 'oklch(0.396 0.195 264)' }}
    >
      <div className="w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="sm:col-span-2 lg:col-span-5">
              <Link
                href="/"
                className="inline-flex items-center gap-2 mb-6 group"
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-lg overflow-hidden">
                  <Image
                    src={'/logo.jpg'}
                    width={50}
                    height={50}
                    alt="chosen fintech logo"
                    className="transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-display font-bold text-xl leading-tight text-white">
                    Chosen Fintech
                  </span>
                  <span className="text-xs text-white/60 uppercase tracking-wide">
                    SOLUTIONS
                  </span>
                </div>
              </Link>
              <p className="text-white/80 max-w-sm leading-relaxed mb-6 text-sm lg:text-base">
                Educating, Onboarding and Empowering individuals and
                organisations to navigate digital technology for effective
                socio-economic systems.
              </p>

              {/* Social Links */}
              <div className="flex items-center gap-3">
                {footerLinks.social.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center text-white/70 hover:text-white transition-all duration-300 hover:scale-110"
                    aria-label={item.label}
                  >
                    <item.icon size={26} strokeWidth={0.5} />
                  </a>
                ))}
              </div>
            </div>

            {/* Spacer */}
            <div className="hidden lg:block lg:col-span-1"></div>

            {/* Company Links */}
            <div className="lg:col-span-3">
              <h4 className="font-display font-semibold text-base lg:text-lg mb-4 lg:mb-6 text-white">
                Company
              </h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.to}>
                    <Link
                      href={link.to}
                      className="text-white/70 hover:text-white transition-colors duration-200 text-sm lg:text-base inline-block hover:translate-x-1"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Links */}
            <div className="lg:col-span-3">
              <h4 className="font-display font-semibold text-base lg:text-lg mb-4 lg:mb-6 text-white">
                Resources
              </h4>
              <ul className="space-y-3">
                {footerLinks.resources.map((link) => (
                  <li key={link.to}>
                    <Link
                      href={link.to}
                      className="text-white/70 hover:text-white transition-colors duration-200 text-sm lg:text-base inline-block hover:translate-x-1"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20">
          <div className="py-6 lg:py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <p className="text-white/60 text-xs lg:text-sm text-center sm:text-left">
                © {new Date().getFullYear()} Chosen Fintech. All rights
                reserved.
              </p>
              {/* Theme Toggle */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="flex items-center cursor-pointer justify-center w-7 h-7 rounded-full border border-white/30 bg-white/10 hover:bg-white/20 transition-colors duration-300"
              >
                {themeReady &&
                  (isDark ? (
                    <Sun className="h-3 w-3 text-white/60" />
                  ) : (
                    <Moon className="h-3 w-3 text-white/60" />
                  ))}
              </motion.button>
            </div>
            <div className="flex items-center gap-2 text-white/60 text-xs lg:text-sm">
              <a
                href="mailto:info@chosenfintech.org"
                className="hover:text-white transition-colors duration-200 hover:underline"
              >
                info@chosenfintech.org
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
