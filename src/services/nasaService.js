const axios = require('axios');
const { spawn } = require('child_process');
const path = require('path');

const NASA_API_URL = 'https://api.nasa.gov/neo/rest/v1';
const API_KEY = process.env.NASA_API_KEY || 'DEMO_KEY'; // Fallback for dev

const CACHE_DURATION = 60 * 60 * 1000; // 1 hour
let feedCache = {
    data: null,
    timestamp: 0
};

const calculateRiskScores = (nasaData) => {
    return new Promise((resolve, reject) => {
        const scriptPath = path.join(__dirname, '../../safe_score.py');
        console.log(`[Service] Spawning Python script at: ${scriptPath}`);

        const pythonProcess = spawn('python', [scriptPath]);

        let scoredDataString = '';
        let errorString = '';

        pythonProcess.stdout.on('data', (data) => {
            scoredDataString += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error(`[Python Stderr]: ${data.toString()}`);
            errorString += data.toString();
        });

        pythonProcess.on('error', (err) => {
            console.error("[Service] Failed to start Python script:", err);
            resolve(nasaData); // Fallback to raw data without crashing
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                console.error(`[Service] Python script exited with code ${code}: ${errorString}`);
                return resolve(nasaData); // Fallback
            }

            try {
                const results = JSON.parse(scoredDataString);
                console.log(`[Service] Successfully scored ${results.element_count || 0} items.`);
                resolve(results);
            } catch (e) {
                console.error("[Service] Error parsing Python output:", e);
                resolve(nasaData); // Fallback
            }
        });

        // Send data to Python
        try {
            const inputData = JSON.stringify(nasaData);
            pythonProcess.stdin.write(inputData);
            pythonProcess.stdin.end();
        } catch (inputErr) {
            console.error("[Service] Error writing to Python stdin:", inputErr);
            resolve(nasaData);
        }
    });
};

const getNeoWsFeed = async () => {
    const now = Date.now();
    if (feedCache.data && (now - feedCache.timestamp < CACHE_DURATION)) {
        console.log("Serving NeoWs feed from cache");
        return feedCache.data;
    }

    try {
        const today = new Date().toISOString().split('T')[0];

        const response = await axios.get(`${NASA_API_URL}/feed`, {
            params: {
                start_date: today,
                end_date: today,
                api_key: API_KEY
            }
        });

        console.log("[Service] NASA Feed Fetched. Calculating Scores...");
        const scoredData = await calculateRiskScores(response.data);

        feedCache = {
            data: scoredData,
            timestamp: now
        };

        return scoredData;
    } catch (error) {
        if (feedCache.data) {
            console.warn("Rate limit or Error, serving stale cache.");
            return feedCache.data;
        }

        console.warn("API Failed and Cache Empty. Serving Mock Data.");
        // Fallback Mock Data to prevent app crash
        const today = new Date().toISOString().split('T')[0];
        const mockData = {
            near_earth_objects: {
                [today]: [
                    {
                        id: '3542519',
                        name: '(2010 PK9)',
                        estimated_diameter: { meters: { estimated_diameter_max: 260 } },
                        is_potentially_hazardous_asteroid: true,
                        close_approach_data: [{
                            relative_velocity: { kilometers_per_hour: '25000' },
                            miss_distance: { kilometers: '7000000' }
                        }]
                    },
                    {
                        id: '54016629',
                        name: '(2021 GT2)',
                        estimated_diameter: { meters: { estimated_diameter_max: 50 } },
                        is_potentially_hazardous_asteroid: false,
                        close_approach_data: [{
                            relative_velocity: { kilometers_per_hour: '45000' },
                            miss_distance: { kilometers: '2000000' }
                        }]
                    }
                ]
            }
        };

        // Try to score the mock data too
        return await calculateRiskScores(mockData);
    }
};

exports.getFeed = getNeoWsFeed;

exports.getAsteroidById = async (asteroidId) => {
    try {
        const response = await axios.get(`${NASA_API_URL}/neo/${asteroidId}`, {
            params: {
                api_key: API_KEY
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching asteroid ${asteroidId}:`, error.message);
        throw new Error('Asteroid not found');
    }
};
