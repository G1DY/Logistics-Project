import { useState } from "react";
import axios from "axios";
import { Card, CardContent } from "../Components/ui/card";
import { Input } from "../Components/ui/input";
import { Button } from "../Components/ui/button";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const DriverSignUp = () => {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const validateForm = () => {
    if (!name || !phoneNumber || !email || !password || !confirmPassword) {
      setMessage("Please fill in all fields.");
      return false;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return false;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setMessage("Invalid phone number. Must be 10 digits.");
      return false;
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setMessage("Invalid email address.");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const newDriver = { name, phone_number: phoneNumber, email, password };

    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/drivers/",
        newDriver,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        const driverId = response.data.driver?.id;
        const token = response.data.token;

        localStorage.setItem("driverId", driverId);
        localStorage.setItem("token", token); // Storing the token in localStorage

        setMessage("Driver registered successfully!");

        setTimeout(() => {
          // Passing both driverId and token to the next page
          navigate("/TruckRegistrationForm", {
            state: { driverId, token },
          });
        }, 6000);
      } else {
        // Handle unexpected status codes
        setMessage(`Unexpected response: ${response.status}`);
      }
    } catch (error: any) {
      console.error("API error:", error.response?.data);
      if (error.response?.status === 400) {
        setMessage("Bad request: Please check the data you provided.");
      } else if (error.response?.status === 500) {
        setMessage("Server error: Please try again later.");
      } else {
        setMessage(
          error.response?.data?.message || "Error registering driver."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto mt-16 p-4 shadow-lg border border-gray-700">
      <CardContent>
        <h2 className="text-lg items-center text-center font-semibold mb-4 text-white">
          Driver Registration
        </h2>
        <div className="space-y-4">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Driver Name"
            className="border border-gray-500 bg-gray-800 text-white"
          />
          <Input
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Phone Number"
            className="border border-gray-500 bg-gray-800 text-white"
          />
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="border border-gray-500 bg-gray-800 text-white"
          />
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="border border-gray-500 bg-gray-800 text-white"
          />
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            className="border border-gray-500 bg-gray-800 text-white"
          />
          <Button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin mr-2" /> Submitting...
              </>
            ) : (
              "Register Driver"
            )}
          </Button>

          {message && (
            <p
              className={`text-sm mt-4 ${
                message.includes("Error") ? "text-red-500" : "text-green-500"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DriverSignUp;
