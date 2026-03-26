'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/fintech-academy', label: 'Fintech Academy' },
  { to: '/blog', label: 'Blog' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/faq', label: 'FAQ' },
];

export function NavBar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Check if at the very top
      setIsAtTop(currentScrollY < 20);

      // Show navbar when scrolling up, hide when scrolling down
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{
        y: isVisible ? 0 : -100,
      }}
      transition={{
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn(
        'fixed z-50',
        isAtTop
          ? 'top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl'
          : 'top-0 left-0 right-0 w-full',
      )}
    >
      <motion.div
        layout
        animate={{
          borderRadius: isAtTop ? '9999px' : '0px',
        }}
        transition={{
          layout: {
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
          },
          borderRadius: {
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
          },
        }}
        className={cn(
          'transition-colors duration-500',
          isAtTop
            ? 'bg-background/95 backdrop-blur-xl border border-border/50 shadow-lg'
            : 'bg-background/80 backdrop-blur-lg border-b border-border/50',
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
                  src={'/logo.jpg'}
                  width={50}
                  height={50}
                  alt="chosen fintech logo"
                  className="rounded-lg"
                />
              </motion.div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-xl text-foreground group-hover:text-primary transition-colors duration-300 leading-tight">
                  Chosen Fintech
                </span>
                <span className="text-xs text-muted-foreground uppercase tracking-wide">
                  SOLUTIONS
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.to;

                return (
                  <Link
                    key={link.to}
                    href={link.to}
                    className="relative px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300"
                  >
                    <motion.span
                      className={cn(
                        'relative z-10',
                        isActive
                          ? 'text-primary'
                          : 'text-muted-foreground hover:text-foreground',
                      )}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      {link.label}
                    </motion.span>
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute inset-0 bg-primary/10 rounded-full"
                        transition={{
                          type: 'spring',
                          stiffness: 350,
                          damping: 35,
                        }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* CTA */}
            <div className="hidden lg:block">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  size="lg"
                  className={cn(
                    'rounded-full font-medium',
                    'bg-primary hover:bg-primary/90',
                    'transition-all duration-300',
                  )}
                  asChild
                >
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </motion.div>
            </div>

            {/* Mobile Toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden p-2 rounded-full hover:bg-muted transition-colors duration-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={mobileMenuOpen ? 'close' : 'open'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
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
            transition={{
              duration: 0.4,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="lg:hidden absolute top-full left-0 right-0 mt-2 mx-4 max-w-7xl"
          >
            <div className="bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-lg overflow-hidden">
              <nav className="py-4 flex flex-col gap-2 px-4">
                {navLinks.map((link, index) => {
                  const isActive = pathname === link.to;

                  return (
                    <motion.div
                      key={link.to}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: index * 0.08,
                        duration: 0.4,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      <Link
                        href={link.to}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          'block px-4 py-3 rounded-full text-sm font-medium transition-all duration-300',
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

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: navLinks.length * 0.08,
                    duration: 0.4,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="pt-2 mt-2 border-t border-border"
                >
                  <Button size="lg" className="w-full rounded-full" asChild>
                    <Link
                      href="/contact"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Contact Us
                    </Link>
                  </Button>
                </motion.div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
