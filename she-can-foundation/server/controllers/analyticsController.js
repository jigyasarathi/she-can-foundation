const Application = require('../models/Application');

// GET /api/analytics/charts
const getAnalyticsCharts = async (req, res) => {
  try {
    // 1. Timeline (Applications per day)
    const timeline = await Application.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 30 }
    ]);

    // 2. Roles (Pie chart)
    const roles = await Application.aggregate([
      {
        $group: {
          _id: "$areaOfInterest",
          value: { $sum: 1 }
        }
      },
      { $project: { name: "$_id", value: 1, _id: 0 } }
    ]);

    // 3. Status (Bar chart)
    const status = await Application.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      },
      { $project: { name: "$_id", count: 1, _id: 0 } }
    ]);

    // 4. Recent count (Last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentCount = await Application.countDocuments({ createdAt: { $gte: sevenDaysAgo } });

    res.json({ success: true, data: { timeline, roles, status, recentCount } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/analytics/recommendations
const getAIRecommendations = async (req, res) => {
  try {
    // MongoDB Aggregation for AI Match Score
    const recommendations = await Application.aggregate([
      {
        $addFields: {
          // Base score from Experience Level
          expScore: {
            $switch: {
              branches: [
                { case: { $eq: ["$experienceLevel", "Advanced"] }, then: 30 },
                { case: { $eq: ["$experienceLevel", "Intermediate"] }, then: 20 },
                { case: { $eq: ["$experienceLevel", "Beginner"] }, then: 10 }
              ],
              default: 0
            }
          },
          // Keyword score from Skills & Message (checking common valuable skills)
          keywordScore: {
            $let: {
              vars: {
                text: { $toLower: { $concat: ["$skills", " ", { $ifNull: ["$message", ""] }] } }
              },
              in: {
                $sum: [
                  { $cond: [{ $regexMatch: { input: "$$text", regex: /react|next\.js|angular|vue/ } }, 15, 0] },
                  { $cond: [{ $regexMatch: { input: "$$text", regex: /node|express|mongodb|sql/ } }, 15, 0] },
                  { $cond: [{ $regexMatch: { input: "$$text", regex: /python|machine learning|ai|tensorflow/ } }, 20, 0] },
                  { $cond: [{ $regexMatch: { input: "$$text", regex: /ui|ux|figma|design/ } }, 15, 0] },
                  { $cond: [{ $regexMatch: { input: "$$text", regex: /leadership|management|communication/ } }, 10, 0] }
                ]
              }
            }
          }
        }
      },
      {
        $addFields: {
          matchScore: { 
            $min: [ 
              100, 
              { $add: ["$expScore", "$keywordScore", 20] } // 20 base points for applying + college
            ] 
          },
          // Extract top skills blindly by taking the first 3 words/phrases split by comma
          topSkills: {
            $slice: [
              { $split: ["$skills", ","] },
              3
            ]
          }
        }
      },
      {
        $sort: { matchScore: -1 }
      },
      {
        $limit: 5
      },
      {
        $project: {
          firstName: 1,
          lastName: 1,
          areaOfInterest: 1,
          matchScore: 1,
          topSkills: 1,
          resumePath: 1,
          email: 1
        }
      }
    ]);

    // Trim whitespace from topSkills
    const cleanedRecommendations = recommendations.map(app => ({
      ...app,
      topSkills: app.topSkills.map(s => s.trim())
    }));

    res.json({ success: true, data: cleanedRecommendations });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAnalyticsCharts, getAIRecommendations };
