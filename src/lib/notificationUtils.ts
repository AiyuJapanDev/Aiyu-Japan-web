import { supabase } from '@/integrations/supabase/client';

export async function createNotification(
  userId: string,
  type: string,
  message: string,
  personalOrderId?: string,
  personalShippingId?: string,
  orderId?: string


): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type,
        message,
        personal_order_id: personalOrderId || null,
        personal_shipping_id: personalShippingId || null,
        order_group_id: orderId || null

      })
      .select('id')
      .single();

    if (error) throw error;
    return data?.id || null;
  } catch (error) {
    console.error('Failed to create notification:', error);
    return null;
  }
}

export async function notifyAllAdmins(
  type: string,
  message: string,
  orderId?: string
): Promise<void> {
  try {
    const { error } = await supabase.rpc('notify_admins_about_order', {
      p_type: type,
      p_message: message,
      p_order_id: orderId || null,
    });

    if (error) throw error;

    console.log('✅ Admin notifications created successfully');
  } catch (error) {
    console.error('Failed to notify admins:', error);
  }
}

