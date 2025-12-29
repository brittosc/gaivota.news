import { Organization, WithContext } from 'schema-dts';
import { env } from '@/lib/env';

export function JsonLd() {
  const structuredData: WithContext<Organization> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Seu Sistema',
    url: env.NEXT_PUBLIC_SITE_URL,
    logo: `${env.NEXT_PUBLIC_SITE_URL}/logo.png`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
