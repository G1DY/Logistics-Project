import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import RouteMap from "../RouteMap/RouteMap";

const tripSchema = z.object({
  pickupLocation: z.string().min(1, "Required"),
  dropoffLocation: z.string().min(1, "Required"),
});

type TripFormData = z.infer<typeof tripSchema>;

const TripDetailsForm = () => {
  const [trip, setTrip] = useState<{ pickup: string; dropoff: string } | null>(
    null
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TripFormData>({
    resolver: zodResolver(tripSchema),
  });

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

        <div>
          <label className="block text-sm font-medium">Pickup Location</label>
          <Input
            {...register("pickupLocation")}
            placeholder="Enter pickup location"
          />
          {errors.pickupLocation && (
            <p className="text-red-500 text-sm">
              {errors.pickupLocation.message}
            </p>
          )}
        </div>

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
