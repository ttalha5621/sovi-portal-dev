const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting SoVI Backend Setup...\n');

// Check if .env exists
if (!fs.existsSync('.env')) {
    console.log('📝 Creating .env file from .env.example...');
    fs.copyFileSync('.env.example', '.env');
}

// Install dependencies if node_modules doesn't exist
if (!fs.existsSync('node_modules')) {
    console.log('📦 Installing dependencies...');
    execSync('npm install', { stdio: 'inherit' });
}

// Generate Prisma client
console.log('🔧 Generating Prisma client...');
try {
    execSync('npx prisma generate', { stdio: 'inherit' });
} catch (error) {
    console.log('⚠️  Prisma generate failed, but continuing...');
}

// Start the development server
console.log('🎯 Starting development server...');
execSync('npm run dev', { stdio: 'inherit' });