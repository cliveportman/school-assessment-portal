import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types'

import { RegisterServices } from '$lib/stores/registers-store'
 
export const load: PageLoad = async ({ params }) => {
  if (params.id) {
    await RegisterServices.getRegister(params.id)
    return {
      id: params.id,
    };
  }
 
  throw error(404, 'Not found')
}