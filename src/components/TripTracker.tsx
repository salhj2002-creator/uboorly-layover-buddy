import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause, Clock, CheckCircle, AlertTriangle, Navigation, MapPin } from 'lucide-react';

interface TimelineItem {
  time: string;
  activity: string;
  location?: string;
  duration?: string;
  type: 'travel' | 'activity' | 'buffer';
  actualTime?: string;
  status?: 'pending' | 'completed' | 'current' | 'delayed';
  variance?: number; // minutes early (negative) or late (positive)
}

interface TripTrackerProps {
  destination: string;
  timeline: TimelineItem[];
}

const TripTracker: React.FC<TripTrackerProps> = ({ destination, timeline: initialTimeline }) => {
  const [isTracking, setIsTracking] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeline, setTimeline] = useState<TimelineItem[]>(initialTimeline);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isTracking && startTime) {
      updateTimelineStatus();
    }
  }, [currentTime, isTracking, startTime]);

  const parseTime = (timeStr: string, baseDate: Date): Date => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date(baseDate);
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  const updateTimelineStatus = () => {
    if (!startTime) return;

    const updatedTimeline = timeline.map((item, index) => {
      const scheduledTime = parseTime(item.time, startTime);
      const timeDiff = Math.floor((currentTime.getTime() - scheduledTime.getTime()) / (1000 * 60));

      let status: TimelineItem['status'] = 'pending';
      let variance = 0;

      if (timeDiff >= 0) {
        if (index < timeline.length - 1) {
          const nextScheduledTime = parseTime(timeline[index + 1].time, startTime);
          if (currentTime < nextScheduledTime) {
            status = 'current';
          } else {
            status = 'completed';
            variance = timeDiff;
          }
        } else {
          status = 'completed';
          variance = timeDiff;
        }
      }

      return {
        ...item,
        status,
        variance,
        actualTime: status === 'completed' ? currentTime.toLocaleTimeString('en-US', { 
          hour12: false, 
          hour: '2-digit', 
          minute: '2-digit' 
        }) : undefined
      };
    });

    setTimeline(updatedTimeline);
    
    // Update current step
    const currentIndex = updatedTimeline.findIndex(item => item.status === 'current');
    if (currentIndex !== -1) {
      setCurrentStep(currentIndex);
    }
  };

  const handleStartTrip = () => {
    const now = new Date();
    setStartTime(now);
    setIsTracking(true);
    
    // Set first item as current
    const updatedTimeline = timeline.map((item, index) => ({
      ...item,
      status: index === 0 ? 'current' as const : 'pending' as const
    }));
    setTimeline(updatedTimeline);
  };

  const handleStopTrip = () => {
    setIsTracking(false);
    setStartTime(null);
    setTimeline(initialTimeline);
    setCurrentStep(0);
  };

  const getTimelineIcon = (item: TimelineItem) => {
    if (item.status === 'completed') {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
    if (item.status === 'current') {
      return <Clock className="w-4 h-4 text-primary animate-pulse" />;
    }
    if (item.status === 'delayed' || (item.variance && item.variance > 5)) {
      return <AlertTriangle className="w-4 h-4 text-amber-500" />;
    }
    
    switch (item.type) {
      case 'travel': return <Navigation className="w-4 h-4 text-muted-foreground" />;
      case 'activity': return <MapPin className="w-4 h-4 text-muted-foreground" />;
      case 'buffer': return <Clock className="w-4 h-4 text-muted-foreground" />;
      default: return <CheckCircle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getVarianceText = (variance?: number) => {
    if (!variance) return null;
    
    if (variance < -2) {
      return <span className="text-green-600 text-xs">({Math.abs(variance)}m early)</span>;
    } else if (variance > 5) {
      return <span className="text-amber-600 text-xs">({variance}m delayed)</span>;
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="w-5 h-5" />
            Trip Progress
            {isTracking && (
              <Badge variant="outline" className="ml-2">
                Live Tracking
              </Badge>
            )}
          </CardTitle>
          <div className="flex gap-2">
            {!isTracking ? (
              <Button onClick={handleStartTrip} className="flex items-center gap-2">
                <Play className="w-4 h-4" />
                Start Trip
              </Button>
            ) : (
              <Button variant="outline" onClick={handleStopTrip} className="flex items-center gap-2">
                <Pause className="w-4 h-4" />
                Stop Tracking
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {timeline.map((item, index) => (
            <div key={index} className={`flex items-start gap-4 p-3 rounded-lg transition-colors ${
              item.status === 'current' ? 'bg-primary/5 border border-primary/20' : 
              item.status === 'completed' ? 'bg-muted/50' : ''
            }`}>
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                  item.status === 'current' ? 'border-primary bg-primary/10' :
                  item.status === 'completed' ? 'border-green-500 bg-green-50' :
                  'border-muted-foreground/30 bg-background'
                }`}>
                  {getTimelineIcon(item)}
                </div>
                {index < timeline.length - 1 && (
                  <div className={`w-0.5 h-6 mt-2 ${
                    item.status === 'completed' ? 'bg-green-200' : 'bg-border'
                  }`} />
                )}
              </div>
              
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs font-mono">
                      {item.actualTime || item.time}
                    </Badge>
                    <span className="font-medium text-sm">{item.activity}</span>
                    {getVarianceText(item.variance)}
                  </div>
                  {item.duration && (
                    <span className="text-xs text-muted-foreground">
                      {item.duration}
                    </span>
                  )}
                </div>
                {item.location && (
                  <p className="text-xs text-muted-foreground pl-2">
                    📍 {item.location}
                  </p>
                )}
                {item.status === 'current' && isTracking && (
                  <p className="text-xs text-primary pl-2 font-medium">
                    Currently in progress...
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {isTracking && (
          <div className="mt-4 p-3 bg-primary/5 rounded-lg">
            <p className="text-sm text-center">
              <Clock className="w-4 h-4 inline mr-1" />
              Current Time: {currentTime.toLocaleTimeString('en-US', { 
                hour12: false, 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TripTracker;