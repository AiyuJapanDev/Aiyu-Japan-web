import React, { createContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { fetchUserMeta } from "../../Aiyu-Japan-V1.1-main (1)/Aiyu-Japan-V1.1-main/src/contexts/auth.utils";
import type {
  AuthContextType,
  UserRole,
  Profile,
} from "../../Aiyu-Japan-V1.1-main (1)/Aiyu-Japan-V1.1-main/src/contexts/auth.types";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const { toast } = useToast();

  const isAdmin = userRole === "admin";

  console.log(
    "AuthProvider - user:",
    user?.id,
    "userRole:",
    userRole,
    "isAdmin:",
    isAdmin
  );

  // Listen to auth changes and initial session
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state change:", event, "user:", session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      console.log("Fetching user meta for:", user.id);
      fetchUserMeta(user.id, setProfile, setUserRole);
    } else {
      console.log("No user, clearing role and profile");
      setUserRole(null);
      setProfile(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    additionalData?: any
  ) => {
    const redirectUrl = `${window.location.origin}/auth?verified=true`;
    const metadata = {
      full_name: fullName,
      ...(additionalData || {}),
    };
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: metadata,
      },
    });
    if (error) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Check your email",
        description: "We've sent you a verification link.",
      });
    }
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "You've been signed in successfully.",
      });
    }
    return { error };
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      // If error is "session not found", treat it as success
      // since the user is already signed out on the server
      if (error && !error.message?.toLowerCase().includes("session")) {
        // Only show error for non-session-related issues
        toast({
          title: "Sign out failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        // Success or session already gone
        toast({
          title: "Signed out",
          description: "You've been signed out successfully.",
        });
      }
    } catch (error: any) {
      // Handle unexpected errors but still allow local state to clear
      console.error("Sign out error:", error);

      // Don't block sign out - local state will clear via auth state listener
      toast({
        title: "Signed out",
        description: "You've been signed out successfully.",
      });
    }

    // Always clear local state regardless of server response
    setSession(null);
    setUser(null);
    setUserRole(null);
    setProfile(null);
  };

  const resetPassword = async (email: string) => {
    const redirectUrl = `${window.location.origin}/auth/reset-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });
    if (error) {
      toast({
        title: "Password reset failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Check your email",
        description: "We've sent you a password reset link.",
      });
    }
    return { error };
  };

  const assignRole = async (userId: string, role: UserRole) => {
    if (!isAdmin) {
      const error = { message: "Only admins can assign roles" };
      toast({
        title: "Permission denied",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
    const { error } = await supabase
      .from("user_roles")
      .upsert({ user_id: userId, role: role, assigned_by: user?.id });
    if (error) {
      toast({
        title: "Role assignment failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Role assigned",
        description: `User role updated to ${role}`,
      });
    }
    return { error };
  };

  const refreshProfile = async () => {
    if (!user?.id) return;
    await fetchUserMeta(user.id, setProfile, setUserRole);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        userRole,
        isAdmin,
        profile,
        signUp,
        signIn,
        signOut,
        resetPassword,
        assignRole,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
