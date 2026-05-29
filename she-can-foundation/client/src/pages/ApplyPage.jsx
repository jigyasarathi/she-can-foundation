import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';

const AREAS = [
  'Full Stack Development',
  'AI / Machine Learning',
  'UI/UX Design',
  'Digital Marketing & Outreach',
  'Content Writing',
  'Campus Ambassador',
  'Fundraising',
  'Other',
];

const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

const initialForm = {
  firstName: '', lastName: '', email: '', phone: '',
  college: '', skills: '', linkedIn: '',
  areaOfInterest: '', experienceLevel: '', message: '',
};

export default function ApplyPage() {
  const [form, setForm]         = useState(initialForm);
  const [errors, setErrors]     = useState({});
  const [resume, setResume]     = useState(null);
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);
  const [appId, setAppId]       = useState(null);
  const fileRef                 = useRef(null);

  /* ── Validation ── */
  const validate = () => {
    const e = {};
    if (!form.firstName.trim())        e.firstName    = 'First name is required';
    if (!form.lastName.trim())         e.lastName     = 'Last name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
                                       e.email        = 'Valid email required';
    if (form.phone && !/^\+?[\d\s\-]{7,15}$/.test(form.phone))
                                       e.phone        = 'Enter a valid phone number';
    if (!form.college.trim())          e.college      = 'College name is required';
    if (!form.skills.trim())           e.skills       = 'Please list your skills';
    if (!form.areaOfInterest)          e.areaOfInterest = 'Please choose an area';
    if (!form.experienceLevel)         e.experienceLevel = 'Please select your level';
    if (form.message.length > 0 && form.message.length < 20)
                                       e.message      = 'Minimum 20 characters';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => { const n = { ...p }; delete n[name]; return n; });
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['pdf','doc','docx'].includes(ext)) {
      toast.error('Only PDF/DOC/DOCX files accepted');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File must be under 5 MB');
      return;
    }
    setResume(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); toast.error('Please fix the errors below'); return; }

    setLoading(true);

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (resume) fd.append('resume', resume);

      const res = await api.post('/applications', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      /*
       * FIX — Issue 1:
       * The backend returns: { success: true, data: <applicationDocument> }
       * The full Mongoose document is in res.data.data.
       * We must check res.data.success === true before treating as success,
       * and safely read applicationId from res.data.data.applicationId.
       *
       * Previously there was no explicit success check, so any unexpected
       * shape (e.g. missing 'data' key) would throw a TypeError inside the
       * try block which was silently caught and shown as "Submission failed".
       *
       * We also wrap state updates outside this logic to avoid React render
       * errors being caught by the same catch block.
       */
      if (res.data && res.data.success) {
        // Safely extract applicationId from the returned document
        const returnedId = res.data.data?.applicationId ?? null;

        // Update state — these are synchronous React state setters, safe here
        setAppId(returnedId);
        setSuccess(true);
        setForm(initialForm);
        setResume(null);
        if (fileRef.current) fileRef.current.value = '';

        // Show success toast as additional feedback
        toast.success('Application submitted successfully! 🎉');
      } else {
        // Backend returned 2xx but without success:true — treat as failure
        toast.error(res.data?.message || 'Submission failed. Please try again.');
      }

    } catch (err) {
      /*
       * Only reaches here on actual HTTP errors (4xx/5xx) or network failures.
       * err.response is populated by axios for HTTP error responses.
       * For network errors (no response), fall back to a generic message.
       */
      const serverMsg = err.response?.data?.message;
      toast.error(serverMsg || 'Submission failed. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  /* ── Success Modal ── */
  const SuccessModal = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 20 }}
        className="bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-2xl"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4"
        >
          <span className="text-4xl">✅</span>
        </motion.div>
        <h2 className="font-display text-2xl font-black text-charcoal mb-2">Application Submitted!</h2>
        
        <div className="bg-rose/5 border border-rose/20 rounded-xl p-4 my-6">
          <p className="text-xs text-charcoal/60 uppercase tracking-widest font-bold mb-1">Your Application ID</p>
          <div className="font-display text-2xl font-black text-rose mb-3">{appId}</div>
          <p className="text-[11px] text-charcoal/50 mb-3">Please save this ID. You will need it to check your application status later.</p>
          <button 
            onClick={() => {
              navigator.clipboard.writeText(appId);
              toast.success('Copied to clipboard!');
            }}
            className="text-xs font-semibold bg-white border border-gray-200 px-4 py-2 rounded-lg hover:border-rose hover:text-rose transition-colors"
          >
            📋 Copy Application ID
          </button>
        </div>

        <button
          onClick={() => { setSuccess(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="btn-primary w-full justify-center mb-3"
        >
          Back to Home
        </button>
        <a href="/status" className="text-sm font-semibold text-charcoal/50 hover:text-rose hover:underline block">
          Check Application Status →
        </a>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-cream font-body">
      <Navbar />
      <AnimatePresence>{success && <SuccessModal />}</AnimatePresence>

      {/* Header */}
      <section className="pt-32 pb-12 px-[5%] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-rose-light/30 to-transparent pointer-events-none" />
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-label"
          >
            Internship Application
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="font-display text-4xl md:text-5xl font-black text-charcoal mb-4"
          >
            Apply to She Can Foundation
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-charcoal/55 leading-relaxed"
          >
            Fill in your details below. We review every application personally and respond within 3–5 business days.
          </motion.p>
        </div>
      </section>

      {/* Form */}
      <section className="pb-24 px-[5%]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-2xl mx-auto glass-card p-8 md:p-12"
        >
          <form onSubmit={handleSubmit} noValidate>

            {/* Name row */}
            <div className="grid sm:grid-cols-2 gap-5 mb-5">
              <Field label="First Name *" error={errors.firstName}>
                <input name="firstName" value={form.firstName} onChange={handleChange}
                  placeholder="Priya" className={`field-input ${errors.firstName ? 'error' : ''}`} />
              </Field>
              <Field label="Last Name *" error={errors.lastName}>
                <input name="lastName" value={form.lastName} onChange={handleChange}
                  placeholder="Sharma" className={`field-input ${errors.lastName ? 'error' : ''}`} />
              </Field>
            </div>

            {/* Email */}
            <Field label="Email Address *" error={errors.email} className="mb-5">
              <input name="email" type="email" value={form.email} onChange={handleChange}
                placeholder="priya@example.com" className={`field-input ${errors.email ? 'error' : ''}`} />
            </Field>

            {/* Phone */}
            <Field label="Phone / WhatsApp" error={errors.phone} className="mb-5">
              <input name="phone" type="tel" value={form.phone} onChange={handleChange}
                placeholder="+91 98765 43210" className={`field-input ${errors.phone ? 'error' : ''}`} />
            </Field>

            {/* College */}
            <Field label="College / University *" error={errors.college} className="mb-5">
              <input name="college" value={form.college} onChange={handleChange}
                placeholder="Delhi University" className={`field-input ${errors.college ? 'error' : ''}`} />
            </Field>

            {/* Skills */}
            <Field label="Skills *" error={errors.skills} className="mb-5">
              <input name="skills" value={form.skills} onChange={handleChange}
                placeholder="e.g. React, Figma, Python, SEO…"
                className={`field-input ${errors.skills ? 'error' : ''}`} />
            </Field>

            {/* LinkedIn */}
            <Field label="LinkedIn Profile URL" error={errors.linkedIn} className="mb-5">
              <input name="linkedIn" type="url" value={form.linkedIn} onChange={handleChange}
                placeholder="https://linkedin.com/in/your-profile"
                className={`field-input ${errors.linkedIn ? 'error' : ''}`} />
            </Field>

            {/* Area + Level */}
            <div className="grid sm:grid-cols-2 gap-5 mb-5">
              <Field label="Area of Interest *" error={errors.areaOfInterest}>
                <select name="areaOfInterest" value={form.areaOfInterest} onChange={handleChange}
                  className={`field-input ${errors.areaOfInterest ? 'error' : ''}`}>
                  <option value="">Select one…</option>
                  {AREAS.map((a) => <option key={a}>{a}</option>)}
                </select>
              </Field>
              <Field label="Experience Level *" error={errors.experienceLevel}>
                <select name="experienceLevel" value={form.experienceLevel} onChange={handleChange}
                  className={`field-input ${errors.experienceLevel ? 'error' : ''}`}>
                  <option value="">Select level…</option>
                  {LEVELS.map((l) => <option key={l}>{l}</option>)}
                </select>
              </Field>
            </div>

            {/* Resume upload */}
            <div className="mb-5">
              <label className="field-label mb-1.5 block">Resume (PDF/DOC, max 5 MB)</label>
              <div
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-rose/20 rounded-xl p-6 text-center cursor-pointer hover:border-rose/50 hover:bg-rose-light/10 transition-all"
              >
                {resume ? (
                  <div className="flex items-center justify-center gap-2 text-sm font-medium text-rose">
                    <span>📄</span> {resume.name}
                    <button type="button" onClick={(e) => { e.stopPropagation(); setResume(null); }}
                      className="ml-2 text-charcoal/40 hover:text-red-500 text-xs">✕ Remove</button>
                  </div>
                ) : (
                  <div className="text-charcoal/40 text-sm">
                    <div className="text-2xl mb-1">📎</div>
                    Click to upload your resume
                  </div>
                )}
                <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" onChange={handleFile} className="hidden" />
              </div>
            </div>

            {/* Message */}
            <Field label="Tell us about yourself" error={errors.message} className="mb-8">
              <div className="relative">
                <textarea name="message" value={form.message} onChange={handleChange} rows={4}
                  maxLength={500}
                  placeholder="Share your motivation, goals, and what you hope to contribute…"
                  className={`field-input resize-none ${errors.message ? 'error' : ''}`} />
                <div className="absolute bottom-2 right-3 text-[10px] text-charcoal/30">
                  {form.message.length}/500
                </div>
              </div>
            </Field>

            <button type="submit" disabled={loading}
              className="btn-primary w-full justify-center text-base py-4 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting…
                </span>
              ) : 'Submit Application ✦'}
            </button>

          </form>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}

/* Small field wrapper */
function Field({ label, error, children, className = '' }) {
  return (
    <div className={`field-group ${className}`}>
      <label className="field-label">{label}</label>
      {children}
      {error && <span className="error-text">{error}</span>}
    </div>
  );
}
