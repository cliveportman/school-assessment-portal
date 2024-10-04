<script>


  import { currentUser, currentCourse } from '$lib/stores/writables'
  import { CourseServices } from '$lib/stores/courses-store'

  let parentCategories = [], ready, activeParent, childCategories, activeChild, resources, lessons

  let fetchParentCategories = async () => {
    let response = await CourseServices.getCategories($currentCourse, null, $currentUser.role == 'student' ? true : false)
    if (response.success) {
      parentCategories = response.data.data.categories
      ready = true
    }
  }
  
  // Needed to make the categories reactiveParent
  $: if ($currentCourse) {
    fetchParentCategories()
    childCategories = null, resources = null
  }

  const parentCategoryClick = async (category) => {

    if (activeParent == category) {
      childCategories = null, activeParent = null
      return
    }
    resources = null     
    activeParent = category
    if (category.children.length) {
      let response = await CourseServices.getCategories($currentCourse, category.id, $currentUser.role == 'student' ? true : false)
      if (response.success) {
        childCategories = response.data.data.categories
        // While the category does have children, it's possible none will be returned because they aren't valid
        // for this course, so we need to return an empty array, test for that and show 'No results'
        if (!childCategories.length) {
          resources = []
        }
      }
    } else {
      childCategories = null
      await listResources(category)
      if (!resources) resources = []
    }
  }

  const listResources = async (category) => {
    resources = null
    let response = await CourseServices.getResources($currentCourse, category.id, $currentUser.role == 'student' ? true : false)
    if (response.success) {
      resources = response.data.data.entries
    }
  }
  

  import Button from '$lib/components/forms/Button.svelte'

</script>

  {#if ready}
    
    <div class="rounded-md p-4 bg-white drop-shadow-md mb-6">

      <h2 class="mb-3 text-base text-grey-900 text-xl font-medium">Course resources</h2>

      {#if parentCategories}
      <div role="list" class="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {#each parentCategories as category}
          <Button on:press="{ () => { parentCategoryClick(category) } }" text="{category.title}" tailwind="px-4 py-3 rounded-md bg-blue-600 text-white font-medium shadow {activeParent == category ? 'bg-blue-900 text-white' : ''}" />
        {/each}
      </div>
      {/if}

      {#if childCategories?.length}
        <div role="list" class="mt-4 pt-4 border-t border-grey-200 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {#each childCategories as category}
            <Button on:press="{ () => { listResources(category), activeChild = category } }" text="{category.title}" tailwind="px-3 py-2 rounded-md  font-medium text-sm shadow {activeChild == category ? 'bg-blue-900 text-white' : 'bg-blue-600 text-base font-medium text-white'}" />
          {/each}
        </div>
      {/if}

      {#if resources}      
        <div class="mt-2 flex flex-col">
          <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <table class="min-w-full divide-y divide-grey-300">
                <tbody class="divide-y divide-grey-300">

                  {#if resources.length >= 0}
                    {#each resources as resource}
                      {#if $currentUser.role != 'student' || resource.availableToStudents}
                      <tr>
                        <td colspan="2" class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-grey-900 sm:pl-6 md:pl-0"><a target="_blank" href="{resource.file[0].url}" class="text-grey-900 font-medium underline">{resource.title}</a></td>
                      </tr>
                      {/if}
                    {/each}
                  {/if}

                  {#if resources?.length == 0}
                    <tr>
                      <td colspan="2" class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-red-700 sm:pl-6 md:pl-0">No resources in this category</td>
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