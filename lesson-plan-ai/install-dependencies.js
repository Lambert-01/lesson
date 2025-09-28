// Installation script for Lesson Plan AI Generator
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Installing dependencies for Lesson Plan AI Generator...\n');

try {
  // Change to backend directory
  process.chdir('./backend');

  console.log('📦 Installing backend dependencies...');

  // Install dependencies one by one to avoid npm issues
  const dependencies = [
    'express',
    'dotenv',
    'cors',
    'helmet',
    'express-rate-limit',
    'openai',
    'puppeteer'
  ];

  dependencies.forEach(dep => {
    try {
      console.log(`Installing ${dep}...`);
      execSync(`npm install ${dep}`, { stdio: 'inherit' });
      console.log(`✅ ${dep} installed successfully\n`);
    } catch (error) {
      console.log(`❌ Failed to install ${dep}: ${error.message}\n`);
    }
  });

  console.log('🎉 Dependency installation completed!');
  console.log('\n📋 Next steps:');
  console.log('1. Make sure your .env file has the correct OpenAI API key');
  console.log('2. Run: npm start');
  console.log('3. Open: http://localhost:3000');

} catch (error) {
  console.error('❌ Installation failed:', error.message);
  console.log('\n🔧 Manual installation steps:');
  console.log('cd backend');
  console.log('npm install express dotenv cors helmet express-rate-limit');
  console.log('npm install openai');
  console.log('npm install puppeteer');
}