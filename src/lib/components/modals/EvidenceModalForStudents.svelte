<script lang="ts">

  import { onMount } from 'svelte'
  
  import { currentUser, currentCourse } from '$lib/stores/writables'
  import { Logging } from '$lib/stores/log-store'
  console.log($currentCourse)
  import Button from '$lib/components/forms/Button.svelte'
  import ImageField from '$lib/components/forms/ImageField.svelte'
  import PDFField from '$lib/components/forms/PDFField.svelte'
  import TextArea from '$lib/components/forms/TextArea.svelte'
  import Spinner from '$lib/components/svgs/Spinner.svelte'
  import Toast from '../notifications/Toast.svelte'
  
  let ready: boolean = false
  export let params: { visible: boolean, lessonIndex: number | null, lessonTitle: string | null, lessonNumber: number | null, existingEvidenceId: string | null } 
  let values = {
    student_id: null,
    school_id: null,
    course: null,
    lesson_number: params.lessonNumber,
    status: 0, 
    student_dish_images: [], 
    student_evaluation: null,
    student_timeplan: null,
    teacher_score: 0,
    teacher_feedback: null,
    teacher_absent: false,
    teacher_locked: false
  }
  
  onMount(async () => {

    if (params.existingEvidenceId) {
      // Fetch the data for this lesson again, just in case it has been updated elsewhere.
      const response = await fetch('/api/evidence/get', { method : 'POST', body : JSON.stringify( { values: { id: params.existingEvidenceId, student_id: $currentUser.uuid } }) } )
      const { data } = await response.json() // returns an array containing a single evidence object    
      const evidenceIndex = $currentUser.data.evidence.findIndex( ev => ev.lesson_number == params.lessonNumber)
      $currentUser.data.evidence[evidenceIndex] = data[0] // Update it in the store, not just in this modal.
      values = data[0]
    }
    values.lesson_number = params.lessonNumber
    values.student_id = $currentUser.uuid
    ready = true
  })

  const saveEvidence = async () => {

    // If it's an existing evidence, update it.
    if (params.existingEvidenceId) {
      const response = await fetch('/api/evidence/update', { method : 'POST', body : JSON.stringify( { values }) } )
      const { data } = await response.json()
      const evidenceIndex = $currentUser.data.evidence.findIndex( ev => ev.lesson_number == params.lessonNumber)
      $currentUser.data.evidence[evidenceIndex] = data[0] // Update it in the store, not just in this modal.

    // Otherwise create a new one
    } else {
      const response = await fetch('/api/evidence/create', { method : 'POST', body : JSON.stringify( { values }) } )
      const { data } = await response.json()
      // Rather than just pushing to the store directly, we need to reassign for the reactivity to work.
      $currentUser.data.evidence = [...$currentUser.data.evidence, data[0]]
    }
    
    // Reset and close the modal
    params.visible = false
    params.lessonIndex = null
    params.lessonTitle = null
    params.lessonNumber = null
    params.existingEvidenceId = null

  }

</script>

{#if params.visible}
<div class="relative z-40" aria-labelledby="modal-title" role="dialog" aria-modal="true">
  <div class="fixed inset-0 bg-black bg-opacity-75 transition-opacity"></div>

  <div class="fixed flex items-center justify-center z-10 inset-0 overflow-y-auto">
    <div class="flex items-end sm:items-center justify-center p-4 text-center sm:p-0 w-full">


      
      {#if !ready}
        <Spinner />
      {:else}
        <div class="relative bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all  w-full max-w-4xl  ">

          <div class="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
            <button on:click="{ () => { params.visible = false } }" type="button" class="bg-white rounded-md text-grey-900">
              <span class="sr-only">Close</span>
              <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>


        
          <div class="mt-3 text-center sm:mt-0 sm:mx-4 sm:text-left">
            <h3 class="text-lg leading-6 font-medium {values.teacher_absent ? 'text-red-600' : 'text-grey-900'} mb-4 pb-2 border-b-2 border-b-grey-300" id="modal-title">{params.lessonTitle}</h3>         

            
            {#if !values.teacher_absent}

              {#if !values.teacher_locked}
                <TextArea bind:value="{values.student_evaluation}" label="Student evaluation" required="{true}" placeholder="Evaluate your lesson here" tailwind="mb-4 " />
              {:else}                  
                <h4 class="font-medium text-grey-900 text-sm">Student evaluation</h4>
                <p class="mb-8 font-normal text-grey-900 text-sm">{values.student_evaluation ?? 'Not provided...'}</p>
              {/if}

              <div class="grid grid-cols-3 gap-x-8 gap-y-4">
                <div class="col-span-2 grid grid-cols-2 gap-x-8 gap-y-4 mb-6 ">
                  <p class="col-span-2 text-sm font-medium text-grey-900">Add up to 2 images showcasing your dish
                  <span class="block text-left text-xs font-normal">* Accepted files include PNG, JPG, JPEG, GIF</span></p>
                  <ImageField bind:path="{values.student_dish_images[0]}" label="Dish image 1" buttonText="Add image" tailwind="" prefix="dish" readonly="{values.teacher_locked}" />
                  <ImageField bind:path="{values.student_dish_images[1]}" label="Dish image 2" buttonText="Add image" tailwind="" prefix="dish" readonly="{values.teacher_locked}" />
                </div>
                {#if $currentCourse == 'L3CERT'}
                <div class="mb-4 ">
                  <p class="mb-4 text-sm font-medium text-grey-900">Upload a PDF for your timeplan
                    <span class="block text-left text-xs font-normal">* Accepted files include PDF only</span></p>
                  <PDFField bind:path="{values.student_timeplan}" label="Timeplan" buttonText="Upload timeplan" tailwind="w-50" prefix="timeplan" readonly="{values.teacher_locked}" />
                </div>
                {/if}
              </div>

              <div class="grid grid-cols-3 gap-x-8 gap-y-4">
                <div>
                  <h4 class="font-medium text-grey-900 text-sm">Teacher score</h4>
                  <p class="mb-4 font-normal text-grey-900 text-sm">
                    {#if values.teacher_score}{values.teacher_score} out of 10{:else}Not provided{/if}
                  </p> 
                </div>
                <div class="col-span-2">
                  <h4 class="font-medium text-grey-900 text-sm">Teacher feedback</h4>
                  <p class="mb-4 font-normal text-grey-900 text-sm">
                    {#if values.teacher_feedback}{@html values.teacher_feedback}
                    {:else}Not provided{/if}
                  </p>
                </div>
              </div>

            {:else}
              <p class="text-red-600 font-medium">Your teacher has marked you as absent for this lesson.</p>
              <p class="text-red-600 text-sm">Please speak with them if you have any concerns.</p>
            {/if}

            <div class="pt-4 sm:flex sm:flex-row-reverse">
              {#if !values.teacher_locked}<Button on:press="{ () => { saveEvidence(), Logging.postLog('student', 'evidence', 'pressed Submit Evidence button for lesson ' + params.lessonNumber, $currentUser.uuid) } }" text="Save changes" tailwind="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white  sm:ml-3 sm:w-auto sm:text-sm" />{/if}
              <Button on:press="{ () => { params.visible = false } }" text="{values.teacher_locked ? 'Close' : 'Cancel'}" tailwind="mt-3 w-full inline-flex justify-center rounded-md border border-blue-600 shadow-sm px-4 py-2 bg-white text-base font-medium text-blue-600  sm:mt-0 sm:w-auto sm:text-sm" />
            </div>

          </div>

      </div>
      {/if}
    </div>
  </div>
</div>
{/if}
