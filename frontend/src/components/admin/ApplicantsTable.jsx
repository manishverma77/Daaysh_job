import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { MoreHorizontal } from "lucide-react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { APPLICATION_API_END_POINT } from "@/utils/constant";
import axios from "axios";

const shortlistingStatus = ["Accepted", "Rejected"];

const ApplicantsTable = () => {
  const { applicants } = useSelector((store) => store.application);

  const statusHandler = async (status, id) => {
    try {
      axios.defaults.withCredentials = true;
      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/status/${id}/update`,
        { status }
      );
      if (res.data.success) {
        toast.success(res.data.message);
      } else {
        toast.error("Failed to update status.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  if (!applicants?.applications?.length) {
    return (
      <div className="p-6 text-center text-gray-500">
        No applicants have applied for this job.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
      <Table className="min-w-full divide-y divide-gray-200">
        <TableCaption className="text-gray-500 text-sm italic py-2">
          A list of your recent applied users
        </TableCaption>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Full Name
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Email
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Contact
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Resume
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Date
            </TableHead>
            <TableHead className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applicants.applications.map((item) => {
            const applicant = item?.applicant;

            if (!applicant) {
              console.warn("Missing applicant data for application:", item);
              return null;
            }

            return (
              <TableRow
                key={item._id}
                className="bg-white hover:bg-indigo-50 transition-colors duration-200 cursor-pointer"
              >
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {applicant.fullname || "N/A"}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {applicant.email || "N/A"}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {applicant.phoneNumber || "N/A"}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 underline">
                  {applicant.profile?.resume ? (
                    <a
                      href={applicant.profile.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-indigo-800"
                    >
                      {applicant.profile.resumeOriginalName || "Resume"}
                    </a>
                  ) : (
                    "N/A"
                  )}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {item.createdAt ? item.createdAt.split("T")[0] : "N/A"}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        aria-label="Actions"
                        className="p-1 rounded hover:bg-gray-200 transition"
                      >
                        <MoreHorizontal className="text-gray-500 hover:text-indigo-600" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-32 shadow-lg border border-gray-200 rounded-md p-1 bg-white">
                      {shortlistingStatus.map((status) => (
                        <div
                          key={status}
                          onClick={() =>
                            statusHandler(status.toLowerCase(), item._id)
                          }
                          className="cursor-pointer hover:bg-indigo-100 px-3 py-1 rounded text-gray-700 select-none transition"
                        >
                          {status}
                        </div>
                      ))}
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default ApplicantsTable;
