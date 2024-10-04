<script lang="ts">
  
  import { goto } from '$app/navigation'
  import type { LayoutData } from './$types'
  import { onMount } from 'svelte'

  import { currentUser }  from '$lib/stores/writables'

  export let data: LayoutData

  let ready = false
  onMount(async () => {
    if (!data.session) goto('/')
    if (!$currentUser.uuid) $currentUser.uuid = data.session.user.id
    if (!$currentUser.role) {      
      const response = await fetch('/api/auth/get-role', {
        method: 'POST',
        body: JSON.stringify({ uuid: data.session.user.id }),
        headers: {
          'content-type': 'application/json'
        }
      })
      const { role } = await response.json()
      $currentUser.role = role
    }
    ready = true
  })

</script>

{#if ready}
<div class="relative bg-blue border-b-2 border-blue-300 mb-12">
  <div class="relative z-20">

    <div class="m-auto flex justify-between items-center p-4">
      <a href="/dashboard" class="flex">
        <span class="sr-only">Leiths Academy</span>
        <img class="h-10 w-auto sm:h-10" src="/img/logo.svg" alt="Leiths Academy">
      </a>
      {#if data.session}
        <p class="font-medium text-white text-center text-xl uppercase">
          {#if $currentUser.role == 'admin'}
            ADMIN: {data.session.user.email}
          {:else}
            {data.session.user.user_metadata.first_name} {data.session.user.user_metadata.last_name}
          {/if}
        </p>
      {/if}
      <form method="POST" action="/signout">
        <button type="submit" class="ml-2 inline-flex items-center justify-center px-4 py-2 rounded-md shadow-sm text-base font-medium bg-blue-600 text-white border border-white ">Sign out</button>
      </form>

    </div>
  </div>
  
</div>

<slot></slot>
{/if}