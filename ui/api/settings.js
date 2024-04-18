import { baseURL } from './config'

const save = async (settings) => {
  try {
    const response = await fetch(`${baseURL}/settings`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(settings),
    })
    return response.ok
  } catch (error) {
    console.error('Error saving settings:', error?.message || error)
    return false
  }
}

const get = async (key) => {
  try {
    const response = await fetch(`${baseURL}/settings/${key}`)
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
