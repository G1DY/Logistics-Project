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
import { getCoordinates } from "../lib/geocode";
import axios from "axios";
import L from "leaflet";
import { Card, CardContent } from "../Components/ui/card";
import { ScrollArea } from "../Components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { useLocation } from "react-router-dom"; // Importing useLocation for route params

interface RouteMapProps {
  pickup: string;
  dropoff: string;
}

interface Instruction {
  instruction: string;
  distance?: number;
  name?: string;
}

const formatInstruction = (step: string | Instruction, index: number) => {
  if (typeof step === "string") return `${index + 1}. ${step}`;
  if (!step || typeof step.instruction !== "string")
    return `${index + 1}. No instruction available`;

  const { instruction, distance, name } = step;
  const roadName = name && name.trim() ? name : "Unnamed road";
  const meters = distance ? Math.round(distance) : 0;

  if (instruction.startsWith("Proceed on") && distance) {
    return `Continue for ${meters} meters on ${roadName}`;
  }

  return `${index + 1}. ${instruction}`;
};

const RouteMap = ({ pickup, dropoff }: RouteMapProps) => {
  const location = useLocation(); // Get location state, which contains driverId and truckId
  const driverId = location.state?.driverId; // Extract driverId from location.state
  const truckId = location.state?.truckId; // Extract truckId from location.state
  console.log({ driverId, truckId });
  if (!driverId || !truckId) {
    return (
      <p className="text-center text-red-500">Missing driverId or truckId.</p>
    );
  }

  const [pickupCoords, setPickupCoords] = useState<LatLngTuple | null>(null);
  const [dropoffCoords, setDropoffCoords] = useState<LatLngTuple | null>(null);
  const [route, setRoute] = useState<LatLngTuple[]>([]);
  const [distance, setDistance] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [instructions, setInstructions] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCoordinatesAndRoute = useCallback(async () => {
    if (!pickup || !dropoff || !driverId || !truckId) {
      console.error(
        "Missing required parameters: pickup, dropoff, driverId, or truckId."
      );
      setError("Missing required parameters.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const [pickupLatLng, dropoffLatLng] = await Promise.all([
        getCoordinates(pickup),
        getCoordinates(dropoff),
      ]);
      console.log("Pickup:", pickupLatLng);
      console.log("Dropoff:", dropoffLatLng);

      if (!pickupLatLng || !dropoffLatLng) {
        console.error("Invalid coordinates received.");

        throw new Error("Invalid locations. Could not fetch coordinates.");
      }

      setPickupCoords(pickupLatLng);
      setDropoffCoords(dropoffLatLng);

      const payload = {
        start_lng: pickupLatLng[1],
        start_lat: pickupLatLng[0],
        end_lng: dropoffLatLng[1],
        end_lat: dropoffLatLng[0],
        driver_id: driverId,
        truck_id: truckId,
      };
      // Get the Bearer token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in localStorage.");
        setError("Authentication token not found.");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        "http://127.0.0.1:8000/calculate_route/",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token here
          },
        }
      );
      console.log("Backend Response:", response);

      const routeData = response.data;
      if (!routeData.route) throw new Error("Route data is empty.");

      setRoute(
        routeData.route.coordinates.map(
          ([lng, lat]: [number, number]) => [lat, lng] as LatLngTuple
        )
      );

      setDistance(`${(routeData.distance / 1000).toFixed(2)} km`);
      setDuration(`${(routeData.duration / 60).toFixed(1)} mins`);

      setInstructions(
        routeData.instructions.map((step: any, index: number) =>
          formatInstruction(step, index)
        )
      );
    } catch (err: any) {
      setError(err.message || "Error fetching route. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [pickup, dropoff, driverId, truckId]);

  useEffect(() => {
    fetchCoordinatesAndRoute();
  }, [fetchCoordinatesAndRoute]);

  return (
    <div className="flex flex-col items-center space-y-6 w-full max-w-4xl mx-auto mt-16">
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

      {instructions.length > 0 && (
        <Card className="w-full max-w-lg shadow-md mt-4">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-2">Route Instructions</h3>
            <ScrollArea className="h-[200px] overflow-y-auto border border-gray-200 p-2 rounded-md">
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                {instructions.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const AutoFitBounds = ({ route }: { route: LatLngTuple[] }) => {
  const map = useMap();
  useEffect(() => {
    if (route.length > 0) {
      map.fitBounds(L.latLngBounds(route), { padding: [50, 50] });
    }
  }, [route, map]);
  return null;
};

const MarkerWithTooltip = ({
  position,
  label,
}: {
  position: LatLngTuple | null;
  label: string;
}) => {
  return position ? (
    <Marker position={position}>
      <Tooltip direction="top" offset={[0, -10]} opacity={1}>
        <span>{label}</span>
      </Tooltip>
    </Marker>
  ) : null;
};

export default RouteMap;
