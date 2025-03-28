"use client";

import { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiEdit,
  FiSave,
  FiLock,
  FiCamera,
  FiBriefcase,
  FiX,
  FiLoader,
  FiAlertCircle,
} from "react-icons/fi";
import axios from "axios";
import { baseUrl } from "../backend-url";

export default function ProfilePage() {
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseUrl}/user/getUserData`, {
          withCredentials: true,
        });
        setUser(response.data.user);
        setEditedUser(response.data.user);
        setError(null);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load profile data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    getUserDetails();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({
      ...editedUser,
      [name]: value,
    });
  };

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        setPhotoPreview(e.target.result);
        // In a real implementation, you would handle the file upload here
        // and update the editedUser state with the new photo
      };

      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      const response = await axios.post(`${baseUrl}/user/update`, editedUser, {
        withCredentials: true,
      })

      setUser(editedUser);
      setIsEditing(false);
      setPhotoPreview(null);
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
    setPhotoPreview(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow bg-gray-50 flex items-center justify-center">
          <div className="text-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your profile...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow bg-gray-50 flex items-center justify-center">
          <div className="text-center p-8 max-w-md">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <FiAlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-red-700 mb-2">
                Error Loading Profile
              </h2>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your personal information and account settings
            </p>
          </div>

          {/* Profile card */}
          <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-100">
            {/* Header with actions */}
            <div className="px-6 py-5 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Profile Information
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Your personal details visible to others
                </p>
              </div>
              <div className="flex space-x-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 flex items-center text-sm font-medium rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                      disabled={saving}
                    >
                      <FiX className="mr-2" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 flex items-center text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <FiLoader className="mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <FiSave className="mr-2" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 flex items-center text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                  >
                    <FiEdit className="mr-2" />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>

            {/* Profile content */}
            <div className="p-6">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Profile photo section */}
                <div className="lg:w-1/3 flex flex-col items-center">
                  <div className="relative group">
                    <div className="h-40 w-40 rounded-full overflow-hidden border-4 border-white shadow-md">
                      <img
                        src={
                          photoPreview || user.profilePhoto || "/avatar.jpeg"
                        }
                        alt={user.name || "Profile"}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {isEditing && (
                      <div
                        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full cursor-pointer"
                        onClick={() => fileInputRef.current.click()}
                      >
                        <FiCamera className="h-8 w-8 text-white" />
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handlePhotoChange}
                          accept="image/*"
                          className="hidden"
                        />
                      </div>
                    )}
                  </div>

                  <div className="mt-4 text-center">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {user.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 capitalize">
                        {user.role}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Profile details section */}
                <div className="lg:w-2/3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div className="space-y-2">
                      <label className="flex items-center text-sm font-medium text-gray-700">
                        <FiUser className="mr-2 text-indigo-500" />
                        Full Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="name"
                          value={editedUser.name || ""}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                          placeholder="Enter your full name"
                        />
                      ) : (
                        <div className="px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-gray-900">
                            {user.name || "Not provided"}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label className="flex items-center text-sm font-medium text-gray-700">
                        <FiMail className="mr-2 text-indigo-500" />
                        Email Address
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          name="email"
                          value={editedUser.email || ""}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                          placeholder="Enter your email"
                        />
                      ) : (
                        <div className="px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-gray-900">
                            {user.email || "Not provided"}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <label className="flex items-center text-sm font-medium text-gray-700">
                        <FiPhone className="mr-2 text-indigo-500" />
                        Phone Number
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="contactNo"
                          value={editedUser.contactNo || ""}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                          placeholder="Enter your phone number"
                        />
                      ) : (
                        <div className="px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-gray-900">
                            {user.contactNo || "Not provided"}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Institution */}
                    <div className="space-y-2">
                      <label className="flex items-center text-sm font-medium text-gray-700">
                        <FiMapPin className="mr-2 text-indigo-500" />
                        Institution
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="instituteName"
                          value={editedUser.instituteName || ""}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                          placeholder="Enter your institution"
                        />
                      ) : (
                        <div className="px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-gray-900">
                            {user.instituteName || "Not provided"}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Role */}
                    <div className="space-y-2">
                      <label className="flex items-center text-sm font-medium text-gray-700">
                        <FiBriefcase className="mr-2 text-indigo-500" />
                        Role
                      </label>
                      {isEditing ? (
                        <select
                          name="role"
                          value={editedUser.role || ""}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                        >
                          <option value="student">Student</option>
                          <option value="teacher">Teacher</option>
                          <option value="admin">Administrator</option>
                        </select>
                      ) : (
                        <div className="px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-gray-900 capitalize">
                            {user.role || "Not provided"}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
