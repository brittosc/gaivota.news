'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function searchUserByEmail(email: string) {
  const supabase = await createClient();

  // Verify if current user is admin
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Unauthorized' };
  }

  const { data: currentUserProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (currentUserProfile?.role !== 'admin') {
    return { error: 'Unauthorized' };
  }

  // Use admin client to search user by email
  const adminSupabase = createAdminClient();
  const { data: users, error } = await adminSupabase.auth.admin.listUsers();

  if (error) {
    console.error('Error fetching users:', error);
    return { error: 'Failed to fetch users' };
  }

  // Filter users by email (since listUsers doesn't support direct email search efficiently for all providers,
  // but for small scale this is fine. For better scaling we might need `listUsers({ filter: email })` if supported
  // or rely on unique email constraints if we can fetch by email directly, but getting user by email is usually restricted)
  // Actually, listUsers does not allow filtering by email directly in all versions, let's try to find it in the list.

  const foundUser = users.users.find(u => u.email === email);

  if (!foundUser) {
    return { error: 'User not found' };
  }

  // Check if profile exists
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', foundUser.id)
    .single();

  if (profile) {
    return { user: profile };
  }

  // If profile doesn't exist (edge case), return basic info
  return {
    user: {
      id: foundUser.id,
      email: foundUser.email,
      role: 'user', // Default
      full_name: foundUser.user_metadata?.full_name || 'No Name',
      avatar_url: foundUser.user_metadata?.avatar_url || null,
    },
  };
}

export async function updateUserRole(userId: string, role: 'admin' | 'editor' | 'user') {
  const supabase = await createClient();

  // Verify if current user is admin
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Unauthorized' };
  }

  const { data: currentUserProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (currentUserProfile?.role !== 'admin') {
    return { error: 'Unauthorized' };
  }

  // Use admin client to bypass RLS for updating another user's profile
  const adminSupabase = createAdminClient();
  const { error } = await adminSupabase.from('profiles').update({ role }).eq('id', userId);

  if (error) {
    console.error('Error updating role:', error);
    return { error: 'Failed to update role' };
  }

  revalidatePath('/admin/team');
  return { success: true };
}

export async function updateLastActive() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  await supabase
    .from('profiles')
    .update({ last_active_at: new Date().toISOString() })
    .eq('id', user.id);
}
