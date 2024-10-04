import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { AuthApiError } from '@supabase/supabase-js';
 
export const POST: RequestHandler = async (event) => {

  const { session, supabaseClient } = await getSupabase(event)
  const { values } = await event.request.json()

  const { data, error } = await supabaseClient
  .from('evidence')
  .insert(values)
  .select()

  if (error) {
    return json({ error })
  }
  return json({ status: 200, data })

}