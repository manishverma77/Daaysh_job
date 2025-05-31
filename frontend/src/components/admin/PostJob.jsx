import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import axios from "axios";
import { JOB_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const jobTypes = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
  "Temporary",
];

const PostJob = () => {
  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    location: "",
    jobType: "",
    experience: "",
    position: 1,
    companyId: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { companies } = useSelector((store) => store.company);

  const onChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const onSelectChange = (name, value) => {
    if (name === "companyId") {
      const selected = companies.find(
        (c) => c.name.toLowerCase() === value.toLowerCase()
      );
      setInput((prev) => ({ ...prev, companyId: selected?._id || "" }));
    } else {
      setInput((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validate = () => {
    if (!input.title.trim()) {
      toast.error("Job title is required");
      return false;
    }
    if (!input.companyId) {
      toast.error("Please select a company");
      return false;
    }
    if (!input.jobType) {
      toast.error("Please select job type");
      return false;
    }
    if (
      input.experience === "" ||
      isNaN(Number(input.experience)) ||
      Number(input.experience) < 0
    ) {
      toast.error("Please enter a valid experience (years)");
      return false;
    }
    if (input.position < 1) {
      toast.error("Number of positions must be at least 1");
      return false;
    }
    return true;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      const res = await axios.post(`${JOB_API_END_POINT}/post`, input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/jobs");
      } else {
        toast.error(res.data.message || "Failed to post job");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-gray-50 to-blue-100">
      <Navbar />
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-semibold mb-6 text-center text-blue-700">
          Post a New Job
        </h1>

        <form
          onSubmit={submitHandler}
          className="bg-white shadow-md rounded-lg p-8 space-y-6 border border-blue-200"
        >
          {/* Title */}
          <div>
            <Label htmlFor="title" className="text-blue-600 font-medium">
              Job Title *
            </Label>
            <Input
              id="title"
              name="title"
              type="text"
              placeholder="e.g. Senior Frontend Developer"
              value={input.title}
              onChange={onChange}
              disabled={loading}
              required
              className="mt-1 border border-blue-300 focus:ring-blue-400 focus:border-blue-400 text-blue-900 placeholder-blue-400"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-blue-600 font-medium">
              Description
            </Label>
            <textarea
              id="description"
              name="description"
              placeholder="Provide a detailed description of the role"
              value={input.description}
              onChange={onChange}
              disabled={loading}
              rows={4}
              className="w-full mt-1 p-3 rounded border border-blue-200 bg-blue-50 text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            />
          </div>

          {/* Requirements */}
          <div>
            <Label htmlFor="requirements" className="text-blue-600 font-medium">
              Requirements
            </Label>
            <textarea
              id="requirements"
              name="requirements"
              placeholder="List the key requirements for the job"
              value={input.requirements}
              onChange={onChange}
              disabled={loading}
              rows={3}
              className="w-full mt-1 p-3 rounded border border-blue-200 bg-blue-50 text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            />
          </div>

          {/* Salary */}
          <div>
            <Label htmlFor="salary" className="text-blue-600 font-medium">
              Salary
            </Label>
            <Input
              id="salary"
              name="salary"
              type="text"
              placeholder="e.g. $50,000 - $70,000"
              value={input.salary}
              onChange={onChange}
              disabled={loading}
              className="mt-1 border border-blue-300 focus:ring-blue-400 focus:border-blue-400 text-blue-900 placeholder-blue-400"
            />
          </div>

          {/* Location */}
          <div>
            <Label htmlFor="location" className="text-blue-600 font-medium">
              Location
            </Label>
            <Input
              id="location"
              name="location"
              type="text"
              placeholder="e.g. Remote, New York, NY"
              value={input.location}
              onChange={onChange}
              disabled={loading}
              className="mt-1 border border-blue-300 focus:ring-blue-400 focus:border-blue-400 text-blue-900 placeholder-blue-400"
            />
          </div>

          {/* Job Type */}
          <div>
            <Label htmlFor="jobType" className="text-blue-600 font-medium">
              Job Type *
            </Label>
            <Select
              onValueChange={(val) => onSelectChange("jobType", val)}
              disabled={loading}
              value={input.jobType}
              defaultValue=""
            >
              <SelectTrigger
                id="jobType"
                className="w-full max-w-xs mt-1 border border-blue-300 focus:ring-blue-400 focus:border-blue-400 text-blue-900 placeholder-blue-400"
              >
                <SelectValue placeholder="Select job type" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-blue-200 rounded-md shadow-md">
                <SelectGroup>
                  {jobTypes.map((type) => (
                    <SelectItem
                      key={type}
                      value={type}
                      className="text-blue-900 hover:bg-blue-100"
                    >
                      {type}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Experience Level - number input */}
          <div>
            <Label htmlFor="experience" className="text-blue-600 font-medium">
              Experience (years) *
            </Label>
            <Input
              id="experience"
              name="experience"
              type="number"
              min={0}
              placeholder="e.g. 3"
              value={input.experience}
              onChange={onChange}
              disabled={loading}
              required
              className="mt-1 border border-blue-300 focus:ring-blue-400 focus:border-blue-400 text-blue-900 placeholder-blue-400"
            />
          </div>

          {/* Number of Positions */}
          <div>
            <Label htmlFor="position" className="text-blue-600 font-medium">
              Number of Positions *
            </Label>
            <Input
              id="position"
              name="position"
              type="number"
              min={1}
              value={input.position}
              onChange={onChange}
              disabled={loading}
              required
              className="mt-1 border border-blue-300 focus:ring-blue-400 focus:border-blue-400 text-blue-900 placeholder-blue-400"
            />
          </div>

          {/* Company Select */}
          {companies.length > 0 ? (
            <div>
              <Label
                htmlFor="companySelect"
                className="text-blue-600 font-medium"
              >
                Select Company *
              </Label>
              <Select
                onValueChange={(val) => onSelectChange("companyId", val)}
                disabled={loading}
                value={
                  companies
                    .find((c) => c._id === input.companyId)
                    ?.name.toLowerCase() || ""
                }
                defaultValue=""
              >
                <SelectTrigger
                  id="companySelect"
                  className="w-full max-w-xs mt-1 border border-blue-300 focus:ring-blue-400 focus:border-blue-400 text-blue-900 placeholder-blue-400"
                >
                  <SelectValue placeholder="Select a company" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-blue-200 rounded-md shadow-md">
                  <SelectGroup>
                    {companies.map((company) => (
                      <SelectItem
                        key={company._id}
                        value={company.name.toLowerCase()}
                        className="text-blue-900 hover:bg-blue-100"
                      >
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          ) : (
            <p className="text-red-500">No companies available.</p>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-md"
          >
            {loading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              "Post Job"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
