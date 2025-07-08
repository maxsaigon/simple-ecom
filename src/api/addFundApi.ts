import { supabase } from '../lib/supabaseClient';
import type { Profile, Transaction } from '../types';

// Add fund for testing: update wallet_balance and insert transaction
export async function addFund(amount: number): Promise<{ profile: Profile; transaction: Transaction }> {
  const userId = (await supabase.auth.getUser()).data.user?.id;
  if (!userId) throw new Error('Chưa đăng nhập');

  // Lấy profile hiện tại
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (profileError || !profile) throw profileError || new Error('Không tìm thấy profile');

  const newBalance = profile.wallet_balance + amount;

  // Update balance
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ wallet_balance: newBalance })
    .eq('id', userId);
  if (updateError) throw updateError;

  // Insert transaction
  const { data: transaction, error: txError } = await supabase
    .from('transactions')
    .insert({
      user_id: userId,
      type: 'deposit',
      amount,
      balance_after: newBalance,
      description: 'Nạp tiền thủ công (test)',
    })
    .select()
    .single();
  if (txError) throw txError;

  return { profile: { ...profile, wallet_balance: newBalance }, transaction };
}
