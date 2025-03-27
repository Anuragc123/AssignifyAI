import { useEffect, useState } from "react";
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
} from "react-icons/fi";
import axios from "axios";
import { baseUrl } from "../backend-url";

export default function ProfilePage() {
  const [user, setUser] = useState({});

  useEffect(() => {
    const getUserDetails = async () => {
      const response = await axios.get(`${baseUrl}/user/getUserData`, {
        withCredentials: true,
      });
      console.log(response);
      setUser(response.data.user);
      setEditedUser(response.data.user);
    };
    getUserDetails();
  }, []);

  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({
      ...editedUser,
      [name]: value,
    });
  };

  const handleSave = () => {
    setUser(editedUser);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white shadow overflow-hidden rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Profile Information
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Personal details and preferences
                </p>
              </div>
              <button
                onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                className="px-4 py-2 flex items-center text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                {isEditing ? (
                  <>
                    <FiSave className="mr-2" />
                    Save
                  </>
                ) : (
                  <>
                    <FiEdit className="mr-2" />
                    Edit
                  </>
                )}
              </button>
            </div>
            <div className="border-t border-gray-200">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 flex flex-col items-center mb-6 md:mb-0">
                    <img
                      src={user.profilePhoto || "/avatar.jpeg"}
                      alt={user.name}
                      className="h-32 w-32 rounded-full object-cover"
                    />
                    {isEditing && (
                      <button className="mt-4 px-3 py-1 text-sm text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-50">
                        Change Photo
                      </button>
                    )}
                  </div>
                  <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <FiUser className="mr-2" />
                        Full Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="name"
                          value={editedUser.name}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">
                          {user.name}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <FiMail className="mr-2" />
                        Email
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          name="email"
                          value={editedUser.email}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">
                          {user.email}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <FiPhone className="mr-2" />
                        Phone
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="phone"
                          value={editedUser.contactNo}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">
                          {user.contactNo}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <FiMapPin className="mr-2" />
                        Institution
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="institution"
                          value={editedUser.instituteName}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">
                          {user.instituteName}
                        </p>
                      )}
                    </div>
                    {/* <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Department
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="department"
                          value={editedUser.department}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">
                          {user.department}
                        </p>
                      )}
                    </div> */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="role"
                          value={editedUser.role}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">
                          {user.role}
                        </p>
                      )}
                    </div>
                    {/* <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bio
                      </label>
                      {isEditing ? (
                        <textarea
                          name="bio"
                          rows={3}
                          value={editedUser.bio}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">{user.bio}</p>
                      )}
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4 flex items-center">
                <FiLock className="mr-2" />
                Security
              </h3>
              <div className="space-y-4">
                <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Change Password
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 ml-4">
                  Two-Factor Authentication
                </button>
              </div>
            </div> */}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
