import React, { useState } from "react";
import Navbar from "./shared/Navbar";
import { Button } from "./ui/button";
import { Contact, Mail, Pen } from "lucide-react";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import AppliedJobTable from "./AppliedJobTable";
import UpdateProfileDialog from "./UpdateProfileDialog";
import { useSelector } from "react-redux";
import useGetAppliedJobs from "@/hooks/useGetAppliedJobs";

const isResume = true;

const Profile = () => {
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);

  // Safe fallback if hook returns undefined or null
  const appliedJobsData = useGetAppliedJobs() || {};
  const { jobs = [], loading = false, error = null } = appliedJobsData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white pb-10">
      <Navbar />

      {/* Profile Card */}
      <div className="max-w-4xl mx-auto mt-10 bg-white/80 backdrop-blur-md border border-gray-200 shadow-2xl rounded-2xl p-8 transition-all duration-300">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="font-semibold text-2xl text-gray-800">
              {user?.fullname || "Unnamed User"}
            </h1>
            <p className="text-gray-600 mt-1">
              {user?.profile?.bio || "No bio available"}
            </p>
          </div>

          <Button
            onClick={() => setOpen(true)}
            className="shadow-md hover:shadow-lg transition duration-300"
            variant="outline"
          >
            <Pen className="h-4 w-4 mr-2" /> Edit
          </Button>
        </div>

        {/* Contact Info */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 text-gray-700">
            <Mail className="text-gray-500" />
            <span>{user?.email || "Not Provided"}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <Contact className="text-gray-500" />
            <span>{user?.phoneNumber || "Not Provided"}</span>
          </div>
        </div>

        {/* Skills */}
        <div className="mb-6">
          <h2 className="font-semibold text-lg text-gray-800 mb-2">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {Array.isArray(user?.profile?.skills) &&
            user.profile.skills.length > 0 ? (
              user.profile.skills.map((item, index) => (
                <Badge
                  key={index}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md px-3 py-1"
                >
                  {item}
                </Badge>
              ))
            ) : (
              <span className="text-gray-500">NA</span>
            )}
          </div>
        </div>

        {/* Resume */}
        <div className="grid w-full max-w-sm items-start gap-1.5">
          <Label className="text-md font-bold text-gray-800">Resume</Label>
          {isResume && user?.profile?.resume ? (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={user.profile.resume}
              className="text-blue-600 hover:underline hover:text-blue-800 font-medium"
            >
              {user.profile.resumeOriginalName || "View Resume"}
            </a>
          ) : (
            <span className="text-gray-500">NA</span>
          )}
        </div>
      </div>

      {/* Applied Jobs Section */}
      <div className="max-w-4xl mx-auto mt-10 bg-white/80 backdrop-blur-md shadow-2xl rounded-2xl p-6">
        <h1 className="font-bold text-xl text-gray-800 mb-4">Applied Jobs</h1>

        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : error ? (
          <p className="text-red-600">Error: {error}</p>
        ) : (
          <AppliedJobTable jobs={jobs} />
        )}
      </div>

      <UpdateProfileDialog open={open} setOpen={setOpen} />
    </div>
  );
};

export default Profile;
