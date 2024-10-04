<script>
  
  import { currentUser } from '$lib/stores/writables'
  import { RegisterServices } from '$lib/stores/registers-store'
  let modal = false, ready = false

  const prepStudentData = () => {
    // If the currentUser has no group data, create an empty object
    if (!$currentUser.data.group_task) {
      $currentUser.data.group_task = RegisterServices.prepStudentGroupTaskSingleStudent()
    }
    ready = true
  }
  prepStudentData()

  import GroupModal from '$lib/components/modals/GroupTaskModal.svelte';
  import Button from '$lib/components/forms/Button.svelte'

</script>

{#if ready}
<div class="rounded-md p-4 bg-white drop-shadow-md mb-6">

  <h2 class="text-base font-medium text-grey-900 text-xl">Group task</h2>
  
  <div class="flow-root mt-6">
    <h2 class="mb-4 flex justify-start items-center text-grey-900 text-xs">By the end of the course, you will need to have uploaded two individual photographs and two group photographs.</h2>
    <Button on:press="{ () => { modal = !modal } }" tailwind="px-3 py-2 block text-left items-center shadow-sm text-center font-medium rounded-md {$currentUser.data.group_task.individual1 && $currentUser.data.group_task.individual2 && $currentUser.data.group_task.group1 && $currentUser.data.group_task.group2 ? 'text-white bg-green-500' : 'bg-white border border-blue-500 text-base font-medium text-blue-600'} shadow hover:text-white hover:bg-blue-900 focus:text-white focus:bg-blue-900" text="View/edit images" />
  </div>

</div>
{/if}

{#if modal}
  <GroupModal bind:modal="{modal}" />
{/if}