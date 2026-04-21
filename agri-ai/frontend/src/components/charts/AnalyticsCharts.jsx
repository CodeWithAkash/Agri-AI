/**
 * Analytics Charts - Recharts-based visualizations
 * Yield comparison, Rainfall vs Production, Fertilizer distribution
 */

import React from 'react'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts'

// ── Color Palette ──────────────────────────────────────────────────────
const SAGE_COLORS = ['#344C3D', '#738A6E', '#8EA58C', '#A8BFA6', '#BFCFBB']
const CHART_COLORS = {
  primary:   '#344C3D',
  secondary: '#738A6E',
  tertiary:  '#8EA58C',
  light:     '#A8BFA6',
  lightest:  '#BFCFBB',
  accent:    '#4CAF50',
}

// ── Custom Tooltip ─────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label, unit = '' }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-sage-evergreen/95 text-sage-hint rounded-xl px-4 py-3 shadow-sage-lg font-body text-sm">
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color || CHART_COLORS.light }}>
          {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value} {unit}
        </p>
      ))}
    </div>
  )
}

// ── Chart Wrapper ──────────────────────────────────────────────────────
function ChartCard({ title, subtitle, children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
      className="glass-card-solid p-5"
    >
      <div className="mb-4">
        <h3 className="font-display font-bold text-base text-sage-evergreen">{title}</h3>
        {subtitle && <p className="font-body text-xs text-sage-moss mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </motion.div>
  )
}

// ── 1. Yield Comparison Bar Chart ──────────────────────────────────────
export function YieldComparisonChart({ data }) {
  const chartData = data?.length
    ? data.map(d => ({
        crop: d.crop.charAt(0).toUpperCase() + d.crop.slice(1),
        'Avg Yield (kg)': Math.round(d.avg_yield_kg),
      }))
    : [
        { crop: 'Rice',   'Avg Yield (kg)': 4200 },
        { crop: 'Maize',  'Avg Yield (kg)': 3800 },
        { crop: 'Wheat',  'Avg Yield (kg)': 3100 },
        { crop: 'Tomato', 'Avg Yield (kg)': 19500 },
        { crop: 'Potato', 'Avg Yield (kg)': 17200 },
      ]

  return (
    <ChartCard
      title="Yield Comparison by Crop"
      subtitle="Average yield per hectare across crop types"
      delay={0}
    >
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={chartData} margin={{ top: 4, right: 12, left: 0, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#8EA58C20" />
          <XAxis
            dataKey="crop"
            tick={{ fontFamily: 'DM Sans', fontSize: 11, fill: '#738A6E' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontFamily: 'DM Sans', fontSize: 11, fill: '#738A6E' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}
          />
          <Tooltip content={<CustomTooltip unit="kg" />} />
          <Bar
            dataKey="Avg Yield (kg)"
            fill={CHART_COLORS.primary}
            radius={[6, 6, 0, 0]}
            maxBarSize={48}
          >
            {chartData.map((_, i) => (
              <Cell key={i} fill={SAGE_COLORS[i % SAGE_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

// ── 2. Rainfall vs Production Area Chart ───────────────────────────────
export function RainfallProductionChart({ data }) {
  const chartData = data?.length
    ? data
    : [
        { month: 'Jan', rainfall: 12,  yield: 850 },
        { month: 'Feb', rainfall: 18,  yield: 920 },
        { month: 'Mar', rainfall: 35,  yield: 1100 },
        { month: 'Apr', rainfall: 52,  yield: 1350 },
        { month: 'May', rainfall: 120, yield: 2100 },
        { month: 'Jun', rainfall: 210, yield: 3200 },
        { month: 'Jul', rainfall: 280, yield: 4100 },
        { month: 'Aug', rainfall: 250, yield: 3900 },
        { month: 'Sep', rainfall: 180, yield: 3100 },
        { month: 'Oct', rainfall: 90,  yield: 2200 },
        { month: 'Nov', rainfall: 40,  yield: 1400 },
        { month: 'Dec', rainfall: 15,  yield: 950 },
      ]

  return (
    <ChartCard
      title="Rainfall vs Production"
      subtitle="Monthly correlation between rainfall (mm) and yield output (kg)"
      delay={0.1}
    >
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={chartData} margin={{ top: 4, right: 12, left: 0, bottom: 4 }}>
          <defs>
            <linearGradient id="rainfallGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={CHART_COLORS.tertiary} stopOpacity={0.4} />
              <stop offset="95%" stopColor={CHART_COLORS.tertiary} stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="yieldGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={CHART_COLORS.primary} stopOpacity={0.3} />
              <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#8EA58C20" />
          <XAxis
            dataKey="month"
            tick={{ fontFamily: 'DM Sans', fontSize: 11, fill: '#738A6E' }}
            axisLine={false} tickLine={false}
          />
          <YAxis
            yAxisId="left"
            tick={{ fontFamily: 'DM Sans', fontSize: 11, fill: '#738A6E' }}
            axisLine={false} tickLine={false}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fontFamily: 'DM Sans', fontSize: 11, fill: '#738A6E' }}
            axisLine={false} tickLine={false}
            tickFormatter={v => `${(v/1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontFamily: 'DM Sans', fontSize: 12, color: '#738A6E' }}
          />
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="rainfall"
            name="Rainfall (mm)"
            stroke={CHART_COLORS.tertiary}
            fill="url(#rainfallGrad)"
            strokeWidth={2}
          />
          <Area
            yAxisId="right"
            type="monotone"
            dataKey="yield"
            name="Yield (kg)"
            stroke={CHART_COLORS.primary}
            fill="url(#yieldGrad)"
            strokeWidth={2.5}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

// ── 3. Fertilizer Distribution Pie Chart ───────────────────────────────
export function FertilizerPieChart({ fertilizer }) {
  const npk = fertilizer?.NPK
  const data = npk
    ? [
        { name: 'Nitrogen (N)', value: npk.N_kg },
        { name: 'Phosphorus (P)', value: npk.P_kg },
        { name: 'Potassium (K)', value: npk.K_kg },
      ]
    : [
        { name: 'Nitrogen (N)', value: 120 },
        { name: 'Phosphorus (P)', value: 60 },
        { name: 'Potassium (K)', value: 40 },
      ]

  const PIE_COLORS = [CHART_COLORS.primary, CHART_COLORS.secondary, CHART_COLORS.light]

  const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)
    return (
      <text
        x={x} y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        style={{ fontFamily: 'DM Sans', fontSize: 12, fontWeight: 600 }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <ChartCard
      title="Fertilizer Distribution"
      subtitle="NPK ratio for optimal crop nutrition"
      delay={0.2}
    >
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={95}
            innerRadius={50}
            dataKey="value"
            labelLine={false}
            label={renderLabel}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={PIE_COLORS[i]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(val, name) => [`${val} kg`, name]}
            contentStyle={{
              background: '#344C3D',
              border: 'none',
              borderRadius: 12,
              color: '#BFCFBB',
              fontFamily: 'DM Sans',
              fontSize: 13,
            }}
          />
          <Legend
            wrapperStyle={{ fontFamily: 'DM Sans', fontSize: 12, color: '#738A6E' }}
            formatter={(val) => val}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

// ── 4. Crop Analysis Count Bar Chart ──────────────────────────────────
export function CropCountChart({ data }) {
  const chartData = data?.length
    ? data.map(d => ({
        crop: d.crop.charAt(0).toUpperCase() + d.crop.slice(1),
        Analyses: d.count,
      }))
    : []

  if (!chartData.length) {
    return (
      <ChartCard title="Analyses by Crop" subtitle="Run your first analysis to see data" delay={0.3}>
        <div className="h-[260px] flex items-center justify-center text-sage-moss font-body text-sm">
          No analysis data yet
        </div>
      </ChartCard>
    )
  }

  return (
    <ChartCard
      title="Analyses by Crop"
      subtitle="How many times each crop has been analyzed"
      delay={0.3}
    >
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={chartData} layout="vertical" margin={{ top: 4, right: 24, left: 8, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#8EA58C20" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fontFamily: 'DM Sans', fontSize: 11, fill: '#738A6E' }}
            axisLine={false} tickLine={false}
          />
          <YAxis
            dataKey="crop"
            type="category"
            tick={{ fontFamily: 'DM Sans', fontSize: 11, fill: '#738A6E' }}
            axisLine={false} tickLine={false}
            width={70}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="Analyses" fill={CHART_COLORS.primary} radius={[0, 6, 6, 0]} maxBarSize={28}>
            {chartData.map((_, i) => (
              <Cell key={i} fill={SAGE_COLORS[i % SAGE_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
