import React, { useEffect, useState } from "react";
import Navbar from "./shared/Navbar";
import FilterCard from "./FilterCard";
import Job from "./JobCard";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { setSearchedQuery } from "@/redux/jobSlice";

const Jobs = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { allJobs, searchedQuery } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);

  const [filterJobs, setFilterJobs] = useState(allJobs);
  const [currentPage, setCurrentPage] = useState(1);
  const [showPopup, setShowPopup] = useState(false);

  const jobsPerPage = 6;

  useEffect(() => {
    if (searchedQuery) {
      const filtered = allJobs.filter((job) => {
        const search = searchedQuery.toLowerCase();
        return (
          job.title.toLowerCase().includes(search) ||
          job.description.toLowerCase().includes(search) ||
          job.location.toLowerCase().includes(search)
        );
      });
      setFilterJobs(filtered);
      setCurrentPage(1);
    } else {
      setFilterJobs(allJobs);
    }
  }, [allJobs, searchedQuery]);

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filterJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filterJobs.length / jobsPerPage);

  const handlePageChange = (page) => setCurrentPage(page);

  // ✨ Show popups and redirect logic
  useEffect(() => {
    if (!user) {
      setShowPopup(true); // show first popup

      const secondPopup = setTimeout(() => setShowPopup(true), 5000);
      const redirect = setTimeout(() => navigate("/login"), 10000);

      return () => {
        clearTimeout(secondPopup);
        clearTimeout(redirect);
      };
    }
  }, [user, navigate]);

  if (!user) {
    return (
      <div>
        <Navbar />
        <div className="text-center mt-20 text-xl font-semibold text-gray-700">
          🔒 Please log in to view available jobs.
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
            🔐 You must be logged in to view jobs.
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto mt-5">
        <div className="flex gap-5">
          <div className="w-1/5">
            <FilterCard />
          </div>

          <div className="flex-1 h-[88vh] overflow-y-auto pb-5">
            {filterJobs.length === 0 ? (
              <span className="text-gray-500">❌ No jobs found.</span>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentJobs.map((job) => (
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

                {/* Pagination Controls */}
                <div className="flex justify-center items-center gap-2 mt-6">
                  <button
                    onClick={() =>
                      handlePageChange(Math.max(currentPage - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded border text-gray-500 hover:bg-gray-200 disabled:opacity-50"
                  >
                    ◀
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 border rounded ${
                          page === currentPage
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}

                  <button
                    onClick={() =>
                      handlePageChange(Math.min(currentPage + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded border text-gray-500 hover:bg-gray-200 disabled:opacity-50"
                  >
                    ▶
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
