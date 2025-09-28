const path = require('path');

class OpenAIService {
  constructor() {
    this.apiKey = null;

    // Try to load environment variables
    try {
      require('dotenv').config({ path: path.join(__dirname, '../.env') });
      this.apiKey = process.env.OPENAI_API_KEY;
    } catch (error) {
      console.warn('⚠️  Could not load dotenv, trying manual env loading');
    }

    if (!this.apiKey) {
      console.warn('⚠️  OPENAI_API_KEY not found in environment variables');
    }
  }

  getClient() {
    // Try to load OpenAI module
    try {
      const OpenAI = require('openai');
      if (!this.apiKey) {
        throw new Error('OpenAI API key not configured. Please set OPENAI_API_KEY in your .env file.');
      }

      // Check if this is an OpenRouter key (starts with sk-or-)
      const isOpenRouter = this.apiKey.startsWith('sk-or-');

      if (isOpenRouter) {
        // Configure for OpenRouter
        return new OpenAI({
          baseURL: "https://openrouter.ai/api/v1",
          apiKey: this.apiKey,
        });
      } else {
        // Configure for standard OpenAI
        return new OpenAI({
          apiKey: this.apiKey,
        });
      }
    } catch (error) {
      if (error.code === 'MODULE_NOT_FOUND') {
        throw new Error('OpenAI module not installed. Please run: npm install openai');
      }
      throw error;
    }
  }

  async generateLessonPlan(lessonData) {
    try {
      // Check if we have a valid API key
      if (!this.apiKey) {
        console.warn('⚠️  No OpenAI API key found, using fallback lesson plan');
        return {
          success: false,
          html: this.getFallbackLessonPlan(lessonData),
          error: 'OpenAI API key not configured'
        };
      }

      const client = this.getClient();
      const prompt = this.buildPrompt(lessonData);

      // Use different models based on the API provider
      const isOpenRouter = this.apiKey.startsWith('sk-or-');
      const model = isOpenRouter ? 'x-ai/grok-4-fast:free' : 'gpt-3.5-turbo';

      const response = await client.chat.completions.create({
        model: model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert educational consultant specializing in creating detailed, professional lesson plans. Generate lesson plans in HTML table format with proper structure and formatting.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      });

      const generatedContent = response.choices[0].message.content;

      // Sanitize the HTML content
      const sanitizedContent = this.sanitizeHTML(generatedContent);

      return {
        success: true,
        html: sanitizedContent,
        usage: response.usage
      };

    } catch (error) {
      console.error('OpenAI API Error:', error);

      // Return a fallback lesson plan if API fails
      return {
        success: false,
        html: this.getFallbackLessonPlan(lessonData),
        error: error.message
      };
    }
  }

  buildPrompt(lessonData) {
    return `
Create a professional lesson plan in HTML table format with the following details:

School Information:
- School Name: ${lessonData.schoolName}
- Teacher Name: ${lessonData.teacherName}
- Term: ${lessonData.term}
- Date: ${lessonData.date}
- Subject: ${lessonData.subject}
- Class: ${lessonData.className}
- Unit No: ${lessonData.unitNo}
- Lesson No: ${lessonData.lessonNo}
- Duration: ${lessonData.duration}
- Class Size: ${lessonData.classSize}
- Special Needs: ${lessonData.specialNeeds || 'None specified'}

Lesson Details:
- Unit Title: ${lessonData.unitTitle}
- Key Competence: ${lessonData.keyCompetence}
- Lesson Title: ${lessonData.lessonTitle}
- Instructional Objective: ${lessonData.instructionalObjective}
- Location: ${lessonData.location}
- Materials: ${lessonData.materials}
- References: ${lessonData.references}

Please create a comprehensive lesson plan with the following structure in HTML table format:

1. Header section with school and lesson information
2. Learning objectives
3. Materials and resources
4. Introduction/Warm-up activities
5. Main activities (with timing)
6. Assessment methods
7. Conclusion/Plenary
8. Homework/Extension activities
9. Teacher reflection notes

Format the entire response as a single HTML table with class "lp-table" and ensure it's well-structured for both screen viewing and printing. Use appropriate styling classes for different sections.

Return only the HTML table content, no additional text or explanations.
    `;
  }

  sanitizeHTML(html) {
    // Remove script tags and other potentially dangerous content
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '');
  }

  getFallbackLessonPlan(lessonData) {
    return `
      <table class="lp-table" border="1" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td colspan="2" style="text-align: center; background-color: #f0f0f0;">
            <h2>Lesson Plan</h2>
          </td>
        </tr>
        <tr>
          <td><strong>School:</strong></td>
          <td>${lessonData.schoolName || 'N/A'}</td>
        </tr>
        <tr>
          <td><strong>Teacher:</strong></td>
          <td>${lessonData.teacherName || 'N/A'}</td>
        </tr>
        <tr>
          <td><strong>Subject:</strong></td>
          <td>${lessonData.subject || 'N/A'}</td>
        </tr>
        <tr>
          <td><strong>Lesson Title:</strong></td>
          <td>${lessonData.lessonTitle || 'N/A'}</td>
        </tr>
        <tr>
          <td><strong>Duration:</strong></td>
          <td>${lessonData.duration || 'N/A'}</td>
        </tr>
        <tr>
          <td colspan="2" style="text-align: center; background-color: #e0e0e0;">
            <p><em>Note: This is a fallback lesson plan. Please check your OpenAI API configuration to generate a complete AI-powered lesson plan.</em></p>
          </td>
        </tr>
      </table>
    `;
  }
}

module.exports = new OpenAIService();