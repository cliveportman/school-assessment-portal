<script>
  
  import { currentUser } from '$lib/stores/writables'
  import { RegisterServices } from '$lib/stores/registers-store'
  export let modal

  import Button from '$lib/components/forms/Button.svelte'
  import ImageField from '$lib/components/forms/ImageField.svelte'

    

  const saveGroup = async () => {
    let response = await RegisterServices.saveGroup($currentUser.uuid, $currentUser.data.group_task)
    if (response.success) {
      modal = null    
    }
  }

</script>

{#if modal}
<div class="relative z-40" aria-labelledby="modal-title" role="dialog" aria-modal="true">
  <div class="fixed inset-0 bg-grey bg-opacity-75 transition-opacity"></div>

  <div class="fixed z-10 inset-0 overflow-y-auto">
    <div class="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
      <div class="relative bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full sm:p-6">

        <div class="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
          <button on:click="{ () => { modal = !modal } }" type="button" class="bg-white rounded-md text-grey-900">
            <span class="sr-only">Close</span>
            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        
          <div class="mt-3 text-center sm:mt-0 sm:mx-4 sm:text-left">
            <h3 class="text-lg leading-6 font-medium text-grey-900 mb-4 pb-2 border-b border-b-grey-300" id="modal-title">Group task</h3>

            <p class="col-span-4 text-sm font-medium text-grey-900 mb-6">Add up to 4 images showcasing your contributions to the group task
              <span class="block text-left text-xs font-normal">* Accepted files include PNG, JPG, JPEG, GIF and PDF.</span></p>

            <div class="grid grid-cols-2 gap-8 mb-8 ">
              <ImageField bind:path="{$currentUser.data.group_task.individual1}" label="Individual image 1" buttonText="Add image" tailwind="w-50" prefix="group" />
              <ImageField bind:path="{$currentUser.data.group_task.individual2}" label="Individual image 2" buttonText="Add image" tailwind="w-50" prefix="group" />
            </div>
            <div class="grid grid-cols-2 gap-8 mb-4 ">
              <ImageField bind:path="{$currentUser.data.group_task.group1}" label="Group image 1" buttonText="Add image" tailwind="w-50" prefix="group" />
              <ImageField bind:path="{$currentUser.data.group_task.group2}" label="Group image 2" buttonText="Add image" tailwind="w-50" prefix="group" />
            </div>

            <div class="mt-5 pt-4 sm:flex sm:flex-row-reverse  border-t border-t-grey-300">
              <Button on:press="{ () => { saveGroup() } }" text="Save images" tailwind="w-full inline-flex justify-center rounded-md shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white  sm:ml-3 sm:w-auto sm:text-sm" />
              <Button on:press="{ () => { modal = !modal } }" text="Cancel" tailwind="mt-3 w-full inline-flex justify-center rounded-md border border-blue-500 shadow-sm px-4 py-2 bg-white text-base font-medium text-blue-600  sm:mt-0 sm:w-auto sm:text-sm" />
            </div>

          </div>

      </div>
    </div>
  </div>
</div>
{/if}
