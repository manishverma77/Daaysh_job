import React, { useEffect, useState } from "react";
import Navbar from "./shared/Navbar";
import Job from "./JobCard";
import { useDispatch, useSelector } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Browse = () => {
  useGetAllJobs();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { allJobs } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);

  const [showPopup, setShowPopup] = useState(false);

  // Reset search query on component unmount
  useEffect(() => {
    return () => dispatch(setSearchedQuery(""));
  }, [dispatch]);

  // Popup & login redirect if not authenticated
  useEffect(() => {
    if (!user) {
      setShowPopup(true); // Show first popup

      const secondPopupTimer = setTimeout(() => setShowPopup(true), 5000);
      const redirectTimer = setTimeout(() => navigate("/login"), 10000);

      return () => {
        clearTimeout(secondPopupTimer);
        clearTimeout(redirectTimer);
      };
    }
  }, [user, navigate]);

  if (!user) {
    return (
      <div>
        <Navbar />
        <div className="text-center mt-20 text-xl font-semibold text-gray-700">
          🔒 Please log in to browse jobs.
          <p className="text-sm text-gray-500 mt-2">Redirecting to login...</p>
        </div>

        {showPopup && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed bottom-10 right-10 bg-white border px-4 py-2 shadow-lg rounded-md text-sm text-gray-800"
          >
            🔐 Login is required to access this page.
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto my-10">
        <h1 className="font-bold text-xl my-10">
          Search Results ({allJobs.length})
        </h1>

        {allJobs.length === 0 ? (
          <p className="text-gray-500">No jobs found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {allJobs.map((job) => (
              <motion.div
                key={job._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Job job={job} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Browse;
