require('dotenv').config();

const express     = require('express');
const cors        = require('cors');
const helmet      = require('helmet');
const rateLimit   = require('express-rate-limit');
const path        = require('path');

const connectDB   = require('./config/db');
const authRoutes  = require('./routes/auth');
const appRoutes   = require('./routes/applications');
const analyticsRoutes = require('./routes/analytics');
const publicRoutes    = require('./routes/public');
const Admin       = require('./models/Admin');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Connect DB ──────────────────────────────────────────────────────────────
connectDB().then(seedAdmin);

// ── Security Middleware ──────────────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.CLIENT_URL,
  ].filter(Boolean),
  credentials: true,
}));

// Global rate limiter
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
  message: { message: 'Too many requests, please try again later.' },
}));

// Stricter limiter for auth
app.use('/api/auth', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many login attempts.' },
}));

// ── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Static Uploads ────────────────────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth',         authRoutes);
app.use('/api/applications', appRoutes);
app.use('/api/analytics',    analyticsRoutes);
app.use('/api/public',       publicRoutes);

app.get('/', (_req, res) => res.json({ message: '🌸 She Can Foundation API is running' }));

// ── 404 Handler ───────────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ message: 'Route not found' }));

// ── Error Handler ─────────────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Server error' });
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// ── Seed default admin ────────────────────────────────────────────────────────
async function seedAdmin() {
  try {
    const exists = await Admin.findOne({ email: 'admin@shecan.org' });
    if (!exists) {
      await Admin.create({ email: 'admin@shecan.org', password: 'SheCan@2025' });
      console.log('🌱 Default admin seeded — admin@shecan.org / SheCan@2025');
    }
  } catch (err) {
    console.error('Seed error:', err.message);
  }
}
