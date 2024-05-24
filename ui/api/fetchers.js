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

export const putJson = async (url) => {
    try {
        const response = await fetch(url, {
          method: 'PUT',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify(data),
        })
        return response.ok
    } catch (error) {
        console.error(`Error with PUT to ${url}:`, error?.message || error)
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
    if (!response.ok) {
      console.warn(`Issue with POST to ${url}`)
    }
    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.error(`Error with POST to ${url}:`, error?.message || error)
    return null
  }
}

export const postBlob = async (url, blob) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: blob,
    })
    return response.ok
  } catch (error) {
    console.error(`Error with POST to ${url}:`, error?.message || error)
    return false
  }
}
