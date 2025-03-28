import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";

const logSchema = z.object({
  driverName: z.string().min(1, "Driver name is required"),
  date: z.string().min(1, "Date is required"),
  totalMiles: z.number().min(0, "Total miles must be a positive number"),
  logEntries: z.array(
    z.object({
      time: z.string(),
      status: z.enum(["Off Duty", "Sleeper", "Driving", "On Duty"]),
    })
  ),
  remarks: z.string().optional(),
});

type LogFormType = z.infer<typeof logSchema>;

const DriversDailyLog = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LogFormType>({ resolver: zodResolver(logSchema) });

  const onSubmit = async (data: LogFormType) => {
    try {
      await axios.post("/api/logs", data);
      alert("Log submitted successfully");
    } catch (error) {
      console.error(error);
      alert("Error submitting log");
    }
  };
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Driver's Daily Log</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Driver Name</label>
          <input
            type="text"
            {...register("driverName")}
            className="w-full p-2 border rounded"
          />
          {errors.driverName && (
            <p className="text-red-500 text-sm">{errors.driverName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Date</label>
          <input
            type="date"
            {...register("date")}
            className="w-full p-2 border rounded"
          />
          {errors.date && (
            <p className="text-red-500 text-sm">{errors.date.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Total Miles</label>
          <input
            type="number"
            {...register("totalMiles", { valueAsNumber: true })}
            className="w-full p-2 border rounded"
          />
          {errors.totalMiles && (
            <p className="text-red-500 text-sm">{errors.totalMiles.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Remarks</label>
          <textarea
            {...register("remarks")}
            className="w-full p-2 border rounded"
          ></textarea>
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
};
export default DriversDailyLog;
