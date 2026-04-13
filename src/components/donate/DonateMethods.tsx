// src/components/donate/DonateMethods.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Copy, Check, Coins, Building2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {
  containerVariants,
  fadeUpVariants,
  cardVariants,
  lineRevealVariants,
} from '@/static-data/motion-variants';

const FOOTER_DEEP_BLUE = 'oklch(0.396 0.195 264)';

interface DonationEntry {
  label: string;
  value: string;
  subLabel?: string;
}

interface DonationMethod {
  id: string;
  title: string;
  icon: React.ElementType;
  entries: DonationEntry[];
  note?: string;
}

const cryptoMethods: DonationMethod = {
  id: 'crypto',
  title: 'Crypto Donations',
  icon: Coins,
  entries: [
    {
      label: 'ADA (Cardano)',
      value: 'addr1v852x7k054zqww6pnxzmw8fn7hlg8aesmw5l2r8jurhhwrchx3c4s',
    },
    {
      label: 'USDT (Tether)',
      value: 'TCo4oh3o9QaZLYcwRzw2d4n8Ca6nfzJ2Nj',
      subLabel: 'TRC20',
    },
    {
      label: 'ETH (Ethereum)',
      value: '0xc0e60c9dd484f3184dd8053aef1a2e793e4a5de2',
      subLabel: 'Arbitrum',
    },
    { label: 'BTC (Bitcoin)', value: '15QmGAQs22WcYcsoHmDMEQsPa23hKsrZuj' },
  ],
};

const fiatMethods: DonationMethod = {
  id: 'fiat',
  title: 'Fiat Donations',
  icon: Building2,
  note: 'Please include your name/reference for acknowledgment.',
  entries: [
    {
      label: 'MTN MoMo',
      value: '0554424696',
      subLabel: 'Chosen Fintech Solutions (Yakubu Mustapha Mohammed)',
    },
    {
      label: 'Account Number',
      value: '9040011038322',
      subLabel: 'CHOSEN FINTECH SOLUTIONS · Stanbic Bank, Tamale Branch',
    },
    { label: 'Branch Code', value: 'GH190801' },
    { label: 'SWIFT/BIC Code', value: 'SBICGHAC' },
  ],
};

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.button
      onClick={handleCopy}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      aria-label={copied ? 'Copied' : 'Copy to clipboard'}
      className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={copied ? 'check' : 'copy'}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-400" />
          ) : (
            <Copy className="w-4 h-4 text-white/60" />
          )}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
}

function MethodCard({
  method,
  cardHoverBg,
}: {
  method: DonationMethod;
  cardHoverBg: string;
}) {
  const Icon = method.icon;
  return (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      className="relative group h-full"
    >
      <Card className="relative bg-[#252b3b] border border-[#2a3142] rounded-[5px] overflow-hidden h-full">
        <motion.div
          className="absolute inset-0 z-0"
          initial={{ scaleX: 0 }}
          variants={{
            hover: {
              scaleX: 1,
              transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
            },
          }}
          style={{ originX: 0, backgroundColor: cardHoverBg }}
        />

        <CardContent className="relative z-10 p-8 flex flex-col gap-6">
          {/* Card Header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10">
              <Icon className="w-full h-full text-primary group-hover:text-white transition-colors duration-300" />
            </div>
            <h3 className="font-display text-xl font-bold text-white">
              {method.title}
            </h3>
          </div>

          {/* Entries */}
          <div className="flex flex-col gap-4">
            {method.entries.map((entry) => (
              <div key={entry.label} className="flex flex-col gap-1">
                <span className="text-xs font-medium text-gray-400 group-hover:text-white/60 uppercase tracking-wider transition-colors duration-300">
                  {entry.label}
                  {entry.subLabel && (
                    <span className="normal-case tracking-normal ml-1 opacity-70">
                      · {entry.subLabel}
                    </span>
                  )}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white font-mono break-all leading-relaxed flex-1">
                    {entry.value}
                  </span>
                  <CopyButton value={entry.value} />
                </div>
              </div>
            ))}
          </div>

          {/* Note */}
          {method.note && (
            <p className="text-xs text-gray-400 group-hover:text-white/60 transition-colors duration-300 border-t border-white/10 pt-4">
              {method.note}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function DonateMethods() {
  // Mirror the WhatWeDo pattern for dark/light hover
  // The section bg is bg-foreground (dark navy in light, near-white in dark)
  // so we always want the deep blue for hover — same as WhatWeDo
  const cardHoverBg = FOOTER_DEEP_BLUE;

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={containerVariants}
      className="bg-foreground dark:bg-card py-16 md:py-24"
    >
      <div className="w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left sticky label */}
          <motion.div
            variants={fadeUpVariants}
            className="lg:col-span-3 lg:sticky lg:top-8 lg:self-start"
          >
            <h2 className="font-display dark:text-white text-3xl md:text-4xl font-bold text-background dark:text-[oklch(0.396_0.195_264)] leading-tight">
              WAYS
              <br />
              TO
              <br />
              GIVE
            </h2>

            <motion.div
              variants={lineRevealVariants}
              className="w-10 h-0.5 bg-background dark:bg-white mt-4 origin-left"
            />

            <p className="mt-4 text-gray-400 dark:text-muted-foreground leading-relaxed">
              Choose the method that works best for you. Every contribution is
              received with gratitude.
            </p>
          </motion.div>

          {/* Right: two cards */}
          <motion.div
            variants={containerVariants}
            className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-6 items-start"
          >
            <MethodCard method={cryptoMethods} cardHoverBg={cardHoverBg} />
            <MethodCard method={fiatMethods} cardHoverBg={cardHoverBg} />
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
