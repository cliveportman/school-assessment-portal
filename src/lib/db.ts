import { createClient } from '@supabase/auth-helpers-sveltekit'

export const supabaseClient = createClient(
  'https://zlsljdoxquofxqljooal.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpsc2xqZG94cXVvZnhxbGpvb2FsIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjA1NzYwMjIsImV4cCI6MTk3NjE1MjAyMn0.vi3C7s6AWnaaS7FIAvUhXiXCN9bTTLqrnQuebYqTufw'
)