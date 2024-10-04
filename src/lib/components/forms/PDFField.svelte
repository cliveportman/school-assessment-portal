<script lang="ts">

  import { supabaseClient as supabase } from '$lib/db'
  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()
  import { ToastServices } from '$lib/stores/toasts-store'
  import { Logging } from '$lib/stores/log-store'

  export let label, buttonText, tailwind, prefix = '', path, readonly: boolean = false
  let uploading, files, url, message

  const upload = async () => {

    try {
      uploading = true
      if (!files || files.length === 0) {
        throw new Error('You must select a PDF file to upload.')
      }
      const file = files[0]
      const extension = file.name.split('.').pop()
      const fileName = `${prefix}-${Math.random()}.${extension}`
      const filePath = `${fileName}`
      Logging.postLog('', 'evidence', 'PDF presented for upload: ' + filePath)
      if (extension != 'pdf' && extension != 'PDF') {
        throw new Error('Uploaded files must be a PDF (.pdf or .PDF)')
        uploading = false
        return
      }

      let { data, error } = await supabase.storage.from('evidence').upload(filePath, file)
      if (data) path = filePath
      if (error) throw error 
      Logging.postLog('', 'evidence', 'successful PDF upload: ' + filePath)   
      dispatch('upload')
    } catch (error) {
      ToastServices.addToast('error', 'Error saving PDF', error.message)
      Logging.postLog('', 'evidence', 'failed PDF upload - ' + error.message)
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
      ToastServices.addToast('error', 'Error downloading PDF', error.message)
    }
  }

</script>

<div class="{tailwind}">
  <label class="block mb-2 text-sm font-medium text-grey-900">{label}</label>
  <div>
    {#if path && !uploading}
      
        <p class="flex justify-start items-center mb-2 text-green-600 font-medium text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 mr-1">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>          
          PDF file provided
        </p>
        <p class="text-sm mb-8">
          <a class="block text-black font-normal underline" href="{url}" use:download target="_blank">Click here to view.</a>
        </p>
        
    {/if}
    {#if !readonly}
      <label class="w-full inline-flex justify-center rounded-md px-4 py-2 bg-blue-600 text-base font-medium text-white sm:w-auto sm:text-sm">
        {uploading ? 'Uploading ...' : (path ? 'Replace file' : buttonText) }
        <input style="visibility: hidden; position:absolute;" type="file" bind:files on:change="{upload}" disabled="{uploading}" accept="application/pdf" />
      </label>
    {/if}
  </div>
</div>