'use client';

import * as React from 'react';
import { Play, Pause, Volume2, VolumeX, Download } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CustomAudioPlayerProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
}

export function CustomAudioPlayer({ src, className, ...props }: CustomAudioPlayerProps) {
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [volume, setVolume] = React.useState(0.5); // Default 50%
  const [isMuted, setIsMuted] = React.useState(false);
  const [playbackRate, setPlaybackRate] = React.useState(1);

  React.useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]); // Set initial volume on mount

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setProgress(value[0]);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    if (audioRef.current) {
      const newVolume = value[0];
      audioRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      const newMuted = !isMuted;
      audioRef.current.muted = newMuted;
      setIsMuted(newMuted);
    }
  };

  const changeSpeed = (speed: number) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
      setPlaybackRate(speed);
    }
  };

  const handleDownload = () => {
    if (!src) return;
    const link = document.createElement('a');
    link.href = src;
    link.download = src.split('/').pop() || 'audio-download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className={cn(
        'bg-muted/50 border-border/50 hover:bg-muted/80 flex h-12 w-full max-w-md items-center gap-3 rounded-xl border px-3 shadow-sm backdrop-blur-sm transition-all md:w-fit md:min-w-90',
        className
      )}
      {...props}
    >
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />

      <Button
        type="button"
        variant="secondary"
        size="icon"
        className="h-8 w-8 shrink-0 rounded-lg bg-emerald-500 text-white shadow-sm hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500"
        onClick={togglePlay}
      >
        {isPlaying ? (
          <Pause className="h-4 w-4 fill-current" />
        ) : (
          <Play className="ml-0.5 h-4 w-4 fill-current" />
        )}
      </Button>

      <div className="flex flex-1 flex-col justify-center gap-1">
        <Slider
          value={[progress]}
          max={duration || 100}
          step={0.1}
          onValueChange={handleSeek}
          className="cursor-pointer **:[[role=slider]]:hidden [&>.relative]:h-1 [&>.relative>.absolute]:bg-emerald-500"
        />
        <div className="text-muted-foreground flex justify-between px-0.5 text-[10px] font-medium tracking-tight">
          <span>{formatTime(progress)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex items-center gap-0.5">
        {/* Speed Control */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:bg-background hover:text-foreground h-8 w-8 rounded-md"
            >
              <span className="text-xs font-bold">{playbackRate}x</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {[0.5, 1, 1.25, 1.5, 2].map(rate => (
              <DropdownMenuItem key={rate} onClick={() => changeSpeed(rate)}>
                {rate}x
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Volume */}
        <div className="group/volume relative flex items-center">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:bg-background hover:text-foreground h-8 w-8 rounded-md"
            onClick={toggleMute}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
          <div className="bg-popover animate-in fade-in slide-in-from-bottom-1 border-border/50 absolute bottom-full left-1/2 z-50 mb-2 hidden h-28 min-w-10 -translate-x-1/2 flex-col justify-center rounded-lg border p-3 shadow-xl group-hover/volume:flex after:absolute after:-bottom-4 after:left-0 after:h-4 after:w-full after:content-['']">
            <Slider
              orientation="vertical"
              value={[isMuted ? 0 : volume]}
              max={1}
              step={0.01}
              onValueChange={handleVolumeChange}
              className="min-h-0! w-full cursor-pointer [&>.relative>.absolute]:bg-emerald-500"
            />
          </div>
        </div>

        {/* Download */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:bg-background hover:text-foreground h-8 w-8 rounded-md"
          onClick={handleDownload}
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
