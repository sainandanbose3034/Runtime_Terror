var mongoose = require('mongoose');
require('dotenv').config();
require('dns').setServers(['8.8.8.8']);

const uri = process.env.MONGODB_URI;

console.log('Testing MongoDB connection with Google DNS...');

mongoose.connect(uri)
    .then(() => {
        console.log('SUCCESS: Connected to MongoDB!');
        process.exit(0);
    })
    .catch(err => {
        console.error('CONNECTION FAILED:', err);
        process.exit(1);
    });
