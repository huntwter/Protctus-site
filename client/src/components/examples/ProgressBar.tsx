import ProgressBar from '../ProgressBar';

export default function ProgressBarExample() {
  return (
    <div className="min-h-[300vh] bg-background">
      <ProgressBar />
      <div className="h-screen flex items-center justify-center">
        <p className="text-foreground">Scroll down to see the progress bar</p>
      </div>
      <div className="h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Keep scrolling...</p>
      </div>
      <div className="h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Almost there...</p>
      </div>
    </div>
  );
}
