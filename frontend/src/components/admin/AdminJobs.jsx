import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import AdminJobsTable from "./AdminJobsTable";
import useGetAllAdminJobs from "@/hooks/useGetAllAdminJobs";
import { setSearchJobByText } from "@/redux/jobSlice";

const AdminJobs = () => {
  useGetAllAdminJobs();
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchJobByText(input));
  }, [input, dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <header className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <Input
            type="search"
            placeholder="Filter by company name, role..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow max-w-md shadow-sm rounded-md border border-gray-300 dark:border-gray-700
                       focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
          />
          <Button
            onClick={() => navigate("/admin/jobs/create")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md px-6 py-2 transition"
          >
            New Job
          </Button>
        </header>
        <section>
          <AdminJobsTable />
        </section>
      </main>
    </div>
  );
};

export default AdminJobs;
