import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { adminApi, problemApi } from '../api/client';
import {
  Shield,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Users,
  Activity,
  ArrowRight,
  TrendingUp,
  FileText,
  Building2,
  Loader2,
  RefreshCw,
  Search,
  Filter,
  Edit,
  Trash2,
  Check,
  X,
  ExternalLink,
  MapPin,
  Sprout,
  Briefcase,
  Truck,
  PlusCircle
} from 'lucide-react';

export default function AdminPanel() {
  const { user } = useAuth();
  const { lang, t } = useLanguage();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('problems'); // 'problems' | 'users' | 'crops' | 'jobs' | 'civic' | 'resources'
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  // Geographic filters
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Data sets
  const [problems, setProblems] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [cropsList, setCropsList] = useState([]);
  const [jobsList, setJobsList] = useState([]);
  const [resourcesList, setResourcesList] = useState([]);

  // Editing state for Problem modal
  const [editingProblem, setEditingProblem] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editCategory, setEditCategory] = useState('AGRICULTURE');
  const [editUrgency, setEditUrgency] = useState('MEDIUM');
  const [editStatus, setEditStatus] = useState('SUBMITTED');
  const [editDistrict, setEditDistrict] = useState('');
  const [editState, setEditState] = useState('');
  const [editRemarks, setEditRemarks] = useState('');
  const [isSavingProblem, setIsSavingProblem] = useState(false);

  // Editing state for User modal
  const [editingUser, setEditingUser] = useState(null);
  const [editUserName, setEditUserName] = useState('');
  const [editUserPhone, setEditUserPhone] = useState('');
  const [editUserEmail, setEditUserEmail] = useState('');
  const [editUserRole, setEditUserRole] = useState('ROLE_CITIZEN');
  const [editUserVerified, setEditUserVerified] = useState(false);
  const [isSavingUser, setIsSavingUser] = useState(false);

  const isAdmin = user?.roles?.includes('ROLE_ADMIN') || user?.roles?.includes('ADMIN');

  const loadData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, probRes, usersRes, cropsRes, jobsRes, resRes] = await Promise.all([
        adminApi.getAnalytics({ state: selectedState || undefined, district: selectedDistrict || undefined }).catch(() => ({ data: null })),
        adminApi.getProblems({
          state: selectedState || undefined,
          district: selectedDistrict || undefined,
          category: categoryFilter || undefined,
          status: statusFilter || undefined,
          search: searchQuery || undefined,
          page: 0,
          size: 50
        }).catch(() => ({ data: { content: [] } })),
        adminApi.getUsers().catch(() => ({ data: [] })),
        adminApi.getCrops().catch(() => ({ data: [] })),
        adminApi.getJobs().catch(() => ({ data: [] })),
        adminApi.getResources().catch(() => ({ data: [] }))
      ]);

      if (analyticsRes?.data) setAnalytics(analyticsRes.data);
      if (probRes?.data?.content) setProblems(probRes.data.content);
      if (usersRes?.data) setUsersList(usersRes.data);
      if (cropsRes?.data) setCropsList(cropsRes.data);
      if (jobsRes?.data) setJobsList(jobsRes.data);
      if (resRes?.data) setResourcesList(resRes.data);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdmin) {
      navigate('/login?redirect=admin');
      return;
    }
    loadData();
  }, [user, selectedState, selectedDistrict, statusFilter, categoryFilter]);

  // Problem CRUD Handlers
  const handleOpenEditProblem = (p) => {
    setEditingProblem(p);
    setEditTitle(p.title || '');
    setEditDesc(p.rawDescription || '');
    setEditCategory(p.category || 'AGRICULTURE');
    setEditUrgency(p.urgency || 'MEDIUM');
    setEditStatus(p.status || 'SUBMITTED');
    setEditDistrict(p.district || '');
    setEditState(p.state || 'Uttar Pradesh');
    setEditRemarks('');
  };

  const handleSaveProblem = async (e) => {
    e.preventDefault();
    if (!editingProblem) return;
    setIsSavingProblem(true);
    try {
      await adminApi.editProblem(editingProblem.id, {
        title: editTitle,
        rawDescription: editDesc,
        category: editCategory,
        urgency: editUrgency,
        status: editStatus,
        district: editDistrict,
        state: editState,
        remarks: editRemarks || 'Updated by Administrator'
      });
      alert('Problem passport updated successfully!');
      setEditingProblem(null);
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to update problem');
    } finally {
      setIsSavingProblem(false);
    }
  };

  const handleDeleteProblem = async (id, passportCode) => {
    if (window.confirm(`Are you sure you want to permanently delete Problem ${passportCode || id}? This will remove all associated solution graphs, events, and records.`)) {
      try {
        await adminApi.deleteProblem(id);
        alert('Problem deleted permanently.');
        loadData();
      } catch (err) {
        alert(err.message || 'Failed to delete problem');
      }
    }
  };

  const handleQuickStatusChange = async (id, newStatus) => {
    try {
      await problemApi.updateStatus(id, {
        status: newStatus,
        remarks: `Status updated to ${newStatus} by Administrator (${user.fullName})`
      });
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to update status');
    }
  };

  // User CRUD Handlers
  const handleToggleUserVerify = async (userId) => {
    try {
      await adminApi.toggleUserVerify(userId);
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to toggle verification');
    }
  };

  const handleOpenEditUser = (u) => {
    setEditingUser(u);
    setEditUserName(u.fullName || '');
    setEditUserPhone(u.phone || '');
    setEditUserEmail(u.email || '');
    setEditUserRole(u.roles?.[0] || 'ROLE_CITIZEN');
    setEditUserVerified(u.verified || false);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    if (!editingUser) return;
    setIsSavingUser(true);
    try {
      await adminApi.editUser(editingUser.id, {
        fullName: editUserName,
        phone: editUserPhone,
        email: editUserEmail || undefined,
        roles: [editUserRole],
        verified: editUserVerified
      });
      alert('User profile updated successfully.');
      setEditingUser(null);
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to update user');
    } finally {
      setIsSavingUser(false);
    }
  };

  const handleDeleteUser = async (id, name) => {
    if (window.confirm(`Are you sure you want to permanently delete user "${name}"?`)) {
      try {
        await adminApi.deleteUser(id);
        alert('User account deleted.');
        loadData();
      } catch (err) {
        alert(err.message || 'Failed to delete user');
      }
    }
  };

  // Crop / Job / Resource Delete Handlers
  const handleDeleteCrop = async (id) => {
    if (window.confirm('Delete this crop listing?')) {
      await adminApi.deleteCrop(id);
      loadData();
    }
  };

  const handleDeleteJob = async (id) => {
    if (window.confirm('Delete this job posting?')) {
      await adminApi.deleteJob(id);
      loadData();
    }
  };

  const handleDeleteResource = async (id) => {
    if (window.confirm('Delete this resource listing?')) {
      await adminApi.deleteResource(id);
      loadData();
    }
  };

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <Shield className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-xl font-bold text-stone-900">Admin Access Required</h2>
        <p className="text-xs text-stone-500">
          Only users registered with the Admin Passkey (<code className="bg-stone-100 p-1 rounded font-bold">MandiAdmin@123</code>) can view this panel.
        </p>
        <Link to="/login" className="bg-pine-700 text-white font-bold px-5 py-2.5 rounded-xl inline-block text-xs">
          Login as Admin
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Header & Quick Controls */}
      <div className="bg-stone-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-pine-600 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-stone-950 flex items-center justify-center font-black text-2xl shadow-lg border-2 border-amber-300">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs uppercase tracking-widest text-amber-400 font-black">
                {lang === 'hi' ? 'सर्वोच्च प्रशासक नियंत्रण केंद्र' : 'MANDI System Administration'}
              </span>
              <span className="bg-amber-400 text-stone-950 text-[10px] font-black px-2 py-0.5 rounded">
                ROOT SUPER-ADMIN
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-0.5">
              Full System Oversight & Operations Hub
            </h1>
            <p className="text-xs text-stone-400">
              Administrator: <strong className="text-emerald-300">{user.fullName || user.phone}</strong> • Full CRUD Permission Active
            </p>
          </div>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="bg-stone-800 hover:bg-stone-700 text-emerald-300 px-4 py-2.5 rounded-xl text-xs font-bold border border-pine-500/50 flex items-center space-x-2 shadow transition"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh All Data</span>
        </button>
      </div>

      {/* 2. Geographic Filter Bar (All States & Cities) */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border-2 border-stone-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3 flex-wrap gap-y-2">
          <div className="flex items-center space-x-2 text-xs font-bold text-stone-700">
            <MapPin className="w-4 h-4 text-pine-700" />
            <span>{lang === 'hi' ? 'राज्य व शहर फ़िल्टर:' : 'Geography Filters:'}</span>
          </div>

          {/* State Selector */}
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="p-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-pine-500"
          >
            <option value="">All States (सभी राज्य)</option>
            <option value="Uttar Pradesh">Uttar Pradesh (उत्तर प्रदेश)</option>
            <option value="Bihar">Bihar (बिहार)</option>
            <option value="Madhya Pradesh">Madhya Pradesh (मध्य प्रदेश)</option>
            <option value="Rajasthan">Rajasthan (राजस्थान)</option>
            {analytics?.availableStates?.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* District / City Selector */}
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="p-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-pine-500"
          >
            <option value="">All Cities / Districts (सभी ज़िले)</option>
            <option value="Lucknow">Lucknow (लखनऊ)</option>
            <option value="Barabanki">Barabanki (बाराबंकी)</option>
            <option value="Sitapur">Sitapur (सीतापुर)</option>
            <option value="Varanasi">Varanasi (वाराणसी)</option>
            <option value="Kanpur">Kanpur (कानपुर)</option>
            <option value="Gorakhpur">Gorakhpur (गोरखपुर)</option>
            <option value="Patna">Patna (पटना)</option>
            {analytics?.availableDistricts?.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          {/* Clear Filter */}
          {(selectedState || selectedDistrict) && (
            <button
              onClick={() => { setSelectedState(''); setSelectedDistrict(''); }}
              className="text-xs text-red-600 hover:underline font-bold flex items-center space-x-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear Filter</span>
            </button>
          )}
        </div>

        {/* Search Query Input */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && loadData()}
            placeholder="Search problems, users, locations..."
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-pine-500"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* 3. System KPI Metrics Cards */}
      {analytics && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <div className="bg-white rounded-2xl p-4 border-2 border-stone-200 shadow-sm">
            <span className="text-[11px] font-bold text-stone-500 uppercase block">Total Problems</span>
            <div className="text-2xl font-black text-stone-900 mt-1">{analytics.totalProblems}</div>
            <div className="text-[10px] text-stone-500">Raised in System</div>
          </div>

          <div className="bg-emerald-50 rounded-2xl p-4 border-2 border-emerald-300 shadow-sm">
            <span className="text-[11px] font-bold text-emerald-900 uppercase block">Solved Problems</span>
            <div className="text-2xl font-black text-emerald-950 mt-1">{analytics.solvedProblems}</div>
            <div className="text-[10px] text-emerald-700 font-bold">{analytics.resolutionRate}% Success</div>
          </div>

          <div className="bg-pine-50 rounded-2xl p-4 border-2 border-pine-300 shadow-sm">
            <span className="text-[11px] font-bold text-pine-900 uppercase block">In Progress</span>
            <div className="text-2xl font-black text-pine-950 mt-1">{analytics.inProgressProblems}</div>
            <div className="text-[10px] text-pine-700">Multi-step Active</div>
          </div>

          <div className="bg-blue-50 rounded-2xl p-4 border-2 border-blue-300 shadow-sm">
            <span className="text-[11px] font-bold text-blue-900 uppercase block">Registered Users</span>
            <div className="text-2xl font-black text-blue-950 mt-1">{analytics.totalUsers}</div>
            <div className="text-[10px] text-blue-700">{analytics.verifiedUsers} Verified</div>
          </div>

          <div className="bg-amber-50 rounded-2xl p-4 border-2 border-amber-300 shadow-sm">
            <span className="text-[11px] font-bold text-amber-900 uppercase block">Kisan Produce</span>
            <div className="text-2xl font-black text-amber-950 mt-1">{analytics.totalCrops} Crops</div>
            <div className="text-[10px] text-amber-700">In Agri Market</div>
          </div>

          <div className="bg-purple-50 rounded-2xl p-4 border-2 border-purple-300 shadow-sm">
            <span className="text-[11px] font-bold text-purple-900 uppercase block">Active Jobs</span>
            <div className="text-2xl font-black text-purple-950 mt-1">{analytics.totalJobs} Listings</div>
            <div className="text-[10px] text-purple-700">TimeBank & Wages</div>
          </div>
        </div>
      )}

      {/* 4. City-by-City Resolution Matrix */}
      {analytics?.cityBreakdown && Object.keys(analytics.cityBreakdown).length > 0 && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-stone-200 space-y-4">
          <div className="flex items-center space-x-2 border-b border-stone-100 pb-3">
            <Building2 className="w-5 h-5 text-pine-700" />
            <h2 className="text-base sm:text-lg font-black text-stone-900">
              {lang === 'hi' ? 'शहर व ज़िला-वार समाधान आँकड़े (City Resolution Performance)' : 'City & District Performance Ledger'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {Object.entries(analytics.cityBreakdown).map(([city, stats]) => (
              <div
                key={city}
                onClick={() => setSelectedDistrict(city)}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer transition ${
                  selectedDistrict === city
                    ? 'border-pine-600 bg-pine-50 shadow-md'
                    : 'border-stone-200 hover:border-stone-400 bg-stone-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-black text-stone-900 text-sm">{city}</h4>
                    <span className="text-[11px] text-stone-500">{stats.state}</span>
                  </div>
                  <span className="text-xs font-black px-2 py-0.5 rounded bg-emerald-100 text-emerald-900">
                    {stats.resolutionRate}%
                  </span>
                </div>
                <div className="mt-2 pt-2 border-t border-stone-200 flex justify-between text-[11px] text-stone-600 font-semibold">
                  <span>Total: {stats.totalProblems}</span>
                  <span className="text-emerald-700">Solved: {stats.solvedProblems}</span>
                  <span className="text-pine-700">Active: {stats.activeProblems}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Tabbed System Management Interface */}
      <div className="bg-white rounded-3xl shadow-sm border-2 border-stone-200 overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex items-center border-b-2 border-stone-200 bg-stone-100/60 overflow-x-auto text-xs sm:text-sm font-bold">
          <button
            onClick={() => setActiveTab('problems')}
            className={`px-5 py-3.5 flex items-center space-x-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'problems'
                ? 'border-pine-700 text-pine-900 bg-white font-black'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Problems & Passports ({problems.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-5 py-3.5 flex items-center space-x-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'users'
                ? 'border-pine-700 text-pine-900 bg-white font-black'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>User Directory ({usersList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('crops')}
            className={`px-5 py-3.5 flex items-center space-x-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'crops'
                ? 'border-pine-700 text-pine-900 bg-white font-black'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sprout className="w-4 h-4" />
            <span>Kisan Produce ({cropsList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-5 py-3.5 flex items-center space-x-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'jobs'
                ? 'border-pine-700 text-pine-900 bg-white font-black'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Jobs & Wages ({jobsList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('resources')}
            className={`px-5 py-3.5 flex items-center space-x-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'resources'
                ? 'border-pine-700 text-pine-900 bg-white font-black'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Equipment Pool ({resourcesList.length})</span>
          </button>
        </div>

        {/* Tab 1: Problems & Passports Master Table */}
        {activeTab === 'problems' && (
          <div className="p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="font-bold text-stone-700">
                Showing {problems.length} Problem Passports across system
              </span>
              <div className="flex items-center space-x-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="p-2 bg-stone-50 border border-stone-300 rounded-xl font-bold text-stone-800"
                >
                  <option value="">All Statuses</option>
                  <option value="SUBMITTED">SUBMITTED</option>
                  <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                  <option value="VERIFIED">VERIFIED</option>
                  <option value="MATCHING">MATCHING</option>
                  <option value="SOLUTION_FOUND">SOLUTION_FOUND</option>
                  <option value="ASSIGNED">ASSIGNED</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="RESOLVED">RESOLVED</option>
                  <option value="CLOSED">CLOSED</option>
                </select>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="p-2 bg-stone-50 border border-stone-300 rounded-xl font-bold text-stone-800"
                >
                  <option value="">All Categories</option>
                  <option value="AGRICULTURE">AGRICULTURE</option>
                  <option value="HEALTHCARE">HEALTHCARE</option>
                  <option value="EMPLOYMENT">EMPLOYMENT</option>
                  <option value="WATER_SANITATION">WATER_SANITATION</option>
                  <option value="INFRASTRUCTURE">INFRASTRUCTURE</option>
                  <option value="EDUCATION">EDUCATION</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-stone-200 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-100/80 text-stone-700 font-bold uppercase border-b border-stone-200">
                  <tr>
                    <th className="p-3.5">Passport Code</th>
                    <th className="p-3.5">Title & Problem</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Location</th>
                    <th className="p-3.5">Status & Override</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 bg-white font-medium">
                  {problems.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-stone-500">
                        No problems found matching criteria.
                      </td>
                    </tr>
                  ) : (
                    problems.map((p) => (
                      <tr key={p.id} className="hover:bg-stone-50/80 transition">
                        <td className="p-3.5 font-mono font-black text-pine-800">
                          {p.passportCode || `MDI-2026-${p.id}`}
                        </td>
                        <td className="p-3.5 max-w-xs">
                          <span className="font-bold text-stone-900 block truncate">{p.title}</span>
                          <span className="text-stone-500 text-[11px] block truncate">"{p.rawDescription}"</span>
                        </td>
                        <td className="p-3.5">
                          <span className="bg-stone-100 text-stone-800 font-bold px-2 py-0.5 rounded border">
                            {p.category}
                          </span>
                        </td>
                        <td className="p-3.5 text-stone-600">
                          <div>{p.villageOrTown || p.district || 'Lucknow'}</div>
                          <div className="text-[10px] text-stone-400">{p.state || 'Uttar Pradesh'}</div>
                        </td>
                        <td className="p-3.5">
                          <select
                            value={p.status}
                            onChange={(e) => handleQuickStatusChange(p.id, e.target.value)}
                            className="p-1 bg-stone-50 border border-stone-300 rounded font-bold text-[11px] text-stone-800 focus:outline-none"
                          >
                            <option value="SUBMITTED">SUBMITTED</option>
                            <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                            <option value="VERIFIED">VERIFIED</option>
                            <option value="MATCHING">MATCHING</option>
                            <option value="SOLUTION_FOUND">SOLUTION_FOUND</option>
                            <option value="ASSIGNED">ASSIGNED</option>
                            <option value="IN_PROGRESS">IN_PROGRESS</option>
                            <option value="RESOLVED">RESOLVED</option>
                            <option value="CLOSED">CLOSED</option>
                          </select>
                        </td>
                        <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                          <Link
                            to={`/problems/${p.id}`}
                            className="p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg inline-block transition"
                            title="View Passport"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleOpenEditProblem(p)}
                            className="p-1.5 bg-pine-100 hover:bg-pine-200 text-pine-900 rounded-lg transition"
                            title="Edit Problem"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProblem(p.id, p.passportCode)}
                            className="p-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition"
                            title="Delete Problem"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: User Directory & Role Management */}
        {activeTab === 'users' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-stone-700">Total {usersList.length} registered accounts</span>
            </div>

            <div className="overflow-x-auto border border-stone-200 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-100/80 text-stone-700 font-bold uppercase border-b border-stone-200">
                  <tr>
                    <th className="p-3.5">Name</th>
                    <th className="p-3.5">Phone / Email</th>
                    <th className="p-3.5">Assigned Roles</th>
                    <th className="p-3.5">Location</th>
                    <th className="p-3.5">Verified Badge</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 bg-white font-medium">
                  {usersList.map((u) => (
                    <tr key={u.id} className="hover:bg-stone-50/80 transition">
                      <td className="p-3.5 font-bold text-stone-900">{u.fullName || 'Citizen User'}</td>
                      <td className="p-3.5 text-stone-600">
                        <div>{u.phone}</div>
                        <div className="text-[10px] text-stone-400">{u.email || 'No email'}</div>
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center space-x-1 flex-wrap gap-1">
                          {u.roles?.map((r, i) => (
                            <span key={i} className="text-[10px] font-bold bg-stone-100 text-stone-800 px-1.5 py-0.5 rounded border">
                              {r.replace('ROLE_', '')}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-3.5 text-stone-600">
                        {u.villageOrTown || u.district || 'Lucknow'}
                      </td>
                      <td className="p-3.5">
                        <button
                          type="button"
                          onClick={() => handleToggleUserVerify(u.id)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center space-x-1 border transition ${
                            u.verified
                              ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                              : 'bg-stone-100 text-stone-600 border-stone-300 hover:bg-stone-200'
                          }`}
                        >
                          <Check className="w-3 h-3" />
                          <span>{u.verified ? 'VERIFIED' : 'UNVERIFIED'}</span>
                        </button>
                      </td>
                      <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleOpenEditUser(u)}
                          className="p-1.5 bg-pine-100 hover:bg-pine-200 text-pine-900 rounded-lg transition"
                          title="Edit User"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteUser(u.id, u.fullName || u.phone)}
                          className="p-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition"
                          title="Delete User"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Kisan Crops Produce CRUD */}
        {activeTab === 'crops' && (
          <div className="p-6 space-y-4">
            <div className="overflow-x-auto border border-stone-200 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-100/80 text-stone-700 font-bold uppercase border-b border-stone-200">
                  <tr>
                    <th className="p-3.5">Crop Name</th>
                    <th className="p-3.5">Variety</th>
                    <th className="p-3.5">Quantity</th>
                    <th className="p-3.5">Expected Price</th>
                    <th className="p-3.5">Location</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 bg-white font-medium">
                  {cropsList.map((c) => (
                    <tr key={c.id} className="hover:bg-stone-50 transition">
                      <td className="p-3.5 font-bold text-stone-900">{c.cropName}</td>
                      <td className="p-3.5 text-stone-600">{c.variety || 'Standard'}</td>
                      <td className="p-3.5 font-bold text-stone-800">{c.quantityQuintals} Quintals</td>
                      <td className="p-3.5 font-black text-pine-800">₹{c.expectedPricePerQuintal} / Qtl</td>
                      <td className="p-3.5 text-stone-600">{c.villageOrTown || c.district || 'Lucknow'}</td>
                      <td className="p-3.5">
                        <span className="bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded text-[10px]">
                          {c.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => handleDeleteCrop(c.id)}
                          className="p-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Jobs CRUD */}
        {activeTab === 'jobs' && (
          <div className="p-6 space-y-4">
            <div className="overflow-x-auto border border-stone-200 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-100/80 text-stone-700 font-bold uppercase border-b border-stone-200">
                  <tr>
                    <th className="p-3.5">Job Title</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Daily Wage / Rate</th>
                    <th className="p-3.5">Location</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 bg-white font-medium">
                  {jobsList.map((j) => (
                    <tr key={j.id} className="hover:bg-stone-50 transition">
                      <td className="p-3.5 font-bold text-stone-900">{j.title}</td>
                      <td className="p-3.5 text-stone-600">{j.jobCategory}</td>
                      <td className="p-3.5 font-black text-amber-800">₹{j.dailyWageRate} / day</td>
                      <td className="p-3.5 text-stone-600">{j.villageOrTown || j.district || 'Lucknow'}</td>
                      <td className="p-3.5">
                        <span className="bg-stone-100 text-stone-800 font-bold px-2 py-0.5 rounded text-[10px]">
                          {j.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => handleDeleteJob(j.id)}
                          className="p-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: Equipment Pool CRUD */}
        {activeTab === 'resources' && (
          <div className="p-6 space-y-4">
            <div className="overflow-x-auto border border-stone-200 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-100/80 text-stone-700 font-bold uppercase border-b border-stone-200">
                  <tr>
                    <th className="p-3.5">Equipment / Service</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Cost Unit</th>
                    <th className="p-3.5">Location</th>
                    <th className="p-3.5">Availability</th>
                    <th className="p-3.5 text-right">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 bg-white font-medium">
                  {resourcesList.map((r) => (
                    <tr key={r.id} className="hover:bg-stone-50 transition">
                      <td className="p-3.5 font-bold text-stone-900">{r.name}</td>
                      <td className="p-3.5 text-stone-600">{r.category}</td>
                      <td className="p-3.5 font-black text-teal-800">₹{r.costPerUnit || 0} {r.costUnit}</td>
                      <td className="p-3.5 text-stone-600">{r.villageOrTown || r.district || 'Lucknow'}</td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          r.available ? 'bg-emerald-100 text-emerald-900' : 'bg-red-100 text-red-900'
                        }`}>
                          {r.available ? 'AVAILABLE' : 'BUSY'}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => handleDeleteResource(r.id)}
                          className="p-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Edit Problem Passport */}
      {editingProblem && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-stone-300 text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center space-x-2 text-pine-900 font-black text-sm sm:text-base">
                <Edit className="w-5 h-5 text-pine-700" />
                <span>Admin Edit Problem: {editingProblem.passportCode || editingProblem.id}</span>
              </div>
              <button onClick={() => setEditingProblem(null)} className="p-1 text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProblem} className="space-y-4">
              <div>
                <label className="font-bold text-stone-800 block mb-1">Problem Title:</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">Detailed Description:</label>
                <textarea
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  rows={3}
                  required
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-800 block mb-1">Category:</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl font-bold"
                  >
                    <option value="AGRICULTURE">AGRICULTURE</option>
                    <option value="HEALTHCARE">HEALTHCARE</option>
                    <option value="EMPLOYMENT">EMPLOYMENT</option>
                    <option value="WATER_SANITATION">WATER_SANITATION</option>
                    <option value="INFRASTRUCTURE">INFRASTRUCTURE</option>
                    <option value="EDUCATION">EDUCATION</option>
                    <option value="SOCIAL_WELFARE">SOCIAL_WELFARE</option>
                    <option value="OTHER">OTHER</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-stone-800 block mb-1">Urgency:</label>
                  <select
                    value={editUrgency}
                    onChange={(e) => setEditUrgency(e.target.value)}
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl font-bold"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-800 block mb-1">District / City:</label>
                  <input
                    type="text"
                    value={editDistrict}
                    onChange={(e) => setEditDistrict(e.target.value)}
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl font-semibold"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-800 block mb-1">Status Override:</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl font-bold text-pine-900"
                  >
                    <option value="SUBMITTED">SUBMITTED</option>
                    <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                    <option value="VERIFIED">VERIFIED</option>
                    <option value="MATCHING">MATCHING</option>
                    <option value="SOLUTION_FOUND">SOLUTION_FOUND</option>
                    <option value="ASSIGNED">ASSIGNED</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="RESOLVED">RESOLVED</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">Admin Audit Remarks:</label>
                <input
                  type="text"
                  value={editRemarks}
                  onChange={(e) => setEditRemarks(e.target.value)}
                  placeholder="e.g. Verified by District Collectorate"
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setEditingProblem(null)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingProblem}
                  className="px-5 py-2 bg-pine-700 hover:bg-pine-800 text-white font-black rounded-xl shadow border border-emerald-400"
                >
                  {isSavingProblem ? 'Saving...' : 'Save & Update Passport'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit User */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-stone-300 text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center space-x-2 text-pine-900 font-black text-sm">
                <Users className="w-4 h-4 text-pine-700" />
                <span>Edit User Profile: {editingUser.phone}</span>
              </div>
              <button onClick={() => setEditingUser(null)} className="p-1 text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-3">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Full Name:</label>
                <input
                  type="text"
                  value={editUserName}
                  onChange={(e) => setEditUserName(e.target.value)}
                  required
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Phone Number:</label>
                <input
                  type="text"
                  value={editUserPhone}
                  onChange={(e) => setEditUserPhone(e.target.value)}
                  required
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Email:</label>
                <input
                  type="email"
                  value={editUserEmail}
                  onChange={(e) => setEditUserEmail(e.target.value)}
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Primary Role:</label>
                <select
                  value={editUserRole}
                  onChange={(e) => setEditUserRole(e.target.value)}
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl font-bold"
                >
                  <option value="ROLE_CITIZEN">ROLE_CITIZEN</option>
                  <option value="ROLE_FARMER">ROLE_FARMER</option>
                  <option value="ROLE_WORKER">ROLE_WORKER</option>
                  <option value="ROLE_VOLUNTEER">ROLE_VOLUNTEER</option>
                  <option value="ROLE_SERVICE_PROVIDER">ROLE_SERVICE_PROVIDER</option>
                  <option value="ROLE_MANDI_MITRA">ROLE_MANDI_MITRA</option>
                  <option value="ROLE_ADMIN">ROLE_ADMIN</option>
                </select>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="userVerifyCheck"
                  checked={editUserVerified}
                  onChange={(e) => setEditUserVerified(e.target.checked)}
                  className="w-4 h-4 text-pine-700 rounded"
                />
                <label htmlFor="userVerifyCheck" className="font-bold text-stone-800">
                  Mark as Verified Citizen / Provider
                </label>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 bg-stone-100 text-stone-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingUser}
                  className="px-5 py-2 bg-pine-700 text-white font-black rounded-xl shadow"
                >
                  {isSavingUser ? 'Saving...' : 'Update User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
