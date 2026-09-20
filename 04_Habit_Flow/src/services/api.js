const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return '/api'
  }
  return 'http://localhost:5000/api'
}

export const getAuthToken = () => {
  try {
    return localStorage.getItem('habitflow_auth_token') || ''
  } catch {
    return ''
  }
}

export const setAuthToken = (token) => {
  try {
    if (token) {
      localStorage.setItem('habitflow_auth_token', token)
    } else {
      localStorage.removeItem('habitflow_auth_token')
    }
  } catch {
    // ignore
  }
}

const getHeaders = () => {
  const token = getAuthToken()
  const headers = {
    'Content-Type': 'application/json',
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}

// Health check endpoint
export const checkServerHealth = async () => {
  try {
    const res = await fetch(`${getBaseUrl()}/health`, {
      method: 'GET',
      headers: getHeaders(),
      signal: AbortSignal.timeout(3000),
    })
    if (!res.ok) return { online: false, mongo: false }
    const data = await res.json()
    return { online: true, mongo: data.mongoConnected, error: data.error, uri: data.uri }
  } catch (err) {
    return { online: false, mongo: false, error: err.message }
  }
}

// Authentication APIs
export const registerAPI = async ({ email, password, name, initialHabits = [] }) => {
  try {
    const res = await fetch(`${getBaseUrl()}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name, initialHabits }),
      signal: AbortSignal.timeout(7000),
    })
    const data = await res.json()
    if (res.ok && data.token) {
      setAuthToken(data.token)
    }
    return { ok: res.ok, status: res.status, ...data }
  } catch (err) {
    return { ok: false, error: err.message || 'Registration request failed' }
  }
}

export const loginAPI = async ({ email, password }) => {
  try {
    const res = await fetch(`${getBaseUrl()}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      signal: AbortSignal.timeout(7000),
    })
    const data = await res.json()
    if (res.ok && data.token) {
      setAuthToken(data.token)
    }
    return { ok: res.ok, status: res.status, ...data }
  } catch (err) {
    return { ok: false, error: err.message || 'Login request failed' }
  }
}

export const getMeAPI = async () => {
  try {
    const res = await fetch(`${getBaseUrl()}/auth/me`, {
      headers: getHeaders(),
      signal: AbortSignal.timeout(4000),
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export const getMongoConfigAPI = async () => {
  try {
    const res = await fetch(`${getBaseUrl()}/config/mongo`, {
      headers: getHeaders(),
      signal: AbortSignal.timeout(3000),
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export const updateMongoURIAPI = async (uri) => {
  try {
    const res = await fetch(`${getBaseUrl()}/config/mongo`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ uri }),
      signal: AbortSignal.timeout(9000),
    })
    const data = await res.json()
    return data
  } catch (err) {
    return { success: false, error: err.message }
  }
}

// Bulk sync endpoint
export const syncAllToMongoDBAPI = async ({ habits, history, user }) => {
  try {
    const res = await fetch(`${getBaseUrl()}/sync`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ habits, history, user }),
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

// Habits Endpoints
export const fetchHabitsAPI = async () => {
  try {
    const res = await fetch(`${getBaseUrl()}/habits`, {
      headers: getHeaders(),
      signal: AbortSignal.timeout(4000),
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export const saveHabitAPI = async (habit) => {
  try {
    const res = await fetch(`${getBaseUrl()}/habits`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(habit),
      signal: AbortSignal.timeout(4000),
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export const updateHabitAPI = async (id, updates) => {
  try {
    const res = await fetch(`${getBaseUrl()}/habits/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updates),
      signal: AbortSignal.timeout(4000),
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export const deleteHabitAPI = async (id) => {
  try {
    const res = await fetch(`${getBaseUrl()}/habits/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
      signal: AbortSignal.timeout(4000),
    })
    return res.ok
  } catch {
    return false
  }
}

// History Endpoints
export const fetchHistoryAPI = async () => {
  try {
    const res = await fetch(`${getBaseUrl()}/history`, {
      headers: getHeaders(),
      signal: AbortSignal.timeout(4000),
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export const saveHistoryRecordAPI = async (record) => {
  try {
    const res = await fetch(`${getBaseUrl()}/history`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(record),
      signal: AbortSignal.timeout(4000),
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}
