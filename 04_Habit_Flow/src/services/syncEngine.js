import {
  saveHabitAPI,
  updateHabitAPI,
  deleteHabitAPI,
  saveHistoryRecordAPI,
  syncAllToMongoDBAPI,
  checkServerHealth,
} from './api'

const QUEUE_STORAGE_KEY = 'habitflow_offline_queue'
let syncStatusListeners = []
let isFlushing = false

export const getOfflineQueue = () => {
  try {
    const raw = localStorage.getItem(QUEUE_STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export const saveOfflineQueue = (queue) => {
  try {
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue))
    notifySyncListeners()
  } catch {
    // ignore
  }
}

export const addToOfflineQueue = (mutation) => {
  const queue = getOfflineQueue()
  const item = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: new Date().toISOString(),
    ...mutation,
  }
  queue.push(item)
  saveOfflineQueue(queue)
  return item
}

export const clearOfflineQueue = () => {
  try {
    localStorage.removeItem(QUEUE_STORAGE_KEY)
    notifySyncListeners()
  } catch {
    // ignore
  }
}

export const subscribeSyncStatus = (callback) => {
  syncStatusListeners.push(callback)
  // Call immediately with current state
  callback(getSyncStatus())
  return () => {
    syncStatusListeners = syncStatusListeners.filter((cb) => cb !== callback)
  }
}

export const getSyncStatus = () => {
  const queue = getOfflineQueue()
  const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true
  return {
    isOnline,
    isFlushing,
    pendingCount: queue.length,
    hasPending: queue.length > 0,
  }
}

const notifySyncListeners = () => {
  const status = getSyncStatus()
  syncStatusListeners.forEach((cb) => {
    try {
      cb(status)
    } catch {
      // ignore
    }
  })
}

// Flush all offline actions to MongoDB when back online
export const flushOfflineQueue = async (storeState) => {
  if (isFlushing) return
  const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true
  if (!isOnline) {
    notifySyncListeners()
    return
  }

  const health = await checkServerHealth()
  if (!health.online || !health.mongo) {
    notifySyncListeners()
    return
  }

  const queue = getOfflineQueue()
  if (queue.length === 0) {
    // Queue is empty, optionally perform full reconciliation if user is logged in
    if (storeState && storeState.user?.token) {
      await syncAllToMongoDBAPI({
        habits: storeState.habits?.habits || [],
        history: storeState.habits?.history || {},
        user: storeState.user || {},
      })
    }
    notifySyncListeners()
    return
  }

  isFlushing = true
  notifySyncListeners()

  try {
    const failedItems = []

    for (const item of queue) {
      try {
        switch (item.type) {
          case 'ADD_HABIT':
            await saveHabitAPI(item.payload)
            break
          case 'UPDATE_HABIT':
            await updateHabitAPI(item.payload.id, item.payload.updates)
            break
          case 'DELETE_HABIT':
            await deleteHabitAPI(item.payload.id)
            break
          case 'SYNC_HISTORY':
            await saveHistoryRecordAPI(item.payload)
            break
          default:
            break
        }
      } catch {
        failedItems.push(item)
      }
    }

    // Save remaining failed items or clear
    saveOfflineQueue(failedItems)

    // Reconcile complete state to ensure exact consistency if user is logged in
    if (storeState && storeState.user?.token && failedItems.length === 0) {
      await syncAllToMongoDBAPI({
        habits: storeState.habits?.habits || [],
        history: storeState.habits?.history || {},
        user: storeState.user || {},
      })
    }
  } catch {
    // continue
  } finally {
    isFlushing = false
    notifySyncListeners()
  }
}

// Initialize background network monitoring
export const initSyncEngine = (getStoreState) => {
  if (typeof window === 'undefined') return

  const triggerFlush = () => {
    const state = typeof getStoreState === 'function' ? getStoreState() : null
    flushOfflineQueue(state)
  }

  window.addEventListener('online', () => {
    notifySyncListeners()
    triggerFlush()
  })

  window.addEventListener('offline', () => {
    notifySyncListeners()
  })

  window.addEventListener('focus', () => {
    triggerFlush()
  })

  // Heartbeat periodic flush every 25 seconds
  const interval = setInterval(triggerFlush, 25000)

  // Initial flush check
  setTimeout(triggerFlush, 2000)

  return () => {
    clearInterval(interval)
    window.removeEventListener('online', triggerFlush)
    window.removeEventListener('offline', notifySyncListeners)
    window.removeEventListener('focus', triggerFlush)
  }
}

