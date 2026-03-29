import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import loginImg from "../assets/images/login.jpg";
import axios from "axios";

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = { name, username, email, password };
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/register`, data);
      
      if (response.status === 201) {
        login(response.data.token);
        navigate("/");
      }
    } catch (error: any) {
      console.error("Registration Error:", error);
      alert(error.response?.data?.message || "Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="w-full h-[90vh] bg-surface-off-white flex justify-center items-center">
      <div className="bg-white w-250 h-150 flex items-center rounded-4xl shadow-xl overflow-hidden">
        {/* Left Side: Image */}
        <div className="flex-1 h-full hidden md:block self-stretch">
          <img
            src={loginImg}
            alt="Register view"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Side: Form */}
        <div className="flex-1 flex flex-col justify-center px-12 py-10">
          <div className="mb-8">
            <h2 className="text-3xl font-Manrope-ExtraBold text-slate-950">Create Account</h2>
            <p className="text-slate-500 font-Manrope-SemiBold">Fill your details to get started</p>
          </div>

          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-Manrope-Bold text-slate-700 ml-1">Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-md outline-none focus:border-slate-900 transition-all font-Manrope"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-Manrope-Bold text-slate-700 ml-1">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="johndoe123"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-md outline-none focus:border-slate-900 transition-all font-Manrope"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-Manrope-Bold text-slate-700 ml-1">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@email.com"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-md outline-none focus:border-slate-900 transition-all font-Manrope"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-Manrope-Bold text-slate-700 ml-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-md outline-none focus:border-slate-900 transition-all font-Manrope"
                required
              />
            </div>

            <div className="mt-2">
              <button type="submit" className="w-full bg-slate-950 text-white py-3 rounded-md font-bold hover:bg-slate-800 transition">
                Register Now
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm font-Manrope-SemiBold text-slate-500">
            Already have an account? 
            <Link to="/login" className="text-slate-950 font-Manrope-Bold ml-1 hover:underline">
               Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
