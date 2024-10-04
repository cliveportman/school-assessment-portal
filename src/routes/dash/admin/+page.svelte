<script lang="ts">
  
  import { users } from '$lib/stores/writables'
  import { DashboardServices } from '$lib/stores/dashboard-store'
  import { Logging } from '$lib/stores/log-store'

  import CreateUserModal from '$lib/components/modals/CreateUserModal.svelte'
  import Button from '$lib/components/forms/Button.svelte'

  DashboardServices.getAcademyUsers()
  let showUserModal: boolean = false  

  // We're repeating the same function in the modal here for resending invite links.
  // Supabase don't support resending these, but you can recreate the user and it has the same effect.
  let loading: boolean= false
  const resendInviteLink = async (user) => {
    loading = user.email
    const values = { firstName: user.firstName, lastName: user.lastName, email: user.email}
    let response = await DashboardServices.createAcademyUser(values)
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

{#if $users.academy}
  <div class="sm:flex sm:items-center md:px-6 lg:px-8">
    <div class="sm:flex-auto">
      <h1 class="text-xl font-semibold text-grey-900">'academy' users</h1>
    </div>
    <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
      <Button on:press="{ () => { showUserModal = !showUserModal, Logging.postLog('admin', 'users', 'pressed Add Academy User button') } }" text="Add 'academy' user" tailwind="inline-flex items-center justify-center rounded-md  bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow-sm sm:w-auto" />
    </div>
  </div>

  <div class="mt-4 flex flex-col">
    <div class="overflow-x-auto">
      <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
        <div class="overflow-hidden shadow ring-1 ring-grey ring-opacity-5 md:rounded-lg">
          <table class="min-w-full">
            <thead class="bg-white border-b border-b-blue-500">
              <tr>
                <th scope="col" class="py-4 pl-4 pr-3 text-left text-md font-semibold text-grey-900 sm:pl-6">Name</th>
                <th scope="col" class="px-3 py-4 text-left text-md font-semibold text-grey-900">Email</th>
                <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6"></th>
              </tr>
            </thead>

            <tbody class="divide-y divide-blue-200 bg-white">
              {#each $users.academy as user}
                <tr>
                  <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-grey-900 sm:pl-6">{user.first_name ?? 'Natalie'} {user.last_name ?? 'Portman'}</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm font-medium text-grey-900">{user.email ?? ''}</td>
                  <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <Button on:press="{ () => { resendInviteLink(user) } }" text="Resend invite" tailwind="inline-flex items-center justify-center rounded-md border border-blue-500 px-4 py-2 text-sm font-medium text-blue-600 shadow-sm sm:w-auto {loading == user.email ? 'opacity-25' : ''}" />
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

{#if showUserModal}
  <CreateUserModal 
    bind:modal="{showUserModal}"
    type="academy"
    title="Create 'academy' user"
    instructions="The new user will be sent a confirmation email. They will need to confirm by clicking a link in that email."
  />
{/if}