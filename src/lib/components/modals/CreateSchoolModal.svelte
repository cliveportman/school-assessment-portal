<script>
  
  import { DashboardServices } from '$lib/stores/dashboard-store'

  export let modal, title, instructions

  // Vars for new school  
  let values = { title: ''}
  let message

  // We might need a different function for each user here
  const createSchool = async () => {
    let response = await DashboardServices.createSchool(values)
    if (response && response.success) modal = !modal
  }

  import Button from '$lib/components/forms/Button.svelte'
  import TextField from '$lib/components/forms/TextField.svelte'
  import Alert from '$lib/components/notifications/Alert.svelte'

</script>


<div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
  <div class="fixed inset-0 bg-black bg-opacity-75 transition-opacity"></div>

  <div class="fixed z-10 inset-0 overflow-y-auto">
    <div class="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
      <div class="relative bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full sm:p-6">

        <div class="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
          <button on:click="{ () => { modal = !modal } }" type="button" class="bg-white rounded-md text-blue-900">
            <span class="sr-only">Close</span>
            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        
          <div class="mt-3 text-center sm:mt-0 sm:mx-4 sm:text-left">
            <h3 class="text-lg leading-6 font-medium text-grey-900 mb-4" id="modal-title">{title}</h3>

            {#if instructions}
              <div class="mb-4">
                <p class="text-sm text-grey-900">{instructions}</p>
              </div>
            {/if}

            {#if message}
              <Alert status="{message.status}" message="{message.text}" tailwind="mb-4" />
            {/if}

            <TextField bind:value="{values.title}" label="Name of school" required="{true}" placeholder="" tailwind="mb-4 mb-8" />

            <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <Button on:press="{ () => { createSchool() } }" text="Add school" tailwind="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white  sm:ml-3 sm:w-auto sm:text-sm" />
              <Button on:press="{ () => { modal = !modal } }" text="Cancel" tailwind="mt-3 w-full inline-flex justify-center rounded-md border border-blue-500 shadow-sm px-4 py-2 bg-white text-base font-medium text-blue-600  sm:mt-0 sm:w-auto sm:text-sm" />
            </div>


          </div>

      </div>
    </div>
  </div>
</div>
