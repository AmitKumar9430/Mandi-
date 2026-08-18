import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { problemApi, solutionApi } from '../api/client';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import ProblemPassportCard from '../components/ProblemPassportCard';
import SolutionChainViewer from '../components/SolutionChainViewer';
import ResourceMatchingCard from '../components/ResourceMatchingCard';
import {
  FileText,
  Clock,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  Star,
  ArrowLeft,
  Loader2,
  Phone
} from 'lucide-react';

export default function ProblemDetail() {
  const { id } = useParams();
  const { lang, t } = useLanguage();
  const { user } = useAuth();

  const [problem, setProblem] = useState(null);
  const [solutionGraph, setSolutionGraph] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Resolution Modal State
  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [resolutionSummary, setResolutionSummary] = useState('');
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [isResolving, setIsResolving] = useState(false);

  const fetchDetails = async () => {
    try {
      const probRes = await problemApi.getById(id);
      if (probRes.success && probRes.data) {
        setProblem(probRes.data);
      }

      const graphRes = await solutionApi.getByProblemId(id).catch(() => null);
      if (graphRes?.data) {
        setSolutionGraph(graphRes.data);
      }

      const matchRes = await solutionApi.getMatches(id).catch(() => null);
      if (matchRes?.data) {
        setMatches(matchRes.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load problem passport');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleConfirmResolution = async (e) => {
    e.preventDefault();
    if (!resolutionSummary.trim()) {
      alert(lang === 'hi' ? 'कृपया समाधान का संक्षिप्त विवरण लिखें।' : 'Please enter resolution summary.');
      return;
    }

    setIsResolving(true);
    try {
      await problemApi.resolve(id, {
        resolutionSummary: resolutionSummary.trim(),
        userRating: rating,
        userFeedback: feedback.trim()
      });
      setResolveModalOpen(false);
      fetchDetails();
    } catch (err) {
      alert(err.message || 'Failed to confirm resolution');
    } finally {
      setIsResolving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-mandi-500" />
        <p className="text-sm text-stone-500">{lang === 'hi' ? 'समस्या पासपोर्ट लोड हो रहा है...' : 'Loading Problem Passport...'}</p>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-xl font-bold text-stone-900">{error || 'Problem not found'}</h2>
        <Link to="/problems" className="inline-flex items-center space-x-1 text-sm font-bold text-mandi-700">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Problem Feed</span>
        </Link>
      </div>
    );
  }

  const isOwner = user && problem.userId === user.id;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Button */}
      <Link
        to="/problems"
        className="inline-flex items-center space-x-1.5 text-xs font-bold text-stone-600 hover:text-stone-900 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{lang === 'hi' ? 'समस्या सूची पर वापस जाएं' : 'Back to Problem Feed'}</span>
      </Link>

      {/* 1. Problem Passport Card */}
      <ProblemPassportCard
        problem={problem}
        passport={problem}
        onOpenResolveModal={isOwner && problem.status !== 'RESOLVED' && problem.status !== 'CLOSED' ? () => setResolveModalOpen(true) : null}
      />

      {/* 2. Interactive Solution Graph / Chain */}
      {solutionGraph && (
        <SolutionChainViewer
          graph={solutionGraph}
          onGraphUpdated={fetchDetails}
          isProblemOwner={isOwner}
        />
      )}

      {/* 3. Matching Recommendations Tab */}
      {matches.length > 0 && (
        <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200 space-y-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-mandi-600" />
            <h3 className="text-lg font-bold text-stone-900">
              {lang === 'hi' ? 'मंडी मिलान परिणाम (Matching Engine Recommendations)' : 'MANDI Matching Recommendations'}
            </h3>
          </div>
          <p className="text-xs text-stone-500">
            {lang === 'hi'
              ? 'दूरी, कौशल, उपलब्धता और उपयोगकर्ता रेटिंग के आधार पर पारदर्शी मिलान स्कोर:'
              : 'Transparent match scores based on distance, verified category, real-time availability, and reliability rating:'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {matches.map((match, idx) => (
              <ResourceMatchingCard key={idx} match={match} />
            ))}
          </div>
        </div>
      )}

      {/* 4. Immutable Audit Timeline */}
      {problem.events && problem.events.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200 space-y-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-stone-600" />
            <h3 className="text-base font-bold text-stone-900">
              {lang === 'hi' ? 'समस्या समय-सारिणी (Audit & Execution Timeline)' : 'Immutable Audit Timeline'}
            </h3>
          </div>

          <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-stone-200 pl-8">
            {problem.events.map((evt, idx) => (
              <div key={evt.id || idx} className="relative space-y-1">
                <div className="absolute -left-8 top-1 w-3.5 h-3.5 rounded-full bg-mandi-500 ring-4 ring-white" />
                <div className="flex items-center space-x-2 text-xs">
                  <span className="font-bold text-stone-900">{evt.eventType}</span>
                  <span className="text-stone-400">•</span>
                  <span className="text-stone-500">{new Date(evt.createdAt).toLocaleString()}</span>
                  {evt.actorName && (
                    <>
                      <span className="text-stone-400">•</span>
                      <span className="text-mandi-700 font-semibold">{evt.actorName}</span>
                    </>
                  )}
                </div>
                <p className="text-xs text-stone-700">{evt.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resolution Modal */}
      {resolveModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-stone-300">
            <div className="flex items-center space-x-2 text-krishi-600">
              <CheckCircle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-stone-900">
                {lang === 'hi' ? 'समस्या समाधान की पुष्टि करें' : 'Confirm Problem Resolution'}
              </h3>
            </div>

            <form onSubmit={handleConfirmResolution} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">
                  {lang === 'hi' ? 'समाधान का विवरण (क्या काम पूरा हुआ?):' : 'Resolution Summary (What was accomplished?):'}
                </label>
                <textarea
                  value={resolutionSummary}
                  onChange={(e) => setResolutionSummary(e.target.value)}
                  placeholder="e.g. Produce sold at fair price, tractor delivered on time."
                  rows={3}
                  required
                  className="w-full p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-krishi-500"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">
                  {lang === 'hi' ? 'सहायता का अनुभव (Rating 1-5):' : 'Experience Rating:'}
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= rating ? 'fill-amber-500 text-amber-500' : 'text-stone-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="font-bold text-stone-700 ml-2">{rating} / 5</span>
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">
                  {lang === 'hi' ? 'अतिरिक्त सुझाव / फीडबैक (वैकल्पिक):' : 'Feedback Notes (Optional):'}
                </label>
                <input
                  type="text"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="e.g. Excellent cooperation by volunteer."
                  className="w-full p-2 rounded-lg border border-stone-300 focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setResolveModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-stone-600 hover:bg-stone-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isResolving}
                  className="bg-krishi-600 hover:bg-krishi-700 text-white font-bold px-4 py-2 rounded-lg shadow"
                >
                  {isResolving ? 'Submitting...' : 'Confirm Resolution'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
