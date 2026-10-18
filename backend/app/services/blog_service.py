"""Blog Management Service with SQLite Persistence for VAANI Clinic CMS."""
import os
import sqlite3
import json
import time
import re
from typing import Dict, Any, List, Optional

INITIAL_SEED_ARTICLES = [
    {
        "id": "speech-delay-early-signs",
        "slug": "speech-delay-early-signs",
        "title": "Recognizing Early Signs of Speech Delay in Toddlers: When to Seek Clinical Help",
        "subtitle": "A clinical guide for parents on milestones between 12 and 36 months, evidence-based red flags, and early intervention protocols in Satara.",
        "category": "Pediatric Speech",
        "read_time": "6 min read",
        "publish_date": "Oct 12, 2026",
        "author_name": "Ms. Palak Paresh Gandhi",
        "author_credentials": "MASLP, RCI Registered Audiologist & Speech-Language Pathologist",
        "author_avatar": "/practitioner-palak-real.png",
        "hero_image": "/patient-pexels.jpg",
        "secondary_image": "/services/service-speech-therapy.jpg",
        "secondary_caption": "One-on-one pediatric articulation & language stimulation session at VAANI Clinic, Satara.",
        "youtube_video_id": "3NoESJjxw1k",
        "video_title": "Clinical Guide: Toddler Speech Delays & When to Seek Therapy (Cleveland Clinic)",
        "excerpt": "Early detection before 24 months prevents lifelong developmental setbacks. Learn the key milestones between 12 to 36 months, red-flag behaviors, and why bilingualism does NOT cause speech delay.",
        "tags": ["Child Development", "Speech Therapy", "Early Intervention", "Pediatric Care"],
        "key_takeaways": [
            "Early clinical intervention before 24 months yields up to 85% faster vocabulary catching-up compared to watchful waiting.",
            "Bilingual or multilingual environments do NOT cause developmental speech delays.",
            "Gestural communication (pointing, showing) by 12 months is as critical as first words.",
            "Standardized RCI assessments (REELS, 3-DLAT) provide objective developmental age mapping.",
        ],
        "content_blocks": [
            {
                "heading": "The Window of Neural Plasticity (0 to 3 Years)",
                "text": "The first three years of life represent the most critical period for speech and language acquisition. During this phase, the auditory cortex and language processing centers in the brain form millions of neural connections per second. When speech delays are addressed early, therapy leverages this heightened neuroplasticity, allowing children to catch up with their age-matched peers rapidly.",
            },
            {
                "heading": "Age-Wise Developmental Milestones & Warning Signs",
                "text": "Parents in Satara often wonder when a variation in talking is considered normal development versus when it warrants an evaluation. Here are the clinical thresholds:",
                "milestones": [
                    {
                        "age": "12 Months",
                        "normal": "Babbling with varied consonants (baba, dada), responding to name, pointing at objects.",
                        "warning": "Does not turn when their name is called, produces no vocal sounds, lacks eye contact.",
                    },
                    {
                        "age": "18 Months",
                        "normal": "Uses at least 10–20 single words, imitates simple words, understands everyday instructions.",
                        "warning": "Does not use at least 6 consistent words, communicates only by crying or leading hands.",
                    },
                    {
                        "age": "24 Months (2 Years)",
                        "normal": "Combines two words (\"give milk\", \"go out\"), vocabulary of 50+ spontaneous words.",
                        "warning": "Fewer than 50 words, unable to imitate two-word phrases, echoic repetition without meaning.",
                    },
                    {
                        "age": "36 Months (3 Years)",
                        "normal": "Speaks in 3-to-4 word sentences, intelligible to family and familiar listeners.",
                        "warning": "Speech is unclear even to parents, frequent frustration or tantrums due to inability to express needs.",
                    },
                ],
            },
            {
                "heading": "The Bilingual Myth: Debunking Multi-Language Confusion",
                "text": "In Maharashtra, many families speak Marathi at home, Hindi in the neighborhood, and English in school. A very common misconception is that exposing a toddler to more than one language confuses them and causes delayed speech.\n\nClinical research definitively proves that human infants are fully equipped to learn multiple languages simultaneously. A bilingual child’s total conceptual vocabulary (words known across both languages) matches or exceeds that of monolingual peers. If a bilingual toddler has a speech delay, it is caused by underlying neurodevelopmental factors—not by the languages themselves.",
            },
            {
                "heading": "What Happens During a Clinical Assessment at VAANI?",
                "text": "At our Sadashiv Peth clinic in Satara, speech assessments are stress-free and play-based. We administer standardized Indian diagnostic scales including the Receptive-Expressive Emergent Language Scale (REELS) and Three-Dimensional Language Acquisition Test (3-DLAT). Parents receive a personalized developmental roadmap and structured home guidance exercises.",
            },
        ],
        "important_links": [
            {
                "label": "WHO: Childhood Hearing & Communication Development Guidelines",
                "url": "https://www.who.int/news-room/fact-sheets/detail/deafness-and-hearing-loss",
                "isExternal": True,
            },
            {
                "label": "Rehabilitation Council of India (RCI) Standards for SLP Intervention",
                "url": "https://www.rehabcouncil.nic.in/",
                "isExternal": True,
            },
            {
                "label": "Schedule a 1-on-1 Pediatric Speech Evaluation at VAANI Satara",
                "url": "/#booking-section",
                "isExternal": False,
            },
        ],
        "is_featured": 1,
        "status": "PUBLISHED",
        "views_count": 248,
    },
    {
        "id": "pure-tone-audiometry-guide",
        "slug": "pure-tone-audiometry-guide",
        "title": "What to Expect During a Pure Tone Audiometry (PTA) Hearing Evaluation",
        "subtitle": "A complete clinical walkthrough of calibrated acoustic chamber testing, bone conduction oscillators, and audiogram interpretation.",
        "category": "Audiology & Hearing",
        "read_time": "7 min read",
        "publish_date": "Sep 28, 2026",
        "author_name": "Ms. Palak Paresh Gandhi",
        "author_credentials": "MASLP, RCI Registered Audiologist & Speech-Language Pathologist",
        "author_avatar": "/practitioner-palak-real.png",
        "hero_image": "/services/service-audiology-pta.jpg",
        "secondary_image": "/clinical-care.jpg",
        "secondary_caption": "Calibrated diagnostic audiometer and double-walled sound booth at VAANI Clinic, Satara.",
        "youtube_video_id": "AQHKqiJbzF0",
        "video_title": "Clinical Guide: How Pure Tone Audiometry (PTA) is Performed in a Sound Booth",
        "excerpt": "Demystifying the diagnostic hearing test conducted in sound-treated booths. How air and bone conduction thresholds reveal the precise type and degree of hearing loss.",
        "tags": ["Audiometry", "Hearing Test", "Diagnostics", "Ear Health"],
        "key_takeaways": [
            "Pure Tone Audiometry evaluates hearing sensitivity across pitch frequencies from 250 Hz to 8000 Hz.",
            "Testing takes place inside a calibrated sound-treated booth adhering to ANSI/ISO standards.",
            "Bone conduction testing isolates inner ear (sensorineural) issues from middle ear (conductive) issues.",
            "Same-day RCI-certified computerized audiogram report is provided immediately after testing.",
        ],
        "content_blocks": [
            {
                "heading": "Why Sound-Treated Acoustic Booths Are Non-Negotiable",
                "text": "An audiometric test conducted in an ordinary room is diagnostically invalid because ambient environmental noise (street traffic, ceiling fans, AC hum) masks high-frequency and low-frequency pure tones. At VAANI Clinic in Satara, testing is performed inside a certified acoustic booth with specialized sound-dampening walls, ensuring absolute test precision down to 0 dB HL.",
            },
            {
                "heading": "Air Conduction vs. Bone Conduction Testing",
                "text": "Diagnostic audiometry consists of two complementary procedures that map the exact location of hearing loss:",
                "milestones": [
                    {
                        "age": "Air Conduction (AC)",
                        "normal": "Tests the complete ear pathway: outer ear canal, eardrum, middle ear ossicles, and inner ear cochlea.",
                        "warning": "Conducted using over-ear calibrated supra-aural or insert earphones.",
                    },
                    {
                        "age": "Bone Conduction (BC)",
                        "normal": "Directly vibrates the skull bone, transmitting acoustic energy directly to the cochlea fluid, bypassing the eardrum.",
                        "warning": "Conducted using a specialized bone oscillator placed against the mastoid process behind the ear.",
                    },
                ],
            },
            {
                "heading": "How to Read Your Audiogram Report",
                "text": "The test output is a two-dimensional graph called an audiogram. The horizontal axis represents Pitch / Frequency in Hertz (Hz), ranging from 250 Hz (bass notes) to 8000 Hz (treble chirps). The vertical axis represents Intensity / Loudness in Decibels (dB), from -10 dB (extremely faint) to 120 dB (extremely loud).\n\nNormal hearing thresholds sit between 0 and 20 dB. When air conduction is impaired but bone conduction is normal, the diagnosis is Conductive Hearing Loss. When both AC and BC are equally depressed, it indicates Sensorineural Hearing Loss, which requires digital hearing rehabilitation.",
            },
        ],
        "important_links": [
            {
                "label": "American Speech-Language-Hearing Association (ASHA): Audiogram Guide",
                "url": "https://www.asha.org/public/hearing/audiogram/",
                "isExternal": True,
            },
            {
                "label": "Indian Council of Medical Research (ICMR) Adult Hearing Health Guidelines",
                "url": "https://www.icmr.gov.in/",
                "isExternal": True,
            },
            {
                "label": "Book Same-Day Pure Tone Audiometry at VAANI Clinic (₹800)",
                "url": "/#booking-section",
                "isExternal": False,
            },
        ],
        "is_featured": 0,
        "status": "PUBLISHED",
        "views_count": 192,
    },
    {
        "id": "digital-hearing-aid-vs-amplifier",
        "slug": "digital-hearing-aid-vs-amplifier",
        "title": "Digital Hearing Aids vs. Sound Amplifiers: Protecting Your Residual Hearing",
        "subtitle": "Why unregulated personal sound amplification products (PSAPs) risk permanent acoustic trauma, and how computerized digital processors protect speech clarity.",
        "category": "Hearing Technology",
        "read_time": "5 min read",
        "publish_date": "Sep 15, 2026",
        "author_name": "Ms. Palak Paresh Gandhi",
        "author_credentials": "MASLP, RCI Registered Audiologist & Speech-Language Pathologist",
        "author_avatar": "/practitioner-palak-real.png",
        "hero_image": "/services/hearing-aid.jpg",
        "secondary_image": "/services/service-hearing-aid.jpg",
        "secondary_caption": "Real-ear acoustic measurement and digital programming interface in Satara.",
        "youtube_video_id": "acYMy9b0F2A",
        "video_title": "Clinical Comparison: Personal Sound Amplifiers vs. Medical Digital Hearing Aids",
        "excerpt": "Why cheap over-the-counter sound amplifiers can cause permanent acoustic trauma, and how computerized digital hearing aids selectively restore speech clarity.",
        "tags": ["Hearing Aids", "Digital Acoustics", "Rehabilitation", "Signia", "Phonak"],
        "key_takeaways": [
            "Over-the-counter sound amplifiers increase ALL frequencies equally, which can over-amplify loud sounds to dangerous levels.",
            "Certified digital hearing aids split incoming sound into up to 48 independent channels, boosting only your loss frequencies.",
            "Live real-ear measurements (REM) ensure customized fitting tailored to individual ear canal acoustics.",
            "VAANI Clinic provides free in-clinic acoustic trials with top global brands in Satara.",
        ],
        "content_blocks": [
            {
                "heading": "The Temptation of Cheap Online Amplifiers",
                "text": "With hundreds of generic amplifiers advertised online for ₹1,200 to ₹3,000, many senior citizens and families in Satara wonder whether paying for certified medical hearing aids is necessary. The truth lies in the critical distinction between uncontrolled amplification and computerized acoustic processing.",
            },
            {
                "heading": "Why Sound Amplifiers (PSAPs) Pose Health Risks",
                "text": "A personal sound amplification product (PSAP) is simply a microphone connected to a generic loudspeaker. When a door slams or a car honks nearby, the amplifier magnifies that noise directly into the patient's ear, frequently exceeding 110 dB SPL. This sudden spike causes permanent acoustic trauma to the delicate stereocilia hair cells inside the inner ear.",
            },
            {
                "heading": "How Modern Digital Hearing Aids Work",
                "text": "Medical digital hearing aids (manufactured by global leaders like Signia, Phonak, and Widex) utilize dedicated digital signal processors (DSP). They perform 500 million calculations per second:\n\n1. Acoustic Scene Analysis: The device detects whether you are in a quiet living room, busy market, or car.\n2. Directional Beamforming: Microphones focus on the person speaking in front of you while reducing background murmur.\n3. Maximum Power Output (MPO) Limiting: Sudden loud clatters are instantly dampened to safe levels.\n4. Feedback Cancellation: Eliminates high-pitched whistling without reducing volume.",
            },
        ],
        "important_links": [
            {
                "label": "US FDA: Medical Hearing Aids vs. Personal Sound Amplification Products",
                "url": "https://www.fda.gov/medical-devices/hearing-aids",
                "isExternal": True,
            },
            {
                "label": "Rehabilitation Council of India: Guidelines on Hearing Aid Dispensing",
                "url": "https://www.rehabcouncil.nic.in/",
                "isExternal": True,
            },
            {
                "label": "Schedule a Free Digital Hearing Aid Acoustic Trial in Satara",
                "url": "/#booking-section",
                "isExternal": False,
            },
        ],
        "is_featured": 0,
        "status": "PUBLISHED",
        "views_count": 174,
    },
    {
        "id": "stuttering-stammering-therapy",
        "slug": "stuttering-stammering-therapy",
        "title": "Overcoming Stuttering & Stammering: Evidence-Based Speech Fluency Techniques",
        "subtitle": "Understanding neurodevelopmental dysfluency, breaking speech blocks, and building communicative confidence without fear or shame.",
        "category": "Voice & Fluency",
        "read_time": "6 min read",
        "publish_date": "Aug 30, 2026",
        "author_name": "Ms. Palak Paresh Gandhi",
        "author_credentials": "MASLP, RCI Registered Audiologist & Speech-Language Pathologist",
        "author_avatar": "/practitioner-palak-real.png",
        "hero_image": "/services/service-voice-therapy.jpg",
        "secondary_image": "/doc_avatars_group.png",
        "secondary_caption": "Collaborative fluency shaping and confidence building sessions at VAANI Clinic.",
        "youtube_video_id": "M5OxrCQQKEU",
        "video_title": "Clinical Speech Techniques: Easy Onsets, Continuous Phonation & Block Management",
        "excerpt": "Understanding the neurodevelopmental basis of childhood and adult dysfluency. Modern therapy techniques that replace fear with effortless natural speech.",
        "tags": ["Stuttering", "Fluency", "Voice Therapy", "Adult Speech", "Pediatric"],
        "key_takeaways": [
            "Stuttering is a neurodevelopmental timing variation in speech motor planning, NOT a psychological defect.",
            "Fluency shaping techniques (gentle vocal onset, light articulatory touch) retrain speech motor coordination.",
            "Negative reactions, anxiety, and avoidance behaviors reinforce physical tension and blocks.",
            "Both school-age children and working adults achieve remarkable, lasting fluency improvement through therapy.",
        ],
        "content_blocks": [
            {
                "heading": "What Actually Happens During a Stuttering Block?",
                "text": "Stuttering (commonly called stammering in India) manifests as involuntary repetitions of sounds (\"b-b-ball\"), prolongations (\"ssssnake\"), or silent postural fixations (blocks) where the vocal cords or tongue lock up physically. Brain imaging studies demonstrate that individuals who stutter exhibit subtle differences in the neural timing loops connecting auditory feedback and motor planning.",
            },
            {
                "heading": "Core Clinical Fluency Techniques Taught at VAANI",
                "text": "At VAANI Clinic in Satara, our speech pathologists utilize evidence-based fluency modification protocols:",
                "milestones": [
                    {
                        "age": "Gentle Vocal Onset",
                        "normal": "Beginning vowels with easy airflow before vocal cord vibration to prevent vocal cord spasms.",
                        "warning": "Replaces hard glottal attacks on words starting with vowels (e.g. apple, open).",
                    },
                    {
                        "age": "Light Articulatory Contacts",
                        "normal": "Touching the lips, tongue, and teeth with minimal physical pressure when pronouncing plosive consonants.",
                        "warning": "Prevents forceful muscular tension on sounds like P, B, T, D, K, and G.",
                    },
                    {
                        "age": "Continuous Phonation",
                        "normal": "Maintaining voice flow and vibration smoothly across syllable and word boundaries.",
                        "warning": "Eliminates choppy stops and starts that trigger speech motor dysfluency.",
                    },
                ],
            },
            {
                "heading": "Counseling & Communication Confidence",
                "text": "Therapy does not just focus on physical vocal mechanics; it directly dismantles the secondary anxiety, situational avoidance (such as dreading phone calls or classroom presentations), and negative self-talk that often accompany stammering.",
            },
        ],
        "important_links": [
            {
                "label": "The Stuttering Foundation: Research & Clinical Resource Center",
                "url": "https://www.stutteringhelp.org/",
                "isExternal": True,
            },
            {
                "label": "Indian Speech and Hearing Association (ISHA) Fluency Protocols",
                "url": "https://www.ishaindia.org.in/",
                "isExternal": True,
            },
            {
                "label": "Book a Confidential Speech Fluency Consultation at VAANI Satara",
                "url": "/#booking-section",
                "isExternal": False,
            },
        ],
        "is_featured": 0,
        "status": "PUBLISHED",
        "views_count": 158,
    },
]


def slugify(text: str) -> str:
    """Convert text to URL-safe slug."""
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_-]+", "-", text)
    text = re.sub(r"^-+|-+$", "", text)
    return text or f"article-{int(time.time())}"


class BlogService:
    DB_PATH = os.path.join(os.path.dirname(__file__), "../../instance/vaani_clinic.db")

    @classmethod
    def _init_db(cls):
        """Ensure SQLite database and clinic_blogs table exist."""
        os.makedirs(os.path.dirname(cls.DB_PATH), exist_ok=True)
        conn = sqlite3.connect(cls.DB_PATH)
        try:
            with conn:
                conn.execute(
                    """
                    CREATE TABLE IF NOT EXISTS clinic_blogs (
                        id TEXT PRIMARY KEY,
                        slug TEXT UNIQUE NOT NULL,
                        title TEXT NOT NULL,
                        subtitle TEXT,
                        excerpt TEXT NOT NULL,
                        category TEXT NOT NULL,
                        read_time TEXT DEFAULT '5 min read',
                        publish_date TEXT NOT NULL,
                        author_name TEXT DEFAULT 'Ms. Palak Paresh Gandhi',
                        author_credentials TEXT DEFAULT 'MASLP, RCI Registered Audiologist & Speech-Language Pathologist',
                        author_avatar TEXT DEFAULT '/practitioner-palak-real.png',
                        hero_image TEXT NOT NULL,
                        secondary_image TEXT,
                        secondary_caption TEXT,
                        youtube_video_id TEXT,
                        video_title TEXT,
                        tags_json TEXT DEFAULT '[]',
                        key_takeaways_json TEXT DEFAULT '[]',
                        content_blocks_json TEXT DEFAULT '[]',
                        important_links_json TEXT DEFAULT '[]',
                        is_featured INTEGER DEFAULT 0,
                        status TEXT DEFAULT 'PUBLISHED',
                        views_count INTEGER DEFAULT 0,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )
                    """
                )
                cur = conn.cursor()
                cur.execute("SELECT COUNT(*) FROM clinic_blogs")
                count = cur.fetchone()[0]
                if count == 0:
                    cls._seed_articles(conn)
        finally:
            conn.close()

    @classmethod
    def _seed_articles(cls, conn):
        """Seed initial verified clinical articles into the database."""
        for art in INITIAL_SEED_ARTICLES:
            conn.execute(
                """
                INSERT OR REPLACE INTO clinic_blogs (
                    id, slug, title, subtitle, excerpt, category, read_time,
                    publish_date, author_name, author_credentials, author_avatar,
                    hero_image, secondary_image, secondary_caption, youtube_video_id,
                    video_title, tags_json, key_takeaways_json, content_blocks_json,
                    important_links_json, is_featured, status, views_count
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    art["id"],
                    art["slug"],
                    art["title"],
                    art.get("subtitle", ""),
                    art["excerpt"],
                    art["category"],
                    art.get("read_time", "5 min read"),
                    art.get("publish_date", "Today"),
                    art.get("author_name", "Ms. Palak Paresh Gandhi"),
                    art.get("author_credentials", "MASLP, RCI Registered"),
                    art.get("author_avatar", "/practitioner-palak-real.png"),
                    art["hero_image"],
                    art.get("secondary_image", ""),
                    art.get("secondary_caption", ""),
                    art.get("youtube_video_id", ""),
                    art.get("video_title", ""),
                    json.dumps(art.get("tags", [])),
                    json.dumps(art.get("key_takeaways", [])),
                    json.dumps(art.get("content_blocks", [])),
                    json.dumps(art.get("important_links", [])),
                    art.get("is_featured", 0),
                    art.get("status", "PUBLISHED"),
                    art.get("views_count", 0),
                ),
            )

    @classmethod
    def _row_to_dict(cls, row) -> Dict[str, Any]:
        """Convert a database row into a structured blog dictionary."""
        (
            bid, slug, title, subtitle, excerpt, category, read_time,
            publish_date, author_name, author_credentials, author_avatar,
            hero_image, secondary_image, secondary_caption, youtube_video_id,
            video_title, tags_json, key_takeaways_json, content_blocks_json,
            important_links_json, is_featured, status, views_count,
            created_at, updated_at
        ) = row

        return {
            "id": bid,
            "slug": slug,
            "title": title,
            "subtitle": subtitle or "",
            "excerpt": excerpt,
            "category": category,
            "readTime": read_time,
            "read_time": read_time,
            "date": publish_date,
            "publishDate": publish_date,
            "author": author_name,
            "authorName": author_name,
            "authorCredentials": author_credentials,
            "authorAvatar": author_avatar,
            "heroImage": hero_image,
            "secondaryImage": secondary_image or "",
            "secondaryCaption": secondary_caption or "",
            "youtubeVideoId": youtube_video_id or "",
            "videoTitle": video_title or "",
            "tags": json.loads(tags_json or "[]"),
            "keyTakeaways": json.loads(key_takeaways_json or "[]"),
            "contentBlocks": json.loads(content_blocks_json or "[]"),
            "importantLinks": json.loads(important_links_json or "[]"),
            "isFeatured": bool(is_featured),
            "status": status,
            "viewsCount": views_count or 0,
            "createdAt": created_at,
            "updatedAt": updated_at,
        }

    @classmethod
    def get_all(cls, published_only: bool = True) -> List[Dict[str, Any]]:
        """Retrieve all articles."""
        cls._init_db()
        conn = sqlite3.connect(cls.DB_PATH)
        try:
            cur = conn.cursor()
            if published_only:
                cur.execute(
                    """
                    SELECT id, slug, title, subtitle, excerpt, category, read_time,
                           publish_date, author_name, author_credentials, author_avatar,
                           hero_image, secondary_image, secondary_caption, youtube_video_id,
                           video_title, tags_json, key_takeaways_json, content_blocks_json,
                           important_links_json, is_featured, status, views_count,
                           created_at, updated_at
                    FROM clinic_blogs
                    WHERE status = 'PUBLISHED'
                    ORDER BY is_featured DESC, created_at DESC
                    """
                )
            else:
                cur.execute(
                    """
                    SELECT id, slug, title, subtitle, excerpt, category, read_time,
                           publish_date, author_name, author_credentials, author_avatar,
                           hero_image, secondary_image, secondary_caption, youtube_video_id,
                           video_title, tags_json, key_takeaways_json, content_blocks_json,
                           important_links_json, is_featured, status, views_count,
                           created_at, updated_at
                    FROM clinic_blogs
                    ORDER BY created_at DESC
                    """
                )
            rows = cur.fetchall()
            return [cls._row_to_dict(r) for r in rows]
        finally:
            conn.close()

    @classmethod
    def get_by_slug(cls, slug: str, increment_view: bool = False) -> Optional[Dict[str, Any]]:
        """Retrieve a single article by slug (or ID)."""
        cls._init_db()
        conn = sqlite3.connect(cls.DB_PATH)
        try:
            cur = conn.cursor()
            cur.execute(
                """
                SELECT id, slug, title, subtitle, excerpt, category, read_time,
                       publish_date, author_name, author_credentials, author_avatar,
                       hero_image, secondary_image, secondary_caption, youtube_video_id,
                       video_title, tags_json, key_takeaways_json, content_blocks_json,
                       important_links_json, is_featured, status, views_count,
                       created_at, updated_at
                FROM clinic_blogs
                WHERE slug = ? OR id = ?
                """,
                (slug, slug),
            )
            row = cur.fetchone()
            if not row:
                return None

            if increment_view:
                with conn:
                    conn.execute(
                        "UPDATE clinic_blogs SET views_count = views_count + 1 WHERE id = ?",
                        (row[0],),
                    )

            return cls._row_to_dict(row)
        finally:
            conn.close()

    @classmethod
    def create(cls, data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new clinical article."""
        cls._init_db()
        title = data.get("title", "").strip()
        if not title:
            raise ValueError("Article title is required")

        slug = data.get("slug", "").strip() or slugify(title)
        bid = data.get("id") or f"blog_{int(time.time())}_{slug[:16]}"
        excerpt = data.get("excerpt", "").strip() or (title[:120] + "...")
        category = data.get("category", "General Clinical")
        read_time = data.get("readTime") or data.get("read_time") or "5 min read"
        publish_date = data.get("publishDate") or data.get("date") or time.strftime("%b %d, %Y")
        author_name = data.get("author") or data.get("authorName") or "Ms. Palak Paresh Gandhi"
        author_credentials = data.get("authorCredentials") or "MASLP, RCI Registered Audiologist & Speech-Language Pathologist"
        author_avatar = data.get("authorAvatar") or "/practitioner-palak-real.png"
        hero_image = data.get("heroImage") or data.get("hero_image") or "/services/service-speech-therapy.jpg"
        secondary_image = data.get("secondaryImage") or data.get("secondary_image") or ""
        secondary_caption = data.get("secondaryCaption") or data.get("secondary_caption") or ""
        youtube_video_id = data.get("youtubeVideoId") or data.get("youtube_video_id") or ""
        video_title = data.get("videoTitle") or data.get("video_title") or ""
        tags = data.get("tags") or []
        key_takeaways = data.get("keyTakeaways") or data.get("key_takeaways") or []
        content_blocks = data.get("contentBlocks") or data.get("content_blocks") or []
        important_links = data.get("importantLinks") or data.get("important_links") or []
        is_featured = 1 if data.get("isFeatured") or data.get("is_featured") else 0
        status = data.get("status", "PUBLISHED").upper()

        conn = sqlite3.connect(cls.DB_PATH)
        try:
            with conn:
                # Check for slug collision
                cur = conn.cursor()
                cur.execute("SELECT id FROM clinic_blogs WHERE slug = ?", (slug,))
                existing = cur.fetchone()
                if existing:
                    slug = f"{slug}-{int(time.time()) % 1000}"

                conn.execute(
                    """
                    INSERT INTO clinic_blogs (
                        id, slug, title, subtitle, excerpt, category, read_time,
                        publish_date, author_name, author_credentials, author_avatar,
                        hero_image, secondary_image, secondary_caption, youtube_video_id,
                        video_title, tags_json, key_takeaways_json, content_blocks_json,
                        important_links_json, is_featured, status, views_count
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """,
                    (
                        bid, slug, title, data.get("subtitle", ""), excerpt, category, read_time,
                        publish_date, author_name, author_credentials, author_avatar,
                        hero_image, secondary_image, secondary_caption, youtube_video_id,
                        video_title, json.dumps(tags), json.dumps(key_takeaways),
                        json.dumps(content_blocks), json.dumps(important_links),
                        is_featured, status, 0
                    )
                )
            return cls.get_by_slug(slug)
        finally:
            conn.close()

    @classmethod
    def update(cls, bid: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update an existing article."""
        cls._init_db()
        conn = sqlite3.connect(cls.DB_PATH)
        try:
            with conn:
                cur = conn.cursor()
                cur.execute("SELECT * FROM clinic_blogs WHERE id = ?", (bid,))
                existing = cur.fetchone()
                if not existing:
                    return None

                slug = data.get("slug")
                if slug:
                    slug = slugify(slug)
                    cur.execute("SELECT id FROM clinic_blogs WHERE slug = ? AND id != ?", (slug, bid))
                    if cur.fetchone():
                        slug = f"{slug}-{int(time.time()) % 1000}"
                else:
                    slug = existing[1]

                title = data.get("title", existing[2])
                subtitle = data.get("subtitle", existing[3])
                excerpt = data.get("excerpt", existing[4])
                category = data.get("category", existing[5])
                read_time = data.get("readTime") or data.get("read_time", existing[6])
                publish_date = data.get("publishDate") or data.get("date", existing[7])
                author_name = data.get("author") or data.get("authorName", existing[8])
                author_credentials = data.get("authorCredentials", existing[9])
                author_avatar = data.get("authorAvatar", existing[10])
                hero_image = data.get("heroImage") or data.get("hero_image", existing[11])
                secondary_image = data.get("secondaryImage") or data.get("secondary_image", existing[12])
                secondary_caption = data.get("secondaryCaption") or data.get("secondary_caption", existing[13])
                youtube_video_id = data.get("youtubeVideoId") or data.get("youtube_video_id", existing[14])
                video_title = data.get("videoTitle") or data.get("video_title", existing[15])
                
                tags = data.get("tags")
                tags_json = json.dumps(tags) if tags is not None else existing[16]

                key_takeaways = data.get("keyTakeaways") or data.get("key_takeaways")
                key_takeaways_json = json.dumps(key_takeaways) if key_takeaways is not None else existing[17]

                content_blocks = data.get("contentBlocks") or data.get("content_blocks")
                content_blocks_json = json.dumps(content_blocks) if content_blocks is not None else existing[18]

                important_links = data.get("importantLinks") or data.get("important_links")
                important_links_json = json.dumps(important_links) if important_links is not None else existing[19]

                is_featured = 1 if (data.get("isFeatured") or data.get("is_featured")) else 0
                status = data.get("status", existing[21]).upper()

                conn.execute(
                    """
                    UPDATE clinic_blogs SET
                        slug = ?, title = ?, subtitle = ?, excerpt = ?, category = ?,
                        read_time = ?, publish_date = ?, author_name = ?,
                        author_credentials = ?, author_avatar = ?, hero_image = ?,
                        secondary_image = ?, secondary_caption = ?, youtube_video_id = ?,
                        video_title = ?, tags_json = ?, key_takeaways_json = ?,
                        content_blocks_json = ?, important_links_json = ?,
                        is_featured = ?, status = ?, updated_at = CURRENT_TIMESTAMP
                    WHERE id = ?
                    """,
                    (
                        slug, title, subtitle, excerpt, category, read_time,
                        publish_date, author_name, author_credentials, author_avatar,
                        hero_image, secondary_image, secondary_caption, youtube_video_id,
                        video_title, tags_json, key_takeaways_json, content_blocks_json,
                        important_links_json, is_featured, status, bid
                    )
                )

            return cls.get_by_slug(slug)
        finally:
            conn.close()

    @classmethod
    def delete(cls, bid: str) -> bool:
        """Delete an article by ID."""
        cls._init_db()
        conn = sqlite3.connect(cls.DB_PATH)
        try:
            with conn:
                cur = conn.cursor()
                cur.execute("DELETE FROM clinic_blogs WHERE id = ?", (bid,))
                return cur.rowcount > 0
        finally:
            conn.close()

    @classmethod
    def reset_seed(cls) -> List[Dict[str, Any]]:
        """Reset and re-seed default articles."""
        cls._init_db()
        conn = sqlite3.connect(cls.DB_PATH)
        try:
            with conn:
                cls._seed_articles(conn)
            return cls.get_all(published_only=False)
        finally:
            conn.close()
