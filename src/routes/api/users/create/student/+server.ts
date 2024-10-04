/**
 * 
 * Checks the session belongs to a school teacher and creates a student assigned to a register
 * 
 * @params values: {
 *  email,
 *  firstName,
 *  lastName,
 *  schoolId,
 *  registerId
 * }
 * 
 */

import { json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getSupabase } from '@supabase/auth-helpers-sveltekit'

import { createClient } from '@supabase/supabase-js'

const supabaseClient = createClient(
 'https://zlsljdoxquofxqljooal.supabase.co',
 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpsc2xqZG94cXVvZnhxbGpvb2FsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY2MDU3NjAyMiwiZXhwIjoxOTc2MTUyMDIyfQ._OeQknJSHW-qLlc_AqPen_ZEMfU1-zv3sfwY4CzYmIw'
)
 
export const POST: RequestHandler = async (event) => {

  let message

  const { session } = await getSupabase(event)
  if (!session) {
    throw redirect(303, '/');
  }
  const {data: schoolTeacher, error: schoolTeacherError} = await supabaseClient.rpc('is_school_teacher', { user_id: session.user.id })
  const {data: academyUser, error: academyUserError} = await supabaseClient.rpc('is_academy', { user_id: session.user.id })
  if (schoolTeacher || academyUser) {

    const { values } = await event.request.json()
    const userData = { first_name: values.firstName, last_name: values.lastName, access_level: 'student', school_id: values.schoolId, register_id: values.registerId }
    const { data: user, error: studentError } = await supabaseClient.auth.admin.inviteUserByEmail(
      values.email, { data: userData }
    )
    if (user) {
      return json({ status: 200, success: true, data: { message: { status: 'success', text: "User added." }, user: user } })        
    }
    if (schoolTeacherError) message = { status: 'error', text: schoolTeacherError.message }
    if (academyUserError) message = { status: 'error', text: academyUserError.message }
    if (studentError) message = { status: 'error', text: studentError.message }

  } else {
    message = { status: 'error', text: "You do not have the right permissions for this." }
  }
  return json({ status: 403, error: true, data: { message: message } })

}