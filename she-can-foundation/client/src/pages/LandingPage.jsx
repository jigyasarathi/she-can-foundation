import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StatsStrip from '../components/StatsStrip';

const pillars = [
  { icon: '📚', title: 'Education',         desc: 'Skill-building workshops and learning programs' },
  { icon: '💻', title: 'Digital Initiatives', desc: 'Tech internships and digital literacy drives' },
  { icon: '🤝', title: 'Community',          desc: 'Peer-driven support and mentorship networks' },
  { icon: '🌟', title: 'Impact',             desc: 'Measurable change across 15+ cities in India' },
];

const roles = [
  { icon: '⚛️',  title: 'Full Stack Dev',  desc: 'React, Node, MERN stack projects',       tag: 'Technical' },
  { icon: '🤖', title: 'AI / ML Engineer', desc: 'Python, TensorFlow, data pipelines',      tag: 'Technical' },
  { icon: '🎨', title: 'UI/UX Designer',   desc: 'Figma, prototyping, user research',       tag: 'Design' },
  { icon: '📣', title: 'Outreach Lead',    desc: 'Social media, campaigns, partnerships',   tag: 'Marketing' },
  { icon: '✍️',  title: 'Content Writer',  desc: 'Blogs, newsletters, social copy',         tag: 'Creative' },
  { icon: '🎓', title: 'Campus Ambassador', desc: 'Represent She Can at your college',       tag: 'Community' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-cream font-body">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center px-[5%] pt-24 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-cream via-rose-light/30 to-cream" />
        <div className="blob w-[500px] h-[500px] bg-rose top-[-150px] right-[-100px]" style={{ animationDelay: '0s' }} />
        <div className="blob w-[350px] h-[350px] bg-orange-300 bottom-[-100px] left-[-80px]" style={{ animationDelay: '3s' }} />
        <div className="blob w-[250px] h-[250px] bg-pink-300 top-[40%] left-[40%]" style={{ animationDelay: '5s' }} />

        <div className="relative z-10 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-rose-light text-rose-dark px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6"
          >
            ✦ Internship Applications Open 2025
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="font-display text-5xl md:text-7xl font-black leading-[1.05] text-charcoal mb-6"
          >
            Build Your Future.<br />
            <span className="text-rose relative inline-block">
              Change Lives.
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="absolute bottom-0 left-0 right-0 h-1 bg-rose rounded-full origin-left"
              />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-charcoal/60 text-lg leading-relaxed mb-8 max-w-lg"
          >
            She Can Foundation offers hands-on internships for students who want to create real impact through technology, design, and community work.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap gap-4"
          >
            <Link to="/apply" className="btn-primary">
              Apply Now ✦
            </Link>
            <a href="#about" className="btn-outline">
              Learn More →
            </a>
          </motion.div>

          {/* Trust badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="mt-10 flex items-center gap-3"
          >
            <div className="flex -space-x-2">
              {['#e8476a','#f4a261','#4ade80','#60a5fa'].map((c, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white" style={{ background: c }} />
              ))}
            </div>
            <span className="text-sm text-charcoal/50 font-medium">500+ students empowered this year</span>
          </motion.div>
        </div>

        {/* Floating card */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="hidden lg:block absolute right-[8%] top-1/2 -translate-y-1/2 glass-card p-6 w-64"
        >
          <div className="text-2xl mb-3">🌸</div>
          <div className="font-display text-lg font-bold text-charcoal mb-1">Applications Open</div>
          <div className="text-xs text-charcoal/50 mb-4">Batch 2025 · 6 roles available</div>
          <div className="space-y-2">
            {['Full Stack', 'AI Engineer', 'UI/UX', 'Outreach'].map((role) => (
              <div key={role} className="flex items-center gap-2 text-xs text-charcoal/70">
                <span className="w-1.5 h-1.5 rounded-full bg-rose inline-block" />{role}
              </div>
            ))}
          </div>
          <Link to="/apply" className="mt-4 w-full btn-primary text-xs py-2.5 justify-center block text-center">
            Apply →
          </Link>
        </motion.div>
      </section>

      {/* ── STATS ── */}
      <StatsStrip />

      {/* ── ABOUT ── */}
      <section id="about" className="py-24 px-[5%]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 -m-3 border-2 border-rose/30 rounded-3xl" />
            <img
              src="https://images.unsplash.com/photo-1529390079861-591de354faf5?w=700&q=80"
              alt="Students learning together"
              className="w-full h-[420px] object-cover rounded-2xl"
            />
            <div className="absolute bottom-5 left-5 bg-white rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3">
              <span className="text-2xl">🌱</span>
              <div>
                <div className="text-xs font-bold text-charcoal">Building</div>
                <div className="text-xs text-charcoal/50">Future Leaders</div>
              </div>
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-label">Who We Are</span>
            <h2 className="section-title mb-5">A Community Built on Belief &amp; Opportunity</h2>
            <p className="text-charcoal/60 leading-relaxed mb-4">
              She Can Foundation is a youth-driven NGO dedicated to creating opportunities, raising awareness, and driving positive social impact. We work at the intersection of education and technology to uplift students who lack access to the right resources.
            </p>
            <p className="text-charcoal/60 leading-relaxed mb-8">
              We don't judge talent only by experience. Passion and willingness to learn matter far more — and we build programs that reflect that belief every single day.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {pillars.map((p, i) => (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-2xl p-4 border border-rose/10 hover:border-rose/30 hover:shadow-md transition-all"
                >
                  <div className="text-xl mb-2">{p.icon}</div>
                  <div className="text-sm font-bold text-charcoal mb-1">{p.title}</div>
                  <div className="text-xs text-charcoal/50 leading-relaxed">{p.desc}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── OPEN ROLES ── */}
      <section className="py-24 px-[5%] bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="section-label">Open Positions</span>
            <h2 className="section-title">Find Your Role at She Can</h2>
            <p className="text-charcoal/50 mt-3 max-w-lg mx-auto text-sm">
              Six exciting internship tracks designed to give you real-world experience and meaningful impact.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map((r, i) => (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-card p-6 hover:shadow-[0_24px_60px_rgba(232,71,106,0.14)] hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="text-3xl mb-4">{r.icon}</div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-rose bg-rose-light px-2 py-0.5 rounded-full">
                  {r.tag}
                </span>
                <h3 className="font-display text-lg font-bold text-charcoal mt-3 mb-1">{r.title}</h3>
                <p className="text-sm text-charcoal/50 mb-5">{r.desc}</p>
                <Link
                  to="/apply"
                  className="text-sm font-semibold text-rose group-hover:underline"
                >
                  Apply for this role →
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/apply" className="btn-primary">
              View All & Apply ✦
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-20 px-[5%] bg-gradient-to-r from-rose-dark via-rose to-pink-400 relative overflow-hidden">
        <div className="blob w-72 h-72 bg-white/10 top-[-60px] right-[-60px]" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl md:text-5xl font-black text-white mb-4"
          >
            Ready to Make Your Mark?
          </motion.h2>
          <p className="text-white/80 mb-8 text-lg">
            Join She Can Foundation and turn your skills into social change.
          </p>
          <Link
            to="/apply"
            className="inline-flex items-center gap-2 bg-white text-rose font-bold px-8 py-3.5 rounded-full text-sm shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all"
          >
            Start Your Application ✦
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
