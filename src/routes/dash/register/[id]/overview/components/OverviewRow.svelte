<script lang="ts">

  import { onMount } from 'svelte'
  import { students, lessons } from '$lib/stores/writables'
  import { Logging } from '$lib/stores/log-store'

  export let index: number | null = null 
  let ready: boolean = false, evIndex
  
  onMount( async () => {
    
    // Get the student's evidence from the evidence table.
    const response = await fetch('/api/evidence/get', { method : 'POST', body : JSON.stringify( { values: { student_id: $students[index].id } } )})
    const { data } = await response.json()
    data.sort((a, b) => parseFloat(a.lesson_number) - parseFloat(b.lesson_number));
    $students[index].evidence = data
    ready = true

  })

  const lessonsCompleted = (student) => {
  let completed = 0     
  student.evidence.forEach(lesson => {
    if (lesson.teacher_locked && !lesson.teacher_absent) completed++
  })
  return completed + ' out of ' + $lessons.length  
}
const lessonsAbsent = (student) => {
  let absent = 0     
  student.evidence.forEach(lesson => {
    if (lesson.teacher_absent) absent++
  })
  return absent  
}


  import Button from '$lib/components/forms/Button.svelte'
  import EvidenceModal from '$lib/components/modals/EvidenceModalForTeachers.svelte'

</script>

{#if ready}
<tr>
  <td class="w-48 whitespace-nowrap py-4 pr-6 font-medium text-grey align-top text-sm">{$students[index].first_name} {$students[index].last_name}</td>
  <td class="whitespace-nowrap py-4 font-medium text-grey align-top text-sm">{lessonsCompleted($students[index])}</td>
  <td class="whitespace-nowrap py-4 font-medium text-grey align-top text-sm">{lessonsAbsent($students[index])}</td>
</tr>
{/if}
