import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Plane, Car, MapPin, Clock, ArrowRight } from 'lucide-react';

interface JourneyIllustrationProps {
  destination: string;
}

const JourneyIllustration: React.FC<JourneyIllustrationProps> = ({ destination }) => {
  return (
    <div className="w-full h-64 rounded-lg border bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center p-6">
      <div className="flex items-center justify-between w-full max-w-md">
        {/* Airport */}
        <div className="flex flex-col items-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center">
            <Plane className="w-8 h-8 text-primary" />
          </div>
          <div className="text-center">
            <p className="text-xs font-medium">King Khalid</p>
            <p className="text-xs text-muted-foreground">Airport</p>
          </div>
        </div>

        {/* Arrow with transport icons */}
        <div className="flex-1 flex items-center justify-center space-x-2 mx-4">
          <div className="flex items-center space-x-1">
            <Car className="w-4 h-4 text-accent" />
            <div className="w-8 border-t-2 border-dashed border-accent/40"></div>
            <Clock className="w-4 h-4 text-muted-foreground" />
            <div className="w-8 border-t-2 border-dashed border-accent/40"></div>
            <ArrowRight className="w-4 h-4 text-primary" />
          </div>
        </div>

        {/* Destination */}
        <div className="flex flex-col items-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-accent/10 border-2 border-accent/20 flex items-center justify-center">
            <MapPin className="w-8 h-8 text-accent" />
          </div>
          <div className="text-center">
            <p className="text-xs font-medium">{destination}</p>
            <p className="text-xs text-muted-foreground">Destination</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JourneyIllustration;