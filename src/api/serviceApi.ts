import { supabase } from '../lib/supabaseClient';
import type { Service } from '../types';

// CRUD for services
export async function getServices(): Promise<Service[]> {
  const { data, error } = await supabase.from('services').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getServiceById(id: number): Promise<Service | null> {
  const { data, error } = await supabase.from('services').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function createService(service: Omit<Service, 'id' | 'created_at'>): Promise<Service> {
  const { data, error } = await supabase.from('services').insert(service).select().single();
  if (error) throw error;
  return data;
}

export async function updateService(id: number, service: Partial<Service>): Promise<Service> {
  const { data, error } = await supabase.from('services').update(service).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteService(id: number): Promise<void> {
  const { error } = await supabase.from('services').delete().eq('id', id);
  if (error) throw error;
}
