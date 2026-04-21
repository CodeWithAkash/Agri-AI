/**
 * useGeolocation - Custom hook for GPS location detection
 */

import { useState, useCallback } from 'react'

const DEFAULT_LOCATION = { lat: 20.5937, lng: 78.9629 } // India center

export const useGeolocation = () => {
  const [location, setLocation] = useState(DEFAULT_LOCATION)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hasDetected, setHasDetected] = useState(false)

  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      return
    }

    setLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setLocation({ lat: latitude, lng: longitude })
        setHasDetected(true)
        setLoading(false)
      },
      (err) => {
        let message = 'Unable to detect location'
        if (err.code === err.PERMISSION_DENIED) {
          message = 'Location permission denied. Using default location.'
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          message = 'Location unavailable. Using default location.'
        } else if (err.code === err.TIMEOUT) {
          message = 'Location request timed out. Using default location.'
        }
        setError(message)
        setLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000, // cache for 1 minute
      }
    )
  }, [])

  const setManualLocation = useCallback((lat, lng) => {
    setLocation({ lat, lng })
    setHasDetected(true)
    setError(null)
  }, [])

  return {
    location,
    loading,
    error,
    hasDetected,
    detectLocation,
    setManualLocation,
  }
}
