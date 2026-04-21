/**
 * MapView - Interactive Leaflet map with GPS detection and draggable marker
 */

import React, { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet'
import { motion } from 'framer-motion'
import { Navigation, MapPin, Loader2 } from 'lucide-react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix Leaflet default icon path issue with bundlers
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// Custom sage-green marker
const createCustomIcon = () =>
  L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: 36px; height: 36px;
        background: #344C3D;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid #BFCFBB;
        box-shadow: 0 4px 16px rgba(52,76,61,0.4);
        display:flex; align-items:center; justify-content:center;
      ">
        <div style="
          width: 10px; height: 10px;
          background: #A8BFA6;
          border-radius: 50%;
          transform: rotate(45deg);
        "></div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -40],
  })

// Component to fly the map to a new center
function FlyToLocation({ location }) {
  const map = useMap()
  useEffect(() => {
    if (location) {
      map.flyTo([location.lat, location.lng], 13, { duration: 1.5 })
    }
  }, [location, map])
  return null
}

// Click handler inside the map
function MapClickHandler({ onLocationChange }) {
  useMapEvents({
    click(e) {
      onLocationChange(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

export default function MapView({ location, onLocationChange, loadingGPS }) {
  const markerRef = useRef(null)
  const customIcon = createCustomIcon()

  const eventHandlers = {
    dragend() {
      const marker = markerRef.current
      if (marker) {
        const { lat, lng } = marker.getLatLng()
        onLocationChange(lat, lng)
      }
    },
  }

  return (
    <div className="relative w-full h-full">
      {/* GPS Loading Overlay */}
      {loadingGPS && (
        <div className="absolute inset-0 z-[1000] flex items-center justify-center
                        bg-sage-hint/70 backdrop-blur-sm rounded-2xl">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-sage-evergreen animate-spin" />
            <p className="font-body text-sm text-sage-evergreen font-medium">
              Detecting location…
            </p>
          </div>
        </div>
      )}

      <MapContainer
        center={[location.lat, location.lng]}
        zoom={12}
        className="w-full h-full"
        style={{ borderRadius: '1rem', zIndex: 1 }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FlyToLocation location={location} />
        <MapClickHandler onLocationChange={onLocationChange} />

        <Marker
          position={[location.lat, location.lng]}
          draggable={true}
          eventHandlers={eventHandlers}
          ref={markerRef}
          icon={customIcon}
        >
          <Popup>
            <div className="font-body text-sage-evergreen p-1">
              <p className="font-semibold text-sm mb-1">📍 Field Location</p>
              <p className="text-xs text-sage-moss">
                Lat: {location.lat.toFixed(6)}<br />
                Lng: {location.lng.toFixed(6)}
              </p>
              <p className="text-xs text-sage-moss mt-1 italic">
                Drag to reposition
              </p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>

      {/* Coordinate Display */}
      <div className="absolute bottom-3 left-3 z-[500]">
        <div className="glass-card px-3 py-2 flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-sage-moss shrink-0" />
          <span className="font-mono text-xs text-sage-evergreen">
            {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
          </span>
        </div>
      </div>

      {/* Click hint */}
      <div className="absolute top-3 right-3 z-[500]">
        <div className="glass-card px-3 py-1.5">
          <span className="font-body text-xs text-sage-moss">
            Click map or drag marker to set field
          </span>
        </div>
      </div>
    </div>
  )
}
