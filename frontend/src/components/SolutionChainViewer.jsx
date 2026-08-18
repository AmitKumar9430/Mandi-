import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useUserAuth } from '../auth/UserAuthContext';
import { userSolutionApi } from '../shared/api/userApi';
import {
  CheckCircle2,
  Clock,
  ArrowRight,
  UserCheck,
  Phone,
  Shield,
  Loader2,
  Sparkles,
  Award
} from 'lucide-react';

const STEP_STATUS_STYLES = {
  PENDING: { label: 'Waiting on Previous Step', bg: 'bg-stone-100 text-stone-600 border-stone-300' },
  READY: { label: 'Ready to Claim / Execute', bg: 'bg-emerald-100 text-emerald-950 border-emerald-400 font-bold animate-pulse' },
  ASSIGNED: { label: 'Assigned to Helper', bg: 'bg-pine-100 text-pine-900 border-pine-400 font-semibold' },
  IN_PROGRESS: { label: 'Work In Progress', bg: 'bg-teal-100 text-teal-950 border-teal-400 font-semibold' },
  COMPLETED: { label: 'Step Completed', bg: 'bg-emerald-100 text-emerald-900 border-emerald-400 font-bold' },
  FAILED: { label: 'Needs Reassignment', bg: 'bg-red-100 text-red-900 border-red-300' }
};

export default function SolutionChainViewer({ graph, onGraphUpdated, isProblemOwner }) {
  const { lang } = useLanguage();
  const { user } = useUserAuth();
  const [activeActionStep, setActiveActionStep] = useState(null);
  const [completionNotes, setCompletionNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!graph) return null;

  const handleAcceptGraph = async () => {
    setIsProcessing(true);
    setErrorMsg('');
    try {
      await userSolutionApi.acceptSolution(graph.problemId);
      if (onGraphUpdated) onGraphUpdated();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to accept solution path');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClaimStep = async (stepId) => {
    setIsProcessing(true);
    setErrorMsg('');
    try {
      await userSolutionApi.claimStep(stepId);
      if (onGraphUpdated) onGraphUpdated();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to claim step');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCompleteStep = async (stepId) => {
    if (!completionNotes.trim()) {
      alert(lang === 'hi' ? 'कृपया कार्य पूर्ण होने का संक्षिप्त विवरण दर्ज करें।' : 'Please enter completion notes.');
      return;
    }
    setIsProcessing(true);
    setErrorMsg('');
    try {
      await userSolutionApi.completeStep(stepId, { completionNotes: completionNotes.trim() });
      setActiveActionStep(null);
      setCompletionNotes('');
      if (onGraphUpdated) onGraphUpdated();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to complete step');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border-2 border-stone-200 p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs uppercase tracking-wider font-extrabold text-pine-700 bg-pine-50 px-2.5 py-0.5 rounded-lg border border-pine-200">
              {lang === 'hi' ? 'बहु-चरणीय समाधान ग्रिड' : 'Multi-Step Solution Graph'}
            </span>
            <span className="bg-stone-100 text-stone-700 text-[10px] font-bold px-2 py-0.5 rounded border border-stone-300">
              Tier: {graph.resolutionTier}
            </span>
          </div>
          <h3 className="text-xl font-black text-stone-900 mt-1">
            {graph.title}
          </h3>
          <p className="text-xs sm:text-sm text-stone-500">{graph.description}</p>
        </div>

        {/* User Approval State */}
        {!graph.acceptedByUser && isProblemOwner && (
          <button
            onClick={handleAcceptGraph}
            disabled={isProcessing}
            className="bg-pine-700 hover:bg-pine-800 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-lg transition flex items-center space-x-1.5"
          >
            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-emerald-300" />}
            <span>{lang === 'hi' ? 'समाधान मार्ग स्वीकार करें (Approve Path)' : 'Accept Solution Path'}</span>
          </button>
        )}
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-50 text-red-800 text-xs rounded-xl border border-red-200">
          {errorMsg}
        </div>
      )}

      {/* Directed Step Chain */}
      <div className="space-y-4">
        {graph.steps?.map((step, index) => {
          const isDone = step.status === 'COMPLETED';
          const isReady = step.status === 'READY';
          const isAssigned = step.status === 'ASSIGNED' || step.status === 'IN_PROGRESS';
          const statusStyle = STEP_STATUS_STYLES[step.status] || STEP_STATUS_STYLES.PENDING;

          return (
            <div
              key={step.id || index}
              className={`p-5 rounded-2xl border-2 transition-all relative ${
                isDone
                  ? 'bg-emerald-50/50 border-emerald-300'
                  : isReady
                  ? 'bg-pine-50 border-pine-400 ring-2 ring-pine-400/30'
                  : isAssigned
                  ? 'bg-teal-50/50 border-teal-300'
                  : 'bg-stone-50/60 border-stone-200 opacity-80'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Step info */}
                <div className="flex items-start space-x-3.5">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0 mt-0.5 ${
                      isDone
                        ? 'bg-emerald-700 text-white'
                        : isReady
                        ? 'bg-pine-600 text-white'
                        : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-5 h-5" /> : step.stepSequence}
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-base font-bold text-stone-900">{step.title}</h4>
                      <span className="text-[11px] text-stone-600 font-semibold bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                        {step.requiredResourceType}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-stone-600 mt-1 leading-relaxed">{step.description}</p>

                    {/* Assigned Provider/Volunteer Detail */}
                    {step.assignedEntityName && (
                      <div className="mt-2 text-xs bg-white/80 p-2.5 rounded-xl border border-stone-200 inline-flex items-center space-x-2 text-stone-800">
                        <UserCheck className="w-4 h-4 text-pine-700" />
                        <span className="font-bold">{step.assignedEntityName}</span>
                        {step.contactPhone && (
                          <a
                            href={`tel:${step.contactPhone}`}
                            className="text-pine-700 font-bold hover:underline flex items-center space-x-1 ml-2"
                          >
                            <Phone className="w-3.5 h-3.5 text-pine-600" />
                            <span>{step.contactPhone}</span>
                          </a>
                        )}
                      </div>
                    )}

                    {/* Completion Notes */}
                    {step.completionNotes && (
                      <div className="mt-2 text-xs text-emerald-900 bg-emerald-100/70 p-2.5 rounded-xl border border-emerald-200">
                        <span className="font-bold">सत्यापन नोट:</span> {step.completionNotes}
                      </div>
                    )}
                  </div>
                </div>

                {/* Step Action Buttons */}
                <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-2 flex-shrink-0">
                  <span className={`text-xs px-3 py-1 rounded-full border ${statusStyle.bg}`}>
                    {statusStyle.label}
                  </span>

                  {/* Claim Button */}
                  {isReady && user && !step.assignedUserId && (
                    <button
                      onClick={() => handleClaimStep(step.id)}
                      disabled={isProcessing}
                      className="bg-pine-700 hover:bg-pine-800 text-white text-xs font-black px-4 py-2 rounded-xl shadow transition"
                    >
                      {lang === 'hi' ? 'यह कार्य स्वीकार करें' : 'Claim Task'}
                    </button>
                  )}

                  {/* Mark Done Button */}
                  {isAssigned && !isDone && (
                    <button
                      onClick={() => setActiveActionStep(activeActionStep === step.id ? null : step.id)}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black px-4 py-2 rounded-xl shadow transition"
                    >
                      {lang === 'hi' ? 'कार्य पूर्ण दर्ज करें' : 'Mark Done'}
                    </button>
                  )}
                </div>
              </div>

              {/* Completion Notes Input Modal */}
              {activeActionStep === step.id && (
                <div className="mt-3 p-4 bg-white rounded-2xl border border-stone-300 space-y-2 animate-fadeIn">
                  <label className="text-xs font-bold text-stone-700 block">
                    {lang === 'hi' ? 'कार्य पूरा होने का विवरण लिखें:' : 'Enter work completion details:'}
                  </label>
                  <textarea
                    value={completionNotes}
                    onChange={(e) => setCompletionNotes(e.target.value)}
                    placeholder="e.g. Tractor delivered produce to buyer, payment receipt verified."
                    rows={2}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-pine-500"
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setActiveActionStep(null)}
                      className="text-xs px-3 py-1.5 text-stone-600 hover:bg-stone-100 rounded-lg font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleCompleteStep(step.id)}
                      disabled={isProcessing}
                      className="bg-emerald-700 text-white text-xs font-bold px-4 py-1.5 rounded-lg shadow"
                    >
                      {isProcessing ? 'Submitting...' : 'Confirm Step Done'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
