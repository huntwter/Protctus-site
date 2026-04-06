import { useEffect, useState } from 'react';

export default function ProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / scrollHeight) * 100;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-[2px] bg-border/20 z-50">
      <div
        className="h-full bg-gradient-to-r from-transparent via-primary/80 to-primary transition-all duration-150 ease-out shadow-[0_0_8px_rgba(255,255,255,0.4)]"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
}
