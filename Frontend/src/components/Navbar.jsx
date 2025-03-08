import { useState } from "react";
import {
  FiMenu,
  FiX,
  FiUser,
  FiLogIn,
  FiLogOut,
  FiBook,
  FiUsers,
} from "react-icons/fi";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // This would be replaced with actual auth state

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleLogin = () => {
    setIsLoggedIn(!isLoggedIn); // This is just for demo purposes
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="h-8 w-8 bg-indigo-600 rounded-md flex items-center justify-center text-white font-bold text-xl">
                A
              </div>
              <span className="ml-2 text-xl font-bold text-gray-800">
                AssignifyAI
              </span>
            </div>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <a
              href="#"
              className="text-gray-600 hover:text-indigo-600 flex items-center"
            >
              <FiUsers className="mr-1" />
              Teams
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-indigo-600 flex items-center"
            >
              <FiBook className="mr-1" />
              Assignments
            </a>
            {isLoggedIn && (
              <a
                href="#"
                className="text-gray-600 hover:text-indigo-600 flex items-center"
              >
                <FiUser className="mr-1" />
                Profile
              </a>
            )}
            <button
              onClick={toggleLogin}
              className="ml-4 px-4 py-2 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 flex items-center"
            >
              {isLoggedIn ? (
                <>
                  <FiLogOut className="mr-1" />
                  Logout
                </>
              ) : (
                <>
                  <FiLogIn className="mr-1" />
                  Login
                </>
              )}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none"
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a
              href="#"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-100"
            >
              <div className="flex items-center">
                <FiUsers className="mr-2" />
                Teams
              </div>
            </a>
            <a
              href="#"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-100"
            >
              <div className="flex items-center">
                <FiBook className="mr-2" />
                Assignments
              </div>
            </a>
            {isLoggedIn && (
              <a
                href="#"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-100"
              >
                <div className="flex items-center">
                  <FiUser className="mr-2" />
                  Profile
                </div>
              </a>
            )}
            <button
              onClick={toggleLogin}
              className="w-full mt-2 px-3 py-2 rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <div className="flex items-center">
                {isLoggedIn ? (
                  <>
                    <FiLogOut className="mr-2" />
                    Logout
                  </>
                ) : (
                  <>
                    <FiLogIn className="mr-2" />
                    Login
                  </>
                )}
              </div>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
