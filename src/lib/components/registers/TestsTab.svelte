<script>

  export let tab
  
  import { currentUser, currentRegister, students,  currentCourse } from '$lib/stores/writables.js'
  import { RegisterServices } from '$lib/stores/registers-store.js'
  import SelectField from '$lib/shared-components/SelectField.svelte'
  import Button from '$lib/shared-components/Button.svelte'

  const duplicateStudents = $students

  const options = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
  let hasChanges = false

  const saveTests = async () => {
    const saving = await RegisterServices.saveTests(duplicateStudents)
    if (saving.success) {
      $students = duplicateStudents
      hasChanges = false
    }    
  }

  $:console.log(duplicateStudents)

</script>

{#if $currentRegister && duplicateStudents}
<div class="flex flex-col">
  <div class="overflow-x-auto">

    <div class="inline-block min-w-full align-top">
      <div class="overflow-hidden shadow ring-opacity-5 rounded rounded-t-none">
        <table class="min-w-full">

          <thead class="bg-white border-b-2 border-b-grey-300">
            <tr>
              <th scope="col" class="py-4 pr-6 text-left text-sm font-semibold text-grey-900">Student</th>
              <th scope="col" class="text-left text-sm font-semibold text-grey-900">Test 1</th>
              <th scope="col" class="text-left text-sm font-semibold text-grey-900">Test 2</th>
              <th scope="col" class="text-left text-sm font-semibold text-grey-900">Test 3</th>
              <th scope="col" class="text-left text-sm font-semibold text-grey-900">Test 4</th>
              <th scope="col" class="text-left text-sm font-semibold text-grey-900">Test 5</th>
              <th scope="col" class="text-right text-sm font-semibold text-grey-900">
                <Button 
                    on:press="{ () => { saveTests() } }" 
                    tailwind="block  py-2 px-4 items-center shadow-sm text-center text-sm font-medium rounded-md shadow {hasChanges ? 'bg-red-500 text-white' : 'bg-grey-100 text-white'} hover:text-white hover:bg-blue-900 focus:text-white focus:bg-blue-900" text="Save all changes" disabled="{!hasChanges}"
                  />
              </th>
            </tr>
          </thead>

          <tbody class="divide-y divide-grey-300 bg-white">
            {#each duplicateStudents as student, studentIndex}
              {#if student.first_name || students.last_name}
                <tr>
                  <td class="whitespace-nowrap py-4 pr-6 font-medium text-grey align-center text-sm">{student.first_name} {student.last_name}</td>
                  {#each student.tests as test, index}
                    <td class="whitespace-nowrap py-2 font-medium text-grey align-center text-sm">
                      <SelectField {options} bind:value="{test}" tailwind="w-16" on:change="{ () => { hasChanges = true } }" />
                    </td>
                  {/each}
                  <td></td>
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