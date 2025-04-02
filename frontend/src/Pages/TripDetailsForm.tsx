import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "../Components/ui/input";
import { Button } from "../Components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import RouteMap from "./RouteMap";

const tripSchema = z.object({
  pickupLocation: z.string().min(1, "Required"),
  dropoffLocation: z.string().min(1, "Required"),
});

type TripFormData = z.infer<typeof tripSchema>;

const TripDetailsForm = () => {
  const [trip, setTrip] = useState<{ pickup: string; dropoff: string } | null>(
    null
  );
  const [loadingLocation, setLoadingLocation] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TripFormData>({
    resolver: zodResolver(tripSchema),
  });

  // Function to fetch user's current location
  const fetchCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log("Coordinates:", latitude, longitude);

        // Reverse Geocode using OpenStreetMap Nominatim API
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await response.json();
          const address = data.display_name || "Unknown location";
          setValue("pickupLocation", address); // Autofill the input
        } catch (error) {
          console.error("Error fetching location:", error);
          alert("Failed to fetch location. Please try again.");
        } finally {
          setLoadingLocation(false);
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Could not retrieve location.");
        setLoadingLocation(false);
      }
    );
  };

  const onSubmit = (data: TripFormData) => {
    setTrip({ pickup: data.pickupLocation, dropoff: data.dropoffLocation });
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-lg w-full p-6 bg-white shadow-lg rounded-lg space-y-4"
      >
        <h2 className="text-xl font-semibold text-center">Plan Your Trip</h2>

        {/* Pickup Location with Current Location Button */}
        <div>
          <label className="block text-sm font-medium">Pickup Location</label>
          <div className="flex space-x-2">
            <Input
              {...register("pickupLocation")}
              placeholder="Enter pickup location"
            />
            <Button
              type="button"
              onClick={fetchCurrentLocation}
              disabled={loadingLocation}
            >
              {loadingLocation ? "Fetching..." : "Use Current Location"}
            </Button>
          </div>
          {errors.pickupLocation && (
            <p className="text-red-500 text-sm">
              {errors.pickupLocation.message}
            </p>
          )}
        </div>

        {/* Dropoff Location */}
        <div>
          <label className="block text-sm font-medium">Dropoff Location</label>
          <Input
            {...register("dropoffLocation")}
            placeholder="Enter dropoff location"
          />
          {errors.dropoffLocation && (
            <p className="text-red-500 text-sm">
              {errors.dropoffLocation.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full">
          Show Route
        </Button>
      </form>

      {trip && <RouteMap pickup={trip.pickup} dropoff={trip.dropoff} />}
    </div>
  );
};

export default TripDetailsForm;
