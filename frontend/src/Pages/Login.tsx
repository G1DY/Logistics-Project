import { useState } from "react";
import { Button, Input, Card } from "../Components/ui";
import { SubmitHandler, useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { useAuth } from "../Context/AuthContext"; // Importing useAuth

interface formData {
  name: string;
  email: string;
  password: string;
}

const LoginForm = () => {
  const { login } = useAuth(); // Get login function from context
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<formData>();

  const onSubmit: SubmitHandler<formData> = async (data) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("http://127.0.0.1:8000/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const responseData = await response.json();
        login(responseData.access); // Update the auth state

        reset();
        setSuccess(true);
        setTimeout(() => {
          window.location.href = "/dashboard"; // Redirect to dashboard
        }, 1500);
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
      <Card className="p-6 bg-white shadow-md">
        {success && (
          <div className="text-center text-green-600 mb-4">
            <p>Login successful! Redirecting...</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="mt-2"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid email",
                },
              })}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="mt-2"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          {error && <div className="mt-2 text-red-600 text-sm">{error}</div>}

          <Button type="submit" className="w-full mt-4" disabled={loading}>
            {loading ? <Loader2 className="animate-spin mr-2" /> : "Login"}
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default LoginForm;
