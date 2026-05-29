const Application = require('../models/Application');
const crypto = require('crypto');

/**
 * Lightweight rule-based AI categoriser.
 * Analyses skills + message text to assign a category.
 */
const categorise = (skills = '', message = '') => {
  const text = `${skills} ${message}`.toLowerCase();

  if (/react|node|mern|express|mongodb|full.?stack|next\.?js|vue|angular/.test(text))
    return 'Full Stack';

  if (/machine.?learning|ml|ai|python|tensorflow|pytorch|data.?science|nlp|deep.?learning/.test(text))
    return 'AI Engineer';

  if (/figma|ui\/?ux|design|sketch|adobe|prototype|wireframe|canva|illustration/.test(text))
    return 'UI/UX';

  if (/marketing|social.?media|content|outreach|campaign|seo|brand|instagram|linkedin/.test(text))
    return 'Outreach';

  return 'General';
};

// POST /api/applications
const createApplication = async (req, res) => {
  try {
    const {
      firstName, lastName, email, phone, college,
      skills, linkedIn, areaOfInterest, experienceLevel, message,
    } = req.body;

    const resumePath = req.file ? req.file.filename : null;
    const category   = categorise(skills, message);
    const applicationId = 'APP-' + crypto.randomBytes(4).toString('hex').toUpperCase();

    const application = await Application.create({
      firstName, lastName, email, phone, college,
      skills, linkedIn, resumePath,
      areaOfInterest, experienceLevel, message,
      category,
      applicationId,
    });

    res.status(201).json({ success: true, data: application });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: err.message });
  }
};

// GET /api/applications
const getApplications = async (req, res) => {
  try {
    const { search, category } = req.query;
    const filter = {};

    if (category && category !== 'All') filter.category = category;

    if (search) {
      const re = new RegExp(search, 'i');
      filter.$or = [
        { firstName: re }, { lastName: re },
        { email: re }, { college: re }, { skills: re },
      ];
    }

    const applications = await Application.find(filter).sort({ createdAt: -1 });

    // Analytics
    const total     = await Application.countDocuments();
    const fullStack = await Application.countDocuments({ category: 'Full Stack' });
    const aiEng     = await Application.countDocuments({ category: 'AI Engineer' });
    const uiux      = await Application.countDocuments({ category: 'UI/UX' });
    const outreach  = await Application.countDocuments({ category: 'Outreach' });

    res.json({
      success: true,
      data: applications,
      analytics: { total, fullStack, aiEng, uiux, outreach },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/applications/:id
const getApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ message: 'Not found' });
    res.json({ success: true, data: application });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/applications/:id
const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);
    if (!application) return res.status(404).json({ message: 'Not found' });
    res.json({ success: true, message: 'Application deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/applications/:id/status
const updateApplicationStatus = async (req, res) => {
  try {
    const { status, interviewDate, interviewTime, meetingLink, joiningInstructions } = req.body;
    if (!['Pending', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const updateFields = { status };
    if (interviewDate !== undefined) updateFields.interviewDate = interviewDate;
    if (interviewTime !== undefined) updateFields.interviewTime = interviewTime;
    if (meetingLink !== undefined) updateFields.meetingLink = meetingLink;
    if (joiningInstructions !== undefined) updateFields.joiningInstructions = joiningInstructions;

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );
    if (!application) return res.status(404).json({ message: 'Not found' });
    res.json({ success: true, data: application });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createApplication, getApplications, getApplication, deleteApplication, updateApplicationStatus };
