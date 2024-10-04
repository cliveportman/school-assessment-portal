<script lang="ts">

  import { onMount } from 'svelte'  
  import { currentRegister, students } from '$lib/stores/writables'
  import Row from './HygieneRow.svelte'
  import Button from '$lib/components/forms/Button.svelte'
  
  onMount( async () => {

  })

  let copy: [] = []

  let count = -1, changes = false
  $: if (copy) {
    count++
    if (count) changes = true
  }

  const reset = ()=> {
    copy = JSON.parse(JSON.stringify($students)) // Need a deep copy here, not a reference
    copy.forEach(student => {
      if (!student.hygiene) student.hygiene = { score: 0}
    })
    count = -1
    changes = false
  }
  reset()

  const saveChanges = async () => {

    /**
     * todo: create an api endpoint for saving students
    */

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
              <th scope="col" class="py-3.5 text-left text-sm font-semibold text-grey-900">Hygiene score (%)</th>
              <th scope="col" class="text-right">                
                <Button on:press="{ () => { reset() } }" text="Reset" tailwind="mt-3 w-full inline-flex justify-center rounded-md border border-blue-500 shadow-sm px-4 py-2 bg-white text-base font-medium text-blue-600 {changes ? '' : 'opacity-30'} sm:mt-0 sm:w-auto sm:text-sm" disabled="{changes ? false : true}" />
                <Button on:press="{ () => { saveChanges() } }" text="Save changes" tailwind="mt-3 w-full inline-flex justify-center rounded-md border border-green-500 shadow-sm px-4 py-2 bg-green-500 text-base font-medium text-white {changes ? '' : 'opacity-30'} sm:mt-0 sm:w-auto sm:text-sm" disabled="{changes ? false : true}" />
              </th>
            </tr>
          </thead>
          
          <tbody class="divide-y divide-grey-300 bg-white">
            {#each copy as student, index}
              <Row {index} bind:score="{student.hygiene.score}" />
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