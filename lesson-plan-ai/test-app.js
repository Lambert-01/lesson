// Simple test script to verify the application structure
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Lesson Plan AI Generator Application Structure...\n');

// Test 1: Check if all required files exist
const requiredFiles = [
    'backend/server.js',
    'backend/routes/generate.js',
    'backend/services/openai.js',
    'backend/utils/pdf.js',
    'backend/package.json',
    'frontend/index.html',
    'frontend/styles.css',
    'frontend/app.js',
    '.env',
    'README.md'
];

let allFilesExist = true;

requiredFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        console.log('✅', file);
    } else {
        console.log('❌', file, '(MISSING)');
        allFilesExist = false;
    }
});

// Test 2: Check package.json structure
console.log('\n📦 Testing package.json...');
try {
    const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'backend/package.json'), 'utf8'));
    const requiredDeps = ['express', 'openai', 'puppeteer', 'cors', 'dotenv'];

    requiredDeps.forEach(dep => {
        if (packageJson.dependencies && packageJson.dependencies[dep]) {
            console.log('✅', dep, 'dependency found');
        } else {
            console.log('❌', dep, 'dependency missing');
            allFilesExist = false;
        }
    });
} catch (error) {
    console.log('❌ Could not read package.json:', error.message);
    allFilesExist = false;
}

// Test 3: Check HTML structure
console.log('\n🌐 Testing HTML structure...');
try {
    const html = fs.readFileSync(path.join(__dirname, 'frontend/index.html'), 'utf8');
    const requiredElements = ['lessonPlanForm', 'schoolName', 'teacherName', 'generateBtn'];

    requiredElements.forEach(element => {
        if (html.includes(`id="${element}"`)) {
            console.log('✅', element, 'element found');
        } else {
            console.log('❌', element, 'element missing');
            allFilesExist = false;
        }
    });
} catch (error) {
    console.log('❌ Could not read index.html:', error.message);
    allFilesExist = false;
}

// Test 4: Check if .env has required variables
console.log('\n🔐 Testing .env configuration...');
try {
    const env = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
    const requiredEnvVars = ['OPENAI_API_KEY', 'PORT', 'NODE_ENV'];

    requiredEnvVars.forEach(envVar => {
        if (env.includes(envVar + '=')) {
            console.log('✅', envVar, 'environment variable configured');
        } else {
            console.log('⚠️', envVar, 'environment variable not found (this is normal)');
        }
    });
} catch (error) {
    console.log('❌ Could not read .env:', error.message);
    allFilesExist = false;
}

// Summary
console.log('\n' + '='.repeat(50));
if (allFilesExist) {
    console.log('🎉 All tests passed! Application structure is correct.');
    console.log('\n📋 Next steps to run the application:');
    console.log('1. Add your OpenAI API key to .env file');
    console.log('2. Run: cd backend && npm install');
    console.log('3. Run: cd backend && npm start');
    console.log('4. Open: http://localhost:3000');
} else {
    console.log('❌ Some tests failed. Please check the errors above.');
}
console.log('='.repeat(50));