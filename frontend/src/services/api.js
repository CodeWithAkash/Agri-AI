/**
 * API Service - Axios instance with retry logic, interceptors, error handling
 */

import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// ── Axios Instance ────────────────────────────────────────────
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// ── Retry Logic ───────────────────────────────────────────────
const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // ms

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const retryRequest = async (error) => {
  const config = error.config
  config._retryCount = config._retryCount || 0

  if (
    config._retryCount >= MAX_RETRIES ||
    !error.response ||
    error.response.status < 500
  ) {
    return Promise.reject(error)
  }

  config._retryCount += 1
  const delay = RETRY_DELAY * Math.pow(2, config._retryCount - 1) // exponential back-off
  await sleep(delay)
  return api(config)
}

// ── Request Interceptor ───────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    // Add request timestamp for debugging
    config.metadata = { startTime: new Date() }
    return config
  },
  (error) => Promise.reject(error)
)

// ── Response Interceptor ──────────────────────────────────────
api.interceptors.response.use(
  (response) => {
    // Log response time in dev
    if (import.meta.env.DEV) {
      const duration = new Date() - response.config.metadata?.startTime
      console.debug(`[API] ${response.config.method?.toUpperCase()} ${response.config.url} — ${duration}ms`)
    }
    return response
  },
  async (error) => {
    // Retry on server errors
    if (error.response?.status >= 500) {
      return retryRequest(error)
    }
    return Promise.reject(error)
  }
)

// ── API Methods ───────────────────────────────────────────────

/**
 * Run full agricultural analysis for a field
 * @param {Object} payload - { crop, area, unit, latitude, longitude }
 */
export const analyzeField = async (payload) => {
  const response = await api.post('/api/analyze', payload)
  return response.data
}

/**
 * Fetch weather data for coordinates
 * @param {number} lat
 * @param {number} lon
 */
export const getWeather = async (lat, lon) => {
  const response = await api.get('/api/weather', { params: { lat, lon } })
  return response.data
}

/**
 * Get historical analyses with pagination
 * @param {Object} params - { page, limit, crop }
 */
export const getHistory = async (params = {}) => {
  const response = await api.get('/api/history', { params })
  return response.data
}

/**
 * Get aggregated stats for analytics dashboard
 */
export const getStats = async () => {
  const response = await api.get('/api/history/stats')
  return response.data
}

/**
 * Delete an analysis by ID
 * @param {string} id
 */
export const deleteAnalysis = async (id) => {
  const response = await api.delete(`/api/history/${id}`)
  return response.data
}

/**
 * Health check
 */
export const healthCheck = async () => {
  const response = await api.get('/health')
  return response.data
}

export default api
