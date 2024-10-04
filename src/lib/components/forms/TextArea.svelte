<script>

  export let value = '', label, tailwind, placeholder = '', required = false, emptyValue = null
  if (value == '' && emptyValue) value = '1)\n2)\n3)\n4)\n5)\n'

</script>

<div class="{tailwind}">
  <label class="block text-sm font-medium text-grey-900 mb-1">{label}</label>
  <textarea bind:value="{value}" class="appearance-none block w-full px-3 py-2 border border-grey-500 rounded-md shadow-sm bg-white sm:text-sm" placeholder="{placeholder}"></textarea>
</div>