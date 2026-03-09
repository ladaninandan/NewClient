/**
 * Default site configuration – matches https://rajivtalreja.co.in/bsw-fb/
 * Admin panel can override these via Supabase.
 */
export const defaultConfig = {
  logo: '',
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
    ctaText: 'Register Now at ₹99/- Only',
  },

  targetAudience: {
    title: 'Who This Workshop Will Help The Best?',
    ctaText: 'Register Now at ₹99/- Only',
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
