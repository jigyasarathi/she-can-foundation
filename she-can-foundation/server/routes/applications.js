const express = require('express');
const {
  createApplication,
  getApplications,
  getApplication,
  deleteApplication,
  updateApplicationStatus,
} = require('../controllers/applicationController');
const { protect } = require('../middleware/auth');
const upload      = require('../middleware/upload');

const router = express.Router();

router.post('/',    upload.single('resume'), createApplication);
router.get('/',     protect, getApplications);
router.get('/:id',  protect, getApplication);
router.patch('/:id/status', protect, updateApplicationStatus);
router.delete('/:id', protect, deleteApplication);

module.exports = router;
