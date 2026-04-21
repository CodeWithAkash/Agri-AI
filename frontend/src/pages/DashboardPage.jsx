/**
 * DashboardPage - Main analysis dashboard with map, form, and results panel
 */

import React, { useEffect, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Navigation, MapPin, Leaf, AlertCircle, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'

import PageWrapper from '../components/layout/PageWrapper'
import AnalysisForm from '../components/forms/AnalysisForm'
import ResultsPanel from '../components/ui/ResultsPanel'
import WeatherBadge from '../components/ui/WeatherBadge'
import { KPICardSkeleton, ResultCardSkeleton } from '../components/ui/Skeleton'
import { useGeolocation } from '../hooks/useGeolocation'
import { useAnalysis } from '../hooks/useAnalysis'

// Lazy-load the map to avoid SSR issues
const MapView = React.lazy(() => import('../components/map/MapView'))

export default function DashboardPage() {
  const {
    location,
    loading: gpsLoading,
    error: gpsError,
    hasDetected,
    detectLocation,
    setManualLocation,
  } = useGeolocation()

  const {
    form,
    result,
    loading: analysisLoading,
    error: analysisError,
    validationErrors,
    updateField,
    submitAnalysis,
    resetForm,
  } = useAnalysis()

  // Auto-detect GPS on mount
  useEffect(() => {
    detectLocation()
  }, [])

  // Show GPS errors as toasts
  useEffect(() => {
    if (gpsError) toast(gpsError, { icon: '📍' })
  }, [gpsError])

  const handleSubmit = () => submitAnalysis(location)

  const handleMapLocationChange = (lat, lng) => {
    setManualLocation(lat, lng)
  }

  return (
    <PageWrapper>
      <div className="min-h-screen bg-sage-hint bg-mesh pb-16">
        {/* Page Header */}
        <div className="px-4 sm:px-6 lg:px-8 pt-6 pb-4 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
          >
            <div>
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-sage-evergreen">
                Field Analysis Dashboard
              </h1>
              <p className="font-body text-sm text-sage-moss mt-0.5">
                Drop a pin on your field and get AI-powered recommendations in seconds
              </p>
            </div>
            <button
              onClick={detectLocation}
              disabled={gpsLoading}
              className="btn-secondary self-start sm:self-auto flex items-center gap-2"
            >
              {gpsLoading
                ? <RefreshCw className="w-4 h-4 animate-spin" />
                : <Navigation className="w-4 h-4" />
              }
              {gpsLoading ? 'Detecting…' : 'Detect My Location'}
            </button>
          </motion.div>
        </div>

        {/* Main Grid */}
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

            {/* ── Left Column: Map + Form ────────────────────── */}
            <div className="lg:col-span-2 flex flex-col gap-5">
              {/* Map */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, delay: 0.1 }}
                className="h-72 lg:h-80 rounded-2xl overflow-hidden shadow-sage-md"
              >
                <Suspense
                  fallback={
                    <div className="w-full h-full bg-sage-mint/50 rounded-2xl flex items-center justify-center">
                      <div className="flex flex-col items-center gap-2">
                        <MapPin className="w-6 h-6 text-sage-moss animate-pulse" />
                        <p className="font-body text-sm text-sage-moss">Loading map…</p>
                      </div>
                    </div>
                  }
                >
                  <MapView
                    location={location}
                    onLocationChange={handleMapLocationChange}
                    loadingGPS={gpsLoading}
                  />
                </Suspense>
              </motion.div>

              {/* Location Summary */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="flex items-center gap-2 px-3 py-2 glass-card"
              >
                <MapPin className="w-3.5 h-3.5 text-sage-moss shrink-0" />
                <span className="font-body text-xs text-sage-moss">
                  {hasDetected ? 'GPS location detected · ' : 'Default location · '}
                </span>
                <span className="font-mono text-xs text-sage-evergreen font-medium">
                  {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
                </span>
              </motion.div>

              {/* Analysis Form */}
              <AnalysisForm
                form={form}
                validationErrors={validationErrors}
                onUpdate={updateField}
                onSubmit={handleSubmit}
                onReset={resetForm}
                loading={analysisLoading}
              />
            </div>

            {/* ── Right Column: Results ──────────────────────── */}
            <div className="lg:col-span-3 flex flex-col gap-5">
              {/* Analysis Error */}
              {analysisError && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-start gap-3 px-4 py-4 rounded-2xl bg-red-50 border border-red-200"
                >
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-body text-sm font-semibold text-red-700">Analysis Failed</p>
                    <p className="font-body text-sm text-red-600 mt-0.5">{analysisError}</p>
                  </div>
                </motion.div>
              )}

              {/* Loading Skeletons */}
              {analysisLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-3">
                    {[...Array(4)].map((_, i) => <KPICardSkeleton key={i} />)}
                  </div>
                  {[...Array(3)].map((_, i) => <ResultCardSkeleton key={i} />)}
                </motion.div>
              )}

              {/* Results */}
              {result && !analysisLoading && (
                <>
                  {/* Weather Badge */}
                  <WeatherBadge weather={result.weather} />
                  {/* Full Results */}
                  <ResultsPanel result={result} />
                </>
              )}

              {/* Empty State */}
              {!result && !analysisLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col items-center justify-center h-full min-h-[400px]
                             glass-card-solid rounded-2xl text-center px-8 py-16"
                >
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-20 h-20 rounded-3xl bg-sage-evergreen/10 flex items-center
                               justify-center mb-6"
                  >
                    <Leaf className="w-10 h-10 text-sage-evergreen" />
                  </motion.div>
                  <h3 className="font-display font-bold text-xl text-sage-evergreen mb-3">
                    Ready to Analyze Your Field
                  </h3>
                  <p className="font-body text-sm text-sage-moss max-w-sm leading-relaxed">
                    1. Drop a pin on your field location on the map<br />
                    2. Select your crop type and enter the field area<br />
                    3. Click "Analyze Field" for AI-powered insights
                  </p>
                  <div className="mt-8 flex flex-wrap gap-2 justify-center">
                    {['Yield Prediction', 'Irrigation', 'Fertilizer NPK', 'Pest Control', 'Profit'].map(tag => (
                      <span key={tag} className="badge">{tag}</span>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
