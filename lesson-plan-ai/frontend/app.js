class LessonPlanGenerator {
    constructor() {
        this.form = document.getElementById('lessonPlanForm');
        this.generateBtn = document.getElementById('generateBtn');
        this.fillSampleBtn = document.getElementById('fillSampleData');
        this.downloadPdfBtn = document.getElementById('downloadPdfBtn');
        this.loadingSection = document.getElementById('loadingSection');
        this.resultSection = document.getElementById('resultSection');
        this.errorSection = document.getElementById('errorSection');
        this.retryBtn = document.getElementById('retryBtn');

        this.lessonPlanResult = document.getElementById('lessonPlanResult');
        this.errorText = document.getElementById('errorText');

        this.API_BASE_URL = window.location.origin + '/api';

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupFormValidation();
    }

    setupEventListeners() {
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleFormSubmit(e));

        // Fill sample data
        this.fillSampleBtn.addEventListener('click', () => this.fillSampleData());

        // Download PDF
        this.downloadPdfBtn.addEventListener('click', () => this.downloadPDF());

        // Retry button
        this.retryBtn.addEventListener('click', () => this.showForm());
    }

    setupFormValidation() {
        const requiredFields = ['schoolName', 'teacherName', 'subject', 'className', 'unitTitle', 'lessonTitle', 'instructionalObjective'];

        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            field.addEventListener('blur', () => this.validateField(field));
        });
    }

    validateField(field) {
        const errorElement = field.parentNode.querySelector('.error-message');
        if (field.hasAttribute('required') && !field.value.trim()) {
            this.showFieldError(field, 'This field is required');
            return false;
        }
        this.clearFieldError(field);
        return true;
    }

    showFieldError(field, message) {
        this.clearFieldError(field);
        const errorElement = document.createElement('small');
        errorElement.className = 'error-message';
        errorElement.style.color = '#dc3545';
        errorElement.textContent = message;
        field.parentNode.appendChild(errorElement);
        field.style.borderColor = '#dc3545';
    }

    clearFieldError(field) {
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
        field.style.borderColor = '';
    }

    async handleFormSubmit(e) {
        e.preventDefault();

        // Validate form
        const formData = new FormData(this.form);
        const lessonData = Object.fromEntries(formData);

        if (!this.validateForm()) {
            return;
        }

        this.showLoading();
        this.generateBtn.disabled = true;

        try {
            const response = await fetch(`${this.API_BASE_URL}/generate/lesson-plan`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(lessonData)
            });

            const result = await response.json();

            if (response.ok && result.success) {
                this.showResult(result.html, lessonData);
            } else {
                this.showError(result.error || 'Failed to generate lesson plan', result.message);
            }

        } catch (error) {
            console.error('Error:', error);
            this.showError('Network Error', 'Please check if the backend server is running');
        } finally {
            this.generateBtn.disabled = false;
        }
    }

    validateForm() {
        const requiredFields = ['schoolName', 'teacherName', 'subject', 'className', 'unitTitle', 'lessonTitle', 'instructionalObjective'];
        let isValid = true;

        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    showLoading() {
        this.form.style.display = 'none';
        this.loadingSection.style.display = 'block';
        this.resultSection.style.display = 'none';
        this.errorSection.style.display = 'none';
    }

    showForm() {
        this.form.style.display = 'block';
        this.loadingSection.style.display = 'none';
        this.resultSection.style.display = 'none';
        this.errorSection.style.display = 'none';
    }

    showResult(html, lessonData) {
        this.form.style.display = 'none';
        this.loadingSection.style.display = 'none';
        this.resultSection.style.display = 'block';
        this.errorSection.style.display = 'none';

        // Store lesson data for PDF generation
        this.currentLessonData = lessonData;

        // Insert the generated HTML
        this.lessonPlanResult.innerHTML = html;

        // Scroll to result
        this.resultSection.scrollIntoView({ behavior: 'smooth' });
    }

    showError(title, message) {
        this.form.style.display = 'none';
        this.loadingSection.style.display = 'none';
        this.resultSection.style.display = 'none';
        this.errorSection.style.display = 'block';

        this.errorText.textContent = `${title}: ${message}`;

        // Scroll to error
        this.errorSection.scrollIntoView({ behavior: 'smooth' });
    }

    async downloadPDF() {
        if (!this.currentLessonData) {
            this.showError('No Data', 'Please generate a lesson plan first');
            return;
        }

        try {
            this.downloadPdfBtn.disabled = true;
            this.downloadPdfBtn.textContent = 'Generating PDF...';

            const response = await fetch(`${this.API_BASE_URL}/generate/pdf`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    html: this.lessonPlanResult.innerHTML,
                    lessonData: this.currentLessonData
                })
            });

            if (!response.ok) {
                throw new Error('Failed to generate PDF');
            }

            // Create download link
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;

            // Generate filename
            const subject = this.currentLessonData.subject || 'subject';
            const date = this.currentLessonData.date || new Date().toISOString().split('T')[0];
            const filename = `lesson-plan-${subject}-${date}.pdf`;

            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            this.downloadPdfBtn.textContent = 'Download as PDF';

        } catch (error) {
            console.error('PDF Download Error:', error);
            this.showError('PDF Error', 'Failed to download PDF. Please try again.');
        } finally {
            this.downloadPdfBtn.disabled = false;
        }
    }

    fillSampleData() {
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
            instructionalObjective: 'Students will be able to identify and create equivalent fractions using visual models and explain their reasoning',
            location: 'Classroom 101',
            materials: 'Fraction bars, worksheets, whiteboard markers, visual aids',
            references: 'Math textbook pages 45-50, online fraction games'
        };

        Object.keys(sampleData).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                element.value = sampleData[key];
            }
        });

        // Show success message
        this.showTemporaryMessage('Sample data filled! Click Generate to create the lesson plan.', 'success');
    }

    showTemporaryMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `temp-message ${type}`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 6px;
            color: white;
            font-weight: 600;
            z-index: 1000;
            animation: slideIn 0.3s ease;
            ${type === 'success' ? 'background: #28a745;' : 'background: #17a2b8;'}
        `;

        document.body.appendChild(messageDiv);

        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LessonPlanGenerator();
});

// Add CSS animation for temporary messages
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(style);