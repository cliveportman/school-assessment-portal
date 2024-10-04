export const CourseServices = {
  
  getCategories: async (course, parentCategoryId = null, availableToStudents = false) => {

    const courseCategoryId = course == 'L3CERT' ? 3 : (course == 'L2CERT' ? 4 : 2)
    let params

    let query, vars = null
    if (parentCategoryId) {
      if (availableToStudents) params = `level: 2, descendantOf: ${parentCategoryId}, relatedToCategories: {id: ${courseCategoryId}}, availableToStudents: ${availableToStudents}`
      else params = `level: 2, descendantOf: ${parentCategoryId}, relatedToCategories: {id: ${courseCategoryId}}`
      query = `query MyQuery {
        categories(${params}) {
          id
          title
          slug
        }
      }`
      
    }
    else {
      if (availableToStudents) params = `level: 1, relatedToCategories: {id: ${courseCategoryId}}, availableToStudents: ${availableToStudents}`
      else params = `level: 1, relatedToCategories: {id: ${courseCategoryId}}`
      query = `query MyQuery {
        categories(${params}) {
          id
          title
          slug
          children {
            id
          }
        }
      }`
    }
    return await makeQuery(query, vars)

  },

  getResources: async (course, categoryId, availableToStudents = false) => {

    const courseCategoryId = course == 'L3CERT' ? 3 : (course == 'L2CERT' ? 4 : 2), vars = null
    let params
    if (availableToStudents) params = `section: "resources", relatedToCategories: [{id: ${courseCategoryId}},{id: ${categoryId}}], availableToStudents: ${availableToStudents}`
    else params = `section: "resources", relatedToCategories: [{id: ${courseCategoryId}},{id: ${categoryId}}]`
    
    const query = `query MyQuery {
      entries(${params}, orderBy: "title") {
        title
        ... on resources_default_Entry {
          id
          file {
            url
          }
          availableToStudents
        }
      }
    }`
    return await makeQuery(query, vars)

  },



  getLessons: async (slug: string, showEvidenceLessonsOnly: boolean = false) => {

    slug = slug.toLowerCase()
    let evidence = ''
    if (showEvidenceLessonsOnly) {
      evidence = `, evidence: true`
    }
    const vars = {}
    const query = `query MyQuery {
      entries(section: "lessons", relatedToCategories: {slug:"` + slug + `"}` + evidence + `) {
        ... on lessons_default_Entry {
          id
          title
          file {
            url
          }
          fileStudent {
            url
          }
          category {
            id
            slug
            title
          }
        }
      }
    }`
    const response = await makeQuery(query, vars)
    const lessonEntries = response.data.data.entries
    const organisedLessons = [
      { title: "Weeks 1 to 10", slug: "wks1to10", lessons: lessonEntries.filter( entry => { return entry.category[0].id == '2231' } ) },
      { title: "Weeks 11 to 20", slug: "wks11to20", lessons: lessonEntries.filter( entry => { return entry.category[0].id == '2232' } ) },
      { title: "Weeks 21 to 30", slug: "wks21to30", lessons: lessonEntries.filter( entry => { return entry.category[0].id == '2233' } ) },
      { title: "Weeks 31 to 40", slug: "wks31to40", lessons: lessonEntries.filter( entry => { return entry.category[0].id == '2234' } ) },
      { title: "Weeks 41 to 50", slug: "wks41to50", lessons: lessonEntries.filter( entry => { return entry.category[0].id == '2235' } ) },
      { title: "Weeks 51 to 60", slug: "wks51to60", lessons: lessonEntries.filter( entry => { return entry.category[0].id == '2236' } ) },
    ]
    
    return organisedLessons
  }

}


const makeQuery = async (query, vars = {}) => {
  
  const url = 'https://lessons1.academy.leiths.theportman.dev/api'
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, vars })
  }

  const response = await fetch(url, options)  
  if (response.ok) {
    return {
      success: true,
      data: await response.json()
    }
  } else {
    return {
      error: true,
      message: `Could not load ${url}`
    }
  }
}