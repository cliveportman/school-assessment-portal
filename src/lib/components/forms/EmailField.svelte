<script>

  export let value = '', label, tailwind, placeholder = '', required = false

</script>

<div class="{tailwind}">
  <label class="block text-sm font-medium text-grey-900">{label}</label>
  <div class="mt-1">
    <input type="email" bind:value="{value}" class="appearance-none block w-full px-3 py-2 border border-grey-500 rounded-md shadow-sm bg-white sm:text-sm" placeholder="{placeholder}" />
  </div>
</div>