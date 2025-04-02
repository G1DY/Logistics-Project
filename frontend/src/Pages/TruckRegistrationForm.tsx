import { useState } from "react";
import axios from "axios";
import { Card, CardContent } from "../Components/ui/card";
import { Input } from "../Components/ui/input";
import { Button } from "../Components/ui/button";

const TruckRegistrationForm = () => {
  const [licensePlate, setLicensePlate] = useState("");
  const [model, setModel] = useState("");
  const [capacity, setCapacity] = useState(0);
  const [status, setStatus] = useState("active");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!licensePlate || !model || !capacity) {
      setMessage("Please fill in all fields.");
      return;
    }

    const newTruck = {
      license_plate: licensePlate,
      model,
      capacity,
      status,
    };

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/trucks/",
        newTruck
      );
      if (response.status === 201) {
        setMessage("Truck registered successfully!");
      }
    } catch (error) {
      setMessage("Error registering truck. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto p-4 shadow-lg border border-gray-700">
      <CardContent>
        <h2 className="text-lg font-semibold mb-4">Truck Registration</h2>
        <div className="space-y-4">
          <Input
            value={licensePlate}
            onChange={(e) => setLicensePlate(e.target.value)}
            placeholder="License Plate"
            className="border border-gray-500 bg-gray-800 text-gray-500"
          />
          <Input
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="Truck Model"
            className="border border-gray-500 bg-gray-800 text-gray-500"
          />
          <Input
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
            placeholder="Truck Capacity"
            className="border border-gray-500 bg-gray-800 text-gray-500"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border border-gray-500 bg-gray-800 text-gray-500"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <br />
          <Button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Register Truck"}
          </Button>
          {message && <p className="text-sm text-gray-700 mt-4">{message}</p>}
        </div>
      </CardContent>
    </Card>
  );
};

export default TruckRegistrationForm;
