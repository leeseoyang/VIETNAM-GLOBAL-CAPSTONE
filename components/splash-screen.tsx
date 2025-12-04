"use client"

import { MapPin, Navigation } from "lucide-react"

export default function SplashScreen() {
  return (
    <div className="min-h-screen bg-primary flex flex-col items-center justify-center">
      <div className="relative">
        {/* Animated circles */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full border-4 border-primary-foreground/20 animate-ping" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full border-4 border-primary-foreground/30 animate-pulse" />
        </div>

        {/* Logo */}
        <div className="relative z-10 w-20 h-20 bg-primary-foreground rounded-full flex items-center justify-center shadow-2xl">
          <Navigation className="w-10 h-10 text-primary" />
        </div>
      </div>

      <div className="mt-8 text-center">
        <h1 className="text-3xl font-bold text-primary-foreground tracking-tight">HCM Navigator</h1>
        <p className="mt-2 text-primary-foreground/80 flex items-center gap-2 justify-center">
          <MapPin className="w-4 h-4" />
          호치민시 길찾기
        </p>
      </div>

      {/* Loading indicator */}
      <div className="mt-12 flex gap-2">
        <div className="w-3 h-3 bg-primary-foreground/60 rounded-full animate-bounce [animation-delay:-0.3s]" />
        <div className="w-3 h-3 bg-primary-foreground/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
        <div className="w-3 h-3 bg-primary-foreground/60 rounded-full animate-bounce" />
      </div>
    </div>
  )
}
