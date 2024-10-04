<script lang="ts">

  import { onMount } from 'svelte'
  
  import { currentUser, currentCourse } from '$lib/stores/writables'
  import { CourseServices as Courses } from '$lib/stores/courses-store'
  import { Logging } from '$lib/stores/log-store'
  export let course
  let activeLesson: null | string, ready = false
  const lessons: {}[] = []
  const emptyModalParams = { visible: false, lessonIndex: null, lessonTitle: null, lessonNumber: null, existingEvidenceId: null }
  let modalParams: { visible: boolean, lessonIndex: number | null, lessonTitle: string | null, lessonNumber: number | null, existingEvidenceId: string | null } = emptyModalParams

  import EvidenceModal from '$lib/components/modals/EvidenceModalForStudents.svelte'
  import Button from '$lib/components/forms/Button.svelte'

  const evidenceButtonStyle = (index) => {
    const lessonNumber = index + 1
    const evidence = $currentUser.data.evidence.find( ev => ev.lesson_number == lessonNumber)
    if (evidence) {
      if (evidence.teacher_absent) return 'b-white text-white bg-red-600'
      else if (evidence.teacher_locked) return 'b-white text-white bg-green-500'
      else if (evidence.teacher_feedback && evidence.teacher_score && evidence.student_dish_images.length && evidence.student_evaluation && ($currentCourse != 'L3CERT' || evidence.student_timeplan)) return 'text-white bg-orange-500'
      else if (evidence.student_evaluation && evidence.student_dish_images.length && evidence.student_timeplan) return 'text-white bg-yellow-500'
      else return 'text-white bg-blue-500'
    }
    else return 'text-white bg-blue-500'
  }

  const showModal = (index: number) => {
    modalParams = emptyModalParams
    modalParams.visible = true
    modalParams.lessonIndex = index
    modalParams.lessonTitle = lessons[index].title
    modalParams.lessonNumber = index + 1
    const evidenceIndex = $currentUser.data.evidence.findIndex( ev => ev.lesson_number == index + 1)
    modalParams.existingEvidenceId = evidenceIndex > -1 ? $currentUser.data.evidence[evidenceIndex].id : null
    Logging.postLog('student', 'dashboard', 'pressed Evidence button for lesson ' + (index +1), $currentUser.uuid)
  }
  
  onMount( async () => {

    // Get the lessons. They're grouped in wks1-10, wks11-20, etc. so we have to ungroup them first.
    const groupedLessons = await Courses.getLessons(course, true)    
    groupedLessons.forEach(group => { lessons.push(...group.lessons) })
    
    // Get the student's evidence from the evidence table.
    const response = await fetch('/api/evidence/get', { method : 'POST', body : JSON.stringify( { values: { student_id: $currentUser.uuid } } )})
    const { data } = await response.json()
    data.sort((a, b) => parseFloat(a.lesson_number) - parseFloat(b.lesson_number));
    $currentUser.data.evidence = data
    ready = true

  })

</script>

{#if lessons.length && ready && $currentUser.data.evidence}
<div class="rounded-md p-4 bg-white drop-shadow-md mb-6">

  <h2 class="text-base font-medium text-black text-xl">Lesson evidence</h2>

  <div class="flow-root mt-6">
    <div class="mb-2 flex justify-start items-center text-black text-xs"><div class="flex items-center justify-center mr-2 text-left w-6 h-6 shadow-sm text-center bg-blue-500 font-medium text-white">1</div> <span>Incomplete / not started yet</span></div>
    <div class="mb-2 flex justify-start items-center text-black text-xs"><div class="flex items-center justify-center mr-2 text-left w-6 h-6 shadow-sm text-center text-white bg-yellow-500">1</div> <span>Completed by student</span></div>
    <div class="mb-2 flex justify-start items-center black text-xs"><div class="flex items-center justify-center mr-2 text-left w-6 h-6 shadow-sm text-center text-white bg-orange-500">1</div> <span>Completed by teacher, waiting for student response</span></div>
    <div class="mb-2 flex justify-start items-center black text-xs"><div class="flex items-center justify-center mr-2 text-left w-6 h-6 shadow-sm text-center text-white bg-green-500">1</div> <span>Complete (locked)</span></div>
    <div class="mb-2 flex justify-start items-center black text-xs"><div class="flex items-center justify-center mr-2 text-left w-6 h-6 shadow-sm text-center text-white bg-red-600 font-medium">1</div> <span>Absent</span></div>
  </div>
  
  <div class="mt-6">
    <h3 class=" mb-2 text-base font-medium text-black text-md col-span-5 sm:col-span-10 ">Select a lesson to continue:</h3>
    <div class="grid grid-cols-10">    
    {#each lessons as lesson, index}
      <Button 
        on:press="{ () => { showModal(index) } }" 
        tailwind="w-1/10 h-8 xl:h-12 block text-sm xl:text-lg text-left items-center border  shadow-sm text-center font-medium  {$currentUser.data.evidence ? evidenceButtonStyle(index) : ''} shadow hover:bg-blue-700 hover:text-white focus:bg-blue-700 focus:text-white" text="{index + 1}" 
      />
    {/each}
  </div>
  </div>

</div>
{/if}
{#if modalParams.visible}
  <EvidenceModal bind:params="{modalParams}" lessons="{lessons}" />
{/if}