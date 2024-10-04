import type { PageServerLoad } from './$types'
import { getServerSession } from '@supabase/auth-helpers-sveltekit'
import { invalid, redirect } from '@sveltejs/kit';
import { AuthApiError, createClient } from '@supabase/supabase-js'
import { env } from '$env/dynamic/private'

const supabaseClient = createClient(env.PRIVATE_SUPABASE_URL, env.PRIVATE_SUPABASE_ROLE_KEY)

export const load: PageServerLoad = async (event) => {
  const session =  await getServerSession(event)
  
  if (session) {
    const { data, error } = await supabaseClient.rpc('is_academy', { user_id: session.user.id })
    if (!data) { // will return false if the user is not admin
      throw redirect(303, '/');
    }

    if (error) {
      if (error instanceof AuthApiError && error.status === 400) {
        return invalid(400, {
          error: 'Invalid credentials.',
          values: {}
        });
      }
      return invalid(500, {
        error: 'Server error. Try again later.',
        values: {}
      });
    }

  }

  return {
    session
  };
};