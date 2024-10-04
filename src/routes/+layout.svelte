<script>

  export const ssr = false
  export const prerender = false

  import { supabaseClient } from '$lib/db'
  import { invalidate } from '$app/navigation'
  import { onMount } from 'svelte'
  import "$lib/app.css"

  onMount(() => {
    const {
      data: { subscription }
    } = supabaseClient.auth.onAuthStateChange(() => {
      invalidate('supabase:auth');
    });

    return () => {
      subscription.unsubscribe();
    };
  });
</script>

<slot />