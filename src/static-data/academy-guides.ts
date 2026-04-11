// src/static-data/academy-guides.ts
import { Wallet, Coins, Vote, Code, Shield, BookOpen } from 'lucide-react';

export interface IAcademyGuide {
  id: string;
  slug: string;
  icon: React.ElementType;
  title: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  image: string;
  content: string;
}

export const academyGuides: IAcademyGuide[] = [
  {
    id: '1',
    slug: 'getting-started-with-cardano',
    icon: Wallet,
    title: 'Getting Started with Cardano',
    description:
      'Learn the basics: what is Cardano, how to set up a wallet, and buy your first ADA.',
    level: 'Beginner',
    image:
      'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80',
    content:
      "Cardano is a third-generation proof-of-stake blockchain platform founded on peer-reviewed research and developed using evidence-based methods. Unlike earlier blockchains, Cardano is built with a layered architecture that separates the settlement layer from the computation layer, making it more secure and flexible. To get started, you will need a compatible wallet such as Lace, Eternl, or Nami. Once your wallet is set up, you can purchase ADA — Cardano's native currency — through any major cryptocurrency exchange. ADA can be used to pay transaction fees, participate in staking, and interact with decentralized applications on the network.",
  },
  {
    id: '2',
    slug: 'staking-and-delegation',
    icon: Coins,
    title: 'Staking & Delegation',
    description:
      'Understand how to stake your ADA, choose stake pools, and earn passive rewards.',
    level: 'Beginner',
    image:
      'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&q=80',
    content:
      "Staking on Cardano allows ADA holders to participate in the network's consensus mechanism and earn rewards in return. Unlike some other blockchains, Cardano uses a delegation model — you do not lock up or risk your ADA. Instead, you delegate your stake to a stake pool of your choice, and the pool operator runs the infrastructure on your behalf. Rewards are distributed every epoch, which lasts five days. When choosing a stake pool, consider factors such as pool saturation, pledge amount, and historical performance. You can redelegate at any time without fees or waiting periods.",
  },
  {
    id: '3',
    slug: 'project-catalyst-and-governance',
    icon: Vote,
    title: 'Project Catalyst & Governance',
    description:
      "Participate in Cardano's decentralized governance and vote on funding proposals.",
    level: 'Intermediate',
    image:
      'https://images.unsplash.com/photo-1642104704074-907c0698cbd9?w=800&q=80',
    content:
      "Project Catalyst is one of the world's largest decentralized innovation funds, designed to drive the growth of the Cardano ecosystem. Community members can submit proposals for projects that benefit the ecosystem, and ADA holders vote on which proposals receive funding from the Cardano treasury. Participation requires registering your voting power using a compatible wallet and the Catalyst Voting app. Beyond Catalyst, Cardano's broader governance model — known as Voltaire — is progressively giving the community full control over protocol parameters, treasury spending, and network upgrades through an on-chain governance framework.",
  },
  {
    id: '4',
    slug: 'smart-contracts-on-cardano',
    icon: Code,
    title: 'Smart Contracts on Cardano',
    description:
      'Introduction to Plutus and Marlowe for building decentralized applications.',
    level: 'Advanced',
    image:
      'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=800&q=80',
    content:
      'Cardano supports smart contracts through two primary languages: Plutus and Marlowe. Plutus is a purpose-built smart contract language based on Haskell, offering strong formal verification guarantees and a high degree of security. It is suited for developers who want fine-grained control over on-chain logic. Marlowe, on the other hand, is a domain-specific language designed for financial contracts, making it accessible to non-programmers through a visual drag-and-drop interface. Both languages compile down to Plutus Core, which runs on the Cardano Virtual Machine. The extended UTXO model that Cardano uses gives smart contracts predictable transaction costs and deterministic execution.',
  },
  {
    id: '5',
    slug: 'nfts-on-cardano',
    icon: Shield,
    title: 'NFTs on Cardano',
    description:
      'Explore the native NFT ecosystem, marketplaces, and how to mint your own NFTs.',
    level: 'Intermediate',
    image:
      'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800&q=80',
    content:
      "Cardano has a thriving native NFT ecosystem built on its multi-asset ledger, which allows tokens — including NFTs — to be minted without the need for smart contracts, unlike Ethereum's ERC-721 standard. This makes Cardano NFTs cheaper and simpler to create while inheriting the full security of the base layer. Popular marketplaces include jpg.store, the largest Cardano NFT marketplace, where you can buy, sell, and explore collections. To mint your own NFT, you will need a minting policy, a wallet with some ADA for transaction fees, and metadata structured according to the CIP-25 standard. Projects range from generative art and gaming assets to real-world asset tokenization.",
  },
  {
    id: '6',
    slug: 'defi-on-cardano',
    icon: BookOpen,
    title: 'DeFi on Cardano',
    description:
      'Navigate DEXs, lending protocols, and yield opportunities in the Cardano ecosystem.',
    level: 'Intermediate',
    image:
      'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=800&q=80',
    content:
      'Decentralized Finance on Cardano has grown significantly since the introduction of smart contracts. The ecosystem includes decentralized exchanges such as Minswap, SundaeSwap, and WingRiders, where you can swap tokens, provide liquidity, and earn trading fees. Lending and borrowing protocols like Liqwid Finance allow users to supply ADA and other assets as collateral to earn interest or take out loans. Yield aggregators and stablecoin projects are also emerging, offering more sophisticated strategies for experienced DeFi participants. As with all DeFi activity, it is important to understand the risks involved, including smart contract vulnerabilities, impermanent loss, and liquidity risk, before committing funds.',
  },
];
