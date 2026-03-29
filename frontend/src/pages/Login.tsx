import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import loginImg from "../assets/images/login.jpg";
import axios from "axios";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleLogin = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!email || !password) {
        alert("Please enter email and password");
        return;
      }
      
      const data = { email, password };
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/login`, data);
      
      if (response.status === 200) {
        login(response.data.token);
        navigate("/");
      }
    } catch (error: any) {
      console.error("Login Error:", error);
      alert(error.response?.data?.message || "Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="w-full h-[90vh] bg-surface-off-white flex justify-center items-center">
      <div className="bg-white w-250 h-150 flex items-center rounded-4xl shadow-xl overflow-hidden">
        {/* Left Side */}
        <div className="flex-1 h-full hidden md:block">
          <img
            src={loginImg}
            alt="Interior login view"
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Right Side: Login Form */}
        <div className="flex-1 flex flex-col justify-center px-12 py-10">
          <div className="mb-8">
            <h2 className="text-3xl font-Manrope-ExtraBold text-slate-950">Welcome Back</h2>
            <p className="text-slate-500 font-Manrope-SemiBold">Please enter your details to login</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-6">
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

            <div className="flex justify-end">
              <Link to="/forgot-password" stroke-width="2" className="text-sm font-Manrope-Bold text-slate-600 hover:text-slate-950 transition">
                 Forgot password?
              </Link>
            </div>
            
            <button type="submit" className="w-full bg-slate-950 text-white py-3 rounded-md font-bold hover:bg-slate-800 transition">
               Sign In
            </button>
          </form>

          <p className="mt-8 text-center text-sm font-Manrope-SemiBold text-slate-500">
            Don't have an account? 
            <Link to="/register" className="text-slate-950 font-Manrope-Bold ml-1 hover:underline">
               Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
