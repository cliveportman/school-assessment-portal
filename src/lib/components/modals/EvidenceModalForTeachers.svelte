<script lang="ts">

  import { onMount } from 'svelte'
  
  import { students, currentRegister } from '$lib/stores/writables'
  import { Logging } from '$lib/stores/log-store'

  import Button from '$lib/components/forms/Button.svelte'
  import ImageField from '$lib/components/forms/ImageField.svelte'
  import PDFField from '$lib/components/forms/PDFField.svelte'
  import TextArea from '$lib/components/forms/TextArea.svelte'
  import { ToastServices } from '$lib/stores/toasts-store'
  import Spinner from '$lib/components/svgs/Spinner.svelte'
  import SelectField from '$lib/components/forms/SelectField.svelte'
  
  let ready: boolean = false
  export let params: { visible: boolean, studentIndex: string | null, studentName: string | null, lessonIndex: number | null, lessonTitle: string | null, lessonNumber: number | null, existingEvidenceId: string | null } 
  let values = {
    student_id: $students[params.studentIndex].id,
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

  // Create an array [0, 0.5, 1, 1.5... 20]
  const scoreOptions = Array.from(Array(21).keys(), (value, key) => key / 2)
  
  onMount(async () => {

    if (params.existingEvidenceId) {
      // Fetch the data for this lesson again, just in case it has been updated elsewhere.
      const response = await fetch('/api/evidence/get', { method : 'POST', body : JSON.stringify( { values: { id: params.existingEvidenceId, student_id: $students[params.studentIndex].id } }) } )
      const { data } = await response.json() // returns an array containing a single evidence object
      const evidenceIndex = $students[params.studentIndex].evidence.findIndex( ev => ev.lesson_number == params.lessonNumber)
      if (evidenceIndex == -1) $students[params.studentIndex].evidence.push(data[0])
      else $students[params.studentIndex].evidence[evidenceIndex] = data[0] // Update it in the store, not just in this modal.
      values = data[0]
    }
    ready = true
  })
  
  enum Action {
    Unlocked = 1,
    Locked = 2,
    Absent = 3,
  }

  const saveEvidence = async (action: Action) => {

    if (action == Action.Locked || action == Action.Absent) values.teacher_locked = true
    else values.teacher_locked = false // allow teachers to unlock
    if (action == Action.Absent) values.teacher_absent = true

    // If it's an existing evidence, update it.
    if (params.existingEvidenceId) {
      const response = await fetch('/api/evidence/update', { method : 'POST', body : JSON.stringify( { values }) } )
      const { data } = await response.json()
      const evidenceIndex = $students[params.studentIndex].evidence.findIndex( ev => ev.lesson_number == params.lessonNumber)
      $students[params.studentIndex].evidence[evidenceIndex] = data[0] // Update it in the store, not just in this modal.

    // Otherwise create a new one
    } else {
      const response = await fetch('/api/evidence/create', { method : 'POST', body : JSON.stringify( { values }) } )
      const { data } = await response.json()
      // Rather than just pushing to the store directly, we need to reassign for the reactivity to work.
      $students[params.studentIndex].evidence = [...$students[params.studentIndex].evidence, data[0]]
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
        <div class="relative bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all w-full max-w-4xl ">

          <div class="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
            <button on:click="{ () => { params.visible = false } }" type="button" class="bg-white rounded-md text-grey-900">
              <span class="sr-only">Close</span>
              <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

        
          <div class="mt-3 text-center sm:mt-0 sm:mx-4 sm:text-left">
            <h3 class="text-lg leading-6 font-medium text-grey-900 mb-4 pb-2 border-b-2 border-b-grey-300" id="modal-title">{params.studentName} / {params.lessonTitle}</h3>         
            <h4 class="font-medium text-grey-900 text-sm">Student evaluation</h4>
            <p class="mb-8 font-normal text-grey-900 text-sm">{values.student_evaluation ?? 'Not provided...'}</p>

            <div class="grid grid-cols-3 gap-x-8 mb-8">
              <div class="col-span-2 grid grid-cols-2 gap-x-8 gap-y-4 ">
                <p class="col-span-2 text-sm font-medium text-grey-900">Provide up to 2 images of the dish
                <span class="block text-left text-xs font-normal">* Accepted files include PNG, JPG, JPEG, GIF</span></p>
                <ImageField bind:path="{values.student_dish_images[0]}" label="Dish image 1" buttonText="Add image" tailwind="" prefix="dish" />
                <ImageField bind:path="{values.student_dish_images[1]}" label="Dish image 2" buttonText="Add image" tailwind="" prefix="dish" />
              </div>
              {#if $currentRegister.course == 'L3CERT'}
              <div class="">
                <p class="mb-4 text-sm font-medium text-grey-900">PDF timeplan
                  <span class="block text-left text-xs font-normal">* Accepted files include PDF only</span></p>
                <PDFField bind:path="{values.student_timeplan}" label="Timeplan" buttonText="Upload Timeplan" tailwind="w-50" prefix="timeplan" />
              </div>
              {/if}
            </div>

            <div class="grid grid-cols-3 gap-x-8 gap-y-4">
              <div>
                <SelectField bind:value="{values.teacher_score}" label="Teacher score" options="{scoreOptions}" tailwind="w-1/2" /> 
              </div>
              <div class="col-span-2">                
                <!-- Feedback (teacher) -->
                <TextArea bind:value="{values.teacher_feedback}" label="Teacher feedback" required="{true}" placeholder="Complete after the student has added their own evaluation and images" tailwind="mb-4 mb-4" />
              </div>
            </div>

            <div class="pt-4 flex justify-between">
              <Button on:press="{ () => { params.visible = false } }" text="Cancel" tailwind="mt-3 w-full inline-flex justify-center rounded-md border border-blue-600 shadow-sm px-4 py-2 bg-white text-base font-medium text-blue-600  sm:mt-0 sm:w-auto sm:text-sm" />
              <div>
                <button on:click="{ () => { saveEvidence(Action.Absent), Logging.postLog('student', 'evidence', 'pressed Submit Evidence button for lesson ' + params.lessonNumber) } }"  class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white  sm:ml-3 sm:w-auto sm:text-sm">                
                  <div class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 mr-1">
                      <path fill-rule="evenodd" d="M5.965 4.904l9.131 9.131a6.5 6.5 0 00-9.131-9.131zm8.07 10.192L4.904 5.965a6.5 6.5 0 009.131 9.131zM4.343 4.343a8 8 0 1111.314 11.314A8 8 0 014.343 4.343z" clip-rule="evenodd" />
                    </svg>
                    Mark absent</div>              
                </button>
                <button on:click="{ () => { saveEvidence(Action.Locked), Logging.postLog('student', 'evidence', 'pressed Submit Evidence button for lesson ' + params.lessonNumber) } }"  class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 {!(values.teacher_feedback && values.teacher_score && values.student_dish_images.length && values.student_evaluation && ($currentRegister.course != 'L3CERT' || values.student_timeplan)) ? 'opacity-30' : ''} text-base font-medium text-white  sm:ml-3 sm:w-auto sm:text-sm" disabled="{!(values.teacher_feedback && values.teacher_score && values.student_dish_images.length && values.student_evaluation && ($currentRegister.course != 'L3CERT' || values.student_timeplan)) ? true : false}">                
                  <div class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 mr-1">
                      <path fill-rule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clip-rule="evenodd" />
                    </svg>
                    Save & lock</div>              
                </button>
                <button on:click="{ () => { saveEvidence(Action.Unlocked), Logging.postLog('student', 'evidence', 'pressed Submit Evidence button for lesson ' + params.lessonNumber) } }"  class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white  sm:ml-3 sm:w-auto sm:text-sm">                
                  <div class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 mr-1">
                      <path fill-rule="evenodd" d="M14.5 1A4.5 4.5 0 0010 5.5V9H3a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-1.5V5.5a3 3 0 116 0v2.75a.75.75 0 001.5 0V5.5A4.5 4.5 0 0014.5 1z" clip-rule="evenodd" />
                    </svg>
                    
                    Save changes
                  (unlocked)</div>              
                </button>
              </div>
            </div>
            <p class="py-2 text-right text-xs">*Locking prevents students from making further changes.</p>

          </div>

      </div>
      {/if}
    </div>
  </div>
</div>
{/if}
