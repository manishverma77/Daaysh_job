import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Button } from "../ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import axios from "axios";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import useGetCompanyById from "@/hooks/useGetCompanyById";

const CompanySetup = () => {
  const params = useParams();
  useGetCompanyById(params.id);
  const { singleCompany } = useSelector((store) => store.company);

  const [input, setInput] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    file: null,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (singleCompany) {
      setInput({
        name: singleCompany.name || "",
        description: singleCompany.description || "",
        website: singleCompany.website || "",
        location: singleCompany.location || "",
        file: null,
      });
    }
  }, [singleCompany]);

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const changeFileHandler = (e) => {
    const file = e.target.files?.[0] || null;
    setInput((prev) => ({ ...prev, file }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!input.name.trim()) {
      toast.error("Company name is required.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", input.name.trim());
      formData.append("description", input.description.trim());
      formData.append("website", input.website.trim());
      formData.append("location", input.location.trim());
      if (input.file) formData.append("file", input.file);

      const res = await axios.put(
        `${COMPANY_API_END_POINT}/update/${params.id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/companies");
      } else {
        toast.error(res.data.message || "Update failed.");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-xl mx-auto my-12 p-8 bg-white rounded-xl shadow-md border border-gray-200">
        <form onSubmit={submitHandler} className="space-y-7">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate("/admin/companies")}
              variant="outline"
              className="flex items-center gap-2 text-gray-600 font-medium hover:text-blue-600 transition-colors"
              type="button"
              aria-label="Back to companies list"
            >
              <ArrowLeft size={20} />
              Back
            </Button>
            <h1 className="flex-grow text-center text-2xl font-semibold text-gray-700">
              Company Setup
            </h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Company Name */}
            <div>
              <Label
                htmlFor="name"
                className="block mb-1 text-gray-700 font-semibold"
              >
                Company Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                type="text"
                name="name"
                value={input.name}
                onChange={changeEventHandler}
                placeholder="Your company name"
                required
                disabled={loading}
                autoFocus
                className="border-gray-300 focus:border-blue-400 focus:ring-blue-300"
              />
            </div>

            {/* Description */}
            <div>
              <Label
                htmlFor="description"
                className="block mb-1 text-gray-700 font-semibold"
              >
                Description
              </Label>
              <Input
                id="description"
                type="text"
                name="description"
                value={input.description}
                onChange={changeEventHandler}
                placeholder="Brief description"
                disabled={loading}
                className="border-gray-300 focus:border-blue-400 focus:ring-blue-300"
              />
            </div>

            {/* Website */}
            <div>
              <Label
                htmlFor="website"
                className="block mb-1 text-gray-700 font-semibold"
              >
                Website
              </Label>
              <Input
                id="website"
                type="url"
                name="website"
                value={input.website}
                onChange={changeEventHandler}
                placeholder="https://example.com"
                disabled={loading}
                className="border-gray-300 focus:border-blue-400 focus:ring-blue-300"
              />
            </div>

            {/* Location */}
            <div>
              <Label
                htmlFor="location"
                className="block mb-1 text-gray-700 font-semibold"
              >
                Location
              </Label>
              <Input
                id="location"
                type="text"
                name="location"
                value={input.location}
                onChange={changeEventHandler}
                placeholder="City, Country"
                disabled={loading}
                className="border-gray-300 focus:border-blue-400 focus:ring-blue-300"
              />
            </div>

            {/* Logo */}
            <div className="sm:col-span-2">
              <Label
                htmlFor="logo"
                className="block mb-1 text-gray-700 font-semibold"
              >
                Logo
              </Label>
              <input
                id="logo"
                type="file"
                accept="image/*"
                onChange={changeFileHandler}
                disabled={loading}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                aria-describedby="logoDesc"
              />
              <p
                id="logoDesc"
                className="mt-1 text-xs text-gray-500 select-none"
              >
                Upload your company logo (PNG, JPG, GIF).
              </p>
              {input.file && (
                <p className="mt-2 text-sm text-green-600">
                  Selected file: {input.file.name}
                </p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition disabled:opacity-60"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin inline-block" />
                Please wait
              </>
            ) : (
              "Update Company"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CompanySetup;
