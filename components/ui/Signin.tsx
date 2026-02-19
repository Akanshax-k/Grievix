"use client";
import React, { useState } from "react";
import { Button } from "./button";
import { useLoginMutation } from "@/redux/api/authSlice";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/redux/slices/userSlice";


const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async () => {
    setError(null);
    try {
      const res = await login({
        username,
        password,
      }).unwrap();

      // Store user + token in Redux and localStorage
      dispatch(
        setCredentials({
          user: res.data.user,
          token: res.data.token,
        })
      );

      router.push("/complaint");
    } catch (err: unknown) {
      const apiErr = err as { data?: { message?: string } };
      setError(apiErr?.data?.message || "Login failed. Please check your credentials.");
    }
  };


  return (
    <div className="min-h-screen w-full bg-[#ffffff] flex flex-col justify-center items-center overflow-hidden px-4 bg-[#EAEFEF]">
      <img
        className="h-[200px] w-[100px] object-contain mt-2"
        src="/icons/Selection.png"
        alt="logo"
      />

      {/* Heading ek line me */}
      <h1 className="text-[30px] font-nunito text-black font-bold -translate-y-15 whitespace-nowrap text-center">
        Grievance 
      </h1>

      {/* Paragraph wrap hoga */}
      <p className="max-w-[245px] font-quicksand -translate-y-15 text-[14px] text-center mt-2">
        Secure citizen portal for lodging and tracking public grievance
      </p>

      {/* Input fields box */}
      <div className="h-[455px] w-[450px] max-w-full bg-white shadow-2xl -translate-y-15 rounded-lg flex flex-col items-center justify-center gap-5 p-6">
        
        {/* Username field */}
        <div className="w-full flex flex-col">
          <label className="font-quicksand text-[14px] mb-1">
            Username <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center border rounded-md px-2 h-[40px] w-full">
            <img src="icons/userico.png" alt="user icon" className="h-5 w-5 mr-2 object-center" />
            <input
              className="flex-1 outline-none font-quicksand text-[14px] rounded-md"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        </div>

        {/* Password field */}
        <div className="w-full flex flex-col">
          <label className="font-quicksand text-[14px] mb-1">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center border rounded-md px-2 h-[40px] w-full">
            <img src="icons/lock.png" alt="lock icon" className="h-10 w-7 mr-2 object-contain" />
            <input
              className="flex-1 outline-none font-quicksand text-[14px] rounded-md"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        {/* Login button */}
        {error && (
          <p className="text-red-500 text-sm text-center w-full">{error}</p>
        )}
        <Button variant="default" onClick={handleLogin} disabled={isLoading}>
          {isLoading ? "Logging in..." : "Log in to Portal →"}
        </Button>

        {/* Detail box */}
        <div className="h-[122px] w-[384px] max-w-full bg-gradient-to-r from-blue-30 to-white shadow-md rounded-md flex flex-col justify-center items-center border gap-2">
          <div className="flex items-center gap-2">
            <p className="text-[14px] -translate-x-1 -translate-y-1  font-quicksand text-blue-600 font-semibold">
              Quick Testing Access
            </p>
          </div>
          <p className="text-[14px] -translate-y-2.5 font-quicksand text-[#4A4A4A]">
            Username - <span className="font-semibold text-[#4A4A4A]">Kunal Patel</span>
          </p>
          <p className="text-[14px] font-quicksand -translate-y-4 text-[#4A4A4A]">
            Password - <span className="font-semibold text-[#4A4A4A]">Kunal@987</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;



