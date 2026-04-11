export interface Project {
  id: string;
  slug: string;
  imageUrl: string;
  title: string;
  description: string;
  content: string;
}

export const projects: Project[] = [
  {
    id: '1',
    slug: 'cardano-ghana',
    imageUrl: '/cardano-ghana-community.png',
    title: 'Cardano Ghana',
    description:
      'Cardano Ghana is a grassroots community dedicated to growing blockchain education and adoption across Ghana through events, workshops, and developer engagement.',
    content: `Cardano Ghana was founded with a simple but powerful mission: to make blockchain technology accessible to every Ghanaian, regardless of technical background. From Accra to Kumasi, the community has been running meetups, developer bootcamps, and public awareness campaigns that demystify decentralized technologies.

The community sits at the intersection of finance, technology, and social impact. Members range from curious students to seasoned software engineers, all united by a shared belief that blockchain infrastructure can unlock new economic opportunities for Ghana and the wider African continent.

Our partnership with Cardano Ghana has focused on building educational resources, coordinating events, and amplifying community voices through digital platforms. Together, we have helped onboard hundreds of new community members and supported local developers in building on the Cardano blockchain.

Looking ahead, Cardano Ghana continues to expand its reach, with plans to launch regional chapters and a dedicated developer grant programme to fund locally-built solutions on Cardano.`,
  },
  {
    id: '2',
    slug: 'scale-up-icp-ghana',
    imageUrl: '/scale-up-icp-logo.png',
    title: 'Scale-UP ICP Ghana',
    description:
      'Scale-UP ICP Ghana empowers the next generation of Web3 founders and developers in Ghana by providing hands-on training, mentorship, and access to the Internet Computer Protocol ecosystem.',
    content: `The Internet Computer Protocol (ICP) represents a paradigm shift in how software is built and deployed — moving applications entirely on-chain, eliminating the need for traditional cloud infrastructure. Scale-UP ICP Ghana is at the forefront of bringing this vision to Ghanaian developers and entrepreneurs.

Through a structured accelerator programme, Scale-UP ICP Ghana guides participants from the fundamentals of Web3 all the way through to building and deploying production-ready decentralised applications. Cohorts receive mentorship from experienced ICP developers, access to global ICP community resources, and opportunities to pitch for funding.

Our collaboration with Scale-UP ICP Ghana has centred on programme coordination, content development, and community building. We have helped design curriculum materials, facilitated workshops, and supported participants in navigating the ICP developer ecosystem.

The programme has already produced several promising startups building on ICP, with solutions spanning decentralised finance, identity management, and digital content distribution — all tailored to the Ghanaian and broader West African context.`,
  },
  {
    id: '3',
    slug: 'bch-house-ghana',
    imageUrl: '/bch-house-logo.jpeg',
    title: 'BCH House, Ghana',
    description:
      'BCH House Ghana is a dedicated hub for Bitcoin Cash education, adoption, and peer-to-peer commerce, fostering financial inclusion through practical cryptocurrency use cases.',
    content: `BCH House Ghana was established to make peer-to-peer electronic cash a practical reality for everyday Ghanaians. While much of the global crypto conversation centres on speculation and investment, BCH House takes a different approach — focusing on real utility, everyday transactions, and financial empowerment for the unbanked.

The hub runs regular educational sessions covering Bitcoin Cash fundamentals, how to send and receive BCH, and how merchants can accept it as payment. These sessions are deliberately designed for non-technical audiences, using plain language and relatable local examples to bridge the gap between crypto theory and everyday life.

Our involvement with BCH House Ghana has included supporting their outreach efforts, developing accessible educational content, and helping coordinate merchant adoption drives in local markets. The goal is to build a self-sustaining ecosystem where BCH circulates within communities rather than simply being held as a speculative asset.

BCH House Ghana represents an important experiment in grassroots crypto adoption, and its progress offers valuable lessons for the broader African blockchain community about what genuine financial inclusion through cryptocurrency can look like.`,
  },
];
