import { useEffect, useState, useCallback } from "react";
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
import { Card, CardContent } from "../../Components/ui/card"; // ShadCN UI
import { ScrollArea } from "../../Components/ui/scroll-area"; // For smooth scrolling
import { Loader2 } from "lucide-react"; // For loading state

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
  const [instructions, setInstructions] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCoordinatesAndRoute = useCallback(async () => {
    if (!pickup || !dropoff) return;
    setLoading(true);
    setError("");

    try {
      // First, get the geocoded coordinates from your helper
      const [pickupLatLng, dropoffLatLng] = await Promise.all([
        getCoordinates(pickup),
        getCoordinates(dropoff),
      ]);

      if (!pickupLatLng || !dropoffLatLng) {
        setError("Invalid locations. Could not fetch coordinates.");
        setLoading(false);
        return;
      }

      setPickupCoords(pickupLatLng);
      setDropoffCoords(dropoffLatLng);

      // Prepare payload for your backend endpoint
      // Note: getCoordinates returns [lat, lng] so we flip them for backend
      const payload = {
        start_lng: pickupLatLng[1],
        start_lat: pickupLatLng[0],
        end_lng: dropoffLatLng[1],
        end_lat: dropoffLatLng[0],
      };

      // Call your backend to calculate the route
      const response = await axios.post(
        "http://127.0.0.1:8000/calculate_route/",
        payload
      );

      const routeData = response.data;
      if (!routeData.route) {
        setError("Route data is empty.");
        setLoading(false);
        return;
      }

      // Convert coordinates from [lng, lat] to [lat, lng]
      const convertedRoute = routeData.route.coordinates.map(
        ([lng, lat]: [number, number]) => [lat, lng] as LatLngTuple
      );
      setRoute(convertedRoute);

      // Convert distance (meters to km) and duration (seconds to minutes)
      if (routeData.distance) {
        setDistance((routeData.distance / 1000).toFixed(2) + " km");
      }
      if (routeData.duration) {
        setDuration((routeData.duration / 60).toFixed(1) + " mins");
      }
      if (routeData.instructions) {
        setInstructions(routeData.instructions);
      }
    } catch (err) {
      setError("Error fetching route. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [pickup, dropoff]);

  useEffect(() => {
    fetchCoordinatesAndRoute();
  }, [fetchCoordinatesAndRoute]);

  return (
    <div className="flex flex-col items-center space-y-6 w-full max-w-4xl mx-auto z-[-10]">
      {/* Map Container */}
      <div className="w-full h-[500px] relative rounded-lg overflow-hidden shadow-lg border border-gray-200">
        {error && <p className="text-center text-red-500">{error}</p>}

        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="animate-spin w-8 h-8 text-gray-500" />
          </div>
        ) : pickupCoords ? (
          <MapContainer
            center={pickupCoords}
            zoom={6}
            className="h-full w-full"
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
          <p className="text-center text-gray-500">Could not load the map.</p>
        )}

        {/* Route Details */}
        {distance && duration && (
          <Card className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white p-3 rounded-lg shadow-md text-sm font-medium">
            <CardContent className="p-2">
              <p className="text-gray-700">
                <strong>Distance:</strong> {distance}
              </p>
              <p className="text-gray-700">
                <strong>Duration:</strong> {duration}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Route Instructions Section */}
      {Array.isArray(instructions) && instructions.length > 0 ? (
        <Card className="w-full max-w-lg shadow-md mt-4">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-2">
              {typeof instructions === "string"
                ? instructions
                : "Invalid instruction format"}
            </h3>
            <ScrollArea className="h-[200px] overflow-y-auto border border-gray-200 p-2 rounded-md">
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                {instructions.map((instruction, index) => (
                  <li key={index}>
                    {instruction || "No instruction available"}
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </CardContent>
        </Card>
      ) : (
        <p>No route instructions available.</p>
      )}
    </div>
  );
};

// Auto-fit map bounds to the route
const AutoFitBounds = ({ route }: { route: LatLngTuple[] }) => {
  const map = useMap();

  useEffect(() => {
    if (route.length > 0) {
      setTimeout(() => {
        map.fitBounds(L.latLngBounds(route), { padding: [50, 50] });
      }, 500);
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
