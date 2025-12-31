'use client';

import { useEffect } from 'react';
import { updateLastActive } from '@/app/actions/team';

export function UserActivityTracker() {
  useEffect(() => {
    // Update immediately on mount
    updateLastActive();

    // Update every 1 minute
    const interval = setInterval(
      () => {
        updateLastActive();
      },
      1 * 60 * 1000
    );

    return () => clearInterval(interval);
  }, []);

  return null;
}
