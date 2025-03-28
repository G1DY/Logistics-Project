import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";

const schema = yup.object().shape({
  start_lng: yup.number().required("Start longitude is required"),
  start_lat: yup.number().required("Start latitude is required"),
  end_lng: yup.number().required("End longitude is required"),
  end_lat: yup.number().required("End latitude is required"),
});

const RouteForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/calculate-route/",
        data
      );
      alert("Route Calculated Successfully!");
      console.log(response.data);
    } catch (error: any) {
      console.error("Error:", error.response?.data || error.message);
    }
  };
  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Calculate Route</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-medium">Start Longitude</label>
          <input
            type="number"
            {...register("start_lng")}
            className="w-full p-2 border rounded"
          />
          <p className="text-red-500">{errors.start_lng?.message}</p>
        </div>

        <div>
          <label className="block font-medium">Start Latitude</label>
          <input
            type="number"
            {...register("start_lat")}
            className="w-full p-2 border rounded"
          />
          <p className="text-red-500">{errors.start_lat?.message}</p>
        </div>

        <div>
          <label className="block font-medium">End Longitude</label>
          <input
            type="number"
            {...register("end_lng")}
            className="w-full p-2 border rounded"
          />
          <p className="text-red-500">{errors.end_lng?.message}</p>
        </div>

        <div>
          <label className="block font-medium">End Latitude</label>
          <input
            type="number"
            {...register("end_lat")}
            className="w-full p-2 border rounded"
          />
          <p className="text-red-500">{errors.end_lat?.message}</p>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Calculating..." : "Calculate Route"}
        </button>
      </form>
    </div>
  );
};
export default RouteForm;
