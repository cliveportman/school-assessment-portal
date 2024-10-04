<script lang="ts">

  export let value:number = '', min: number = 0, max: number = 100, label: string, tailwind: string = '', placeholder: string = '', required: boolean = false

</script>

<div class="{tailwind}">
  <label class="block text-sm font-medium text-grey-900 {label == false ? 'hidden' : ''}">{label}</label>
  <div class="mt-1">
    <input type="number" min="{min}" max="{max}" bind:value="{value}" class="appearance-none block w-full px-3 py-2 border border-grey-500 rounded-md shadow-sm bg-white sm:text-sm" placeholder="{placeholder}" step="1" />
  </div>
</div>