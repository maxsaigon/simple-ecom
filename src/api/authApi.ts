import { supabase } from '../lib/supabaseClient';

// Handles user sign-up, sign-in, sign-out
export async function signUp({ email, password, full_name }: { email: string; password: string; full_name: string }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name },
    },
  });
  if (error) throw error;
  return data;
}

export async function signInWithPassword({ email, password }: { email: string; password: string }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  return true;
}
