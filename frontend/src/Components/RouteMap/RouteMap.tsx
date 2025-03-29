import { useEffect, useState, useRef, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Tooltip,
  useMap,
} from "react-leaflet";
import { LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";
import { getCoordinates } from "../../lib/geocode";
import axios from "axios";
import L from "leaflet";

interface RouteMapProps {
  pickup: string;
  dropoff: string;
}

const RouteMap = ({ pickup, dropoff }: RouteMapProps) => {
  const [pickupCoords, setPickupCoords] = useState<LatLngTuple | null>(null);
  const [dropoffCoords, setDropoffCoords] = useState<LatLngTuple | null>(null);
  const [route, setRoute] = useState<LatLngTuple[]>([]);
  const [distance, setDistance] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [instructions, setInstructions] = useState<string[]>([]); // NEW: For route steps
  const mapRef = useRef<L.Map | null>(null);

  const fetchCoordinatesAndRoute = useCallback(async () => {
    if (!pickup || !dropoff) return;

    try {
      const [pickupLatLng, dropoffLatLng] = await Promise.all([
        getCoordinates(pickup),
        getCoordinates(dropoff),
      ]);

      if (!pickupLatLng || !dropoffLatLng) {
        console.error("Invalid locations: Could not fetch coordinates.");
        return;
      }

      setPickupCoords(pickupLatLng);
      setDropoffCoords(dropoffLatLng);

      console.log("Pickup Coordinates:", pickupLatLng);
      console.log("Dropoff Coordinates:", dropoffLatLng);

      // Fetch route data including step-by-step instructions
      const response = await axios.get(
        `https://router.project-osrm.org/route/v1/driving/${pickupLatLng[1]},${pickupLatLng[0]};${dropoffLatLng[1]},${dropoffLatLng[0]}?overview=full&geometries=geojson&steps=true`
      );

      const routeData = response.data.routes[0];
      if (routeData) {
        const coords = routeData.geometry.coordinates.map(
          ([lng, lat]: [number, number]) => [lat, lng] as LatLngTuple
        );

        console.log("Route Coordinates:", coords);

        setRoute(coords);
        setDistance((routeData.distance / 1000).toFixed(2) + " km");
        setDuration((routeData.duration / 60).toFixed(1) + " mins");

        // Extract and store step-by-step instructions
        const steps = routeData.legs[0].steps.map(
          (step: any) => step.maneuver.instruction
        );
        setInstructions(steps);
      } else {
        console.error("Route data is empty.");
      }
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  }, [pickup, dropoff]);

  useEffect(() => {
    fetchCoordinatesAndRoute();
  }, [fetchCoordinatesAndRoute]);

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="w-full h-[500px] relative rounded-lg overflow-hidden shadow-lg z-[-10]">
        {pickupCoords ? (
          <MapContainer
            center={pickupCoords}
            zoom={6}
            className="h-full w-full"
            ref={mapRef}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {route.length > 0 && (
              <Polyline positions={route} color="blue" weight={5} />
            )}

            <MarkerWithTooltip position={pickupCoords} label={pickup} />
            <MarkerWithTooltip position={dropoffCoords} label={dropoff} />

            <AutoFitBounds route={route} />
          </MapContainer>
        ) : (
          <p className="text-center text-gray-500">Loading map...</p>
        )}

        {distance && duration && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white p-3 rounded-lg shadow-md text-sm font-medium">
            <p className="text-gray-700">
              <strong>Distance:</strong> {distance}
            </p>
            <p className="text-gray-700">
              <strong>Duration:</strong> {duration}
            </p>
          </div>
        )}
      </div>

      {/* Route Instructions Section */}
      {instructions.length > 0 && (
        <div className="p-4 bg-white shadow-md rounded-lg max-w-lg w-full">
          <h3 className="text-lg font-semibold">Route Instructions</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            {instructions.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// Auto-fit map bounds to the route
const AutoFitBounds = ({ route }: { route: LatLngTuple[] }) => {
  const map = useMap();

  useEffect(() => {
    if (route.length > 0) {
      const bounds = L.latLngBounds(route);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [route, map]);

  return null;
};

// Custom marker component with tooltip
const MarkerWithTooltip = ({
  position,
  label,
}: {
  position: LatLngTuple | null;
  label: string;
}) => {
  if (!position) return null;

  return (
    <Marker position={position}>
      <Tooltip direction="top" offset={[0, -10]} opacity={1}>
        <span>{label}</span>
      </Tooltip>
    </Marker>
  );
};

export default RouteMap;
