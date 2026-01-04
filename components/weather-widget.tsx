'use client';

import { useEffect, useState } from 'react';
import {
  Cloud,
  CloudFog,
  CloudRain,
  CloudSnow,
  Sun,
  Wind,
  Droplets,
  MapPin,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface WeatherData {
  temperature: number;
  weatherCode: number;
  windSpeed: number;
  humidity?: number;
}

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Balneário Gaivota - SC: -29.1555, -49.5861
    const lat = -29.1555;
    const lon = -49.5861;

    async function fetchWeather() {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`
        );
        const data = await res.json();

        const current = data.current || data.current_weather;

        setWeather({
          temperature: current.temperature_2m || current.temperature,
          weatherCode: current.weather_code || current.weathercode,
          windSpeed: current.wind_speed_10m || current.windspeed,
          humidity: current.relative_humidity_2m,
        });
      } catch (e) {
        console.error('Failed to fetch weather', e);
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
  }, []);

  const getWeatherIcon = (code: number) => {
    if (code <= 3)
      return <Sun className="h-10 w-10 animate-[spin_12s_linear_infinite] text-amber-400" />;
    if (code <= 48) return <CloudFog className="h-10 w-10 animate-pulse text-gray-400" />;
    if (code <= 67) return <CloudRain className="h-10 w-10 animate-bounce text-blue-400" />;
    if (code <= 77) return <CloudSnow className="h-10 w-10 animate-pulse text-cyan-200" />;
    return <Cloud className="h-10 w-10 animate-pulse text-gray-400" />;
  };

  const getGradient = (code: number) => {
    if (code <= 3) return 'from-amber-500/20 to-orange-500/5'; // Sunny
    if (code <= 67) return 'from-blue-500/20 to-cyan-500/5'; // Rain
    return 'from-gray-500/20 to-slate-500/5'; // Default/Cloudy
  };

  if (loading) {
    return (
      <div className="border-border/50 bg-muted/20 flex h-32 w-full animate-pulse items-center justify-center rounded-2xl border">
        <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
      </div>
    );
  }

  const bgGradient = weather ? getGradient(weather.weatherCode) : 'from-gray-500/20 to-slate-500/5';

  return (
    <div
      className={cn(
        'group bg-background/40 relative overflow-hidden rounded-2xl border border-white/10 backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-white/20 hover:shadow-2xl dark:border-white/5'
      )}
    >
      {/* Dynamic Background Gradient */}
      <div
        className={cn(
          'absolute inset-0 bg-linear-to-br opacity-50 transition-colors duration-1000',
          bgGradient
        )}
      />

      {/* Animated Glow Spot */}
      <div className="absolute top-0 right-0 -mt-16 -mr-16 h-32 w-32 rounded-full bg-white/10 blur-3xl transition-transform duration-700 group-hover:scale-150" />

      <div className="relative p-5">
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <div className="text-muted-foreground mb-1 flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase">
              <MapPin className="h-3 w-3" />
              <span>Baln. Gaivota</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="from-foreground to-foreground/70 bg-linear-to-r bg-clip-text text-4xl font-black tracking-tighter text-transparent tabular-nums">
                {Math.round(weather?.temperature || 0)}°
              </span>
              <span className="text-muted-foreground/80 text-sm font-medium">Hoje</span>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-2 shadow-sm backdrop-blur-sm transition-colors group-hover:bg-white/10">
            {weather && getWeatherIcon(weather.weatherCode)}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 rounded-lg bg-white/5 p-2 transition-colors group-hover:bg-white/10">
            <Wind className="h-4 w-4 text-blue-400" />
            <div className="flex flex-col">
              <span className="text-muted-foreground text-[10px] font-medium uppercase">Vento</span>
              <span className="font-mono text-sm font-bold">
                {weather?.windSpeed} <span className="text-muted-foreground text-[10px]">km/h</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-lg bg-white/5 p-2 transition-colors group-hover:bg-white/10">
            <Droplets className="h-4 w-4 text-cyan-400" />
            <div className="flex flex-col">
              <span className="text-muted-foreground text-[10px] font-medium uppercase">
                Umidade
              </span>
              <span className="font-mono text-sm font-bold">
                {weather?.humidity || '--'}{' '}
                <span className="text-muted-foreground text-[10px]">%</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
