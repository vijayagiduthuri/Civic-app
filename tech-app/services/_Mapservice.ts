import { MAPBOX_ACCESS_TOKEN } from '@env';
import * as Location from "expo-location";

// Set your Mapbox access token here
const MAPBOX_TOKEN = MAPBOX_ACCESS_TOKEN;

export interface RouteStep {
  instruction: string;
  maneuver: {
    type: string;
    modifier?: string;
  };
  duration: number;
  distance: number;
}

export interface RouteData {
  coordinates: [number, number][];
  distance: number;
  duration: number;
  steps: RouteStep[];
}

export interface LocationCoords {
  longitude: number;
  latitude: number;
}

class MapService {
  private accessToken: string;

  constructor(token: string) {
    this.accessToken = token;
  }

  // Calculate route between two points
  async calculateRoute(
    start: LocationCoords, 
    end: LocationCoords, 
    profile: string = 'driving'
  ): Promise<RouteData | null> {
    try {
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/${profile}/` +
        `${start.longitude},${start.latitude};${end.longitude},${end.latitude}?` +
        `geometries=geojson&steps=true&overview=full&access_token=${this.accessToken}`
      );
      
      const data = await response.json();
      
      if (data.routes && data.routes[0]) {
        const route = data.routes[0];
        const coordinates = route.geometry.coordinates;
        
        // Parse steps for turn-by-turn instructions
        const steps: RouteStep[] = route.legs[0].steps.map((step: any) => ({
          instruction: step.maneuver.instruction,
          maneuver: {
            type: step.maneuver.type,
            modifier: step.maneuver.modifier
          },
          duration: step.duration,
          distance: step.distance
        }));
        
        return {
          coordinates: coordinates,
          distance: route.distance,
          duration: route.duration,
          steps: steps
        };
      }
      
      return null;
    } catch (error) {
      console.error('Route calculation error:', error);
      throw new Error('Could not calculate route');
    }
  }

  // Get user's current location
  async getCurrentLocation(): Promise<LocationCoords> {
    try {
      // Request permission
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Location permission denied');
      }
      
      // Get current location
      const location = await Location.getCurrentPositionAsync({});
      
      return {
        longitude: location.coords.longitude,
        latitude: location.coords.latitude
      };
    } catch (error) {
      console.error('Location error:', error);
      throw new Error('Could not get current location');
    }
  }

  // Calculate straight line distance as fallback
  calculateStraightLineDistance(start: LocationCoords, end: LocationCoords): number {
    const R = 6371; // Earth's radius in km
    const dLat = (end.latitude - start.latitude) * Math.PI / 180;
    const dLon = (end.longitude - start.longitude) * Math.PI / 180;
    
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(start.latitude * Math.PI / 180) * 
              Math.cos(end.latitude * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  // Format distance for display
  formatDistance(distance: number): string {
    if (distance < 1) {
      return `${Math.round(distance * 1000)} m`;
    }
    return `${distance.toFixed(1)} km`;
  }

  // Format duration for display
  formatDuration(duration: number): string {
    const minutes = Math.ceil(duration / 60);
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}min`;
  }
}

// Create and export a singleton instance
export const mapService = new MapService(MAPBOX_TOKEN||'');