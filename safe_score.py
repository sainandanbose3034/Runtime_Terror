import sys
import json
import math

def calculate_risk(asteroid):
    try:
        # Use safe data extraction with defaults to prevent crashes
        diameter = asteroid.get('estimated_diameter', {}).get('meters', {}).get('estimated_diameter_max', 0)
        
        close_approach = asteroid.get('close_approach_data', [{}])[0]
        dist = float(close_approach.get('miss_distance', {}).get('astronomical', 100)) # Default large distance
        speed = float(close_approach.get('relative_velocity', {}).get('kilometers_per_second', 0))

        size_points = (diameter / 1000) * 40
        if size_points > 40:
            size_points = 40

        dist_points = 0
        if dist < 0.05:
            dist_points = 40 * (1 - (dist / 0.05))

        speed_points = (speed / 40) * 20
        if speed_points > 20:
            speed_points = 20

        risk_score = round(size_points + dist_points + speed_points, 2)
        return risk_score
    except Exception:
        return 0.0

def process_nasa_feed(data):
    """
    Traverses the NASA feed structure and adds scores to asteroids.
    """
    if 'near_earth_objects' in data:
        neos = data['near_earth_objects']
        for date_key in neos:
            for asteroid in neos[date_key]:
                risk = calculate_risk(asteroid)
                asteroid['risk_score'] = risk
                asteroid['safety_score'] = round(100 - risk, 2) # Inverted for "Safe Score"
    return data

if __name__ == "__main__":
    try:
        input_data = sys.stdin.read()
        if not input_data:
            print(json.dumps({"error": "No input data"}))
            sys.exit(1)
            
        data = json.loads(input_data)
        processed_data = process_nasa_feed(data)
        
        print(json.dumps(processed_data))
        
    except Exception as e:
        # Output error as JSON so Node can parse it (or handle gracefully)
        print(json.dumps({"error": str(e), "details": "Python script failure"}))
        sys.exit(1)
