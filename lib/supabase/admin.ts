import { createClient } from '@supabase/supabase-js';
import { Database } from '../database.types';
import { env } from '../env';

// Note: This client should only be used in server-side contexts (API routes, Server Actions, Server Components)
// where the SUPABASE_SERVICE_ROLE_KEY is available.
export const createAdminClient = () => {
  if (!env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not defined');
  }

  return createClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};
