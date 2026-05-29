import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const stats = [
  { num: 500, suffix: '+', label: 'Students Supported' },
  { num: 20,  suffix: '+', label: 'Active Projects' },
  { num: 100, suffix: '%', label: 'Volunteer Driven' },
  { num: 15,  suffix: '+', label: 'Cities Reached' },
];

function Counter({ target, suffix }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let start = 0;
        const step = Math.ceil(target / 60);
        const timer = setInterval(() => {
          start += step;
          if (start >= target) { setCount(target); clearInterval(timer); }
          else setCount(start);
        }, 20);
        obs.disconnect();
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);

  return (
    <span ref={ref} className="font-display text-3xl md:text-4xl font-black text-rose">
      {count}{suffix}
    </span>
  );
}

export default function StatsStrip() {
  return (
    <div className="bg-charcoal py-10 px-[5%]">
      <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-10 md:gap-16">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="text-center"
          >
            <Counter target={s.num} suffix={s.suffix} />
            <div className="text-white/50 text-xs mt-1 font-medium tracking-wide">{s.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
