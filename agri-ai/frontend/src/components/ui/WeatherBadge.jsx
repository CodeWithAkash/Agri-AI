/**
 * WeatherBadge - Displays current weather data from API
 */

import React from 'react'
import { motion } from 'framer-motion'
import { Thermometer, Droplets, Wind, CloudRain } from 'lucide-react'

function WeatherStat({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon className="w-3.5 h-3.5 text-sage-moss shrink-0" />
      <span className="font-body text-xs text-sage-moss">{label}:</span>
      <span className="font-body text-xs font-semibold text-sage-evergreen">{value}</span>
    </div>
  )
}

export default function WeatherBadge({ weather }) {
  if (!weather) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="glass-card px-4 py-3"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">🌤</span>
        <div>
          <p className="font-body text-xs font-semibold text-sage-evergreen">
            {weather.city ? `${weather.city}, ` : ''}{weather.description}
          </p>
          {weather.source === 'simulated' && (
            <p className="font-body text-[10px] text-sage-moss italic">
              Simulated data (add API key for real weather)
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        <WeatherStat icon={Thermometer} label="Temp" value={`${weather.temperature}°C`} />
        <WeatherStat icon={Droplets} label="Humidity" value={`${weather.humidity_percent}%`} />
        <WeatherStat icon={CloudRain} label="Rainfall" value={`${weather.rainfall_annual_mm}mm/yr`} />
        <WeatherStat icon={Wind} label="Wind" value={`${weather.wind_speed_kmh} km/h`} />
      </div>
    </motion.div>
  )
}
