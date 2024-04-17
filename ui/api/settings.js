const save = async (settings) => {
  try {
    const response = await fetch('http://localhost:5000/settings', {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(settings),
    })
    const data = await response.json()
    console.log(data)
  } catch (error) {
    console.error('Error saving settings:', error?.message || error)
  }
}

export default {
  save,
}
