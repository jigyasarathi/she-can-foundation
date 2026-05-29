import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login }               = useAuth();
  const navigate                = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { toast.error('Enter email and password'); return; }
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back! 🌸');
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="blob w-80 h-80 bg-rose top-[-100px] right-[-60px]" />
      <div className="blob w-64 h-64 bg-orange-200 bottom-[-80px] left-[-60px]" style={{ animationDelay: '4s' }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <a href="/" className="font-display text-2xl font-black text-rose inline-block mb-6">
            She<span className="text-charcoal">Can</span>
            <span className="text-charcoal text-sm font-body font-medium ml-1.5">Foundation</span>
          </a>
          <h1 className="font-display text-3xl font-black text-charcoal mb-2">Admin Portal</h1>
          <p className="text-charcoal/50 text-sm">Sign in to manage applications</p>
        </div>

        <div className="glass-card p-8">
          <form onSubmit={handleSubmit}>
            <div className="field-group mb-5">
              <label className="field-label">Email Address</label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@shecan.org"
                className="field-input"
                autoComplete="email"
              />
            </div>

            <div className="field-group mb-7">
              <label className="field-label">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="field-input pr-11"
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/30 hover:text-rose transition-colors text-sm">
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full justify-center py-3.5 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : 'Sign In →'}
            </button>
          </form>

          <div className="mt-5 p-3 bg-rose-light/50 rounded-xl text-center">
            <p className="text-xs text-charcoal/50">
              Demo credentials: <span className="font-semibold text-rose">admin@shecan.org</span> / <span className="font-semibold text-rose">SheCan@2025</span>
            </p>
          </div>
        </div>

        <p className="text-center mt-5 text-xs text-charcoal/40">
          <a href="/" className="hover:text-rose transition-colors">← Back to website</a>
        </p>
      </motion.div>
    </div>
  );
}
