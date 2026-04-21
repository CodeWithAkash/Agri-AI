/**
 * useCounter - Animated number counter hook
 */

import { useState, useEffect, useRef } from 'react'

export const useCounter = (target, duration = 1200, start = true) => {
  const [count, setCount] = useState(0)
  const frameRef = useRef(null)

  useEffect(() => {
    if (!start || target === 0) {
      setCount(target)
      return
    }

    const startTime = performance.now()
    const startValue = 0

    const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4)

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easeOutQuart(progress)

      setCount(Math.round(startValue + (target - startValue) * easedProgress))

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate)
      }
    }

    frameRef.current = requestAnimationFrame(animate)

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [target, duration, start])

  return count
}
