'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, Sun, Moon, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from 'next-themes';

const aboutLinks = [
  { to: '/about', label: 'About Us' },
  { to: '/about/gallery', label: 'Gallery' },
  { to: '/about/faq', label: 'FAQ' },
];

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/projects', label: 'Projects' },
  { to: '/academy', label: 'Academy' },
  { to: '/events', label: 'Events' },
  { to: '/contact', label: 'Contact Us' },
];

export function NavBar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const aboutRef = useRef<HTMLDivElement>(null);

  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';
  const themeReady = theme !== undefined;
  const toggleTheme = () => setTheme(isDark ? 'light' : 'dark');

  const isAboutActive = aboutLinks.some((l) => pathname === l.to);

  // The bar stays pinned at all times (no hide-on-scroll-down) — scrolling
  // only morphs it between the floating pill and the full-width strip.
  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY < 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (aboutRef.current && !aboutRef.current.contains(e.target as Node)) {
        setAboutOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <motion.header
      className={cn(
        'fixed z-50',
        isAtTop
          ? 'top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl'
          : 'top-0 left-0 right-0 w-full',
      )}
    >
      <motion.div
        layout
        transition={{
          layout: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
        }}
        className={cn(
          'transition-all duration-500',
          isAtTop
            ? 'rounded-full bg-background/95 backdrop-blur-xl border border-border/50 shadow-lg'
            : 'rounded-none bg-background/80 backdrop-blur-lg border-b border-border/50',
        )}
      >
        <div
          className={cn(
            'mx-auto',
            isAtTop
              ? 'px-6 max-w-7xl'
              : 'container max-w-7xl px-4 sm:px-6 lg:px-8',
          )}
        >
          <div className="flex items-center justify-between h-18 md:h-28">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="w-10 h-10 flex items-center justify-center"
              >
                <Image
                  src="/logo.jpg"
                  width={50}
                  height={50}
                  alt="chosen fintech logo"
                  className={cn(
                    'border border-border transition-all duration-500',
                    isAtTop ? 'rounded-lg' : 'rounded-none',
                  )}
                />
              </motion.div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-xl text-foreground group-hover:text-primary transition-colors duration-300 leading-tight">
                  CHOSEN FINTECH
                </span>
                <span className="text-xs text-muted-foreground uppercase tracking-wide">
                  SOLUTIONS
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {/* Home */}
              <Link
                href="/"
                className="relative px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300"
              >
                <span
                  className={cn(
                    'relative z-10 transition-colors duration-200',
                    pathname === '/'
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  Home
                </span>
                <span
                  className={cn(
                    'absolute inset-0 rounded-full bg-primary/10 transition-opacity duration-200',
                    pathname === '/' ? 'opacity-100' : 'opacity-0',
                  )}
                />
              </Link>

              {/* About Dropdown */}
              <div
                ref={aboutRef}
                className="relative"
                onMouseEnter={() => setAboutOpen(true)}
                onMouseLeave={() => setAboutOpen(false)}
              >
                <button
                  className="relative flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 cursor-pointer"
                  onClick={() => setAboutOpen((o) => !o)}
                  aria-expanded={aboutOpen}
                >
                  <span
                    className={cn(
                      'relative z-10 transition-colors duration-200',
                      isAboutActive
                        ? 'text-primary'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    About
                  </span>
                  <motion.div
                    animate={{ rotate: aboutOpen ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="relative z-10"
                  >
                    <ChevronDown
                      className={cn(
                        'h-3.5 w-3.5 transition-colors duration-300',
                        isAboutActive
                          ? 'text-primary'
                          : 'text-muted-foreground',
                      )}
                    />
                  </motion.div>
                  <span
                    className={cn(
                      'absolute inset-0 rounded-full bg-primary/10 transition-opacity duration-200',
                      isAboutActive ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </button>

                {/* Dropdown Panel */}
                <AnimatePresence>
                  {aboutOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.97 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-44 bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-lg overflow-hidden"
                    >
                      <div className="py-2 px-2 flex flex-col gap-1">
                        {aboutLinks.map((link) => {
                          const isActive = pathname === link.to;
                          return (
                            <Link
                              key={link.to}
                              href={link.to}
                              onClick={() => setAboutOpen(false)}
                              className={cn(
                                'block px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200',
                                isActive
                                  ? 'text-primary bg-primary/10'
                                  : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                              )}
                            >
                              {link.label}
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Remaining nav links */}
              {navLinks.slice(1).map((link) => {
                const isActive = pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    href={link.to}
                    className="relative px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300"
                  >
                    <span
                      className={cn(
                        'relative z-10 transition-colors duration-200',
                        isActive
                          ? 'text-primary'
                          : 'text-muted-foreground hover:text-foreground',
                      )}
                    >
                      {link.label}
                    </span>
                    <span
                      className={cn(
                        'absolute inset-0 rounded-full bg-primary/10 transition-opacity duration-200',
                        isActive ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Right Section */}
            <div className="hidden lg:flex items-center gap-3">
              <motion.button
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="flex items-center cursor-pointer justify-center w-10 h-10 rounded-full border border-border bg-background hover:bg-muted transition-colors duration-300"
              >
                {themeReady &&
                  (isDark ? (
                    <Sun className="h-4 w-4 text-foreground" />
                  ) : (
                    <Moon className="h-4 w-4 text-foreground" />
                  ))}
              </motion.button>

              <motion.div whileHover={{ scale: 1.05 }}>
                <Button
                  size="lg"
                  className="rounded-full font-medium bg-primary hover:bg-primary/90 dark:bg-white dark:text-[oklch(0.396_0.195_264)] dark:hover:bg-white/90 transition-all duration-300"
                  asChild
                >
                  <Link href="/donate">Donate</Link>
                </Button>
              </motion.div>
            </div>

            {/* Mobile Toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="lg:hidden p-2 rounded-full hover:bg-muted"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={mobileMenuOpen ? 'close' : 'open'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                >
                  {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </motion.div>
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="lg:hidden absolute top-full left-0 right-0 mt-2 mx-4 max-w-7xl"
          >
            <div className="bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-lg overflow-hidden">
              <nav className="py-4 flex flex-col gap-2 px-4">
                {/* Home */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0 }}
                >
                  <Link
                    href="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'block px-4 py-3 rounded-full text-sm font-medium transition-colors duration-200',
                      pathname === '/'
                        ? 'text-primary bg-primary/10'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                    )}
                  >
                    Home
                  </Link>
                </motion.div>

                {/* About accordion */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 }}
                >
                  <button
                    onClick={() => setMobileAboutOpen((o) => !o)}
                    className={cn(
                      'w-full flex items-center justify-between px-4 py-3 rounded-full text-sm font-medium transition-colors duration-200',
                      isAboutActive
                        ? 'text-primary bg-primary/10'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                    )}
                  >
                    About
                    <motion.div
                      animate={{ rotate: mobileAboutOpen ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {mobileAboutOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="ml-4 mt-1 flex flex-col gap-1">
                          {aboutLinks.map((link) => {
                            const isActive = pathname === link.to;
                            return (
                              <Link
                                key={link.to}
                                href={link.to}
                                onClick={() => {
                                  setMobileMenuOpen(false);
                                  setMobileAboutOpen(false);
                                }}
                                className={cn(
                                  'block px-4 py-2.5 rounded-full text-sm font-medium transition-colors duration-200',
                                  isActive
                                    ? 'text-primary bg-primary/10'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                                )}
                              >
                                {link.label}
                              </Link>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Projects, Academy, Events, Donate */}
                {navLinks.slice(1).map((link, index) => {
                  const isActive = pathname === link.to;
                  return (
                    <motion.div
                      key={link.to}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (index + 2) * 0.08 }}
                    >
                      <Link
                        href={link.to}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          'block px-4 py-3 rounded-full text-sm font-medium transition-colors duration-200',
                          isActive
                            ? 'text-primary bg-primary/10'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                        )}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}

                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="flex items-center justify-between px-4 py-3 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200"
                >
                  <span>Toggle Theme</span>
                  {themeReady &&
                    (isDark ? (
                      <Sun className="h-4 w-4" />
                    ) : (
                      <Moon className="h-4 w-4" />
                    ))}
                </button>

                <div className="pt-2 mt-2 border-t border-border">
                  <Button
                    size="lg"
                    className="w-full rounded-full dark:bg-white dark:text-[oklch(0.396_0.195_264)] dark:hover:bg-white/90"
                    asChild
                  >
                    <Link
                      href="/donate"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Donate
                    </Link>
                  </Button>
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
