import React from "react";
import { Link } from "react-router-dom";
import { useSmartBack } from "@/components/useSmartBack";
import { useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import Logo from "./Logo";

const BackButton = () => {
  const goBack = useSmartBack("/map");
  const location = useLocation();

  // Disable the button if you're on the home or map route
  const isHome = location.pathname === "/" || location.pathname === "/map";

  return (
    <button
      onClick={() => {
        if (!isHome) goBack();
      }}
      disabled={isHome}
      aria-disabled={isHome}
      className={`p-2 rounded-md transition-colors ${
        isHome ? "cursor-default opacity-30" : "hover:bg-gray-100 dark:hover:bg-gray-800"
      }`}
    >
      <svg
        className="w-5 h-5 text-gray-700 dark:text-gray-300"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
  );
};

const GlobalHeader = () => {
  return (
    <>
      {/* Desktop Header */}
      <header className="hidden md:flex w-full h-[60px] bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 items-center px-6 overflow-hidden relative">
        {/* Left: Back Button */}
        <div className="flex items-center">
          <BackButton />
        </div>

        {/* Center: Logo - absolutely positioned for perfect centering */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <Logo className="h-10 w-auto max-h-[50px]" />
          </Link>
        </div>

        {/* Right: Sign Up / Sign In and Hamburger Menu */}
        <div className="flex items-center space-x-2 ml-auto">
          <button className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors">
            Sign Up / Sign In
          </button>
          <ThemeToggle />
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
            <svg
              className="w-6 h-6 text-gray-700 dark:text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Header - logo centered, hamburger right, compact back button left */}
        <header className="md:hidden w-full h-[60px] bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 flex items-center px-4 overflow-hidden relative">
        {/* Back Button - absolutely left */}
        <div className="absolute left-0 flex items-center h-full pl-2">
            <BackButton />
        </div>

        {/* Theme Toggle and Hamburger Icon - absolutely right */}
        <div className="absolute right-0 flex items-center h-full pr-4 space-x-2">
            <ThemeToggle />
            <button className="py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
            <svg
                className="w-6 h-6 text-gray-700 dark:text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
                />
            </svg>
            </button>
        </div>

        {/* Centered Logo */}
        <div className="flex-1 flex items-center justify-center">
            <Link to="/" className="hover:opacity-80 transition-opacity">
            <Logo className="h-8 w-auto max-h-[50px]" />
            </Link>
        </div>
        </header>
    </>
  );
};

export default GlobalHeader;
