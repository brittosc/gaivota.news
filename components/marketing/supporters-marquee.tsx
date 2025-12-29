'use client';

import Image from 'next/image';

const supporters = [
  { name: 'Apoiador 1', logo: 'https://placehold.co/150x50?text=Apoiador+1' },
  { name: 'Apoiador 2', logo: 'https://placehold.co/150x50?text=Apoiador+2' },
  { name: 'Apoiador 3', logo: 'https://placehold.co/150x50?text=Apoiador+3' },
  { name: 'Apoiador 4', logo: 'https://placehold.co/150x50?text=Apoiador+4' },
  { name: 'Apoiador 5', logo: 'https://placehold.co/150x50?text=Apoiador+5' },
];

export function SupportersMarquee() {
  return (
    <div className="bg-background w-full overflow-hidden py-10">
      <div className="mb-6 text-center">
        <h3 className="text-muted-foreground text-lg font-semibold tracking-wider uppercase">
          Nossos Apoiadores
        </h3>
      </div>
      <div className="relative flex w-full overflow-hidden">
        <div className="animate-marquee flex whitespace-nowrap">
          {supporters.map((supporter, index) => (
            <div key={index} className="mx-8 flex items-center justify-center">
              <Image
                src={supporter.logo}
                alt={supporter.name}
                height={48}
                width={150}
                className="h-12 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                style={{ width: 'auto', height: '48px' }}
                unoptimized
              />
            </div>
          ))}
          {/* Duplicate for seamless loop */}
          {supporters.map((supporter, index) => (
            <div key={`dup-${index}`} className="mx-8 flex items-center justify-center">
              <Image
                src={supporter.logo}
                alt={supporter.name}
                height={48}
                width={150}
                className="h-12 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                style={{ width: 'auto', height: '48px' }}
                unoptimized
              />
            </div>
          ))}
          {/* Triplicate for large screens if needed */}
          {supporters.map((supporter, index) => (
            <div key={`trip-${index}`} className="mx-8 flex items-center justify-center">
              <Image
                src={supporter.logo}
                alt={supporter.name}
                height={48}
                width={150}
                className="h-12 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                style={{ width: 'auto', height: '48px' }}
                unoptimized
              />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
