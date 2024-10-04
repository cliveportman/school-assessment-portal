import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { AuthApiError } from '@supabase/supabase-js';
 
export const POST: RequestHandler = async (event) => {

  const { session, supabaseClient } = await getSupabase(event)
  const { values } = await event.request.json()

  const { data, error } = await supabaseClient
  .from('evidence')
  .update(values)
  .eq('id', values.id)
  .select()

  if (data) return json({ status: 200, data })

  if (error) return json({ error })
  
  

}