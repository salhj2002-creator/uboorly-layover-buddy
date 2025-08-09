import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plane, AlertTriangle, Clock } from 'lucide-react';

interface FlightTimerProps {
  departureTime?: Date;
  onReturnAlert: () => void;
}

const FlightTimer: React.FC<FlightTimerProps> = ({ departureTime, onReturnAlert }) => {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  }>({ hours: 0, minutes: 0, seconds: 0 });
  
  const [isActive, setIsActive] = useState(false);
  const [returnTime, setReturnTime] = useState<Date | null>(null);
  const [showReturnAlert, setShowReturnAlert] = useState(false);

  // Mock departure time - 8 hours from now
  const mockDepartureTime = departureTime || new Date(Date.now() + 8 * 60 * 60 * 1000);
  
  // Calculate return time (2 hours before departure for safety buffer)
  const calculateReturnTime = () => {
    return new Date(mockDepartureTime.getTime() - 2 * 60 * 60 * 1000);
  };

  useEffect(() => {
    if (!returnTime) {
      setReturnTime(calculateReturnTime());
    }
  }, [mockDepartureTime]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && returnTime) {
      interval = setInterval(() => {
        const now = new Date();
        const difference = returnTime.getTime() - now.getTime();

        if (difference > 0) {
          const hours = Math.floor(difference / (1000 * 60 * 60));
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((difference % (1000 * 60)) / 1000);

          setTimeLeft({ hours, minutes, seconds });

          // Show alert when 30 minutes remaining
          if (hours === 0 && minutes <= 30 && !showReturnAlert) {
            setShowReturnAlert(true);
            onReturnAlert();
          }
        } else {
          setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
          setShowReturnAlert(true);
          onReturnAlert();
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, returnTime, showReturnAlert, onReturnAlert]);

  const startTimer = () => {
    setIsActive(true);
  };

  const stopTimer = () => {
    setIsActive(false);
  };

  const formatTime = (time: number) => {
    return time.toString().padStart(2, '0');
  };

  const getTimerColor = () => {
    if (timeLeft.hours === 0 && timeLeft.minutes <= 30) {
      return 'text-destructive';
    } else if (timeLeft.hours <= 1) {
      return 'text-orange-500';
    }
    return 'text-primary';
  };

  return (
    <div className="space-y-4">
      {showReturnAlert && (
        <Card className="bg-destructive/10 border-destructive/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0" />
              <div>
                <p className="font-medium text-destructive">Time to Return!</p>
                <p className="text-sm text-destructive/80">Head back to the airport now for your safety buffer.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plane className="w-5 h-5 text-primary" />
            Flight Timer
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className={`text-6xl font-bold mb-4 ${getTimerColor()}`}>
            {formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
          </div>
          
          <div className="text-sm text-muted-foreground mb-4">
            <p>Return to airport by: {returnTime?.toLocaleTimeString()}</p>
            <p>Flight departure: {mockDepartureTime.toLocaleTimeString()}</p>
          </div>

          <div className="flex gap-2 justify-center">
            {!isActive ? (
              <Button onClick={startTimer} variant="hero" size="lg">
                <Clock className="w-4 h-4 mr-2" />
                Start Timer
              </Button>
            ) : (
              <Button onClick={stopTimer} variant="outline" size="lg">
                Stop Timer
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-sunset border-border/50">
        <CardContent className="p-4">
          <div className="text-center">
            <h3 className="font-medium mb-2">Safety Tips</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Keep your boarding pass and passport ready</li>
              <li>• Allow extra time for security checks</li>
              <li>• Check for any gate changes</li>
              <li>• Stay hydrated and rest when needed</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FlightTimer;