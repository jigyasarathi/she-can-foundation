import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white py-12 px-[5%]">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="font-display text-2xl font-black text-rose mb-3">
              She<span className="text-white">Can</span> Foundation
            </div>
            <p className="text-white/50 text-sm leading-relaxed">
              Empowering youth through education, technology & community.
            </p>
          </div>

          {/* Links */}
          <div>
            <div className="text-xs font-bold tracking-widest uppercase text-rose mb-4">Quick Links</div>
            <div className="flex flex-col gap-2.5">
              {[
                { label: 'Home', to: '/' },
                { label: 'About', to: '/#about' },
                { label: 'Apply for Internship', to: '/apply' },
                { label: 'Admin Portal', to: '/admin/login' },
              ].map((l) => (
                <Link key={l.label} to={l.to} className="text-sm text-white/50 hover:text-rose transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Social */}
          <div>
            <div className="text-xs font-bold tracking-widest uppercase text-rose mb-4">Connect</div>
            <div className="flex flex-col gap-2.5">
              {[
                { label: 'Instagram', href: 'https://www.instagram.com/shecanfoundation.ngo' },
                { label: 'LinkedIn',  href: 'https://www.linkedin.com/company/shecanfoundation' },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/50 hover:text-rose transition-colors"
                >
                  {s.label} ↗
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 text-center text-xs text-white/30">
          © 2025 She Can Foundation. All rights reserved. Made with ♥ for a better tomorrow.
        </div>
      </div>
    </footer>
  );
}
