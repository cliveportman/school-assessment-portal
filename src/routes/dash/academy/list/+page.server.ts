import type { PageServerLoad } from './$types'
import { getServerSession } from '@supabase/auth-helpers-sveltekit'
import { invalid, redirect } from '@sveltejs/kit';
import { AuthApiError, createClient } from '@supabase/supabase-js'
import { env } from '$env/dynamic/private'

const supabaseClient = createClient(env.PRIVATE_SUPABASE_URL, env.PRIVATE_SUPABASE_ROLE_KEY)

export const load: PageServerLoad = async (event) => {
  const session =  await getServerSession(event)
  
  if (session) {

    // const { data, error } = await supabaseClient.rpc('is_academy', { user_id: session.user.id })
    // if (!data) { // will return false if the user is not admin
    //   throw redirect(303, '/');
    // }
    // console.log(data)

    // if (error) {
    //   if (error instanceof AuthApiError && error.status === 400) {
    //     return invalid(400, {
    //       error: 'Invalid credentials.',
    //       values: {}
    //     });
    //   }
    //   return invalid(500, {
    //     error: 'Server error. Try again later.',
    //     values: {}
    //   });
    // }

    // const response = await supabaseClient.from('students').select()
    // console.log(response)

    //const insert = await supabaseClient.rpc('create_evidence', { student_id: "8381a48d-149f-4422-9ac2-cc953aa43a77", school_id: 16, course: null, lesson_number: 4, status: 0, student_dish_images:[], student_evaluation: null, student_timeplan: null, teacher_score: 7, teacher_evaluation:null, teacher_locked: false, teacher_absent: false })

    const json = [
     
     ]
    json.forEach(async (row) => {
      const { data, error } = await supabaseClient
        .rpc('create_evidence', { student_id: row.student_id, school_id: row.school_id, course: null, lesson_number: row.lesson_number, status: 0, student_dish_images: row.student_dish_images, student_evaluation: row.student_evaluation, student_timeplan: null, teacher_score: row.teacher_score, teacher_feedback: row.teacher_feedback, teacher_absent: false })
        
      
    });
    return { session, count: json.length }




  //   let { data, error } = await supabaseClient
  //   .rpc('create_evidence', { student_id: "8381a48d-149f-4422-9ac2-cc953aa43a77", school_id: 16, course: null, lesson_number: 4, status: 0, student_dish_images:[], student_evaluation: null, student_timeplan: null, teacher_score: 7, teacher_feedback: null, teacher_absent: false })
  
  // if (error) console.error(error)
  // else console.log(data)
  //   return {
  //     session,
  //     data,
  //     error
  //   };



  }

  return {
    session
  };
};