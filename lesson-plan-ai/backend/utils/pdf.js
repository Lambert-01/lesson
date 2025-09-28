class PDFGenerator {
  async generatePDFFromHTML(htmlContent, options = {}) {
    let browser;
    try {
      // Check if puppeteer is available
      let puppeteer;
      try {
        puppeteer = require('puppeteer');
      } catch (error) {
        console.warn('⚠️  Puppeteer not available, PDF generation disabled');
        return {
          success: false,
          error: 'Puppeteer not installed. Please run: npm install puppeteer'
        };
      }

      // Try to launch browser with multiple fallback strategies
      let launchOptions = {
        headless: 'new',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-gpu',
          '--disable-web-security'
        ]
      };

      // Try different executable paths
      try {
        browser = await puppeteer.launch(launchOptions);
      } catch (error) {
        console.log('Attempting to find Chrome in common locations...');

        // Try common Chrome installation paths
        const commonPaths = [
          'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
          'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
          process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe',
          process.env.PROGRAMFILES + '\\Google\\Chrome\\Application\\chrome.exe',
          process.env['PROGRAMFILES(X86)'] + '\\Google\\Chrome\\Application\\chrome.exe'
        ];

        let browserLaunched = false;
        for (const path of commonPaths) {
          if (require('fs').existsSync(path)) {
            console.log('Found Chrome at:', path);
            launchOptions.executablePath = path;
            try {
              browser = await puppeteer.launch(launchOptions);
              browserLaunched = true;
              break;
            } catch (e) {
              console.log('Failed to launch Chrome from:', path);
            }
          }
        }

        if (!browserLaunched) {
          throw new Error('Could not find Chrome. Please install Chrome or run: npx puppeteer browsers install chrome');
        }
      }

      const page = await browser.newPage();

      // Set content with print-optimized styles
      await page.setContent(this.getHTMLWithStyles(htmlContent), {
        waitUntil: 'networkidle0'
      });

      // Generate PDF with print-optimized settings
      const pdfBuffer = await page.pdf({
        format: options.format || 'A4',
        printBackground: true,
        margin: {
          top: '20px',
          right: '20px',
          bottom: '20px',
          left: '20px'
        },
        preferCSSPageSize: true,
        displayHeaderFooter: false
      });

      return {
        success: true,
        buffer: pdfBuffer
      };

    } catch (error) {
      console.error('PDF Generation Error:', error);

      // If browser was launched, close it
      if (browser) {
        try {
          await browser.close();
        } catch (closeError) {
          console.error('Error closing browser:', closeError);
        }
      }

      return {
        success: false,
        error: error.message
      };
    }
  }

  getHTMLWithStyles(htmlContent) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Lesson Plan</title>
        <style>
          @page {
            size: A4;
            margin: 2cm;
          }

          body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 12pt;
            line-height: 1.4;
            color: #000;
            margin: 0;
            padding: 0;
          }

          .lp-table {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0;
          }

          .lp-table td, .lp-table th {
            border: 1px solid #000;
            padding: 8px;
            vertical-align: top;
          }

          .lp-table th {
            background-color: #f0f0f0;
            font-weight: bold;
          }

          .header-section {
            text-align: center;
            margin-bottom: 20px;
          }

          .section-title {
            background-color: #e0e0e0;
            font-weight: bold;
            font-size: 14pt;
          }

          .objective {
            margin: 10px 0;
          }

          .activity {
            margin: 15px 0;
          }

          .timing {
            font-weight: bold;
            color: #333;
          }

          .materials-list {
            margin: 5px 0;
          }

          .assessment {
            background-color: #f9f9f9;
            padding: 10px;
            margin: 10px 0;
          }

          .reflection {
            border-top: 2px solid #000;
            margin-top: 20px;
            padding-top: 10px;
          }

          @media print {
            body { -webkit-print-color-adjust: exact; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
      </html>
    `;
  }

  async generateLessonPlanPDF(lessonData, htmlContent) {
    const options = {
      format: 'A4',
      filename: `lesson-plan-${lessonData.subject || 'subject'}-${lessonData.date || 'date'}.pdf`
    };

    return await this.generatePDFFromHTML(htmlContent, options);
  }
}

module.exports = new PDFGenerator();