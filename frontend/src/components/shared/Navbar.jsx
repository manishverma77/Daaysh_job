import React, { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Avatar, AvatarImage } from "../ui/avatar";
import { LogOut, User2Icon } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const pageColors = {
  "/": "#1D4ED8",
  "/jobs": "#F59E0B",
  "/browse": "#10B981",
  "/admin/companies": "#8B5CF6",
  "/admin/jobs": "#EF4444",
};

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const primaryColor = pageColors[location.pathname] || "#6A38C2";
  const [showLoginNotification, setShowLoginNotification] = useState(false);

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message || "Logged out");
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Logout failed");
    }
  };

  useEffect(() => {
    if (!user) {
      const timer = setTimeout(() => setShowLoginNotification(true), 10000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  return (
    <motion.div
      className="sticky top-0 z-50 dark:bg-[#111] bg-white shadow-lg border-b dark:border-neutral-700"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 80 }}
    >
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-4 sm:px-8">
        {/* Logo + Company Name */}
        <motion.div
          className="flex items-center gap-3"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-600">
            <img
              src="\logo.png" //  Replace with actual logo path
              alt="Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <h1
            className="text-3xl font-black tracking-tight select-none"
            style={{ color: primaryColor, userSelect: "none" }}
          >
            Daaysh
          </h1>
        </motion.div>

        {/* Navigation Links + Auth Buttons */}
        <div className="flex items-center gap-10">
          <ul className="flex font-semibold text-gray-700 dark:text-gray-300 gap-6">
            {(user && user.role === "recruiter"
              ? [
                  { to: "/admin/companies", label: "Companies" },
                  { to: "/admin/jobs", label: "Jobs" },
                ]
              : [
                  { to: "/", label: "Home" },
                  { to: "/jobs", label: "Jobs" },
                  { to: "/browse", label: "Browse" },
                ]
            ).map((link) => (
              <motion.li key={link.to} whileHover={{ scale: 1.1 }}>
                <Link
                  to={link.to}
                  className="transition-colors duration-300 hover:text-[#F83002]"
                >
                  {link.label}
                </Link>
              </motion.li>
            ))}
          </ul>

          {!user ? (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  className="shadow-md neumorphic-btn dark:bg-gray-900 dark:text-white"
                >
                  <Button variant="outline">Login</Button>
                </motion.div>
              </Link>
              <Link to="/signup">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <Button
                    className="backdrop-blur-md bg-opacity-90 text-white"
                    style={{
                      backgroundColor: primaryColor,
                      borderColor: primaryColor,
                      boxShadow: `0 8px 30px -10px ${primaryColor}`,
                    }}
                  >
                    Signup
                  </Button>
                </motion.div>
              </Link>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="cursor-pointer"
                >
                  <Avatar className="hover:ring-2 ring-offset-1 ring-gray-300 dark:ring-gray-600 transition duration-300">
                    <AvatarImage
                      src={user?.profile?.profilePhoto}
                      alt="profile"
                      className="rounded-full"
                    />
                  </Avatar>
                </motion.div>
              </PopoverTrigger>

              <PopoverContent
                align="end"
                className="w-80 rounded-xl bg-white/70 dark:bg-[#222]/70 backdrop-blur-md border border-gray-200 dark:border-neutral-600 shadow-xl p-4"
              >
                <div className="flex items-center gap-3 border-b pb-3 mb-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage
                      src={user?.profile?.profilePhoto}
                      alt="profile"
                    />
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-lg text-gray-800 dark:text-white">
                      {user?.fullname}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {user?.profile?.bio}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col space-y-2 text-gray-700 dark:text-gray-200">
                  {user.role === "student" && (
                    <div className="flex items-center gap-2">
                      <User2Icon className="w-4 h-4" />
                      <Link to="/profile">
                        <Button variant="link" className="p-0 text-sm">
                          View Profile
                        </Button>
                      </Link>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <LogOut className="w-4 h-4" />
                    <Button
                      onClick={logoutHandler}
                      variant="link"
                      className="p-0 text-sm text-red-500 hover:underline"
                    >
                      Logout
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>

      {/* Login Notification */}
      <AnimatePresence>
        {showLoginNotification && !user && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4 }}
            className="fixed bottom-6 right-6 bg-white/80 dark:bg-[#222]/80 backdrop-blur-md border border-gray-200 dark:border-neutral-700 shadow-lg px-4 py-2 rounded-lg z-50 text-sm text-gray-800 dark:text-gray-100"
          >
            👋 Please login to access full features!
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Navbar;
