<script lang="ts">

  import { onMount } from 'svelte'
  import { students, lessons, currentRegister } from '$lib/stores/writables'
  import { Logging } from '$lib/stores/log-store'
  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()

  export let index: number | null = null
  let ready: boolean = false
  
  onMount( async () => {
    
    // Get the student's evidence from the evidence table.
    const response = await fetch('/api/evidence/get', { method : 'POST', body : JSON.stringify( { values: { student_id: $students[index].id } } )})
    const { data } = await response.json()
    data.sort((a, b) => parseFloat(a.lesson_number) - parseFloat(b.lesson_number));
    $students[index].evidence = data
    ready = true

  })

  const refreshData = async () => {
    
    ready = false
    // Get the student's evidence from the evidence table.
    const response = await fetch('/api/evidence/get', { method : 'POST', body : JSON.stringify( { values: { student_id: $students[index].id } } )})
    const { data } = await response.json()
    data.sort((a, b) => parseFloat(a.lesson_number) - parseFloat(b.lesson_number));
    $students[index].evidence = data
    ready = true

  }

  const evidenceButtonStyle = (evIndex: number) => {
    const lessonNumber = evIndex + 1
    const evidence = $students[index].evidence.find( ev => ev.lesson_number == lessonNumber)
    if (evidence) {
      if (evidence.teacher_absent) return 'b-white text-white bg-red-600'
      else if (evidence.teacher_locked) return 'b-white text-white bg-green-500'
      else if (evidence.teacher_feedback && evidence.teacher_score && evidence.student_dish_images.length && evidence.student_evaluation && ($currentRegister.course != 'L3CERT' || evidence.student_timeplan)) return 'text-white bg-orange-500'
      else if (evidence.student_evaluation && evidence.student_dish_images.length && evidence.student_timeplan) return 'text-white bg-yellow-500'
      else return 'text-white bg-blue-500'
    }
    else return 'text-white bg-blue-500'
  }


  import Button from '$lib/components/forms/Button.svelte'
  import EvidenceModal from '$lib/components/modals/EvidenceModalForTeachers.svelte'

</script>

{#if ready}
<tr>
  <td class="w-48 whitespace-nowrap py-4 pr-6 font-medium text-grey align-top text-sm">{$students[index].first_name} {$students[index].last_name}</td>

  <td class="whitespace-nowrap py-4 font-medium text-grey align-top text-sm">
    <div class="flex justify-start items-center flex-wrap">
      {#each $lessons as lesson, lessonIndex}
        <Button 
          on:press="{ () => { dispatch('evidenceClick', { studentIndex: index, lessonIndex: lessonIndex }) } }" 
          tailwind="w-8 h-8 block text-sm text-left items-center border  shadow-sm text-center font-medium  {$students[index].evidence ? evidenceButtonStyle(lessonIndex) : 'bg-blue-500 text-white border-white'} shadow hover:bg-blue-700 hover:text-white focus:bg-blue-700 focus:text-white" text="{lessonIndex + 1}" 
        />
      {/each}
    </div>
  </td>

  <td class="pl-2">
    <button type="button" 
      on:click="{ () => { refreshData() } }" 
      class="w-8 h-8 block text-sm   shadow-sm text-center font-medium shadow text-blue-600 hover:text-blue-700 focus:text-white"
    ><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mx-2 " title="Reload">
      <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
    </button>
    
  </td>
</tr>
{/if}
