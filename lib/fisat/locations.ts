/**
 * Central, data-driven content for every interactive destination.
 *
 * Content marked with PENDING was not available from official FISAT sources at
 * build time. It renders as a clearly labelled placeholder so it is never
 * mistaken for fact. Replace it with verified information from fisat.ac.in.
 *
 * Sources used: fisat.ac.in (home, /vision, /library, /facility/hostel,
 * /facility/cafeteria, /facility/sports-and-games, /campus-life).
 */

export const PENDING = '__PENDING_OFFICIAL_CONTENT__'

export type LocationSection = { heading: string; body: string }
export type LocationLink = { label: string; href: string }
export type LocationStat = { value: string; label: string }
export type GalleryImage = { src: string; alt: string }

export type CampusLocation = {
  id: string
  name: string
  shortName: string
  prompt: string
  eyebrow: string
  tagline: string
  description: string
  heroImage: string
  heroAlt: string
  stats: LocationStat[]
  gallery: GalleryImage[]
  sections: LocationSection[]
  facilities: string[]
  timings: string
  location: string
  contact: string
  links: LocationLink[]
}

const OFFICIAL_CONTACT =
  'Federal Institute of Science And Technology (FISAT), Hormis Nagar, Mookkannoor P.O., Angamaly, Ernakulam Dt., Kerala, India — PIN 683 577. Phone: 0484 2725272. Email: mail@fisat.ac.in'

const SITE = 'https://fisat.ac.in'

export const locations: CampusLocation[] = [
  {
    id: 'main-college',
    name: 'Main College Building',
    shortName: 'Main Building',
    prompt: 'Explore Main College',
    eyebrow: 'Institution',
    tagline: 'More than a campus.',
    description:
      'Federal Institute of Science And Technology (FISAT) is an autonomous institution at Hormis Nagar, Mookkannoor, approved by AICTE, New Delhi, and affiliated to APJ Abdul Kalam Technological University (KTU), Thiruvananthapuram.',
    heroImage: '/assets/images/main-building.png',
    heroAlt: 'Illustrative view of a modern college administrative building',
    stats: [
      { value: "NAAC 'A+'", label: 'Re-accredited, 2nd cycle (CGPA 3.45)' },
      { value: 'NBA', label: 'All B.Tech programmes accredited' },
      { value: '3200+', label: 'Students' },
      { value: '~40 acres', label: 'Campus' },
    ],
    gallery: [
      { src: '/assets/intro/fisat-drone-poster.png', alt: 'Illustrative aerial view of a green Kerala campus' },
      { src: '/assets/images/academic-block.png', alt: 'Illustrative engineering laboratory' },
      { src: '/assets/images/library.png', alt: 'Illustrative library reading hall' },
      { src: '/assets/images/sports-centre.png', alt: 'Illustrative college sports ground' },
    ],
    sections: [
      {
        heading: 'Vision',
        body: 'To evolve into a world-class professional institute committed to excellence in education, fostering holistic development, and empowering socially responsible global technocrats to drive sustainable growth through leadership in industry, innovation, research, and community engagement.',
      },
      {
        heading: 'Mission',
        body: 'To deliver high-quality professional education that promotes academic excellence, fosters the right attitude, cultivates essential skills, and encourages innovation and global competence through an industry-aligned curriculum and advanced research. To nurture socially responsible technocrats, impactful leaders, and accomplished management professionals, by promoting holistic growth, upholding ethical values, and championing sustainable practices for the advancement of both industry and society.',
      },
      {
        heading: 'The Campus',
        body: 'The campus is at Hormis Nagar, Mookkannoor, a rustic village on the outskirts of Angamaly town, on a stretch of land of nearly 40 acres. It lies roughly 4 km from NH 47, 7 km from Angamaly railway station and 11 km from Kochi International Airport, with Kalady, Malayattoor and the Athirappilly waterfalls nearby.',
      },
      { heading: 'History', body: PENDING },
    ],
    facilities: [
      'Approved by AICTE, New Delhi',
      'Affiliated to KTU, Thiruvananthapuram',
      "Accredited by NAAC with 'A+' Grade",
      'NBA accreditation — B.Tech CSE, ECE, EEE, EIE, ME & CE',
      'Office of International Affairs',
      'AICTE scholarship / fellowship schemes',
    ],
    timings: 'College office working hours: 8:00 AM – 4:30 PM (as announced on fisat.ac.in).',
    location: 'Hormis Nagar, Mookkannoor P.O., Angamaly, Ernakulam, Kerala 683 577.',
    contact: OFFICIAL_CONTACT,
    links: [
      { label: 'Official website', href: SITE },
      { label: 'Vision & Mission', href: `${SITE}/vision/` },
      { label: 'Admissions', href: `${SITE}/admission/` },
      { label: 'Campus life', href: `${SITE}/campus-life/` },
    ],
  },
  {
    id: 'academic-block',
    name: 'Academic / Faculty Block',
    shortName: 'Academics',
    prompt: 'Explore Academics',
    eyebrow: 'Academics',
    tagline: 'Learn with purpose.',
    description:
      'FISAT offers engineering, computer applications and management programmes across nine academic departments, all B.Tech programmes being accredited by the National Board of Accreditation.',
    heroImage: '/assets/images/academic-block.png',
    heroAlt: 'Illustrative engineering laboratory with students at workstations',
    stats: [
      { value: '9', label: 'Departments' },
      { value: '6', label: 'NBA-accredited B.Tech programmes' },
    ],
    gallery: [],
    sections: [
      {
        heading: 'Departments',
        body: 'Computer Science and Engineering · Electronics and Communication Engineering · Electrical and Electronics Engineering · Electronics and Instrumentation Engineering · Mechanical Engineering · Civil Engineering · Computer Applications · Business Administration · Science and Humanities.',
      },
      { heading: 'Faculty', body: PENDING },
      { heading: 'Laboratories', body: PENDING },
    ],
    facilities: ['Central Computing Facility', 'IT Infrastructure', 'Language Lab'],
    timings: PENDING,
    location: 'Academic blocks, FISAT campus, Hormis Nagar.',
    contact: OFFICIAL_CONTACT,
    links: [
      { label: 'Syllabus', href: `${SITE}/syllabus/` },
      { label: 'Central Computing Facility', href: `${SITE}/facility/central-computing-facility/` },
      { label: 'IT Infrastructure', href: `${SITE}/facility/it-infrastructure/` },
      { label: 'Language Lab', href: `${SITE}/facility/language-lab/` },
    ],
  },
  {
    id: 'library',
    name: 'Library & Information Centre',
    shortName: 'Library',
    prompt: 'Explore Library',
    eyebrow: 'Library & Information Centre',
    tagline: 'Space to think. Space to build.',
    description:
      'A fully automated, modern Library & Information Centre (LIC) catering to the information and intellectual needs of students, faculty and researchers.',
    heroImage: '/assets/images/library.png',
    heroAlt: 'Illustrative library interior with bookshelves and reading tables',
    stats: [
      { value: '83,650+', label: 'Volumes' },
      { value: '26,294+', label: 'Titles' },
      { value: '155', label: 'Print journals & magazines' },
      { value: '5000+', label: 'E-journals' },
    ],
    gallery: [],
    sections: [
      {
        heading: 'Resources',
        body: 'A balanced collection of hard copy, audio/video, CD-ROM and other electronic documents, housing one of the most comprehensive collections of current engineering and management publications.',
      },
      {
        heading: 'Services',
        body: 'The FISAT Library and Information Division serves the FISAT community, staff from all departments and neighbouring institutions.',
      },
      {
        heading: 'Spaces',
        body: 'A central library housed in a three-storey structure with separate reference and stack rooms, alongside dedicated MBA and MCA reference libraries.',
      },
    ],
    facilities: [
      'Fully automated library',
      'Central library — three storeys',
      'Separate reference & stack rooms',
      'MBA reference library',
      'MCA reference library',
      'Electronic resources',
    ],
    timings: PENDING,
    location: 'Central Library, FISAT campus.',
    contact: OFFICIAL_CONTACT,
    links: [{ label: 'Library page', href: `${SITE}/library/` }],
  },
  {
    id: 'hostel',
    name: 'Hostels',
    shortName: 'Hostel',
    prompt: 'Explore Hostel',
    eyebrow: 'Residential Life',
    tagline: 'Find your people. Find your place.',
    description:
      'Affordable, high-quality residential accommodation on campus for 1300+ students — designed to be a true home away from home in a serene, calm and secure environment.',
    heroImage: '/assets/images/hostel.png',
    heroAlt: 'Illustrative student hostel building at dusk',
    stats: [
      { value: '4', label: 'Hostel blocks' },
      { value: '700', label: "Gents' hostel capacity" },
      { value: '613', label: "Girls' hostel capacity" },
    ],
    gallery: [],
    sections: [
      {
        heading: 'Accommodation',
        body: 'Four separate hostel blocks — two for boys and two for girls — ensure dedicated spaces for all students.',
      },
      { heading: 'Rules & Admission', body: PENDING },
    ],
    facilities: ['24-hour electricity & water', 'Wi-Fi connectivity', 'Laundry facility', 'Spaces for study and recreation'],
    timings: PENDING,
    location: 'On-campus hostel blocks, FISAT.',
    contact: OFFICIAL_CONTACT,
    links: [{ label: 'Hostel page', href: `${SITE}/facility/hostel/` }],
  },
  {
    id: 'sports-centre',
    name: 'Fitness & Sports Centre',
    shortName: 'Sports',
    prompt: 'Explore Sports Centre',
    eyebrow: 'Department of Physical Education & Sports',
    tagline: 'Life beyond the classroom.',
    description:
      'Sports facilities on campus support individual and team sport, with FISAT students winning accolades at university and state-level events.',
    heroImage: '/assets/images/sports-centre.png',
    heroAlt: 'Illustrative college sports ground at golden hour',
    stats: [],
    gallery: [],
    sections: [
      {
        heading: 'Achievements',
        body: 'FISAT teams and athletes have won APJ AKTU zone and inter-zone events across volleyball, basketball, table tennis and athletics, as listed on the official sports page.',
      },
      { heading: 'Fitness Centre', body: PENDING },
    ],
    facilities: [
      'Basketball court (international standard acrylic)',
      'Volleyball court (international standard acrylic)',
      'Indoor shuttle badminton courts',
    ],
    timings: PENDING,
    location: 'Sports grounds and courts, FISAT campus.',
    contact: OFFICIAL_CONTACT,
    links: [{ label: 'Sports & games page', href: `${SITE}/facility/sports-and-games/` }],
  },
  {
    id: 'canteen',
    name: 'Cafeteria',
    shortName: 'Canteen',
    prompt: 'Explore Canteen',
    eyebrow: 'Food & Gathering',
    tagline: 'From idea to impact.',
    description:
      'Conveniently positioned near all departments, the cafeteria serves refreshments and meals freshly made by trained chefs at an affordable charge — and is the most popular hangout on campus.',
    heroImage: '/assets/images/canteen.png',
    heroAlt: 'Illustrative open, bright college cafeteria',
    stats: [{ value: '2002', label: 'Serving the campus since' }],
    gallery: [],
    sections: [
      {
        heading: 'About',
        body: 'Meals are produced with high-quality ingredients in hygienic settings, with enough seating for students and employees even during peak hours.',
      },
      { heading: 'Menu', body: PENDING },
    ],
    facilities: ['Freshly cooked meals', 'Hygienic kitchens', 'Seating for peak hours', 'Located near all departments'],
    timings: PENDING,
    location: 'Central campus, near the academic departments.',
    contact: OFFICIAL_CONTACT,
    links: [{ label: 'Cafeteria page', href: `${SITE}/facility/cafeteria/` }],
  },
  {
    id: 'transport',
    name: 'Bus & Transport Area',
    shortName: 'Transport',
    prompt: 'Explore Transport',
    eyebrow: 'Getting Here',
    tagline: 'Your next chapter starts here.',
    description:
      'The campus is roughly 4 km from NH 47, 7 km from Angamaly railway station and 11 km from Kochi International Airport.',
    heroImage: '/assets/images/transport.png',
    heroAlt: 'Illustrative row of college buses at a campus bus bay',
    stats: [
      { value: '~4 km', label: 'From NH 47' },
      { value: '7 km', label: 'From Angamaly railway station' },
      { value: '11 km', label: 'From Kochi International Airport' },
    ],
    gallery: [],
    sections: [
      { heading: 'Routes', body: PENDING },
      { heading: 'Stops', body: PENDING },
    ],
    facilities: [],
    timings: PENDING,
    location: 'Bus bay near the main entrance, FISAT campus.',
    contact: OFFICIAL_CONTACT,
    links: [{ label: 'Official website', href: SITE }],
  },
]

export const locationsById = Object.fromEntries(locations.map((l) => [l.id, l])) as Record<string, CampusLocation>
