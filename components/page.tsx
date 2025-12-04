"use client"

import { useState, useEffect } from "react"
import SplashScreen from "@/components/splash-screen"
import MapApp from "@/components/map-app"

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <SplashScreen />
  }

  return <MapApp />
}
