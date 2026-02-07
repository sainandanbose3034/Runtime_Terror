const fs = require('fs');
const path = require('path');

const keyFilePath = process.argv[2];

if (!keyFilePath) {
    console.error('Please provide the path to your Firebase service account JSON file.');
    console.log('Usage: node scripts/setup-firebase.js <path-to-json-file>');
    process.exit(1);
}

try {
    // Read and minify the JSON
    const rawData = fs.readFileSync(keyFilePath, 'utf8');
    const minifiedJson = JSON.stringify(JSON.parse(rawData));

    // Path to .env
    const envPath = path.join(__dirname, '..', '.env');
    
    // Read existing .env
    let envContent = '';
    if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, 'utf8');
    }

    // Check if valid JSON
    JSON.parse(minifiedJson);

    // Append to .env
    // Ensure we start on a new line
    if (envContent.length > 0 && !envContent.endsWith('\n')) {
        envContent += '\n';
    }

    // Check if it already exists to avoid duplicates (simple check)
    if (envContent.includes('FIREBASE_SERVICE_ACCOUNT=')) {
        console.log('FIREBASE_SERVICE_ACCOUNT already exists in .env. Please remove it first if you want to update it.');
    } else {
        const newLine = `FIREBASE_SERVICE_ACCOUNT='${minifiedJson}'\n`;
        fs.appendFileSync(envPath, newLine);
        console.log('✅ Successfully added FIREBASE_SERVICE_ACCOUNT to .env');
    }

} catch (error) {
    console.error('Error:', error.message);
}
