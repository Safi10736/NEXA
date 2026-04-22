import { supabase } from './supabase';

export async function logAdminAction(action: string, targetId: string, details: any) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('admin_logs').insert({
      admin_id: user.id,
      admin_email: user.email,
      action,
      target_id: targetId,
      details,
      created_at: new Date().toISOString()
    });
  } catch (err) {
    console.error("Failed to log admin action:", err);
  }
}
