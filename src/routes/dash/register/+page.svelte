<script lang="ts">

  import { currentUser } from '$lib/stores/writables'
  
  import { goto } from '$app/navigation'
    if ($currentUser.role == 'student') goto('/dash/student')
    else if ($currentUser.role == 'school_teacher') goto('/dash/school')
    else if ($currentUser.role == 'visiting_teacher') goto('/dash/visiting')
    else if ($currentUser.role == 'academy') goto('/dash/academy')
    else if ($currentUser.role == 'admin') goto('/dash/academy')

</script>

<svelte:head>
	<title>Nothing to see here</title>
</svelte:head>