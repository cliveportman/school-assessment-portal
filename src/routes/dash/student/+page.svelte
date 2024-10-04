<script lang="ts">
  
  import { currentUser, currentCourse } from '$lib/stores/writables'
  import { RegisterServices as Registers } from '$lib/stores/registers-store'
  import { CourseServices as Courses } from '$lib/stores/courses-store'
  
  import { goto } from '$app/navigation'
  if ($currentUser.role == 'student') {}
  else if ($currentUser.role == 'school_teacher') goto('/dash/school')
  else if ($currentUser.role == 'visiting_teacher') goto('/dash/visiting')
  else if ($currentUser.role == 'academy') goto('/dash/academy')
  else if ($currentUser.role == 'admin') goto('/dash/academy')

  import { onMount } from 'svelte'

  let ready = false
  let lessons

  

  onMount( async () => {
    // Get the register associated with the student so we can identify the course
    const registerResponse = await Registers.getRegisterByStudent()
    if (registerResponse) $currentCourse = registerResponse.course
    // Get the lessons on the course
    lessons = await Courses.getLessons($currentCourse, true)
    // Update the student's data in the store
    await Registers.getStudentData(lessons.length)
    ready = true
    
    // const responseC = await fetch('/api/evidence/create',
    //   {
    //     method : 'POST',
    //     body : JSON.stringify(
    //       { values: {} }
    //     )
    //   }
    // )
    // const resultC = await responseC.json()
    // console.log('result', resultC)
    
    // const responseG = await fetch('/api/evidence/get',
    //   {
    //     method : 'POST',
    //     body : JSON.stringify(
    //       { values: {} }
    //     )
    //   }
    // )
    // const resultG = await responseG.json()
    // console.log('result', resultG)


  })
  
  import StudentEvidence from './components/StudentEvidence.svelte'
  import StudentGroupTask from './components/StudentGroupTask.svelte'
  import StudentMenus from './components/StudentMenus.svelte'
  import LessonPlans from '$lib/components/resources/LessonPlans.svelte'
  import CourseResources from '$lib/components/resources/CourseResources.svelte'


</script>




<svelte:head>
	<title>Dashboard</title>
</svelte:head>

{#if ready}
<div class="px-4 lg:px-8 max-w-7xl mx-auto"> 
  <div class="md:grid md:grid-cols-5 gap-6 mb-6">

    <div class="md:col-span-2">
      <h2 class="text-base font-medium text-white text-2xl mb-4">Your evidence</h2>
      <StudentEvidence lessons="{lessons}" course="{$currentCourse}" />
      <!-- <StudentGroupTask course="{$currentCourse}" />
      <StudentMenus course="{$currentCourse}" />       -->
    </div>

    <div class="md:col-span-3">
      <h2 class="text-base font-medium text-white text-2xl mb-4">Student notes and course resources</h2>
      <LessonPlans course="{$currentCourse}" />
      <CourseResources course="{$currentCourse}" />
    </div>

  </div>
</div>
{/if}