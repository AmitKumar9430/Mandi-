import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Filter,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useUserAuth } from '../../../auth/UserAuthContext';
import BookingManagementCard from '../../../components/matching/BookingManagementCard';

export default function UserBookings() {
  const { user } = useUserAuth();
  const [activeTab, setActiveTab] = useState('REQUESTS'); // 'REQUESTS' or 'JOBS'
  const [requests, setRequests] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('mandi_token');
      const headers = { 'Authorization': `Bearer ${token}` };

      const [reqRes, jobRes] = await Promise.all([
        fetch('/api/bookings/my-requests', { headers }),
        fetch('/api/bookings/my-jobs', { headers })
      ]);

      if (reqRes.ok) {
        const reqData = await reqRes.json();
        setRequests(reqData?.data || []);
      }

      if (jobRes.ok) {
        const jobData = await jobRes.json();
        setJobs(jobData?.data || []);
      }
    } catch (err) {
      console.warn('Failed to load bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleAction = async (url, method = 'POST', body = null) => {
    const token = localStorage.getItem('token') || localStorage.getItem('mandi_token');
    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: body ? JSON.stringify(body) : null
      });
      if (res.ok) {
        fetchBookings();
      } else {
        const err = await res.json();
        alert(err?.message || 'Operation failed');
      }
    } catch (e) {
      alert(e.message || 'Operation failed');
    }
  };

  const currentList = activeTab === 'REQUESTS' ? requests : jobs;
  const filteredList = currentList.filter((b) => {
    const matchesSearch =
      (b.serviceType && b.serviceType.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (b.providerName && b.providerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (b.requesterName && b.requesterName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (b.villageOrTown && b.villageOrTown.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || b.bookingStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Service Bookings & Coordination Hub
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Track equipment rentals, agricultural workforce bookings, and dual ratings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchBookings}
            className="p-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 transition"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            to="/user/problems/new"
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Service Request / नई मांग
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('REQUESTS')}
          className={`px-5 py-3 font-bold text-sm border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'REQUESTS'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>My Requested Services (मेरी मांगें)</span>
          <span className="px-2 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800">
            {requests.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('JOBS')}
          className={`px-5 py-3 font-bold text-sm border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'JOBS'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>My Provider Bookings (प्राप्त कार्य)</span>
          <span className="px-2 py-0.5 rounded-full text-xs font-extrabold bg-blue-100 text-blue-800">
            {jobs.length}
          </span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by service, provider, or village..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white"
          >
            <option value="ALL">All Statuses (सभी स्थितियाँ)</option>
            <option value="PENDING">Pending Acceptance</option>
            <option value="ACCEPTED">Accepted / Scheduled</option>
            <option value="SERVICE_DELIVERED">Delivered</option>
            <option value="COMPLETED">Completed & Verified</option>
            <option value="RESCHEDULED">Rescheduled</option>
            <option value="REJECTED">Declined</option>
          </select>
        </div>
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-medium">Loading coordination bookings...</p>
        </div>
      ) : filteredList.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Calendar className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-800">No Bookings Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              {activeTab === 'REQUESTS'
                ? 'You have not placed any service booking requests yet.'
                : 'No incoming booking requests for your registered services yet.'}
            </p>
          </div>
          {activeTab === 'REQUESTS' && (
            <Link
              to="/user/problems/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition"
            >
              Request a Service Now
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredList.map((b) => (
            <BookingManagementCard
              key={b.id}
              booking={b}
              currentUserId={user?.id}
              onAccept={(id) => handleAction(`/api/bookings/${id}/accept`)}
              onReject={(id) => handleAction(`/api/bookings/${id}/reject`, 'POST', { reason: 'Provider unavailable' })}
              onDeliver={(id) => handleAction(`/api/bookings/${id}/deliver`)}
              onConfirm={(id) => handleAction(`/api/bookings/${id}/confirm`)}
              onAcceptReschedule={(id) => handleAction(`/api/bookings/${id}/reschedule/accept`)}
              onRate={(id, rateData) => handleAction(`/api/bookings/${id}/rate`, 'POST', rateData)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
