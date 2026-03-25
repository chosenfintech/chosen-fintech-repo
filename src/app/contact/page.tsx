'use client';

import { PageHero } from '@/components/sections/PageHero';
import { Mail, MapPin, Phone } from 'lucide-react';
import { motion, Variants } from 'motion/react';
import { NavBar } from '@/components/layout/NavBar';
import { Footer } from '@/components/layout/Footer';

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'info@chosenfintech.org',
    href: 'mailto:info@chosenfintech.org',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+233 245 870 928',
    href: 'tel:+233546488115',
  },
  {
    icon: MapPin,
    label: 'Address',
    value: 'Tmala, Ghana',
    href: null,
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

const iconVariants: Variants = {
  hover: {
    scale: 1.1,
    rotate: [0, -10, 10, -10, 0],
    transition: {
      duration: 0.5,
    },
  },
  tap: {
    scale: 0.95,
  },
};

const Contact = () => {
  return (
    <div>
      <NavBar />
      <PageHero title="Contact Us" />

      {/* Contact Info Section */}
      <section className="py-16 lg:py-24">
        <div className="w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-12"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {contactInfo.map((item) => (
              <motion.div
                key={item.label}
                className="flex flex-col items-center text-center p-6 md:p-0 rounded-2xl border border-border bg-card shadow-sm md:border-none md:bg-transparent md:shadow-none"
                variants={itemVariants}
                whileHover={{ y: -8 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <motion.div
                  className="group mb-4 md:mb-6"
                  whileHover="hover"
                  whileTap="tap"
                >
                  <motion.div
                    className="w-12 h-12 md:w-16 md:h-16 lg:w-20 cursor-pointer lg:h-20 rounded-xl bg-primary flex items-center justify-center transition-all duration-300 group-hover:bg-background group-hover:outline group-hover:outline-primary"
                    variants={iconVariants}
                  >
                    <item.icon className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-primary-foreground transition-colors duration-300 group-hover:text-primary" />
                  </motion.div>
                </motion.div>

                <motion.h3
                  className="font-display text-lg md:text-xl lg:text-2xl font-bold text-foreground mb-2 md:mb-3"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {item.label}
                </motion.h3>

                {item.href ? (
                  <motion.a
                    href={item.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm lg:text-base"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {item.value}
                  </motion.a>
                ) : (
                  <motion.p
                    className="text-muted-foreground text-sm lg:text-base"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {item.value}
                  </motion.p>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Contact;
