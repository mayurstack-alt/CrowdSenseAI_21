const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function predictRisk(predictionRequest) {
    try {
        const response = await fetch(`${API_URL}/predict`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(predictionRequest),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API Error: ${response.status} - ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Prediction API failed:", error);
        throw error;
    }
}

export async function getLocations() {
    try {
        const response = await fetch(`${API_URL}/locations`);
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Locations API failed:", error);
        throw error;
    }
}

export async function getLocationContext(locationId) {
    try {
        const response = await fetch(`${API_URL}/locations/${locationId}/context`);
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Location Context API failed:", error);
        throw error;
    }
}

export async function getLiveWeather(lat, lon) {
    try {
        const response = await fetch(`${API_URL}/weather?lat=${lat}&lon=${lon}`);
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Weather API failed:", error);
        throw error;
    }
}

export async function getNearbyRisk() {
    try {
        const response = await fetch(`${API_URL}/risk/nearby`);
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Nearby Risk API failed:", error);
        throw error;
    }
}
