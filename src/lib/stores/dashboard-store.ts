import { supabaseClient as supabase } from '$lib/db'
import { currentUser, users, schools, registers, courses } from './writables'
import { get } from 'svelte/store'

export const DashboardServices = {

  getAcademyUsers: async () => {
    users.subscribe
    try {
      const {data, error} = await supabase.rpc('fetch_academy_users')
      if (data) {
        users.update(currentUsers => {
          let updatedUsers = { ...users }
          updatedUsers.academy = data
          return updatedUsers
        })
        return data
      }
      if (error) throw error
    } catch (error) {
      console.log(error)
    }
  },

  createAcademyUser: async (values) => {
    
    currentUser.subscribe
    
    let response = await fetch('/api/users/create/academy',
      {
        method : 'POST',
        body : JSON.stringify(
          { values: values }
        )
      }
    )
    let result = await response.json()
    if (result.success) {
      await DashboardServices.getAcademyUsers()
      return { success: true, message: result.data.message }
    } else {
      return { error: true, message: result.data.message }
    }
    
  },

  createSchoolTeacherUser: async (values) => {
    
    currentUser.subscribe
    
    let response = await fetch('/api/users/create/school-teacher',
      {
        method : 'POST',
        body : JSON.stringify(
          { values: values }
        )
      }
    )
    let result = await response.json()
    if (result.success) {
      await DashboardServices.getSchools()
      return { success: true, message: result.data.message }
    } else {
      return { error: true, message: result.data.message }
    }
  },

  getSchools: async () => {
    schools.subscribe
    try {
      const {data, error} = await supabase.rpc('fetch_school_list_for_academy_users')
      if (data) {
        //console.log(data)
        // Data includes a single row for schools with no register
        // and mutliple rows for schools with multiple rgisters,
        // so we sort into an array of schools, each containing an array of registers
        sortSchools(data)
      }
      if (error) throw error
    } catch (error) {
      console.log(error)
    }
  },

  createSchool: async (values) => {
    try {
      const {data, error} = await supabase.rpc('create_school', { title: values.title })
      if (data) {
        DashboardServices.getSchools()
        return { success: true, message: 'School created' }
      }
      if (error) throw error
    } catch (error) {
      console.log(error)
    }
  },

  createRegister: async (values) => {
    const registerData = { title: values.title, course: values.course, school_id: values.schoolId }
    try {
      const {data, error} = await supabase.rpc('create_register', registerData)
      if (data) {
        DashboardServices.getSchools()
        return { success: true, message: 'Register created' }
      }
      if (error) throw error
    } catch (error) {
      console.log(error)
    }
  },

  getRegisters: async () => {

    registers.subscribe
    currentUser.subscribe
    
    try {
      const {data, error} = await supabase.rpc('get_registers_for_school_teachers', { user_id: get(currentUser).uuid,})
      if (data) {
        sortCourses(data) 
        registers.update(currentRegisters => data)
        return { success: true, message: 'Register created' }
      }
      if (error) throw error
    } catch (error) {
      console.log(error)
    }

  },

  createStudentUser: async (values) => {
    
    currentUser.subscribe
    
    let response = await fetch('/api/users/create/student',
      {
        method : 'POST',
        body : JSON.stringify(
          { values: values }
        )
      }
    )
    let result = await response.json()
    if (result.success) {
      return { success: true, data: result.data.user.user.id }
    } else {
      return { error: true, message: result.data.message }
    }
  },

}


// Used for sorting schools information from the database
const sortSchools = async (data) => {
  const sorted = []
  // Loop through the SQL rows returned  
  data.forEach(row => {
    // Does the school in this row already exist in the sorted schools array?
    const index = sorted.findIndex(school => school.id == row.school_id)
    if (index == -1) {
      // No, so add it. Along with the register if there is one.
      sorted.push({
        id: row.school_id,
        title: row.school_title,
        registers: row.register_id ? [{ id: row.register_id, title: row.register_title, course: row.register_course }] : [],
        school_teachers: []
      })
    } else {
      // Yes, so add this register to the school's registers array
      sorted[index].registers.push({ id: row.register_id, title: row.register_title, course: row.register_course })
    }    
  })
  sorted.sort((a, b) => a.title.localeCompare(b.title))

  // Having sorted the schools, we now add the school teachers  
  let teachers = await getSchoolTeacherUsers()
  teachers.forEach(teacher => {
    if (teacher.school_id) {
      // If the teacher has a school id, add them to the school
      const index = sorted.findIndex(school => school.id == teacher.school_id)
      if (index != -1) {
        sorted[index].school_teachers.push(teacher)
      }
    }
  })
  schools.subscribe
  schools.update(currentData => sorted )
}

const getSchoolTeacherUsers = async () => {
  users.subscribe
  try {
    const {data, error} = await supabase.rpc('fetch_school_teacher_users')
    if (data) {
      users.update(currentUsers => {
        let updatedUsers = { ...users }
        updatedUsers.schoolTeachers = data
        return updatedUsers
      })
      return data
    }
    if (error) throw error
  } catch (error) {
    console.log(error)
  }
}

const sortCourses = async (registers) => {
  courses.subscribe
  let sorted = []
  registers.forEach(register => {
    const already = sorted.includes(register.course)
    if (!already) {
      sorted.push(register.course)
    }
  })
  courses.update(currentCourse => sorted)
}


