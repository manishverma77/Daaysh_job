import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { RadioGroup } from "../ui/radio-group";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/authSlice";
import { Loader2 } from "lucide-react";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "",
  });

  const [step, setStep] = useState(1);

  const { loading, user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));

    if (name === "email" && value.trim() !== "") setStep(2);
    if (name === "password" && value.trim() !== "") setStep(3);
    if (name === "role" && value.trim() !== "") setStep(4);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 via-indigo-600 to-purple-700">
      <Navbar />
      <div className="flex items-center justify-center max-w-7xl mx-auto py-16 px-4">
        <form
          onSubmit={submitHandler}
          className="w-full max-w-md bg-white bg-opacity-90 rounded-3xl shadow-lg p-8 space-y-6"
        >
          <h1 className="text-3xl font-extrabold text-center text-indigo-800 mb-6">
            Login to Your Account
          </h1>

          {step >= 1 && (
            <div>
              <Label className="text-indigo-700 font-semibold mb-1 block">
                Email
              </Label>
              <Input
                type="email"
                name="email"
                value={input.email}
                onChange={changeHandler}
                placeholder="you@example.com"
                required
              />
            </div>
          )}

          {step >= 2 && (
            <div>
              <Label className="text-indigo-700 font-semibold mb-1 block">
                Password
              </Label>
              <Input
                type="password"
                name="password"
                value={input.password}
                onChange={changeHandler}
                placeholder="Enter your password"
                required
              />
            </div>
          )}

          {step >= 3 && (
            <div>
              <Label className="text-indigo-700 font-semibold mb-2 block">
                Role
              </Label>
              <RadioGroup className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <Input
                    type="radio"
                    name="role"
                    value="student"
                    checked={input.role === "student"}
                    onChange={changeHandler}
                    className="cursor-pointer accent-purple-600"
                    required
                    id="role-student"
                  />
                  <Label
                    htmlFor="role-student"
                    className="cursor-pointer text-purple-700 font-medium"
                  >
                    Student
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Input
                    type="radio"
                    name="role"
                    value="recruiter"
                    checked={input.role === "recruiter"}
                    onChange={changeHandler}
                    className="cursor-pointer accent-purple-600"
                    required
                    id="role-recruiter"
                  />
                  <Label
                    htmlFor="role-recruiter"
                    className="cursor-pointer text-purple-700 font-medium"
                  >
                    Recruiter
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {step >= 4 && (
            <>
              {loading ? (
                <Button
                  className="w-full my-4 bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-bold flex justify-center items-center"
                  disabled
                >
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Please wait
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="w-full my-4 bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-bold hover:from-purple-700 hover:to-indigo-800 transition"
                >
                  Login
                </Button>
              )}
            </>
          )}

          <p className="text-center text-indigo-900">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-purple-600 font-semibold hover:underline"
            >
              Signup
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
