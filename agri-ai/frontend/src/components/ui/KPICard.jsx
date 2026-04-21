/**
 * KPICard - Animated KPI metric card with counter animation
 */

import React from 'react'
import { motion } from 'framer-motion'
import { useCounter } from '../../hooks/useCounter'

export default function KPICard({ icon: Icon, label, value, unit, color = 'sage', delay = 0, prefix = '', suffix = '' }) {
  const numericValue = typeof value === 'number' ? value : parseFloat(value) || 0
  const animated = useCounter(Math.round(numericValue), 1400, true)

  const colorMap = {
    sage: 'bg-sage/10 text-sage-evergreen',
    green: 'bg-green-100 text-green-700',
    amber: 'bg-amber-100 text-amber-700',
    blue: 'bg-blue-100 text-blue-700',
    rose: 'bg-rose-100 text-rose-700',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay, ease: [0.4, 0, 0.2, 1] }}
      className="kpi-card"
    >
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colorMap[color] || colorMap.sage}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-1">
        <p className="font-body text-xs text-sage-moss font-medium uppercase tracking-wider">{label}</p>
        <p className="font-display font-bold text-2xl text-sage-evergreen mt-0.5 counter-anim">
          {prefix}{animated.toLocaleString()}{suffix}
          {unit && <span className="font-body text-sm font-normal text-sage-moss ml-1">{unit}</span>}
        </p>
      </div>
    </motion.div>
  )
}
