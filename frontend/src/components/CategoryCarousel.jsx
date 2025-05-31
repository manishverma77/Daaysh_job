import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSearchedQuery } from "@/redux/jobSlice";
import { Code, Database, Cloud, Shield, Activity } from "lucide-react";

const categories = [
  { label: "Frontend Developer", icon: <Code size={16} /> },
  { label: "Backend Developer", icon: <Database size={16} /> },
  { label: "Full Stack Engineer", icon: <Code size={16} /> },
  { label: "Data Scientist", icon: <Activity size={16} /> },
  { label: "Project Manager", icon: <Activity size={16} /> },
  { label: "Product Designer", icon: <Activity size={16} /> },
  { label: "DevOps Engineer", icon: <Cloud size={16} /> },
  { label: "Cloud Architect", icon: <Cloud size={16} /> },
  { label: "Security Engineer", icon: <Shield size={16} /> },
  { label: "Machine Learning Engineer", icon: <Activity size={16} /> },
];

const CategoryCarousel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const repeated = Array(3).fill(categories).flat();

  const handleClick = (query) => {
    dispatch(setSearchedQuery(query));
    navigate("/browse");
  };

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 py-6">
      <div className="parallax-wrapper relative">
        <div
          className="animate-scroll flex gap-6 px-6 whitespace-nowrap will-change-transform"
          style={{
            animation: "scroll-left 80s linear infinite",
          }}
        >
          {repeated.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => handleClick(cat.label)}
              className="category-card backdrop-blur-md text-sm font-mono tracking-wide px-5 py-3 rounded-xl flex items-center gap-2 cursor-pointer transition-all duration-300 transform hover:scale-105"
            >
              <span className="text-white opacity-80">{cat.icon}</span>
              <span className="text-white">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Styles */}
      <style>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .parallax-wrapper::before,
        .parallax-wrapper::after {
          content: '';
          position: absolute;
          top: 0;
          width: 80px;
          height: 100%;
          z-index: 10;
          pointer-events: none;
        }

        .parallax-wrapper::before {
          left: 0;
          background: linear-gradient(to right, #1f2937, transparent);
        }

        .parallax-wrapper::after {
          right: 0;
          background: linear-gradient(to left, #1f2937, transparent);
        }

        .category-card {
          background: rgba(255, 255, 255, 0.05); /* glassmorphism */
          box-shadow:
            4px 4px 10px rgba(0, 0, 0, 0.5),
            -4px -4px 10px rgba(255, 255, 255, 0.05); /* neumorphism */
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .category-card:hover {
          background: rgba(255, 255, 255, 0.08);
          text-shadow: 0 0 4px rgba(255, 255, 255, 0.6);
          border-color: rgba(255, 255, 255, 0.2);
        }

        @media (max-width: 768px) {
          .category-card {
            font-size: 0.75rem;
            padding: 0.5rem 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default CategoryCarousel;
