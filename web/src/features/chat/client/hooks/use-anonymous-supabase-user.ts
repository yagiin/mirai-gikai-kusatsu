"use client";

import { createBrowserClient } from "@mirai-gikai/supabase";
import { useEffect, useState } from "react";

// Create a singleton Supabase client with persistent session
const supabase = createBrowserClient();

type AnonymousSupabaseUserState = {
  userId: string | undefined;
  isLoading: boolean;
  error: string | null;
};

/**
 * Hook to ensure an anonymous Supabase user exists and return the user ID
 * This will automatically create an anonymous user if none exists
 */
export function useAnonymousSupabaseUserState(): AnonymousSupabaseUserState {
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const ensureAnonUser = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Check if user already exists
        const {
          data: { user },
          error: getUserError,
        } = await supabase.auth.getUser();

        if (getUserError) {
          console.warn("Error fetching anonymous user:", getUserError);
        }

        if (user) {
          if (!cancelled) {
            setUserId(user.id);
          }
          return;
        }

        // No valid session -> sign in anonymously
        const { data, error: signInError } =
          await supabase.auth.signInAnonymously();

        if (signInError) {
          console.error("Error creating anonymous user:", signInError);
          if (!cancelled) {
            setError(signInError.message);
          }
          return;
        }

        if (data.user && !cancelled) {
          setUserId(data.user.id);
        }
      } catch (err) {
        console.error("Error ensuring anonymous user:", err);
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Unknown error");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    ensureAnonUser();

    return () => {
      cancelled = true;
    };
  }, []);

  return { userId, isLoading, error };
}

/**
 * Backward-compatible shorthand for existing components that only need user ID.
 */
export function useAnonymousSupabaseUser() {
  return useAnonymousSupabaseUserState().userId;
}
