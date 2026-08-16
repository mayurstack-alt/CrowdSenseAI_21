import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext(null);

export const normalizeRole = (role) => {
    const normalizedRole = String(role || 'citizen').trim().toLowerCase();
    return normalizedRole === 'authority' || normalizedRole === 'admin' ? 'authority' : 'citizen';
};

export const getDashboardPath = (role) => (
    normalizeRole(role) === 'authority' ? '/authority-dashboard' : '/citizen-dashboard'
);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    const applySession = (session) => {
        const nextUser = session?.user || null;
        setUser(nextUser);
        setRole(nextUser ? normalizeRole(nextUser.user_metadata?.role) : null);
    };

    useEffect(() => {
        let mounted = true;

        const loadSession = async () => {
            try {
                const { data, error } = await supabase.auth.getSession();
                if (error) throw error;
                if (mounted) applySession(data.session);
            } catch {
                if (mounted) applySession(null);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        loadSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!mounted) return;
            applySession(session);
            setLoading(false);
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const signIn = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        const authenticatedRole = normalizeRole(data.user?.user_metadata?.role);
        setUser(data.user);
        setRole(authenticatedRole);

        return { ...data, role: authenticatedRole, redirectTo: getDashboardPath(authenticatedRole) };
    };

    const signUp = async (name, email, phone, password, selectedRole = 'citizen') => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: name,
                    phone,
                    role: normalizeRole(selectedRole)
                }
            }
        });
        if (error) throw error;

        return {
            ...data,
            role: normalizeRole(data.user?.user_metadata?.role || selectedRole),
            redirectTo: getDashboardPath(data.user?.user_metadata?.role || selectedRole)
        };
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        applySession(null);
    };

    return (
        <AuthContext.Provider value={{ user, role, loading, signIn, signUp, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
}
