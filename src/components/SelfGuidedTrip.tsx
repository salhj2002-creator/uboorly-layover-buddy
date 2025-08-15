import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Clock, MapPin, Car, Bus, Navigation, AlertCircle, CheckCircle, Plane } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import JourneyIllustration from './JourneyIllustration';
import TripTracker from './TripTracker';

interface SelfGuidedTripProps {
  destination: string;
  children: React.ReactNode;
}

interface TimelineItem {
  time: string;
  activity: string;
  location?: string;
  duration?: string;
  type: 'travel' | 'activity' | 'buffer';
}

const SelfGuidedTrip: React.FC<SelfGuidedTripProps> = ({ destination, children }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(false);

  const timeline: TimelineItem[] = [
    { time: '10:30', activity: 'Exit Airport Terminal', location: 'King Khalid International Airport', duration: '10 min', type: 'travel' },
    { time: '10:40', activity: 'Board Transport', location: 'Ground Transport Area', duration: '5 min', type: 'travel' },
    { time: '10:45', activity: 'Travel to Destination', location: 'En route', duration: '25 min', type: 'travel' },
    { time: '11:10', activity: 'Buffer Time', location: 'Allow for delays', duration: '5 min', type: 'buffer' },
    { time: '11:15', activity: `Arrive at ${destination}`, location: destination, duration: '2 hrs', type: 'activity' },
    { time: '13:15', activity: 'Return Journey Begins', location: destination, duration: '25 min', type: 'travel' },
    { time: '13:40', activity: 'Airport Security & Check-in', location: 'King Khalid International Airport', duration: '90 min', type: 'buffer' },
    { time: '15:10', activity: 'Flight Departure Ready', location: 'Gate Area', type: 'travel' }
  ];

  const transportLocations = [
    { 
      name: 'Uber/Careem Pickup', 
      coordinates: [46.6977, 24.9576] as [number, number],
      description: 'Ground Level, Exit B - Terminal 1',
      type: 'rideshare'
    },
    { 
      name: 'Taxi Stand', 
      coordinates: [46.6982, 24.9572] as [number, number],
      description: 'Official Airport Taxis',
      type: 'taxi'
    },
    { 
      name: 'Metro Station', 
      coordinates: [46.6985, 24.9580] as [number, number],
      description: 'Riyadh Metro - Airport Line',
      type: 'metro'
    },
    { 
      name: 'Bus Terminal', 
      coordinates: [46.6975, 24.9568] as [number, number],
      description: 'SAPTCO Bus Services',
      type: 'bus'
    }
  ];

  const selfGuidedInfo = {
    uber: {
      location: 'Ground Level, Exit B - Terminal 1',
      estimatedTime: '15-20 minutes to city center',
      cost: '25-35 SAR',
      apps: ['Careem', 'Uber']
    },
    localTransport: {
      metro: 'Riyadh Metro - King Khalid Airport Station',
      bus: 'SAPTCO Bus Service - Route 101',
      estimatedTime: '30-45 minutes to city center',
      cost: '5-10 SAR'
    },
    tips: [
      'Download Careem app for reliable rides',
      'Metro runs every 15 minutes',
      'Keep airport shuttle schedule handy',
      'Save offline maps before leaving WiFi',
      'Carry cash for local transport',
      'Keep your boarding pass for return security'
    ]
  };

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    try {
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [46.6980, 24.9574], // King Khalid Airport
        zoom: 15,
        pitch: 45,
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Add markers for transport locations
      transportLocations.forEach((location) => {
        const el = document.createElement('div');
        el.className = 'w-8 h-8 bg-primary rounded-full border-2 border-primary-foreground flex items-center justify-center cursor-pointer hover:scale-110 transition-transform';
        
        // Add icon based on type
        let icon = '🚗';
        if (location.type === 'metro') icon = '🚇';
        if (location.type === 'bus') icon = '🚌';
        if (location.type === 'taxi') icon = '🚕';
        
        el.innerHTML = `<span class="text-xs">${icon}</span>`;

        // Create popup
        const popup = new mapboxgl.Popup({ offset: 25 })
          .setHTML(`
            <div class="p-2">
              <h3 class="font-semibold text-sm">${location.name}</h3>
              <p class="text-xs text-gray-600">${location.description}</p>
            </div>
          `);

        new mapboxgl.Marker(el)
          .setLngLat(location.coordinates)
          .setPopup(popup)
          .addTo(map.current!);
      });

      // Add airport marker
      const airportEl = document.createElement('div');
      airportEl.className = 'w-10 h-10 bg-accent rounded-full border-2 border-accent-foreground flex items-center justify-center';
      airportEl.innerHTML = '<span class="text-white">✈️</span>';
      
      new mapboxgl.Marker(airportEl)
        .setLngLat([46.6980, 24.9574])
        .setPopup(new mapboxgl.Popup().setHTML('<div class="p-2"><h3 class="font-semibold">King Khalid Airport</h3></div>'))
        .addTo(map.current);

    } catch (error) {
      console.error('Error initializing map:', error);
    }

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken]);

  const getTimelineIcon = (type: string) => {
    switch (type) {
      case 'travel': return <Navigation className="w-4 h-4 text-primary" />;
      case 'activity': return <MapPin className="w-4 h-4 text-accent" />;
      case 'buffer': return <Clock className="w-4 h-4 text-muted-foreground" />;
      default: return <CheckCircle className="w-4 h-4 text-primary" />;
    }
  };

  const handleTokenSubmit = () => {
    if (mapboxToken.trim()) {
      setShowTokenInput(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Car className="w-5 h-5 text-primary" />
            Self-Guided Trip to {destination}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Mapbox Token Input */}
          {!mapboxToken && (
            <Card className="border-amber-200 bg-amber-50 dark:bg-amber-900/20">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                        Interactive Map Setup Required
                      </p>
                      <p className="text-xs text-amber-700 dark:text-amber-300">
                        Enter your Mapbox public token to view transport locations. Get it free at mapbox.com
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="pk.eyJ1..."
                        value={mapboxToken}
                        onChange={(e) => setMapboxToken(e.target.value)}
                        className="text-xs"
                      />
                      <Button size="sm" onClick={handleTokenSubmit}>
                        Load Map
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Interactive Map or Journey Illustration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="w-5 h-5" />
                {mapboxToken ? 'Transport Locations' : 'Journey Overview'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {mapboxToken ? (
                <div 
                  ref={mapContainer} 
                  className="w-full h-64 rounded-lg border bg-muted"
                />
              ) : (
                <JourneyIllustration destination={destination} />
              )}
            </CardContent>
          </Card>

          {/* Trip Tracker */}
          <TripTracker destination={destination} timeline={timeline} />

          {/* Transport Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Car className="w-4 h-4" />
                  Ride Services
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pickup Location:</span>
                    <span className="text-right">{selfGuidedInfo.uber.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration:</span>
                    <span>{selfGuidedInfo.uber.estimatedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cost:</span>
                    <span className="font-medium">{selfGuidedInfo.uber.cost}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Apps:</span>
                    <span>{selfGuidedInfo.uber.apps.join(', ')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Bus className="w-4 h-4" />
                  Public Transport
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Metro:</span>
                    <span className="text-right">{selfGuidedInfo.localTransport.metro}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bus:</span>
                    <span className="text-right">{selfGuidedInfo.localTransport.bus}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration:</span>
                    <span>{selfGuidedInfo.localTransport.estimatedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cost:</span>
                    <span className="font-medium">{selfGuidedInfo.localTransport.cost}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tips */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Essential Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {selfGuidedInfo.tips.map((tip, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <DialogClose asChild>
              <Button variant="outline" className="flex-1">
                Close
              </Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SelfGuidedTrip;