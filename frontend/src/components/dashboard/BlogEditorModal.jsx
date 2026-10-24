import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
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
  Tag,
  AlertCircle,
  HelpCircle,
  BookOpen,
  ArrowRight,
} from 'lucide-react';

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

export const BlogEditorModal = ({ isOpen, onClose, article, onSaveSuccess }) => {
  const isEditing = Boolean(article && article.id);
  const [activeTab, setActiveTab] = useState('essentials');
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
    publishDate: '',
    authorName: 'ASLP Palak Paresh Gandhi',
    authorCredentials: 'BASLP, RCI Registered Audiologist & Speech-Language Pathologist',
    authorAvatar: '/practitioner-headshot.png',
    heroImage: '/patient-pexels.jpg',
    secondaryImage: '',
    secondaryCaption: '',
    youtubeVideoId: '',
    videoTitle: '',
    tags: ['Child Development', 'Speech Therapy'],
    keyTakeaways: [
      'Early clinical intervention yields significantly faster recovery.',
      'Standardized assessments map precise developmental delays.',
    ],
    contentBlocks: [
      {
        heading: 'Clinical Overview & Diagnostic Rationale',
        text: 'Detailed description of symptoms, clinical etiology, and therapeutic indications.',
        milestones: [],
      },
    ],
    importantLinks: [
      {
        label: 'Schedule a Consultation at VAANI Satara',
        url: '/#booking-section',
        isExternal: false,
      },
    ],
    isFeatured: false,
    status: 'PUBLISHED',
  });

  const [tagInput, setTagInput] = useState('');
  const [takeawayInput, setTakeawayInput] = useState('');

  // Populate data when editing or opening
  useEffect(() => {
    if (article) {
      setFormData({
        id: article.id,
        title: article.title || '',
        slug: article.slug || '',
        subtitle: article.subtitle || '',
        excerpt: article.excerpt || '',
        category: article.category || 'Pediatric Speech',
        readTime: article.readTime || article.read_time || '5 min read',
        publishDate: article.publishDate || article.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        authorName: article.authorName || article.author || 'ASLP Palak Paresh Gandhi',
        authorCredentials: article.authorCredentials || 'BASLP, RCI Registered Audiologist & Speech-Language Pathologist',
        authorAvatar: article.authorAvatar || '/practitioner-headshot.png',
        heroImage: article.heroImage || '/patient-pexels.jpg',
        secondaryImage: article.secondaryImage || '',
        secondaryCaption: article.secondaryCaption || '',
        youtubeVideoId: article.youtubeVideoId || '',
        videoTitle: article.videoTitle || '',
        tags: Array.isArray(article.tags) ? article.tags : [],
        keyTakeaways: Array.isArray(article.keyTakeaways) ? article.keyTakeaways : [],
        contentBlocks: Array.isArray(article.contentBlocks) && article.contentBlocks.length > 0
          ? article.contentBlocks
          : [{ heading: '', text: '', milestones: [] }],
        importantLinks: Array.isArray(article.importantLinks) ? article.importantLinks : [],
        isFeatured: Boolean(article.isFeatured),
        status: article.status || 'PUBLISHED',
      });
    } else {
      // Default new article state
      setFormData({
        title: '',
        slug: '',
        subtitle: '',
        excerpt: '',
        category: 'Pediatric Speech',
        readTime: '5 min read',
        publishDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        authorName: 'ASLP Palak Paresh Gandhi',
        authorCredentials: 'BASLP, RCI Registered Audiologist & Speech-Language Pathologist',
        authorAvatar: '/practitioner-headshot.png',
        heroImage: '/patient-pexels.jpg',
        secondaryImage: '',
        secondaryCaption: '',
        youtubeVideoId: '',
        videoTitle: '',
        tags: ['Speech Therapy', 'Satara'],
        keyTakeaways: [
          'Early diagnostic screening identifies speech and hearing delays before age 2.',
          'Standardized RCI testing provides an objective developmental milestone roadmap.',
        ],
        contentBlocks: [
          {
            heading: 'Clinical Overview & Diagnostic Rationale',
            text: 'Enter the evidence-based medical guide and therapeutic guidance here for parents and patients.',
            milestones: [
              {
                age: '12 Months',
                normal: 'Babbling, responding to name, pointing at objects.',
                warning: 'Does not turn to sounds, lacks eye contact or vocalization.',
              },
            ],
          },
        ],
        importantLinks: [
          {
            label: 'Schedule a Consultation at VAANI Satara',
            url: '/#booking-section',
            isExternal: false,
          },
        ],
        isFeatured: false,
        status: 'PUBLISHED',
      });
    }
    setActiveTab('essentials');
    setErrorMsg('');
  }, [article, isOpen]);

  if (!isOpen) return null;

  // Auto-generate slug from title if slug not manually customized
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

  // Tag management
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

  // Takeaway management
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

  // Content Blocks management
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

  // Milestone Row management within a content block
  const handleAddMilestone = (blockIdx) => {
    setFormData((prev) => {
      const updated = [...prev.contentBlocks];
      const milestones = updated[blockIdx].milestones || [];
      updated[blockIdx] = {
        ...updated[blockIdx],
        milestones: [
          ...milestones,
          { age: '18 Months', normal: 'Expected development', warning: 'Clinical red flag' },
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

  // Important links management
  const handleAddLink = () => {
    setFormData((prev) => ({
      ...prev,
      importantLinks: [
        ...prev.importantLinks,
        { label: 'External Resource', url: 'https://', isExternal: true },
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
      return;
    }
    if (!formData.excerpt.trim()) {
      setErrorMsg('Article excerpt summary is required.');
      setActiveTab('essentials');
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

      if (onSaveSuccess) onSaveSuccess(json.data);
      onClose();
    } catch (err) {
      console.error('Error saving blog article:', err);
      setErrorMsg(err.message || 'Failed to save article.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs font-sans overflow-hidden">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-purple-200">
        
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-[#301444] text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-purple-200 border border-white/15">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white leading-tight">
                {isEditing ? 'Edit Clinical Article' : 'Author New Clinical Article'}
              </h2>
              <p className="text-[11px] text-purple-200">
                VAANI Speech &amp; Hearing Clinical Knowledge CMS
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                formData.status === 'PUBLISHED'
                  ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40'
                  : 'bg-amber-500/20 text-amber-200 border-amber-400/40'
              }`}
            >
              {formData.status}
            </span>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-purple-200 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 bg-purple-50/60 border-b border-purple-100 flex items-center gap-1 overflow-x-auto no-scrollbar flex-shrink-0">
          {[
            { id: 'essentials', label: '1. Essentials & SEO', icon: FileText },
            { id: 'media', label: '2. Media & Video', icon: Image },
            { id: 'takeaways', label: '3. Key Takeaways', icon: List },
            { id: 'content', label: '4. Content & Milestones', icon: Sparkles },
            { id: 'links', label: '5. Citations & Publishing', icon: LinkIcon },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2.5 px-3 text-xs font-bold flex items-center gap-1.5 border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'border-[#301444] text-[#301444] bg-white/80 rounded-t-md shadow-2xs'
                    : 'border-transparent text-slate-600 hover:text-[#301444]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#301444]' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="mx-5 mt-3 px-3.5 py-2 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-800">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Tab Contents Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          
          {/* TAB 1: ESSENTIALS */}
          {activeTab === 'essentials' && (
            <div className="space-y-3.5">
              <div>
                <label className="text-[11px] font-bold text-slate-800 block mb-1">
                  Article Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Recognizing Early Signs of Speech Delay in Toddlers: When to Seek Clinical Help"
                  className="w-full px-3 py-2 text-xs font-semibold text-slate-900 bg-white border border-slate-300 rounded-lg focus:border-purple-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-800 block mb-1">
                    URL Slug <span className="text-slate-400 font-normal">(/blogs/...)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="speech-delay-early-signs"
                    className="w-full px-3 py-1.5 text-xs font-mono text-purple-950 bg-white border border-slate-300 rounded-lg focus:border-purple-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-800 block mb-1">
                    Clinical Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg focus:border-purple-600 focus:outline-none font-medium"
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
                <label className="text-[11px] font-bold text-slate-800 block mb-1">
                  Subtitle / Clinical Context
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="e.g. A clinical guide for parents on milestones between 12 and 36 months in Satara."
                  className="w-full px-3 py-1.5 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg focus:border-purple-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-800 block mb-1">
                  Excerpt Summary (Shows on card listings &amp; Google preview) <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="2-3 sentence overview highlighting the clinical findings and why early detection matters..."
                  className="w-full px-3 py-2 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg focus:border-purple-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-800 block mb-1">
                    Estimated Reading Time
                  </label>
                  <input
                    type="text"
                    value={formData.readTime}
                    onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                    placeholder="6 min read"
                    className="w-full px-3 py-1.5 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg focus:border-purple-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-800 block mb-1">
                    Publish Date
                  </label>
                  <input
                    type="text"
                    value={formData.publishDate}
                    onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                    placeholder="Oct 12, 2026"
                    className="w-full px-3 py-1.5 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg focus:border-purple-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Tags Section */}
              <div>
                <label className="text-[11px] font-bold text-slate-800 block mb-1">
                  Article Search Tags ({formData.tags.length})
                </label>
                <div className="flex items-center gap-2 mb-2">
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
                    placeholder="Type tag & press enter (e.g. Early Intervention)"
                    className="flex-1 px-3 py-1.5 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg focus:border-purple-600 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-[#301444] rounded-lg font-bold text-xs"
                  >
                    Add Tag
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {formData.tags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full border border-slate-200"
                    >
                      <span>#{t}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(t)}
                        className="text-slate-400 hover:text-red-600 ml-0.5"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MEDIA & VIDEO */}
          {activeTab === 'media' && (
            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-800 block mb-1">
                  Hero Image URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.heroImage}
                  onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })}
                  placeholder="/patient-pexels.jpg or https://..."
                  className="w-full px-3 py-1.5 text-xs font-mono text-slate-800 bg-white border border-slate-300 rounded-lg focus:border-purple-600 focus:outline-none mb-2"
                />

                {/* Quick Presets */}
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    Quick Preset In-Clinic Photos:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_HERO_IMAGES.map((preset) => (
                      <button
                        key={preset.url}
                        type="button"
                        onClick={() => setFormData({ ...formData, heroImage: preset.url })}
                        className={`text-[10.5px] px-2 py-1 rounded border font-medium transition-all ${
                          formData.heroImage === preset.url
                            ? 'bg-[#301444] text-white border-[#301444]'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-purple-50'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {formData.heroImage && (
                  <div className="mt-2.5 p-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-3">
                    <img
                      src={formData.heroImage}
                      alt="Hero Preview"
                      className="w-20 h-14 object-cover rounded shadow-xs"
                      onError={(e) => {
                        e.target.src = '/patient-pexels.jpg';
                      }}
                    />
                    <div className="text-[11px] text-slate-600">
                      <span className="font-bold text-slate-800 block">Hero Image Active</span>
                      <span className="text-slate-500">{formData.heroImage}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-100">
                <div>
                  <label className="text-[11px] font-bold text-slate-800 block mb-1">
                    Secondary In-Clinic Photo URL (Optional)
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
                  <label className="text-[11px] font-bold text-slate-800 block mb-1">
                    Secondary Photo Caption
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

              {/* YouTube Clinical Demonstration Embed */}
              <div className="p-3.5 bg-purple-50/50 rounded-xl border border-purple-200/80 space-y-3">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-[#301444]" />
                  <span className="text-xs font-bold text-[#301444] uppercase tracking-wider">
                    Optional YouTube Clinical Video Embed
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Embed demonstration footage or pediatric guide video. If empty, the video player will not appear on the article page.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                      YouTube Video ID (11 characters)
                    </label>
                    <input
                      type="text"
                      value={formData.youtubeVideoId}
                      onChange={(e) => setFormData({ ...formData, youtubeVideoId: e.target.value.trim() })}
                      placeholder="e.g. 3NoESJjxw1k"
                      className="w-full px-3 py-1.5 text-xs font-mono font-bold text-slate-900 bg-white border border-slate-300 rounded-lg focus:border-purple-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                      Video Title / Subtitle
                    </label>
                    <input
                      type="text"
                      value={formData.videoTitle}
                      onChange={(e) => setFormData({ ...formData, videoTitle: e.target.value })}
                      placeholder="e.g. Clinical Guide: Toddler Speech Delays & When to Seek Therapy"
                      className="w-full px-3 py-1.5 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg focus:border-purple-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: KEY TAKEAWAYS */}
          {activeTab === 'takeaways' && (
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-800">
                    Key Clinical Takeaways (Bullet Callout Box)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    These points appear in the high-visibility purple callout box right under the article hero.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-[#301444] bg-purple-100 px-2.5 py-0.5 rounded-full">
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
                  placeholder="Enter key clinical takeaway (e.g. Early intervention before 24 months catches up vocabulary 85% faster)"
                  className="flex-1 px-3 py-2 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg focus:border-purple-600 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddTakeaway}
                  className="px-3.5 py-2 bg-[#301444] hover:bg-[#461963] text-white rounded-lg font-bold text-xs flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Point</span>
                </button>
              </div>

              {/* Takeaways List */}
              <div className="space-y-2 pt-2">
                {formData.keyTakeaways.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-start justify-between gap-3 group"
                  >
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-800 font-medium leading-relaxed">{item}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveTakeaway(idx)}
                      className="text-slate-400 hover:text-red-600 transition-colors p-1"
                      title="Remove Takeaway"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: CONTENT & MILESTONES */}
          {activeTab === 'content' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-800">
                    Modular Content Sections ({formData.contentBlocks.length})
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Each section contains a heading, descriptive text, and optional milestone comparison tables.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddBlock}
                  className="px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-[#301444] rounded-lg font-bold text-xs flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Section</span>
                </button>
              </div>

              {formData.contentBlocks.map((block, bIdx) => (
                <div
                  key={bIdx}
                  className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="font-bold text-xs text-[#301444]">
                      Section #{bIdx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveBlock(bIdx)}
                      className="text-slate-400 hover:text-red-600 p-1"
                      title="Delete Section"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Section Heading
                    </label>
                    <input
                      type="text"
                      value={block.heading}
                      onChange={(e) => handleBlockChange(bIdx, 'heading', e.target.value)}
                      placeholder="e.g. The Window of Neural Plasticity (0 to 3 Years)"
                      className="w-full px-3 py-1.5 text-xs font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-lg focus:border-purple-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Section Content Paragraphs
                    </label>
                    <textarea
                      rows={4}
                      value={block.text}
                      onChange={(e) => handleBlockChange(bIdx, 'text', e.target.value)}
                      placeholder="Write in-depth clinical advice, explanations, and patient guidance..."
                      className="w-full px-3 py-2 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg focus:border-purple-600 focus:outline-none leading-relaxed"
                    />
                  </div>

                  {/* Optional Milestone Comparison Rows */}
                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-purple-900">
                        Developmental Milestones Table ({block.milestones?.length || 0} rows)
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAddMilestone(bIdx)}
                        className="text-[11px] font-bold text-purple-700 hover:text-purple-950 flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Milestone Row</span>
                      </button>
                    </div>

                    {block.milestones && block.milestones.length > 0 && (
                      <div className="space-y-2">
                        {block.milestones.map((m, mIdx) => (
                          <div
                            key={mIdx}
                            className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg grid grid-cols-1 sm:grid-cols-12 gap-2 items-center"
                          >
                            <div className="sm:col-span-3">
                              <label className="text-[10px] font-bold text-slate-600 block mb-0.5">
                                Age / Stage
                              </label>
                              <input
                                type="text"
                                value={m.age}
                                onChange={(e) => handleMilestoneChange(bIdx, mIdx, 'age', e.target.value)}
                                placeholder="12 Months"
                                className="w-full px-2 py-1 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded"
                              />
                            </div>
                            <div className="sm:col-span-4">
                              <label className="text-[10px] font-bold text-emerald-700 block mb-0.5">
                                Expected Normal
                              </label>
                              <input
                                type="text"
                                value={m.normal}
                                onChange={(e) => handleMilestoneChange(bIdx, mIdx, 'normal', e.target.value)}
                                placeholder="Babbling, responds to name..."
                                className="w-full px-2 py-1 text-xs text-slate-800 bg-white border border-slate-300 rounded"
                              />
                            </div>
                            <div className="sm:col-span-4">
                              <label className="text-[10px] font-bold text-amber-700 block mb-0.5">
                                Warning Red Flag
                              </label>
                              <input
                                type="text"
                                value={m.warning}
                                onChange={(e) => handleMilestoneChange(bIdx, mIdx, 'warning', e.target.value)}
                                placeholder="Does not turn to sounds..."
                                className="w-full px-2 py-1 text-xs text-slate-800 bg-white border border-slate-300 rounded"
                              />
                            </div>
                            <div className="sm:col-span-1 flex justify-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveMilestone(bIdx, mIdx)}
                                className="text-slate-400 hover:text-red-600 p-1"
                                title="Delete row"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
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

          {/* TAB 5: CITATIONS & PUBLISHING */}
          {activeTab === 'links' && (
            <div className="space-y-4">
              {/* Publishing Status & Landmark Feature */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-800 block mb-1">
                    Publication Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg focus:border-purple-600 focus:outline-none"
                  >
                    <option value="PUBLISHED">PUBLISHED (Live on Public Website)</option>
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
                  <label htmlFor="isFeatured" className="text-xs font-bold text-slate-800 cursor-pointer">
                    Pin as Featured Landmark Article (Top Banner on /blogs)
                  </label>
                </div>
              </div>

              {/* Author Attribution */}
              <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-[#301444] uppercase tracking-wider block">
                  Author Attribution &amp; RCI Credentials
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Author Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.authorName}
                      onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                      placeholder="ASLP Palak Paresh Gandhi"
                      className="w-full px-3 py-1.5 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Credentials &amp; Degrees
                    </label>
                    <input
                      type="text"
                      value={formData.authorCredentials}
                      onChange={(e) => setFormData({ ...formData, authorCredentials: e.target.value })}
                      placeholder="BASLP, RCI Registered Audiologist & Speech-Language Pathologist"
                      className="w-full px-3 py-1.5 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* External Guidelines & Booking CTAs */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Important Clinical Links &amp; Citations ({formData.importantLinks.length})
                  </span>
                  <button
                    type="button"
                    onClick={handleAddLink}
                    className="px-3 py-1 bg-purple-100 hover:bg-purple-200 text-[#301444] rounded font-bold text-[11px] flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Link</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {formData.importantLinks.map((link, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg grid grid-cols-1 sm:grid-cols-12 gap-2 items-center"
                    >
                      <div className="sm:col-span-5">
                        <input
                          type="text"
                          value={link.label}
                          onChange={(e) => handleLinkChange(idx, 'label', e.target.value)}
                          placeholder="e.g. WHO Childhood Hearing Guidelines"
                          className="w-full px-2 py-1 text-xs text-slate-800 bg-white border border-slate-300 rounded"
                        />
                      </div>
                      <div className="sm:col-span-5">
                        <input
                          type="text"
                          value={link.url}
                          onChange={(e) => handleLinkChange(idx, 'url', e.target.value)}
                          placeholder="https://... or /#booking-section"
                          className="w-full px-2 py-1 text-xs font-mono text-purple-900 bg-white border border-slate-300 rounded"
                        />
                      </div>
                      <div className="sm:col-span-2 flex items-center justify-between">
                        <label className="text-[10px] text-slate-500 font-medium">
                          <input
                            type="checkbox"
                            checked={link.isExternal}
                            onChange={(e) => handleLinkChange(idx, 'isExternal', e.target.checked)}
                            className="mr-1"
                          />
                          External
                        </label>
                        <button
                          type="button"
                          onClick={() => handleRemoveLink(idx)}
                          className="text-slate-400 hover:text-red-600 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between flex-shrink-0">
          <div className="text-[11px] text-slate-500 hidden sm:block">
            {isEditing ? `Editing ID: ${formData.id}` : 'Drafting new clinical article'}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className="px-5 py-2 rounded-lg bg-[#301444] hover:bg-[#461963] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4 text-purple-200" />
              <span>{saving ? 'Saving to Database...' : isEditing ? 'Update Article' : 'Publish Article'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BlogEditorModal;
