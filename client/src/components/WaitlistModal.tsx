import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { insertWaitlistSchema, type InsertWaitlist } from '@shared/schema';
import { z } from 'zod';

interface WaitlistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function WaitlistModal({ open, onOpenChange }: WaitlistModalProps) {
  const [email, setEmail] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async (data: InsertWaitlist) => {
      const response = await apiRequest('POST', '/api/waitlist', data);
      return await response.json();
    },
    onSuccess: () => {
      setIsSuccess(true);
      setEmail('');
      toast({
        title: 'Welcome to PROTCTUS',
        description: 'You have been added to the early access waitlist.',
      });
    },
    onError: (error: any) => {
      const message = error.message || 'Failed to join waitlist. Please try again.';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const validated = insertWaitlistSchema.parse({ email });
      mutation.mutate(validated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: 'Invalid Email',
          description: error.errors[0]?.message || 'Please enter a valid email address.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setEmail('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-card/80 border-border/20 backdrop-blur-2xl shadow-[0_0_40px_-15px_rgba(255,255,255,0.1)] transition-all duration-500">
        {!isSuccess ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-light uppercase tracking-[0.2em] text-foreground drop-shadow-[0_0_12px_rgba(255,255,255,0.2)]">
                Join Early Access
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground font-extralight tracking-[0.15em] uppercase mt-4">
                Be among the first to experience PROTCTUS
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6 mt-6">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background/40 border-border/30 focus:border-primary/60 focus:bg-background/60 focus:shadow-[0_0_15px_rgba(255,255,255,0.05)] text-foreground placeholder:text-muted-foreground/40 font-light tracking-wider transition-all duration-300"
                  disabled={mutation.isPending}
                  data-testid="input-waitlist-email"
                  autoFocus
                />
              </div>

              <div className="flex gap-3 justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleClose}
                  disabled={mutation.isPending}
                  className="uppercase tracking-[0.2em] text-xs font-extralight hover:bg-white/5 transition-colors duration-300"
                  data-testid="button-cancel"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="default"
                  disabled={mutation.isPending || !email}
                  className="uppercase tracking-[0.2em] text-xs font-light bg-primary/90 hover:bg-primary shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                  data-testid="button-submit-waitlist"
                >
                  {mutation.isPending ? 'Joining...' : 'Join Waitlist'}
                </Button>
              </div>
            </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-light uppercase tracking-[0.2em] text-foreground">
                Success
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground font-extralight tracking-[0.15em] uppercase mt-4 space-y-4">
                <p>You're on the list.</p>
                <p className="text-xs">We'll notify you when PROTCTUS is ready.</p>
              </DialogDescription>
            </DialogHeader>

            <div className="flex justify-end mt-6">
              <Button
                onClick={handleClose}
                variant="default"
                className="uppercase tracking-[0.2em] text-xs font-light bg-primary/90 hover:bg-primary shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                data-testid="button-close-success"
              >
                Close
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
