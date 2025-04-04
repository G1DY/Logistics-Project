import React, { useState } from "react";
import { Input, Button, Label, Form } from "../Components/ui";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        // Store tokens in localStorage
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);
        // Redirect to the protected route or dashboard
        window.location.href = "/dashboard"; // Change as needed
      } else {
        const errorData = await response.json();
        setError(errorData.detail || "Login failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
      <Form onSubmit={handleSubmit}>
        <FormField>
          <Label htmlFor="email">Email</Label>
          <FormControl>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </FormControl>
        </FormField>

        <FormField className="mt-4">
          <Label htmlFor="password">Password</Label>
          <FormControl>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </FormControl>
        </FormField>

        {error && <div className="mt-2 text-red-600 text-sm">{error}</div>}

        <Button type="submit" className="w-full mt-6" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>
      </Form>
    </div>
  );
};

export default Login;
