<script>
  
  import { currentUser } from '$lib/stores/writables'
  import { RegisterServices } from '$lib/stores/registers-store'
  let index, ready = false

  const prepStudentData = () => {
    // If the currentUser has no menus data, create an array containing two empty menus
    if (!$currentUser.data.menus) {
      $currentUser.data.menus = RegisterServices.prepStudentMenusSingleStudent()
    }
    ready = true
  }
  prepStudentData()

  import ModalMenus from '$lib/components/modals/MenuPlanModal.svelte';
  import Button from '$lib/components/forms/Button.svelte'

</script>

{#if ready}
<div class="rounded-md p-4 bg-white drop-shadow-md mb-6">

  <h2 class="text-base font-medium text-grey-900 text-xl">Menu plans</h2>
  
  <div class="flow-root mt-6 grid grid-cols-2 gap-2">

    <h2 class="col-span-2 mb-4 flex justify-start items-center text-grey-900 text-xs">By the end of the course, you will need to have completed two detailed menu plans.</h2>

    <Button on:press="{ () => { index = 0 } }" tailwind="p-2 block text-left items-center shadow-sm text-center font-medium rounded-md {$currentUser.data.menus[0].score ? 'text-white bg-green-500' : ($currentUser.data.menus[0].scene && $currentUser.data.menus[0].factors && $currentUser.data.menus[0].design && $currentUser.data.menus[0].costingQuality.length && $currentUser.data.menus[0].menu) ? 'text-white bg-yellow-500 hover:text-white hover:bg-blue-900 focus:text-white focus:bg-blue-900' : 'bg-white  border border-blue-500 text-base font-medium text-blue-600 hover:text-white hover:bg-blue-900 focus:text-white focus:bg-blue-900'} shadow" text="Menu plan 1" disabled="{$currentUser.data.menus[0].score}" />

    <Button on:press="{ () => { index = 1 } }" tailwind="p-2 block text-left items-center shadow-sm text-center font-medium rounded-md {$currentUser.data.menus[1].score ? 'text-white bg-green-500' : ($currentUser.data.menus[1].scene && $currentUser.data.menus[1].factors && $currentUser.data.menus[1].design && $currentUser.data.menus[1].costingQuality.length && $currentUser.data.menus[1].menu) ? 'text-white bg-yellow-500 hover:text-white hover:bg-blue-900 focus:text-white focus:bg-blue-900' : 'bg-white border border-blue-500 text-base font-medium text-blue-600 hover:text-white hover:bg-blue-900 focus:text-white focus:bg-blue-900'} shadow" text="Menu plan 2" disabled="{$currentUser.data.menus[1].score}" />

  </div>

</div>
{/if}

{#if typeof index == 'number'}
  <ModalMenus bind:index="{index}" />
{/if}