import { json } from '@sveltejs/kit';
import type { RequestHandler } from '../$types';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { AuthApiError } from '@supabase/supabase-js';
 
export const POST: RequestHandler = async (event) => {

  const { session, supabaseClient } = await getSupabase(event)
  const { email, otp } = await event.request.json()
  const { data, error } = await supabaseClient.auth.verifyOtp(
    { email, token: otp, type: 'magiclink' }
  )

  if (error) {
    return json(error)
  }
  return json({ status: 200, uuid: data.user.id })

}