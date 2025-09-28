# 📚 Lesson Plan AI Generator

A full-stack web application that uses AI to generate professional lesson plans and export them as PDF documents. Built with Node.js, Express, and vanilla HTML/CSS/JavaScript.

## ✨ Features

- 🤖 **AI-Powered Generation**: Uses OpenAI GPT models to create comprehensive lesson plans
- 📝 **Professional Format**: Generates lesson plans in structured HTML table format
- 📄 **PDF Export**: Download lesson plans as print-ready PDF documents
- 🎨 **Modern UI**: Clean, responsive design with intuitive form interface
- ⚡ **Fast & Secure**: Optimized performance with rate limiting and security middleware
- 🧪 **Sample Data**: Quick-fill sample data for testing and demonstration

## 🏗️ Project Structure

```
lesson-plan-ai/
│── backend/
│   ├── server.js          # Express server setup
│   ├── routes/
│   │   └── generate.js    # API endpoints for generation and PDF
│   ├── services/
│   │   └── openai.js      # OpenAI API integration
│   ├── utils/
│   │   └── pdf.js         # PDF generation utility
│   ├── package.json       # Backend dependencies
│
│── frontend/
│   ├── index.html         # Main application interface
│   ├── styles.css         # Modern CSS styling
│   ├── app.js             # Frontend JavaScript logic
│
│── .env                   # Environment variables (API keys)
│── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. **Clone and navigate to the project directory:**
   ```bash
   cd lesson-plan-ai
   ```

2. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   cd ..
   ```

3. **Configure environment variables:**
   ```bash
   cp .env .env.local  # Create a copy for local development
   ```

   Edit `.env` with your API key:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=3000
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Start the application:**
   ```bash
   cd backend
   npm start
   ```

5. **Open your browser:**
   Navigate to `http://localhost:3000`

## 📖 Usage

### Creating a Lesson Plan

1. **Fill out the form** with your lesson details:
   - School information (name, teacher, term, date)
   - Subject and class details
   - Unit and lesson information
   - Learning objectives and materials

2. **Click "Generate Lesson Plan"** to create your AI-powered lesson plan

3. **Review the generated content** in the results section

4. **Download as PDF** for printing or sharing

### Using Sample Data

Click the "Fill Sample Data" button to populate the form with example information for quick testing.

## 🔧 API Endpoints

### POST `/api/generate/lesson-plan`
Generate a lesson plan using AI.

**Request Body:**
```json
{
  "schoolName": "Springfield Elementary",
  "teacherName": "John Smith",
  "subject": "Mathematics",
  "className": "Grade 5A",
  "unitTitle": "Fractions and Decimals",
  "lessonTitle": "Understanding Equivalent Fractions",
  "instructionalObjective": "Students will be able to identify equivalent fractions",
  // ... other fields
}
```

**Response:**
```json
{
  "success": true,
  "html": "<table class=\"lp-table\">...</table>",
  "usage": { "tokens": 1500 }
}
```

### POST `/api/generate/pdf`
Generate a PDF from HTML content.

**Request Body:**
```json
{
  "html": "<table>...</table>",
  "lessonData": { /* lesson information */ }
}
```

### GET `/api/generate/test`
Get sample data for testing.

### GET `/api/health`
Check server health status.

## 🛠️ Development

### Backend Development

```bash
cd backend
npm run dev  # Uses nodemon for auto-restart
```

### Project Structure Details

- **server.js**: Express server with middleware, CORS, security
- **routes/generate.js**: API endpoints for lesson plan and PDF generation
- **services/openai.js**: OpenAI API integration with error handling
- **utils/pdf.js**: PDF generation using Puppeteer

### Frontend Development

The frontend is built with vanilla HTML/CSS/JavaScript:
- **index.html**: Form interface with all lesson plan fields
- **styles.css**: Modern, responsive styling with print support
- **app.js**: Form handling, API calls, and PDF download

## 🚀 Deployment

### Backend Deployment (Vercel)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel --prod
   ```

3. **Set environment variables** in Vercel dashboard:
   - `OPENAI_API_KEY`
   - `NODE_ENV=production`

### Backend Deployment (Render)

1. **Connect your repository** to Render
2. **Set build command:**
   ```bash
   cd backend && npm install
   ```
3. **Set start command:**
   ```bash
   npm start
   ```

### Frontend Deployment

The frontend is static and can be deployed to:
- **Netlify**: Drag and drop the `frontend/` folder
- **Vercel**: Connect the root directory and set output to `frontend`
- **GitHub Pages**: Push to a repository and enable Pages

## 🔒 Security Features

- **Rate Limiting**: Prevents API abuse (100 requests per 15 minutes)
- **CORS Protection**: Configured for production domains
- **Input Validation**: Server-side validation of all inputs
- **HTML Sanitization**: Removes potentially dangerous content
- **Environment Variables**: API keys stored securely

## 📝 Required Fields

The following fields are required for lesson plan generation:
- School Name
- Teacher Name
- Subject
- Class Name
- Unit Title
- Lesson Title
- Instructional Objective

## 🎯 Sample Lesson Plan Fields

```javascript
{
  schoolName: "Springfield Elementary School",
  teacherName: "John Smith",
  term: "Fall 2024",
  date: "2024-01-15",
  subject: "Mathematics",
  className: "Grade 5A",
  unitNo: "3",
  lessonNo: "2",
  duration: "45 minutes",
  classSize: "25 students",
  specialNeeds: "2 students with learning disabilities",
  unitTitle: "Fractions and Decimals",
  keyCompetence: "Problem-solving and critical thinking",
  lessonTitle: "Understanding Equivalent Fractions",
  instructionalObjective: "Students will be able to identify and create equivalent fractions",
  location: "Classroom 101",
  materials: "Fraction bars, worksheets, whiteboard",
  references: "Math textbook pages 45-50"
}
```

## 🆘 Troubleshooting

### Common Issues

1. **"OpenAI API Key not found"**
   - Ensure `OPENAI_API_KEY` is set in `.env`
   - Restart the server after adding the key

2. **PDF generation fails**
   - Ensure Puppeteer has necessary permissions
   - Check disk space for temporary files

3. **CORS errors**
   - Update `CORS_ORIGIN` in `.env` for your domain
   - Restart the server

4. **Port already in use**
   - Change `PORT` in `.env` or kill the process using the port

### Getting Help

- Check the browser console for JavaScript errors
- View server logs in the terminal
- Ensure all dependencies are installed
- Verify your OpenAI API key is valid and has credits

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for educational purposes.

## 🙏 Acknowledgments

- OpenAI for providing the GPT API
- Express.js community for the excellent framework
- Puppeteer team for PDF generation capabilities

---

**Made with ❤️ for educators everywhere**