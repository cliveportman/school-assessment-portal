import { supabaseClient as supabase } from '$lib/db'
import { get } from 'svelte/store'
import { currentRegister, students, courses, currentUser, toasts } from './writables'
import { ToastServices } from '../stores/toasts-store'
import { Logging } from '$lib/stores/log-store'

export const RegisterServices = {

  getRegister: async (id) => {

    currentRegister.subscribe

    try {
      const {data, error} = await supabase.rpc('get_register', { register_id: id})
      if (data) {
        if (data.length) {
          currentRegister.update(register => data[0])
         return { success: true }
        } else {
          return { success: false, message: "Unable to load register." }
        }
      }
      if (error) throw error
    } catch (error) {
      console.log(error)
    }

  },

  getStudents: async (registerId) => {

    students.subscribe
    try {
      const {data, error} = await supabase.rpc('get_students_from_register', { register_id: registerId})
      if (data) {
        students.update(currentStudents => data)
        return { success: true, message: 'Students loaded' }
      }
      if (error) throw error
    } catch (error) {
      console.log(error)
    }

  },

  getRegisterByStudent: async () => {

    courses.subscribe
    try {
      const {data, error} = await supabase.rpc('get_register_by_student')
      if (data) {
        // We just return the name of the course here. That's all we need.
        courses.update(currentCourses => [data[0].course])
        return { success: true, course: data[0].course }
      }
      if (error) throw error
    } catch (error) {
      console.log(error)
    }

  },

  getStudentData: async (numberOfLessons) => {

    currentUser.subscribe
    try {
      const {data, error} = await supabase.rpc('get_student_data')
      if (data) {
        let student = data
        //if (!student.evidence) student.evidence = RegisterServices.prepStudentEvidenceSingleStudent(numberOfLessons)
        if (!student.group_task) student.group_task = RegisterServices.prepStudentGroupTaskSingleStudent()
        if (!student.menus) student.menus = RegisterServices.prepStudentMenusSingleStudent()
        if (!student.tests) student.tests = RegisterServices.prepStudentTestsSingleStudent()
        currentUser.update(current => {
          return {
            uuid: current.uuid,
            role: current.role,
            data: data
          }
        })
        return { success: true, message: 'Data fetched' }
      }
      if (error) throw error
    } catch (error) {
      console.log(error)
    }

  },

  /**
   * 
   * Fetches a single student's data and updates only that student in the list of students in the $students store.
   * Call it whenever you want up-to-date data, e.g opening a modal.
   * 
   */
  refreshSingleStudentsData: async (studentId) => {

    students.subscribe

    // Create a version of the store for working with and get the student
    let workingVersionOfStore = get(students)
    const index = workingVersionOfStore.findIndex(student => student.id == studentId)
    if (index === -1) {
      Logging.postLog('', 'evidence', 'tried to refresh a student but no student with that id in store', studentId)
      return { error: true, message: 'Could not find student' }
    }
    const refreshedStudent = workingVersionOfStore[index]

    // Fetch the student's data
    try {
      const {data, error} = await supabase.rpc('get_student_data', { user_id: studentId})
      if (data) {
        const student = data[0]
        // Update the values with those from the backend. If they#re empty, leave them because we'll have
        // prepped empty objects for these already and we don't want to replace them with nothing.
        if (student.cth) refreshedStudent.cth = student.cth
        if (student.evidence) refreshedStudent.evidence = student.evidence
        if (student.group_task) refreshedStudent.group_task = student.group_task
        if (student.hygiene) refreshedStudent.hygiene = student.hygiene
        if (student.menus) refreshedStudent.menus = student.menus
        if (student.tests) refreshedStudent.tests = student.tests
        workingVersionOfStore[index] = refreshedStudent
        students.update(current => {
          return workingVersionOfStore
        })
        Logging.postLog('', 'evidence', 'successfully refreshed a students data', studentId)
        return { success: true, message: 'Student data has been refreshed' }
      }
    } catch (error) {
      Logging.postLog('', 'evidence', 'error refreshing student: ' + error.message, studentId)
      return { error: true, message: 'We could not load the up-to-date data for this student' }
    }

  },

  prepStudentEvidenceAllStudents: (numberOfLessons) => {
    students.subscribe
    let duplicates = get(students)
    let updatedStudents = []
    duplicates.forEach(student => {
      if (!student.evidence) {
        student.evidence = RegisterServices.prepStudentEvidenceSingleStudent(numberOfLessons)
      }
      updatedStudents.push(student)
    })
    students.update(current => {
      return updatedStudents
    })
  },

  prepStudentEvidenceSingleStudent: (numberOfLessons = 0) => {
    const newEvidenceData = []
    for (let i = 0; i < numberOfLessons; i++) {
      newEvidenceData.push({ 
        id: null, 
        evaluation: null, 
        dish: [], // Multiple images/PDFs
        timeplan: [], // Multiple images/PDFs
        feedback: null, 
        score: null,
        locked: false
      })
    }
    return newEvidenceData
  },

  prepStudentMenusAllStudents: () => {
    students.subscribe
    let duplicates = get(students)
    let updatedStudents = []
    duplicates.forEach(student => {
      if (!student.menus) {
        student.menus = RegisterServices.prepStudentMenusSingleStudent()
      }
      updatedStudents.push(student)
    })
    students.update(current => {
      return updatedStudents
    })
  },

  prepStudentMenusSingleStudent: () => {    
    const emptyMenu = {
      scene: null,
      factors: null,
      design: null,
      costingQuality: [],
      menu: [], // Holds multiple images or PDFs of the menu.
      score: null
    }
    return [emptyMenu, emptyMenu]
  },

  prepStudentGroupTaskAllStudents: () => {
    students.subscribe
    let duplicates = get(students)
    let updatedStudents = []
    duplicates.forEach(student => {
      if (!student.group_task) {
        student.group_task = RegisterServices.prepStudentGroupTaskSingleStudent()
      }
      updatedStudents.push(student)
    })
    students.update(current => {
      return updatedStudents
    })
  },

  prepStudentGroupTaskSingleStudent: () => {    
    const emptyGroupTask = { 
      individual1: null, 
      individual2: null, 
      group1: null, 
      group2: null
    }
    return emptyGroupTask
  },

  prepStudentTestsAllStudents: () => {
    students.subscribe
    let duplicates = get(students)
    let updatedStudents = []
    duplicates.forEach(student => {
      if (!student.tests) {
        student.tests = RegisterServices.prepStudentTestsSingleStudent()
      }
      updatedStudents.push(student)
    })
    students.update(current => {
      return updatedStudents
    })
  },

  prepStudentTestsSingleStudent: () => {    
    const newTestsData = [0, 0, 0, 0, 0]
    return newTestsData
  },

  saveEvidence: async (userId, evidenceData) => {

    toasts.subscribe
    currentUser.subscribe

    try {
      const {data, error} = await supabase.rpc('save_evidence', { evidence_data: evidenceData, user_id: userId })
      if (data) {
        Logging.postLog('', 'evidence', 'successful evidence save for ' + data.email, get(currentUser).uuid)
        //console.log(get(currentUser).uuid)
        ToastServices.addToast('success', null, 'Evidence saved')
        return { success: true}
      }
      if (error) throw error
    } catch (error) {
      Logging.postLog('', 'evidence', 'failed evidence save', get(currentUser).uuid)
      ToastServices.addToast('error', 'There was a problem', error.message)
    }
  },

  saveGroup: async (userId, groupData) => {
    try {
      const {data, error} = await supabase.rpc('save_group_task', { group_data: groupData, user_id: userId })
      if (data) {
        return { success: true}
      }
      if (error) throw error
    } catch (error) {
      ToastServices.addToast('error', 'Error downloading image', error.message)
      console.log(error)
    }
  },

  saveMenus: async (userId, menusData) => {
    console.log(menusData)
    try {
      const {data, error} = await supabase.rpc('save_menus', { menus_data: menusData, user_id: userId })
      if (data) {
        return { success: true}
      }
      if (error) throw error
    } catch (error) {
      console.log(error)
    }
  },

  saveTests: async (students) => {

    console.log(students)

    const array = []
    students.forEach(student => {
      array.push({
        id: student.id,
        tests: student.tests
      })
    })

    console.log(array)

    try {
      const { data, error } = await supabase.from('students').upsert(array)
      if (data) {
        console.log(data)
        return { success: true}
      }
      if (error) throw error
    } catch (error) {
      console.log(error)
    }
  },



  saveMenuPlan: async (userId, menusData, menus) => {
    console.log('menusData', menusData)
    console.log('menus', menus)
    return { success: true}
    // try {
    //   const {data, error} = await supabase.rpc('save_menus', { menus_data: menusData, user_id: userId })
    //   if (data) {
    //     return { success: true}
    //   }
    //   if (error) throw error
    // } catch (error) {
    //   console.log(error)
    // }
  }

}

const queryL3CERT = `query MyQuery {
  l3certEntries {
    ... on l3cert_default_Entry {
      id
      lessonPlan
      title
    }
  }
}`

const queryL2CERT = `query MyQuery {
  l2certEntries {
    ... on l2cert_default_Entry {
      id
      lessonPlan
      title
    }
  }
}
`

const queryICC = `query MyQuery {
  lessons: iccEntries {
    ... on icc_default_Entry {
      id
      lessonPlan
      subCourse
      title
    }
  }
}`