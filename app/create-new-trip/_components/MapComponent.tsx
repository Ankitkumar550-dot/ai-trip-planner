"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Map, Marker, Popup, NavigationControl, FullscreenControl } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import maplibregl from 'maplibre-gl';
import { MapPin, Hotel, Loader, Map as MapIcon } from 'lucide-react';
import { useTripDetail } from '@/app/provider';

interface Location {
  name: string;
  lat: number;
  lng: number;
  type: 'hotel' | 'activity';
  details: string;
}

export default function MapComponent({ tripPlan }: { tripPlan?: string }) {
  const mapRef = useRef<any>(null);
  const [popupInfo, setPopupInfo] = useState<Location | null>(null);
  const [parsedTrip, setParsedTrip] = useState<any>(null);
  
  const tripContext = useTripDetail();
  const tripDetailInfo = tripContext?.tripDetailInfo;

  useEffect(() => {
    if (tripPlan) {
      try {
        setParsedTrip(JSON.parse(tripPlan));
      } catch (e) {
        console.error("Error parsing trip plan", e);
      }
    }
  }, [tripPlan]);

  const tripData = parsedTrip || tripDetailInfo;
  const API_KEY = process.env.NEXT_PUBLIC_LOCATIONIQ_API_KEY;
  const [currentStyle, setCurrentStyle] = useState(`https://tiles.locationiq.com/v3/styles/streets/style.json?key=${API_KEY}`);
  const fallbackStyle = "https://demotiles.maplibre.org/style.json";

  const [viewState, setViewState] = useState({
    longitude: 0,
    latitude: 20,
    zoom: 2,
    pitch: 0,
    bearing: 0
  });

  // Extract locations from trip data
  const locations: Location[] = [];
  if (tripData) {
    // Hotels
    const rawHotels = tripData?.hotels || tripData?.hotel_options || tripData?.hotel_recommendations || tripData?.hotelRecommendations;
    const hotelsArray = Array.isArray(rawHotels) ? rawHotels : (typeof rawHotels === 'object' && rawHotels !== null ? Object.values(rawHotels) : []);
    
    hotelsArray.forEach((h: any) => {
      if (h.geo_coordinates?.latitude && h.geo_coordinates?.longitude) {
        locations.push({
          name: h.hotel_name || "Hotel",
          lat: h.geo_coordinates.latitude,
          lng: h.geo_coordinates.longitude,
          type: 'hotel',
          details: h.hotel_address || h.description || ""
        });
      }
    });

    // Activities
    const itineraryArray = Array.isArray(tripData?.itinerary) ? tripData.itinerary : (typeof tripData?.itinerary === 'object' && tripData?.itinerary !== null ? Object.values(tripData.itinerary) : []);
    itineraryArray.forEach((day: any) => {
      if (day.activities && Array.isArray(day.activities)) {
        day.activities.forEach((act: any) => {
          if (act.geo_coordinates?.latitude && act.geo_coordinates?.longitude) {
            locations.push({
              name: act.place_name || "Activity",
              lat: act.geo_coordinates.latitude,
              lng: act.geo_coordinates.longitude,
              type: 'activity',
              details: act.place_details || act.place_address || ""
            });
          }
        });
      }
    });
  }

  // Fit bounds when locations change
  useEffect(() => {
    if (locations.length > 0 && mapRef.current) {
      const map = mapRef.current.getMap();
      const bounds = new maplibregl.LngLatBounds();
      locations.forEach(loc => bounds.extend([loc.lng, loc.lat]));
      map.fitBounds(bounds, { padding: 60, duration: 2000 });
    }
  }, [locations.length]);

  return (
    <div className="w-full h-full min-h-[500px] rounded-2xl overflow-hidden shadow-lg border border-gray-200 relative bg-gray-50">
      <Map
        ref={mapRef}
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        style={{ width: '100%', height: '100%' }}
        mapStyle={currentStyle}
        onError={() => setCurrentStyle(fallbackStyle)}
      >
        <NavigationControl position="top-right" />
        <FullscreenControl position="top-right" />
        
        {locations.map((loc, idx) => (
          <Marker
            key={idx}
            longitude={Number(loc.lng)}
            latitude={Number(loc.lat)}
            anchor="bottom"
            onClick={e => {
              e.originalEvent.stopPropagation();
              setPopupInfo(loc);
            }}
          >
            <div className={`cursor-pointer transform transition-all hover:scale-110 p-2 rounded-full shadow-md border-2 border-white ${
              loc.type === 'hotel' ? 'bg-rose-500' : 'bg-indigo-600'
            }`}>
              {loc.type === 'hotel' ? <Hotel size={16} className="text-white" /> : <MapPin size={16} className="text-white" />}
            </div>
          </Marker>
        ))}

        {popupInfo && (
          <Popup
            anchor="top"
            longitude={Number(popupInfo.lng)}
            latitude={Number(popupInfo.lat)}
            onClose={() => setPopupInfo(null)}
            closeButton={false}
          >
            <div className="p-2 max-w-[180px] bg-white rounded-lg">
              <h3 className="font-bold text-xs text-gray-900">{popupInfo.name}</h3>
              <p className="text-[10px] text-gray-500 line-clamp-2 mt-1">{popupInfo.details}</p>
            </div>
          </Popup>
        )}
      </Map>

      {locations.length === 0 && (
         <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50/80 backdrop-blur-sm pointer-events-none">
            <MapIcon size={40} className="text-gray-300 mb-3" />
            <p className="text-gray-400 text-sm font-medium">No locations to display yet</p>
         </div>
      )}
    </div>
  );
}
