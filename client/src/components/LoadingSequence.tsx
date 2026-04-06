import { useEffect, useState } from 'react';

interface LoadingSequenceProps {
  onComplete: () => void;
}

const loadingSteps = [
  'Establishing secure connection...',
  'Verifying credentials...',
  'Initializing PROTCTUS core...',
  'Ready.',
];

export default function LoadingSequence({ onComplete }: LoadingSequenceProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < loadingSteps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 800);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          clearInterval(stepInterval);
          setTimeout(() => onComplete(), 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#1C1919] z-50">
      <div className="max-w-2xl w-full px-8">
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-primary/20 blur-md rounded-full"></div>
          <div className="h-[1px] w-full bg-border/30 relative overflow-hidden rounded-full">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-transparent via-primary/80 to-primary transition-all duration-300 ease-out shadow-[0_0_10px_rgba(255,255,255,0.5)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="space-y-4">
          {loadingSteps.map((step, index) => (
            <p
              key={index}
              className={`text-xs uppercase tracking-[0.3em] font-extralight transition-all duration-700 ${
                index <= currentStep
                  ? 'text-foreground/80 opacity-100 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] translate-x-0'
                  : 'text-foreground/20 opacity-0 -translate-x-2'
              }`}
              data-testid={`loading-step-${index}`}
            >
              <span className="text-primary/70 mr-2">{index === currentStep ? '>' : '✓'}</span>
              {step}
            </p>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground/40 text-[10px] uppercase tracking-[0.4em] font-extralight">
            {progress}%
          </p>
        </div>
      </div>
    </div>
  );
}
