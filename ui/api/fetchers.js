export const getJSON = async (url) => {
  try {
    const response = await fetch(url)
    const data = await response.json()
    return data
  } catch (error) {
    console.error(`Error with GET to ${url}:`, error?.message || error)
    return null
  }
}

export const postJSON = async (url, data) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(data),
    })
    return response.ok
  } catch (error) {
    console.error(`Error with POST to ${url}:`, error?.message || error)
    return false
  }
}

export const postJSONWithResponse = async (url, data) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(data),
    })
    const responseData = await response.json()
    return { ok: response.ok, data: responseData }
  } catch (error) {
    console.error(`Error with POST to ${url}:`, error?.message || error)
    return { ok: false, data: null }
  }
}
