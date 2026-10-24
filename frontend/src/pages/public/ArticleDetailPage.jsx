import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  User,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Share2,
  CheckCircle2,
  Play,
  Bookmark,
  Sparkles,
  ShieldCheck,
  FileText,
  MapPin,
  ChevronRight,
  Phone,
  Stethoscope,
  Award,
  HelpCircle,
} from 'lucide-react';
import { ARTICLES, getArticleBySlug } from '../../data/articles';
import { ROUTES, APP_CONFIG } from '../../constants';
import { useClinicSettings, formatClinicAddress } from '../../context/ClinicSettingsContext';

export const ArticleDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const fallbackArticle = React.useMemo(() => getArticleBySlug(slug), [slug]);
  const [article, setArticle] = useState(fallbackArticle);
  const [allArticles, setAllArticles] = useState(ARTICLES);
  const { rciNumber, leadPractitioner, leadDegree, workingHours, settings } = useClinicSettings();
  const clinicPhone = settings?.contact?.primaryPhone || '+91 98220 12349';
  const clinicAddress = formatClinicAddress(settings) || 'Sadashiv Peth, Satara, Maharashtra 415002';

  // Fetch article from database API
  useEffect(() => {
    fetch(`/api/v1/blogs/${encodeURIComponent(slug)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((res) => {
        if (res?.data) {
          setArticle(res.data);
        }
      })
      .catch((err) => console.info('Using local article cache:', err));

    fetch('/api/v1/blogs')
      .then((res) => (res.ok ? res.json() : null))
      .then((res) => {
        if (res?.data && Array.isArray(res.data)) {
          setAllArticles(res.data);
        }
      })
      .catch(() => {});
  }, [slug]);

  // Scroll to top when article loads
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (!article) {
    return (
      <div className="w-full min-h-[70vh] bg-[#f7f6f4] flex flex-col items-center justify-center p-6 text-center select-none">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#16382b] mb-3">
          Article Not Found
        </h2>
        <p className="text-sm text-[#4a5550] mb-6 max-w-md">
          The clinical article you are searching for might have been moved or updated.
        </p>
        <Link
          to={ROUTES.BLOGS}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#301444] text-white text-xs sm:text-sm font-bold shadow-md hover:bg-[#200930] transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Articles</span>
        </Link>
      </div>
    );
  }

  // Related articles (excluding current)
  const relatedArticles = allArticles.filter((a) => a.id !== article.id && a.slug !== article.slug).slice(0, 3);

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Article link copied to clipboard!');
    }
  };

  return (
    <article className="w-full min-h-screen bg-[#f7f6f4] text-[#172e24] pt-4 sm:pt-8 pb-20 sm:pb-28 lg:pb-32 px-4 sm:px-8 lg:px-10 xl:px-12 select-none">
      <div className="w-full max-w-[1440px] mx-auto space-y-8 sm:space-y-12">
        
        {/* ── 1. BREADCRUMBS & TOP BAR ── */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 pb-3 border-b border-gray-200/80">
          <nav className="flex items-center gap-1.5 text-xs text-[#55615d]">
            <Link to={ROUTES.HOME} className="hover:text-[#301444] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <Link to={ROUTES.BLOGS} className="hover:text-[#301444] transition-colors">
              Blogs &amp; Clinical Journal
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-[#16382b] font-medium truncate max-w-[220px] sm:max-w-xs">
              {article.category}
            </span>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-gray-200 text-xs font-semibold text-gray-700 hover:text-[#301444] hover:bg-purple-50 transition-all shadow-xs"
              title="Share article"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
            <Link
              to={ROUTES.BLOGS}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-gray-200 text-xs font-semibold text-[#301444] hover:bg-purple-50 transition-all shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Articles</span>
            </Link>
          </div>
        </div>

        {/* ── 2. ARTICLE HEADER (EXPANSIVE) ── */}
        <header className="space-y-5 sm:space-y-6 max-w-5xl">
          {/* Category & Evidence Badge */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#301444] text-white text-xs font-bold tracking-wide shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-purple-200" />
              <span>{article.category}</span>
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Evidence-Based Clinical Guide</span>
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[46px] font-normal leading-[1.16] text-[#16382b] tracking-[-0.03em]">
            {article.title}
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base md:text-lg text-[#4a5550] leading-relaxed max-w-4xl font-normal">
            {article.subtitle}
          </p>

          {/* Author & Meta Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-200/80">
            <div className="flex items-center gap-3">
              <img
                src={article.authorAvatar || '/practitioner-headshot.png'}
                alt={article.author}
                className="w-12 h-12 rounded-full object-cover object-top ring-2 ring-[#301444]/20 shadow-sm"
              />
              <div>
                <strong className="block text-xs sm:text-sm font-bold text-gray-900">
                  {article.author}
                </strong>
                <span className="text-[11px] sm:text-xs text-purple-900 font-medium">
                  {article.authorCredentials}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-500 font-medium">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <span>{article.date}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                <span>{article.readTime}</span>
              </span>
            </div>
          </div>
        </header>

        {/* ── 3. HERO IMAGE WITH ARCHITECTURAL NOTCH (WIDE) ── */}
        <div
          className="relative w-full h-[300px] sm:h-[420px] md:h-[520px] lg:h-[580px] overflow-hidden rounded-[28px] shadow-md bg-gray-100"
        >
          <img
            src={article.heroImage}
            alt={article.title}
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* ── 4. TWO-COLUMN MEDICAL JOURNAL LAYOUT ON LARGE SCREENS ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* ══════════════════════════════════════════════════════════════════
              LEFT: MAIN READING COLUMN (8 COLS)
              ══════════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-8 space-y-8 sm:space-y-10">
            
            {/* Key Clinical Points Box */}
            <div className="bg-white rounded-[28px] p-6 sm:p-8 lg:p-10 border border-purple-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 text-xs font-bold text-[#301444] uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Key Clinical Points &amp; Takeaways</span>
              </div>

              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
                {article.keyTakeaways.map((point, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 p-4 rounded-2xl bg-[#fbf9fe] border border-purple-100/70 text-xs sm:text-[13px] text-[#2e0c46] leading-relaxed"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Embedded YouTube Video Section */}
            {article.youtubeVideoId && (
              <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-gray-200/90 shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-[#16382b] uppercase tracking-wider">
                  <Play className="w-4 h-4 text-rose-600 fill-rose-600" />
                  <span>Watch Clinical Video Explanation</span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-[#16382b]">
                  {article.videoTitle}
                </h3>

                {/* 16:9 Responsive Video Player */}
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-md bg-black">
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${article.youtubeVideoId}?rel=0`}
                    title={article.videoTitle}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <p className="text-xs text-gray-500 italic">
                  Video demonstration illustrating clinical methodology and diagnostic principles.
                </p>
              </div>
            )}

            {/* Main Clinical Content Blocks */}
            <div className="space-y-8 sm:space-y-10">
              {article.contentBlocks.map((block, idx) => (
                <section
                  key={idx}
                  className="bg-white rounded-[28px] p-6 sm:p-8 lg:p-10 border border-gray-200/80 shadow-xs space-y-4"
                >
                  <h2 className="text-xl sm:text-2xl font-bold text-[#16382b] tracking-tight">
                    {block.heading}
                  </h2>

                  <p className="text-xs sm:text-[15px] leading-relaxed text-[#3a4440] font-normal whitespace-pre-line">
                    {block.text}
                  </p>

                  {/* Milestones comparison table/cards if present */}
                  {block.milestones && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
                      {block.milestones.map((m, mIdx) => (
                        <div
                          key={mIdx}
                          className="p-4 sm:p-5 rounded-2xl bg-[#f7f6f4] border border-gray-200/70 space-y-2"
                        >
                          <strong className="block text-xs sm:text-sm font-bold text-[#301444]">
                            {m.age}
                          </strong>
                          <div className="text-xs text-[#2a3832] leading-relaxed">
                            <span className="font-semibold text-emerald-800 block mb-0.5">
                              Expected:
                            </span>
                            {m.normal}
                          </div>
                          <div className="text-xs text-[#5a2030] leading-relaxed pt-1 border-t border-gray-200">
                            <span className="font-semibold text-rose-700 block mb-0.5">
                              Warning Sign:
                            </span>
                            {m.warning}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              ))}
            </div>

            {/* Secondary Clinical Photo with Caption */}
            {article.secondaryImage && (
              <div className="bg-white rounded-[28px] p-5 sm:p-7 border border-gray-200/80 shadow-xs space-y-3">
                <div className="relative w-full h-[260px] sm:h-[360px] overflow-hidden rounded-2xl bg-gray-100">
                  <img
                    src={article.secondaryImage}
                    alt={article.title}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                {article.secondaryCaption && (
                  <p className="text-xs text-center text-[#55615d] italic">
                    {article.secondaryCaption}
                  </p>
                )}
              </div>
            )}

            {/* Important Clinical Links & Citations */}
            {article.importantLinks && article.importantLinks.length > 0 && (
              <div className="bg-white rounded-[28px] p-6 sm:p-8 lg:p-10 border border-gray-200/80 shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-[#16382b] uppercase tracking-wider">
                  <FileText className="w-4 h-4 text-[#301444]" />
                  <span>Important Clinical Guidelines &amp; Links</span>
                </div>

                <div className="space-y-3">
                  {article.importantLinks.map((link, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 rounded-2xl bg-[#f7f6f4] hover:bg-purple-50/70 border border-gray-200/70 transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-full bg-[#301444] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {idx + 1}
                        </span>
                        <span className="text-xs sm:text-sm font-semibold text-[#16382b] group-hover:text-[#301444]">
                          {link.label}
                        </span>
                      </div>

                      {link.isExternal ? (
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#301444] bg-white border border-purple-200 hover:bg-[#301444] hover:text-white transition-all flex-shrink-0"
                        >
                          <span>Visit</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      ) : (
                        <Link
                          to={link.url}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#301444] bg-white border border-purple-200 hover:bg-[#301444] hover:text-white transition-all flex-shrink-0"
                        >
                          <span>Open Link</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags Row */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs font-bold text-gray-500 mr-2">Tags:</span>
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3.5 py-1 rounded-full bg-white border border-gray-200 text-xs font-medium text-gray-700 shadow-xs"
                >
                  #{tag}
                </span>
              ))}
            </div>

          </div>

          {/* ══════════════════════════════════════════════════════════════════
              RIGHT: STICKY CLINICAL SPECIALIST & BOOKING SIDEBAR (4 COLS)
              ══════════════════════════════════════════════════════════════════ */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24 self-start">
            
            {/* Specialist Profile Card */}
            <div className="bg-white rounded-[28px] p-6 sm:p-7 border border-gray-200/90 shadow-xs space-y-4">
              <div className="flex items-center gap-3.5">
                <img
                  src={article.authorAvatar || '/practitioner-headshot.png'}
                  alt={article.author}
                  className="w-16 h-16 rounded-full object-cover object-top ring-3 ring-purple-100 shadow-sm flex-shrink-0"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-[#16382b]">
                      {leadPractitioner || article.author}
                    </h3>
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-[11px] font-semibold text-purple-900 leading-tight">
                    {leadDegree ? `${leadDegree}, RCI Registered Audiologist & Speech-Language Pathologist` : article.authorCredentials}
                  </p>
                  <span className="inline-block mt-1 text-[10px] uppercase tracking-wider font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    RCI CRR No. {rciNumber || 'A79214'}
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#4a5550] leading-relaxed pt-2 border-t border-gray-100">
                Lead Audiologist &amp; Speech-Language Pathologist at VAANI Speech and Hearing Clinic. Specialized in pediatric language delays, diagnostic audiometry, digital hearing aid fitting, and cognitive speech therapy in Satara.
              </p>

              <div className="pt-2 border-t border-gray-100 space-y-2 text-xs text-[#55615d]">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-purple-900 flex-shrink-0" />
                  <span>{clinicAddress}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-purple-900 flex-shrink-0" />
                  <span>{workingHours || 'Mon – Sat: 09:30 AM – 07:30 PM'}</span>
                </div>
              </div>

              <Link
                to="/#booking-section"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#301444] text-white text-xs font-bold shadow-md hover:bg-[#200930] hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Calendar className="w-4 h-4 text-purple-200" />
                <span>Book In-Clinic Evaluation</span>
              </Link>
            </div>

            {/* Quick Consultation Callout Card */}
            <div className="bg-gradient-to-br from-[#301444] to-[#1c0828] text-white rounded-[28px] p-6 shadow-md space-y-3.5">
              <span className="text-[10.5px] uppercase tracking-wider font-bold text-purple-300">
                Direct Clinic Assistance
              </span>
              <h4 className="text-base font-bold">
                Have questions regarding assessment fees or schedules?
              </h4>
              <p className="text-xs text-purple-200/90 leading-relaxed">
                Connect with our front desk staff directly for immediate assistance in Satara.
              </p>
              <div className="pt-1 flex flex-col gap-2">
                <a
                  href={`tel:${clinicPhone.replace(/\s+/g, '')}`}
                  className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-full bg-white text-[#301444] text-xs font-bold hover:bg-purple-50 transition-all shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{clinicPhone}</span>
                </a>
                <Link
                  to={ROUTES.CONTACT}
                  className="text-center text-xs text-purple-300 hover:text-white underline pt-1 font-medium"
                >
                  View clinic address &amp; directions
                </Link>
              </div>
            </div>

            {/* Related Articles in Sidebar */}
            <div className="bg-white rounded-[28px] p-6 border border-gray-200/90 shadow-xs space-y-4">
              <h4 className="text-xs font-bold text-[#16382b] uppercase tracking-wider">
                Related Clinical Articles
              </h4>
              <div className="space-y-3">
                {relatedArticles.map((rel) => (
                  <Link
                    key={rel.id}
                    to={`/blogs/${rel.slug}`}
                    className="flex items-center gap-3 p-2 rounded-2xl hover:bg-purple-50/60 transition-all group"
                  >
                    <img
                      src={rel.heroImage}
                      alt={rel.title}
                      className="w-14 h-14 rounded-xl object-cover flex-shrink-0 group-hover:scale-105 transition-transform"
                    />
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-purple-700">
                        {rel.category}
                      </span>
                      <h5 className="text-xs font-bold text-gray-900 group-hover:text-[#301444] line-clamp-2 leading-snug">
                        {rel.title}
                      </h5>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

          </aside>

        </div>

        {/* ── 5. BOTTOM APPOINTMENT BANNER (FULL WIDTH) ── */}
        <div className="bg-[#301444] text-white rounded-[32px] sm:rounded-[36px] p-8 sm:p-12 lg:p-14 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">
              Schedule an Evaluation at VAANI Satara
            </h3>
            <p className="text-xs sm:text-sm text-purple-200 max-w-xl">
              Get in-depth Pure Tone Audiometry reports or 1-on-1 speech therapy evaluations with ASLP Palak Gandhi at Sadashiv Peth.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <Link
              to="/#booking-section"
              className="px-7 sm:px-9 py-3.5 rounded-full bg-white text-[#301444] font-bold text-xs sm:text-sm hover:bg-purple-50 transition-all shadow-md hover:scale-105 active:scale-95"
            >
              Book In-Clinic Session
            </Link>
            <Link
              to={ROUTES.CONTACT}
              className="px-7 sm:px-9 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm transition-all border border-white/20"
            >
              Contact Clinic
            </Link>
          </div>
        </div>

      </div>
    </article>
  );
};

export default ArticleDetailPage;
