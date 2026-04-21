/**
 * AnalyticsPage - Analytics dashboard with charts and KPI summaries
 */

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart3, TrendingUp, Sprout, Database,
  RefreshCw, AlertCircle, Info
} from 'lucide-react'

import PageWrapper from '../components/layout/PageWrapper'
import KPICard from '../components/ui/KPICard'
import { KPICardSkeleton, ChartSkeleton } from '../components/ui/Skeleton'
import {
  YieldComparisonChart,
  RainfallProductionChart,
  FertilizerPieChart,
  CropCountChart,
} from '../components/charts/AnalyticsCharts'
import { getStats } from '../services/api'

export default function AnalyticsPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchStats = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await getStats()
      if (res.success) setStats(res.data)
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  // Derived totals from crop_breakdown
  const totalAnalyses = stats?.total_analyses || 0
  const avgYield = stats?.crop_breakdown?.length
    ? Math.round(stats.crop_breakdown.reduce((a, c) => a + c.avg_yield_kg, 0) / stats.crop_breakdown.length)
    : 0
  const avgProfit = stats?.crop_breakdown?.length
    ? Math.round(stats.crop_breakdown.reduce((a, c) => a + c.avg_profit_inr, 0) / stats.crop_breakdown.length)
    : 0
  const totalArea = stats?.crop_breakdown?.length
    ? Math.round(stats.crop_breakdown.reduce((a, c) => a + c.total_area_ha, 0))
    : 0

  return (
    <PageWrapper>
      <div className="min-h-screen bg-sage-hint bg-mesh pb-16">
        <div className="px-4 sm:px-6 lg:px-8 pt-6 pb-4 max-w-7xl mx-auto">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
          >
            <div>
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-sage-evergreen flex items-center gap-2">
                <BarChart3 className="w-6 h-6" />
                Analytics
              </h1>
              <p className="font-body text-sm text-sage-moss mt-0.5">
                Aggregated insights from all your field analyses
              </p>
            </div>
            <button
              onClick={fetchStats}
              disabled={loading}
              className="btn-secondary self-start sm:self-auto"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </motion.div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-3 px-4 py-4 mb-5 rounded-2xl bg-red-50 border border-red-200">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <p className="font-body text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Info Banner if no real data */}
          {!loading && totalAnalyses === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-start gap-3 px-4 py-4 mb-5 rounded-2xl bg-sage/10 border border-sage/20"
            >
              <Info className="w-5 h-5 text-sage-moss shrink-0 mt-0.5" />
              <p className="font-body text-sm text-sage-moss">
                <strong className="text-sage-evergreen">No analyses yet.</strong>{' '}
                The charts below show demo data. Run your first field analysis on the Dashboard to see real insights.
              </p>
            </motion.div>
          )}

          {/* KPI Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {loading ? (
              [...Array(4)].map((_, i) => <KPICardSkeleton key={i} />)
            ) : (
              <>
                <KPICard icon={Database}   label="Total Analyses"   value={totalAnalyses}  color="sage"  delay={0} />
                <KPICard icon={Sprout}     label="Avg Yield"        value={avgYield}        unit="kg"    color="green" delay={0.1} />
                <KPICard icon={TrendingUp} label="Avg Net Profit"   value={avgProfit}       prefix="₹"  color="blue"  delay={0.2} />
                <KPICard icon={BarChart3}  label="Total Area"       value={totalArea}       unit="ha"   color="amber" delay={0.3} />
              </>
            )}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Yield Comparison */}
            {loading
              ? <ChartSkeleton height={260} />
              : <YieldComparisonChart data={stats?.crop_breakdown} />
            }

            {/* Crop Count */}
            {loading
              ? <ChartSkeleton height={260} />
              : <CropCountChart data={stats?.crop_breakdown} />
            }

            {/* Rainfall vs Production - full width */}
            <div className="lg:col-span-2">
              {loading
                ? <ChartSkeleton height={260} />
                : <RainfallProductionChart />
              }
            </div>

            {/* Fertilizer Pie */}
            {loading
              ? <ChartSkeleton height={260} />
              : <FertilizerPieChart fertilizer={null} />
            }

            {/* Crop Breakdown Table */}
            {!loading && stats?.crop_breakdown?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass-card-solid overflow-hidden"
              >
                <div className="p-5 border-b border-sage/10">
                  <h3 className="font-display font-bold text-base text-sage-evergreen">
                    Crop Performance Breakdown
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-sage/5">
                        {['Crop', 'Analyses', 'Avg Yield', 'Avg Profit', 'Total Area'].map(col => (
                          <th
                            key={col}
                            className="px-4 py-3 text-left font-body text-xs font-semibold
                                       text-sage-moss uppercase tracking-wider"
                          >
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {stats.crop_breakdown.map((row, i) => (
                        <tr
                          key={row.crop}
                          className={`border-t border-sage/10 hover:bg-sage/5 transition-colors
                                      ${i % 2 === 0 ? '' : 'bg-sage/[0.03]'}`}
                        >
                          <td className="px-4 py-3 font-body text-sm font-semibold text-sage-evergreen capitalize">
                            {row.crop}
                          </td>
                          <td className="px-4 py-3 font-body text-sm text-sage-moss">{row.count}</td>
                          <td className="px-4 py-3 font-body text-sm text-sage-moss">
                            {row.avg_yield_kg.toLocaleString()} kg
                          </td>
                          <td className={`px-4 py-3 font-body text-sm font-medium ${
                            row.avg_profit_inr >= 0 ? 'text-green-600' : 'text-red-500'
                          }`}>
                            ₹ {row.avg_profit_inr.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 font-body text-sm text-sage-moss">
                            {row.total_area_ha.toFixed(1)} ha
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
