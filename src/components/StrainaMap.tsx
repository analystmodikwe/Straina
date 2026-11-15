import { divIcon, type DivIcon } from 'leaflet'
import { MapContainer, Marker, TileLayer, Tooltip } from 'react-leaflet'
import { MESSAGES } from '../lib/messages'
import type { MapArea } from '../lib/mapData'
import { PIN_LABELS, PIN_ORDER, PIN_SIZE, pinHtml, type PinStatus } from '../lib/mapPins'

// Built once so markers are not re-created on every render.
const ICONS = Object.fromEntries(
  PIN_ORDER.map((status) => [
    status,
    divIcon({
      className: '',
      html: pinHtml(status),
      iconSize: [PIN_SIZE, PIN_SIZE],
      iconAnchor: [PIN_SIZE / 2, PIN_SIZE / 2],
    }),
  ]),
) as Record<PinStatus, DivIcon>

interface StrainaMapProps {
  areas: MapArea[]
  onSelectArea: (areaCode: string) => void
}

export function StrainaMap({ areas, onSelectArea }: StrainaMapProps) {
  const bounds = areas.map((a) => [a.latitude, a.longitude] as [number, number])

  return (
    <div role="region" aria-label="Antimicrobial resistance map" className="h-map w-full">
      <MapContainer
        center={[-28.5, 24.7]}
        zoom={5}
        bounds={bounds.length ? bounds : undefined}
        boundsOptions={{ padding: [40, 40], maxZoom: 9 }}
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {areas.map((area) => (
          <Marker
            key={`${area.area_code}-${area.status}`}
            position={[area.latitude, area.longitude]}
            icon={ICONS[area.status]}
            title={`${area.area_name}: ${PIN_LABELS[area.status]}`}
            eventHandlers={{ click: () => onSelectArea(area.area_code) }}
          >
            <Tooltip direction="top" offset={[0, -12]} permanent={area.status === 'potential_hotspot'}>
              <span data-testid={`pin-${area.area_code}`} data-status={area.status} className="block text-xs font-medium">
                <strong className="block">{area.area_name}</strong>
                <span className="block">{PIN_LABELS[area.status]}</span>
                {area.status === 'insufficient_data' && <span className="block">{MESSAGES.ERR5}</span>}
                {area.status === 'no_data' && <span className="block">{MESSAGES.ERR2}</span>}
                {area.resistance_pct !== null && area.status !== 'insufficient_data' && (
                  <span className="block tabular-nums">{area.resistance_pct.toFixed(1)}% resistant</span>
                )}
              </span>
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}