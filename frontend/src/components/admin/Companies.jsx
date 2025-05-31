import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import CompaniesTable from "./CompaniesTable";
import { useNavigate } from "react-router-dom";
import useGetAllCompanies from "@/hooks/useGetAllCompanies";
import { useDispatch } from "react-redux";
import { setSearchCompanyByText } from "@/redux/companySlice";

const Companies = () => {
  useGetAllCompanies();

  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchCompanyByText(input));
  }, [input, dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-6xl mx-auto my-10 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
          <Input
            className="w-full sm:w-64 border border-gray-300 bg-white text-gray-700 placeholder-gray-400 focus:border-indigo-400 focus:ring-indigo-300 rounded-md shadow-sm"
            placeholder="Filter by name"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            aria-label="Filter companies by name"
          />
          <Button
            onClick={() => navigate("/admin/companies/create")}
            className="whitespace-nowrap bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md shadow-md transition"
          >
            New Company
          </Button>
        </div>
        <CompaniesTable />
      </main>
    </div>
  );
};

export default Companies;
