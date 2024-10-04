<script lang="ts">

  import { supabaseClient as supabase } from '$lib/db'
  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()
  import { ToastServices } from '$lib/stores/toasts-store'
  import { Logging } from '$lib/stores/log-store'

  export let label, buttonText, tailwind, prefix = '', path, readonly: boolean = false
  let uploading: boolean = false, files, url, message

  const upload = async () => {

    try {
      uploading = true
      if (!files || files.length === 0) {
        throw new Error('You must select an image to upload.')
      }
      const file = files[0]
      const extension = file.name.split('.').pop().toLowerCase()
      const fileName = `${prefix}-${Math.random()}.${extension}`
      const filePath = `${fileName}`
      Logging.postLog('', 'evidence', 'image presented for upload: ' + filePath)
      if (extension != 'jpg' && extension != 'jpeg' && extension != 'gif' && extension != 'png') {
        throw new Error('Uploaded files must be images (jpg, jpeg, gif, png)')
        uploading = false
        return
      }

      let { data, error } = await supabase.storage.from('evidence').upload(filePath, file)
      if (data) path = filePath
      if (error) throw error 
      Logging.postLog('', 'evidence', 'successful image upload: ' + filePath)   
      dispatch('upload')
    } catch (error) {
      ToastServices.addToast('error', 'Error saving image', error.message)
      Logging.postLog('', 'evidence', 'failed image upload - ' + error.message)
    } finally {
      uploading = false
    }
  }
  const download = async () => {
    try {
      const { data, error } = await supabase.storage.from('evidence').download(path)
      if (error) throw error
      url = URL.createObjectURL(data)
    } catch (error) {
      ToastServices.addToast('error', 'Error downloading image', error.message)
    }
  }

</script>

<div class="{tailwind}">
  <label class="block mb-2 text-sm font-medium text-grey-900">{label}</label>
  <div>
    {#if path && !uploading}
      <a href="{url}" use:download target="_blank">
        <img src="{url}" alt="" class="block w-full mb-2" />
      </a>
    {/if}
    {#if !readonly}  
    <label class="w-full inline-flex justify-center rounded-md px-4 py-2 bg-blue-600 text-base font-medium text-white sm:w-auto sm:text-sm">
      {uploading ? 'Uploading ...' : (path ? 'Replace image' : buttonText) }
      <input style="visibility: hidden; position:absolute;" type="file" bind:files on:change="{upload}" disabled="{uploading}" accept="image/*" />
    </label>
    {/if}
  </div>
</div>