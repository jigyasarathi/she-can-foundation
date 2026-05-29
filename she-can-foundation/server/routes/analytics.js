const express = require('express');
const { getAnalyticsCharts, getAIRecommendations } = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/charts', protect, getAnalyticsCharts);
router.get('/recommendations', protect, getAIRecommendations);

module.exports = router;
