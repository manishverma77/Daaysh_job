import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setSingleCompany } from "@/redux/companySlice";

const CompanyCreate = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);

  const registerNewCompany = async () => {
    if (!companyName.trim()) {
      toast.error("Company name cannot be empty.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        `${COMPANY_API_END_POINT}/register`,
        { companyName: companyName.trim() },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res?.data?.success) {
        dispatch(setSingleCompany(res.data.company));
        toast.success(res.data.message);
        navigate(`/admin/companies/${res.data.company._id}`);
      } else {
        toast.error(res?.data?.message || "Failed to register company.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-indigo-50">
      <Navbar />
      <div className="flex justify-center items-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-md rounded-xl max-w-md w-full p-8 space-y-6 border border-gray-200">
          <h1 className="text-3xl font-semibold text-indigo-700">
            Name Your Company
          </h1>
          <p className="text-gray-600 max-w-sm">
            Choose a company name. You can update it anytime later.
          </p>

          <div>
            <Label
              htmlFor="companyName"
              className="block text-gray-700 font-medium"
            >
              Company Name
            </Label>
            <Input
              id="companyName"
              type="text"
              className="mt-2 border-indigo-300 focus:border-indigo-500 focus:ring-indigo-300"
              placeholder="e.g. JobHunt, Microsoft"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              disabled={loading}
              autoFocus
              spellCheck={false}
              autoComplete="off"
            />
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
            <Button
              variant="outline"
              onClick={() => navigate("/admin/companies")}
              disabled={loading}
              className="px-6 py-2"
            >
              Cancel
            </Button>
            <Button
              onClick={registerNewCompany}
              disabled={loading}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {loading ? "Saving..." : "Continue"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyCreate;
