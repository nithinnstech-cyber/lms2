import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes("your_supabase") || supabaseKey.includes("your_supabase")) {
    console.error("\n[Supabase Configuration Error] Missing or invalid credentials in .env.local.");
    console.error("-> Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
    
    // Return a dummy client that will fail gracefully at runtime but won't crash the build process
    return createServerClient(
      "https://placeholder.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9", 
      { 
        cookies: { 
          get(name: string) { return undefined; }, 
          set(name: string, value: string, options: CookieOptions) {}, 
          remove(name: string, options: CookieOptions) {} 
        } 
      }
    );
  }

  const cookieStore = cookies()

  return createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Unreachable from server components, usually ok
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // Unreachable from server components, usually ok
          }
        },
      },
    }
  )
}
