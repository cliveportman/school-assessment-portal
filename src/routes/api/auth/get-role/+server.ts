import { json } from '@sveltejs/kit';
import type { RequestHandler } from '../$types';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { AuthApiError } from '@supabase/supabase-js';
 
export const POST: RequestHandler = async (event) => {

  const { session, supabaseClient } = await getSupabase(event)
  const { uuid } = await event.request.json()
  const { data, error } = await supabaseClient.rpc(
    'get_role',
    { user_id: uuid }
  )
  if (error) {
    return json(error)
  }
  return json({ status: 200, role: data})

}