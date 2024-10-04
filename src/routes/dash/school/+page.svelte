<script lang="ts">

  import { currentUser, registers, courses, currentCourse } from '$lib/stores/writables'
  import { DashboardServices } from '$lib/stores/dashboard-store'
  import { RegisterServices as Registers } from '$lib/stores/registers-store'
  import { onMount } from 'svelte'
  
  import { goto } from '$app/navigation'
  if ($currentUser.role == 'school_teacher') {}
  else if ($currentUser.role == 'student') goto('/dash/student')
  else if ($currentUser.role == 'visiting_teacher') goto('/dash/visiting')
  else if ($currentUser.role == 'academy') goto('/dash/academy')
  else if ($currentUser.role == 'admin') goto('/dash/academy')

  let ready = false
  let lessons
  let courseTitles = { L3CERT: 'Level 3 Certificate', L2CERT: 'Level 2 Certificate', ICC3: 'ICC (3-term)', ICC4: 'ICC (4-term)', ICC5: 'ICC (5-term)'}

  onMount( async () => {

    DashboardServices.getRegisters()  
    ready = true
  })

  $: ($courses?.length) ? $currentCourse = $courses[0] : null
  
  import LessonPlans from '$lib/components/resources/LessonPlans.svelte'
  import CourseResources from '$lib/components/resources/CourseResources.svelte'
  
  import Button from '$lib/components/forms/Button.svelte'


</script>

<svelte:head>
	<title>Dashboard</title>
</svelte:head>

{#if $courses && $registers}
  <div class="md:px-6 lg:px-8">    

    <div class="grid grid-cols-3 gap-6 mb-6">

      <div class="col-span-1">

        <div class="rounded-md p-4 bg-white drop-shadow-md mb-6">
          <h2 class="text-base font-medium text-grey-900 text-xl">Your courses</h2>
          <div class="flow-root mt-6">
            {#each $courses as course}
              <Button on:press="{ () => { $currentCourse = course } }" tailwind="block text-left w-full items-center mt-2 px-6 py-3 shadow-sm text-base font-medium rounded-md text-white bg-blue-600 {course == $currentCourse ? 'text-white bg-blue-900' : ''}" text="{courseTitles[course]}" />
            {/each}
          </div>
        </div>

        <div class="rounded-md p-4 bg-white drop-shadow-md mb-6">
          <h2 class="text-base font-medium text-grey-900 text-xl">Your classes</h2>
          <div class="flow-root mt-2">
            <ul role="list" class="mt-2 border-grey-200 divide-y divide-grey-200">
              {#each $registers as register}
              <li class="py-3 flex justify-between items-center">
                <div class="flex items-center">
                  <p class="text-sm font-medium text-grey-900">{register.title}</p>
                </div>
                <a href="/dash/register/{register.id}" class="ml-6 block bg-white rounded-md underline text-sm font-medium text-grey-900">View/update</a>
              </li>
            {/each}
          </div>
        </div>

      </div>

      <div class="col-span-2">       
        <LessonPlans />
        <CourseResources />
      </div>

    </div>
  </div>

{/if}