<script>

  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()
  
  const press = () => {
    dispatch('press')
  }

  export let text, tailwind, loading = false, disabled = false

</script>

<button type="button" class="{tailwind}" class:animate-pulse="{loading}" disabled="{loading || disabled}" class:disabled="{disabled}" on:click="{ () => { press() } }">{!loading ? text : 'Working...'}</button>

<style>
  .disabled {
    opacity: 0.25;
  }
</style>
