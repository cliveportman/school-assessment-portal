<script>

  import { supabase } from '$lib/stores/supabase-client.js'

  export let tailwind = null, path = null
  let url
  const download = async () => {
    try {
      const { data, error } = await supabase.storage.from('evidence').download(path)
      if (error) throw error
      url = URL.createObjectURL(data)
    } catch (error) {
      console.error('Error downloading image: ', error.message)
    }
  }

</script>

<div class="{tailwind}">
  {#if path}
    <a href="{url}" use:download target="_blank">
      <img src="{url}" alt="" class="block w-full mb-2" />
    </a>
  {/if}
</div>