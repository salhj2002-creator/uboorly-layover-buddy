import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Clock, MapPin, DollarSign, Luggage, Navigation, ArrowLeft, Play, Star, Car, Bus, Train } from 'lucide-react';

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
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isTimerStarted, setIsTimerStarted] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);
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

  const tripProviders = [
    {
      id: '1',
      name: 'Riyadh City Tours',
      rating: 4.8,
      price: '120 SAR',
      transport: 'Private Car',
      reviews: 156,
      duration: '3 hours'
    },
    {
      id: '2', 
      name: 'Heritage Explorers',
      rating: 4.6,
      price: '85 SAR',
      transport: 'Group Bus',
      reviews: 89,
      duration: '2.5 hours'
    },
    {
      id: '3',
      name: 'Quick Stop Tours',
      rating: 4.9,
      price: '150 SAR',
      transport: 'Private Guide',
      reviews: 203,
      duration: '2 hours'
    }
  ];

  const selfGuidedInfo = {
    uber: {
      location: 'Terminal 1 Exit B, Ground Level',
      estimatedTime: '15-20 minutes to city center',
      cost: '25-35 SAR'
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
      'Save offline maps before leaving WiFi'
    ]
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

      {/* Clock & Timer */}
      <Card className="bg-gradient-sunset border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-primary" />
              <div>
                <p className="font-semibold text-lg">
                  {currentTime.toLocaleTimeString('en-US', { 
                    hour12: false, 
                    hour: '2-digit', 
                    minute: '2-digit',
                    second: '2-digit'
                  })}
                </p>
                <p className="text-xs text-muted-foreground">Current Time</p>
              </div>
            </div>
            <Button 
              variant={isTimerStarted ? "outline" : "hero"} 
              onClick={() => setIsTimerStarted(!isTimerStarted)}
              className="flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              {isTimerStarted ? 'Stop Trip' : 'Start Trip'}
            </Button>
          </div>
        </CardContent>
      </Card>

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
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-3">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Car className="w-3 h-3 mr-1" />
                          Start Your Own
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Self-Guided Trip to {item.title}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div>
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                              <Car className="w-4 h-4" />
                              Ride Services
                            </h4>
                            <div className="space-y-2 text-sm">
                              <p><strong>Pickup:</strong> {selfGuidedInfo.uber.location}</p>
                              <p><strong>Duration:</strong> {selfGuidedInfo.uber.estimatedTime}</p>
                              <p><strong>Cost:</strong> {selfGuidedInfo.uber.cost}</p>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                              <Bus className="w-4 h-4" />
                              Public Transport
                            </h4>
                            <div className="space-y-2 text-sm">
                              <p><strong>Metro:</strong> {selfGuidedInfo.localTransport.metro}</p>
                              <p><strong>Bus:</strong> {selfGuidedInfo.localTransport.bus}</p>
                              <p><strong>Duration:</strong> {selfGuidedInfo.localTransport.estimatedTime}</p>
                              <p><strong>Cost:</strong> {selfGuidedInfo.localTransport.cost}</p>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold mb-2">Tips</h4>
                            <ul className="space-y-1 text-sm">
                              {selfGuidedInfo.tips.map((tip, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                                  {tip}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="teal" size="sm" className="flex-1">
                          <Star className="w-3 h-3 mr-1" />
                          Trip Providers
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>Trip Providers for {item.title}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-3 py-4 max-h-[400px] overflow-y-auto">
                          {tripProviders.map((provider) => (
                            <Card key={provider.id} className="p-3">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h4 className="font-semibold">{provider.name}</h4>
                                  <div className="flex items-center gap-1 mt-1">
                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                    <span className="text-sm">{provider.rating}</span>
                                    <span className="text-xs text-muted-foreground">({provider.reviews} reviews)</span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold text-primary">{provider.price}</p>
                                  <p className="text-xs text-muted-foreground">{provider.duration}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm">
                                  {provider.transport === 'Private Car' && <Car className="w-3 h-3" />}
                                  {provider.transport === 'Group Bus' && <Bus className="w-3 h-3" />}
                                  {provider.transport === 'Private Guide' && <Train className="w-3 h-3" />}
                                  <span>{provider.transport}</span>
                                </div>
                                <Button size="sm" variant="outline">
                                  Book Now
                                </Button>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
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