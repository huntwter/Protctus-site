import AudioController from '../AudioController';

export default function AudioControllerExample() {
  return (
    <div className="h-screen bg-background flex items-center justify-center">
      <AudioController />
      <p className="text-muted-foreground">Click the audio button in the bottom right</p>
    </div>
  );
}
