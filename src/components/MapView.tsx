import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, Compass, ArrowLeft, Plane } from 'lucide-react';

interface MapViewProps {
  onBack: () => void;
}

interface MapLocation {
  id: string;
  name: string;
  type: 'attraction' | 'transport' | 'prayer' | 'storage' | 'airport';
  position: { x: number; y: number };
  description: string;
}

const MapView: React.FC<MapViewProps> = ({ onBack }) => {
  const locations: MapLocation[] = [
    { id: 'airport', name: 'King Khalid Airport', type: 'airport', position: { x: 50, y: 85 }, description: 'Your departure point' },
    { id: 'metro', name: 'Metro Station', type: 'transport', position: { x: 50, y: 70 }, description: 'Airport Metro Line' },
    { id: 'heritage', name: 'Heritage Center', type: 'attraction', position: { x: 30, y: 40 }, description: 'Saudi cultural museum' },
    { id: 'market', name: 'Al Zal Market', type: 'attraction', position: { x: 65, y: 30 }, description: 'Traditional marketplace' },
    { id: 'tower', name: 'Kingdom Centre', type: 'attraction', position: { x: 20, y: 20 }, description: 'Sky bridge views' },
    { id: 'mosque', name: 'King Fahd Mosque', type: 'prayer', position: { x: 45, y: 50 }, description: 'Prayer facility' },
    { id: 'storage', name: 'Baggage Storage', type: 'storage', position: { x: 52, y: 80 }, description: 'Secure luggage storage' },
  ];

  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'airport': return <Plane className="w-3 h-3" />;
      case 'transport': return <Navigation className="w-3 h-3" />;
      case 'attraction': return <MapPin className="w-3 h-3" />;
      case 'prayer': return <Compass className="w-3 h-3" />;
      case 'storage': return <MapPin className="w-3 h-3" />;
      default: return <MapPin className="w-3 h-3" />;
    }
  };

  const getLocationColor = (type: string) => {
    switch (type) {
      case 'airport': return 'bg-primary text-primary-foreground';
      case 'transport': return 'bg-secondary text-secondary-foreground';
      case 'attraction': return 'bg-accent text-accent-foreground';
      case 'prayer': return 'bg-emerald-500 text-white';
      case 'storage': return 'bg-orange-500 text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <h1 className="text-xl font-semibold">Map View</h1>
        <div></div>
      </div>

      {/* Map Container */}
      <Card className="shadow-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Your Layover Route
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative w-full h-80 bg-gradient-sunset rounded-lg overflow-hidden border border-border/50">
            {/* Map Background Grid */}
            <div className="absolute inset-0 opacity-10">
              <svg width="100%" height="100%" className="w-full h-full">
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            {/* Locations */}
            {locations.map((location) => (
              <div
                key={location.id}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${getLocationColor(location.type)} 
                  rounded-full w-8 h-8 flex items-center justify-center shadow-soft hover:scale-110 
                  transition-transform cursor-pointer`}
                style={{
                  left: `${location.position.x}%`,
                  top: `${location.position.y}%`,
                }}
                title={location.name}
              >
                {getLocationIcon(location.type)}
              </div>
            ))}

            {/* Route Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <path
                d={`M ${locations[0].position.x}% ${locations[0].position.y}% 
                   L ${locations[1].position.x}% ${locations[1].position.y}%
                   L ${locations[2].position.x}% ${locations[2].position.y}%
                   L ${locations[3].position.x}% ${locations[3].position.y}%
                   L ${locations[4].position.x}% ${locations[4].position.y}%`}
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                strokeDasharray="5,5"
                fill="none"
                className="opacity-60"
              />
            </svg>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card className="shadow-card border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Map Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                <Plane className="w-2 h-2 text-primary-foreground" />
              </div>
              <span>Airport</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-secondary rounded-full flex items-center justify-center">
                <Navigation className="w-2 h-2 text-secondary-foreground" />
              </div>
              <span>Transport</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-accent rounded-full flex items-center justify-center">
                <MapPin className="w-2 h-2 text-accent-foreground" />
              </div>
              <span>Attractions</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                <Compass className="w-2 h-2 text-white" />
              </div>
              <span>Prayer Locations</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location Details */}
      <div className="space-y-3">
        <h3 className="font-semibold">Location Details</h3>
        {locations.filter(l => l.type === 'attraction').map((location) => (
          <Card key={location.id} className="shadow-card border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{location.name}</h4>
                  <p className="text-sm text-muted-foreground">{location.description}</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {location.type}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MapView;