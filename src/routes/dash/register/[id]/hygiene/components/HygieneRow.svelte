<script lang="ts">

  import { onMount } from 'svelte'
  import { students, lessons } from '$lib/stores/writables'
  import { Logging } from '$lib/stores/log-store'

  export let index: number | null = null, score: number = 0
  let ready: boolean = false
  
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
const save = () => {
  console.log('blurred')  
}


import Button from '$lib/components/forms/Button.svelte'
import NumberField from '$lib/components/forms/NumberField.svelte'

</script>

{#if ready}
<tr>
  <td class="w-48 whitespace-nowrap py-4 pr-6 font-medium text-grey align-top text-sm">{$students[index].first_name} {$students[index].last_name}</td>
  <td class="w-32 whitespace-nowrap py-4 font-medium text-grey align-top text-sm">
    <NumberField label="" bind:value="{score}" tailwind="" min="{0}" max="{100}" />      
  </td>
  <td></td>
</tr>
{/if}
