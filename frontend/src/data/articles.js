/**
 * Clinical Articles Data for VAANI Speech & Hearing Clinic
 */

export const ARTICLES = [
  {
    id: 'speech-delay-early-signs',
    slug: 'speech-delay-early-signs',
    title: 'Recognizing Early Signs of Speech Delay in Toddlers: When to Seek Clinical Help',
    subtitle: 'A clinical guide for parents on milestones between 12 and 36 months, evidence-based red flags, and early intervention protocols in Satara.',
    category: 'Pediatric Speech',
    readTime: '6 min read',
    date: 'Oct 12, 2026',
    author: 'ASLP Palak Gandhi',
    authorCredentials: 'BASLP, RCI Registered Audiologist & Speech-Language Pathologist',
    authorAvatar: '/practitioner-headshot.png',
    heroImage: '/patient-pexels.jpg',
    secondaryImage: '/services/service-speech-therapy.jpg',
    secondaryCaption: 'One-on-one pediatric articulation & language stimulation session at VAANI Clinic, Satara.',
    youtubeVideoId: '3NoESJjxw1k', // Cleveland Clinic: Speech Delays in Children | Kelly Wilber, CCC-SLP
    videoTitle: 'Clinical Guide: Toddler Speech Delays & When to Seek Therapy (Cleveland Clinic)',
    excerpt:
      'Early detection before 24 months prevents lifelong developmental setbacks. Learn the key milestones between 12 to 36 months, red-flag behaviors, and why bilingualism does NOT cause speech delay.',
    tags: ['Child Development', 'Speech Therapy', 'Early Intervention', 'Pediatric Care'],
    keyTakeaways: [
      'Early clinical intervention before 24 months yields up to 85% faster vocabulary catching-up compared to watchful waiting.',
      'Bilingual or multilingual environments do NOT cause developmental speech delays.',
      'Gestural communication (pointing, showing) by 12 months is as critical as first words.',
      'Standardized RCI assessments (REELS, 3-DLAT) provide objective developmental age mapping.',
    ],
    contentBlocks: [
      {
        heading: 'The Window of Neural Plasticity (0 to 3 Years)',
        text: `The first three years of life represent the most critical period for speech and language acquisition. During this phase, the auditory cortex and language processing centers in the brain form millions of neural connections per second. When speech delays are addressed early, therapy leverages this heightened neuroplasticity, allowing children to catch up with their age-matched peers rapidly.`,
      },
      {
        heading: 'Age-Wise Developmental Milestones & Warning Signs',
        text: `Parents in Satara often wonder when a variation in talking is considered normal development versus when it warrants an evaluation. Here are the clinical thresholds:`,
        milestones: [
          {
            age: '12 Months',
            normal: 'Babbling with varied consonants (baba, dada), responding to name, pointing at objects.',
            warning: 'Does not turn when their name is called, produces no vocal sounds, lacks eye contact.',
          },
          {
            age: '18 Months',
            normal: 'Uses at least 10–20 single words, imitates simple words, understands everyday instructions.',
            warning: 'Does not use at least 6 consistent words, communicates only by crying or leading hands.',
          },
          {
            age: '24 Months (2 Years)',
            normal: 'Combines two words ("give milk", "go out"), vocabulary of 50+ spontaneous words.',
            warning: 'Fewer than 50 words, unable to imitate two-word phrases, echoic repetition without meaning.',
          },
          {
            age: '36 Months (3 Years)',
            normal: 'Speaks in 3-to-4 word sentences, intelligible to family and familiar listeners.',
            warning: 'Speech is unclear even to parents, frequent frustration or tantrums due to inability to express needs.',
          },
        ],
      },
      {
        heading: 'The Bilingual Myth: Debunking Multi-Language Confusion',
        text: `In Maharashtra, many families speak Marathi at home, Hindi in the neighborhood, and English in school. A very common misconception is that exposing a toddler to more than one language confuses them and causes delayed speech.

Clinical research definitively proves that human infants are fully equipped to learn multiple languages simultaneously. A bilingual child’s total conceptual vocabulary (words known across both languages) matches or exceeds that of monolingual peers. If a bilingual toddler has a speech delay, it is caused by underlying neurodevelopmental factors—not by the languages themselves.`,
      },
      {
        heading: 'What Happens During a Clinical Assessment at VAANI?',
        text: `At our Sadashiv Peth clinic in Satara, speech assessments are stress-free and play-based. We administer standardized Indian diagnostic scales including the Receptive-Expressive Emergent Language Scale (REELS) and Three-Dimensional Language Acquisition Test (3-DLAT). Parents receive a personalized developmental roadmap and structured home guidance exercises.`,
      },
    ],
    importantLinks: [
      {
        label: 'WHO: Childhood Hearing & Communication Development Guidelines',
        url: 'https://www.who.int/news-room/fact-sheets/detail/deafness-and-hearing-loss',
        isExternal: true,
      },
      {
        label: 'Rehabilitation Council of India (RCI) Standards for SLP Intervention',
        url: 'https://www.rehabcouncil.nic.in/',
        isExternal: true,
      },
      {
        label: 'Schedule a 1-on-1 Pediatric Speech Evaluation at VAANI Satara',
        url: '/#booking-section',
        isExternal: false,
      },
    ],
  },
  {
    id: 'pure-tone-audiometry-guide',
    slug: 'pure-tone-audiometry-guide',
    title: 'What to Expect During a Pure Tone Audiometry (PTA) Hearing Evaluation',
    subtitle: 'A complete clinical walkthrough of calibrated acoustic chamber testing, bone conduction oscillators, and audiogram interpretation.',
    category: 'Audiology & Hearing',
    readTime: '7 min read',
    date: 'Sep 28, 2026',
    author: 'ASLP Palak Gandhi',
    authorCredentials: 'BASLP, RCI Registered Audiologist & Speech-Language Pathologist',
    authorAvatar: '/practitioner-headshot.png',
    heroImage: '/services/service-audiology-pta.jpg',
    secondaryImage: '/clinical-care.jpg',
    secondaryCaption: 'Calibrated diagnostic audiometer and double-walled sound booth at VAANI Clinic, Satara.',
    youtubeVideoId: 'AQHKqiJbzF0', // Clinical hearing test walkthrough
    videoTitle: 'Clinical Guide: How Pure Tone Audiometry (PTA) is Performed in a Sound Booth',
    excerpt:
      'Demystifying the diagnostic hearing test conducted in sound-treated booths. How air and bone conduction thresholds reveal the precise type and degree of hearing loss.',
    tags: ['Audiometry', 'Hearing Test', 'Diagnostics', 'Ear Health'],
    keyTakeaways: [
      'Pure Tone Audiometry evaluates hearing sensitivity across pitch frequencies from 250 Hz to 8000 Hz.',
      'Testing takes place inside a calibrated sound-treated booth adhering to ANSI/ISO standards.',
      'Bone conduction testing isolates inner ear (sensorineural) issues from middle ear (conductive) issues.',
      'Same-day RCI-certified computerized audiogram report is provided immediately after testing.',
    ],
    contentBlocks: [
      {
        heading: 'Why Sound-Treated Acoustic Booths Are Non-Negotiable',
        text: `An audiometric test conducted in an ordinary room is diagnostically invalid because ambient environmental noise (street traffic, ceiling fans, AC hum) masks high-frequency and low-frequency pure tones. At VAANI Clinic in Satara, testing is performed inside a certified acoustic booth with specialized sound-dampening walls, ensuring absolute test precision down to 0 dB HL.`,
      },
      {
        heading: 'Air Conduction vs. Bone Conduction Testing',
        text: `Diagnostic audiometry consists of two complementary procedures that map the exact location of hearing loss:`,
        milestones: [
          {
            age: 'Air Conduction (AC)',
            normal: 'Tests the complete ear pathway: outer ear canal, eardrum, middle ear ossicles, and inner ear cochlea.',
            warning: 'Conducted using over-ear calibrated supra-aural or insert earphones.',
          },
          {
            age: 'Bone Conduction (BC)',
            normal: 'Directly vibrates the skull bone, transmitting acoustic energy directly to the cochlea fluid, bypassing the eardrum.',
            warning: 'Conducted using a specialized bone oscillator placed against the mastoid process behind the ear.',
          },
        ],
      },
      {
        heading: 'How to Read Your Audiogram Report',
        text: `The test output is a two-dimensional graph called an audiogram. The horizontal axis represents Pitch / Frequency in Hertz (Hz), ranging from 250 Hz (bass notes) to 8000 Hz (treble chirps). The vertical axis represents Intensity / Loudness in Decibels (dB), from -10 dB (extremely faint) to 120 dB (extremely loud).

Normal hearing thresholds sit between 0 and 20 dB. When air conduction is impaired but bone conduction is normal, the diagnosis is Conductive Hearing Loss (often medically treatable, such as fluid behind the eardrum or wax impaction). When both AC and BC are equally depressed, it indicates Sensorineural Hearing Loss, which requires digital hearing rehabilitation.`,
      },
    ],
    importantLinks: [
      {
        label: 'American Speech-Language-Hearing Association (ASHA): Audiogram Guide',
        url: 'https://www.asha.org/public/hearing/audiogram/',
        isExternal: true,
      },
      {
        label: 'Indian Council of Medical Research (ICMR) Adult Hearing Health Guidelines',
        url: 'https://www.icmr.gov.in/',
        isExternal: true,
      },
      {
        label: 'Book Same-Day Pure Tone Audiometry at VAANI Clinic (₹800)',
        url: '/#booking-section',
        isExternal: false,
      },
    ],
  },
  {
    id: 'digital-hearing-aid-vs-amplifier',
    slug: 'digital-hearing-aid-vs-amplifier',
    title: 'Digital Hearing Aids vs. Sound Amplifiers: Protecting Your Residual Hearing',
    subtitle: 'Why unregulated personal sound amplification products (PSAPs) risk permanent acoustic trauma, and how computerized digital processors protect speech clarity.',
    category: 'Hearing Technology',
    readTime: '5 min read',
    date: 'Sep 15, 2026',
    author: 'ASLP Palak Gandhi',
    authorCredentials: 'BASLP, RCI Registered Audiologist & Speech-Language Pathologist',
    authorAvatar: '/practitioner-headshot.png',
    heroImage: '/services/hearing-aid.jpg',
    secondaryImage: '/services/service-hearing-aid.jpg',
    secondaryCaption: 'Real-ear acoustic measurement and digital programming interface in Satara.',
    youtubeVideoId: 'acYMy9b0F2A', // Understanding Audiometry & Hearing Solutions
    videoTitle: 'Clinical Comparison: Personal Sound Amplifiers vs. Medical Digital Hearing Aids',
    excerpt:
      'Why cheap over-the-counter sound amplifiers can cause permanent acoustic trauma, and how computerized digital hearing aids selectively restore speech clarity.',
    tags: ['Hearing Aids', 'Digital Acoustics', 'Rehabilitation', 'Signia', 'Phonak'],
    keyTakeaways: [
      'Over-the-counter sound amplifiers increase ALL frequencies equally, which can over-amplify loud sounds to dangerous levels.',
      'Certified digital hearing aids split incoming sound into up to 48 independent channels, boosting only your loss frequencies.',
      'Live real-ear measurements (REM) ensure customized fitting tailored to individual ear canal acoustics.',
      'VAANI Clinic provides free in-clinic acoustic trials with top global brands in Satara.',
    ],
    contentBlocks: [
      {
        heading: 'The Temptation of Cheap Online Amplifiers',
        text: `With hundreds of generic amplifiers advertised online for ₹1,200 to ₹3,000, many senior citizens and families in Satara wonder whether paying for certified medical hearing aids is necessary. The truth lies in the critical distinction between uncontrolled amplification and computerized acoustic processing.`,
      },
      {
        heading: 'Why Sound Amplifiers (PSAPs) Pose Health Risks',
        text: `A personal sound amplification product (PSAP) is simply a microphone connected to a generic loudspeaker. When a door slams or a car honks nearby, the amplifier magnifies that noise directly into the patient's ear, frequently exceeding 110 dB SPL. This sudden spike causes permanent acoustic trauma to the delicate stereocilia hair cells inside the inner ear.`,
      },
      {
        heading: 'How Modern Digital Hearing Aids Work',
        text: `Medical digital hearing aids (manufactured by global leaders like Signia, Phonak, and Widex) utilize dedicated digital signal processors (DSP). They perform 500 million calculations per second:
        
1. Acoustic Scene Analysis: The device detects whether you are in a quiet living room, busy market, or car.
2. Directional Beamforming: Microphones focus on the person speaking in front of you while reducing background murmur.
3. Maximum Power Output (MPO) Limiting: Sudden loud clatters are instantly dampened to safe levels.
4. Feedback Cancellation: Eliminates high-pitched whistling without reducing volume.`,
      },
    ],
    importantLinks: [
      {
        label: 'US FDA: Medical Hearing Aids vs. Personal Sound Amplification Products',
        url: 'https://www.fda.gov/medical-devices/hearing-aids',
        isExternal: true,
      },
      {
        label: 'Rehabilitation Council of India: Guidelines on Hearing Aid Dispensing',
        url: 'https://www.rehabcouncil.nic.in/',
        isExternal: true,
      },
      {
        label: 'Schedule a Free Digital Hearing Aid Acoustic Trial in Satara',
        url: '/#booking-section',
        isExternal: false,
      },
    ],
  },
  {
    id: 'stuttering-stammering-therapy',
    slug: 'stuttering-stammering-therapy',
    title: 'Overcoming Stuttering & Stammering: Evidence-Based Speech Fluency Techniques',
    subtitle: 'Understanding neurodevelopmental dysfluency, breaking speech blocks, and building communicative confidence without fear or shame.',
    category: 'Voice & Fluency',
    readTime: '6 min read',
    date: 'Aug 30, 2026',
    author: 'ASLP Palak Gandhi',
    authorCredentials: 'BASLP, RCI Registered Audiologist & Speech-Language Pathologist',
    authorAvatar: '/practitioner-headshot.png',
    heroImage: '/services/service-voice-therapy.jpg',
    secondaryImage: '/doc_avatars_group.png',
    secondaryCaption: 'Collaborative fluency shaping and confidence building sessions at VAANI Clinic.',
    youtubeVideoId: 'M5OxrCQQKEU', // Stuttering Speech Therapy Techniques
    videoTitle: 'Clinical Speech Techniques: Easy Onsets, Continuous Phonation & Block Management',
    excerpt:
      'Understanding the neurodevelopmental basis of childhood and adult dysfluency. Modern therapy techniques that replace fear with effortless natural speech.',
    tags: ['Stuttering', 'Fluency', 'Voice Therapy', 'Adult Speech', 'Pediatric'],
    keyTakeaways: [
      'Stuttering is a neurodevelopmental timing variation in speech motor planning, NOT a psychological defect.',
      'Fluency shaping techniques (gentle vocal onset, light articulatory touch) retrain speech motor coordination.',
      'Negative reactions, anxiety, and avoidance behaviors reinforce physical tension and blocks.',
      'Both school-age children and working adults achieve remarkable, lasting fluency improvement through therapy.',
    ],
    contentBlocks: [
      {
        heading: 'What Actually Happens During a Stuttering Block?',
        text: `Stuttering (commonly called stammering in India) manifests as involuntary repetitions of sounds ("b-b-ball"), prolongations ("ssssnake"), or silent postural fixations (blocks) where the vocal cords or tongue lock up physically. Brain imaging studies demonstrate that individuals who stutter exhibit subtle differences in the neural timing loops connecting auditory feedback and motor planning.`,
      },
      {
        heading: 'Core Clinical Fluency Techniques Taught at VAANI',
        text: `At VAANI Clinic in Satara, our speech pathologists utilize evidence-based fluency modification protocols:`,
        milestones: [
          {
            age: 'Gentle Vocal Onset',
            normal: 'Beginning vowels with easy airflow before vocal cord vibration to prevent vocal cord spasms.',
            warning: 'Replaces hard glottal attacks on words starting with vowels (e.g. apple, open).',
          },
          {
            age: 'Light Articulatory Contacts',
            normal: 'Touching the lips, tongue, and teeth with minimal physical pressure when pronouncing plosive consonants.',
            warning: 'Prevents forceful muscular tension on sounds like P, B, T, D, K, and G.',
          },
          {
            age: 'Continuous Phonation',
            normal: 'Maintaining voice flow and vibration smoothly across syllable and word boundaries.',
            warning: 'Eliminates choppy stops and starts that trigger speech motor dysfluency.',
          },
        ],
      },
      {
        heading: 'Counseling & Communication Confidence',
        text: `Therapy does not just focus on physical vocal mechanics; it directly dismantles the secondary anxiety, situational avoidance (such as dreading phone calls or classroom presentations), and negative self-talk that often accompany stammering.`,
      },
    ],
    importantLinks: [
      {
        label: 'The Stuttering Foundation: Research & Clinical Resource Center',
        url: 'https://www.stutteringhelp.org/',
        isExternal: true,
      },
      {
        label: 'Indian Speech and Hearing Association (ISHA) Fluency Protocols',
        url: 'https://www.ishaindia.org.in/',
        isExternal: true,
      },
      {
        label: 'Book a Confidential Speech Fluency Consultation at VAANI Satara',
        url: '/#booking-section',
        isExternal: false,
      },
    ],
  },
];

export const getArticleBySlug = (slug) => {
  return ARTICLES.find((a) => a.slug === slug || a.id === slug) || null;
};
