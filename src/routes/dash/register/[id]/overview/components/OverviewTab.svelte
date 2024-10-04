<script>

  import { onMount } from 'svelte'  
  import { currentUser, currentRegister, students, lessons } from '$lib/stores/writables'
  import { CourseServices as Courses } from '$lib/stores/courses-store'
  import Row from './OverviewRow.svelte'
  export let tab
  
  onMount( async () => {
    // Get the lessons. They're grouped in wks1-10, wks11-20, etc. so we have to ungroup them first.
    if (!$lessons.length) {
      const groupedLessons = await Courses.getLessons($currentRegister.course, true)    
      groupedLessons.forEach(group => { $lessons.push(...group.lessons) })
    }
  })

  const menusCompleted = (student) => {
    if (student.menus) {
      let scored = 0
      student.menus.forEach(menu => {
        if (menu.score) scored++
      })
      return scored + '/2'
    } else {
      console.log('Menus are empty')
      return '0/2'
    }
  }

  const groupTaskCompleted = (student) => {
    if (
      (student.group_task?.group1 || student.group_task?.group2)
      && (student.group_task?.individual2 || student.group_task?.individual2)
     ) {
      return 'Complete'
    } else {
      return 'Incomplete'
    }
  }
  

</script>

{#if $currentRegister && $students}
<div class="flex flex-col mt-4">
  <div class="overflow-x-auto">
    <div class="inline-block min-w-full align-top">
      <div class="overflow-hidden shadow ring-1 ring-grey ring-opacity-5 rounded rounded-t-none">

        {#if $students.length}
        <table class="min-w-full">
          <thead class="bg-white border-b-2 border-b-grey-300">
            <tr>
              <th scope="col" class="py-4 pr-3 text-left text-sm font-semibold text-grey-900">Student name</th>
              <th scope="col" class="py-3.5 text-left text-sm font-semibold text-grey-900">Lessons completed</th>
              <th scope="col" class="py-3.5 text-left text-sm font-semibold text-grey-900">Absent</th>
              <!-- {#if $currentRegister.course == 'L3CERT'}
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-grey-900">Menu plans completed</th>
              {/if}
              {#if $currentRegister.course == 'L3CERT' || $currentRegister.course == 'L2CERT'}
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-grey-900">Theory test score</th>
              {/if}
              {#if $currentRegister.course == 'L3CERT'}
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-grey-900">Group task completed</th>
              {/if}
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-grey-900">Food Hygiene score</th>
              {#if $currentUser.role == 'academy'}
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-grey-900">CTH</th>
              {/if} -->
            </tr>
          </thead>
          
          <tbody class="divide-y divide-grey-300 bg-white">
            {#each $students as student, index}
              <Row {index} />
            {/each}
          </tbody>
          
        </table>
        {:else}
          <p class="py-3.5 text-left text-sm font-semibold text-red-600">No students have been added to this register.</p>
        {/if}
      </div>
    </div>
  </div>
</div>
{/if}