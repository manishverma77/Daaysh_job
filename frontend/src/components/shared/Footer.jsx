import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";

const Footer = () => {
  const exploreLinks = [
    { label: "Home", url: "/" },
    { label: "Jobs", url: "/jobs" },
    { label: "Browse", url: "/browse" },
  ];

  const socialLinks = [
    { icon: FaFacebookF, url: "/" },
    { icon: FaTwitter, url: "/" },
    {
      icon: FaLinkedinIn,
      url: "https://www.linkedin.com/in/manish-verma-175281259/",
    },
    { icon: FaInstagram, url: "/" },
  ];

  return (
    <footer className="bg-gray-950 text-gray-300 backdrop-blur-md border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Brand */}
        <div>
          <h2 className="text-4xl font-extrabold text-purple-400 tracking-tight mb-4">
            Daaysh
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
            Your trusted platform for top tech jobs. Connect with the best
            companies and land your dream role.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-lg font-semibold uppercase text-gray-100 mb-4">
            Explore
          </h3>
          <ul className="space-y-3 text-sm">
            {exploreLinks.map(({ label, url }) => (
              <li key={label}>
                <a
                  href={url}
                  className="hover:text-purple-400 transition-colors duration-200"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Social and Contact */}
        <div>
          <h3 className="text-lg font-semibold uppercase text-gray-100 mb-4">
            Connect
          </h3>
          <div className="flex space-x-5 mb-4">
            {socialLinks.map(({ icon: Icon, url }, i) => (
              <a
                key={i}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-gray-800 shadow-lg hover:bg-purple-600 transition-all duration-300 transform hover:scale-110"
              >
                <Icon size={20} className="text-white" />
              </a>
            ))}
          </div>
          <p className="text-sm text-gray-400">
            Email:{" "}
            <a
              href="mailto:manishverma.ac.in@gmail.com"
              className="underline hover:text-purple-400"
            >
              manishverma.ac.in@gmail.com
            </a>
          </p>
          <p className="text-sm text-gray-400 mt-1">Phone: +91 8292845501</p>
        </div>
      </div>

      {/* Bottom */}
      <div className="bg-gray-900 py-5 text-center text-xs text-gray-500 border-t border-gray-800">
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold text-purple-400">Daaysh</span>. All
        rights reserved. —{" "}
        <a href="/" className="underline hover:text-purple-400">
          Privacy Policy
        </a>{" "}
        |{" "}
        <a href="/" className="underline hover:text-purple-400">
          Terms of Service
        </a>
      </div>
    </footer>
  );
};

export default Footer;
