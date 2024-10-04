<script lang="ts">

  import { currentUser } from '$lib/stores/writables'

  import { page } from '$app/stores'
  import { goto } from '$app/navigation'
  import TextField from '$lib/components/forms/TextField.svelte'
  import EmailField from '$lib/components/forms/EmailField.svelte'
  import Alert from '$lib/components/notifications/Alert.svelte'
  import Spinner from '$lib/components/svgs/Spinner.svelte'

  let email: string
  let otp: string
  let otpSent: boolean = false
  let loading: boolean = false
  let message: { status: string | null, text: string | null, tailwind: string | null } = { status: null, text: null, tailwind: null}

  async function sendotp() {
    loading = true
    const response = await fetch('/api/auth/request-otp', {
      method: 'POST',
      body: JSON.stringify({ email: email }),
      headers: {
        'content-type': 'application/json'
      }
    })

    const data = await response.json()
    loading = false
    
    if (data.status == 200) otpSent = true, message.status = 'success', message.text = 'Code sent - please check your email and enter the code below.'
    else if (data.status == 403) message.status = 'error', message.text = 'Email address not recognised'
    else if (data.status == 422) message.status = 'error', message.text = 'Invalid email address'
    else if (data.status == 429) message.status = 'error', message.text = 'You have made mutliple code requests in a very short time. Please wait a minute and try again.'
    else message.status = 'error', message.text = 'An unknown error occured'
  }

  async function checkotp() {
    loading = true
    const response = await fetch('/api/auth/check-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
      headers: {
        'content-type': 'application/json'
      }
    })
    const data = await response.json()
    if (data.uuid) getrole(data.uuid), $currentUser.uuid = data.uuid
    else message.status = 'error', message.text = 'This code is either invalid or has expired. Please reload the page to request a new one.'
    loading = false
  }

  async function getrole(uuid: String) {
    const response = await fetch('/api/auth/get-role', {
      method: 'POST',
      body: JSON.stringify({ uuid }),
      headers: {
        'content-type': 'application/json'
      }
    })

    const data = await response.json()
    if (data.role) gotoDashboard(data.role)
  }

  const gotoDashboard = (role: string) => {
    $currentUser.role = role // Set the signed in user's role
    if (role == 'student') goto('/dash/student')
    else if (role == 'school_teacher') goto('/dash/school')
    else if (role == 'visiting_teacher') goto('/dash/visiting')
    else if (role == 'academy') goto('/dash/academy')
    else if (role == 'admin') goto('/dash/admin')
    return false
  }

</script>

<svelte:head>
	<title>Leiths Academy</title>
</svelte:head>

<div class="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-blue-500">

  {#if !$page.data.session}
  
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <img class="mx-auto h-16 md:h-24 w-auto" src="/img/logo.svg" alt="Leiths Academy">
    </div>

    <div class="mt-8 mx-6 sm:mx-auto sm:w-full sm:max-w-md bg-stone-50 rounded-md">
      <div class="bg-white py-8 px-4 shadow rounded-md sm:px-10"> 
        
        <div class="space-y-6">

          <p class="text-center text-base font-medium">Request a sign in code.</p>

          {#if message.status}<Alert status="{message.status}" message="{message.text}" />{/if}
          
            {#if !otpSent}
              <form>
                <EmailField bind:value="{email}" label="Enter your email" required="{true}" placeholder="e.g. student@yourschool.co.uk" tailwind="mb-4"/>
                <button 
                  type="submit" 
                  class="w-full flex justify-center py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-blue-500" 
                  class:animate-pulse="{loading}" 
                  disabled="{loading}" 
                  on:click|preventDefault="{ () => sendotp() }">
                    {!loading ? 'Send me a sign in code' : 'Sending...'}
                </button>
              </form>
            {:else}
              <form>
                <TextField bind:value="{otp}" label="6-digit code from the email" required="{true}" placeholder="e.g. 123456" tailwind="mb-4"/>
                <button 
                  type="button" 
                  class="w-full flex justify-center py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-blue-500" 
                  class:animate-pulse="{loading}" 
                  disabled="{loading}" 
                  on:click|preventDefault="{ () => checkotp() }">
                    {!loading ? 'Sign in' : 'Checking credentials...'}
                </button>
              </form>
            {/if}

          </div>

      </div>
    </div>

    <p class="text-white text-sm font-medium mx-auto my-4 text-center">Problems? <a href="/help" target="_blank" class=" underline">Visit the Help page</a></p>

  {:else}

    <div class="mx-auto w-full sm:max-w-md flex flex-col justify-center items-center">
      {#await getrole($page.data.session.user.id)}
        <Spinner />
        <p class="text-white text-center mt-4">...checking credentials</p>
      {:then data}
        <Spinner />
        <p class="text-white text-center mt-4">...checking credentials</p>
      {:catch error}
        <Alert status="error" message="{error.message}" />
      {/await}
    </div>

  {/if}

</div>