<script lang="ts">

  import type { PageData } from './$types'
  export let data: PageData

  import { currentUser, currentRegister, students } from '$lib/stores/writables'
  import { RegisterServices as Registers } from '$lib/stores/registers-store'
  import { CourseServices as Courses } from '$lib/stores/courses-store'
  import Back from '$lib/components/svgs/Back.svelte'

  import { onMount } from 'svelte'

  import { goto } from '$app/navigation'
  if ($currentUser.role == 'student') goto('/dash/student')

  let lessons = []
  let ready = false

  onMount( async () => {
  
    // Get the students
    if ($currentRegister.student_ids?.length) {
      const response = await fetch('/api/users/get/students', { method : 'POST', body : JSON.stringify( { values: { student_ids: $currentRegister.student_ids } } )})
      const { data } = await response.json()
      $students = data
    } else {
      $students = []
    }
    
    // data.sort((a, b) => parseFloat(a.lesson_number) - parseFloat(b.lesson_number));
    // $currentUser.data.evidence = data
    // ready = true

    //await Registers.getStudents($currentRegister.id)
    //lessons = await Courses.getLessons($currentRegister.course, $currentUser.role)
    
    //Registers.prepStudentEvidenceAllStudents(lessons.length)
    // Registers.prepStudentMenusAllStudents()
    // Registers.prepStudentGroupTaskAllStudents()
    // Registers.prepStudentTestsAllStudents()
    ready = true
  })
  
  import Header  from '../overview/components/Header.svelte'
  import { tabs, courses }  from '../functions'
  let currentTab = tabs[0].slug
  import EvidenceTab from './components/EvidenceTab.svelte'

</script>

<svelte:head>
	<title>Lesson evidence</title>
</svelte:head>

{#if ready}
<div class="px-6 mx-auto max-w-7xl">

  {#if $currentUser.role == 'school_teacher'}<a href="/dash/school" class="flex justify-start items-center mb-4 text-white"><Back /> <span class="pl-2">Return to dashboard</span></a>{/if}
  
  <div class="rounded-md p-4 bg-white">
    
    <Header title="{$currentRegister.title}" course="{courses[$currentRegister.course]}" registerId="{$currentRegister.id}" activeTab="1" />
    <EvidenceTab bind:tab="{currentTab}" />

</div>
</div>
{/if}

