const Application = require('../models/Application');

// POST /api/public/status
const checkStatus = async (req, res) => {
  try {
    const { applicationId, email } = req.body;
    if (!applicationId || !email) {
      return res.status(400).json({ message: 'Application ID and Email are required.' });
    }

    const application = await Application.findOne({
      applicationId: applicationId.toUpperCase(),
      email: email.toLowerCase()
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found with the provided details.' });
    }

    // Return limited fields for security
    const result = {
      firstName: application.firstName,
      lastName: application.lastName,
      areaOfInterest: application.areaOfInterest,
      status: application.status,
      createdAt: application.createdAt,
      interviewDate: application.interviewDate,
      interviewTime: application.interviewTime,
      meetingLink: application.meetingLink,
      joiningInstructions: application.joiningInstructions
    };

    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { checkStatus };
