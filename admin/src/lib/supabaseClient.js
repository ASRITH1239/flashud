import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Safety Check: Prevent the app from crashing on Vercel if environment variables aren't set yet
if (!supabaseUrl || !supabaseAnonKey) {
    console.error('CRITICAL ERROR: Supabase environment variables are missing! The admin panel will not function correctly until VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your project settings.')
}

// Create client only if URL is present, otherwise create a placeholder to avoid total app crash
export const supabase = supabaseUrl
    ? createClient(supabaseUrl, supabaseAnonKey)
    : {
        auth: { getSession: async () => ({ data: { session: null } }), onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }) },
        from: () => ({ select: () => ({ eq: () => ({ single: () => ({ data: null, error: 'Supabase URL missing' }) }), order: () => ({ limit: () => ({ data: [], error: 'Supabase URL missing' }) }), head: true }) }),
        storage: { from: () => ({ upload: async () => ({ error: { message: 'Supabase URL missing' } }), getPublicUrl: () => ({ data: { publicUrl: '' } }) }) }
    };

