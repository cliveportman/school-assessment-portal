export const Logging = {

  postLog: async (role, category, message, email = '' ) => {

    const response = await fetch('https://log-api.eu.newrelic.com/log/v1', {
      method: 'POST',
      body: JSON.stringify({
        role: role,
        logtype: category,
        message: message,
        email: email,
      }),
      headers: {
        "content-type": "application/json",
        "Api-Key": 'eu01xxce489d97d12582667668d009079c87NRAL'
      }
    })
    
    return
    
  }

}