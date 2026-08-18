import React, { useState, useEffect } from 'react';
import { adminOpsApi } from '../../../shared/api/adminApi';
import {
  Building2,
  ShieldCheck,
  Check,
  X,
  Search,
  PlusCircle,
  Star,
  Clock,
  Phone,
  Mail,
  Edit,
  Trash2,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  Flame
} from 'lucide-react';

export default function AdminNgoManagement() {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('');

  // Add / Edit Modal
  const [showModal, setShowModal] = useState(false);
  const [editingOrg, setEditingOrg] = useState(null);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [category, setCategory] = useState('AGRICULTURE');
  const [departmentType, setDepartmentType] = useState('GOVERNMENT_DEPT');
  const [description, setDescription] = useState('');
  const [district, setDistrict] = useState('Lucknow');
  const [state, setState] = useState('Uttar Pradesh');
  const [address, setAddress] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [headOfDept, setHeadOfDept] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const fetchOrganizations = async () => {
    setLoading(true);
    try {
      const res = await adminOpsApi.getOrganizations();
      if (res.data) {
        setOrganizations(res.data);
      }
    } catch {
      // Non-blocking
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const handleOpenAdd = () => {
    setEditingOrg(null);
    setName('');
    setCode('');
    setCategory('AGRICULTURE');
    setDepartmentType('GOVERNMENT_DEPT');
    setDescription('');
    setDistrict('Lucknow');
    setState('Uttar Pradesh');
    setAddress('');
    setContactEmail('');
    setContactPhone('');
    setHeadOfDept('');
    setShowModal(true);
  };

  const handleOpenEdit = (org) => {
    setEditingOrg(org);
    setName(org.name);
    setCode(org.code);
    setCategory(org.category || 'AGRICULTURE');
    setDepartmentType(org.departmentType || 'GOVERNMENT_DEPT');
    setDescription(org.description || '');
    setDistrict(org.district || 'Lucknow');
    setState(org.state || 'Uttar Pradesh');
    setAddress(org.address || '');
    setContactEmail(org.contactEmail || '');
    setContactPhone(org.contactPhone || '');
    setHeadOfDept(org.headOfDept || '');
    setShowModal(true);
  };

  const handleSaveSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        name,
        code,
        category,
        departmentType,
        description,
        district,
        state,
        address,
        contactEmail,
        contactPhone,
        headOfDept,
        verified: true,
        active: true
      };

      if (editingOrg) {
        await adminOpsApi.updateOrganization(editingOrg.id, payload);
      } else {
        await adminOpsApi.createOrganization(payload);
      }
      setShowModal(false);
      fetchOrganizations();
    } catch (err) {
      alert(err.message || 'Failed to save organization');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleVerify = async (id) => {
    try {
      await adminOpsApi.toggleVerifyOrganization(id);
      setOrganizations((prev) =>
        prev.map((o) => (o.id === id ? { ...o, verified: !o.verified } : o))
      );
    } catch (err) {
      alert(err.message || 'Failed to toggle accreditation');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this department / organization record?')) return;
    try {
      await adminOpsApi.deleteOrganization(id);
      setOrganizations((prev) => prev.filter((o) => o.id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete organization');
    }
  };

  const filteredOrgs = organizations.filter((org) => {
    const matchSearch =
      !search ||
      org.name?.toLowerCase().includes(search.toLowerCase()) ||
      org.district?.toLowerCase().includes(search.toLowerCase()) ||
      org.code?.toLowerCase().includes(search.toLowerCase());
    const matchCat = !selectedCat || org.category === selectedCat;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-stone-200 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-pine-900 text-pine-100 text-[10px] font-black px-2.5 py-0.5 rounded uppercase font-mono">
              ORGANIZATIONAL DIRECTORY & SCORECARDS
            </span>
            <span className="text-xs text-stone-500 font-bold">Public Departments & NGOs</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 mt-1">
            Department & NGO Performance Directory
          </h1>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-pine-800 hover:from-emerald-700 text-white text-xs font-black rounded-xl shadow flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Add Department / NGO</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border-2 border-stone-200 shadow-xs flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[240px] flex items-center relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3" />
          <input
            type="text"
            placeholder="Search by department name, district, or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-pine-700"
          />
        </div>

        <select
          value={selectedCat}
          onChange={(e) => setSelectedCat(e.target.value)}
          className="p-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-800 font-bold"
        >
          <option value="">All Sectors</option>
          <option value="ELECTRICITY">Electricity (UPPCL)</option>
          <option value="ROADS_INFRASTRUCTURE">Roads (PWD)</option>
          <option value="WATER_SANITATION">Water & Sanitation (Jal Nigam)</option>
          <option value="AGRICULTURE">Agriculture & KVK</option>
          <option value="HEALTHCARE">Healthcare & CMO</option>
          <option value="NGO_WELFARE">NGO Welfare & Relief</option>
        </select>
      </div>

      {/* Scorecards Grid */}
      {loading ? (
        <div className="py-16 text-center space-y-2">
          <Loader2 className="w-8 h-8 text-pine-700 animate-spin mx-auto" />
          <p className="text-xs text-stone-500 font-bold">Loading department scorecards...</p>
        </div>
      ) : filteredOrgs.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border-2 border-stone-200 text-center space-y-2">
          <Building2 className="w-10 h-10 text-stone-300 mx-auto" />
          <h3 className="text-base font-black text-stone-800">No organizations found</h3>
          <p className="text-xs text-stone-500">Add a new public department or NGO agency.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrgs.map((org) => {
            const solveRate =
              org.totalAssigned > 0
                ? Math.round((org.totalResolved * 100) / org.totalAssigned)
                : 100;

            return (
              <div
                key={org.id}
                className="bg-white rounded-3xl border-2 border-stone-200 p-6 shadow-sm hover:border-pine-600 transition space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-pine-800 bg-pine-50 px-2 py-0.5 rounded border border-pine-200 block w-fit">
                        {org.code}
                      </span>
                      <h3 className="font-black text-base text-stone-900 mt-1">{org.name}</h3>
                    </div>

                    <span
                      className={`text-[9px] font-black px-2 py-0.5 rounded border uppercase ${
                        org.verified
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : 'bg-amber-100 text-amber-800 border-amber-300'
                      }`}
                    >
                      {org.verified ? '✓ ACCREDITED' : 'PENDING'}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 line-clamp-2">
                    {org.description || 'Public service provider registered for grievance resolution.'}
                  </p>

                  <div className="text-xs text-stone-500 space-y-1">
                    <div>Sector: <strong className="text-stone-900">{org.category}</strong></div>
                    <div>Location: <strong className="text-stone-900">{org.district}, {org.state}</strong></div>
                    {org.headOfDept && <div>Head: <strong className="text-stone-900">{org.headOfDept}</strong></div>}
                  </div>

                  {/* Performance Scorecard Metrics */}
                  <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200 grid grid-cols-3 gap-2 text-center text-xs">
                    <div>
                      <span className="text-[10px] text-stone-500 block">Rating</span>
                      <span className="font-black text-amber-600 flex items-center justify-center space-x-0.5">
                        <Star className="w-3 h-3 fill-amber-500" />
                        <span>{org.avgRating || 5.0}★</span>
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-500 block">Solved</span>
                      <span className="font-black text-emerald-700">
                        {org.totalResolved || 0} / {org.totalAssigned || 0}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-500 block">Solve Rate</span>
                      <span className="font-black text-pine-900">{solveRate}%</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <button
                    onClick={() => handleToggleVerify(org.id)}
                    className="text-xs font-bold text-stone-600 hover:text-stone-900 underline"
                  >
                    {org.verified ? 'Revoke Badge' : 'Accredit'}
                  </button>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleOpenEdit(org)}
                      className="p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg"
                      title="Edit Department"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(org.id)}
                      className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg"
                      title="Delete Record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveSubmit}
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl border-2 border-stone-200 text-stone-900 animate-fadeIn"
          >
            <div className="flex items-center space-x-2 text-pine-900 border-b border-stone-200 pb-3">
              <Building2 className="w-5 h-5 text-pine-700" />
              <h3 className="font-black text-base">
                {editingOrg ? 'Edit Organization / Department' : 'Register New Department / NGO'}
              </h3>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Organization Name*:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. UPPCL Rural Electricity Board"
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Unique Code:</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g. UPPCL_LKO"
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Type:</label>
                <select
                  value={departmentType}
                  onChange={(e) => setDepartmentType(e.target.value)}
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                >
                  <option value="GOVERNMENT_DEPT">Government Dept</option>
                  <option value="ACCREDITED_NGO">Accredited NGO</option>
                  <option value="MUNICIPAL_BODY">Municipal Body</option>
                  <option value="SERVICE_PROVIDER">Private Provider</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Category / Sector:</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                >
                  <option value="ELECTRICITY">Electricity</option>
                  <option value="ROADS_INFRASTRUCTURE">Roads Infrastructure</option>
                  <option value="WATER_SANITATION">Water & Sanitation</option>
                  <option value="AGRICULTURE">Agriculture</option>
                  <option value="HEALTHCARE">Healthcare</option>
                  <option value="NGO_WELFARE">NGO Welfare</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">District:</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  required
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Contact Phone:</label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="0522-228741"
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Contact Email:</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="office@up.gov.in"
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Head of Department / Officer:</label>
              <input
                type="text"
                value={headOfDept}
                onChange={(e) => setHeadOfDept(e.target.value)}
                placeholder="e.g. Er. R.K. Saxena"
                className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-stone-200">
              <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-xs font-bold text-stone-600">Cancel</button>
              <button type="submit" disabled={isSaving} className="px-6 py-2.5 bg-pine-900 text-white text-xs font-bold rounded-xl">Save Organization</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
