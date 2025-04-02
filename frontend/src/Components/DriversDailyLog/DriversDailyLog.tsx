import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent } from "../../Components/ui/card";
import { Input } from "../../Components/ui/input";
import { Button } from "../../Components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DriverLog {
  id: number;
  date: string;
  total_hours: number;
  stops: number;
  rest_hours: number;
  fueling_count: number;
  distance_covered: number;
}

const DriverLogInteractive = () => {
  const [driverId, setDriverId] = useState("");
  const [logs, setLogs] = useState<DriverLog[]>([]);
  const [message, setMessage] = useState("");
  const [editedLogs, setEditedLogs] = useState<
    Record<number, Partial<DriverLog>>
  >({});

  useEffect(() => {
    if (logs.length > 0) setEditedLogs({}); // Reset edits when new logs are fetched
  }, [logs]);

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

  const handleEdit = (
    id: number,
    field: keyof DriverLog,
    value: string | number
  ) => {
    setEditedLogs((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const saveChanges = async (id: number) => {
    if (!editedLogs[id]) return;
    try {
      await axios.put(
        `http://127.0.0.1:8000/logs/update/${id}/`,
        editedLogs[id]
      );
      setLogs(
        logs.map((log) => (log.id === id ? { ...log, ...editedLogs[id] } : log))
      );
      setEditedLogs((prev) => {
        const newEdits = { ...prev };
        delete newEdits[id];
        return newEdits;
      });
    } catch (error) {
      alert("Error saving changes.");
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto p-4 shadow-lg border border-gray-700">
      <CardContent>
        <h2 className="text-lg font-semibold mb-4">Driver's Interactive Log</h2>
        <div className="flex gap-2 mb-4">
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
        {message && <p className="text-sm text-gray-700">{message}</p>}

        {logs.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-700 text-gray-300">
              <thead>
                <tr className="bg-gray-800">
                  <th className="p-2">Date</th>
                  <th className="p-2">Total Hours</th>
                  <th className="p-2">Rest Hours</th>
                  <th className="p-2">Stops</th>
                  <th className="p-2">Fuel Stops</th>
                  <th className="p-2">Distance</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-t">
                    <td className="p-2">{log.date}</td>
                    <td className="p-2">
                      <Input
                        type="number"
                        value={
                          editedLogs[log.id]?.total_hours ?? log.total_hours
                        }
                        onChange={(e) =>
                          handleEdit(log.id, "total_hours", +e.target.value)
                        }
                      />
                    </td>
                    <td className="p-2">
                      <Input
                        type="number"
                        value={editedLogs[log.id]?.rest_hours ?? log.rest_hours}
                        onChange={(e) =>
                          handleEdit(log.id, "rest_hours", +e.target.value)
                        }
                      />
                    </td>
                    <td className="p-2">
                      <Input
                        type="number"
                        value={editedLogs[log.id]?.stops ?? log.stops}
                        onChange={(e) =>
                          handleEdit(log.id, "stops", +e.target.value)
                        }
                      />
                    </td>
                    <td className="p-2">
                      <Input
                        type="number"
                        value={
                          editedLogs[log.id]?.fueling_count ?? log.fueling_count
                        }
                        onChange={(e) =>
                          handleEdit(log.id, "fueling_count", +e.target.value)
                        }
                      />
                    </td>
                    <td className="p-2">
                      <Input
                        type="number"
                        value={
                          editedLogs[log.id]?.distance_covered ??
                          log.distance_covered
                        }
                        onChange={(e) =>
                          handleEdit(
                            log.id,
                            "distance_covered",
                            +e.target.value
                          )
                        }
                      />
                    </td>
                    <td className="p-2">
                      <Button
                        onClick={() => saveChanges(log.id)}
                        className="bg-green-600 text-white"
                      >
                        Save
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {logs.length > 0 && (
          <div className="mt-6">
            <h3 className="text-md font-semibold">Hours Breakdown</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={logs}>
                <XAxis dataKey="date" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip wrapperStyle={{ backgroundColor: "#000" }} />
                <Bar dataKey="total_hours" fill="#4CAF50" name="Total Hours" />
                <Bar dataKey="rest_hours" fill="#FF9800" name="Rest Hours" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DriverLogInteractive;
