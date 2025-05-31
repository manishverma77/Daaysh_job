import React, { useEffect, useState } from "react";
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
import { Edit2, Eye, MoreHorizontal } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AdminJobsTable = () => {
  const { allAdminJobs, searchJobByText } = useSelector((store) => store.job);
  const [filteredJobs, setFilteredJobs] = useState(allAdminJobs || []);
  const navigate = useNavigate();

  useEffect(() => {
    if (!allAdminJobs) return;
    const filtered = allAdminJobs.filter((job) => {
      if (!searchJobByText) return true;
      const searchLower = searchJobByText.toLowerCase();
      return (
        job?.title?.toLowerCase().includes(searchLower) ||
        job?.company?.name.toLowerCase().includes(searchLower)
      );
    });
    setFilteredJobs(filtered);
  }, [allAdminJobs, searchJobByText]);

  return (
    <div className="overflow-x-auto rounded-lg shadow-lg bg-white dark:bg-gray-900">
      <Table className="min-w-[640px]">
        <TableCaption className="text-sm text-gray-500 dark:text-gray-400 pb-4 pt-2">
          Your recent posted jobs overview
        </TableCaption>
        <TableHeader>
          <TableRow className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <TableHead className="font-semibold tracking-wide">
              Company Name
            </TableHead>
            <TableHead className="font-semibold tracking-wide">Role</TableHead>
            <TableHead className="font-semibold tracking-wide">Date</TableHead>
            <TableHead className="font-semibold tracking-wide text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <TableRow
                key={job._id}
                className="hover:bg-indigo-50 dark:hover:bg-indigo-800 transition-colors cursor-pointer"
              >
                <TableCell className="text-indigo-900 dark:text-indigo-300 font-medium">
                  {job?.company?.name}
                </TableCell>
                <TableCell className="text-gray-700 dark:text-gray-300">
                  {job?.title}
                </TableCell>
                <TableCell className="text-gray-600 dark:text-gray-400">
                  {job?.createdAt?.split("T")[0]}
                </TableCell>
                <TableCell className="text-right">
                  <Popover>
                    <PopoverTrigger
                      className="inline-flex p-2 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      aria-label="Actions menu"
                    >
                      <MoreHorizontal
                        size={20}
                        className="text-indigo-600 dark:text-indigo-300"
                      />
                    </PopoverTrigger>
                    <PopoverContent className="w-36 p-3 bg-white dark:bg-gray-800 rounded-md shadow-lg">
                      <button
                        onClick={() => navigate(`/admin/companies/${job._id}`)}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-indigo-100 dark:hover:bg-indigo-700 rounded text-indigo-700 dark:text-indigo-300 font-semibold w-full text-left transition"
                      >
                        <Edit2 className="w-5 h-5" />
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          navigate(`/admin/jobs/${job._id}/applicants`)
                        }
                        className="flex items-center gap-2 px-3 py-2 mt-2 hover:bg-indigo-100 dark:hover:bg-indigo-700 rounded text-indigo-700 dark:text-indigo-300 font-semibold w-full text-left transition"
                      >
                        <Eye className="w-5 h-5" />
                        Applicants
                      </button>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center py-8 text-gray-500 dark:text-gray-400 font-medium"
              >
                No jobs found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminJobsTable;
