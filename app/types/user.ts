
export type UserRole = 'admin' | 'user' | 'moderator';

export interface UserProfile {
  id: string;
  full_name: string | null;
  created_at: string;
  user_personal_id?: string | null;
}

export interface UserWithRole {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  created_at: string;
  user_personal_id?: string | null;
  country?: string | null;
}
