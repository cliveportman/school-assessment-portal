<script>

  export let tab
  let modal = false, modalMenuPlanIndex, modalStudentIndex
  
  import { currentUser, currentRegister, students,  currentCourse } from '$lib/stores/writables.js'
  import Button from '$lib/shared-components/Button.svelte'
  import MenuPlanModal from './modals/MenuPlanModal.svelte'

  const evidenceButtonStyle = (menuPlan) => {
    if (menuPlan.score) return 'text-grey-100 bg-green-500'
    else if (menuPlan.scene && menuPlan.design && menuPlan.factors && menuPlan.costingQuality.length) return 'text-white bg-red-500'
    else return 'text-white bg-grey-400'
  }

  const showModal = (planIndex, studentIndex) => {
    modalMenuPlanIndex = planIndex
    modalStudentIndex = studentIndex
    modal = true
  }
 
</script>

{#if $currentRegister && $students}
<div class="flex flex-col">
  <div class="overflow-x-auto">
    

  <div class="flow-root mt-6">
    <div class="mb-2 flex justify-start items-center text-grey-900 text-xs"><div class="mr-2 text-left w-4 h-4 shadow-sm text-center rounded-sm text-white bg-green-500"></div> <span>Complete</span></div>
    <div class="mb-2 flex justify-start items-center text-grey-900 text-xs"><div class="mr-2 text-left w-4 h-4 shadow-sm text-center rounded-sm text-white bg-red-500"></div> <span>Waiting for teacher confirmation</span></div>
    <div class="mb-2 flex justify-start items-center text-grey-900 text-xs"><div class="mr-2 text-left w-4 h-4 shadow-sm text-center rounded-sm bg-grey-400 text-base font-medium text-grey-900"></div> <span>Incomplete</span></div>
  </div>

    <div class="inline-block min-w-full align-top">
      <div class="overflow-hidden shadow ring-opacity-5 rounded rounded-t-none">
        <table class="min-w-full">
          <thead class="bg-white border-b-2 border-b-grey-300">
            <tr>
              <th scope="col" class="py-4 pr-6 text-left text-sm font-semibold text-grey-900">Student</th>
              <th scope="col" class="text-left text-sm font-semibold text-grey-900">Menu plans</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-grey-300 bg-white">
            {#each $students as student, studentIndex}
            {#if student.first_name || students.last_name}
              <tr>
                <td class="whitespace-nowrap py-4 pr-6 font-medium text-grey align-top text-sm">{student.first_name} {student.last_name}</td>

                <!-- Evidence. Fetch lessons from Craft so we know how many there are -->
                <td class="whitespace-nowrap py-4 font-medium text-grey align-top text-sm">                  
  
                  <div class="flex justify-start items-center flex-wrap">      
                    {#each student.menus as plan, planIndex}
                      <Button 
                        on:press="{ () => { showModal(planIndex, studentIndex) } }" 
                        tailwind="block text-left mr-1 mb-1 w-7 h-7 items-center shadow-sm text-center text-xs font-medium rounded-sm {evidenceButtonStyle(student.menus[planIndex])} shadow hover:text-white hover:bg-blue-900 focus:text-white focus:bg-blue-900" text="{planIndex + 1}"
                      />
                    {/each}
                  </div>
                </td>

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
  <MenuPlanModal
    bind:modal="{modal}"
    menuPlanIndex="{modalMenuPlanIndex}"
    studentIndex="{modalStudentIndex}" 
  />
{/if}