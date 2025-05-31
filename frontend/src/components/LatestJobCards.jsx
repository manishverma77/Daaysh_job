import React, { useState } from "react";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";

const calcTilt = (x, y, rect) => {
  const posX = x - (rect.left + rect.width / 2);
  const posY = y - (rect.top + rect.height / 2);
  const rotateX = (-posY / (rect.height / 2)) * 10;
  const rotateY = (posX / (rect.width / 2)) * 10;
  return [rotateX, rotateY];
};

const LatestJobCards = ({ job }) => {
  const navigate = useNavigate();
  const controls = useAnimation();
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const [rotateX, rotateY] = calcTilt(e.clientX, e.clientY, rect);
    controls.start({
      rotateX,
      rotateY,
      scale: 1.05,
      transition: { type: "spring", stiffness: 300, damping: 20 },
      boxShadow: "0 20px 30px rgba(0,0,0,0.25)",
    });
  };

  const handleMouseLeave = () => {
    controls.start({
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 20 },
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    });
    setIsHovering(false);
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  return (
    <motion.div
      onClick={() => navigate(`/description/${job._id}`)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      animate={controls}
      initial={{
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      }}
      className="w-full h-full min-h-[250px] flex flex-col justify-between bg-white dark:bg-[#1e293b] border border-gray-100 dark:border-gray-700 rounded-xl cursor-pointer p-6 space-y-4 select-none transition-transform duration-200"
      style={{ willChange: "transform, box-shadow", perspective: 1000 }}
      tabIndex={0}
      role="button"
      aria-pressed="false"
    >
      {/* Company Info */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          {job?.company?.name}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">India</p>
      </div>

      {/* Job Title & Description */}
      <div>
        <h1 className="text-xl font-bold text-[#4f46e5] dark:text-[#818cf8] mb-1">
          {job?.title}
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
          {job?.description}
        </p>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap items-center gap-2 pt-2">
        <Badge
          className="text-[#4f46e5] font-medium bg-indigo-50 dark:bg-indigo-900/20"
          variant="outline"
        >
          {job?.position} Position{job?.position > 1 ? "s" : ""}
        </Badge>
        <Badge
          className="text-[#dc2626] font-medium bg-red-50 dark:bg-red-900/20"
          variant="outline"
        >
          {job?.jobType}
        </Badge>
        <Badge
          className="text-[#9333ea] font-medium bg-purple-50 dark:bg-purple-900/20"
          variant="outline"
        >
          {job?.salary} LPA
        </Badge>
      </div>
    </motion.div>
  );
};

export default LatestJobCards;
