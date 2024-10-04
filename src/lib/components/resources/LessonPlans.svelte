<script lang="ts">

  import { currentUser, currentCourse } from '$lib/stores/writables'
  import { CourseServices } from '$lib/stores/courses-store'
  import { fade } from 'svelte/transition'

  let lessonsVisible: [] = [], visibleIndex: Number | null = null, lessonsArray: [] = [], ready: boolean = false
  
  let courseTitles = { L3CERT: 'Level 3 Certificate', L2CERT: 'Level 2 Certificate', ICC3: 'ICC (3-term)', ICC4: 'ICC (4-term)', ICC5: 'ICC (5-term)'}

  const listLessons = async () => {
    lessonsArray = await CourseServices.getLessons($currentCourse)
    ready = true

  }
  $: if ($currentCourse) listLessons()

  import Button from '$lib/components/forms/Button.svelte'

  const showLessons = index => {
    if (visibleIndex !== index) {
      lessonsVisible = lessonsArray[index].lessons
      visibleIndex = index
    } else {
      lessonsVisible = []
      visibleIndex = null
    }
  }

</script>


{#if ready} 
<div class="rounded-md p-4 bg-white drop-shadow-md mb-6">

  <h2 class="mb-3 text-base text-grey-900 text-xl font-medium">Lessons for {courseTitles[$currentCourse]}</h2>

  <div role="list" class="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
    {#each lessonsArray as lessonObject, index}
      {#if lessonObject.lessons.length}
        <Button on:press="{ () => { showLessons(index) } }" text="{lessonObject.title}" tailwind="px-4 py-3 rounded-md  text-white font-medium shadow {visibleIndex == index ? 'bg-blue-900' : 'bg-blue-600'}" />
      {/if}
    {/each}
  </div>

  {#if lessonsVisible}      
    <div class="mt-2 flex flex-col">
      <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <table class="min-w-full divide-y divide-grey-300">
            <tbody class="divide-y divide-grey-300">

              {#if lessonsVisible.length >= 0}
                {#each lessonsVisible as lesson}
                  <tr>
                    <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-grey-900 sm:pl-6 md:pl-0">
                      
                      {#if $currentUser.role != 'student'}
                        <a target="_blank" href="{lesson.file[0].url}" class="flex justify-start items-center hover:bg-blue-900 bg-blue-600 p-2 rounded text-white font-medium">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 mr-3">
                            <path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 007.5 12.174v-.224c0-.131.067-.248.172-.311a54.614 54.614 0 014.653-2.52.75.75 0 00-.65-1.352 56.129 56.129 0 00-4.78 2.589 1.858 1.858 0 00-.859 1.228 49.803 49.803 0 00-4.634-1.527.75.75 0 01-.231-1.337A60.653 60.653 0 0111.7 2.805z" />
                            <path d="M13.06 15.473a48.45 48.45 0 017.666-3.282c.134 1.414.22 2.843.255 4.285a.75.75 0 01-.46.71 47.878 47.878 0 00-8.105 4.342.75.75 0 01-.832 0 47.877 47.877 0 00-8.104-4.342.75.75 0 01-.461-.71c.035-1.442.121-2.87.255-4.286A48.4 48.4 0 016 13.18v1.27a1.5 1.5 0 00-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.661a6.729 6.729 0 00.551-1.608 1.5 1.5 0 00.14-2.67v-.645a48.549 48.549 0 013.44 1.668 2.25 2.25 0 002.12 0z" />
                            <path d="M4.462 19.462c.42-.419.753-.89 1-1.394.453.213.902.434 1.347.661a6.743 6.743 0 01-1.286 1.794.75.75 0 11-1.06-1.06z" />
                          </svg>                          
                          {lesson.title} [teacher notes]
                        </a>
                      {/if}
                      <a target="_blank" href="{lesson.fileStudent[0].url}" class="flex justify-start items-center mt-1 hover:bg-blue-900 bg-blue-400 p-2 rounded text-white font-medium">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 mr-3">
                          <path fill-rule="evenodd" d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z" clip-rule="evenodd" />
                          <path d="M5.082 14.254a8.287 8.287 0 00-1.308 5.135 9.687 9.687 0 01-1.764-.44l-.115-.04a.563.563 0 01-.373-.487l-.01-.121a3.75 3.75 0 013.57-4.047zM20.226 19.389a8.287 8.287 0 00-1.308-5.135 3.75 3.75 0 013.57 4.047l-.01.121a.563.563 0 01-.373.486l-.115.04c-.567.2-1.156.349-1.764.441z" />
                        </svg>
                        
                        {lesson.title} [student notes]</a>
                    </td>
                  </tr>
                {/each}
              {/if}

              {#if visibleIndex && !lessonsVisible.length}
                <tr>
                  <td colspan="2" class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-red-700 sm:pl-6 md:pl-0">No lesson plans added here yet</td>
                </tr>
              {/if}

            </tbody>
          </table>
        </div>
      </div>
    </div>
  {/if}

</div>
{/if}