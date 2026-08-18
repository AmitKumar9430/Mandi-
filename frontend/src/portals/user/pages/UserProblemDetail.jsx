import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { userProblemApi } from '../../../shared/api/userApi';
import { useUserAuth } from '../../../auth/UserAuthContext';
import { useLanguage } from '../../../context/LanguageContext';
import ImageModalViewer from '../../../components/ImageModalViewer';
import {
  Clock,
  MapPin,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowRight,
  ShieldCheck,
  Star,
  Maximize2,
  MessageSquare,
  FileText,
  User as UserIcon,
  Phone,
  Calendar,
  Share2,
  RefreshCw,
  XCircle,
  ThumbsUp,
  Send,
  Loader2,
  AlertCircle,
  Camera
} from 'lucide-react';

const WORKFLOW_STEPS = [
  { key: 'NEW', label: '1. Registered (दर्ज)', sub: 'Logged on ledger' },
  { key: 'ASSIGNED', label: '2. Assigned (आवंटित)', sub: 'Dept assigned' },
  { key: 'ACCEPTED', label: '3. Accepted (स्वीकृत)', sub: 'Team scheduled' },
  { key: 'IN_PROGRESS', label: '4. In Progress (प्रगति पर)', sub: 'Field work active' },
  { key: 'RESOLVED', label: '5. Resolved (हल हुआ)', sub: 'Work marked done' },
  { key: 'VERIFICATION_PENDING', label: '6. Verify (सत्यापन)', sub: 'Citizen check' },
  { key: 'CLOSED', label: '7. Closed (सफलतापूर्वक बंद)', sub: 'Rated & archived' }
];

export default function UserProblemDetail() {
  const { id } = useParams();
  const { user } = useUserAuth();
  const { lang, t } = useLanguage();
  const navigate = useNavigate();

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Lightbox Image
  const [lightboxImg, setLightboxImg] = useState('');
  const [lightboxTitle, setLightboxTitle] = useState('');

  // Modals & Action States
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [isConfirmingResolve, setIsConfirmingResolve] = useState(true); // true = 5-star rate & close, false = reject & reopen
  const [reopenReason, setReopenReason] = useState('');
  const [reopenProofUrl, setReopenProofUrl] = useState('');

  // Feedback State
  const [rating, setRating] = useState(5);
  const [feedbackComments, setFeedbackComments] = useState('');
  const [selectedTags, setSelectedTags] = useState(['FAST_RESOLUTION', 'COMPLETELY_SOLVED']);

  // Resolver Work Form Modal
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [progressRemarks, setProgressRemarks] = useState('');
  const [progressPercent, setProgressPercent] = useState(50);
  const [progressPhotoUrl, setProgressPhotoUrl] = useState('');

  const [showMarkCompletedModal, setShowMarkCompletedModal] = useState(false);
  const [resolutionDesc, setResolutionDesc] = useState('');
  const [actionTaken, setActionTaken] = useState('');
  const [resolutionProofUrl, setResolutionProofUrl] = useState('');
  const [resolverRemarks, setResolverRemarks] = useState('');

  // Citizen Timeline Comment
  const [newComment, setNewComment] = useState('');

  const fetchProblem = async () => {
    setLoading(true);
    try {
      const res = await userProblemApi.getById(id);
      if (res?.data) {
        setProblem(res.data);
      }
    } catch (err) {
      setError(err.message || 'Problem not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblem();
  }, [id]);

  const isOwner = user && problem && (user.id === problem.userId || user.phone === problem.contactPhone);
  const isResolverOrAdmin = user && (user.roles?.includes('ROLE_ADMIN') || user.roles?.includes('ROLE_SUPER_ADMIN') || user.id === problem?.assignedResolverId);

  const getStepIndex = (status) => {
    switch (status) {
      case 'NEW':
      case 'SUBMITTED':
      case 'UNDER_REVIEW':
        return 0;
      case 'ASSIGNED':
      case 'RESOURCE_ASSIGNED':
        return 1;
      case 'ACCEPTED':
        return 2;
      case 'IN_PROGRESS':
      case 'SOLUTION_FOUND':
      case 'COMMUNITY_ORGANIZED':
        return 3;
      case 'RESOLVED':
        return 4;
      case 'VERIFICATION_PENDING':
        return 5;
      case 'COMPLETED':
      case 'CLOSED':
        return 6;
      case 'REOPENED':
        return 3; // Put back to active
      default:
        return 0;
    }
  };

  // Workflow Handlers
  const handleAccept = async () => {
    setActionLoading(true);
    try {
      await userProblemApi.accept(id, { remarks: 'Accepted by field officer' });
      fetchProblem();
    } catch (err) {
      alert(err.message || 'Failed to accept');
    } finally {
      setActionLoading(false);
    }
  };

  const handleStartWork = async () => {
    setActionLoading(true);
    try {
      await userProblemApi.startWork(id, { remarks: 'Field crew deployed on location' });
      fetchProblem();
    } catch (err) {
      alert(err.message || 'Failed to start work');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddProgress = async (e) => {
    e.preventDefault();
    if (!progressRemarks.trim()) return;
    setActionLoading(true);
    try {
      await userProblemApi.addProgress(id, {
        progressRemarks,
        progressPercent: Number(progressPercent),
        proofPhotoUrl: progressPhotoUrl || undefined
      });
      setShowProgressModal(false);
      setProgressRemarks('');
      setProgressPhotoUrl('');
      fetchProblem();
    } catch (err) {
      alert(err.message || 'Failed to update progress');
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkCompleted = async (e) => {
    e.preventDefault();
    if (!resolutionDesc.trim()) return;
    setActionLoading(true);
    try {
      await userProblemApi.markCompleted(id, {
        resolutionDescription: resolutionDesc,
        actionTaken: actionTaken || 'Repaired and verified on ground',
        resolutionProofUrl: resolutionProofUrl || undefined,
        resolverRemarks: resolverRemarks || undefined
      });
      setShowMarkCompletedModal(false);
      fetchProblem();
    } catch (err) {
      alert(err.message || 'Failed to mark completed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleVerifySubmit = async () => {
    setActionLoading(true);
    try {
      if (isConfirmingResolve) {
        // Step 1: Verify True
        await userProblemApi.verify(id, {
          verified: true
        });
        // Step 2: Rate & Close
        await userProblemApi.feedback(id, {
          rating,
          feedbackComments,
          feedbackTags: selectedTags.join(',')
        });
      } else {
        // Reject & Reopen
        if (!reopenReason.trim()) {
          alert('Please explain what is still not resolved.');
          setActionLoading(false);
          return;
        }
        await userProblemApi.verify(id, {
          verified: false,
          rejectionReason: reopenReason,
          reopenProofUrl: reopenProofUrl || undefined
        });
      }
      setShowVerifyModal(false);
      fetchProblem();
    } catch (err) {
      alert(err.message || 'Failed to submit verification');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      await userProblemApi.addComment(id, { comment: newComment });
      setNewComment('');
      fetchProblem();
    } catch (err) {
      alert(err.message || 'Failed to post comment');
    }
  };

  const getSlaBadge = (status, slaStatus, isOverdue) => {
    if (status === 'CLOSED' || status === 'COMPLETED') {
      return (
        <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-3 py-1 rounded-full border border-emerald-300 flex items-center space-x-1">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Resolved within SLA</span>
        </span>
      );
    }
    if (isOverdue || slaStatus === 'OVERDUE') {
      return (
        <span className="bg-red-100 text-red-800 text-xs font-black px-3 py-1 rounded-full border border-red-300 flex items-center space-x-1 animate-pulse">
          <Flame className="w-3.5 h-3.5 text-red-600" />
          <span>SLA OVERDUE (Admin Escalation Dispatched)</span>
        </span>
      );
    }
    return (
      <span className="bg-amber-100 text-amber-800 text-xs font-black px-3 py-1 rounded-full border border-amber-300 flex items-center space-x-1">
        <Clock className="w-3.5 h-3.5" />
        <span>SLA Active: On Schedule</span>
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-pine-700 animate-spin" />
        <p className="text-xs font-bold text-stone-500">Loading complaint details & lifecycle timeline...</p>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-white rounded-3xl border-2 border-red-200 text-center space-y-4 shadow-sm">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-lg font-black text-stone-900">Complaint Not Found</h2>
        <p className="text-xs text-stone-600">{error || 'The requested ticket does not exist or has been removed.'}</p>
        <Link
          to="/user/problems"
          className="inline-block px-5 py-2.5 bg-stone-800 text-white text-xs font-bold rounded-xl"
        >
          ← Return to Problems
        </Link>
      </div>
    );
  }

  const currentStepIdx = getStepIndex(problem.status);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Lightbox Modal */}
      <ImageModalViewer
        src={lightboxImg}
        isOpen={Boolean(lightboxImg)}
        title={lightboxTitle}
        onClose={() => setLightboxImg('')}
      />

      {/* Top Banner with Unique Passport Code */}
      <div className="bg-gradient-to-r from-stone-950 via-pine-950 to-stone-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border-2 border-pine-700/50 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider font-mono">
              PUBLIC COMPLAINT PASSPORT
            </span>
            <span className="font-mono font-black text-sm text-stone-300">
              #{problem.passportCode || `MANDI-2026-${problem.id}`}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className={`text-xs font-black px-3 py-1 rounded-full border ${
              problem.status === 'CLOSED'
                ? 'bg-emerald-500 text-stone-950 border-emerald-400'
                : problem.status === 'VERIFICATION_PENDING'
                ? 'bg-amber-400 text-stone-950 border-amber-300 animate-pulse'
                : problem.status === 'REOPENED'
                ? 'bg-red-500 text-white border-red-400'
                : 'bg-pine-700 text-white border-pine-500'
            }`}>
              {problem.status}
            </span>

            {problem.urgency && (
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                problem.urgency === 'CRITICAL'
                  ? 'bg-red-950 text-red-300 border-red-500/50'
                  : 'bg-stone-800 text-stone-300 border-stone-700'
              }`}>
                {problem.urgency}
              </span>
            )}
          </div>
        </div>

        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white leading-tight">
            {problem.title}
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 mt-1 leading-relaxed">
            {problem.rawDescription}
          </p>
        </div>

        <div className="pt-3 border-t border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-400">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>{problem.villageOrTown || 'Village'}, {problem.district} ({problem.state})</span>
            </span>
            <span>Category: <strong className="text-white">{problem.category}</strong></span>
          </div>

          <div>{getSlaBadge(problem.status, problem.slaStatus, problem.isOverdue)}</div>
        </div>
      </div>

      {/* Interactive Visual Lifecycle Stepper */}
      <div className="bg-white p-6 rounded-3xl border-2 border-stone-200 shadow-sm space-y-4">
        <h2 className="font-black text-stone-900 text-sm flex items-center justify-between">
          <span>शिकायत समाधान चक्र (Lifecycle Resolution Track)</span>
          <span className="text-[11px] font-mono text-stone-500">Step {currentStepIdx + 1} of 7</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-7 gap-2">
          {WORKFLOW_STEPS.map((step, idx) => {
            const isCompleted = idx < currentStepIdx || (idx === 6 && (problem.status === 'CLOSED' || problem.status === 'COMPLETED'));
            const isCurrent = idx === currentStepIdx && problem.status !== 'CLOSED';
            return (
              <div
                key={step.key}
                className={`p-3 rounded-2xl border-2 transition text-left space-y-1 ${
                  isCompleted
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950'
                    : isCurrent
                    ? 'border-pine-700 bg-pine-50 text-pine-950 ring-2 ring-pine-500 shadow-sm'
                    : 'border-stone-200 bg-stone-50 text-stone-400 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-black">
                    {isCompleted ? '✓ DONE' : isCurrent ? '● ACTIVE' : `0${idx + 1}`}
                  </span>
                </div>
                <h4 className="font-black text-xs leading-tight">{step.label}</h4>
                <p className="text-[10px] opacity-75">{step.sub}</p>
              </div>
            );
          })}
        </div>

        {/* Special Reopen / Escalation Notices */}
        {problem.status === 'REOPENED' && (
          <div className="p-4 bg-red-50 border-2 border-red-300 rounded-2xl text-xs space-y-1 text-red-900 animate-fadeIn">
            <div className="flex items-center space-x-1.5 font-black">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span>शिकायत दोबारा खोली गई (Complaint Reopened by Citizen)</span>
            </div>
            <p className="text-stone-800">
              <strong>Citizen's Reason:</strong> "{problem.reopenReason || 'Problem was not properly solved on ground.'}"
            </p>
          </div>
        )}

        {problem.isEscalated && (
          <div className="p-4 bg-orange-50 border-2 border-orange-300 rounded-2xl text-xs space-y-1 text-orange-950">
            <div className="flex items-center space-x-1.5 font-black">
              <Flame className="w-4 h-4 text-orange-600" />
              <span>प्रशासनिक प्राथमिकता वृद्धि (Executive Escalation)</span>
            </div>
            <p className="text-stone-800">
              Escalated by {problem.escalatedBy || 'Admin'}: "{problem.escalationReason || 'Resolution deadline exceeded.'}"
            </p>
          </div>
        )}
      </div>

      {/* CITIZEN VERIFICATION ACTION BANNER (Shown when status is VERIFICATION_PENDING) */}
      {problem.status === 'VERIFICATION_PENDING' && (
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-6 sm:p-8 rounded-3xl text-stone-950 shadow-xl border-2 border-amber-300 space-y-4 animate-fadeIn">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="bg-stone-950 text-amber-300 text-[10px] font-black px-2.5 py-0.5 rounded uppercase">
                CITIZEN ACTION REQUIRED
              </span>
              <h3 className="text-lg sm:text-xl font-black text-stone-950">
                कार्य पूरा घोषित किया गया है — क्या आपकी समस्या वास्तव में हल हुई?
              </h3>
              <p className="text-xs text-stone-900 max-w-2xl font-medium">
                The assigned department has completed field resolution. Please inspect the location and verify if the issue is solved.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => {
                setIsConfirmingResolve(true);
                setShowVerifyModal(true);
              }}
              id="citizen-verify-success-btn"
              className="px-6 py-3 bg-stone-950 hover:bg-black text-white font-black text-xs rounded-2xl shadow-lg flex items-center space-x-2 transition transform active:scale-98"
            >
              <ThumbsUp className="w-4 h-4 text-emerald-400" />
              <span>हाँ, समस्या हल हो गई (Verify & Rate 5★)</span>
            </button>

            <button
              onClick={() => {
                setIsConfirmingResolve(false);
                setShowVerifyModal(true);
              }}
              id="citizen-reopen-complaint-btn"
              className="px-6 py-3 bg-white/90 hover:bg-white text-red-700 font-black text-xs rounded-2xl shadow border border-red-300 flex items-center space-x-2 transition transform active:scale-98"
            >
              <XCircle className="w-4 h-4 text-red-600" />
              <span>नहीं, अभी भी समस्या है (Reopen Ticket)</span>
            </button>
          </div>
        </div>
      )}

      {/* RESOLVER / ADMIN ACTION BAR */}
      {isResolverOrAdmin && (
        <div className="bg-stone-900 text-white p-6 rounded-3xl border-2 border-pine-600 shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="font-black text-sm text-white">विभाग व समाधानकर्ता कार्य (Resolver Actions)</h3>
            </div>
            <span className="text-[10px] text-stone-400 font-mono">Current Status: {problem.status}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            {problem.status === 'ASSIGNED' && (
              <button
                onClick={handleAccept}
                disabled={actionLoading}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl flex items-center space-x-1.5 transition"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Accept Assignment</span>
              </button>
            )}

            {(problem.status === 'ACCEPTED' || problem.status === 'ASSIGNED') && (
              <button
                onClick={handleStartWork}
                disabled={actionLoading}
                className="px-4 py-2.5 bg-pine-600 hover:bg-pine-700 text-white font-black text-xs rounded-xl flex items-center space-x-1.5 transition"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Start Field Work</span>
              </button>
            )}

            {(problem.status === 'IN_PROGRESS' || problem.status === 'REOPENED') && (
              <>
                <button
                  onClick={() => setShowProgressModal(true)}
                  className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs rounded-xl border border-stone-600 flex items-center space-x-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                  <span>Post Progress Report</span>
                </button>

                <button
                  onClick={() => setShowMarkCompletedModal(true)}
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-pine-700 hover:from-emerald-700 text-white font-black text-xs rounded-xl border border-emerald-400 flex items-center space-x-1.5 shadow"
                >
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>Mark Work Completed & Request Verification</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Main Grid: Details + Resolution Card + Org Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Details, Evidence, Resolution Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Photos & Evidence */}
          <div className="bg-white p-6 rounded-3xl border-2 border-stone-200 shadow-sm space-y-3">
            <h3 className="font-black text-stone-900 text-sm flex items-center space-x-2">
              <Camera className="w-4 h-4 text-pine-700" />
              <span>समस्या साक्ष्य व फोटो (Attached Evidence)</span>
            </h3>

            {problem.photoUrl ? (
              <div className="relative group rounded-2xl overflow-hidden border border-stone-200 max-h-72 bg-stone-100">
                <img
                  src={problem.photoUrl}
                  alt="Problem Evidence"
                  className="w-full h-auto object-cover max-h-72 cursor-pointer transition group-hover:scale-102"
                  onClick={() => {
                    setLightboxImg(problem.photoUrl);
                    setLightboxTitle(problem.title);
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    setLightboxImg(problem.photoUrl);
                    setLightboxTitle(problem.title);
                  }}
                  className="absolute bottom-3 right-3 bg-stone-900/80 hover:bg-stone-900 text-white p-2 rounded-xl text-xs font-bold flex items-center space-x-1 backdrop-blur-xs"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Zoom / Inspect</span>
                </button>
              </div>
            ) : (
              <div className="p-6 bg-stone-50 rounded-2xl border border-dashed border-stone-200 text-center text-xs text-stone-500">
                No initial photo uploaded with this ticket.
              </div>
            )}
          </div>

          {/* Resolution Summary (If completed/resolved) */}
          {problem.resolutionDescription && (
            <div className="bg-emerald-50/70 p-6 rounded-3xl border-2 border-emerald-300 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-emerald-950 text-sm flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>विभागीय समाधान रिपोर्ट (Field Resolution Summary)</span>
                </h3>
                {problem.resolvedAt && (
                  <span className="text-[10px] font-mono text-emerald-800">
                    {new Date(problem.resolvedAt).toLocaleString()}
                  </span>
                )}
              </div>

              <p className="text-xs text-stone-800 leading-relaxed font-medium">
                {problem.resolutionDescription}
              </p>

              {problem.actionTaken && (
                <div className="text-xs text-stone-700">
                  <strong>Action Taken:</strong> {problem.actionTaken}
                </div>
              )}

              {problem.resolutionProofUrl && (
                <div className="pt-2">
                  <span className="text-[11px] font-bold text-stone-700 block mb-1">समाधान प्रमाण फोटो (Resolution Proof):</span>
                  <img
                    src={problem.resolutionProofUrl}
                    alt="Resolution Proof"
                    className="w-40 h-28 object-cover rounded-xl border border-emerald-300 cursor-pointer shadow-xs"
                    onClick={() => {
                      setLightboxImg(problem.resolutionProofUrl);
                      setLightboxTitle('Resolution Proof Inspection');
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Citizen Feedback (If closed) */}
          {problem.feedbackRating && (
            <div className="bg-amber-50/70 p-6 rounded-3xl border-2 border-amber-300 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-amber-950 text-sm flex items-center space-x-1.5">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>नागरिक रेटिंग व समीक्षा (Citizen Rating & Review)</span>
                </h3>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < problem.feedbackRating
                          ? 'text-amber-500 fill-amber-500'
                          : 'text-stone-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {problem.feedbackComments && (
                <p className="text-xs text-stone-800 italic">"{problem.feedbackComments}"</p>
              )}

              {problem.feedbackTags && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {problem.feedbackTags.split(',').map((tag, i) => (
                    <span key={i} className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md border border-amber-300">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Chronological Audit Trail & Timeline */}
          <div className="bg-white p-6 rounded-3xl border-2 border-stone-200 shadow-sm space-y-4">
            <h3 className="font-black text-stone-900 text-sm flex items-center justify-between">
              <span>समयरेखा व प्रगति लॉग (Chronological Timeline & Logs)</span>
              <span className="text-[11px] text-stone-500 font-mono">{problem.events?.length || 0} events</span>
            </h3>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
              {problem.events?.map((ev) => (
                <div key={ev.id} className="relative space-y-1 text-xs">
                  <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-pine-600 border-2 border-white shadow-xs" />
                  <div className="flex items-center justify-between text-stone-500 text-[10px]">
                    <span className="font-black text-pine-800 bg-pine-50 px-2 py-0.5 rounded border border-pine-200 font-mono">
                      {ev.eventType}
                    </span>
                    <span className="font-mono">{new Date(ev.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-stone-900 font-semibold">{ev.description}</p>
                  {ev.actorName && (
                    <span className="text-[10px] text-stone-500 block">By: {ev.actorName}</span>
                  )}
                  {ev.metadata && ev.metadata.startsWith('data:image') && (
                    <img
                      src={ev.metadata}
                      alt="Event Attachment"
                      className="w-24 h-20 object-cover rounded-lg border border-stone-200 mt-1 cursor-pointer"
                      onClick={() => {
                        setLightboxImg(ev.metadata);
                        setLightboxTitle('Timeline Attachment');
                      }}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Add Citizen Comment Box */}
            <form onSubmit={handleAddComment} className="pt-4 border-t border-stone-100 flex items-center space-x-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add remark or follow-up note..."
                className="flex-1 p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-pine-600"
              />
              <button
                type="submit"
                className="p-2.5 bg-pine-800 hover:bg-pine-900 text-white rounded-xl text-xs font-bold flex items-center space-x-1"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Col: Assigned Dept & Citizen Contact Cards */}
        <div className="space-y-6">
          {/* Responsible Department Card */}
          <div className="bg-white p-6 rounded-3xl border-2 border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 text-pine-900">
              <Building2 className="w-5 h-5 text-pine-700" />
              <h3 className="font-black text-sm">जिम्मेदार विभाग (Assigned Dept)</h3>
            </div>

            {problem.assignedOrganizationName ? (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-pine-50 rounded-2xl border border-pine-200">
                  <h4 className="font-black text-pine-950 text-sm">{problem.assignedOrganizationName}</h4>
                  {problem.assignedOrganizationCode && (
                    <span className="font-mono text-[10px] text-pine-700 block mt-0.5">{problem.assignedOrganizationCode}</span>
                  )}
                </div>

                {problem.assignedOrganizationPhone && (
                  <div className="flex items-center justify-between text-stone-700">
                    <span className="flex items-center space-x-1">
                      <Phone className="w-3.5 h-3.5 text-stone-500" />
                      <span>Helpline:</span>
                    </span>
                    <strong className="text-stone-900 font-mono">{problem.assignedOrganizationPhone}</strong>
                  </div>
                )}

                {problem.assignedResolverName && (
                  <div className="flex items-center justify-between text-stone-700">
                    <span className="flex items-center space-x-1">
                      <UserIcon className="w-3.5 h-3.5 text-stone-500" />
                      <span>Lead Resolver:</span>
                    </span>
                    <strong className="text-stone-900">{problem.assignedResolverName}</strong>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1">
                <strong>Awaiting Department Assignment</strong>
                <p className="text-[11px] text-stone-600">Admin dispatch team is triaging this complaint.</p>
              </div>
            )}
          </div>

          {/* Citizen Contact Card */}
          <div className="bg-white p-6 rounded-3xl border-2 border-stone-200 shadow-sm space-y-3 text-xs">
            <h3 className="font-black text-stone-900 text-sm flex items-center space-x-2">
              <UserIcon className="w-4 h-4 text-pine-700" />
              <span>नागरिक विवरण (Citizen Details)</span>
            </h3>

            <div className="space-y-2 text-stone-700">
              <div className="flex justify-between">
                <span>Name:</span>
                <strong className="text-stone-900">{problem.contactName || problem.userName || 'Citizen'}</strong>
              </div>
              <div className="flex justify-between">
                <span>Phone:</span>
                <strong className="text-stone-900 font-mono">{problem.contactPhone || problem.userPhone || '—'}</strong>
              </div>
              <div className="flex justify-between">
                <span>Logged On:</span>
                <strong className="text-stone-900 font-mono">
                  {new Date(problem.createdAt).toLocaleDateString()}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* VERIFY / RATE / REOPEN MODAL */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border-2 border-stone-200 text-stone-900 animate-fadeIn">
            {isConfirmingResolve ? (
              // 5-Star Rating & Confirmation
              <div className="space-y-4">
                <div className="text-center space-y-1">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-black text-stone-900">
                    समस्या समाधान सत्यापन व रेटिंग (Citizen Verification)
                  </h3>
                  <p className="text-xs text-stone-500">
                    How satisfied are you with the resolution quality and speed?
                  </p>
                </div>

                {/* Star Rating */}
                <div className="flex items-center justify-center space-x-2 py-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1.5 focus:outline-none transform hover:scale-120 transition"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-stone-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>

                {/* Feedback Tags */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700 block">Select Experience Highlights:</label>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { id: 'FAST_RESOLUTION', label: '⚡ Fast Resolution' },
                      { id: 'COMPLETELY_SOLVED', label: '✅ Completely Solved' },
                      { id: 'POLITE_STAFF', label: '🤝 Helpful Staff' },
                      { id: 'CLEAN_WORK', label: '🧹 Clean Field Work' },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          setSelectedTags((prev) =>
                            prev.includes(t.id) ? prev.filter((x) => x !== t.id) : [...prev, t.id]
                          );
                        }}
                        className={`text-xs px-3 py-1.5 rounded-xl border font-bold transition ${
                          selectedTags.includes(t.id)
                            ? 'bg-pine-800 text-white border-pine-800'
                            : 'bg-stone-100 text-stone-700 border-stone-300'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comments */}
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Feedback Comments (Optional):</label>
                  <textarea
                    rows={3}
                    value={feedbackComments}
                    onChange={(e) => setFeedbackComments(e.target.value)}
                    placeholder="Share any additional words of appreciation..."
                    className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900"
                  />
                </div>
              </div>
            ) : (
              // Reopen Problem Form
              <div className="space-y-4">
                <div className="text-center space-y-1">
                  <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center mx-auto">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-black text-stone-900">
                    समस्या अभी भी हल नहीं हुई? (Reopen Complaint)
                  </h3>
                  <p className="text-xs text-stone-500">
                    Please describe what is still pending so the administration can escalate.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-black text-stone-900 block mb-1">
                    क्या अभी भी अधूरा या खराब है? (What is still wrong?)*
                  </label>
                  <textarea
                    rows={4}
                    value={reopenReason}
                    onChange={(e) => setReopenReason(e.target.value)}
                    placeholder="e.g. Water is still leaking from the main joint / Electricity voltage remains very low..."
                    required
                    className="w-full p-3 bg-stone-50 border-2 border-red-300 rounded-xl text-xs text-stone-900"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setShowVerifyModal(false)}
                className="px-4 py-2 text-xs font-bold text-stone-600 hover:text-stone-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleVerifySubmit}
                disabled={actionLoading}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-pine-800 text-white font-black text-xs rounded-xl shadow border border-emerald-400"
              >
                {actionLoading ? 'Saving...' : isConfirmingResolve ? 'Confirm & Close Ticket' : 'Submit Reopen Report'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RESOLVER PROGRESS MODAL */}
      {showProgressModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleAddProgress} className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl border-2 border-stone-200 text-stone-900">
            <h3 className="font-black text-base text-stone-900">Post Field Progress Update</h3>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Progress Details:</label>
              <textarea
                rows={3}
                value={progressRemarks}
                onChange={(e) => setProgressRemarks(e.target.value)}
                placeholder="e.g. Excavation completed, new pipe segment delivered on site..."
                required
                className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Progress Percentage: {progressPercent}%</label>
              <input
                type="range"
                min="10"
                max="90"
                step="10"
                value={progressPercent}
                onChange={(e) => setProgressPercent(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button type="button" onClick={() => setShowProgressModal(false)} className="px-4 py-2 text-xs font-bold text-stone-600">Cancel</button>
              <button type="submit" disabled={actionLoading} className="px-5 py-2 bg-pine-800 text-white text-xs font-bold rounded-xl">Save Progress</button>
            </div>
          </form>
        </div>
      )}

      {/* RESOLVER MARK COMPLETED MODAL */}
      {showMarkCompletedModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleMarkCompleted} className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl border-2 border-stone-200 text-stone-900">
            <div className="text-center space-y-1">
              <h3 className="text-lg font-black text-stone-900">Mark Work Completed</h3>
              <p className="text-xs text-stone-500">Provide resolution report to request citizen signoff.</p>
            </div>

            <div>
              <label className="text-xs font-black text-stone-900 block mb-1">समाधान विवरण (Resolution Description)*:</label>
              <textarea
                rows={3}
                value={resolutionDesc}
                onChange={(e) => setResolutionDesc(e.target.value)}
                placeholder="e.g. 25kVA transformer unit replaced and load tested. All 14 tubewells operational."
                required
                className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Action Taken Summary:</label>
              <input
                type="text"
                value={actionTaken}
                onChange={(e) => setActionTaken(e.target.value)}
                placeholder="e.g. Unit replacement & line insulator clearing"
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Resolver Remarks:</label>
              <input
                type="text"
                value={resolverRemarks}
                onChange={(e) => setResolverRemarks(e.target.value)}
                placeholder="e.g. Tested with Panchayat Pradhan Shri Verma"
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button type="button" onClick={() => setShowMarkCompletedModal(false)} className="px-4 py-2 text-xs font-bold text-stone-600">Cancel</button>
              <button type="submit" disabled={actionLoading} className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl">Mark Done & Notify Citizen</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
