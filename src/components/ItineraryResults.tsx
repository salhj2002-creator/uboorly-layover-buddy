import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, DollarSign, Luggage, Navigation, ArrowLeft } from 'lucide-react';

interface ItineraryItem {
  id: string;
  title: string;
  description: string;
  duration: string;
  cost: string;
  transportInfo: string;
  category: 'attraction' | 'food' | 'shopping' | 'culture';
}

interface ItineraryResultsProps {
  airport: string;
  layoverHours: string;
  nationality: string;
  onBack: () => void;
  onViewMap: () => void;
}

const ItineraryResults: React.FC<ItineraryResultsProps> = ({ 
  airport, 
  layoverHours, 
  nationality, 
  onBack, 
  onViewMap 
}) => {
  // Mock itinerary data based on airport and duration
  const itinerary: ItineraryItem[] = [
    {
      id: '1',
      title: 'King Abdulaziz Historical Center',
      description: 'Explore Saudi heritage and culture in this modern museum complex with interactive exhibits.',
      duration: '2-3 hours',
      cost: '25 SAR',
      transportInfo: '20 min metro + 10 min walk',
      category: 'culture'
    },
    {
      id: '2',
      title: 'Al Zal Market',
      description: 'Traditional market offering local crafts, spices, and halal dining options.',
      duration: '1-2 hours',
      cost: '15-50 SAR',
      transportInfo: '15 min bus',
      category: 'shopping'
    },
    {
      id: '3',
      title: 'Kingdom Centre Sky Bridge',
      description: 'Panoramic city views from the iconic tower\'s observation deck.',
      duration: '1 hour',
      cost: '30 SAR',
      transportInfo: '25 min metro',
      category: 'attraction'
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'culture': return 'bg-primary/10 text-primary border-primary/20';
      case 'shopping': return 'bg-secondary/10 text-secondary border-secondary/20';
      case 'attraction': return 'bg-accent/10 text-accent border-accent/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
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
        <div className="text-center">
          <h1 className="text-xl font-semibold">Your Layover Plan</h1>
          <p className="text-sm text-muted-foreground">{airport} • {layoverHours}</p>
        </div>
        <div></div>
      </div>

      {/* Safety Info */}
      <Card className="bg-gradient-sunset border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-primary flex-shrink-0" />
            <div>
              <p className="font-medium text-sm">Safety Buffer: Return 2 hours before departure</p>
              <p className="text-xs text-muted-foreground">We've planned your return with plenty of time</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Baggage Storage */}
      <Card className="shadow-card border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Luggage className="w-5 h-5 text-primary" />
            Baggage Storage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">Airport Storage Services</span>
              <span className="text-sm text-muted-foreground">Terminal 1 & 3</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span>Rate: 20 SAR/day</span>
              <span>24/7 available</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Itinerary Items */}
      <div className="space-y-4">
        <h2 className="font-semibold flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Recommended Stops
        </h2>
        {itinerary.map((item, index) => (
          <Card key={item.id} className="shadow-card border-border/50">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </span>
                    <h3 className="font-medium">{item.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                  
                  <div className="flex flex-wrap gap-2 text-xs">
                    <Badge variant="outline" className={getCategoryColor(item.category)}>
                      {item.category}
                    </Badge>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {item.duration}
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <DollarSign className="w-3 h-3" />
                      {item.cost}
                    </div>
                  </div>
                  
                  <div className="mt-2 text-xs text-muted-foreground">
                    <Navigation className="w-3 h-3 inline mr-1" />
                    {item.transportInfo}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button variant="teal" size="lg" onClick={onViewMap} className="flex-1">
          <MapPin className="w-4 h-4 mr-2" />
          View on Map
        </Button>
        <Button variant="floating" size="lg" className="flex-1">
          <Clock className="w-4 h-4 mr-2" />
          Start Timer
        </Button>
      </div>
    </div>
  );
};

export default ItineraryResults;