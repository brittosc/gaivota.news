'use client';

import Image from 'next/image';

const supporters = [
  { name: 'Apoiador 1', logo: 'https://placehold.co/100x100?text=Apoiador+1' },
  { name: 'Apoiador 2', logo: 'https://placehold.co/100x100?text=Apoiador+2' },
  { name: 'Apoiador 3', logo: 'https://placehold.co/100x100?text=Apoiador+3' },
  { name: 'Apoiador 4', logo: 'https://placehold.co/100x100?text=Apoiador+4' },
  { name: 'Apoiador 5', logo: 'https://placehold.co/100x100?text=Apoiador+5' },
  { name: 'Apoiador 6', logo: 'https://placehold.co/100x100?text=Apoiador+6' },
  { name: 'Apoiador 7', logo: 'https://placehold.co/100x100?text=Apoiador+7' },
  { name: 'Apoiador 8', logo: 'https://placehold.co/100x100?text=Apoiador+8' },
  { name: 'Apoiador 9', logo: 'https://placehold.co/100x100?text=Apoiador+9' },
  { name: 'Apoiador 10', logo: 'https://placehold.co/100x100?text=Apoiador+10' },
  { name: 'Apoiador 11', logo: 'https://placehold.co/100x100?text=Apoiador+11' },
  { name: 'Apoiador 12', logo: 'https://placehold.co/100x100?text=Apoiador+12' },
];

export function SupportersMarquee() {
  return (
    <div className="bg-muted w-full overflow-hidden py-10">
      <div className="container mx-auto mb-6 max-w-4xl px-4">
        <h3 className="text-muted-foreground text-center text-lg font-semibold tracking-wider uppercase">
          Nossos Apoiadores
        </h3>
      </div>
      <div className="container mx-auto max-w-4xl overflow-hidden px-4">
        {supporters.length > 5 ? (
          <div className="flex w-full overflow-hidden">
            {/* Wrapper for the moving track - logic: 2 sets of items, move -50% */}
            <div className="animate-marquee flex min-w-full shrink-0 items-center justify-around gap-8">
              {supporters.map((supporter, index) => (
                <div
                  key={index}
                  className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full sm:h-24 sm:w-24"
                >
                  <Image
                    src={supporter.logo}
                    alt={supporter.name}
                    height={96}
                    width={96}
                    className="h-full w-full rounded-full object-cover opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                    unoptimized
                  />
                </div>
              ))}
              {supporters.map((supporter, index) => (
                <div
                  key={`dup-${index}`}
                  className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full sm:h-24 sm:w-24"
                >
                  <Image
                    src={supporter.logo}
                    alt={supporter.name}
                    height={96}
                    width={96}
                    className="h-full w-full rounded-full object-cover opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                    unoptimized
                  />
                </div>
              ))}
            </div>
            {/* Need a second identical track for continuous effect if using the translate-x-100% of individual track method?
                 Actually, the standard trick is:
                 Parent (overflow hidden)
                   Track (width 200%, flex) -> Animate this?
                 
                 Let's stick to the simpler:
                 Track contains [Items][Items].
                 Animation moves Track from 0% to -50%.
                 
                 Wait, if Track has 2 sets. CSS: transform: translateX(-50%).
                 This assumes the track's width is based on content.
             */}
          </div>
        ) : (
          <div className="flex w-full justify-center overflow-x-auto">
            <div className="flex items-center gap-8 whitespace-nowrap">
              {supporters.map((supporter, index) => (
                <div
                  key={index}
                  className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full sm:h-24 sm:w-24"
                >
                  <Image
                    src={supporter.logo}
                    alt={supporter.name}
                    height={96}
                    width={96}
                    className="h-full w-full rounded-full object-cover opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
          width: fit-content;
          /* Ensure we have enough width logic */
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
