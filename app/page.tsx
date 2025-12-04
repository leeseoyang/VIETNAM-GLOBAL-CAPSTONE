"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { GoogleMap, useJsApiLoader, Marker, DirectionsRenderer } from "@react-google-maps/api"
import { MapPin, Navigation, LocateFixed, Route, X, ChevronUp, ChevronDown, Clock, Car } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

const libraries: ("geometry" | "places")[] = ["geometry", "places"]

const HCM_CENTER = {
  lat: 10.8231,
  lng: 106.6297,
}

const mapContainerStyle = {
  width: "100%",
  height: "100%",
}

const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
}

const POPULAR_LOCATIONS = [
  { name: "벤탄 시장", nameEn: "Ben Thanh Market", lat: 10.7725, lng: 106.698 },
  { name: "노트르담 대성당", nameEn: "Notre-Dame Cathedral", lat: 10.7797, lng: 106.699 },
  { name: "통일궁", nameEn: "Independence Palace", lat: 10.7769, lng: 106.6952 },
  { name: "탄손냣 공항", nameEn: "Tan Son Nhat Airport", lat: 10.8184, lng: 106.6588 },
  { name: "비텍스코 타워", nameEn: "Bitexco Tower", lat: 10.7718, lng: 106.7045 },
  { name: "1군", nameEn: "District 1", lat: 10.7756, lng: 106.7004 },
  { name: "푸미흥", nameEn: "Phu My Hung", lat: 10.7285, lng: 106.7181 },
  { name: "사이공역", nameEn: "Saigon Railway Station", lat: 10.7828, lng: 106.6786 },
]

export default function MapApp() {
  const [origin, setOrigin] = useState("")
  const [destination, setDestination] = useState("")
  const [originCoords, setOriginCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [destinationCoords, setDestinationCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [directionsResponse, setDirectionsResponse] = useState<any>(null)
  const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string } | null>(null)
  const [isSearchOpen, setIsSearchOpen] = useState(true)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [isLoadingRoute, setIsLoadingRoute] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false)
  const [showDestSuggestions, setShowDestSuggestions] = useState(false)

  const mapRef = useRef<any>(null)

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  })

  const onMapLoad = useCallback((map: any) => {
    mapRef.current = map
  }, [])

  const getCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setUserLocation(location)
          mapRef.current?.panTo(location)
          mapRef.current?.setZoom(15)
        },
        (error) => {
          console.error("Error getting location:", error)
          setError("위치를 가져올 수 없습니다.")
        },
      )
    }
  }, [])

  const geocodeAddress = useCallback(async (address: string): Promise<{ lat: number; lng: number } | null> => {
    if (!window.google) return null

    const popularMatch = POPULAR_LOCATIONS.find((loc) => address.includes(loc.name) || address.includes(loc.nameEn))
    if (popularMatch) {
      return { lat: popularMatch.lat, lng: popularMatch.lng }
    }

    const geocoder = new window.google.maps.Geocoder()

    try {
      const result = await geocoder.geocode({
        address: `${address}, Ho Chi Minh City, Vietnam`,
        region: "vn",
      })

      if (result.results[0]) {
        const location = result.results[0].geometry.location
        return { lat: location.lat(), lng: location.lng() }
      }
    } catch (error) {
      console.error("Geocoding error:", error)
    }

    return null
  }, [])

  const calculateRoute = useCallback(async () => {
    if (!origin || !destination) {
      setError("출발지와 도착지를 모두 입력해주세요.")
      return
    }

    setIsLoadingRoute(true)
    setError(null)

    try {
      const originResult = await geocodeAddress(origin)
      const destResult = await geocodeAddress(destination)

      if (!originResult) {
        setError("출발지를 찾을 수 없습니다.")
        setIsLoadingRoute(false)
        return
      }

      if (!destResult) {
        setError("도착지를 찾을 수 없습니다.")
        setIsLoadingRoute(false)
        return
      }

      setOriginCoords(originResult)
      setDestinationCoords(destResult)

      if (window.google) {
        const directionsService = new window.google.maps.DirectionsService()

        const result = await directionsService.route({
          origin: originResult,
          destination: destResult,
          travelMode: window.google.maps.TravelMode.DRIVING,
          region: "vn",
        })

        setDirectionsResponse(result)

        const route = result.routes[0]
        if (route && route.legs[0]) {
          const leg = route.legs[0]
          setRouteInfo({
            distance: leg.distance?.text || "알 수 없음",
            duration: leg.duration?.text || "알 수 없음",
          })
        }

        setIsSearchOpen(false)
      }
    } catch (error: any) {
      console.error("Error calculating route:", error)
      if (error.code === "ZERO_RESULTS") {
        setError("해당 경로를 찾을 수 없습니다.")
      } else if (error.code === "NOT_FOUND") {
        setError("출발지 또는 도착지를 찾을 수 없습니다.")
      } else {
        setError("경로를 찾을 수 없습니다. Directions API가 활성화되어 있는지 확인해주세요.")
      }
    } finally {
      setIsLoadingRoute(false)
    }
  }, [origin, destination, geocodeAddress])

  const clearRoute = useCallback(() => {
    setDirectionsResponse(null)
    setRouteInfo(null)
    setOrigin("")
    setDestination("")
    setOriginCoords(null)
    setDestinationCoords(null)
    setError(null)
    setIsSearchOpen(true)
  }, [])

  useEffect(() => {
    getCurrentLocation()
  }, [getCurrentLocation])

  const useCurrentLocationAsOrigin = () => {
    if (userLocation) {
      setOrigin("현재 위치")
      setOriginCoords(userLocation)
    }
  }

  const selectOriginLocation = (location: (typeof POPULAR_LOCATIONS)[0]) => {
    setOrigin(location.name)
    setOriginCoords({ lat: location.lat, lng: location.lng })
    setShowOriginSuggestions(false)
  }

  const selectDestLocation = (location: (typeof POPULAR_LOCATIONS)[0]) => {
    setDestination(location.name)
    setDestinationCoords({ lat: location.lat, lng: location.lng })
    setShowDestSuggestions(false)
  }

  if (loadError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <MapPin className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">지도를 불러올 수 없습니다</h2>
            <p className="text-muted-foreground">Google Maps API 키를 확인해주세요.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">지도 로딩 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen w-full relative overflow-hidden">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={userLocation || HCM_CENTER}
        zoom={13}
        options={mapOptions}
        onLoad={onMapLoad}
      >
        {userLocation && !directionsResponse && window.google && (
          <Marker
            position={userLocation}
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: "#3b82f6",
              fillOpacity: 1,
              strokeColor: "#ffffff",
              strokeWeight: 2,
            }}
          />
        )}

        {directionsResponse && (
          <DirectionsRenderer
            directions={directionsResponse}
            options={{
              suppressMarkers: false,
              polylineOptions: {
                strokeColor: "#3b82f6",
                strokeOpacity: 0.8,
                strokeWeight: 6,
              },
            }}
          />
        )}
      </GoogleMap>

      <div className="absolute top-0 left-0 right-0 bg-background/95 backdrop-blur-sm shadow-md z-10">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Navigation className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-foreground">HCM Navigator</h1>
              <p className="text-xs text-muted-foreground">호치민시 길찾기</p>
            </div>
          </div>
          <Button variant="outline" size="icon" onClick={getCurrentLocation} className="rounded-full bg-transparent">
            <LocateFixed className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div
        className={`absolute bottom-0 left-0 right-0 bg-background rounded-t-3xl shadow-2xl z-10 transition-transform duration-300 ${isSearchOpen ? "translate-y-0" : "translate-y-[calc(100%-80px)]"}`}
      >
        <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="w-full py-3 flex justify-center">
          <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full" />
        </button>

        {routeInfo && !isSearchOpen && (
          <div className="px-4 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-primary">
                <Clock className="w-4 h-4" />
                <span className="font-semibold">{routeInfo.duration}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Car className="w-4 h-4" />
                <span>{routeInfo.distance}</span>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setIsSearchOpen(true)}>
              {isSearchOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
            </Button>
          </div>
        )}

        <div className={`px-4 pb-6 space-y-4 ${isSearchOpen ? "block" : "hidden"}`}>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
            </div>
            <Input
              placeholder="출발지 입력"
              value={origin}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOrigin(e.target.value)}
              onFocus={() => setShowOriginSuggestions(true)}
              onBlur={() => setTimeout(() => setShowOriginSuggestions(false), 200)}
              className="pl-10 pr-10 h-12 bg-secondary border-0"
            />
            {userLocation && (
              <button
                onClick={useCurrentLocationAsOrigin}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-primary"
              >
                <LocateFixed className="w-5 h-5" />
              </button>
            )}

            {showOriginSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto z-20">
                {POPULAR_LOCATIONS.filter(
                  (loc) =>
                    loc.name.toLowerCase().includes(origin.toLowerCase()) ||
                    loc.nameEn.toLowerCase().includes(origin.toLowerCase()) ||
                    origin === "",
                ).map((location) => (
                  <button
                    key={location.nameEn}
                    onClick={() => selectOriginLocation(location)}
                    className="w-full px-4 py-3 text-left hover:bg-secondary flex items-center gap-3"
                  >
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{location.name}</p>
                      <p className="text-xs text-muted-foreground">{location.nameEn}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 px-3">
            <div className="w-0.5 h-6 bg-muted-foreground/30 ml-1" />
          </div>

          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
              <MapPin className="w-4 h-4 text-destructive" />
            </div>
            <Input
              placeholder="도착지 입력"
              value={destination}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDestination(e.target.value)}
              onFocus={() => setShowDestSuggestions(true)}
              onBlur={() => setTimeout(() => setShowDestSuggestions(false), 200)}
              className="pl-10 h-12 bg-secondary border-0"
            />

            {showDestSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto z-20">
                {POPULAR_LOCATIONS.filter(
                  (loc) =>
                    loc.name.toLowerCase().includes(destination.toLowerCase()) ||
                    loc.nameEn.toLowerCase().includes(destination.toLowerCase()) ||
                    destination === "",
                ).map((location) => (
                  <button
                    key={location.nameEn}
                    onClick={() => selectDestLocation(location)}
                    className="w-full px-4 py-3 text-left hover:bg-secondary flex items-center gap-3"
                  >
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{location.name}</p>
                      <p className="text-xs text-muted-foreground">{location.nameEn}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {error && <p className="text-sm text-destructive text-center">{error}</p>}

          <div className="flex gap-3 pt-2">
            {directionsResponse ? (
              <Button variant="outline" className="flex-1 h-12 bg-transparent" onClick={clearRoute}>
                <X className="w-4 h-4 mr-2" />
                초기화
              </Button>
            ) : (
              <Button
                className="flex-1 h-12 bg-primary hover:bg-primary/90"
                onClick={calculateRoute}
                disabled={isLoadingRoute}
              >
                {isLoadingRoute ? (
                  <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Route className="w-4 h-4 mr-2" />
                    경로 찾기
                  </>
                )}
              </Button>
            )}
          </div>

          {routeInfo && (
            <Card className="bg-secondary border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">예상 소요 시간</p>
                    <p className="text-2xl font-bold text-foreground">{routeInfo.duration}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">총 거리</p>
                    <p className="text-2xl font-bold text-foreground">{routeInfo.distance}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="pt-2">
            <p className="text-sm text-muted-foreground mb-2">인기 장소</p>
            <div className="flex flex-wrap gap-2">
              {POPULAR_LOCATIONS.slice(0, 5).map((location) => (
                <Button
                  key={location.nameEn}
                  variant="outline"
                  size="sm"
                  className="rounded-full text-xs bg-transparent"
                  onClick={() => {
                    setDestination(location.name)
                    setDestinationCoords({ lat: location.lat, lng: location.lng })
                  }}
                >
                  {location.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
