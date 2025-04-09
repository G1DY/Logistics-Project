// components/DriverLogs.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";

interface Driver {
  id: number;
  name: string;
  phone_number: string;
  email: string;
  assigned_truck: string;
}

interface DriverLog {
  id: number;
  driver: Driver;
  log_date: string;
  hours_worked: number;
  stops: number;
  rest_hours: number;
  fueling_count: number;
  fuel_stop_locations: string[];
  distance_covered: number;
  pickup_time: string;
  dropoff_time: string;
}

const DriverLogs: React.FC = () => {
  const [logs, setLogs] = useState<DriverLog[]>([]);
  const [loading, setLoading] = useState(true);

  const driverId = 33; // Replace dynamically if needed

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/driver-logs/${driverId}/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setLogs(res.data);
      } catch (err) {
        console.error("Error fetching logs", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  if (loading) return <p className="text-center">Loading logs...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Driver Logs</h2>
      <div className="grid gap-4">
        {logs.map((log) => (
          <div key={log.id} className="border rounded-xl p-4 shadow">
            <p>
              <strong>Date:</strong> {log.log_date}
            </p>
            <p>
              <strong>Hours Worked:</strong> {log.hours_worked.toFixed(2)}
            </p>
            <p>
              <strong>Distance Covered:</strong> {log.distance_covered} miles
            </p>
            <p>
              <strong>Stops:</strong> {log.stops}
            </p>
            <p>
              <strong>Rest Hours:</strong> {log.rest_hours}
            </p>
            <p>
              <strong>Fuel Stops:</strong> {log.fueling_count}
            </p>
            <p>
              <strong>Pickup Time:</strong>{" "}
              {new Date(log.pickup_time).toLocaleString()}
            </p>
            <p>
              <strong>Dropoff Time:</strong>{" "}
              {new Date(log.dropoff_time).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DriverLogs;
