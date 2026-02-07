/**
 * Calculate risk level for an asteroid
 * @param {Object} asteroid - The asteroid data object from NASA API
 * @returns {Object} - Risk analysis result { level, score, description }
 */
exports.analyzeRisk = (asteroid) => {
    let riskScore = 0;
    const isHazardous = asteroid.is_potentially_hazardous_asteroid;
    const diameterMax = asteroid.estimated_diameter?.meters?.estimated_diameter_max || 0;

    // Check close approach data (usually the first one is the most relevant for current feed)
    const closeApproach = asteroid.close_approach_data && asteroid.close_approach_data[0];
    const missDistanceKm = closeApproach ? parseFloat(closeApproach.miss_distance.kilometers) : Number.MAX_VALUE;
    const velocityKph = closeApproach ? parseFloat(closeApproach.relative_velocity.kilometers_per_hour) : 0;

    // Base Hazard Score
    if (isHazardous) riskScore += 50;

    // Size Factor
    if (diameterMax > 1000) riskScore += 30; // > 1km is civilization ending
    else if (diameterMax > 140) riskScore += 15; // > 140m is city killer
    else if (diameterMax > 50) riskScore += 5;

    // Proximity Factor (Closer = Higher Risk)
    // Lunar Distance is approx 384,400 km
    if (missDistanceKm < 384400) riskScore += 20; // Within Lunar Distance
    else if (missDistanceKm < 7500000) riskScore += 10; // Within 0.05 AU (approx 7.5M km)

    // Velocity Factor (Faster = Higher Energy)
    if (velocityKph > 100000) riskScore += 5;

    // Determine Level
    let level = 'LOW';
    if (riskScore >= 80) level = 'EXTREME';
    else if (riskScore >= 50) level = 'HIGH';
    else if (riskScore >= 20) level = 'MEDIUM';

    return {
        level,
        score: riskScore,
        diameter: diameterMax,
        missDistance: missDistanceKm,
        velocity: velocityKph,
        isHazardous
    };
};
