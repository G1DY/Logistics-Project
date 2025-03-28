import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const tripSchema = z.object({
  currentLocation: z.string().min(1, "Required"),
  pickupLocation: z.string().min(1, "Required"),
  dropoffLocation: z.string().min(1, "Required"),
  cycleUsed: z.number().min(0, "Must be a valid number"),
});

type TripFormData = z.infer<typeof tripSchema>;

const TripDetailsForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TripFormData>({
    resolver: zodResolver(tripSchema),
  });

  const onSubmit = (data: TripFormData) => {
    console.log("Trip Details:", data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg space-y-4"
    >
      <h2 className="text-xl font-semibold text-center">Trip Details</h2>

      <div>
        <label className="block text-sm font-medium">Current Location</label>
        <Input
          {...register("currentLocation")}
          placeholder="Enter current location"
        />
        {errors.currentLocation && (
          <p className="text-red-500 text-sm">
            {errors.currentLocation.message}
          </p>
        )}
      </div>

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

      <div>
        <label className="block text-sm font-medium">
          Current Cycle Used (Hrs)
        </label>
        <Input
          type="number"
          {...register("cycleUsed", { valueAsNumber: true })}
          placeholder="Enter hours used"
          onChange={(e) => {
            const value = e.target.value;
            if (value === "") e.target.value = "0"; // Prevent NaN issues
          }}
        />
        {errors.cycleUsed && (
          <p className="text-red-500 text-sm">{errors.cycleUsed.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full">
        Submit
      </Button>
    </form>
  );
};

export default TripDetailsForm;
