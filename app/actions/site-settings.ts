'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getSiteSettings(key: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', key)
    .single();

  if (error && error.code !== 'PGRST116') {
    // PGRST116 is no rows returned, which is fine (default settings)
    console.error('Error fetching settings:', error);
  }

  return data?.value || null;
}

import { Json } from '@/lib/database.types';

export async function updateSiteSettings(key: string, value: Json) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  // Check role (redundant with RLS but good for UX feedback)
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  const { error } = await supabase.from('site_settings').upsert({
    key,
    value,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    console.error('Error updating settings:', error);
    throw new Error('Failed to update settings');
  }

  revalidatePath('/'); // Revalidate everywhere settings might be used
  return { success: true };
}
