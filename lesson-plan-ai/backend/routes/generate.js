const express = require('express');
const router = express.Router();
const openaiService = require('../services/openai');
const pdfGenerator = require('../utils/pdf');

// POST /api/generate/lesson-plan
router.post('/lesson-plan', async (req, res) => {
  try {
    const lessonData = req.body;

    // Validate required fields
    const requiredFields = [
      'schoolName', 'teacherName', 'subject', 'className',
      'unitTitle', 'lessonTitle', 'instructionalObjective'
    ];

    const missingFields = requiredFields.filter(field => !lessonData[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: 'Missing required fields',
        missingFields: missingFields,
        message: 'Please provide all required lesson plan information'
      });
    }

    console.log('📝 Generating lesson plan for:', lessonData.lessonTitle);

    // Generate lesson plan using OpenAI
    const result = await openaiService.generateLessonPlan(lessonData);

    if (result.success) {
      console.log('✅ Lesson plan generated successfully');

      res.json({
        success: true,
        html: result.html,
        usage: result.usage,
        message: 'Lesson plan generated successfully'
      });
    } else {
      console.warn('⚠️  Lesson plan generation failed, using fallback');

      res.status(500).json({
        success: false,
        html: result.html,
        error: result.error,
        message: 'Lesson plan generation failed, using fallback template'
      });
    }

  } catch (error) {
    console.error('❌ Error in lesson plan generation:', error);

    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to generate lesson plan',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// POST /api/generate/pdf
router.post('/pdf', async (req, res) => {
  try {
    const { html, lessonData } = req.body;

    if (!html) {
      return res.status(400).json({
        error: 'Missing HTML content',
        message: 'Please provide HTML content to convert to PDF'
      });
    }

    console.log('📄 Generating PDF...');

    // Generate PDF from HTML
    const pdfResult = await pdfGenerator.generateLessonPlanPDF(lessonData, html);

    if (pdfResult.success) {
      console.log('✅ PDF generated successfully');

      // Set appropriate headers for PDF download
      const filename = `lesson-plan-${lessonData?.subject || 'subject'}-${lessonData?.date || 'date'}.pdf`;

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', pdfResult.buffer.length);

      // Send PDF buffer
      res.send(pdfResult.buffer);

    } else {
      console.error('❌ PDF generation failed:', pdfResult.error);

      res.status(500).json({
        error: 'PDF generation failed',
        message: 'Failed to generate PDF document',
        details: pdfResult.error
      });
    }

  } catch (error) {
    console.error('❌ Error in PDF generation:', error);

    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to generate PDF',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/generate/test
router.get('/test', (req, res) => {
  const sampleData = {
    schoolName: 'Springfield Elementary School',
    teacherName: 'John Smith',
    term: 'Fall 2024',
    date: '2024-01-15',
    subject: 'Mathematics',
    className: 'Grade 5A',
    unitNo: '3',
    lessonNo: '2',
    duration: '45 minutes',
    classSize: '25 students',
    specialNeeds: '2 students with learning disabilities',
    unitTitle: 'Fractions and Decimals',
    keyCompetence: 'Problem-solving and critical thinking',
    lessonTitle: 'Understanding Equivalent Fractions',
    instructionalObjective: 'Students will be able to identify and create equivalent fractions',
    location: 'Classroom 101',
    materials: 'Fraction bars, worksheets, whiteboard',
    references: 'Math textbook pages 45-50'
  };

  res.json({
    message: 'Test endpoint working',
    sampleData: sampleData,
    instructions: 'Use this sample data to test the lesson plan generation'
  });
});

module.exports = router;