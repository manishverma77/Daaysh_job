import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";

const skillOptions = [
  "JavaScript",
  "React",
  "Node.js",
  "Python",
  "Java",
  "TypeScript",
  "HTML",
  "CSS",
  "Angular",
  "Vue.js",
  "SQL",
  "MongoDB",
  "Docker",
  "Kubernetes",
  "AWS",
  "Git",
  "Redux",
  "GraphQL",
  "C#",
  "Ruby",
];

const UpdateProfileDialog = ({ open, setOpen }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);

  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    bio: "",
    skills: "",
    file: null,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setInput({
        fullname: user.fullname || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        bio: user.profile?.bio || "",
        skills: user.profile?.skills?.join(", ") || "",
        file: null,
      });
    }
  }, [user, open]);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    setInput({ ...input, file });
  };

  const addSkill = (skill) => {
    const currentSkills = input.skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (!currentSkills.includes(skill)) {
      currentSkills.push(skill);
      setInput({ ...input, skills: currentSkills.join(", ") });
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();

      if (input.fullname) formData.append("fullname", input.fullname);
      if (input.email) formData.append("email", input.email);
      if (input.phoneNumber) formData.append("phoneNumber", input.phoneNumber);
      if (input.bio) formData.append("bio", input.bio);
      if (input.skills) formData.append("skills", input.skills);
      if (input.file) formData.append("file", input.file);

      const res = await axios.post(
        `${USER_API_END_POINT}/profile/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
        setOpen(false);
      }
    } catch (error) {
      console.error("Update failed:", error);
      toast.error(error?.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px] rounded-xl bg-white shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Update Profile
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={submitHandler} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullname">Full Name</Label>
            <Input
              id="fullname"
              name="fullname"
              value={input.fullname}
              onChange={changeEventHandler}
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={input.email}
              onChange={changeEventHandler}
              required
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              value={input.phoneNumber}
              onChange={changeEventHandler}
              required
            />
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Input
              id="bio"
              name="bio"
              value={input.bio}
              onChange={changeEventHandler}
            />
          </div>

          {/* Skills Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="skills">Skills</Label>
            <select
              id="skills"
              className="w-full border px-3 py-2 rounded-md"
              onChange={(e) => addSkill(e.target.value)}
            >
              <option value="">Select a skill to add</option>
              {skillOptions.map((skill) => (
                <option key={skill} value={skill}>
                  {skill}
                </option>
              ))}
            </select>
            <Input
              id="skillsInput"
              name="skills"
              value={input.skills}
              onChange={changeEventHandler}
              placeholder="Comma separated e.g. React, Node.js"
            />
          </div>

          {/* Resume Upload */}
          <div className="space-y-2">
            <Label htmlFor="file">Resume (PDF only)</Label>
            <Input
              id="file"
              name="file"
              type="file"
              accept="application/pdf"
              onChange={fileChangeHandler}
            />
            {user?.profile?.resumeOriginalName && (
              <p className="text-sm text-gray-600 mt-1">
                Uploaded file:{" "}
                <strong>{user.profile.resumeOriginalName}</strong>
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <Button type="submit" className="w-full mt-4" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Updating...
                </>
              ) : (
                "Update"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfileDialog;
