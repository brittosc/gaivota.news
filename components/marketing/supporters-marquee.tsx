import { createClient } from '@/lib/supabase/server';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
export async function SupportersMarquee() {
  const supabase = await createClient();

  // Fetch settings
  const { data: settingsData } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'supporters_marquee')
    .single();

  const settings = (settingsData?.value || {}) as { speed?: number; maxItems?: number };
  const limit = settings.maxItems || 20;
  const speed = settings.speed || 30;

  const { data: supporters } = await supabase
    .from('supporters')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (!supporters || supporters.length === 0) {
    return null;
  }

  // Ensure enough items for seamless loop (min 20 items total or more if needed)
  // If we have few supporters, duplicate them many times.
  // If we have many, we might duplicate less, but "Marquee" usually needs at least 2 full sets.
  // Actually, standard marquee needs 2 sets: Original + Copy.
  // BUT if Original is narrower than screen, 2 sets might NOT be enough.
  // Best practice: Ensure the "set" is wide enough to cover screen, THEN duplicate that set once.
  // Since we don't know screen width, let's target a high number of items, e.g. 20.

  const MIN_DISPLAY_ITEMS = 20;
  const repeatCount = Math.ceil(MIN_DISPLAY_ITEMS / supporters.length);
  const repeatedSupporters = Array.from({ length: repeatCount }).flatMap(() => supporters);
  const t = getTranslations('Components');
  // We need TWO sets of this "wide content" for the CSS animation to loop perfectly?
  // CSS: transform: translateX(-100%) moves the ENTIRE container width left.
  // So we need 2 identical containers side-by-side.
  // We already have that structure in the JSX:
  // <div className="animate-marquee ..."> {content} {content_dup} </div>
  // The {content} must be wide enough.

  return (
    <div className="bg-muted w-full overflow-hidden py-10">
      <div className="container mx-auto mb-6 max-w-4xl px-4">
        <h3 className="text-muted-foreground text-center text-lg font-semibold tracking-wider uppercase">
          {(await t)('Sidebar.supporters')}
        </h3>
      </div>
      <div className="mx-auto w-[95%] overflow-hidden py-4 sm:w-[90%]">
        <div className="group flex w-full">
          <div
            className="animate-marquee flex min-w-full shrink-0 items-center justify-around gap-8 pr-8"
            style={{ animationDuration: `${speed}s` }}
          >
            {repeatedSupporters.map((supporter, index) => (
              <a
                key={`${supporter.id}-${index}-1`}
                href={supporter.link || '#'}
                target={supporter.link ? '_blank' : undefined}
                className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full transition-transform hover:scale-110 sm:h-24 sm:w-24"
                aria-label={`Visitar página de ${supporter.name}`}
              >
                <Image
                  src={
                    supporter.avatar_url ||
                    `https://placehold.co/100x100?text=${supporter.name.charAt(0)}`
                  }
                  alt={supporter.name}
                  height={96}
                  width={96}
                  className="h-full w-full rounded-full object-cover opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                  unoptimized
                />
              </a>
            ))}
          </div>
          {/* Duplicate set for seamless loop */}
          <div
            className="animate-marquee flex min-w-full shrink-0 items-center justify-around gap-8 pr-8"
            style={{ animationDuration: `${speed}s` }}
            aria-hidden="true"
          >
            {repeatedSupporters.map((supporter, index) => (
              <a
                key={`${supporter.id}-${index}-2`}
                href={supporter.link || '#'}
                target={supporter.link ? '_blank' : undefined}
                className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full transition-transform hover:scale-110 sm:h-24 sm:w-24"
                tabIndex={-1}
                aria-label={`Visitar página de ${supporter.name}`}
              >
                <Image
                  src={
                    supporter.avatar_url ||
                    `https://placehold.co/100x100?text=${supporter.name.charAt(0)}`
                  }
                  alt={supporter.name}
                  height={96}
                  width={96}
                  className="h-full w-full rounded-full object-cover opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                  unoptimized
                />
              </a>
            ))}
          </div>
        </div>
      </div>

      <style>{`
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
        .group:hover .animate-marquee {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
