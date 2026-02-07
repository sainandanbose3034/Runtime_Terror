const admin = require('firebase-admin');

// Ensure you set these environment variables in your .env or deployment platform
// For local development, you might point to a serviceAccountKey.json file
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

        // Handle newline escaping issues in environment variables
        if (serviceAccount.private_key) {
            serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
        }

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    } catch (error) {
        console.error("Error initializing Firebase:", error);
    }
} else {
    // Fallback or explicit error handling if credentials are missing
    console.warn("Firebase Service Account credentials not found in environment variables.");
}

module.exports = admin;
