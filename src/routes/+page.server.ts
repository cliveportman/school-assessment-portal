import type { Actions } from './$types';
import { invalid, redirect } from '@sveltejs/kit';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { AuthApiError } from '@supabase/supabase-js';

export const actions: Actions = {

  default: async (event) => { 
    const { request, cookies, url } = event;
    const { session, supabaseClient } = await getSupabase(event)
    const formData = await request.formData();

    const email = formData.get('email') as string;
    
    const { error } = await supabaseClient.auth.signInWithOtp(
      { email }
    )

    if (error) {
      if (error instanceof AuthApiError && error.status === 400) {
        return invalid(400, {
          error: 'Invalid credentials.',
          values: {
            email
          }
        });
      }
      return invalid(500, {
        error: 'Server error. Try again later.',
        values: {
          email
        }
      });
    }

    throw redirect(303, '/auth');
  }
  
};