import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star, Send } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [rating, setRating] = useState<number>(0);
  const [usefulnessRating, setUsefulnessRating] = useState<number>(0);
  const [safetyRating, setSafetyRating] = useState<number>(0);
  const [additionalComments, setAdditionalComments] = useState<string>('');

  const handleSubmit = () => {
    // Here you would typically send the feedback to your backend
    console.log('Feedback submitted:', {
      overallRating: rating,
      usefulnessRating,
      safetyRating,
      additionalComments
    });
    
    // Reset form
    setRating(0);
    setUsefulnessRating(0);
    setSafetyRating(0);
    setAdditionalComments('');
    
    onClose();
  };

  const StarRating = ({ 
    value, 
    onChange, 
    label 
  }: { 
    value: number; 
    onChange: (rating: number) => void; 
    label: string;
  }) => {
    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium">{label}</Label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              className="transition-colors"
            >
              <Star
                className={`w-6 h-6 ${
                  star <= value 
                    ? 'fill-primary text-primary' 
                    : 'text-muted-foreground hover:text-primary'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">
            How was your layover experience?
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <StarRating
            value={rating}
            onChange={setRating}
            label="Overall experience"
          />
          
          <StarRating
            value={usefulnessRating}
            onChange={setUsefulnessRating}
            label="How useful were our recommendations?"
          />
          
          <StarRating
            value={safetyRating}
            onChange={setSafetyRating}
            label="Did you feel safe following our suggestions?"
          />
          
          <div className="space-y-2">
            <Label htmlFor="comments" className="text-sm font-medium">
              Additional comments (optional)
            </Label>
            <Textarea
              id="comments"
              placeholder="Tell us about your experience, what worked well, or what could be improved..."
              value={additionalComments}
              onChange={(e) => setAdditionalComments(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Skip
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="hero" 
            className="flex-1"
            disabled={rating === 0}
          >
            <Send className="w-4 h-4 mr-2" />
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackModal;