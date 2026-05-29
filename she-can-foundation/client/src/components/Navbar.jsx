import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  const links = [
    { label: 'Home',         to: '/' },
    { label: 'About',        to: '/#about' },
    { label: 'Apply',        to: '/apply' },
    { label: 'Track Status', to: '/status' },
  ];

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-[5%] py-4 transition-all duration-300 ${
        scrolled
          ? 'bg-cream/90 backdrop-blur-md shadow-sm border-b border-rose/10'
          : 'bg-transparent'
      }`}
    >
      {/* Logo */}
      <Link to="/" className="font-display text-xl font-black text-rose">
        She<span className="text-charcoal">Can</span>
        <span className="text-charcoal text-sm font-body font-medium ml-1.5">Foundation</span>
      </Link>

      {/* Desktop links */}
      <ul className="hidden md:flex items-center gap-8">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              to={l.to}
              className="text-sm font-medium text-charcoal/60 hover:text-rose transition-colors duration-200"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <div className="hidden md:flex items-center gap-3">
        <Link to="/status" className="text-xs font-semibold text-charcoal/60 border border-charcoal/20 px-4 py-2 rounded-full hover:border-rose hover:text-rose transition-all">
          🔍 Track Status
        </Link>
        <Link to="/apply" className="btn-primary text-xs px-5 py-2.5">
          Apply Now ✦
        </Link>
        <Link to="/admin/login" className="text-xs text-charcoal/40 hover:text-rose transition-colors">
          Admin
        </Link>
      </div>

      {/* Hamburger */}
      <button
        className="md:hidden flex flex-col gap-1.5 p-2"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span className={`w-5 h-0.5 bg-charcoal transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
        <span className={`w-5 h-0.5 bg-charcoal transition-all ${menuOpen ? 'opacity-0' : ''}`} />
        <span className={`w-5 h-0.5 bg-charcoal transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
      </button>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 bg-cream/95 backdrop-blur-md border-b border-rose/10 py-4 px-[5%] flex flex-col gap-3 md:hidden"
          >
            {links.map((l) => (
              <Link
                key={l.label}
                to={l.to}
                className="text-sm font-semibold text-charcoal/70 py-2 hover:text-rose transition-colors"
              >
                {l.label}
              </Link>
            ))}
            <Link to="/apply" className="btn-primary text-sm mt-2 justify-center">
              Apply Now ✦
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
