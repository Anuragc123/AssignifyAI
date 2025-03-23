import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FiMenu,
  FiX,
  FiUser,
  FiLogIn,
  FiLogOut,
  FiBook,
  FiUsers,
} from "react-icons/fi";
import axios from "axios";
import { logout } from "../store/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { baseUrl } from "../backend-url";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const isLoggedIn = useSelector((state) => state.auth.status);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleLogin = async () => {
    if (isLoggedIn) {
      // setIsLoggedIn(false);
      const response = await axios.get(`${baseUrl}/user/logout`, {
        withCredentials: true,
      });
      console.log(response);
      dispatch(logout());
      navigate("/");
    } else {
      navigate("/login");
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <div className="h-8 w-8 bg-indigo-600 rounded-md flex items-center justify-center text-white font-bold text-xl">
                A
              </div>
              <span className="ml-2 text-xl font-bold text-gray-800">
                AssignifyAI
              </span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link
              to="/teams"
              className={`flex items-center ${
                isActive("/teams")
                  ? "text-indigo-600"
                  : "text-gray-600 hover:text-indigo-600"
              }`}
            >
              <FiUsers className="mr-1" />
              Teams
            </Link>
            <Link
              to="/assignments"
              className={`flex items-center ${
                isActive("/assignments")
                  ? "text-indigo-600"
                  : "text-gray-600 hover:text-indigo-600"
              }`}
            >
              <FiBook className="mr-1" />
              Assignments
            </Link>
            {isLoggedIn && (
              <Link
                to="/profile"
                className={`flex items-center ${
                  isActive("/profile")
                    ? "text-indigo-600"
                    : "text-gray-600 hover:text-indigo-600"
                }`}
              >
                <FiUser className="mr-1" />
                Profile
              </Link>
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
            <Link
              to="/teams"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center">
                <FiUsers className="mr-2" />
                Teams
              </div>
            </Link>
            <Link
              to="/assignments"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center">
                <FiBook className="mr-2" />
                Assignments
              </div>
            </Link>
            {isLoggedIn && (
              <Link
                to="/profile"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center">
                  <FiUser className="mr-2" />
                  Profile
                </div>
              </Link>
            )}
            <button
              onClick={() => {
                toggleLogin();
                setIsMenuOpen(false);
              }}
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
