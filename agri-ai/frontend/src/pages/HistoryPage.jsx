/**
 * HistoryPage - Paginated history of all past field analyses
 */

import React, { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  History, Trash2, ChevronLeft, ChevronRight, Search,
  Sprout, MapPin, TrendingUp, Calendar, AlertCircle, Inbox
} from 'lucide-react'
import toast from 'react-hot-toast'

import PageWrapper from '../components/layout/PageWrapper'
import { TableRowSkeleton } from '../components/ui/Skeleton'
import { getHistory, deleteAnalysis } from '../services/api'

const CROPS = ['', 'rice', 'maize', 'wheat', 'brinjal', 'tomato', 'potato', 'cotton', 'sugarcane', 'soybean', 'groundnut']

// ── History Row ────────────────────────────────────────────────────────
function HistoryRow({ analysis, onDelete }) {
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!window.confirm('Delete this analysis? This cannot be undone.')) return
    setDeleting(true)
    try {
      await deleteAnalysis(analysis.id)
      toast.success('Analysis deleted')
      onDelete(analysis.id)
    } catch {
      toast.error('Failed to delete')
      setDeleting(false)
    }
  }

  const crop = analysis.crop || '—'
  const date = analysis.createdAt
    ? new Date(analysis.createdAt).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric'
      })
    : '—'
  const totalYield = analysis.results?.yield?.total_yield
  const profit = analysis.results?.profit?.net_profit_inr
  const lat = analysis.location?.latitude
  const lng = analysis.location?.longitude
  const area = analysis.area?.value
  const unit = analysis.area?.unit

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 12, height: 0 }}
      transition={{ duration: 0.25 }}
      className="flex items-center gap-4 px-5 py-4 border-b border-sage/10
                 hover:bg-sage/5 transition-colors group"
    >
      {/* Crop Icon */}
      <div className="w-9 h-9 rounded-xl bg-sage/15 flex items-center justify-center shrink-0">
        <Sprout className="w-4 h-4 text-sage-evergreen" />
      </div>

      {/* Main Info */}
      <div className="flex-1 min-w-0">
        <p className="font-body font-semibold text-sm text-sage-evergreen capitalize">{crop}</p>
        <div className="flex items-center gap-3 mt-0.5 flex-wrap">
          {area && (
            <span className="font-body text-xs text-sage-moss flex items-center gap-1">
              <Sprout className="w-3 h-3" />
              {area} {unit}
            </span>
          )}
          {lat && lng && (
            <span className="font-body text-xs text-sage-moss flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {Number(lat).toFixed(3)}, {Number(lng).toFixed(3)}
            </span>
          )}
        </div>
      </div>

      {/* Yield */}
      <div className="hidden sm:block text-right shrink-0">
        <p className="font-body text-xs text-sage-moss">Yield</p>
        <p className="font-body text-sm font-semibold text-sage-evergreen">
          {totalYield ? `${Number(totalYield).toLocaleString()} kg` : '—'}
        </p>
      </div>

      {/* Profit */}
      <div className="hidden md:block text-right shrink-0">
        <p className="font-body text-xs text-sage-moss">Net Profit</p>
        <p className={`font-body text-sm font-semibold ${
          profit > 0 ? 'text-green-600' : profit < 0 ? 'text-red-500' : 'text-sage-moss'
        }`}>
          {profit !== undefined ? `₹ ${Number(profit).toLocaleString()}` : '—'}
        </p>
      </div>

      {/* Date */}
      <div className="hidden lg:block text-right shrink-0">
        <p className="font-body text-xs text-sage-moss flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {date}
        </p>
      </div>

      {/* Delete */}
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="w-8 h-8 rounded-xl flex items-center justify-center text-sage-moss
                   opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-red-50
                   transition-all duration-200 shrink-0"
        title="Delete analysis"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────
export default function HistoryPage() {
  const [analyses, setAnalyses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [cropFilter, setCropFilter] = useState('')
  const LIMIT = 15

  const fetchHistory = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await getHistory({ page, limit: LIMIT, crop: cropFilter })
      if (res.success) {
        setAnalyses(res.data.analyses)
        setTotal(res.data.total)
        setPages(res.data.pages || 1)
      }
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to load history')
    } finally {
      setLoading(false)
    }
  }, [page, cropFilter])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  // Reset to page 1 when filter changes
  useEffect(() => {
    setPage(1)
  }, [cropFilter])

  const handleDelete = (id) => {
    setAnalyses((prev) => prev.filter((a) => a.id !== id))
    setTotal((t) => t - 1)
  }

  return (
    <PageWrapper>
      <div className="min-h-screen bg-sage-hint bg-mesh pb-16">
        <div className="px-4 sm:px-6 lg:px-8 pt-6 pb-4 max-w-5xl mx-auto">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
          >
            <div>
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-sage-evergreen flex items-center gap-2">
                <History className="w-6 h-6" />
                Analysis History
              </h1>
              <p className="font-body text-sm text-sage-moss mt-0.5">
                {total > 0 ? `${total} analyses stored` : 'No analyses yet'}
              </p>
            </div>

            {/* Crop Filter */}
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-sage-moss shrink-0" />
              <select
                value={cropFilter}
                onChange={(e) => setCropFilter(e.target.value)}
                className="field-input w-40"
              >
                <option value="">All crops</option>
                {CROPS.filter(Boolean).map(c => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>
          </motion.div>

          {/* Table */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card-solid overflow-hidden"
          >
            {/* Column Headers */}
            <div className="flex items-center gap-4 px-5 py-3 border-b border-sage/20 bg-sage/5">
              <div className="w-9 shrink-0" />
              <p className="flex-1 font-body text-xs font-semibold text-sage-moss uppercase tracking-wider">Crop · Area</p>
              <p className="hidden sm:block w-24 text-right font-body text-xs font-semibold text-sage-moss uppercase tracking-wider">Yield</p>
              <p className="hidden md:block w-28 text-right font-body text-xs font-semibold text-sage-moss uppercase tracking-wider">Net Profit</p>
              <p className="hidden lg:block w-28 text-right font-body text-xs font-semibold text-sage-moss uppercase tracking-wider">Date</p>
              <div className="w-8 shrink-0" />
            </div>

            {/* Error State */}
            {error && (
              <div className="flex items-center gap-3 px-5 py-10 text-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <p className="font-body text-sm text-red-500">{error}</p>
              </div>
            )}

            {/* Loading Skeletons */}
            {loading && !error && (
              <div>
                {[...Array(8)].map((_, i) => <TableRowSkeleton key={i} />)}
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && analyses.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Inbox className="w-10 h-10 text-sage/40" />
                <p className="font-body text-sm text-sage-moss">
                  {cropFilter ? `No analyses for ${cropFilter}` : 'No analyses yet — run your first field analysis!'}
                </p>
              </div>
            )}

            {/* Rows */}
            {!loading && !error && (
              <AnimatePresence>
                {analyses.map((analysis) => (
                  <HistoryRow
                    key={analysis.id}
                    analysis={analysis}
                    onDelete={handleDelete}
                  />
                ))}
              </AnimatePresence>
            )}
          </motion.div>

          {/* Pagination */}
          {pages > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-between mt-5"
            >
              <p className="font-body text-xs text-sage-moss">
                Page {page} of {pages} · {total} total
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1 || loading}
                  className="btn-secondary px-3 py-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(pages, p + 1))}
                  disabled={page >= pages || loading}
                  className="btn-secondary px-3 py-2"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </PageWrapper>
  )
}
