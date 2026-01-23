import { useState, useEffect } from 'react';

// GeoJSON data interface
interface GeoJSONData {
    type: string;
    features: any[];
}

// Sample Turkey GeoJSON (simplified)
const turkeyGeoJSON: GeoJSONData = {
    type: "FeatureCollection",
    features: [
        { type: "Feature", properties: { plate_code: "34", name: "İstanbul" }, geometry: { type: "Point", coordinates: [29.0, 41.0] } },
        { type: "Feature", properties: { plate_code: "06", name: "Ankara" }, geometry: { type: "Point", coordinates: [32.9, 39.9] } },
        { type: "Feature", properties: { plate_code: "35", name: "İzmir" }, geometry: { type: "Point", coordinates: [27.1, 38.4] } },
        { type: "Feature", properties: { plate_code: "07", name: "Antalya" }, geometry: { type: "Point", coordinates: [30.7, 36.9] } },
        { type: "Feature", properties: { plate_code: "16", name: "Bursa" }, geometry: { type: "Point", coordinates: [29.0, 40.2] } },
    ]
};

// Sample World GeoJSON (simplified)  
const worldGeoJSON: GeoJSONData = {
    type: "FeatureCollection",
    features: [
        { type: "Feature", properties: { country_code: "TR", name: "Turkey" }, geometry: { type: "Point", coordinates: [35.0, 39.0] } },
        { type: "Feature", properties: { country_code: "DE", name: "Germany" }, geometry: { type: "Point", coordinates: [10.0, 51.0] } },
        { type: "Feature", properties: { country_code: "GB", name: "United Kingdom" }, geometry: { type: "Point", coordinates: [-3.0, 55.0] } },
        { type: "Feature", properties: { country_code: "FR", name: "France" }, geometry: { type: "Point", coordinates: [2.0, 46.0] } },
        { type: "Feature", properties: { country_code: "US", name: "United States" }, geometry: { type: "Point", coordinates: [-95.0, 38.0] } },
    ]
};

export function useGeoJSON(mapType: "turkey" | "world") {
    const [geoData, setGeoData] = useState<GeoJSONData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);

        // Simulate async loading
        setTimeout(() => {
            try {
                if (mapType === "turkey") {
                    setGeoData(turkeyGeoJSON);
                } else {
                    setGeoData(worldGeoJSON);
                }
                setLoading(false);
            } catch {
                setError("Failed to load GeoJSON");
                setLoading(false);
            }
        }, 100);
    }, [mapType]);

    return { geoData, loading, error };
}
