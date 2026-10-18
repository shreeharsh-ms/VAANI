import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Eye,
  Plus,
  Trash2,
  Image,
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

export const BlogEditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { notify } = useNotifications();
  const isEditing = Boolean(id);

  const [activeTab, setActiveTab] = useState('essentials');
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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
            tags: Array.isArray(d.tags) ? d.tags : [],
            keyTakeaways: Array.isArray(d.keyTakeaways) ? d.keyTakeaways : [],
            contentBlocks: Array.isArray(d.contentBlocks) && d.contentBlocks.length > 0
              ? d.contentBlocks
              : [{ heading: '', text: '', milestones: [] }],
            importantLinks: Array.isArray(d.importantLinks) ? d.importantLinks : [],
            isFeatured: Boolean(d.isFeatured),
            status: d.status || 'PUBLISHED',
          });
        }
      })
      .catch((err) => {
        console.error('Failed to load article for editing:', err);
        setErrorMsg('Could not load article from database.');
        notify.error('Could not load article for editing.');
      })
      .finally(() => setLoading(false));
  }, [id, isEditing]);

  // Keyboard shortcut: Ctrl + S or Cmd + S to save
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSubmit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // Auto-generate slug from title
  const handleTitleChange = (val) => {
    setFormData((prev) => {
      const updates = { title: val };
      if (!isEditing || !prev.slug) {
        updates.slug = val
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '');
      }
      return { ...prev, ...updates };
    });
  };

  // Tags
  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    const tag = tagInput.trim();
    if (!formData.tags.includes(tag)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tagToRemove),
    }));
  };

  // Takeaways
  const handleAddTakeaway = () => {
    if (!takeawayInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      keyTakeaways: [...prev.keyTakeaways, takeawayInput.trim()],
    }));
    setTakeawayInput('');
  };

  const handleRemoveTakeaway = (idx) => {
    setFormData((prev) => ({
      ...prev,
      keyTakeaways: prev.keyTakeaways.filter((_, i) => i !== idx),
    }));
  };

  // Content Blocks
  const handleAddBlock = () => {
    setFormData((prev) => ({
      ...prev,
      contentBlocks: [
        ...prev.contentBlocks,
        { heading: '', text: '', milestones: [] },
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
          { age: '24 Months', normal: 'Combines two words', warning: 'Fewer than 50 words' },
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

  if (loading) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
        <RefreshCw className="w-8 h-8 animate-spin text-purple-700 mb-3" />
        <p className="text-sm font-bold text-slate-700">Loading Clinical Article Studio...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 font-sans text-slate-800 pb-16">
      
      {/* ── STICKY TOP CONTROL HEADER (Full Width, Expansive, Professional) ── */}
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
              <h1 className="text-base sm:text-lg font-bold text-[#301444] leading-tight">
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
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border cursor-pointer transition-all ${
                  formData.status === 'PUBLISHED'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                    : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                }`}
                title="Click to toggle status"
              >
                ● {formData.status}
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

      {/* ── FULL-WIDTH EXPANSIVE EDITOR CANVAS (No Small Modal Window!) ── */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        
        {/* Navigation Tabs Bar */}
        <div className="px-4 sm:px-6 bg-slate-50 border-b border-slate-200 flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'essentials', label: '1. Essentials & SEO Metadata', icon: FileText },
            { id: 'media', label: '2. Media & Video Embeds', icon: Image },
            { id: 'takeaways', label: '3. Key Clinical Takeaways', icon: List },
            { id: 'content', label: '4. Modular Content & Milestones', icon: Sparkles },
            { id: 'publishing', label: '5. Citations & Attribution', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3.5 px-3.5 text-xs font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'border-[#301444] text-[#301444] bg-white rounded-t-lg shadow-2xs font-extrabold'
                    : 'border-transparent text-slate-600 hover:text-[#301444]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#301444]' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Body Canvas */}
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">

          {/* ══════════════════════════════════════════════════════════════════
              TAB 1: ESSENTIALS & SEO METADATA
              ══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'essentials' && (
            <div className="space-y-6 max-w-5xl">
              <div>
                <label className="text-xs font-bold text-slate-900 block mb-1.5">
                  Clinical Article Headline / Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Recognizing Early Signs of Speech Delay in Toddlers: When to Seek Clinical Help"
                  className="w-full px-4 py-2.5 text-sm sm:text-base font-bold text-slate-900 bg-white border border-slate-300 rounded-xl focus:border-purple-600 focus:ring-2 focus:ring-purple-100 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Canonical public address: https://vaaniclinic.com/blogs/{formData.slug || 'slug'}
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

              <div>
                <label className="text-xs font-bold text-slate-900 block mb-1.5">
                  Executive Excerpt Summary <span className="text-red-500">*</span>
                  <span className="text-slate-400 font-normal ml-2">
                    (Used in blog listing cards, social share cards, and Google search snippets)
                  </span>
                </label>
                <textarea
                  rows={3}
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="2 to 3 sentences summarizing the clinical finding, therapeutic protocol, and actionable guidance for parents..."
                  className="w-full px-4 py-2.5 text-xs text-slate-800 bg-white border border-slate-300 rounded-xl focus:border-purple-600 focus:outline-none leading-relaxed"
                />
              </div>

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
                    placeholder="Oct 12, 2026"
                    className="w-full px-3.5 py-2 text-xs text-slate-800 bg-white border border-slate-300 rounded-xl focus:border-purple-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Tags Section */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <label className="text-xs font-bold text-slate-900 block">
                  Search &amp; Filter Tags ({formData.tags.length})
                </label>
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
                    placeholder="Type keyword and press Enter (e.g. Speech Delay, Early Intervention, Satara)"
                    className="flex-1 px-3.5 py-2 text-xs text-slate-800 bg-white border border-slate-300 rounded-xl focus:border-purple-600 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-[#301444] hover:bg-[#461963] text-white rounded-xl text-xs font-bold"
                  >
                    Add Tag
                  </button>
                </div>

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
                        className="text-slate-400 hover:text-red-600 ml-1 text-sm font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              TAB 2: MEDIA & VIDEO EMBEDS
              ══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'media' && (
            <div className="space-y-6 max-w-5xl">
              <div>
                <label className="text-xs font-bold text-slate-900 block mb-1.5">
                  Hero Banner Image URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.heroImage}
                  onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })}
                  placeholder="/patient-pexels.jpg or https://..."
                  className="w-full px-3.5 py-2 text-xs font-mono text-slate-900 bg-white border border-slate-300 rounded-xl focus:border-purple-600 focus:outline-none mb-3"
                />

                {/* Quick Presets */}
                <div className="space-y-1.5">
                  <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block">
                    Select From In-Clinic Clinical Photos:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                    {PRESET_HERO_IMAGES.map((preset) => (
                      <button
                        key={preset.url}
                        type="button"
                        onClick={() => setFormData({ ...formData, heroImage: preset.url })}
                        className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                          formData.heroImage === preset.url
                            ? 'bg-purple-50 border-[#301444] text-[#301444] shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.label}
                          className="w-full h-14 object-cover rounded-lg mb-1"
                          onError={(e) => {
                            e.target.src = '/patient-pexels.jpg';
                          }}
                        />
                        <span className="text-[10px] font-bold block truncate">{preset.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hero Preview */}
                {formData.heroImage && (
                  <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-4">
                    <img
                      src={formData.heroImage}
                      alt="Hero Preview"
                      className="w-28 h-20 object-cover rounded-lg shadow-sm border border-slate-200"
                      onError={(e) => {
                        e.target.src = '/patient-pexels.jpg';
                      }}
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Selected Hero Banner</span>
                      <span className="text-[11px] font-mono text-purple-900">{formData.heroImage}</span>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Renders as full-width responsive header on `/blogs/{formData.slug || 'slug'}`
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Secondary Photo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                <div>
                  <label className="text-xs font-bold text-slate-900 block mb-1.5">
                    Secondary In-Clinic Session Photo URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.secondaryImage}
                    onChange={(e) => setFormData({ ...formData, secondaryImage: e.target.value })}
                    placeholder="/services/service-speech-therapy.jpg"
                    className="w-full px-3.5 py-2 text-xs font-mono text-slate-800 bg-white border border-slate-300 rounded-xl focus:border-purple-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-900 block mb-1.5">
                    Secondary Photo Caption
                  </label>
                  <input
                    type="text"
                    value={formData.secondaryCaption}
                    onChange={(e) => setFormData({ ...formData, secondaryCaption: e.target.value })}
                    placeholder="e.g. One-on-one pediatric articulation session at VAANI Clinic, Satara."
                    className="w-full px-3.5 py-2 text-xs text-slate-800 bg-white border border-slate-300 rounded-xl focus:border-purple-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* YouTube Clinical Demonstration Video Embed */}
              <div className="p-5 bg-purple-50/60 rounded-2xl border border-purple-200 space-y-3.5">
                <div className="flex items-center gap-2">
                  <Video className="w-5 h-5 text-[#301444]" />
                  <span className="text-xs sm:text-sm font-bold text-[#301444] uppercase tracking-wider">
                    YouTube Clinical Video Demonstration (Optional)
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Embed demonstration footage or pediatric guidance video. If left empty, the video container is gracefully omitted.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">
                      YouTube Video ID (11 characters)
                    </label>
                    <input
                      type="text"
                      value={formData.youtubeVideoId}
                      onChange={(e) => setFormData({ ...formData, youtubeVideoId: e.target.value.trim() })}
                      placeholder="e.g. 3NoESJjxw1k"
                      className="w-full px-3.5 py-2 text-xs font-mono font-bold text-slate-900 bg-white border border-slate-300 rounded-xl focus:border-purple-600 focus:outline-none"
                    />
                    <span className="text-[10.5px] text-slate-400 mt-1 block">
                      From URL: youtube.com/watch?v=<b>3NoESJjxw1k</b>
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
          )}

          {/* ══════════════════════════════════════════════════════════════════
              TAB 3: KEY CLINICAL TAKEAWAYS
              ══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'takeaways' && (
            <div className="space-y-5 max-w-5xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Key Clinical Takeaways (High-Visibility Purple Callout Box)
                  </h3>
                  <p className="text-xs text-slate-500">
                    These points appear in the high-visibility box right beneath the article header for fast mobile reading.
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
                  placeholder="Enter takeaway point (e.g. Gestural communication like pointing by 12 months is as critical as spoken words)"
                  className="flex-1 px-4 py-2.5 text-xs text-slate-900 bg-white border border-slate-300 rounded-xl focus:border-purple-600 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddTakeaway}
                  className="px-5 py-2.5 bg-[#301444] hover:bg-[#461963] text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
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
                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start justify-between gap-3 group hover:bg-purple-50/50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-800 font-medium leading-relaxed">{point}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveTakeaway(idx)}
                      className="text-slate-400 hover:text-red-600 transition-colors p-1"
                      title="Remove Point"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              TAB 4: MODULAR CONTENT SECTIONS & MILESTONES TABLE
              ══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'content' && (
            <div className="space-y-6 max-w-5xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Modular Content Sections ({formData.contentBlocks.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Add comprehensive sections. Each section includes an editorial heading, rich text description, and an optional developmental milestone table.
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
                  className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4 relative"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="font-bold text-xs text-[#301444] uppercase tracking-wider">
                      Section #{bIdx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveBlock(bIdx)}
                      className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                      title="Delete Section"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">
                      Section Heading
                    </label>
                    <input
                      type="text"
                      value={block.heading}
                      onChange={(e) => handleBlockChange(bIdx, 'heading', e.target.value)}
                      placeholder="e.g. Age-Wise Developmental Milestones & Warning Signs"
                      className="w-full px-3.5 py-2 text-xs font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:border-purple-600 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">
                      Section Content Description
                    </label>
                    <textarea
                      rows={5}
                      value={block.text}
                      onChange={(e) => handleBlockChange(bIdx, 'text', e.target.value)}
                      placeholder="Detailed explanation, clinical research, therapeutic rationale..."
                      className="w-full px-4 py-2.5 text-xs text-slate-800 bg-white border border-slate-300 rounded-xl focus:border-purple-600 focus:outline-none leading-relaxed"
                    />
                  </div>

                  {/* Interactive Milestones Comparison Table Builder */}
                  <div className="pt-3 border-t border-slate-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-purple-700" />
                        <span>Developmental Milestones Comparison Table ({block.milestones?.length || 0} stages)</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAddMilestone(bIdx)}
                        className="px-3 py-1 bg-purple-100 hover:bg-purple-200 text-[#301444] rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Stage Row</span>
                      </button>
                    </div>

                    {block.milestones && block.milestones.length > 0 && (
                      <div className="space-y-2.5">
                        {block.milestones.map((m, mIdx) => (
                          <div
                            key={mIdx}
                            className="p-3 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                          >
                            <div className="sm:col-span-3">
                              <label className="text-[10.5px] font-bold text-slate-700 block mb-0.5">
                                Age / Stage Bracket
                              </label>
                              <input
                                type="text"
                                value={m.age}
                                onChange={(e) => handleMilestoneChange(bIdx, mIdx, 'age', e.target.value)}
                                placeholder="12 Months"
                                className="w-full px-2.5 py-1.5 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg"
                              />
                            </div>
                            <div className="sm:col-span-4">
                              <label className="text-[10.5px] font-bold text-emerald-800 block mb-0.5">
                                Expected Normal Development
                              </label>
                              <input
                                type="text"
                                value={m.normal}
                                onChange={(e) => handleMilestoneChange(bIdx, mIdx, 'normal', e.target.value)}
                                placeholder="Babbling, responds to name..."
                                className="w-full px-2.5 py-1.5 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg"
                              />
                            </div>
                            <div className="sm:col-span-4">
                              <label className="text-[10.5px] font-bold text-amber-800 block mb-0.5">
                                Clinical Warning Red Flag
                              </label>
                              <input
                                type="text"
                                value={m.warning}
                                onChange={(e) => handleMilestoneChange(bIdx, mIdx, 'warning', e.target.value)}
                                placeholder="Does not turn to name..."
                                className="w-full px-2.5 py-1.5 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg"
                              />
                            </div>
                            <div className="sm:col-span-1 flex justify-center pt-2 sm:pt-4">
                              <button
                                type="button"
                                onClick={() => handleRemoveMilestone(bIdx, mIdx)}
                                className="text-slate-400 hover:text-red-600 p-1"
                                title="Remove row"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              TAB 5: CITATIONS, ATTRIBUTION & PUBLISHING
              ══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'publishing' && (
            <div className="space-y-6 max-w-5xl">
              
              {/* Publication Status & Landmark Featured Pin */}
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

              {/* Author Attribution */}
              <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-4">
                <span className="text-xs font-bold text-[#301444] uppercase tracking-wider block">
                  Author Attribution &amp; RCI Accreditations
                </span>
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
                      Credentials &amp; Degree Title
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
              </div>

              {/* Important Clinical Citations & Booking CTAs */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                      Important Clinical Links &amp; Citations ({formData.importantLinks.length})
                    </span>
                    <p className="text-[11px] text-slate-500">
                      External medical authorities (WHO, RCI, ICMR) or internal booking shortcuts.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddLink}
                    className="px-4 py-1.5 bg-[#301444] hover:bg-[#461963] text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Citation</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {formData.importantLinks.map((link, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                    >
                      <div className="sm:col-span-5">
                        <label className="text-[10px] font-bold text-slate-600 block mb-0.5">
                          Citation Label
                        </label>
                        <input
                          type="text"
                          value={link.label}
                          onChange={(e) => handleLinkChange(idx, 'label', e.target.value)}
                          placeholder="e.g. WHO Childhood Hearing Guidelines"
                          className="w-full px-3 py-1.5 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg"
                        />
                      </div>
                      <div className="sm:col-span-5">
                        <label className="text-[10px] font-bold text-slate-600 block mb-0.5">
                          Target URL
                        </label>
                        <input
                          type="text"
                          value={link.url}
                          onChange={(e) => handleLinkChange(idx, 'url', e.target.value)}
                          placeholder="https://... or /#booking-section"
                          className="w-full px-3 py-1.5 text-xs font-mono text-purple-950 bg-white border border-slate-300 rounded-lg"
                        />
                      </div>
                      <div className="sm:col-span-2 flex items-center justify-between pt-3">
                        <label className="text-[11px] text-slate-600 font-medium cursor-pointer">
                          <input
                            type="checkbox"
                            checked={link.isExternal}
                            onChange={(e) => handleLinkChange(idx, 'isExternal', e.target.checked)}
                            className="mr-1.5 rounded"
                          />
                          External
                        </label>
                        <button
                          type="button"
                          onClick={() => handleRemoveLink(idx)}
                          className="text-slate-400 hover:text-red-600 p-1"
                          title="Remove Link"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
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
