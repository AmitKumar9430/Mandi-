import React, { useEffect, useState } from 'react';
import { adminOpsApi } from '../../../shared/api/adminApi';
import { useAdminAuth } from '../../../auth/AdminAuthContext';
import { INDIAN_STATES } from '../../../shared/utils/locationService';
import {
  Users,
  Search,
  Check,
  X,
  Edit,
  Trash2,
  ShieldCheck,
  Loader2,
  Ban,
  RotateCcw,
  UserPlus,
  Crown,
  KeyRound,
  Mail,
  Phone,
  Shield,
  CheckCircle2,
  AlertCircle,
  Lock,
  Sparkles,
  Info
} from 'lucide-react';

export default function AdminUserManagement() {
  const { adminUser } = useAdminAuth();
  const isSuperAdmin = adminUser?.roles?.some(r => r.includes('SUPER_ADMIN')) || adminUser?.email === 'amitkr9523da@gmail.com';

  const [activeTab, setActiveTab] = useState('ADMINS'); // 'ADMINS' vs 'ALL_USERS'

  // Data lists
  const [admins, setAdmins] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Add Admin Modal State
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPhone, setNewAdminPhone] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [newAdminRole, setNewAdminRole] = useState('ROLE_ADMIN');
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);
  const [createAdminError, setCreateAdminError] = useState('');
  const [createAdminSuccess, setCreateAdminSuccess] = useState('');

  // Edit User State
  const [editingUser, setEditingUser] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState('ROLE_CITIZEN');
  const [editState, setEditState] = useState('Uttar Pradesh');
  const [editDistrict, setEditDistrict] = useState('Lucknow');
  const [editVillage, setEditVillage] = useState('');
  const [editVerified, setEditVerified] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [adminRes, userRes] = await Promise.all([
        adminOpsApi.getAdministrators().catch(() => ({ data: [] })),
        adminOpsApi.getUsers().catch(() => ({ data: [] }))
      ]);
      if (adminRes.data) setAdmins(adminRes.data);
      if (userRes.data) setUsers(userRes.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setCreateAdminError('');
    setCreateAdminSuccess('');

    if (!isSuperAdmin) {
      setCreateAdminError('Access Denied: Only a SUPER_ADMIN can add or provision new administrators.');
      return;
    }

    if (!newAdminName.trim() || !newAdminEmail.trim() || !newAdminPhone.trim() || !newAdminPassword.trim()) {
      setCreateAdminError('All fields (Name, Email, Mobile, Password) are required.');
      return;
    }

    setIsCreatingAdmin(true);
    try {
      await adminOpsApi.createAdministrator({
        fullName: newAdminName.trim(),
        email: newAdminEmail.trim(),
        phone: newAdminPhone.trim(),
        password: newAdminPassword,
        role: newAdminRole
      });

      setCreateAdminSuccess(`Administrator "${newAdminName}" created successfully! They can now log in via Email OTP or Password.`);
      setNewAdminName('');
      setNewAdminEmail('');
      setNewAdminPhone('');
      setNewAdminPassword('');
      setNewAdminRole('ROLE_ADMIN');

      await fetchAllData();
      setTimeout(() => {
        setShowAddAdminModal(false);
        setCreateAdminSuccess('');
      }, 1500);
    } catch (err) {
      setCreateAdminError(err.message || 'Failed to create administrator.');
    } finally {
      setIsCreatingAdmin(false);
    }
  };

  const handleDeleteAdmin = async (id, email, name) => {
    if (!isSuperAdmin) {
      alert('Access Denied: Only a SUPER_ADMIN has authority to delete administrator accounts.');
      return;
    }
    if (email === 'amitkr9523da@gmail.com') {
      alert('The primary Super Administrator (amitkr9523da@gmail.com) cannot be deleted.');
      return;
    }
    if (window.confirm(`Revoke administrator access and delete account for "${name}" (${email})?`)) {
      try {
        await adminOpsApi.deleteAdministrator(id);
        fetchAllData();
      } catch (err) {
        alert(err.message || 'Failed to delete administrator');
      }
    }
  };

  const handleToggleVerify = async (id) => {
    try {
      await adminOpsApi.toggleUserVerify(id);
      fetchAllData();
    } catch (err) {
      alert(err.message || 'Failed to toggle verification');
    }
  };

  const handleSuspend = async (id) => {
    if (window.confirm('Suspend this user account?')) {
      await adminOpsApi.suspendUser(id);
      fetchAllData();
    }
  };

  const handleRestore = async (id) => {
    await adminOpsApi.restoreUser(id);
    fetchAllData();
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Permanently delete user "${name}"? This action cannot be undone.`)) {
      await adminOpsApi.deleteUser(id);
      fetchAllData();
    }
  };

  const handleOpenEdit = (u) => {
    setEditingUser(u);
    setEditName(u.fullName || '');
    setEditPhone(u.phone || '');
    setEditEmail(u.email || '');
    setEditRole(u.roles?.[0] || 'ROLE_CITIZEN');
    setEditState(u.state || 'Uttar Pradesh');
    setEditDistrict(u.district || 'Lucknow');
    setEditVillage(u.villageOrTown || '');
    setEditVerified(u.verified || false);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    if (!editingUser) return;
    setIsSaving(true);
    try {
      await adminOpsApi.editUser(editingUser.id, {
        fullName: editName,
        phone: editPhone,
        email: editEmail || undefined,
        roles: [editRole],
        state: editState,
        district: editDistrict,
        villageOrTown: editVillage,
        verified: editVerified
      });
      setEditingUser(null);
      fetchAllData();
    } catch (err) {
      alert(err.message || 'Failed to save user');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredAdmins = admins.filter((a) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      a.fullName?.toLowerCase().includes(s) ||
      a.phone?.toLowerCase().includes(s) ||
      a.email?.toLowerCase().includes(s)
    );
  });

  const filteredUsers = users.filter((u) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      u.fullName?.toLowerCase().includes(s) ||
      u.phone?.toLowerCase().includes(s) ||
      u.email?.toLowerCase().includes(s)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-stone-200 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className={`text-[10px] font-black px-2.5 py-0.5 rounded shadow ${
              isSuperAdmin
                ? 'bg-amber-400 text-stone-950 border border-amber-500'
                : 'bg-emerald-600 text-white border border-emerald-400'
            }`}>
              {isSuperAdmin ? '👑 SUPER ADMIN ROLE ACTIVE' : '🛡️ SYSTEM ADMIN ROLE ACTIVE'}
            </span>
            <span className="text-xs text-stone-500 font-semibold">
              Logged in: <strong className="text-stone-900">{adminUser?.email || adminUser?.phone}</strong>
            </span>
          </div>

          <h1 className="text-2xl font-black text-stone-900 flex items-center space-x-2 mt-1.5">
            <ShieldCheck className="w-6 h-6 text-pine-700" />
            <span>व्यवस्थापक एवं उपयोगकर्ता प्रबंधन (User & Admin Access Control)</span>
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Manage system administrators, executive access credentials, and network citizen accounts.
          </p>
        </div>

        {/* Action Button & Search */}
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          {activeTab === 'ADMINS' && (
            isSuperAdmin ? (
              <button
                onClick={() => {
                  setShowAddAdminModal(true);
                  setCreateAdminError('');
                  setCreateAdminSuccess('');
                }}
                className="bg-gradient-to-r from-emerald-600 to-pine-800 hover:from-emerald-700 hover:to-pine-900 text-white text-xs font-black px-4 py-2.5 rounded-xl flex items-center space-x-1.5 shadow-md transition transform active:scale-98"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Add Administrator</span>
              </button>
            ) : (
              <div
                className="flex items-center space-x-1.5 bg-stone-100 text-stone-600 border border-stone-300 px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs cursor-not-allowed"
                title="Only Super Administrator has permission to add other administrators."
              >
                <Lock className="w-3.5 h-3.5 text-stone-500" />
                <span>Add Admin (Super Admin Only)</span>
              </div>
            )
          )}

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, phone..."
              className="w-full pl-9 pr-4 py-2 bg-white border-2 border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-pine-600 shadow-sm"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-2 border-b border-stone-200">
        <button
          onClick={() => setActiveTab('ADMINS')}
          className={`pb-3 px-4 font-black text-xs border-b-2 flex items-center space-x-2 transition ${
            activeTab === 'ADMINS'
              ? 'border-pine-700 text-pine-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Crown className="w-4 h-4 text-amber-600" />
          <span>व्यवस्थापक टीम ({admins.length} Administrators)</span>
        </button>

        <button
          onClick={() => setActiveTab('ALL_USERS')}
          className={`pb-3 px-4 font-black text-xs border-b-2 flex items-center space-x-2 transition ${
            activeTab === 'ALL_USERS'
              ? 'border-pine-700 text-pine-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Users className="w-4 h-4 text-stone-600" />
          <span>नागरिक एवं किसान डायरेक्टरी ({users.length} Total Users)</span>
        </button>
      </div>

      {/* TAB 1: ADMINISTRATORS MANAGEMENT */}
      {activeTab === 'ADMINS' && (
        <div className="space-y-4">
          <div className={`${
            isSuperAdmin
              ? 'bg-emerald-950 text-white border-emerald-500/40'
              : 'bg-stone-900 text-stone-200 border-stone-700'
          } p-4 rounded-2xl border shadow-sm flex flex-wrap items-center justify-between gap-3`}>
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-xl ${
                isSuperAdmin
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-stone-800 text-stone-300 border-stone-700'
              } flex items-center justify-center border`}>
                <Crown className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h4 className="font-black text-xs text-white">
                  {isSuperAdmin
                    ? '👑 Super Admin Authority Configured'
                    : '🛡️ Administrator Access Control Active'}
                </h4>
                <p className="text-[11px] text-stone-300">
                  {isSuperAdmin ? (
                    <>
                      Primary Super Administrator: <strong className="font-mono text-amber-300">amitkr9523da@gmail.com</strong> (You have exclusive authority to provision new administrators)
                    </>
                  ) : (
                    <>
                      Logged in as: <strong className="font-mono text-emerald-300">{adminUser?.email || adminUser?.phone}</strong> (Policy: Only SUPER_ADMIN can add or delete administrators)
                    </>
                  )}
                </p>
              </div>
            </div>

            <span className={`text-[10px] ${
              isSuperAdmin
                ? 'bg-emerald-800/80 text-emerald-200 border-emerald-400/30'
                : 'bg-amber-950/80 text-amber-300 border-amber-500/40'
            } px-3 py-1 rounded-full font-bold border flex items-center space-x-1`}>
              {isSuperAdmin ? (
                <>
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  <span>Admin Provisioning: UNLOCKED FOR SUPER ADMIN</span>
                </>
              ) : (
                <>
                  <Lock className="w-3 h-3 text-amber-400" />
                  <span>Admin Provisioning: RESTRICTED TO SUPER ADMIN</span>
                </>
              )}
            </span>
          </div>

          {loading ? (
            <div className="py-20 text-center space-y-2">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-pine-700" />
              <p className="text-xs text-stone-500">Loading administrator directory...</p>
            </div>
          ) : (
            <div className="bg-white border-2 border-stone-200 rounded-3xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-100 text-stone-700 font-black uppercase border-b border-stone-200">
                    <tr>
                      <th className="p-4">Administrator Name & Email</th>
                      <th className="p-4">Mobile / Contact</th>
                      <th className="p-4">Assigned Roles</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-medium">
                    {filteredAdmins.map((a) => {
                      const isSuper = a.email === 'amitkr9523da@gmail.com' || a.roles?.some(r => r.includes('SUPER_ADMIN'));
                      return (
                        <tr key={a.id} className={`transition ${isSuper ? 'bg-amber-50/40 hover:bg-amber-50/70' : 'hover:bg-pine-50/40'}`}>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              {isSuper ? (
                                <Crown className="w-4 h-4 text-amber-500 flex-shrink-0" />
                              ) : (
                                <Shield className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                              )}
                              <div>
                                <span className="font-black text-stone-900 block text-xs">
                                  {a.fullName} {isSuper && <span className="text-[10px] text-amber-700 font-black">(SUPER ADMIN)</span>}
                                </span>
                                <span className="text-stone-500 text-[11px] font-mono flex items-center space-x-1">
                                  <Mail className="w-3 h-3 text-stone-400" />
                                  <span>{a.email}</span>
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 font-mono text-stone-700">
                            {a.phone}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-1 flex-wrap gap-1">
                              {a.roles?.map((r, i) => (
                                <span
                                  key={i}
                                  className={`text-[10px] font-black px-2 py-0.5 rounded border ${
                                    r.includes('SUPER_ADMIN')
                                      ? 'bg-amber-100 text-amber-900 border-amber-300'
                                      : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                  }`}
                                >
                                  {r.replace('ROLE_', '')}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-300">
                              ACTIVE & VERIFIED
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            {isSuper ? (
                              <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-300">
                                👑 Root Account
                              </span>
                            ) : isSuperAdmin ? (
                              <button
                                onClick={() => handleDeleteAdmin(a.id, a.email, a.fullName)}
                                className="p-1.5 bg-stone-100 hover:bg-red-100 text-red-600 rounded-lg border border-stone-200 transition"
                                title="Remove Administrator"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-stone-500 bg-stone-100 px-2 py-1 rounded border border-stone-200" title="Only Super Admin can delete admin accounts">
                                <Lock className="w-3 h-3" />
                                <span>Protected</span>
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CITIZEN DIRECTORY */}
      {activeTab === 'ALL_USERS' && (
        <div className="space-y-4">
          {loading ? (
            <div className="py-20 text-center space-y-2">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-pine-700" />
              <p className="text-xs text-stone-500">Loading user records...</p>
            </div>
          ) : (
            <div className="bg-white border-2 border-stone-200 rounded-3xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-100 text-stone-700 font-black uppercase border-b border-stone-200">
                    <tr>
                      <th className="p-4">Name & Contact</th>
                      <th className="p-4">Assigned Roles</th>
                      <th className="p-4">Location</th>
                      <th className="p-4">Status & Badge</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-medium">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-pine-50/40 transition">
                        <td className="p-4">
                          <span className="font-bold text-stone-900 block">{u.fullName || 'Citizen User'}</span>
                          <span className="text-stone-500 text-[11px] block">{u.phone} • {u.email || 'No email'}</span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-1 flex-wrap gap-1">
                            {u.roles?.map((r, i) => (
                              <span key={i} className="text-[10px] font-bold bg-stone-100 text-stone-800 border border-stone-200 px-2 py-0.5 rounded">
                                {r.replace('ROLE_', '')}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-4 text-stone-600">
                          {u.villageOrTown || u.district || 'Lucknow'}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleToggleVerify(u.id)}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center space-x-1 border ${
                                u.verified
                                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                  : 'bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200'
                              }`}
                            >
                              <Check className="w-3 h-3" />
                              <span>{u.verified ? 'VERIFIED' : 'UNVERIFIED'}</span>
                            </button>
                            {!u.enabled && (
                              <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded border border-red-300">
                                SUSPENDED
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-right space-x-2 whitespace-nowrap">
                          <button
                            onClick={() => handleOpenEdit(u)}
                            className="p-1.5 bg-stone-100 hover:bg-pine-100 text-pine-800 rounded-lg border border-stone-200"
                            title="Edit User"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          {u.enabled ? (
                            <button
                              onClick={() => handleSuspend(u.id)}
                              className="p-1.5 bg-stone-100 hover:bg-red-50 text-red-600 rounded-lg border border-stone-200"
                              title="Suspend Account"
                            >
                              <Ban className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleRestore(u.id)}
                              className="p-1.5 bg-stone-100 hover:bg-emerald-50 text-emerald-700 rounded-lg border border-stone-200"
                              title="Restore Account"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(u.id, u.fullName || u.phone)}
                            className="p-1.5 bg-stone-100 hover:bg-red-100 text-red-600 rounded-lg border border-stone-200"
                            title="Delete User Permanently"
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
      )}

      {/* MODAL 1: ADD NEW ADMINISTRATOR (SUPER ADMIN EXCLUSIVE) */}
      {showAddAdminModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border-2 border-stone-200 text-xs animate-fadeIn">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center space-x-2">
                <Crown className="w-4 h-4 text-emerald-600" />
                <span className="font-black text-stone-900 text-sm">Add New Administrator (Super Admin)</span>
              </div>
              <button
                onClick={() => setShowAddAdminModal(false)}
                className="text-stone-400 hover:text-stone-900 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {createAdminError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center space-x-2 font-semibold">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{createAdminError}</span>
              </div>
            )}

            {createAdminSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl flex items-center space-x-2 font-semibold">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{createAdminSuccess}</span>
              </div>
            )}

            <form onSubmit={handleCreateAdmin} className="space-y-3">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Full Name:</label>
                <input
                  type="text"
                  value={newAdminName}
                  onChange={(e) => setNewAdminName(e.target.value)}
                  placeholder="e.g. Rajesh Sharma"
                  required
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-bold focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Administrator Email (Required for OTP):</label>
                <input
                  type="email"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  placeholder="e.g. rajesh.admin@mandi.org"
                  required
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-semibold focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
                <p className="text-[10px] text-stone-500 mt-0.5">EmailJS will dispatch login verification codes to this address.</p>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Mobile Number (10 digits):</label>
                <input
                  type="tel"
                  value={newAdminPhone}
                  onChange={(e) => setNewAdminPhone(e.target.value)}
                  placeholder="e.g. 9876543218"
                  required
                  maxLength={10}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-semibold focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Account Password (For Password Login):</label>
                <input
                  type="password"
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                  placeholder="Create secure password (min 6 characters)"
                  required
                  minLength={6}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-semibold focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Assigned Executive Role:</label>
                <select
                  value={newAdminRole}
                  onChange={(e) => setNewAdminRole(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-bold"
                >
                  <option value="ROLE_ADMIN">ROLE_ADMIN (Standard Administrator)</option>
                  <option value="ROLE_SUPER_ADMIN">ROLE_SUPER_ADMIN (Super Administrator)</option>
                  <option value="ROLE_MODERATOR">ROLE_MODERATOR (Content Moderator)</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowAddAdminModal(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingAdmin}
                  className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-pine-800 hover:from-emerald-700 hover:to-pine-900 text-white font-black rounded-xl shadow-md border border-emerald-400 flex items-center space-x-1.5"
                >
                  {isCreatingAdmin ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <span>Create Administrator</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT USER */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border-2 border-stone-200 text-xs animate-fadeIn">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <span className="font-black text-stone-900 text-sm">Edit User: {editingUser.phone}</span>
              <button onClick={() => setEditingUser(null)} className="text-stone-400 hover:text-stone-900">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-3">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Full Name:</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-bold focus:ring-2 focus:ring-pine-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Phone Number:</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  required
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-bold focus:ring-2 focus:ring-pine-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Email:</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900"
                />
              </div>

              {/* Geographic / Location Fields */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">State:</label>
                  <select
                    value={editState}
                    onChange={(e) => setEditState(e.target.value)}
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-bold"
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">District:</label>
                  <input
                    type="text"
                    value={editDistrict}
                    onChange={(e) => setEditDistrict(e.target.value)}
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Village / Locality:</label>
                <input
                  type="text"
                  value={editVillage}
                  onChange={(e) => setEditVillage(e.target.value)}
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Assigned Role:</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-bold"
                >
                  <option value="ROLE_CITIZEN">ROLE_CITIZEN (Citizen / Resident)</option>
                  <option value="ROLE_FARMER">ROLE_FARMER (Farmer / Agricultural Desk)</option>
                  <option value="ROLE_SERVICE_PROVIDER">ROLE_SERVICE_PROVIDER (Equipment & Transport)</option>
                  <option value="ROLE_MANDI_MITRA">ROLE_MANDI_MITRA (Field Coordinator)</option>
                  <option value="ROLE_WORKER">ROLE_WORKER (Skilled Artisan / Laborer)</option>
                  <option value="ROLE_VOLUNTEER">ROLE_VOLUNTEER (MANDI Seva)</option>
                  <option value="ROLE_NGO">ROLE_NGO (Non-Profit)</option>
                  {isSuperAdmin && (
                    <>
                      <option value="ROLE_ADMIN">🛡️ ROLE_ADMIN (Standard Administrator)</option>
                      <option value="ROLE_SUPER_ADMIN">👑 ROLE_SUPER_ADMIN (Super Administrator)</option>
                      <option value="ROLE_MODERATOR">⚖️ ROLE_MODERATOR (Content Moderator)</option>
                    </>
                  )}
                </select>
                {!isSuperAdmin && (
                  <p className="text-[10px] text-amber-700 mt-1 flex items-center space-x-1 font-semibold">
                    <Lock className="w-3 h-3 flex-shrink-0" />
                    <span>Administrative role assignments require Super Admin privileges.</span>
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="vCheck"
                  checked={editVerified}
                  onChange={(e) => setEditVerified(e.target.checked)}
                  className="rounded text-pine-700 focus:ring-pine-600"
                />
                <label htmlFor="vCheck" className="text-stone-700 font-bold">
                  Grant Official Verified Citizen Badge
                </label>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-pine-700 hover:bg-pine-800 text-white font-black rounded-xl shadow border border-emerald-500"
                >
                  {isSaving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
