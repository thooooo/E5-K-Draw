import { createClient } from '@supabase/supabase-js'

let supabase_url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://uwgcchivhnirzjamygqv.supabase.co"
let supabase_key = process.env.NEXT_PUBLIC_SUPABASE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3Z2NjaGl2aG5pcnpqYW15Z3F2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDg0MjAyOTUsImV4cCI6MjAyMzk5NjI5NX0.Mte3RWleAt6UEADkwkOFJznwRZfsymx0Xbg748BZnZc"

const getSupabase = (access_token: string) => {
  const supabase = createClient(
    supabase_url,
    supabase_key
  )

  supabase.auth.setSession = () => ({
    access_token,
    token_type: "",
    user: null
  })

  return supabase
}

export { getSupabase }
