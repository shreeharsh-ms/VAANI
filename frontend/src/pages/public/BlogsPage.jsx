import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  ArrowRight,
  Search,
  Sparkles,
  Play,
  CheckCircle2,
  ShieldCheck,
  Award,
  BookOpen,
  Phone,
  ChevronRight,
  Stethoscope,
  Activity,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { ARTICLES } from '../../data/articles';
import { ROUTES } from '../../constants';

const CATEGORIES = [
  'All Topics',
  'Pediatric Speech',
  'Audiology & Hearing',
  'Hearing Technology',
  'Voice & Fluency',
];

export const BlogsPage = () => {
  const [articlesList, setArticlesList] = useState(ARTICLES);
  const [selectedCategory, setSelectedCategory] = useState('All Topics');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('/api/v1/blogs')
      .then((res) => (res.ok ? res.json() : null))
      .then((res) => {
        if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
          setArticlesList(res.data);
        }
      })
      .catch((err) => console.info('Using local clinical articles cache:', err));
  }, []);

  const filteredPosts = articlesList.filter((post) => {
    const matchesCat =
      selectedCategory === 'All Topics' || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.tags && post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCat && matchesSearch;
  });

  const featuredArticle = articlesList.find((a) => a.isFeatured) || articlesList[0];
  const isDefaultView = selectedCategory === 'All Topics' && searchQuery.trim() === '';

  return (
    <div className="w-full min-h-screen bg-[#f7f6f4] text-[#172e24] pt-6 sm:pt-10 lg:pt-12 pb-20 sm:pb-28 lg:pb-32 px-4 sm:px-8 lg:px-10 xl:px-12 select-none">
      <div className="w-full max-w-[1536px] mx-auto space-y-12 sm:space-y-16 lg:space-y-20">

        {/* ══════════════════════════════════════════════════════════════════
            1. EDITORIAL HEADER & CLINICAL TRUST PILLARS (EXPANSIVE FULL WIDTH)
            ══════════════════════════════════════════════════════════════════ */}
        <section className="space-y-6 sm:space-y-8 pb-8 sm:pb-10 border-b border-gray-200/80">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-4xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#301444]/10 text-[#301444] text-xs font-bold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5 text-[#301444]" />
                <span>VAANI Clinical Knowledge Hub • Satara, Maharashtra</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-[46px] lg:text-[54px] font-normal leading-[1.1] text-[#16382b] tracking-[-0.03em]">
                Clinical Insights, Hearing Sciences &amp;<br />
                Speech-Language Therapy
              </h1>

              <p className="text-sm sm:text-[15.5px] leading-relaxed text-[#4a5550] max-w-3xl">
                Evidence-based developmental milestones, diagnostic audiology guides, and patient rehabilitation pathways authored by RCI-registered practitioners at our Sadashiv Peth clinic.
              </p>
            </div>

            {/* Quick Search & Filter Count Widget */}
            <div className="w-full lg:w-96 flex flex-col gap-2.5 flex-shrink-0">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search articles, milestones, treatments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-full bg-white border border-gray-200/90 text-xs sm:text-sm text-gray-800 placeholder-gray-400 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#301444]/40 focus:border-transparent transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-gray-700 p-1"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="flex items-center justify-between px-2 text-[11.5px] text-[#55615d]">
                <span className="font-medium">
                  Showing {filteredPosts.length} clinical {filteredPosts.length === 1 ? 'article' : 'articles'}
                </span>
                <span className="text-purple-900 font-semibold">100% RCI Aligned</span>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            2. TOPIC FILTER BAR
            ══════════════════════════════════════════════════════════════════ */}
        <section className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            {CATEGORIES.map((cat) => {
              const count =
                cat === 'All Topics'
                  ? ARTICLES.length
                  : ARTICLES.filter((a) => a.category === cat).length;
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-[13px] font-bold transition-all duration-150 ${
                    isSelected
                      ? 'bg-[#301444] text-white shadow-md scale-[1.02]'
                      : 'bg-white hover:bg-purple-50 text-[#301444] border border-gray-200/90 shadow-xs hover:border-purple-200'
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`text-[10.5px] px-1.5 py-0.5 rounded-full font-bold ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="text-xs text-[#55615d] hidden sm:block">
            <span>Filter by clinical specialty</span>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            3. FEATURED LANDMARK EDITORIAL (MAGAZINE STYLE 2-COL BANNER)
            ══════════════════════════════════════════════════════════════════ */}
        {isDefaultView && featuredArticle && (
          <section className="bg-white rounded-[32px] sm:rounded-[36px] border border-gray-200/90 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              {/* Left Column: Rich Photo with Badges (7 cols) */}
              <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-[460px] xl:h-[480px] overflow-hidden bg-gray-100 group">
                <Link to={`/blogs/${featuredArticle.slug}`} className="block w-full h-full">
                  <img
                    src={featuredArticle.heroImage}
                    alt={featuredArticle.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />
                </Link>

                {/* Floating Badges */}
                <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex flex-wrap items-center gap-2 z-10 pointer-events-none">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-700 text-white text-[11px] font-bold tracking-wider uppercase shadow-md">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
                    <span>Featured Clinical Guide</span>
                  </span>
                  {featuredArticle.youtubeVideoId && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#301444]/90 backdrop-blur-md text-white text-[11px] font-bold shadow-md">
                      <Play className="w-3 h-3 text-red-400 fill-red-400" />
                      <span>Video Walkthrough</span>
                    </span>
                  )}
                </div>

                {/* Image Bottom Strip Info */}
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 text-white text-xs sm:text-sm font-medium flex items-center justify-between z-10 pointer-events-none">
                  <span className="bg-black/50 backdrop-blur-md px-3 py-1 rounded-full">
                    Satara Clinical Practice
                  </span>
                  <span className="bg-black/50 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {featuredArticle.readTime}
                  </span>
                </div>
              </div>

              {/* Right Column: Editorial Text & Action (5 cols) */}
              <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 xl:p-12 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                    <span className="px-2.5 py-1 rounded-full bg-purple-100 text-[#301444] font-bold text-[11px]">
                      {featuredArticle.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      {featuredArticle.date}
                    </span>
                  </div>

                  <Link to={`/blogs/${featuredArticle.slug}`} className="block group">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#16382b] group-hover:text-[#301444] transition-colors leading-[1.25]">
                      {featuredArticle.title}
                    </h2>
                  </Link>

                  <p className="text-xs sm:text-sm leading-relaxed text-[#4a5550]">
                    {featuredArticle.excerpt}
                  </p>

                  {/* 3 Quick Takeaways */}
                  <div className="space-y-2 pt-2 border-t border-gray-100">
                    <p className="text-xs font-bold text-[#16382b] uppercase tracking-wider">
                      Key Clinical Takeaways:
                    </p>
                    {featuredArticle.keyTakeaways?.slice(0, 3).map((point, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-[#3a4440] leading-snug">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Author & CTA Button */}
                <div className="pt-6 border-t border-gray-100 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={featuredArticle.authorAvatar || '/practitioner-palak-real.png'}
                      alt={featuredArticle.author}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-[#301444]/20"
                    />
                    <div>
                      <p className="text-xs font-bold text-[#16382b] leading-tight">
                        {featuredArticle.author}
                      </p>
                      <p className="text-[10.5px] text-gray-500">
                        MASLP, RCI Registered
                      </p>
                    </div>
                  </div>

                  <Link
                    to={`/blogs/${featuredArticle.slug}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#301444] text-white text-xs sm:text-sm font-bold shadow-md hover:bg-[#200930] hover:scale-105 active:scale-95 transition-all"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            4. ARTICLES GRID (EXPANSIVE 3-COLUMN CARDS)
            ══════════════════════════════════════════════════════════════════ */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-[#16382b] tracking-tight">
              {selectedCategory === 'All Topics' ? 'All Clinical Articles' : `${selectedCategory} Articles`}
            </h2>
            <span className="text-xs text-gray-500">
              {filteredPosts.length} {filteredPosts.length === 1 ? 'publication' : 'publications'}
            </span>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="w-full py-16 px-6 bg-white rounded-3xl border border-gray-200 text-center space-y-4">
              <HelpCircle className="w-12 h-12 text-gray-400 mx-auto" />
              <h3 className="text-lg font-bold text-gray-800">No articles found</h3>
              <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
                No clinical articles matched your query "{searchQuery}". Try searching for terms like "audiometry", "speech", "hearing", or "stuttering".
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All Topics');
                  setSearchQuery('');
                }}
                className="px-5 py-2 rounded-full bg-[#301444] text-white text-xs font-bold"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 sm:gap-8 lg:gap-9">
              {filteredPosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-[28px] border border-gray-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Post Cover Image */}
                    <Link
                      to={`/blogs/${post.slug || post.id}`}
                      className="block relative w-full h-52 sm:h-56 lg:h-60 overflow-hidden bg-gray-100"
                    >
                      <img
                        src={post.heroImage || post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                      {/* Top Badges */}
                      <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                        <span className="bg-[#301444]/90 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-xs">
                          {post.category}
                        </span>
                      </div>

                      {post.youtubeVideoId && (
                        <div className="absolute bottom-3.5 left-3.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10.5px] font-semibold">
                          <Play className="w-3 h-3 text-red-400 fill-red-400" />
                          <span>Video Available</span>
                        </div>
                      )}
                    </Link>

                    {/* Content Section */}
                    <div className="p-6 sm:p-7 space-y-3.5">
                      {/* Metadata Row */}
                      <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          {post.date}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          {post.readTime}
                        </span>
                      </div>

                      {/* Title */}
                      <Link to={`/blogs/${post.slug || post.id}`} className="block">
                        <h3 className="text-base sm:text-lg font-bold text-[#16382b] group-hover:text-[#301444] transition-colors leading-snug line-clamp-2">
                          {post.title}
                        </h3>
                      </Link>

                      {/* Excerpt */}
                      <p className="text-xs sm:text-[13.5px] leading-relaxed text-[#4a5550] line-clamp-3">
                        {post.excerpt}
                      </p>

                      {/* Tags */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          {post.tags.slice(0, 3).map((tag, idx) => (
                            <span
                              key={idx}
                              className="text-[11px] px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="p-6 sm:p-7 pt-0 border-t border-gray-100 mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={post.authorAvatar || '/practitioner-palak-real.png'}
                        alt={post.author}
                        className="w-7 h-7 rounded-full object-cover ring-1 ring-gray-200"
                      />
                      <span className="text-xs font-semibold text-gray-700 truncate max-w-[150px]">
                        {post.author}
                      </span>
                    </div>

                    <Link
                      to={`/blogs/${post.slug || post.id}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#301444] group-hover:text-[#16382b] transition-colors"
                    >
                      <span>Read</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            5. VAANI CLINICAL STANDARDS & SCIENTIFIC METHODOLOGY (PROFESSIONAL MEDICAL GRADE)
            ══════════════════════════════════════════════════════════════════ */}
        <section className="bg-white rounded-[32px] sm:rounded-[36px] border border-gray-200/90 p-8 sm:p-12 lg:p-14 space-y-10 sm:space-y-12 shadow-sm">
          {/* Header & Lead Practitioner Review Badge */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 border-b border-gray-100">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold tracking-wide uppercase">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>VAANI Clinical Standards • Evidence &amp; Medical Governance</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-[38px] font-normal leading-[1.15] text-[#16382b] tracking-[-0.025em]">
                Why Our Clinical Guides Are Trusted by Families in Satara
              </h2>
              <p className="text-xs sm:text-[15px] leading-relaxed text-[#4a5550]">
                Every publication is drafted and verified by registered audiologists and speech-language pathologists adhering to standardized scientific diagnostics.
              </p>
            </div>

            {/* Practitioner Reviewer Card */}
            <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#faf9f8] border border-purple-100 shadow-xs flex-shrink-0 self-start lg:self-auto">
              <div className="relative">
                <img
                  src="/practitioner-palak-real.png"
                  alt="Ms. Palak Gandhi"
                  className="w-13 h-13 rounded-full object-cover ring-2 ring-[#301444]/20 shadow-xs"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center text-[9px] text-white font-bold">
                  ✓
                </span>
              </div>
              <div className="leading-tight">
                <p className="text-xs font-bold text-[#16382b]">
                  Ms. Palak Gandhi, MASLP
                </p>
                <p className="text-[11px] text-purple-900 font-semibold mt-0.5">
                  RCI Registered Audiologist &amp; SLP
                </p>
                <span className="inline-block mt-1 text-[10px] font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                  CRR No. A93452 • Satara Clinic
                </span>
              </div>
            </div>
          </div>

          {/* 4 Professional Clinical Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
            {/* Pillar 01 */}
            <div className="bg-gradient-to-b from-[#fbfaf8] to-white rounded-[26px] p-6 sm:p-7 border border-gray-200/90 hover:border-[#301444]/40 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group space-y-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-2xl bg-purple-100/80 border border-purple-200/60 flex items-center justify-center text-[#301444] shadow-xs group-hover:scale-105 transition-transform">
                    <ShieldCheck className="w-5 h-5 text-[#301444]" />
                  </div>
                  <span className="text-xs font-mono font-bold text-gray-400 group-hover:text-[#301444] transition-colors">
                    01
                  </span>
                </div>
                <h4 className="text-base font-bold text-[#16382b] group-hover:text-[#301444] transition-colors tracking-tight">
                  RCI Standards Aligned
                </h4>
                <p className="text-xs sm:text-[13px] leading-relaxed text-[#4a5550]">
                  All therapy and assessment recommendations adhere to Rehabilitation Council of India statutory codes.
                </p>
              </div>
              <div className="pt-3 border-t border-gray-100">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-purple-950 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-100">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-700" />
                  <span>Statutory Code Compliant</span>
                </span>
              </div>
            </div>

            {/* Pillar 02 */}
            <div className="bg-gradient-to-b from-[#fbfaf8] to-white rounded-[26px] p-6 sm:p-7 border border-gray-200/90 hover:border-emerald-300 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group space-y-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-100/80 border border-emerald-200/60 flex items-center justify-center text-emerald-800 shadow-xs group-hover:scale-105 transition-transform">
                    <Activity className="w-5 h-5 text-emerald-700" />
                  </div>
                  <span className="text-xs font-mono font-bold text-gray-400 group-hover:text-emerald-700 transition-colors">
                    02
                  </span>
                </div>
                <h4 className="text-base font-bold text-[#16382b] group-hover:text-emerald-800 transition-colors tracking-tight">
                  Objective Diagnostics
                </h4>
                <p className="text-xs sm:text-[13px] leading-relaxed text-[#4a5550]">
                  We rely on calibrated Pure Tone Audiometry, Tympanometry, and validated scales like REELS and 3-DLAT.
                </p>
              </div>
              <div className="pt-3 border-t border-gray-100">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-950 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>ANSI/ISO Calibrated Testing</span>
                </span>
              </div>
            </div>

            {/* Pillar 03 */}
            <div className="bg-gradient-to-b from-[#fbfaf8] to-white rounded-[26px] p-6 sm:p-7 border border-gray-200/90 hover:border-amber-300 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group space-y-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-2xl bg-amber-100/80 border border-amber-200/60 flex items-center justify-center text-amber-800 shadow-xs group-hover:scale-105 transition-transform">
                    <BookOpen className="w-5 h-5 text-amber-700" />
                  </div>
                  <span className="text-xs font-mono font-bold text-gray-400 group-hover:text-amber-700 transition-colors">
                    03
                  </span>
                </div>
                <h4 className="text-base font-bold text-[#16382b] group-hover:text-amber-800 transition-colors tracking-tight">
                  Multilingual Guidance
                </h4>
                <p className="text-xs sm:text-[13px] leading-relaxed text-[#4a5550]">
                  Evidence-based developmental advice specifically tailored for Marathi, Hindi, and English multilingual homes.
                </p>
              </div>
              <div className="pt-3 border-t border-gray-100">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-950 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />
                  <span>Marathi • Hindi • English</span>
                </span>
              </div>
            </div>

            {/* Pillar 04 */}
            <div className="bg-gradient-to-b from-[#fbfaf8] to-white rounded-[26px] p-6 sm:p-7 border border-gray-200/90 hover:border-blue-300 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group space-y-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-2xl bg-blue-100/80 border border-blue-200/60 flex items-center justify-center text-blue-800 shadow-xs group-hover:scale-105 transition-transform">
                    <Stethoscope className="w-5 h-5 text-blue-700" />
                  </div>
                  <span className="text-xs font-mono font-bold text-gray-400 group-hover:text-blue-700 transition-colors">
                    04
                  </span>
                </div>
                <h4 className="text-base font-bold text-[#16382b] group-hover:text-blue-800 transition-colors tracking-tight">
                  Direct Clinic Pathway
                </h4>
                <p className="text-xs sm:text-[13px] leading-relaxed text-[#4a5550]">
                  Articles connect directly to in-person diagnostic sessions with Ms. Palak Gandhi at Sadashiv Peth, Satara.
                </p>
              </div>
              <div className="pt-3 border-t border-gray-100">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-950 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-700" />
                  <span>Sadashiv Peth, Satara</span>
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Clinical Referral Strip */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#faf9f8] border border-gray-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs text-[#3a4440] text-center sm:text-left">
              <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0" />
              <span>
                Need immediate assessment for toddler speech delays, audiometry reports, or hearing aid trials in Satara?
              </span>
            </div>
            <Link
              to="/#booking-section"
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#301444] text-white text-xs font-bold shadow-sm hover:bg-[#200930] hover:scale-105 transition-all flex-shrink-0"
            >
              <span>Book In-Clinic Evaluation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            6. BOTTOM CLINICAL APPOINTMENT BANNER (FULL WIDTH)
            ══════════════════════════════════════════════════════════════════ */}
        <section className="bg-[#301444] text-white rounded-[32px] sm:rounded-[36px] p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-3 text-center lg:text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-purple-200">
              <Sparkles className="w-3.5 h-3.5" />
              <span>In-Clinic Evaluations in Satara</span>
            </div>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
              Have Specific Speech or Hearing Questions?
            </h3>
            <p className="text-xs sm:text-sm text-purple-200/90 leading-relaxed">
              Schedule a personalized 1-on-1 diagnostic consultation or PTA hearing assessment with Ms. Palak Gandhi (MASLP, RCI Registered) at our Sadashiv Peth clinic.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 flex-shrink-0">
            <Link
              to="/#booking-section"
              className="px-7 sm:px-9 py-3.5 rounded-full bg-white text-[#301444] font-bold text-xs sm:text-sm hover:bg-purple-50 transition-all shadow-lg hover:scale-105 active:scale-95"
            >
              Book In-Clinic Evaluation
            </Link>
            <Link
              to={ROUTES.CONTACT}
              className="px-7 sm:px-9 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm transition-all border border-white/25"
            >
              Contact Clinic
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
};

export default BlogsPage;
