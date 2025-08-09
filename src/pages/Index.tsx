import React, { useState } from 'react';
import LayoverForm from '@/components/LayoverForm';
import ItineraryResults from '@/components/ItineraryResults';
import MapView from '@/components/MapView';
import FlightTimer from '@/components/FlightTimer';
import FeedbackModal from '@/components/FeedbackModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plane, MapPin, Clock, Heart } from 'lucide-react';
import heroImage from '@/assets/hero-image.jpg';

type AppScreen = 'landing' | 'results' | 'map' | 'timer';

interface LayoverData {
  airport: string;
  layoverHours: string;
  nationality: string;
}

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('landing');
  const [layoverData, setLayoverData] = useState<LayoverData | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleFormSubmit = (data: LayoverData) => {
    setLayoverData(data);
    setCurrentScreen('results');
  };

  const handleViewMap = () => {
    setCurrentScreen('map');
  };

  const handleStartTimer = () => {
    setCurrentScreen('timer');
  };

  const handleReturnAlert = () => {
    setShowFeedback(true);
  };

  const handleBackToLanding = () => {
    setCurrentScreen('landing');
    setLayoverData(null);
  };

  const handleBackToResults = () => {
    setCurrentScreen('results');
  };

  if (currentScreen === 'landing') {
    return (
      <div className="min-h-screen bg-gradient-sunset">
        {/* Hero Section */}
        <div className="relative h-screen flex flex-col">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${heroImage})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/90" />
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-center items-center px-4 flex-1 text-center">
            {/* Logo/Brand */}
            <div className="mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="relative">
                  <Plane className="w-8 h-8 text-primary animate-float" />
                  <MapPin className="w-4 h-4 text-accent absolute -bottom-1 -right-1" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-desert bg-clip-text text-transparent">
                  Uboorly
                </h1>
              </div>
              <p className="text-lg text-muted-foreground max-w-md">
                Your Saudi Arabia layover assistant for safe, halal-friendly micro-trips
              </p>
            </div>

            {/* Feature Badges */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <Badge variant="outline" className="bg-card/80 backdrop-blur-sm">
                <Clock className="w-3 h-3 mr-1" />
                6-24 Hour Layovers
              </Badge>
              <Badge variant="outline" className="bg-card/80 backdrop-blur-sm">
                <Heart className="w-3 h-3 mr-1" />
                Halal-Friendly
              </Badge>
              <Badge variant="outline" className="bg-card/80 backdrop-blur-sm">
                <MapPin className="w-3 h-3 mr-1" />
                Local Insights
              </Badge>
            </div>

            {/* Form */}
            <LayoverForm onSubmit={handleFormSubmit} />

            {/* Footer Info */}
            <div className="mt-8 text-sm text-muted-foreground">
              <p>No login required • Mobile-friendly • Instant planning</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === 'results' && layoverData) {
    return (
      <div className="min-h-screen bg-gradient-sunset p-4">
        <div className="max-w-md mx-auto">
          <ItineraryResults
            airport={layoverData.airport}
            layoverHours={layoverData.layoverHours}
            nationality={layoverData.nationality}
            onBack={handleBackToLanding}
            onViewMap={handleViewMap}
          />
          
          <div className="mt-6">
            <Button
              variant="floating"
              size="lg"
              onClick={handleStartTimer}
              className="w-full"
            >
              <Clock className="w-4 h-4 mr-2" />
              Start Flight Timer
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === 'map') {
    return (
      <div className="min-h-screen bg-gradient-sunset p-4">
        <div className="max-w-md mx-auto">
          <MapView onBack={handleBackToResults} />
        </div>
      </div>
    );
  }

  if (currentScreen === 'timer') {
    return (
      <div className="min-h-screen bg-gradient-sunset p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" onClick={handleBackToResults} className="flex items-center gap-2">
              ← Back
            </Button>
            <h1 className="text-xl font-semibold">Flight Timer</h1>
            <div></div>
          </div>
          
          <FlightTimer onReturnAlert={handleReturnAlert} />
          
          <FeedbackModal 
            isOpen={showFeedback} 
            onClose={() => setShowFeedback(false)} 
          />
        </div>
      </div>
    );
  }

  return null;
};

export default Index;