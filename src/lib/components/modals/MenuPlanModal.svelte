<script>
  
  import { currentUser } from '$lib/stores/writables'
  import { RegisterServices } from '$lib/stores/registers-store'
  export let index

  import Button from '$lib/components/forms/Button.svelte'
  import TextArea from '$lib/components/forms/TextArea.svelte'
  import TextField from '$lib/components/forms/TextField.svelte'
  import ImageField from '$lib/components/forms/ImageField.svelte'

  // We have a two way binding issue if we assign this like because it assigns a refernce to the original
  // rather than copying it if we use:
  // `menus = $currentUser.data.menus`
  // So we map it out like this:
  let menus = $currentUser.data.menus.map(menu => ({...menu}))

  const saveMenu = async () => {
    $currentUser.data.menus = menus
    menus[index].costingQuality = costings
    let response = await RegisterServices.saveMenus($currentUser.uuid, menus)
    if (response.success) {
      $currentUser.data.menus = menus
      index = null    
    }
  }
  
  let costings = menus[index].costingQuality
  const addRow = () => {
    costings = [...costings, {
      ingredient: null,
      quality: null,
      recipeAmount: null,
      purchasedAmount: null,
      purchasePrice: null,
      recipeCost: null
    }]
  }
  let empty = '1)\n2)\n3)\n4)\n5)\n'

</script>

{#if typeof index == 'number'}
<div class="relative z-40" aria-labelledby="modal-title" role="dialog" aria-modal="true">
  <div class="fixed inset-0 bg-grey bg-opacity-75 transition-opacity"></div>

  <div class="fixed z-10 inset-0 overflow-y-auto">
    <div class="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
      <div class="relative bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all md:w-4/6 ">

        <div class="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
          <button on:click="{ () => { index = !index } }" type="button" class="bg-white rounded-md text-grey-900">
            <span class="sr-only">Close</span>
            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="mt-3 text-center sm:mt-0 sm:mx-4 sm:text-left">
          <h3 class="text-lg leading-6 font-medium text-grey-900 mb-4 pb-2 border-b-2 border-b-grey-300" id="modal-title">Menu plans</h3>
          <div class="grid grid-cols-3 gap-8 mb-4 ">
            <div class="col-span-2">
  
              <TextArea bind:value="{menus[index].scene}" label="Setting the scene" required="{true}" placeholder="" tailwind="mb-4 mb-4" />

              <div class="mb-4">
                <label class="block text-sm font-medium text-grey-900 mb-1">5 factors to take into account when planning the menu</label>
                <textarea bind:value="{menus[index].factors}" class="appearance-none block w-full px-3 py-2 border border-grey-500 rounded-md shadow-sm bg-white sm:text-sm h-32" placeholder="{empty}"></textarea>
              </div>

              <TextArea bind:value="{menus[index].design}" label="Reasons for choice" required="{true}" placeholder="" tailwind="mb-4 mb-4" />

            </div>
            <div class="col-span-1">
              <p class="text-sm font-medium text-grey-900 mb-2">Add up to 4 images showcasing your menu
                <span class="block text-left text-xs font-normal">* Accepted files include PNG, JPG, JPEG, GIF and PDF.</span></p>
              <div class="grid grid-cols-2 gap-8 mb-4">
                <div class="col-span-1">
                  <ImageField bind:path="{menus[index].menu[0]}" label="" buttonText="Image 1" tailwind="" prefix="group" />
                </div>
                <div class="col-span-1">
                  <ImageField bind:path="{menus[index].menu[1]}" label="" buttonText="Image 2" tailwind="" prefix="group" />
                </div>
                <div class="col-span-1">
                  <ImageField bind:path="{menus[index].menu[2]}" label="" buttonText="Image 3" tailwind="" prefix="group" />
                </div>
                <div class="col-span-1">
                  <ImageField bind:path="{menus[index].menu[3]}" label="" buttonText="Image 4" tailwind="" prefix="group" />
                </div>
                </div>
            </div>
          </div>

          <div>
            <div class="mb-2 p-4 overflow-hidden shadow ring-1 ring-grey ring-opacity-5 md:rounded-lg">
              <table class="min-w-full">
                <thead class="bg-white">
                  <tr>
                    <th scope="col" class="w-3/12 pr-3 text-left text-xs font-semibold text-grey-900">Ingredient</th>
                    <th scope="col" class="w-2/6 px-3 text-left text-xs font-semibold text-grey-900">Description of quality</th>
                    <th scope="col" class="px-3 text-left text-xs font-semibold text-grey-900">Amount in recipe</th>
                    <th scope="col" class="px-3 text-left text-xs font-semibold text-grey-900">Amount purchased</th>
                    <th scope="col" class="px-3 text-left text-xs font-semibold text-grey-900">Purchase price (£)</th>
                    <th scope="col" class="pl-3 text-left text-xs font-semibold text-grey-900">Cost in recipe (£)</th>
                  </tr>
                </thead>
                <tbody class=" bg-white">
                  {#each costings as row}
                    <tr>
                      <td class="whitespace-nowrap py-1 pr-3 font-medium text-grey-900 align-top">
                        <TextField bind:value="{row.ingredient}" label="{false}" placeholder="e.g. salted butter" tailwind="text-xs" />
                      </td>
                      <td class="whitespace-nowrap py-1 px-3 text-grey-900 align-top">
                        <TextField bind:value="{row.quality}" label="{false}" placeholder="" tailwind="text-xs" />
                      </td>
                      <td class="whitespace-nowrap py-1 px-3 text-sm text-grey-900 align-top">
                        <TextField bind:value="{row.recipeAmount}" label="{false}" placeholder="" tailwind="text-xs" />
                      </td>
                      <td class="whitespace-nowrap py-1 px-3 text-sm text-grey-900 align-top">
                        <TextField bind:value="{row.purchasedAmount}" label="{false}" placeholder="" tailwind="text-xs" />
                      </td>
                      <td class="whitespace-nowrap py-1 px-3 text-sm text-grey-900 align-top">
                        <TextField bind:value="{row.purchasePrice}" label="{false}" placeholder="" tailwind="text-xs" />
                      </td>
                      <td class="whitespace-nowrap py-1 pl-3 text-sm text-grey-900 align-top">
                        <TextField bind:value="{row.recipeCost}" label="{false}" placeholder="" tailwind="text-xs" />                        
                      </td>
                    </tr>
                  {/each}
                </tbody>
              </table>
              <Button on:press="{ () => { addRow() } }" text="Add item" tailwind="w-full inline-flex justify-center rounded-md px-4 py-2 mt-2 bg-grey-500  text-base font-medium text-white sm:w-auto sm:text-sm" />
            </div>
          </div>

          <div class="mt-5 pt-4 sm:flex sm:flex-row-reverse">
            <Button on:press="{ () => { saveMenu() } }" text="Save menu" tailwind="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white  sm:ml-3 sm:w-auto sm:text-sm" />
            <Button on:press="{ () => { index = !index } }" text="Cancel" tailwind="mt-3 w-full inline-flex justify-center rounded-md border border-blue-500 shadow-sm px-4 py-2 bg-white text-base font-medium text-blue-600  sm:mt-0 sm:w-auto sm:text-sm" />
          </div>

        </div>

      </div>
    </div>
  </div>
</div>
{/if}
