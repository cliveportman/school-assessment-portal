<script lang="ts">
  
  import { currentRegister, students } from '$lib/stores/writables'
  import { DashboardServices } from '$lib/stores/dashboard-store'
  import { ToastServices } from '$lib/stores/toasts-store'
  import { Logging } from '$lib/stores/log-store'

  export let modal, title, instructions, type, id, registerId = null

  // Vars for new user  
  let values = { firstName: '', lastName: '', email: ''}
  let message, loading = false
  
  const createStudentUser = async () => {
    console.log($students)
    values.schoolId = id
    values.registerId = registerId
    const { data: newUserId } = await DashboardServices.createStudentUser(values)
    if (newUserId) {
      // Add the students ID to the register in state
      $currentRegister.student_ids = [...$currentRegister.student_ids, newUserId]
      // Fetch the student's details (they will be empty)
      const response = await fetch('/api/users/get/student', { method : 'POST', body : JSON.stringify( { values: { student_id: '18241cda-fb4c-4042-9a64-399a7e957350' } } )})
      const { data } = await response.json()
      if (data) {
        $students = [...$students, data[0]]
      }
    } else {
      ToastServices.addToast('error', 'Could not create student', 'Please try again. If this error continues, please contact Leiths Academy.')
      Logging.postLog('', 'evidence', 'student user could not be created')
    }
    modal = !modal
  }

  const createUser = async () => {
    loading = true
    await createStudentUser()
    loading = false
  }

  import Button from '$lib/components/forms/Button.svelte'
  import EmailField from '$lib/components/forms/EmailField.svelte'
  import TextField from '$lib/components/forms/TextField.svelte'
  import Alert from '$lib/components/notifications/Alert.svelte'

</script>


<div class="relative z-40" aria-labelledby="modal-title" role="dialog" aria-modal="true">
  <div class="fixed inset-0 bg-black bg-opacity-75 transition-opacity"></div>

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
            <h3 class="text-lg leading-6 font-medium text-grey-900 mb-4" id="modal-title">{title}</h3>

            {#if instructions}
              <div class="mb-4">
                <p class="text-sm text-grey-900">{instructions}</p>
              </div>
            {/if}

            {#if message}
              <Alert status="{message.status}" message="{message.text}" tailwind="mb-4" />
            {/if}

            <div class="grid grid-cols-2 gap-x-4">
              <TextField bind:value="{values.firstName}" label="First name" required="{true}" placeholder="" tailwind="mb-4" />
              <TextField bind:value="{values.lastName}" label="Last name" required="{true}" placeholder="" tailwind="mb-4" />
            </div>
            <EmailField bind:value="{values.email}" label="Email" required="{true}" placeholder="" tailwind="mb-4 mb-8" />

            <div class="mt-5 sm:mt-4 sm:flex sm:justify-between">
              <Button on:press="{ () => { modal = !modal } }" text="Cancel" tailwind="mt-3 w-full inline-flex justify-center rounded-md border border-grey-500 shadow-sm px-4 py-2 bg-grey-50 text-base font-medium text-grey-600  sm:mt-0 sm:w-auto sm:text-sm" />
              <Button bind:loading="{loading}" on:press="{ () => { createUser() } }" text="{type == 'student' ? 'Invite student' : 'Create user' }" tailwind="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white sm:w-auto sm:text-sm" />
            </div>

          </div>

      </div>
    </div>
  </div>
</div>
