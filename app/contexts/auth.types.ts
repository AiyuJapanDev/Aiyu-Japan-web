
import { User, Session } from '@supabase/supabase-js';

export type UserRole = 'admin' | 'user' | 'moderator';

export interface Profile {
  id: string;
  full_name?: string | null;
  email?: string | null;
  phone_number?: string | null;
  address?: string | null;
  address_notes?: string | null;
  country?: string | null;
  postal_code?: string | null;
  user_personal_id?: string | null;
  city?: string | null;
  state?: string | null;
  tax_vat_Id: string | null;
  credit_balance?: number | null;
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  userRole: UserRole | null;
  isAdmin: boolean;
  profile: Profile | null;
  signUp: (email: string, password: string, fullName: string, additionalData?: any) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  assignRole: (userId: string, role: UserRole) => Promise<{ error: any }>;
  refreshProfile: () => Promise<void>;
}
