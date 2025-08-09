import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plane, Clock, MapPin, PlaneTakeoff, PlaneLanding } from 'lucide-react';

interface LayoverFormData {
  airport: string;
  layoverHours: string;
  nationality: string;
  departureTime?: string;
  arrivalTime?: string;
  flightDurationMinutes?: number;
}

interface LayoverFormProps {
  onSubmit: (data: LayoverFormData) => void;
}

const saudiAirports = [
  { code: 'RUH', name: 'King Khalid International Airport (Riyadh)' },
  { code: 'JED', name: 'King Abdulaziz International Airport (Jeddah)' },
  { code: 'DXB', name: 'King Fahd International Airport (Dammam)' },
  { code: 'MED', name: 'Prince Mohammad Bin Abdulaziz Airport (Medina)' },
  { code: 'AHB', name: 'Abha Regional Airport' },
];

const LayoverForm: React.FC<LayoverFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<LayoverFormData>({
    airport: '',
    layoverHours: '',
    nationality: '',
    departureTime: '',
    arrivalTime: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.airport && formData.layoverHours && formData.nationality) {
      let flightDurationMinutes: number | undefined = undefined;
      if (formData.departureTime && formData.arrivalTime) {
        const start = new Date(formData.departureTime).getTime();
        const end = new Date(formData.arrivalTime).getTime();
        const diff = Math.max(0, Math.floor((end - start) / 60000));
        flightDurationMinutes = isNaN(diff) ? undefined : diff;
      }
      onSubmit({ ...formData, flightDurationMinutes });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-card border-border/50">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-xl font-semibold">
          <Plane className="w-6 h-6 text-primary" />
          Plan Your Layover
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="airport" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Arrival Airport
            </Label>
            <Select value={formData.airport} onValueChange={(value) => setFormData({...formData, airport: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select your arrival airport" />
              </SelectTrigger>
              <SelectContent>
                {saudiAirports.map((airport) => (
                  <SelectItem key={airport.code} value={airport.code}>
                    {airport.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="layoverHours" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Layover Duration (hours)
            </Label>
            <Select value={formData.layoverHours} onValueChange={(value) => setFormData({...formData, layoverHours: value})}>
              <SelectTrigger>
                <SelectValue placeholder="How long is your layover?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6-8">6-8 hours</SelectItem>
                <SelectItem value="8-12">8-12 hours</SelectItem>
                <SelectItem value="12-18">12-18 hours</SelectItem>
                <SelectItem value="18-24">18-24 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Flight Details */}
          <div className="space-y-2">
            <Label htmlFor="departureTime" className="flex items-center gap-2">
              <PlaneTakeoff className="w-4 h-4" />
              Departure date & time
            </Label>
            <Input
              id="departureTime"
              type="datetime-local"
              value={formData.departureTime}
              onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="arrivalTime" className="flex items-center gap-2">
              <PlaneLanding className="w-4 h-4" />
              Arrival date & time
            </Label>
            <Input
              id="arrivalTime"
              type="datetime-local"
              value={formData.arrivalTime}
              onChange={(e) => setFormData({ ...formData, arrivalTime: e.target.value })}
            />
            {formData.departureTime && formData.arrivalTime && (
              <p className="text-sm text-muted-foreground">
                Flight duration: {(() => {
                  const start = new Date(formData.departureTime).getTime();
                  const end = new Date(formData.arrivalTime).getTime();
                  const mins = Math.max(0, Math.floor((end - start) / 60000));
                  const hrs = Math.floor(mins / 60);
                  const rem = mins % 60;
                  return isNaN(mins) ? '—' : `${hrs}h ${rem}m`;
                })()}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="nationality">Nationality</Label>
            <Input
              id="nationality"
              placeholder="Enter your nationality"
              value={formData.nationality}
              onChange={(e) => setFormData({...formData, nationality: e.target.value})}
            />
          </div>

          <Button 
            type="submit" 
            variant="hero" 
            size="lg" 
            className="w-full mt-6"
            disabled={!formData.airport || !formData.layoverHours || !formData.nationality}
          >
            Plan My Layover
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LayoverForm;