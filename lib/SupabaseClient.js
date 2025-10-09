// lib/SupabaseClient.js
import { createClient } from '@supabase/supabase-js'

// Read env vars (may be undefined during some build/prerender steps)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Create client only if both env vars are available. During prerender/build in
// environments where these are not set (or in unit tests), calling
// createClient(...) will throw. To avoid failing the entire build we export a
// lightweight stub that safely no-ops or returns neutral values. This keeps
// pages that import the client from crashing during prerender — but you must
// still set the environment variables in Vercel for the app to function.

let supabase = null

if (supabaseUrl && supabaseAnonKey) {
	supabase = createClient(supabaseUrl, supabaseAnonKey)
} else {
	// Minimal safe stub used during build/time when env vars are missing.
	// It provides the commonly used surface (auth.getUser, from, storage)
	// with neutral responses so prerender won't throw.
	supabase = {
		auth: {
			// returns no user by default
			async getUser() {
				return { data: { user: null }, error: null }
			},
		},
		from() {
			return {
				select: async () => ({ data: null, error: null }),
				insert: async () => ({ data: null, error: new Error('Supabase not configured') }),
				delete: async () => ({ data: null, error: new Error('Supabase not configured') }),
				update: async () => ({ data: null, error: new Error('Supabase not configured') }),
				order: () => ({ select: async () => ({ data: null, error: null }) }),
			}
		},
		storage: {
			from() {
				return {
					upload: async () => ({ data: null, error: new Error('Supabase storage not configured') }),
					remove: async () => ({ data: null, error: new Error('Supabase storage not configured') }),
					getPublicUrl: (path) => ({ publicURL: '', error: null }),
				}
			}
		}
	}
}

export { supabase }
