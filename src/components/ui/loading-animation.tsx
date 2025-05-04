const LoadingAnimation = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative h-24 w-24">
        {/* Outer spinning circle */}
        <div className="animate-spin-slow absolute inset-0 h-full w-full rounded-full border-4 border-b-transparent border-l-transparent border-r-transparent border-t-primary" />

        {/* Middle spinning circle (opposite direction) */}
        <div className="animate-spin-reverse absolute inset-2 h-5/6 w-5/6 rounded-full border-4 border-b-transparent border-l-transparent border-r-primary border-t-transparent" />

        {/* Inner pulsing circle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-12 w-12 animate-ping rounded-full bg-primary/20" />
          <div className="absolute h-8 w-8 animate-pulse rounded-full bg-primary/40" />
        </div>
      </div>
    </div>
  );
};

export default LoadingAnimation;
