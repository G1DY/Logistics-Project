import { useEffect, useState } from "react";
import axios from "axios";
import { ScrollArea } from "../Components/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../Components/ui";

interface Driver {
  id: number;
  name: string;
  phone_number: string;
  email: string;
  assigned_truck: string | null;
}

const DriversList = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/drivers/")
      .then((res) => {
        setDrivers(res.data);
      })
      .catch((err) => {
        console.error("Error fetching drivers", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading)
    return <p className="text-center text-gray-500">Loading drivers...</p>;

  return (
    <ScrollArea className="rounded-lg border p-4 w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Assigned Truck</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {drivers.map((driver) => (
            <TableRow key={driver.id}>
              <TableCell>{driver.name}</TableCell>
              <TableCell>{driver.phone_number}</TableCell>
              <TableCell>{driver.email}</TableCell>
              <TableCell>
                {driver.assigned_truck || (
                  <span className="text-gray-400 italic">Not assigned</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};

export default DriversList;
