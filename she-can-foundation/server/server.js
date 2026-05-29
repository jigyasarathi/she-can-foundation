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

// ── Seed / repair default admin ───────────────────────────────────────────────
/*
 * FIX — Issue 2 (root cause):
 *
 * The original seedAdmin only created the admin if NO document existed:
 *   if (!exists) { await Admin.create(...) }
 *
 * The problem: if the admin document was inserted directly into MongoDB Atlas
 * (e.g. via Atlas UI or mongosh), it bypasses Mongoose's pre('save') hook,
 * so the password is stored as PLAIN TEXT — not bcrypt-hashed.
 *
 * When login runs:  bcrypt.compare('SheCan@2025', 'SheCan@2025')
 * bcrypt.compare expects the second argument to be a valid bcrypt hash
 * starting with "$2b$" or "$2a$". A plain-text string fails the comparison
 * and returns false, causing "Invalid credentials" every time.
 *
 * The seedAdmin guard (`if (!exists)`) also prevents the auto-fix from firing
 * because the document already exists — just with an unhashed password.
 *
 * FIX: After finding the existing admin, check if the stored password looks
 * like a bcrypt hash. If it doesn't, re-hash it and save via Mongoose
 * (which triggers the pre('save') hook). This repairs any manually-inserted
 * admin document on the next server start without losing the document.
 */
async function seedAdmin() {
  try {
    const SEED_EMAIL    = 'admin@shecan.org';
    const SEED_PASSWORD = 'SheCan@2025';

    const exists = await Admin.findOne({ email: SEED_EMAIL });

    if (!exists) {
      // No admin at all — create one fresh (pre('save') hook will hash the password)
      await Admin.create({ email: SEED_EMAIL, password: SEED_PASSWORD });
      console.log('🌱 Default admin seeded —', SEED_EMAIL, '/ SheCan@2025');
      return;
    }

    // Admin document exists — check if the password is already a bcrypt hash.
    // All bcrypt hashes start with "$2b$" or "$2a$" and are exactly 60 chars.
    const looksHashed = /^\$2[ab]\$\d+\$/.test(exists.password);

    if (!looksHashed) {
      /*
       * Password is plain text (was inserted directly into MongoDB bypassing
       * Mongoose). Assign the new plain-text value; the pre('save') hook will
       * hash it automatically when we call .save().
       */
      exists.password = SEED_PASSWORD;
      await exists.save(); // triggers pre('save') → bcrypt.hash(password, 12)
      console.log('🔧 Admin password was plain-text — re-hashed and saved successfully.');
    } else {
      console.log('✅ Admin account verified — password is correctly hashed.');
    }
  } catch (err) {
    console.error('Seed/repair error:', err.message);
  }
}
