import { useCallback, useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icons
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({ iconUrl: markerIcon, iconRetinaUrl: markerIcon2x, shadowUrl: markerShadow });

// ─── Types ───────────────────────────────────────────────────────────────────

export interface LocationResult {
  latitude: number;
  longitude: number;
  address: string;
}

interface Props {
  onLocationChange?: (location: LocationResult) => void;
  defaultCenter?: [number, number];
}

// ─── Inner Map Event Handler ──────────────────────────────────────────────────

function MapClickHandler({ onClick }: { onClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ShippingAddressMap({ onLocationChange, defaultCenter = [30.5, 31.2] }: Props) {
  const [position, setPosition] = useState<[number, number]>(defaultCenter);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const mapRef = useRef<L.Map | null>(null);
  const lastFetchedRef = useRef<string>('');
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    const key = `${lat.toFixed(5)},${lng.toFixed(5)}`;
    if (key === lastFetchedRef.current) return;
    lastFetchedRef.current = key;

    setLoading(true);
    setError('');
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
        { headers: { 'Accept-Language': 'ar' } }
      );
      const json = await res.json();
      const addr: string = json.display_name ?? 'عنوان غير معروف';
      setAddress(addr);
      onLocationChange?.({ latitude: lat, longitude: lng, address: addr });
    } catch {
      setError('تعذّر جلب العنوان. تحقق من اتصالك بالإنترنت.');
    } finally {
      setLoading(false);
    }
  }, [onLocationChange]);

  const scheduleGeocode = useCallback((lat: number, lng: number) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => reverseGeocode(lat, lng), 500);
  }, [reverseGeocode]);

  const handlePositionChange = useCallback((lat: number, lng: number) => {
    setPosition([lat, lng]);
    scheduleGeocode(lat, lng);
  }, [scheduleGeocode]);

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setError('المتصفح لا يدعم تحديد الموقع.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const { latitude, longitude } = coords;
        setPosition([latitude, longitude]);
        mapRef.current?.flyTo([latitude, longitude], 15, { duration: 1.2 });
        scheduleGeocode(latitude, longitude);
      },
      () => setError('لم يتم السماح بالوصول إلى الموقع.')
    );
  };

  useEffect(() => {
    scheduleGeocode(defaultCenter[0], defaultCenter[1]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full rounded-2xl overflow-hidden shadow-md border border-gray-100 bg-white">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-base font-bold text-gray-800">📍 اختر عنوان الشحن</h2>
        <button
          onClick={handleUseMyLocation}
          className="flex items-center gap-1.5 text-sm bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium px-4 py-2 rounded-xl transition-all duration-200 hover:shadow-sm active:scale-95"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
          </svg>
          استخدام موقعي الحالي
        </button>
      </div>

      {/* Map */}
      <div style={{ height: 400 }}>
        <MapContainer
          center={position}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          ref={mapRef as any}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <MapClickHandler onClick={handlePositionChange} />
          <Marker
            position={position}
            draggable
            eventHandlers={{
              dragend(e) {
                const { lat, lng } = (e.target as L.Marker).getLatLng();
                handlePositionChange(lat, lng);
              },
            }}
          />
        </MapContainer>
      </div>

      {/* Address Result */}
      <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 min-h-[72px] flex items-start gap-3">
        {loading ? (
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <svg className="animate-spin w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
            </svg>
            جاري تحديد العنوان...
          </div>
        ) : error ? (
          <div className="flex items-center gap-2 text-red-500 text-sm">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z"/>
            </svg>
            {error}
          </div>
        ) : address ? (
          <div className="flex items-start gap-2">
            <svg className="w-4 h-4 mt-0.5 text-blue-500 shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
            </svg>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">العنوان الحالي</p>
              <p className="text-sm text-gray-700 font-medium leading-snug">{address}</p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
