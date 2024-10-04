import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
 
export const POST: RequestHandler = async (event) => {

  const { session, supabaseClient } = await getSupabase(event)
  const { values } = await event.request.json()

  const { data, error } = await supabaseClient
    .from('students')
    .select('id, first_name, last_name, email, menus, tests, group_task, hygiene, cth')
    .in('id', values.student_ids)

  if (error) { return json({ error }) }
  if (data) return json({ status: 200, data })

}