import React, { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useParams } from "react-router-dom";
import axios from "axios";
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from "@/utils/constant";
import { setSingleJob } from "@/redux/jobSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const JobDescription = () => {
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);

  // Determine if user has already applied once the job data is loaded
  const [isApplied, setIsApplied] = useState(false);

  const params = useParams();
  const jobId = params.id;
  const dispatch = useDispatch();

  // Fetch single job details
  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
          // Check if current user has applied
          const applied = res.data.job.applications.some(
            (application) => application.applicant === user?._id
          );
          setIsApplied(applied);
        }
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Failed to fetch job.");
      }
    };

    fetchSingleJob();
  }, [jobId, dispatch, user?._id]);

  // Handler for applying to the job
  const applyJobHandler = async () => {
    try {
      const res = await axios.get(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setIsApplied(true);
        // Update Redux state so UI shows new applicant count
        const updatedSingleJob = {
          ...singleJob,
          applications: [
            ...(singleJob?.applications || []),
            { applicant: user?._id },
          ],
        };
        dispatch(setSingleJob(updatedSingleJob));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to apply for job.");
    }
  };

  // While loading or if no job is yet in state, show a centered loading indicator
  if (!singleJob) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center text-lg font-medium text-gray-700">
          Loading job details...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        {/* Header: Title, Badges, and Apply Button */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex-1">
            <h1 className="font-extrabold text-3xl text-gray-800 mb-2">
              {singleJob.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-4">
              <Badge
                className="bg-blue-100 text-blue-800 font-semibold"
                variant="solid"
              >
                {singleJob.position} Positions
              </Badge>
              <Badge
                className="bg-red-100 text-red-800 font-semibold"
                variant="solid"
              >
                {singleJob.jobType}
              </Badge>
              <Badge
                className="bg-purple-100 text-purple-800 font-semibold"
                variant="solid"
              >
                {singleJob.salary} LPA
              </Badge>
            </div>
          </div>

          <Button
            onClick={isApplied ? null : applyJobHandler}
            disabled={isApplied}
            className={`rounded-lg px-6 py-2 text-white transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-600 ${
              isApplied
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {isApplied ? "Already Applied" : "Apply Now"}
          </Button>
        </div>

        {/* Divider */}
        <div className="border-b border-gray-200 my-6" />

        {/* Job Details Section */}
        <h2 className="font-semibold text-xl text-gray-700 mb-4">
          Job Description
        </h2>
        <div className="space-y-4 text-gray-700">
          <p>
            <span className="font-medium">Role:</span>{" "}
            <span className="pl-2 font-normal">{singleJob.title}</span>
          </p>
          <p>
            <span className="font-medium">Location:</span>{" "}
            <span className="pl-2 font-normal">{singleJob.location}</span>
          </p>
          <p>
            <span className="font-medium">Description:</span>{" "}
            <span className="pl-2 font-normal">{singleJob.description}</span>
          </p>
          <p>
            <span className="font-medium">Experience:</span>{" "}
            <span className="pl-2 font-normal">{singleJob.experience} yrs</span>
          </p>
          <p>
            <span className="font-medium">Salary:</span>{" "}
            <span className="pl-2 font-normal">{singleJob.salary} LPA</span>
          </p>
          <p>
            <span className="font-medium">Total Applicants:</span>{" "}
            <span className="pl-2 font-normal">
              {singleJob.applications?.length || 0}
            </span>
          </p>
          <p>
            <span className="font-medium">Posted Date:</span>{" "}
            <span className="pl-2 font-normal">
              {new Date(singleJob.createdAt).toLocaleDateString()}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default JobDescription;
