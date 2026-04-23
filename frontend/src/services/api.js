/**
 * API Service - Production Ready
 * Handles:
 * - Dynamic base URL
 * - Retry (Render cold start safe)
 * - Timeout handling
 * - Error normalization
 */

import axios from "axios"

// ── Base URL (ENV FIRST, fallback safe) ───────────────────────
const BASE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") ||
  "https://agri-backend.onrender.com"

// ── Axios Instance ────────────────────────────────────────────
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000, // increased for Render cold start
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
})

// ── Retry Logic (important for Render cold start) ─────────────
const MAX_RETRIES = 3
const RETRY_DELAY = 1500

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const retryRequest = async (error) => {
  const config = error.config || {}

  config._retryCount = config._retryCount || 0

  // retry only on network / server errors
  if (
    config._retryCount >= MAX_RETRIES ||
    (error.response && error.response.status < 500)
  ) {
    return Promise.reject(error)
  }

  config._retryCount += 1

  const delay = RETRY_DELAY * Math.pow(2, config._retryCount - 1)
  await sleep(delay)

  return api(config)
}

// ── Request Interceptor ───────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    config.metadata = { startTime: new Date() }

    // optional: attach auth token later if needed
    // config.headers.Authorization = `Bearer ${token}`

    return config
  },
  (error) => Promise.reject(error)
)

// ── Response Interceptor ──────────────────────────────────────
api.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      const duration =
        new Date() - response.config.metadata?.startTime
      console.debug(
        `[API] ${response.config.method?.toUpperCase()} ${
          response.config.url
        } — ${duration}ms`
      )
    }

    return response
  },
  async (error) => {
    // retry on server / network errors
    if (!error.response || error.response.status >= 500) {
      return retryRequest(error)
    }

    // normalize error for UI
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Something went wrong"

    return Promise.reject({
      status: error.response?.status,
      message,
    })
  }
)

// ── API METHODS ───────────────────────────────────────────────

export const analyzeField = async (payload) => {
  const res = await api.post("/api/analyze", payload)
  return res.data
}

export const getWeather = async (lat, lon) => {
  const res = await api.get("/api/weather", {
    params: { lat, lon },
  })
  return res.data
}

export const getHistory = async (params = {}) => {
  const res = await api.get("/api/history", { params })
  return res.data
}

export const getStats = async () => {
  const res = await api.get("/api/history/stats")
  return res.data
}

export const deleteAnalysis = async (id) => {
  const res = await api.delete(`/api/history/${id}`)
  return res.data
}

export const healthCheck = async () => {
  const res = await api.get("/health")
  return res.data
}

export default api