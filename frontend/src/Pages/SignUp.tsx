import { useState } from "react";
import axios from "axios";
import { Card, CardContent } from "../Components/ui/card";
import { Input } from "../Components/ui/input";
import { Button } from "../Components/ui/button";

const DriverSignUp = () => {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name || !phoneNumber || !email || !password || !confirmPassword) {
      setMessage("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    const newDriver = {
      name,
      phone_number: phoneNumber,
      email,
      password,
    };

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/drivers/",
        newDriver
      );
      if (response.status === 201) {
        setMessage("Driver registered successfully!");
      }
    } catch (error) {
      setMessage("Error registering driver. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto p-4 shadow-lg border border-gray-700">
      <CardContent>
        <h2 className="text-lg font-semibold mb-4">Driver Registration</h2>
        <div className="space-y-4">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Driver Name"
            className="border border-gray-500 bg-gray-800 text-gray-500"
          />
          <Input
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Phone Number"
            className="border border-gray-500 bg-gray-800 text-gray-500"
          />
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="border border-gray-500 bg-gray-800 text-gray-500"
          />
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="border border-gray-500 bg-gray-800 text-gray-500"
          />
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            className="border border-gray-500 bg-gray-800 text-gray-500"
          />
          <Button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Register Driver"}
          </Button>
          {message && <p className="text-sm text-gray-700 mt-4">{message}</p>}
        </div>
      </CardContent>
    </Card>
  );
};

export default DriverSignUp;
