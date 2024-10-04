<script>

  export let tab
  let modal = false, modalStudentIndex
  
  import { currentUser, currentRegister, students,  currentCourse } from '$lib/stores/writables.js'
  import { supabase } from '$lib/stores/supabase-client.js'
  import Button from '$lib/shared-components/Button.svelte'
  import Image from '$lib/shared-components/Image.svelte'
  import GroupTaskModal from './modals/GroupTaskModal.svelte'

  const isComplete = (groupTask) => {
    if (
      (groupTask.group1 || groupTask.group2)
      && (groupTask.individual1 || groupTask.individual2)
    ) {
      return true
    }
    else return false
  }
 
</script>

{#if $currentRegister && $students}
<div class="flex flex-col">
  <div class="overflow-x-auto">

    <div class="inline-block min-w-full align-top">
      <div class="overflow-hidden shadow ring-opacity-5 rounded rounded-t-none">
        <table class="min-w-full">
          <thead class="bg-white border-b-2 border-b-grey-300">
            <tr>
              <th scope="col" class="py-4 pr-6 text-left text-sm font-semibold text-grey-900">Student</th>
              
              <th scope="col" class="text-left text-sm font-semibold text-grey-900">Individual image/s</th>              
              <th scope="col" class="text-left text-sm font-semibold text-grey-900">Group image/s</th>

              <th scope="col" class="text-left text-sm font-semibold text-grey-900">Status</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-grey-300 bg-white">
            {#each $students as student, studentIndex}
            {#if student.first_name || students.last_name}
              <tr>
                <td class="whitespace-nowrap py-4 pr-6 font-medium text-grey-900 align-middle text-sm">{student.first_name} {student.last_name}</td>
                <td class="whitespace-nowrap py-4 font-normal text-grey-900 align-middle text-sm">
                  {#if !student.group_task?.individual1 && !student.group_task?.individual2}
                    Not provided
                  {:else}
                  <div class="flex">
                    {#if student.group_task?.individual1}<Image path="{student.group_task.individual1}" tailwind="w-24 mx-1" />{/if}
                    {#if student.group_task?.individual2}<Image path="{student.group_task.individual2}" tailwind="w-24 mx-1" />{/if}
                  </div>
                  {/if}
                </td>
                <td class="whitespace-nowrap py-4 font-normal text-grey-900 align-middle text-sm">
                  {#if !student.group_task?.group1 && !student.group_task?.group2}
                    Not provided
                  {:else}
                  <div class="flex">
                    {#if student.group_task?.group1}<Image path="{student.group_task.group1}" tailwind="w-24 mx-1" />{/if}
                    {#if student.group_task?.group2}<Image path="{student.group_task.group2}" tailwind="w-24 mx-1" />{/if}
                  </div>
                  
                  {/if}
                </td>
                <td class="whitespace-nowrap py-4 font-medium text-grey-900 align-middle text-sm">{isComplete(student.group_task) ? 'Complete' : 'Incomplete'}</td>
              </tr>
              {:else}
              <tr>
                <td class="whitespace-nowrap py-4 px-3 font-medium text-red-600 sm:pl-6 align-top text-sm">No students have been added to this register. Add them using the 'Add student' button above.</td>
              </tr>
              {/if}
            {/each}
          </tbody>
          
        </table>
      </div>
    </div>
  </div>
</div>
{/if}

{#if modal}
  <GroupTaskModal
    bind:modal="{modal}"
    studentIndex="{modalStudentIndex}" 
  />
{/if}