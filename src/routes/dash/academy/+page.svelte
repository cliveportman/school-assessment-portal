<script lang="ts">
  
  import { schools } from '$lib/stores/writables.js'
  import { DashboardServices } from '$lib/stores/dashboard-store'

  import CreateSchoolModal from '$lib/components/modals/CreateSchoolModal.svelte'
  import CreateUserModal from '$lib/components/modals/CreateUserModal.svelte'
  import CreateRegisterModal from '$lib/components/modals/CreateRegisterModal.svelte'
  import Button from '$lib/components/forms/Button.svelte'

  DashboardServices.getSchools()
  let showSchoolModal: boolean = false, showTeacherModal: boolean = false, showRegisterModal: boolean = false, modalId, instructions, title


  // We're repeating the same function in the modal here for resending invite links.
  // Supabase doesn't support resending these, but you can recreate the user and it has the same effect.
  let loading
  const resendInviteLink = async (user) => {
    loading = user.email
    const values = { firstName: user.firstName, lastName: user.lastName, email: user.email}
    let response = await DashboardServices.createSchoolTeacherUser(values)
    if (response.success) {
      loading = false
    }
    if (response.error) {
      loading = false
    }
  }

</script>

<svelte:head>
	<title>Dashboard</title>
</svelte:head>

{#if $schools}
  <div class="sm:flex sm:items-center md:px-6 lg:px-8">
    <div class="sm:flex-auto">
      <h1 class="text-xl font-semibold text-white">Schools</h1>
    </div>
    <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
      <Button on:press="{ () => { showSchoolModal = !showSchoolModal } }" text="Add school" tailwind="inline-flex items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-blue-600 shadow-sm sm:w-auto" />
    </div>
  </div>

  <div class="mt-4 flex flex-col">
    <div class="overflow-x-auto">
      <div class="inline-block min-w-full py-2 align-top md:px-6 lg:px-8">
        <div class="overflow-hidden shadow ring-1 ring-grey ring-opacity-5 md:rounded-lg">
          <table class="min-w-full">
            <thead class="bg-white border-b border-b-grey-500">
              <tr>
                <th scope="col" class="py-4 pl-4 pr-3 text-left text-md font-semibold text-grey-900 sm:pl-6">School</th>
                <th scope="col" class="px-3 py-4 text-left text-md font-semibold text-grey-900">Registers</th>
                <th scope="col" class="px-3 py-4 text-left text-md font-semibold text-grey-900">Teachers</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-grey-200 bg-white">
              {#each $schools as school}
                <tr>
                  <td class="whitespace-nowrap py-4 px-3 font-medium text-sm text-grey-900 sm:pl-6 align-top">{school.title}</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-primary align-top">
                    <ul>
                      {#each school.registers as register}
                        <li><a href="/dash/register/{register.id}" class="text-grey-900 font-medium underline">{register.title}</a></li>
                      {/each}
                      <li class="mt-1"><Button on:press="{ () => { showRegisterModal = !showRegisterModal, modalId = school.id} }" text="Add register" tailwind="text-grey-900 underline text-sm" /></li>
                    </ul>    
                  </td>
                  <td class="whitespace-nowrap py-4 px-3 text-sm text-grey-900 align-top">
                    <ul class="">
                      {#each school.school_teachers as teacher}
                        <li class="font-medium text-grey-900">{teacher.first_name} {teacher.last_name} ({teacher.email})</li>
                      {/each}
                      <li class="mt-1"><Button on:press="{ () => { showTeacherModal = !showTeacherModal, modalId = school.id, title = 'Add school teacher to ' + school.title } }" text="Add teacher" tailwind="text-grey-900 underline text-sm" /></li>
                    </ul>                    
                  </td>
                </tr>
              {/each}
            </tbody>
            
          </table>
        </div>
      </div>
    </div>
  </div>
{/if}

{#if showSchoolModal}
  <CreateSchoolModal 
    bind:modal="{showSchoolModal}"
    title="Add school"
    instructions="{instructions}"
  />
{/if}
 
{#if showTeacherModal}
  <CreateUserModal 
    bind:modal="{showTeacherModal}"
    type="schoolTeacher"
    title="{title}"
    instructions="{instructions}"
    id="{modalId}"
  />
{/if}

{#if showRegisterModal}
  <CreateRegisterModal 
    bind:modal="{showRegisterModal}"
    title="Add register"
    instructions="{instructions}"
    id="{modalId}"
  />
{/if}