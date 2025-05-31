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
import { Avatar, AvatarImage } from "../ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Edit2, MoreHorizontal, Trash2 } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";

const CompaniesTable = () => {
  const { companies, searchCompanyByText } = useSelector(
    (store) => store.company
  );
  const [filteredCompanies, setFilteredCompanies] = useState(companies || []);
  const navigate = useNavigate();

  useEffect(() => {
    if (!searchCompanyByText) {
      setFilteredCompanies(companies);
    } else {
      const filtered = companies.filter((company) =>
        company?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase())
      );
      setFilteredCompanies(filtered);
    }
  }, [companies, searchCompanyByText]);

  // Delete company handler
  const handleDelete = async (companyId) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this company? This action cannot be undone."
    );
    if (!confirm) return;

    try {
      const res = await axios.delete(
        `${COMPANY_API_END_POINT}/delete/${companyId}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Company deleted successfully.");
        // Optional: you can dispatch an action here to refresh company list
        // or rely on your useGetAllCompanies hook to update automatically.
      } else {
        toast.error(res.data.message || "Failed to delete the company.");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <Table>
        <TableCaption className="text-gray-500">
          A list of your recently registered companies
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-20">Logo</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCompanies && filteredCompanies.length > 0 ? (
            filteredCompanies.map((company) => (
              <TableRow
                key={company._id}
                className="hover:bg-gray-50 cursor-pointer"
              >
                <TableCell>
                  <Avatar>
                    <AvatarImage
                      src={company.logo || "/default-logo.png"}
                      alt={`${company.name} logo`}
                    />
                  </Avatar>
                </TableCell>
                <TableCell>{company.name || "N/A"}</TableCell>
                <TableCell>
                  {company.createdAt ? company.createdAt.split("T")[0] : "N/A"}
                </TableCell>
                <TableCell className="text-right">
                  <Popover>
                    <PopoverTrigger aria-label="Open company actions menu">
                      <MoreHorizontal className="inline-block" />
                    </PopoverTrigger>
                    <PopoverContent className="w-36" align="end">
                      <div
                        onClick={() =>
                          navigate(`/admin/companies/${company._id}`)
                        }
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) =>
                          e.key === "Enter" &&
                          navigate(`/admin/companies/${company._id}`)
                        }
                        className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100 rounded"
                      >
                        <Edit2 className="w-4 h-4" />
                        <span>Edit</span>
                      </div>
                      <div
                        onClick={() => handleDelete(company._id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleDelete(company._id)
                        }
                        className="flex items-center gap-2 p-2 cursor-pointer hover:bg-red-100 rounded text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-6 text-gray-500">
                No companies found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CompaniesTable;
