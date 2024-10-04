<script lang="ts">

  import { currentRegister } from '$lib/stores/writables'

  export let title: string, course: string, activeTab: number

  let modal = false

  import { tabs }  from '../../functions'

  import CreateStudentModal from '$lib/components/modals/CreateStudentModal.svelte'
  import Button from '$lib/components/forms/Button.svelte'

</script>


  <div class="sm:flex sm:items-center mb-6">
    <div class="sm:flex-auto">
      <h1 class="text-xl font-semibold text-grey-900">{title}</h1>
      <h2 class="text-lg font-semibold text-blue-600">{course}</h2>
    </div>
    <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
      {#if activeTab == 0}
        <Button 
          on:press="{ () => { modal = !modal } }" 
          text="Add student" 
          tailwind="inline-flex items-center justify-center rounded-md  bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow-sm sm:w-auto" 
        />
      {/if}
    </div>
  </div>
  <div class="flex justify-start">
    {#each tabs as tab, index}
      {#if index <3}
        <a 
          href="/dash/register/{$currentRegister.id}/{tab.slug}"
          class=" mr-2 px-4 py-3 rounded-md bg-blue-600 text-white font-medium shadow" 
          class:bg-blue-900='{activeTab == index}'
        >
          {tab.title}
        </a>
      {/if}
    {/each}
  </div>

  

{#if modal}
  <CreateStudentModal 
    bind:modal="{modal}"
    type="student"
    title="Add student to register"
    instructions="On completing this form, the student will receive an email containing a confirmation link. Without this, the student will not be able to access their own account, view course resources or submit their own evidence for review."
    id="{$currentRegister.school_id}"
    registerId="{$currentRegister.id}"
  />
{/if}