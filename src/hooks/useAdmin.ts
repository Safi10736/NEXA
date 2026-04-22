import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../AuthContext';

export function useAdmin() {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAdminStatus() {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        // Pure Database-Driven Security Check
        // Access is granted ONLY if the UID exists in the 'admins' table
        const { data, error } = await supabase
          .from('admins')
          .select('id')
          .eq('id', user.id)
          .eq('active', true) // Only active admins can login
          .maybeSingle(); // Better than single() as it doesn't throw on 0 rows
        
        setIsAdmin(!!data && !error);
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading) {
      checkAdminStatus();
    }
  }, [user, authLoading]);

  return { isAdmin, loading: authLoading || loading };
}
