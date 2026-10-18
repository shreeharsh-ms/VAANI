import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Eye,
  Plus,
  Trash2,
  Image as ImageIcon,
  Video,
  List,
  FileText,
  Link as LinkIcon,
  CheckCircle2,
  Calendar,
  Clock,
  Sparkles,
  AlertCircle,
  BookOpen,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  UploadCloud,
  Check,
  Share2,
  Globe,
  Search,
  FileCheck,
  Play,
  Award,
  Layers,
  MapPin,
  X,
} from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { ROUTES } from '../../constants';

const PRESET_CATEGORIES = [
  'Pediatric Speech',
  'Audiology & Hearing',
  'Hearing Technology',
  'Voice & Fluency',
  'Adult Neurogenic',
  'CBT & Counseling',
  'Clinical Research',
];

const PRESET_HERO_IMAGES = [
  { label: 'Pediatric Care', url: '/patient-pexels.jpg' },
  { label: 'Speech Therapy Suite', url: '/services/service-speech-therapy.jpg' },
  { label: 'Audiology Sound Booth', url: '/services/service-audiology-pta.jpg' },
  { label: 'Hearing Aid Trial', url: '/services/hearing-aid.jpg' },
  { label: 'Voice Diagnostics', url: '/services/service-voice-therapy.jpg' },
  { label: 'Clinical Team', url: '/doc_avatars_group.png' },
  { label: 'Doctor Consultation', url: '/clinical-care.jpg' },
];

const SUGGESTED_TAGS = [
  'Speech Therapy',
  'Child Development',
  'Early Intervention',
  'Hearing Loss',
  'Pediatric Care',
  'Satara Clinic',
  'Language Delay',
  'Audiology',
  'RCI Standards',
  'Autism Communication',
];

export const BlogEditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { notify } = useNotifications();
  const isEditing = Boolean(id);

  const [activeTab, setActiveTab] = useState('essentials');
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Uploading state
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingSecondary, setUploadingSecondary] = useState(false);
  const [heroDragOver, setHeroDragOver] = useState(false);
  const [secondaryDragOver, setSecondaryDragOver] = useState(false);

  const heroFileInputRef = useRef(null);
  const secondaryFileInputRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    subtitle: '',
    excerpt: '',
    category: 'Pediatric Speech',
    readTime: '6 min read',
    publishDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    authorName: 'Ms. Palak Paresh Gandhi',
    authorCredentials: 'MASLP, RCI Registered Audiologist & Speech-Language Pathologist',
    authorAvatar: '/practitioner-palak-real.png',
    heroImage: '/patient-pexels.jpg',
    secondaryImage: '',
    secondaryCaption: '',
    youtubeVideoId: '',
    videoTitle: '',
    tags: ['Speech Therapy', 'Child Development', 'Satara'],
    keyTakeaways: [
      'Early clinical screening before 24 months yields up to 85% faster vocabulary recovery.',
      'Standardized RCI diagnostic batteries (REELS, 3-DLAT) map objective developmental milestones.',
    ],
    contentBlocks: [
      {
        heading: 'Clinical Overview & Diagnostic Rationale',
        text: 'The first three years of life represent the most critical period for speech and language acquisition. During this phase, neuroplasticity is at its peak.',
        milestones: [
          {
            age: '12 Months',
            normal: 'Babbling with varied consonants (baba, dada), responding to name, pointing at objects.',
            warning: 'Does not turn to voice, produces no vocal sounds, lacks eye contact.',
          },
          {
            age: '18 Months',
            normal: 'Uses 10–20 single words, imitates speech sounds, follows basic directions.',
            warning: 'Under 6 words, communicates only by crying or physical pulling.',
          },
        ],
      },
    ],
    importantLinks: [
      {
        label: 'WHO: Childhood Hearing & Communication Development Guidelines',
        url: 'https://www.who.int/news-room/fact-sheets/detail/deafness-and-hearing-loss',
        isExternal: true,
      },
      {
        label: 'Schedule a Pediatric Evaluation at VAANI Satara',
        url: '/#booking-section',
        isExternal: false,
      },
    ],
    isFeatured: false,
    status: 'PUBLISHED',
  });

  const [tagInput, setTagInput] = useState('');
  const [takeawayInput, setTakeawayInput] = useState('');

  // If editing, load the article from the API
  useEffect(() => {
    if (!isEditing) {
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`/api/v1/blogs/${encodeURIComponent(id)}?preview=true`)
      .then((res) => {
        if (!res.ok) throw new Error('Article not found');
        return res.json();
      })
      .then((res) => {
        if (res?.data) {
          const d = res.data;
          setFormData({
            id: d.id,
            title: d.title || '',
            slug: d.slug || '',
            subtitle: d.subtitle || '',
            excerpt: d.excerpt || '',
            category: d.category || 'Pediatric Speech',
            readTime: d.readTime || d.read_time || '5 min read',
            publishDate: d.publishDate || d.date || '',
            authorName: d.authorName || d.author || 'Ms. Palak Paresh Gandhi',
            authorCredentials: d.authorCredentials || 'MASLP, RCI Registered Audiologist & Speech-Language Pathologist',
            authorAvatar: d.authorAvatar || '/practitioner-palak-real.png',
            heroImage: d.heroImage || '/patient-pexels.jpg',
            secondaryImage: d.secondaryImage || '',
            secondaryCaption: d.secondaryCaption || '',
            youtubeVideoId: d.youtubeVideoId || '',
            videoTitle: d.videoTitle || '',
            tags: Array.isArray(d.tags) ? d.tags : ['Speech Therapy', 'Satara'],
            keyTakeaways: Array.isArray(d.keyTakeaways) ? d.keyTakeaways : [],
            contentBlocks: Array.isArray(d.contentBlocks) ? d.contentBlocks : [],
            importantLinks: Array.isArray(d.importantLinks) ? d.importantLinks : [],
            isFeatured: Boolean(d.isFeatured),
            status: d.status || 'PUBLISHED',
          });
        }
      })
      .catch((err) => {
        console.error('Error fetching blog for editing:', err);
        setErrorMsg('Could not find or load article for editing.');
        notify.error('Article not found.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, isEditing]);

  // Handle title change and auto-generate slug if new
  const handleTitleChange = (val) => {
    setFormData((prev) => {
      const updated = { ...prev, title: val };
      if (!isEditing && (!prev.slug || prev.slug === createSlug(prev.title))) {
        updated.slug = createSlug(val);
      }
      return updated;
    });
  };

  const createSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80);
  };

  // Smart YouTube ID extractor from full URL or bare ID
  const handleYoutubeInput = (inputVal) => {
    const val = inputVal.trim();
    const match = val.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    const videoId = match && match[1] ? match[1] : val;
    setFormData((prev) => ({ ...prev, youtubeVideoId: videoId }));
  };

  // Image Upload Handler (Uploads to local server storage without MongoDB)
  const handleImageFileUpload = async (file, targetField, setLoadingState) => {
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      notify.error('Please select an image file (JPG, PNG, WEBP, SVG).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      notify.error('Image size exceeds 8MB limit. Please choose a smaller image.');
      return;
    }

    setLoadingState(true);

    try {
      // 1. Attempt upload to Flask backend local storage endpoint
      const uploadData = new FormData();
      uploadData.append('file', file);
      const res = await fetch('/api/v1/blogs/upload-image', {
        method: 'POST',
        body: uploadData,
      });

      if (res.ok) {
        const json = await res.json();
        if (json?.data?.url) {
          setFormData((prev) => ({ ...prev, [targetField]: json.data.url }));
          notify.success('Image uploaded and saved to server storage!');
          setLoadingState(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Server upload endpoint not reachable, reading image locally:', err);
    }

    // 2. Client-side local reader with auto-compression (works 100% offline or on static Vercel)
    const reader = new FileReader();
    reader.onload = (e) => {
      const rawDataUrl = e.target.result;
      if (file.size > 800 * 1024 && file.type.startsWith('image/')) {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 1600;
          let width = img.width;
          let height = img.height;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const compressedUrl = canvas.toDataURL('image/jpeg', 0.85);
          setFormData((prev) => ({ ...prev, [targetField]: compressedUrl }));
          notify.success('Image loaded and optimized locally!');
          setLoadingState(false);
        };
        img.src = rawDataUrl;
      } else {
        setFormData((prev) => ({ ...prev, [targetField]: rawDataUrl }));
        notify.success('Image loaded locally!');
        setLoadingState(false);
      }
    };
    reader.onerror = () => {
      notify.error('Could not read image file.');
      setLoadingState(false);
    };
    reader.readAsDataURL(file);
  };

  // Tags
  const handleAddTag = (text) => {
    const val = (text || tagInput).trim().replace(/^#/, '');
    if (!val) return;
    if (!formData.tags.includes(val)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, val] }));
      setTagInput('');
    } else {
      notify.warning(`Tag #${val} is already added.`);
    }
  };

  const handleRemoveTag = (tag) => {
    setFormData((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
  };

  // Key Takeaways
  const handleAddTakeaway = (text) => {
    const val = (text || takeawayInput).trim();
    if (!val) return;
    setFormData((prev) => ({ ...prev, keyTakeaways: [...prev.keyTakeaways, val] }));
    setTakeawayInput('');
  };

  const handleRemoveTakeaway = (idx) => {
    setFormData((prev) => ({
      ...prev,
      keyTakeaways: prev.keyTakeaways.filter((_, i) => i !== idx),
    }));
  };

  // Modular Blocks
  const handleAddBlock = () => {
    setFormData((prev) => ({
      ...prev,
      contentBlocks: [
        ...prev.contentBlocks,
        {
          heading: 'New Clinical Guidance Section',
          text: '',
          milestones: [
            { age: '24 Months', normal: 'Combines two words', warning: 'Fewer than 50 words' },
          ],
        },
      ],
    }));
  };

  const handleRemoveBlock = (idx) => {
    setFormData((prev) => ({
      ...prev,
      contentBlocks: prev.contentBlocks.filter((_, i) => i !== idx),
    }));
  };

  const handleBlockChange = (idx, field, val) => {
    setFormData((prev) => {
      const updated = [...prev.contentBlocks];
      updated[idx] = { ...updated[idx], [field]: val };
      return { ...prev, contentBlocks: updated };
    });
  };

  // Milestones Table Rows
  const handleAddMilestone = (blockIdx) => {
    setFormData((prev) => {
      const updated = [...prev.contentBlocks];
      const milestones = updated[blockIdx].milestones || [];
      updated[blockIdx] = {
        ...updated[blockIdx],
        milestones: [
          ...milestones,
          { age: '36 Months', normal: 'Speaks in 3-to-4 word sentences', warning: 'Unclear speech, frequent tantrums' },
        ],
      };
      return { ...prev, contentBlocks: updated };
    });
  };

  const handleRemoveMilestone = (blockIdx, mIdx) => {
    setFormData((prev) => {
      const updated = [...prev.contentBlocks];
      const milestones = updated[blockIdx].milestones.filter((_, i) => i !== mIdx);
      updated[blockIdx] = { ...updated[blockIdx], milestones };
      return { ...prev, contentBlocks: updated };
    });
  };

  const handleMilestoneChange = (blockIdx, mIdx, field, val) => {
    setFormData((prev) => {
      const updated = [...prev.contentBlocks];
      const milestones = [...updated[blockIdx].milestones];
      milestones[mIdx] = { ...milestones[mIdx], [field]: val };
      updated[blockIdx] = { ...updated[blockIdx], milestones };
      return { ...prev, contentBlocks: updated };
    });
  };

  // Important links
  const handleAddLink = () => {
    setFormData((prev) => ({
      ...prev,
      importantLinks: [
        ...prev.importantLinks,
        { label: 'Clinical Resource', url: 'https://', isExternal: true },
      ],
    }));
  };

  const handleRemoveLink = (idx) => {
    setFormData((prev) => ({
      ...prev,
      importantLinks: prev.importantLinks.filter((_, i) => i !== idx),
    }));
  };

  const handleLinkChange = (idx, field, val) => {
    setFormData((prev) => {
      const updated = [...prev.importantLinks];
      updated[idx] = { ...updated[idx], [field]: val };
      return { ...prev, importantLinks: updated };
    });
  };

  // Save handler
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!formData.title.trim()) {
      setErrorMsg('Article title is required.');
      setActiveTab('essentials');
      notify.error('Article title is required.');
      return;
    }
    if (!formData.excerpt.trim()) {
      setErrorMsg('Article excerpt summary is required.');
      setActiveTab('essentials');
      notify.error('Article excerpt summary is required.');
      return;
    }

    setSaving(true);
    setErrorMsg('');

    try {
      const url = isEditing ? `/api/v1/blogs/${formData.id}` : '/api/v1/blogs';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || json.message || 'Failed to save article');
      }

      notify.success(`Article "${formData.title}" saved successfully to database!`);
      navigate('/dashboard/blogs');
    } catch (err) {
      console.error('Error saving blog article:', err);
      setErrorMsg(err.message || 'Failed to save article.');
      notify.error(err.message || 'Failed to save article.');
    } finally {
      setSaving(false);
    }
  };

  // Real-time Content Quality & SEO Score calculation
  const seoScore = useMemo(() => {
    let score = 0;
    if (formData.title.length >= 25 && formData.title.length <= 100) score += 25;
    else if (formData.title.length > 0) score += 12;

    if (formData.slug.length >= 5) score += 15;

    if (formData.excerpt.length >= 80 && formData.excerpt.length <= 300) score += 20;
    else if (formData.excerpt.length > 0) score += 10;

    if (formData.heroImage) score += 15;
    if (formData.keyTakeaways.length >= 2) score += 10;
    if (formData.tags.length >= 2) score += 10;
    if (formData.contentBlocks.length >= 1) score += 5;

    return Math.min(100, score);
  }, [formData]);

  if (loading) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
        <RefreshCw className="w-8 h-8 animate-spin text-purple-700 mb-3" />
        <p className="text-sm font-bold text-slate-700">Loading Clinical Article Studio...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 font-sans text-slate-800 pb-20">
      
      {/* ── STICKY CONTROL HEADER (Full Width, Luxury & Responsive) ── */}
      <div className="sticky top-2 z-30 bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl p-3 sm:p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard/blogs"
            className="p-2 rounded-lg border border-slate-200 hover:bg-purple-50 text-slate-600 hover:text-[#301444] transition-colors"
            title="Back to All Articles"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-[#301444] leading-tight truncate max-w-md sm:max-w-xl">
                {isEditing ? `Edit: ${formData.title || 'Untitled Article'}` : 'Author New Clinical Article'}
              </h1>
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    status: prev.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED',
                  }))
                }
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border cursor-pointer transition-all flex items-center gap-1 ${
                  formData.status === 'PUBLISHED'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                    : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                }`}
                title="Click to toggle status"
              >
                <span className={`w-1.5 h-1.5 rounded-full ${formData.status === 'PUBLISHED' ? 'bg-emerald-600' : 'bg-amber-600'}`} />
                <span>{formData.status}</span>
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Full-Page Clinical Authoring Studio • Evidence-Based Publishing (Satara)
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {formData.slug && (
            <Link
              to={`/blogs/${formData.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-purple-50 text-slate-700 hover:text-[#301444] text-xs font-bold transition-all flex items-center gap-1.5"
              title="Preview on Public Website"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Preview Live</span>
            </Link>
          )}

          <Link
            to="/dashboard/blogs"
            className="px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors"
          >
            Cancel
          </Link>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="px-5 py-2 rounded-lg bg-[#301444] hover:bg-[#461963] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-purple-200" />
            <span>{saving ? 'Saving...' : isEditing ? 'Update & Save' : 'Publish Article'}</span>
          </button>
        </div>

      </div>

      {/* Error alert banner */}
      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-800">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* ── FULL-WIDTH EXPANSIVE STUDIO CARD (No Artificial max-w-5xl, Balanced Across Viewport) ── */}
      <div className="w-full bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        
        {/* Full-Width Grid Navigation Tabs Bar */}
        <div className="p-2 bg-slate-100/70 border-b border-slate-200 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {[
            { id: 'essentials', label: '1. Essentials & SEO', sub: 'Title, Slug & Tags', icon: FileText },
            { id: 'media', label: '2. Media & Uploads', sub: 'Photos & YouTube Video', icon: ImageIcon },
            { id: 'takeaways', label: '3. Key Takeaways', sub: 'Clinical Callout Bullets', icon: List },
            { id: 'content', label: '4. Content & Milestones', sub: 'Detailed Tables & Norms', icon: Sparkles },
            { id: 'publishing', label: '5. Attribution & Citations', sub: 'RCI Author & CTAs', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-3 rounded-xl text-left transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-white border-purple-200 shadow-sm text-[#301444] ring-1 ring-[#301444]/10'
                    : 'bg-transparent border-transparent text-slate-600 hover:bg-white/60 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isActive ? 'bg-[#301444] text-white' : 'bg-slate-200/80 text-slate-500'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold block truncate">{tab.label}</span>
                    <span className="text-[10px] text-slate-400 block truncate">{tab.sub}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Tab Body Canvas */}
        <div className="p-4 sm:p-6 lg:p-8 w-full">

          {/* ══════════════════════════════════════════════════════════════════
              TAB 1: ESSENTIALS & SEO METADATA (Full Width 2-Column Responsive Studio)
              ══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'essentials' && (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start w-full">
              
              {/* Left Column: Form Inputs (7 Columns on XL) */}
              <div className="xl:col-span-7 space-y-6">
                
                {/* Title */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-900">
                      Clinical Article Headline / Title <span className="text-red-500">*</span>
                    </label>
                    <span
                      className={`text-[11px] font-mono font-medium ${
                        formData.title.length > 70 ? 'text-amber-600' : 'text-slate-400'
                      }`}
                    >
                      {formData.title.length} / 100 characters
                    </span>
                  </div>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. Recognizing Early Signs of Speech Delay in Toddlers: When to Seek Clinical Help"
                    className="w-full px-4 py-2.5 text-sm sm:text-base font-bold text-slate-900 bg-white border border-slate-300 rounded-xl focus:border-purple-600 focus:ring-2 focus:ring-purple-100 focus:outline-none"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Keep titles concise and evidence-focused. Recommended: 40–70 characters for best Google click-through.
                  </p>
                </div>

                {/* Slug and Category (2 Columns) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-900 block mb-1.5">
                      URL Slug <span className="text-slate-400 font-normal">(/blogs/...)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="speech-delay-early-signs"
                      className="w-full px-3.5 py-2 text-xs font-mono font-bold text-purple-950 bg-slate-50 border border-slate-300 rounded-xl focus:border-purple-600 focus:bg-white focus:outline-none"
                    />
                    <span className="text-[10.5px] text-slate-400 mt-1 block truncate">
                      vaaniclinic.com/blogs/{formData.slug || 'slug'}
                    </span>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-900 block mb-1.5">
                      Clinical Discipline Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs font-bold text-slate-800 bg-white border border-slate-300 rounded-xl focus:border-purple-600 focus:outline-none"
                    >
                      {PRESET_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Subtitle */}
                <div>
                  <label className="text-xs font-bold text-slate-900 block mb-1.5">
                    Subtitle / Editorial Context
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="e.g. A clinical guide for parents on milestones between 12 and 36 months, evidence-based red flags in Satara."
                    className="w-full px-3.5 py-2 text-xs text-slate-800 bg-white border border-slate-300 rounded-xl focus:border-purple-600 focus:outline-none"
                  />
                </div>

                {/* Executive Excerpt */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-900">
                      Executive Excerpt Summary <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[11px] font-mono text-slate-400">
                      {formData.excerpt.length} characters
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    placeholder="2 to 3 sentences summarizing the clinical finding, therapeutic protocol, and actionable guidance for parents in Satara..."
                    className="w-full px-4 py-2.5 text-xs text-slate-800 bg-white border border-slate-300 rounded-xl focus:border-purple-600 focus:outline-none leading-relaxed"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Appears on card listings, WhatsApp link previews, and search engine result snippets.
                  </p>
                </div>

                {/* Reading Time & Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-900 block mb-1.5">
                      Estimated Reading Time
                    </label>
                    <input
                      type="text"
                      value={formData.readTime}
                      onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                      placeholder="6 min read"
                      className="w-full px-3.5 py-2 text-xs text-slate-800 bg-white border border-slate-300 rounded-xl focus:border-purple-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-900 block mb-1.5">
                      Publication Date
                    </label>
                    <input
                      type="text"
                      value={formData.publishDate}
                      onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                      placeholder="Oct 18, 2026"
                      className="w-full px-3.5 py-2 text-xs text-slate-800 bg-white border border-slate-300 rounded-xl focus:border-purple-600 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Tags Section with Preset Suggestions */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-900">
                      Search &amp; Filter Tags ({formData.tags.length})
                    </label>
                    <span className="text-[11px] text-slate-400">Press Enter or click Add</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      placeholder="Type custom tag keyword..."
                      className="flex-1 px-3.5 py-2 text-xs text-slate-800 bg-white border border-slate-300 rounded-xl focus:border-purple-600 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddTag()}
                      className="px-4 py-2 bg-[#301444] hover:bg-[#461963] text-white rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Add Tag
                    </button>
                  </div>

                  {/* Active Tags */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {formData.tags.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white text-purple-950 px-3 py-1 rounded-full border border-purple-200 shadow-2xs"
                      >
                        <span>#{t}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(t)}
                          className="text-slate-400 hover:text-red-600 ml-1 text-sm font-bold cursor-pointer"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Quick Suggestions */}
                  <div className="pt-2 border-t border-slate-200/80">
                    <span className="text-[10.5px] text-slate-500 font-bold uppercase tracking-wider block mb-1.5">
                      Quick Suggestions:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {SUGGESTED_TAGS.filter((s) => !formData.tags.includes(s)).map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleAddTag(tag)}
                          className="text-[11px] px-2 py-0.5 rounded-md bg-white hover:bg-purple-100 text-slate-600 hover:text-[#301444] border border-slate-200 transition-colors cursor-pointer"
                        >
                          + {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Live Search Engine & Social Preview (5 Columns on XL, Fills Empty Space) */}
              <div className="xl:col-span-5 space-y-5 xl:sticky xl:top-20">
                
                {/* Real-time SEO Readiness Checklist */}
                <div className="p-4 bg-purple-50/70 border border-purple-200/80 rounded-2xl shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-700" />
                      <span className="text-xs font-bold text-[#301444] uppercase tracking-wider">
                        SEO Quality &amp; Publishing Score
                      </span>
                    </div>
                    <span className="text-xs font-mono font-extrabold px-2 py-0.5 bg-white text-purple-900 rounded-full border border-purple-200 shadow-2xs">
                      {seoScore} / 100
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-white h-2 rounded-full overflow-hidden border border-purple-200">
                    <div
                      className={`h-full transition-all duration-300 ${
                        seoScore >= 80 ? 'bg-emerald-500' : seoScore >= 50 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${seoScore}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700 pt-1">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2
                        className={`w-3.5 h-3.5 ${
                          formData.title.length >= 25 ? 'text-emerald-600' : 'text-slate-300'
                        }`}
                      />
                      <span>Optimized Title</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2
                        className={`w-3.5 h-3.5 ${
                          formData.slug.length >= 5 ? 'text-emerald-600' : 'text-slate-300'
                        }`}
                      />
                      <span>Clean URL Slug</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2
                        className={`w-3.5 h-3.5 ${
                          formData.excerpt.length >= 80 ? 'text-emerald-600' : 'text-slate-300'
                        }`}
                      />
                      <span>Executive Excerpt</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2
                        className={`w-3.5 h-3.5 ${
                          formData.tags.length >= 2 ? 'text-emerald-600' : 'text-slate-300'
                        }`}
                      />
                      <span>Clinical Tags ({formData.tags.length})</span>
                    </div>
                  </div>
                </div>

                {/* Google Search Result Simulator */}
                <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <Search className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                      Google Search Result Preview (Satara)
                    </span>
                  </div>

                  <div className="pt-1 space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                      <div className="w-4 h-4 rounded-full bg-purple-100 text-[#301444] font-bold flex items-center justify-center text-[9px]">
                        V
                      </div>
                      <span className="truncate">https://vaaniclinic.com &gt; blogs &gt; {formData.slug || 'slug'}</span>
                    </div>

                    <h4 className="text-sm font-semibold text-[#1a0dab] hover:underline cursor-pointer line-clamp-1 leading-snug">
                      {formData.title || 'Recognizing Early Signs of Speech Delay in Toddlers | VAANI Clinic'}
                    </h4>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      <span className="text-slate-400 font-medium">{formData.publishDate} — </span>
                      {formData.excerpt ||
                        'A clinical guide for parents on milestones between 12 and 36 months, evidence-based red flags, and early intervention protocols in Satara...'}
                    </p>
                  </div>
                </div>

                {/* Social Card / WhatsApp Share Simulator */}
                <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <Share2 className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                      WhatsApp &amp; Social Share Card
                    </span>
                  </div>

                  <div className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50 mt-2">
                    <div className="relative h-32 w-full bg-slate-200 overflow-hidden">
                      <img
                        src={formData.heroImage || '/patient-pexels.jpg'}
                        alt="Share Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/patient-pexels.jpg';
                        }}
                      />
                      <span className="absolute top-2 left-2 bg-[#301444]/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs">
                        {formData.category}
                      </span>
                    </div>
                    <div className="p-3 bg-white space-y-1">
                      <span className="text-[10px] text-slate-400 font-mono block">vaaniclinic.com</span>
                      <h5 className="text-xs font-bold text-slate-900 line-clamp-1">
                        {formData.title || 'Clinical Article Headline'}
                      </h5>
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-tight">
                        {formData.excerpt || 'Article summary preview for social media cards.'}
                      </p>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              TAB 2: MEDIA & VIDEO EMBEDS (Full Width 2-Column Responsive Studio with Direct Uploads)
              ══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'media' && (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start w-full">
              
              {/* Left Column: Media Uploaders & Inputs (7 Columns on XL) */}
              <div className="xl:col-span-7 space-y-6">
                
                {/* 1. HERO BANNER IMAGE UPLOADER */}
                <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-purple-700" />
                      <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Hero Banner Image (Required) <span className="text-red-500">*</span>
                      </span>
                    </div>
                    <span className="text-[10.5px] font-mono text-slate-400">16:9 Landscape Recommended</span>
                  </div>

                  {/* Direct File Upload Drop Zone */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setHeroDragOver(true);
                    }}
                    onDragLeave={() => setHeroDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setHeroDragOver(false);
                      if (e.dataTransfer.files?.[0]) {
                        handleImageFileUpload(e.dataTransfer.files[0], 'heroImage', setUploadingHero);
                      }
                    }}
                    onClick={() => heroFileInputRef.current?.click()}
                    className={`p-6 border-2 border-dashed rounded-xl text-center cursor-pointer transition-all ${
                      heroDragOver
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-slate-300 hover:border-purple-500 hover:bg-slate-50/70 bg-slate-50/40'
                    }`}
                  >
                    <input
                      type="file"
                      ref={heroFileInputRef}
                      accept="image/png,image/jpeg,image/webp,image/svg+xml"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleImageFileUpload(e.target.files[0], 'heroImage', setUploadingHero);
                        }
                      }}
                    />

                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-purple-100 text-[#301444] flex items-center justify-center shadow-xs">
                        {uploadingHero ? (
                          <RefreshCw className="w-5 h-5 animate-spin" />
                        ) : (
                          <UploadCloud className="w-6 h-6" />
                        )}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-[#301444] block">
                          {uploadingHero ? 'Uploading Image to Clinic Storage...' : 'Click to Upload Hero Image or Drag & Drop'}
                        </span>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          JPG, PNG, WEBP, or SVG • Stored on server storage (Zero MongoDB)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Manual URL input fallback */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      Or Paste Image Path / Direct URL:
                    </label>
                    <input
                      type="text"
                      value={formData.heroImage}
                      onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })}
                      placeholder="/patient-pexels.jpg or https://..."
                      className="w-full px-3.5 py-2 text-xs font-mono text-slate-900 bg-white border border-slate-300 rounded-xl focus:border-purple-600 focus:outline-none"
                    />
                  </div>

                  {/* Preset Photos Gallery */}
                  <div className="space-y-2 pt-2">
                    <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block">
                      Or Choose from In-Clinic Preset Photos:
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                      {PRESET_HERO_IMAGES.map((preset) => (
                        <button
                          key={preset.url}
                          type="button"
                          onClick={() => setFormData({ ...formData, heroImage: preset.url })}
                          className={`p-1.5 rounded-xl border text-center transition-all cursor-pointer ${
                            formData.heroImage === preset.url
                              ? 'bg-purple-50 border-[#301444] ring-2 ring-[#301444]/20 text-[#301444]'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <img
                            src={preset.url}
                            alt={preset.label}
                            className="w-full h-12 object-cover rounded-lg mb-1"
                            onError={(e) => {
                              e.target.src = '/patient-pexels.jpg';
                            }}
                          />
                          <span className="text-[9.5px] font-bold block truncate">{preset.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 2. SECONDARY CLINICAL SESSION IMAGE */}
                <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Secondary In-Clinic Session Image (Optional)
                    </span>
                    <span className="text-[10.5px] text-slate-400">Renders within article narrative</span>
                  </div>

                  {/* Secondary Image Drop Zone / Browse */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setSecondaryDragOver(true);
                    }}
                    onDragLeave={() => setSecondaryDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setSecondaryDragOver(false);
                      if (e.dataTransfer.files?.[0]) {
                        handleImageFileUpload(e.dataTransfer.files[0], 'secondaryImage', setUploadingSecondary);
                      }
                    }}
                    onClick={() => secondaryFileInputRef.current?.click()}
                    className={`p-4 border-2 border-dashed rounded-xl text-center cursor-pointer transition-all ${
                      secondaryDragOver
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-slate-300 hover:border-purple-500 hover:bg-slate-50/70 bg-slate-50/40'
                    }`}
                  >
                    <input
                      type="file"
                      ref={secondaryFileInputRef}
                      accept="image/png,image/jpeg,image/webp,image/svg+xml"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleImageFileUpload(e.target.files[0], 'secondaryImage', setUploadingSecondary);
                        }
                      }}
                    />

                    <div className="flex items-center justify-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-purple-100 text-[#301444] flex items-center justify-center">
                        {uploadingSecondary ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <UploadCloud className="w-4 h-4" />
                        )}
                      </div>
                      <div className="text-left">
                        <span className="text-xs font-bold text-slate-800 block">
                          Upload In-Clinic Session Photo
                        </span>
                        <span className="text-[10.5px] text-slate-500">
                          Click to select or drag image file here
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Image URL / File Path:
                      </label>
                      <input
                        type="text"
                        value={formData.secondaryImage}
                        onChange={(e) => setFormData({ ...formData, secondaryImage: e.target.value })}
                        placeholder="/services/service-speech-therapy.jpg"
                        className="w-full px-3 py-1.5 text-xs font-mono text-slate-800 bg-white border border-slate-300 rounded-lg focus:border-purple-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Clinical Photo Caption:
                      </label>
                      <input
                        type="text"
                        value={formData.secondaryCaption}
                        onChange={(e) => setFormData({ ...formData, secondaryCaption: e.target.value })}
                        placeholder="e.g. One-on-one pediatric articulation session at VAANI Clinic, Satara."
                        className="w-full px-3 py-1.5 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg focus:border-purple-600 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. YOUTUBE CLINICAL VIDEO EMBED */}
                <div className="p-5 bg-purple-50/60 rounded-2xl border border-purple-200 space-y-3.5">
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-[#301444]" />
                    <span className="text-xs font-bold text-[#301444] uppercase tracking-wider">
                      YouTube Clinical Video Demonstration (Optional)
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Paste any full YouTube URL (e.g. <code>https://youtube.com/watch?v=3NoESJjxw1k</code>) or just the 11-character video ID.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1">
                        YouTube URL or Video ID
                      </label>
                      <input
                        type="text"
                        value={formData.youtubeVideoId}
                        onChange={(e) => handleYoutubeInput(e.target.value)}
                        placeholder="e.g. 3NoESJjxw1k"
                        className="w-full px-3.5 py-2 text-xs font-mono font-bold text-slate-900 bg-white border border-slate-300 rounded-xl focus:border-purple-600 focus:outline-none"
                      />
                      <span className="text-[10.5px] text-slate-400 mt-1 block">
                        Extracted ID: <b>{formData.youtubeVideoId || 'None'}</b>
                      </span>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1">
                        Video Subtitle / Heading
                      </label>
                      <input
                        type="text"
                        value={formData.videoTitle}
                        onChange={(e) => setFormData({ ...formData, videoTitle: e.target.value })}
                        placeholder="e.g. Clinical Guide: Toddler Speech Delays & When to Seek Therapy"
                        className="w-full px-3.5 py-2 text-xs text-slate-800 bg-white border border-slate-300 rounded-xl focus:border-purple-600 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Live Media Showcase (5 Columns on XL, Fills Empty Space) */}
              <div className="xl:col-span-5 space-y-5 xl:sticky xl:top-20">
                
                {/* Live Hero Banner Showcase Card */}
                <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                      Live Hero Banner Showcase
                    </span>
                    {formData.heroImage && (
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, heroImage: '' }))}
                        className="text-[11px] text-red-600 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <X className="w-3 h-3" /> Clear Image
                      </button>
                    )}
                  </div>

                  <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner">
                    {formData.heroImage ? (
                      <img
                        src={formData.heroImage}
                        alt="Hero Banner Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/patient-pexels.jpg';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-4 text-center">
                        <ImageIcon className="w-8 h-8 mb-1 opacity-50" />
                        <span className="text-xs font-semibold">No Hero Image Selected</span>
                      </div>
                    )}
                    
                    {formData.heroImage && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-4">
                        <span className="text-[10px] uppercase font-bold text-purple-200 tracking-wider">
                          {formData.category}
                        </span>
                        <h4 className="text-white text-xs sm:text-sm font-bold line-clamp-2">
                          {formData.title || 'Clinical Article Headline'}
                        </h4>
                      </div>
                    )}
                  </div>

                  <div className="text-[11px] text-slate-500 space-y-0.5 pt-1">
                    <div className="flex justify-between">
                      <span>Source:</span>
                      <span className="font-mono text-purple-900 truncate max-w-[200px] text-right">
                        {formData.heroImage || 'Default placeholder'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Display Ratio:</span>
                      <span className="font-semibold text-slate-700">Full-width responsive 16:9</span>
                    </div>
                  </div>
                </div>

                {/* Live Secondary Photo Showcase */}
                {formData.secondaryImage && (
                  <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                        Secondary Session Photo
                      </span>
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, secondaryImage: '' }))}
                        className="text-[11px] text-red-600 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <X className="w-3 h-3" /> Remove
                      </button>
                    </div>

                    <div className="rounded-xl overflow-hidden border border-slate-200">
                      <img
                        src={formData.secondaryImage}
                        alt="Secondary Preview"
                        className="w-full h-40 object-cover"
                        onError={(e) => {
                          e.target.src = '/services/service-speech-therapy.jpg';
                        }}
                      />
                      {formData.secondaryCaption && (
                        <div className="p-2.5 bg-slate-50 text-[11px] text-slate-600 italic border-t border-slate-200">
                          {formData.secondaryCaption}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Live Video Embed Preview */}
                {formData.youtubeVideoId && (
                  <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <span className="text-[11px] font-bold text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
                        <Play className="w-3.5 h-3.5 text-purple-700" />
                        <span>Live Video Player Preview</span>
                      </span>
                    </div>

                    <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-200 bg-black shadow-xs">
                      <iframe
                        src={`https://www.youtube.com/embed/${formData.youtubeVideoId}`}
                        title="Clinical Demonstration Video"
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                    {formData.videoTitle && (
                      <p className="text-xs font-bold text-slate-800 mt-1">
                        {formData.videoTitle}
                      </p>
                    )}
                  </div>
                )}

              </div>

            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              TAB 3: KEY CLINICAL TAKEAWAYS (Full Width 2-Column Responsive Studio)
              ══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'takeaways' && (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start w-full">
              
              {/* Left Column: Input and Takeaways Manager (7 Columns on XL) */}
              <div className="xl:col-span-7 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Key Clinical Takeaways (High-Visibility Callout Box)
                    </h3>
                    <p className="text-xs text-slate-500">
                      These points appear prominently beneath the article hero for fast reading by busy parents.
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#301444] bg-purple-100 px-3 py-1 rounded-full border border-purple-200">
                    {formData.keyTakeaways.length} Takeaways
                  </span>
                </div>

                {/* Add Takeaway Input */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={takeawayInput}
                    onChange={(e) => setTakeawayInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTakeaway();
                      }
                    }}
                    placeholder="Enter clinical takeaway point (e.g. Gestural communication like pointing by 12 months is as critical as spoken words)"
                    className="flex-1 px-4 py-2.5 text-xs text-slate-900 bg-white border border-slate-300 rounded-xl focus:border-purple-600 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddTakeaway()}
                    className="px-5 py-2.5 bg-[#301444] hover:bg-[#461963] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Point</span>
                  </button>
                </div>

                {/* Takeaway Items List */}
                <div className="space-y-2.5 pt-2">
                  {formData.keyTakeaways.map((point, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-start justify-between gap-3 group hover:bg-purple-50/50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-900 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="text-xs text-slate-800 font-medium leading-relaxed">{point}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveTakeaway(idx)}
                        className="text-slate-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
                        title="Remove Point"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Live Takeaways Box Preview (5 Columns on XL, Fills Empty Space) */}
              <div className="xl:col-span-5 space-y-4 xl:sticky xl:top-20">
                <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-3">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block pb-2 border-b border-slate-100">
                    Live Takeaways Callout Preview
                  </span>

                  {/* Public Site Callout Simulation */}
                  <div className="bg-gradient-to-br from-purple-50/90 to-white border border-purple-200/90 rounded-2xl p-5 shadow-xs space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-purple-600" />
                      <h4 className="text-xs sm:text-sm font-bold text-[#301444] uppercase tracking-wider">
                        Key Clinical Points &amp; Takeaways
                      </h4>
                    </div>

                    <ul className="space-y-2.5 pt-1">
                      {formData.keyTakeaways.length > 0 ? (
                        formData.keyTakeaways.map((pt, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-xs text-slate-800 leading-relaxed">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <span>{pt}</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-xs text-slate-400 italic">No takeaways added yet.</li>
                      )}
                    </ul>

                    <div className="pt-2 border-t border-purple-100 text-[10.5px] text-purple-900 font-medium flex items-center justify-between">
                      <span>VAANI Evidence-Based Clinical Guidance</span>
                      <span>Satara, Maharashtra</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              TAB 4: MODULAR CONTENT SECTIONS & MILESTONES TABLE (Full Width Studio)
              ══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'content' && (
            <div className="w-full space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Modular Narrative Sections &amp; Milestones ({formData.contentBlocks.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Create detailed sections. Each section can have its own editorial heading, in-depth text, and an interactive Developmental Milestones comparison table.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddBlock}
                  className="px-4 py-2 bg-[#301444] hover:bg-[#461963] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Section</span>
                </button>
              </div>

              {formData.contentBlocks.map((block, bIdx) => (
                <div
                  key={bIdx}
                  className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-5 relative"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="font-bold text-xs text-[#301444] uppercase tracking-wider flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-purple-700" />
                      <span>Section #{bIdx + 1}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveBlock(bIdx)}
                      className="text-slate-400 hover:text-red-600 p-1 transition-colors cursor-pointer"
                      title="Delete Section"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Section Heading */}
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">
                      Section Heading
                    </label>
                    <input
                      type="text"
                      value={block.heading}
                      onChange={(e) => handleBlockChange(bIdx, 'heading', e.target.value)}
                      placeholder="e.g. Age-Wise Developmental Milestones & Warning Signs"
                      className="w-full px-4 py-2.5 text-sm font-bold text-slate-900 bg-slate-50/70 border border-slate-300 rounded-xl focus:border-purple-600 focus:bg-white focus:outline-none"
                    />
                  </div>

                  {/* Section Content */}
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">
                      Clinical Narrative &amp; Explanations
                    </label>
                    <textarea
                      rows={5}
                      value={block.text}
                      onChange={(e) => handleBlockChange(bIdx, 'text', e.target.value)}
                      placeholder="Detailed clinical explanations, evidence-based research, neurological insights, and parent guidance..."
                      className="w-full px-4 py-3 text-xs sm:text-sm text-slate-800 bg-white border border-slate-300 rounded-xl focus:border-purple-600 focus:outline-none leading-relaxed"
                    />
                  </div>

                  {/* Expansive Developmental Milestones Comparison Table Builder */}
                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-purple-700" />
                        <span>Developmental Milestones Table ({block.milestones?.length || 0} Age Stages)</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAddMilestone(bIdx)}
                        className="px-3.5 py-1.5 bg-purple-100 hover:bg-purple-200 text-[#301444] rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Stage Row</span>
                      </button>
                    </div>

                    {block.milestones && block.milestones.length > 0 && (
                      <div className="w-full border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
                            <tr>
                              <th className="py-2.5 px-3 w-36 sm:w-44">Age Stage</th>
                              <th className="py-2.5 px-3">Expected Clinical Normal</th>
                              <th className="py-2.5 px-3">Clinical Warning Sign / Red Flag</th>
                              <th className="py-2.5 px-3 w-12 text-center">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 bg-white">
                            {block.milestones.map((m, mIdx) => (
                              <tr key={mIdx} className="hover:bg-slate-50/60">
                                <td className="py-2.5 px-3 align-top">
                                  <input
                                    type="text"
                                    value={m.age}
                                    onChange={(e) =>
                                      handleMilestoneChange(bIdx, mIdx, 'age', e.target.value)
                                    }
                                    placeholder="e.g. 12 Months"
                                    className="w-full px-2.5 py-1.5 font-bold text-xs text-purple-950 bg-slate-50 border border-slate-200 rounded-lg focus:border-purple-600 focus:bg-white focus:outline-none"
                                  />
                                </td>
                                <td className="py-2.5 px-3 align-top">
                                  <textarea
                                    rows={2}
                                    value={m.normal}
                                    onChange={(e) =>
                                      handleMilestoneChange(bIdx, mIdx, 'normal', e.target.value)
                                    }
                                    placeholder="Expected speech and gestural communication..."
                                    className="w-full px-2.5 py-1.5 text-xs text-slate-800 bg-white border border-slate-200 rounded-lg focus:border-purple-600 focus:outline-none leading-relaxed"
                                  />
                                </td>
                                <td className="py-2.5 px-3 align-top">
                                  <textarea
                                    rows={2}
                                    value={m.warning}
                                    onChange={(e) =>
                                      handleMilestoneChange(bIdx, mIdx, 'warning', e.target.value)
                                    }
                                    placeholder="Clinical indicators that warrant evaluation..."
                                    className="w-full px-2.5 py-1.5 text-xs text-red-900 bg-red-50/40 border border-red-200 rounded-lg focus:border-red-500 focus:bg-white focus:outline-none leading-relaxed"
                                  />
                                </td>
                                <td className="py-2.5 px-3 align-top text-center">
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveMilestone(bIdx, mIdx)}
                                    className="p-1.5 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                                    title="Delete Milestone Stage"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                </div>
              ))}
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              TAB 5: CITATIONS, ATTRIBUTION & PUBLISHING (Full Width 2-Column Responsive Studio)
              ══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'publishing' && (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start w-full">
              
              {/* Left Column: Author and References Form (7 Columns on XL) */}
              <div className="xl:col-span-7 space-y-6">
                
                {/* Publication Status & Featured Pin */}
                <div className="p-5 bg-purple-50/50 rounded-2xl border border-purple-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-900 block mb-1.5">
                      Publication Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl focus:border-purple-600 focus:outline-none"
                    >
                      <option value="PUBLISHED">PUBLISHED (Visible immediately on Public Site)</option>
                      <option value="DRAFT">DRAFT (Hidden from Public)</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-3 pt-4 sm:pt-6">
                    <input
                      type="checkbox"
                      id="isFeatured"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500 cursor-pointer"
                    />
                    <label htmlFor="isFeatured" className="text-xs font-bold text-slate-900 cursor-pointer">
                      Pin as Featured Landmark Article (Top Banner on `/blogs`)
                    </label>
                  </div>
                </div>

                {/* Author Attribution & Accreditations */}
                <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <Award className="w-4 h-4 text-purple-700" />
                    <span className="text-xs font-bold text-[#301444] uppercase tracking-wider">
                      Author Attribution &amp; Statutory RCI Credentials
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1">
                        Lead Practitioner Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.authorName}
                        onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                        placeholder="Ms. Palak Paresh Gandhi"
                        className="w-full px-3.5 py-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1">
                        Degrees &amp; RCI Title
                      </label>
                      <input
                        type="text"
                        value={formData.authorCredentials}
                        onChange={(e) => setFormData({ ...formData, authorCredentials: e.target.value })}
                        placeholder="MASLP, RCI Registered Audiologist & Speech-Language Pathologist"
                        className="w-full px-3.5 py-2 text-xs text-slate-800 bg-white border border-slate-300 rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">
                      Author Avatar Image URL
                    </label>
                    <input
                      type="text"
                      value={formData.authorAvatar}
                      onChange={(e) => setFormData({ ...formData, authorAvatar: e.target.value })}
                      placeholder="/practitioner-palak-real.png"
                      className="w-full px-3.5 py-2 text-xs font-mono text-slate-800 bg-white border border-slate-300 rounded-xl"
                    />
                  </div>
                </div>

                {/* Important Clinical Citations & Reference Links */}
                <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div>
                      <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                        Important Clinical Guidelines &amp; Citations ({formData.importantLinks.length})
                      </span>
                      <p className="text-[11px] text-slate-500">
                        External medical standards (WHO, RCI, ASHA) and internal clinic appointment CTAs.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddLink}
                      className="px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-[#301444] rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Link</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {formData.importantLinks.map((link, lIdx) => (
                      <div
                        key={lIdx}
                        className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 relative"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-500 uppercase">
                            Link #{lIdx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveLink(lIdx)}
                            className="text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={link.label}
                            onChange={(e) => handleLinkChange(lIdx, 'label', e.target.value)}
                            placeholder="Resource Label (e.g. WHO: Childhood Hearing Standards)"
                            className="w-full px-3 py-1.5 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg focus:border-purple-600 focus:outline-none"
                          />
                          <input
                            type="text"
                            value={link.url}
                            onChange={(e) => handleLinkChange(lIdx, 'url', e.target.value)}
                            placeholder="Target URL (e.g. https://who.int or /#booking-section)"
                            className="w-full px-3 py-1.5 text-xs font-mono text-slate-800 bg-white border border-slate-300 rounded-lg focus:border-purple-600 focus:outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Column: Live Author Card Preview (5 Columns on XL, Fills Empty Space) */}
              <div className="xl:col-span-5 space-y-4 xl:sticky xl:top-20">
                <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-3">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block pb-2 border-b border-slate-100">
                    Live Author Bio Preview
                  </span>

                  {/* Public Site Author Box Simulation */}
                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={formData.authorAvatar || '/practitioner-palak-real.png'}
                        alt={formData.authorName}
                        className="w-16 h-16 rounded-full object-cover border-2 border-[#301444]/20 shadow-xs"
                        onError={(e) => {
                          e.target.src = '/practitioner-palak-real.png';
                        }}
                      />
                      <div>
                        <h4 className="text-sm font-bold text-[#301444]">
                          {formData.authorName || 'Ms. Palak Paresh Gandhi'}
                        </h4>
                        <p className="text-[11px] text-slate-600 leading-tight mt-0.5">
                          {formData.authorCredentials}
                        </p>
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-purple-900 bg-purple-100 px-2 py-0.5 rounded-full mt-1.5 border border-purple-200">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          RCI CRR No. A79214
                        </span>
                      </div>
                    </div>

                    <p className="text-[11.5px] text-slate-600 leading-relaxed border-t border-slate-200 pt-3">
                      Lead Practitioner at VAANI Speech and Hearing Clinic. Specialized clinical expertise evaluating and rehabilitating pediatric speech delays and audiological disorders in Satara, Maharashtra.
                    </p>

                    <div className="pt-2">
                      <button
                        type="button"
                        className="w-full py-2 bg-[#301444] text-white rounded-xl text-xs font-bold text-center block"
                      >
                        Schedule Clinical Evaluation in Satara
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>

    </div>
  );
};

export default BlogEditorPage;
