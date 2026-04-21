/**
 * AnalysisForm - Crop input form with validation
 */

import React from 'react'
import { motion } from 'framer-motion'
import { Sprout, Ruler, Scale, Loader2, RotateCcw, FlaskConical } from 'lucide-react'

const CROPS = [
  { value: 'rice', label: '🌾 Rice' },
  { value: 'maize', label: '🌽 Maize' },
  { value: 'wheat', label: '🌿 Wheat' },
  { value: 'brinjal', label: '🍆 Brinjal' },
  { value: 'tomato', label: '🍅 Tomato' },
  { value: 'potato', label: '🥔 Potato' },
  { value: 'cotton', label: '☁️ Cotton' },
  { value: 'sugarcane', label: '🎋 Sugarcane' },
  { value: 'soybean', label: '🫛 Soybean' },
  { value: 'groundnut', label: '🥜 Groundnut' },
]

export default function AnalysisForm({ form, validationErrors, onUpdate, onSubmit, onReset, loading }) {
  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="glass-card-solid p-6 flex flex-col gap-5"
    >
      <div className="flex items-center gap-2 mb-1">
        <div className="w-8 h-8 rounded-xl bg-sage-evergreen/10 flex items-center justify-center">
          <FlaskConical className="w-4 h-4 text-sage-evergreen" />
        </div>
        <h2 className="font-display font-bold text-lg text-sage-evergreen">Field Details</h2>
      </div>

      {/* Crop Type */}
      <div>
        <label className="field-label flex items-center gap-1.5">
          <Sprout className="w-3.5 h-3.5" />
          Crop Type
        </label>
        <select
          value={form.crop}
          onChange={(e) => onUpdate('crop', e.target.value)}
          className={`field-input ${validationErrors.crop ? 'border-red-400' : ''}`}
        >
          <option value="">Select a crop…</option>
          {CROPS.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        {validationErrors.crop && (
          <p className="mt-1 text-xs text-red-500 font-body">{validationErrors.crop}</p>
        )}
      </div>

      {/* Area + Unit */}
      <div>
        <label className="field-label flex items-center gap-1.5">
          <Ruler className="w-3.5 h-3.5" />
          Field Area
        </label>
        <div className="flex gap-2">
          <div className="flex-1">
            <input
              type="number"
              value={form.area}
              onChange={(e) => onUpdate('area', e.target.value)}
              placeholder="e.g. 2.5"
              min="0.01"
              step="0.01"
              className={`field-input ${validationErrors.area ? 'border-red-400' : ''}`}
            />
          </div>
          <div className="w-32">
            <select
              value={form.unit}
              onChange={(e) => onUpdate('unit', e.target.value)}
              className="field-input"
            >
              <option value="hectare">Hectare</option>
              <option value="acre">Acre</option>
            </select>
          </div>
        </div>
        {validationErrors.area && (
          <p className="mt-1 text-xs text-red-500 font-body">{validationErrors.area}</p>
        )}
      </div>

      {/* Location Validation Error */}
      {validationErrors.location && (
        <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200">
          <p className="text-xs text-red-600 font-body">{validationErrors.location}</p>
        </div>
      )}

      {/* Unit Conversion Hint */}
      {form.area && !isNaN(Number(form.area)) && Number(form.area) > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="px-4 py-2.5 rounded-xl bg-sage/10 border border-sage/20"
        >
          <p className="text-xs text-sage-moss font-body flex items-center gap-1.5">
            <Scale className="w-3 h-3" />
            {form.unit === 'acre'
              ? `≈ ${(Number(form.area) * 0.4047).toFixed(2)} hectares`
              : `≈ ${(Number(form.area) * 2.471).toFixed(2)} acres`
            }
          </p>
        </motion.div>
      )}

      {/* Buttons */}
      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary flex-1"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing…
            </>
          ) : (
            <>
              <FlaskConical className="w-4 h-4" />
              Analyze Field
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onReset}
          disabled={loading}
          className="btn-secondary px-4"
          title="Reset form"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </motion.form>
  )
}
