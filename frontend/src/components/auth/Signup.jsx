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
import { setLoading } from "@/redux/authSlice";
import { Loader2 } from "lucide-react";

const Signup = () => {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
    file: "",
  });
  const { loading, user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(input).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    try {
      dispatch(setLoading(true));
      const res = await axios.post(
        `${USER_API_END_POINT}/register`,
        formData,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <Navbar />
      <div className="flex items-center justify-center max-w-7xl mx-auto py-16 px-4">
        <form
          onSubmit={submitHandler}
          className="w-full max-w-md bg-white bg-opacity-90 rounded-3xl shadow-xl p-8 space-y-6"
        >
          <h1 className="text-3xl font-extrabold text-center text-purple-700 mb-8">
            Create Your Account
          </h1>

          {/* Step 1: Fullname */}
          <div>
            <Label className="text-purple-800 font-semibold mb-1 block">
              Full Name
            </Label>
            <Input
              type="text"
              name="fullname"
              value={input.fullname}
              onChange={changeEventHandler}
              placeholder="John Doe"
              required
            />
          </div>

          {/* Step 2: Email */}
          {input.fullname && (
            <div>
              <Label className="text-purple-800 font-semibold mb-1 block">
                Email
              </Label>
              <Input
                type="email"
                name="email"
                value={input.email}
                onChange={changeEventHandler}
                placeholder="john@example.com"
                required
              />
            </div>
          )}

          {/* Step 3: Phone */}
          {input.email && (
            <div>
              <Label className="text-purple-800 font-semibold mb-1 block">
                Phone Number
              </Label>
              <Input
                type="text"
                name="phoneNumber"
                value={input.phoneNumber}
                onChange={changeEventHandler}
                placeholder="1234567890"
                required
              />
            </div>
          )}

          {/* Step 4: Password */}
          {input.phoneNumber && (
            <div>
              <Label className="text-purple-800 font-semibold mb-1 block">
                Password
              </Label>
              <Input
                type="password"
                name="password"
                value={input.password}
                onChange={changeEventHandler}
                placeholder="Enter your password"
                required
              />
            </div>
          )}

          {/* Step 5: Role */}
          {input.password && (
            <div>
              <Label className="text-purple-800 font-semibold mb-2 block">
                Role
              </Label>
              <RadioGroup className="flex gap-6">
                {["student", "recruiter"].map((role) => (
                  <div className="flex items-center space-x-2" key={role}>
                    <Input
                      type="radio"
                      name="role"
                      value={role}
                      checked={input.role === role}
                      onChange={changeEventHandler}
                      required
                      id={`role-${role}`}
                    />
                    <Label
                      htmlFor={`role-${role}`}
                      className="text-pink-600 font-medium"
                    >
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {/* Step 6: File Upload */}
          {input.role && (
            <div className="flex items-center gap-4">
              <Label
                className="text-purple-800 font-semibold"
                htmlFor="profile"
              >
                Profile Picture
              </Label>
              <Input
                accept="image/*"
                type="file"
                onChange={changeFileHandler}
                id="profile"
              />
            </div>
          )}

          {/* Submit Button */}
          {input.role &&
            (loading ? (
              <Button className="w-full my-4" disabled>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Please wait
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full my-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold"
              >
                Sign Up
              </Button>
            ))}

          <p className="text-center text-purple-900">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-pink-600 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
