import { createClient } from '@supabase/supabase-js'

const rawUrl = import.meta.env.VITE_SUPABASE_URL
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// String-based check for "undefined" or "null" which some CI/CD tools inject
const isValid = (val) => val && val !== 'undefined' && val !== 'null' && val.length > 10;

const supabaseUrl = isValid(rawUrl) ? rawUrl : null;
const supabaseAnonKey = isValid(rawKey) ? rawKey : null;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('SUPABASE CONFIG ERROR: Missing or invalid environment variables.', { url: rawUrl, key: '***' });
}

// Create client only if URL is present, otherwise create a placeholder to avoid total app crash
export const supabase = supabaseUrl
    ? createClient(supabaseUrl, supabaseAnonKey)
    : {
        auth: {
            getSession: async () => {
                console.warn('Supabase fallback: getSession called without valid URL');
                return { data: { session: null }, error: null };
            },
            onAuthStateChange: () => {
                console.warn('Supabase fallback: onAuthStateChange called without valid URL');
                return { data: { subscription: { unsubscribe: () => { } } } };
            },
            signInWithPassword: async () => ({ error: { message: 'Supabase URL missing' } }),
            signInWithOAuth: async () => ({ error: { message: 'Supabase URL missing' } }),
            signOut: async () => ({ error: null })
        },
        from: () => ({
            select: () => ({
                eq: () => ({
                    single: () => ({ data: null, error: 'Supabase URL missing' }),
                    neq: () => ({ order: () => ({ data: [], error: 'Supabase URL missing' }) })
                }),
                order: () => ({
                    limit: () => ({ data: [], error: 'Supabase URL missing' })
                }),
                neq: () => ({ order: () => ({ data: [], error: 'Supabase URL missing' }) }),
                head: true
            })
        }),
        storage: { from: () => ({ upload: async () => ({ error: { message: 'Supabase URL missing' } }), getPublicUrl: () => ({ data: { publicUrl: '' } }) }) }
    };


