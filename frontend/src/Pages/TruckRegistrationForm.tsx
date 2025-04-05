import { useState } from "react";
import axios from "axios";
import { Card, CardContent } from "../Components/ui/card";
import { Input } from "../Components/ui/input";
import { Button } from "../Components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";

const TruckRegistrationForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const driverId = location.state?.driverId;

  const [licensePlate, setLicensePlate] = useState("");
  const [model, setModel] = useState("");
  const [capacity, setCapacity] = useState<number | "">("");
  const [status, setStatus] = useState("active");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setLicensePlate("");
    setModel("");
    setCapacity("");
    setStatus("active");
  };

  const handleSubmit = async () => {
    if (
      !licensePlate.trim() ||
      !model.trim() ||
      capacity === "" ||
      isNaN(Number(capacity)) ||
      Number(capacity) <= 0
    ) {
      setMessage({
        type: "error",
        text: "Please fill in all fields with valid values.",
      });
      return;
    }

    if (!driverId) {
      setMessage({
        type: "error",
        text: "Missing driver ID. Please register driver first.",
      });
      return;
    }

    const newTruck = {
      license_plate: licensePlate.trim(),
      model: model.trim(),
      capacity: parseFloat(String(capacity)),
      status,
      assigned_driver: driverId,
    };

    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/trucks/",
        newTruck,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        setMessage({
          type: "success",
          text: "✅ Truck registered and assigned to driver!",
        });
        resetForm();

        // Optional: redirect to dashboard
        setTimeout(() => navigate("/dashboard"), 2000);
      }
    } catch (error: any) {
      console.error("API error:", error);
      const errorText =
        error?.response?.data?.detail ||
        "❌ Error registering truck. Please try again.";
      setMessage({ type: "error", text: errorText });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto p-6 shadow-xl border border-gray-700">
      <CardContent>
        <h2 className="text-xl font-bold mb-6 text-white">
          Truck Registration
        </h2>
        <div className="space-y-4">
          <Input
            value={licensePlate}
            onChange={(e) => setLicensePlate(e.target.value)}
            placeholder="License Plate"
            className="border border-gray-600 bg-gray-900 text-white"
          />
          <Input
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="Truck Model"
            className="border border-gray-600 bg-gray-900 text-white"
          />
          <Input
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
            placeholder="Truck Capacity (tons)"
            className="border border-gray-600 bg-gray-900 text-white"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border border-gray-600 bg-gray-900 text-white rounded px-4 py-2"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <Button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Register Truck"}
          </Button>
          {message && (
            <p
              className={`text-sm mt-4 ${
                message.type === "success" ? "text-green-400" : "text-red-400"
              }`}
            >
              {message.text}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TruckRegistrationForm;
