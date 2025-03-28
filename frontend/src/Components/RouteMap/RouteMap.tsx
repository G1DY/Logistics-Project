import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
} from "react-leaflet";
import { LatLngTuple, Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { getCoordinates } from "../../lib/geocode";
import axios from "axios";

interface RouteMapProps {
  pickup: string;
  dropoff: string;
}

const pickupIcon = new Icon({
  iconUrl: "/icons/pickup-marker.png",
  iconSize: [32, 32],
});

const dropoffIcon = new Icon({
  iconUrl: "/icons/dropoff-marker.png",
  iconSize: [32, 32],
});

const RouteMap = ({ pickup, dropoff }: RouteMapProps) => {
  const [pickupCoords, setPickupCoords] = useState<LatLngTuple | null>(null);
  const [dropoffCoords, setDropoffCoords] = useState<LatLngTuple | null>(null);
  const [route, setRoute] = useState<LatLngTuple[]>([]);
  const [tripInfo, setTripInfo] = useState<{
    distance: number;
    duration: number;
  } | null>(null);

  useEffect(() => {
    const fetchCoordinatesAndRoute = async () => {
      if (!pickup || !dropoff) return;

      try {
        const pickupLatLng = await getCoordinates(pickup);
        const dropoffLatLng = await getCoordinates(dropoff);

        if (!pickupLatLng || !dropoffLatLng) {
          console.error("Invalid locations: Could not fetch coordinates.");
          return;
        }

        setPickupCoords(pickupLatLng);
        setDropoffCoords(dropoffLatLng);

        const response = await axios.get(
          `https://router.project-osrm.org/route/v1/driving/${pickupLatLng[1]},${pickupLatLng[0]};${dropoffLatLng[1]},${dropoffLatLng[0]}?overview=full&geometries=geojson`
        );

        const coords = response.data.routes[0].geometry.coordinates.map(
          ([lng, lat]: [number, number]) => [lat, lng] as LatLngTuple
        );

        setRoute(coords);
        setTripInfo({
          distance: response.data.routes[0].distance / 1000, // Convert to km
          duration: response.data.routes[0].duration / 60, // Convert to minutes
        });
      } catch (error) {
        console.error("Error fetching route:", error);
      }
    };

    fetchCoordinatesAndRoute();
  }, [pickup, dropoff]);

  if (!pickupCoords)
    return <p className="text-center text-gray-500">Loading map...</p>;

  return (
    <div className="flex flex-col items-center space-y-2 ml-4 mr-4 min-h-screen m-auto bg-gray-100 rounded-lg shadow-md">
      {/* <h2 className="text-lg font-semibold">Route Map</h2> */}
      <MapContainer
        center={pickupCoords}
        zoom={8}
        className="h-96 w-full rounded-lg"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {route.length > 0 && (
          <Polyline positions={route} color="blue" weight={5} />
        )}
        {pickupCoords && (
          <Marker position={pickupCoords} icon={pickupIcon}>
            <Popup>Pickup Location: {pickup}</Popup>
          </Marker>
        )}
        {dropoffCoords && (
          <Marker position={dropoffCoords} icon={dropoffIcon}>
            <Popup>Dropoff Location: {dropoff}</Popup>
          </Marker>
        )}
      </MapContainer>
      {tripInfo && (
        <div className="bg-white p-3 rounded-lg shadow-md w-full text-center">
          <p className="text-gray-700">
            Distance: {tripInfo.distance.toFixed(2)} km
          </p>
          <p className="text-gray-700">
            Estimated Duration: {tripInfo.duration.toFixed(0)} min
          </p>
        </div>
      )}
    </div>
  );
};

export default RouteMap;
