import { supabase } from '../lib/supabaseClient';
import type { Profile } from '../types';

// Handles profile management
export {}

export async function getProfile(): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', (await supabase.auth.getUser()).data.user?.id)
    .single();
  if (error) throw error;
  return data;
}

export async function updateProfile(profile: Partial<Profile>): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .update(profile)
    .eq('id', (await supabase.auth.getUser()).data.user?.id)
    .select()
    .single();
  if (error) throw error;
  return data;
}
