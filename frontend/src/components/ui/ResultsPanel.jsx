/**
 * ResultsPanel - Displays full analysis results in animated cards
 */

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Wheat, Droplets, FlaskConical, Bug, TrendingUp,
  CheckCircle2, AlertTriangle, ChevronDown, ChevronUp,
  IndianRupee, Leaf, Calendar, Info
} from 'lucide-react'
import KPICard from './KPICard'

// ── Section Card ────────────────────────────────────────────────────────
function ResultSection({ icon: Icon, title, color, children, delay = 0, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="glass-card-solid overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-sage/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
            <Icon className="w-4 h-4" />
          </div>
          <h3 className="font-display font-bold text-base text-sage-evergreen">{title}</h3>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-sage-moss" /> : <ChevronDown className="w-4 h-4 text-sage-moss" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-0 border-t border-sage/10">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ── Info Row ────────────────────────────────────────────────────────────
function InfoRow({ label, value, highlight = false }) {
  return (
    <div className={`flex items-start justify-between py-2 border-b border-sage/10 last:border-0 gap-4`}>
      <span className="font-body text-sm text-sage-moss shrink-0">{label}</span>
      <span className={`font-body text-sm text-right ${highlight ? 'font-bold text-sage-evergreen' : 'text-sage-evergreen'}`}>
        {value}
      </span>
    </div>
  )
}

// ── Main Component ──────────────────────────────────────────────────────
export default function ResultsPanel({ result }) {
  if (!result) return null

  const { yield: yieldData, irrigation, fertilizer, pest_control, profit, weather, input } = result

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPICard
          icon={Wheat}
          label="Total Yield"
          value={Math.round(yieldData.total_yield)}
          unit="kg"
          color="green"
          delay={0}
        />
        <KPICard
          icon={IndianRupee}
          label="Net Profit"
          value={Math.round(profit.net_profit_inr)}
          prefix="₹"
          color={profit.is_profitable ? 'green' : 'rose'}
          delay={0.1}
        />
        <KPICard
          icon={TrendingUp}
          label="ROI"
          value={Math.round(profit.roi_percent)}
          suffix="%"
          color="blue"
          delay={0.2}
        />
        <KPICard
          icon={FlaskConical}
          label="Confidence"
          value={yieldData.confidence_percent}
          suffix="%"
          color="amber"
          delay={0.3}
        />
      </div>

      {/* Yield Details */}
      <ResultSection
        icon={Wheat}
        title="Yield Prediction"
        color="bg-green-100 text-green-700"
        delay={0.1}
        defaultOpen={true}
      >
        <div className="mt-3 space-y-0">
          <InfoRow label="Crop" value={input.crop.charAt(0).toUpperCase() + input.crop.slice(1)} />
          <InfoRow label="Area" value={`${input.area} ${input.unit} (${input.area_hectares.toFixed(2)} ha)`} />
          <InfoRow label="Yield per Hectare" value={`${yieldData.yield_per_hectare.toLocaleString()} kg/ha`} highlight />
          <InfoRow label="Total Yield" value={`${yieldData.total_yield.toLocaleString()} kg`} highlight />
          <InfoRow label="Base Yield (no weather)" value={`${yieldData.base_yield_per_hectare.toLocaleString()} kg/ha`} />
          <InfoRow label="Weather Multiplier" value={`${yieldData.ml_multiplier}×`} />
          <InfoRow label="AI Confidence" value={`${yieldData.confidence_percent}%`} />
        </div>
      </ResultSection>

      {/* Irrigation */}
      <ResultSection
        icon={Droplets}
        title="Irrigation Schedule"
        color="bg-blue-100 text-blue-700"
        delay={0.15}
        defaultOpen={true}
      >
        <div className="mt-3">
          <div className={`flex items-center gap-2 mb-3 px-3 py-2 rounded-xl ${
            irrigation.required ? 'bg-amber-50 text-amber-800' : 'bg-green-50 text-green-800'
          }`}>
            {irrigation.required
              ? <AlertTriangle className="w-4 h-4 shrink-0" />
              : <CheckCircle2 className="w-4 h-4 shrink-0" />
            }
            <span className="font-body text-sm font-semibold">{irrigation.schedule}</span>
          </div>
          <div className="space-y-0">
            <InfoRow label="Method" value={irrigation.method} />
            {irrigation.frequency_days && (
              <InfoRow label="Frequency" value={`Every ${irrigation.frequency_days} days`} />
            )}
            {irrigation.monthly_requirement_mm > 0 && (
              <InfoRow label="Monthly Need" value={`${irrigation.monthly_requirement_mm} mm`} />
            )}
            <InfoRow label="Tip" value={irrigation.efficiency_tip} />
          </div>
          <div className="mt-3 px-3 py-2 bg-sage/10 rounded-xl">
            <p className="font-body text-xs text-sage-moss flex gap-1.5">
              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              {irrigation.notes}
            </p>
          </div>
        </div>
      </ResultSection>

      {/* Fertilizer */}
      <ResultSection
        icon={FlaskConical}
        title="Fertilizer Recommendation (NPK)"
        color="bg-amber-100 text-amber-700"
        delay={0.2}
        defaultOpen={true}
      >
        <div className="mt-3 space-y-4">
          {/* NPK Visual */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Nitrogen (N)', value: fertilizer.NPK.N_kg, color: 'bg-blue-50 border-blue-200 text-blue-800' },
              { label: 'Phosphorus (P)', value: fertilizer.NPK.P_kg, color: 'bg-amber-50 border-amber-200 text-amber-800' },
              { label: 'Potassium (K)', value: fertilizer.NPK.K_kg, color: 'bg-rose-50 border-rose-200 text-rose-800' },
            ].map(({ label, value, color }) => (
              <div key={label} className={`rounded-xl border p-3 text-center ${color}`}>
                <p className="font-display font-bold text-xl">{value.toLocaleString()}</p>
                <p className="font-body text-xs font-medium opacity-70">kg</p>
                <p className="font-body text-xs mt-1 leading-tight">{label}</p>
              </div>
            ))}
          </div>

          {/* Application Schedule */}
          <div>
            <p className="font-body text-xs font-semibold text-sage-moss uppercase tracking-wider mb-2">
              Application Schedule
            </p>
            <div className="space-y-2">
              {fertilizer.application_schedule.map((stage, i) => (
                <div key={i} className="flex items-start gap-3 px-3 py-2 bg-white/40 rounded-xl">
                  <div className="w-6 h-6 rounded-full bg-sage-evergreen text-sage-hint flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-body text-sm font-semibold text-sage-evergreen">{stage.stage}</p>
                    <p className="font-body text-xs text-sage-moss">
                      N: {stage.N_kg}kg · P: {stage.P_kg}kg · K: {stage.K_kg}kg
                    </p>
                  </div>
                  <span className="ml-auto font-mono text-xs text-sage-moss shrink-0">{stage.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          <p className="font-body text-xs text-sage-moss italic px-1">{fertilizer.notes}</p>
        </div>
      </ResultSection>

      {/* Pest Control */}
      <ResultSection
        icon={Bug}
        title="Pest Control Rotation"
        color="bg-rose-100 text-rose-700"
        delay={0.25}
        defaultOpen={false}
      >
        <div className="mt-3 space-y-3">
          <div className="flex flex-wrap gap-1.5 mb-3">
            {pest_control.target_pests.map((pest) => (
              <span key={pest} className="badge">{pest}</span>
            ))}
          </div>
          {pest_control.rotation.map((item) => (
            <div key={item.order} className="flex gap-3 px-3 py-3 bg-white/40 rounded-xl">
              <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center
                              font-bold text-sm shrink-0 mt-0.5">
                {item.order}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-body text-sm font-bold text-sage-evergreen">{item.product}</p>
                  <span className="badge text-[10px]">{item.type}</span>
                </div>
                <p className="font-body text-xs text-sage-moss mt-0.5">
                  Dose: {item.dose_per_liter} · Interval: every {item.interval_days} days
                </p>
                <p className="font-body text-xs text-sage-moss">{item.notes}</p>
              </div>
            </div>
          ))}
          <div className="px-3 py-2 bg-sage/10 rounded-xl">
            <p className="font-body text-xs text-sage-moss">
              <span className="font-semibold">IPM Note:</span> {pest_control.ipm_note}
            </p>
          </div>
        </div>
      </ResultSection>

      {/* Profit Estimation */}
      <ResultSection
        icon={TrendingUp}
        title="Profit Estimation"
        color={profit.is_profitable ? 'bg-green-100 text-green-700' : 'bg-rose-100 text-rose-700'}
        delay={0.3}
        defaultOpen={true}
      >
        <div className="mt-3 space-y-0">
          <InfoRow label="Gross Revenue" value={`₹ ${profit.gross_revenue_inr.toLocaleString()}`} />
          <InfoRow label="Input Cost" value={`₹ ${profit.input_cost_inr.toLocaleString()}`} />
          <InfoRow
            label="Net Profit"
            value={`₹ ${profit.net_profit_inr.toLocaleString()}`}
            highlight
          />
          <InfoRow label="Profit per Hectare" value={`₹ ${profit.profit_per_hectare_inr.toLocaleString()}`} highlight />
          <InfoRow label="ROI" value={`${profit.roi_percent}%`} />
          <InfoRow label="Price per kg" value={`₹ ${profit.price_per_kg_inr}`} />
          <InfoRow label="Breakeven Yield" value={`${profit.breakeven_yield_kg.toLocaleString()} kg`} />
        </div>
        <div className={`mt-3 px-3 py-2 rounded-xl flex items-center gap-2 ${
          profit.is_profitable ? 'bg-green-50 text-green-800' : 'bg-rose-50 text-rose-800'
        }`}>
          {profit.is_profitable
            ? <CheckCircle2 className="w-4 h-4 shrink-0" />
            : <AlertTriangle className="w-4 h-4 shrink-0" />
          }
          <span className="font-body text-sm font-semibold">
            {profit.is_profitable
              ? 'This crop is projected to be profitable.'
              : 'Warning: Projected loss — consider reducing input costs.'}
          </span>
        </div>
      </ResultSection>
    </motion.div>
  )
}
