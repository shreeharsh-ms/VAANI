import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Eye,
  Edit3,
  Trash2,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Clock,
  Calendar,
  AlertCircle,
  FileText,
  Tag,
  RefreshCw,
  Layers,
  Award,
} from 'lucide-react';
import BlogEditorModal from '../../components/dashboard/BlogEditorModal';
import { useNotifications } from '../../context/NotificationContext';

export const BlogsManagementPage = () => {
  const { notify } = useNotifications();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [editingArticle, setEditingArticle] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Fetch all articles from Admin endpoint
  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/blogs/admin/all');
      if (res.ok) {
        const json = await res.json();
        setArticles(json.data || []);
      } else {
        notify.error('Failed to load articles from database.');
      }
    } catch (err) {
      console.warn('Error fetching blogs:', err);
      notify.error('Backend connection error while fetching articles.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // Filtered articles list
  const filteredArticles = useMemo(() => {
    return articles.filter((a) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        a.title.toLowerCase().includes(q) ||
        (a.subtitle && a.subtitle.toLowerCase().includes(q)) ||
        a.category.toLowerCase().includes(q) ||
        (a.tags && a.tags.some((t) => t.toLowerCase().includes(q)));

      const matchesCategory = categoryFilter === 'ALL' || a.category === categoryFilter;
      const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [articles, searchQuery, categoryFilter, statusFilter]);

  // Aggregate stats
  const stats = useMemo(() => {
    const published = articles.filter((a) => a.status === 'PUBLISHED').length;
    const drafts = articles.filter((a) => a.status === 'DRAFT').length;
    const totalViews = articles.reduce((acc, curr) => acc + (curr.viewsCount || 0), 0);
    const uniqueCategories = new Set(articles.map((a) => a.category)).size;

    return {
      total: articles.length,
      published,
      drafts,
      totalViews,
      categories: uniqueCategories,
    };
  }, [articles]);

  // Handle open editor for new article
  const handleCreateNew = () => {
    setEditingArticle(null);
    setIsEditorOpen(true);
  };

  // Handle open editor for existing article
  const handleEdit = (art) => {
    setEditingArticle(art);
    setIsEditorOpen(true);
  };

  // Handle article deletion
  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete article "${title}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/v1/blogs/${id}`, { method: 'DELETE' });
      if (res.ok) {
        notify.success('Article deleted successfully.');
        setArticles((prev) => prev.filter((a) => a.id !== id));
      } else {
        notify.error('Failed to delete article.');
      }
    } catch (err) {
      console.error('Delete error:', err);
      notify.error('Could not connect to server.');
    }
  };

  // Handle status toggle (PUBLISHED <-> DRAFT)
  const handleToggleStatus = async (art) => {
    const nextStatus = art.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      const res = await fetch(`/api/v1/blogs/${art.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        const json = await res.json();
        notify.success(`Article set to ${nextStatus}.`);
        setArticles((prev) =>
          prev.map((a) => (a.id === art.id ? { ...a, status: nextStatus } : a))
        );
      } else {
        notify.error('Failed to update status.');
      }
    } catch (err) {
      notify.error('Network error updating status.');
    }
  };

  // Callback when article is saved successfully
  const handleSaveSuccess = (savedArticle) => {
    notify.success(`Article "${savedArticle.title}" saved successfully!`);
    fetchArticles();
  };

  return (
    <div className="space-y-4 font-sans text-slate-800">
      
      {/* ── HEADER TOOLBAR ── */}
      <div className="bg-white border border-slate-200 rounded-lg p-3 sm:p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#301444] to-[#451963] text-white flex items-center justify-center shadow-xs">
            <BookOpen className="w-5 h-5 text-purple-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-[#301444] leading-tight">
                Clinical Knowledge Hub &amp; Blog CMS
              </h1>
              <span className="text-[10px] font-bold text-purple-900 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                SQLite Master
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Publish evidence-based patient guides, pediatric milestones, and audiological articles to the public website.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={fetchArticles}
            className="p-2 text-slate-600 hover:text-[#301444] hover:bg-purple-50 border border-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Refresh articles list"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          
          <button
            onClick={handleCreateNew}
            className="px-4 py-2 bg-[#301444] hover:bg-[#461963] text-white rounded-lg text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-purple-200" />
            <span>Write New Article</span>
          </button>
        </div>
      </div>

      {/* ── 4 STAT METRIC CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Total Articles
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-[#301444]">{stats.total}</span>
            <span className="text-[11px] font-medium text-slate-400">All Records</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-2xs">
          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block mb-1">
            Live on Website
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-700">{stats.published}</span>
            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-200">
              Published
            </span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-2xs">
          <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block mb-1">
            Draft Articles
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-amber-700">{stats.drafts}</span>
            <span className="text-[10px] font-bold bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded border border-amber-200">
              Unpublished
            </span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-2xs">
          <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block mb-1">
            Patient Reads &amp; Views
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-[#301444]">{stats.totalViews}</span>
            <span className="text-[11px] font-medium text-purple-600">Total Clicks</span>
          </div>
        </div>
      </div>

      {/* ── SEARCH & FILTER CONTROLS ── */}
      <div className="bg-white border border-slate-200 rounded-lg p-2.5 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, keyword, or tag..."
            className="w-full pl-9 pr-3 py-1.5 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:border-purple-600 focus:bg-white focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-700"
            >
              ×
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs text-slate-700 bg-white border border-slate-200 rounded-lg font-medium focus:border-purple-600 focus:outline-none flex-1 sm:flex-initial"
          >
            <option value="ALL">All Categories</option>
            <option value="Pediatric Speech">Pediatric Speech</option>
            <option value="Audiology & Hearing">Audiology &amp; Hearing</option>
            <option value="Hearing Technology">Hearing Technology</option>
            <option value="Voice & Fluency">Voice &amp; Fluency</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs text-slate-700 bg-white border border-slate-200 rounded-lg font-medium focus:border-purple-600 focus:outline-none flex-1 sm:flex-initial"
          >
            <option value="ALL">All Statuses</option>
            <option value="PUBLISHED">Published Only</option>
            <option value="DRAFT">Drafts Only</option>
          </select>
        </div>
      </div>

      {/* ── ARTICLES DATA TABLE ── */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                <th className="py-2.5 px-3 w-14 text-center">Article</th>
                <th className="py-2.5 px-3">Title &amp; Clinical Subtitle</th>
                <th className="py-2.5 px-3 w-36">Category</th>
                <th className="py-2.5 px-3 w-28">Published</th>
                <th className="py-2.5 px-3 w-20 text-center">Views</th>
                <th className="py-2.5 px-3 w-28 text-center">Status</th>
                <th className="py-2.5 px-3 w-36 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-purple-600" />
                    <span>Loading clinical articles...</span>
                  </td>
                </tr>
              ) : filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    <BookOpen className="w-6 h-6 mx-auto mb-1 text-slate-300" />
                    <p className="font-bold text-slate-600">No clinical articles found</p>
                    <p className="text-[11px] text-slate-400">
                      Try adjusting your search query or click "Write New Article" to author one.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredArticles.map((art) => (
                  <tr key={art.id} className="hover:bg-purple-50/30 transition-colors">
                    
                    {/* Thumbnail */}
                    <td className="py-2 px-3 text-center">
                      <img
                        src={art.heroImage || '/patient-pexels.jpg'}
                        alt={art.title}
                        className="w-10 h-10 rounded-lg object-cover mx-auto border border-slate-200 shadow-2xs"
                        onError={(e) => {
                          e.target.src = '/patient-pexels.jpg';
                        }}
                      />
                    </td>

                    {/* Title & Slug */}
                    <td className="py-2 px-3 max-w-md">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="font-bold text-slate-900 line-clamp-1 hover:text-[#301444]">
                          {art.title}
                        </span>
                        {art.isFeatured && (
                          <span className="text-[9px] font-bold text-purple-800 bg-purple-100 px-1.5 py-0.2 rounded border border-purple-200 flex-shrink-0">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1">
                        {art.subtitle || art.excerpt}
                      </p>
                      <span className="text-[10px] font-mono text-purple-900/80">
                        /blogs/{art.slug}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="py-2 px-3">
                      <span className="inline-block text-[10.5px] font-bold text-[#301444] bg-purple-50 px-2 py-0.5 rounded-full border border-purple-150">
                        {art.category}
                      </span>
                    </td>

                    {/* Published Date */}
                    <td className="py-2 px-3 text-slate-600 text-[11px]">
                      <span className="block font-medium">{art.publishDate || art.date}</span>
                      <span className="text-[10px] text-slate-400">{art.readTime || art.read_time}</span>
                    </td>

                    {/* Views */}
                    <td className="py-2 px-3 text-center font-mono font-bold text-slate-700 text-[11px]">
                      {art.viewsCount || 0}
                    </td>

                    {/* Status Toggle */}
                    <td className="py-2 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(art)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border cursor-pointer transition-all ${
                          art.status === 'PUBLISHED'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                            : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                        }`}
                        title="Click to toggle Published / Draft"
                      >
                        {art.status}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-2 px-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to={`/blogs/${art.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-slate-500 hover:text-[#301444] hover:bg-purple-100 rounded transition-colors"
                          title="View on Public Website"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleEdit(art)}
                          className="p-1.5 text-purple-700 hover:text-purple-950 hover:bg-purple-100 rounded transition-colors cursor-pointer"
                          title="Edit Article"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(art.id, art.title)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                          title="Delete Article"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── ARTICLE EDITOR MODAL ── */}
      <BlogEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        article={editingArticle}
        onSaveSuccess={handleSaveSuccess}
      />

    </div>
  );
};

export default BlogsManagementPage;
