const axios = require('axios');

// ─── @route  POST /api/career/analyze ────────────────────────────────────────
// ─── @access Private/Student ─────────────────────────────────────────────────
const analyzeResume = async (req, res) => {
  try {
    const { resumeText } = req.body;

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({
        message: 'Resume text must be at least 50 characters.',
      });
    }

    const response = await axios.post(
      'https://runtime.codewords.ai/run/career_coach_resume_analyzer_a95ed21f',
      { resume_text: resumeText },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.CAREER_COACH_API_KEY}`,
        },
        timeout: 120000,
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json({
        message: error.response.data?.message || 'Career coach API error.',
      });
    }
    res.status(500).json({ message: 'Failed to analyze resume. Please try again.' });
  }
};

module.exports = { analyzeResume };