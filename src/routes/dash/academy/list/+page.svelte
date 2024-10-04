<script lang="ts">

import { page } from '$app/stores'
//const students = $page.data.response.data
console.log($page.data)

const updateEvidence = async () => {

    
    const response = await fetch('/api/evidence/update',
      {
        method : 'POST',
        body : JSON.stringify(
          { values: {} }
        )
      }
    )
    const result = await response.json()
    console.log('result', result)
    if (result.success) {
      //await DashboardServices.getAcademyUsers()
      return { success: true}
    } else {
      return { error: true }
    }
}

</script>

<button on:click="{ () => { updateEvidence() } }">Update</button>