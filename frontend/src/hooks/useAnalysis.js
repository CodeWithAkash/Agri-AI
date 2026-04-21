/**
 * useAnalysis - Custom hook for managing field analysis state
 */

import { useState, useCallback } from 'react'
import { analyzeField } from '../services/api'
import toast from 'react-hot-toast'

const INITIAL_FORM = {
  crop: '',
  area: '',
  unit: 'hectare',
}

export const useAnalysis = () => {
  const [form, setForm] = useState(INITIAL_FORM)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [validationErrors, setValidationErrors] = useState({})

  // Form field update
  const updateField = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setValidationErrors((prev) => {
      const next = { ...prev }
      delete next[field]
      return next
    })
  }, [])

  // Client-side validation
  const validate = useCallback((location) => {
    const errors = {}
    if (!form.crop) errors.crop = 'Please select a crop type'
    if (!form.area || isNaN(Number(form.area)) || Number(form.area) <= 0) {
      errors.area = 'Please enter a valid area (> 0)'
    }
    if (Number(form.area) > 100000) {
      errors.area = 'Area must be ≤ 100,000'
    }
    if (!location?.lat || !location?.lng) {
      errors.location = 'Please set a field location on the map'
    }
    return errors
  }, [form])

  // Submit analysis
  const submitAnalysis = useCallback(async (location) => {
    setError(null)

    const errors = validate(location)
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      toast.error('Please fix the form errors before submitting')
      return false
    }

    setLoading(true)
    setResult(null)

    const toastId = toast.loading('Analyzing your field with AI…')

    try {
      const payload = {
        crop: form.crop,
        area: Number(form.area),
        unit: form.unit,
        latitude: location.lat,
        longitude: location.lng,
      }

      const response = await analyzeField(payload)

      if (response.success) {
        setResult(response.data)
        toast.success('Analysis complete!', { id: toastId })
        return true
      } else {
        throw new Error(response.error || 'Analysis failed')
      }
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.errors?.join(', ') ||
        err.message ||
        'Analysis failed. Please try again.'
      setError(message)
      toast.error(message, { id: toastId })
      return false
    } finally {
      setLoading(false)
    }
  }, [form, validate])

  const resetForm = useCallback(() => {
    setForm(INITIAL_FORM)
    setResult(null)
    setError(null)
    setValidationErrors({})
  }, [])

  return {
    form,
    result,
    loading,
    error,
    validationErrors,
    updateField,
    submitAnalysis,
    resetForm,
  }
}
