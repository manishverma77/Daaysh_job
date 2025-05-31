import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Search } from "lucide-react";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import { useNavigate } from "react-router-dom";

const allSuggestions = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Engineer",
  "Data Scientist",
  "Project Manager",
  "Product Designer",
  "DevOps Engineer",
  "Cloud Architect",
  "Software Developer",
  "Software Engineer",
  "Mobile App Developer (iOS, Android)",
  "Data Analyst",
  "Machine Learning Engineer",
  "AI/ML Researcher",
  "Big Data Engineer",
  "Security Analyst",
  "Security Engineer",
  "Ethical Hacker",
  "IT Support Specialist",
  "Network Engineer",
  "Technical Support Engineer",
  "Helpdesk Technician",
  "Scrum Master",
  "Product Manager",
  "Business Analyst",
  "QA Engineer",
  "Test Automation Engineer",
  "Manual Tester",
  "UI/UX Designer",
  "Interaction Designer",
  "System Administrator",
  "Cloud Solutions Architect",
  "Site Reliability Engineer (SRE)",
  "Information Security Manager",
];

const HeroSection = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (query.trim()) {
      const filtered = allSuggestions.filter((item) =>
        item.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query]);

  const searchJobHandler = (value) => {
    const finalQuery = value || query;
    if (!finalQuery.trim()) return;
    dispatch(setSearchedQuery(finalQuery));
    navigate("/browse");
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    searchJobHandler(suggestion);
  };

  return (
    <>
      <style>
        {`
          /* Entrance fade-in */
          .fade-in {
            animation: fadeInAnimation 1.5s ease forwards;
          }
          
          /* Exit fade-out (example, not triggered here) */
          .fade-out {
            animation: fadeOutAnimation 1s ease forwards;
          }

          @keyframes fadeInAnimation {
            0% {
              opacity: 0;
              transform: translateY(20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes fadeOutAnimation {
            0% {
              opacity: 1;
              transform: translateY(0);
            }
            100% {
              opacity: 0;
              transform: translateY(20px);
            }
          }
        `}
      </style>

      <section className="bg-[#f4f6fa] dark:bg-[#0f172a] text-gray-900 dark:text-white py-24 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Find Your{" "}
            <span className="text-[#6366f1] fade-in">Next Opportunity</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover remote and local jobs that match your skills. From startups
            to enterprise — your future begins here.
          </p>

          {/* Search Bar with Suggestions */}
          <div className="relative w-full max-w-xl mx-auto">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                searchJobHandler();
              }}
              className="flex bg-white dark:bg-[#1e293b] shadow-lg rounded-full px-4 py-2 items-center"
              role="search"
              aria-label="Job search"
            >
              <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-gray-400 dark:text-gray-300">
                <Search size={20} />
              </div>
              <input
                type="search"
                placeholder="Search jobs..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => query && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="flex-grow bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none ml-3"
                aria-label="Search jobs"
              />
              <Button
                type="submit"
                className="ml-4 bg-[#6366f1] hover:bg-[#4f46e5] text-white rounded-full px-6 py-2"
              >
                Search
              </Button>
            </form>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute top-full left-0 right-0 z-10 bg-white/80 dark:bg-[#1e293b]/80 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-b-xl mt-1 shadow-lg max-h-60 overflow-y-auto text-left">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onMouseDown={() => handleSuggestionClick(suggestion)}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
