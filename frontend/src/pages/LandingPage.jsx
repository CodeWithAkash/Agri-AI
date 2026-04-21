/**
 * LandingPage - Hero section with animated gradient, features, and CTA
 */

import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import {
  Leaf, MapPin, CloudRain, FlaskConical, Bug, TrendingUp,
  BarChart3, Database, ArrowRight, Cpu, Zap
} from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper'

// ── Feature Data ───────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: MapPin,
    title: 'GPS Field Detection',
    description: 'Auto-detect your farm location with one click or pin it precisely on the map.',
    color: 'bg-blue-100 text-blue-700',
  },
  {
    icon: CloudRain,
    title: 'Weather-Based Prediction',
    description: 'Live weather integration feeds our ML model for hyper-accurate yield forecasts.',
    color: 'bg-sage/20 text-sage-evergreen',
  },
  {
    icon: FlaskConical,
    title: 'NPK Fertilizer Calc',
    description: 'Get precise Nitrogen, Phosphorus, and Potassium recommendations for your crop and area.',
    color: 'bg-amber-100 text-amber-700',
  },
  {
    icon: Bug,
    title: 'Pest Control Rotation',
    description: 'Neem → Spinosad → Emamectin rotation scheduling to prevent resistance buildup.',
    color: 'bg-rose-100 text-rose-700',
  },
  {
    icon: TrendingUp,
    title: 'Profit Estimation',
    description: 'Full P&L breakdown including revenue, input costs, net profit, and ROI percentage.',
    color: 'bg-green-100 text-green-700',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Track yield trends, rainfall correlations, and fertilizer ratios across all your analyses.',
    color: 'bg-purple-100 text-purple-700',
  },
]

const STATS = [
  { label: 'Crop Varieties', value: '10+' },
  { label: 'AI Confidence', value: '≥ 85%' },
  { label: 'Data Points', value: '500+' },
  { label: 'Free to Use', value: '100%' },
]

// ── Floating Orbs Background ───────────────────────────────────────────
function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {[
        { w: 320, h: 320, top: '-10%', left: '-5%', delay: 0, opacity: 0.35 },
        { w: 240, h: 240, top: '60%', right: '-8%', delay: 2, opacity: 0.25 },
        { w: 180, h: 180, top: '30%', left: '60%', delay: 4, opacity: 0.20 },
        { w: 140, h: 140, top: '80%', left: '20%', delay: 1, opacity: 0.18 },
      ].map((orb, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -20, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 6 + i, repeat: Infinity, ease: 'easeInOut', delay: orb.delay }}
          className="absolute rounded-full"
          style={{
            width: orb.w,
            height: orb.h,
            top: orb.top,
            left: orb.left,
            right: orb.right,
            background: 'radial-gradient(circle, rgba(142,165,140,1) 0%, rgba(168,191,166,0.3) 70%, transparent 100%)',
            opacity: orb.opacity,
            filter: 'blur(40px)',
          }}
        />
      ))}
    </div>
  )
}

// ── Feature Card ───────────────────────────────────────────────────────
function FeatureCard({ feature, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.4, 0, 0.2, 1] }}
      className="glass-card p-6 flex flex-col gap-4 group hover:shadow-sage-lg hover:-translate-y-1
                 transition-all duration-300 cursor-default"
    >
      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${feature.color}
                       group-hover:scale-110 transition-transform duration-300`}>
        <feature.icon className="w-5 h-5" />
      </div>
      <div>
        <h3 className="font-display font-bold text-base text-sage-evergreen mb-1">{feature.title}</h3>
        <p className="font-body text-sm text-sage-moss leading-relaxed">{feature.description}</p>
      </div>
    </motion.div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <PageWrapper>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center
                           animated-bg overflow-hidden px-4 py-20">
        <FloatingOrbs />

        {/* Nav bar (inline on landing) */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-5 z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sage-evergreen/80 backdrop-blur-sm
                            flex items-center justify-center">
              <Leaf className="w-4 h-4 text-sage-hint" />
            </div>
            <span className="font-display font-bold text-lg text-sage-evergreen">
              Agri<span className="text-white/80">AI</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/analytics" className="btn-ghost text-sage-evergreen hidden sm:flex">
              Analytics
            </Link>
            <Link to="/history" className="btn-ghost text-sage-evergreen hidden sm:flex">
              History
            </Link>
            <Link to="/dashboard" className="btn-primary">
              Get Started
            </Link>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                       bg-sage-evergreen/10 backdrop-blur-sm border border-sage-evergreen/20 mb-8"
          >
            <Cpu className="w-3.5 h-3.5 text-sage-evergreen" />
            <span className="font-body text-xs font-semibold text-sage-evergreen tracking-wide">
              AI-Powered Agriculture Platform
            </span>
            <Zap className="w-3.5 h-3.5 text-sage-moss" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl
                       text-sage-evergreen leading-tight text-balance mb-6"
          >
            Farm Smarter<br />
            <span className="text-gradient">Harvest More</span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-body text-lg sm:text-xl text-sage-moss max-w-2xl mx-auto
                       leading-relaxed mb-10 text-balance"
          >
            AI-powered field analysis in seconds. Get GPS-based yield predictions,
            irrigation schedules, NPK recommendations, and profit estimates for your crop.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link to="/dashboard" className="btn-primary text-base px-8 py-4 shadow-sage-lg group">
              <Leaf className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              Analyze Field
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <Link to="/analytics" className="btn-secondary text-base px-8 py-4">
              <BarChart3 className="w-4 h-4" />
              View Analytics
            </Link>
          </motion.div>
        </div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-4 mt-20 max-w-2xl w-full mx-auto"
        >
          {STATS.map(({ label, value }) => (
            <div key={label} className="glass-card text-center px-4 py-5">
              <p className="font-display font-bold text-2xl text-sage-evergreen">{value}</p>
              <p className="font-body text-xs text-sage-moss mt-1">{label}</p>
            </div>
          ))}
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <p className="font-body text-xs text-sage-moss">Scroll to explore</p>
          <div className="w-5 h-8 rounded-full border-2 border-sage-moss/40 flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 bg-sage-moss rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-display font-extrabold text-4xl text-sage-evergreen mb-4"
          >
            Everything a Modern Farmer Needs
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="font-body text-sage-moss text-lg max-w-xl mx-auto"
          >
            From soil to sale — our AI assistant covers the complete crop lifecycle.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────── */}
      <section className="py-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center glass-card-solid px-8 py-16 rounded-3xl"
        >
          <div className="w-16 h-16 rounded-2xl bg-sage-evergreen flex items-center justify-center mx-auto mb-6">
            <Leaf className="w-8 h-8 text-sage-hint" />
          </div>
          <h2 className="font-display font-extrabold text-3xl text-sage-evergreen mb-4">
            Ready to optimize your harvest?
          </h2>
          <p className="font-body text-sage-moss text-base mb-8 max-w-md mx-auto">
            Drop a pin on your field, select your crop, and get a full AI-powered analysis in seconds.
          </p>
          <Link to="/dashboard" className="btn-primary text-base px-10 py-4 shadow-sage-lg group">
            <Leaf className="w-5 h-5" />
            Start Free Analysis
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-sage/20 py-8 px-4 text-center">
        <p className="font-body text-xs text-sage-moss">
          © {new Date().getFullYear()} AgriAI · Built with React, Flask & scikit-learn ·
          <span className="text-sage-evergreen font-medium"> Open Source</span>
        </p>
      </footer>
    </PageWrapper>
  )
}
