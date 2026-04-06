import { useState } from 'react';
import WaitlistModal from '../WaitlistModal';
import { Button } from '@/components/ui/button';

export default function WaitlistModalExample() {
  const [open, setOpen] = useState(false);

  return (
    <div className="h-screen bg-background flex items-center justify-center">
      <Button onClick={() => setOpen(true)} data-testid="button-open-modal">
        Open Waitlist Modal
      </Button>
      <WaitlistModal open={open} onOpenChange={setOpen} />
    </div>
  );
}
