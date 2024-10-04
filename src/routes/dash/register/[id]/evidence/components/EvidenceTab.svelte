<script lang="ts">

  import { onMount } from 'svelte'

  export let tab
  let modalParams: { visible: boolean, studentIndex: string | null, studentName: string | null, lessonIndex: number | null, lessonTitle: string | null, lessonNumber: number | null, existingEvidenceId: string | null } = { visible: false, studentIndex: null, studentName: null, lessonIndex: null, lessonTitle: null, lessonNumber: null, existingEvidenceId: null }
  
  import { students, currentRegister, lessons } from '$lib/stores/writables'
  import { CourseServices as Courses } from '$lib/stores/courses-store'
  import Row from './EvidenceRow.svelte'
  
  import { Logging } from '$lib/stores/log-store'
  
  onMount( async () => {
    if (!$lessons.length) {
      const groupedLessons = await Courses.getLessons($currentRegister.course, true)    
      groupedLessons.forEach(group => { $lessons.push(...group.lessons) })
    }
  })
  const showModal = (event: CustomEvent) => {
    const studentIndex = event.detail.studentIndex
    const lessonIndex = event.detail.lessonIndex
    modalParams.visible = true
    modalParams.studentIndex = studentIndex
    modalParams.studentName = $students[studentIndex].first_name + ' ' + $students[studentIndex].last_name
    modalParams.lessonIndex = lessonIndex
    modalParams.lessonTitle = $lessons[lessonIndex].title
    modalParams.lessonNumber = lessonIndex + 1
    const evidenceIndex = $students[studentIndex].evidence.findIndex( ev => ev.lesson_number == lessonIndex + 1)
    modalParams.existingEvidenceId = evidenceIndex > -1 ? $students[studentIndex].evidence[evidenceIndex].id : null
    Logging.postLog('student', 'dashboard', 'pressed Evidence button for lesson ' + (lessonIndex +1), $students[studentIndex].id)
  }

  import EvidenceModal from '$lib/components/modals/EvidenceModalForTeachers.svelte'

</script>

{#if $currentRegister && $students}
<div class="flex flex-col">
  <div class="overflow-x-auto">

    <div class="flow-root mt-6">
      <div class="mb-2 flex justify-start items-center text-black text-xs"><div class="flex items-center justify-center mr-2 text-left w-6 h-6 shadow-sm text-center bg-blue-500 font-medium text-white">1</div> <span>Incomplete / not started yet</span></div>
      <div class="mb-2 flex justify-start items-center text-black text-xs"><div class="flex items-center justify-center mr-2 text-left w-6 h-6 shadow-sm text-center text-white bg-yellow-500">1</div> <span>Completed by student</span></div>
      <div class="mb-2 flex justify-start items-center black text-xs"><div class="flex items-center justify-center mr-2 text-left w-6 h-6 shadow-sm text-center text-white bg-orange-500">1</div> <span>Completed by teacher, waiting for student response</span></div>
      <div class="mb-2 flex justify-start items-center black text-xs"><div class="flex items-center justify-center mr-2 text-left w-6 h-6 shadow-sm text-center text-white bg-green-500">1</div> <span>Complete (locked)</span></div>
      <div class="mb-2 flex justify-start items-center black text-xs"><div class="flex items-center justify-center mr-2 text-left w-6 h-6 shadow-sm text-center text-white bg-red-600 font-medium">1</div> <span>Absent</span></div>
    </div>

    <div class="inline-block min-w-full align-top">
      <div class="overflow-hidden shadow ring-opacity-5 rounded rounded-t-none">

        {#if $students.length}
        <table class="min-w-full">
          <thead class="bg-white border-b-2 border-b-grey-300">
            <tr>
              <th scope="col" class="py-4 pr-6 text-left text-sm font-semibold text-grey-900">Student</th>
              <th scope="col" class="text-left text-sm font-semibold text-grey-900">Lessons completed</th>
              <th scope="col" class="text-left text-sm font-semibold text-grey-900">Refresh</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-grey-300 bg-white">
            {#each $students as student, index}
              <Row {index} on:evidenceClick="{showModal}"/>
            {/each}
          </tbody>
          
        </table>
        {:else}
          <p class="py-3.5 text-left text-sm font-semibold text-red-600">No students have been added to this register.<br>Return to the Overview (button above) to rectify this.</p>
        {/if}
      </div>
    </div>
  </div>
</div>
{/if}

{#if modalParams.visible}
  <EvidenceModal bind:params="{modalParams}" lessons="{$lessons}" />
{/if}