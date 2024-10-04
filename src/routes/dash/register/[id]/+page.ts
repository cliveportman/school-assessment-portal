import { error, redirect } from '@sveltejs/kit'
import type { PageLoad } from './$types'

import { RegisterServices } from '$lib/stores/registers-store'
 
export const load: PageLoad = async (event) => {
  if (event.params.id) {
    const register = await RegisterServices.getRegister(event.params.id)
    if (!register.success) {
      throw redirect(303, '/')
    }
    return {
      register
    };
  }
 
  throw error(404, 'Not found')
}