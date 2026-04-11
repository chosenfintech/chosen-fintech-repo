// src/static-data/projects.ts
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
    content: `
<h2>Project KPIs and Addressing Strategies</h2>

<h3>Problem Statement</h3>
<p>
  The Cardano community in Ghana has been growing since 2021. However, there is no local community
  to house these members, making access to information difficult for most community members.
</p>

<h3>Solution</h3>
<p>
  To create an online community for Cardano innovators and newbies in Ghana to drive Cardano
  adoption and community growth, via content creation, translation, Cardano meetups, and community
  management.
</p>

<h3>Outcomes</h3>
<ul>
  <li><strong>Community Growth:</strong> Exceeded target by 20% through active social media campaigns and community-driven events.</li>
  <li><strong>Knowledge Transfer:</strong> Regular workshops facilitated knowledge transfer, ensuring community members were well-versed in Cardano use cases and the Project Catalyst experiment.</li>
  <li><strong>Sustainability:</strong> Implemented a sustainability plan, including local partnerships for ongoing support.</li>
</ul>

<h2>Key Achievements</h2>

<h3>Milestone 1 — Official Launch of the Cardano Ghana Community</h3>
<p>
  In a spectacular event held at the <strong>Maryam Dialogue Centre in Tamale</strong>, we proudly
  marked the official launch of the Cardano Ghana Community in <strong>November 2023</strong>. The
  atmosphere buzzed with excitement as over 200 enthusiasts gathered to celebrate this significant
  moment.
</p>

<h4>Attendance Highlights</h4>
<ul>
  <li><strong>In-Person:</strong> 100+ passionate individuals joined us on-site, fostering connections and building the foundation for a vibrant Cardano community in Ghana.</li>
  <li><strong>Virtual Participation:</strong> The event's reach extended beyond the venue, engaging an online audience eager to follow the launch updates and videos. Our <a href="https://fb.com/cardanoghana" target="_blank" rel="noopener noreferrer">Cardano Ghana Facebook page</a> was pivotal in connecting with enthusiasts globally.</li>
</ul>

<h4>Event Highlights</h4>
<ul>
  <li><strong>Venue:</strong> Maryam Dialogue Centre, Tamale</li>
  <li><strong>Atmosphere:</strong> Charged with enthusiasm, curiosity, and a shared passion for Cardano's blockchain innovation</li>
  <li><strong>Engagement:</strong> Interactive sessions, discussions, and a collective excitement for the future of Cardano in Ghana</li>
</ul>

<h4>Digital Experience</h4>
<p>
  Our Facebook page became the virtual hub for live updates and exclusive videos for those unable to
  attend in person. Join the community and stay connected:
  <a href="https://fb.com/cardanoghana" target="_blank" rel="noopener noreferrer">Cardano Ghana on Facebook</a>.
</p>
    `,
  },
  {
    id: '2',
    slug: 'scale-up-icp-ghana',
    imageUrl: '/scale-up-icp-logo.png',
    title: 'Scale-UP ICP Ghana',
    description:
      'Scale-UP ICP Ghana empowers the next generation of Web3 founders and developers in Ghana by providing hands-on training, mentorship, and access to the Internet Computer Protocol ecosystem.',
    content: `
<h2>About the Programme</h2>
<p>
  The Internet Computer Protocol (ICP) represents a paradigm shift in how software is built and
  deployed — moving applications entirely on-chain and eliminating the need for traditional cloud
  infrastructure. Scale-UP ICP Ghana is at the forefront of bringing this vision to Ghanaian
  developers and entrepreneurs.
</p>

<h2>What We Do</h2>
<p>
  Through a structured accelerator programme, Scale-UP ICP Ghana guides participants from the
  fundamentals of Web3 all the way through to building and deploying production-ready decentralised
  applications. Cohorts receive:
</p>
<ul>
  <li>Mentorship from experienced ICP developers</li>
  <li>Access to global ICP community resources</li>
  <li>Opportunities to pitch for funding</li>
</ul>

<h2>Our Collaboration</h2>
<p>
  Our work with Scale-UP ICP Ghana has centred on programme coordination, content development, and
  community building. We have helped design curriculum materials, facilitated workshops, and
  supported participants in navigating the ICP developer ecosystem.
</p>

<h2>Impact So Far</h2>
<p>
  The programme has already produced several promising startups building on ICP, with solutions
  spanning:
</p>
<ul>
  <li>Decentralised finance</li>
  <li>Identity management</li>
  <li>Digital content distribution</li>
</ul>
<p>All tailored to the Ghanaian and broader West African context.</p>
    `,
  },
  {
    id: '3',
    slug: 'bch-house-ghana',
    imageUrl: '/bch-house-logo.jpeg',
    title: 'BCH House, Ghana',
    description:
      'BCH House Ghana is a dedicated hub for Bitcoin Cash education, adoption, and peer-to-peer commerce, fostering financial inclusion through practical cryptocurrency use cases.',
    content: `
<h2>Our Mission</h2>
<p>
  BCH House Ghana was established to make peer-to-peer electronic cash a practical reality for
  everyday Ghanaians. While much of the global crypto conversation centres on speculation and
  investment, BCH House takes a different approach — focusing on real utility, everyday transactions,
  and financial empowerment for the unbanked.
</p>

<h2>What We Offer</h2>
<p>
  The hub runs regular educational sessions covering:
</p>
<ul>
  <li>Bitcoin Cash fundamentals</li>
  <li>How to send and receive BCH</li>
  <li>How merchants can accept BCH as payment</li>
</ul>
<p>
  These sessions are deliberately designed for non-technical audiences, using plain language and
  relatable local examples to bridge the gap between crypto theory and everyday life.
</p>

<h2>Our Involvement</h2>
<p>Our work with BCH House Ghana has included:</p>
<ul>
  <li>Supporting their outreach efforts</li>
  <li>Developing accessible educational content</li>
  <li>Helping coordinate merchant adoption drives in local markets</li>
</ul>
<p>
  The goal is to build a self-sustaining ecosystem where BCH circulates within communities rather
  than simply being held as a speculative asset.
</p>

<h2>Why It Matters</h2>
<p>
  BCH House Ghana represents an important experiment in grassroots crypto adoption. Its progress
  offers valuable lessons for the broader African blockchain community about what genuine financial
  inclusion through cryptocurrency can look like.
</p>
    `,
  },
];
