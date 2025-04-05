import { useEffect, useState } from "react";
import { Card } from "../Components/ui";
import { Badge } from "../Components/ui";
import { Input } from "../Components/ui";
import { TruckIcon, UserIcon } from "lucide-react";
import { CardContent } from "../Components/ui/card";

interface Truck {
  id: number;
  license_plate: string;
  model: string;
  capacity: number;
  status: string;
  assigned_driver: {
    id: number;
    name: string;
    phone_number: string;
    email: string;
    assigned_truck: string;
  } | null;
}

export default function Dashboard() {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Fetch truck data from the endpoint
    fetch("http://127.0.0.1:8000/trucks/")
      .then((res) => res.json())
      .then((data) => setTrucks(data))
      .catch((error) => console.error("Error fetching trucks:", error));
  }, []);

  const filteredTrucks = trucks.filter(
    (truck) =>
      truck.license_plate.toLowerCase().includes(search.toLowerCase()) ||
      truck.model.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Truck Dashboard</h1>
        <Input
          type="text"
          placeholder="Search truck..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTrucks.map((truck) => (
          <Card key={truck.id} className="shadow-md">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <TruckIcon className="w-5 h-5" />
                {truck.model} ({truck.license_plate})
              </div>
              <div className="text-sm text-gray-500">
                Capacity: {truck.capacity} tons
              </div>
              <div className="text-sm text-gray-500">
                Status:{" "}
                <Badge
                  variant={
                    truck.status === "active" ? "default" : "destructive"
                  }
                >
                  {truck.status}
                </Badge>
              </div>
              <div className="pt-2">
                {truck.assigned_driver ? (
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center gap-2 font-medium">
                      <UserIcon className="w-4 h-4" />
                      {truck.assigned_driver.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      Email: {truck.assigned_driver.email}
                    </div>
                    <div className="text-sm text-gray-500">
                      Phone: {truck.assigned_driver.phone_number}
                    </div>
                  </div>
                ) : (
                  <Badge variant="outline">No driver assigned</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
