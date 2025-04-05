import { useEffect, useState } from "react";
import { Card } from "../Components/ui";
import { Badge } from "../Components/ui";
import { Input } from "../Components/ui";
import { TruckIcon, UserIcon } from "lucide-react";
import { CardContent } from "./ui/card";

interface Truck {
  id: number;
  license_plate: string;
  model: string;
  capacity: number;
  status: string;
}

interface Driver {
  id: number;
  name: string;
  phone_number: string;
  email: string;
  assigned_truck: Truck | null;
}

export default function Dashboard() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Replace with your API URL
    fetch("/api/drivers")
      .then((res) => res.json())
      .then((data) => setDrivers(data));
  }, []);

  const filteredDrivers = drivers.filter((driver) =>
    driver.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Driver Dashboard</h1>
        <Input
          type="text"
          placeholder="Search driver..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDrivers.map((driver) => (
          <Card key={driver.id} className="shadow-md">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <UserIcon className="w-5 h-5" />
                {driver.name}
              </div>
              <div className="text-sm text-gray-500">{driver.email}</div>
              <div className="text-sm text-gray-500">{driver.phone_number}</div>
              <div className="pt-2">
                {driver.assigned_truck ? (
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center gap-2 font-medium">
                      <TruckIcon className="w-4 h-4" />
                      {driver.assigned_truck.model} (
                      {driver.assigned_truck.license_plate})
                    </div>
                    <div className="text-sm">
                      Capacity: {driver.assigned_truck.capacity} tons
                    </div>
                    <Badge
                      variant={
                        driver.assigned_truck.status === "active"
                          ? "default"
                          : "destructive"
                      }
                    >
                      {driver.assigned_truck.status}
                    </Badge>
                  </div>
                ) : (
                  <Badge variant="outline">No truck assigned</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
