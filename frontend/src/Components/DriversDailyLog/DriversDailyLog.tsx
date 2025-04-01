import { useState } from "react";
import axios from "axios";
import { Card, CardContent } from "../../Components/ui/card"; // ShadCN UI
import { Input } from "../../Components/ui/input";
import { Button } from "../../Components/ui/button";

interface DriverLog {
  date: string;
  total_hours: number;
  stops: number;
  rest_hours: number;
  fueling_count: number;
  distance_covered: number;
}

const DriverLogList = () => {
  const [driverId, setDriverId] = useState("");
  const [logs, setLogs] = useState<DriverLog[]>([]);
  const [message, setMessage] = useState("");

  const fetchLogs = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/logs/${driverId}/`
      );
      setLogs(response.data);
      if (response.data.length === 0) setMessage("No logs found.");
    } catch (error) {
      setMessage("Error fetching logs.");
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto p-4 shadow-lg border border-gray-700">
      <CardContent>
        <h2 className="text-lg font-semibold mb-4">View Driver Logs</h2>
        <div className="flex gap-2">
          <Input
            value={driverId}
            onChange={(e) => setDriverId(e.target.value)}
            placeholder="Enter Driver ID"
            required
            className="border border-gray-500 bg-gray-800 text-gray-500"
          />
          <Button
            onClick={fetchLogs}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Fetch Logs
          </Button>
        </div>

        {message && (
          <p className="mt-3 text-center text-sm text-gray-700">{message}</p>
        )}

        {logs.length > 0 && (
          <div className="mt-4 space-y-2">
            {logs.map((log, index) => (
              <Card key={index} className="p-3 border">
                <p>
                  <strong>Date:</strong> {log.date}
                </p>
                <p>
                  <strong>Total Hours:</strong> {log.total_hours}
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
                  <strong>Distance:</strong> {log.distance_covered} miles
                </p>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DriverLogList;
