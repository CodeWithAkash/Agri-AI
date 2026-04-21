/**
 * Skeleton - Loading skeleton components
 */

import React from 'react'
import { motion } from 'framer-motion'

function SkeletonBlock({ className = '' }) {
  return (
    <div
      className={`skeleton ${className}`}
      aria-hidden="true"
    />
  )
}

export function KPICardSkeleton() {
  return (
    <div className="kpi-card">
      <SkeletonBlock className="w-10 h-10 rounded-xl" />
      <div className="mt-1 space-y-2">
        <SkeletonBlock className="h-3 w-20 rounded-full" />
        <SkeletonBlock className="h-7 w-28 rounded-lg" />
      </div>
    </div>
  )
}

export function ResultCardSkeleton() {
  return (
    <div className="glass-card-solid p-5 space-y-3">
      <SkeletonBlock className="h-5 w-32 rounded-lg" />
      <SkeletonBlock className="h-4 w-full rounded-lg" />
      <SkeletonBlock className="h-4 w-3/4 rounded-lg" />
      <SkeletonBlock className="h-4 w-5/6 rounded-lg" />
    </div>
  )
}

export function ChartSkeleton({ height = 280 }) {
  return (
    <div className="glass-card-solid p-5 space-y-4">
      <SkeletonBlock className="h-5 w-40 rounded-lg" />
      <SkeletonBlock className={`w-full rounded-xl`} style={{ height }} />
    </div>
  )
}

export function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 px-4 py-3 border-b border-sage/10">
      <SkeletonBlock className="w-8 h-8 rounded-xl shrink-0" />
      <div className="flex-1 space-y-1.5">
        <SkeletonBlock className="h-3.5 w-24 rounded-full" />
        <SkeletonBlock className="h-3 w-40 rounded-full" />
      </div>
      <SkeletonBlock className="h-3.5 w-16 rounded-full" />
      <SkeletonBlock className="h-3.5 w-20 rounded-full" />
    </div>
  )
}

export default SkeletonBlock
