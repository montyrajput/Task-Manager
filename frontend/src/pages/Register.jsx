import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Register = () => {
  const { register } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Disable scroll only on register page
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await register({ username, password, role: "user" });

    if (res.ok) {
      navigate("/");
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-50 p-4 pt-20">
      {/* Positioned slightly upward using pt-20 */}

      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border">

        <h2 className="text-3xl font-bold text-center mb-6 text-slate-800">
          Create Account ✨
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:ring-slate-800 outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:ring-slate-800 outline-none"
          />

          <button
            className="w-full py-3 bg-slate-800 text-white rounded-lg 
            hover:bg-slate-900 transition cursor-pointer text-sm font-medium"
          >
            Register
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link to="/login" className="text-slate-800 font-medium hover:underline">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;
