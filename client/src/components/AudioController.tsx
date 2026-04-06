import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';

interface AudioControllerProps {
  autoPlay?: boolean;
}

export default function AudioController({ autoPlay = false }: AudioControllerProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    const audioContext = new AudioContext();
    audioContextRef.current = audioContext;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(55, audioContext.currentTime);
    
    gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillatorRef.current = oscillator;
    gainNodeRef.current = gainNode;

    if (autoPlay) {
      oscillator.start();
      setIsPlaying(true);
    }

    return () => {
      if (oscillatorRef.current) {
        try {
          oscillatorRef.current.stop();
        } catch (e) {
        }
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [autoPlay]);

  const toggleMute = () => {
    if (!gainNodeRef.current) return;

    if (isMuted) {
      gainNodeRef.current.gain.setValueAtTime(0.05, audioContextRef.current!.currentTime);
      setIsMuted(false);
    } else {
      gainNodeRef.current.gain.setValueAtTime(0, audioContextRef.current!.currentTime);
      setIsMuted(true);
    }
  };

  const startAudio = () => {
    if (!oscillatorRef.current || isPlaying) return;
    
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    const audioContext = new AudioContext();
    audioContextRef.current = audioContext;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(55, audioContext.currentTime);
    gainNode.gain.setValueAtTime(isMuted ? 0 : 0.05, audioContext.currentTime);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillatorRef.current = oscillator;
    gainNodeRef.current = gainNode;
    
    oscillator.start();
    setIsPlaying(true);
  };

  return (
    <div className="fixed bottom-8 right-8 z-30">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          if (!isPlaying) {
            startAudio();
          } else {
            toggleMute();
          }
        }}
        className="rounded-full border border-border/30 bg-background/10 backdrop-blur-sm hover:bg-background/20 hover:border-border/50"
        data-testid="button-audio-toggle"
      >
        {isMuted || !isPlaying ? (
          <VolumeX className="h-4 w-4" />
        ) : (
          <Volume2 className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
