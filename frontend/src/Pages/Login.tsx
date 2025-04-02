import { useState } from "react";
import axios from "axios";
import { Input } from "../Components/ui/input";
import { Button } from "../Components/ui/button";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/login/", {
        username,
        password,
      });
      localStorage.setItem("token", response.data.token);
      setMessage("Login successful!");
    } catch (error) {
      setMessage("Login failed, please check your credentials.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 shadow-lg border border-gray-700">
      <h2 className="text-lg font-semibold mb-4">Driver Login</h2>
      <div className="flex flex-col gap-4">
        <Input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="border border-gray-500 bg-gray-800 text-gray-500"
        />
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="border border-gray-500 bg-gray-800 text-gray-500"
        />
        <Button
          onClick={handleLogin}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Login
        </Button>
      </div>
      {message && <p className="text-sm text-gray-700 mt-4">{message}</p>}
    </div>
  );
};

export default Login;
