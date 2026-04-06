import { useEffect, useState } from 'react';

export default function ScrollIndicator() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-12 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center gap-4 animate-in fade-in duration-1000 delay-1000">
      <p className="text-muted-foreground/50 text-xs uppercase tracking-[0.3em] font-extralight">
        Scroll to explore
      </p>
      <div className="w-[1px] h-12 bg-gradient-to-b from-muted-foreground/50 to-transparent animate-pulse" />
    </div>
  );
}
