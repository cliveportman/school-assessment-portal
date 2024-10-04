import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
 
export const POST: RequestHandler = async (event) => {

  const { session, supabaseClient } = await getSupabase(event)
  const { values } = await event.request.json()

  let response
  if (values.id) {
    response = await supabaseClient
    .from('evidence')
    .select()
    .eq('id', values.id)
    .eq('student_id', values.student_id)
  }
  else {
    response = await supabaseClient
    .from('evidence')
    .select()
    .eq('student_id', values.student_id)
  }

  if (response.error) { return json({ error: response.error }) }
  return json({ status: 200, data: response.data })

}