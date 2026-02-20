import { supabase } from '@/integrations/supabase/client';
import { Profile, UserRole } from './auth.types';

export const fetchUserMeta = async (
  userId: string,
  setProfile: (p: Profile | null) => void,
  setUserRole: (u: UserRole | null) => void
) => {
  try {
    console.log('fetchUserMeta - Starting fetch for user:', userId);
    
    const [{ data: profileData, error: profileError }, { data: roleData, error: roleError }] = await Promise.all([
      supabase
        .from('profiles')
        .select('id, full_name, email, phone_number, address, address_notes, country, postal_code, user_personal_id, city, state, tax_vat_Id, credit_balance' as any)
        .eq('id', userId)
        .maybeSingle() as any,
      supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle(),
    ]);

    console.log('fetchUserMeta - Profile data:', profileData, 'Profile error:', profileError);
    console.log('fetchUserMeta - Role data:', roleData, 'Role error:', roleError);

    if (profileError || !profileData) {
      console.log('fetchUserMeta - Setting profile to null');
      setProfile(null);
    } else {
      console.log('fetchUserMeta - Setting profile:', profileData);
      setProfile(profileData);
    }
    
    if (roleError) {
      console.log('fetchUserMeta - Role error, defaulting to user');
      setUserRole('user');
    } else if (!roleData) {
      console.log('fetchUserMeta - No role data, defaulting to user');
      setUserRole('user');
    } else {
      console.log('fetchUserMeta - Setting role:', roleData.role);
      setUserRole(roleData.role as UserRole);
    }
  } catch (error) {
    console.error('[AuthUtils] Error fetching user meta:', error);
    setProfile(null);
    setUserRole('user');
  }
};
