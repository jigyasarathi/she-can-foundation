import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';

const TIMELINE_STEPS = [
  { key: 'Pending',              label: 'Application Submitted', icon: '📋', desc: 'Your application has been received.' },
  { key: 'Under Review',         label: 'Under Review',          icon: '🔍', desc: 'Our team is reviewing your application.' },
  { key: 'Shortlisted',          label: 'Shortlisted',           icon: '⭐', desc: 'You have been shortlisted for the next round.' },
  { key: 'Interview Scheduled',  label: 'Interview Scheduled',   icon: '📅', desc: 'Your interview has been scheduled.' },
  { key: 'Selected',             label: 'Selected',              icon: '🎉', desc: 'Congratulations! You have been selected.' },
];

const getStepIndex = (status) => {
  const idx = TIMELINE_STEPS.findIndex(s => s.key === status);
  return idx === -1 ? 0 : idx;
};

export default function CheckStatusPage() {
  const [applicationId, setApplicationId] = useState('');
  const [email, setEmail]                 = useState('');
  const [loading, setLoading]             = useState(false);
  const [result, setResult]               = useState(null);
  const [error, setError]                 = useState('');

  const handleCheck = async (e) => {
    e.preventDefault();
    if (!applicationId.trim() || !email.trim()) {
      toast.error('Please enter both Application ID and Email.');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const { data } = await api.post('/public/status', {
        applicationId: applicationId.trim(),
        email: email.trim(),
      });
      setResult(data.data);
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const currentStep = result ? getStepIndex(result.status) : 0;
  const isRejected  = result?.status === 'Rejected';

  return (
    <div className="min-h-screen bg-cream font-body">
      <Navbar />

      {/* Header */}
      <section className="pt-32 pb-12 px-[5%] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-rose-light/30 to-transparent pointer-events-none" />
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-label"
          >
            Application Tracking
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="font-display text-4xl md:text-5xl font-black text-charcoal mb-4"
          >
            Check Your Status
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-charcoal/55 leading-relaxed"
          >
            Enter your Application ID and email address to track the progress of your internship application.
          </motion.p>
        </div>
      </section>

      {/* Lookup Form */}
      <section className="pb-8 px-[5%]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-lg mx-auto glass-card p-8"
        >
          <form onSubmit={handleCheck} noValidate>
            <div className="mb-5">
              <label className="field-label">Application ID</label>
              <input
                value={applicationId}
                onChange={(e) => setApplicationId(e.target.value.toUpperCase())}
                placeholder="APP-A1B2C3D4"
                className="field-input font-mono tracking-widest"
                maxLength={12}
              />
            </div>
            <div className="mb-6">
              <label className="field-label">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="field-input"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-4 text-base disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Checking…
                </span>
              ) : '🔍 Track Application'}
            </button>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center"
              >
                {error}
              </motion.div>
            )}
          </form>
        </motion.div>
      </section>

      {/* Results */}
      <AnimatePresence>
        {result && (
          <section className="pb-24 px-[5%]">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              className="max-w-2xl mx-auto space-y-6"
            >

              {/* Applicant Card */}
              <div className="glass-card p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose to-rose-dark flex items-center justify-center text-white text-xl font-black flex-shrink-0">
                  {result.firstName[0]}{result.lastName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-display text-xl font-black text-charcoal">
                    {result.firstName} {result.lastName}
                  </h2>
                  <div className="text-sm text-charcoal/50 mt-0.5">{result.areaOfInterest}</div>
                  <div className="text-xs text-charcoal/40 mt-1">
                    Applied on {new Date(result.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                </div>
                <div className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider ${
                  isRejected
                    ? 'bg-red-100 text-red-600'
                    : result.status === 'Selected'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-rose/10 text-rose'
                }`}>
                  {result.status}
                </div>
              </div>

              {/* Timeline */}
              {!isRejected ? (
                <div className="glass-card p-6 md:p-8">
                  <h3 className="font-display text-lg font-bold text-charcoal mb-8">Application Progress</h3>
                  <div className="relative">
                    {/* Vertical connector line */}
                    <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-gray-100" />
                    <div
                      className="absolute left-5 top-5 w-0.5 bg-gradient-to-b from-rose to-rose-dark transition-all duration-1000"
                      style={{ height: `${(currentStep / (TIMELINE_STEPS.length - 1)) * 100}%` }}
                    />

                    <div className="space-y-6">
                      {TIMELINE_STEPS.map((step, i) => {
                        const isDone    = i < currentStep;
                        const isCurrent = i === currentStep;
                        const isFuture  = i > currentStep;
                        return (
                          <motion.div
                            key={step.key}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-start gap-5 relative"
                          >
                            {/* Icon dot */}
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 flex-shrink-0 border-2 transition-all duration-500 ${
                              isDone
                                ? 'bg-rose border-rose text-white shadow-md shadow-rose/30'
                                : isCurrent
                                ? 'bg-white border-rose shadow-lg shadow-rose/20 ring-4 ring-rose/10'
                                : 'bg-gray-50 border-gray-200'
                            }`}>
                              {isDone ? (
                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              ) : (
                                <span className={`text-lg ${isFuture ? 'grayscale opacity-40' : ''}`}>{step.icon}</span>
                              )}
                            </div>

                            {/* Content */}
                            <div className={`flex-1 pb-1 ${isFuture ? 'opacity-40' : ''}`}>
                              <div className={`font-bold text-sm ${isCurrent ? 'text-rose' : isDone ? 'text-charcoal' : 'text-charcoal/50'}`}>
                                {step.label}
                                {isCurrent && (
                                  <span className="ml-2 text-[10px] uppercase font-black tracking-wider bg-rose text-white px-2 py-0.5 rounded-full">
                                    Current
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-charcoal/50 mt-0.5">{step.desc}</div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="glass-card p-6 text-center border border-red-200">
                  <div className="text-4xl mb-3">😔</div>
                  <h3 className="font-display text-lg font-black text-charcoal mb-2">Application Not Selected</h3>
                  <p className="text-charcoal/55 text-sm">Thank you for your interest in She Can Foundation. Unfortunately, your application was not selected this time. We encourage you to apply again in the future.</p>
                </div>
              )}

              {/* Shortlisted message */}
              {result.status === 'Shortlisted' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-card p-6 border border-green-200 bg-green-50/50"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🎊</span>
                    <div>
                      <h4 className="font-bold text-green-800 mb-1">You've been Shortlisted!</h4>
                      <p className="text-sm text-green-700">
                        Congratulations! Your application has been shortlisted for the next round. Our team will reach out soon with further details. Keep an eye on this page for updates.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Interview Scheduled */}
              {result.status === 'Interview Scheduled' && (result.interviewDate || result.meetingLink) && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-card p-6 border border-blue-200 bg-blue-50/50"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">📅</span>
                    <h4 className="font-bold text-blue-800">Interview Details</h4>
                  </div>
                  <div className="space-y-3 text-sm">
                    {result.interviewDate && (
                      <div className="flex items-center gap-3">
                        <span className="text-blue-400">📆</span>
                        <div>
                          <div className="text-xs text-blue-500 font-bold uppercase tracking-wide">Date</div>
                          <div className="text-blue-900 font-semibold">{result.interviewDate}</div>
                        </div>
                      </div>
                    )}
                    {result.interviewTime && (
                      <div className="flex items-center gap-3">
                        <span className="text-blue-400">🕐</span>
                        <div>
                          <div className="text-xs text-blue-500 font-bold uppercase tracking-wide">Time</div>
                          <div className="text-blue-900 font-semibold">{result.interviewTime}</div>
                        </div>
                      </div>
                    )}
                    {result.meetingLink && (
                      <div className="flex items-center gap-3">
                        <span className="text-blue-400">🔗</span>
                        <div>
                          <div className="text-xs text-blue-500 font-bold uppercase tracking-wide">Meeting Link</div>
                          <a href={result.meetingLink} target="_blank" rel="noopener noreferrer"
                            className="text-blue-600 font-semibold underline break-all">
                            {result.meetingLink}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Selected / Joining Instructions */}
              {result.status === 'Selected' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-card p-6 border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50"
                >
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">🎉</div>
                    <h4 className="font-display text-xl font-black text-green-800">Congratulations!</h4>
                    <p className="text-sm text-green-700 mt-1">You have been selected for the She Can Foundation internship program!</p>
                  </div>
                  {result.joiningInstructions && (
                    <div className="mt-4 p-4 bg-white/70 rounded-xl border border-green-200">
                      <div className="text-xs font-bold uppercase tracking-widest text-green-600 mb-2">Joining Instructions</div>
                      <p className="text-sm text-green-900 leading-relaxed whitespace-pre-line">{result.joiningInstructions}</p>
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          </section>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
