<script lang="ts">

  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()

  export let value = '', label = null, tailwind: string = '', options = []

</script>

<div class="{tailwind}">
  {#if label}<label class="block text-sm font-medium text-grey-900">{label}</label>{/if}
  <select bind:value="{value}" class="mt-1 block w-full pl-1 pr-0 py-2 text-base text-center border bg-white border-grey-500 sm:text-sm rounded-md" on:change="{ () => { dispatch('change') } }">
    {#each options as option}
      <option class="p-1" value="{option}">{option}</option>
    {/each}
  </select>
</div>