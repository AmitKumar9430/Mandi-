import React, { useEffect, useState } from 'react';
import { adminOpsApi } from '../../../shared/api/adminApi';
import ImageModalViewer from '../../../components/ImageModalViewer';
import { INDIAN_STATES } from '../../../shared/utils/locationService';
import {
  FileText,
  Search,
  Filter,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Flame,
  Check,
  X,
  MapPin,
  Building2,
  ExternalLink,
  Clock,
  Send,
  User as UserIcon,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export default function AdminProblemManagement() {
  const [problems, setProblems] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // Assignment Modal
  const [assigningProblem, setAssigningProblem] = useState(null);
  const [selectedOrgId, setSelectedOrgId] = useState('');
  const [customDeadlineHours, setCustomDeadlineHours] = useState(24);
  const [assignRemarks, setAssignRemarks] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);

  // Escalation Modal
  const [escalatingProblem, setEscalatingProblem] = useState(null);
  const [escalateReason, setEscalateReason] = useState('');
  const [isEscalating, setIsEscalating] = useState(false);

  // Problem Edit Modal
  const [editingProblem, setEditingProblem] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editCategory, setEditCategory] = useState('AGRICULTURE');
  const [editUrgency, setEditUrgency] = useState('MEDIUM');
  const [editStatus, setEditStatus] = useState('NEW');
  const [editDistrict, setEditDistrict] = useState('');
  const [editState, setEditState] = useState('');
  const [editRemarks, setEditRemarks] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const fetchProblems = async () => {
    setLoading(true);
    try {
      let statusParam = status || undefined;
      if (activeTab === 'NEW') statusParam = 'NEW';
      if (activeTab === 'IN_PROGRESS') statusParam = 'IN_PROGRESS';
      if (activeTab === 'VERIFY') statusParam = 'VERIFICATION_PENDING';
      if (activeTab === 'REOPENED') statusParam = 'REOPENED';
      if (activeTab === 'CLOSED') statusParam = 'CLOSED';

      const res = await adminOpsApi.getProblems({
        category: category || undefined,
        status: statusParam,
        search: search || undefined,
        page: 0,
        size: 50
      });
      if (res.data?.content) setProblems(res.data.content);
    } catch {
      // Handled
    } finally {
      setLoading(false);
    }
  };

  const fetchOrganizations = async () => {
    try {
      const res = await adminOpsApi.getOrganizations();
      if (res.data) setOrganizations(res.data);
    } catch {
      // Handled
    }
  };

  useEffect(() => {
    fetchProblems();
  }, [category, status, activeTab]);

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProblems();
  };

  // Assign Organization Submit
  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOrgId || !assigningProblem) return;
    setIsAssigning(true);
    try {
      await adminOpsApi.assignProblem(assigningProblem.id, {
        organizationId: Number(selectedOrgId),
        customDeadlineHours: Number(customDeadlineHours),
        assignmentRemarks: assignRemarks
      });
      setAssigningProblem(null);
      setSelectedOrgId('');
      setAssignRemarks('');
      fetchProblems();
    } catch (err) {
      alert(err.message || 'Failed to assign department');
    } finally {
      setIsAssigning(false);
    }
  };

  // Escalate Submit
  const handleEscalateSubmit = async (e) => {
    e.preventDefault();
    if (!escalateReason.trim() || !escalatingProblem) return;
    setIsEscalating(true);
    try {
      await adminOpsApi.escalateProblem(escalatingProblem.id);
      setEscalatingProblem(null);
      setEscalateReason('');
      fetchProblems();
    } catch (err) {
      alert(err.message || 'Failed to escalate');
    } finally {
      setIsEscalating(false);
    }
  };

  const handleOpenEdit = (p) => {
    setEditingProblem(p);
    setEditTitle(p.title);
    setEditDesc(p.rawDescription);
    setEditCategory(p.category || 'AGRICULTURE');
    setEditUrgency(p.urgency || 'MEDIUM');
    setEditStatus(p.status || 'NEW');
    setEditDistrict(p.district || '');
    setEditState(p.state || 'Uttar Pradesh');
    setEditRemarks('');
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await adminOpsApi.editProblem(editingProblem.id, {
        title: editTitle,
        rawDescription: editDesc,
        category: editCategory,
        urgency: editUrgency,
        status: editStatus,
        district: editDistrict,
        state: editState,
        remarks: editRemarks
      });
      setEditingProblem(null);
      fetchProblems();
    } catch (err) {
      alert(err.message || 'Failed to update problem');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this complaint ticket and all its audit logs?')) return;
    try {
      await adminOpsApi.deleteProblem(id);
      setProblems((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete problem');
    }
  };

  const getStatusBadgeClass = (s) => {
    switch (s) {
      case 'CLOSED':
      case 'COMPLETED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'VERIFICATION_PENDING':
        return 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse';
      case 'IN_PROGRESS':
      case 'ACCEPTED':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'REOPENED':
      case 'ESCALATED':
      case 'OVERDUE':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Lightbox Modal */}
      <ImageModalViewer
        src={selectedPhoto}
        isOpen={Boolean(selectedPhoto)}
        title="Problem Evidence Inspection"
        onClose={() => setSelectedPhoto(null)}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-stone-200 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-pine-900 text-pine-100 text-[10px] font-black px-2.5 py-0.5 rounded uppercase font-mono">
              COMPLAINT CONTROL CENTER
            </span>
            <span className="text-xs text-stone-500 font-bold">Statewide Resolution Triage</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 mt-1">
            Grievance & Resolution Management
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => fetchProblems()}
            className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl border border-stone-300 flex items-center space-x-1"
          >
            <span>Refresh Ledger</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-stone-200 pb-2">
        {[
          { id: 'ALL', label: 'All Tickets' },
          { id: 'NEW', label: 'New / Unassigned' },
          { id: 'IN_PROGRESS', label: 'Active In Progress' },
          { id: 'VERIFY', label: 'Citizen Verification' },
          { id: 'REOPENED', label: 'Reopened / Urgent' },
          { id: 'CLOSED', label: 'Resolved & Closed' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition ${
              activeTab === tab.id
                ? 'bg-pine-900 text-white shadow-xs'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search & Category Filter */}
      <div className="bg-white p-4 rounded-2xl border-2 border-stone-200 shadow-xs flex flex-wrap items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 min-w-[240px] flex items-center relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3" />
          <input
            type="text"
            placeholder="Search by ticket code, title, village or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-pine-700"
          />
        </form>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-800 font-bold"
        >
          <option value="">All Categories</option>
          <option value="AGRICULTURE">Agriculture & Crops</option>
          <option value="ELECTRICITY">Power & Electricity</option>
          <option value="WATER_SANITATION">Water & Sanitation</option>
          <option value="INFRASTRUCTURE">Roads & Infrastructure</option>
          <option value="HEALTHCARE">Healthcare & Hospital</option>
          <option value="EMPLOYMENT">Jobs & Artisans</option>
          <option value="EDUCATION">Education & Schools</option>
          <option value="SOCIAL_WELFARE">Govt Schemes & Welfare</option>
        </select>
      </div>

      {/* Problems Table */}
      {loading ? (
        <div className="py-16 text-center space-y-2">
          <Loader2 className="w-8 h-8 text-pine-700 animate-spin mx-auto" />
          <p className="text-xs text-stone-500 font-bold">Loading complaints ledger...</p>
        </div>
      ) : problems.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border-2 border-stone-200 text-center space-y-2">
          <FileText className="w-10 h-10 text-stone-300 mx-auto" />
          <h3 className="text-base font-black text-stone-800">No complaints matching filter</h3>
          <p className="text-xs text-stone-500">Try changing status tabs or search parameters.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border-2 border-stone-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-100 text-stone-900 uppercase font-black tracking-wider text-[10px] border-b border-stone-200">
                <tr>
                  <th className="p-4">Ticket & Title</th>
                  <th className="p-4">Category & Location</th>
                  <th className="p-4">Assigned Department</th>
                  <th className="p-4">Status & SLA</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {problems.map((p) => (
                  <tr key={p.id} className="hover:bg-stone-50/80 transition">
                    {/* Ticket & Title */}
                    <td className="p-4 space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-black text-pine-900 bg-pine-50 px-2 py-0.5 rounded border border-pine-200 text-[11px]">
                          {p.passportCode || `MANDI-${p.id}`}
                        </span>
                        {p.isEscalated && (
                          <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded flex items-center space-x-0.5">
                            <Flame className="w-3 h-3" />
                            <span>ESCALATED</span>
                          </span>
                        )}
                      </div>
                      <h4 className="font-black text-stone-900 text-xs">{p.title}</h4>
                      <p className="text-[11px] text-stone-500 line-clamp-1 max-w-sm">{p.rawDescription}</p>
                    </td>

                    {/* Category & Location */}
                    <td className="p-4 space-y-1">
                      <span className="font-bold text-stone-800 block">{p.category}</span>
                      <div className="flex items-center space-x-1 text-[11px] text-stone-500">
                        <MapPin className="w-3 h-3 text-stone-400 flex-shrink-0" />
                        <span>{p.villageOrTown || 'Village'}, {p.district}</span>
                      </div>
                    </td>

                    {/* Assigned Department */}
                    <td className="p-4 space-y-1">
                      {p.assignedOrganizationName ? (
                        <div>
                          <span className="font-black text-stone-900 block">{p.assignedOrganizationName}</span>
                          <span className="text-[10px] text-stone-500 block">Lead: {p.assignedResolverName || 'Dept Team'}</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setAssigningProblem(p);
                            setSelectedOrgId(organizations[0]?.id || '');
                          }}
                          className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 text-[11px] font-bold rounded-lg border border-amber-300 flex items-center space-x-1"
                        >
                          <Building2 className="w-3 h-3" />
                          <span>+ Assign Dept</span>
                        </button>
                      )}
                    </td>

                    {/* Status & SLA */}
                    <td className="p-4 space-y-1">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black border ${getStatusBadgeClass(p.status)}`}>
                        {p.status}
                      </span>
                      <div className="text-[10px] text-stone-500 flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>SLA: <strong className={p.isOverdue ? 'text-red-600' : 'text-stone-700'}>{p.slaStatus || 'ON_TIME'}</strong></span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                      <a
                        href={`/user/problems/${p.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg inline-block text-xs"
                        title="View Public Passport & Timeline"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>

                      <button
                        onClick={() => {
                          setAssigningProblem(p);
                          setSelectedOrgId(p.assignedOrganizationId || organizations[0]?.id || '');
                        }}
                        className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg"
                        title="Reassign Department"
                      >
                        <Building2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          setEscalatingProblem(p);
                          setEscalateReason('Administrative priority escalation requested.');
                        }}
                        className="p-1.5 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-lg"
                        title="Escalate to CRITICAL Priority"
                      >
                        <Flame className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg"
                        title="Edit Record"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg"
                        title="Delete Permanently"
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

      {/* ASSIGN DEPARTMENT MODAL */}
      {assigningProblem && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleAssignSubmit} className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl border-2 border-stone-200 text-stone-900 animate-fadeIn">
            <div className="flex items-center space-x-2 text-pine-900 border-b border-stone-200 pb-3">
              <Building2 className="w-5 h-5 text-pine-700" />
              <h3 className="font-black text-base">Assign Responsible Organization / Department</h3>
            </div>

            <div>
              <span className="text-xs text-stone-500 font-bold block">Complaint Ticket:</span>
              <h4 className="font-black text-stone-900 text-sm">
                #{assigningProblem.passportCode || `MANDI-${assigningProblem.id}`}: {assigningProblem.title}
              </h4>
            </div>

            <div>
              <label className="text-xs font-black text-stone-900 block mb-1">Select Department / Agency*:</label>
              <select
                value={selectedOrgId}
                onChange={(e) => setSelectedOrgId(e.target.value)}
                required
                className="w-full p-3 bg-stone-50 border-2 border-stone-300 rounded-xl text-xs text-stone-900 font-bold"
              >
                <option value="">-- Choose Accredited Department --</option>
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name} ({org.district}) — Rating: {org.avgRating}★ ({org.totalResolved} solved)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Custom SLA Deadline (Hours):</label>
              <input
                type="number"
                min="2"
                max="720"
                value={customDeadlineHours}
                onChange={(e) => setCustomDeadlineHours(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Dispatch Remarks (Optional):</label>
              <textarea
                rows={2}
                value={assignRemarks}
                onChange={(e) => setAssignRemarks(e.target.value)}
                placeholder="e.g. High priority power outage; immediate line crew dispatch requested."
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button type="button" onClick={() => setAssigningProblem(null)} className="px-4 py-2 text-xs font-bold text-stone-600">Cancel</button>
              <button type="submit" disabled={isAssigning} className="px-6 py-2.5 bg-pine-900 text-white text-xs font-bold rounded-xl">Confirm & Dispatch Task</button>
            </div>
          </form>
        </div>
      )}

      {/* ESCALATE MODAL */}
      {escalatingProblem && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleEscalateSubmit} className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl border-2 border-stone-200 text-stone-900 animate-fadeIn">
            <div className="flex items-center space-x-2 text-red-700 border-b border-stone-200 pb-3">
              <Flame className="w-5 h-5 text-red-600" />
              <h3 className="font-black text-base">Executive Priority Escalation</h3>
            </div>

            <div>
              <span className="text-xs text-stone-500 font-bold block">Target Complaint:</span>
              <h4 className="font-black text-stone-900 text-sm">
                #{escalatingProblem.passportCode || `MANDI-${escalatingProblem.id}`}: {escalatingProblem.title}
              </h4>
            </div>

            <div>
              <label className="text-xs font-black text-stone-900 block mb-1">Escalation Reason & Directive*:</label>
              <textarea
                rows={3}
                value={escalateReason}
                onChange={(e) => setEscalateReason(e.target.value)}
                required
                placeholder="e.g. Overdue beyond SLA limit. Executive intervention and immediate resolution required."
                className="w-full p-3 bg-stone-50 border-2 border-red-300 rounded-xl text-xs"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button type="button" onClick={() => setEscalatingProblem(null)} className="px-4 py-2 text-xs font-bold text-stone-600">Cancel</button>
              <button type="submit" disabled={isEscalating} className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-xl shadow">Trigger CRITICAL Escalation</button>
            </div>
          </form>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingProblem && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleSaveEdit} className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl border-2 border-stone-200 text-stone-900 animate-fadeIn">
            <h3 className="font-black text-base text-stone-900 border-b border-stone-200 pb-2">Edit Complaint Record</h3>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Title:</label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                required
                className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Description:</label>
              <textarea
                rows={3}
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                required
                className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Category:</label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                >
                  <option value="AGRICULTURE">Agriculture</option>
                  <option value="ELECTRICITY">Electricity</option>
                  <option value="WATER_SANITATION">Water & Sanitation</option>
                  <option value="INFRASTRUCTURE">Infrastructure</option>
                  <option value="HEALTHCARE">Healthcare</option>
                  <option value="EMPLOYMENT">Employment</option>
                  <option value="EDUCATION">Education</option>
                  <option value="SOCIAL_WELFARE">Social Welfare</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Urgency:</label>
                <select
                  value={editUrgency}
                  onChange={(e) => setEditUrgency(e.target.value)}
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">State:</label>
                <select
                  value={editState}
                  onChange={(e) => setEditState(e.target.value)}
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold"
                >
                  {INDIAN_STATES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">District / City:</label>
                <input
                  type="text"
                  value={editDistrict}
                  onChange={(e) => setEditDistrict(e.target.value)}
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Status:</label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold"
              >
                <option value="NEW">NEW</option>
                <option value="ASSIGNED">ASSIGNED</option>
                <option value="ACCEPTED">ACCEPTED</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="RESOLVED">RESOLVED</option>
                <option value="VERIFICATION_PENDING">VERIFICATION_PENDING</option>
                <option value="CLOSED">CLOSED</option>
                <option value="REOPENED">REOPENED</option>
                <option value="ESCALATED">ESCALATED</option>
              </select>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button type="button" onClick={() => setEditingProblem(null)} className="px-4 py-2 text-xs font-bold text-stone-600">Cancel</button>
              <button type="submit" disabled={isSaving} className="px-6 py-2 bg-pine-900 text-white text-xs font-bold rounded-xl">Save Changes</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
