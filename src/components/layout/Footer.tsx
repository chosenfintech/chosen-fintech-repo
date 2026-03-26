import Link from 'next/link';
import { Facebook, Twitter, Linkedin, Youtube } from 'lucide-react';
import Image from 'next/image';

const footerLinks = {
  company: [
    { to: '/about', label: 'About Us' },
    { to: '/contact', label: 'Contact' },
  ],
  resources: [
    { to: '/blog', label: 'Blog' },
    { to: '/fintech-academy', label: 'Fintech Academy' },
    { to: '/faq', label: 'FAQ' },
  ],
  social: [
    { href: 'fb.com/chosenfintech', icon: Facebook, label: 'Facebook' },
    { href: 'x.com/chosenfintech', icon: Twitter, label: 'Twitter' },
    {
      href: 'https://www.linkedin.com/company/chosenfintech/',
      icon: Linkedin,
      label: 'LinkedIn',
    },
    { href: 'youtube.com/@cardanoghana', icon: Youtube, label: 'YouTube' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-foreground text-primary-foreground font-light">
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
                  <span className="font-display font-bold text-xl leading-tight">
                    Chosen Fintech
                  </span>
                  <span className="text-xs text-primary-foreground/60 uppercase tracking-wide">
                    SOLUTIONS
                  </span>
                </div>
              </Link>
              <p className="text-primary-foreground/70 max-w-sm leading-relaxed mb-6 text-sm lg:text-base">
                Educating, Onboarding and Empowering individuals and
                organisations to naviage digital technology for effective
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
                    className="flex items-center justify-center transition-all duration-300 hover:scale-110"
                    aria-label={item.label}
                  >
                    <item.icon size={26} strokeWidth={0.5} />
                  </a>
                ))}
              </div>
            </div>

            {/* Spacer for better layout on large screens */}
            <div className="hidden lg:block lg:col-span-1"></div>

            {/* Company Links */}
            <div className="lg:col-span-3">
              <h4 className="font-display font-semibold text-base lg:text-lg mb-4 lg:mb-6">
                Company
              </h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.to}>
                    <Link
                      href={link.to}
                      className="text-primary-foreground/70 hover:text-primary-foreground transition-colors duration-200 text-sm lg:text-base inline-block hover:translate-x-1"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Links */}
            <div className="lg:col-span-3">
              <h4 className="font-display font-semibold text-base lg:text-lg mb-4 lg:mb-6">
                Resources
              </h4>
              <ul className="space-y-3">
                {footerLinks.resources.map((link) => (
                  <li key={link.to}>
                    <Link
                      href={link.to}
                      className="text-primary-foreground/70 hover:text-primary-foreground transition-colors duration-200 text-sm lg:text-base inline-block hover:translate-x-1"
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
        <div className="border-t border-primary-foreground/10">
          <div className="py-6 lg:py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-primary-foreground/50 text-xs lg:text-sm text-center sm:text-left">
              © {new Date().getFullYear()} Chosen Fintech. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-primary-foreground/50 text-xs lg:text-sm">
              <a
                href="mailto:info@chosenfintech.org"
                className="hover:text-primary-foreground transition-colors duration-200 hover:underline"
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
