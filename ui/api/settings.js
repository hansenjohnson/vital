const save = async (settings) => {
  try {
    const response = await fetch('http://localhost:5000/settings', {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(settings),
    })
    return response.ok
  } catch (error) {
    console.error('Error saving settings:', error?.message || error)
  }
}

const get = async (key) => {
  try {
    const response = await fetch(`http://localhost:5000/settings/${key}`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error getting settings:', error?.message || error)
    return null
  }
}

const getList = async (listOfKeys) => {
  return Promise.all(listOfKeys.map((key) => get(key)))
}

export default {
  save,
  getList,
}
