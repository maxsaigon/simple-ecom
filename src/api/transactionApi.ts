import { supabase } from '../lib/supabaseClient';
import type { Transaction } from '../types';

export async function getTransactions(): Promise<Transaction[]> {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}
