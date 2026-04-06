import { useState } from 'react';
import LoadingSequence from '../LoadingSequence';

export default function LoadingSequenceExample() {
  const [isComplete, setIsComplete] = useState(false);

  if (isComplete) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <p className="text-foreground">Loading complete!</p>
      </div>
    );
  }

  return <LoadingSequence onComplete={() => setIsComplete(true)} />;
}
