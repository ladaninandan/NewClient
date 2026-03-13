/**
 * Default site configuration.
 * layout: 'workshop' | 'strategy' — strategy = RRTCS/Business Clarity theme (Tailwind).
 * Admin panel can override via Supabase.
 */
export const defaultConfig = {
  layout: 'strategy', // 'workshop' = Rajiv workshop style, 'strategy' = RRTCS Business Clarity style
  logo: '',

  // Strategy layout (Rahul Revne Business Clarity Session) — all editable in admin
  strategyLayout: {
    sectionOrder: [
      'topVideo',
      'whyScale',
      'problem',
      'founderTrap',
      'coach',
      'learn',
      'founderModel',
      'whyDifferent',
      'testimonials',
      'feedback',
      'forNotFor',
      'pricing',
      'priceJustification',
      'form',
      'moneyBackGuarantee',
      'faq',
      'footer',
    ],
    sectionVisibility: {},
    theme: {
      primary: '#f77c18',
      accent: '#f77c18',
      accentHover: '#e66b0a',
      backgroundLight: '#f8f7f5',
      backgroundDark: '#064e3b',
      cardDark: '#1e3a32',
    },
    nav: { logo: '', brandShort: 'RR.', brandName: 'Rahul Revne', ctaText: 'Book Now' },
    topVideo: {
      badge: 'Limited Time Strategy Session',
      headline: 'Is Your Business Running Because Of You… Or Despite You?',
      video: '',
      subtext: 'Transform your business from founder-dependent to data-driven. Get the roadmap to scaling without burnout.',
      ctaText: 'Reserve My ₹199 Strategy Session',
      slotNote: 'Limited slots available for this month',
    },
    hero: {
      badge: '1-to-1 Clarity Session',
      headline: 'Is Your Business Running Because Of You…',
      headlineHighlight: 'Or Despite You?',
      subtext: 'Stop being the bottleneck. Transform your Indian business from chaos to clarity with a high-impact 1-to-1 Strategy Session.',
      ctaText: 'Reserve My ₹199 Strategy Session',
      slotNote: 'Limited slots available for this month',
    },
    offerCard: {
      price: '₹199',
      items: [
        { title: 'Personalized Business Audit', desc: "We'll identify exactly where you are stuck." },
        { title: '90-Minute Strategic Roadmap', desc: 'Step-by-step plan to automate operations.' },
        { title: 'Scale-Up Blueprint', desc: 'Indian-market specific scaling strategies.' },
      ],
    },
    problem: {
      title: 'Are You Facing These Problems In Your Business?',
      items: [
        'Business cannot run without you',
        'Team lacks ownership',
        'Processes are unclear',
        'Revenue leaks happening silently',
        'Founder stuck in daily operations',
        'No clear systems for scaling',
      ],
      endLine: 'If this sounds familiar, you are not alone.',
    },
    whyScale: {
      title: 'Why Most Businesses In India Never Scale',
      cards: [
        { icon: 'person_off', title: 'Owner Reliance', desc: "Everything stops when you take a day off. You've created a job, not a business." },
        { icon: 'account_tree', title: 'Lack of Systems', desc: 'Processes are stored in your head. Scaling is impossible because nobody else knows how to do it.' },
        { icon: 'trending_flat', title: 'Plateaued Growth', desc: "You've hit a ceiling. You're working harder, but your revenue isn't moving proportionately." },
        { icon: 'group_off', title: 'No Delegation', desc: "You don't trust others with key tasks. Every decision still flows through you, creating a bottleneck." },
        { icon: 'psychology', title: 'Mindset Trap', desc: "You're stuck in 'doer' mode. Scaling requires thinking like an architect, not the chief executor." },
        { icon: 'schedule', title: 'Time Poverty', desc: "You're always firefighting. No time to build systems, so the same crises repeat every month." },
      ],
    },
    founderTrap: {
      title: 'The Founder Dependency Trap',
      text: 'In India, most entrepreneurs take pride in "being everywhere." But this is exactly what kills your growth. If you are the best technician, the best salesperson, and the best accountant in your company—you are the bottleneck.',
      image: '',
      warningItems: [
        'You work IN the business, not ON it.',
        'Decision fatigue is affecting your personal life.',
      ],
    },
    coach: {
      label: 'The Strategist',
      name: 'Rahul Revne',
      heading: 'Meet Rahul Revne',
      bio: 'Rahul Revne is a seasoned Business Coach and Author with 15+ years of experience in the Indian entrepreneurial ecosystem.\n\nHe has mentored over 500+ MSME owners to transition from being self-employed to becoming true CEOs through his unique "Freedom Framework."',
      stats: [
        { value: '15+', label: 'Years Experience' },
        { value: '500+', label: 'Success Stories' },
      ],
      image: '',
      ctaText: 'Learn More About Rahul',
    },
    learn: {
      title: 'What You Will Learn In The 1-to-1 Session',
      subtitle: 'A deep dive into your business operations and scaling potential.',
      items: [
        { icon: 'psychology', text: 'The Mindset shift from Worker to Architect.' },
        { icon: 'architecture', text: 'Designing SOPs that actually work.' },
        { icon: 'groups', text: 'How to hire and trust your first managers.' },
        { icon: 'analytics', text: 'Reading financial health beyond just turnover.' },
        { icon: 'rocket_launch', text: 'Strategic delegation techniques.' },
        { icon: 'distance', text: 'Scaling without losing quality control.' },
      ],
    },
    founderModel: {
      title: 'The Founder Freedom Model',
      subtitle: 'The 4 stages of business evolution',
      steps: [
        { num: 1, title: 'Self-Employed', desc: 'The business is YOU. You do everything.' },
        { num: 2, title: 'Manager-Led', desc: 'You have help, but you still make every call.' },
        { num: 3, title: 'System-Driven', desc: 'Processes guide the team. You monitor.' },
        { num: 4, title: 'Freedom State', desc: 'The business grows while you focus on vision.', highlight: true },
      ],
    },
    whyDifferent: {
      title: 'Why This Session Is Different?',
      quote: '"Most consultants give you \'strategies.\' I give you implementation. We don\'t just talk about theories; we look at your actual spreadsheet, your actual team, and your actual bottlenecks to build a real-world exit strategy for you from the daily grind."',
    },
    testimonials: {
      title: 'What Founders Say',
      items: [
        { name: 'Rajesh K.', role: 'Manufacturing, Pune', text: 'The session gave me a clear roadmap. I implemented one process and saved 10 hours a week.' },
        { name: 'Priya M.', role: 'Services, Bangalore', text: 'Finally someone who understood the Indian MSME reality. Not theory—actual steps I could take.' },
        { name: 'Vikram S.', role: 'Retail, Delhi NCR', text: 'Worth every rupee. I now have a delegation plan and my team is taking ownership.' },
      ],
    },
    feedback: {
      label: 'Feedbacks',
      title: 'Here are some Real Screenshots & Feedbacks',
      items: [
        { name: 'Shanmuganathan C', role: 'Spider India', text: "Rajiv's training completely changed the way I've been doing my business for the last 20 years. I was wondering how do I grow, how do I build large organization, he gave all the answers and gave that one needed clarity of lifetime. Thanks to him and his team." },
        { name: 'Nipun Chadha', role: 'Chadha Industries Pvt. Ltd. (aRKe Group)', text: "It's been an amazing learning experience so far with Rajiv and his team. Their insights are rock solid and help you streamline and improve all functions of the business. Can't recommend him enough! This should be mandatory for all SME's!" },
        { name: 'Ramakrishnan K', role: 'Iyers Kitchen', text: 'Rajiv and Team provide an amazing service in business coaching. They want to keep adding value to their clients at every given point of time. They are very valuable to all business owners.' },
        { name: 'Marzban Irani', role: 'Ardeshir and Sons', text: 'Rajiv Talreja is one of the few business coaches in the world who has gone that extra mile to create a program that goes to the very essence of taking entrepreneurship to the next level.' },
      ],
    },
    forNotFor: {
      forTitle: 'Who This Is For',
      forItems: [
        'Service or Product business owners with 3+ employees.',
        'Founders tired of micro-managing every small detail.',
        'Action-takers ready to change how they work.',
      ],
      forBg: '#ecfdf5',
      forBorder: '#a7f3d0',
      forTitleColor: '#065f46',
      forTextColor: '#334155',
      forIconColor: '#059669',
      notForTitle: 'Who This Is Not For',
      notForItems: [
        'People looking for a "Get Rich Quick" scheme.',
        'Freelancers who don\'t want to build a team.',
        'Business owners unwilling to share their current numbers.',
      ],
      notForBg: '#fef2f2',
      notForBorder: '#fecaca',
      notForTitleColor: '#991b1b',
      notForTextColor: '#334155',
      notForIconColor: '#dc2626',
    },
    priceJustification: {
      title: 'Why This Session Is Only ₹199',
      explain: 'Normally consulting sessions cost thousands.\n\nBut this session is offered at ₹199 so business owners can experience the process.',
      ctaText: 'Reserve My ₹199 Strategy Session',
    },
    pricing: {
      title: 'Start Your Transformation',
      originalPrice: '₹4,999',
      price: '₹199',
      note: 'This is a symbolic commitment fee. My goal is to work with dedicated founders, not spectators.',
      ctaText: 'Reserve My ₹199 Strategy Session',
      ribbonText: 'BEST VALUE',
      secureText: '100% Secure Checkout',
    },
    stickyBar: {
      enabled: true,
      price: '₹99',
      originalPrice: '₹999',
      buttonText: 'BOOK YOUR SPOT NOW AT ₹99/-',
      countdownLabel: 'Offer Ends in 14:40 Mins',
      countdownEnd: '', // optional: ISO date string for live countdown (e.g. "2025-03-15T23:59:59")
    },
    moneyBackGuarantee: {
      title: 'Still Not Sure? We got your Back!',
      subheading: 'Our Guarantee',
      description: "Get this amazing offer today for just Rs 99, and get a money-back guarantee. Join today, go through our seminar and if you don't like it for any reason, simply send us an email and we'll refund every penny - no questions asked!",
      ctaText: 'REGISTER NOW AT ₹99/- ONLY',
      image: '', // badge image URL
    },
    faq: {
      title: 'Frequently Asked Questions',
      items: [
        { q: 'How long is the session?', a: 'The Clarity Session typically lasts between 75 to 90 minutes. We dive deep into your specific business challenges.' },
        { q: 'Will I get a recording?', a: 'Yes, the session is conducted over Zoom, and a full recording along with the notes will be provided to you.' },
        { q: 'Why is it only ₹199?', a: 'I want to eliminate the barrier to entry for serious entrepreneurs. Once you experience the value of a structured approach, you might want to explore long-term coaching (no pressure!).' },
      ],
    },
    footer: {
      headline: 'Ready to exit the grind?',
      ctaText: 'Book My Strategy Session Now',
      copyright: '© 2024 Rahul Revne. All Rights Reserved.',
      links: [
        { label: 'Privacy Policy', url: '#' },
        { label: 'Terms of Service', url: '#' },
      ],
    },
  },

  title: 'Join and Become Like The Top 1% Successful Business Owners & Entrepreneurs',
  subtitle: 'Register Now for Free',

  theme: {
    primaryColor: '#FF7043',
    primaryHover: '#E85A2E',
    secondaryColor: '#2C3E50',
    backgroundColor: '#F8F8F8',
    textColor: '#212529',
    textMuted: '#6C757D',
  },

  ctaButtonText: 'Register Now at ₹99/- Only',
  registerPrice: '₹99',
  originalPrice: '₹999',
  bonusesWorth: 'Rs 6,487',

  bannerText: '4 HOUR ONLINE WORKSHOP',
  bannerFullText: '4 hour Online Workshop ON 11th March 2026 (9:00 AM - 1:00 PM IST)',
  subHeadline: 'Before its too late...',
  coachIntro: 'I will be your coach for 4 hours',
  offerEndsLabel: 'Offer Ends In',
  registerInNextLabel: 'Register In Next',
  toUnlockBonusesLabel: 'To Unlock Bonuses Worth',

  instructor: {
    image: '',
    greeting: 'Hello, I Am',
    name: 'Rajiv Talreja',
    title: "India's MSME Business Coach",
    tagline: "Asia's Leading Business Success Coach",
    stats: 'Trained over 7,88,175 Business Owners in Last 6 Years',
    rating: '4.96',
    reviewText: '70,000+ People Rated My Programs with 4.96 Star',
    yearsExperience: '18',
    entrepreneursReached: '2.3M+',
    seminarsConducted: '600+',
    socialFollowing: '1.9M+',
    paidCustomers: '700K',
    liveCommunity: '20K+',
    coachingClients: '2.8K+',
    industriesWorked: '196+',
    inhouseCoaches: '52',
    countriesTrained: '7',
  },

  eventDate: '11th March 2026',
  eventTime: '9:00 AM - 1:00 PM (IST)',
  countdownEndDate: '2026-03-11T09:00:00',

  featuredLogos: [],

  benefits: [
    { text: 'You Unlock **Secrets To Create Time & Wealth** In Business', icon: 'person' },
    { text: 'You Learn Strong Foundational Activites To **Win In Your Business**', icon: 'chart' },
    { text: 'Your Business Growth With **Increased Revenue & Cashflow**', icon: 'bars3' },
    { text: '**More Profit, More Freedom, More Scale** Is Guaranteed If You Follow Workshop', icon: 'bars4' },
  ],
  languageNote: 'Language - Basic English',

  whatWillChange: {
    title: 'What Will Change In Your Business?',
    centerLabel: 'Business Breakthrough',
    items: [
      { text: 'Right Psychology Of Running The Business', position: 'top' },
      { text: 'Right Systems', position: 'left' },
      { text: 'Right Strategies', position: 'right' },
    ],
    ctaText: 'REGISTER NOW AT ₹99/- ONLY',
    diagramImage: '', // optional: upload in admin to show custom image instead of diagram
  },

  targetAudience: {
    title: 'Who This Workshop Will Help The Best?',
    titleLine2: 'Help The Best?',
    dontJoinLabel: "DON'T JOIN IF",
    items: [
      'You Are Not A Business Owner',
      'You Are Not An Action Taker',
      'You Are Not Serious About Your Business',
    ],
    ctaText: 'REGISTER NOW AT ₹99/- ONLY',
    image: '', // optional: upload in admin to show custom image instead of diagram
  },

  learningOutcomes: {
    title: 'What You Will Learn In 4 Hrs?',
    items: [
      { number: '01', title: '7 Foundational Activities used by successful entrepreneurs', desc: 'Which You can COPY to build a Stable and Scalable Business.' },
      { number: '02', title: '3 ingredients you need to focus on', desc: 'To build a business that can grow without you.' },
      { number: '03', title: 'How To Build Your Front-Line Leaders', desc: 'Understand the step-by-step process of building your second line of leaders that you can implement immediately.' },
      { number: '04', title: 'How to retain employees', desc: 'Strategies and systems that you can implement to make sure you create an environment for employees to work longer so that you can focus on strategic business growth. Strategies are applicable to ALL types of businesses, regardless of industry or team size.' },
    ],
  },

  bonuses: {
    title: 'Bonuses If You Register Before Timer Hits 0',
    productImages: [],
  },

  recapBonuses: {
    title: 'Recap Of What You Will Get On Registering',
    totalValue: '₹7,486',
    regularPrice: '₹999',
    todayPrice: '₹99',
    items: [
      { title: '6 Tips To Build A High Performance Team', price: '499/-' },
      { title: '5 Things To Get Right Before You Start Marketing', price: '499/-' },
      { title: '7 Wrong Sales Mindsets That You Must Avoid In Business', price: '499/-' },
      { title: '6 Ultimate Ds Every Business Owner Needs To Learn', price: '499/-' },
      { title: '5 Ts For Consistent Growth', price: '499/-' },
      { title: '4 Different Ways Innovate Your Business', price: '499/-' },
      { title: '4 Ts of Investing In Your Business', price: '499/-' },
      { title: '5 Strategies To Expand Business', price: '499/-' },
      { title: '8 Cs You Need To Build A Team From Scratch', price: '499/-' },
      { title: 'How To Place The Right Price For Your Product?', price: '499/-' },
      { title: 'The BEST Method To Give Feedback & 5 Don\'ts of Feedback', price: '499/-' },
      { title: 'How to Stay Motivated in Your Business', price: '499/-' },
    ],
  },

  testimonials: {
    title: 'Trusted by Top Voices',
    subtitle: 'Listen Stories Of Success From Other People I have Worked With',
    items: [
      { quote: "Rajiv's training completely changed the way I've been doing my business for the last 20 years. I was wondering how do I grow, how do I build large organization, he gave all the answers and gave that one needed clarity of lifetime. Thanks to him and his team.", name: 'Shanmuganathan C', company: 'Spider India' },
      { quote: "It's been an amazing learning experience so far with Rajiv and his team. Their insights are rock solid and help you streamline and improve all functions of the business. Can't recommend him enough! This should be mandatory for all SME's!", name: 'Nipun Chadha', company: 'Chadha Industries Pvt. Ltd. (aRKe Group)' },
      { quote: 'Rajiv and Team provide an amazing service in business coaching. They want to keep adding value to their clients at every given point of time. They are very valuable to all business owners.', name: 'Ramakrishnan K', company: 'Iyers Kitchen' },
      { quote: 'Rajiv Talreja is one of the few business coaches in the world who has gone that extra mile to create a program that goes to the very essence of taking entrepreneurship to the next level.', name: 'Marzban Irani', company: 'Ardeshir and Sons' },
    ],
  },

  meetCoach: {
    title: 'Meet Your Coach',
    missionTitle: "I'm On A MISSION To Help 1 Million Business Owners Achieve Profit & Growth",
    missionSubtitle: "Because I've been through a lot of struggle myself...",
  },

  guarantee: {
    title: 'Our Guarantee',
    text: 'Get this amazing offer today for just Rs 99, and get a money – back guarantee. Join today, go through our seminar and if you don\'t like it for any reason, simply send us an email and we\'ll refund every penny – no questions asked!',
    promiseTitle: 'A Promise',
    promiseSubtitle: 'No Questions Asked Money Back Guarantee',
    promiseLetter: "Dear Sir / Ma'am, I am here to help you grow your business, and I am here to share extremely valuable secrets and insights which have impacted 50 Million+ people overall, and I personally ensure everyone who comes and attends my workshops gets more than they expected. If after attending the workshop, you still don't find enough value for some reason, I take complete responsibility and ownership of that and hence, I promise to give a complete refund of the workshop amount of Rs 99. All you have to do is mail to me at rajivtalreja@quantumleap.co.in and my team will ensure you are provided with a refund in the shortest amount of time. Your's",
  },

  faq: {
    title: 'Frequently Asked Questions',
    items: [
      { q: "How I'll get the link to attend the program?", a: 'You will get an email right after you register. Do check the spam and promotions tab just in case it landed there.' },
      { q: "How I'll get the bonus items?", a: 'Bonuses will be distributed exclusively to participants who attend and successfully complete the workshop.' },
      { q: 'Why does this program cost only ₹99?', a: 'The fee is just to make sure to get a commitment from you that you will be there. It is not the value of the program. Attend the program and understand the value yourself.' },
      { q: 'Will I get the recording of the program?', a: 'This is online workshop. So no recording will be provided.' },
      { q: 'Why is the training during business hours?', a: 'This is an investment in your business when you learn you grow. I strongly believe that every entrepreneur has a personal life and would want to make sure you are learning during your business hours as you implement what you learn here in your business.' },
      { q: 'Who is this seminar ideal for?', a: 'Entrepreneurs and entrepreneurs only. If you have an existing business with products/services or a team and don\'t know what is your next step in business then this is for you.' },
      { q: 'Is this applicable to my industry?', a: 'People from more than 190 industries have attended this webinar and 99.3% of them have said this is applicable for their business. So, yes. It is applicable no matter which industry you are in. Attend and find that out.' },
      { q: 'Can I attend this if I want to start a business but don\'t have one yet?', a: 'No, attend only after you have an existing business.' },
      { q: 'What if I have questions about registration, attending, etc?', a: 'You can drop us a DM on Instagram. We will be happy to help you.' },
      { q: 'If I miss attending this time can I attend this again?', a: 'Yes you may attend it again at a later date.' },
      { q: 'What do I need to keep handy during the webinar?', a: 'Just an open mind and a book to make a lot of notes.' },
      { q: 'Can I attend this program along with my business partner(s)?', a: 'Yes you can, it is preferred you attend with your partners so that you can learn together.' },
      { q: 'Is the workshop live?', a: 'This is a LIVE streamed webinar which starts at 9am and ends at 1pm. Rajiv will not be live for this session.' },
    ],
  },

  footer: {
    socialLinks: { facebook: '', instagram: '', linkedin: '', youtube: '' },
    copyright: '© 2025 Rajiv Talreja. All rights reserved.',
    links: [
      { label: 'Terms and Conditions', url: '#' },
      { label: 'Privacy Policy', url: '#' },
      { label: 'Refund Policy', url: '#' },
    ],
  },
};
