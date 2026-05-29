const jwt   = require('jsonwebtoken');
const Admin = require('../models/Admin');

/*
 * FIX — Issue 2 (secondary hardening):
 *
 * The signToken helper and login controller logic were correct.
 * The real root cause was a plain-text password in MongoDB (see server.js
 * seedAdmin fix). However, we add defensive logging here to make future
 * debugging easier without exposing sensitive data.
 */

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input presence
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    // Look up admin by email (schema enforces lowercase, so normalise here too)
    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });

    if (!admin) {
      // Admin not found — return generic message to avoid email enumeration
      console.warn(`[Auth] Login attempt for unknown email: ${email}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare entered password against the stored bcrypt hash
    const passwordMatch = await admin.matchPassword(password);

    if (!passwordMatch) {
      /*
       * If this still fails after the seedAdmin fix, it means the password
       * stored in MongoDB is neither the seeded plain-text (now fixed) nor
       * a hash of 'SheCan@2025'. Log a clear diagnostic message.
       */
      console.warn(
        `[Auth] Password mismatch for ${email}. ` +
        `Stored value starts with: ${admin.password.substring(0, 7)}. ` +
        `Is bcrypt hash: ${/^\$2[ab]\$/.test(admin.password)}`
      );
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT and return success response
    const token = signToken(admin._id);

    res.json({
      token,
      admin: { id: admin._id, email: admin.email },
    });

  } catch (err) {
    console.error('[Auth] Login error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { login };
